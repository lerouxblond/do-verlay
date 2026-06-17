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

  it('expose un libellé accessible', () => {
    const { getByRole } = render(
      <DofusIcon asset="dof-vulbis" state="complete" title="Vulbis — obtenu" />,
    );
    expect(getByRole('img', { name: 'Vulbis — obtenu' })).toBeInTheDocument();
  });
});
