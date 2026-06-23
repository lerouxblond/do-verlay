import { useConfig } from '@shared/config/ConfigContext';
import {
  barStyle,
  labelStyle,
  linkStyle,
  profileSelectStyle,
  spacerStyle,
} from './Topbar.styles';

/** Bandeau global : sélecteur de profil actif + accès à la source overlay. */
export function Topbar() {
  const { profiles, activeId, switchProfile } = useConfig();
  return (
    <header style={barStyle}>
      <span style={labelStyle}>Profil actif</span>
      <select
        className="dv-field-input"
        style={profileSelectStyle}
        value={activeId}
        onChange={(e) => switchProfile(e.target.value)}
        aria-label="Profil actif"
      >
        {profiles.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nom}
          </option>
        ))}
      </select>
      <div style={spacerStyle} />
      <a
        style={linkStyle}
        className="dv-topbar-link"
        href="#/overlay"
        target="_blank"
        rel="noreferrer"
      >
        ▶ Ouvrir l'overlay
      </a>
    </header>
  );
}
