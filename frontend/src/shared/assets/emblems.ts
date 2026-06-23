/**
 * Blasons de guilde / alliance — assets triés sous `assets/guild_alliance/` :
 * - `fonds/`            : formes de fond (remplissage teinté), partagées guilde + alliance.
 * - `guilde-countour/`  : contours (cadre/ombrage) appariés aux fonds par index, pour la guilde.
 * - `alliance-countour/`: contours appariés par index, pour l'alliance.
 * - `symboles/<cat>/`   : symboles (avant-plan teinté), rangés par catégorie.
 * Un blason = `back` (index de forme = fond + contour appariés) + `up` (id de symbole) + couleurs.
 */
import { baseName } from './glob';

const fondsGlob = import.meta.glob('../../assets/guild_alliance/fonds/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const guildeContourGlob = import.meta.glob('../../assets/guild_alliance/guilde-countour/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const allianceContourGlob = import.meta.glob('../../assets/guild_alliance/alliance-countour/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const symbolesGlob = import.meta.glob('../../assets/guild_alliance/symboles/*/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

/** Premier nombre du nom de fichier : 'fond-12'→12, 'countour-3'→3, '103-128'→103. */
const numKey = (path: string): number => Number(baseName(path).match(/\d+/)?.[0] ?? NaN);

/** Avant-dernier segment d'un chemin (= dossier parent / catégorie). */
const parentDir = (path: string): string => path.split('/').slice(-2, -1)[0] ?? '';

const toMap = (glob: Record<string, string>): Record<number, string> => {
  const out: Record<number, string> = {};
  for (const [path, url] of Object.entries(glob)) {
    const n = numKey(path);
    if (!Number.isNaN(n)) out[n] = url;
  }
  return out;
};

const fondsMap = toMap(fondsGlob);
const guildeContourMap = toMap(guildeContourGlob);
const allianceContourMap = toMap(allianceContourGlob);

/** Variante de blason : choisit le jeu de contours. */
export type EmblemVariant = 'guild' | 'alliance';

/** URL de la forme de fond (remplissage teinté) pour un index de forme. */
export const fondUrl = (n: number | string): string => fondsMap[Number(n)] ?? '';

/** URL du contour (cadre conservé tel quel) selon la variante et l'index de forme. */
export const contourUrl = (variant: EmblemVariant, n: number | string): string =>
  (variant === 'alliance' ? allianceContourMap : guildeContourMap)[Number(n)] ?? '';

/** Indices de formes disponibles (= fonds), triés. Pilote la grille de sélection. */
export const formeIds = (): number[] =>
  Object.keys(fondsMap)
    .map(Number)
    .sort((a, b) => a - b);

// Symboles : map plat id→url (pour le rendu) + regroupement par catégorie (pour la sélection).
const symboleMap: Record<number, string> = {};
const categoryIds: Record<string, number[]> = {};
for (const [path, url] of Object.entries(symbolesGlob)) {
  const id = numKey(path);
  if (Number.isNaN(id)) continue;
  symboleMap[id] = url;
  const cat = parentDir(path);
  (categoryIds[cat] ??= []).push(id);
}

/** URL d'un symbole par son id (toutes catégories confondues). */
export const symboleUrl = (id: number | string): string => symboleMap[Number(id)] ?? '';

/** Catégories de symboles (libellé = nom de dossier) avec leurs ids triés. */
export const SYMBOL_CATEGORIES: { label: string; ids: number[] }[] = Object.entries(categoryIds)
  .map(([label, ids]) => ({ label, ids: ids.sort((a, b) => a - b) }))
  .sort((a, b) => a.label.localeCompare(b.label, 'fr'));
