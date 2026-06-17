# frontend — overlay + panel

Vite + React + TypeScript, **multi-pages**. Deux applications partageant `src/shared`.

## Pages
| Entrée         | Rend                | Rôle                                                |
| -------------- | ------------------- | --------------------------------------------------- |
| `overlay.html` | `OverlayLive`       | Source navigateur OBS, transparente, 1920×1080.     |
| `panel.html`   | `PanelHome`         | Panel de contrôle (édition live + aperçu).          |
| `index.html`   | launcher statique   | Liens vers les deux.                                |

## Scripts
```bash
npm run dev      # serveur de dev
npm run build    # tsc --noEmit && vite build
npm run test     # vitest
npm run lint     # eslint
npm run format   # prettier
```

## Arborescence `src`
```
shared/
  theme/        tokens (design system §09) + fonts.css (polices + keyframes + reset)
  types/        modèle de données (étape 03)
  constants/    serveurs, classes, timings, modules, commandes
  data/         seed (référentiel Dofus + profils Kael/Nova)
  assets.ts     résolution des médias (import.meta.glob)
  config/       ConfigProvider (localStorage + BroadcastChannel + export/import JSON)
  engine/       useOverlayEngine (rotation, timers, cooldown, file — réf. prototype 06)
  components/   atoms + molecules partagés
apps/
  overlay/      organisms (modules), template (OverlayLayout), page (OverlayLive)
  panel/        atoms (Field, Toggle), molecules, organisms (éditeurs, StagePreview),
                template (PanelLayout), page (PanelHome)
```

## Sync panel ↔ overlay
La config (profil) est persistée en `localStorage` et diffusée entre onglets via
`BroadcastChannel`. Le panel est source de vérité ; l'overlay applique. Les déclenchements /
épinglages éphémères passent par des « intents » diffusés. Ouvre `panel.html` et `overlay.html`
côte à côte pour voir l'overlay réagir en direct.
