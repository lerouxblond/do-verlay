/**
 * Registre des modules overlay implémentés. **Point unique** pour brancher un module au
 * rendu : ajouter une entrée ici (+ une vue de config côté panel + l'activer par défaut).
 * `AVAILABLE_MODULES` est passé au moteur pour qu'il n'orchestre que les modules rendus.
 */
import type { ReactNode } from 'react';
import type { ModuleType, Profile } from '@shared/types';
import { DofusdexModule } from './DofusdexModule/DofusdexModule';
import { EtendardModule } from './EtendardModule/EtendardModule';

export const OVERLAY_MODULES: Partial<Record<ModuleType, (profile: Profile) => ReactNode>> = {
  dofusdex: (profile) => <DofusdexModule profile={profile} />,
  etendard: (profile) => <EtendardModule profile={profile} />,
};

export const AVAILABLE_MODULES = Object.keys(OVERLAY_MODULES) as ModuleType[];
