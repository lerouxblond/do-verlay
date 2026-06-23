/** Mappe une commande de chat vers un type de module, d'après les commandes CONFIGURÉES du profil. */
import { MODULE_ORDER } from '../constants';
import type { ModuleType, Profile } from '../types';

/** Normalise une commande chat : retire les espaces, minuscule, garantit un `!` en tête. */
export function normalizeCommand(raw: string): string {
  const s = raw.trim().toLowerCase();
  if (!s) return '';
  return s.startsWith('!') ? s : `!${s}`;
}

/**
 * Renvoie le module dont la commande configurée correspond à `command`, ou `null` si aucune.
 * Source de vérité = `profile.modules[m].commande` (éditable dans le panel), PAS les défauts
 * statiques : un streamer qui renomme `!dofus` en `!rush` doit voir `!rush` déclencher le module.
 */
export function commandToModule(profile: Profile, command: string): ModuleType | null {
  const wanted = normalizeCommand(command);
  if (!wanted) return null;
  for (const m of MODULE_ORDER) {
    const cmd = normalizeCommand(profile.modules[m]?.commande ?? '');
    if (cmd && cmd === wanted) return m;
  }
  return null;
}
