import { act, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEY } from '../constants';
import { DOFUS_LIST } from '../data/dofus';
import { ConfigProvider, useConfig, type ConfigValue } from './ConfigContext';

// Capture l'API du contexte pour piloter le provider depuis le test.
let api: ConfigValue | null = null;
function Capture() {
  api = useConfig();
  return null;
}

describe('ConfigProvider — synchro débouncée', () => {
  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
    api = null;
  });

  it("n'écrit dans localStorage qu'après la fenêtre de débounce", () => {
    vi.useFakeTimers();
    localStorage.clear();

    render(
      <ConfigProvider>
        <Capture />
      </ConfigProvider>,
    );

    // Laisse passer l'écriture initiale (montage), puis on repart d'un localStorage propre.
    act(() => void vi.advanceTimersByTime(300));
    localStorage.removeItem(STORAGE_KEY);

    act(() => api!.updateProfile((p) => void (p.guild.nom = 'Les Bateleurs')));
    // Juste après l'édition : rien d'écrit (débounce en cours).
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();

    act(() => void vi.advanceTimersByTime(300));
    // Après la fenêtre : une seule écriture, contenant le changement.
    expect(localStorage.getItem(STORAGE_KEY)).toContain('Les Bateleurs');
  });

  it('enregistre puis applique une config Dofusdex sans changer de profil', () => {
    localStorage.clear();
    render(
      <ConfigProvider>
        <Capture />
      </ConfigProvider>,
    );

    const firstId = DOFUS_LIST[0].id;
    act(() => {
      api!.updateProfile((p) => {
        p.ordre = [firstId];
        p.dofus[firstId] = 'complete';
        p.dofusdex_objectif = 'Rush';
      });
    });
    act(() => api!.saveDofusdexPreset('Ma config'));
    expect(api!.dofusdexPresets).toHaveLength(1);

    const profileId = api!.activeId;
    // On vide la collection, puis on réapplique la config sauvegardée.
    act(() => api!.updateProfile((p) => void (p.ordre = [])));
    act(() => api!.applyDofusdexPreset(api!.dofusdexPresets[0].id));

    expect(api!.activeId).toBe(profileId); // le profil n'a pas changé
    expect(api!.profile.ordre).toEqual([firstId]);
    expect(api!.profile.dofus[firstId]).toBe('complete');
    expect(api!.profile.dofusdex_objectif).toBe('Rush');
  });

  it('bascule le mode test (affichage permanent)', () => {
    localStorage.clear();
    render(
      <ConfigProvider>
        <Capture />
      </ConfigProvider>,
    );
    expect(api!.previewAll).toBe(false);
    act(() => api!.setPreviewAll(true));
    expect(api!.previewAll).toBe(true);
  });

  it('coalesce une rafale de changements en une seule écriture finale', () => {
    vi.useFakeTimers();
    localStorage.clear();
    render(
      <ConfigProvider>
        <Capture />
      </ConfigProvider>,
    );
    act(() => void vi.advanceTimersByTime(300));
    localStorage.removeItem(STORAGE_KEY);

    // Rafale rapprochée (frappe) : chaque changement re-arme le débounce.
    act(() => {
      api!.updateProfile((p) => void (p.guild.nom = 'A'));
      vi.advanceTimersByTime(50);
      api!.updateProfile((p) => void (p.guild.nom = 'AB'));
      vi.advanceTimersByTime(50);
      api!.updateProfile((p) => void (p.guild.nom = 'ABC'));
    });
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull(); // toujours rien (re-armé)

    act(() => void vi.advanceTimersByTime(300));
    const raw = localStorage.getItem(STORAGE_KEY) ?? '';
    expect(raw).toContain('ABC'); // seul l'état final est persisté
  });
});
