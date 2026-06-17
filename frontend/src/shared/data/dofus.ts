/**
 * Référentiel des Dofus visés (ordre par défaut du rush).
 * Donnée de référence du domaine — miroir de la table SQL `dofus`.
 */
import type { Dofus, DofusId } from '../types';

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
