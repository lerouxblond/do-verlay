import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type AlmanaxDay, clearAlmanaxCache } from '@shared/data/almanax';
import { AlmanaxModule } from './AlmanaxModule';

const DAY: AlmanaxDay = {
  date: '2026-06-22',
  bonus: {
    description: 'Un challenge supplémentaire est généré contre les monstres.',
    type: { name: 'Challenge supplémentaire', id: 'extra-challenge' },
  },
  reward_kamas: 1297,
  reward_xp: 2500000,
  tribute: {
    item: {
      ankama_id: 8744,
      name: 'Pince de Crustorail',
      subtype: 'resources',
      image_urls: { icon: 'https://api.dofusdu.de/icon.png', sd: 'https://api.dofusdu.de/sd.png' },
    },
    quantity: 2,
  },
};

const noSpaces = (s: string) => s.replace(/\s/g, '');

describe('AlmanaxModule', () => {
  beforeEach(() => {
    clearAlmanaxCache(); // cache module-level partagé : éviter la fuite entre tests.
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(DAY) } as Response)),
    );
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('affiche le bonus, l’offrande et les récompenses (kamas + XP niv. 200)', async () => {
    render(<AlmanaxModule />);

    expect(await screen.findByText('Challenge supplémentaire')).toBeInTheDocument();
    expect(screen.getByText(/challenge supplémentaire est généré/i)).toBeInTheDocument();
    expect(screen.getByText('Pince de Crustorail')).toBeInTheDocument();
    expect(screen.getByText('×2')).toBeInTheDocument();
    // Valeurs formatées fr-FR (espaces fines insécables) → comparaison sans espaces.
    expect(
      screen.getByText((c) => noSpaces(c) === noSpaces(new Intl.NumberFormat('fr-FR').format(1297))),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (c) => noSpaces(c) === noSpaces(new Intl.NumberFormat('fr-FR').format(2500000)),
      ),
    ).toBeInTheDocument();
  });

  it('rend le contenu aussi en format horizontal (bannière)', async () => {
    render(<AlmanaxModule layout="horizontal" />);
    expect(await screen.findByText('Challenge supplémentaire')).toBeInTheDocument();
    expect(screen.getByText('Pince de Crustorail')).toBeInTheDocument();
    expect(screen.getByText('×2')).toBeInTheDocument();
  });

  it('affiche un message d’erreur si la requête échoue', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve({ ok: false, status: 500 } as Response)),
    );
    render(<AlmanaxModule />);
    await waitFor(() => expect(screen.getByText('Almanax indisponible.')).toBeInTheDocument());
  });
});
