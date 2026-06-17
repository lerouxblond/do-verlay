import type { CSSProperties } from 'react';
import { colors, fonts, radii } from '@shared/theme/tokens';

export const pageStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  color: colors.text,
  backgroundColor: colors.bg,
  // Losanges harlequin (rappel de l'identité « chapiteau »).
  backgroundImage:
    'linear-gradient(45deg, #15101b 25%, transparent 25% 75%, #15101b 75%), linear-gradient(45deg, #15101b 25%, transparent 25% 75%, #15101b 75%)',
  backgroundSize: '84px 84px',
  backgroundPosition: '0 0, 42px 42px',
};

export const wrapStyle: CSSProperties = {
  textAlign: 'center',
  padding: 40,
  maxWidth: 720,
};

export const eyebrowStyle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '3px',
  fontSize: 13,
  fontWeight: 700,
  color: colors.accent,
};

export const titleStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 900,
  fontSize: 52,
  margin: '10px 0 6px',
  color: colors.accentBright,
  textShadow: '0 2px 0 #5a1418, 0 0 24px rgba(212,168,67,0.35)',
};

export const leadStyle: CSSProperties = {
  color: 'rgba(240,232,224,0.7)',
  fontSize: 16,
  lineHeight: 1.6,
  margin: '0 auto 34px',
  maxWidth: 540,
};

export const linksStyle: CSSProperties = {
  display: 'flex',
  gap: 18,
  justifyContent: 'center',
  flexWrap: 'wrap',
};

const linkBase: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  fontWeight: 800,
  fontSize: 15,
  padding: '16px 30px',
  borderRadius: radii.lg,
};

export const primaryLink: CSSProperties = {
  ...linkBase,
  color: '#16100e',
  background: 'linear-gradient(180deg,#e8c877,#d4a843)',
  boxShadow: '0 6px 0 #7a5512, 0 10px 20px rgba(0,0,0,0.4)',
};

export const ghostLink: CSSProperties = {
  ...linkBase,
  color: colors.text,
  background: 'rgba(240,232,224,0.05)',
  border: '1.5px solid rgba(212,168,67,0.5)',
};

export const footStyle: CSSProperties = {
  marginTop: 40,
  fontSize: 12,
  color: 'rgba(240,232,224,0.4)',
};
