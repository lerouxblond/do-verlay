/**
 * Registre des vues de configuration des modules (côté panel). **Point unique** pour brancher
 * la page de réglages d'un module. `READY_MODULES` en dérive (→ navigation : pas de badge
 * « Bientôt », route active). Un module absent d'ici affiche un squelette « à venir ».
 */
import type { ComponentType } from 'react';
import type { ModuleType } from '@shared/types';
import { DofusdexView } from '../views/DofusdexView';
import { EtendardView } from '../views/EtendardView';
import { FicheView } from '../views/FicheView';

export const PANEL_MODULE_VIEWS: Partial<Record<ModuleType, ComponentType>> = {
  dofusdex: DofusdexView,
  etendard: EtendardView,
  fiche: FicheView,
};

/** Modules dont la config est implémentée. */
export const READY_MODULES = Object.keys(PANEL_MODULE_VIEWS) as ModuleType[];
