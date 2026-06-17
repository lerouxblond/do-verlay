/**
 * Configuration complète du module Dofusdex (l'aperçu réutilise le composant overlay
 * DofusdexModule). Tout est câblé sur le profil actif : aperçu live, réglages du module
 * (profile.modules.dofusdex + dofusdex_format + épinglage), libellé d'objectif et collection
 * (profile.ordre = Dofus suivis & ordonnés ; profile.dofus[id] = état).
 *
 * La liste des Dofus suivis est défilable et réordonnable au glisser-déposer : les Dofus
 * SLIDENT en direct vers leur nouvelle place (déplacement, pas échange) avec une animation FLIP.
 */
import { useLayoutEffect, useRef, useState, type CSSProperties, type DragEvent } from 'react';
import { Button } from '@shared/components/atoms/Button/Button';
import { DofusIcon } from '@shared/components/atoms/DofusIcon/DofusIcon';
import { ProgressBar } from '@shared/components/atoms/ProgressBar/ProgressBar';
import { useConfig } from '@shared/config/ConfigContext';
import { ANCHOR_ZONES, MODULES } from '@shared/constants';
import { DOFUS_BY_ID, DOFUS_LIST } from '@shared/data/dofus';
import { colors, fonts, lattice, radii } from '@shared/theme/tokens';
import type { AnchorZone, DofusState, ModuleLayout } from '@shared/types';
import { DofusdexModule } from '@overlay/modules/DofusdexModule/DofusdexModule';
import { PanelCard } from '../components/PanelCard/PanelCard';
import {
  Field,
  NumberStepper,
  SelectInput,
  StateSegment,
  TextInput,
  Toggle,
} from '../components/controls/controls';

const ZONE_LABELS: Record<AnchorZone, string> = {
  HG: 'Haut · gauche',
  HD: 'Haut · droite',
  BG: 'Bas · gauche',
  BD: 'Bas · droite',
  BAS: 'Bas · centre',
};

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

const scrollStyle: CSSProperties = {
  maxHeight: 380,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  paddingRight: 6,
};

const rowStyle = (dragging: boolean): CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '7px 10px',
  borderRadius: radii.md,
  border: `1px solid ${dragging ? colors.accent : colors.border}`,
  background: dragging ? colors.surfaceAlt : colors.bg,
  opacity: dragging ? 0.6 : 1,
  boxShadow: dragging ? '0 10px 24px rgba(0,0,0,0.5)' : 'none',
  position: 'relative',
  zIndex: dragging ? 2 : 1,
});

const gripStyle: CSSProperties = {
  cursor: 'grab',
  color: colors.textMuted,
  fontSize: 16,
  lineHeight: 1,
  userSelect: 'none',
  padding: '0 2px',
};

const nameStyle: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 14,
  fontWeight: 600,
  color: colors.text,
  flex: 1,
  minWidth: 50,
};

const removeBtnStyle: CSSProperties = {
  width: 26,
  height: 26,
  borderRadius: radii.md,
  border: `1px solid ${colors.border}`,
  background: 'transparent',
  color: colors.textMuted,
  cursor: 'pointer',
  fontSize: 15,
  lineHeight: 1,
};

const progRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  marginBottom: 4,
};

const progLabelStyle: CSSProperties = {
  fontFamily: fonts.mono,
  fontSize: 13,
  fontWeight: 600,
  color: colors.text,
  whiteSpace: 'nowrap',
};

const emptyStyle: CSSProperties = {
  fontSize: 14,
  color: colors.textMuted,
  fontStyle: 'italic',
};

const availGrid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(132px, 1fr))',
  gap: 10,
};

const availBtnStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 9,
  padding: '8px 10px',
  borderRadius: radii.md,
  border: `1px dashed ${colors.border}`,
  background: 'transparent',
  color: colors.text,
  cursor: 'pointer',
  fontFamily: fonts.body,
  fontSize: 13,
  fontWeight: 600,
  textAlign: 'left',
};

export function DofusdexView() {
  const { profile, updateProfile } = useConfig();
  const mod = profile.modules.dofusdex;
  const meta = MODULES.dofusdex;

  const suivis = profile.ordre;
  const disponibles = DOFUS_LIST.filter((d) => !suivis.includes(d.id));
  const obtenus = suivis.filter((id) => profile.dofus[id] === 'complete').length;

  const [dragId, setDragId] = useState<string | null>(null);
  const dragIdRef = useRef<string | null>(null);
  dragIdRef.current = dragId;
  const lastOver = useRef<string | null>(null);

  // FLIP : anime le glissement des lignes vers leur nouvelle position (sauf celle saisie,
  // suivie par le fantôme natif du drag).
  const rowEls = useRef(new Map<string, HTMLElement>());
  const prevRects = useRef(new Map<string, DOMRect>());
  useLayoutEffect(() => {
    rowEls.current.forEach((el, id) => {
      const next = el.getBoundingClientRect();
      const prev = prevRects.current.get(id);
      prevRects.current.set(id, next);
      if (!prev || id === dragIdRef.current) return;
      const dy = prev.top - next.top;
      if (!dy) return;
      el.style.transition = 'none';
      el.style.transform = `translateY(${dy}px)`;
      requestAnimationFrame(() => {
        el.style.transition = 'transform 180ms ease';
        el.style.transform = '';
      });
    });
  });
  const setRowEl = (id: string) => (el: HTMLDivElement | null) => {
    if (el) rowEls.current.set(id, el);
    else {
      rowEls.current.delete(id);
      prevRects.current.delete(id);
    }
  };

  const setState = (id: string, etat: DofusState) =>
    updateProfile((p) => {
      p.dofus[id] = etat;
    });

  const resetStates = () =>
    updateProfile((p) => {
      for (const id of p.ordre) p.dofus[id] = 'not_started';
    });

  const include = (id: string) =>
    updateProfile((p) => {
      if (!p.ordre.includes(id)) p.ordre.push(id);
    });

  const exclude = (id: string) =>
    updateProfile((p) => {
      p.ordre = p.ordre.filter((x) => x !== id);
    });

  /** Déplace (slide) le Dofus saisi vers la position de la cible. */
  const moveTo = (targetId: string) => {
    const did = dragIdRef.current;
    if (!did || did === targetId) return;
    updateProfile((p) => {
      const from = p.ordre.indexOf(did);
      const to = p.ordre.indexOf(targetId);
      if (from < 0 || to < 0 || from === to) return;
      const arr = p.ordre.filter((x) => x !== did);
      const idx = arr.indexOf(targetId);
      arr.splice(from < to ? idx + 1 : idx, 0, did);
      p.ordre = arr;
    });
  };

  const onDragStart = (id: string) => (e: DragEvent) => {
    dragIdRef.current = id;
    setDragId(id);
    lastOver.current = id;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id); // requis par Firefox
  };
  const onDragEnter = (id: string) => () => {
    if (!dragIdRef.current || id === dragIdRef.current || lastOver.current === id) return;
    lastOver.current = id;
    moveTo(id); // réordonne en direct → les lignes slident (FLIP)
  };
  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  const endDrag = () => {
    setDragId(null);
    dragIdRef.current = null;
    lastOver.current = null;
  };

  return (
    <>
      <PanelCard
        title="Aperçu"
        sub="Rendu réel du module sur l'overlay, mis à jour en direct"
        suit="carreau"
        collapsible
      >
        <div style={stageStyle}>
          <DofusdexModule profile={profile} />
        </div>
      </PanelCard>

      <PanelCard title="Réglages du module" sub="Diffusion sur l'overlay" suit="pique" collapsible>
        <Field label="Module actif" hint="Désactivé, le Dofusdex ne s'affiche jamais sur l'overlay.">
          <Toggle
            checked={mod.actif}
            label={mod.actif ? 'Activé' : 'Désactivé'}
            onChange={(v) =>
              updateProfile((p) => {
                p.modules.dofusdex.actif = v;
              })
            }
          />
        </Field>

        <Field
          label="Affichage permanent"
          hint="Garde le module affiché en continu (hors rotation et expiration)."
        >
          <Toggle
            checked={mod.epingle ?? false}
            label={mod.epingle ? 'Épinglé' : 'Selon rotation / commande'}
            onChange={(v) =>
              updateProfile((p) => {
                p.modules.dofusdex.epingle = v;
              })
            }
          />
        </Field>

        <Field label="Format d'affichage" hint="Portrait compact ou bannière paysage.">
          <SelectInput
            value={profile.dofusdex_format ?? 'vertical'}
            options={(Object.keys(FORMAT_LABELS) as ModuleLayout[]).map((f) => ({
              value: f,
              label: FORMAT_LABELS[f],
            }))}
            onChange={(e) =>
              updateProfile((p) => {
                p.dofusdex_format = e.target.value as ModuleLayout;
              })
            }
          />
        </Field>

        <Field label="Zone d'ancrage" hint="Coin de l'écran où le module apparaît.">
          <SelectInput
            value={mod.zone_ancrage}
            options={ANCHOR_ZONES.map((z) => ({ value: z, label: ZONE_LABELS[z] }))}
            onChange={(e) =>
              updateProfile((p) => {
                p.modules.dofusdex.zone_ancrage = e.target.value as AnchorZone;
              })
            }
          />
        </Field>

        <Field label="Commande chat" hint="Mot-clé que les viewers tapent pour afficher le module.">
          <TextInput
            value={mod.commande}
            placeholder={meta.command}
            onChange={(e) =>
              updateProfile((p) => {
                p.modules.dofusdex.commande = e.target.value;
              })
            }
          />
        </Field>

        <Field label="Durée d'affichage" hint="Temps pendant lequel le module reste visible.">
          <NumberStepper
            value={Math.round(mod.duree_affichage / 1000)}
            min={1}
            max={60}
            suffix="secondes"
            onChange={(v) =>
              updateProfile((p) => {
                p.modules.dofusdex.duree_affichage = v * 1000;
              })
            }
          />
        </Field>

        <Field label="Cooldown" hint="Délai minimal entre deux déclenchements par commande.">
          <NumberStepper
            value={Math.round(mod.cooldown / 1000)}
            min={0}
            max={120}
            suffix="secondes"
            onChange={(v) =>
              updateProfile((p) => {
                p.modules.dofusdex.cooldown = v * 1000;
              })
            }
          />
        </Field>
      </PanelCard>

      <PanelCard
        title="Objectif"
        sub="Titre affiché au-dessus de la collection"
        suit="coeur"
        collapsible
      >
        <Field label="Libellé d'objectif (optionnel)">
          <TextInput
            value={profile.dofusdex_objectif ?? ''}
            placeholder="ex. Objectif Dofus Trophées"
            onChange={(e) =>
              updateProfile((p) => {
                p.dofusdex_objectif = e.target.value;
              })
            }
          />
        </Field>
      </PanelCard>

      <PanelCard
        title={`Dofus suivis (${suivis.length})`}
        sub="Glisse ⠿ pour déplacer un Dofus · choisis l'état de chacun"
        suit="trefle"
        collapsible
        action={
          suivis.length > 0 ? (
            <Button variant="ghost" size="sm" onClick={resetStates}>
              Tout remettre à faire
            </Button>
          ) : undefined
        }
      >
        {suivis.length === 0 ? (
          <p style={emptyStyle}>Aucun Dofus suivi. Ajoute-en depuis la liste ci-dessous.</p>
        ) : (
          <>
            <div style={progRowStyle}>
              <ProgressBar value={obtenus} max={suivis.length} style={{ flex: 1 }} />
              <span style={progLabelStyle}>
                {obtenus} / {suivis.length} obtenus
              </span>
            </div>

            <div style={scrollStyle} className="dv-scroll">
              {suivis.map((id) => {
                const dofus = DOFUS_BY_ID[id];
                if (!dofus) return null;
                const state = profile.dofus[id] ?? 'not_started';
                return (
                  <div
                    key={id}
                    ref={setRowEl(id)}
                    style={rowStyle(dragId === id)}
                    onDragEnter={onDragEnter(id)}
                    onDragOver={onDragOver}
                    onDrop={(e) => {
                      e.preventDefault();
                      endDrag();
                    }}
                  >
                    <span
                      style={gripStyle}
                      draggable
                      onDragStart={onDragStart(id)}
                      onDragEnd={endDrag}
                      aria-label="Glisser pour déplacer"
                      title="Glisser pour déplacer"
                    >
                      ⠿
                    </span>
                    <DofusIcon asset={dofus.asset} state={state} size={34} />
                    <span style={nameStyle}>{dofus.nom}</span>
                    <StateSegment value={state} onChange={(s) => setState(id, s)} />
                    <button
                      type="button"
                      style={removeBtnStyle}
                      onClick={() => exclude(id)}
                      aria-label={`Retirer ${dofus.nom}`}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </PanelCard>

      <PanelCard
        title="Ajouter un Dofus"
        sub={`${disponibles.length} disponible(s) dans le référentiel`}
        suit="carreau"
        collapsible
      >
        {disponibles.length === 0 ? (
          <p style={emptyStyle}>Tous les Dofus du référentiel sont déjà suivis.</p>
        ) : (
          <div style={availGrid}>
            {disponibles.map((d) => (
              <button key={d.id} type="button" style={availBtnStyle} onClick={() => include(d.id)}>
                <DofusIcon asset={d.asset} state="not_started" size={30} />
                {d.nom}
              </button>
            ))}
          </div>
        )}
      </PanelCard>
    </>
  );
}
