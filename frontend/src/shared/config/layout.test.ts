import { describe, expect, it } from 'vitest';
import { MODULE_ORDER } from '../constants';
import type { Layout } from '../types';
import {
  anchorAxes,
  createDefaultLayout,
  normalizeLayout,
  placementTranslate,
} from './layout';

describe('createDefaultLayout', () => {
  it('couvre tous les modules du référentiel', () => {
    const l = createDefaultLayout();
    for (const m of MODULE_ORDER) {
      expect(l.placements[m]).toBeDefined();
      expect(l.placements[m].scale).toBe(1);
      expect(l.placements[m].xPct).toBeGreaterThanOrEqual(0);
      expect(l.placements[m].xPct).toBeLessThanOrEqual(100);
    }
  });

  it('dérive les placements des anciennes zones du profil (migration)', () => {
    const profile = { modules: { dofusdex: { zone_ancrage: 'HG' } } } as never;
    const l = createDefaultLayout('x', profile);
    // HG → coin haut-gauche
    expect(l.placements.dofusdex.anchor).toBe('TL');
    expect(l.placements.dofusdex.xPct).toBeLessThan(10);
    expect(l.placements.dofusdex.yPct).toBeLessThan(10);
  });
});

describe('normalizeLayout (migration)', () => {
  it('complète les placements manquants sans écraser les existants', () => {
    const partial = {
      id: 'd1',
      nom: 'Test',
      placements: { dofusdex: { xPct: 12, yPct: 34, anchor: 'MC', scale: 1.5 } },
    } as unknown as Layout;

    const norm = normalizeLayout(partial);

    expect(norm.placements.dofusdex).toEqual({ xPct: 12, yPct: 34, anchor: 'MC', scale: 1.5 });
    // Les autres modules sont remplis par défaut.
    for (const m of MODULE_ORDER) expect(norm.placements[m]).toBeDefined();
    expect(norm.nom).toBe('Test');
  });
});

describe('helpers d’ancrage', () => {
  it('aligne le coin sur le point (translate) selon l’ancre', () => {
    expect(placementTranslate('TL')).toBe('translate(0%, 0%)');
    expect(placementTranslate('MC')).toBe('translate(-50%, -50%)');
    expect(placementTranslate('BR')).toBe('translate(-100%, -100%)');
  });

  it('mappe l’origine de transformation (horizontal puis vertical)', () => {
    expect(anchorAxes('TL').origin).toBe('left top');
    expect(anchorAxes('BR').origin).toBe('right bottom');
    expect(anchorAxes('MC').origin).toBe('center center');
  });
});
