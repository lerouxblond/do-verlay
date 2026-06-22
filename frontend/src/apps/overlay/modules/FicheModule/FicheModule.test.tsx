import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createEmptyProfile } from '@shared/config/profile';
import { FicheModule } from './FicheModule';

describe('FicheModule', () => {
  it('affiche nom, classe (libellé accentué), serveur et caractéristiques', () => {
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
    expect(screen.getByText('Draconiros')).toBeInTheDocument();
    expect(screen.getByText('Niv. 200')).toBeInTheDocument();
    expect(screen.getByText(/12345 succès/)).toBeInTheDocument();
  });

  it('repli « Sans nom » et aucune ligne de classe quand le perso est vierge', () => {
    render(<FicheModule profile={createEmptyProfile()} />);
    expect(screen.getByText('Sans nom')).toBeInTheDocument();
    expect(screen.queryByText('Crâ')).not.toBeInTheDocument();
  });
});
