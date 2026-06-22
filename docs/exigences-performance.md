# Exigences de performance — do-verlay (Chapiteau)

## 1. Contexte d'exécution

L'overlay tourne comme **source navigateur dans OBS** (Chromium embarqué, processus distinct du navigateur du streamer). Il est affiché en continu pendant toute la durée d'un live — potentiellement **4 à 8 heures sans interruption**. Le panel, lui, tourne dans un onglet de navigateur ordinaire.

Ce contexte définit l'essentiel des contraintes : pas de rechargement possible pendant le stream, pas de droit à la fuite mémoire, pas de freeze visible à l'écran.

---

## 2. Niveau d'exigence global

| Axe | Niveau | Justification |
|---|---|---|
| Disponibilité | Très élevé | L'overlay ne doit jamais planter ou freezer pendant un live |
| Consommation CPU | Modéré | Chromium OBS partage les ressources avec le jeu — pas d'animations lourdes |
| Consommation mémoire | Élevé | Le process est long-lived (heures) — zéro fuite tolérable |
| Latence synchro panel→overlay | Faible | < 500 ms en pratique (WS + debounce 180 ms) |
| Charge réseau | Très faible | JSON de quelques Ko, pas de flux vidéo ni audio |
| Scalabilité | Non applicable | Mono-utilisateur (1 panel + 1 overlay, même machine) |

---

## 3. Boucles actives et timers

### 3.1 Moteur overlay (`useOverlayEngine`)

Le moteur tourne via un `setInterval` à **250 ms** (constante `TIMING.tick`). À chaque tick :
- expire les modules dont le temps d'affichage est écoulé ;
- dépile la file d'attente si la limite n'est pas atteinte ;
- avance la rotation automatique si son délai est dépassé (`TIMING.rotation = 7 000 ms`).

Le moteur utilise une **ref muable** (`rt.current`) pour l'état runtime (visible, cooldown, file) et ne déclenche un re-render React que via `setNow(Date.now())`. Cela évite les re-renders cascades à chaque tick.

> **Règle** : ne jamais placer de logique lourde (calculs O(n²), DOM queries) dans la boucle de tick.

### 3.2 Animations de présence (`useModulePresence`)

Chaque module possède une animation d'entrée et de sortie (400 ms, constante `EXIT_MS`). Les timers `setTimeout` sont tracés dans une Map et nettoyés au démontage — aucune fuite possible si la convention est respectée.

### 3.3 Reconnexion WebSocket panel (`ConfigContext`)

Le panel se reconnecte au serveur Go toutes les **2 500 ms** si la connexion coupe. L'overlay IRC Twitch utilise un **back-off exponentiel** : délai initial 1 s, doublement à chaque échec, plafond à 30 s.

---

## 4. Synchronisation panel ↔ overlay

Trois canaux complémentaires (du plus local au plus cross-process) :

```
Panel (navigateur)
  │
  ├── localStorage        → persistance locale, reprise après redémarrage OBS
  ├── BroadcastChannel    → synchro instantanée inter-onglets (même navigateur)
  └── WebSocket (/ws)     → synchro inter-process (panel → serveur Go → overlay OBS)

Overlay OBS (Chromium embarqué — localStorage isolé)
  └── WebSocket (/ws)     → reçoit la config ; applique, n'émet jamais
```

**Debounce de 180 ms** sur les writes : coalesce les frappes rapides et les glisser-déposer en une seule passe. **Une seule sérialisation JSON** par flush, réutilisée pour le `localStorage` et le WebSocket (pas de double `JSON.stringify`).

L'overlay est en mode `publish: false` → il consomme uniquement, ne réémet jamais le state. Cela évite les boucles de synchro.

---

## 5. Backend Go (serveur Chapiteau)

Le serveur est volontairement **très léger** :

- Hub WebSocket en mémoire (`sync.Mutex` + map de clients) — pas de message broker externe.
- `trySend` non-bloquant : un client lent perd le message plutôt que de bloquer le hub.
- Limite de message entrant : **1 Mio** (config JSON ≪ 10 Ko en pratique).
- Timeouts HTTP : `ReadHeaderTimeout 5 s`, `IdleTimeout 120 s`. Pas de `ReadTimeout`/`WriteTimeout` globaux (couperaient les connexions WS persistantes).
- Écoute uniquement sur **127.0.0.1** par défaut (un seul PC de stream).
- PostgreSQL **optionnel** : si indisponible, le serveur démarre en mode mémoire sans dégradation fonctionnelle.

**Charge attendue** : 2 à 3 clients WebSocket simultanés au maximum (1 panel, 1 overlay OBS, éventuellement 1 onglet d'aperçu).

---

## 6. Contraintes spécifiques à l'overlay OBS

| Contrainte | Valeur / détail |
|---|---|
| Résolution cible | 1920 × 1080, fond transparent |
| Moteur de rendu | Chromium embarqué OBS (version variable selon OBS) |
| Modules simultanés max | 4 (constante `MODULE_LIMIT.max`) |
| Durée d'affichage défaut | 6 000 ms par module |
| Cooldown commande défaut | 9 000 ms par commande |
| Intervalle rotation auto | 7 000 ms |
| Modules masqués | Non rendus dans le DOM (présence gérée par `useModulePresence`) |

Les modules masqués ne sont **pas dans le DOM** — aucun coût de layout/paint pour eux.

---

## 7. Assets et données

| Ressource | Volume estimé | Stratégie |
|---|---|---|
| Images assets (classes, Dofus, blasons) | ~5–10 Mo total | Servies statiquement depuis `frontend/dist`, cachées par le navigateur |
| JSON profil (localStorage / WS) | < 50 Ko | Structuré clone (BroadcastChannel) ou JSON string (WS) |
| Image de fond éditeur (panel) | Variable (screenshot jeu) | Stockée séparément (`do-verlay:editor-bg:*`), jamais diffusée à l'overlay |

---

## 8. Points de vigilance

1. **Fuite mémoire timers** : tout `setTimeout`/`setInterval` créé doit avoir son `clearTimeout`/`clearInterval` dans le cleanup du `useEffect`. `useModulePresence` et `useOverlayEngine` respectent déjà ce principe — ne pas le casser en ajoutant des modules.

2. **Animations** : privilégier les transitions CSS (`transform`, `opacity`) qui passent sur le GPU et n'invalident pas le layout. Éviter les animations qui lisent/écrivent des propriétés de layout (`offsetHeight`, `getBoundingClientRect`) en boucle.

3. **Re-renders React** : le moteur overlay évite les re-renders superflus via `useRef` pour l'état muable. Les nouvelles features qui ajoutent de l'état au moteur doivent suivre le même pattern.

4. **localStorage quota** : les images de fond de l'éditeur peuvent être volumineuses. Elles sont stockées à part de l'état synchronisé et ne transitent jamais sur le WebSocket. À monitorer si l'utilisateur stocke beaucoup de dispositions avec fond.

5. **Chromium OBS** : la version Chromium d'OBS peut être plus ancienne que celle du navigateur du développeur. Éviter les API Web très récentes sans vérifier la compat OBS. Les APIs utilisées (WebSocket, BroadcastChannel, localStorage, CSS custom properties) sont bien supportées.

6. **IRC Twitch** : la connexion IRC tourne en permanence côté overlay. Le back-off exponentiel (cap 30 s) protège contre les reconnexions en boucle. Ne pas oublier d'appeler `disconnect()` au démontage du hook `useTwitchIRC`.

---

## 9. Ce qui n'est PAS une exigence

- **Haute disponibilité multi-utilisateur** : c'est un outil single-player.
- **Sub-100 ms de latence** : la synchro à ~200–300 ms est imperceptible pour les viewers.
- **Zéro dépendance réseau** : la connexion IRC Twitch et le WS serveur sont recommandés mais le fonctionnement local (sans serveur, sans Twitch) reste supporté.
- **Mobile / responsive** : l'overlay est fixé 1920×1080 ; le panel est desktop-only.
