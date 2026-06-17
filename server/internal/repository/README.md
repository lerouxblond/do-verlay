# internal/repository (différé)

Accès données : **seul endroit où vit le SQL**. Une fonction = une requête/transaction. Expose des
méthodes typées renvoyant les **models**. Migrations dans `server/migrations` (append-only).
