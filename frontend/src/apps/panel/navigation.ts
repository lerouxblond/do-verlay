/**
 * Registre des sections du panel — modèle de navigation + table de routage (aucun mock).
 * Les sections « module » sont dérivées des métadonnées partagées (MODULES) ; celles dont
 * le module n'est pas encore implémenté sont marquées « soon ».
 */
import { EMBEDDED_NAV_MODULES, GADGET_MODULES, MODULE_ORDER, MODULES } from '@shared/constants';
import type { ModuleType } from '@shared/types';
import type { Suit } from '@shared/theme/tokens';
import { READY_MODULES } from './modules/registry';

export type SectionId = 'general' | 'profils' | 'disposition' | ModuleType;
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
  /** Page large (zone de contenu élargie) — ex. l'éditeur de disposition. */
  wide?: boolean;
}

export interface SectionGroup {
  label: string;
  sections: PanelSection[];
}

const toSection = (type: ModuleType): PanelSection => ({
  id: type,
  label: MODULES[type].name,
  sub: MODULES[type].sub,
  suit: MODULES[type].suit,
  status: READY_MODULES.includes(type) ? 'ready' : 'soon',
  path: `/panel/modules/${type}`,
});

const navModules = MODULE_ORDER.filter((type) => !EMBEDDED_NAV_MODULES.includes(type));
/** Modules d'identité (section « Modules »). */
const moduleSections: PanelSection[] = navModules
  .filter((type) => !GADGET_MODULES.includes(type))
  .map(toSection);
/** Modules gadget informatifs (section « Gadgets » à part). */
const gadgetSections: PanelSection[] = navModules
  .filter((type) => GADGET_MODULES.includes(type))
  .map(toSection);

const ALL_GROUPS: SectionGroup[] = [
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
      {
        id: 'disposition',
        label: 'Disposition',
        sub: 'Positionnement libre des modules',
        suit: 'pique',
        status: 'ready',
        path: '/panel/disposition',
        wide: true,
      },
    ],
  },
  { label: 'Modules', sections: moduleSections },
  { label: 'Gadgets', sections: gadgetSections },
];

/** Groupes affichés — on masque un groupe vide (ex. plus aucun gadget). */
export const SECTION_GROUPS: SectionGroup[] = ALL_GROUPS.filter((g) => g.sections.length > 0);

export const ALL_SECTIONS: PanelSection[] = SECTION_GROUPS.flatMap((g) => g.sections);

/** Section correspondant à un chemin de route (pour l'en-tête de page). */
export const sectionByPath = (pathname: string): PanelSection | undefined =>
  ALL_SECTIONS.find((s) => s.path === pathname);

export const DEFAULT_PATH = '/panel/general';
