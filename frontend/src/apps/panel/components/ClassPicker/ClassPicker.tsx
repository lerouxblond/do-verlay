/**
 * Sélecteur visuel de classe : une grille de médaillons (buste de classe via `Avatar`) plutôt
 * qu'une liste déroulante. Le **genre** pilote le sprite affiché (masculin/féminin), si bien que
 * basculer le sexe redessine toute la grille — choix de classe ludique, proche de l'écran de
 * sélection en jeu. Sélection au clic (ou clavier : groupe de boutons radio).
 */
import { classCharacter } from '@shared/assets/classes';
import { Avatar } from '@shared/components/atoms/Avatar/Avatar';
import { CLASS_LABELS, CLASSES } from '@shared/constants';
import { colors } from '@shared/theme/tokens';
import type { Gender } from '@shared/types';
import { gridStyle, tileLabelStyle, tileStyle } from './ClassPicker.styles';

export interface ClassPickerProps {
  /** Clé de classe sélectionnée ('' = aucune). */
  value: string;
  /** Genre courant — détermine le buste affiché dans chaque tuile. */
  gender: Gender;
  onChange: (classe: string) => void;
}

export function ClassPicker({ value, gender, onChange }: ClassPickerProps) {
  return (
    <div style={gridStyle} role="radiogroup" aria-label="Classe du personnage">
      {CLASSES.map((c) => {
        const selected = c === value;
        return (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={selected}
            className="dv-class-tile"
            style={tileStyle(selected)}
            onClick={() => onChange(c)}
            title={CLASS_LABELS[c]}
          >
            <Avatar
              src={classCharacter(c, gender)}
              size={50}
              ring={selected ? colors.accent : colors.border}
              alt={CLASS_LABELS[c]}
            />
            <span style={tileLabelStyle(selected)}>{CLASS_LABELS[c]}</span>
          </button>
        );
      })}
    </div>
  );
}
