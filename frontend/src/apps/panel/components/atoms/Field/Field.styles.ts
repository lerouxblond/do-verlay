import type { CSSProperties } from 'react';
import { fonts, radii } from '@shared/theme/tokens';

export const fieldStyle: CSSProperties = {
  width: '100%',
  minWidth: 0,
  background: '#0D0A0E',
  border: '1px solid rgba(212,168,67,0.35)',
  color: '#F0E8E0',
  borderRadius: radii.md,
  padding: '9px 11px',
  fontSize: 14,
  fontFamily: fonts.body,
};
