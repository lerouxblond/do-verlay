/** Persistance locale des profils (localStorage) + (dé)sérialisation. */
import { STORAGE_KEY } from '../constants';
import type { ModuleType, Profile, ProfileExport } from '../types';
import { cloneProfile, createEmptyProfile } from './profile';

export interface PersistedState {
  profiles: Profile[];
  activeId: string;
}

/**
 * Complète un profil persisté/importé avec les valeurs par défaut manquantes (nouveaux modules,
 * nouvelles entités comme l'alliance). Évite qu'un ancien profil sans `alliance` ne fasse planter
 * le moteur ou les vues. Les valeurs existantes sont conservées.
 */
export function normalizeProfile(raw: Profile): Profile {
  const base = createEmptyProfile(raw.id);
  const modules = { ...base.modules };
  for (const type of Object.keys(base.modules) as ModuleType[]) {
    if (raw.modules?.[type]) modules[type] = { ...base.modules[type], ...raw.modules[type] };
  }
  return {
    ...base,
    ...raw,
    modules,
    guild: { ...base.guild, ...raw.guild, emblem: { ...base.guild.emblem, ...raw.guild?.emblem } },
    alliance: {
      ...base.alliance,
      ...raw.alliance,
      emblem: { ...base.alliance.emblem, ...raw.alliance?.emblem },
    },
  };
}

export function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState;
      if (parsed.profiles?.length && parsed.activeId) {
        return { ...parsed, profiles: parsed.profiles.map(normalizeProfile) };
      }
    }
  } catch {
    /* storage indisponible ou corrompu → profil vierge */
  }
  const profile = createEmptyProfile();
  return { profiles: [profile], activeId: profile.id };
}

export function saveState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota / mode privé : on ignore */
  }
}

/** Sérialise un profil au format d'export partageable. */
export function toExport(profile: Profile): ProfileExport {
  return { app: 'do-verlay', version: 1, profile: cloneProfile(profile) };
}

/** Valide et extrait un profil d'un fichier d'export importé. */
export function fromExport(json: unknown): Profile | null {
  if (!json || typeof json !== 'object') return null;
  const obj = json as Partial<ProfileExport>;
  if (obj.app !== 'do-verlay' || !obj.profile) return null;
  return normalizeProfile(obj.profile as Profile);
}
