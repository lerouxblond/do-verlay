# DofusdexModule (organism · overlay)

Module phare : libellé d'objectif, compteur obtenus/total, plateau de Dofus dans l'ordre choisi
(tri manuel) et jauge de progression.

| Prop       | Type                          | Défaut             | Rôle                     |
| ---------- | ----------------------------- | ------------------ | ------------------------ |
| `ordre`    | `DofusId[]`                   | —                  | Ordre d'affichage        |
| `dofus`    | `Record<DofusId, DofusState>` | —                  | États par Dofus          |
| `objectif` | `string`                      | `'Dofus Trophées'` | Libellé d'objectif       |

Dépendances : `CardShell`, `DofusCard`, `ProgressBar`. Référentiel via `DOFUS_BY_ID`.
