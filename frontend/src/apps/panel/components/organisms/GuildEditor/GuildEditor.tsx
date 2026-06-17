import type { CSSProperties } from 'react';
import { GuildCrest } from '@shared/components';
import { emblemBackIds, emblemUpIds } from '@shared/assets';
import { MAX_TAGS } from '@shared/constants';
import { fonts } from '@shared/theme/tokens';
import type { Guild } from '@shared/types';
import { Field } from '../../atoms/Field/Field';
import { FormField } from '../../molecules/FormField/FormField';
import { RecruitSegmented } from '../../molecules/RecruitSegmented/RecruitSegmented';
import { TagGroup } from '../../molecules/TagGroup/TagGroup';

export interface GuildEditorProps {
  guild: Guild;
  /** Applique une mutation au brouillon de guilde. */
  update: (recipe: (g: Guild) => void) => void;
}

const box: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 11,
  background: '#1A1219',
  border: '1px solid rgba(212,168,67,0.2)',
  borderRadius: 11,
  padding: 13,
};
const arrow: CSSProperties = {
  width: 24,
  height: 24,
  borderRadius: 6,
  border: '1px solid rgba(212,168,67,0.3)',
  background: 'transparent',
  color: '#E8C877',
  cursor: 'pointer',
  fontSize: 11,
};

/** cycle un id dans une liste triée (avec bouclage). */
function step(ids: number[], current: number, dir: 1 | -1): number {
  if (!ids.length) return current;
  const i = ids.indexOf(current);
  const next = (i < 0 ? 0 : i + dir + ids.length) % ids.length;
  return ids[next];
}

/** Formulaire de l'étendard : blason, nom, niveau, recrutement, tags. */
export function GuildEditor({ guild, update }: GuildEditorProps) {
  return (
    <div>
      <div
        style={{
          fontFamily: fonts.label,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          fontSize: 11,
          fontWeight: 800,
          color: '#D4A843',
          marginBottom: 8,
        }}
      >
        ♣ Étendard — guilde
      </div>
      <div style={box}>
        {/* Blason réel : sélection back + up dans la bibliothèque d'emblèmes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <GuildCrest guild={guild} crestSize={56} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 52, fontSize: 11, color: 'rgba(240,232,224,0.55)' }}>Écusson</span>
              <button type="button" style={arrow} onClick={() => update((g) => (g.emblem.back = step(emblemBackIds, g.emblem.back, -1)))}>
                ◀
              </button>
              <span style={{ fontFamily: fonts.mono, fontSize: 11, color: '#E8C877', width: 34, textAlign: 'center' }}>
                {guild.emblem.back}
              </span>
              <button type="button" style={arrow} onClick={() => update((g) => (g.emblem.back = step(emblemBackIds, g.emblem.back, 1)))}>
                ▶
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 52, fontSize: 11, color: 'rgba(240,232,224,0.55)' }}>Symbole</span>
              <button type="button" style={arrow} onClick={() => update((g) => (g.emblem.up = step(emblemUpIds, g.emblem.up, -1)))}>
                ◀
              </button>
              <span style={{ fontFamily: fonts.mono, fontSize: 11, color: '#E8C877', width: 34, textAlign: 'center' }}>
                {guild.emblem.up}
              </span>
              <button type="button" style={arrow} onClick={() => update((g) => (g.emblem.up = step(emblemUpIds, g.emblem.up, 1)))}>
                ▶
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 9 }}>
          <Field
            value={guild.nom}
            onChange={(v) => update((g) => (g.nom = v))}
            placeholder="Nom de la guilde"
          />
          <Field
            type="number"
            value={String(guild.niveau_guilde)}
            onChange={(v) => update((g) => (g.niveau_guilde = clampLevel(v)))}
            title="Niveau de guilde"
            style={{ width: 70, textAlign: 'center', fontFamily: fonts.mono, color: '#E8C877' }}
          />
        </div>

        <FormField label="Recrutement">
          <RecruitSegmented value={guild.recrutement} onChange={(v) => update((g) => (g.recrutement = v))} />
        </FormField>

        <TagGroup
          tags={guild.tags}
          max={MAX_TAGS}
          onAdd={(label) => update((g) => g.tags.length < MAX_TAGS && g.tags.push(label))}
          onRemove={(i) => update((g) => g.tags.splice(i, 1))}
        />
      </div>
    </div>
  );
}

function clampLevel(v: string): number {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return 1;
  return Math.min(200, Math.max(1, n));
}
