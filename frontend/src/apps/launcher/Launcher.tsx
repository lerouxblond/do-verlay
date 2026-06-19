/**
 * Page de lancement (route `/`) — « le chapiteau ouvre ses portes ».
 * Hero théâtral : éventail des 4 modules (cartes à jouer), titre feuille d'or,
 * festons de chapiteau, et deux cartes d'action vers le panel / l'overlay OBS.
 * Décor, survols et animations dans Launcher.css ; identité = theme/tokens.ts.
 */
import { Link } from 'react-router-dom';
import { LEGAL_NOTICE } from '@shared/constants';
import { suits, type Suit } from '@shared/theme/tokens';
import './Launcher.css';

/** Ordre d'éventail ♦ ♣ ♠ ♥ (= les quatre modules). */
const FAN: Suit[] = ['carreau', 'trefle', 'pique', 'coeur'];

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
          Overlay modulaire « chapiteau harlequin » — Dofusdex, étendard de guilde, fiche perso et
          messages d'engagement — piloté en direct depuis un panel.
        </p>

        <div className="dv-launch__fan dv-rise" style={{ animationDelay: '0.28s' }} aria-hidden>
          {FAN.map((suit) => (
            <div key={suit} className="dv-launch__slot">
              <div className="dv-launch__card">
                <span className="dv-launch__card-rank" style={{ color: suits[suit].color }}>
                  {suits[suit].glyph}
                </span>
                <span className="dv-launch__card-suit" style={{ color: suits[suit].color }}>
                  {suits[suit].glyph}
                </span>
                <span className="dv-launch__card-name">{suits[suit].module}</span>
              </div>
            </div>
          ))}
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
          <p className="dv-launch__legal">{LEGAL_NOTICE}</p>
        </div>
      </div>
    </div>
  );
}
