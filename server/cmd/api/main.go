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
	"log"
	"net/http"
	"os"
	"path/filepath"

	"do-verlay/server/internal/ws"
)

func main() {
	port := env("PORT", "8787")
	staticDir := env("STATIC_DIR", "../frontend/dist")

	hub := ws.NewHub()

	mux := http.NewServeMux()
	mux.HandleFunc("/ws", hub.ServeWS)
	mux.Handle("/", spaHandler(staticDir))

	addr := ":" + port
	log.Printf("chapiteau api — http://localhost%s  (overlay OBS : /#/overlay · ws : /ws)", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
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
