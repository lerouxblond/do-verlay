# ModuleSettingsCard

Carte « Réglages du module » **commune à tous les modules** : actif, affichage permanent
(épinglé), zone d'ancrage, commande chat, durée, cooldown — câblée sur `profile.modules[module]`.

```tsx
<ModuleSettingsCard module="dofusdex" extra={<Field label="Format">…</Field>} />
```

`extra` insère des réglages propres au module (ex. le format du Dofusdex). Brique à réutiliser
pour chaque nouveau module afin de garder des réglages homogènes. `ZONE_LABELS` est exporté.
