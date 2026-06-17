/** Icônes des Dofus (Dofusdex). Glob isolé : n'importer que ce module pour ces assets. */
import { baseName, buildMap } from './glob';

const dofusGlob = import.meta.glob('../../assets/dofus-icons/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const dofusMap = buildMap(dofusGlob, baseName); // 'dof-vulbis'

/** Icône d'un Dofus par sa clé d'asset (ex. 'dof-vulbis'). */
export const dofusIcon = (asset: string): string => dofusMap[asset] ?? '';
