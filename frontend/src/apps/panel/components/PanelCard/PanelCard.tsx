import { useState, type CSSProperties, type ReactNode } from 'react';
import { SuitGlyph } from '@shared/components/atoms/SuitGlyph/SuitGlyph';
import type { Suit } from '@shared/theme/tokens';
import {
  bodyStyle,
  cardStyle,
  chevronStyle,
  headStyle,
  subStyle,
  titleAreaStyle,
  titleStyle,
} from './PanelCard.styles';

export interface PanelCardProps {
  title: string;
  sub?: string;
  suit?: Suit;
  /** Action posée en haut à droite (bouton, lien…). */
  action?: ReactNode;
  /** Rend la section repliable (en-tête cliquable + chevron). */
  collapsible?: boolean;
  /** État déplié initial (si repliable). Défaut : déplié. */
  defaultOpen?: boolean;
  children: ReactNode;
  style?: CSSProperties;
}

/** Carte de regroupement de réglages : titre + enseigne + corps, repliable au besoin. */
export function PanelCard({
  title,
  sub,
  suit,
  action,
  collapsible = false,
  defaultOpen = true,
  children,
  style,
}: PanelCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const showBody = !collapsible || open;
  const toggle = () => collapsible && setOpen((o) => !o);

  return (
    <section style={{ ...cardStyle, ...style }}>
      <header style={{ ...headStyle, marginBottom: showBody ? headStyle.marginBottom : 0 }}>
        {suit && <SuitGlyph suit={suit} size={22} style={{ marginTop: 2 }} />}
        <div
          style={titleAreaStyle(collapsible)}
          onClick={toggle}
          {...(collapsible ? { role: 'button', 'aria-expanded': open } : {})}
        >
          <h2 style={titleStyle}>{title}</h2>
          {sub && <p style={subStyle}>{sub}</p>}
        </div>
        {action}
        {collapsible && (
          <button
            type="button"
            style={chevronStyle(open)}
            onClick={toggle}
            aria-label={open ? 'Replier' : 'Déplier'}
            aria-expanded={open}
          >
            ▶
          </button>
        )}
      </header>
      {showBody && <div style={bodyStyle}>{children}</div>}
    </section>
  );
}
