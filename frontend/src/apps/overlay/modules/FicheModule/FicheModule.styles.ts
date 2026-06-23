import type { CSSProperties } from 'react';
import { colors, fonts } from '@shared/theme/tokens';

/** Rangée d'en-tête buste + identité ; le padding dégage l'angle « enseigne » du cadre. */
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
  fontSize: 18,
  color: colors.text,
  lineHeight: 1.1,
  marginTop: 1,
  // Nom sur une ligne (les pseudos sont courts) — ellipsis si exceptionnellement long.
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
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
  flex: 'none',
};

export const classLabelStyle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  fontSize: 10,
  color: colors.accentBright,
  fontWeight: 700,
};

/** Glyphe ♀/♂ discret, posé après la classe. */
export const genderGlyphStyle: CSSProperties = {
  fontSize: 12,
  lineHeight: 1,
  fontWeight: 700,
  color: colors.textMuted,
};

/* --- Bandeau de stats : la « fiche » proprement dite (plaque incrustée) --- */
export const statBandStyle: CSSProperties = {
  display: 'flex',
  marginTop: 12,
  borderRadius: 10,
  background: 'rgba(13,10,14,0.55)',
  border: '1px solid rgba(212,168,67,0.28)',
  overflow: 'hidden',
};

export const statCellStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 3,
  padding: '8px 6px',
  minWidth: 0,
};

/** Filet doré séparant deux stats. */
export const statDividerStyle: CSSProperties = {
  width: 1,
  alignSelf: 'stretch',
  background: 'rgba(212,168,67,0.22)',
};

export const statLabelStyle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontSize: 8,
  fontWeight: 700,
  color: colors.accent,
};

export const statValueStyle: CSSProperties = {
  fontFamily: fonts.mono,
  fontSize: 13,
  fontWeight: 600,
  color: colors.text,
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
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
