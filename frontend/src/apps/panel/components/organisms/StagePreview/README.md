# StagePreview (organism · panel)

Aperçu live de l'overlay dans le panel : scène 1920×1080 mise à l'échelle (ResizeObserver) pour
remplir la largeur, posée sur un fond de jeu factice, avec barre d'état (source navigateur, modules
à l'écran).

| Prop          | Type        | Rôle                          |
| ------------- | ----------- | ----------------------------- |
| `visibleText` | `string`    | Modules actuellement visibles |
| `children`    | `ReactNode` | La scène (OverlayLayout)      |

Dépendance : `OverlayLayout` (passé en children).
