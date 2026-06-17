import type { CSSProperties } from 'react';
import { suits, type Suit } from '../../../theme/tokens';

export const glyphStyle = (suit: Suit, size: number, color?: string): CSSProperties => ({
  fontSize: size,
  lineHeight: 1,
  color: color ?? suits[suit].color,
  display: 'inline-block',
});
