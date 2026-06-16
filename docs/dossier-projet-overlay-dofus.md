# DOSSIER PROJET — Overlay Stream Dofus « Projet Chapiteau »
### Document d'instruction pour Claude Design

| | |
|---|---|
| **Type** | Overlay de stream Twitch modulaire + panel de contrôle |
| **Échéance contextuelle** | Sortie MAJ Dofus le 23 juin 2026 (rush) |
| **Nom de code** | « Chapiteau » *(provisoire — voir §11)* |
| **Statut** | Brief initial — v1 |
| **Identité visuelle** | Thème Zobal / cirque harlequin (touche Ecaflip) |

> **Note de lecture pour Claude Design** : ce dossier décrit *quoi* construire et *pourquoi*. Les choix d'implémentation laissés ouverts sont signalés `[À TRANCHER]`. Les partis pris que j'ai pris à la place du commanditaire sont signalés `[Hypothèse]` et peuvent être révisés.

---

## 1. Synthèse

Construire un **overlay de stream unique et modulaire** destiné à un streamer Dofus, compatible OBS et Streamlabs, accompagné d'un **panel de contrôle** permettant de configurer, éditer, sauvegarder et charger plusieurs profils.

L'overlay agrège plusieurs **modules indépendants** (progression de Dofus, étendard de guilde, fiche personnage, messages génériques) qui s'affichent soit automatiquement par rotation, soit à la demande via des commandes dans le chat. L'ensemble repose sur une **identité visuelle forte** (univers carnaval / cirque harlequin inspiré du Zobal) et une **architecture extensible** prête à accueillir de nouveaux modules et de nouveaux thèmes.

## 2. Objectifs

- **Montrer la progression** du rush Dofus aux viewers de façon lisible et spectaculaire.
- **Servir la communauté / la guilde** : recrutement, identité, appartenance.
- **Soutenir l'engagement et la monétisation** : code créateur, incitation au follow/sub, messages récurrents.
- **Rester extensible** : ajouter facilement des modules et des thèmes sans refonte.
- **Être autonome côté streamer** : tout se configure depuis un panel, sans toucher au code.

## 3. Contraintes & cadre technique

L'overlay doit fonctionner comme une **source navigateur** (« browser source ») dans OBS et Streamlabs. Cela implique un rendu **web (HTML / CSS / JS)** dans un navigateur Chromium embarqué, généralement en 1920×1080 transparent par-dessus le jeu.

Points structurants à intégrer dès la conception :

- **Overlay unique** : une seule source navigateur contient *tous* les modules. On n'empile pas plusieurs sources. Les modules sont positionnés et gérés à l'intérieur de ce conteneur global.
- **Commandes viewers = lecture du chat Twitch** : une source navigateur n'est pas connectée au chat par défaut. L'overlay devra se connecter au chat Twitch (lecture seule, ex. via WebSocket IRC anonyme) à partir du **nom de chaîne** renseigné dans le panel, afin d'écouter les commandes type `!dofus`, `!guilde`, etc. `[À TRANCHER : IRC anonyme vs intégration bot existant type Nightbot/StreamElements]`
- **Persistance & profils** : la configuration et les profils doivent survivre au redémarrage d'OBS. Approche recommandée : stockage local (`localStorage`) + **export/import de profils en fichier JSON** pour le partage et la sauvegarde robuste. `[À TRANCHER]`
- **Communication panel ↔ overlay** : le panel édite la config, l'overlay la consomme en direct. Si panel et overlay sont sur la même origine, synchronisation possible via `localStorage` + `BroadcastChannel` (mise à jour temps réel sans recharger). `[À TRANCHER : sans backend (local) vs avec backend léger pour multi-poste]`
- **Performance** : l'overlay tourne en continu pendant tout le live → animations sobres et optimisées, pas de fuite mémoire, mise en veille des modules masqués.
- **Lisibilité OBS** : fond transparent, contrastes suffisants pour rester lisible par-dessus n'importe quelle scène de jeu.

## 4. Architecture générale

L'overlay se pense en **trois couches** :

1. **Couche données** — modèle de profil (config de chaque module, thème actif, timers, cooldowns). Sauvegarde / chargement / export.
2. **Couche affichage** — moteur de placement des modules, rotation automatique, déclenchement par commande, gestion des transitions.
3. **Couche modules** — chaque module est un composant autonome avec son contenu, ses états et son rendu, branché sur la couche données.

### Système de placement & responsive entre modules

Les modules s'ancrent à des **zones d'écran** (coins, bords, centre). Quand plusieurs modules sont visibles simultanément et risquent de se chevaucher :

- ils se **réorganisent / décalent automatiquement** plutôt que de se superposer ;
- l'écran ne doit jamais être **surchargé** : prévoir une limite de modules visibles en simultané et/ou une mise en file d'attente ;
- comportement attendu : « collision douce » — un module qui apparaît pousse ou empile proprement les autres, puis tout revient en place quand il disparaît.

`[À préciser par le streamer : zones d'ancrage préférées par module — voir §11]`

## 5. Spécification des modules

> Convention d'état générique pour tout module affichable : **masqué → entrée (animation) → affiché → sortie (animation) → masqué**.

### 5.1 Dofusdex (liste des Dofus)

**Rôle** : afficher la collection de Dofus visée par le streamer et sa progression, pour la montrer aux viewers.

- **Contenu** : grille / liste des Dofus **configurable** (le streamer choisit lesquels font partie de son objectif de rush).
- **Trois états par Dofus** :
  - `not started` — non commencé (verrouillé / grisé / silhouette) ;
  - `on going` — en cours (mise en valeur partielle, lueur, indicateur de progression) ;
  - `complete` — obtenu (pleine couleur, halo / coche / effet de validation).
- **Configuration** : sélection des Dofus inclus, ordre d'affichage, état de chacun (modifiable en direct depuis le panel pendant le live), libellé d'objectif optionnel (ex. « Objectif Dofus Trophées »).
- **Affichage** : peut s'afficher en permanence (mode vitrine compacte) **ou** par rotation / commande. À préciser. `[À TRANCHER : module persistant ou rotatif ?]`
- **Assets** : utilise les **assets de tous les Dofus** fournis.

### 5.2 Étendard de guilde

**Rôle** : afficher l'identité de la guilde et, le cas échéant, recruter.

- **Contenu** : blason, nom de la guilde, statut de recrutement (**ouvert / fermé**) et, si ouvert, **conditions de recrutement**.
- **Cas d'usage** : guilde perso affichée, guilde communautaire, ou recrutement actif.
- **Configuration** : blason (parmi les assets), nom, toggle ouvert/fermé, champ texte conditions.
- **Affichage** : rotation automatique + commande viewer (`!guilde` par ex.).
- **Assets** : utilise les **blasons de guildes** fournis.

### 5.3 Fiche personnage (simple)

**Rôle** : carte d'identité rapide du personnage joué.

- **Contenu** : nom du personnage, serveur, niveau, points de succès.
- **Configuration** : champs éditables ; classe associée (pour l'asset / cohérence visuelle). `[Hypothèse : on lie la classe à l'asset de classe fourni — utile pour l'illustration de la fiche]`
- **Affichage** : rotation automatique + commande viewer.
- **Assets** : utilise les **assets de classes** fournis.

### 5.4 Module générique (messages & engagement)

**Rôle** : faire passer des messages récurrents d'engagement / monétisation.

- **Contenu** : code créateur, invitation à l'abonnement (follow / sub), messages personnalisés libres.
- **Configuration** : liste de messages, chacun activable/désactivable, durée, fréquence.
- **Affichage** : rotation automatique + commande viewer.

## 6. Comportements d'affichage & commandes

Ces comportements s'appliquent aux modules « affichables à la demande » (étendard, fiche perso, générique, et Dofusdex si rotatif).

- **Rotation automatique** : chaque module peut s'afficher tous les **X temps**, **configurable par le streamer** (durée d'affichage + intervalle entre apparitions, idéalement réglables par module).
- **Commandes viewers** : chaque module dispose d'une **commande de chat** pour l'afficher à la demande (libellés configurables, ex. `!dofus`, `!guilde`, `!perso`, `!code`).
- **Cooldown anti-spam** : chaque commande possède un **cooldown configurable** pour éviter le spam. Pendant le cooldown, la commande est ignorée silencieusement.
- **Coordination affichage** : la rotation auto et les commandes doivent cohabiter (ex. une commande peut interrompre/avancer la rotation ; éviter qu'un module se déclenche pendant qu'un autre occupe déjà sa zone — cf. responsive §4).
- **File d'attente** : si plusieurs déclenchements arrivent en même temps, les gérer en file plutôt qu'en superposition pour ne pas surcharger l'écran.

`[À TRANCHER : une commande pendant la rotation auto = priorité immédiate ou ajout en file ?]`

## 7. Panel de contrôle streamer

Interface séparée (page web) permettant au streamer de tout piloter sans toucher au code.

- **Édition des modules** : activer/désactiver, remplir le contenu, choisir les assets, régler durées / intervalles / cooldowns / commandes.
- **Édition en direct** : notamment changer l'état des Dofus (`not started` → `on going` → `complete`) pendant le live, avec mise à jour temps réel de l'overlay.
- **Profils** : créer **plusieurs profils**, les **sauvegarder**, les **charger**, les dupliquer, les **exporter/importer** (JSON). Cas d'usage : un profil par perso, par serveur, par type de stream.
- **Thèmes** : sélection du thème visuel (un seul pour l'instant, architecture prête pour plus — §8).
- **Réglages globaux** : nom de chaîne Twitch (pour la connexion chat), zones d'ancrage des modules, limite de modules simultanés.
- **Aperçu** : idéalement, prévisualisation de l'overlay dans le panel.

## 8. Direction artistique

### Concept central : le chapiteau harlequin

Univers de **cirque / carnaval** ancré sur l'esthétique du **Zobal** (le bateleur masqué, l'arlequin, les masques, le motif losange) avec une **touche Ecaflip** (jeu, hasard, cartes, dés, pièces d'or, chance). On crée une **identité propre à l'overlay** — pas un simple habillage Dofus, mais une marque visuelle reconnaissable.

**Registre visuel à explorer :**
- Motif **losange harlequin** (arlequin) en éléments de fond, bordures, séparateurs.
- **Masques** de carnaval, **rideaux de scène / chapiteau**, encadrements **dorés ornementés** (style affiche de cirque vintage).
- Touche Ecaflip : **cartes à jouer, dés, pièces**, clins d'œil au hasard/à la chance (ex. transitions « tirage de carte »).
- Ambiance **théâtrale** : projecteurs, révélations « lever de rideau » pour l'apparition des modules.

**Palette `[Hypothèse, à valider]` :** violet profond / pourpre (Zobal) + or (cadres, accents) + crème (lisibilité des données) + rouge accent (Ecaflip / chapiteau) ; éventuellement une pointe de teal pour le contraste. Toujours contrasté pour rester lisible par-dessus le jeu.

**Typographie `[Hypothèse]` :** un display ornemental / « affiche de cirque » pour les titres ; une sans-serif nette et très lisible pour les données (niveau, points, noms).

**Animations / transitions :** lever de rideau, retournement de carte, flourish de masque, balayage de projecteur — sobres, courtes, jamais gênantes pour le live.

### Système de theming (extensible)

Même si **un seul thème** est livré au départ, la DA doit être pensée comme un **système thématisable** : couleurs, typos, motifs, cadres et animations centralisés (tokens / variables) pour qu'on puisse ajouter d'autres thèmes (autres classes) plus tard sans réécrire les modules.

## 9. Assets

**Fournis par le commanditaire :**
- Assets de **tous les Dofus** (pour le Dofusdex).
- Assets des **blasons de guildes** (pour l'étendard).
- Assets de **classes** (pour la fiche personnage / illustrations).
- Divers **assets utilitaires**.

**À produire / définir côté design** *(probable)* :
- Cadres, bordures, motifs harlequin, masques, éléments de chapiteau.
- Icônes d'état des Dofus (not started / on going / complete).
- Éléments d'UI du panel de contrôle.

`[À préciser : formats et résolutions des assets fournis, conventions de nommage]`

## 10. Livrables attendus de Claude Design

1. **Concept visuel** du thème « chapiteau harlequin » (planche d'ambiance, palette, typo, motifs, états des modules).
2. **Maquettes** de chaque module (Dofusdex, étendard, fiche perso, générique) dans leurs différents états.
3. **Maquette de l'overlay assemblé** montrant le placement et le comportement responsive entre modules.
4. **Maquette du panel de contrôle** (édition modules + gestion des profils).
5. **Spécification du système de theming** (tokens réutilisables) pour l'extensibilité.
6. *(Si pertinent)* Prototype interactif de l'overlay et/ou du panel.

## 11. Questions ouvertes / décisions à trancher

Points qui orienteront fortement la conception :

1. **Nom de code** — « Chapiteau » est provisoire. Un nom propre à l'overlay fait partie de l'identité.
2. **Dofusdex : persistant ou rotatif ?** Vitrine toujours visible (compacte) ou affiché par rotation/commande comme les autres ?
3. **Zones d'ancrage** souhaitées pour chaque module (coins ? bandeau bas ? latéral ?).
4. **Connexion au chat** : lecture directe (IRC anonyme) ou s'appuyer sur un bot existant (Nightbot, StreamElements) ?
5. **Persistance / multi-poste** : 100 % local (un seul PC de stream) suffit-il, ou besoin de synchro entre plusieurs machines (→ backend léger) ?
6. **Priorité commande vs rotation auto** : interruption immédiate ou file d'attente ?
7. **Cible technique** : web pur sans dépendances, ou framework autorisé (ex. React) ?
8. **MAJ du 23 juin** : faut-il une liste de Dofus pré-remplie correspondant à cette mise à jour, ou le Dofusdex reste-t-il 100 % générique/configurable ?
