# CardShell (molecule · partagé)

Cadre « carte à jouer » signature — conteneur de base de tout module overlay : liseré or, motif
harlequin plein, enseigne (+ rang optionnel) en angle, ombre + halo constants (lisible sur tout
fond de jeu). Cf. design system §05.

| Prop          | Type        | Défaut  | Rôle                                          |
| ------------- | ----------- | ------- | --------------------------------------------- |
| `suit`        | `Suit`      | —       | Enseigne en angle (→ module)                  |
| `index`       | `number`    | —       | Rang sous l'enseigne ; omis = enseigne seule  |
| `width`       | `number`    | —       | Largeur fixe (px)                             |
| `pattern`     | `boolean`   | `true`  | Fond harlequin plein vs surface unie          |
| `bothCorners` | `boolean`   | `false` | Affiche aussi l'angle bas-droit               |
| `topStrip`    | `boolean`   | `true`  | Liseré doré dégradé en tête                   |
| `children`    | `ReactNode` | —       | Contenu du module                             |

Dépendances : `SuitGlyph` (via `theme/tokens.suits`).
