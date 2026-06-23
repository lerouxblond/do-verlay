/**
 * Client de l'API Almanax dofusdude (open-source, sans clé). **Premier accès réseau HTTP du
 * projet** (les autres modules lisent le `Profile`). Langue figée à `fr` (l'app est 100 % FR).
 *
 * `level=200` est indispensable : sans lui l'API renvoie `reward_xp: null`. On veut la récompense
 * d'XP maximale (niveau 200), donc on le passe systématiquement.
 *
 * NB CSP : l'origine `https://api.dofusdu.de` doit être autorisée dans `connect-src` (JSON) ET
 * `img-src` (icône de l'offrande) côté serveur Go — cf. server/cmd/api/main.go.
 */

const BASE = 'https://api.dofusdu.de/dofus3/v1/fr';

/** Réponse Almanax du jour (sous-ensemble des champs utilisés par l'overlay). */
export interface AlmanaxDay {
  date: string;
  bonus: {
    description: string;
    type: { name: string; id: string };
  };
  reward_kamas: number;
  /** XP de l'offrande au niveau passé en query (200) ; `null` si `level` absent. */
  reward_xp: number | null;
  tribute: {
    item: {
      ankama_id: number;
      name: string;
      subtype: string;
      image_urls: { icon: string; sd: string };
    };
    quantity: number;
  };
}

/**
 * Cache mémoire par date : un module overlay se monte/démonte à chaque rotation, et l'aperçu
 * panel partage le même client — sans cache on rappellerait l'API à chaque apparition. On
 * mémorise la **promesse** (pas seulement le résultat) pour dédoublonner les requêtes
 * concurrentes ; en cas d'échec on purge l'entrée pour autoriser une nouvelle tentative.
 */
const cache = new Map<string, Promise<AlmanaxDay>>();

/** Récupère l'almanax d'une date `YYYY-MM-DD` (récompenses au niveau 200), avec cache. */
export function fetchAlmanax(date: string): Promise<AlmanaxDay> {
  const cached = cache.get(date);
  if (cached) return cached;

  const promise = fetch(`${BASE}/almanax/${date}?level=200`)
    .then((res) => {
      if (!res.ok) throw new Error(`Almanax ${date} — HTTP ${res.status}`);
      return res.json() as Promise<AlmanaxDay>;
    })
    .catch((err) => {
      cache.delete(date);
      throw err;
    });

  cache.set(date, promise);
  return promise;
}

/** Vide le cache (tests). */
export function clearAlmanaxCache(): void {
  cache.clear();
}
