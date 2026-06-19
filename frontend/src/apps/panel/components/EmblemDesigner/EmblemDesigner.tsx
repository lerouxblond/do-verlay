/**
 * Concepteur de blason réutilisable (guilde ET alliance). Compose un `GuildEmblem` :
 * couleurs (fond + symbole), **forme** (fond + contour appariés, rendu composé dans la grille,
 * contour selon `variant`) et **symbole rangé par catégorie** (onglets + grille paginée).
 * Pilote l'aperçu live. N'effectue aucune persistance : remonte les changements via `onChange`.
 */
import { useState } from 'react';
import { Button } from '@shared/components/atoms/Button/Button';
import { EmblemCrest } from '@shared/components/molecules/GuildCrest/GuildCrest';
import {
  contourUrl,
  fondUrl,
  formeIds,
  symboleUrl,
  SYMBOL_CATEGORIES,
  type EmblemVariant,
} from '@shared/assets/emblems';
import type { GuildEmblem } from '@shared/types';
import { ColorInput, Field } from '../controls/controls';
import {
  catChipStyle,
  catRowStyle,
  colorsRow,
  formeContour,
  formeFond,
  formeThumb,
  gridScroll,
  gridStyle,
  previewStage,
  subLabelStyle,
  swatchStyle,
  symbolMaskStyle,
  voirPlusRow,
} from './EmblemDesigner.styles';

const FOND_DEFAUT = '#C9363A';
const SYMBOLE_DEFAUT = '#E8C877';
const SYMBOLES_PAR_PAGE = 60;

export interface EmblemDesignerProps {
  emblem: GuildEmblem;
  /** Jeu de contours à appliquer (guilde / alliance). */
  variant: EmblemVariant;
  /** Mutation du blason (recette appliquée sur l'emblem persisté par l'appelant). */
  onChange: (recipe: (e: GuildEmblem) => void) => void;
}

export function EmblemDesigner({ emblem, variant, onChange }: EmblemDesignerProps) {
  const fond = emblem.fond_couleur ?? FOND_DEFAUT;
  const symbole = emblem.symbole_couleur ?? SYMBOLE_DEFAUT;
  const formes = formeIds();

  const [catIdx, setCatIdx] = useState(0);
  const [symCount, setSymCount] = useState(SYMBOLES_PAR_PAGE);
  const category = SYMBOL_CATEGORIES[catIdx] ?? SYMBOL_CATEGORIES[0];
  const symbolIds = category?.ids ?? [];

  const selectCategory = (idx: number) => {
    setCatIdx(idx);
    setSymCount(SYMBOLES_PAR_PAGE);
  };

  return (
    <>
      <div style={previewStage}>
        <EmblemCrest emblem={emblem} variant={variant} size={112} />
      </div>

      <div style={colorsRow}>
        <Field label="Couleur du fond" hint="Le contour de la forme est conservé.">
          <ColorInput value={fond} onChange={(v) => onChange((e) => void (e.fond_couleur = v))} />
        </Field>
        <Field label="Couleur du symbole">
          <ColorInput
            value={symbole}
            onChange={(v) => onChange((e) => void (e.symbole_couleur = v))}
          />
        </Field>
      </div>

      <div>
        <div style={subLabelStyle}>Forme du fond ({formes.length})</div>
        <div style={gridScroll} className="dv-scroll">
          <div style={gridStyle}>
            {formes.map((id) => {
              const contour = contourUrl(variant, id);
              return (
                <button
                  key={id}
                  type="button"
                  style={swatchStyle(id === emblem.back)}
                  onClick={() => onChange((e) => void (e.back = id))}
                  aria-label={`Forme ${id}`}
                >
                  <div style={formeThumb}>
                    <div style={formeFond(fondUrl(id), fond)} />
                    {contour && <img src={contour} alt="" style={formeContour} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <div style={subLabelStyle}>Symbole</div>
        <div style={catRowStyle}>
          {SYMBOL_CATEGORIES.map((c, i) => (
            <button
              key={c.label}
              type="button"
              style={catChipStyle(i === catIdx)}
              aria-pressed={i === catIdx}
              onClick={() => selectCategory(i)}
            >
              {c.label} ({c.ids.length})
            </button>
          ))}
        </div>
        <div style={gridScroll} className="dv-scroll">
          <div style={gridStyle}>
            {symbolIds.slice(0, symCount).map((id) => (
              <button
                key={id}
                type="button"
                style={swatchStyle(id === emblem.up)}
                onClick={() => onChange((e) => void (e.up = id))}
                aria-label={`Symbole ${id}`}
              >
                <div style={symbolMaskStyle(symboleUrl(id), symbole)} />
              </button>
            ))}
          </div>
        </div>
        {symCount < symbolIds.length && (
          <div style={voirPlusRow}>
            <Button variant="ghost" size="sm" onClick={() => setSymCount((n) => n + SYMBOLES_PAR_PAGE)}>
              Voir plus ({symbolIds.length - symCount})
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
