/**
 * Coquille des pages du panel : sidebar + bandeau + zone de contenu avec en-tête de
 * section (déduit du chemin courant) puis <Outlet/> pour la vue routée.
 */
import { Outlet, useLocation } from 'react-router-dom';
import { SuitGlyph } from '@shared/components/atoms/SuitGlyph/SuitGlyph';
import { sectionByPath } from '../../navigation';
import { Sidebar } from '../Sidebar/Sidebar';
import { Topbar } from '../Topbar/Topbar';
import {
  contentStyle,
  headingStyle,
  headingSubStyle,
  headingTitleStyle,
  mainStyle,
  shellStyle,
} from './PanelLayout.styles';

export function PanelLayout() {
  const { pathname } = useLocation();
  const section = sectionByPath(pathname);

  return (
    <div style={shellStyle}>
      <Sidebar />
      <div style={mainStyle}>
        <Topbar />
        {/* `key={pathname}` : remonte le sous-arbre à chaque section → l'entrée en cascade
            (`.dv-view-enter`) se rejoue, donnant une transition de route douce. */}
        <main key={pathname} style={contentStyle} className="dv-scroll dv-view-enter">
          {section && (
            <div>
              <div style={headingStyle}>
                <SuitGlyph suit={section.suit} size={26} />
                <h1 style={headingTitleStyle}>{section.label}</h1>
              </div>
              <p style={headingSubStyle}>{section.sub}</p>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
