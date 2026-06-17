# État de l'app — Do-verlay « Chapiteau »

Audit de ce qui est réellement implémenté, au 17 juin 2026. À tenir à jour.

## Architecture
- **SPA React unique** (`frontend/`, Vite + TS), un seul `index.html` (stub) → `src/main.tsx`.
- **HashRouter** (adapté à une source statique / OBS). Routes :
  | Route | Contenu | Accès |
  |---|---|---|
  | `/` | Launcher (React) | public |
  | `/overlay` | Overlay transparent (OBS) — `ConfigProvider publish={false}` | public |
  | `/panel/general` | Réglages généraux | derrière `RequireAuth` |
  | `/panel/profils` | Gestion des profils | id. |
  | `/panel/modules/dofusdex` | Config Dofusdex | id. |
  | `/panel/modules/:type` | Squelette « Bientôt » (etendard/fiche/generique) | id. |
  | `*` | redirige vers `/` | — |
- **Garde d'auth = PLACEHOLDER** (`apps/panel/auth/`) : `useAuth` renvoie toujours
  `authenticated`. Seam pour la future auth Twitch — aucune vérif réelle.

## Synchro (3 canaux)
`src/shared/config/ConfigContext.tsx` :
- `localStorage` — persistance + reprise.
- `BroadcastChannel` — onglets du même navigateur.
- **WebSocket `/ws`** (serveur Go, même origine) — entre process distincts → **OBS**. Reconnexion
  auto, échec silencieux sans serveur. Prop `publish` : le panel publie, l'overlay est abonné seul.
  Anti-écho via comparaison JSON (`lastSync`).

## Implémenté ✅
- **Panel — Réglages généraux** : chaîne Twitch, limite de modules simultanés, rotation auto,
  témoin de connexion overlay (toggle, masqué par défaut). Câblés sur le profil réel.
- **Panel — Profils** : créer, charger, renommer, dupliquer, supprimer, export/import JSON. Réel.
- **Panel — Dofusdex (config complète)** : module actif, **affichage permanent (épinglé)**, format
  **vertical/horizontal**, zone d'ancrage, commande, durée, cooldown, libellé d'objectif ; collection
  (suivre/retirer, état À faire/En cours/Obtenu via segment, **réordonnancement glisser-déposer animé
  — slide/FLIP**), barre de progression, aperçu live. Sections **repliables**.
- **Overlay** : scène transparente, rend les modules visibles à leur zone d'ancrage avec **animations
  d'entrée ET de sortie** (présence). Lit le profil via les 3 canaux.
- **Module Dofusdex (visuel overlay)** : `CardShell` carreau + objectif + jauge + grille des Dofus
  (états). Deux formats. Réutilisé comme aperçu dans le panel.
- **Moteur** (`useOverlayEngine`) : rotation auto (modules actifs + implémentés seulement),
  déclenchement par commande, cooldown, file d'attente (limite simultanée), **épinglage permanent**.
  Tests Vitest (4).
- **Backend Go** (`server/`) : sert `frontend/dist` + **relais WebSocket** en mémoire (rediffusion +
  mémorisation du dernier état pour réhydrater un client tardif). Sans base.

## Différé / pas encore fait ⏳
- **Modules Étendard / Fiche / Générique** : sections « Bientôt » (placeholder). Le `GuildCrest`
  existe ; les visuels et la config restent à brancher (puis les ajouter à `AVAILABLE` côté overlay
  et passer `actif:true` par défaut).
- **Chat Twitch** : la commande chat est configurable mais **aucune connexion IRC** ne déclenche les
  modules (rotation auto + épinglage seulement). Prévu : IRC anonyme côté serveur Go.
- **Persistance serveur** : le WebSocket ne fait que relayer (mémoire). Pas de PostgreSQL/REST/CRUD
  (migration `server/migrations/0001_init.sql` écrite mais non appliquée).
- **Auth Twitch** : garde placeholder, pas d'OAuth réel.
- **Collision/empilement multi-modules** : un seul module implémenté → pas encore éprouvé.

## Dette / points de vigilance
- **Polices** chargées via `@import` Google Fonts (`shared/theme/fonts.css`) sans `preconnect` ni
  fallback local → typo générique possible si le navigateur d'OBS ne charge pas la ressource au
  démarrage. À précharger / auto-héberger pour fiabiliser le rendu OBS.
- Importer `SuitGlyph`/`Button` par chemin direct, pas via le barrel `@shared/components` (sinon le
  bundle tire les composants à `assets.ts`). Assets éclatés par catégorie dans `shared/assets/`.
- Contraintes TS strictes (erasableSyntaxOnly : pas d'enum → `as const` ; `import type`).

## Vérifications
`tsc --noEmit` OK · 12 tests OK · build front OK · `go build ./...` OK · synchro OBS validée par test
Playwright (2 contextes isolés : panel → overlay via WebSocket).
