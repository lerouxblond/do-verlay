// Command api — backend « Chapiteau / Do-verlay ».
//
// Périmètre actuel (test d'intégration OBS) : sert le front compilé (frontend/dist) ET
// expose un canal WebSocket /ws qui synchronise la config en direct entre le panel et
// l'overlay — y compris quand l'overlay tourne dans le navigateur intégré d'OBS (process
// distinct, donc hors de portée de BroadcastChannel/localStorage du navigateur du streamer).
//
// Un seul port sert les deux → OBS charge http://localhost:8787/#/overlay et le /ws est
// de même origine (ws://localhost:8787/ws), sans config réseau.
//
// TODO (différé, cf. dossier étape 10) : PostgreSQL + REST CRUD + IRC Twitch.
package main

import (
	"encoding/json"
	"log"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"do-verlay/server/internal/services/chat"
	"do-verlay/server/internal/ws"
)

func main() {
	port := env("PORT", "8787")
	// Par défaut on n'écoute que sur la boucle locale (OBS tourne sur la même machine) : pas
	// d'exposition au réseau. Mettre HOST=0.0.0.0 pour un setup multi-PC, en connaissance de cause.
	host := env("HOST", "127.0.0.1")
	staticDir := env("STATIC_DIR", "../frontend/dist")

	hub := ws.NewHub()

	// Lecteur de chat Twitch (IRC anonyme, lecture seule) : il suit la chaîne du profil actif
	// (déduite de l'état relayé) et pousse les commandes (`!dofus`…) à l'overlay via /ws.
	reader := chat.NewReader()
	reader.OnCommand = func(cmd string) { hub.Push(chatMessage(cmd)) }
	hub.OnChannel = reader.SetChannel

	mux := http.NewServeMux()
	mux.HandleFunc("/ws", hub.ServeWS)
	mux.Handle("/", spaHandler(staticDir))

	addr := net.JoinHostPort(host, port)
	// ReadHeaderTimeout protège le handshake (slowloris) sans tuer les WebSocket (longue durée) ;
	// pas de ReadTimeout/WriteTimeout globaux qui couperaient les connexions /ws persistantes.
	srv := &http.Server{
		Addr:              addr,
		Handler:           secureHeaders(mux),
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

// chatMessage encode une commande de chat pour le canal /ws ; le front la mappe vers un module.
func chatMessage(command string) []byte {
	b, _ := json.Marshal(struct {
		Type    string `json:"type"`
		Command string `json:"command"`
	}{Type: "chat", Command: command})
	return b
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
	const csp = "default-src 'self'; " +
		"style-src 'self' 'unsafe-inline'; " +
		"font-src 'self'; " +
		"img-src 'self' data: blob:; " +
		"connect-src 'self' ws://localhost:* ws://127.0.0.1:*; " +
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
