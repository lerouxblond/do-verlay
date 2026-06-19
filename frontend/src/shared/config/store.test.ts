import { afterEach, describe, expect, it } from 'vitest';
import { STORAGE_KEY } from '../constants';
import type { DofusState, Layout, Profile } from '../types';
import { createDefaultLayout } from './layout';
import { createEmptyProfile } from './profile';
import {
  fromExport,
  fromLayoutExport,
  loadState,
  normalizeProfile,
  toExport,
  toLayoutExport,
} from './store';

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

describe('export / import de disposition', () => {
  it('fait un aller-retour sans perte', () => {
    const layout = createDefaultLayout('d1');
    const exported = toLayoutExport(layout);
    expect(exported.kind).toBe('layout');
    expect(fromLayoutExport(exported)).toEqual(layout);
  });

  it('rejette un fichier qui n’est pas une disposition', () => {
    expect(fromLayoutExport(null)).toBeNull();
    expect(fromLayoutExport({ app: 'do-verlay', profile: {} })).toBeNull();
    expect(fromLayoutExport(toExport(createEmptyProfile()))).toBeNull();
  });
});

describe('loadState — migration des dispositions', () => {
  afterEach(() => localStorage.clear());

  it('crée une disposition par défaut quand l’état persisté n’en a pas', () => {
    const profile = createEmptyProfile();
    // État « hérité » : profils sans dispositions.
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ profiles: [profile], activeId: profile.id }));

    const state = loadState();

    expect(state.layouts.length).toBe(1);
    expect(state.activeLayoutId).toBe(state.layouts[0].id);
    expect(state.layouts[0].placements.dofusdex).toBeDefined();
  });

  it('conserve et normalise les dispositions existantes', () => {
    const profile = createEmptyProfile();
    const partialLayout = {
      id: 'd1',
      nom: 'Setup 1440p',
      placements: { dofusdex: { xPct: 10, yPct: 10, anchor: 'TL', scale: 2 } },
    } as unknown as Layout;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        profiles: [profile],
        activeId: profile.id,
        layouts: [partialLayout],
        activeLayoutId: 'd1',
      }),
    );

    const state = loadState();

    expect(state.activeLayoutId).toBe('d1');
    expect(state.layouts[0].nom).toBe('Setup 1440p');
    expect(state.layouts[0].placements.dofusdex.scale).toBe(2);
    // Modules manquants complétés.
    expect(state.layouts[0].placements.etendard).toBeDefined();
  });
});
