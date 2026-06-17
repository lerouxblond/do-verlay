import type { CSSProperties, KeyboardEvent } from 'react';
import { fieldStyle } from './Field.styles';

export interface FieldProps {
  type?: 'text' | 'number';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  title?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  style?: CSSProperties;
}

export interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  title?: string;
  style?: CSSProperties;
}

/** Champ de saisie brut (texte / nombre). */
export function Field({
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled,
  title,
  onKeyDown,
  style,
}: FieldProps) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      title={title}
      onKeyDown={onKeyDown}
      onChange={(e) => onChange(e.target.value)}
      style={{ ...fieldStyle, ...style }}
    />
  );
}

/** Sélecteur à liste fermée (ex. serveur). */
export function SelectField({ value, onChange, options, title, style }: SelectFieldProps) {
  return (
    <select
      value={value}
      title={title}
      onChange={(e) => onChange(e.target.value)}
      style={{ ...fieldStyle, ...style }}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
