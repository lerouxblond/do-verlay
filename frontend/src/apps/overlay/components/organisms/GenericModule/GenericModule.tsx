import { CardShell } from '@shared/components';
import { util } from '@shared/assets';
import { fonts } from '@shared/theme/tokens';
import type { GenericMessage, GenericSize } from '@shared/types';

export interface GenericModuleProps {
  message: GenericMessage;
}

const WIDTH: Record<GenericSize, number> = { S: 340, M: 440, L: 540 };

/** Module générique paramétrable : contenu, taille, icône (engagement / monétisation). */
export function GenericModule({ message }: GenericModuleProps) {
  const icon = message.icone ? util(message.icone) : '';
  return (
    <CardShell suit="coeur" index={4} width={WIDTH[message.taille]}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
        {icon && <img src={icon} alt="" style={{ width: 38, height: 38 }} />}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: fonts.label,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontSize: 11,
              color: '#F2A6A4',
              fontWeight: 700,
            }}
          >
            {message.kicker}
          </div>
          <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 22, color: '#E8C877', lineHeight: 1.05 }}>
            {message.contenu}
          </div>
        </div>
        <span style={{ fontSize: 26 }}>🎪</span>
      </div>
    </CardShell>
  );
}
