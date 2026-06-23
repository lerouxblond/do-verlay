# PanelCard

Carte de regroupement de réglages dans le panel : en-tête (enseigne optionnelle + titre +
sous-titre + action à droite) puis corps en colonne (`gap` constant). Brique de composition
de toutes les vues du panel.

`collapsible` rend la section repliable (en-tête cliquable + chevron, `defaultOpen` pour
l'état initial) — utilisé par toutes les sections de `DofusdexView`.

```tsx
<PanelCard title="Chaîne" sub="Connexion au chat" suit="pique" action={<Button>…</Button>}>
  <Field …>…</Field>
</PanelCard>
```
