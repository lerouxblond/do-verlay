# Installation locale — do-verlay

Guide d'installation pour utiliser do-verlay en local sur sa propre machine.

---

## Prérequis

| Outil | Version minimale | Téléchargement |
|-------|-----------------|----------------|
| **Node.js** | 20+ | https://nodejs.org |
| **Go** | 1.22+ | https://go.dev/dl |
| **Make** | — | Inclus sur Linux/macOS. Sur Windows : via [Git Bash](https://git-scm.com/downloads) ou `winget install GnuWin32.Make` |

Vérifier les versions installées :
```bash
node -v
go version
make --version
```

---

## Démarrage rapide (avec Make)

```bash
make run     # installe les dépendances, build le frontend, lance le serveur
```

Puis ouvrir `http://localhost:8787` dans un navigateur.

Commandes disponibles :

| Commande | Description |
|----------|-------------|
| `make install` | Installe les dépendances Node |
| `make build` | Compile le frontend + le binaire Go |
| `make run` | Build frontend + lance via `go run` (usage courant) |
| `make start` | Lance le binaire compilé (après `make build`) |
| `make dev` | Lance le serveur de dev Vite seul (développement frontend) |
| `make test` | Lance les tests frontend |
| `make clean` | Supprime le build et le binaire |

---

## 1. Récupérer les sources

### Depuis une release GitHub

1. Aller sur la page **Releases** du dépôt
2. Télécharger le fichier `Source code (zip)` de la dernière version
3. Extraire l'archive dans le dossier de ton choix

### Depuis git (pour suivre les mises à jour)

```bash
git clone https://github.com/lerouxblond/do-verlay.git
cd do-verlay
```

---

## 2. Compiler le frontend

```bash
cd frontend
npm install
npm run build
```

Cela génère le dossier `frontend/dist/` — les fichiers statiques servis par le serveur.

---

## 3. Lancer le serveur

### Mode développement (relance à chaque modification)

```bash
cd server
go run ./cmd/api
```

### Mode production (compiler un binaire)

```bash
cd server
go build -o do-verlay ./cmd/api
./do-verlay
```

> Sur Windows : `go build -o do-verlay.exe ./cmd/api` puis `.\do-verlay.exe`

Le serveur démarre sur **`http://localhost:8787`** par défaut.

---

## 4. Ouvrir le panel de contrôle

Ouvrir un navigateur et accéder à :

```
http://localhost:8787
```

C'est ici que tu configures tes profils, tes modules et tes dispositions.

---

## 5. Configurer OBS / Streamlabs

Ajouter une **source navigateur** (Browser Source) dans ta scène :

| Paramètre | Valeur |
|-----------|--------|
| URL | `http://localhost:8787/overlay` |
| Largeur | `1920` |
| Hauteur | `1080` |
| Fond transparent | ✅ Activé (`Page background colour` → transparent) |
| FPS personnalisé | `30` (recommandé) |

> L'overlay et le panel se synchronisent automatiquement via WebSocket. Chaque modification dans le panel s'applique immédiatement sur la source OBS, sans recharger.

---

## 6. Variables d'environnement (optionnel)

| Variable | Défaut | Description |
|----------|--------|-------------|
| `PORT` | `8787` | Port d'écoute du serveur |
| `HOST` | `127.0.0.1` | Interface réseau (mettre `0.0.0.0` pour accès réseau local) |
| `STATIC_DIR` | `../frontend/dist` | Chemin vers le build frontend |

Exemple pour changer le port :

```bash
# Linux / macOS
PORT=9000 go run ./cmd/api

# Windows PowerShell
$env:PORT = "9000"; go run ./cmd/api
```

---

## 7. Sauvegarde et transfert de config

La configuration est stockée dans le **localStorage** du navigateur qui affiche le panel. Pour la sauvegarder ou la transférer vers une autre machine :

1. Dans le panel, aller dans **Profils**
2. Cliquer sur **Exporter tout** (section « Sauvegarde complète »)
3. Un fichier `do-verlay-config.json` est téléchargé — il contient tous les profils, toutes les dispositions et les configs Dofusdex
4. Sur la nouvelle machine, cliquer sur **Importer tout…** et sélectionner ce fichier

---

## 8. Mise à jour

### Depuis une release

1. Télécharger la nouvelle version et extraire
2. Reprendre les étapes **2** et **3**

### Depuis git

```bash
git pull
cd frontend && npm install && npm run build
cd ../server && go run ./cmd/api
```

> La config (localStorage du navigateur) est conservée entre les mises à jour. Un import de config incompatible est normalisé automatiquement — les champs manquants reçoivent leurs valeurs par défaut.

---

## Dépannage

**L'overlay OBS ne reçoit pas les modifications du panel**
- Vérifier que le serveur tourne bien (`http://localhost:8787` accessible dans un navigateur)
- OBS utilise un navigateur intégré avec un localStorage isolé du tien — la synchro passe par le serveur Go via WebSocket. Si le serveur est coupé, l'overlay charge la dernière config reçue mais ne se met plus à jour.

**Erreur `ENOENT: no such file or directory` au démarrage du serveur**
- Le build frontend n'a pas été fait — relancer l'étape 2.

**Port 8787 déjà utilisé**
- Changer le port via la variable `PORT` (voir section 6).
