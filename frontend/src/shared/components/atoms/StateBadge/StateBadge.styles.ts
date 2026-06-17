import type { CSSProperties } from 'react';
import { fonts, radii } from '../../../theme/tokens';

export type BadgeVariant =
  | 'complete'
  | 'on_going'
  | 'not_started'
  | 'open'
  | 'on_request'
  | 'closed';

interface VariantStyle {
  color: string;
  bg: string;
  border: string;
  dot?: string;
  label: string;
}

export const VARIANTS: Record<BadgeVariant, VariantStyle> = {
  complete: {
    color: '#E8C877',
    bg: 'rgba(212,168,67,0.16)',
    border: 'rgba(212,168,67,0.5)',
    label: 'Obtenu',
  },
  on_going: {
    color: '#F2B970',
    bg: 'rgba(232,136,28,0.16)',
    border: 'rgba(232,136,28,0.5)',
    label: 'En cours',
  },
  not_started: {
    color: '#9A8A84',
    bg: 'rgba(154,138,132,0.12)',
    border: 'rgba(154,138,132,0.4)',
    label: 'À faire',
  },
  open: {
    color: '#8FE3A0',
    bg: 'rgba(76,175,80,0.18)',
    border: 'rgba(76,175,80,0.5)',
    dot: '#4CAF50',
    label: 'Ouvert',
  },
  on_request: {
    color: '#F2B970',
    bg: 'rgba(232,136,28,0.18)',
    border: 'rgba(232,136,28,0.5)',
    dot: '#E8881C',
    label: 'Sur demande',
  },
  closed: {
    color: '#F2A6A4',
    bg: 'rgba(201,54,58,0.18)',
    border: 'rgba(229,57,53,0.5)',
    dot: '#E53935',
    label: 'Fermé',
  },
};

export const badgeStyle = (v: BadgeVariant): CSSProperties => {
  const s = VARIANTS[v];
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontFamily: fonts.label,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontSize: 11,
    fontWeight: 700,
    color: s.color,
    background: s.bg,
    border: `1px solid ${s.border}`,
    padding: '4px 10px',
    borderRadius: radii.pill,
    whiteSpace: 'nowrap',
  };
};

export const dotStyle = (color: string): CSSProperties => ({
  width: 7,
  height: 7,
  borderRadius: '50%',
  background: color,
});
