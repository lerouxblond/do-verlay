import type { CSSProperties } from 'react';
import { colors, fonts } from '@shared/theme/tokens';

export const barStyle: CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 5,
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: '12px 28px',
  background: 'rgba(13,10,14,0.82)',
  backdropFilter: 'blur(8px)',
  borderBottom: `1px solid ${colors.border}`,
};

export const labelStyle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  fontSize: 11,
  fontWeight: 700,
  color: colors.textMuted,
};

export const profileSelectStyle: CSSProperties = {
  fontFamily: fonts.title,
  fontSize: 15,
  fontWeight: 600,
  color: colors.text,
  background: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: 8,
  padding: '8px 12px',
  cursor: 'pointer',
  maxWidth: 280,
};

export const spacerStyle: CSSProperties = { flex: 1 };

export const linkStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 7,
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontSize: 12,
  fontWeight: 700,
  color: colors.accentBright,
  border: '1px solid rgba(212,168,67,0.45)',
  background: 'rgba(212,168,67,0.1)',
  borderRadius: 8,
  padding: '9px 14px',
};
