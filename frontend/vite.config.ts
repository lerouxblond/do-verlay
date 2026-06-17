/// <reference types="vitest" />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// SPA React : une seule entrée (index.html → src/main.tsx). Le routage (launcher,
// panel, overlay) est géré côté React par HashRouter — pas de pages HTML séparées.
//  - source OBS : …/#/overlay (transparente)
//  - panel      : …/#/panel/general
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': resolve(__dirname, 'src/shared'),
      '@overlay': resolve(__dirname, 'src/apps/overlay'),
      '@panel': resolve(__dirname, 'src/apps/panel'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    css: false,
  },
});
