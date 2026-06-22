/**
 * Date du « jour » Almanax au format `YYYY-MM-DD`. Le calendrier Almanax suit le fuseau
 * d'Ankama (Europe/Paris) et non le fuseau local du streamer : un overlay ouvert à 1 h du
 * matin à Montréal doit afficher l'almanax de la journée parisienne déjà entamée.
 *
 * `Intl.DateTimeFormat('en-CA', …)` produit nativement `YYYY-MM-DD` ; on le projette dans
 * `Europe/Paris` pour absorber l'heure d'été/hiver sans calcul de décalage manuel.
 */
export const almanaxDateParis = (d = new Date()): string =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
