/**
 * Moteur d'affichage de l'overlay — porté fidèlement du prototype (étape 06).
 * Gère l'état runtime (quel module est à l'écran, cooldowns, file d'attente,
 * rotation auto) indépendamment de la config persistée (le Profil).
 *
 * Réutilisé par l'aperçu du panel et par l'overlay live.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MODULE_ORDER, MODULES, TIMING } from '../constants';
import type { ModuleType, Profile } from '../types';

export interface EngineRuntime {
  /** module → timestamp d'expiration (ou TIMING.pinned si épinglé). */
  shown: Partial<Record<ModuleType, number>>;
  cooldown: Record<ModuleType, number>;
  queue: ModuleType[];
  rotationRunning: boolean;
  rotIdx: number;
  rotAt: number;
}

export type TriggerResult = 'shown' | 'queued' | 'already' | 'cooldown' | 'inactive';

export interface OverlayEngine {
  shown: Partial<Record<ModuleType, number>>;
  cooldown: Record<ModuleType, number>;
  queue: ModuleType[];
  rotationRunning: boolean;
  limit: number;
  now: number;
  isVisible: (m: ModuleType) => boolean;
  isPinned: (m: ModuleType) => boolean;
  cooldownLeft: (m: ModuleType) => number; // secondes restantes (0 si dispo)
  trigger: (m: ModuleType) => TriggerResult;
  togglePin: (m: ModuleType) => void;
  setRotationRunning: (on: boolean) => void;
  visibleNames: string[];
}

const emptyCooldown = (): Record<ModuleType, number> => ({
  dofusdex: 0,
  etendard: 0,
  alliance: 0,
  fiche: 0,
});

export interface EngineOptions {
  /** retour pour le simulateur de chat (feedback texte coloré). */
  onMessage?: (text: string, color: string) => void;
  /**
   * Sous-ensemble de modules réellement gérés (= implémentés côté rendu). La rotation
   * et les commandes ignorent les modules hors de cet ensemble, pour ne jamais afficher
   * de créneau vide. Défaut : tous les modules.
   */
  available?: ModuleType[];
}

export function useOverlayEngine(profile: Profile, options: EngineOptions = {}): OverlayEngine {
  const { onMessage, available = MODULE_ORDER } = options;
  const limit = profile.limite_modules;

  /** Module pilotable : implémenté ET activé dans le profil. */
  const isEligible = useCallback(
    (m: ModuleType) => available.includes(m) && profile.modules[m].actif,
    [available, profile],
  );

  const rt = useRef<EngineRuntime>({
    shown: {},
    cooldown: emptyCooldown(),
    queue: [],
    rotationRunning: profile.rotation,
    rotIdx: 0,
    rotAt: Date.now() + TIMING.rotation,
  });

  const [now, setNow] = useState(() => Date.now());
  const bump = useCallback(() => setNow(Date.now()), []);

  const cmdOf = (m: ModuleType) => MODULES[m].command;

  // Boucle de tick : expiration, dépile la file (≤ limit), rotation auto.
  useEffect(() => {
    const id = window.setInterval(() => {
      const r = rt.current;
      const t = Date.now();
      for (const m of Object.keys(r.shown) as ModuleType[]) {
        const exp = r.shown[m];
        if (exp !== undefined && exp !== TIMING.pinned && exp <= t) delete r.shown[m];
      }
      while (r.queue.length && Object.keys(r.shown).length < limit) {
        const next = r.queue.shift() as ModuleType;
        if (!r.shown[next]) r.shown[next] = t + profile.modules[next].duree_affichage;
      }
      if (r.rotationRunning && t >= r.rotAt) {
        r.rotAt = t + TIMING.rotation;
        autoRotate(r, limit, profile, MODULE_ORDER.filter(isEligible));
      }
      setNow(t);
    }, TIMING.tick);
    return () => window.clearInterval(id);
  }, [limit, profile, isEligible]);

  // La rotation persistée du profil pilote l'état runtime.
  useEffect(() => {
    rt.current.rotationRunning = profile.rotation;
    rt.current.rotAt = Date.now() + TIMING.rotation;
    bump();
  }, [profile.rotation, bump]);

  // Affichage permanent (épinglage persisté) : un module épinglé (+ actif + implémenté)
  // reste affiché en continu, hors rotation et hors expiration.
  useEffect(() => {
    const r = rt.current;
    for (const m of MODULE_ORDER) {
      const pinned = available.includes(m) && profile.modules[m].actif && !!profile.modules[m].epingle;
      if (pinned) r.shown[m] = TIMING.pinned;
      else if (r.shown[m] === TIMING.pinned) delete r.shown[m];
    }
    bump();
  }, [profile, available, bump]);

  const trigger = useCallback(
    (m: ModuleType): TriggerResult => {
      const r = rt.current;
      const t = Date.now();
      if (!isEligible(m)) {
        onMessage?.(`⛔ ${cmdOf(m)} module inactif`, '#9A8A84');
        return 'inactive';
      }
      if (t < r.cooldown[m]) {
        onMessage?.(`⛔ ${cmdOf(m)} en cooldown`, '#E8881C');
        return 'cooldown';
      }
      r.cooldown[m] = t + profile.modules[m].cooldown;
      let result: TriggerResult;
      if (r.shown[m]) {
        if (r.shown[m] !== TIMING.pinned) r.shown[m] = t + profile.modules[m].duree_affichage;
        onMessage?.(`${cmdOf(m)} → ↻ déjà à l'écran`, '#9CD2FF');
        result = 'already';
      } else if (Object.keys(r.shown).length >= limit) {
        if (!r.queue.includes(m)) r.queue.push(m);
        onMessage?.(`${cmdOf(m)} → ⏳ mis en file`, '#E8881C');
        result = 'queued';
      } else {
        r.shown[m] = t + profile.modules[m].duree_affichage;
        onMessage?.(`${cmdOf(m)} → ✔ affiché`, '#4CAF50');
        result = 'shown';
      }
      bump();
      return result;
    },
    [limit, profile, onMessage, bump, isEligible],
  );

  const togglePin = useCallback(
    (m: ModuleType) => {
      const r = rt.current;
      if (r.shown[m] === TIMING.pinned) delete r.shown[m];
      else r.shown[m] = TIMING.pinned;
      bump();
    },
    [bump],
  );

  const setRotationRunning = useCallback(
    (on: boolean) => {
      rt.current.rotationRunning = on;
      rt.current.rotAt = Date.now() + 400;
      bump();
    },
    [bump],
  );

  return useMemo<OverlayEngine>(() => {
    const r = rt.current;
    const isVisible = (m: ModuleType) => !!r.shown[m];
    const visibleNames = MODULE_ORDER.filter((m) => r.shown[m]).map((m) => MODULES[m].name);
    return {
      shown: r.shown,
      cooldown: r.cooldown,
      queue: r.queue,
      rotationRunning: r.rotationRunning,
      limit,
      now,
      isVisible,
      isPinned: (m) => r.shown[m] === TIMING.pinned,
      cooldownLeft: (m) => Math.max(0, Math.ceil((r.cooldown[m] - now) / 1000)),
      trigger,
      togglePin,
      setRotationRunning,
      visibleNames,
    };
  }, [now, limit, trigger, togglePin, setRotationRunning]);
}

/** Fait entrer le prochain module éligible (implémenté + actif) dans le cycle. */
function autoRotate(r: EngineRuntime, limit: number, profile: Profile, eligible: ModuleType[]) {
  if (eligible.length === 0) return;
  const start = r.rotIdx % eligible.length;
  for (let i = 0; i < eligible.length; i++) {
    const idx = (start + i) % eligible.length;
    const mod = eligible[idx];
    if (!r.shown[mod] && !r.queue.includes(mod)) {
      r.rotIdx = idx + 1;
      if (Object.keys(r.shown).length < limit) {
        r.shown[mod] = Date.now() + profile.modules[mod].duree_affichage;
      } else {
        r.queue.push(mod);
      }
      return;
    }
  }
}
