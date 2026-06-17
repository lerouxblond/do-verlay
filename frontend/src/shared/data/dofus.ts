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
  { id: 'argentee', nom: 'Argentée', asset: 'dof-argentée' },
  { id: 'argentee-scintillant', nom: 'Argentée Scintillant', asset: 'dof-argentée-scintillant' },
  { id: 'cauchemar', nom: 'Cauchemar', asset: 'dof-cauchemar' },
  { id: 'ddg', nom: 'DDG', asset: 'dof-ddg' },
  { id: 'dofawa', nom: 'Dofawa', asset: 'dof-dofawa' },
  { id: 'dofooz', nom: 'Dofooz', asset: 'dof-dofooz' },
  { id: 'dokoko', nom: 'Dokoko', asset: 'dof-dokoko' },
  { id: 'domakuro', nom: 'Domakuro', asset: 'dof-domakuro' },
  { id: 'domdepin', nom: 'Dom de Pin', asset: 'dof-domdepin' },
  { id: 'dorigami', nom: 'Dorigami', asset: 'dof-dorigami' },
  { id: 'dotruche', nom: 'Dotruche', asset: 'dof-dotruche' },
  { id: 'forgelave', nom: 'Forgelave', asset: 'dof-forgelave' },
  { id: 'khaliptus', nom: 'Khaliptus', asset: 'dof-khaliptus' },
  { id: 'sylvestre', nom: 'Sylvestre', asset: 'dof-sylvestre' },
  { id: 'tachete', nom: 'Tacheté', asset: 'dof-tacheté' },
];

export const DOFUS_BY_ID: Record<DofusId, Dofus> = Object.fromEntries(
  DOFUS_LIST.map((d) => [d.id, d]),
);
