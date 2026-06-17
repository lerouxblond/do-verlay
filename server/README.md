# server — API Go (différé)

Backend du projet « Chapiteau / Do-verlay » : API REST + WebSocket de synchro + lecture du chat
Twitch, sur PostgreSQL. **Implémentation différée** — le front fonctionne en autonomie (état local
+ `localStorage` + `BroadcastChannel`) ; ce serveur prendra le relais de la persistance et de la
synchro multi-poste (phases 2-5 du dossier, étape 10).

## En place
- `migrations/0001_init.sql` — schéma complet dérivé du modèle de données (étape 03).
- `cmd/api/main.go` — point d'entrée (stub) avec le plan d'implémentation.
- `internal/{handlers,services,repository,models,middleware}` — rôles documentés (READMEs).

## Démarrage (quand implémenté)
```bash
docker compose up -d        # PostgreSQL + application du schéma
cd server && go run ./cmd/api
```

## Découpe
`handlers → services → repository → models`. Aucun SQL hors `repository`, aucune logique métier en
`handlers`. Migrations append-only.
