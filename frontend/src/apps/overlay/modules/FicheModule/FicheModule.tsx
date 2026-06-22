/**
 * Visuel overlay du module Fiche perso — une carte unique « fiche de personnage » :
 * en-tête identité (buste de classe genré + nom + classe · sexe) puis un **bandeau de stats**
 * incrusté (Serveur · Niveau · Succès) séparé par des filets dorés. Purement présentationnel ;
 * lit `profile.perso`. Réutilisé comme aperçu dans le panel.
 */
import { classCharacter, classIcon } from '@shared/assets/classes';
import { Avatar } from '@shared/components/atoms/Avatar/Avatar';
import { CardShell } from '@shared/components/molecules/CardShell/CardShell';
import { CLASS_LABELS } from '@shared/constants';
import { colors } from '@shared/theme/tokens';
import type { Gender, Profile } from '@shared/types';
import {
  classIconStyle,
  classLabelStyle,
  classLineStyle,
  genderGlyphStyle,
  headerStyle,
  kickerStyle,
  nameStyle,
  placeholderRingStyle,
  statBandStyle,
  statCellStyle,
  statDividerStyle,
  statLabelStyle,
  statValueStyle,
  textColStyle,
} from './FicheModule.styles';

const NUM = new Intl.NumberFormat('fr-FR');
const GENDER_GLYPH: Record<Gender, string> = { male: '♂', female: '♀' };

export interface FicheModuleProps {
  profile: Profile;
  width?: number;
}

export function FicheModule({ profile, width = 320 }: FicheModuleProps) {
  const perso = profile.perso;
  const classe = perso.classe;
  const portrait = classe ? classCharacter(classe, perso.genre) : '';
  const icon = classe ? classIcon(classe) : '';
  const classLabel = classe ? (CLASS_LABELS[classe as keyof typeof CLASS_LABELS] ?? classe) : '';

  return (
    <CardShell suit="pique" topStrip={false} width={width}>
      <div style={headerStyle}>
        {portrait ? (
          <Avatar src={portrait} size={64} ring={colors.accent} alt={classLabel} />
        ) : (
          <div style={placeholderRingStyle(64)}>♠</div>
        )}
        <div style={textColStyle}>
          <span style={kickerStyle}>Fiche perso</span>
          <div style={nameStyle}>{perso.nom || 'Sans nom'}</div>
          {classLabel && (
            <div style={classLineStyle}>
              {icon && (
                <img src={icon} alt="" style={classIconStyle} loading="lazy" decoding="async" />
              )}
              <span style={classLabelStyle}>{classLabel}</span>
              <span style={genderGlyphStyle} aria-hidden>
                {GENDER_GLYPH[perso.genre]}
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={statBandStyle}>
        <div style={statCellStyle}>
          <span style={statLabelStyle}>Serveur</span>
          <span style={statValueStyle}>{perso.serveur || '—'}</span>
        </div>
        <div style={statDividerStyle} />
        <div style={statCellStyle}>
          <span style={statLabelStyle}>Niveau</span>
          <span style={statValueStyle}>{perso.niveau}</span>
        </div>
        <div style={statDividerStyle} />
        <div style={statCellStyle}>
          <span style={statLabelStyle}>Succès</span>
          <span style={statValueStyle}>{NUM.format(perso.pts_succes)}</span>
        </div>
      </div>
    </CardShell>
  );
}
