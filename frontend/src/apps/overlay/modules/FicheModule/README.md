# FicheModule

Visuel overlay du module **Fiche perso** (enseigne pique), pensé comme une **fiche de personnage** :
en-tête identité (buste de classe genré via `Avatar` + `classCharacter` ; nom ; classe avec icône +
libellé accentué `CLASS_LABELS` + glyphe ♀/♂) puis un **bandeau de stats** incrusté
(Serveur · Niveau · Succès) séparé par des filets dorés. Le nombre de succès est formaté `fr-FR`.

- Purement présentationnel : lit `profile.perso` (`Character`). Aucune logique d'état.
- Réutilisé tel quel comme **aperçu live** dans la vue de config panel (`views/FicheView`).
- Repli si aucune classe choisie : médaillon neutre portant l'enseigne ♠ (pas d'image cassée).

Fichiers : `FicheModule.tsx` (rendu) · `FicheModule.styles.ts` (inline-styles, tokens).
Enregistré dans `apps/overlay/modules/registry.tsx` (`OVERLAY_MODULES.fiche`).
