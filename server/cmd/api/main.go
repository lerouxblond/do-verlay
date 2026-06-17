// Command api — point d'entrée du backend « Chapiteau / Do-verlay ».
//
// ⚠️  Squelette différé (périmètre « front d'abord »). La logique métier est
// implémentée côté front (état local + localStorage + BroadcastChannel). Ce
// serveur remplacera progressivement cette persistance locale :
//
//	TODO (phases 2-5 du dossier, étape 10) :
//	  1. Charger la config (PORT, DATABASE_URL) depuis l'environnement.
//	  2. Ouvrir le pool PostgreSQL et appliquer migrations/0001_init.sql.
//	  3. Monter les handlers REST : CRUD profil / module / dofusdex / guilde / perso.
//	  4. Canal WebSocket par profil : synchro live panel ↔ overlay
//	     (source de vérité = base ; l'overlay applique, ne décide pas).
//	  5. Service IRC anonyme : lecture du chat Twitch → déclenchement des commandes
//	     (!dofus, !guilde, !perso, !code) avec cooldown.
//
// Découpe stricte : handlers → services → repository → models. Aucun SQL en handler.
package main

import "log"

func main() {
	log.Println("chapiteau api — squelette (implémentation différée, cf. dossier étape 10)")
}
