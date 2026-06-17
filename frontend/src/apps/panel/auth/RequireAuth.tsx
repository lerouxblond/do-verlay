/**
 * Garde de route — laisse passer si la session est authentifiée, sinon affiche
 * l'écran de connexion. Placeholder : `useAuth` renvoie toujours « authenticated »
 * en local, donc le garde est transparent pour l'instant (la branche non-authentifiée
 * existe et sera empruntée quand le backend Twitch sera branché).
 */
import { Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { SignInScreen } from './SignInScreen';

export function RequireAuth() {
  const { status } = useAuth();
  if (status === 'authenticated') return <Outlet />;
  return <SignInScreen loading={status === 'loading'} />;
}
