import { asset } from "@/lib/asset";

/** Les trois cours mis en avant sur l'accueil ont une illustration SVG animée (public/svg/cards) */
export const ANIMATED_COURSE_IMAGES: Record<string, string> = {
  "python-basics": "svg/cards/python-code.svg",
  "math-intro": "svg/cards/maths-descente.svg",
  "ml-models-guide": "svg/cards/ml-frontiere.svg",
};

/**
 * Illustration d'un cours du catalogue : le SVG animé s'il existe, sinon public/img/courses/<id du cours>.webp
 * (800 x 450, générée en local, voir public/img/CREDITS.md). Un nouveau cours demande donc une nouvelle image.
 */
export const courseImage = (id: string): string => asset(ANIMATED_COURSE_IMAGES[id] ?? `img/courses/${id}.webp`);
