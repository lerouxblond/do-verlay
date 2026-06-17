/**
 * Résolution des assets (déjà présents dans src/assets, non déplacés).
 * On bâtit des maps `clé → URL` via import.meta.glob, pour les `src` dynamiques.
 */
import type { Gender } from './types';

type UrlMap = Record<string, string>;

/** filename sans dossier ni extension : '.../dof-vulbis.png' → 'dof-vulbis'. */
function baseName(path: string): string {
  const file = path.split('/').pop() ?? path;
  return file.replace(/\.png$/i, '');
}

function buildMap(glob: Record<string, string>, key: (p: string) => string): UrlMap {
  const out: UrlMap = {};
  for (const [path, url] of Object.entries(glob)) out[key(path)] = url;
  return out;
}

const dofusGlob = import.meta.glob('../assets/dofus-icons/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const classGlob = import.meta.glob('../assets/class-icons/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const charGlob = import.meta.glob('../assets/class-characters/*/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const utilGlob = import.meta.glob('../assets/utilitaire/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const emblemUpGlob = import.meta.glob(
  '../assets/emblem_up_images_128/data/img/emblem/up/2x/*.png',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>;

const emblemBackGlob = import.meta.glob(
  '../assets/emblem_backcontent_images_128/data/img/emblem/backcontent/2x/*.png',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>;

const dofusMap = buildMap(dofusGlob, baseName); // 'dof-vulbis'
const classMap = buildMap(classGlob, baseName); // 'zobal'
const charMap = buildMap(charGlob, baseName); // 'zobal-male'
const utilMap = buildMap(utilGlob, baseName); // 'phoenix'
// '12-128' → clé '12'
const emblemUpMap = buildMap(emblemUpGlob, (p) => baseName(p).replace(/-128$/, ''));
const emblemBackMap = buildMap(emblemBackGlob, (p) => baseName(p).replace(/-128$/, ''));

/** Icône d'un Dofus par sa clé d'asset (ex. 'dof-vulbis'). */
export const dofusIcon = (asset: string): string => dofusMap[asset] ?? '';
/** Icône de classe (ex. 'zobal'). */
export const classIcon = (name: string): string => classMap[name] ?? '';
/** Illustration de classe genrée (ex. 'zobal', 'male' → zobal-male.png). */
export const classCharacter = (name: string, gender: Gender): string =>
  charMap[`${name}-${gender}`] ?? '';
/** Asset utilitaire (ex. 'kamas', 'phoenix'). */
export const util = (name: string): string => utilMap[name] ?? '';
/** Symbole d'emblème de guilde (avant-plan). */
export const emblemUp = (id: number | string): string => emblemUpMap[String(id)] ?? '';
/** Fond d'écusson d'emblème de guilde (arrière-plan coloré). */
export const emblemBack = (id: number | string): string => emblemBackMap[String(id)] ?? '';

/** Listes d'ids disponibles (pour les sélecteurs du panel). */
export const emblemUpIds = Object.keys(emblemUpMap)
  .map(Number)
  .sort((a, b) => a - b);
export const emblemBackIds = Object.keys(emblemBackMap)
  .map(Number)
  .sort((a, b) => a - b);
