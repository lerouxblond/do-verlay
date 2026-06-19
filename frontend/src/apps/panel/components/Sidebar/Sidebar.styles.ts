import type { CSSProperties } from 'react';
import { colors, fonts, radii } from '@shared/theme/tokens';

export const asideStyle: CSSProperties = {
  width: 256,
  flex: 'none',
  height: '100vh',
  position: 'sticky',
  top: 0,
  display: 'flex',
  flexDirection: 'column',
  background: colors.surface,
  borderRight: `1px solid ${colors.border}`,
  overflowY: 'auto',
};

export const brandStyle: CSSProperties = {
  display: 'block',
  padding: '22px 20px 18px',
  borderBottom: `1px solid ${colors.border}`,
};

export const brandKickerStyle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.22em',
  fontSize: 10,
  fontWeight: 700,
  color: colors.accent,
};

export const brandNameStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 900,
  fontSize: 24,
  color: colors.accentBright,
  textShadow: '0 2px 0 #5a1418, 0 0 18px rgba(212,168,67,0.3)',
  marginTop: 4,
};

export const navStyle: CSSProperties = {
  padding: '14px 12px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
};

export const groupLabelStyle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.16em',
  fontSize: 10,
  fontWeight: 700,
  color: colors.textMuted,
  padding: '0 10px 7px',
};

/**
 * Disposition d'un item de navigation. Les états visuels (hover, actif, halo de l'enseigne) sont
 * portés par les classes `.dv-nav-item` / `.is-active` (fonts.css) : l'inline ne gère pas `:hover`.
 */
export const itemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 11,
  width: '100%',
  textAlign: 'left',
  padding: '9px 10px',
  border: 'none',
  borderRadius: radii.md,
};

export const itemLabelStyle: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 14,
  fontWeight: 600,
};

export const soonStyle: CSSProperties = {
  marginLeft: 'auto',
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  fontSize: 9,
  fontWeight: 700,
  color: colors.textMuted,
  border: `1px solid ${colors.border}`,
  borderRadius: radii.pill,
  padding: '2px 7px',
};

export const brandHintStyle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  fontSize: 9,
  fontWeight: 700,
  color: colors.textFaint,
  marginTop: 6,
};

/** Pied de la sidebar : poussé en bas (mention légale). */
export const footStyle: CSSProperties = {
  marginTop: 'auto',
  padding: '14px 18px 18px',
  borderTop: `1px solid ${colors.border}`,
};

export const legalStyle: CSSProperties = {
  fontFamily: fonts.label,
  fontSize: 10,
  lineHeight: 1.5,
  letterSpacing: '0.02em',
  color: colors.textFaint,
  margin: 0,
};
