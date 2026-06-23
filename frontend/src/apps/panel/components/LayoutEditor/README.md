# LayoutEditor

Éditeur visuel de **disposition** (positionnement libre des modules de l'overlay).

- Mise en page **deux colonnes** : aperçu extensible + panneau de réglages (largeur fixe). La page
  Disposition est marquée `wide` (`navigation.ts`) → zone de contenu élargie.
- Aperçu **16:9** = la scène overlay `1920×1080` mise à l'échelle (mesurée via `ResizeObserver`).
- **Glisser-déposer** au pointeur ; positions stockées en `%` (résolution-indépendant) via
  `useConfig().updatePlacement`. **WYSIWYG** : rend les vrais modules (`@overlay/modules/registry`),
  **mémoïsés par profil** pour ne pas re-rendre les icônes à chaque frame de glisser.
- **Aimantation** aux tiers et au centre (lignes-guides dorées).
- Réglages fins du module sélectionné : **ancre 3×3** (recalage propre, sans saut, via la boîte
  mesurée), **échelle**, **x/y**.
- **Mode test** (`previewAll`) : force l'affichage permanent de tous les modules sur la source OBS
  pour le calage — synchronisé, à couper avant de streamer.
- Reçoit l'**image de référence** (capture Dofus) en props ; sa gestion vit dans
  `useEditorBackground` (localStorage dédié, hors état synchronisé — jamais diffusée à l'overlay).

Les dispositions sont une entité de premier plan du `ConfigProvider`, indépendantes des profils
(`activeLayoutId` ≠ `activeId`). Voir `views/DispositionView.tsx` pour la gestion CRUD + bascule.
