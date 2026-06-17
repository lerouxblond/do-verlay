import { knobStyle, trackStyle } from './Toggle.styles';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title?: string;
}

/** Interrupteur épingler/masquer un module (vert = actif). */
export function Toggle({ checked, onChange, title }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      title={title}
      onClick={() => onChange(!checked)}
      style={trackStyle(checked)}
    >
      <span style={knobStyle(checked)} />
    </button>
  );
}
