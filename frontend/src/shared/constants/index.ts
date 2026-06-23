/** Constantes partagées — source : dictionnaire de données (étape 03) + prototype 06. */
import type { Suit } from '../theme/tokens';
import type { ModuleType } from '../types';

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

/** Libellés d'affichage des classes (clé d'asset → nom Dofus accentué). */
export const CLASS_LABELS: Record<(typeof CLASSES)[number], string> = {
  cra: 'Crâ',
  ecaflip: 'Ecaflip',
  eliotrope: 'Eliotrope',
  eniripsa: 'Eniripsa',
  enutrof: 'Enutrof',
  feca: 'Féca',
  forgelance: 'Forgelance',
  huppermage: 'Huppermage',
  iop: 'Iop',
  osamodas: 'Osamodas',
  ouginak: 'Ouginak',
  pandawa: 'Pandawa',
  roublard: 'Roublard',
  sacrieur: 'Sacrieur',
  sadida: 'Sadida',
  sram: 'Sram',
  steamer: 'Steamer',
  xelor: 'Xélor',
  zobal: 'Zobal',
};

export const MAX_TAGS = 5;
export const MODULE_LIMIT = { min: 1, max: 4, default: 2 } as const;

export const RECRUIT_STATES = ['open', 'on_request', 'closed'] as const;

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
  almanax: {
    suit: 'coeur',
    name: 'Almanax',
    sub: 'Bonus & offrande du jour',
    command: '!almanax',
  },
};

export const MODULE_ORDER: ModuleType[] = ['dofusdex', 'etendard', 'alliance', 'fiche', 'almanax'];

/**
 * Modules pilotés par le moteur (commande, rotation) mais configurés DANS la page d'un autre
 * module — donc sans entrée de navigation propre. L'alliance se règle sur la page Étendard.
 */
export const EMBEDDED_NAV_MODULES: ModuleType[] = ['alliance'];

/**
 * Modules « gadget » : informatifs, à données live (ex. Almanax via dofusdude), sans contenu à
 * saisir. Regroupés dans une section de navigation distincte des modules d'identité.
 */
export const GADGET_MODULES: ModuleType[] = ['almanax'];

export const STORAGE_KEY = 'do-verlay:profiles';
export const BROADCAST_CHANNEL = 'do-verlay';

/**
 * Préfixe de clé localStorage de l'image de référence de l'éditeur de disposition.
 * Stockée À PART de l'état synchronisé : volumineuse, panel-only, jamais diffusée à l'overlay.
 */
export const EDITOR_BG_PREFIX = 'do-verlay:editor-bg:';

/** Marge par défaut des placements hérités, en % de la scène 1920×1080 (= 40 px). */
export const LAYOUT_MARGIN_PCT = { x: (40 / 1920) * 100, y: (40 / 1080) * 100 } as const;

/**
 * Mention légale — DOFUS et les illustrations associées sont la propriété d'Ankama Studio.
 * Affichée sur la landing et dans le panel ; source unique pour rester cohérent.
 */
export const LEGAL_NOTICE =
  "Site non officiel. DOFUS ainsi que certaines illustrations sont la propriété d'Ankama Studio — tous droits réservés.";

/** Mention d'attribution dofusdude. */
export const DOFUSDUDE_NOTICE = 'Données fournies par dofusdude.de';
