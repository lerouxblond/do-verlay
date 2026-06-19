# État de l'app — Do-verlay « Chapiteau »

Audit de ce qui est réellement implémenté, au 19 juin 2026 (maj : Alliance + refonte blason). À tenir à jour.

## Pattern « module » (à reproduire pour les suivants)
Un module = (1) **vue de config panel** dans `apps/panel/views/`, enregistrée dans
`apps/panel/modules/registry.ts` (`PANEL_MODULE_VIEWS` → `READY_MODULES`) ; (2) **composant overlay**
dans `apps/overlay/modules/`, enregistré dans `apps/overlay/modules/registry.tsx`
(`OVERLAY_MODULES` → `AVAILABLE_MODULES`) ; (3) **actif par défaut** dans `shared/config/profile.ts`.
Les réglages communs viennent de `components/ModuleSettingsCard` (actif, épinglé, zone, commande,
durée, cooldown). Ajouter un module ne touche que ces points.

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
  | `/panel/modules/etendard` | Config Étendard (guilde **+** alliance) | id. |
  | `/panel/modules/alliance` | Redirige vers Étendard (config embarquée) | id. |
  | `/panel/modules/:type` | Squelette « Bientôt » (fiche/generique) | id. |
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
- **Panel — Dofusdex (config complète)** : **préfabs** (système extensible, 1 préfab « Vierge » pour
  l'instant), module actif, **affichage permanent (épinglé)**, format **vertical/horizontal**, zone
  d'ancrage, commande, durée, cooldown, libellé d'objectif ; collection (suivre/retirer, état À
  faire/En cours/Obtenu via segment, **réordonnancement glisser-déposer animé — slide/FLIP**), barre de
  progression, aperçu live. Sections **repliables**.
- **Panel — Étendard (config complète, guilde + alliance)** : une page à **onglets Guilde / Alliance**
  (une seule entité affichée à la fois, anti-scroll). Guilde = réglages communs (ModuleSettingsCard,
  commande `!guilde`) + nom + niveau
  (**max 20**) + blason + recrutement/conditions. Alliance = réglages communs (commande
  `!alliance`) + nom + **acronyme `[ABC]`** (pas de niveau) + blason + recrutement/conditions. Le
  toggle `actif` de chaque ModuleSettingsCard active/désactive l'entité. Aperçu live des deux cartes.
- **Module `alliance`** = nouveau `ModuleType` (sibling d'`etendard`) : commande, rotation, cooldown,
  zone et épinglage **indépendants** (moteur). Configuré dans la page Étendard, donc filtré de la
  navigation (`EMBEDDED_NAV_MODULES`) ; `/panel/modules/alliance` redirige vers Étendard.
- **Refonte du blason — `EmblemDesigner`** (composant panel réutilisé guilde + alliance) : aperçu
  live, couleurs fond/symbole, **grille de formes au rendu composé** (fond teinté + contour apparié,
  contour selon variant guilde/alliance) et **symboles rangés par catégorie** (13 onglets, grille
  paginée). Assets servis par `shared/assets/emblems.ts` depuis les dossiers triés
  `assets/guild_alliance/` (`fonds/`, `guilde-countour/`, `alliance-countour/`, `symboles/<cat>/`).
- **Blason coloré** (`GuildEmblem.fond_couleur`/`symbole_couleur`, `EmblemCrest variant`) : fond et
  symbole **teintés** par masques CSS ; le **contour est un calque séparé dessiné tel quel** (plus de
  `mix-blend-mode: multiply`) donc **non teinté par la couleur du fond** ; symbole **centré**. Rendu
  généralisé : `EmblemCrest`/`CrestHeader` + `GuildCrest`/`AllianceCrest`.
- **Migration profils** (`store.normalizeProfile`) : complète les anciens profils localStorage /
  importés dépourvus d'`alliance` (et nouveaux modules) avec les valeurs par défaut.
- **Overlay** : scène transparente, rend les modules visibles à leur zone d'ancrage avec **animations
  d'entrée ET de sortie** (présence). Lit le profil via les 3 canaux.
- **Module Dofusdex (visuel overlay)** : `CardShell` carreau + objectif + jauge + grille des Dofus
  (états). Deux formats. Réutilisé comme aperçu dans le panel.
- **Module Étendard (visuel overlay)** : `CardShell` trèfle + `GuildCrest` (blason + nom + niveau +
  pastille recrutement) + conditions (tags) si ouvert. Réutilisé comme aperçu.
- **Polices auto-hébergées** (@fontsource, bundlées, même origine) → rendu fiable dans OBS (plus
  d'`@import` réseau).
- **Moteur** (`useOverlayEngine`) : rotation auto (modules actifs + implémentés seulement),
  déclenchement par commande, cooldown, file d'attente (limite simultanée), **épinglage permanent**.
  Tests Vitest (4).
- **Backend Go** (`server/`) : sert `frontend/dist` + **relais WebSocket** en mémoire (rediffusion +
  mémorisation du dernier état pour réhydrater un client tardif). Sans base.

## Différé / pas encore fait ⏳
- **Modules Fiche perso / Générique** : sections « Bientôt » (placeholder). À brancher sur le même
  pattern que Dofusdex / Étendard (registres panel + overlay + actif par défaut).
- **Chat Twitch** : la commande chat est configurable mais **aucune connexion IRC** ne déclenche les
  modules (rotation auto + épinglage seulement). Prévu : IRC anonyme côté serveur Go.
- **Persistance serveur** : le WebSocket ne fait que relayer (mémoire). Pas de PostgreSQL/REST/CRUD
  (migration `server/migrations/0001_init.sql` écrite mais non appliquée).
- **Auth Twitch** : garde placeholder, pas d'OAuth réel.
- **Collision/empilement multi-modules** : 3 modules implémentés (dofusdex, etendard, alliance) →
  empilement à éprouver visuellement quand plusieurs partagent une même zone d'ancrage.

## À faire côté utilisateur (visuel)
- ~~Tri des assets de blason~~ → **fait** : assets séparés dans `assets/guild_alliance/`
  (`fonds/` 34, `guilde-countour/` 34, `alliance-countour/` 33, `symboles/` 486 en 13 catégories).
- **Renommer les contours d'alliance** : `assets/guild_alliance/alliance-countour/*-128.png` →
  `countour-N.png` pour s'apparier par index aux `fonds/fond-N.png` (comme la guilde). Tant que ce
  n'est pas fait, le blason d'alliance s'affiche **sans son contour** (fond + symbole seulement) ;
  le code est tolérant (`contourUrl` renvoie '' si l'index n'existe pas).

## Dette / points de vigilance
- ~~Polices via `@import` réseau~~ → **résolu** : auto-hébergées via `@fontsource` (`shared/theme/fonts.ts`).
- Importer `SuitGlyph`/`Button` par chemin direct, pas via le barrel `@shared/components` (sinon le
  bundle tire les composants à `assets.ts`). Assets éclatés par catégorie dans `shared/assets/`.
- Contraintes TS strictes (erasableSyntaxOnly : pas d'enum → `as const` ; `import type`).

## Vérifications
`tsc --noEmit` OK · 15 tests OK · build front OK · lint 0 erreur · `go build ./...` OK · synchro OBS validée par test
Playwright (2 contextes isolés : panel → overlay via WebSocket).
