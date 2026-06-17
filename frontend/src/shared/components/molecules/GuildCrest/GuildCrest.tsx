import type { CSSProperties } from 'react';
import { emblemBack, emblemUp } from '../../../assets/emblems';
import { fonts } from '../../../theme/tokens';
import type { Guild, GuildEmblem } from '../../../types';
import { StateBadge } from '../../atoms/StateBadge/StateBadge';
import { contourStyle, crestStyle, fondStyle, symbolStyle } from './GuildCrest.styles';

const FOND_DEFAUT = '#C9363A';
const SYMBOLE_DEFAUT = '#E8C877';

export interface EmblemCrestProps {
  emblem: GuildEmblem;
  size?: number;
}

/**
 * Écusson composite seul : forme du fond teintée + asset d'origine (contour/ombrage) multiplié
 * par-dessus + symbole teinté centré. Réutilisé par le blason complet et l'aperçu du panel.
 */
export function EmblemCrest({ emblem, size = 64 }: EmblemCrestProps) {
  const back = emblemBack(emblem.back);
  const up = emblemUp(emblem.up);
  const fond = emblem.fond_couleur ?? FOND_DEFAUT;
  const symbole = emblem.symbole_couleur ?? SYMBOLE_DEFAUT;
  return (
    <div style={crestStyle(size)}>
      {back && <div style={fondStyle(back, fond)} />}
      {back && <img src={back} alt="" style={contourStyle} />}
      {up && <div style={symbolStyle(up, symbole)} />}
    </div>
  );
}

export interface GuildCrestProps {
  guild: Guild;
  /** Taille du blason (px). */
  crestSize?: number;
  style?: CSSProperties;
}

/** Blason composite + nom + niveau + pastille recrutement. */
export function GuildCrest({ guild, crestSize = 64, style }: GuildCrestProps) {
  return (
    <div style={{ display: 'flex', gap: 13, alignItems: 'center', ...style }}>
      <EmblemCrest emblem={guild.emblem} size={crestSize} />
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span
            style={{
              fontFamily: fonts.label,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontSize: 9,
              color: '#D4A843',
              fontWeight: 700,
            }}
          >
            Guilde
          </span>
          <span
            style={{
              fontFamily: fonts.label,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: 9,
              color: '#E8C877',
              fontWeight: 700,
            }}
          >
            Niv. {guild.niveau_guilde}
          </span>
        </div>
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 17,
            color: '#F0E8E0',
            lineHeight: 1.05,
          }}
        >
          {guild.nom}
        </div>
        <StateBadge variant={guild.recrutement} style={{ marginTop: 6, fontSize: 10 }} />
      </div>
    </div>
  );
}
