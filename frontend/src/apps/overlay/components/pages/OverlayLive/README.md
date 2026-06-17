# OverlayLive (page · overlay)

L'overlay en production : `OverlayLayout` hydraté par le **profil actif** (synchronisé depuis le
panel via `ConfigProvider`), piloté par le moteur d'affichage (`useOverlayEngine` : rotation auto,
timers, cooldowns, file). Applique les intentions d'affichage (`trigger`/`pin`) émises par le
panel. L'overlay **applique**, il ne décide pas.

| Prop | — |
| ---- | -- |
| aucune | lit le profil et les intentions via le contexte |

Dépendances : `OverlayLayout`, les 4 organismes de module, `useOverlayEngine`, `useConfig`.
