# EtendardModule (module overlay)

Visuel du module **Étendard de guilde** : `CardShell` (enseigne trèfle, sans rang ni liseré) +
`GuildCrest` (blason composite + nom + niveau + pastille de recrutement) ; si le recrutement est
ouvert, affiche les conditions sous forme de `Tag`. Lit `profile.guild`, aucun état runtime.

Réutilisé comme aperçu live dans le panel (`EtendardView`). Props : `profile`, `width`.
