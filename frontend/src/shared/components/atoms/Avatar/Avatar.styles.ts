import type { CSSProperties } from 'react';

const FADE = '#160A0C';

export const ringStyle = (size: number, ring: string): CSSProperties => ({
  position: 'relative',
  width: size,
  height: size,
  borderRadius: '50%',
  overflow: 'hidden',
  border: `2px solid ${ring}`,
  background: `radial-gradient(circle at 50% 36%, #C9363A, ${FADE})`,
  boxShadow: 'inset 0 0 12px rgba(0,0,0,0.5)',
  flex: 'none',
});

export const portraitStyle = (size: number): CSSProperties => ({
  position: 'absolute',
  left: '50%',
  bottom: -2,
  transform: 'translateX(-50%)',
  width: size * 0.94,
  height: size * 0.94,
  objectFit: 'contain',
  objectPosition: 'bottom',
});

/** Dégradé bas qui fond le raccord plat de l'asset de classe. */
export const fadeStyle: CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: '36%',
  background: `linear-gradient(180deg, transparent, ${FADE})`,
};
