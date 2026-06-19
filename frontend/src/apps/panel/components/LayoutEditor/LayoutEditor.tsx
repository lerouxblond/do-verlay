/**
 * Éditeur visuel de disposition : un aperçu 16:9 (= scène overlay 1920×1080) sur lequel on
 * glisse-dépose les modules au pointeur. Positions stockées en % (résolution-indépendant) via
 * `updatePlacement`. Aimantation aux tiers/centre, recalage propre au changement d'ancre, et
 * panneau de réglages (ancre 3×3, échelle, x/y) du module sélectionné. WYSIWYG : rendu des vrais
 * modules. Un mode test force l'affichage permanent sur l'overlay OBS pour le calage.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useConfig } from '@shared/config/ConfigContext';
import { MODULE_ORDER, MODULES } from '@shared/constants';
import { anchorAxes, placementTranslate } from '@shared/config/layout';
import type { AnchorPoint, ModuleType } from '@shared/types';
import { OVERLAY_MODULES } from '@overlay/modules/registry';
import { Field, NumberStepper, SelectInput, Toggle } from '../controls/controls';
import {
  anchorCellStyle,
  anchorDotStyle,
  anchorGridStyle,
  asideStyle,
  asideTitleStyle,
  bgImageStyle,
  canvasColStyle,
  draggableStyle,
  editorGridStyle,
  frameStyle,
  gridStyle,
  guideStyle,
  hintTextStyle,
  moduleHostStyle,
  sceneStyle,
  SCENE_H,
  SCENE_W,
  tagStyle,
} from './LayoutEditor.styles';

/** Ordre des cellules de la grille 3×3, ligne par ligne. */
const ANCHOR_GRID: AnchorPoint[] = ['TL', 'TC', 'TR', 'ML', 'MC', 'MR', 'BL', 'BC', 'BR'];

/** Modules réellement rendus à l'overlay (donc positionnables). */
const EDITABLE_MODULES = MODULE_ORDER.filter((m) => OVERLAY_MODULES[m]);

/** Lignes d'aimantation (tiers + centre), en % de scène. */
const SNAP_GUIDES = [0, 25, 50, 75, 100];
const SNAP_THRESHOLD = 1.2;

const clampPct = (v: number) => Math.max(0, Math.min(100, v));

const snap = (v: number): { value: number; guide: number | null } => {
  for (const g of SNAP_GUIDES) if (Math.abs(v - g) <= SNAP_THRESHOLD) return { value: g, guide: g };
  return { value: v, guide: null };
};

export interface LayoutEditorProps {
  /** Data-URL de l'image de référence en fond (capture Dofus), ou null. */
  backgroundSrc: string | null;
  /** Opacité de l'image de fond (0–1). */
  backgroundOpacity: number;
}

export function LayoutEditor({ backgroundSrc, backgroundOpacity }: LayoutEditorProps) {
  const { profile, layout, updatePlacement, previewAll, setPreviewAll } = useConfig();
  const frameRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const moduleRefs = useRef<Partial<Record<ModuleType, HTMLDivElement | null>>>({});
  const drag = useRef<{ module: ModuleType; grabDx: number; grabDy: number } | null>(null);

  const [scale, setScale] = useState(0);
  const [selected, setSelected] = useState<ModuleType>(EDITABLE_MODULES[0]);

  // Rendu des modules mémoïsé par profil : pendant un glisser (le profil ne change pas), les
  // éléments gardent la même référence → React saute leur réconciliation, seuls les `div` de
  // position bougent. Évite le re-rendu des icônes Dofusdex à chaque frame.
  const renderedModules = useMemo(
    () =>
      Object.fromEntries(EDITABLE_MODULES.map((m) => [m, OVERLAY_MODULES[m]!(profile)])) as Record<
        ModuleType,
        ReactNode
      >,
    [profile],
  );
  const [guides, setGuides] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });

  // Échelle de l'aperçu = largeur réelle du cadre / largeur de la scène.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / SCENE_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cursorPct = useCallback((clientX: number, clientY: number) => {
    const sr = sceneRef.current!.getBoundingClientRect();
    return {
      x: ((clientX - sr.left) / sr.width) * 100,
      y: ((clientY - sr.top) / sr.height) * 100,
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent, module: ModuleType) => {
    e.preventDefault();
    setSelected(module);
    const c = cursorPct(e.clientX, e.clientY);
    const p = layout.placements[module];
    drag.current = { module, grabDx: p.xPct - c.x, grabDy: p.yPct - c.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const ds = drag.current;
    if (!ds) return;
    const c = cursorPct(e.clientX, e.clientY);
    const sx = snap(c.x + ds.grabDx);
    const sy = snap(c.y + ds.grabDy);
    setGuides({ x: sx.guide, y: sy.guide });
    updatePlacement(ds.module, (p) => {
      p.xPct = clampPct(sx.value);
      p.yPct = clampPct(sy.value);
    });
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!drag.current) return;
    drag.current = null;
    setGuides({ x: null, y: null });
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  /**
   * Change l'ancre du module sélectionné SANS le faire sauter : recalcule (x,y) à partir de la
   * boîte visuelle mesurée pour que le module reste exactement à sa place.
   */
  const changeAnchor = (module: ModuleType, anchor: AnchorPoint) => {
    const el = moduleRefs.current[module];
    const scene = sceneRef.current;
    if (!el || !scene) {
      updatePlacement(module, (p) => void (p.anchor = anchor));
      return;
    }
    const er = el.getBoundingClientRect();
    const sr = scene.getBoundingClientRect();
    const kx = SCENE_W / sr.width; // px aperçu → px scène
    const ky = SCENE_H / sr.height;
    const leftPx = (er.left - sr.left) * kx;
    const topPx = (er.top - sr.top) * ky;
    const wPx = er.width * kx;
    const hPx = er.height * ky;
    const { hFrac, vFrac } = anchorAxes(anchor);
    const xPct = ((leftPx + hFrac * wPx) / SCENE_W) * 100;
    const yPct = ((topPx + vFrac * hPx) / SCENE_H) * 100;
    updatePlacement(module, (p) => {
      p.anchor = anchor;
      p.xPct = clampPct(xPct);
      p.yPct = clampPct(yPct);
    });
  };

  const sel = layout.placements[selected];

  return (
    <div style={editorGridStyle}>
      <div style={canvasColStyle}>
        <div ref={frameRef} style={frameStyle}>
          <div ref={sceneRef} style={sceneStyle(scale)}>
            {backgroundSrc && (
              <img src={backgroundSrc} alt="" style={bgImageStyle(backgroundOpacity)} />
            )}
            <div style={gridStyle} />
            {guides.x != null && <div style={guideStyle('x', guides.x)} />}
            {guides.y != null && <div style={guideStyle('y', guides.y)} />}

            {EDITABLE_MODULES.map((m) => {
              const p = layout.placements[m];
              const isSel = m === selected;
              return (
                <div key={m} style={{ position: 'absolute', left: `${p.xPct}%`, top: `${p.yPct}%` }}>
                  <div
                    ref={(el) => {
                      moduleRefs.current[m] = el;
                    }}
                    style={{
                      ...draggableStyle(isSel),
                      transform: `${placementTranslate(p.anchor)} scale(${p.scale})`,
                      transformOrigin: anchorAxes(p.anchor).origin,
                    }}
                    onPointerDown={(e) => onPointerDown(e, m)}
                    onPointerMove={onPointerMove}
                    onPointerUp={endDrag}
                    onPointerCancel={endDrag}
                  >
                    {isSel && <span style={tagStyle}>{MODULES[m].name}</span>}
                    <div style={moduleHostStyle}>{renderedModules[m]}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <p style={hintTextStyle}>
          Glisse un module pour le placer. Aimantation aux tiers et au centre. Charge une capture de
          ton interface Dofus en fond pour caler au pixel près.
        </p>
      </div>

      <aside style={asideStyle}>
        <Field
          label="Mode test (overlay)"
          hint="Affiche tous les modules en continu sur la source OBS, pour le calage. À couper avant de streamer."
        >
          <Toggle
            checked={previewAll}
            label={previewAll ? 'Affichage permanent' : 'Désactivé'}
            onChange={setPreviewAll}
          />
        </Field>

        <Field label="Module à régler">
          <SelectInput
            value={selected}
            options={EDITABLE_MODULES.map((m) => ({ value: m, label: MODULES[m].name }))}
            onChange={(e) => setSelected(e.target.value as ModuleType)}
          />
        </Field>

        <div>
          <div style={asideTitleStyle}>Ancrage</div>
          <div style={anchorGridStyle} role="group" aria-label="Point d'ancrage">
            {ANCHOR_GRID.map((a) => {
              const active = sel.anchor === a;
              return (
                <button
                  key={a}
                  type="button"
                  style={anchorCellStyle(active)}
                  aria-pressed={active}
                  aria-label={a}
                  onClick={() => changeAnchor(selected, a)}
                >
                  <span style={anchorDotStyle(active)} />
                </button>
              );
            })}
          </div>
        </div>

        <Field label="Échelle">
          <NumberStepper
            value={Math.round(sel.scale * 100)}
            min={20}
            max={300}
            step={5}
            suffix="%"
            onChange={(v) => updatePlacement(selected, (p) => void (p.scale = v / 100))}
          />
        </Field>

        <Field label="Position X">
          <NumberStepper
            value={Math.round(sel.xPct)}
            min={0}
            max={100}
            suffix="%"
            onChange={(v) => updatePlacement(selected, (p) => void (p.xPct = v))}
          />
        </Field>

        <Field label="Position Y">
          <NumberStepper
            value={Math.round(sel.yPct)}
            min={0}
            max={100}
            suffix="%"
            onChange={(v) => updatePlacement(selected, (p) => void (p.yPct = v))}
          />
        </Field>
      </aside>
    </div>
  );
}
