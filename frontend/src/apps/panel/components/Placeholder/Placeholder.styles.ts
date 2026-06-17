import type { CSSProperties } from 'react';
import { colors, fonts, harlequin, radii } from '@shared/theme/tokens';

export const wrapStyle: CSSProperties = {
  ...harlequin('rgba(212,168,67,0.06)', 30),
  border: `1px dashed ${colors.border}`,
  borderRadius: radii.card,
  padding: '54px 32px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 14,
};

export const titleStyle: CSSProperties = {
  fontFamily: fonts.title,
  fontSize: 22,
  fontWeight: 600,
  color: colors.text,
  margin: 0,
};

export const textStyle: CSSProperties = {
  fontSize: 14,
  color: colors.textMuted,
  lineHeight: 1.6,
  maxWidth: 460,
  margin: 0,
};

export const commandStyle: CSSProperties = {
  fontFamily: fonts.mono,
  fontSize: 13,
  fontWeight: 600,
  color: colors.accentBright,
  background: 'rgba(212,168,67,0.1)',
  border: '1px solid rgba(212,168,67,0.4)',
  borderRadius: radii.pill,
  padding: '6px 14px',
};
