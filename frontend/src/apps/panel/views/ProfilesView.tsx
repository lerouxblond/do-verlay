/**
 * Gestion des profils — entièrement câblée sur le ConfigProvider (localStorage + sync).
 * Chaque profil est une carte : nom éditable en place, résumé identitaire (chaîne, modules actifs,
 * Dofus suivis, guilde), et actions par rangée (charger, dupliquer, exporter, supprimer avec
 * confirmation). Création avec focus auto sur le nom, import/export avec retour utilisateur, et
 * filtre quand la liste s'allonge. Pas de mock.
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Button } from '@shared/components/atoms/Button/Button';
import { useConfig } from '@shared/config/ConfigContext';
import { colors, fonts, radii } from '@shared/theme/tokens';
import type { Profile } from '@shared/types';
import { PanelCard } from '../components/PanelCard/PanelCard';
import { TextInput } from '../components/controls/controls';

/** Résumé identitaire d'un profil, pour le distinguer d'un coup d'œil. */
function summarize(p: Profile): string {
  const parts: string[] = [];
  if (p.chaine_twitch) parts.push(`#${p.chaine_twitch}`);
  const mods = Object.values(p.modules).filter((m) => m.actif).length;
  parts.push(`${mods} module${mods > 1 ? 's' : ''} actif${mods > 1 ? 's' : ''}`);
  parts.push(`${p.ordre.length} Dofus suivi${p.ordre.length > 1 ? 's' : ''}`);
  if (p.guild.nom) parts.push(`Guilde ${p.guild.nom}`);
  return parts.join('  ·  ');
}

const listStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 10 };

const cardStyle = (active: boolean): CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 9,
  padding: '13px 14px',
  borderRadius: radii.md,
  border: `1px solid ${active ? colors.accent : colors.border}`,
  background: active ? 'rgba(201,54,58,0.12)' : colors.bg,
  boxShadow: active ? 'inset 0 0 0 1px rgba(212,168,67,0.45)' : 'none',
});

const topRowStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 10 };

const activeTagStyle: CSSProperties = {
  flex: 'none',
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  fontSize: 10,
  fontWeight: 700,
  color: colors.accentBright,
  border: '1px solid rgba(212,168,67,0.5)',
  borderRadius: radii.pill,
  padding: '4px 10px',
};

const metaStyle: CSSProperties = {
  fontFamily: fonts.mono,
  fontSize: 12,
  color: colors.textMuted,
};

const actionsStyle: CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 8 };

const confirmTextStyle: CSSProperties = {
  fontSize: 13,
  color: colors.alert,
  marginRight: 'auto',
  alignSelf: 'center',
};

const noticeStyle = (ok: boolean): CSSProperties => ({
  fontSize: 13,
  fontWeight: 600,
  color: ok ? colors.successText : colors.error,
  background: ok ? 'rgba(76,175,80,0.12)' : 'rgba(229,57,53,0.12)',
  border: `1px solid ${ok ? 'rgba(76,175,80,0.4)' : 'rgba(229,57,53,0.4)'}`,
  borderRadius: radii.md,
  padding: '8px 12px',
  marginBottom: 10,
});

const filterStyle: CSSProperties = { marginBottom: 10 };

export function ProfilesView() {
  const {
    profiles,
    activeId,
    switchProfile,
    duplicateProfile,
    newProfile,
    renameProfile,
    deleteProfile,
    exportProfile,
    importProfile,
    exportFullConfig,
    importFullConfig,
  } = useConfig();

  const fileRef = useRef<HTMLInputElement>(null);
  const fullFileRef = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [justCreated, setJustCreated] = useState(false);

  // Retour utilisateur éphémère (import/export/suppression).
  const flash = (ok: boolean, text: string) => {
    setNotice({ ok, text });
    window.setTimeout(() => setNotice((n) => (n?.text === text ? null : n)), 4000);
  };

  // À la création, le nouveau profil devient actif → on focus son champ nom pour le renommer tout de suite.
  useEffect(() => {
    if (!justCreated) return;
    const el = document.getElementById('profil-nom-active') as HTMLInputElement | null;
    el?.focus();
    el?.select();
    setJustCreated(false);
  }, [justCreated, activeId]);

  const onNew = () => {
    newProfile();
    setJustCreated(true);
  };

  const onImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      const imported = await importProfile(file);
      flash(true, `Profil « ${imported.nom} » importé.`);
    } catch (e) {
      flash(false, e instanceof Error ? e.message : 'Import impossible');
    }
  };

  const onExport = (id: string, nom: string) => {
    exportProfile(id);
    flash(true, `Profil « ${nom} » exporté en JSON.`);
  };

  const onExportFull = () => {
    exportFullConfig();
    flash(true, 'Config complète exportée en JSON.');
  };

  const onImportFull = async (file: File | undefined) => {
    if (!file) return;
    try {
      await importFullConfig(file);
      flash(true, 'Config complète importée.');
    } catch (e) {
      flash(false, e instanceof Error ? e.message : 'Import impossible');
    }
  };

  const onDelete = (p: Profile) => {
    deleteProfile(p.id);
    setConfirmId(null);
    flash(true, `Profil « ${p.nom} » supprimé.`);
  };

  const shown = query.trim()
    ? profiles.filter((p) => p.nom.toLowerCase().includes(query.trim().toLowerCase()))
    : profiles;
  const onlyOne = profiles.length <= 1;

  return (
    <>
    <PanelCard
      title="Sauvegarde complète"
      sub="Profils + dispositions + configs Dofusdex en un seul fichier"
      suit="pique"
    >
      <div style={actionsStyle}>
        <Button variant="accent" size="sm" onClick={onExportFull}>
          Exporter tout
        </Button>
        <Button variant="ghost" size="sm" onClick={() => fullFileRef.current?.click()}>
          Importer tout…
        </Button>
        <input
          ref={fullFileRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => {
            void onImportFull(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </div>
      {notice && (
        <div style={noticeStyle(notice.ok)} role="status">
          {notice.text}
        </div>
      )}
    </PanelCard>

    <PanelCard
      title="Profils"
      sub={`${profiles.length} enregistré${profiles.length > 1 ? 's' : ''} — un par perso, serveur ou type de stream`}
      suit="carreau"
      action={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="ghost" size="sm" onClick={() => fileRef.current?.click()}>
            Importer…
          </Button>
          <Button variant="accent" size="sm" onClick={onNew}>
            + Nouveau
          </Button>
        </div>
      }
    >
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

      {profiles.length > 4 && (
        <div style={filterStyle}>
          <TextInput
            value={query}
            placeholder="Filtrer par nom…"
            aria-label="Filtrer les profils"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      )}

      <div style={listStyle}>
        {shown.map((p) => {
          const isActive = p.id === activeId;
          const confirming = confirmId === p.id;
          return (
            <div key={p.id} style={cardStyle(isActive)} aria-current={isActive ? 'true' : undefined}>
              <div style={topRowStyle}>
                <TextInput
                  id={isActive ? 'profil-nom-active' : undefined}
                  value={p.nom}
                  aria-label={`Nom du profil ${p.nom}`}
                  onChange={(e) => renameProfile(p.id, e.target.value)}
                />
                {isActive ? (
                  <span style={activeTagStyle}>● Actif</span>
                ) : (
                  <Button variant="secondary" size="sm" onClick={() => switchProfile(p.id)}>
                    Charger
                  </Button>
                )}
              </div>

              <span style={metaStyle}>{summarize(p)}</span>

              <div style={actionsStyle}>
                {confirming && <span style={confirmTextStyle}>Supprimer définitivement ?</span>}
                {confirming ? (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => setConfirmId(null)}>
                      Annuler
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => onDelete(p)}>
                      Confirmer
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="secondary" size="sm" onClick={() => duplicateProfile(p.id)}>
                      Dupliquer
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => onExport(p.id, p.nom)}>
                      Exporter
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={onlyOne}
                      title={onlyOne ? 'Au moins un profil doit subsister' : undefined}
                      onClick={() => setConfirmId(p.id)}
                    >
                      Supprimer
                    </Button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {shown.length === 0 && (
          <span style={metaStyle}>Aucun profil ne correspond à « {query} ».</span>
        )}
      </div>
    </PanelCard>
    </>
  );
}
