import type { CSSProperties } from 'react';
import { fonts } from '@shared/theme/tokens';
import type { RecruitState } from '@shared/types';

export interface RecruitSegmentedProps {
  value: RecruitState;
  onChange: (value: RecruitState) => void;
}

const OPTIONS: { value: RecruitState; label: string; accent: string }[] = [
  { value: 'open', label: 'Ouvert', accent: '#4CAF50' },
  { value: 'on_request', label: 'Sur dem.', accent: '#E8881C' },
  { value: 'closed', label: 'Fermé', accent: '#E53935' },
];

const segStyle = (active: boolean, accent: string): CSSProperties => ({
  flex: 1,
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.4px',
  fontWeight: 700,
  fontSize: 10.5,
  padding: '7px 4px',
  borderRadius: 7,
  cursor: 'pointer',
  border: `1px solid ${active ? accent : 'rgba(212,168,67,0.25)'}`,
  color: active ? accent : '#9A8A84',
  background: active ? 'rgba(0,0,0,0.28)' : 'transparent',
});

/** Sélecteur segmenté des 3 états de recrutement. */
export function RecruitSegmented({ value, onChange }: RecruitSegmentedProps) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          style={segStyle(value === o.value, o.accent)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
