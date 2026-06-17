import type { CSSProperties } from 'react';
import type { Dofus, DofusState } from '../../../types';
import { DofusIcon } from '../../atoms/DofusIcon/DofusIcon';

export interface DofusCardProps {
  dofus: Dofus;
  state: DofusState;
  size?: number;
  /** Rend la case cliquable (édition d'état dans le panel). */
  onClick?: () => void;
  title?: string;
}

const cellStyle: CSSProperties = {
  position: 'relative',
  aspectRatio: '1',
  display: 'grid',
  placeItems: 'center',
};

const STATE_LABEL: Record<DofusState, string> = {
  not_started: 'non commencé',
  on_going: 'en cours',
  complete: 'obtenu',
};

/** Une case du Dofusdex : icône + état lisible d'un coup d'œil. */
export function DofusCard({ dofus, state, size = 56, onClick, title }: DofusCardProps) {
  const label = title ?? `${dofus.nom} — ${STATE_LABEL[state]}`;
  const icon = <DofusIcon asset={dofus.asset} state={state} size={size} title={label} />;
  if (!onClick) return <div style={cellStyle}>{icon}</div>;
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      style={{ ...cellStyle, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
    >
      {icon}
    </button>
  );
}
