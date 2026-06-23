/**
 * Tokens du design system « Chapiteau » — source : dossier étape 04 (§09 Tokens).
 * Identité : rouge Zobal + or Ecaflip, motif harlequin, enseignes ♦♥♠♣.
 * Deux intensités : overlay = identité forte (1.0), panel = utilitaire habillé (0.35).
 */

export const colors = {
  bg: '#0D0A0E',
  surface: '#1A1219',
  surfaceAlt: '#221620',
  border: '#3D2B36',
  primary: '#C9363A',
  primaryDark: '#A8272B',
  accent: '#D4A843',
  accentBright: '#E8C877',
  text: '#F0E8E0',
  textMuted: '#9A8A84',
  textFaint: 'rgba(154,138,132,0.55)',
  success: '#4CAF50',
  successText: '#8FE3A0',
  error: '#E53935',
  alert: '#E8881C',
  onPrimary: '#FBEFE9',
  onAccent: '#2A1B08',
  info: '#9CD2FF',
} as const;

// Familles auto-hébergées (cf. theme/fonts.ts) + repli générique si jamais indisponible.
export const fonts = {
  display: "'Cinzel Decorative', serif",
  title: "'Playfair Display Variable', 'Playfair Display', serif",
  label: "'Barlow Semi Condensed', sans-serif",
  body: "'Inter Variable', 'Inter', system-ui, sans-serif",
  mono: "'JetBrains Mono Variable', 'JetBrains Mono', monospace",
} as const;

export const radii = {
  md: '8px',
  lg: '12px',
  card: '16px',
  pill: '999px',
} as const;

/** Enseignes de carte → modules (signature identitaire). */
export type Suit = 'carreau' | 'coeur' | 'pique' | 'trefle';

export const suits: Record<
  Suit,
  { glyph: string; color: string; ring: string; module: string }
> = {
  carreau: { glyph: '♦', color: '#D4A843', ring: 'rgba(212,168,67,0.5)', module: 'Dofusdex' },
  trefle: { glyph: '♣', color: '#4CAF50', ring: 'rgba(76,175,80,0.5)', module: 'Guilde' },
  pique: { glyph: '♠', color: '#9A8A84', ring: 'rgba(154,138,132,0.5)', module: 'Fiche' },
  coeur: { glyph: '♥', color: '#C9363A', ring: 'rgba(201,54,58,0.5)', module: 'Générique' },
};

/** Motif harlequin plein (fond de carte signature). `cell` = taille du losange. */
export const harlequin = (rgba: string, cell = 24) => ({
  backgroundColor: colors.surface,
  backgroundImage: `linear-gradient(45deg, ${rgba} 25%, transparent 25% 50%, ${rgba} 50% 75%, transparent 75%)`,
  backgroundSize: `${cell}px ${cell}px`,
});

/** Treillis harlequin (lignes fines) — fond de page panel. */
export const lattice = (rgba = 'rgba(212,168,67,0.045)', gap = 30) =>
  `repeating-linear-gradient(45deg, ${rgba} 0 1px, transparent 1px ${gap}px), ` +
  `repeating-linear-gradient(-45deg, ${rgba} 0 1px, transparent 1px ${gap}px)`;
