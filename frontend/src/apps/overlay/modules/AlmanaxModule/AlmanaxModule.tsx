/**
 * Visuel overlay du module Almanax — gadget **informatif à données live** : le contenu (bonus,
 * offrande, récompenses) n'est pas saisi mais récupéré depuis l'API dofusdude (cf. useAlmanax /
 * data/almanax). Seule l'orientation d'affichage vient du profil (`almanax_format`).
 *
 * Deux formats, comme le Dofusdex : `vertical` (portrait, défaut) et `horizontal` (bannière
 * paysage — identité + bonus à gauche, butin à droite). Réutilisé comme aperçu dans le panel.
 */
import { CardShell } from '@shared/components/molecules/CardShell/CardShell';
import type { ModuleLayout, Profile } from '@shared/types';
import { useAlmanax } from './useAlmanax';
import {
  bonusDescStyle,
  bonusStyle,
  bonusTypeStyle,
  dateStyle,
  headerStyle,
  kickerStyle,
  leftColStyle,
  rewardBandStyle,
  rewardCellStyle,
  rewardDividerStyle,
  rewardLabelStyle,
  rewardValueStyle,
  rightColStyle,
  rowLayoutStyle,
  stateMsgStyle,
  tributeIconStyle,
  tributeLabelStyle,
  tributeNameStyle,
  tributeQtyStyle,
  tributeStyle,
  tributeTextColStyle,
  vStackStyle,
} from './AlmanaxModule.styles';

const NUM = new Intl.NumberFormat('fr-FR');
const DATE_FMT = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

/** Formate `YYYY-MM-DD` en date FR lisible sans dépendre du fuseau local (parse en UTC). */
function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return DATE_FMT.format(new Date(Date.UTC(y, m - 1, d)));
}

export interface AlmanaxModuleProps {
  /** Source de l'orientation d'affichage (`almanax_format`). Le contenu, lui, est live. */
  profile?: Profile;
  /** Surcharge le format du profil (sinon `profile.almanax_format`). */
  layout?: ModuleLayout;
  /** Largeur du cadre (px). Défaut selon le format. */
  width?: number;
}

export function AlmanaxModule({ profile, layout, width }: AlmanaxModuleProps) {
  const { data, loading, error } = useAlmanax();

  const fmt: ModuleLayout = layout ?? profile?.almanax_format ?? 'vertical';
  const horizontal = fmt === 'horizontal';
  const w = width ?? (horizontal ? 560 : 320);

  const header = (
    <div style={headerStyle}>
      <span style={kickerStyle}>Almanax</span>
      <div style={dateStyle}>{data ? formatDate(data.date) : 'Du jour'}</div>
    </div>
  );

  const status = loading ? (
    <p style={stateMsgStyle}>Chargement de l'almanax…</p>
  ) : error ? (
    <p style={stateMsgStyle}>Almanax indisponible.</p>
  ) : null;

  const bonus = data && (
    <div style={bonusStyle}>
      <div style={bonusTypeStyle}>{data.bonus.type.name}</div>
      <div style={bonusDescStyle}>{data.bonus.description}</div>
    </div>
  );

  const tribute = data && (
    <div style={tributeStyle}>
      <img
        src={data.tribute.item.image_urls.icon}
        alt=""
        style={tributeIconStyle}
        loading="lazy"
        decoding="async"
      />
      <div style={tributeTextColStyle}>
        <span style={tributeLabelStyle}>Offrande</span>
        <div style={tributeNameStyle}>{data.tribute.item.name}</div>
      </div>
      <span style={tributeQtyStyle}>×{data.tribute.quantity}</span>
    </div>
  );

  const rewards = data && (
    <div style={rewardBandStyle}>
      <div style={rewardCellStyle}>
        <span style={rewardLabelStyle}>Kamas</span>
        <span style={rewardValueStyle}>{NUM.format(data.reward_kamas)}</span>
      </div>
      <div style={rewardDividerStyle} />
      <div style={rewardCellStyle}>
        <span style={rewardLabelStyle}>XP · niv. 200</span>
        <span style={rewardValueStyle}>
          {data.reward_xp != null ? NUM.format(data.reward_xp) : '—'}
        </span>
      </div>
    </div>
  );

  return (
    <CardShell suit="coeur" topStrip={false} width={w}>
      {horizontal ? (
        <div style={rowLayoutStyle}>
          <div style={leftColStyle}>
            {header}
            {status}
            {bonus}
          </div>
          <div style={rightColStyle}>
            {tribute}
            {rewards}
          </div>
        </div>
      ) : (
        <div style={vStackStyle}>
          {header}
          {status}
          {bonus}
          {tribute}
          {rewards}
        </div>
      )}
    </CardShell>
  );
}
