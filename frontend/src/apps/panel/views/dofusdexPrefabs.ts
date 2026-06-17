/**
 * Préfabs Dofusdex — configurations prêtes à appliquer (sélection de Dofus + états + objectif).
 * Pour l'instant un seul préfab « Vierge ». Ajouter les autres ici plus tard :
 *
 *   {
 *     id: 'trophees',
 *     nom: 'Dofus Trophées',
 *     ordre: ['vulbis', 'ocre', 'emerauld'],          // Dofus suivis, dans l'ordre
 *     dofus: { vulbis: 'complete' },                   // états initiaux (sinon « à faire »)
 *     objectif: 'Objectif Dofus Trophées',
 *   }
 */
import type { DofusId, DofusState } from '@shared/types';

export interface DofusdexPrefab {
  id: string;
  nom: string;
  description?: string;
  /** Dofus suivis, dans l'ordre (vide = aucun). */
  ordre: DofusId[];
  /** États initiaux par Dofus (les ids absents repartent « à faire »). */
  dofus?: Partial<Record<DofusId, DofusState>>;
  /** Libellé d'objectif appliqué (optionnel). */
  objectif?: string;
}

export const DOFUSDEX_PREFABS: DofusdexPrefab[] = [
  {
    id: 'vierge',
    nom: 'Vierge',
    description: 'Aucun Dofus suivi — collection à composer soi-même.',
    ordre: [],
    objectif: '',
  },
];
