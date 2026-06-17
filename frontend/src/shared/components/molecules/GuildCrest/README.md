# GuildCrest (molecule · partagé)

Blason de guilde + identité : nom, niveau, pastille de recrutement. Le blason utilise les **vrais
assets d'emblème** fournis (`emblem_backcontent` = fond d'écusson + `emblem_up` = symbole,
composités) — et non plus l'icône de classe du prototype.

| Prop        | Type     | Défaut | Rôle                   |
| ----------- | -------- | ------ | ---------------------- |
| `guild`     | `Guild`  | —      | Données de guilde      |
| `crestSize` | `number` | `64`   | Taille du blason (px)  |

`guild.emblem = { back, up }` indexe la bibliothèque d'emblèmes (résolue par `shared/assets.ts`).
Dépendances : `StateBadge` (recrutement), assets emblèmes.
