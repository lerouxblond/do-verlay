// Package chat lit le chat Twitch d'une chaîne via IRC anonyme (lecture seule, nick « justinfan »)
// et signale les commandes détectées (`!dofus`…) à un callback.
//
// Aucune app, Client ID ni OAuth Twitch n'est requis : la connexion anonyme n'autorise QUE la
// lecture — ce qui suffit pour déclencher les modules de l'overlay. Pas de dépendance externe :
// IRC est un protocole texte ligne par ligne, ici sur TLS.
//
// Le serveur reste agnostique des modules : il transmet le token de commande brut (préfixé `!`) ;
// la table commande → module vit côté front (config du profil).
package chat

import (
	"bufio"
	"context"
	"crypto/tls"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net"
	"strings"
	"sync"
	"time"
)

const (
	ircAddr     = "irc.chat.twitch.tv:6697"
	dialTimeout = 10 * time.Second
	minBackoff  = 1 * time.Second
	maxBackoff  = 30 * time.Second
)

// Reader maintient au plus UNE connexion IRC, sur la chaîne courante. Toutes les méthodes
// publiques sont sûres en concurrence.
type Reader struct {
	// OnCommand est appelé pour chaque message de chat commençant par `!` (token de commande en
	// minuscule, ex. "!dofus"). Câblé par l'appelant (main) vers la diffusion WebSocket.
	OnCommand func(command string)

	mu      sync.Mutex
	channel string             // chaîne courante (sans `#`), "" = aucune connexion
	cancel  context.CancelFunc // annule la connexion courante
}

// NewReader crée un lecteur inactif : aucune connexion tant que SetChannel n'est pas appelé.
func NewReader() *Reader { return &Reader{} }

// SetChannel (re)connecte le lecteur sur `channel`. Idempotent : sans effet si la chaîne est
// inchangée. Une chaîne vide déconnecte. Conçu pour être appelé à chaque changement de config.
func (r *Reader) SetChannel(channel string) {
	channel = normalizeChannel(channel)
	r.mu.Lock()
	defer r.mu.Unlock()
	if channel == r.channel {
		return
	}
	if r.cancel != nil {
		r.cancel() // coupe la connexion précédente
		r.cancel = nil
	}
	r.channel = channel
	if channel == "" {
		log.Printf("chat: déconnecté (aucune chaîne)")
		return
	}
	ctx, cancel := context.WithCancel(context.Background())
	r.cancel = cancel
	go r.run(ctx, channel)
}

// Close arrête toute connexion en cours (arrêt du serveur).
func (r *Reader) Close() {
	r.mu.Lock()
	defer r.mu.Unlock()
	if r.cancel != nil {
		r.cancel()
		r.cancel = nil
	}
	r.channel = ""
}

// run maintient la connexion à `channel` avec reconnexion à backoff exponentiel, jusqu'à annulation.
func (r *Reader) run(ctx context.Context, channel string) {
	backoff := minBackoff
	for ctx.Err() == nil {
		err := r.connectOnce(ctx, channel)
		if ctx.Err() != nil {
			return // annulation (changement de chaîne / arrêt) : pas de reconnexion
		}
		log.Printf("chat #%s: connexion perdue (%v), nouvelle tentative dans %s", channel, err, backoff)
		select {
		case <-ctx.Done():
			return
		case <-time.After(backoff):
		}
		if backoff *= 2; backoff > maxBackoff {
			backoff = maxBackoff
		}
	}
}

// connectOnce établit une session IRC anonyme et lit jusqu'à erreur ou annulation du contexte.
func (r *Reader) connectOnce(ctx context.Context, channel string) error {
	conn, err := tls.DialWithDialer(&net.Dialer{Timeout: dialTimeout}, "tcp", ircAddr, nil)
	if err != nil {
		return err
	}
	defer conn.Close()

	// Débloque le Read en cours dès l'annulation du contexte (changement de chaîne / arrêt).
	go func() {
		<-ctx.Done()
		conn.Close()
	}()

	// Connexion anonyme en lecture seule : nick justinfan aléatoire, ni PASS ni OAuth.
	nick := fmt.Sprintf("justinfan%d", 10000+rand.Intn(890000))
	if _, err := fmt.Fprintf(conn, "NICK %s\r\nJOIN #%s\r\n", nick, channel); err != nil {
		return err
	}
	log.Printf("chat #%s: connecté (%s)", channel, nick)

	sc := bufio.NewScanner(conn)
	sc.Buffer(make([]byte, 0, 4096), 1<<16) // lignes IRC courtes ; borne par sécurité
	for sc.Scan() {
		line := strings.TrimRight(sc.Text(), "\r\n")
		if reply, ok := pingReply(line); ok {
			if _, err := fmt.Fprintf(conn, "%s\r\n", reply); err != nil {
				return err
			}
			continue
		}
		if cmd, ok := commandFromPrivmsg(line); ok && r.OnCommand != nil {
			r.OnCommand(cmd)
		}
	}
	if err := sc.Err(); err != nil {
		return err
	}
	return io.EOF // flux fermé proprement → traité comme une perte de connexion
}

// normalizeChannel met une chaîne au format Twitch : sans `#`, sans espaces, minuscule.
func normalizeChannel(s string) string {
	return strings.ToLower(strings.TrimPrefix(strings.TrimSpace(s), "#"))
}

// pingReply renvoie la réponse PONG à un PING serveur, ou ok=false si la ligne n'en est pas un.
// Twitch envoie « PING :tmi.twitch.tv » et coupe la connexion faute de réponse.
func pingReply(line string) (string, bool) {
	if !strings.HasPrefix(line, "PING") {
		return "", false
	}
	return "PONG" + strings.TrimPrefix(line, "PING"), true
}

// commandFromPrivmsg extrait le token de commande (`!dofus`) d'une ligne PRIVMSG si le message
// commence par `!`. Format : « :nick!user@host PRIVMSG #chan :message ».
func commandFromPrivmsg(line string) (string, bool) {
	_, rest, ok := strings.Cut(line, " PRIVMSG ") // rest = « #chan :message »
	if !ok {
		return "", false
	}
	_, msg, ok := strings.Cut(rest, " :")
	if !ok {
		return "", false
	}
	msg = strings.TrimSpace(msg)
	if !strings.HasPrefix(msg, "!") {
		return "", false
	}
	token := msg
	if sp := strings.IndexAny(msg, " \t"); sp >= 0 {
		token = msg[:sp]
	}
	return strings.ToLower(token), true
}
