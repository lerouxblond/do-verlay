import type { CSSProperties } from 'react';
import { fonts, radii } from '../../../theme/tokens';

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md';

const base: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  fontWeight: 700,
  border: 'none',
  borderRadius: radii.md,
  cursor: 'pointer',
};

const sizes: Record<ButtonSize, CSSProperties> = {
  sm: { fontSize: 11, padding: '7px 12px' },
  md: { fontSize: 13, padding: '12px 16px' },
};

const variants: Record<ButtonVariant, CSSProperties> = {
  // Rouge Zobal
  primary: {
    color: '#FBEFE9',
    background: 'linear-gradient(180deg,#C9363A,#A8272B)',
    boxShadow: 'inset 0 0 0 1px rgba(212,168,67,0.4), 0 8px 24px rgba(201,54,58,0.3)',
  },
  // Or Ecaflip
  accent: { color: '#2A1B08', background: 'linear-gradient(180deg,#E2C06A,#D4A843)' },
  secondary: {
    color: '#F0E8E0',
    background: 'transparent',
    border: '1.5px solid #3D2B36',
  },
  danger: {
    color: '#FFC9C5',
    background: 'rgba(229,57,53,0.18)',
    border: '1.5px solid #E53935',
  },
  ghost: {
    color: '#E8C877',
    background: 'rgba(212,168,67,0.1)',
    border: '1px solid rgba(212,168,67,0.45)',
  },
};

export const buttonStyle = (
  variant: ButtonVariant,
  size: ButtonSize,
  disabled?: boolean,
): CSSProperties => ({
  ...base,
  ...sizes[size],
  ...variants[variant],
  ...(disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
});
