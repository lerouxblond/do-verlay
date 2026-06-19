import type { CSSProperties } from 'react';

export const crestStyle = (size: number): CSSProperties => ({
  position: 'relative',
  flex: 'none',
  width: size,
  height: size,
  isolation: 'isolate', // contient le mix-blend-mode du contour
  filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.55))',
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

/** Remplissage coloré du fond (forme de l'écusson). */
export const fondStyle = (url: string, color: string): CSSProperties => ({
  position: 'absolute',
  inset: 0,
  ...mask(url),
  backgroundColor: color,
});

/** Contour (asset séparé) dessiné tel quel par-dessus le fond — non teinté par la couleur du fond. */
export const contourStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'contain',
};

/** Symbole coloré, centré dans l'écusson. */
export const symbolStyle = (url: string, color: string): CSSProperties => ({
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%,-50%)',
  width: '56%',
  height: '56%',
  ...mask(url),
  backgroundColor: color,
});
