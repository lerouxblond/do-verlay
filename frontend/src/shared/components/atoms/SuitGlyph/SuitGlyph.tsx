import type { CSSProperties } from 'react';
import { suits, type Suit } from '../../../theme/tokens';
import { glyphStyle } from './SuitGlyph.styles';

export interface SuitGlyphProps {
  suit: Suit;
  size?: number;
  color?: string;
  style?: CSSProperties;
  /** Classe CSS optionnelle (point d'accroche pour les états interactifs : halo, hover…). */
  className?: string;
  title?: string;
}

/** Enseigne de carte ♦♥♠♣ — signature identitaire posée en angle des cadres. */
export function SuitGlyph({ suit, size = 18, color, style, className, title }: SuitGlyphProps) {
  return (
    <span
      style={{ ...glyphStyle(suit, size, color), ...style }}
      className={className}
      title={title}
      aria-hidden
    >
      {suits[suit].glyph}
    </span>
  );
}
