# FicheModule

Visuel overlay du module **Fiche perso** (enseigne pique). Cadre `CardShell` + buste de classe
(`Avatar`, illustration genrée via `classCharacter`) + nom, classe (icône + libellé accentué via
`CLASS_LABELS`), serveur, niveau et points de succès.

- Purement présentationnel : lit `profile.perso` (`Character`). Aucune logique d'état.
- Réutilisé tel quel comme **aperçu live** dans la vue de config panel (`views/FicheView`).
- Repli si aucune classe choisie : médaillon neutre portant l'enseigne ♠ (pas d'image cassée).

Fichiers : `FicheModule.tsx` (rendu) · `FicheModule.styles.ts` (inline-styles, tokens).
Enregistré dans `apps/overlay/modules/registry.tsx` (`OVERLAY_MODULES.fiche`).
