import { useState, type CSSProperties, type KeyboardEvent } from 'react';
import { Tag } from '@shared/components';
import { MAX_TAGS } from '@shared/constants';
import { fonts } from '@shared/theme/tokens';

export interface TagGroupProps {
  tags: string[];
  max?: number;
  onAdd: (label: string) => void;
  onRemove: (index: number) => void;
}

const inputStyle: CSSProperties = {
  flex: 1,
  minWidth: 90,
  background: '#0D0A0E',
  border: '1px dashed rgba(212,168,67,0.35)',
  color: '#F0E8E0',
  borderRadius: 999,
  padding: '5px 11px',
  fontSize: 12,
  fontFamily: fonts.body,
};

/** Tags de guilde + saisie d'ajout (max 5 par défaut). */
export function TagGroup({ tags, max = MAX_TAGS, onAdd, onRemove }: TagGroupProps) {
  const [input, setInput] = useState('');
  const canAdd = tags.length < max;

  const commit = () => {
    const v = input.trim();
    if (v && canAdd) onAdd(v);
    setInput('');
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commit();
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span
          style={{
            fontFamily: fonts.label,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontSize: 10,
            color: 'rgba(240,232,224,0.45)',
          }}
        >
          Tags
        </span>
        <span style={{ fontFamily: fonts.mono, fontSize: 10, color: canAdd ? '#9A8A84' : '#E8881C' }}>
          {tags.length} / {max}
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {tags.map((t, i) => (
          <Tag key={`${t}-${i}`} label={t} onRemove={() => onRemove(i)} />
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          onBlur={commit}
          placeholder={canAdd ? '+ tag' : 'max atteint'}
          disabled={!canAdd}
          style={inputStyle}
        />
      </div>
    </div>
  );
}
