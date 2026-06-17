import type { CSSProperties } from 'react';
import { dofusIcon } from '../../../assets/dofus';
import type { DofusState } from '../../../types';
import { completeSocle, fillLayer, imageLayer, levelLine, rootStyle } from './DofusIcon.styles';

export interface DofusIconProps {
  /** clé d'asset du Dofus (ex. 'dof-vulbis'). */
  asset: string;
  state: DofusState;
  size?: number;
  title?: string;
  style?: CSSProperties;
}

/**
 * Icône d'un Dofus avec le traitement visuel de son état :
 * silhouette verrouillée (not_started) · œuf partiellement révélé (on_going) ·
 * pleine couleur + halo doré (complete).
 */
export function DofusIcon({ asset, state, size = 64, title, style }: DofusIconProps) {
  const url = dofusIcon(asset);
  return (
    <div style={{ ...rootStyle(size), ...style }} title={title} role="img" aria-label={title}>
      {state === 'complete' && <div style={completeSocle} />}
      <div style={imageLayer(url, state)} />
      {state === 'on_going' && (
        <>
          <div style={fillLayer(url)} />
          <div style={levelLine} />
        </>
      )}
    </div>
  );
}
