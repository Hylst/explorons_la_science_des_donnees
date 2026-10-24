import type { ImgHTMLAttributes } from "react";

/** Texte de l'étiquette posée sur les images générées par IA (transparence, règlement européen sur l'IA, article 50) */
export const AI_IMAGE_LABEL = "Illustration générée par IA";

/**
 * Étiquette visible, en bas à gauche d'un conteneur `relative` (le coin supérieur droit des cartes reçoit le badge de niveau
 * ou la catégorie). Masquée aux lecteurs d'écran comme l'image décorative qu'elle accompagne.
 */
export const AiImageLabel = () => (
  <span
    aria-hidden="true"
    className="pointer-events-none absolute bottom-2 left-2 rounded bg-black/75 px-1.5 py-0.5 text-[11px] font-medium leading-tight text-white"
  >
    {AI_IMAGE_LABEL}
  </span>
);

interface IllustrationProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "alt"> {
  /** Image produite par un modèle d'image (voir public/img/CREDITS.md) : l'étiquette le dit */
  ai: boolean;
}

/** Illustration décorative d'une carte ou d'un article (texte alternatif vide : le titre voisin dit déjà de quoi il s'agit) */
export const Illustration = ({ ai, ...img }: IllustrationProps) => (
  <div className="relative">
    <img alt="" {...img} />
    {ai && <AiImageLabel />}
  </div>
);
