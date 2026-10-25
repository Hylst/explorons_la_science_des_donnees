import { useMemo } from "react";
import katex from "katex";

/**
 * Formules KaTeX, en remplacement de react-katex (25 octobre 2026) : la bibliothèque imposait sa propre copie de
 * katex 0.16 (alerte npm audit) et n'avait pas de version qui accepte la 0.19. Même rendu qu'elle : une div (formule
 * centrée) ou un span (dans le texte), renderToString avec throwOnError à false (une formule fautive s'affiche en rouge
 * à sa place) et l'option `trust` jamais activée. Le HTML vient de KaTeX, à partir du LaTeX écrit dans le code du site
 * et non par un visiteur : il ne passe pas par sanitizeHtml (exception listée dans src/config/inner-html.test.ts).
 */
const useKatex = (math: string, displayMode: boolean) =>
  useMemo(() => {
    try {
      return { html: katex.renderToString(math, { displayMode, throwOnError: false }) };
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) };
    }
  }, [math, displayMode]);

export const BlockMath = ({ math }: { math: string }) => {
  const { html, error } = useKatex(math, true);
  return html !== undefined ? <div dangerouslySetInnerHTML={{ __html: html }} /> : <div>{error}</div>;
};

export const InlineMath = ({ math }: { math: string }) => {
  const { html, error } = useKatex(math, false);
  return html !== undefined ? <span dangerouslySetInnerHTML={{ __html: html }} /> : <span>{error}</span>;
};
