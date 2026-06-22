/** Utilitaires PKCE (Proof Key for Code Exchange) pour l'OAuth Twitch côté navigateur. */

const STORAGE_KEY = 'do-verlay:pkce';

interface PKCEData {
  verifier: string;
  state: string;
}

/** Génère un code_verifier aléatoire URL-safe (RFC 7636). */
function randomVerifier(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return btoa(String.fromCharCode(...arr))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/** Calcule le code_challenge = BASE64URL(SHA-256(verifier)). */
async function codeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/** Génère et persiste un couple (verifier, state) pour le flow en cours. */
export async function initPKCE(): Promise<{ challenge: string; state: string }> {
  const verifier = randomVerifier();
  const state = randomVerifier(); // réutilise le générateur pour le state CSRF
  const challenge = await codeChallenge(verifier);
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ verifier, state } satisfies PKCEData));
  return { challenge, state };
}

/** Récupère les données PKCE persistées (null si la session a expiré ou n'existe pas). */
export function consumePKCE(): PKCEData | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(STORAGE_KEY);
    return JSON.parse(raw) as PKCEData;
  } catch {
    return null;
  }
}
