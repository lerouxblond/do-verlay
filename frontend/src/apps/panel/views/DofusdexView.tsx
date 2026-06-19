/**
 * Configuration complète du module Dofusdex (l'aperçu réutilise le composant overlay
 * DofusdexModule). Câblé sur le profil actif : préfabs, aperçu live, réglages communs du
 * module (via ModuleSettingsCard) + format propre, libellé d'objectif et collection
 * (profile.ordre = Dofus suivis & ordonnés ; profile.dofus[id] = état).
 *
 * La liste des Dofus suivis est défilable et réordonnable au glisser-déposer : les Dofus
 * SLIDENT en direct vers leur nouvelle place (déplacement) avec une animation FLIP.
 */
import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
  type KeyboardEvent,
} from 'react';
import { Button } from '@shared/components/atoms/Button/Button';
import { DofusIcon } from '@shared/components/atoms/DofusIcon/DofusIcon';
import { ProgressBar } from '@shared/components/atoms/ProgressBar/ProgressBar';
import { useConfig } from '@shared/config/ConfigContext';
import { DOFUS_BY_ID, DOFUS_LIST } from '@shared/data/dofus';
import { moveAdjacent } from '@shared/lib/reorder';
import { colors, fonts, lattice, radii } from '@shared/theme/tokens';
import type { DofusState, ModuleLayout } from '@shared/types';
import { DofusdexModule } from '@overlay/modules/DofusdexModule/DofusdexModule';
import { ModuleSettingsCard } from '../components/ModuleSettingsCard/ModuleSettingsCard';
import { PanelCard } from '../components/PanelCard/PanelCard';
import { Field, SelectInput, StateSegment, TextInput } from '../components/controls/controls';
import { DOFUSDEX_PREFABS, type DofusdexPrefab } from './dofusdexPrefabs';

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

const prefabRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
  marginBottom: 4,
};

const prefabLabelStyle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontSize: 11,
  fontWeight: 700,
  color: colors.textMuted,
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
  opacity: dragging ? 0.55 : 1,
  boxShadow: dragging ? '0 10px 24px rgba(0,0,0,0.5)' : 'none',
  position: 'relative',
  zIndex: dragging ? 2 : 1,
  cursor: dragging ? 'grabbing' : 'default',
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

  const suivis = profile.ordre;
  const disponibles = DOFUS_LIST.filter((d) => !suivis.includes(d.id));
  const obtenus = suivis.filter((id) => profile.dofus[id] === 'complete').length;

  const [dragId, setDragId] = useState<string | null>(null);
  const dragIdRef = useRef<string | null>(null);
  dragIdRef.current = dragId;
  const lastOver = useRef<string | null>(null);
  // Ordre de travail LOCAL pendant le glisser : le slide FLIP est piloté par cet état (pas de
  // sync à chaque survol). L'ordre n'est commité au profil qu'UNE fois, au relâchement.
  const [dragOrder, setDragOrder] = useState<string[] | null>(null);
  const dragOrderRef = useRef<string[] | null>(null);
  dragOrderRef.current = dragOrder;
  // Ordre affiché : la copie de travail pendant le glisser, sinon l'ordre persisté.
  const displayOrder = dragOrder ?? suivis;

  // FLIP : anime le glissement des lignes vers leur nouvelle position (sauf celle saisie,
  // suivie par le fantôme natif du drag).
  const rowEls = useRef(new Map<string, HTMLElement>());
  const prevRects = useRef(new Map<string, DOMRect>());
  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    rowEls.current.forEach((el, id) => {
      const next = el.getBoundingClientRect();
      const prev = prevRects.current.get(id);
      prevRects.current.set(id, next);
      if (!prev || id === dragIdRef.current) return;
      const dy = prev.top - next.top;
      if (!dy || reduceMotion) return;
      // FLIP : on inverse instantanément le déplacement (transform GPU only), puis on relâche
      // vers 0 avec la courbe signature → glissement fluide, sans relayout.
      el.style.transition = 'none';
      el.style.transform = `translateY(${dy}px)`;
      el.style.willChange = 'transform';
      requestAnimationFrame(() => {
        el.style.transition = 'transform 200ms cubic-bezier(0.2,0.8,0.25,1)';
        el.style.transform = '';
        const clear = () => {
          el.style.willChange = '';
          el.removeEventListener('transitionend', clear);
        };
        el.addEventListener('transitionend', clear);
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

  const applyPrefab = (pre: DofusdexPrefab) =>
    updateProfile((p) => {
      p.ordre = [...pre.ordre];
      p.dofus = {};
      for (const id of pre.ordre) p.dofus[id] = pre.dofus?.[id] ?? 'not_started';
      if (pre.objectif !== undefined) p.dofusdex_objectif = pre.objectif;
    });

  /** Déplace (slide) le Dofus saisi vers la position de la cible — sur la copie de travail locale. */
  const moveTo = (targetId: string) => {
    const did = dragIdRef.current;
    const base = dragOrderRef.current;
    if (!did || !base) return;
    const next = moveAdjacent(base, did, targetId);
    if (next === base) return; // aucun changement
    dragOrderRef.current = next;
    setDragOrder(next); // déclenche le FLIP, sans toucher au profil
  };

  /** Réordonnancement CLAVIER (poignée focalisée) : remonte/descend le Dofus d'un cran. */
  const nudge = (id: string, dir: -1 | 1) =>
    updateProfile((p) => {
      const i = p.ordre.indexOf(id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= p.ordre.length) return;
      [p.ordre[i], p.ordre[j]] = [p.ordre[j], p.ordre[i]];
    });

  const onGripKey = (id: string) => (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      nudge(id, -1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      nudge(id, 1);
    }
  };

  const onDragStart = (id: string) => (e: DragEvent) => {
    dragIdRef.current = id;
    setDragId(id);
    lastOver.current = id;
    dragOrderRef.current = [...profile.ordre];
    setDragOrder(dragOrderRef.current);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id); // requis par Firefox
    // Fantôme = la LIGNE entière (et pas le seul grip ⠿) → on « tient » vraiment le Dofus.
    const el = rowEls.current.get(id);
    if (el) {
      const r = el.getBoundingClientRect();
      e.dataTransfer.setDragImage(el, e.clientX - r.left, e.clientY - r.top);
    }
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
    // Commit UNIQUE de l'ordre au relâchement (→ une seule sync débouncée, plus de spam au survol).
    const order = dragOrderRef.current;
    if (order) {
      updateProfile((p) => {
        p.ordre = order;
      });
    }
    setDragOrder(null);
    dragOrderRef.current = null;
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

      <ModuleSettingsCard
        module="dofusdex"
        extra={
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
        }
      />

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
        <div style={prefabRow}>
          <span style={prefabLabelStyle}>Préfab :</span>
          {DOFUSDEX_PREFABS.map((pre) => (
            <Button
              key={pre.id}
              variant="secondary"
              size="sm"
              title={pre.description}
              onClick={() => applyPrefab(pre)}
            >
              {pre.nom}
            </Button>
          ))}
        </div>

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
              {displayOrder.map((id) => {
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
                      className="dv-grip"
                      draggable
                      role="button"
                      tabIndex={0}
                      onDragStart={onDragStart(id)}
                      onDragEnd={endDrag}
                      onKeyDown={onGripKey(id)}
                      aria-label={`Déplacer ${dofus.nom} — glisser, ou flèches haut/bas`}
                      title="Glisser, ou flèches haut/bas pour déplacer"
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
