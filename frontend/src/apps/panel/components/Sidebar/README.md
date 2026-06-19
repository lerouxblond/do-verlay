# Sidebar

Navigation verticale du panel. Lit le registre `navigation.ts` (`SECTION_GROUPS`) et rend
chaque section comme un `NavLink` (HashRouter) avec son enseigne ♦♥♠♣ ; l'état actif vient
de react-router (`isActive`). Les sections `status: 'soon'` portent un badge « Bientôt ».

La marque « Do-verlay » est un lien de **retour à l'accueil** (`/`). Les états interactifs des
items (survol, actif, halo doré de l'enseigne active) sont portés par les classes `.dv-nav-item`
/ `.is-active` / `.dv-nav-suit` dans `shared/theme/fonts.css` (l'inline ne gère pas `:hover`).
Le pied affiche la mention légale (`LEGAL_NOTICE`, propriété Ankama).
