# SuitGlyph (atom · partagé)

Enseigne de carte à jouer — la signature identitaire du « chapiteau » posée en angle des
cadres, en puce, séparateur ou pastille.

| Prop    | Type                                       | Défaut             | Rôle                          |
| ------- | ------------------------------------------ | ------------------ | ----------------------------- |
| `suit`  | `'carreau' \| 'coeur' \| 'pique' \| 'trefle'` | —               | Enseigne (→ module)           |
| `size`  | `number`                                   | `18`               | Taille de police (px)         |
| `color` | `string`                                   | couleur du token   | Surcharge de couleur          |
| `style` | `CSSProperties`                            | —                  | Style additionnel             |
| `className` | `string`                               | —                  | Accroche CSS (états : halo, hover…) |

Couleurs par défaut (design system) : ♦ or `#D4A843` · ♣ vert `#4CAF50` · ♠ argent `#9A8A84` ·
♥ rouge `#C9363A`. Mapping enseigne → module dans `theme/tokens.ts` (`suits`).

```tsx
<SuitGlyph suit="carreau" size={26} />
```
