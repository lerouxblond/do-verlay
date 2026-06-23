# EmblemDesigner (composant panel)

Concepteur de blason **réutilisable** pour la guilde et l'alliance. Compose un `GuildEmblem` :

- **Aperçu live** en haut (`EmblemCrest`, taillé selon la `variant`).
- **Couleurs** fond + symbole (`ColorInput`).
- **Forme** : grille des formes disponibles (`formeIds()`), chaque vignette affichant le **rendu
  composé** (fond teinté + contour apparié à la `variant`) — l'utilisateur voit la forme réelle.
- **Symbole par catégorie** : onglets dérivés de `SYMBOL_CATEGORIES` + grille paginée
  (« Voir plus ») des symboles de la catégorie courante.

Props :
- `emblem: GuildEmblem` — le blason courant.
- `variant: 'guild' | 'alliance'` — jeu de contours (`assets/emblems.contourUrl`).
- `onChange: (recipe: (e: GuildEmblem) => void) => void` — l'appelant applique la recette sur le
  blason persisté (`updateProfile`). Aucune persistance ni état métier ici.

Assets résolus via `@shared/assets/emblems` (dossiers triés `assets/guild_alliance/`).
