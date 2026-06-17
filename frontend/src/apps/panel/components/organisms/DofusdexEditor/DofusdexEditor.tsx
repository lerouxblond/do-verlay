import { useState, type CSSProperties } from 'react';
import { DofusCard } from '@shared/components';
import { DOFUS_BY_ID } from '@shared/data/seed';
import { fonts } from '@shared/theme/tokens';
import type { DofusId, DofusState } from '@shared/types';
import { DofusOrderRow } from '../../molecules/DofusOrderRow/DofusOrderRow';

export interface DofusdexEditorProps {
  ordre: DofusId[];
  dofus: Record<DofusId, DofusState>;
  onCycle: (id: DofusId) => void;
  onReorder: (from: number, to: number) => void;
  onResetOrder: () => void;
}

const sectionTitle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  fontSize: 11,
  fontWeight: 800,
  color: '#D4A843',
};
const panelBox: CSSProperties = {
  background: '#1A1219',
  border: '1px solid rgba(212,168,67,0.2)',
  borderRadius: 11,
  padding: 11,
};

/** Édition live du Dofusdex : grille d'états (clic = cycle) + liste de tri (drag & ▲▼). */
export function DofusdexEditor({ ordre, dofus, onCycle, onReorder, onResetOrder }: DofusdexEditorProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const list = ordre.map((id) => DOFUS_BY_ID[id]).filter(Boolean);
  const total = list.length;
  const done = list.filter((d) => dofus[d.id] === 'complete').length;

  const move = (from: number, to: number) => {
    if (from == null || to < 0 || to >= total || from === to) return;
    onReorder(from, to);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={sectionTitle}>♦ Dofusdex — édition live</span>
        <span
          style={{
            fontFamily: fonts.label,
            fontWeight: 800,
            fontSize: 13,
            color: '#16100E',
            background: 'linear-gradient(180deg,#E8C877,#D4A843)',
            padding: '3px 10px',
            borderRadius: 999,
          }}
        >
          {done} / {total}
        </span>
      </div>
      <div style={{ fontSize: 11, color: 'rgba(240,232,224,0.5)', marginBottom: 8 }}>
        Clique un Dofus pour faire défiler son état : <span style={{ color: '#9A8A84' }}>non commencé</span> →{' '}
        <span style={{ color: '#E8881C' }}>en cours</span> → <span style={{ color: '#E8C877' }}>obtenu</span>.
      </div>

      <div style={{ ...panelBox, display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 6 }}>
        {list.map((d) => (
          <DofusCard key={d.id} dofus={d} state={dofus[d.id] ?? 'not_started'} onClick={() => onCycle(d.id)} />
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '12px 0 7px' }}>
        <span style={{ fontSize: 11, color: 'rgba(240,232,224,0.55)' }}>
          <span style={{ color: '#E8C877' }}>⠿ Ordre d'affichage</span> — glisser ou ▲▼
        </span>
        <button
          type="button"
          onClick={onResetOrder}
          style={{
            fontFamily: fonts.label,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontSize: 9.5,
            fontWeight: 700,
            color: '#9A8A84',
            background: 'transparent',
            border: '1px solid rgba(212,168,67,0.3)',
            borderRadius: 6,
            padding: '3px 8px',
            cursor: 'pointer',
          }}
        >
          Réinitialiser
        </button>
      </div>

      <div style={{ ...panelBox, display: 'flex', flexDirection: 'column', gap: 5, padding: 9 }}>
        {list.map((d, i) => (
          <DofusOrderRow
            key={d.id}
            dofus={d}
            pos={i + 1}
            state={dofus[d.id] ?? 'not_started'}
            dragging={dragIndex === i}
            over={overIndex === i && dragIndex !== i}
            onUp={() => move(i, i - 1)}
            onDown={() => move(i, i + 1)}
            onDragStart={(e) => {
              setDragIndex(i);
              if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
            }}
            onDragEnter={() => dragIndex !== null && i !== overIndex && setOverIndex(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIndex !== null) move(dragIndex, i);
              setDragIndex(null);
              setOverIndex(null);
            }}
            onDragEnd={() => {
              setDragIndex(null);
              setOverIndex(null);
            }}
          />
        ))}
      </div>
    </div>
  );
}
