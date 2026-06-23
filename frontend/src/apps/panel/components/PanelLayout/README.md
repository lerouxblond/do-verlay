# PanelLayout

Coquille commune des pages du panel (élément de route parent). Rend la `Sidebar`, le
`Topbar`, l'en-tête de section (déduit du chemin via `sectionByPath`) puis `<Outlet/>` pour
la vue routée. Monté derrière `RequireAuth` dans `PanelApp`.
