# CardShell (molecule · partagé)

Cadre « carte à jouer » signature — conteneur de base de tout module overlay : liseré or, motif
harlequin plein, enseigne + index en angle, liseré doré en tête, ombre + halo constants (lisible
sur tout fond de jeu). Cf. design system §05.

| Prop          | Type        | Défaut  | Rôle                                   |
| ------------- | ----------- | ------- | -------------------------------------- |
| `suit`        | `Suit`      | —       | Enseigne en angle (→ module)           |
| `index`       | `number`    | —       | Numéro de carte affiché en angle       |
| `width`       | `number`    | —       | Largeur fixe (px)                      |
| `pattern`     | `boolean`   | `true`  | Fond harlequin plein vs surface unie   |
| `bothCorners` | `boolean`   | `false` | Affiche aussi l'angle bas-droit        |
| `children`    | `ReactNode` | —       | Contenu du module                      |

Dépendances : `SuitGlyph` (via `theme/tokens.suits`).
