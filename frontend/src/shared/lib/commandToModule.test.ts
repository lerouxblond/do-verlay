import { describe, expect, it } from 'vitest';
import { createEmptyProfile } from '../config/profile';
import { commandToModule, normalizeCommand } from './commandToModule';

describe('normalizeCommand', () => {
  it('trim + minuscule + ajoute le `!` manquant', () => {
    expect(normalizeCommand('  Dofus ')).toBe('!dofus');
    expect(normalizeCommand('!GUILDE')).toBe('!guilde');
  });

  it('renvoie une chaîne vide pour une entrée vide', () => {
    expect(normalizeCommand('   ')).toBe('');
  });
});

describe('commandToModule', () => {
  it('mappe les commandes par défaut vers leur module', () => {
    const p = createEmptyProfile();
    expect(commandToModule(p, '!dofus')).toBe('dofusdex');
    expect(commandToModule(p, '!guilde')).toBe('etendard');
    expect(commandToModule(p, '!alliance')).toBe('alliance');
  });

  it('insensible à la casse et au `!` manquant', () => {
    const p = createEmptyProfile();
    expect(commandToModule(p, 'DOFUS')).toBe('dofusdex');
  });

  it('suit la commande renommée dans le profil, pas le défaut', () => {
    const p = createEmptyProfile();
    p.modules.dofusdex.commande = '!rush';
    expect(commandToModule(p, '!rush')).toBe('dofusdex');
    expect(commandToModule(p, '!dofus')).toBeNull();
  });

  it('renvoie null pour une commande inconnue', () => {
    expect(commandToModule(createEmptyProfile(), '!inconnu')).toBeNull();
  });
});
