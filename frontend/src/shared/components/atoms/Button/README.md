# Button (atom · partagé)

Action générique. Étend `<button>` natif (tous les attributs HTML passent).

| Prop      | Type                                                       | Défaut   | Rôle    |
| --------- | ---------------------------------------------------------- | -------- | ------- |
| `variant` | `'primary' \| 'accent' \| 'secondary' \| 'danger' \| 'ghost'` | `'ghost'` | Style |
| `size`    | `'sm' \| 'md'`                                             | `'md'`   | Taille  |
| `...rest` | `ButtonHTMLAttributes`                                     | —        | `onClick`, `disabled`, `title`… |

Variantes conformes au design system §05 : `primary` (rouge Zobal), `accent` (or Ecaflip),
`secondary` (contour), `danger` (rouge), `ghost` (or atténué). Aucune dépendance (atome).
