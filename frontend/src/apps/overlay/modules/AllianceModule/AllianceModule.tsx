/**
 * Visuel overlay du module Alliance : cadre « carte à jouer » (trèfle) avec le blason composite
 * + nom + acronyme + pastille de recrutement (via AllianceCrest), et, si le recrutement est
 * ouvert, les conditions/tags. Purement présentationnel ; lit `profile.alliance`.
 * Réutilisé comme aperçu dans le panel.
 */
import { CardShell } from '@shared/components/molecules/CardShell/CardShell';
import { AllianceCrest } from '@shared/components/molecules/GuildCrest/GuildCrest';
import { Tag } from '@shared/components/atoms/Tag/Tag';
import type { Profile } from '@shared/types';
import { condLabelStyle, crestStyle, tagsStyle } from './AllianceModule.styles';

export interface AllianceModuleProps {
  profile: Profile;
  width?: number;
}

export function AllianceModule({ profile, width = 340 }: AllianceModuleProps) {
  const alliance = profile.alliance;
  const recrute = alliance.recrutement !== 'closed';
  const tags = alliance.tags ?? [];

  return (
    <CardShell suit="trefle" topStrip={false} width={width}>
      <AllianceCrest alliance={alliance} crestSize={58} style={crestStyle} />
      {recrute && tags.length > 0 && (
        <>
          <div style={condLabelStyle}>Recrutement</div>
          <div style={tagsStyle}>
            {tags.map((t) => (
              <Tag key={t} label={t} />
            ))}
          </div>
        </>
      )}
    </CardShell>
  );
}
