import { act, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEY } from '../constants';
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
