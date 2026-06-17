# DofusdexEditor (organism · panel)

Édition live du Dofusdex : grille d'états (clic = cycle not_started → on_going → complete) +
liste de tri manuel (drag & drop + ▲▼). Gère localement l'état de drag.

| Prop           | Type                                | Rôle                          |
| -------------- | ----------------------------------- | ----------------------------- |
| `ordre`        | `DofusId[]`                         | Ordre courant                 |
| `dofus`        | `Record<DofusId, DofusState>`       | États                         |
| `onCycle`      | `(id) => void`                      | Fait défiler l'état d'un Dofus |
| `onReorder`    | `(from, to) => void`                | Déplace une entrée            |
| `onResetOrder` | `() => void`                        | Réordonne par défaut          |

Dépendances : `DofusCard`, `DofusOrderRow`.
