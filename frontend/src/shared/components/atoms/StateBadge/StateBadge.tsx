import type { CSSProperties } from 'react';
import { badgeStyle, dotStyle, VARIANTS, type BadgeVariant } from './StateBadge.styles';

export interface StateBadgeProps {
  variant: BadgeVariant;
  /** Surcharge le libellé par défaut de la variante. */
  label?: string;
  style?: CSSProperties;
}

/**
 * Pastille d'état réutilisable — progression Dofus (complete / on_going / not_started)
 * ou recrutement de guilde (open / on_request / closed).
 */
export function StateBadge({ variant, label, style }: StateBadgeProps) {
  const v = VARIANTS[variant];
  return (
    <span style={{ ...badgeStyle(variant), ...style }}>
      {v.dot && <span style={dotStyle(v.dot)} />}
      {label ?? v.label}
    </span>
  );
}
