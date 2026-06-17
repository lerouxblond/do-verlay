import type { CSSProperties } from 'react';

export const trackStyle = (checked: boolean): CSSProperties => ({
  flex: 'none',
  width: 42,
  height: 24,
  borderRadius: 999,
  border: 'none',
  cursor: 'pointer',
  position: 'relative',
  background: checked ? '#4CAF50' : 'rgba(154,138,132,0.4)',
});

export const knobStyle = (checked: boolean): CSSProperties => ({
  position: 'absolute',
  top: 3,
  left: checked ? undefined : 3,
  right: checked ? 3 : undefined,
  width: 18,
  height: 18,
  borderRadius: '50%',
  background: checked ? '#0D0A0E' : '#F0E8E0',
});
