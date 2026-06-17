# Sidebar

Navigation verticale du panel. Lit le registre `navigation.ts` (`SECTION_GROUPS`) et rend
chaque section comme un `NavLink` (HashRouter) avec son enseigne ♦♥♠♣ ; l'état actif vient
de react-router (`isActive`). Les sections `status: 'soon'` portent un badge « Bientôt ».
