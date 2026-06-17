# DofusdexModule (module overlay)

Visuel du module Dofusdex affiché sur l'overlay : `CardShell` (enseigne carreau) avec le
libellé d'objectif, une `ProgressBar` (Dofus obtenus / suivis) et la grille des Dofus suivis
(`DofusCard` selon l'état). Purement présentationnel — lit `profile` (`ordre`, `dofus`,
`dofusdex_objectif`), aucun état runtime (la visibilité/rotation est gérée par
`useOverlayEngine`).

Deux formats (prop `layout`, sinon `profile.dofusdex_format`) : `vertical` (portrait, en-tête
au-dessus de la grille) et `horizontal` (bannière paysage, en-tête à gauche, Dofus à droite).
Pas de rang ni de liseré de tête (`CardShell` `topStrip={false}`, sans `index`).

Réutilisé tel quel comme **aperçu live** dans le panel (`DofusdexView`). Props : `profile`,
`layout`, `width`, `cell` (largeur/taille par défaut selon le format).
