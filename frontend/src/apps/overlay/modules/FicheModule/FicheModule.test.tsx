import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createEmptyProfile } from '@shared/config/profile';
import { FicheModule } from './FicheModule';

const fmt = new Intl.NumberFormat('fr-FR');

describe('FicheModule', () => {
  it('affiche identité (nom, classe accentuée) et le bandeau de stats', () => {
    const p = createEmptyProfile();
    p.perso = {
      nom: 'Bouftou-Royal',
      serveur: 'Draconiros',
      niveau: 200,
      pts_succes: 12345,
      genre: 'male',
      classe: 'cra',
    };
    render(<FicheModule profile={p} />);
    expect(screen.getByText('Bouftou-Royal')).toBeInTheDocument();
    expect(screen.getByText('Crâ')).toBeInTheDocument(); // CLASS_LABELS, pas la clé brute
    // Bandeau de stats : libellés + valeurs (succès formaté fr-FR).
    expect(screen.getByText('Serveur')).toBeInTheDocument();
    expect(screen.getByText('Draconiros')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    // Succès formaté fr-FR (« 12 345 ») : compare sans tenir compte des espaces (fine insécable).
    const noSpaces = (s: string) => s.replace(/\s/g, '');
    expect(
      screen.getByText((content) => noSpaces(content) === noSpaces(fmt.format(12345))),
    ).toBeInTheDocument();
  });

  it('repli « Sans nom », pas de ligne de classe, serveur « — » quand le perso est vierge', () => {
    render(<FicheModule profile={createEmptyProfile()} />);
    expect(screen.getByText('Sans nom')).toBeInTheDocument();
    expect(screen.queryByText('Crâ')).not.toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
