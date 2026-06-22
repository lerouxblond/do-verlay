/**
 * Authentification Twitch OAuth 2.0 PKCE pour le panel.
 *
 * Comportement :
 * - Si VITE_TWITCH_CLIENT_ID n'est pas configuré → mode local (toujours authentifié, comme avant).
 * - Sinon : OAuth PKCE complet. L'échange de code est proxié par le serveur Go (/api/auth/token)
 *   pour contourner les restrictions CORS de Twitch sur l'endpoint de token.
 *
 * Flux :
 *   signIn() → initPKCE() → redirect vers Twitch → callback (?code=) → /api/auth/token
 *   → GET /helix/users → session stockée en localStorage.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { consumePKCE, initPKCE } from './pkce';

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

export interface AuthSession {
  status: AuthStatus;
  /** Login Twitch une fois authentifié, null sinon. */
  twitch: string | null;
}

interface AuthValue extends AuthSession {
  signIn: () => void;
  signOut: () => void;
}

const CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID ?? '';
const AUTH_ENABLED = CLIENT_ID !== '';
const SCOPES = 'user:read:email chat:read';
const SESSION_KEY = 'do-verlay:auth';
const TWITCH_AUTH_URL = 'https://id.twitch.tv/oauth2/authorize';
const TWITCH_USERS_URL = 'https://api.twitch.tv/helix/users';

interface StoredSession {
  login: string;
  token: string;
  expiresAt: number;
}

function loadSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as StoredSession;
    if (Date.now() >= s.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

function saveSession(s: StoredSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/** Échange un code d'autorisation contre un token via le proxy Go (évite les CORS Twitch). */
async function exchangeCode(
  code: string,
  codeVerifier: string,
  redirectUri: string,
): Promise<{ accessToken: string; expiresIn: number }> {
  const res = await fetch('/api/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, code_verifier: codeVerifier, redirect_uri: redirectUri }),
  });
  if (!res.ok) throw new Error(`token exchange ${res.status}`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  return { accessToken: data.access_token, expiresIn: data.expires_in };
}

/** Récupère le login Twitch de l'utilisateur authentifié. */
async function fetchLogin(token: string): Promise<string> {
  const res = await fetch(TWITCH_USERS_URL, {
    headers: { Authorization: `Bearer ${token}`, 'Client-Id': CLIENT_ID },
  });
  if (!res.ok) throw new Error(`helix/users ${res.status}`);
  const data = (await res.json()) as { data: Array<{ login: string }> };
  const login = data.data[0]?.login;
  if (!login) throw new Error('login introuvable');
  return login;
}

const AuthCtx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  // Initialisation : vérifie session existante ou callback OAuth.
  useEffect(() => {
    if (!AUTH_ENABLED) {
      setStatus('authenticated');
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const returnedState = params.get('state');

    if (code && returnedState) {
      // Callback OAuth — nettoie l'URL immédiatement pour ne pas ré-entrer dans le flux.
      window.history.replaceState({}, '', window.location.pathname);

      const pkce = consumePKCE();
      if (!pkce || pkce.state !== returnedState) {
        console.warn('PKCE state mismatch — possible CSRF');
        setStatus('unauthenticated');
        return;
      }

      const redirectUri = window.location.origin;
      exchangeCode(code, pkce.verifier, redirectUri)
        .then(({ accessToken, expiresIn }) =>
          fetchLogin(accessToken).then((login) => {
            const stored: StoredSession = {
              login,
              token: accessToken,
              expiresAt: Date.now() + expiresIn * 1_000,
            };
            saveSession(stored);
            setSession(stored);
            setStatus('authenticated');
          }),
        )
        .catch((err) => {
          console.error('Auth callback error:', err);
          setStatus('unauthenticated');
        });
      return;
    }

    // Pas de callback — vérifie une session existante.
    const existing = loadSession();
    if (existing) {
      setSession(existing);
      setStatus('authenticated');
    } else {
      setStatus('unauthenticated');
    }
  }, []);

  const signIn = useCallback(async () => {
    if (!AUTH_ENABLED) return;
    try {
      const { challenge, state } = await initPKCE();
      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: window.location.origin,
        response_type: 'code',
        scope: SCOPES,
        code_challenge: challenge,
        code_challenge_method: 'S256',
        state,
      });
      window.location.href = `${TWITCH_AUTH_URL}?${params}`;
    } catch (err) {
      console.error('signIn error:', err);
    }
  }, []);

  const signOut = useCallback(() => {
    if (!AUTH_ENABLED) return;
    // Révocation du token côté serveur (best-effort, sans bloquer l'UI).
    const token = session?.token;
    if (token) {
      fetch('/api/auth/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      }).catch(() => {});
    }
    clearSession();
    setSession(null);
    setStatus('unauthenticated');
  }, [session]);

  const value: AuthValue = {
    status,
    twitch: session?.login ?? null,
    signIn,
    signOut,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>');
  return ctx;
}
