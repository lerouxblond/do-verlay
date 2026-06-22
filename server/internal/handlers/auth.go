package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
)

// TwitchToken proxie l'échange de code PKCE vers Twitch (évite les restrictions CORS navigateur).
// Attend: POST /api/auth/token  Body: { code, code_verifier, redirect_uri }
// Retourne: la réponse JSON de Twitch (access_token, expires_in, …)
func TwitchToken(w http.ResponseWriter, r *http.Request) {
	clientID := os.Getenv("TWITCH_CLIENT_ID")
	if clientID == "" {
		http.Error(w, "TWITCH_CLIENT_ID non configuré", http.StatusServiceUnavailable)
		return
	}

	var req struct {
		Code         string `json:"code"`
		CodeVerifier string `json:"code_verifier"`
		RedirectURI  string `json:"redirect_uri"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Code == "" {
		http.Error(w, "body invalide", http.StatusBadRequest)
		return
	}

	// Seules les origines localhost sont acceptées comme redirect_uri (sécurité).
	if !isLocalRedirect(req.RedirectURI) {
		http.Error(w, "redirect_uri non autorisé", http.StatusBadRequest)
		return
	}

	form := url.Values{
		"client_id":     {clientID},
		"code":          {req.Code},
		"code_verifier": {req.CodeVerifier},
		"grant_type":    {"authorization_code"},
		"redirect_uri":  {req.RedirectURI},
	}

	resp, err := http.PostForm("https://id.twitch.tv/oauth2/token", form)
	if err != nil {
		log.Printf("twitch token exchange: %v", err)
		http.Error(w, fmt.Sprintf("erreur Twitch: %v", err), http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)
	w.Write(body) //nolint:errcheck
}

// TwitchRevoke proxie la révocation de token Twitch.
// Attend: POST /api/auth/revoke  Body: { token }
func TwitchRevoke(w http.ResponseWriter, r *http.Request) {
	clientID := os.Getenv("TWITCH_CLIENT_ID")
	if clientID == "" {
		w.WriteHeader(http.StatusNoContent) // pas de client_id = rien à révoquer
		return
	}

	var req struct {
		Token string `json:"token"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Token == "" {
		http.Error(w, "body invalide", http.StatusBadRequest)
		return
	}

	form := url.Values{
		"client_id": {clientID},
		"token":     {req.Token},
	}
	resp, err := http.PostForm("https://id.twitch.tv/oauth2/revoke", form)
	if err != nil {
		log.Printf("twitch revoke: %v", err)
	}
	if resp != nil {
		resp.Body.Close()
	}
	w.WriteHeader(http.StatusNoContent)
}

func isLocalRedirect(uri string) bool {
	return strings.HasPrefix(uri, "http://localhost") ||
		strings.HasPrefix(uri, "http://127.0.0.1") ||
		strings.HasPrefix(uri, "http://[::1]")
}
