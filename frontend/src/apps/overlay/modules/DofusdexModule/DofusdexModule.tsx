/**
 * Visuel overlay du module Dofusdex : cadre « carte à jouer » (carreau) avec le libellé
 * d'objectif, une jauge de progression et la grille des Dofus suivis (icône + état).
 * Deux formats : `vertical` (portrait, défaut) et `horizontal` (bannière paysage, en-tête à
 * gauche). Lit le profil ; aucun état runtime ici. Réutilisé comme aperçu dans le panel.
 */
import { CardShell } from '@shared/components/molecules/CardShell/CardShell';
import { DofusCard } from '@shared/components/molecules/DofusCard/DofusCard';
import { ProgressBar } from '@shared/components/atoms/ProgressBar/ProgressBar';
import { MODULES } from '@shared/constants';
import { DOFUS_BY_ID } from '@shared/data/dofus';
import type { ModuleLayout, Profile } from '@shared/types';
import {
  countStyle,
  emptyStyle,
  gridStyle,
  headStyle,
  kickerStyle,
  leftColStyle,
  progRowStyle,
  progStackStyle,
  rightColStyle,
  rowLayoutStyle,
  titleStyle,
} from './DofusdexModule.styles';

export interface DofusdexModuleProps {
  profile: Profile;
  /** Surcharge le format du profil (sinon `profile.dofusdex_format`). */
  layout?: ModuleLayout;
  /** Largeur du cadre (px). Défaut selon le format. */
  width?: number;
  /** Taille des icônes (px). Défaut selon le format. */
  cell?: number;
}

export function DofusdexModule({ profile, layout, width, cell }: DofusdexModuleProps) {
  const fmt: ModuleLayout = layout ?? profile.dofusdex_format ?? 'vertical';
  const horizontal = fmt === 'horizontal';

  const ids = profile.ordre;
  const obtenus = ids.filter((id) => profile.dofus[id] === 'complete').length;
  const objectif = profile.dofusdex_objectif?.trim();

  const w = width ?? (horizontal ? 620 : 340);
  const c = cell ?? (horizontal ? 42 : 46);
  const cols = Math.min(horizontal ? 8 : 6, Math.max(1, ids.length || 1));

  const header = (
    <div style={headStyle}>
      <div style={kickerStyle}>{MODULES.dofusdex.name}</div>
      <h2 style={titleStyle}>{objectif || 'Progression des Dofus'}</h2>
    </div>
  );

  const progress = (
    <ProgressBar value={obtenus} max={ids.length} style={{ flex: 1 }} />
  );
  const count = (
    <span style={countStyle}>
      {obtenus}/{ids.length}
    </span>
  );

  const grid =
    ids.length === 0 ? (
      <div style={emptyStyle}>Aucun Dofus suivi.</div>
    ) : (
      <div style={gridStyle(cols)}>
        {ids.map((id) => {
          const dofus = DOFUS_BY_ID[id];
          if (!dofus) return null;
          return (
            <DofusCard key={id} dofus={dofus} state={profile.dofus[id] ?? 'not_started'} size={c} />
          );
        })}
      </div>
    );

  return (
    <CardShell suit="carreau" topStrip={false} width={w}>
      {horizontal ? (
        <div style={rowLayoutStyle}>
          <div style={leftColStyle}>
            {header}
            <div style={progStackStyle}>
              {progress}
              {count}
            </div>
          </div>
          <div style={rightColStyle}>{grid}</div>
        </div>
      ) : (
        <>
          {header}
          <div style={progRowStyle}>
            {progress}
            {count}
          </div>
          {grid}
        </>
      )}
    </CardShell>
  );
}
