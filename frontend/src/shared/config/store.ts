/** Persistance locale des profils (localStorage) + (dé)sérialisation. */
import { STORAGE_KEY } from '../constants';
import type { Profile, ProfileExport } from '../types';
import { cloneProfile, createEmptyProfile } from './profile';

export interface PersistedState {
  profiles: Profile[];
  activeId: string;
}

export function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState;
      if (parsed.profiles?.length && parsed.activeId) return parsed;
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
  return obj.profile as Profile;
}
