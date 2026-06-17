/**
 * ConfigProvider — source de vérité de la config côté front.
 * Le panel édite ; l'overlay applique. Synchro temps réel entre onglets via
 * BroadcastChannel + persistance localStorage (remplace, en attendant le
 * backend, le canal WebSocket de l'architecture cible).
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
import { cloneProfile } from './profile';
import { fromExport, loadState, saveState, toExport, type PersistedState } from './store';

/** Intentions d'affichage éphémères (non persistées) panel → overlay. */
export type DisplayIntent =
  | { kind: 'trigger'; module: ModuleType }
  | { kind: 'pin'; module: ModuleType };

type BroadcastMessage =
  | { type: 'state'; state: PersistedState }
  | { type: 'intent'; intent: DisplayIntent };

interface ConfigValue {
  profiles: Profile[];
  activeId: string;
  profile: Profile;
  /** Met à jour le profil actif (édition live). */
  updateProfile: (recipe: (p: Profile) => void) => void;
  switchProfile: (id: string) => void;
  duplicateProfile: () => void;
  exportProfile: () => void;
  importProfile: (file: File) => Promise<void>;
  /** Émet une intention d'affichage (déclenchement / épinglage). */
  emitIntent: (intent: DisplayIntent) => void;
  /** S'abonne aux intentions reçues (overlay). Renvoie le désabonnement. */
  subscribeIntent: (cb: (intent: DisplayIntent) => void) => () => void;
}

const ConfigCtx = createContext<ConfigValue | null>(null);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(() => loadState());
  const channelRef = useRef<BroadcastChannel | null>(null);
  const intentSubs = useRef(new Set<(i: DisplayIntent) => void>());
  /** Vrai quand on applique un message distant → ne pas re-diffuser. */
  const applyingRemote = useRef(false);

  // Canal de diffusion + écoute des messages distants.
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const ch = new BroadcastChannel(BROADCAST_CHANNEL);
    channelRef.current = ch;
    ch.onmessage = (ev: MessageEvent<BroadcastMessage>) => {
      const msg = ev.data;
      if (msg.type === 'state') {
        applyingRemote.current = true;
        setState(msg.state);
      } else if (msg.type === 'intent') {
        intentSubs.current.forEach((cb) => cb(msg.intent));
      }
    };
    return () => {
      ch.close();
      channelRef.current = null;
    };
  }, []);

  // Persiste + diffuse à chaque changement de config (sauf si appliqué à distance).
  useEffect(() => {
    saveState(state);
    if (applyingRemote.current) {
      applyingRemote.current = false;
      return;
    }
    channelRef.current?.postMessage({ type: 'state', state } satisfies BroadcastMessage);
  }, [state]);

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

  const emitIntent = useCallback((intent: DisplayIntent) => {
    channelRef.current?.postMessage({ type: 'intent', intent } satisfies BroadcastMessage);
  }, []);

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
