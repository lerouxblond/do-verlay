/**
 * Registre des sections du panel — modèle de navigation + table de routage (aucun mock).
 * Les sections « module » sont dérivées des métadonnées partagées (MODULES) ; celles dont
 * le module n'est pas encore implémenté sont marquées « soon ».
 */
import { MODULE_ORDER, MODULES } from '@shared/constants';
import type { ModuleType } from '@shared/types';
import type { Suit } from '@shared/theme/tokens';

export type SectionId = 'general' | 'profils' | ModuleType;
/** `ready` = page fonctionnelle ; `soon` = squelette en attente du module. */
export type SectionStatus = 'ready' | 'soon';

export interface PanelSection {
  id: SectionId;
  label: string;
  sub: string;
  suit: Suit;
  status: SectionStatus;
  /** Chemin de route (sans le « # » du HashRouter). */
  path: string;
}

export interface SectionGroup {
  label: string;
  sections: PanelSection[];
}

/** Modules déjà implémentés côté panel (config disponible). */
const READY_MODULES: ModuleType[] = ['dofusdex'];

const moduleSections: PanelSection[] = MODULE_ORDER.map((type) => ({
  id: type,
  label: MODULES[type].name,
  sub: MODULES[type].sub,
  suit: MODULES[type].suit,
  status: READY_MODULES.includes(type) ? 'ready' : 'soon',
  path: `/panel/modules/${type}`,
}));

export const SECTION_GROUPS: SectionGroup[] = [
  {
    label: 'Pilotage',
    sections: [
      {
        id: 'general',
        label: 'Réglages généraux',
        sub: 'Chaîne, limites, rotation',
        suit: 'pique',
        status: 'ready',
        path: '/panel/general',
      },
      {
        id: 'profils',
        label: 'Profils',
        sub: 'Créer, charger, partager',
        suit: 'carreau',
        status: 'ready',
        path: '/panel/profils',
      },
    ],
  },
  { label: 'Modules', sections: moduleSections },
];

export const ALL_SECTIONS: PanelSection[] = SECTION_GROUPS.flatMap((g) => g.sections);

/** Section correspondant à un chemin de route (pour l'en-tête de page). */
export const sectionByPath = (pathname: string): PanelSection | undefined =>
  ALL_SECTIONS.find((s) => s.path === pathname);

export const DEFAULT_PATH = '/panel/general';
