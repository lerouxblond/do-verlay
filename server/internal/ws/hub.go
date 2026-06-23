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

	// OnChannel est notifié quand la chaîne Twitch du profil actif change (déduite de l'état
	// relayé). Câblé par main vers le lecteur de chat. lastChannel évite les notifications inutiles.
	OnChannel   func(channel string)
	lastChannel string
}

func NewHub() *Hub {
	return &Hub{clients: make(map[*client]struct{})}
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

// relay rediffuse un message à tous les clients sauf l'émetteur ; mémorise le dernier état et
// déduit la chaîne Twitch du profil actif (pour piloter le lecteur de chat).
func (h *Hub) relay(from *client, msg []byte) {
	var head struct {
		Type  string `json:"type"`
		State struct {
			ActiveID string `json:"activeId"`
			Profiles []struct {
				ID     string `json:"id"`
				Chaine string `json:"chaine_twitch"`
			} `json:"profiles"`
		} `json:"state"`
	}
	if json.Unmarshal(msg, &head) == nil && head.Type == "state" {
		channel := ""
		for _, p := range head.State.Profiles {
			if p.ID == head.State.ActiveID {
				channel = p.Chaine
				break
			}
		}
		h.mu.Lock()
		h.lastState = msg
		changed := channel != h.lastChannel
		h.lastChannel = channel
		cb := h.OnChannel
		h.mu.Unlock()
		if changed && cb != nil {
			cb(channel) // hors verrou : SetChannel peut bloquer (annulation d'une goroutine)
		}
	}

	h.mu.Lock()
	defer h.mu.Unlock()
	for c := range h.clients {
		if c == from {
			continue
		}
		c.trySend(msg)
	}
}

// Push diffuse un message éphémère (ex. commande de chat) à TOUS les clients, SANS le mémoriser :
// il ne doit pas réhydrater un client qui se connecte plus tard.
func (h *Hub) Push(msg []byte) {
	h.mu.Lock()
	defer h.mu.Unlock()
	for c := range h.clients {
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
