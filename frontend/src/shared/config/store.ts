/** Persistance locale des profils + dispositions (localStorage) + (dé)sérialisation. */
import { STORAGE_KEY } from '../constants';
import { DOFUS_LIST } from '../data/dofus';
import type {
  DofusdexPreset,
  DofusState,
  Layout,
  LayoutExport,
  ModuleType,
  Profile,
  ProfileExport,
} from '../types';
import { cloneLayout, createDefaultLayout, normalizeLayout } from './layout';
import { cloneProfile, createEmptyProfile } from './profile';

/** Ids de Dofus du référentiel — pour purger un import contenant des ids inconnus. */
const VALID_DOFUS = new Set(DOFUS_LIST.map((d) => d.id));

export interface PersistedState {
  profiles: Profile[];
  activeId: string;
  /** Dispositions disponibles (placements des modules), indépendantes des profils. */
  layouts: Layout[];
  /** Disposition appliquée — distincte de `activeId` : on switche la dispo sans changer de profil. */
  activeLayoutId: string;
  /** Configs Dofusdex sauvegardées (instantanés de collection), indépendantes des profils. */
  dofusdexPresets: DofusdexPreset[];
  /**
   * Mode test : force l'affichage permanent de TOUS les modules rendus sur l'overlay (calage OBS).
   * Synchronisé pour agir sur la source OBS. À éteindre avant de streamer.
   */
  previewAll: boolean;
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

  // Purge les ids de Dofus inconnus (import d'un fichier altéré / d'une autre version) et
  // dédoublonne l'ordre ; conserve tous les états valides du référentiel.
  const ordre: string[] = [];
  for (const id of raw.ordre ?? base.ordre) {
    if (VALID_DOFUS.has(id) && !ordre.includes(id)) ordre.push(id);
  }
  const dofus = { ...base.dofus };
  for (const [id, etat] of Object.entries(raw.dofus ?? {})) {
    if (VALID_DOFUS.has(id)) dofus[id] = etat as DofusState;
  }

  return {
    ...base,
    ...raw,
    modules,
    ordre,
    dofus,
    guild: { ...base.guild, ...raw.guild, emblem: { ...base.guild.emblem, ...raw.guild?.emblem } },
    alliance: {
      ...base.alliance,
      ...raw.alliance,
      emblem: { ...base.alliance.emblem, ...raw.alliance?.emblem },
    },
  };
}

/**
 * Garantit la présence d'au moins une disposition valide. Si l'état n'en a pas (première
 * exécution ou état antérieur à la feature), en crée une à partir des anciennes zones d'ancrage
 * du profil actif. Choisit une disposition active existante.
 */
function ensureLayouts(
  layouts: Layout[] | undefined,
  activeLayoutId: string | undefined,
  activeProfile: Profile | undefined,
): { layouts: Layout[]; activeLayoutId: string } {
  if (layouts?.length) {
    const norm = layouts.map(normalizeLayout);
    const active = norm.some((l) => l.id === activeLayoutId) ? activeLayoutId! : norm[0].id;
    return { layouts: norm, activeLayoutId: active };
  }
  const def = createDefaultLayout('disposition-1', activeProfile);
  return { layouts: [def], activeLayoutId: def.id };
}

export function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState;
      if (parsed.profiles?.length && parsed.activeId) {
        const profiles = parsed.profiles.map(normalizeProfile);
        const activeProfile = profiles.find((p) => p.id === parsed.activeId) ?? profiles[0];
        const { layouts, activeLayoutId } = ensureLayouts(
          parsed.layouts,
          parsed.activeLayoutId,
          activeProfile,
        );
        return {
          ...parsed,
          profiles,
          layouts,
          activeLayoutId,
          dofusdexPresets: parsed.dofusdexPresets ?? [],
          previewAll: parsed.previewAll ?? false,
        };
      }
    }
  } catch {
    /* storage indisponible ou corrompu → profil vierge */
  }
  const profile = createEmptyProfile();
  const layout = createDefaultLayout('disposition-1', profile);
  return {
    profiles: [profile],
    activeId: profile.id,
    layouts: [layout],
    activeLayoutId: layout.id,
    dofusdexPresets: [],
    previewAll: false,
  };
}

/**
 * Persiste l'état. `serialized` permet de réutiliser un `JSON.stringify` déjà calculé ailleurs
 * (le ConfigProvider sérialise une seule fois pour le diff, la persistance ET le WebSocket).
 */
export function saveState(state: PersistedState, serialized?: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, serialized ?? JSON.stringify(state));
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

/** Sérialise une disposition au format d'export partageable. */
export function toLayoutExport(layout: Layout): LayoutExport {
  return { app: 'do-verlay', kind: 'layout', version: 1, layout: cloneLayout(layout) };
}

/** Valide et extrait une disposition d'un fichier d'export importé. */
export function fromLayoutExport(json: unknown): Layout | null {
  if (!json || typeof json !== 'object') return null;
  const obj = json as Partial<LayoutExport>;
  if (obj.app !== 'do-verlay' || obj.kind !== 'layout' || !obj.layout) return null;
  return normalizeLayout(obj.layout as Layout);
}
