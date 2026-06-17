/**
 * Types partagés overlay ↔ panel.
 * Dérivés du modèle de données (dossier étape 03) et du scaffold packages/shared.
 */

export type DofusState = 'not_started' | 'on_going' | 'complete';
export type RecruitState = 'open' | 'on_request' | 'closed';
export type ModuleType = 'dofusdex' | 'etendard' | 'fiche' | 'generique';
/** Zones d'ancrage de l'overlay : Haut/Bas × Gauche/Droite + Bas-centre. */
export type AnchorZone = 'HG' | 'HD' | 'BG' | 'BD' | 'BAS';
export type Gender = 'male' | 'female';
export type GenericSize = 'S' | 'M' | 'L';

export type DofusId = string;

/** Référentiel d'un Dofus (id stable + nom + clé d'asset). */
export interface Dofus {
  id: DofusId;
  nom: string;
  /** clé d'asset (= nom de fichier sans extension dans dofus-icons). */
  asset: string;
  couleur?: string;
}

/** Ligne du Dofusdex d'un profil : état + position dans le tri manuel. */
export interface DofusdexLine {
  id_dofus: DofusId;
  etat: DofusState;
  ordre_affichage: number;
}

/** Blason de guilde = paire (fond d'écusson, symbole) de la bibliothèque d'emblèmes. */
export interface GuildEmblem {
  back: number;
  up: number;
}

export interface Guild {
  nom: string;
  emblem: GuildEmblem;
  recrutement: RecruitState;
  niveau_guilde: number;
  tags: string[];
}

export interface Character {
  nom: string;
  serveur: string;
  niveau: number;
  pts_succes: number;
  genre: Gender;
  /** clé d'asset de classe (= nom de fichier sans extension dans class-icons). */
  classe: string;
}

export interface GenericMessage {
  kicker: string;
  contenu: string;
  taille: GenericSize;
  /** clé d'asset utilitaire optionnelle (icône). */
  icone?: string;
}

/** Réglages d'affichage / diffusion d'un module. */
export interface ModuleSettings {
  type: ModuleType;
  zone_ancrage: AnchorZone;
  actif: boolean;
  duree_affichage: number; // ms
  cooldown: number; // ms
  commande: string;
}

/** Profil complet — l'unité sauvegardée / chargée / exportée. */
export interface Profile {
  id: string;
  nom: string;
  chaine_twitch?: string;
  limite_modules: number;
  rotation: boolean;
  modules: Record<ModuleType, ModuleSettings>;
  dofus: Record<DofusId, DofusState>;
  ordre: DofusId[];
  guild: Guild;
  perso: Character;
  generique: GenericMessage;
}

/** Forme du fichier d'export JSON. */
export interface ProfileExport {
  app: 'do-verlay';
  version: 1;
  profile: Profile;
}
