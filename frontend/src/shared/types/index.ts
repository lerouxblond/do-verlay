/**
 * Types partagés overlay ↔ panel.
 * Dérivés du modèle de données (dossier étape 03) et du scaffold packages/shared.
 */

export type DofusState = 'not_started' | 'on_going' | 'complete';
export type RecruitState = 'open' | 'on_request' | 'closed';
export type ModuleType = 'dofusdex' | 'etendard' | 'fiche' | 'generique' | 'alliance';
/**
 * Zones d'ancrage héritées (5 coins fixes). **Déprécié** : conservé uniquement pour migrer
 * les anciens profils vers les dispositions libres (cf. `Layout`). Ne plus utiliser au rendu.
 */
export type AnchorZone = 'HG' | 'HD' | 'BG' | 'BD' | 'BAS';
/**
 * Point d'ancrage 3×3 d'un placement libre : `${vertical}${horizontal}` avec
 * vertical ∈ T(op)/M(iddle)/B(ottom) et horizontal ∈ L(eft)/C(enter)/R(ight).
 * Sert d'origine au couple (x,y) ET d'origine de mise à l'échelle (stabilité au resize).
 */
export type AnchorPoint =
  | 'TL'
  | 'TC'
  | 'TR'
  | 'ML'
  | 'MC'
  | 'MR'
  | 'BL'
  | 'BC'
  | 'BR';
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

/** Placement libre d'un module dans une disposition (résolution-indépendant). */
export interface ModulePlacement {
  /** Position du point d'ancrage sur la scène, en % (0–100). */
  xPct: number;
  yPct: number;
  /** Coin du module aligné sur (x,y) + origine du scale. */
  anchor: AnchorPoint;
  /** Échelle du module (1 = taille native). */
  scale: number;
}

/**
 * Disposition nommée = placements de tous les modules. **Indépendante des profils** :
 * un profil porte le contenu, une disposition porte la mise en place. On bascule de
 * disposition sans changer de profil (`activeLayoutId` distinct de `activeId`).
 */
export interface Layout {
  id: string;
  nom: string;
  placements: Record<ModuleType, ModulePlacement>;
}

/**
 * Configuration Dofusdex sauvegardée = instantané de la collection (Dofus suivis + états +
 * libellé d'objectif). **Globale**, indépendante des profils : on enregistre plusieurs configs
 * et on en applique une au profil actif sans changer de profil. Cf. `DofusdexPrefab` (modèles
 * intégrés en dur) pour les préfabs livrés avec l'app.
 */
export interface DofusdexPreset {
  id: string;
  nom: string;
  /** Dofus suivis, dans l'ordre. */
  ordre: DofusId[];
  /** État de chaque Dofus suivi. */
  dofus: Record<DofusId, DofusState>;
  /** Libellé d'objectif appliqué. */
  objectif: string;
}

/** Réglages d'affichage / diffusion d'un module. */
export interface ModuleSettings {
  type: ModuleType;
  /** @deprecated Le positionnement vit désormais dans les dispositions (`Layout`). Lu pour migrer. */
  zone_ancrage?: AnchorZone;
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

/** Forme du fichier d'export JSON d'un profil. */
export interface ProfileExport {
  app: 'do-verlay';
  version: 1;
  profile: Profile;
}

/** Forme du fichier d'export JSON d'une disposition (partage indépendant des profils). */
export interface LayoutExport {
  app: 'do-verlay';
  kind: 'layout';
  version: 1;
  layout: Layout;
}
