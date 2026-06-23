# ClassPicker

Sélecteur **visuel** de classe (panel, config Fiche perso) : grille de médaillons de classe
plutôt qu'un `<select>`. Réutilise `Avatar` + `classCharacter` ; le **genre** passé en prop
pilote le sprite, donc basculer le sexe redessine toute la grille.

Props : `value` (clé de classe, '' = aucune), `gender` (`'male' | 'female'`), `onChange`.
Accessible : `role="radiogroup"` + tuiles `role="radio"` (`aria-checked`). Survol/focus dorés via
`.dv-class-tile` (`fonts.css`), `prefers-reduced-motion` respecté.

Styles : `ClassPicker.styles.ts` (grille auto-fill, tuile, libellé).
