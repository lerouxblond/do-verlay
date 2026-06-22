// Package db gère la connexion PostgreSQL (pgx pool).
// La connexion est optionnelle : si DATABASE_URL est absent ou la DB inaccessible,
// le serveur démarre quand même (mode sans persistance).
package db

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Connect crée un pool pgx à partir de DATABASE_URL.
// Retourne (nil, nil) si DATABASE_URL n'est pas défini.
func Connect(ctx context.Context) (*pgxpool.Pool, error) {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		return nil, nil
	}
	cfg, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return nil, fmt.Errorf("db config: %w", err)
	}
	cfg.MaxConns = 5

	pool, err := pgxpool.NewWithConfig(ctx, cfg)
	if err != nil {
		return nil, fmt.Errorf("db connect: %w", err)
	}
	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("db ping: %w", err)
	}
	return pool, nil
}
