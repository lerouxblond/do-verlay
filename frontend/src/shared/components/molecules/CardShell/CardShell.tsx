import type { CSSProperties, ReactNode } from 'react';
import { suits, type Suit } from '../../../theme/tokens';
import { cornerStyle, shellStyle, topStripStyle } from './CardShell.styles';

export interface CardShellProps {
  suit: Suit;
  /** Rang affiché sous l'enseigne (comme une carte à jouer). Omis = enseigne seule. */
  index?: number;
  width?: number;
  /** Fond harlequin plein (sinon surface unie). */
  pattern?: boolean;
  /** Affiche aussi l'angle bas-droit (carte « complète »). */
  bothCorners?: boolean;
  /** Liseré doré dégradé en tête (défaut true). */
  topStrip?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}

/**
 * Cadre « carte à jouer » signature : liseré or, motif harlequin, enseigne (+ rang optionnel)
 * en angle, ombre + halo constants. Conteneur de base de tout module overlay.
 */
export function CardShell({
  suit,
  index,
  width,
  pattern = true,
  bothCorners = false,
  topStrip = true,
  children,
  style,
}: CardShellProps) {
  const corner = (pos: 'tl' | 'br') => (
    <span style={cornerStyle(suit, pos)}>
      {suits[suit].glyph}
      {index !== undefined && (
        <>
          <br />
          {index}
        </>
      )}
    </span>
  );
  return (
    <div style={{ ...shellStyle(width, pattern), ...style }}>
      {corner('tl')}
      {bothCorners && corner('br')}
      {topStrip && <div style={topStripStyle} />}
      {children}
    </div>
  );
}
