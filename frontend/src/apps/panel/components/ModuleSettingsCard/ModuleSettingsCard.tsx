/**
 * Carte « Réglages du module » commune à TOUS les modules (actif, affichage permanent,
 * zone d'ancrage, commande, durée, cooldown). Câblée sur `profile.modules[module]`.
 * Chaque module la réutilise ; un module peut injecter des réglages propres via `extra`
 * (ex. le format du Dofusdex). Base à reproduire pour anticiper les modules suivants.
 */
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from '@shared/config/ConfigContext';
import { MODULES } from '@shared/constants';
import { colors } from '@shared/theme/tokens';
import type { ModuleSettings, ModuleType } from '@shared/types';
import { PanelCard } from '../PanelCard/PanelCard';
import { Field, NumberStepper, TextInput, Toggle } from '../controls/controls';

export interface ModuleSettingsCardProps {
  module: ModuleType;
  /** Réglages spécifiques au module, insérés après « Affichage permanent ». */
  extra?: ReactNode;
}

export function ModuleSettingsCard({ module, extra }: ModuleSettingsCardProps) {
  const { profile, updateProfile } = useConfig();
  const mod = profile.modules[module];
  const meta = MODULES[module];
  const set = (recipe: (m: ModuleSettings) => void) =>
    updateProfile((p) => recipe(p.modules[module]));

  return (
    <PanelCard title="Réglages du module" sub="Diffusion sur l'overlay" suit="pique" collapsible>
      <Field label="Module actif" hint="Désactivé, le module ne s'affiche jamais sur l'overlay.">
        <Toggle
          checked={mod.actif}
          label={mod.actif ? 'Activé' : 'Désactivé'}
          onChange={(v) => set((m) => void (m.actif = v))}
        />
      </Field>

      <Field
        label="Affichage permanent"
        hint="Garde le module affiché en continu (hors rotation et expiration)."
      >
        <Toggle
          checked={mod.epingle ?? false}
          label={mod.epingle ? 'Épinglé' : 'Selon rotation / commande'}
          onChange={(v) => set((m) => void (m.epingle = v))}
        />
      </Field>

      {extra}

      <Field
        label="Position sur l'overlay"
        hint="Le placement (position libre + échelle) se règle dans la section Disposition."
      >
        <Link to="/panel/disposition" style={{ color: colors.accentBright, fontWeight: 600 }}>
          Ouvrir l'éditeur de disposition →
        </Link>
      </Field>

      <Field label="Commande chat" hint="Mot-clé que les viewers tapent pour afficher le module.">
        <TextInput
          value={mod.commande}
          placeholder={meta.command}
          onChange={(e) => set((m) => void (m.commande = e.target.value))}
        />
      </Field>

      <Field label="Durée d'affichage" hint="Temps pendant lequel le module reste visible.">
        <NumberStepper
          value={Math.round(mod.duree_affichage / 1000)}
          min={1}
          max={60}
          suffix="secondes"
          onChange={(v) => set((m) => void (m.duree_affichage = v * 1000))}
        />
      </Field>

      <Field label="Cooldown" hint="Délai minimal entre deux déclenchements par commande.">
        <NumberStepper
          value={Math.round(mod.cooldown / 1000)}
          min={0}
          max={120}
          suffix="secondes"
          onChange={(v) => set((m) => void (m.cooldown = v * 1000))}
        />
      </Field>
    </PanelCard>
  );
}
