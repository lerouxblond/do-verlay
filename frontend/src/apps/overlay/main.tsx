import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from '@shared/config/ConfigContext';
import '@shared/theme/fonts.css';
import { OverlayLive } from './components/pages/OverlayLive/OverlayLive';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider>
      <OverlayLive />
    </ConfigProvider>
  </React.StrictMode>,
);
