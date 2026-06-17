/**
 * Gestion des profils — entièrement câblée sur le ConfigProvider (localStorage + sync).
 * Créer, charger, renommer, dupliquer, supprimer, exporter / importer (JSON). Pas de mock.
 */
import { useRef, useState, type CSSProperties } from 'react';
import { Button } from '@shared/components/atoms/Button/Button';
import { useConfig } from '@shared/config/ConfigContext';
import { colors, fonts, radii } from '@shared/theme/tokens';
import { PanelCard } from '../components/PanelCard/PanelCard';
import { Field, TextInput } from '../components/controls/controls';

const rowStyle = (active: boolean): CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 14px',
  borderRadius: radii.md,
  border: `1px solid ${active ? 'rgba(212,168,67,0.5)' : colors.border}`,
  background: active ? 'rgba(201,54,58,0.12)' : colors.bg,
});

const nameStyle: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 15,
  fontWeight: 600,
  color: colors.text,
  flex: 1,
};

const activeTagStyle: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  fontSize: 10,
  fontWeight: 700,
  color: colors.accentBright,
  border: '1px solid rgba(212,168,67,0.5)',
  borderRadius: radii.pill,
  padding: '3px 9px',
};

const errorStyle: CSSProperties = {
  fontSize: 13,
  color: colors.error,
};

const rowActions: CSSProperties = { display: 'flex', gap: 8 };

export function ProfilesView() {
  const {
    profiles,
    activeId,
    profile,
    switchProfile,
    duplicateProfile,
    newProfile,
    deleteProfile,
    exportProfile,
    importProfile,
    updateProfile,
  } = useConfig();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const onImport = async (file: File | undefined) => {
    if (!file) return;
    setImportError(null);
    try {
      await importProfile(file);
    } catch (e) {
      setImportError(e instanceof Error ? e.message : 'Import impossible');
    }
  };

  return (
    <>
      <PanelCard
        title="Profil actif"
        sub="Un profil par perso, serveur ou type de stream"
        suit="carreau"
        action={
          <Button variant="ghost" size="sm" onClick={newProfile}>
            + Nouveau
          </Button>
        }
      >
        <Field label="Nom du profil" htmlFor="profil-nom">
          <TextInput
            id="profil-nom"
            value={profile.nom}
            onChange={(e) =>
              updateProfile((p) => {
                p.nom = e.target.value;
              })
            }
          />
        </Field>

        <div style={rowActions}>
          <Button variant="secondary" size="sm" onClick={duplicateProfile}>
            Dupliquer
          </Button>
          <Button variant="accent" size="sm" onClick={exportProfile}>
            Exporter (JSON)
          </Button>
          <Button variant="ghost" size="sm" onClick={() => fileRef.current?.click()}>
            Importer…
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              void onImport(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
        </div>
        {importError && <span style={errorStyle}>{importError}</span>}
      </PanelCard>

      <PanelCard title="Profils enregistrés" sub={`${profiles.length} enregistré(s)`} suit="pique">
        {profiles.map((p) => {
          const isActive = p.id === activeId;
          return (
            <div key={p.id} style={rowStyle(isActive)}>
              <span style={nameStyle}>{p.nom}</span>
              {isActive ? (
                <span style={activeTagStyle}>Actif</span>
              ) : (
                <Button variant="secondary" size="sm" onClick={() => switchProfile(p.id)}>
                  Charger
                </Button>
              )}
              <Button
                variant="danger"
                size="sm"
                disabled={profiles.length <= 1}
                onClick={() => deleteProfile(p.id)}
              >
                Supprimer
              </Button>
            </div>
          );
        })}
      </PanelCard>
    </>
  );
}
