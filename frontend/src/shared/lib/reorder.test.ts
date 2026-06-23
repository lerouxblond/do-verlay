import { describe, expect, it } from 'vitest';
import { moveAdjacent } from './reorder';

describe('moveAdjacent', () => {
  it('déplace un élément vers le bas (après la cible)', () => {
    expect(moveAdjacent(['a', 'b', 'c', 'd'], 'a', 'c')).toEqual(['b', 'c', 'a', 'd']);
  });

  it('déplace un élément vers le haut (avant la cible)', () => {
    expect(moveAdjacent(['a', 'b', 'c', 'd'], 'd', 'b')).toEqual(['a', 'd', 'b', 'c']);
  });

  it('renvoie le tableau d’origine (même référence) si sans effet', () => {
    const arr = ['a', 'b', 'c'];
    expect(moveAdjacent(arr, 'a', 'a')).toBe(arr); // identiques
    expect(moveAdjacent(arr, 'x', 'b')).toBe(arr); // source absente
    expect(moveAdjacent(arr, 'a', 'z')).toBe(arr); // cible absente
  });

  it('ne mute pas le tableau d’entrée', () => {
    const arr = ['a', 'b', 'c'];
    moveAdjacent(arr, 'a', 'c');
    expect(arr).toEqual(['a', 'b', 'c']);
  });
});
