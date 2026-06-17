import type { CSSProperties, ReactNode } from 'react';
import { suits, type Suit } from '../../../theme/tokens';
import { cornerStyle, shellStyle, topStripStyle } from './CardShell.styles';

export interface CardShellProps {
  suit: Suit;
  /** Index affiché en angle (comme une carte à jouer). */
  index: number;
  width?: number;
  /** Fond harlequin plein (sinon surface unie). */
  pattern?: boolean;
  /** Affiche aussi l'angle bas-droit (carte « complète »). */
  bothCorners?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}

/**
 * Cadre « carte à jouer » signature : liseré or, motif harlequin, enseigne + index en
 * angle, liseré doré en tête, ombre + halo constants. Conteneur de base de tout module overlay.
 */
export function CardShell({
  suit,
  index,
  width,
  pattern = true,
  bothCorners = false,
  children,
  style,
}: CardShellProps) {
  const corner = (pos: 'tl' | 'br') => (
    <span style={cornerStyle(suit, pos)}>
      {suits[suit].glyph}
      <br />
      {index}
    </span>
  );
  return (
    <div style={{ ...shellStyle(width, pattern), ...style }}>
      {corner('tl')}
      {bothCorners && corner('br')}
      <div style={topStripStyle} />
      {children}
    </div>
  );
}
