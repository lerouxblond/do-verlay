/** Helpers de réordonnancement de listes d'ids (glisser-déposer du Dofusdex). */

/**
 * Déplace `sourceId` juste après/avant `targetId` (selon le sens du déplacement) et renvoie un
 * NOUVEAU tableau. Renvoie le tableau d'origine inchangé si le déplacement est sans effet
 * (ids absents, identiques, ou déjà à la bonne place).
 */
export function moveAdjacent(order: string[], sourceId: string, targetId: string): string[] {
  if (sourceId === targetId) return order;
  const from = order.indexOf(sourceId);
  const to = order.indexOf(targetId);
  if (from < 0 || to < 0 || from === to) return order;
  const arr = order.filter((x) => x !== sourceId);
  const idx = arr.indexOf(targetId);
  arr.splice(from < to ? idx + 1 : idx, 0, sourceId);
  return arr;
}
