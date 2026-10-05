// Identité et URLs du site : source unique, lue aussi par vite.config.ts au build.
// Fichier exécuté par Node au build : imports relatifs uniquement, aucune API propre à Vite.
//
// Identifiants techniques volontairement NON renommés (les changer casserait des données ou des liens existants) :
// le sous-chemin /data_science_explorer/ (URL publiques, sitemap soumis), le préfixe de cache « ds-explorer- »
// du service worker et les clés de localStorage (progression des visiteurs).

export const SITE_NAME = "Explorons la Data Science";
export const SITE_TAGLINE = "Apprendre la data science en français, pas à pas";
export const SITE_DESCRIPTION =
  "Cours de data science en français : maths, statistiques, Python, machine learning, quiz, glossaire et éditeur de code exécuté dans votre navigateur.";
export const SITE_ORIGIN = "https://hylst.fr";
/** Sous-chemin de déploiement sur hylst.fr (avec slash final). */
export const SITE_BASE = "/data_science_explorer/";
export const SITE_URL = `${SITE_ORIGIN}${SITE_BASE}`;

export const AUTHOR_NAME = "Geoffroy Streit";
/** Mention de paternité commune à tous les sites de la plateforme hylst.fr. */
export const AUTHOR_CREDIT = "Geoffroy Streit avec assistance IA";
export const PLATFORM_URL = `${SITE_ORIGIN}/`;
export const PLATFORM_LEGAL_URL = `${SITE_ORIGIN}/mentions-legales.html`;

/** Date affichée en tête des pages légales : à modifier à chaque changement de leur contenu. */
export const LEGAL_UPDATED = "30 septembre 2026";

/** Licence du code et des contenus rédigés pour le site (même règle que la plateforme hylst.fr). */
export const LICENSE_SPDX = "AGPL-3.0-or-later";
export const LICENSE_NAME = "GNU AGPL v3 ou ultérieure";
/** Copié depuis LICENSE vers le dossier de sortie par vite.config.ts (absent en `npm run dev`). */
export const LICENSE_FILE = "LICENSE.txt";
/** Inventaire des composants tiers embarqués (moteurs Python et SQL), généré par scripts/sync-runtimes.mjs. */
export const NOTICE_FILE = "vendor/NOTICE.txt";
/** Adresse publique du code source (dépôt publié le 5 octobre 2026). Mettre `null` pour ne plus afficher de lien. */
export const SOURCE_URL = "https://github.com/Hylst/explorons_la_science_des_donnees" as string | null;
