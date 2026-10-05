import DOMPurify from "dompurify";

/**
 * Nettoie du HTML avant injection via dangerouslySetInnerHTML.
 * À utiliser pour tout contenu qui n'est pas du JSX écrit dans le code.
 */
export const sanitizeHtml = (html: string): string =>
  DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
