/**
 * Configuration du module Almanax — gadget **informatif à données live** (API dofusdude).
 * Il n'y a rien à saisir : les données (bonus, offrande, récompenses) sont automatiques. La vue
 * se limite donc à un aperçu réel (réutilise AlmanaxModule), aux réglages communs
 * (ModuleSettingsCard) et à une note explicative sur la source.
 */
import type { CSSProperties } from 'react';
import { useConfig } from '@shared/config/ConfigContext';
import { colors, lattice, radii } from '@shared/theme/tokens';
import type { ModuleLayout } from '@shared/types';
import { AlmanaxModule } from '@overlay/modules/AlmanaxModule/AlmanaxModule';
import { ModuleSettingsCard } from '../components/ModuleSettingsCard/ModuleSettingsCard';
import { PanelCard } from '../components/PanelCard/PanelCard';
import { Field, SelectInput } from '../components/controls/controls';

const FORMAT_LABELS: Record<ModuleLayout, string> = {
  vertical: 'Vertical (portrait)',
  horizontal: 'Horizontal (bannière)',
};

const stageStyle: CSSProperties = {
  display: 'grid',
  placeItems: 'center',
  padding: '26px 18px',
  borderRadius: radii.lg,
  backgroundColor: colors.bg,
  backgroundImage: lattice(),
  border: `1px solid ${colors.border}`,
  overflowX: 'auto',
};

const emptyStyle: CSSProperties = { fontSize: 13, color: colors.textMuted, fontStyle: 'italic' };

const infoStyle: CSSProperties = {
  fontSize: 13,
  lineHeight: 1.5,
  color: colors.textMuted,
};

export function AlmanaxView() {
  const { profile, updateProfile } = useConfig();

  return (
    <>
      <PanelCard title="Aperçu" sub="Rendu réel de l'almanax sur l'overlay" suit="coeur" collapsible>
        <div style={stageStyle}>
          {profile.modules.almanax.actif ? (
            <AlmanaxModule profile={profile} />
          ) : (
            <p style={emptyStyle}>Activez le module pour l'afficher sur l'overlay.</p>
          )}
        </div>
      </PanelCard>

      <ModuleSettingsCard
        module="almanax"
        extra={
          <Field label="Format d'affichage" hint="Portrait compact ou bannière paysage.">
            <SelectInput
              value={profile.almanax_format ?? 'vertical'}
              options={(Object.keys(FORMAT_LABELS) as ModuleLayout[]).map((f) => ({
                value: f,
                label: FORMAT_LABELS[f],
              }))}
              onChange={(e) =>
                updateProfile((p) => {
                  p.almanax_format = e.target.value as ModuleLayout;
                })
              }
            />
          </Field>
        }
      />

      <PanelCard title="À propos" sub="Données automatiques" suit="coeur" collapsible>
        <p style={infoStyle}>
          L'almanax du jour (bonus, offrande et récompenses) est récupéré automatiquement depuis
          l'API open-source <strong>dofusdude</strong> — rien à configurer. Les récompenses
          affichées (kamas et XP) correspondent au <strong>niveau&nbsp;200</strong>.
        </p>
      </PanelCard>
    </>
  );
}
