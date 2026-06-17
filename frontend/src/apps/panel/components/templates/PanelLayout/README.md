# PanelLayout (template · panel)

Gabarit du panel de contrôle : barre latérale défilante (profil + modules + éditeurs) à gauche,
scène d'aperçu live à droite. Fond harlequin nocturne, intensité d'identité réduite (design
system §01).

| Prop      | Type        | Rôle                       |
| --------- | ----------- | -------------------------- |
| `sidebar` | `ReactNode` | Contrôles & éditeurs       |
| `stage`   | `ReactNode` | Aperçu de l'overlay        |

Dépendances : `ModuleRow`, `BroadcastControls` (placés en children via les pages).
