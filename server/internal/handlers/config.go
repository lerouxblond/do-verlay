// Package handlers — couche HTTP. Décode les requêtes, appelle repository, encode les réponses.
package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"

	"do-verlay/server/internal/repository"
)

// ConfigHandler expose GET /api/config et PUT /api/config.
type ConfigHandler struct {
	Pool *pgxpool.Pool
}

// Get retourne le PersistedState sauvegardé (204 si aucun).
func (h *ConfigHandler) Get(w http.ResponseWriter, r *http.Request) {
	payload, err := repository.GetConfig(r.Context(), h.Pool)
	if err != nil {
		log.Printf("config get: %v", err)
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}
	if payload == nil {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(payload) //nolint:errcheck
}

// Put remplace le PersistedState sauvegardé par le body JSON reçu.
func (h *ConfigHandler) Put(w http.ResponseWriter, r *http.Request) {
	var raw json.RawMessage
	if err := json.NewDecoder(r.Body).Decode(&raw); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}
	if err := repository.UpsertConfig(r.Context(), h.Pool, raw); err != nil {
		log.Printf("config put: %v", err)
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
