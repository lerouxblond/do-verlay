import { NavLink } from 'react-router-dom';
import { SuitGlyph } from '@shared/components/atoms/SuitGlyph/SuitGlyph';
import { SECTION_GROUPS } from '../../navigation';
import {
  asideStyle,
  brandKickerStyle,
  brandNameStyle,
  brandStyle,
  groupLabelStyle,
  itemLabelStyle,
  itemStyle,
  navStyle,
  soonStyle,
} from './Sidebar.styles';

/** Navigation verticale du panel : marque + groupes de sections (NavLink HashRouter). */
export function Sidebar() {
  return (
    <aside style={asideStyle} className="dv-scroll">
      <div style={brandStyle}>
        <div style={brandKickerStyle}>Panel de contrôle</div>
        <div style={brandNameStyle}>Do-verlay</div>
      </div>
      <nav style={navStyle}>
        {SECTION_GROUPS.map((group) => (
          <div key={group.label}>
            <div style={groupLabelStyle}>{group.label}</div>
            {group.sections.map((section) => (
              <NavLink key={section.id} to={section.path} style={({ isActive }) => itemStyle(isActive)}>
                <SuitGlyph suit={section.suit} size={15} />
                <span style={itemLabelStyle}>{section.label}</span>
                {section.status === 'soon' && <span style={soonStyle}>Bientôt</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
