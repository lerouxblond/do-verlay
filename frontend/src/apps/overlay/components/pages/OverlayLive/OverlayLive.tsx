import { useEffect, type ReactNode } from 'react';
import { useConfig } from '@shared/config/ConfigContext';
import { MODULE_ORDER } from '@shared/constants';
import { useOverlayEngine } from '@shared/engine/useOverlayEngine';
import type { ModuleType } from '@shared/types';
import {
  CharacterSheetModule,
  DofusdexModule,
  GenericModule,
  GuildBannerModule,
} from '../../organisms';
import { OverlayLayout, type OverlaySlot } from '../../templates/OverlayLayout/OverlayLayout';

/**
 * L'overlay en production : hydrate le profil actif (synchronisé depuis le panel),
 * applique les intentions d'affichage reçues et fait tourner le moteur (rotation auto,
 * timers, file). Source navigateur transparente — l'overlay applique, ne décide pas.
 */
export function OverlayLive() {
  const { profile, subscribeIntent } = useConfig();
  const engine = useOverlayEngine(profile);

  // Applique les intentions d'affichage émises par le panel.
  useEffect(() => {
    return subscribeIntent((intent) => {
      if (intent.kind === 'trigger') engine.trigger(intent.module);
      else engine.togglePin(intent.module);
    });
  }, [subscribeIntent, engine]);

  const node = (type: ModuleType): ReactNode => {
    switch (type) {
      case 'dofusdex':
        return <DofusdexModule ordre={profile.ordre} dofus={profile.dofus} />;
      case 'etendard':
        return <GuildBannerModule guild={profile.guild} />;
      case 'fiche':
        return <CharacterSheetModule perso={profile.perso} />;
      case 'generique':
        return <GenericModule message={profile.generique} />;
    }
  };

  const slots: OverlaySlot[] = MODULE_ORDER.filter((t) => profile.modules[t].actif).map((type) => ({
    key: type,
    zone: profile.modules[type].zone_ancrage,
    visible: engine.isVisible(type),
    node: node(type),
  }));

  return <OverlayLayout slots={slots} />;
}
