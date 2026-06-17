# DofusIcon (atom · partagé)

Icône d'un Dofus rendue selon son **état de progression** — l'état passe par le traitement de
l'asset, pas par une case (cf. design system §06).

| Prop    | Type                                          | Défaut | Rôle                          |
| ------- | --------------------------------------------- | ------ | ----------------------------- |
| `asset` | `string`                                      | —      | Clé d'asset (`dof-vulbis`)    |
| `state` | `'not_started' \| 'on_going' \| 'complete'`   | —      | État de progression           |
| `size`  | `number`                                      | `64`   | Côté du carré (px)            |
| `title` | `string`                                      | —      | Libellé accessible / tooltip  |

États :

- **not_started** — silhouette désaturée, sombre, opacité réduite.
- **on_going** — œuf partiellement révélé : la couleur monte du bas (`mask-image`) + ligne de niveau.
- **complete** — pleine couleur saturée, halo doré animé (`dv-halo`) + socle radial.

Asset résolu via `shared/assets.ts` (`dofusIcon`). Aucune dépendance (atome).
