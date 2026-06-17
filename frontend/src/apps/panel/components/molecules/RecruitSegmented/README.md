# RecruitSegmented (molecule · panel)

Sélecteur segmenté des 3 états de recrutement d'une guilde, chaque segment prenant l'accent de son
état (vert / ambre / rouge).

| Prop       | Type                            | Rôle               |
| ---------- | ------------------------------- | ------------------ |
| `value`    | `RecruitState`                  | État courant       |
| `onChange` | `(value: RecruitState) => void` | Changement d'état  |

États : `open` · `on_request` · `closed`. Dépendance : `Button` (segments).
