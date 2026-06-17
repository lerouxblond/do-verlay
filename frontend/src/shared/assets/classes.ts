/** Icônes et illustrations de classe (fiche perso). Glob isolé. */
import type { Gender } from '../types';
import { baseName, buildMap } from './glob';

const classGlob = import.meta.glob('../../assets/class-icons/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const charGlob = import.meta.glob('../../assets/class-characters/*/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const classMap = buildMap(classGlob, baseName); // 'zobal'
const charMap = buildMap(charGlob, baseName); // 'zobal-male'

/** Icône de classe (ex. 'zobal'). */
export const classIcon = (name: string): string => classMap[name] ?? '';
/** Illustration de classe genrée (ex. 'zobal', 'male' → zobal-male.png). */
export const classCharacter = (name: string, gender: Gender): string =>
  charMap[`${name}-${gender}`] ?? '';
