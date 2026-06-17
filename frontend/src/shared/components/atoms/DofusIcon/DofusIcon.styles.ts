import type { CSSProperties } from 'react';
import type { DofusState } from '../../../types';

/** Traitement visuel de la base selon l'état (cf. design system §06 / proto 06). */
export function baseFilter(state: DofusState): { filter: string; opacity: number } {
  if (state === 'complete') return { filter: 'none', opacity: 1 };
  if (state === 'on_going') return { filter: 'grayscale(1) brightness(0.36)', opacity: 0.85 };
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
    ...(state === 'complete' ? { animation: 'dv-halo 2.8s ease-in-out infinite' } : {}),
  };
}

/** Portion révélée (œuf qui « monte » du bas) pour l'état en cours. */
export function fillLayer(url: string): CSSProperties {
  const mask = 'linear-gradient(to top,#000 0 42%,rgba(0,0,0,0.55) 56%,transparent 70%)';
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

export const levelLine: CSSProperties = {
  position: 'absolute',
  left: '18%',
  right: '18%',
  top: '48%',
  height: 2,
  background: 'linear-gradient(90deg,transparent,#E8C877,transparent)',
  boxShadow: '0 0 5px rgba(232,200,119,0.7)',
};

export const completeSocle: CSSProperties = {
  position: 'absolute',
  inset: '10% 10% 4%',
  borderRadius: '50%',
  background: 'radial-gradient(circle at 50% 55%, rgba(232,200,119,0.4), transparent 62%)',
};
