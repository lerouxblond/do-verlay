# Do-verlay — « Chapiteau »

Overlay de stream **Dofus** (source navigateur OBS / Streamlabs) + **panel de contrôle**, sous
l'identité « chapiteau harlequin » (rouge Zobal + or Ecaflip). Construit d'après le dossier de
conception (méthode Merise, Atomic Design).

## Structure
- **`frontend/`** — applications front (Vite + React + TypeScript), multi-pages :
  - `overlay.html` → la source navigateur transparente 1920×1080 (OBS).
  - `panel.html` → le panel de contrôle du streamer (édition live + aperçu).
  - `index.html` → launcher.
  - `src/shared` — design system (tokens), types, constantes, assets, moteur d'affichage,
    persistance (`localStorage` + `BroadcastChannel`), et composants partagés (atoms/molecules).
  - `src/apps/{overlay,panel}` — organismes, templates et pages propres à chaque app.
  - `src/assets` — médias fournis (Dofus, classes, personnages, utilitaires, **blasons de guilde**).
- **`server/`** — backend Go + PostgreSQL (**différé** — squelette + migration ; cf. son README).
- **`docs/`** — brief / dossier projet.

## Démarrer le front
```bash
cd frontend
npm install
npm run dev      # http://localhost:5173 — /panel.html et /overlay.html
npm run build    # type-check + bundle de prod
npm run test     # tests Vitest
```

## Périmètre de cette itération (« front d'abord »)
Overlay + panel **pleinement fonctionnels** : 4 modules (Dofusdex, étendard de guilde, fiche perso,
générique), édition live, tri manuel du Dofusdex (drag & ▲▼), 3 états de recrutement, tags,
rotation auto, cooldowns, file d'attente, simulateur de chat, profils (Kael / Nova) avec
sauvegarde locale et **export/import JSON**. La synchro panel ↔ overlay se fait en direct via
`BroadcastChannel` (ouvre les deux onglets).

Le backend Go / PostgreSQL / WebSocket / chat Twitch IRC est **préparé mais différé** (cf.
`server/`), conformément au plan d'implémentation (dossier étape 10).

## Identité & architecture
- Design system : `frontend/src/shared/theme/tokens.ts` (palette, typo, enseignes ♦♣♠♥, motif harlequin).
- Atomic Design : `atoms → molecules → organisms → templates → pages` ; un composant = un dossier
  `*.tsx` + `*.styles.ts` + `README.md`.
- Référence comportementale & visuelle : le prototype du dossier (étape 06).
