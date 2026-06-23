/**
 * Point d'entrée unique de l'app (SPA React). Le navigateur ne charge qu'un index.html
 * minimal (juste <div id="root">) ; toute l'UI est en React/TS.
 *
 * Routeur de tête (HashRouter — adapté à une page servie en statique / source OBS) :
 *   /         → launcher
 *   /overlay  → overlay transparent (URL de la source navigateur OBS : …/#/overlay)
 *   /panel/*  → panel de contrôle, derrière le garde d'auth (placeholder)
 *
 * Panel et overlay sont lazy-loadés : la route overlay ne charge pas le code du panel.
 */
import React, { Suspense, lazy, type CSSProperties } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ConfigProvider } from '@shared/config/ConfigContext';
import { colors, fonts } from '@shared/theme/tokens';
import { AuthProvider } from '@panel/auth/AuthContext';
import { RequireAuth } from '@panel/auth/RequireAuth';
import { Launcher } from './apps/launcher/Launcher';
import '@shared/theme/fonts'; // polices auto-hébergées (@fontsource)
import '@shared/theme/fonts.css';

const PanelApp = lazy(() =>
  import('@panel/PanelApp').then((m) => ({ default: m.PanelApp })),
);
const OverlayApp = lazy(() =>
  import('@overlay/OverlayApp').then((m) => ({ default: m.OverlayApp })),
);

const fallbackStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  background: colors.bg,
  color: colors.textMuted,
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.15em',
  fontSize: 13,
};

const Fallback = () => <div style={fallbackStyle}>Chargement…</div>;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <HashRouter>
        <Suspense fallback={<Fallback />}>
          <Routes>
            <Route path="/" element={<Launcher />} />
            {/* Overlay : abonné seul (ne publie jamais sa config par défaut). */}
            <Route
              path="/overlay"
              element={
                <ConfigProvider publish={false}>
                  <OverlayApp />
                </ConfigProvider>
              }
            />
            {/* Panel : éditeur → publie ses changements sur les canaux de synchro. */}
            <Route element={<RequireAuth />}>
              <Route
                path="/panel/*"
                element={
                  <ConfigProvider>
                    <PanelApp />
                  </ConfigProvider>
                }
              />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </AuthProvider>
  </React.StrictMode>,
);
