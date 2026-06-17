import type { CSSProperties } from 'react';
import { emblemBack, emblemUp } from '../../../assets/emblems';
import { fonts } from '../../../theme/tokens';
import type { Guild } from '../../../types';
import { StateBadge } from '../../atoms/StateBadge/StateBadge';
import { backStyle, crestStyle, upStyle } from './GuildCrest.styles';

export interface GuildCrestProps {
  guild: Guild;
  /** Taille du blason (px). */
  crestSize?: number;
  style?: CSSProperties;
}

/** Blason réel (fond d'écusson + symbole composités) + nom + niveau + pastille recrutement. */
export function GuildCrest({ guild, crestSize = 64, style }: GuildCrestProps) {
  const back = emblemBack(guild.emblem.back);
  const up = emblemUp(guild.emblem.up);
  return (
    <div style={{ display: 'flex', gap: 13, alignItems: 'center', ...style }}>
      <div style={crestStyle(crestSize)}>
        {back && <img src={back} alt="" style={backStyle} />}
        {up && <img src={up} alt="" style={upStyle} />}
      </div>
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
