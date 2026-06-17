# internal/services (différé)

Logique métier : validation (limite modules 1-4, ≤ 5 tags, unicité `ordre_affichage`), règles de
diffusion (rotation, cooldown, file), orchestration de la synchro WebSocket et du service chat
Twitch. Dépend de **repository**, jamais de la couche HTTP.
