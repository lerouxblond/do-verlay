import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { fonts } from '@shared/theme/tokens';

export interface StagePreviewProps {
  /** Texte des modules actuellement à l'écran. */
  visibleText: string;
  children: ReactNode;
}

const STAGE_W = 1920;
const STAGE_H = 1080;

/** Scène de jeu factice (placeholder) — dégradé paysage Dofus. */
function FauxGame() {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg,#2E5A8C 0%,#5B8FB5 42%,#8FC0A9 55%,#6BA368 70%,#4E7C46 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: 300,
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle,#FFF6D6,#FFE08A)',
          boxShadow: '0 0 120px rgba(255,224,138,0.7)',
        }}
      />
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <span
          style={{
            fontFamily: fonts.label,
            textTransform: 'uppercase',
            letterSpacing: '9px',
            fontSize: 33,
            fontWeight: 800,
            color: 'rgba(255,255,255,0.18)',
          }}
        >
          Fond de jeu — placeholder
        </span>
      </div>
    </div>
  );
}

/**
 * Aperçu live de l'overlay dans le panel : scène 1920×1080 mise à l'échelle pour remplir la
 * largeur disponible (ResizeObserver), sur un fond de jeu factice.
 */
export function StagePreview({ visibleText, children }: StagePreviewProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / STAGE_W);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const barStyle: CSSProperties = {
    flex: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '12px 22px',
    borderBottom: '1px solid rgba(212,168,67,0.18)',
  };

  return (
    <>
      <div style={barStyle}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: fonts.label,
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            fontSize: 12,
            fontWeight: 700,
            color: 'rgba(240,232,224,0.65)',
          }}
        >
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#E53935', boxShadow: '0 0 8px #E53935' }} />
          Source navigateur · 1920 × 1080 · transparente
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'rgba(240,232,224,0.5)' }}>
          À l'écran : <span style={{ color: '#E8C877', fontWeight: 700 }}>{visibleText}</span>
        </span>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'grid', placeItems: 'center', padding: 24 }}>
        <div
          ref={wrapRef}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 1180,
            aspectRatio: '16/9',
            borderRadius: 14,
            overflow: 'hidden',
            border: '1px solid rgba(212,168,67,0.25)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, width: STAGE_W, height: STAGE_H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            <FauxGame />
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
