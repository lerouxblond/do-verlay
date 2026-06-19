import type { CSSProperties } from 'react';
import { colors, fonts, radii } from '@shared/theme/tokens';

export const cardStyle: CSSProperties = {
  position: 'relative',
  background: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: radii.card,
  padding: 22,
  boxShadow: '0 10px 28px rgba(0,0,0,0.4)',
};

export const headStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 11,
  marginBottom: 18,
};

export const titleStyle: CSSProperties = {
  fontFamily: fonts.title,
  fontSize: 19,
  fontWeight: 600,
  color: colors.text,
  margin: 0,
};

export const subStyle: CSSProperties = {
  fontSize: 13,
  color: colors.textMuted,
  marginTop: 3,
  lineHeight: 1.5,
};

export const bodyStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
};

export const titleAreaStyle = (clickable: boolean): CSSProperties => ({
  flex: 1,
  minWidth: 0,
  cursor: clickable ? 'pointer' : 'default',
  userSelect: clickable ? 'none' : 'auto',
});

export const chevronStyle = (open: boolean): CSSProperties => ({
  flex: 'none',
  border: 'none',
  // `background`/`color` de survol posés par `.dv-chevron` (fonts.css) — l'inline les bloquerait.
  cursor: 'pointer',
  color: colors.accent,
  fontSize: 13,
  lineHeight: 1,
  padding: 6,
  transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
  transition: 'transform 0.18s ease',
});
