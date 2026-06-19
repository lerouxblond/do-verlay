# AllianceModule (module overlay)

Visuel du module **Alliance** : `CardShell` (enseigne trèfle, sans rang ni liseré) +
`AllianceCrest` (blason composite + nom + acronyme + pastille de recrutement) ; si le recrutement
est ouvert, affiche les conditions sous forme de `Tag`. Lit `profile.alliance`, aucun état runtime.

Réutilisé comme aperçu live dans le panel (`EtendardView`). Props : `profile`, `width`.

Jumeau de `EtendardModule` (guilde) : l'alliance a un **acronyme** `[ABC]` à la place du niveau.
