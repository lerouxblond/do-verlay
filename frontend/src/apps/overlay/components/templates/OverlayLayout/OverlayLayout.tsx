import type { CSSProperties, ReactNode } from 'react';
import type { AnchorZone } from '@shared/types';
import { slotStyle, stageStyle } from './OverlayLayout.styles';

export interface OverlaySlot {
  key: string;
  zone: AnchorZone;
  visible: boolean;
  node: ReactNode;
}

export interface OverlayLayoutProps {
  slots: OverlaySlot[];
  /** Scène mise à l'échelle (aperçu panel) — défaut 1 (overlay live). */
  scale?: number;
  style?: CSSProperties;
}

/**
 * Gabarit de l'overlay : place chaque module dans sa zone d'ancrage (HG/HD/BG/BD/BAS),
 * anime l'apparition « lever de rideau » et empile proprement les modules qui partagent
 * une zone (collision douce). Fond transparent — l'identité vient des modules.
 */
export function OverlayLayout({ slots, scale = 1, style }: OverlayLayoutProps) {
  // Index d'empilement stable par zone (ordre des slots reçus).
  const stackByZone: Record<string, number> = {};
  const indexed = slots.map((s) => {
    const i = stackByZone[s.zone] ?? 0;
    stackByZone[s.zone] = i + 1;
    return { ...s, stackIndex: i };
  });

  return (
    <div
      style={{
        ...stageStyle,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        ...style,
      }}
    >
      {indexed.map((s) => (
        <div key={s.key} style={slotStyle(s.zone, s.visible, s.stackIndex)}>
          {s.node}
        </div>
      ))}
    </div>
  );
}
