import type { ButtonHTMLAttributes, CSSProperties } from 'react';
import { buttonStyle, type ButtonSize, type ButtonVariant } from './Button.styles';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: CSSProperties;
}

/** Action générique aux variantes du design system (primary or, fantôme, danger…). */
export function Button({
  variant = 'ghost',
  size = 'md',
  disabled,
  style,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={['dv-btn', className].filter(Boolean).join(' ')}
      style={{ ...buttonStyle(variant, size, disabled), ...style }}
      {...rest}
    >
      {children}
    </button>
  );
}
