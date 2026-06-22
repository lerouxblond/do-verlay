/**
 * Configuration du module Fiche perso — câblé sur `profile.perso` (Character). Pensée « ludique » :
 * le sexe est un toggle ♀/♂ posé à côté du nom, et la classe se choisit dans une **grille de
 * médaillons** (ClassPicker) dont les sprites suivent le sexe. Aperçu live (réutilise FicheModule),
 * réglages communs (ModuleSettingsCard) et caractéristiques (serveur, niveau, succès). Aucun mock.
 */
import type { CSSProperties } from 'react';
import { useConfig } from '@shared/config/ConfigContext';
import { SERVERS } from '@shared/constants';
import { colors, lattice, radii } from '@shared/theme/tokens';
import type { Gender } from '@shared/types';
import { FicheModule } from '@overlay/modules/FicheModule/FicheModule';
import { ClassPicker } from '../components/ClassPicker/ClassPicker';
import { ModuleSettingsCard } from '../components/ModuleSettingsCard/ModuleSettingsCard';
import { PanelCard } from '../components/PanelCard/PanelCard';
import { Field, NumberStepper, SelectInput, TextInput } from '../components/controls/controls';

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

const nameRowStyle: CSSProperties = { display: 'flex', gap: 10, alignItems: 'stretch' };

const genderWrapStyle: CSSProperties = {
  display: 'inline-flex',
  flex: 'none',
  border: `1px solid ${colors.border}`,
  borderRadius: radii.md,
  overflow: 'hidden',
  background: colors.bg,
};

const genderBtnStyle = (active: boolean): CSSProperties => ({
  width: 46,
  border: 'none',
  cursor: 'pointer',
  fontSize: 18,
  lineHeight: 1,
  background: active ? 'linear-gradient(180deg,#E2C06A,#D4A843)' : 'transparent',
  color: active ? '#2A1B08' : colors.textFaint,
});

const serverOptions = [
  { value: '', label: '— Choisir un serveur —' },
  ...SERVERS.map((s) => ({ value: s, label: s })),
];

const GENDERS: { value: Gender; glyph: string; label: string }[] = [
  { value: 'female', glyph: '♀', label: 'Féminin' },
  { value: 'male', glyph: '♂', label: 'Masculin' },
];

export function FicheView() {
  const { profile, updateProfile } = useConfig();
  const perso = profile.perso;

  return (
    <>
      <PanelCard title="Aperçu" sub="Rendu réel de la fiche sur l'overlay" suit="pique" collapsible>
        <div style={stageStyle}>
          {profile.modules.fiche.actif ? (
            <FicheModule profile={profile} />
          ) : (
            <p style={emptyStyle}>Activez le module pour l'afficher sur l'overlay.</p>
          )}
        </div>
      </PanelCard>

      <ModuleSettingsCard module="fiche" />

      <PanelCard
        title="Identité"
        sub="Nom, sexe et classe — le visuel suit ces choix"
        suit="pique"
        collapsible
      >
        <Field label="Nom du personnage">
          <div style={nameRowStyle}>
            <div style={{ flex: 1 }}>
              <TextInput
                value={perso.nom}
                placeholder="ex. Bouftou-Royal"
                onChange={(e) => updateProfile((p) => void (p.perso.nom = e.target.value))}
              />
            </div>
            <div style={genderWrapStyle} role="radiogroup" aria-label="Sexe du personnage">
              {GENDERS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  role="radio"
                  aria-checked={perso.genre === g.value}
                  aria-label={g.label}
                  title={g.label}
                  className="dv-gender-btn"
                  style={genderBtnStyle(perso.genre === g.value)}
                  onClick={() => updateProfile((p) => void (p.perso.genre = g.value))}
                >
                  {g.glyph}
                </button>
              ))}
            </div>
          </div>
        </Field>

        <Field label="Classe" hint="Clique sur ta classe — le buste suit le sexe choisi.">
          <ClassPicker
            value={perso.classe}
            gender={perso.genre}
            onChange={(classe) => updateProfile((p) => void (p.perso.classe = classe))}
          />
        </Field>
      </PanelCard>

      <PanelCard
        title="Caractéristiques"
        sub="Serveur, niveau et points de succès"
        suit="carreau"
        collapsible
      >
        <Field label="Serveur">
          <SelectInput
            value={perso.serveur}
            options={serverOptions}
            onChange={(e) => updateProfile((p) => void (p.perso.serveur = e.target.value))}
          />
        </Field>
        <Field label="Niveau" hint="1 à 200 — saisis directement ou ajuste avec − / +.">
          <NumberStepper
            value={perso.niveau}
            min={1}
            max={200}
            onChange={(v) => updateProfile((p) => void (p.perso.niveau = v))}
          />
        </Field>
        <Field label="Points de succès">
          <NumberStepper
            value={perso.pts_succes}
            min={0}
            step={10}
            onChange={(v) => updateProfile((p) => void (p.perso.pts_succes = v))}
          />
        </Field>
      </PanelCard>
    </>
  );
}
