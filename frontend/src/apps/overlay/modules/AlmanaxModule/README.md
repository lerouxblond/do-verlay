# Module Almanax

Gadget **informatif à données live**. Affiche l'almanax du jour récupéré depuis l'API
open-source [dofusdude](https://docs.dofusdu.de) (`api.dofusdu.de`, sans clé) :

- **Bonus du jour** : type + description.
- **Offrande** : icône + nom de l'item + quantité.
- **Récompenses** : kamas + XP **au niveau 200** (`?level=200`, sinon `reward_xp` est `null`).

## Particularités

- **Pas câblé sur le `Profile`** : contrairement aux autres modules (Fiche, Étendard…), les
  données ne sont pas saisies par l'utilisateur mais récupérées à l'exécution. Le composant
  n'accepte donc pas de `profile`.
- **Fetch** : `useAlmanax` (hook local) → `fetchAlmanax` (`@shared/data/almanax`). Cache mémoire
  par date pour ne pas rappeler l'API à chaque rotation/montage.
- **Jour Ankama** : la date est calculée en `Europe/Paris` via `@shared/lib/almanaxDate`, pas
  dans le fuseau local du streamer.
- **CSP** : `https://api.dofusdu.de` doit être autorisé dans `connect-src` (JSON) et `img-src`
  (icône) côté serveur Go — cf. `server/cmd/api/main.go`.

## Fichiers

- `AlmanaxModule.tsx` / `.styles.ts` — visuel (CardShell, enseigne ♥ `coeur`).
- `useAlmanax.ts` — hook de chargement (loading/error).
- `AlmanaxModule.test.tsx` — rendu avec `fetch` mocké.

Config panel : `apps/panel/views/AlmanaxView.tsx` (aperçu + réglages communs, aucun champ de
contenu à saisir).
