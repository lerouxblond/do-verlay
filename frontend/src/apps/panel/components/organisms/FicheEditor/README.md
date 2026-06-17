# FicheEditor (organism · panel)

Formulaire de la fiche personnage : nom, serveur (liste fermée), classe, niveau, points de succès
et genre (M/F — pilote l'asset de classe).

| Prop     | Type                                       | Rôle              |
| -------- | ------------------------------------------ | ----------------- |
| `perso`  | `Character`                                | Données courantes |
| `update` | `(recipe: (c: Character) => void) => void` | Mutation du profil |

Dépendances : `FormField`, `Field` / `SelectField`. Serveurs depuis `SERVERS`, classes depuis
`CLASSES`.
