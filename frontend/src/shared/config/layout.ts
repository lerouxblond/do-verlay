/**
 * Cycle de vie d'une disposition (« layout ») : placements libres des modules, indépendants
 * du profil. Plomberie partagée par le store, le ConfigProvider et l'éditeur — plus les
 * helpers d'ancrage réutilisés au rendu (overlay) ET dans l'éditeur (panel).
 */
import { LAYOUT_MARGIN_PCT, MODULE_ORDER } from '../constants';
import type { AnchorPoint, AnchorZone, Layout, ModulePlacement, ModuleType, Profile } from '../types';

/** Clone profond d'une disposition (structuredClone avec repli JSON). */
export const cloneLayout = (l: Layout): Layout =>
  typeof structuredClone === 'function'
    ? structuredClone(l)
    : (JSON.parse(JSON.stringify(l)) as Layout);

export const ANCHOR_POINTS: AnchorPoint[] = [
  'TL',
  'TC',
  'TR',
  'ML',
  'MC',
  'MR',
  'BL',
  'BC',
  'BR',
];

/** Fraction de l'axe horizontal pour le coin d'ancrage (0 = gauche, .5 = centre, 1 = droite). */
const H_FRAC: Record<string, number> = { L: 0, C: 0.5, R: 1 };
const V_FRAC: Record<string, number> = { T: 0, M: 0.5, B: 1 };
const H_ORIGIN: Record<string, string> = { L: 'left', C: 'center', R: 'right' };
const V_ORIGIN: Record<string, string> = { T: 'top', M: 'center', B: 'bottom' };

/** Décompose un point d'ancrage en ses fractions/origines d'axe. */
export const anchorAxes = (anchor: AnchorPoint) => {
  const v = anchor[0];
  const h = anchor[1];
  return { hFrac: H_FRAC[h], vFrac: V_FRAC[v], origin: `${H_ORIGIN[h]} ${V_ORIGIN[v]}` };
};

/** Translation CSS qui aligne le coin d'ancrage du module sur le point (x,y). */
export const placementTranslate = (anchor: AnchorPoint): string => {
  const { hFrac, vFrac } = anchorAxes(anchor);
  return `translate(${-hFrac * 100}%, ${-vFrac * 100}%)`;
};

/** Conversion d'une ancienne zone d'ancrage en placement libre (pour migration). */
const ZONE_TO_PLACEMENT: Record<AnchorZone, ModulePlacement> = {
  HG: { xPct: LAYOUT_MARGIN_PCT.x, yPct: LAYOUT_MARGIN_PCT.y, anchor: 'TL', scale: 1 },
  HD: { xPct: 100 - LAYOUT_MARGIN_PCT.x, yPct: LAYOUT_MARGIN_PCT.y, anchor: 'TR', scale: 1 },
  BG: { xPct: LAYOUT_MARGIN_PCT.x, yPct: 100 - LAYOUT_MARGIN_PCT.y, anchor: 'BL', scale: 1 },
  BD: { xPct: 100 - LAYOUT_MARGIN_PCT.x, yPct: 100 - LAYOUT_MARGIN_PCT.y, anchor: 'BR', scale: 1 },
  BAS: { xPct: 50, yPct: 100 - LAYOUT_MARGIN_PCT.y, anchor: 'BC', scale: 1 },
};

/** Zone par défaut d'un module (repli quand aucun profil ne fournit d'ancienne zone). */
const FALLBACK_ZONE: Record<ModuleType, AnchorZone> = {
  dofusdex: 'HD',
  etendard: 'BG',
  alliance: 'BD',
  fiche: 'BD',
  generique: 'BAS',
};

export const placementFromZone = (zone: AnchorZone): ModulePlacement => ({ ...ZONE_TO_PLACEMENT[zone] });

/**
 * Disposition de départ : dérivée des anciennes zones d'ancrage du profil fourni (migration),
 * sinon des zones par défaut. Couvre tous les modules du référentiel.
 */
export const createDefaultLayout = (id = 'disposition-1', profile?: Profile): Layout => ({
  id,
  nom: 'Disposition par défaut',
  placements: Object.fromEntries(
    MODULE_ORDER.map((m) => {
      const zone = profile?.modules?.[m]?.zone_ancrage ?? FALLBACK_ZONE[m];
      return [m, placementFromZone(zone)];
    }),
  ) as Record<ModuleType, ModulePlacement>,
});

/**
 * Complète une disposition persistée/importée avec les placements manquants (nouveaux modules,
 * fichier d'une version antérieure). Conserve les placements existants. Analogue à `normalizeProfile`.
 */
export const normalizeLayout = (raw: Layout): Layout => {
  const base = createDefaultLayout(raw.id);
  const placements = { ...base.placements };
  for (const m of MODULE_ORDER) {
    if (raw.placements?.[m]) placements[m] = { ...base.placements[m], ...raw.placements[m] };
  }
  return { ...base, ...raw, placements };
};
