# ModuleRow (molecule · panel)

Ligne de pilotage d'un module dans la sidebar : enseigne, nom + sous-titre, toggle d'épingle, et
bouton de commande chat (désactivé pendant le cooldown, avec décompte) + rappel des timings.

| Prop           | Type                          | Rôle                              |
| -------------- | ----------------------------- | --------------------------------- |
| `suit`         | `Suit`                        | Enseigne du module                |
| `name`/`sub`   | `string`                      | Libellés                          |
| `command`      | `string`                      | Commande chat (`!dofus`…)         |
| `pinned`       | `boolean`                     | Épinglé                           |
| `visible`      | `boolean`                     | À l'écran (liseré accentué)       |
| `cooldownLeft` | `number`                      | Secondes restantes (0 = dispo)    |
| `onTogglePin`  | `(pinned: boolean) => void`   | Épingle/masque                    |
| `onTrigger`    | `() => void`                  | Déclenche l'affichage             |

Dépendances : `SuitGlyph`, `Toggle`, `Button` (commande).
