/**
 * Route d'une section module non encore implémentée (`/modules/:type`).
 * Valide le paramètre contre le référentiel ; un type inconnu redirige vers l'accueil.
 */
import { Navigate, useParams } from 'react-router-dom';
import { MODULE_ORDER } from '@shared/constants';
import type { ModuleType } from '@shared/types';
import { Placeholder } from '../components/Placeholder/Placeholder';
import { DEFAULT_PATH } from '../navigation';

const isModuleType = (t: string | undefined): t is ModuleType =>
  !!t && (MODULE_ORDER as string[]).includes(t);

export function ModuleRoute() {
  const { type } = useParams();
  if (!isModuleType(type)) return <Navigate to={DEFAULT_PATH} replace />;
  return <Placeholder module={type} />;
}
