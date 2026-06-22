-- 0002_config_snapshot.sql — persistence du PersistedState complet entre redémarrages serveur.
-- Une seule ligne (id = 1 forcé). Mis à jour à chaque push état du panel via WebSocket.
-- Permet à l'overlay OBS de retrouver son état immédiatement même après restart du serveur.

BEGIN;

CREATE TABLE config_snapshot (
  id         INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  payload    JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMIT;
