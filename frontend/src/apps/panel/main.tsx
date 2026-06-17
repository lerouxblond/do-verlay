import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from '@shared/config/ConfigContext';
import '@shared/theme/fonts.css';

// Implémentation du panel à reconstruire feature par feature.
// On garde ConfigProvider monté pour valider la plomberie config/sync.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider>
      <div style={{ fontFamily: 'sans-serif', padding: 16 }}>panel — à reconstruire</div>
    </ConfigProvider>
  </React.StrictMode>,
);
