/**
 * Charge l'almanax du jour (fuseau Paris) via le client mis en cache. Isole le fetch + ses
 * états (loading/error) pour que le composant visuel reste purement présentationnel et testable.
 */
import { useEffect, useState } from 'react';
import { type AlmanaxDay, fetchAlmanax } from '@shared/data/almanax';
import { almanaxDateParis } from '@shared/lib/almanaxDate';

export interface AlmanaxState {
  data: AlmanaxDay | null;
  loading: boolean;
  error: boolean;
}

export function useAlmanax(): AlmanaxState {
  const [state, setState] = useState<AlmanaxState>({ data: null, loading: true, error: false });

  useEffect(() => {
    let alive = true;
    const date = almanaxDateParis();
    setState({ data: null, loading: true, error: false });
    fetchAlmanax(date)
      .then((data) => alive && setState({ data, loading: false, error: false }))
      .catch(() => alive && setState({ data: null, loading: false, error: true }));
    return () => {
      alive = false;
    };
  }, []);

  return state;
}
