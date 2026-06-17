import { CardShell, GuildCrest, Tag } from '@shared/components';
import type { Guild } from '@shared/types';

export interface GuildBannerModuleProps {
  guild: Guild;
}

/** Étendard de guilde complet : blason, recrutement, tags. */
export function GuildBannerModule({ guild }: GuildBannerModuleProps) {
  return (
    <CardShell suit="trefle" index={2} width={320} pattern={false}>
      <GuildCrest guild={guild} crestSize={62} />
      {guild.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 11 }}>
          {guild.tags.map((t, i) => (
            <Tag key={`${t}-${i}`} label={t} />
          ))}
        </div>
      )}
    </CardShell>
  );
}
