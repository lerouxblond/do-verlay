# Field / SelectField (atom · panel)

Champs de saisie bruts du panel, stylés selon le design system (fond sombre, liseré or).

### `Field`

| Prop          | Type                       | Défaut   | Rôle                |
| ------------- | -------------------------- | -------- | ------------------- |
| `type`        | `'text' \| 'number'`       | `'text'` | Type d'input        |
| `value`       | `string`                   | —        | Valeur contrôlée    |
| `onChange`    | `(value: string) => void`  | —        | Changement          |
| `placeholder` | `string`                   | —        | Indication          |
| `disabled`    | `boolean`                  | —        | Désactivé           |
| `onKeyDown`   | handler clavier            | —        | Ex. valider à Enter |

### `SelectField`

| Prop      | Type                      | Rôle                    |
| --------- | ------------------------- | ----------------------- |
| `value`   | `string`                  | Option sélectionnée     |
| `onChange`| `(value: string) => void` | Changement              |
| `options` | `readonly string[]`       | Liste fermée (ex. SERVERS) |

Aucune dépendance (atome).
