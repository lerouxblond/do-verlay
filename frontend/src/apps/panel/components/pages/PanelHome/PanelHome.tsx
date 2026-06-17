import { useRef, useState, type CSSProperties } from 'react';
import {
  CharacterSheetModule,
  DofusdexModule,
  GenericModule,
  GuildBannerModule,
} from '@overlay/components/organisms';
import { OverlayLayout, type OverlaySlot } from '@overlay/components/templates/OverlayLayout/OverlayLayout';
import { classIcon } from '@shared/assets';
import { COMMAND_MAP, DOFUS_STATES, MODULE_ORDER, MODULES } from '@shared/constants';
import { useConfig } from '@shared/config/ConfigContext';
import { DOFUS_LIST } from '@shared/data/seed';
import { useOverlayEngine, type TriggerResult } from '@shared/engine/useOverlayEngine';
import { fonts } from '@shared/theme/tokens';
import type { DofusId, ModuleType } from '@shared/types';
import { ModuleRow } from '../../molecules/ModuleRow/ModuleRow';
import { BroadcastControls, type ChatLine } from '../../organisms/BroadcastControls/BroadcastControls';
import { DofusdexEditor } from '../../organisms/DofusdexEditor/DofusdexEditor';
import { FicheEditor } from '../../organisms/FicheEditor/FicheEditor';
import { GuildEditor } from '../../organisms/GuildEditor/GuildEditor';
import { StagePreview } from '../../organisms/StagePreview/StagePreview';
import { PanelLayout } from '../../templates/PanelLayout/PanelLayout';

const CHAT_FEEDBACK: Record<TriggerResult, (cmd: string) => ChatLine> = {
  shown: (c) => ({ text: `${c} → ✔ affiché`, color: '#4CAF50' }),
  queued: (c) => ({ text: `${c} → ⏳ mis en file`, color: '#E8881C' }),
  already: (c) => ({ text: `${c} → ↻ déjà à l'écran`, color: '#9CD2FF' }),
  cooldown: (c) => ({ text: `⛔ ${c} en cooldown`, color: '#E8881C' }),
};

const sectionPad: CSSProperties = { padding: '18px 20px 0', display: 'flex', flexDirection: 'column', gap: 20 };
const sectionLabel: CSSProperties = {
  fontFamily: fonts.label,
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  fontSize: 11,
  fontWeight: 800,
  color: '#D4A843',
  marginBottom: 8,
};

/** Panel intégré : profil, modules, éditeurs et aperçu live (réf. prototype 06). */
export function PanelHome() {
  const {
    profile,
    profiles,
    activeId,
    updateProfile,
    switchProfile,
    duplicateProfile,
    exportProfile,
    importProfile,
    emitIntent,
  } = useConfig();
  const engine = useOverlayEngine(profile);
  const [chatLog, setChatLog] = useState<ChatLine[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const pushChat = (line: ChatLine) => setChatLog((l) => [line, ...l].slice(0, 4));

  const triggerModule = (type: ModuleType): TriggerResult => {
    const res = engine.trigger(type);
    emitIntent({ kind: 'trigger', module: type });
    return res;
  };
  const togglePin = (type: ModuleType) => {
    engine.togglePin(type);
    emitIntent({ kind: 'pin', module: type });
  };

  const cycleDofus = (id: DofusId) =>
    updateProfile((p) => {
      const cur = p.dofus[id] ?? 'not_started';
      const i = DOFUS_STATES.indexOf(cur);
      p.dofus[id] = DOFUS_STATES[(i + 1) % DOFUS_STATES.length];
    });
  const reorder = (from: number, to: number) =>
    updateProfile((p) => {
      const [it] = p.ordre.splice(from, 1);
      p.ordre.splice(to, 0, it);
    });
  const resetOrder = () => updateProfile((p) => (p.ordre = DOFUS_LIST.map((d) => d.id)));

  const sendChat = (text: string) => {
    const cmd = text.trim().toLowerCase();
    const mod = COMMAND_MAP[cmd];
    if (mod) {
      const res = triggerModule(mod);
      pushChat(CHAT_FEEDBACK[res](cmd));
    } else {
      pushChat({ text: `${cmd} → commande inconnue`, color: '#E8881C' });
    }
  };

  const onImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) importProfile(file).catch(() => pushChat({ text: '⚠ import invalide', color: '#E53935' }));
    e.target.value = '';
  };

  const queueText = engine.queue.length
    ? engine.queue.map((q) => MODULES[q].command).join(' · ')
    : 'vide';
  const visibleText = engine.visibleNames.length
    ? engine.visibleNames.join(' + ')
    : 'rien (overlay transparent)';

  const node = (type: ModuleType) => {
    switch (type) {
      case 'dofusdex':
        return <DofusdexModule ordre={profile.ordre} dofus={profile.dofus} />;
      case 'etendard':
        return <GuildBannerModule guild={profile.guild} />;
      case 'fiche':
        return <CharacterSheetModule perso={profile.perso} />;
      case 'generique':
        return <GenericModule message={profile.generique} />;
    }
  };
  const slots: OverlaySlot[] = MODULE_ORDER.filter((t) => profile.modules[t].actif).map((type) => ({
    key: type,
    zone: profile.modules[type].zone_ancrage,
    visible: engine.isVisible(type),
    node: node(type),
  }));

  const sidebar = (
    <>
      {/* Header */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 5,
          background: '#1A1219',
          borderBottom: '1px solid rgba(212,168,67,0.3)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            background: 'radial-gradient(circle at 50% 35%,#2A1620,#0D0A0E)',
            border: '2px solid #D4A843',
            flex: 'none',
          }}
        >
          <img src={classIcon('zobal')} alt="" style={{ width: 26, height: 26 }} />
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 18, color: '#E8C877', lineHeight: 1 }}>
            Do-verlay
          </div>
          <div style={{ fontFamily: fonts.label, textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: 10, color: 'rgba(240,232,224,0.55)' }}>
            Panel de contrôle
          </div>
        </div>
        <a
          href="/overlay.html"
          target="_blank"
          rel="noreferrer"
          style={{
            fontFamily: fonts.label,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontSize: 11,
            fontWeight: 700,
            color: 'rgba(240,232,224,0.7)',
            border: '1px solid rgba(212,168,67,0.35)',
            padding: '6px 10px',
            borderRadius: 7,
          }}
        >
          Overlay ↗
        </a>
      </div>

      <div style={{ ...sectionPad, paddingBottom: 40 }}>
        {/* Profil */}
        <div>
          <div style={sectionLabel}>Profil actif</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {profiles.map((p) => {
              const active = p.id === activeId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => switchProfile(p.id)}
                  style={{
                    flex: '1 1 auto',
                    fontFamily: fonts.label,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontWeight: 700,
                    fontSize: 12,
                    padding: '9px 6px',
                    borderRadius: 9,
                    cursor: 'pointer',
                    border: `1px solid ${active ? '#D4A843' : 'rgba(212,168,67,0.3)'}`,
                    color: active ? '#16100E' : '#F0E8E0',
                    background: active ? 'linear-gradient(180deg,#E8C877,#D4A843)' : 'rgba(240,232,224,0.04)',
                  }}
                >
                  {p.nom}
                </button>
              );
            })}
            <button type="button" title="Dupliquer le profil" onClick={duplicateProfile} style={iconBtn}>
              ⎘
            </button>
            <button type="button" title="Exporter (JSON)" onClick={exportProfile} style={iconBtn}>
              ⬇
            </button>
            <button type="button" title="Importer (JSON)" onClick={() => fileRef.current?.click()} style={iconBtn}>
              ⬆
            </button>
            <input ref={fileRef} type="file" accept="application/json" hidden onChange={onImport} />
          </div>
        </div>

        {/* Modules */}
        <div>
          <div style={sectionLabel}>Modules</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MODULE_ORDER.map((type) => (
              <ModuleRow
                key={type}
                suit={MODULES[type].suit}
                name={MODULES[type].name}
                sub={MODULES[type].sub}
                command={MODULES[type].command}
                pinned={engine.isPinned(type)}
                visible={engine.isVisible(type)}
                cooldownLeft={engine.cooldownLeft(type)}
                displaySec={profile.modules[type].duree_affichage / 1000}
                cooldownSec={profile.modules[type].cooldown / 1000}
                onTogglePin={() => togglePin(type)}
                onTrigger={() => triggerModule(type)}
              />
            ))}
          </div>
        </div>

        <DofusdexEditor
          ordre={profile.ordre}
          dofus={profile.dofus}
          onCycle={cycleDofus}
          onReorder={reorder}
          onResetOrder={resetOrder}
        />
        <GuildEditor guild={profile.guild} update={(recipe) => updateProfile((p) => recipe(p.guild))} />
        <FicheEditor perso={profile.perso} update={(recipe) => updateProfile((p) => recipe(p.perso))} />
        <BroadcastControls
          rotation={profile.rotation}
          limit={profile.limite_modules}
          queueText={queueText}
          visibleText={visibleText}
          chatLog={chatLog}
          onToggleRotation={() => updateProfile((p) => (p.rotation = !p.rotation))}
          onLimit={(n) => updateProfile((p) => (p.limite_modules = n))}
          onSendChat={sendChat}
        />
      </div>
    </>
  );

  const stage = (
    <StagePreview visibleText={visibleText}>
      <OverlayLayout slots={slots} />
    </StagePreview>
  );

  return <PanelLayout sidebar={sidebar} stage={stage} />;
}

const iconBtn: CSSProperties = {
  flex: 'none',
  width: 40,
  border: '1px dashed rgba(212,168,67,0.5)',
  background: 'transparent',
  color: '#D4A843',
  borderRadius: 9,
  fontSize: 16,
  cursor: 'pointer',
};
