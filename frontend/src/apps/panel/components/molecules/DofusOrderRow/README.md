# DofusOrderRow (molecule · panel)

Ligne réordonnable du tri manuel du Dofusdex (champ `ordre_affichage`) : poignée ⠿, position,
vignette, nom, pastille d'état, et boutons ▲▼. Supporte le drag & drop **et** le clavier.

| Prop                  | Type           | Rôle                              |
| --------------------- | -------------- | --------------------------------- |
| `dofus`               | `Dofus`        | Référentiel                       |
| `pos`                 | `number`       | Position 1-based                  |
| `state`               | `DofusState`   | État (vignette + pastille)        |
| `dragging` / `over`   | `boolean`      | Retours visuels du drag           |
| `onUp` / `onDown`     | `() => void`   | Déplacement clavier               |
| `onDrag*` / `onDrop`  | handlers       | Drag & drop natif HTML5           |

Dépendances : `DofusIcon` (vignette), `StateBadge`, `Button` (▲▼).
