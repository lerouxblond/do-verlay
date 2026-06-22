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

const defaultModule = (
  type: ModuleType,
  zone: ModuleSettings['zone_ancrage'],
  actif: boolean,
): ModuleSettings => ({
  type,
  zone_ancrage: zone,
  actif,
  epingle: false,
  duree_affichage: TIMING.display,
  cooldown: TIMING.cooldown,
  commande: MODULES[type].command,
});

// Les modules implémentés sont actifs par défaut ; les autres s'activeront quand leur
// module sera construit (évite des créneaux de rotation vides à l'écran).
const defaultModules = (): Profile['modules'] => ({
  dofusdex: defaultModule('dofusdex', 'HD', true),
  etendard: defaultModule('etendard', 'BG', true),
  alliance: defaultModule('alliance', 'BD', false),
  fiche: defaultModule('fiche', 'BD', true),
  generique: defaultModule('generique', 'BAS', true),
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
  dofusdex_objectif: '',
  dofusdex_format: 'vertical',
  overlay_hud: false,
  ordre: DOFUS_LIST.map((d) => d.id),
  dofus: emptyDofusStates(),
  guild: {
    nom: '',
    emblem: { back: 1, up: 1, fond_couleur: '#C9363A', symbole_couleur: '#E8C877' },
    recrutement: 'closed',
    niveau_guilde: 1,
    tags: [],
  },
  alliance: {
    nom: '',
    acronyme: '',
    emblem: { back: 1, up: 1, fond_couleur: '#C9363A', symbole_couleur: '#E8C877' },
    recrutement: 'closed',
    tags: [],
  },
  perso: { nom: '', serveur: '', niveau: 1, pts_succes: 0, genre: 'male', classe: '' },
  generique: { kicker: '', contenu: '', taille: 'M' },
});
