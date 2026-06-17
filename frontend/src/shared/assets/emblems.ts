/** Blasons de guilde — symbole (avant-plan) + fond d'écusson. Glob isolé (étendard). */
import { baseName, buildMap } from './glob';

const emblemUpGlob = import.meta.glob(
  '../../assets/emblem_up_images_128/data/img/emblem/up/2x/*.png',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>;

const emblemBackGlob = import.meta.glob(
  '../../assets/emblem_backcontent_images_128/data/img/emblem/backcontent/2x/*.png',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>;

// '12-128' → clé '12'
const emblemUpMap = buildMap(emblemUpGlob, (p) => baseName(p).replace(/-128$/, ''));
const emblemBackMap = buildMap(emblemBackGlob, (p) => baseName(p).replace(/-128$/, ''));

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
