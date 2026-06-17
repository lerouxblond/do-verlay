import type { CSSProperties } from 'react';
import { Avatar, CardShell } from '@shared/components';
import { classCharacter } from '@shared/assets';
import { fonts } from '@shared/theme/tokens';
import type { Character } from '@shared/types';

export interface CharacterSheetModuleProps {
  perso: Character;
}

const statValueStyle: CSSProperties = {
  fontFamily: fonts.mono,
  fontWeight: 600,
  fontSize: 19,
  color: '#E8C877',
  lineHeight: 1,
};
const statLabelStyle: CSSProperties = {
  fontFamily: fonts.label,
  fontSize: 9,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  color: 'rgba(240,232,224,0.5)',
};

const CLASS_LABEL = (c: string) => c.charAt(0).toUpperCase() + c.slice(1);

/** Fiche personnage : médaillon, nom, classe/serveur, stats. */
export function CharacterSheetModule({ perso }: CharacterSheetModuleProps) {
  return (
    <CardShell suit="pique" index={3} width={300} pattern={false}>
      <div style={{ display: 'flex', gap: 13, alignItems: 'center' }}>
        <Avatar src={classCharacter(perso.classe, perso.genre)} size={64} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 17, color: '#F0E8E0', lineHeight: 1 }}>
            {perso.nom}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(240,232,224,0.6)', marginTop: 2 }}>
            {CLASS_LABEL(perso.classe)} · {perso.serveur}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 9 }}>
            <div>
              <div style={statValueStyle}>{perso.niveau}</div>
              <div style={statLabelStyle}>Niveau</div>
            </div>
            <div>
              <div style={statValueStyle}>{perso.pts_succes.toLocaleString('fr-FR')}</div>
              <div style={statLabelStyle}>Pts succès</div>
            </div>
          </div>
        </div>
      </div>
    </CardShell>
  );
}
