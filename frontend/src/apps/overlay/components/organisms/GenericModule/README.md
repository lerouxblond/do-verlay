# GenericModule (organism · overlay)

Module générique paramétrable (engagement / monétisation) : kicker, contenu, icône optionnelle,
et taille d'affichage.

| Prop      | Type             | Rôle                              |
| --------- | ---------------- | --------------------------------- |
| `message` | `GenericMessage` | Contenu, taille (S/M/L), icône    |

Largeurs : S 340 · M 440 · L 540 px. Icône résolue via `util(...)`. Dépendances : `CardShell`,
`DofusIcon` (bibliothèque d'icônes — ici asset utilitaire).
