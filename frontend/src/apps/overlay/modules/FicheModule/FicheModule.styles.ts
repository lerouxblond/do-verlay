import type { CSSProperties } from 'react';
import { colors, fonts } from '@shared/theme/tokens';

/** Rangée buste + bloc texte ; le padding dégage l'angle « enseigne » du cadre. */
export const headerStyle: CSSProperties = {
  display: 'flex',
  gap: 13,
  alignItems: 'center',
  paddingLeft: 18,
  paddingTop: 2,
};

export const textColStyle: CSSProperties = { minWidth: 0 };

export const kickerStyle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  fontSize: 9,
  color: colors.accent,
  fontWeight: 700,
};

export const nameStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 700,
  fontSize: 17,
  color: colors.text,
  lineHeight: 1.05,
  marginTop: 1,
};

export const classLineStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  marginTop: 5,
};

export const classIconStyle: CSSProperties = {
  width: 18,
  height: 18,
  objectFit: 'contain',
};

export const classLabelStyle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  fontSize: 10,
  color: colors.accentBright,
  fontWeight: 700,
};

export const metaRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginTop: 7,
};

export const metaStyle: CSSProperties = {
  fontFamily: fonts.mono,
  fontSize: 12,
  color: colors.textMuted,
  fontWeight: 600,
  whiteSpace: 'nowrap',
};

export const sepDotStyle: CSSProperties = {
  width: 3,
  height: 3,
  borderRadius: '50%',
  background: colors.textMuted,
  opacity: 0.6,
  flex: 'none',
};

/** Repli quand aucune classe n'est choisie : médaillon neutre portant l'enseigne pique. */
export const placeholderRingStyle = (size: number): CSSProperties => ({
  width: size,
  height: size,
  borderRadius: '50%',
  border: `2px dashed ${colors.border}`,
  display: 'grid',
  placeItems: 'center',
  color: colors.textFaint,
  fontSize: size * 0.4,
  flex: 'none',
});
