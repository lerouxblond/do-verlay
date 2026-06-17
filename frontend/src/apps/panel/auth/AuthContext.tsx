/**
 * Authentification — PLACEHOLDER en vue du backend différé (Go + OAuth Twitch).
 *
 * Aucune vérification réelle pour l'instant : la session est toujours « authentifiée »
 * en local. L'intérêt est structurel — figer dès maintenant le point d'accroche
 * (provider + hook + garde de route) pour que brancher le vrai backend plus tard ne
 * touche QUE ce dossier, pas le routage ni les vues.
 */
import { createContext, useContext, useMemo, type ReactNode } from 'react';

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

export interface AuthSession {
  status: AuthStatus;
  /** Pseudo Twitch une fois l'OAuth branché (null tant que local). */
  twitch: string | null;
}

interface AuthValue extends AuthSession {
  /** Réservé : déclenchera l'OAuth Twitch via le backend. */
  signIn: () => void;
  signOut: () => void;
}

const AuthCtx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useMemo<AuthValue>(
    () => ({
      // TODO(backend) : remplacer par l'état réel de session (token + /v1/moi).
      status: 'authenticated',
      twitch: null,
      signIn: () => {
        /* TODO(backend) : redirection OAuth Twitch */
      },
      signOut: () => {
        /* TODO(backend) : révocation de session */
      },
    }),
    [],
  );
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>');
  return ctx;
}
