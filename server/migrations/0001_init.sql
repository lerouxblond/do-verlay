-- 0001_init.sql — schéma initial « Chapiteau / Do-verlay »
-- Dérivé du MLD (dossier étape 03 : MCD · MLD · Dictionnaire).
-- Clés primaires en SERIAL ; #clés étrangères explicites. Append-only (ne pas modifier).

BEGIN;

-- ---------- Énumérations ----------
CREATE TYPE dofus_state   AS ENUM ('not_started', 'on_going', 'complete');
CREATE TYPE recruit_state AS ENUM ('open', 'on_request', 'closed');
CREATE TYPE module_type   AS ENUM ('dofusdex', 'etendard', 'fiche', 'generique');
CREATE TYPE anchor_zone   AS ENUM ('HG', 'HD', 'BG', 'BD', 'BAS');
CREATE TYPE generic_size  AS ENUM ('S', 'M', 'L');
CREATE TYPE asset_category AS ENUM ('kamas', 'element', 'classe', 'divers');
CREATE TYPE genre_perso   AS ENUM ('M', 'F');

-- ---------- Référentiels ----------
CREATE TABLE theme (
  id_theme    SERIAL PRIMARY KEY,
  nom         VARCHAR(40) NOT NULL,
  palette_json JSONB NOT NULL DEFAULT '{}',
  typo_json    JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE classe (
  id_classe   SERIAL PRIMARY KEY,
  nom         VARCHAR(30) NOT NULL UNIQUE,
  icone_asset VARCHAR(80) NOT NULL
);

CREATE TABLE serveur (
  id_serveur  SERIAL PRIMARY KEY,
  nom         VARCHAR(30) NOT NULL UNIQUE,
  communaute  VARCHAR(20)
);

CREATE TABLE asset (
  id_asset    SERIAL PRIMARY KEY,
  nom         VARCHAR(60) NOT NULL,
  chemin      VARCHAR(120) NOT NULL,
  categorie   asset_category NOT NULL
);

CREATE TABLE dofus (
  id_dofus    VARCHAR(40) PRIMARY KEY,  -- id stable (ex. 'vulbis')
  nom         VARCHAR(40) NOT NULL,
  asset       VARCHAR(80) NOT NULL,
  couleur     VARCHAR(20)
);

-- ---------- Profil & modules ----------
CREATE TABLE profil (
  id_profil      SERIAL PRIMARY KEY,
  nom            VARCHAR(60) NOT NULL UNIQUE,
  chaine_twitch  VARCHAR(40),
  actif          BOOLEAN NOT NULL DEFAULT FALSE,
  limite_modules INT NOT NULL DEFAULT 2 CHECK (limite_modules BETWEEN 1 AND 4),
  id_theme       INT REFERENCES theme(id_theme) ON DELETE SET NULL
);

CREATE TABLE module (
  id_module           SERIAL PRIMARY KEY,
  type                module_type NOT NULL,
  zone_ancrage        anchor_zone NOT NULL,
  actif               BOOLEAN NOT NULL DEFAULT TRUE,
  ordre               INT NOT NULL DEFAULT 0,
  duree_affichage     INT NOT NULL DEFAULT 12 CHECK (duree_affichage BETWEEN 3 AND 60),
  intervalle_rotation INT NOT NULL DEFAULT 300,
  cooldown            INT NOT NULL DEFAULT 30,
  commande            VARCHAR(20),
  id_profil           INT NOT NULL REFERENCES profil(id_profil) ON DELETE CASCADE
);

-- ---------- Modules spécialisés ----------
CREATE TABLE guilde (
  id_guilde     SERIAL PRIMARY KEY,
  nom           VARCHAR(50) NOT NULL,
  blason_asset  VARCHAR(80) NOT NULL,
  recrutement   recruit_state NOT NULL DEFAULT 'closed',
  niveau_guilde INT NOT NULL CHECK (niveau_guilde BETWEEN 1 AND 200),
  id_module     INT NOT NULL UNIQUE REFERENCES module(id_module) ON DELETE CASCADE
);

CREATE TABLE guilde_tag (
  id_guilde INT NOT NULL REFERENCES guilde(id_guilde) ON DELETE CASCADE,
  libelle   VARCHAR(24) NOT NULL CHECK (length(libelle) > 0),
  ordre     INT NOT NULL CHECK (ordre BETWEEN 0 AND 4),
  PRIMARY KEY (id_guilde, ordre)
);

CREATE TABLE personnage (
  id_perso   SERIAL PRIMARY KEY,
  nom        VARCHAR(30) NOT NULL,
  niveau     INT NOT NULL CHECK (niveau BETWEEN 1 AND 200),
  pts_succes INT NOT NULL DEFAULT 0 CHECK (pts_succes >= 0),
  genre      genre_perso NOT NULL,
  id_classe  INT NOT NULL REFERENCES classe(id_classe),
  id_serveur INT NOT NULL REFERENCES serveur(id_serveur),
  id_module  INT NOT NULL UNIQUE REFERENCES module(id_module) ON DELETE CASCADE
);

-- Association porteuse : progression + tri manuel du Dofusdex, par module.
CREATE TABLE dofusdex_ligne (
  id_module       INT NOT NULL REFERENCES module(id_module) ON DELETE CASCADE,
  id_dofus        VARCHAR(40) NOT NULL REFERENCES dofus(id_dofus),
  etat            dofus_state NOT NULL DEFAULT 'not_started',
  ordre_affichage INT NOT NULL CHECK (ordre_affichage >= 0),
  PRIMARY KEY (id_module, id_dofus),
  UNIQUE (id_module, ordre_affichage)
);

CREATE TABLE message (
  id_message SERIAL PRIMARY KEY,
  contenu    VARCHAR(200) NOT NULL,
  taille     generic_size NOT NULL DEFAULT 'M',
  actif      BOOLEAN NOT NULL DEFAULT TRUE,
  duree      INT NOT NULL DEFAULT 12,
  frequence  INT NOT NULL,
  id_asset   INT REFERENCES asset(id_asset) ON DELETE SET NULL,
  id_module  INT NOT NULL REFERENCES module(id_module) ON DELETE CASCADE
);

CREATE INDEX idx_module_profil ON module(id_profil);
CREATE INDEX idx_dofusdex_module ON dofusdex_ligne(id_module);

COMMIT;
