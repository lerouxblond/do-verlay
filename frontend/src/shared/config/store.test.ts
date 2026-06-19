import { describe, expect, it } from 'vitest';
import type { DofusState, Profile } from '../types';
import { createEmptyProfile } from './profile';
import { fromExport, normalizeProfile, toExport } from './store';

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

describe('normalizeProfile (migration)', () => {
  it("complète un ancien profil dépourvu d'alliance", () => {
    const legacy = createEmptyProfile();
    delete (legacy as Partial<Profile>).alliance;
    delete (legacy.modules as Partial<Profile['modules']>).alliance;

    const norm = normalizeProfile(legacy as Profile);

    expect(norm.alliance).toBeDefined();
    expect(norm.alliance.acronyme).toBe('');
    expect(norm.alliance.emblem.back).toBe(1);
    expect(norm.modules.alliance).toBeDefined();
    expect(norm.modules.alliance.type).toBe('alliance');
  });

  it('conserve les valeurs existantes', () => {
    const p = createEmptyProfile();
    p.guild.nom = 'Les Bateleurs';
    p.alliance.acronyme = 'CFR';
    const norm = normalizeProfile(p);
    expect(norm.guild.nom).toBe('Les Bateleurs');
    expect(norm.alliance.acronyme).toBe('CFR');
  });

  it('purge les ids de Dofus inconnus (import altéré)', () => {
    const p = createEmptyProfile();
    (p.ordre as string[]).push('dof-bidon');
    (p.dofus as Record<string, DofusState>)['dof-bidon'] = 'complete';
    const norm = normalizeProfile(p);
    expect(norm.ordre).not.toContain('dof-bidon');
    expect(norm.dofus['dof-bidon']).toBeUndefined();
  });
});
