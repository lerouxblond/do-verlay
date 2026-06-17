# GuildEditor (organism · panel)

Formulaire de l'étendard de guilde : **blason réel** (sélecteur écusson + symbole dans la
bibliothèque d'emblèmes fournie), nom, niveau, recrutement (3 états) et tags (≤ 5).

| Prop     | Type                            | Rôle                                  |
| -------- | ------------------------------- | ------------------------------------- |
| `guild`  | `Guild`                         | Données courantes                     |
| `update` | `(recipe: (g: Guild) => void) => void` | Applique une mutation au profil |

Dépendances : `GuildCrest` (aperçu), `FormField`, `RecruitSegmented`, `TagGroup`, `Field`. Les ids
d'emblème proviennent de `emblemBackIds` / `emblemUpIds` (assets de blason fournis).
