import type { CSSProperties } from 'react';
import type { AnchorZone } from '@shared/types';

const MARGIN = 24;
/** Décalage vertical entre modules partageant une zone (collision douce). */
const STACK_GAP = 132;

const TRANSITION = 'opacity .45s ease, transform .55s cubic-bezier(.2,.9,.25,1)';

/**
 * Style d'un module ancré : position selon la zone, décalage d'empilement,
 * et animation « lever de rideau » selon visible.
 */
export function slotStyle(zone: AnchorZone, visible: boolean, stackIndex: number): CSSProperties {
  const offset = stackIndex * STACK_GAP;
  const top = zone === 'HG' || zone === 'HD';
  const centerX = zone === 'BAS';

  const pos: CSSProperties = { position: 'absolute', zIndex: 3, transition: TRANSITION };
  if (zone === 'HG') Object.assign(pos, { top: MARGIN + offset, left: MARGIN });
  if (zone === 'HD') Object.assign(pos, { top: MARGIN + offset, right: MARGIN });
  if (zone === 'BG') Object.assign(pos, { bottom: MARGIN + offset, left: MARGIN });
  if (zone === 'BD') Object.assign(pos, { bottom: MARGIN + offset, right: MARGIN });
  if (zone === 'BAS') Object.assign(pos, { bottom: MARGIN + offset, left: '50%' });

  const tx = centerX ? 'translateX(-50%) ' : '';
  const enter = top ? 'translateY(-26px)' : 'translateY(26px)';
  const transform = visible ? `${tx}translateY(0) scale(1)` : `${tx}${enter} scale(.96)`;

  return {
    ...pos,
    transform,
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'auto' : 'none',
  };
}

/** Cadre de la scène overlay 1920×1080 (transparent). */
export const stageStyle: CSSProperties = {
  position: 'relative',
  width: 1920,
  height: 1080,
  overflow: 'hidden',
};
