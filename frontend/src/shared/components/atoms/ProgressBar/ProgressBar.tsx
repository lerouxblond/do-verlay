import type { CSSProperties } from 'react';
import { fillStyle, trackStyle } from './ProgressBar.styles';

export interface ProgressBarProps {
  value: number;
  max: number;
  height?: number;
  style?: CSSProperties;
}

/** Jauge harlequin de progression (rouge + losanges or). */
export function ProgressBar({ value, max, height = 12, style }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      style={{ ...trackStyle(height), ...style }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div style={fillStyle(pct)} />
    </div>
  );
}
