import { Link, NavLink } from 'react-router-dom';
import { SuitGlyph } from '@shared/components/atoms/SuitGlyph/SuitGlyph';
import { DOFUSDUDE_NOTICE, LEGAL_NOTICE } from '@shared/constants';
import { SECTION_GROUPS } from '../../navigation';
import {
  asideStyle,
  brandHintStyle,
  brandKickerStyle,
  brandNameStyle,
  brandStyle,
  footStyle,
  groupLabelStyle,
  itemLabelStyle,
  itemStyle,
  legalStyle,
  navStyle,
  soonStyle,
} from './Sidebar.styles';

/** Navigation verticale du panel : marque (retour accueil) + groupes de sections + mention légale. */
export function Sidebar() {
  return (
    <aside style={asideStyle} className="dv-scroll">
      <Link to="/" style={brandStyle} className="dv-brand" title="Retour à l'accueil">
        <div style={brandKickerStyle}>Panel de contrôle</div>
        <div style={brandNameStyle}>Do-verlay</div>
        <div style={brandHintStyle}>← Retour à l'accueil</div>
      </Link>
      <nav style={navStyle}>
        {SECTION_GROUPS.map((group) => (
          <div key={group.label}>
            <div style={groupLabelStyle}>{group.label}</div>
            {group.sections.map((section) => (
              <NavLink
                key={section.id}
                to={section.path}
                style={itemStyle}
                className={({ isActive }) => `dv-nav-item${isActive ? ' is-active' : ''}`}
              >
                <SuitGlyph suit={section.suit} size={15} className="dv-nav-suit" />
                <span style={itemLabelStyle}>{section.label}</span>
                {section.status === 'soon' && <span style={soonStyle}>Bientôt</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div style={footStyle}>
        <p style={legalStyle}>{DOFUSDUDE_NOTICE}</p>
        <p style={legalStyle}>{LEGAL_NOTICE}</p>
      </div>
    </aside>
  );
}
