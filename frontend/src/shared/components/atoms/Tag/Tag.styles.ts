import type { CSSProperties } from 'react';
import { fonts, radii } from '../../../theme/tokens';

export const tagStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  fontSize: 11,
  fontWeight: 600,
  whiteSpace: 'nowrap',
  color: '#E8C877',
  background: 'rgba(212,168,67,0.14)',
  border: '1px solid rgba(212,168,67,0.4)',
  borderRadius: radii.pill,
};

export const removeBtnStyle: CSSProperties = {
  border: 'none',
  background: 'transparent',
  color: 'rgba(240,232,224,0.5)',
  cursor: 'pointer',
  fontSize: 13,
  lineHeight: 1,
  padding: '0 2px',
};
