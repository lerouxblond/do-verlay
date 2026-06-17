import { removeBtnStyle, tagStyle } from './Tag.styles';

export interface TagProps {
  label: string;
  /** Si fourni, affiche une croix de suppression. */
  onRemove?: () => void;
}

/** Étiquette de guilde, optionnellement supprimable. */
export function Tag({ label, onRemove }: TagProps) {
  return (
    <span style={{ ...tagStyle, padding: onRemove ? '3px 5px 3px 9px' : '3px 9px' }}>
      {label}
      {onRemove && (
        <button type="button" style={removeBtnStyle} onClick={onRemove} aria-label={`Retirer ${label}`}>
          ×
        </button>
      )}
    </span>
  );
}
