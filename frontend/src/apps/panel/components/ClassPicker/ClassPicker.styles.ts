import type { CSSProperties } from 'react';
import { colors, fonts, radii } from '@shared/theme/tokens';

/** Grille responsive des 19 classes — s'adapte de 2 à ~6 colonnes selon la largeur. */
export const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(82px, 1fr))',
  gap: 8,
};

/** Tuile de classe : médaillon (Avatar) + libellé. L'état sélectionné est porté par le liseré. */
export const tileStyle = (selected: boolean): CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 6,
  padding: '10px 6px 8px',
  borderRadius: radii.md,
  border: `1px solid ${selected ? colors.accent : colors.border}`,
  background: selected ? 'rgba(212,168,67,0.14)' : colors.bg,
  boxShadow: selected ? 'inset 0 0 0 1px rgba(212,168,67,0.5)' : 'none',
  cursor: 'pointer',
  // transform/filter au survol gérés par .dv-class-tile (l'inline l'emporterait sur :hover).
});

export const tileLabelStyle = (selected: boolean): CSSProperties => ({
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  fontSize: 10,
  fontWeight: 700,
  textAlign: 'center',
  lineHeight: 1.1,
  color: selected ? colors.accentBright : colors.textMuted,
});
