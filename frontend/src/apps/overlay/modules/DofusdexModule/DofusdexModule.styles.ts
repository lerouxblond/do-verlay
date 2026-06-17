import type { CSSProperties } from 'react';
import { colors, fonts } from '@shared/theme/tokens';

/** Dégage l'angle « enseigne » posé en haut à gauche du cadre. */
const INDENT = 18;

export const headStyle: CSSProperties = {
  marginBottom: 12,
  paddingLeft: INDENT,
};

export const kickerStyle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  fontSize: 10,
  fontWeight: 700,
  color: colors.accent,
};

export const titleStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 900,
  fontSize: 20,
  lineHeight: 1.1,
  color: colors.accentBright,
  textShadow: '0 2px 0 #5a1418',
  margin: '2px 0 0',
};

export const progRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 9,
  margin: '0 0 12px',
};

export const countStyle: CSSProperties = {
  fontFamily: fonts.mono,
  fontSize: 12,
  fontWeight: 600,
  color: colors.text,
  whiteSpace: 'nowrap',
};

export const gridStyle = (cols: number): CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${cols}, 1fr)`,
  gap: 8,
});

export const emptyStyle: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 13,
  color: colors.textMuted,
  textAlign: 'center',
  padding: '14px 0',
};

/* --- Format horizontal (bannière paysage) --- */
export const rowLayoutStyle: CSSProperties = {
  display: 'flex',
  gap: 16,
  alignItems: 'flex-start',
};

export const leftColStyle: CSSProperties = {
  width: 176,
  flex: 'none',
};

export const rightColStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
};

export const progStackStyle: CSSProperties = {
  paddingLeft: INDENT,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};
