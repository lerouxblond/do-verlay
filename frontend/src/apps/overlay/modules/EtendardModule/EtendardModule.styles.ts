import type { CSSProperties } from 'react';
import { colors, fonts } from '@shared/theme/tokens';

/** Dégage l'angle « enseigne » en haut à gauche du cadre. */
export const crestStyle: CSSProperties = {
  paddingLeft: 18,
  paddingTop: 2,
};

export const condLabelStyle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  fontSize: 9,
  fontWeight: 700,
  color: colors.accent,
  margin: '12px 0 6px',
};

export const tagsStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
};
