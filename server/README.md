# server — API Go (différé)

Backend du projet « Chapiteau / Do-verlay » : API REST + WebSocket de synchro + lecture du chat
Twitch, sur PostgreSQL. **Implémentation différée** — le front fonctionne en autonomie (état local
+ `localStorage` + `BroadcastChannel`) ; ce serveur prendra le relais de la persistance et de la
synchro multi-poste (phases 2-5 du dossier, étape 10).

## En place
- **Canal WebSocket de synchro live** (`internal/ws`, `cmd/api`) : sert le front compilé
  ET expose `/ws`. Le panel publie sa config, le serveur la rediffuse à tous les clients et
  la mémorise pour réhydrater un client tardif (l'overlay dans OBS). Relais en mémoire, **sans
  base** — c'est ce qui permet à l'overlay tourné dans OBS (process/localStorage isolés) de
  recevoir la config faite dans le navigateur du streamer. Dép : `github.com/gorilla/websocket`.
- `migrations/0001_init.sql` — schéma complet dérivé du modèle de données (étape 03).
- `internal/{handlers,services,repository,models,middleware}` — rôles documentés (READMEs), pour
  la suite (REST + Twitch + PostgreSQL, différés).

## Démarrage (synchro OBS)
```bash
cd frontend && npm run build      # produit frontend/dist
cd ../server && go run ./cmd/api  # http://localhost:8787 (sert dist + /ws)
```
- Panel : `http://localhost:8787/#/panel/general`
- **Source navigateur OBS** : `http://localhost:8787/#/overlay`
Le `/ws` est de même origine (`ws://localhost:8787/ws`) → aucune config réseau. Variables :
`PORT` (défaut 8787), `STATIC_DIR` (défaut `../frontend/dist`).

## TODO (différé, étape 10)
PostgreSQL + REST CRUD profil/module + lecture chat Twitch (IRC anonyme → commandes).

## Découpe
`handlers → services → repository → models`. Aucun SQL hors `repository`, aucune logique métier en
`handlers`. Migrations append-only.
