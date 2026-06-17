import type { CSSProperties, ReactNode } from 'react';
import { lattice } from '@shared/theme/tokens';

export interface PanelLayoutProps {
  sidebar: ReactNode;
  stage: ReactNode;
}

const rootStyle: CSSProperties = {
  height: '100vh',
  display: 'flex',
  fontFamily: "'Inter', sans-serif",
  color: '#F0E8E0',
  background: '#08040A',
};

const sidebarStyle: CSSProperties = {
  width: 440,
  flex: 'none',
  height: '100%',
  overflowY: 'auto',
  backgroundColor: '#0D0A0E',
  backgroundImage: lattice('rgba(212,168,67,0.04)', 28),
  borderRight: '1px solid rgba(212,168,67,0.3)',
};

const stageStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: 'radial-gradient(120% 90% at 50% 0%, #1A1219, #08040A 70%)',
};

/** Gabarit du panel : sidebar (modules + profil + éditeurs) à gauche, scène/aperçu à droite. */
export function PanelLayout({ sidebar, stage }: PanelLayoutProps) {
  return (
    <div style={rootStyle}>
      <aside className="dv-scroll" style={sidebarStyle}>
        {sidebar}
      </aside>
      <main style={stageStyle}>{stage}</main>
    </div>
  );
}
