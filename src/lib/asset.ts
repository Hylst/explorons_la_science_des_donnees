/**
 * URL d'un fichier du dossier public/, correcte quel que soit le sous-chemin de déploiement
 * (ex. https://hylst.fr/data_science_explorer/). Ne pas écrire "/img/x.jpg" en dur.
 */
export const asset = (path: string): string => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
