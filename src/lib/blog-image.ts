import { asset } from "@/lib/asset";

/**
 * Illustration d'un article du blog : public/img/blog/<identifiant de l'article>.webp (800 x 450, générée en local avec un
 * modèle d'image, voir public/img/CREDITS.md). Un nouvel article demande donc un nouveau fichier du même nom.
 */
export const blogImage = (id: string): string => asset(`img/blog/${id}.webp`);
