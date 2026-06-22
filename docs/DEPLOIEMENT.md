# Déploiement — do-verlay (Chapiteau)

Guide de référence complet pour installer, configurer et faire tourner l'overlay Dofus en développement ou en production.

---

## Table des matières

1. [Architecture](#1-architecture)
2. [Prérequis](#2-prérequis)
3. [Installation et configuration initiale](#3-installation-et-configuration-initiale)
4. [Environnement de développement](#4-environnement-de-développement)
5. [Build de production](#5-build-de-production)
6. [Déploiement production (serveur local)](#6-déploiement-production-serveur-local)
7. [Configuration OBS](#7-configuration-obs)
8. [Configuration Twitch](#8-configuration-twitch)
9. [Variables d'environnement — référence complète](#9-variables-denvironnement--référence-complète)
10. [Base de données et migrations](#10-base-de-données-et-migrations)
11. [Intégration continue (CI)](#11-intégration-continue-ci)
12. [Maintenance](#12-maintenance)
13. [Dépannage](#13-dépannage)

---

## 1. Architecture

```
do-verlay/
├── frontend/          # SPA React 18 + TypeScript + Vite 5
│   ├── src/
│   │   └── main.tsx   # Point d'entrée
│   └── dist/          # Build de production (généré)
├── server/            # Serveur Go (net/http + gorilla/websocket + pgx/v5)
│   ├── cmd/api/
│   │   └── main.go    # Point d'entrée du serveur
│   ├── internal/
│   ├── migrations/    # Scripts SQL
│   └── bin/api        # Binaire compilé (généré)
├── docker-compose.yml # PostgreSQL 16 pour le dev
├── .env.example       # Template de configuration
└── docs/
```

**Flux de données :**
- Le serveur Go écoute sur le port 8787.
- Il sert le frontend compilé (`frontend/dist/`) comme fichiers statiques.
- Il expose une API REST (`/api/...`) et un endpoint WebSocket pour la communication temps réel.
- L'overlay OBS pointe sur `http://localhost:8787/#/overlay`.
- Le panneau de contrôle est accessible à `http://localhost:8787/#/panel/...` (protégé par auth Twitch).

**Routes applicatives (HashRouter) :**

| Route | Description |
|---|---|
| `#/` | Page d'accueil publique |
| `#/overlay` | Source navigateur OBS |
| `#/panel/*` | Panneau de contrôle (Twitch auth requis) |

---

## 2. Prérequis

### Outils obligatoires

| Outil | Version minimale | Usage |
|---|---|---|
| Go | 1.25 | Compilation et exécution du serveur |
| Node.js | 18+ (LTS) | Build du frontend |
| npm | 9+ | Gestionnaire de paquets frontend |

### Outils optionnels

| Outil | Usage |
|---|---|
| Docker + Docker Compose | Base de données PostgreSQL 16 (persistance) |
| psql | Application manuelle des migrations |
| OBS Studio | Utilisation de l'overlay |

### Vérification de l'environnement

```bash
go version        # go version go1.25.x ...
node --version    # v18.x.x ou supérieur
npm --version     # 9.x.x ou supérieur
docker --version  # Docker version 24.x.x ... (optionnel)
```

---

## 3. Installation et configuration initiale

### 3.1 Cloner le dépôt

```bash
git clone <url-du-repo> do-verlay
cd do-verlay
```

### 3.2 Créer le fichier d'environnement

```bash
cp .env.example .env
```

Éditer `.env` et renseigner au minimum :

```env
PORT=8787
HOST=127.0.0.1
STATIC_DIR=../frontend/dist

POSTGRES_PASSWORD=un_mot_de_passe_fort   # obligatoire si Docker est utilisé
POSTGRES_USER=doverlay
POSTGRES_DB=doverlay
DATABASE_URL=postgres://doverlay:un_mot_de_passe_fort@localhost:5432/doverlay

VITE_TWITCH_CLIENT_ID=votre_client_id_twitch
```

> **Important :** Ne jamais committer le fichier `.env` ; il est dans `.gitignore`.

---

## 4. Environnement de développement

Le mode développement fait tourner trois processus en parallèle dans trois terminaux distincts.

### Terminal 1 — Base de données (optionnel)

```bash
docker compose up -d
```

Vérifie que le conteneur est sain :

```bash
docker compose ps
```

### Terminal 2 — Frontend (Vite dev server)

```bash
cd frontend
npm install
npm run dev
```

Le frontend est disponible sur `http://localhost:5173`.

Les modifications de code sont reflétées instantanément grâce au Hot Module Replacement.

### Terminal 3 — Serveur Go

```bash
cd server
go run ./cmd/api
```

Le serveur écoute sur `http://localhost:8787`.

En développement, le frontend Vite tourne séparément sur le port 5173 ; le serveur Go n'a donc pas besoin de servir les fichiers statiques. La variable `STATIC_DIR` peut pointer vers un répertoire inexistant sans causer d'erreur fatale.

### Lancer les tests

```bash
# Tests frontend (Vitest — 34 tests)
cd frontend
npm run test

# Tests Go
cd server
go test ./...
```

---

## 5. Build de production

### 5.1 Build du frontend

```bash
cd frontend
npm install
npm run build
```

Les fichiers compilés sont générés dans `frontend/dist/`. Ce répertoire est servi directement par le serveur Go en production.

### 5.2 Build du serveur Go

```bash
cd server
go build -o bin/api ./cmd/api
```

Le binaire est disponible à `server/bin/api`.

### 5.3 Vérification du build

```bash
ls frontend/dist/      # index.html, assets/, ...
ls server/bin/api      # binaire exécutable
```

---

## 6. Déploiement production (serveur local)

La cible principale de déploiement est une machine locale (PC de stream) où l'overlay tourne en même temps qu'OBS.

### 6.1 Préparer l'environnement

```bash
# À la racine du projet
cp .env.example .env
# Editer .env avec les vraies valeurs (voir section 9)
```

### 6.2 Démarrer la base de données

```bash
docker compose up -d
```

Les migrations `0001_init.sql` et `0002_config_snapshot.sql` sont appliquées automatiquement au premier démarrage du volume Docker.

### 6.3 Builder et lancer

```bash
# Build frontend
cd frontend && npm install && npm run build && cd ..

# Build serveur
cd server && go build -o bin/api ./cmd/api && cd ..

# Lancer (depuis la racine, avec les variables d'environnement du .env)
set -a && source .env && set +a   # Linux/macOS
# ou sur Windows PowerShell :
# Get-Content .env | ForEach-Object { if ($_ -match '^([^#=]+)=(.*)$') { [System.Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim()) } }

./server/bin/api
```

### 6.4 Vérifier que tout fonctionne

```bash
curl http://localhost:8787/api/config    # Doit retourner du JSON
curl http://localhost:8787/              # Doit retourner le HTML du frontend
```

### 6.5 Démarrage automatique (Windows — optionnel)

Pour lancer le serveur automatiquement avec Windows, créer une tâche planifiée ou un service via NSSM :

```powershell
# Installer NSSM (https://nssm.cc/)
nssm install do-verlay "C:\chemin\vers\server\bin\api.exe"
nssm set do-verlay AppDirectory "C:\chemin\vers\do-verlay"
nssm set do-verlay AppEnvironmentExtra "PORT=8787" "HOST=127.0.0.1" "STATIC_DIR=C:\chemin\vers\frontend\dist"
nssm start do-verlay
```

### 6.6 Setup multi-PC (OBS sur une autre machine)

Si OBS tourne sur un PC différent du serveur Go, modifier dans `.env` :

```env
HOST=0.0.0.0
```

Et dans OBS, utiliser l'adresse IP locale du PC serveur :

```
http://192.168.x.x:8787/#/overlay
```

> **Attention :** Exposer le serveur sur `0.0.0.0` sans pare-feu supplémentaire rend l'interface accessible à tout le réseau local. S'assurer que le réseau est de confiance.

---

## 7. Configuration OBS

### 7.1 Ajouter la source navigateur

1. Dans OBS, cliquer sur le **+** dans la liste des sources.
2. Sélectionner **Source navigateur (Browser Source)**.
3. Nommer la source (ex. : `Chapiteau Overlay`).
4. Configurer :

| Paramètre | Valeur |
|---|---|
| URL | `http://localhost:8787/#/overlay` |
| Largeur | `1920` |
| Hauteur | `1080` |
| Contrôler le son via OBS | selon préférence |
| CSS personnalisé | `body { background-color: rgba(0, 0, 0, 0); }` |

5. Cocher **Actualiser le navigateur quand la scène devient active** si souhaité.
6. Cliquer sur **OK**.

### 7.2 Positionnement

Placer la source en haut de la pile des sources pour qu'elle s'affiche par-dessus les autres éléments de la scène. L'arrière-plan transparent permet aux éléments dessous d'être visibles.

### 7.3 Vérification

L'overlay doit s'afficher avec un fond transparent. Si l'overlay est blanc, vérifier le CSS personnalisé. Si l'overlay est vide, vérifier que le serveur Go tourne bien sur le port 8787.

---

## 8. Configuration Twitch

L'intégration Twitch permet :
- L'authentification PKCE pour le panneau de contrôle (`#/panel/*`).
- L'écoute IRC anonyme du chat pour déclencher des actions sur l'overlay via des commandes.

### 8.1 Créer une application Twitch

1. Se connecter à [https://dev.twitch.tv/console](https://dev.twitch.tv/console).
2. Cliquer sur **Enregistrer votre application**.
3. Remplir :
   - **Nom** : `do-verlay` (ou tout nom disponible)
   - **URLs de redirection OAuth** : `http://localhost:8787`
   - **Catégorie** : `Intégration de site web`
4. Cliquer sur **Créer**.
5. Copier le **Client ID**.

### 8.2 Configurer la variable d'environnement

Dans `.env` (pour le build du frontend) :

```env
VITE_TWITCH_CLIENT_ID=votre_client_id_ici
```

> **Important :** Cette variable est préfixée `VITE_` car elle est intégrée au bundle frontend par Vite au moment du build. Toute modification nécessite un nouveau `npm run build`.

### 8.3 Rebuild après modification

```bash
cd frontend
npm run build
```

---

## 9. Variables d'environnement — référence complète

Toutes les variables sont définies dans `.env` à la racine du projet (copié depuis `.env.example`).

### Serveur Go

| Variable | Défaut | Obligatoire | Description |
|---|---|---|---|
| `PORT` | `8787` | Non | Port d'écoute du serveur HTTP |
| `HOST` | `127.0.0.1` | Non | Adresse de bind. Utiliser `0.0.0.0` pour un accès multi-PC |
| `STATIC_DIR` | `../frontend/dist` | Non | Chemin vers le répertoire du frontend compilé |
| `DATABASE_URL` | — | Non | URL de connexion PostgreSQL complète. Si absente, le serveur démarre sans persistance |

### Base de données (docker-compose)

| Variable | Défaut | Obligatoire | Description |
|---|---|---|---|
| `POSTGRES_USER` | `doverlay` | Non | Utilisateur PostgreSQL |
| `POSTGRES_PASSWORD` | — | **Oui** | Mot de passe PostgreSQL. Requis par docker-compose |
| `POSTGRES_DB` | `doverlay` | Non | Nom de la base de données |

### Frontend (Vite — intégrées au build)

| Variable | Défaut | Obligatoire | Description |
|---|---|---|---|
| `VITE_TWITCH_CLIENT_ID` | — | Recommandé | Client ID de l'application Twitch pour l'auth PKCE |

### Exemple de `.env` complet

```env
# Serveur Go
PORT=8787
HOST=127.0.0.1
STATIC_DIR=../frontend/dist

# Base de données
POSTGRES_USER=doverlay
POSTGRES_PASSWORD=remplacer_par_un_vrai_mot_de_passe
POSTGRES_DB=doverlay
DATABASE_URL=postgres://doverlay:remplacer_par_un_vrai_mot_de_passe@localhost:5432/doverlay

# Frontend (Twitch)
VITE_TWITCH_CLIENT_ID=votre_client_id_twitch
```

---

## 10. Base de données et migrations

La base de données est **optionnelle**. Le serveur Go démarre et fonctionne sans `DATABASE_URL`. Sans base de données, l'état n'est pas persisté entre les redémarrages du serveur.

### 10.1 Fichiers de migration

| Fichier | Contenu |
|---|---|
| `server/migrations/0001_init.sql` | Schéma complet (13 tables) |
| `server/migrations/0002_config_snapshot.sql` | Table `config_snapshot` (JSONB — persistance d'état) |

### 10.2 Application automatique (nouveau volume Docker)

Au premier `docker compose up -d`, PostgreSQL exécute automatiquement tous les fichiers montés dans `/docker-entrypoint-initdb.d/` par ordre alphabétique. Les deux migrations sont appliquées sans intervention.

### 10.3 Application manuelle (volume existant)

Si le volume `db-data` existe déjà et qu'une nouvelle migration est disponible, l'appliquer manuellement :

```bash
# Via docker exec
docker compose exec db psql -U doverlay -d doverlay -f /dev/stdin < server/migrations/0002_config_snapshot.sql

# Ou directement si psql est installé localement
psql postgres://doverlay:mot_de_passe@localhost:5432/doverlay < server/migrations/0002_config_snapshot.sql
```

### 10.4 Ajouter une nouvelle migration

1. Créer le fichier `server/migrations/000N_description.sql` (incrémenter N).
2. L'ajouter dans `docker-compose.yml` sous `volumes` du service `db` :
   ```yaml
   - ./server/migrations/000N_description.sql:/docker-entrypoint-initdb.d/000N_description.sql:ro
   ```
3. Pour les volumes existants, appliquer manuellement (voir 10.3).

### 10.5 Endpoints API liés à la base de données

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/config` | Récupère le dernier état persisté |
| `PUT` | `/api/config` | Sauvegarde l'état courant (JSON body) |

Le Hub Go charge automatiquement le dernier état depuis la base au démarrage, et persiste chaque mise à jour d'état.

### 10.6 Réinitialiser la base de données

```bash
docker compose down -v    # Supprime le volume db-data
docker compose up -d      # Recrée et réapplique les migrations
```

> **Attention :** Cette opération supprime toutes les données.

---

## 11. Intégration continue (CI)

Le pipeline CI (`.github/workflows/ci.yml`) se déclenche sur chaque push vers `main` et les branches `features/**`.

**Étapes du pipeline :**

1. **Lint** — vérification du style de code frontend et Go.
2. **Build** — compilation frontend (`npm run build`) et serveur Go (`go build`).
3. **Test** — exécution des 34 tests Vitest du frontend et des tests Go.

Vérifier que le CI est vert avant tout merge vers `main`.

---

## 12. Maintenance

### Mettre à jour les dépendances frontend

```bash
cd frontend
npm update
npm run test        # vérifier que les tests passent
npm run build       # vérifier que le build passe
```

### Mettre à jour les dépendances Go

```bash
cd server
go get -u ./...
go mod tidy
go test ./...
```

### Vérifier les logs du serveur

Le serveur utilise un middleware de logging qui affiche chaque requête HTTP avec sa durée et son code de réponse. Les logs apparaissent dans la sortie standard du processus `api`.

```bash
# Si géré via systemd ou NSSM
journalctl -u do-verlay -f           # Linux systemd
# Windows : consulter les logs NSSM dans %APPDATA%\nssm\
```

### Sauvegarder la base de données

```bash
docker compose exec db pg_dump -U doverlay doverlay > backup_$(date +%Y%m%d).sql
```

### Restaurer une sauvegarde

```bash
cat backup_20240101.sql | docker compose exec -T db psql -U doverlay -d doverlay
```

### Vérifier l'état du pool de connexions

Le pool pgx/v5 est configuré au démarrage. Si des erreurs de connexion apparaissent dans les logs, vérifier :

```bash
docker compose ps db     # conteneur en cours d'exécution ?
docker compose logs db   # erreurs PostgreSQL ?
```

---

## 13. Dépannage

### Le serveur ne démarre pas

**Symptôme :** `bind: address already in use`

```bash
# Trouver le processus qui utilise le port 8787
# Linux/macOS :
lsof -i :8787
# Windows PowerShell :
netstat -ano | findstr :8787
```

Arrêter le processus conflictuel ou changer `PORT` dans `.env`.

---

**Symptôme :** `POSTGRES_PASSWORD est requise`

Le fichier `.env` n'est pas chargé ou `POSTGRES_PASSWORD` est vide.

```bash
cat .env | grep POSTGRES_PASSWORD    # vérifier que la variable est définie
```

---

### Le frontend ne s'affiche pas

**Symptôme :** Le serveur répond mais la page est vide ou 404.

Vérifier que `frontend/dist/` existe et contient `index.html` :

```bash
ls frontend/dist/
```

Si le répertoire est absent ou vide, rebuilder :

```bash
cd frontend && npm run build
```

Vérifier aussi que `STATIC_DIR` dans `.env` pointe bien vers `frontend/dist/` (chemin relatif au binaire ou absolu).

---

### L'overlay OBS est blanc

**Symptôme :** La source navigateur affiche un fond blanc au lieu d'être transparente.

Vérifier le CSS personnalisé de la source OBS :

```css
body { background-color: rgba(0, 0, 0, 0); }
```

S'assurer que la case **Transparence** est activée dans les paramètres de la source OBS.

---

### L'overlay OBS ne se charge pas

**Symptôme :** La source navigateur affiche une erreur ou reste vide.

1. Vérifier que le serveur Go tourne : `curl http://localhost:8787/`.
2. Vérifier l'URL dans OBS : `http://localhost:8787/#/overlay` (avec le `#`).
3. Si OBS est sur une autre machine, remplacer `localhost` par l'IP du serveur et s'assurer que `HOST=0.0.0.0` dans `.env`.

---

### Erreur de connexion à la base de données

**Symptôme :** Logs du serveur : `failed to connect to database`

Le serveur continue de fonctionner sans DB. Pour activer la persistance :

1. Vérifier que Docker tourne : `docker compose ps`.
2. Démarrer le conteneur si nécessaire : `docker compose up -d`.
3. Vérifier que `DATABASE_URL` dans `.env` correspond aux valeurs `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`.

```bash
# Test de connexion directe
psql postgres://doverlay:mot_de_passe@localhost:5432/doverlay -c "SELECT 1;"
```

---

### L'authentification Twitch ne fonctionne pas

**Symptôme :** Le panneau `#/panel/` redirige en boucle ou affiche une erreur OAuth.

1. Vérifier que `VITE_TWITCH_CLIENT_ID` est défini dans `.env`.
2. S'assurer que le frontend a été **rebuildé** après modification de la variable :
   ```bash
   cd frontend && npm run build
   ```
3. Vérifier que l'URL de redirection dans la console Twitch est exactement `http://localhost:8787` (sans slash final).
4. Vider le cache du navigateur / redémarrer la source OBS.

---

### Les migrations ne s'appliquent pas

**Symptôme :** Tables manquantes dans la base de données.

Le mécanisme `initdb.d` de PostgreSQL ne s'exécute que si le volume est **vide** (première initialisation). Pour les volumes existants, appliquer manuellement :

```bash
docker compose exec db psql -U doverlay -d doverlay -f /dev/stdin < server/migrations/0002_config_snapshot.sql
```

Pour vérifier les tables existantes :

```bash
docker compose exec db psql -U doverlay -d doverlay -c "\dt"
```

---

### Les tests frontend échouent

```bash
cd frontend
npm run test -- --reporter=verbose
```

Si l'erreur est liée à des dépendances :

```bash
rm -rf node_modules
npm install
npm run test
```

---

*Document généré le 2026-06-22 — do-verlay (Chapiteau)*
