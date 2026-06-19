import type { CSSProperties } from 'react';
import { colors, fonts, lattice, radii } from '@shared/theme/tokens';

/** Scène d'aperçu du blason (fond velours + treillis harlequin). */
export const previewStage: CSSProperties = {
  display: 'grid',
  placeItems: 'center',
  padding: 20,
  borderRadius: radii.lg,
  backgroundColor: colors.bg,
  backgroundImage: lattice(),
  border: `1px solid ${colors.border}`,
  overflowX: 'auto',
};

export const colorsRow: CSSProperties = { display: 'flex', gap: 22, flexWrap: 'wrap' };

export const subLabelStyle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontSize: 12,
  fontWeight: 700,
  color: colors.accent,
  marginBottom: 8,
};

export const gridScroll: CSSProperties = {
  maxHeight: 210,
  overflowY: 'auto',
  paddingRight: 6,
};

export const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))',
  gap: 8,
};

export const swatchStyle = (selected: boolean): CSSProperties => ({
  position: 'relative',
  width: '100%',
  aspectRatio: '1',
  padding: 5,
  borderRadius: radii.md,
  border: `1px solid ${selected ? colors.accent : colors.border}`,
  background: selected ? 'rgba(212,168,67,0.16)' : colors.bg,
  cursor: 'pointer',
});

/** Props de masque communes (la forme de l'asset découpe une couche colorée). */
const mask = (url: string): CSSProperties => ({
  WebkitMaskImage: `url(${url})`,
  maskImage: `url(${url})`,
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
});

/** Vignette de symbole : forme teintée centrée. */
export const symbolMaskStyle = (url: string, color: string): CSSProperties => ({
  width: '100%',
  height: '100%',
  ...mask(url),
  backgroundColor: color,
});

/** Conteneur d'une vignette de forme (fond + contour superposés). */
export const formeThumb: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  isolation: 'isolate',
};

/** Remplissage coloré de la forme de fond dans une vignette. */
export const formeFond = (url: string, color: string): CSSProperties => ({
  position: 'absolute',
  inset: 0,
  ...mask(url),
  backgroundColor: color,
});

/** Contour dessiné tel quel dans une vignette — non teinté par la couleur du fond. */
export const formeContour: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'contain',
};

export const catRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
  marginBottom: 10,
};

export const catChipStyle = (selected: boolean): CSSProperties => ({
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  fontSize: 11,
  fontWeight: 700,
  padding: '5px 10px',
  borderRadius: radii.pill,
  border: `1px solid ${selected ? colors.accent : colors.border}`,
  background: selected ? 'rgba(212,168,67,0.18)' : colors.bg,
  color: selected ? colors.accent : colors.textMuted,
  cursor: 'pointer',
});

export const voirPlusRow: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: 10,
};
