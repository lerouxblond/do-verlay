import type { CSSProperties } from 'react';
import { SuitGlyph } from '@shared/components';
import { fonts } from '@shared/theme/tokens';
import type { Suit } from '@shared/theme/tokens';
import { Toggle } from '../../atoms/Toggle/Toggle';

export interface ModuleRowProps {
  suit: Suit;
  name: string;
  sub: string;
  command: string;
  pinned: boolean;
  visible: boolean;
  cooldownLeft: number; // secondes (0 si dispo)
  displaySec: number;
  cooldownSec: number;
  onTogglePin: (pinned: boolean) => void;
  onTrigger: () => void;
}

const cmdStyle = (onCd: boolean): CSSProperties => ({
  fontFamily: fonts.mono,
  fontSize: 12,
  fontWeight: 600,
  padding: '6px 12px',
  borderRadius: 7,
  cursor: onCd ? 'not-allowed' : 'pointer',
  border: `1px solid ${onCd ? 'rgba(232,136,28,0.5)' : 'rgba(212,168,67,0.45)'}`,
  color: onCd ? '#E8881C' : '#E8C877',
  background: onCd ? 'rgba(232,136,28,0.08)' : 'rgba(212,168,67,0.1)',
  opacity: onCd ? 0.8 : 1,
});

/** Ligne de module du panel : enseigne, toggle d'épingle, commande + timing. */
export function ModuleRow({
  suit,
  name,
  sub,
  command,
  pinned,
  visible,
  cooldownLeft,
  displaySec,
  cooldownSec,
  onTogglePin,
  onTrigger,
}: ModuleRowProps) {
  const onCd = cooldownLeft > 0;
  return (
    <div
      style={{
        background: '#1A1219',
        border: `1px solid ${visible ? 'rgba(212,168,67,0.6)' : 'rgba(212,168,67,0.2)'}`,
        borderRadius: 11,
        padding: '11px 13px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <SuitGlyph suit={suit} size={16} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: fonts.label,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: 800,
              fontSize: 14,
              color: '#F0E8E0',
            }}
          >
            {name}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(240,232,224,0.5)' }}>{sub}</div>
        </div>
        <Toggle checked={pinned} onChange={onTogglePin} title="Épingler / masquer" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 9 }}>
        <button type="button" disabled={onCd} onClick={onTrigger} style={cmdStyle(onCd)}>
          {onCd ? `${command}  ⏱ ${cooldownLeft}s` : command}
        </button>
        <span
          style={{
            fontSize: 10,
            fontFamily: fonts.label,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'rgba(240,232,224,0.4)',
          }}
        >
          aff. {displaySec}s · cd {cooldownSec}s
        </span>
      </div>
    </div>
  );
}
