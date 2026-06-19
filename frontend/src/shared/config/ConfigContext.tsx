/**
 * ConfigProvider — source de vérité de la config côté front.
 * Le panel édite (`publish`) ; l'overlay applique (abonné seul).
 *
 * Trois canaux de synchro complémentaires :
 *  - localStorage : persistance + reprise au redémarrage.
 *  - BroadcastChannel : synchro instantanée entre onglets du MÊME navigateur.
 *  - WebSocket (/ws du serveur Go) : synchro entre PROCESS distincts — indispensable pour
 *    que l'overlay tourné dans OBS (navigateur intégré, localStorage isolé) reçoive la config.
 *    Sans serveur (front servi par Vite), la connexion échoue silencieusement → mode local.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { BROADCAST_CHANNEL } from '../constants';
import type { ModuleType, Profile } from '../types';
import { cloneProfile, createEmptyProfile } from './profile';
import { fromExport, loadState, saveState, toExport, type PersistedState } from './store';

/** Intentions d'affichage éphémères (non persistées) panel → overlay. */
export type DisplayIntent =
  | { kind: 'trigger'; module: ModuleType }
  | { kind: 'pin'; module: ModuleType };

type SyncMessage =
  | { type: 'state'; state: PersistedState }
  | { type: 'intent'; intent: DisplayIntent };

export interface ConfigValue {
  profiles: Profile[];
  activeId: string;
  profile: Profile;
  /** Met à jour le profil actif (édition live). */
  updateProfile: (recipe: (p: Profile) => void) => void;
  switchProfile: (id: string) => void;
  duplicateProfile: () => void;
  /** Crée un profil vierge et le rend actif. */
  newProfile: () => void;
  /** Supprime un profil (jamais le dernier). */
  deleteProfile: (id: string) => void;
  exportProfile: () => void;
  importProfile: (file: File) => Promise<void>;
  /** Émet une intention d'affichage (déclenchement / épinglage). */
  emitIntent: (intent: DisplayIntent) => void;
  /** S'abonne aux intentions reçues (overlay). Renvoie le désabonnement. */
  subscribeIntent: (cb: (intent: DisplayIntent) => void) => () => void;
}

const ConfigCtx = createContext<ConfigValue | null>(null);

/** Fenêtre de coalescence persist/diffusion : assez courte pour rester « live », assez large
 *  pour absorber une rafale de frappes ou un glisser-déposer. */
const SYNC_DEBOUNCE_MS = 180;

const wsUrl = (): string | null => {
  if (typeof window === 'undefined' || typeof WebSocket === 'undefined') return null;
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${proto}//${window.location.host}/ws`;
};

export interface ConfigProviderProps {
  children: ReactNode;
  /**
   * `true` (panel) : publie ses changements sur les canaux de synchro.
   * `false` (overlay) : abonné seul — n'émet jamais, applique ce qu'il reçoit.
   */
  publish?: boolean;
}

export function ConfigProvider({ children, publish = true }: ConfigProviderProps) {
  const [state, setState] = useState<PersistedState>(() => loadState());
  const channelRef = useRef<BroadcastChannel | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const intentSubs = useRef(new Set<(i: DisplayIntent) => void>());
  /** Dernier état synchronisé (reçu OU émis), sérialisé — évite les ré-émissions / boucles. */
  const lastSync = useRef('');
  /** Dernier état connu, pour le pousser dès l'ouverture du WebSocket. */
  const stateRef = useRef(state);
  stateRef.current = state;

  /** Applique un état distant sans le ré-émettre. */
  const applyRemoteState = useCallback((next: PersistedState) => {
    lastSync.current = JSON.stringify(next);
    setState(next);
  }, []);

  const handleMessage = useCallback(
    (msg: SyncMessage) => {
      if (msg.type === 'state') applyRemoteState(msg.state);
      else if (msg.type === 'intent') intentSubs.current.forEach((cb) => cb(msg.intent));
    },
    [applyRemoteState],
  );

  // Canal inter-onglets (même navigateur).
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const ch = new BroadcastChannel(BROADCAST_CHANNEL);
    channelRef.current = ch;
    ch.onmessage = (ev: MessageEvent<SyncMessage>) => handleMessage(ev.data);
    return () => {
      ch.close();
      channelRef.current = null;
    };
  }, [handleMessage]);

  // Canal inter-process (serveur Go) — reconnexion automatique.
  useEffect(() => {
    const url = wsUrl();
    if (!url) return;
    let ws: WebSocket | null = null;
    let retry: number | undefined;
    let closed = false;

    const connect = () => {
      ws = new WebSocket(url);
      wsRef.current = ws;
      ws.onmessage = (ev: MessageEvent<string>) => {
        try {
          handleMessage(JSON.parse(ev.data) as SyncMessage);
        } catch {
          /* message non-JSON ignoré */
        }
      };
      ws.onopen = () => {
        // Le panel pousse son état courant pour réhydrater le serveur (et les overlays).
        if (publish && ws) ws.send(JSON.stringify({ type: 'state', state: stateRef.current }));
      };
      ws.onclose = () => {
        wsRef.current = null;
        if (!closed) retry = window.setTimeout(connect, 2500);
      };
      ws.onerror = () => ws?.close();
    };
    connect();

    return () => {
      closed = true;
      if (retry) window.clearTimeout(retry);
      ws?.close();
      wsRef.current = null;
    };
  }, [handleMessage, publish]);

  const broadcast = useCallback((msg: SyncMessage, serializedState?: string) => {
    channelRef.current?.postMessage(msg); // BroadcastChannel = structured clone (pas de JSON)
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      // Réutilise le JSON de l'état déjà calculé pour éviter une 2ᵉ sérialisation du payload.
      const wire =
        msg.type === 'state' && serializedState
          ? `{"type":"state","state":${serializedState}}`
          : JSON.stringify(msg);
      ws.send(wire);
    }
  }, []);

  // Persiste + diffuse, DÉBOUNCÉ : coalesce les rafales (frappe, glisser-déposer) en une seule
  // passe, avec UNE seule sérialisation réutilisée pour localStorage et le WebSocket. Un flush sur
  // `pagehide` garantit l'écriture si l'onglet se ferme avant l'échéance.
  useEffect(() => {
    const flush = () => {
      const s = stateRef.current;
      const json = JSON.stringify(s);
      saveState(s, json);
      if (!publish) return;
      if (json === lastSync.current) return; // déjà synchronisé (reçu ou émis)
      lastSync.current = json;
      broadcast({ type: 'state', state: s }, json);
    };
    const id = window.setTimeout(flush, SYNC_DEBOUNCE_MS);
    const onHide = () => {
      window.clearTimeout(id);
      flush();
    };
    window.addEventListener('pagehide', onHide);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('pagehide', onHide);
    };
  }, [state, publish, broadcast]);

  const profile = useMemo(
    () => state.profiles.find((p) => p.id === state.activeId) ?? state.profiles[0],
    [state],
  );

  const updateProfile = useCallback((recipe: (p: Profile) => void) => {
    setState((prev) => {
      const profiles = prev.profiles.map((p) => {
        if (p.id !== prev.activeId) return p;
        const next = cloneProfile(p);
        recipe(next);
        return next;
      });
      return { ...prev, profiles };
    });
  }, []);

  const switchProfile = useCallback((id: string) => {
    setState((prev) => (prev.profiles.some((p) => p.id === id) ? { ...prev, activeId: id } : prev));
  }, []);

  const duplicateProfile = useCallback(() => {
    setState((prev) => {
      const src = prev.profiles.find((p) => p.id === prev.activeId);
      if (!src) return prev;
      const copy = cloneProfile(src);
      copy.id = `${src.id}-${Date.now().toString(36)}`;
      copy.nom = `${src.nom} (copie)`;
      return { profiles: [...prev.profiles, copy], activeId: copy.id };
    });
  }, []);

  const newProfile = useCallback(() => {
    setState((prev) => {
      const fresh = createEmptyProfile(`profil-${Date.now().toString(36)}`);
      return { profiles: [...prev.profiles, fresh], activeId: fresh.id };
    });
  }, []);

  const deleteProfile = useCallback((id: string) => {
    setState((prev) => {
      if (prev.profiles.length <= 1) return prev; // on garde toujours un profil
      const profiles = prev.profiles.filter((p) => p.id !== id);
      const activeId = prev.activeId === id ? profiles[0].id : prev.activeId;
      return { profiles, activeId };
    });
  }, []);

  const exportProfile = useCallback(() => {
    const data = toExport(profile);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `do-verlay-${profile.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [profile]);

  const importProfile = useCallback(async (file: File) => {
    const text = await file.text();
    const imported = fromExport(JSON.parse(text));
    if (!imported) throw new Error('Fichier de profil invalide');
    setState((prev) => {
      const exists = prev.profiles.some((p) => p.id === imported.id);
      const id = exists ? `${imported.id}-${Date.now().toString(36)}` : imported.id;
      const profile = { ...imported, id };
      return { profiles: [...prev.profiles, profile], activeId: id };
    });
  }, []);

  const emitIntent = useCallback(
    (intent: DisplayIntent) => {
      if (publish) broadcast({ type: 'intent', intent });
    },
    [publish, broadcast],
  );

  const subscribeIntent = useCallback((cb: (i: DisplayIntent) => void) => {
    intentSubs.current.add(cb);
    return () => intentSubs.current.delete(cb);
  }, []);

  const value = useMemo<ConfigValue>(
    () => ({
      profiles: state.profiles,
      activeId: state.activeId,
      profile,
      updateProfile,
      switchProfile,
      duplicateProfile,
      newProfile,
      deleteProfile,
      exportProfile,
      importProfile,
      emitIntent,
      subscribeIntent,
    }),
    [
      state.profiles,
      state.activeId,
      profile,
      updateProfile,
      switchProfile,
      duplicateProfile,
      newProfile,
      deleteProfile,
      exportProfile,
      importProfile,
      emitIntent,
      subscribeIntent,
    ],
  );

  return <ConfigCtx.Provider value={value}>{children}</ConfigCtx.Provider>;
}

export function useConfig(): ConfigValue {
  const ctx = useContext(ConfigCtx);
  if (!ctx) throw new Error('useConfig doit être utilisé dans <ConfigProvider>');
  return ctx;
}
