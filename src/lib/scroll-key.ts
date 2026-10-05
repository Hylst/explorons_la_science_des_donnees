/**
 * Clé d'une position de défilement mémorisée : l'entrée d'historique ET l'adresse.
 * Au chargement complet d'une page, React Router donne toujours la clé « default » ; sans l'adresse,
 * la position de la page chargée précédemment dans l'onglet s'appliquait à la nouvelle page
 * (et masquait son ancre #section). Régression trouvée le 5 octobre 2026.
 */
export const positionKey = (location: { key: string; pathname: string; search: string; hash: string }) =>
  `${location.key}|${location.pathname}${location.search}${location.hash}`;
