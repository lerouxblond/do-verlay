# ModuleSettingsCard

Carte « Réglages du module » **commune à tous les modules** : actif, affichage permanent
(épinglé), commande chat, durée, cooldown — câblée sur `profile.modules[module]`.

```tsx
<ModuleSettingsCard module="dofusdex" extra={<Field label="Format">…</Field>} />
```

`extra` insère des réglages propres au module (ex. le format du Dofusdex). Brique à réutiliser
pour chaque nouveau module afin de garder des réglages homogènes.

Le **positionnement** (position libre + échelle) ne vit plus ici : il est géré par disposition
dans la section **Disposition** (`views/DispositionView.tsx` + `components/LayoutEditor`). La carte
renvoie vers cet éditeur via un lien.
