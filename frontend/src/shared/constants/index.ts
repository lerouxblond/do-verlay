/** Constantes partagées — source : dictionnaire de données (étape 03) + prototype 06. */
import type { Suit } from '../theme/tokens';
import type { AnchorZone, ModuleType } from '../types';

export const SERVERS = [
  'Draconiros',
  'Imagiro',
  'Orukam',
  'TalKasha',
  'HellMina',
  'Tylezia',
  'Mikhal',
  'Rafal',
  'Dakal',
  'Brial',
] as const;

/** Classes Dofus (= clés d'asset dans class-icons / class-characters). */
export const CLASSES = [
  'cra',
  'ecaflip',
  'eliotrope',
  'eniripsa',
  'enutrof',
  'feca',
  'forgelance',
  'huppermage',
  'iop',
  'osamodas',
  'ouginak',
  'pandawa',
  'roublard',
  'sacrieur',
  'sadida',
  'sram',
  'steamer',
  'xelor',
  'zobal',
] as const;

export const MAX_TAGS = 5;
export const MODULE_LIMIT = { min: 1, max: 4, default: 2 } as const;

export const DOFUS_STATES = ['not_started', 'on_going', 'complete'] as const;
export const RECRUIT_STATES = ['open', 'on_request', 'closed'] as const;
export const ANCHOR_ZONES: AnchorZone[] = ['HG', 'HD', 'BG', 'BD', 'BAS'];

/** Durées par défaut (ms) — repris du prototype 06. */
export const TIMING = {
  display: 6000,
  cooldown: 9000,
  rotation: 7000,
  /** sentinelle « épinglé » : reste affiché indéfiniment. */
  pinned: 8.64e15,
  tick: 250,
} as const;

/** Métadonnées statiques par type de module : enseigne, commande, libellés. */
export const MODULES: Record<
  ModuleType,
  { suit: Suit; name: string; sub: string; command: string }
> = {
  dofusdex: { suit: 'carreau', name: 'Dofusdex', sub: 'Progression du rush', command: '!dofus' },
  etendard: {
    suit: 'trefle',
    name: 'Étendard guilde',
    sub: 'Identité & recrutement',
    command: '!guilde',
  },
  alliance: {
    suit: 'trefle',
    name: 'Alliance',
    sub: 'Identité & recrutement',
    command: '!alliance',
  },
  fiche: { suit: 'pique', name: 'Fiche perso', sub: "Carte d'identité", command: '!perso' },
  generique: {
    suit: 'coeur',
    name: 'Générique',
    sub: 'Code créateur / engagement',
    command: '!code',
  },
};

export const MODULE_ORDER: ModuleType[] = [
  'dofusdex',
  'etendard',
  'alliance',
  'fiche',
  'generique',
];

/**
 * Modules pilotés par le moteur (commande, rotation) mais configurés DANS la page d'un autre
 * module — donc sans entrée de navigation propre. L'alliance se règle sur la page Étendard.
 */
export const EMBEDDED_NAV_MODULES: ModuleType[] = ['alliance'];

/** Commande chat → type de module. */
export const COMMAND_MAP: Record<string, ModuleType> = {
  '!dofus': 'dofusdex',
  '!guilde': 'etendard',
  '!alliance': 'alliance',
  '!perso': 'fiche',
  '!code': 'generique',
};

export const STORAGE_KEY = 'do-verlay:profiles';
export const BROADCAST_CHANNEL = 'do-verlay';
