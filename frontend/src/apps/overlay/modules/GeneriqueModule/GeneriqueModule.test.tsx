import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createEmptyProfile } from '@shared/config/profile';
import { GeneriqueModule } from './GeneriqueModule';

describe('GeneriqueModule', () => {
  it('affiche le surtitre et le message', () => {
    const p = createEmptyProfile();
    p.generique = { kicker: 'Code créateur', contenu: 'Soutiens avec NEYTECK', taille: 'M' };
    render(<GeneriqueModule profile={p} />);
    expect(screen.getByText('Code créateur')).toBeInTheDocument();
    expect(screen.getByText('Soutiens avec NEYTECK')).toBeInTheDocument();
  });

  it('affiche un repli quand le message est vide', () => {
    render(<GeneriqueModule profile={createEmptyProfile()} />);
    expect(screen.getByText('Votre message ici')).toBeInTheDocument();
  });
});
