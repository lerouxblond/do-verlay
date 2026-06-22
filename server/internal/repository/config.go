// Package repository — accès données. Seul endroit où vit le SQL.
package repository

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// GetConfig retourne le dernier PersistedState sauvegardé (JSON brut), ou nil si aucun.
func GetConfig(ctx context.Context, pool *pgxpool.Pool) ([]byte, error) {
	var payload []byte
	err := pool.QueryRow(ctx, `SELECT payload FROM config_snapshot WHERE id = 1`).Scan(&payload)
	if err == pgx.ErrNoRows {
		return nil, nil
	}
	return payload, err
}

// UpsertConfig sauvegarde l'état complet (INSERT … ON CONFLICT UPDATE).
func UpsertConfig(ctx context.Context, pool *pgxpool.Pool, payload []byte) error {
	_, err := pool.Exec(ctx,
		`INSERT INTO config_snapshot (id, payload, updated_at)
		 VALUES (1, $1, NOW())
		 ON CONFLICT (id) DO UPDATE SET payload = $1, updated_at = NOW()`,
		payload,
	)
	return err
}
