import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StateBadge } from './StateBadge';

describe('StateBadge', () => {
  it('affiche le libellé par défaut de la variante', () => {
    render(<StateBadge variant="complete" />);
    expect(screen.getByText('Obtenu')).toBeInTheDocument();
  });

  it('affiche les variantes de recrutement', () => {
    render(<StateBadge variant="open" />);
    expect(screen.getByText('Ouvert')).toBeInTheDocument();
  });

  it('permet de surcharger le libellé', () => {
    render(<StateBadge variant="closed" label="Complet" />);
    expect(screen.getByText('Complet')).toBeInTheDocument();
  });
});
