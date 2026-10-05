/** Types et styles partagés par les composants d'actualités (flux RSS) */

export interface RSSSource {
  name: string;
  /** Adresse du flux RSS ou Atom */
  url: string;
  /** Page d'accueil du site de la source */
  siteUrl: string;
  description: string;
  language: string;
  category: string;
}

export interface NewsArticle {
  title: string;
  source: string;
  /** Date de publication au format ISO 8601 */
  date: string;
  url: string;
  excerpt: string;
  category: string;
  language: string;
}

/** Classes complètes (jamais construites dynamiquement, sinon Tailwind ne les génère pas) */
export const CATEGORY_BADGE_STYLES: Record<string, string> = {
  "Données publiques": "bg-green-50 text-green-800 border-green-200",
  "Formation": "bg-blue-50 text-blue-800 border-blue-200",
  "Actualités": "bg-purple-50 text-purple-800 border-purple-200",
  "Expertise": "bg-orange-50 text-orange-800 border-orange-200",
  "IA": "bg-violet-50 text-violet-800 border-violet-200",
  "Communauté": "bg-pink-50 text-pink-800 border-pink-200"
};
export const DEFAULT_BADGE_STYLE = "bg-gray-50 text-gray-800 border-gray-200";

export const LANGUAGE_BADGE_STYLES: Record<string, string> = {
  "Français": "bg-blue-50 text-blue-800 border-blue-200",
  "Anglais": "bg-green-50 text-green-800 border-green-200"
};

export const formatArticleDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

/** Comparaison de textes sans casse ni accents, pour la recherche */
export const normalizeText = (text: string) =>
  text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
