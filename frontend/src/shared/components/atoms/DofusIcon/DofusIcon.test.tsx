import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { baseFilter } from './DofusIcon.styles';
import { DofusIcon } from './DofusIcon';

describe('DofusIcon — traitement par état', () => {
  it('désature et atténue une silhouette non commencée', () => {
    const s = baseFilter('not_started');
    expect(s.filter).toContain('grayscale');
    expect(s.opacity).toBeLessThan(1);
  });

  it('rend l’asset en pleine couleur quand obtenu', () => {
    const s = baseFilter('complete');
    expect(s.filter).toBe('none');
    expect(s.opacity).toBe(1);
  });

  it('rend « en cours » distinct : plus révélé que « à faire », moins qu’« obtenu »', () => {
    const ongoing = baseFilter('on_going');
    const notStarted = baseFilter('not_started');
    const complete = baseFilter('complete');
    // Hiérarchie de révélation croissante via l'opacité.
    expect(ongoing.opacity).toBeGreaterThan(notStarted.opacity);
    expect(ongoing.opacity).toBeLessThan(complete.opacity);
    // Toujours partiellement désaturé (pas encore obtenu).
    expect(ongoing.filter).toContain('grayscale');
  });

  it('expose un libellé accessible', () => {
    const { getByRole } = render(
      <DofusIcon asset="dof-vulbis" state="complete" title="Vulbis — obtenu" />,
    );
    expect(getByRole('img', { name: 'Vulbis — obtenu' })).toBeInTheDocument();
  });
});
