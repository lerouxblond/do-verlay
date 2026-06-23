/**
 * Écran de connexion — placeholder, inatteignable tant que la session est forcée à
 * « authenticated ». Présent pour que la branche non-authentifiée du garde soit réelle.
 */
import type { CSSProperties } from 'react';
import { Button } from '@shared/components/atoms/Button/Button';
import { colors, fonts, lattice, radii } from '@shared/theme/tokens';
import { useAuth } from './AuthContext';

const wrapStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  backgroundColor: colors.bg,
  backgroundImage: lattice(),
  color: colors.text,
};

const cardStyle: CSSProperties = {
  width: 380,
  maxWidth: '90vw',
  textAlign: 'center',
  padding: 36,
  background: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: radii.card,
  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
};

const titleStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 900,
  fontSize: 28,
  color: colors.accentBright,
  margin: '0 0 8px',
};

const textStyle: CSSProperties = {
  fontSize: 14,
  color: colors.textMuted,
  lineHeight: 1.6,
  margin: '0 0 22px',
};

export function SignInScreen({ loading }: { loading?: boolean }) {
  const { signIn } = useAuth();
  return (
    <div style={wrapStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Do-verlay</h1>
        <p style={textStyle}>
          {loading ? 'Connexion en cours…' : 'Connecte-toi avec Twitch pour piloter ton overlay.'}
        </p>
        <Button variant="primary" onClick={signIn} disabled={loading}>
          Se connecter avec Twitch
        </Button>
      </div>
    </div>
  );
}
