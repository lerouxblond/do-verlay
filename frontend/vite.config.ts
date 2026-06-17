/// <reference types="vitest" />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Multi-pages app : trois entrées HTML.
//  - index.html  : launcher (liens vers overlay & panel)
//  - overlay.html : la source navigateur OBS (transparente, 1920×1080)
//  - panel.html   : le panel de contrôle du streamer
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': resolve(__dirname, 'src/shared'),
      '@overlay': resolve(__dirname, 'src/apps/overlay'),
      '@panel': resolve(__dirname, 'src/apps/panel'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        overlay: resolve(__dirname, 'overlay.html'),
        panel: resolve(__dirname, 'panel.html'),
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    css: false,
  },
});
