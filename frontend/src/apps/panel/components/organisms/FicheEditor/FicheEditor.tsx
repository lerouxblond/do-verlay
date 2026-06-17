import type { CSSProperties } from 'react';
import { CLASSES, SERVERS } from '@shared/constants';
import { fonts } from '@shared/theme/tokens';
import type { Character, Gender } from '@shared/types';
import { Field, SelectField } from '../../atoms/Field/Field';
import { FormField } from '../../molecules/FormField/FormField';

export interface FicheEditorProps {
  perso: Character;
  update: (recipe: (c: Character) => void) => void;
}

const box: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 9,
  background: '#1A1219',
  border: '1px solid rgba(212,168,67,0.2)',
  borderRadius: 11,
  padding: 13,
};
const genreBtn = (active: boolean): CSSProperties => ({
  flex: 1,
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  fontWeight: 700,
  fontSize: 11,
  padding: '8px 4px',
  borderRadius: 7,
  cursor: 'pointer',
  border: `1px solid ${active ? '#D4A843' : 'rgba(212,168,67,0.25)'}`,
  color: active ? '#16100E' : '#9A8A84',
  background: active ? 'linear-gradient(180deg,#E8C877,#D4A843)' : 'transparent',
});

const toInt = (v: string, min: number, max: number) => {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
};

/** Formulaire de la fiche personnage : nom, serveur, niveau, points, classe, genre. */
export function FicheEditor({ perso, update }: FicheEditorProps) {
  return (
    <div>
      <div
        style={{
          fontFamily: fonts.label,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          fontSize: 11,
          fontWeight: 800,
          color: '#D4A843',
          marginBottom: 8,
        }}
      >
        ♠ Fiche personnage
      </div>
      <div style={box}>
        <Field
          value={perso.nom}
          onChange={(v) => update((c) => (c.nom = v))}
          placeholder="Nom"
          style={{ gridColumn: '1 / -1' }}
        />
        <FormField label="Serveur">
          <SelectField value={perso.serveur} options={SERVERS} onChange={(v) => update((c) => (c.serveur = v))} />
        </FormField>
        <FormField label="Classe">
          <SelectField value={perso.classe} options={CLASSES} onChange={(v) => update((c) => (c.classe = v))} />
        </FormField>
        <FormField label="Niveau">
          <Field
            type="number"
            value={String(perso.niveau)}
            onChange={(v) => update((c) => (c.niveau = toInt(v, 1, 200)))}
          />
        </FormField>
        <FormField label="Pts succès">
          <Field
            type="number"
            value={String(perso.pts_succes)}
            onChange={(v) => update((c) => (c.pts_succes = toInt(v, 0, 999999)))}
          />
        </FormField>
        <FormField label="Genre" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['male', 'female'] as Gender[]).map((g) => (
              <button key={g} type="button" style={genreBtn(perso.genre === g)} onClick={() => update((c) => (c.genre = g))}>
                {g === 'male' ? 'Masculin' : 'Féminin'}
              </button>
            ))}
          </div>
        </FormField>
      </div>
    </div>
  );
}
