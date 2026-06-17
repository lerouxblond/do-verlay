/**
 * Overlay (source navigateur OBS). Scène plein écran transparente qui consomme le profil
 * actif (ConfigProvider : localStorage + BroadcastChannel + WebSocket) et le moteur
 * d'affichage (rotation auto, commandes, file, cooldowns, épinglage). Chaque module visible
 * est rendu à sa zone d'ancrage, avec animation d'entrée ET de sortie (présence).
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useConfig } from '@shared/config/ConfigContext';
import { MODULE_ORDER } from '@shared/constants';
import { useOverlayEngine } from '@shared/engine/useOverlayEngine';
import type { ModuleType, Profile } from '@shared/types';
import { DofusdexModule } from './modules/DofusdexModule/DofusdexModule';
import {
  anchorStyle,
  dotStyle,
  hudStyle,
  labelStyle,
  metaStyle,
  profileStyle,
  sepStyle,
  stageStyle,
  type Phase,
} from './OverlayApp.styles';

/** Modules implémentés (rendu disponible). */
const AVAILABLE: ModuleType[] = ['dofusdex'];

/** Rendu de chaque module implémenté. */
const MODULE_VIEWS: Partial<Record<ModuleType, (profile: Profile) => ReactNode>> = {
  dofusdex: (profile) => <DofusdexModule profile={profile} />,
};

/** Durée de l'animation de sortie (doit suivre @keyframes dv-module-out). */
const EXIT_MS = 400;

/**
 * Maintient à l'écran les modules visibles + ceux qui terminent leur animation de sortie.
 * `visibleKey` (liste sérialisée) évite de recalculer à chaque tick du moteur.
 */
function useModulePresence(visible: ModuleType[]): { m: ModuleType; phase: Phase }[] {
  const [items, setItems] = useState<{ m: ModuleType; phase: Phase }[]>([]);
  const timers = useRef(new Map<ModuleType, number>());
  const visibleKey = visible.join(',');

  useEffect(() => {
    const vis = new Set(visibleKey ? (visibleKey.split(',') as ModuleType[]) : []);
    setItems((prev) => {
      const next = prev.map((it) => ({ ...it }));
      // entrées (ou ré-entrées avant la fin de la sortie)
      vis.forEach((m) => {
        const e = next.find((x) => x.m === m);
        if (!e) next.push({ m, phase: 'in' });
        else if (e.phase === 'out') {
          e.phase = 'in';
          const t = timers.current.get(m);
          if (t) {
            window.clearTimeout(t);
            timers.current.delete(m);
          }
        }
      });
      // sorties
      next.forEach((e) => {
        if (!vis.has(e.m) && e.phase !== 'out') {
          e.phase = 'out';
          if (!timers.current.has(e.m)) {
            const t = window.setTimeout(() => {
              timers.current.delete(e.m);
              setItems((cur) => cur.filter((x) => x.m !== e.m));
            }, EXIT_MS);
            timers.current.set(e.m, t);
          }
        }
      });
      return next;
    });
  }, [visibleKey]);

  useEffect(() => {
    const map = timers.current;
    return () => map.forEach((t) => window.clearTimeout(t));
  }, []);

  return items;
}

const clock = (d: Date) =>
  d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

export function OverlayApp() {
  const { profile } = useConfig();
  const engine = useOverlayEngine(profile, { available: AVAILABLE });

  const visible = MODULE_ORDER.filter((m) => engine.isVisible(m) && MODULE_VIEWS[m]);
  const presence = useModulePresence(visible);

  const [syncedAt, setSyncedAt] = useState<Date>(() => new Date());
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setSyncedAt(new Date());
  }, [profile]);

  return (
    <div style={stageStyle}>
      {presence.map(({ m, phase }) => (
        <div key={m} style={anchorStyle(profile.modules[m].zone_ancrage, phase)}>
          {MODULE_VIEWS[m]!(profile)}
        </div>
      ))}

      {/* Témoin de synchro — masqué par défaut, activable depuis les réglages généraux. */}
      {profile.overlay_hud && (
        <div style={hudStyle}>
          <span style={dotStyle} />
          <span style={labelStyle}>Connecté</span>
          <span style={sepStyle} />
          <span style={profileStyle}>{profile.nom}</span>
          <span style={sepStyle} />
          <span style={metaStyle}>
            {profile.chaine_twitch ? `#${profile.chaine_twitch}` : 'chaîne ?'} ·{' '}
            {engine.rotationRunning ? 'rotation' : 'manuel'} · maj {clock(syncedAt)}
          </span>
        </div>
      )}
    </div>
  );
}
