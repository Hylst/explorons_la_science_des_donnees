import { asset } from "@/lib/asset";

/**
 * Illustrations SVG animées (public/svg/cards) : les trois cours mis en avant sur l'accueil, et le cours de séries temporelles
 * (tracé des vraies moyennes mensuelles du CO2 de Mauna Loa) et celui de vision par ordinateur (une convolution sur un vrai
 * chiffre manuscrit), faute d'image générée pour eux.
 */
export const ANIMATED_COURSE_IMAGES: Record<string, string> = {
  "python-basics": "svg/cards/python-code.svg",
  "math-intro": "svg/cards/maths-descente.svg",
  "ml-models-guide": "svg/cards/ml-frontiere.svg",
  "time-series": "svg/cards/series-co2.svg",
  "computer-vision": "svg/cards/vision-convolution.svg",
};

/**
 * Illustration d'un cours du catalogue : le SVG animé s'il existe, sinon public/img/courses/<id du cours>.webp
 * (800 x 450, générée en local, voir public/img/CREDITS.md). Un nouveau cours demande donc une nouvelle image.
 */
/** Vrai quand la carte du cours montre une image générée par IA (tous les cours sans SVG animé dessiné pour le site) */
export const isAiCourseImage = (id: string): boolean => !(id in ANIMATED_COURSE_IMAGES);

export const courseImage = (id: string): string => asset(ANIMATED_COURSE_IMAGES[id] ?? `img/courses/${id}.webp`);
