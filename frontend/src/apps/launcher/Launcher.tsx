/**
 * Page de lancement (route `/`) — version React de l'ancien index.html brut.
 * Oriente vers le panel de contrôle ou la source overlay (OBS).
 */
import { Link } from 'react-router-dom';
import {
  eyebrowStyle,
  footStyle,
  ghostLink,
  leadStyle,
  linksStyle,
  pageStyle,
  primaryLink,
  titleStyle,
  wrapStyle,
} from './Launcher.styles';

export function Launcher() {
  return (
    <div style={pageStyle}>
      <div style={wrapStyle}>
        <div style={eyebrowStyle}>Overlay de stream Dofus · OBS / Streamlabs</div>
        <h1 style={titleStyle}>Do-verlay</h1>
        <p style={leadStyle}>
          Overlay modulaire « chapiteau harlequin » — Dofusdex, étendard de guilde, fiche perso et
          messages d'engagement — piloté en direct depuis un panel.
        </p>
        <div style={linksStyle}>
          <Link to="/panel/general" style={primaryLink}>
            ▶ Ouvrir le panel
          </Link>
          <a href="#/overlay" target="_blank" rel="noreferrer" style={ghostLink}>
            Voir l'overlay (source OBS)
          </a>
        </div>
        <div style={footStyle}>Do-verlay © 2026 · palette nocturne velours · or · rouge Ecaflip</div>
      </div>
    </div>
  );
}
