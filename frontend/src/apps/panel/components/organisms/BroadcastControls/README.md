# BroadcastControls (organism · panel)

Diffusion & responsive : bascule de la rotation auto, limite de modules simultanés (1-4), file
d'attente, modules à l'écran, et simulateur de chat viewer (`!dofus`, `!guilde`, `!perso`, `!code`).

| Prop               | Type                    | Rôle                          |
| ------------------ | ----------------------- | ----------------------------- |
| `rotation`         | `boolean`               | Rotation en cours             |
| `limit`            | `number`                | Modules simultanés max        |
| `queueText`        | `string`                | File d'attente (résumé)       |
| `visibleText`      | `string`                | Modules à l'écran             |
| `chatLog`          | `ChatLine[]`            | Journal du simulateur         |
| `onToggleRotation` | `() => void`            | Bascule rotation              |
| `onLimit`          | `(n: number) => void`   | Règle la limite               |
| `onSendChat`       | `(text: string) => void`| Envoie une commande           |

Dépendances : `Button`, `Field`.
