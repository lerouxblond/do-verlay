import type { CSSProperties } from 'react';
import { colors, fonts } from '@shared/theme/tokens';
import type { GenericSize } from '@shared/types';

/** Largeur de carte + corps du message selon la taille choisie (S/M/L). */
export const SIZE_PRESET: Record<GenericSize, { width: number; font: number }> = {
  S: { width: 264, font: 15 },
  M: { width: 300, font: 19 },
  L: { width: 360, font: 24 },
};

export const rowStyle: CSSProperties = {
  display: 'flex',
  gap: 13,
  alignItems: 'center',
  paddingLeft: 18, // dégage l'angle enseigne
  paddingTop: 2,
};

export const iconStyle: CSSProperties = {
  width: 46,
  height: 46,
  objectFit: 'contain',
  flex: 'none',
  filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.55))',
};

export const textColStyle: CSSProperties = { minWidth: 0 };

export const kickerStyle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  fontSize: 9,
  color: colors.accent,
  fontWeight: 700,
  marginBottom: 3,
};

export const contenuStyle = (size: GenericSize): CSSProperties => ({
  fontFamily: fonts.title,
  fontWeight: 600,
  fontSize: SIZE_PRESET[size].font,
  lineHeight: 1.18,
  color: colors.text,
  // Borne le message à 3 lignes (+ ellipsis) pour garder une carte prévisible.
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  overflowWrap: 'anywhere',
});

/** Message vide (aperçu) : repli en italique estompé, même gabarit que le message réel. */
export const placeholderContenuStyle = (size: GenericSize): CSSProperties => ({
  ...contenuStyle(size),
  color: colors.textFaint,
  fontStyle: 'italic',
});
