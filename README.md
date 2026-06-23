# Do-verlay · « Chapiteau »

Overlay de stream **Dofus** modulaire (source navigateur OBS / Streamlabs) + **panel de contrôle**,
thème « chapiteau harlequin » (rouge Zobal + or Ecaflip). Le streamer configure ses modules dans le
panel ; l'overlay les affiche en direct par-dessus le jeu.

- **Front** (`frontend/`) — Vite + React + TypeScript, **SPA unique** (HashRouter).
- **Back** (`server/`) — Go : sert le front compilé + canal **WebSocket** de synchro live +
  **lecture du chat Twitch** (IRC anonyme : les commandes `!…` déclenchent les modules, sans app ni
  OAuth). Le reste — PostgreSQL, REST, login OAuth — est différé, cf. `docs/ETAT-DE-LAPP.md`.

## Prérequis
- Node ≥ 20 (testé sur 24)
- Go ≥ 1.22 (testé sur 1.26) — uniquement pour la synchro OBS

## Développement (panel + overlay dans le navigateur)
```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```
- Lanceur : `http://localhost:5173/`
- Panel : `http://localhost:5173/#/panel/general`
- Overlay : `http://localhost:5173/#/overlay`

En dev, panel et overlay se synchronisent via `localStorage` + `BroadcastChannel` (deux onglets du
**même** navigateur). La synchro entre process distincts (→ OBS) passe par le serveur Go ci-dessous.

## Lancer pour OBS (synchro live via WebSocket)
Le navigateur intégré d'OBS a un `localStorage` isolé : il ne voit pas la config du navigateur du
streamer. Le serveur Go sert le front **et** relaie la config par WebSocket (même origine).
```bash
cd frontend && npm run build      # produit frontend/dist
cd ../server && go run ./cmd/api  # http://localhost:8787 (sert dist + /ws)
```
- Panel : `http://localhost:8787/#/panel/general`
- **Source navigateur OBS** : `http://localhost:8787/#/overlay`  (1920×1080, fond transparent)

Édite dans le panel → l'overlay (y compris dans OBS) se met à jour en direct.
Variables serveur : `PORT` (défaut 8787), `STATIC_DIR` (défaut `../frontend/dist`).

### Régler la source OBS
1. Sources → **+** → **Source navigateur**.
2. URL : `http://localhost:8787/#/overlay` · Largeur 1920 · Hauteur 1080.
3. Laisser « Arrière-plan transparent » (le CSS de l'overlay est transparent).
4. Écran figé après une modif ? Clic droit sur la source → **Actualiser le cache**.

## Configuration (panel)
- **Réglages généraux** : chaîne Twitch (le serveur Go y lit le chat et **déclenche les modules sur
  les commandes** `!dofus`, `!guilde`, `!alliance`… selon la commande configurée de chaque module),
  nombre de modules simultanés, rotation automatique, témoin de connexion de l'overlay (masqué par
  défaut, à activer pour le calage dans OBS).
- **Profils** : créer / charger / renommer / dupliquer / supprimer / exporter-importer (JSON).
- **Disposition** : positionnement **libre** des modules (glisser-déposer sur un aperçu 16:9 deux
  colonnes, échelle, ancrage 3×3, aimantation, capture Dofus en fond). Les dispositions sont
  **indépendantes des profils** : on en sauvegarde plusieurs (« Setup 1080p », « 1440p »…) et on
  bascule sans changer de profil. Export/import JSON séparé. Un **mode test** force l'affichage
  permanent de tous les modules sur la source OBS pour le calage (à couper avant de streamer).
- **Modules › Dofusdex** : modèles rapides (« Vierge » vide / « Complète » suit tout) +
  **configurations sauvegardables** (enregistrer la collection — Dofus suivis + états + objectif —
  puis la réappliquer sans changer de profil), regroupés dans « Mes configurations » ;
  activer, affichage permanent (épinglé), format vertical/horizontal, commande chat, durée,
  cooldown, libellé d'objectif, et la collection de Dofus (suivre/retirer, état À faire / En
  cours / Obtenu, réordonner au glisser-déposer). Aperçu live inclus.
- **Modules › Étendard de guilde** : nom, niveau, blason (fond + symbole), statut de recrutement,
  conditions (étiquettes), + les réglages communs du module. Aperçu live inclus.
- **Modules › Fiche perso** : nom, sexe (toggle ♀/♂), classe (grille de bustes genrés), serveur,
  niveau, points de succès, + les réglages communs du module (commande `!perso`). Aperçu live inclus.

## Qualité
```bash
cd frontend
npm test             # Vitest
npm run lint
npm run build        # tsc --noEmit + build
cd ../server && go build ./...
```

## Architecture
- Design system : `frontend/src/shared/theme/tokens.ts` (palette, typo, enseignes ♦♣♠♥, motif harlequin).
- Atomic Design : un composant = un dossier `*.tsx` + `*.styles.ts` + `README.md`. Partagé dans
  `src/shared/components` ; spécifique dans `src/apps/{panel,overlay,launcher}`.
- Moteur d'affichage : `src/shared/engine/useOverlayEngine.ts` (rotation, file, cooldowns, épinglage).
- Synchro : `src/shared/config/ConfigContext.tsx` (localStorage + BroadcastChannel + WebSocket).
  Source de vérité unique : profils (contenu), **dispositions** (placements libres, cf.
  `config/layout.ts`), **configs Dofusdex** sauvegardées, et le **mode test** — toutes
  synchronisées vers l'overlay/OBS. L'image de référence de l'éditeur reste locale au panel
  (clé localStorage dédiée, hors synchro).

## Docs
- `docs/ETAT-DE-LAPP.md` — audit de ce qui est implémenté / différé.
- `docs/dossier-projet-overlay-dofus.md` — dossier produit d'origine.
- `server/README.md` — détails du backend.

## Mention légale
Site non officiel. Certaines illustrations sont la propriété d'Ankama Studio et de Dofus — tous
droits réservés.
