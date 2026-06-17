# Toggle (atom · panel)

Interrupteur on/off (épingler ou masquer un module). Vert lorsque actif.

| Prop       | Type                         | Rôle             |
| ---------- | ---------------------------- | ---------------- |
| `checked`  | `boolean`                    | État             |
| `onChange` | `(checked: boolean) => void` | Bascule          |
| `title`    | `string`                     | Tooltip          |

`role="switch"` + `aria-checked`. Aucune dépendance (atome).
