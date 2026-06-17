/**
 * Polices auto-hébergées (bundlées par Vite → servies en MÊME ORIGINE que l'app).
 * Fiabilise le rendu dans le navigateur intégré d'OBS : plus de dépendance réseau à
 * fonts.googleapis.com au démarrage (qui faisait retomber sur des polices génériques).
 *
 * Variable quand dispo (un seul fichier couvre tous les graisses), statique sinon.
 * Les noms de familles doivent correspondre à `theme/tokens.ts` (`fonts`).
 */
import '@fontsource/cinzel-decorative/700.css';
import '@fontsource/cinzel-decorative/900.css';
import '@fontsource/barlow-semi-condensed/500.css';
import '@fontsource/barlow-semi-condensed/600.css';
import '@fontsource/barlow-semi-condensed/700.css';
import '@fontsource/barlow-semi-condensed/800.css';
import '@fontsource-variable/playfair-display';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
