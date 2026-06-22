/**
 * Routes du panel de contrôle, montées sous `/panel/*` (le HashRouter et le garde
 * `RequireAuth` vivent dans le point d'entrée `src/main.tsx`). Chemins relatifs à /panel.
 *
 * #/panel/general · #/panel/profils · #/panel/modules/dofusdex · #/panel/modules/:type.
 */
import { Navigate, Route, Routes } from 'react-router-dom';
import { useTwitchIRC } from '@shared/hooks/useTwitchIRC';
import { PanelLayout } from './components/PanelLayout/PanelLayout';
import { DispositionView } from './views/DispositionView';
import { GeneralView } from './views/GeneralView';
import { ModuleRoute } from './views/ModuleRoute';
import { ProfilesView } from './views/ProfilesView';

export function PanelApp() {
  useTwitchIRC();
  return (
    <Routes>
      <Route element={<PanelLayout />}>
        <Route index element={<Navigate to="general" replace />} />
        <Route path="general" element={<GeneralView />} />
        <Route path="profils" element={<ProfilesView />} />
        <Route path="disposition" element={<DispositionView />} />
        <Route path="modules/:type" element={<ModuleRoute />} />
        <Route path="*" element={<Navigate to="general" replace />} />
      </Route>
    </Routes>
  );
}
