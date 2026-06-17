# DofusCard (molecule · partagé)

Une case du Dofusdex : l'icône d'un Dofus rendue selon son état, lisible d'un coup d'œil. Sur le
panel elle devient cliquable pour faire défiler l'état.

| Prop      | Type           | Défaut | Rôle                          |
| --------- | -------------- | ------ | ----------------------------- |
| `dofus`   | `Dofus`        | —      | Référentiel (id, nom, asset)  |
| `state`   | `DofusState`   | —      | État de progression           |
| `size`    | `number`       | `56`   | Taille de l'icône             |
| `onClick` | `() => void`   | —      | Rend la case cliquable        |

Dépendance : `DofusIcon`.
