import type { CSSProperties } from 'react';
import type { DofusState } from '../../../types';

/** Traitement visuel de la base selon l'état (cf. design system §06 / proto 06). */
export function baseFilter(state: DofusState): { filter: string; opacity: number } {
  if (state === 'complete') return { filter: 'none', opacity: 1 };
  // En cours : silhouette plus claire et un brin colorée → se distingue nettement du « à faire ».
  if (state === 'on_going') return { filter: 'grayscale(0.8) brightness(0.5)', opacity: 0.7 };
  return { filter: 'grayscale(1) brightness(0.42)', opacity: 0.5 };
}

export function rootStyle(size: number): CSSProperties {
  return { position: 'relative', width: size, height: size, display: 'grid', placeItems: 'center' };
}

export function imageLayer(url: string, state: DofusState): CSSProperties {
  const { filter, opacity } = baseFilter(state);
  return {
    position: 'relative',
    width: '92%',
    height: '92%',
    background: `center/contain no-repeat url('${url}')`,
    filter,
    opacity,
    // « Obtenu » : liseré doré STATIQUE (un seul paint). La pulsation passe par l'opacité du socle
    // (`.dv-dofus-glow`, compositée) — plus de `filter` animé par frame sur chaque case.
    ...(state === 'complete' ? { filter: 'drop-shadow(0 0 5px rgba(232,200,119,0.5))' } : {}),
  };
}

/** Portion révélée (œuf qui « monte » du bas) pour l'état en cours — bord net à 50 %. */
export function fillLayer(url: string): CSSProperties {
  const mask = 'linear-gradient(to top,#000 0 50%,rgba(0,0,0,0.5) 58%,transparent 66%)';
  return {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)',
    width: '92%',
    height: '92%',
    background: `center/contain no-repeat url('${url}')`,
    WebkitMaskImage: mask,
    maskImage: mask,
    filter: 'saturate(1.12) drop-shadow(0 0 4px rgba(212,168,67,0.5))',
  };
}

/** Ligne de niveau dorée — alignée sur le bord supérieur du remplissage (top 50 %). */
export const levelLine: CSSProperties = {
  position: 'absolute',
  left: '16%',
  right: '16%',
  top: '50%',
  height: 2,
  background: 'linear-gradient(90deg,transparent,#E8C877,transparent)',
  boxShadow: '0 0 5px rgba(232,200,119,0.7)',
};

const shapeMask = (url: string): CSSProperties => ({
  WebkitMaskImage: `url('${url}')`,
  maskImage: `url('${url}')`,
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
});

/**
 * Calque « vague de complétion » (état en cours) : confiné à la silhouette du Dofus (masque) et
 * découpé à ses bords (overflow), pour qu'une bande lumineuse puisse le traverser de bas en haut.
 * Animée par la classe `.dv-dofus-wave` (fonts.css) — transform/opacity seulement (composité GPU).
 */
export function waveLayer(url: string): CSSProperties {
  return {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)',
    width: '92%',
    height: '92%',
    overflow: 'hidden',
    pointerEvents: 'none',
    ...shapeMask(url),
  };
}

/** Bande lumineuse qui monte à travers la silhouette (la « vague »). */
export const waveBand: CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  height: '50%',
  background: 'linear-gradient(to top, transparent, rgba(232,200,119,0.5), transparent)',
};

export const completeSocle: CSSProperties = {
  position: 'absolute',
  inset: '10% 10% 4%',
  borderRadius: '50%',
  background: 'radial-gradient(circle at 50% 55%, rgba(232,200,119,0.4), transparent 62%)',
};
