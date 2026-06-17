import type { CSSProperties, DragEvent } from 'react';
import { DofusIcon, StateBadge } from '@shared/components';
import { fonts } from '@shared/theme/tokens';
import type { Dofus, DofusState } from '@shared/types';

export interface DofusOrderRowProps {
  dofus: Dofus;
  pos: number; // 1-based
  state: DofusState;
  dragging: boolean;
  over: boolean;
  onUp: () => void;
  onDown: () => void;
  onDragStart: (e: DragEvent) => void;
  onDragEnter: () => void;
  onDragOver: (e: DragEvent) => void;
  onDrop: () => void;
  onDragEnd: () => void;
}

const arrowStyle: CSSProperties = {
  width: 22,
  height: 22,
  display: 'grid',
  placeItems: 'center',
  border: '1px solid rgba(212,168,67,0.25)',
  background: 'transparent',
  color: '#E8C877',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 9,
  lineHeight: 1,
};

/** Ligne réordonnable du tri Dofusdex (poignée ⠿, drag & drop + ▲▼). */
export function DofusOrderRow({
  dofus,
  pos,
  state,
  dragging,
  over,
  onUp,
  onDown,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDrop,
  onDragEnd,
}: DofusOrderRowProps) {
  const rowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: dragging ? 'rgba(212,168,67,0.14)' : '#0D0A0E',
    border: `1px solid ${dragging ? '#D4A843' : 'rgba(212,168,67,0.18)'}`,
    borderTop: over ? '2px solid #E8C877' : undefined,
    borderRadius: 8,
    padding: '5px 9px',
    cursor: 'grab',
    opacity: dragging ? 0.55 : 1,
  };
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      style={rowStyle}
    >
      <span style={{ color: '#9A8A84', cursor: 'grab', fontSize: 13 }}>⠿</span>
      <span
        style={{
          width: 15,
          fontFamily: fonts.mono,
          fontSize: 10,
          color: 'rgba(240,232,224,0.4)',
          textAlign: 'right',
        }}
      >
        {pos}
      </span>
      <DofusIcon asset={dofus.asset} state={state} size={26} />
      <span style={{ flex: 1, fontSize: 12.5, color: '#F0E8E0' }}>{dofus.nom}</span>
      <StateBadge variant={state} style={{ fontSize: 9, padding: '2px 7px' }} />
      <button type="button" title="Monter" onClick={onUp} style={arrowStyle}>
        ▲
      </button>
      <button type="button" title="Descendre" onClick={onDown} style={arrowStyle}>
        ▼
      </button>
    </div>
  );
}
