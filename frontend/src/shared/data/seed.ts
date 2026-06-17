/**
 * Données de départ — référentiel Dofus + profils de démonstration.
 * Repris du prototype (dossier étape 06).
 */
import { MODULES, TIMING } from '../constants';
import type {
  Dofus,
  DofusId,
  DofusState,
  ModuleSettings,
  ModuleType,
  Profile,
} from '../types';

/** Référentiel des Dofus visés (ordre par défaut du rush). */
export const DOFUS_LIST: Dofus[] = [
  { id: 'vulbis', nom: 'Vulbis', asset: 'dof-vulbis' },
  { id: 'ocre', nom: 'Ocre', asset: 'dof-ocre' },
  { id: 'emerauld', nom: 'Émeraude', asset: 'dof-emerauld' },
  { id: 'turquoise', nom: 'Turquoise', asset: 'dof-turquoise' },
  { id: 'ivoire', nom: 'Ivoire', asset: 'dof-ivoire' },
  { id: 'cawotte', nom: 'Cawotte', asset: 'dof-cawotte' },
  { id: 'pourpre', nom: 'Pourpre', asset: 'dof-pourpre' },
  { id: 'abyssal', nom: 'Abyssal', asset: 'dof-abyssal' },
  { id: 'dolmanax', nom: 'Dolmanax', asset: 'dof-dolmanax' },
  { id: 'veilleur', nom: 'Veilleur', asset: 'dof-veilleur' },
  { id: 'ebene', nom: 'Ébène', asset: 'dof-ébène' },
  { id: 'nebuleux', nom: 'Nébuleux', asset: 'dof-nebuleux' },
];

export const DOFUS_BY_ID: Record<DofusId, Dofus> = Object.fromEntries(
  DOFUS_LIST.map((d) => [d.id, d]),
);

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

const order = (): DofusId[] => DOFUS_LIST.map((d) => d.id);

const states = (entries: Record<DofusId, DofusState>): Record<DofusId, DofusState> => {
  const out: Record<DofusId, DofusState> = {};
  for (const d of DOFUS_LIST) out[d.id] = entries[d.id] ?? 'not_started';
  return out;
};

export const SEED_PROFILES: Profile[] = [
  {
    id: 'kael',
    nom: 'Kael · Zobal',
    chaine_twitch: 'kael',
    limite_modules: 2,
    rotation: false,
    modules: defaultModules(),
    ordre: order(),
    dofus: states({
      vulbis: 'complete',
      ocre: 'complete',
      emerauld: 'complete',
      turquoise: 'complete',
      ivoire: 'complete',
      cawotte: 'complete',
      pourpre: 'complete',
      abyssal: 'on_going',
      dolmanax: 'on_going',
    }),
    guild: {
      nom: 'Les Bateleurs',
      emblem: { back: 1, up: 12 },
      recrutement: 'open',
      niveau_guilde: 12,
      tags: ['THL', 'Actifs', 'Détente', 'PvM', 'Discord'],
    },
    perso: {
      nom: 'Kael',
      serveur: 'Draconiros',
      niveau: 200,
      pts_succes: 8420,
      genre: 'male',
      classe: 'zobal',
    },
    generique: { kicker: 'Code créateur', contenu: 'KAEL', taille: 'M', icone: 'kamas' },
  },
  {
    id: 'nova',
    nom: 'Nova · Eniripsa',
    chaine_twitch: 'nova',
    limite_modules: 2,
    rotation: false,
    modules: defaultModules(),
    ordre: order(),
    dofus: states({
      vulbis: 'complete',
      ocre: 'complete',
      emerauld: 'on_going',
      ivoire: 'complete',
    }),
    guild: {
      nom: 'Cirque Céleste',
      emblem: { back: 13, up: 100 },
      recrutement: 'on_request',
      niveau_guilde: 8,
      tags: ['Chill', 'Soirée', 'Mixte'],
    },
    perso: {
      nom: 'Nova',
      serveur: 'Imagiro',
      niveau: 176,
      pts_succes: 5110,
      genre: 'female',
      classe: 'eniripsa',
    },
    generique: { kicker: 'Code créateur', contenu: 'NOVA', taille: 'M', icone: 'kamas' },
  },
];

export const cloneProfile = (p: Profile): Profile =>
  typeof structuredClone === 'function'
    ? structuredClone(p)
    : (JSON.parse(JSON.stringify(p)) as Profile);
