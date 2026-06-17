import type { CSSProperties, ReactNode } from 'react';
import { fonts } from '@shared/theme/tokens';

export interface FormFieldProps {
  label: string;
  children: ReactNode;
  hint?: string;
  style?: CSSProperties;
}

const labelStyle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  fontSize: 10,
  fontWeight: 600,
  color: 'rgba(240,232,224,0.45)',
  marginBottom: 5,
  display: 'block',
};

/** Label + champ assemblés, avec aide optionnelle. */
export function FormField({ label, children, hint, style }: FormFieldProps) {
  return (
    <label style={{ display: 'block', ...style }}>
      <span style={labelStyle}>{label}</span>
      {children}
      {hint && (
        <span style={{ fontSize: 11, color: 'rgba(240,232,224,0.4)', marginTop: 4, display: 'block' }}>
          {hint}
        </span>
      )}
    </label>
  );
}
