/** Assets utilitaires divers (icônes — kamas, phénix…). Glob isolé. */
import { baseName, buildMap } from './glob';

const utilGlob = import.meta.glob('../../assets/utilitaire/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const utilMap = buildMap(utilGlob, baseName); // 'phoenix'

/** Asset utilitaire (ex. 'kamas', 'phoenix'). */
export const util = (name: string): string => utilMap[name] ?? '';
