/**
 * Hook — connecte au chat Twitch IRC et dispatch les commandes vers l'overlay.
 *
 * - S'active uniquement quand `chaine_twitch` est renseignée dans le profil actif.
 * - Utilise une connexion anonyme (justinfan) → aucun token nécessaire.
 * - Compare la commande reçue avec `profile.modules[type].commande` (configurable par l'utilisateur).
 * - Dispatche via `emitIntent({ kind: 'trigger', module })` sur tous les canaux de synchro.
 */
import { useEffect, useRef } from 'react';
import { useConfig } from '../config/ConfigContext';
import { connectTwitchIRC } from '../services/twitchIRC';
import type { ModuleType } from '../types';

export function useTwitchIRC() {
  const { profile, emitIntent } = useConfig();
  const channelRef = useRef('');
  const commandMapRef = useRef<Record<string, ModuleType>>({});

  // Reconstruit la map commande→module à chaque changement de profil.
  // On utilise une ref pour que le callback IRC reste stable (évite reconnexions inutiles).
  useEffect(() => {
    const map: Record<string, ModuleType> = {};
    for (const [type, settings] of Object.entries(profile.modules) as [
      ModuleType,
      { commande: string; actif: boolean },
    ][]) {
      if (settings.commande) {
        map[settings.commande.toLowerCase()] = type;
      }
    }
    commandMapRef.current = map;
    channelRef.current = profile.chaine_twitch ?? '';
  }, [profile]);

  useEffect(() => {
    const channel = profile.chaine_twitch?.trim();
    if (!channel) return;

    const handle = connectTwitchIRC(channel, (command) => {
      const moduleType = commandMapRef.current[command];
      if (moduleType) {
        emitIntent({ kind: 'trigger', module: moduleType });
      }
    });

    return () => handle.disconnect();
    // On ne reconnecte que si la chaîne change — la map commandes est gérée via ref.
  }, [profile.chaine_twitch, emitIntent]);
}
