# StateBadge (atom · partagé)

Pastille d'état colorée, réutilisée pour la progression d'un Dofus et pour le recrutement d'une
guilde. Les variantes « recrutement » affichent une puce ronde (dot).

| Prop      | Type           | Défaut              | Rôle                       |
| --------- | -------------- | ------------------- | -------------------------- |
| `variant` | `BadgeVariant` | —                   | État (couleurs + libellé)  |
| `label`   | `string`       | libellé de variante | Surcharge le texte         |

Variantes : `complete` · `on_going` · `not_started` (Dofus) ; `open` · `on_request` · `closed`
(guilde). Couleurs définies dans `StateBadge.styles.ts` (conformes au design system §06/§07).
Aucune dépendance (atome).
