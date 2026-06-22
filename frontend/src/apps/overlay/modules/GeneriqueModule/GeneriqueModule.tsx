/**
 * Visuel overlay du module Générique : carte « cœur » portant un message libre (code créateur,
 * annonce, engagement…) — surtitre optionnel + corps du message, avec une icône utilitaire
 * facultative à gauche. La taille (S/M/L) pilote la largeur de carte et le corps du texte.
 * Purement présentationnel ; lit `profile.generique`. Réutilisé comme aperçu dans le panel.
 */
import { util } from '@shared/assets/util';
import { CardShell } from '@shared/components/molecules/CardShell/CardShell';
import type { Profile } from '@shared/types';
import {
  contenuStyle,
  iconStyle,
  kickerStyle,
  placeholderContenuStyle,
  rowStyle,
  SIZE_PRESET,
  textColStyle,
} from './GeneriqueModule.styles';

export interface GeneriqueModuleProps {
  profile: Profile;
  width?: number;
}

export function GeneriqueModule({ profile, width }: GeneriqueModuleProps) {
  const g = profile.generique;
  const iconUrl = g.icone ? util(g.icone) : '';
  const cardWidth = width ?? SIZE_PRESET[g.taille].width;

  return (
    <CardShell suit="coeur" topStrip={false} width={cardWidth}>
      <div style={rowStyle}>
        {iconUrl && <img src={iconUrl} alt="" style={iconStyle} loading="lazy" decoding="async" />}
        <div style={textColStyle}>
          {g.kicker && <div style={kickerStyle}>{g.kicker}</div>}
          {g.contenu ? (
            <div style={contenuStyle(g.taille)}>{g.contenu}</div>
          ) : (
            <div style={placeholderContenuStyle(g.taille)}>Votre message ici</div>
          )}
        </div>
      </div>
    </CardShell>
  );
}
