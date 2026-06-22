// Command api — backend « Chapiteau / Do-verlay ».
//
// Périmètre actuel : sert le front compilé (frontend/dist) ET expose :
//   - /ws   : canal WebSocket qui synchronise la config panel ↔ overlay (même machine, cross-process)
//   - /api/config : GET/PUT du PersistedState complet (persistance serveur via PostgreSQL si dispo)
//
// La connexion PostgreSQL est optionnelle : si DATABASE_URL est absent ou la DB inaccessible,
// le serveur démarre en mode mémoire (comportement identique à avant, sans persistance).
//
// TODO (différé) : PostgreSQL REST CRUD profils/modules + IRC Twitch.
package main

import (
	"context"
	"log"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"do-verlay/server/internal/db"
	"do-verlay/server/internal/handlers"
	"do-verlay/server/internal/middleware"
	"do-verlay/server/internal/repository"
	"do-verlay/server/internal/ws"
)

func main() {
	port := env("PORT", "8787")
	// Par défaut on n'écoute que sur la boucle locale (OBS tourne sur la même machine) : pas
	// d'exposition au réseau. Mettre HOST=0.0.0.0 pour un setup multi-PC, en connaissance de cause.
	host := env("HOST", "127.0.0.1")
	staticDir := env("STATIC_DIR", "../frontend/dist")

	ctx := context.Background()

	// Connexion DB optionnelle — le serveur fonctionne sans.
	pool, err := db.Connect(ctx)
	if err != nil {
		log.Printf("DB indisponible, démarrage sans persistance : %v", err)
	} else if pool != nil {
		defer pool.Close()
		log.Printf("DB connectée")
	}

	hub := ws.NewHub()

	if pool != nil {
		// Réhydrate le hub avec le dernier état sauvegardé (overlay OBS reconnecte immédiatement).
		if state, err := repository.GetConfig(ctx, pool); err != nil {
			log.Printf("chargement config DB : %v", err)
		} else if state != nil {
			hub.SetLastState(state)
			log.Printf("état config restauré depuis DB")
		}
		// Persiste chaque nouveau state message reçu du panel.
		hub.PersistFn = func(state []byte) {
			if err := repository.UpsertConfig(context.Background(), pool, state); err != nil {
				log.Printf("persist config : %v", err)
			}
		}
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/ws", hub.ServeWS)

	if pool != nil {
		cfg := &handlers.ConfigHandler{Pool: pool}
		mux.HandleFunc("/api/config", func(w http.ResponseWriter, r *http.Request) {
			switch r.Method {
			case http.MethodGet:
				cfg.Get(w, r)
			case http.MethodPut:
				cfg.Put(w, r)
			default:
				http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			}
		})
	}

	// OAuth Twitch — endpoints disponibles si TWITCH_CLIENT_ID est configuré.
	mux.HandleFunc("/api/auth/token", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		handlers.TwitchToken(w, r)
	})
	mux.HandleFunc("/api/auth/revoke", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		handlers.TwitchRevoke(w, r)
	})

	mux.Handle("/", spaHandler(staticDir))

	addr := net.JoinHostPort(host, port)
	// ReadHeaderTimeout protège le handshake (slowloris) sans tuer les WebSocket (longue durée) ;
	// pas de ReadTimeout/WriteTimeout globaux qui couperaient les connexions /ws persistantes.
	srv := &http.Server{
		Addr:              addr,
		Handler:           middleware.Chain(secureHeaders(mux), middleware.Recovery, middleware.Logger),
		ReadHeaderTimeout: 5 * time.Second,
		IdleTimeout:       120 * time.Second,
	}
	log.Printf("chapiteau api — http://%s  (overlay OBS : /#/overlay · ws : /ws)", addr)
	if err := srv.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}

// spaHandler sert les fichiers statiques ; tout chemin inconnu retombe sur index.html
// (l'app est une SPA — le routage est géré côté React).
func spaHandler(dir string) http.Handler {
	fs := http.FileServer(http.Dir(dir))
	index := filepath.Join(dir, "index.html")
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		clean := filepath.Join(dir, filepath.Clean(r.URL.Path))
		if info, err := os.Stat(clean); (err != nil || info.IsDir()) && r.URL.Path != "/" {
			http.ServeFile(w, r, index)
			return
		}
		fs.ServeHTTP(w, r)
	})
}

func env(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

// secureHeaders pose les en-têtes de sécurité HTTP sur toutes les réponses.
// Content-Security-Policy : scripts uniquement depuis 'self' (build Vite bundlé) ;
// styles 'unsafe-inline' pour les inline styles React ; WebSocket autorisé vers localhost.
func secureHeaders(next http.Handler) http.Handler {
	// connect-src inclut Twitch (OAuth token exchange + helix/users + IRC WebSocket)
	// et localhost pour le WebSocket overlay.
	const csp = "default-src 'self'; " +
		"style-src 'self' 'unsafe-inline'; " +
		"font-src 'self'; " +
		"img-src 'self' data: blob:; " +
		"connect-src 'self' ws://localhost:* ws://127.0.0.1:* " +
		"https://id.twitch.tv https://api.twitch.tv wss://irc-ws.chat.twitch.tv; " +
		"frame-ancestors 'none';"
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		h := w.Header()
		h.Set("X-Frame-Options", "DENY")
		h.Set("X-Content-Type-Options", "nosniff")
		h.Set("Referrer-Policy", "no-referrer")
		h.Set("Content-Security-Policy", csp)
		next.ServeHTTP(w, r)
	})
}
