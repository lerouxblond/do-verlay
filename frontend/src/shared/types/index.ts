/**
 * Types partagés overlay ↔ panel.
 * Dérivés du modèle de données (dossier étape 03) et du scaffold packages/shared.
 */

export type DofusState = 'not_started' | 'on_going' | 'complete';
export type RecruitState = 'open' | 'on_request' | 'closed';
export type ModuleType = 'dofusdex' | 'etendard' | 'fiche' | 'generique' | 'alliance';
/** Zones d'ancrage de l'overlay : Haut/Bas × Gauche/Droite + Bas-centre. */
export type AnchorZone = 'HG' | 'HD' | 'BG' | 'BD' | 'BAS';
export type Gender = 'male' | 'female';
export type GenericSize = 'S' | 'M' | 'L';
/** Orientation d'affichage d'un module sur l'overlay. */
export type ModuleLayout = 'vertical' | 'horizontal';

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

/** Blason de guilde = forme du fond + symbole + leurs couleurs. */
export interface GuildEmblem {
  back: number;
  up: number;
  /** Couleur de remplissage du fond (le contour de l'asset est conservé). */
  fond_couleur?: string;
  /** Couleur du symbole. */
  symbole_couleur?: string;
}

export interface Guild {
  nom: string;
  emblem: GuildEmblem;
  recrutement: RecruitState;
  niveau_guilde: number;
  tags: string[];
}

/** Alliance — calquée sur la guilde mais avec un acronyme `[ABC]` au lieu d'un niveau. */
export interface Alliance {
  nom: string;
  /** Acronyme affiché entre crochets (ex. « ABC »). */
  acronyme: string;
  emblem: GuildEmblem;
  recrutement: RecruitState;
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
  /** Affichage permanent : le module reste à l'écran (hors rotation/expiration). */
  epingle?: boolean;
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
  /** Libellé d'objectif optionnel du Dofusdex (ex. « Objectif Dofus Trophées »). */
  dofusdex_objectif?: string;
  /** Orientation d'affichage du Dofusdex sur l'overlay (défaut vertical). */
  dofusdex_format?: ModuleLayout;
  /** Affiche le témoin de connexion sur l'overlay (défaut masqué). */
  overlay_hud?: boolean;
  /** État de chaque Dofus (toutes les entrées du référentiel). */
  dofus: Record<DofusId, DofusState>;
  /** Dofus suivis, dans l'ordre d'affichage. L'appartenance à cette liste = « inclus ». */
  ordre: DofusId[];
  guild: Guild;
  alliance: Alliance;
  perso: Character;
  generique: GenericMessage;
}

/** Forme du fichier d'export JSON. */
export interface ProfileExport {
  app: 'do-verlay';
  version: 1;
  profile: Profile;
}
