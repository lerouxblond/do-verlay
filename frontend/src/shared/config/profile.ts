/**
 * Cycle de vie d'un profil côté front : clonage + création d'un profil vierge.
 * Plomberie partagée par le store et le ConfigProvider (indépendant de toute donnée mock).
 */
import { MODULE_LIMIT, MODULES, TIMING } from '../constants';
import { DOFUS_LIST } from '../data/dofus';
import type { DofusId, DofusState, ModuleSettings, ModuleType, Profile } from '../types';

/** Clone profond d'un profil (structuredClone avec repli JSON). */
export const cloneProfile = (p: Profile): Profile =>
  typeof structuredClone === 'function'
    ? structuredClone(p)
    : (JSON.parse(JSON.stringify(p)) as Profile);

const defaultModule = (type: ModuleType, zone: ModuleSettings['zone_ancrage']): ModuleSettings => ({
  type,
  zone_ancrage: zone,
  actif: true,
  duree_affichage: TIMING.display,
  cooldown: TIMING.cooldown,
  commande: MODULES[type].command,
});

const defaultModules = (): Profile['modules'] => ({
  dofusdex: defaultModule('dofusdex', 'HD'),
  etendard: defaultModule('etendard', 'BG'),
  fiche: defaultModule('fiche', 'BD'),
  generique: defaultModule('generique', 'BAS'),
});

const emptyDofusStates = (): Record<DofusId, DofusState> =>
  Object.fromEntries(DOFUS_LIST.map((d) => [d.id, 'not_started' as DofusState]));

/** Profil de départ vierge (sert de fallback quand aucun profil n'est persisté). */
export const createEmptyProfile = (id = 'profil-1'): Profile => ({
  id,
  nom: 'Nouveau profil',
  limite_modules: MODULE_LIMIT.default,
  rotation: false,
  modules: defaultModules(),
  ordre: DOFUS_LIST.map((d) => d.id),
  dofus: emptyDofusStates(),
  guild: { nom: '', emblem: { back: 1, up: 1 }, recrutement: 'closed', niveau_guilde: 1, tags: [] },
  perso: { nom: '', serveur: '', niveau: 1, pts_succes: 0, genre: 'male', classe: '' },
  generique: { kicker: '', contenu: '', taille: 'M' },
});
