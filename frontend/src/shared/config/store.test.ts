import { describe, expect, it } from 'vitest';
import { createEmptyProfile } from './profile';
import { fromExport, toExport } from './store';

describe('export / import de profil', () => {
  it('fait un aller-retour sans perte', () => {
    const profile = createEmptyProfile();
    const exported = toExport(profile);
    expect(exported.app).toBe('do-verlay');
    expect(exported.version).toBe(1);
    const back = fromExport(exported);
    expect(back).toEqual(profile);
  });

  it('rejette un fichier invalide', () => {
    expect(fromExport(null)).toBeNull();
    expect(fromExport({})).toBeNull();
    expect(fromExport({ app: 'autre', profile: {} })).toBeNull();
  });
});
