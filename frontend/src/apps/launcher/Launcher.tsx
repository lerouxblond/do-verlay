/**
 * Page de lancement (route `/`) — « le chapiteau ouvre ses portes ».
 * Hero théâtral : éventail des modules (cartes flip dynamiques), titre feuille d'or,
 * festons de chapiteau, et deux cartes d'action vers le panel / l'overlay OBS.
 * Décor, survols et animations dans Launcher.css ; identité = theme/tokens.ts.
 */
import { Link } from 'react-router-dom';
import { DOFUSDUDE_NOTICE, LEGAL_NOTICE, MODULES, MODULE_ORDER } from '@shared/constants';
import { suits } from '@shared/theme/tokens';
import './Launcher.css';

export function Launcher() {
  return (
    <div className="dv-launch">
      <div className="dv-launch__wrap">
        <div
          className="dv-launch__eyebrow-row dv-rise"
          style={{ animationDelay: '0.05s' }}
        >
          <span className="dv-launch__eyebrow-suit" style={{ color: suits.carreau.color }}>
            ♦
          </span>
          <span className="dv-launch__eyebrow">Overlay de stream Dofus · OBS / Streamlabs</span>
          <span className="dv-launch__eyebrow-suit" style={{ color: suits.coeur.color }}>
            ♥
          </span>
        </div>

        <h1 className="dv-launch__title dv-rise" style={{ animationDelay: '0.12s' }}>
          Do-verlay
        </h1>

        <div className="dv-launch__rule dv-rise" style={{ animationDelay: '0.16s' }} aria-hidden>
          <span className="dv-launch__rule-gem">♦ ♣ ♠ ♥</span>
        </div>

        <p className="dv-launch__lead dv-rise" style={{ animationDelay: '0.2s' }}>
          Overlay modulaire « chapiteau harlequin » — Dofusdex, Étendard, Alliance, Fiche perso,
          Almanax — piloté en direct depuis un panel. Survole une carte pour découvrir chaque
          module.
        </p>

        <div className="dv-module-cards dv-rise" style={{ animationDelay: '0.28s' }}>
          {MODULE_ORDER.map((type) => {
            const mod = MODULES[type];
            return (
              <div key={type} className="dv-module-card">
                <div className="dv-module-card__inner">
                  <div className="dv-module-card__front">
                    <span className="dv-module-card__rank" style={{ color: suits[mod.suit].color }}>
                      {suits[mod.suit].glyph}
                    </span>
                    <span className="dv-module-card__suit" style={{ color: suits[mod.suit].color }}>
                      {suits[mod.suit].glyph}
                    </span>
                    <span className="dv-module-card__name">{mod.name}</span>
                  </div>
                  <div
                    className="dv-module-card__back"
                    style={{ borderColor: suits[mod.suit].color }}
                  >
                    <span
                      className="dv-module-card__back-glyph"
                      style={{ color: suits[mod.suit].color }}
                    >
                      {suits[mod.suit].glyph}
                    </span>
                    <span className="dv-module-card__back-name">{mod.name}</span>
                    <span className="dv-module-card__back-desc">{mod.sub}</span>
                    <span className="dv-module-card__back-cmd">{mod.command}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="dv-launch__cta-row dv-rise" style={{ animationDelay: '0.36s' }}>
          <Link to="/panel/general" className="dv-launch__cta dv-launch__cta--primary">
            <span className="dv-launch__cta-suit">♠</span>
            <span>
              <span className="dv-launch__cta-title">Ouvrir le panel</span>
              <span className="dv-launch__cta-sub" style={{ display: 'block' }}>
                Configurer & piloter les modules
              </span>
            </span>
          </Link>

          <a
            href="#/overlay"
            target="_blank"
            rel="noreferrer"
            className="dv-launch__cta dv-launch__cta--ghost"
          >
            <span className="dv-launch__cta-suit" style={{ color: suits.carreau.color }}>
              ♦
            </span>
            <span>
              <span className="dv-launch__cta-title">Voir l'overlay</span>
              <span className="dv-launch__cta-sub" style={{ display: 'block' }}>
                Source navigateur pour OBS
              </span>
            </span>
          </a>
        </div>

        <div className="dv-launch__foot dv-rise" style={{ animationDelay: '0.46s' }}>
          Do-verlay © 2026
          <p className="dv-launch__legal">{DOFUSDUDE_NOTICE}</p>
          <p className="dv-launch__legal">{LEGAL_NOTICE}</p>
        </div>
      </div>
    </div>
  );
}
