import { SuitGlyph } from '@shared/components/atoms/SuitGlyph/SuitGlyph';
import { MODULES } from '@shared/constants';
import type { ModuleType } from '@shared/types';
import { commandStyle, textStyle, titleStyle, wrapStyle } from './Placeholder.styles';

export interface PlaceholderProps {
  module: ModuleType;
}

/**
 * État vide d'une section module non encore implémentée. Rappelle l'enseigne et la
 * commande chat prévues — pas de mock : la page se remplira avec le module.
 */
export function Placeholder({ module }: PlaceholderProps) {
  const meta = MODULES[module];
  return (
    <div style={wrapStyle}>
      <SuitGlyph suit={meta.suit} size={46} />
      <h2 style={titleStyle}>{meta.name} — configuration à venir</h2>
      <p style={textStyle}>
        Cette page accueillera les réglages du module « {meta.name} » ({meta.sub.toLowerCase()})
        lorsqu'il sera ajouté à l'overlay.
      </p>
      <span style={commandStyle}>commande prévue · {meta.command}</span>
    </div>
  );
}
