/**
 * Visuel overlay du module Étendard de guilde : cadre « carte à jouer » (trèfle) avec le
 * blason composite + nom + niveau + pastille de recrutement (via GuildCrest), et, si le
 * recrutement est ouvert, les conditions/tags. Purement présentationnel ; lit `profile.guild`.
 * Réutilisé comme aperçu dans le panel.
 */
import { CardShell } from '@shared/components/molecules/CardShell/CardShell';
import { GuildCrest } from '@shared/components/molecules/GuildCrest/GuildCrest';
import { Tag } from '@shared/components/atoms/Tag/Tag';
import type { Profile } from '@shared/types';
import { condLabelStyle, crestStyle, tagsStyle } from './EtendardModule.styles';

export interface EtendardModuleProps {
  profile: Profile;
  width?: number;
}

export function EtendardModule({ profile, width = 340 }: EtendardModuleProps) {
  const guild = profile.guild;
  const recrute = guild.recrutement !== 'closed';
  const tags = guild.tags ?? [];

  return (
    <CardShell suit="trefle" topStrip={false} width={width}>
      <GuildCrest guild={guild} crestSize={58} style={crestStyle} />
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
