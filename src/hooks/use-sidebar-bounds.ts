import { useEffect } from "react";

/**
 * Bornes de la barre latérale fixe des pages à barre latérale (ContentLayout) : elle commence sous la barre de
 * navigation et s'arrête au-dessus du pied de page quand celui-ci entre à l'écran.
 * Régression du 6 octobre 2026 : la barre allait du haut au bas de la fenêtre, si bien que son titre était caché
 * sous la barre de navigation et qu'en bas de page elle recouvrait 405 px du pied de page.
 * Les valeurs sont posées en variables CSS (--sidebar-top, --sidebar-bottom) sur <html>.
 */
export const sidebarBounds = (navBottom: number, footerTop: number, viewportHeight: number) => ({
  top: Math.max(0, Math.round(navBottom)),
  bottom: Math.max(0, Math.round(viewportHeight - footerTop)),
});

export const useSidebarBounds = () => {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const nav = document.querySelector<HTMLElement>("nav.sticky");
        const footer = document.querySelector<HTMLElement>("footer");
        const { top, bottom } = sidebarBounds(
          nav ? nav.getBoundingClientRect().bottom : 0,
          footer ? footer.getBoundingClientRect().top : window.innerHeight,
          window.innerHeight
        );
        root.style.setProperty("--sidebar-top", `${top}px`);
        root.style.setProperty("--sidebar-bottom", `${bottom}px`);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // le contenu chargé à la demande déplace le pied de page sans défilement
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    observer?.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer?.disconnect();
      root.style.removeProperty("--sidebar-top");
      root.style.removeProperty("--sidebar-bottom");
    };
  }, []);
};
