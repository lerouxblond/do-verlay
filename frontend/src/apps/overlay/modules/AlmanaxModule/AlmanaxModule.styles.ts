import type { CSSProperties } from 'react';
import { colors, fonts } from '@shared/theme/tokens';

/** En-tête : kicker « Almanax » + date du jour. */
export const headerStyle: CSSProperties = {
  paddingLeft: 18,
  paddingTop: 2,
};

export const kickerStyle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  fontSize: 9,
  color: colors.accent,
  fontWeight: 700,
};

export const dateStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 700,
  fontSize: 17,
  color: colors.text,
  lineHeight: 1.1,
  marginTop: 1,
  textTransform: 'capitalize',
};

/* --- Bonus du jour --- */
export const bonusStyle: CSSProperties = {
  paddingLeft: 18,
};

export const bonusTypeStyle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  fontSize: 10,
  color: colors.accentBright,
  fontWeight: 700,
};

export const bonusDescStyle: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 11.5,
  lineHeight: 1.35,
  color: colors.textMuted,
  marginTop: 3,
};

/* --- Offrande : icône + nom + quantité --- */
export const tributeStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '8px 10px',
  borderRadius: 10,
  background: 'rgba(13,10,14,0.55)',
  border: '1px solid rgba(212,168,67,0.28)',
};

export const tributeIconStyle: CSSProperties = {
  width: 36,
  height: 36,
  objectFit: 'contain',
  flex: 'none',
};

export const tributeTextColStyle: CSSProperties = { minWidth: 0, flex: 1 };

export const tributeLabelStyle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontSize: 8,
  fontWeight: 700,
  color: colors.accent,
};

export const tributeNameStyle: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 12.5,
  fontWeight: 600,
  color: colors.text,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

export const tributeQtyStyle: CSSProperties = {
  fontFamily: fonts.mono,
  fontSize: 15,
  fontWeight: 700,
  color: colors.accentBright,
  flex: 'none',
};

/* --- Bandeau récompenses (kamas · XP@200) — repris du motif Fiche --- */
export const rewardBandStyle: CSSProperties = {
  display: 'flex',
  borderRadius: 10,
  background: 'rgba(13,10,14,0.55)',
  border: '1px solid rgba(212,168,67,0.28)',
  overflow: 'hidden',
};

export const rewardCellStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 3,
  padding: '8px 6px',
  minWidth: 0,
};

export const rewardDividerStyle: CSSProperties = {
  width: 1,
  alignSelf: 'stretch',
  background: 'rgba(212,168,67,0.22)',
};

export const rewardLabelStyle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontSize: 8,
  fontWeight: 700,
  color: colors.accent,
};

export const rewardValueStyle: CSSProperties = {
  fontFamily: fonts.mono,
  fontSize: 13,
  fontWeight: 600,
  color: colors.text,
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

/* --- États loading / error --- */
export const stateMsgStyle: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 12,
  color: colors.textMuted,
  fontStyle: 'italic',
  padding: '10px 18px',
};

/* --- Agencement --- */
/** Pile verticale (format portrait) : espace régulier entre les blocs. */
export const vStackStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

/* --- Format horizontal (bannière paysage) : identité+bonus à gauche, butin à droite. --- */
export const rowLayoutStyle: CSSProperties = {
  display: 'flex',
  gap: 16,
  alignItems: 'flex-start',
};

export const leftColStyle: CSSProperties = {
  width: 230,
  flex: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

export const rightColStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};
