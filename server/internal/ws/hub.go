// Package ws — canal de synchro live panel ↔ overlay(s).
//
// Relais en mémoire (sans base) : le panel publie l'état de config, le serveur le
// rediffuse à tous les autres clients et le mémorise pour réhydrater un client qui se
// connecte plus tard (typiquement l'overlay ouvert dans OBS). C'est ce que
// BroadcastChannel ne peut PAS faire : franchir la frontière entre le navigateur du
// streamer et le navigateur intégré d'OBS (process/localStorage distincts).
//
// Périmètre volontairement minimal (test d'intégration OBS) : pas de persistance ni de
// notion de profil côté serveur — les messages sont relayés tels quels.
package ws

import (
	"encoding/json"
	"net/http"
	"net/url"
	"sync"

	"github.com/gorilla/websocket"
)

// maxMessageBytes borne la taille d'un message entrant (la config d'un profil est petite ;
// 1 Mio laisse une marge confortable et évite qu'un client envoie un payload abusif).
const maxMessageBytes = 1 << 20

var upgrader = websocket.Upgrader{
	CheckOrigin: checkOrigin,
}

// checkOrigin n'autorise que les origines locales. Une page web malveillante ouverte dans le
// navigateur du streamer enverrait un Origin cross-site (toujours présent sur un handshake
// navigateur) → rejet : elle ne peut ni lire la config relayée ni injecter d'état sur l'overlay.
// Origin vide = client non-navigateur (OBS natif, tests) → pas de vecteur cross-site, autorisé.
func checkOrigin(r *http.Request) bool {
	origin := r.Header.Get("Origin")
	if origin == "" {
		return true
	}
	u, err := url.Parse(origin)
	if err != nil {
		return false
	}
	switch u.Hostname() {
	case "localhost", "127.0.0.1", "::1":
		return true
	default:
		return false
	}
}

// Hub garde la liste des clients connectés et le dernier état publié.
type Hub struct {
	mu        sync.Mutex
	clients   map[*client]struct{}
	lastState []byte // dernier message {"type":"state",...} pour réhydrater un nouveau client
	// PersistFn est appelée dans une goroutine à chaque mise à jour du lastState.
	// Nil = mode sans base (le serveur fonctionne normalement, sans persistance disque).
	PersistFn func(state []byte)
}

func NewHub() *Hub {
	return &Hub{clients: make(map[*client]struct{})}
}

// SetLastState injecte un état initial (chargé depuis la DB au démarrage).
func (h *Hub) SetLastState(state []byte) {
	h.mu.Lock()
	h.lastState = state
	h.mu.Unlock()
}

type client struct {
	conn *websocket.Conn
	out  chan []byte
}

// ServeWS effectue l'upgrade HTTP→WebSocket et fait vivre le client.
func (h *Hub) ServeWS(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	conn.SetReadLimit(maxMessageBytes)
	c := &client{conn: conn, out: make(chan []byte, 16)}

	h.mu.Lock()
	h.clients[c] = struct{}{}
	last := h.lastState
	h.mu.Unlock()

	if last != nil {
		c.trySend(last) // réhydrate immédiatement (état courant)
	}

	go c.writePump()
	h.readPump(c)
}

func (h *Hub) readPump(c *client) {
	defer func() {
		h.mu.Lock()
		delete(h.clients, c)
		h.mu.Unlock()
		c.conn.Close()
		close(c.out)
	}()
	for {
		_, msg, err := c.conn.ReadMessage()
		if err != nil {
			return
		}
		h.relay(c, msg)
	}
}

func (c *client) writePump() {
	for msg := range c.out {
		if err := c.conn.WriteMessage(websocket.TextMessage, msg); err != nil {
			c.conn.Close()
			return
		}
	}
}

// relay rediffuse un message à tous les clients sauf l'émetteur ; mémorise le dernier état.
func (h *Hub) relay(from *client, msg []byte) {
	var head struct {
		Type string `json:"type"`
	}
	isState := json.Unmarshal(msg, &head) == nil && head.Type == "state"

	h.mu.Lock()
	if isState {
		h.lastState = msg
	}
	fn := h.PersistFn
	// Collecte des destinataires sous lock pour éviter les races sur h.clients.
	targets := make([]*client, 0, len(h.clients))
	for c := range h.clients {
		if c != from {
			targets = append(targets, c)
		}
	}
	h.mu.Unlock()

	if isState && fn != nil {
		go fn(msg)
	}
	for _, c := range targets {
		c.trySend(msg)
	}
}

// trySend dépose un message sans bloquer le hub (un client lent perd le message).
func (c *client) trySend(msg []byte) {
	select {
	case c.out <- msg:
	default:
	}
}
