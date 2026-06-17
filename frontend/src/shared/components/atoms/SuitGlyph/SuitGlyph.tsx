import type { CSSProperties } from 'react';
import { suits, type Suit } from '../../../theme/tokens';
import { glyphStyle } from './SuitGlyph.styles';

export interface SuitGlyphProps {
  suit: Suit;
  size?: number;
  color?: string;
  style?: CSSProperties;
  title?: string;
}

/** Enseigne de carte ♦♥♠♣ — signature identitaire posée en angle des cadres. */
export function SuitGlyph({ suit, size = 18, color, style, title }: SuitGlyphProps) {
  return (
    <span style={{ ...glyphStyle(suit, size, color), ...style }} title={title} aria-hidden>
      {suits[suit].glyph}
    </span>
  );
}
