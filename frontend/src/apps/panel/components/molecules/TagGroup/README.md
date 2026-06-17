# TagGroup (molecule · panel)

Liste de tags de guilde + champ d'ajout, plafonné à `max` (5 par défaut, cf. `MAX_TAGS`). Ajout à
Enter ou au blur ; suppression via la croix de chaque tag.

| Prop       | Type                       | Défaut     | Rôle               |
| ---------- | -------------------------- | ---------- | ------------------ |
| `tags`     | `string[]`                 | —          | Tags courants      |
| `max`      | `number`                   | `MAX_TAGS` | Plafond            |
| `onAdd`    | `(label: string) => void`  | —          | Ajout d'un tag     |
| `onRemove` | `(index: number) => void`  | —          | Retrait d'un tag   |

Dépendances : `Tag`, `Field` (input intégré).
