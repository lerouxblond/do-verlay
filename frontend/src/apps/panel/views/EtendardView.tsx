/**
 * Configuration du module Étendard de guilde. Câblé sur `profile.guild` + `profile.modules.etendard`
 * (via ModuleSettingsCard). Identité (nom, niveau ≤ 20), Blason (forme + couleurs fond/symbole),
 * recrutement (statut + conditions/tags), et aperçu live. Aucune donnée mock.
 */
import { useState, type CSSProperties, type KeyboardEvent } from 'react';
import { Button } from '@shared/components/atoms/Button/Button';
import { Tag } from '@shared/components/atoms/Tag/Tag';
import { EmblemCrest } from '@shared/components/molecules/GuildCrest/GuildCrest';
import { useConfig } from '@shared/config/ConfigContext';
import { MAX_TAGS, RECRUIT_STATES } from '@shared/constants';
import { emblemBack, emblemBackIds, emblemUp, emblemUpIds } from '@shared/assets/emblems';
import { colors, fonts, lattice, radii } from '@shared/theme/tokens';
import type { RecruitState } from '@shared/types';
import { EtendardModule } from '@overlay/modules/EtendardModule/EtendardModule';
import { ModuleSettingsCard } from '../components/ModuleSettingsCard/ModuleSettingsCard';
import { PanelCard } from '../components/PanelCard/PanelCard';
import { ColorInput, Field, NumberStepper, SelectInput, TextInput } from '../components/controls/controls';

const FOND_DEFAUT = '#C9363A';
const SYMBOLE_DEFAUT = '#E8C877';
const SYMBOLES_PAR_PAGE = 60;

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

const previewStage: CSSProperties = { ...stageStyle, padding: '20px' };

const colorsRow: CSSProperties = { display: 'flex', gap: 22, flexWrap: 'wrap' };

const subLabelStyle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontSize: 12,
  fontWeight: 700,
  color: colors.accent,
  marginBottom: 8,
};

const gridScroll: CSSProperties = {
  maxHeight: 210,
  overflowY: 'auto',
  paddingRight: 6,
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))',
  gap: 8,
};

const swatchStyle = (selected: boolean): CSSProperties => ({
  width: '100%',
  aspectRatio: '1',
  padding: 5,
  borderRadius: radii.md,
  border: `1px solid ${selected ? colors.accent : colors.border}`,
  background: selected ? 'rgba(212,168,67,0.16)' : colors.bg,
  cursor: 'pointer',
});

const maskStyle = (url: string, color: string): CSSProperties => ({
  width: '100%',
  height: '100%',
  WebkitMaskImage: `url(${url})`,
  maskImage: `url(${url})`,
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
  backgroundColor: color,
});

const voirPlusRow: CSSProperties = { display: 'flex', justifyContent: 'center', marginTop: 10 };
const tagsRow: CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 };
const addRow: CSSProperties = { display: 'flex', gap: 8 };
const emptyStyle: CSSProperties = { fontSize: 13, color: colors.textMuted, fontStyle: 'italic' };

export function EtendardView() {
  const { profile, updateProfile } = useConfig();
  const guild = profile.guild;
  const fond = guild.emblem.fond_couleur ?? FOND_DEFAUT;
  const symbole = guild.emblem.symbole_couleur ?? SYMBOLE_DEFAUT;

  const [tagInput, setTagInput] = useState('');
  const [symCount, setSymCount] = useState(SYMBOLES_PAR_PAGE);

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    updateProfile((p) => {
      if (p.guild.tags.length < MAX_TAGS && !p.guild.tags.includes(t)) p.guild.tags.push(t);
    });
    setTagInput('');
  };
  const removeTag = (t: string) =>
    updateProfile((p) => {
      p.guild.tags = p.guild.tags.filter((x) => x !== t);
    });
  const onTagKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <>
      <PanelCard
        title="Aperçu"
        sub="Rendu réel du module sur l'overlay, mis à jour en direct"
        suit="trefle"
        collapsible
      >
        <div style={stageStyle}>
          <EtendardModule profile={profile} />
        </div>
      </PanelCard>

      <ModuleSettingsCard module="etendard" />

      <PanelCard title="Identité" sub="Nom et niveau de la guilde" suit="trefle" collapsible>
        <Field label="Nom de la guilde">
          <TextInput
            value={guild.nom}
            placeholder="ex. Les Bateleurs"
            onChange={(e) =>
              updateProfile((p) => {
                p.guild.nom = e.target.value;
              })
            }
          />
        </Field>

        <Field label="Niveau de guilde" hint="Niveau maximum : 20.">
          <NumberStepper
            value={guild.niveau_guilde}
            min={1}
            max={20}
            onChange={(v) =>
              updateProfile((p) => {
                p.guild.niveau_guilde = v;
              })
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
        <div style={previewStage}>
          <EmblemCrest emblem={guild.emblem} size={112} />
        </div>

        <div style={colorsRow}>
          <Field label="Couleur du fond" hint="Le contour de la forme est conservé.">
            <ColorInput
              value={fond}
              onChange={(v) =>
                updateProfile((p) => {
                  p.guild.emblem.fond_couleur = v;
                })
              }
            />
          </Field>
          <Field label="Couleur du symbole">
            <ColorInput
              value={symbole}
              onChange={(v) =>
                updateProfile((p) => {
                  p.guild.emblem.symbole_couleur = v;
                })
              }
            />
          </Field>
        </div>

        <div>
          <div style={subLabelStyle}>Forme du fond ({emblemBackIds.length})</div>
          <div style={gridScroll} className="dv-scroll">
            <div style={gridStyle}>
              {emblemBackIds.map((id) => (
                <button
                  key={id}
                  type="button"
                  style={swatchStyle(id === guild.emblem.back)}
                  onClick={() =>
                    updateProfile((p) => {
                      p.guild.emblem.back = id;
                    })
                  }
                  aria-label={`Fond ${id}`}
                >
                  <div style={maskStyle(emblemBack(id), fond)} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div style={subLabelStyle}>Symbole ({emblemUpIds.length})</div>
          <div style={gridScroll} className="dv-scroll">
            <div style={gridStyle}>
              {emblemUpIds.slice(0, symCount).map((id) => (
                <button
                  key={id}
                  type="button"
                  style={swatchStyle(id === guild.emblem.up)}
                  onClick={() =>
                    updateProfile((p) => {
                      p.guild.emblem.up = id;
                    })
                  }
                  aria-label={`Symbole ${id}`}
                >
                  <div style={maskStyle(emblemUp(id), symbole)} />
                </button>
              ))}
            </div>
          </div>
          {symCount < emblemUpIds.length && (
            <div style={voirPlusRow}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSymCount((n) => n + SYMBOLES_PAR_PAGE)}
              >
                Voir plus ({emblemUpIds.length - symCount})
              </Button>
            </div>
          )}
        </div>
      </PanelCard>

      <PanelCard
        title="Recrutement"
        sub="Statut et conditions affichés sur l'étendard"
        suit="coeur"
        collapsible
      >
        <Field label="Statut">
          <SelectInput
            value={guild.recrutement}
            options={RECRUIT_STATES.map((s) => ({ value: s, label: RECRUIT_LABELS[s] }))}
            onChange={(e) =>
              updateProfile((p) => {
                p.guild.recrutement = e.target.value as RecruitState;
              })
            }
          />
        </Field>

        <Field
          label="Conditions"
          hint={`Étiquettes affichées si le recrutement est ouvert (${guild.tags.length}/${MAX_TAGS}).`}
        >
          <div style={addRow}>
            <TextInput
              value={tagInput}
              placeholder="ex. Niv. 180+"
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={onTagKey}
              disabled={guild.tags.length >= MAX_TAGS}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={addTag}
              disabled={guild.tags.length >= MAX_TAGS || !tagInput.trim()}
            >
              Ajouter
            </Button>
          </div>
          {guild.tags.length === 0 ? (
            <p style={emptyStyle}>Aucune condition.</p>
          ) : (
            <div style={tagsRow}>
              {guild.tags.map((t) => (
                <Tag key={t} label={t} onRemove={() => removeTag(t)} />
              ))}
            </div>
          )}
        </Field>
      </PanelCard>
    </>
  );
}
