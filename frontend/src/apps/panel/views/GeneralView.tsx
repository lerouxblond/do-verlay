/**
 * Réglages généraux du profil actif — câblés sur les vrais champs du profil
 * (chaine_twitch, limite_modules, rotation). Aucune donnée mock.
 */
import { useConfig } from '@shared/config/ConfigContext';
import { MODULE_LIMIT } from '@shared/constants';
import { PanelCard } from '../components/PanelCard/PanelCard';
import { Field, NumberStepper, TextInput, Toggle } from '../components/controls/controls';

export function GeneralView() {
  const { profile, updateProfile } = useConfig();

  return (
    <>
      <PanelCard title="Chaîne Twitch" sub="Sert à brancher l'overlay sur le chat" suit="pique">
        <Field
          label="Nom de la chaîne"
          htmlFor="chaine-twitch"
          hint="L'overlay écoutera ce chat (lecture seule) pour les commandes type !dofus, !guilde…"
        >
          <TextInput
            id="chaine-twitch"
            placeholder="ex. monpseudo"
            value={profile.chaine_twitch ?? ''}
            onChange={(e) =>
              updateProfile((p) => {
                p.chaine_twitch = e.target.value;
              })
            }
          />
        </Field>
      </PanelCard>

      <PanelCard
        title="Affichage de l'overlay"
        sub="Comportement global des modules à l'écran"
        suit="carreau"
      >
        <Field
          label="Modules visibles en simultané"
          hint="Au-delà de cette limite, les apparitions sont mises en file plutôt que superposées."
        >
          <NumberStepper
            value={profile.limite_modules}
            min={MODULE_LIMIT.min}
            max={MODULE_LIMIT.max}
            suffix="modules"
            onChange={(v) =>
              updateProfile((p) => {
                p.limite_modules = v;
              })
            }
          />
        </Field>

        <Field
          label="Rotation automatique"
          hint="Fait défiler les modules à tour de rôle, en plus des commandes du chat."
        >
          <Toggle
            checked={profile.rotation}
            label={profile.rotation ? 'Activée' : 'Désactivée'}
            onChange={(v) =>
              updateProfile((p) => {
                p.rotation = v;
              })
            }
          />
        </Field>

        <Field
          label="Témoin de connexion"
          hint="Petit badge « Connecté » en bas de l'overlay — utile pour le calage dans OBS, à masquer en live."
        >
          <Toggle
            checked={profile.overlay_hud ?? false}
            label={profile.overlay_hud ? 'Affiché' : 'Masqué'}
            onChange={(v) =>
              updateProfile((p) => {
                p.overlay_hud = v;
              })
            }
          />
        </Field>
      </PanelCard>
    </>
  );
}
