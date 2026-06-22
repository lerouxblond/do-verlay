import { describe, expect, it } from 'vitest';
import { almanaxDateParis } from './almanaxDate';

describe('almanaxDateParis', () => {
  it('formate en YYYY-MM-DD', () => {
    expect(almanaxDateParis(new Date('2026-06-22T12:00:00Z'))).toBe('2026-06-22');
  });

  it('utilise le fuseau Europe/Paris, pas UTC (minuit UTC = déjà le jour à Paris)', () => {
    // 23 juin 00:30 UTC = 23 juin 02:30 à Paris (CEST) → toujours le 23.
    expect(almanaxDateParis(new Date('2026-06-23T00:30:00Z'))).toBe('2026-06-23');
    // 23 juin 21:30 UTC = 23 juin 23:30 à Paris → encore le 23 (pas basculé au 24).
    expect(almanaxDateParis(new Date('2026-06-23T21:30:00Z'))).toBe('2026-06-23');
    // 23 juin 22:30 UTC = 24 juin 00:30 à Paris → déjà le 24.
    expect(almanaxDateParis(new Date('2026-06-23T22:30:00Z'))).toBe('2026-06-24');
  });
});
