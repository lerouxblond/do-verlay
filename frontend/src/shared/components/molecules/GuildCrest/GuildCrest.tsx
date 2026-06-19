import type { CSSProperties } from 'react';
import { contourUrl, fondUrl, symboleUrl, type EmblemVariant } from '../../../assets/emblems';
import { fonts } from '../../../theme/tokens';
import type { Alliance, Guild, GuildEmblem, RecruitState } from '../../../types';
import { StateBadge } from '../../atoms/StateBadge/StateBadge';
import { contourStyle, crestStyle, fondStyle, symbolStyle } from './GuildCrest.styles';

const FOND_DEFAUT = '#C9363A';
const SYMBOLE_DEFAUT = '#E8C877';

export interface EmblemCrestProps {
  emblem: GuildEmblem;
  /** Jeu de contours à utiliser (guilde par défaut). */
  variant?: EmblemVariant;
  size?: number;
}

/**
 * Écusson composite seul : forme du fond teintée + contour d'origine (cadre/ombrage) multiplié
 * par-dessus + symbole teinté centré. Réutilisé par les blasons complets et l'aperçu du panel.
 */
export function EmblemCrest({ emblem, variant = 'guild', size = 64 }: EmblemCrestProps) {
  const fond = fondUrl(emblem.back);
  const contour = contourUrl(variant, emblem.back);
  const symbole = symboleUrl(emblem.up);
  const fondColor = emblem.fond_couleur ?? FOND_DEFAUT;
  const symColor = emblem.symbole_couleur ?? SYMBOLE_DEFAUT;
  return (
    <div style={crestStyle(size)}>
      {fond && <div style={fondStyle(fond, fondColor)} />}
      {contour && <img src={contour} alt="" style={contourStyle} loading="lazy" decoding="async" />}
      {symbole && <div style={symbolStyle(symbole, symColor)} />}
    </div>
  );
}

const kickerStyle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  fontSize: 9,
  color: '#D4A843',
  fontWeight: 700,
};
const metaStyle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  fontSize: 9,
  color: '#E8C877',
  fontWeight: 700,
};
const nameStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 700,
  fontSize: 17,
  color: '#F0E8E0',
  lineHeight: 1.05,
};

export interface CrestHeaderProps {
  /** Libellé d'enseigne (« Guilde » / « Alliance »). */
  label: string;
  /** Métadonnée à droite du libellé (ex. « Niv. 12 » ou « [ABC] »). */
  meta?: string;
  nom: string;
  recrutement: RecruitState;
}

/** En-tête textuel d'un blason : enseigne + métadonnée + nom + pastille de recrutement. */
export function CrestHeader({ label, meta, nom, recrutement }: CrestHeaderProps) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={kickerStyle}>{label}</span>
        {meta && <span style={metaStyle}>{meta}</span>}
      </div>
      <div style={nameStyle}>{nom}</div>
      <StateBadge variant={recrutement} style={{ marginTop: 6, fontSize: 10 }} />
    </div>
  );
}

export interface GuildCrestProps {
  guild: Guild;
  /** Taille du blason (px). */
  crestSize?: number;
  style?: CSSProperties;
}

/** Blason de guilde composite + nom + niveau + pastille recrutement. */
export function GuildCrest({ guild, crestSize = 64, style }: GuildCrestProps) {
  return (
    <div style={{ display: 'flex', gap: 13, alignItems: 'center', ...style }}>
      <EmblemCrest emblem={guild.emblem} variant="guild" size={crestSize} />
      <CrestHeader
        label="Guilde"
        meta={`Niv. ${guild.niveau_guilde}`}
        nom={guild.nom}
        recrutement={guild.recrutement}
      />
    </div>
  );
}

export interface AllianceCrestProps {
  alliance: Alliance;
  crestSize?: number;
  style?: CSSProperties;
}

/** Blason d'alliance composite + nom + acronyme + pastille recrutement. */
export function AllianceCrest({ alliance, crestSize = 64, style }: AllianceCrestProps) {
  return (
    <div style={{ display: 'flex', gap: 13, alignItems: 'center', ...style }}>
      <EmblemCrest emblem={alliance.emblem} variant="alliance" size={crestSize} />
      <CrestHeader
        label="Alliance"
        meta={alliance.acronyme ? `[${alliance.acronyme}]` : undefined}
        nom={alliance.nom}
        recrutement={alliance.recrutement}
      />
    </div>
  );
}
