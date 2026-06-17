import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from '@shared/config/ConfigContext';
import '@shared/theme/fonts.css';
import { PanelHome } from './components/pages/PanelHome/PanelHome';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider>
      <PanelHome />
    </ConfigProvider>
  </React.StrictMode>,
);
