/**
 * Contrôles de formulaire du panel (atomes utilitaires, thème chapiteau).
 * Inline-styles façon design system ; focus géré par `.dv-field-input` (fonts.css).
 */
import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react';
import type { DofusState } from '@shared/types';
import {
  colorInputStyle,
  colorRowStyle,
  colorValueStyle,
  fieldStyle,
  hintStyle,
  inputStyle,
  labelStyle,
  segmentBtnStyle,
  SEGMENT_TONES,
  segmentWrapStyle,
  selectStyle,
  stepBtnStyle,
  stepperStyle,
  stepSuffixStyle,
  stepValueStyle,
  toggleKnobStyle,
  toggleLabelStyle,
  toggleRowStyle,
  toggleTrackStyle,
} from './controls.styles';

export interface FieldProps {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
}

/** Bloc « libellé + champ + aide » vertical. */
export function Field({ label, hint, htmlFor, children }: FieldProps) {
  return (
    <div style={fieldStyle}>
      <label style={labelStyle} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && <span style={hintStyle}>{hint}</span>}
    </div>
  );
}

export type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'style'>;

/** Champ texte standard du panel. */
export function TextInput(props: TextInputProps) {
  return <input {...props} className="dv-field-input" style={inputStyle} />;
}

export interface SelectInputProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'style' | 'children'> {
  options: { value: string; label: string }[];
}

/** Liste déroulante stylée (flèche dorée). */
export function SelectInput({ options, ...rest }: SelectInputProps) {
  return (
    <select {...rest} className="dv-field-input" style={selectStyle}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export interface ColorInputProps {
  value: string;
  onChange: (value: string) => void;
}

/** Sélecteur de couleur (pastille native). */
export function ColorInput({ value, onChange }: ColorInputProps) {
  return (
    <div style={colorRowStyle}>
      <input
        type="color"
        value={value}
        style={colorInputStyle}
        onChange={(e) => onChange(e.target.value)}
      />
      <span style={colorValueStyle}>{value}</span>
    </div>
  );
}

export interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}

/** Compteur −/+ borné (sans saisie clavier, pour les réglages simples). */
export function NumberStepper({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  suffix,
}: NumberStepperProps) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));
  return (
    <div style={stepperStyle}>
      <button
        type="button"
        style={stepBtnStyle(value <= min)}
        disabled={value <= min}
        onClick={dec}
        aria-label="Diminuer"
      >
        −
      </button>
      <span style={stepValueStyle}>{value}</span>
      <button
        type="button"
        style={stepBtnStyle(value >= max)}
        disabled={value >= max}
        onClick={inc}
        aria-label="Augmenter"
      >
        +
      </button>
      {suffix && <span style={stepSuffixStyle}>{suffix}</span>}
    </div>
  );
}

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

/** Interrupteur or/velours. */
export function Toggle({ checked, onChange, label }: ToggleProps) {
  const id = useId();
  return (
    <div style={toggleRowStyle}>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        style={toggleTrackStyle(checked)}
        onClick={() => onChange(!checked)}
      >
        <span style={toggleKnobStyle(checked)} />
      </button>
      {label && (
        <label htmlFor={id} style={toggleLabelStyle}>
          {label}
        </label>
      )}
    </div>
  );
}

const STATE_SEGMENTS: { value: DofusState; label: string }[] = [
  { value: 'not_started', label: 'À faire' },
  { value: 'on_going', label: 'En cours' },
  { value: 'complete', label: 'Obtenu' },
];

export interface StateSegmentProps {
  value: DofusState;
  onChange: (value: DofusState) => void;
}

/** Segment d'état d'un Dofus — 3 options explicites (plus clair qu'un cycle au clic). */
export function StateSegment({ value, onChange }: StateSegmentProps) {
  return (
    <div style={segmentWrapStyle} role="group">
      {STATE_SEGMENTS.map((s) => (
        <button
          key={s.value}
          type="button"
          style={segmentBtnStyle(value === s.value, SEGMENT_TONES[s.value])}
          aria-pressed={value === s.value}
          onClick={() => onChange(s.value)}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
