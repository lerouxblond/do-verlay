import type { CSSProperties } from 'react';
import { colors, fonts, lattice } from '@shared/theme/tokens';

export const shellStyle: CSSProperties = {
  display: 'flex',
  minHeight: '100vh',
  color: colors.text,
  backgroundColor: colors.bg,
  backgroundImage: lattice(),
};

export const mainStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
};

export const contentStyle: CSSProperties = {
  flex: 1,
  padding: '28px 28px 64px',
  maxWidth: 880,
  width: '100%',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
};

export const headingStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  marginBottom: 4,
};

export const headingTitleStyle: CSSProperties = {
  fontFamily: fonts.title,
  fontSize: 27,
  fontWeight: 700,
  color: colors.text,
  margin: 0,
};

export const headingSubStyle: CSSProperties = {
  fontSize: 14,
  color: colors.textMuted,
  marginTop: 2,
};
