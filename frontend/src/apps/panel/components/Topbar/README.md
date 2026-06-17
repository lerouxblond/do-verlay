# Topbar

Bandeau global (sticky) du panel. Sélecteur du profil actif (lit `profiles`/`activeId`,
appelle `switchProfile` via `useConfig`) et lien vers la source navigateur `overlay.html`
(ouverte dans un nouvel onglet — la synchro temps réel passe par `BroadcastChannel`).
