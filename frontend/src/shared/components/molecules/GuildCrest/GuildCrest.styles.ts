import type { CSSProperties } from 'react';

export const crestStyle = (size: number): CSSProperties => ({
  position: 'relative',
  flex: 'none',
  width: size,
  height: size,
  filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.55))',
});

/** Fond d'écusson (arrière-plan coloré, forme du blason). */
export const backStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'contain',
};

/** Symbole d'emblème (avant-plan), légèrement réduit et centré. */
export const upStyle: CSSProperties = {
  position: 'absolute',
  left: '50%',
  top: '46%',
  transform: 'translate(-50%,-50%)',
  width: '62%',
  height: '62%',
  objectFit: 'contain',
};
