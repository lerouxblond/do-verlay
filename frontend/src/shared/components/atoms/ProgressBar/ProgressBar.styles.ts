import type { CSSProperties } from 'react';

export const trackStyle = (height: number): CSSProperties => ({
  height,
  borderRadius: height / 2,
  background: '#221620',
  border: '1px solid #3D2B36',
  overflow: 'hidden',
});

export const fillStyle = (pct: number): CSSProperties => ({
  height: '100%',
  width: `${pct}%`,
  backgroundColor: '#C9363A',
  // Motif harlequin doré qui « avance ».
  backgroundImage:
    'linear-gradient(45deg, rgba(212,168,67,0.45) 25%, transparent 25% 50%, rgba(212,168,67,0.45) 50% 75%, transparent 75%)',
  backgroundSize: '14px 14px',
  transition: 'width .35s ease',
});
