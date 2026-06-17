/**
 * Barrel des assets, par commodité. ⚠ Importer ce barrel charge TOUTES les catégories
 * (globs eager). Pour rester léger, importez plutôt la catégorie précise :
 * `@shared/assets/dofus`, `@shared/assets/emblems`, `@shared/assets/classes`, `…/util`.
 */
export * from './dofus';
export * from './classes';
export * from './emblems';
export * from './util';
