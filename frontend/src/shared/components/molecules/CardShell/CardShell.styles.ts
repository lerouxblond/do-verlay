import type { CSSProperties } from 'react';
import { fonts, harlequin, radii, suits, type Suit } from '../../../theme/tokens';

export const shellStyle = (
  width: number | undefined,
  pattern: boolean,
): CSSProperties => ({
  position: 'relative',
  width,
  borderRadius: radii.card,
  border: '1px solid #D4A843',
  ...(pattern ? harlequin('rgba(201,54,58,0.16)') : { background: '#1A1219' }),
  boxShadow: 'inset 0 0 0 1px rgba(212,168,67,0.4), 0 14px 34px rgba(0,0,0,0.55)',
  padding: '15px 17px',
  color: '#F0E8E0',
});

export const cornerStyle = (suit: Suit, position: 'tl' | 'br'): CSSProperties => ({
  position: 'absolute',
  ...(position === 'tl'
    ? { top: 7, left: 11 }
    : { bottom: 7, right: 11, transform: 'rotate(180deg)' }),
  fontFamily: fonts.label,
  fontSize: 12,
  fontWeight: 800,
  color: suits[suit].color,
  lineHeight: 0.78,
  textAlign: 'center',
});

export const topStripStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: 6,
  background: 'linear-gradient(180deg,#D4A843,transparent)',
  borderRadius: '13px 13px 0 0',
};
