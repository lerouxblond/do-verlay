/**
 * Configuration du module Étendard — gère DEUX entités : la **guilde** (`profile.guild` +
 * `modules.etendard`) et l'**alliance** (`profile.alliance` + `modules.alliance`). Un sélecteur
 * d'onglets bascule entre les deux pour éviter une page trop longue ; seule l'entité active est
 * affichée (aperçu + réglages + identité + blason + recrutement). L'alliance a un acronyme `[ABC]`
 * au lieu d'un niveau.
 */
import { useState, type CSSProperties, type KeyboardEvent } from 'react';
import { Button } from '@shared/components/atoms/Button/Button';
import { Tag } from '@shared/components/atoms/Tag/Tag';
import { useConfig } from '@shared/config/ConfigContext';
import { MAX_TAGS, RECRUIT_STATES } from '@shared/constants';
import { colors, fonts, lattice, radii } from '@shared/theme/tokens';
import type { RecruitState } from '@shared/types';
import { EtendardModule } from '@overlay/modules/EtendardModule/EtendardModule';
import { AllianceModule } from '@overlay/modules/AllianceModule/AllianceModule';
import { EmblemDesigner } from '../components/EmblemDesigner/EmblemDesigner';
import { ModuleSettingsCard } from '../components/ModuleSettingsCard/ModuleSettingsCard';
import { PanelCard } from '../components/PanelCard/PanelCard';
import { Field, NumberStepper, SelectInput, TextInput } from '../components/controls/controls';

type EntityTab = 'guild' | 'alliance';

const RECRUIT_LABELS: Record<RecruitState, string> = {
  open: 'Ouvert',
  on_request: 'Sur demande',
  closed: 'Fermé',
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

const tabBarStyle: CSSProperties = {
  display: 'flex',
  border: `1px solid ${colors.border}`,
  borderRadius: radii.md,
  overflow: 'hidden',
  background: colors.bg,
};

const tabBtnStyle = (active: boolean): CSSProperties => ({
  flex: 1,
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  fontSize: 13,
  fontWeight: 700,
  padding: '12px 10px',
  border: 'none',
  cursor: 'pointer',
  background: active ? 'rgba(212,168,67,0.18)' : 'transparent',
  color: active ? colors.accent : colors.textFaint,
  boxShadow: active ? `inset 0 -2px 0 ${colors.accent}` : 'none',
});

const addRow: CSSProperties = { display: 'flex', gap: 8 };
const tagsRow: CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 };
const emptyStyle: CSSProperties = { fontSize: 13, color: colors.textMuted, fontStyle: 'italic' };

interface RecruitmentFieldsProps {
  recrutement: RecruitState;
  tags: string[];
  onStatus: (s: RecruitState) => void;
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
}

/** Statut de recrutement + éditeur de conditions (tags). Partagé guilde / alliance. */
function RecruitmentFields({ recrutement, tags, onStatus, onAdd, onRemove }: RecruitmentFieldsProps) {
  const [tagInput, setTagInput] = useState('');
  const submit = () => {
    const t = tagInput.trim();
    if (!t) return;
    onAdd(t);
    setTagInput('');
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  };
  const full = tags.length >= MAX_TAGS;

  return (
    <>
      <Field label="Statut">
        <SelectInput
          value={recrutement}
          options={RECRUIT_STATES.map((s) => ({ value: s, label: RECRUIT_LABELS[s] }))}
          onChange={(e) => onStatus(e.target.value as RecruitState)}
        />
      </Field>

      <Field
        label="Conditions"
        hint={`Étiquettes affichées si le recrutement est ouvert (${tags.length}/${MAX_TAGS}).`}
      >
        <div style={addRow}>
          <TextInput
            value={tagInput}
            placeholder="ex. Niv. 180+"
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={onKey}
            disabled={full}
          />
          <Button variant="ghost" size="sm" onClick={submit} disabled={full || !tagInput.trim()}>
            Ajouter
          </Button>
        </div>
        {tags.length === 0 ? (
          <p style={emptyStyle}>Aucune condition.</p>
        ) : (
          <div style={tagsRow}>
            {tags.map((t) => (
              <Tag key={t} label={t} onRemove={() => onRemove(t)} />
            ))}
          </div>
        )}
      </Field>
    </>
  );
}

/** Onglet Guilde : aperçu + réglages + identité (nom, niveau) + blason + recrutement. */
function GuildPanels() {
  const { profile, updateProfile } = useConfig();
  const guild = profile.guild;

  return (
    <>
      <PanelCard title="Aperçu" sub="Rendu réel de la carte guilde sur l'overlay" suit="trefle" collapsible>
        <div style={stageStyle}>
          {profile.modules.etendard.actif ? (
            <EtendardModule profile={profile} />
          ) : (
            <p style={emptyStyle}>Activez la guilde pour l'afficher sur l'overlay.</p>
          )}
        </div>
      </PanelCard>

      <ModuleSettingsCard module="etendard" />

      <PanelCard title="Identité" sub="Nom et niveau de la guilde" suit="trefle" collapsible>
        <Field label="Nom de la guilde">
          <TextInput
            value={guild.nom}
            placeholder="ex. Les Bateleurs"
            onChange={(e) => updateProfile((p) => void (p.guild.nom = e.target.value))}
          />
        </Field>
        <Field label="Niveau de guilde" hint="Niveau maximum : 20.">
          <NumberStepper
            value={guild.niveau_guilde}
            min={1}
            max={20}
            onChange={(v) => updateProfile((p) => void (p.guild.niveau_guilde = v))}
          />
        </Field>
      </PanelCard>

      <PanelCard
        title="Blason"
        sub="Compose l'écusson : forme du fond, symbole et couleurs"
        suit="carreau"
        collapsible
      >
        <EmblemDesigner
          emblem={guild.emblem}
          variant="guild"
          onChange={(recipe) => updateProfile((p) => recipe(p.guild.emblem))}
        />
      </PanelCard>

      <PanelCard
        title="Recrutement"
        sub="Statut et conditions affichés sur l'étendard"
        suit="coeur"
        collapsible
      >
        <RecruitmentFields
          recrutement={guild.recrutement}
          tags={guild.tags}
          onStatus={(s) => updateProfile((p) => void (p.guild.recrutement = s))}
          onAdd={(t) =>
            updateProfile((p) => {
              if (p.guild.tags.length < MAX_TAGS && !p.guild.tags.includes(t)) p.guild.tags.push(t);
            })
          }
          onRemove={(t) =>
            updateProfile((p) => void (p.guild.tags = p.guild.tags.filter((x) => x !== t)))
          }
        />
      </PanelCard>
    </>
  );
}

/** Onglet Alliance : aperçu + réglages + identité (nom, acronyme) + blason + recrutement. */
function AlliancePanels() {
  const { profile, updateProfile } = useConfig();
  const alliance = profile.alliance;

  return (
    <>
      <PanelCard
        title="Aperçu"
        sub="Rendu réel de la carte alliance sur l'overlay"
        suit="trefle"
        collapsible
      >
        <div style={stageStyle}>
          {profile.modules.alliance.actif ? (
            <AllianceModule profile={profile} />
          ) : (
            <p style={emptyStyle}>Activez l'alliance pour l'afficher sur l'overlay.</p>
          )}
        </div>
      </PanelCard>

      <ModuleSettingsCard module="alliance" />

      <PanelCard title="Identité" sub="Nom et acronyme de l'alliance" suit="trefle" collapsible>
        <Field label="Nom de l'alliance">
          <TextInput
            value={alliance.nom}
            placeholder="ex. La Confrérie"
            onChange={(e) => updateProfile((p) => void (p.alliance.nom = e.target.value))}
          />
        </Field>
        <Field label="Acronyme" hint="Affiché entre crochets sur la carte. 5 caractères max.">
          <TextInput
            value={alliance.acronyme}
            placeholder="ex. CFR"
            maxLength={5}
            onChange={(e) =>
              updateProfile((p) => void (p.alliance.acronyme = e.target.value.toUpperCase()))
            }
          />
        </Field>
      </PanelCard>

      <PanelCard
        title="Blason"
        sub="Compose l'écusson : forme du fond, symbole et couleurs"
        suit="carreau"
        collapsible
      >
        <EmblemDesigner
          emblem={alliance.emblem}
          variant="alliance"
          onChange={(recipe) => updateProfile((p) => recipe(p.alliance.emblem))}
        />
      </PanelCard>

      <PanelCard
        title="Recrutement"
        sub="Statut et conditions affichés sur la carte"
        suit="coeur"
        collapsible
      >
        <RecruitmentFields
          recrutement={alliance.recrutement}
          tags={alliance.tags}
          onStatus={(s) => updateProfile((p) => void (p.alliance.recrutement = s))}
          onAdd={(t) =>
            updateProfile((p) => {
              if (p.alliance.tags.length < MAX_TAGS && !p.alliance.tags.includes(t))
                p.alliance.tags.push(t);
            })
          }
          onRemove={(t) =>
            updateProfile((p) => void (p.alliance.tags = p.alliance.tags.filter((x) => x !== t)))
          }
        />
      </PanelCard>
    </>
  );
}

export function EtendardView() {
  const [tab, setTab] = useState<EntityTab>('guild');

  return (
    <>
      <div style={tabBarStyle} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'guild'}
          style={tabBtnStyle(tab === 'guild')}
          onClick={() => setTab('guild')}
        >
          Guilde
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'alliance'}
          style={tabBtnStyle(tab === 'alliance')}
          onClick={() => setTab('alliance')}
        >
          Alliance
        </button>
      </div>

      {tab === 'guild' ? <GuildPanels /> : <AlliancePanels />}
    </>
  );
}
