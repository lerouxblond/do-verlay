# Avatar (atom · partagé)

Médaillon rond « masque + fondu » : recadre le buste d'un asset de classe et fond son bas carré
par un dégradé, sans cadre spécial (solution design system §05).

| Prop   | Type     | Défaut      | Rôle                              |
| ------ | -------- | ----------- | --------------------------------- |
| `src`  | `string` | —           | URL de l'illustration de classe   |
| `size` | `number` | `64`        | Diamètre (px)                     |
| `ring` | `string` | `'#E8C877'` | Couleur du liseré                 |
| `alt`  | `string` | `''`        | Texte alternatif                  |

URL résolue par l'appelant (`classCharacter` de `shared/assets.ts`). Aucune dépendance (atome).
