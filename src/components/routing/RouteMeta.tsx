import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { pageMetaFor } from "@/config/page-meta";

/**
 * Titre et description de la page affichée, tirés de src/config/page-meta.ts : même source que les pages HTML
 * générées au build. Les routes dynamiques (article de blog, quiz) n'y figurent pas : elles posent leurs propres balises.
 */
export const RouteMeta = () => {
  const { pathname } = useLocation();
  const meta = pageMetaFor(pathname);
  if (!meta) return null;

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
    </Helmet>
  );
};

export default RouteMeta;
