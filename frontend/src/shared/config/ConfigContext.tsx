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
import { commandToModule } from '../lib/commandToModule';
import type { DofusdexPreset, Layout, ModulePlacement, ModuleType, Profile } from '../types';
import { cloneLayout, createDefaultLayout } from './layout';
import { cloneProfile, createEmptyProfile } from './profile';
import {
  fromExport,
  fromFullConfigExport,
  fromLayoutExport,
  loadState,
  saveState,
  toExport,
  toFullConfigExport,
  toLayoutExport,
  type PersistedState,
} from './store';

/** Intentions d'affichage éphémères (non persistées) panel → overlay. */
export type DisplayIntent =
  | { kind: 'trigger'; module: ModuleType }
  | { kind: 'pin'; module: ModuleType };

type SyncMessage =
  | { type: 'state'; state: PersistedState }
  | { type: 'intent'; intent: DisplayIntent }
  /** Commande de chat détectée par le serveur (IRC anonyme) — éphémère, jamais ré-émise. */
  | { type: 'chat'; command: string };

export interface ConfigValue {
  profiles: Profile[];
  activeId: string;
  profile: Profile;
  /** Met à jour le profil actif (édition live). */
  updateProfile: (recipe: (p: Profile) => void) => void;
  switchProfile: (id: string) => void;
  /** Duplique un profil (le profil actif par défaut) ; la copie devient active. */
  duplicateProfile: (id?: string) => void;
  /** Crée un profil vierge et le rend actif. */
  newProfile: () => void;
  /** Renomme n'importe quel profil (pas seulement l'actif). */
  renameProfile: (id: string, nom: string) => void;
  /** Supprime un profil (jamais le dernier). */
  deleteProfile: (id: string) => void;
  /** Exporte un profil en JSON (le profil actif par défaut). */
  exportProfile: (id?: string) => void;
  /** Importe un profil depuis un JSON ; renvoie le profil importé (pour le retour utilisateur). */
  importProfile: (file: File) => Promise<Profile>;

  // — Dispositions (placements des modules, indépendantes des profils) —
  layouts: Layout[];
  activeLayoutId: string;
  /** Disposition appliquée (à l'overlay et à l'éditeur). */
  layout: Layout;
  /** Bascule la disposition active — ne touche jamais au profil. */
  switchLayout: (id: string) => void;
  /** Crée une disposition (dérivée du profil actif) et la rend active. */
  newLayout: () => void;
  duplicateLayout: () => void;
  /** Supprime une disposition (jamais la dernière). */
  deleteLayout: (id: string) => void;
  renameLayout: (id: string, nom: string) => void;
  /** Édite le placement d'un module dans la disposition active. */
  updatePlacement: (module: ModuleType, recipe: (p: ModulePlacement) => void) => void;
  exportLayout: () => void;
  importLayout: (file: File) => Promise<void>;

  /** Exporte la config complète (tous profils + toutes dispositions + presets Dofusdex) en un seul JSON. */
  exportFullConfig: () => void;
  /** Importe une config complète et remplace l'état courant. */
  importFullConfig: (file: File) => Promise<void>;

  // — Configs Dofusdex (instantanés de collection, indépendantes des profils) —
  dofusdexPresets: DofusdexPreset[];
  /** Enregistre la collection Dofusdex actuelle du profil comme nouvelle config nommée. */
  saveDofusdexPreset: (nom: string) => void;
  /** Applique une config au profil actif (remplace Dofus suivis + états + objectif). */
  applyDofusdexPreset: (id: string) => void;
  deleteDofusdexPreset: (id: string) => void;
  renameDofusdexPreset: (id: string, nom: string) => void;

  /** Mode test : affichage permanent de tous les modules sur l'overlay (calage OBS). */
  previewAll: boolean;
  setPreviewAll: (on: boolean) => void;

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

/** Déclenche le téléchargement d'un objet sérialisé en JSON (export profil / disposition). */
function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

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
      else if (msg.type === 'chat') {
        // Résolution commande → module via le profil ACTIF courant (les commandes sont éditables) ;
        // si elle correspond, on déclenche via le même seam que les intentions panel → overlay.
        const s = stateRef.current;
        const active = s.profiles.find((p) => p.id === s.activeId) ?? s.profiles[0];
        const module = active && commandToModule(active, msg.command);
        if (module) intentSubs.current.forEach((cb) => cb({ kind: 'trigger', module }));
      }
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

  const duplicateProfile = useCallback((id?: string) => {
    setState((prev) => {
      const src = prev.profiles.find((p) => p.id === (id ?? prev.activeId));
      if (!src) return prev;
      const copy = cloneProfile(src);
      copy.id = `${src.id}-${Date.now().toString(36)}`;
      copy.nom = `${src.nom} (copie)`;
      return { ...prev, profiles: [...prev.profiles, copy], activeId: copy.id };
    });
  }, []);

  const newProfile = useCallback(() => {
    setState((prev) => {
      const fresh = createEmptyProfile(`profil-${Date.now().toString(36)}`);
      return { ...prev, profiles: [...prev.profiles, fresh], activeId: fresh.id };
    });
  }, []);

  const renameProfile = useCallback((id: string, nom: string) => {
    setState((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) => (p.id === id ? { ...p, nom } : p)),
    }));
  }, []);

  const deleteProfile = useCallback((id: string) => {
    setState((prev) => {
      if (prev.profiles.length <= 1) return prev; // on garde toujours un profil
      const profiles = prev.profiles.filter((p) => p.id !== id);
      const activeId = prev.activeId === id ? profiles[0].id : prev.activeId;
      return { ...prev, profiles, activeId };
    });
  }, []);

  const exportProfile = useCallback(
    (id?: string) => {
      const target = state.profiles.find((p) => p.id === id) ?? profile;
      downloadJson(`do-verlay-${target.id}.json`, toExport(target));
    },
    [state.profiles, profile],
  );

  const importProfile = useCallback(
    async (file: File): Promise<Profile> => {
      const text = await file.text();
      const imported = fromExport(JSON.parse(text));
      if (!imported) throw new Error('Fichier de profil invalide');
      const exists = state.profiles.some((p) => p.id === imported.id);
      const id = exists ? `${imported.id}-${Date.now().toString(36)}` : imported.id;
      const next = { ...imported, id };
      setState((prev) => ({ ...prev, profiles: [...prev.profiles, next], activeId: id }));
      return next;
    },
    [state.profiles],
  );

  const layout = useMemo(
    () => state.layouts.find((l) => l.id === state.activeLayoutId) ?? state.layouts[0],
    [state],
  );

  const switchLayout = useCallback((id: string) => {
    setState((prev) =>
      prev.layouts.some((l) => l.id === id) ? { ...prev, activeLayoutId: id } : prev,
    );
  }, []);

  const newLayout = useCallback(() => {
    setState((prev) => {
      const active = prev.profiles.find((p) => p.id === prev.activeId);
      const fresh = createDefaultLayout(`disposition-${Date.now().toString(36)}`, active);
      fresh.nom = 'Nouvelle disposition';
      return { ...prev, layouts: [...prev.layouts, fresh], activeLayoutId: fresh.id };
    });
  }, []);

  const duplicateLayout = useCallback(() => {
    setState((prev) => {
      const src = prev.layouts.find((l) => l.id === prev.activeLayoutId);
      if (!src) return prev;
      const copy = cloneLayout(src);
      copy.id = `${src.id}-${Date.now().toString(36)}`;
      copy.nom = `${src.nom} (copie)`;
      return { ...prev, layouts: [...prev.layouts, copy], activeLayoutId: copy.id };
    });
  }, []);

  const deleteLayout = useCallback((id: string) => {
    setState((prev) => {
      if (prev.layouts.length <= 1) return prev; // on garde toujours une disposition
      const layouts = prev.layouts.filter((l) => l.id !== id);
      const activeLayoutId = prev.activeLayoutId === id ? layouts[0].id : prev.activeLayoutId;
      return { ...prev, layouts, activeLayoutId };
    });
  }, []);

  const renameLayout = useCallback((id: string, nom: string) => {
    setState((prev) => ({
      ...prev,
      layouts: prev.layouts.map((l) => (l.id === id ? { ...l, nom } : l)),
    }));
  }, []);

  const updatePlacement = useCallback(
    (module: ModuleType, recipe: (p: ModulePlacement) => void) => {
      setState((prev) => {
        const layouts = prev.layouts.map((l) => {
          if (l.id !== prev.activeLayoutId) return l;
          const next = cloneLayout(l);
          recipe(next.placements[module]);
          return next;
        });
        return { ...prev, layouts };
      });
    },
    [],
  );

  const exportLayout = useCallback(() => {
    downloadJson(`do-verlay-disposition-${layout.id}.json`, toLayoutExport(layout));
  }, [layout]);

  const importLayout = useCallback(async (file: File) => {
    const text = await file.text();
    const imported = fromLayoutExport(JSON.parse(text));
    if (!imported) throw new Error('Fichier de disposition invalide');
    setState((prev) => {
      const exists = prev.layouts.some((l) => l.id === imported.id);
      const id = exists ? `${imported.id}-${Date.now().toString(36)}` : imported.id;
      const next = { ...imported, id };
      return { ...prev, layouts: [...prev.layouts, next], activeLayoutId: id };
    });
  }, []);

  const exportFullConfig = useCallback(() => {
    downloadJson('do-verlay-config.json', toFullConfigExport(stateRef.current));
  }, []);

  const importFullConfig = useCallback(async (file: File) => {
    const text = await file.text();
    const imported = fromFullConfigExport(JSON.parse(text));
    if (!imported) throw new Error('Fichier de configuration invalide');
    setState((prev) => ({ ...imported, previewAll: prev.previewAll }));
  }, []);

  const saveDofusdexPreset = useCallback((nom: string) => {
    setState((prev) => {
      const src = prev.profiles.find((p) => p.id === prev.activeId);
      if (!src) return prev;
      const dofus = Object.fromEntries(src.ordre.map((id) => [id, src.dofus[id] ?? 'not_started']));
      const preset: DofusdexPreset = {
        id: `dofusdex-${Date.now().toString(36)}`,
        nom: nom.trim() || 'Config sans nom',
        ordre: [...src.ordre],
        dofus,
        objectif: src.dofusdex_objectif ?? '',
      };
      return { ...prev, dofusdexPresets: [...prev.dofusdexPresets, preset] };
    });
  }, []);

  const applyDofusdexPreset = useCallback((id: string) => {
    setState((prev) => {
      const preset = prev.dofusdexPresets.find((p) => p.id === id);
      if (!preset) return prev;
      const profiles = prev.profiles.map((p) => {
        if (p.id !== prev.activeId) return p;
        const next = cloneProfile(p);
        next.ordre = [...preset.ordre];
        next.dofus = { ...next.dofus };
        for (const dofusId of preset.ordre) next.dofus[dofusId] = preset.dofus[dofusId] ?? 'not_started';
        next.dofusdex_objectif = preset.objectif;
        return next;
      });
      return { ...prev, profiles };
    });
  }, []);

  const deleteDofusdexPreset = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      dofusdexPresets: prev.dofusdexPresets.filter((p) => p.id !== id),
    }));
  }, []);

  const renameDofusdexPreset = useCallback((id: string, nom: string) => {
    setState((prev) => ({
      ...prev,
      dofusdexPresets: prev.dofusdexPresets.map((p) => (p.id === id ? { ...p, nom } : p)),
    }));
  }, []);

  const setPreviewAll = useCallback((on: boolean) => {
    setState((prev) => (prev.previewAll === on ? prev : { ...prev, previewAll: on }));
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
      renameProfile,
      deleteProfile,
      exportProfile,
      importProfile,
      layouts: state.layouts,
      activeLayoutId: state.activeLayoutId,
      layout,
      switchLayout,
      newLayout,
      duplicateLayout,
      deleteLayout,
      renameLayout,
      updatePlacement,
      exportLayout,
      importLayout,
      exportFullConfig,
      importFullConfig,
      dofusdexPresets: state.dofusdexPresets,
      saveDofusdexPreset,
      applyDofusdexPreset,
      deleteDofusdexPreset,
      renameDofusdexPreset,
      previewAll: state.previewAll,
      setPreviewAll,
      emitIntent,
      subscribeIntent,
    }),
    [
      state.profiles,
      state.activeId,
      state.layouts,
      state.activeLayoutId,
      state.dofusdexPresets,
      state.previewAll,
      profile,
      layout,
      updateProfile,
      switchProfile,
      duplicateProfile,
      newProfile,
      renameProfile,
      deleteProfile,
      exportProfile,
      importProfile,
      switchLayout,
      newLayout,
      duplicateLayout,
      deleteLayout,
      renameLayout,
      updatePlacement,
      exportLayout,
      importLayout,
      exportFullConfig,
      importFullConfig,
      saveDofusdexPreset,
      applyDofusdexPreset,
      deleteDofusdexPreset,
      renameDofusdexPreset,
      setPreviewAll,
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
