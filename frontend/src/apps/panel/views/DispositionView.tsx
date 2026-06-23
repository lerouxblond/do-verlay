/**
 * Section « Disposition » — gestion des dispositions (placements des modules) et éditeur visuel.
 * Entièrement câblée sur le ConfigProvider. Les dispositions sont INDÉPENDANTES des profils :
 * on bascule de disposition sans changer de profil (`activeLayoutId` distinct de `activeId`).
 */
import { useRef, useState, type CSSProperties } from 'react';
import { Button } from '@shared/components/atoms/Button/Button';
import { useConfig } from '@shared/config/ConfigContext';
import { colors, fonts, radii } from '@shared/theme/tokens';
import { LayoutEditor } from '../components/LayoutEditor/LayoutEditor';
import { useEditorBackground } from '../components/LayoutEditor/useEditorBackground';
import { PanelCard } from '../components/PanelCard/PanelCard';
import { Field, NumberStepper, TextInput } from '../components/controls/controls';

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

const errorStyle: CSSProperties = { fontSize: 13, color: colors.error };
const rowActions: CSSProperties = { display: 'flex', gap: 8 };

export function DispositionView() {
  const {
    layouts,
    activeLayoutId,
    layout,
    switchLayout,
    newLayout,
    duplicateLayout,
    deleteLayout,
    renameLayout,
    exportLayout,
    importLayout,
  } = useConfig();

  const fileRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [bgError, setBgError] = useState<string | null>(null);
  const [bgOpacity, setBgOpacity] = useState(60);
  const bgFileRef = useRef<HTMLInputElement>(null);
  const background = useEditorBackground(activeLayoutId);

  const onImport = async (file: File | undefined) => {
    if (!file) return;
    setImportError(null);
    try {
      await importLayout(file);
    } catch (e) {
      setImportError(e instanceof Error ? e.message : 'Import impossible');
    }
  };

  const onBackground = async (file: File | undefined) => {
    if (!file) return;
    setBgError(null);
    try {
      await background.setFromFile(file);
    } catch (e) {
      setBgError(e instanceof Error ? e.message : 'Image refusée');
    }
  };

  return (
    <>
      <PanelCard
        title="Disposition active"
        sub="Placements des modules — indépendants du profil"
        suit="pique"
        action={
          <Button variant="ghost" size="sm" onClick={newLayout}>
            + Nouvelle
          </Button>
        }
      >
        <Field
          label="Nom de la disposition"
          htmlFor="layout-nom"
          hint="Ex. « Setup 1080p », « Setup 1440p »… Bascule sans changer de profil."
        >
          <TextInput
            id="layout-nom"
            value={layout.nom}
            onChange={(e) => renameLayout(layout.id, e.target.value)}
          />
        </Field>

        <div style={rowActions}>
          <Button variant="secondary" size="sm" onClick={duplicateLayout}>
            Dupliquer
          </Button>
          <Button variant="accent" size="sm" onClick={exportLayout}>
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

      <PanelCard
        title="Éditeur"
        sub="Glisse-dépose les modules sur l'aperçu"
        suit="carreau"
        action={
          <div style={rowActions}>
            <Button variant="ghost" size="sm" onClick={() => bgFileRef.current?.click()}>
              Fond Dofus…
            </Button>
            {background.src && (
              <Button variant="secondary" size="sm" onClick={background.clear}>
                Retirer le fond
              </Button>
            )}
            <input
              ref={bgFileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                void onBackground(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
          </div>
        }
      >
        {background.src && (
          <Field label="Opacité du fond">
            <NumberStepper
              value={bgOpacity}
              min={10}
              max={100}
              step={10}
              suffix="%"
              onChange={setBgOpacity}
            />
          </Field>
        )}
        {bgError && <span style={errorStyle}>{bgError}</span>}
        <LayoutEditor backgroundSrc={background.src} backgroundOpacity={bgOpacity / 100} />
      </PanelCard>

      <PanelCard
        title="Dispositions enregistrées"
        sub={`${layouts.length} enregistrée(s)`}
        suit="pique"
      >
        {layouts.map((l) => {
          const isActive = l.id === activeLayoutId;
          return (
            <div key={l.id} style={rowStyle(isActive)}>
              <span style={nameStyle}>{l.nom}</span>
              {isActive ? (
                <span style={activeTagStyle}>Active</span>
              ) : (
                <Button variant="secondary" size="sm" onClick={() => switchLayout(l.id)}>
                  Appliquer
                </Button>
              )}
              <Button
                variant="danger"
                size="sm"
                disabled={layouts.length <= 1}
                onClick={() => deleteLayout(l.id)}
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
