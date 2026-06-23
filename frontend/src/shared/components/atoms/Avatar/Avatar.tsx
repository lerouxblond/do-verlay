import type { CSSProperties } from 'react';
import { fadeStyle, portraitStyle, ringStyle } from './Avatar.styles';

export interface AvatarProps {
  /** URL de l'illustration de classe (buste). */
  src: string;
  size?: number;
  ring?: string;
  alt?: string;
  style?: CSSProperties;
}

/**
 * Médaillon rond « masque + fondu » : recadre le buste d'un asset de classe et fond
 * son bas carré par un dégradé (cf. design system §05).
 */
export function Avatar({ src, size = 64, ring = '#E8C877', alt = '', style }: AvatarProps) {
  return (
    <div style={{ ...ringStyle(size, ring), ...style }}>
      <img src={src} alt={alt} style={portraitStyle(size)} loading="lazy" decoding="async" />
      <div style={fadeStyle} />
    </div>
  );
}
