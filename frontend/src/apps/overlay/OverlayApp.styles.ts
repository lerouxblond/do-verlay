import type { CSSProperties } from 'react';
import { colors, fonts, radii } from '@shared/theme/tokens';
import type { AnchorZone } from '@shared/types';

/** Conteneur plein écran transparent : la « scène » des modules. */
export const stageStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'transparent',
  overflow: 'hidden',
  pointerEvents: 'none',
};

const MARGIN = 40;

export type Phase = 'in' | 'out';

/** Ancre un module à une zone d'écran (coin / bas-centre) + animation d'entrée/sortie. */
export const anchorStyle = (zone: AnchorZone, phase: Phase = 'in'): CSSProperties => {
  const animation =
    phase === 'out'
      ? 'dv-module-out 0.4s ease forwards'
      : 'dv-module-in 0.45s cubic-bezier(0.2,0.8,0.25,1) both';
  const base: CSSProperties = { position: 'absolute', animation };
  switch (zone) {
    case 'HG':
      return { ...base, top: MARGIN, left: MARGIN };
    case 'HD':
      return { ...base, top: MARGIN, right: MARGIN };
    case 'BG':
      return { ...base, bottom: MARGIN, left: MARGIN };
    case 'BD':
      return { ...base, bottom: MARGIN, right: MARGIN };
    case 'BAS':
      return { ...base, bottom: MARGIN, left: '50%', transform: 'translateX(-50%)' };
  }
};

/** Témoin de synchro posé en bas à gauche (provisoire — retiré quand les modules arrivent). */
export const hudStyle: CSSProperties = {
  position: 'fixed',
  left: 18,
  bottom: 18,
  display: 'flex',
  alignItems: 'center',
  gap: 11,
  padding: '10px 14px',
  borderRadius: radii.pill,
  background: 'rgba(13,10,14,0.78)',
  border: `1px solid ${colors.border}`,
  boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
  color: colors.text,
  fontFamily: fonts.body,
};

export const dotStyle: CSSProperties = {
  width: 9,
  height: 9,
  borderRadius: '50%',
  background: colors.success,
  boxShadow: `0 0 8px ${colors.success}`,
  animation: 'dv-shimmer 1.8s ease-in-out infinite',
  flex: 'none',
};

export const labelStyle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  fontSize: 11,
  fontWeight: 700,
  color: colors.successText,
};

export const profileStyle: CSSProperties = {
  fontFamily: fonts.title,
  fontSize: 14,
  fontWeight: 600,
  color: colors.text,
};

export const metaStyle: CSSProperties = {
  fontFamily: fonts.mono,
  fontSize: 11,
  color: colors.textMuted,
};

export const sepStyle: CSSProperties = {
  width: 1,
  height: 18,
  background: colors.border,
};
