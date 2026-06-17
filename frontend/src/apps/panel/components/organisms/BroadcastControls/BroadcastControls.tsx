import { useState, type CSSProperties, type KeyboardEvent } from 'react';
import { fonts } from '@shared/theme/tokens';

export interface ChatLine {
  text: string;
  color: string;
}

export interface BroadcastControlsProps {
  rotation: boolean;
  limit: number;
  queueText: string;
  visibleText: string;
  chatLog: ChatLine[];
  onToggleRotation: () => void;
  onLimit: (n: number) => void;
  onSendChat: (text: string) => void;
}

const box: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  background: '#1A1219',
  border: '1px solid rgba(212,168,67,0.2)',
  borderRadius: 11,
  padding: 13,
};

/** Diffusion & responsive : rotation auto, limite simultanée, file d'attente, simulateur de chat. */
export function BroadcastControls({
  rotation,
  limit,
  queueText,
  visibleText,
  chatLog,
  onToggleRotation,
  onLimit,
  onSendChat,
}: BroadcastControlsProps) {
  const [chat, setChat] = useState('');
  const send = () => {
    const v = chat.trim();
    if (v) onSendChat(v);
    setChat('');
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') send();
  };

  return (
    <div>
      <div
        style={{
          fontFamily: fonts.label,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          fontSize: 11,
          fontWeight: 800,
          color: '#D4A843',
          marginBottom: 8,
        }}
      >
        Diffusion & responsive
      </div>
      <div style={box}>
        <button
          type="button"
          onClick={onToggleRotation}
          style={{
            fontFamily: fonts.label,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: 800,
            fontSize: 13,
            padding: 11,
            borderRadius: 9,
            cursor: 'pointer',
            border: `1px solid ${rotation ? '#4CAF50' : 'rgba(212,168,67,0.5)'}`,
            color: rotation ? '#8FE3A0' : '#E8C877',
            background: rotation ? 'rgba(76,175,80,0.12)' : 'rgba(212,168,67,0.1)',
          }}
        >
          {rotation ? '⏸  Rotation auto — en cours' : '▶  Lancer la rotation auto'}
        </button>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(240,232,224,0.75)', marginBottom: 6 }}>
            <span>Modules simultanés max</span>
            <span style={{ color: '#E8C877', fontWeight: 700 }}>{limit}</span>
          </div>
          <input
            type="range"
            min={1}
            max={4}
            step={1}
            value={limit}
            onChange={(e) => onLimit(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: '#D4A843' }}
          />
        </div>

        <div style={{ fontSize: 11, color: 'rgba(240,232,224,0.5)' }}>
          À l'écran : <span style={{ color: '#E8C877', fontWeight: 700 }}>{visibleText}</span>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(240,232,224,0.5)' }}>
          File d'attente : <span style={{ color: '#E8881C', fontWeight: 700 }}>{queueText}</span>
        </div>

        <div style={{ borderTop: '1px solid rgba(212,168,67,0.18)', paddingTop: 11 }}>
          <div
            style={{
              fontSize: 11,
              fontFamily: fonts.label,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: 'rgba(240,232,224,0.55)',
              marginBottom: 7,
            }}
          >
            Simulateur de chat viewer
          </div>
          <div style={{ display: 'flex', gap: 7 }}>
            <input
              value={chat}
              onChange={(e) => setChat(e.target.value)}
              onKeyDown={onKey}
              placeholder="!dofus  !guilde  !perso  !code"
              style={{
                flex: 1,
                background: '#0D0A0E',
                border: '1px solid rgba(212,168,67,0.35)',
                color: '#F0E8E0',
                borderRadius: 8,
                padding: '8px 10px',
                fontSize: 13,
                fontFamily: fonts.mono,
              }}
            />
            <button
              type="button"
              onClick={send}
              style={{
                background: 'linear-gradient(180deg,#E8C877,#D4A843)',
                color: '#16100E',
                border: 'none',
                borderRadius: 8,
                padding: '0 14px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              →
            </button>
          </div>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {(chatLog.length ? chatLog : [{ text: 'Tape une commande…', color: 'rgba(240,232,224,0.4)' }]).map(
              (c, i) => (
                <div key={i} style={{ fontSize: 11.5, fontFamily: fonts.mono, color: c.color }}>
                  {c.text}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
