/**
 * Configuration du module Fiche perso — câblé sur `profile.perso` (Character). Aperçu live
 * (réutilise FicheModule), réglages communs (ModuleSettingsCard), identité (nom, classe, genre)
 * et caractéristiques (serveur, niveau, points de succès). Aucune donnée mock.
 */
import type { CSSProperties } from 'react';
import { useConfig } from '@shared/config/ConfigContext';
import { CLASS_LABELS, CLASSES, SERVERS } from '@shared/constants';
import { colors, lattice, radii } from '@shared/theme/tokens';
import type { Gender } from '@shared/types';
import { FicheModule } from '@overlay/modules/FicheModule/FicheModule';
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

const GENDER_LABELS: Record<Gender, string> = { male: 'Masculin', female: 'Féminin' };

const classOptions = [
  { value: '', label: '— Choisir une classe —' },
  ...CLASSES.map((c) => ({ value: c, label: CLASS_LABELS[c] })),
];
const serverOptions = [
  { value: '', label: '— Choisir un serveur —' },
  ...SERVERS.map((s) => ({ value: s, label: s })),
];
const genderOptions = (Object.keys(GENDER_LABELS) as Gender[]).map((g) => ({
  value: g,
  label: GENDER_LABELS[g],
}));

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

      <PanelCard title="Identité" sub="Nom, classe et genre du personnage" suit="pique" collapsible>
        <Field label="Nom du personnage">
          <TextInput
            value={perso.nom}
            placeholder="ex. Bouftou-Royal"
            onChange={(e) => updateProfile((p) => void (p.perso.nom = e.target.value))}
          />
        </Field>
        <Field label="Classe" hint="Détermine le buste et l'icône affichés.">
          <SelectInput
            value={perso.classe}
            options={classOptions}
            onChange={(e) => updateProfile((p) => void (p.perso.classe = e.target.value))}
          />
        </Field>
        <Field label="Genre" hint="Sélectionne l'illustration masculine ou féminine.">
          <SelectInput
            value={perso.genre}
            options={genderOptions}
            onChange={(e) => updateProfile((p) => void (p.perso.genre = e.target.value as Gender))}
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
        <Field label="Niveau" hint="1 à 200.">
          <NumberStepper
            value={perso.niveau}
            min={1}
            max={200}
            onChange={(v) => updateProfile((p) => void (p.perso.niveau = v))}
          />
        </Field>
        <Field label="Points de succès">
          <TextInput
            type="number"
            inputMode="numeric"
            min={0}
            value={perso.pts_succes}
            onChange={(e) =>
              updateProfile((p) => void (p.perso.pts_succes = Math.max(0, Number(e.target.value) || 0)))
            }
          />
        </Field>
      </PanelCard>
    </>
  );
}
