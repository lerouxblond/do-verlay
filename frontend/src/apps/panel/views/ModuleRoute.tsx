/**
 * Route d'un module (`/panel/modules/:type`). Dispatche via le registre des vues de config :
 * - type implémenté → sa vue de configuration ;
 * - type connu mais non implémenté → squelette « à venir » ;
 * - type inconnu → retour à l'accueil.
 */
import { Navigate, useParams } from 'react-router-dom';
import { MODULE_ORDER } from '@shared/constants';
import type { ModuleType } from '@shared/types';
import { Placeholder } from '../components/Placeholder/Placeholder';
import { PANEL_MODULE_VIEWS } from '../modules/registry';
import { DEFAULT_PATH } from '../navigation';

const isModuleType = (t: string | undefined): t is ModuleType =>
  !!t && (MODULE_ORDER as string[]).includes(t);

export function ModuleRoute() {
  const { type } = useParams();
  if (!isModuleType(type)) return <Navigate to={DEFAULT_PATH} replace />;
  const View = PANEL_MODULE_VIEWS[type];
  return View ? <View /> : <Placeholder module={type} />;
}
