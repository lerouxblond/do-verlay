import type { CSSProperties } from 'react';
import { colors, fonts, radii } from '@shared/theme/tokens';

/** Dimensions de la scène overlay de référence (= source navigateur OBS). */
export const SCENE_W = 1920;
export const SCENE_H = 1080;

/** Cadre 16:9 mesuré pour déduire l'échelle d'aperçu. */
export const frameStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  aspectRatio: `${SCENE_W} / ${SCENE_H}`,
  borderRadius: radii.md,
  border: `1px solid ${colors.border}`,
  background: '#07060a',
  overflow: 'hidden',
  userSelect: 'none',
  touchAction: 'none',
};

/** Scène 1920×1080 mise à l'échelle dans le cadre (origine haut-gauche). */
export const sceneStyle = (scale: number): CSSProperties => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: SCENE_W,
  height: SCENE_H,
  transform: `scale(${scale})`,
  transformOrigin: 'top left',
});

export const bgImageStyle = (opacity: number): CSSProperties => ({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  opacity,
  pointerEvents: 'none',
});

/** Quadrillage de tiers (repères de placement) — discret. */
export const gridStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  backgroundImage:
    'linear-gradient(rgba(212,168,67,0.10) 1px, transparent 1px),' +
    'linear-gradient(90deg, rgba(212,168,67,0.10) 1px, transparent 1px)',
  backgroundSize: `${100 / 3}% ${100 / 3}%`,
};

/** Ligne-guide d'alignement (affichée pendant l'aimantation). */
export const guideStyle = (axis: 'x' | 'y', pct: number): CSSProperties => ({
  position: 'absolute',
  background: colors.accentBright,
  boxShadow: `0 0 6px ${colors.accentBright}`,
  pointerEvents: 'none',
  ...(axis === 'x'
    ? { left: `${pct}%`, top: 0, bottom: 0, width: 2, transform: 'translateX(-1px)' }
    : { top: `${pct}%`, left: 0, right: 0, height: 2, transform: 'translateY(-1px)' }),
});

/** Conteneur déplaçable d'un module (calque de position). */
export const draggableStyle = (selected: boolean): CSSProperties => ({
  position: 'absolute',
  cursor: 'grab',
  pointerEvents: 'auto',
  outline: selected ? `3px solid ${colors.accentBright}` : '2px dashed rgba(154,138,132,0.45)',
  outlineOffset: 6,
  borderRadius: radii.md,
});

/** Le module lui-même : non interactif (le drag est géré par le parent). */
export const moduleHostStyle: CSSProperties = {
  pointerEvents: 'none',
};

/** Étiquette de module affichée au survol/sélection dans l'éditeur. */
export const tagStyle: CSSProperties = {
  position: 'absolute',
  top: -26,
  left: 0,
  fontSize: 12,
  fontWeight: 700,
  color: colors.onAccent,
  background: colors.accentBright,
  borderRadius: radii.pill,
  padding: '2px 10px',
  whiteSpace: 'nowrap',
};

/** Disposition en deux colonnes : aperçu (extensible) + panneau de réglages (largeur fixe). */
export const editorGridStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 18,
  alignItems: 'flex-start',
};

export const canvasColStyle: CSSProperties = {
  flex: '1 1 520px',
  minWidth: 0,
};

export const asideStyle: CSSProperties = {
  flex: '0 0 250px',
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  padding: 14,
  borderRadius: radii.md,
  border: `1px solid ${colors.border}`,
  background: colors.bg,
};

export const asideTitleStyle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontSize: 11,
  fontWeight: 700,
  color: colors.textMuted,
};

/** Grille 3×3 du sélecteur d'ancrage. */
export const anchorGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 4,
  width: 96,
};

export const anchorCellStyle = (active: boolean): CSSProperties => ({
  width: '100%',
  aspectRatio: '1',
  borderRadius: 6,
  border: `1px solid ${active ? colors.accentBright : colors.border}`,
  background: active ? colors.accentBright : 'transparent',
  cursor: 'pointer',
  display: 'grid',
  placeItems: 'center',
  padding: 0,
});

export const anchorDotStyle = (active: boolean): CSSProperties => ({
  width: 7,
  height: 7,
  borderRadius: '50%',
  background: active ? colors.onAccent : colors.textMuted,
});

export const hintTextStyle: CSSProperties = {
  fontSize: 13,
  color: colors.textMuted,
  marginTop: 10,
};
