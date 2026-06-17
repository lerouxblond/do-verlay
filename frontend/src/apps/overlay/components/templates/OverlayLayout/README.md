# OverlayLayout (template · overlay)

Gabarit de la source navigateur : place chaque module dans sa **zone d'ancrage**
(HG/HD/BG/BD/BAS), anime l'apparition « lever de rideau » (transform + opacity selon `visible`) et
empile proprement les modules d'une même zone (collision douce via décalage vertical). Scène
1920×1080, fond transparent.

| Prop    | Type            | Défaut | Rôle                                   |
| ------- | --------------- | ------ | -------------------------------------- |
| `slots` | `OverlaySlot[]` | —      | `{ key, zone, visible, node }`         |
| `scale` | `number`        | `1`    | Échelle (aperçu panel)                 |

Dépendances : les organismes de module (passés en `node`). Le sens d'entrée découle de la zone
(haut → descend, bas → monte).
