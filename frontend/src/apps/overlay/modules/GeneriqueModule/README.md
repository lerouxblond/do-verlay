# GeneriqueModule

Visuel overlay du module **Générique** (enseigne cœur) : un **message libre** (code créateur,
annonce, engagement…). Surtitre optionnel + corps du message, avec une **icône utilitaire**
facultative à gauche (`shared/assets/util` — kamas, phénix, éléments…). La **taille** (`S`/`M`/`L`,
`SIZE_PRESET`) pilote la largeur de carte et le corps du texte ; message borné à 3 lignes.

- Purement présentationnel : lit `profile.generique` (`GenericMessage`).
- Réutilisé comme aperçu dans `views/GeneriqueView` ; repli estompé si le message est vide.
- Enregistré dans `apps/overlay/modules/registry.tsx` (`OVERLAY_MODULES.generique`).
