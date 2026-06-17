import type { CSSProperties } from 'react';
import { colors, fonts, radii } from '@shared/theme/tokens';

export const fieldStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 7,
};

export const labelStyle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontSize: 12,
  fontWeight: 700,
  color: colors.accent,
};

export const hintStyle: CSSProperties = {
  fontSize: 12,
  color: colors.textMuted,
  lineHeight: 1.5,
};

export const inputStyle: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 14,
  color: colors.text,
  background: colors.bg,
  border: `1px solid ${colors.border}`,
  borderRadius: radii.md,
  padding: '11px 13px',
  outline: 'none',
  width: '100%',
};

export const selectStyle: CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage:
    'linear-gradient(45deg, transparent 50%, #D4A843 50%), linear-gradient(135deg, #D4A843 50%, transparent 50%)',
  backgroundPosition: 'calc(100% - 18px) center, calc(100% - 13px) center',
  backgroundSize: '5px 5px, 5px 5px',
  backgroundRepeat: 'no-repeat',
  paddingRight: 34,
};

/* --- Stepper numérique --- */
export const stepperStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 2,
  border: `1px solid ${colors.border}`,
  borderRadius: radii.md,
  background: colors.bg,
  overflow: 'hidden',
};

export const stepBtnStyle = (disabled: boolean): CSSProperties => ({
  fontFamily: fonts.label,
  fontSize: 18,
  fontWeight: 700,
  lineHeight: 1,
  width: 38,
  height: 40,
  border: 'none',
  background: 'transparent',
  color: disabled ? colors.textFaint : colors.accent,
  cursor: disabled ? 'not-allowed' : 'pointer',
});

export const stepValueStyle: CSSProperties = {
  fontFamily: fonts.mono,
  fontSize: 15,
  fontWeight: 600,
  color: colors.text,
  minWidth: 44,
  textAlign: 'center',
};

export const stepSuffixStyle: CSSProperties = {
  fontFamily: fonts.label,
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: colors.textMuted,
  paddingRight: 12,
};

/* --- Toggle --- */
export const toggleRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
};

export const toggleTrackStyle = (on: boolean): CSSProperties => ({
  position: 'relative',
  width: 46,
  height: 26,
  flex: 'none',
  borderRadius: radii.pill,
  border: `1px solid ${on ? colors.accent : colors.border}`,
  background: on ? 'linear-gradient(180deg,#E2C06A,#D4A843)' : colors.surfaceAlt,
  cursor: 'pointer',
  transition: 'background 0.18s ease, border-color 0.18s ease',
  padding: 0,
});

export const toggleKnobStyle = (on: boolean): CSSProperties => ({
  position: 'absolute',
  top: 2,
  left: on ? 22 : 2,
  width: 20,
  height: 20,
  borderRadius: '50%',
  background: on ? '#2A1B08' : colors.text,
  transition: 'left 0.18s ease',
});

export const toggleLabelStyle: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 14,
  color: colors.text,
};

/* --- Segment d'état (À faire / En cours / Obtenu) --- */
export const segmentWrapStyle: CSSProperties = {
  display: 'inline-flex',
  border: `1px solid ${colors.border}`,
  borderRadius: radii.md,
  overflow: 'hidden',
  background: colors.bg,
};

interface SegmentTone {
  color: string;
  bg: string;
}

export const SEGMENT_TONES: Record<'not_started' | 'on_going' | 'complete', SegmentTone> = {
  not_started: { color: colors.textMuted, bg: 'rgba(154,138,132,0.18)' },
  on_going: { color: '#F2B970', bg: 'rgba(232,136,28,0.20)' },
  complete: { color: colors.accentBright, bg: 'rgba(212,168,67,0.22)' },
};

export const segmentBtnStyle = (active: boolean, tone: SegmentTone): CSSProperties => ({
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  fontSize: 10.5,
  fontWeight: 700,
  padding: '6px 9px',
  border: 'none',
  borderRight: `1px solid ${colors.border}`,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  background: active ? tone.bg : 'transparent',
  color: active ? tone.color : colors.textFaint,
  boxShadow: active ? `inset 0 -2px 0 ${tone.color}` : 'none',
});
