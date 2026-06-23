import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createEmptyProfile } from '../config/profile';
import { useOverlayEngine } from './useOverlayEngine';

const profile = (limit = 2) => {
  const p = createEmptyProfile();
  p.limite_modules = limit;
  p.rotation = false;
  // On teste la mécanique du moteur sur tous les modules (indépendamment du défaut).
  for (const m of Object.values(p.modules)) m.actif = true;
  return p;
};

describe('useOverlayEngine', () => {
  it('affiche un module au déclenchement', () => {
    const { result } = renderHook(() => useOverlayEngine(profile()));
    let res: string | undefined;
    act(() => {
      res = result.current.trigger('dofusdex');
    });
    expect(res).toBe('shown');
    expect(result.current.isVisible('dofusdex')).toBe(true);
  });

  it('renvoie cooldown sur un re-déclenchement immédiat', () => {
    const { result } = renderHook(() => useOverlayEngine(profile()));
    act(() => {
      result.current.trigger('dofusdex');
    });
    let res: string | undefined;
    act(() => {
      res = result.current.trigger('dofusdex');
    });
    expect(res).toBe('cooldown');
  });

  it('met en file quand la limite simultanée est atteinte', () => {
    const { result } = renderHook(() => useOverlayEngine(profile(2)));
    act(() => {
      result.current.trigger('dofusdex');
      result.current.trigger('etendard');
    });
    let res: string | undefined;
    act(() => {
      res = result.current.trigger('fiche');
    });
    expect(res).toBe('queued');
    expect(result.current.queue).toContain('fiche');
  });

  it('déclenche guilde et alliance indépendamment (commandes séparées)', () => {
    const { result } = renderHook(() => useOverlayEngine(profile(4)));
    act(() => {
      result.current.trigger('alliance');
    });
    expect(result.current.isVisible('alliance')).toBe(true);
    expect(result.current.isVisible('etendard')).toBe(false);
    act(() => {
      result.current.trigger('etendard');
    });
    expect(result.current.isVisible('etendard')).toBe(true);
    expect(result.current.isVisible('alliance')).toBe(true);
  });

  it('épingle un module qui reste affiché', () => {
    const { result } = renderHook(() => useOverlayEngine(profile()));
    act(() => {
      result.current.togglePin('fiche');
    });
    expect(result.current.isPinned('fiche')).toBe(true);
    expect(result.current.isVisible('fiche')).toBe(true);
  });
});
