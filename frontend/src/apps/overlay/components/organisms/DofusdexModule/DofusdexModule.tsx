import { CardShell, DofusCard, ProgressBar } from '@shared/components';
import { DOFUS_BY_ID } from '@shared/data/seed';
import { fonts } from '@shared/theme/tokens';
import type { DofusId, DofusState } from '@shared/types';

export interface DofusdexModuleProps {
  ordre: DofusId[];
  dofus: Record<DofusId, DofusState>;
  objectif?: string;
}

/** Module phare : objectif, compteur, plateau de Dofus dans l'ordre choisi, jauge. */
export function DofusdexModule({ ordre, dofus, objectif = 'Dofus Trophées' }: DofusdexModuleProps) {
  const list = ordre.map((id) => DOFUS_BY_ID[id]).filter(Boolean);
  const total = list.length;
  const done = list.filter((d) => dofus[d.id] === 'complete').length;

  return (
    <CardShell suit="carreau" index={1} width={380}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 11,
          paddingLeft: 14,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: fonts.label,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontSize: 9,
              color: '#D4A843',
              fontWeight: 700,
            }}
          >
            Objectif
          </div>
          <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 16, color: '#E8C877', lineHeight: 1 }}>
            {objectif}
          </div>
        </div>
        <div
          style={{
            fontFamily: fonts.label,
            fontWeight: 800,
            fontSize: 14,
            color: '#16100E',
            background: 'linear-gradient(180deg,#E8C877,#D4A843)',
            padding: '4px 11px',
            borderRadius: 999,
          }}
        >
          {done} / {total}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 6 }}>
        {list.map((d) => (
          <DofusCard key={d.id} dofus={d} state={dofus[d.id] ?? 'not_started'} />
        ))}
      </div>
      <ProgressBar value={done} max={total} height={8} style={{ marginTop: 12 }} />
    </CardShell>
  );
}
