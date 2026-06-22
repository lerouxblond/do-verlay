/**
 * Configuration du module Générique — câblé sur `profile.generique` (GenericMessage). Message
 * libre (surtitre + corps), taille S/M/L et **icône utilitaire** optionnelle choisie dans une
 * petite grille. Aperçu live (réutilise GeneriqueModule) + réglages communs. Aucun mock.
 */
import type { CSSProperties } from 'react';
import { util } from '@shared/assets/util';
import { useConfig } from '@shared/config/ConfigContext';
import { colors, fonts, lattice, radii } from '@shared/theme/tokens';
import type { GenericSize } from '@shared/types';
import { GeneriqueModule } from '@overlay/modules/GeneriqueModule/GeneriqueModule';
import { ModuleSettingsCard } from '../components/ModuleSettingsCard/ModuleSettingsCard';
import { PanelCard } from '../components/PanelCard/PanelCard';
import { Field, SelectInput, TextInput } from '../components/controls/controls';

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

const SIZE_LABELS: Record<GenericSize, string> = { S: 'Petite', M: 'Moyenne', L: 'Grande' };

/** Icônes utilitaires proposées (cf. shared/assets/util) + l'option « aucune ». */
const ICONS: { name: string; label: string }[] = [
  { name: '', label: 'Aucune' },
  { name: 'kamas', label: 'Kamas' },
  { name: 'phoenix', label: 'Phénix' },
  { name: 'gravestone', label: 'Tombe' },
  { name: 'element-feu', label: 'Feu' },
  { name: 'element-eau', label: 'Eau' },
  { name: 'element-terre', label: 'Terre' },
  { name: 'element-air', label: 'Air' },
  { name: 'element-neutre', label: 'Neutre' },
  { name: 'element-sagesse', label: 'Sagesse' },
];

const iconGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
  gap: 8,
};

const iconTileStyle = (selected: boolean): CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 5,
  padding: '9px 6px',
  borderRadius: radii.md,
  border: `1px solid ${selected ? colors.accent : colors.border}`,
  background: selected ? 'rgba(212,168,67,0.14)' : colors.bg,
  boxShadow: selected ? 'inset 0 0 0 1px rgba(212,168,67,0.5)' : 'none',
  cursor: 'pointer',
});

const iconImgStyle: CSSProperties = { width: 30, height: 30, objectFit: 'contain' };
const iconNoneStyle: CSSProperties = {
  width: 30,
  height: 30,
  display: 'grid',
  placeItems: 'center',
  color: colors.textFaint,
  fontSize: 18,
};
const iconLabelStyle = (selected: boolean): CSSProperties => ({
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  fontSize: 9.5,
  fontWeight: 700,
  color: selected ? colors.accentBright : colors.textMuted,
});

export function GeneriqueView() {
  const { profile, updateProfile } = useConfig();
  const g = profile.generique;

  return (
    <>
      <PanelCard title="Aperçu" sub="Rendu réel du message sur l'overlay" suit="coeur" collapsible>
        <div style={stageStyle}>
          {profile.modules.generique.actif ? (
            <GeneriqueModule profile={profile} />
          ) : (
            <p style={emptyStyle}>Activez le module pour l'afficher sur l'overlay.</p>
          )}
        </div>
      </PanelCard>

      <ModuleSettingsCard module="generique" />

      <PanelCard
        title="Message"
        sub="Texte libre — code créateur, annonce, engagement…"
        suit="coeur"
        collapsible
      >
        <Field label="Surtitre" hint="Petit libellé au-dessus du message (optionnel).">
          <TextInput
            value={g.kicker}
            placeholder="ex. Code créateur"
            onChange={(e) => updateProfile((p) => void (p.generique.kicker = e.target.value))}
          />
        </Field>
        <Field label="Message">
          <TextInput
            value={g.contenu}
            placeholder="ex. Soutiens la chaîne avec le code NEYTECK"
            onChange={(e) => updateProfile((p) => void (p.generique.contenu = e.target.value))}
          />
        </Field>
        <Field label="Taille">
          <SelectInput
            value={g.taille}
            options={(Object.keys(SIZE_LABELS) as GenericSize[]).map((s) => ({
              value: s,
              label: SIZE_LABELS[s],
            }))}
            onChange={(e) =>
              updateProfile((p) => void (p.generique.taille = e.target.value as GenericSize))
            }
          />
        </Field>
        <Field label="Icône" hint="Illustration optionnelle à gauche du message.">
          <div style={iconGridStyle} role="radiogroup" aria-label="Icône du message">
            {ICONS.map((ic) => {
              const selected = (g.icone ?? '') === ic.name;
              return (
                <button
                  key={ic.name || 'none'}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className="dv-class-tile"
                  style={iconTileStyle(selected)}
                  title={ic.label}
                  onClick={() =>
                    updateProfile((p) => void (p.generique.icone = ic.name || undefined))
                  }
                >
                  {ic.name ? (
                    <img src={util(ic.name)} alt="" style={iconImgStyle} loading="lazy" decoding="async" />
                  ) : (
                    <span style={iconNoneStyle}>✕</span>
                  )}
                  <span style={iconLabelStyle(selected)}>{ic.label}</span>
                </button>
              );
            })}
          </div>
        </Field>
      </PanelCard>
    </>
  );
}
