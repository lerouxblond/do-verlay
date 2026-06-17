import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from '@shared/config/ConfigContext';
import '@shared/theme/fonts.css';

// Implémentation de l'overlay à reconstruire feature par feature.
// On garde ConfigProvider monté pour valider la plomberie config/sync.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider>
      <div style={{ color: '#fff', fontFamily: 'sans-serif', padding: 16 }}>
        overlay — à reconstruire
      </div>
    </ConfigProvider>
  </React.StrictMode>,
);
