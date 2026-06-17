# PanelHome (page · panel)

Panel de contrôle intégré (réf. prototype 06) : profil actif (changer / dupliquer / exporter /
importer JSON), liste des modules (épingle + déclenchement + cooldown), éditeurs Dofusdex / guilde /
fiche, contrôles de diffusion + simulateur de chat, et **aperçu live** de l'overlay.

Câblé à `ConfigProvider` (édition live persistée + synchro) et à `useOverlayEngine` (aperçu). Les
déclenchements / épinglages sont aussi diffusés à l'overlay live via `emitIntent`.

Dépendances : `PanelLayout`, `StagePreview` + `OverlayLayout`, `ModuleRow`, `DofusdexEditor`,
`GuildEditor`, `FicheEditor`, `BroadcastControls`.
