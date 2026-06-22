/**
 * Visuel overlay du module Fiche perso : cadre « carte à jouer » (pique) avec le buste de
 * classe (Avatar), le nom du perso, sa classe, son serveur, son niveau et ses points de succès.
 * Purement présentationnel ; lit `profile.perso`. Réutilisé comme aperçu dans le panel.
 */
import { classCharacter, classIcon } from '@shared/assets/classes';
import { Avatar } from '@shared/components/atoms/Avatar/Avatar';
import { CardShell } from '@shared/components/molecules/CardShell/CardShell';
import { CLASS_LABELS } from '@shared/constants';
import { colors } from '@shared/theme/tokens';
import type { Profile } from '@shared/types';
import {
  classIconStyle,
  classLabelStyle,
  classLineStyle,
  headerStyle,
  kickerStyle,
  metaRowStyle,
  metaStyle,
  nameStyle,
  placeholderRingStyle,
  sepDotStyle,
  textColStyle,
} from './FicheModule.styles';

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
            </div>
          )}
          <div style={metaRowStyle}>
            {perso.serveur && (
              <>
                <span style={metaStyle}>{perso.serveur}</span>
                <span style={sepDotStyle} />
              </>
            )}
            <span style={metaStyle}>Niv. {perso.niveau}</span>
            <span style={sepDotStyle} />
            <span style={metaStyle}>{perso.pts_succes} succès</span>
          </div>
        </div>
      </div>
    </CardShell>
  );
}
