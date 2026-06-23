import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// SPA React : une seule entrée (index.html → src/main.tsx). Le routage (launcher,
// panel, overlay) est géré côté React par HashRouter — pas de pages HTML séparées.
//  - source OBS : …/#/overlay (transparente)
//  - panel      : …/#/panel/general
export default defineConfig({
  plugins: [react()],
  build: {
    // Les emblèmes guilde/alliance (~550 fichiers, beaucoup < 4 Ko) seraient inlinés en base64
    // par défaut → +500 Ko de JS chargés même sans ouvrir l'Étendard. On force leur émission en
    // fichiers (chargés à la demande par le navigateur, cacheables). Le reste garde le défaut.
    assetsInlineLimit: (filePath) => (filePath.includes('guild_alliance') ? false : undefined),
  },
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
