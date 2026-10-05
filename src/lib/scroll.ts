/** Hauteur de la barre de navigation collante, qui masquerait le haut de la section visée */
const STICKY_OFFSET = 80;

/** Fait défiler la page jusqu'à l'élément d'identifiant `sectionId`, sous la barre de navigation */
export const scrollToSection = (sectionId: string) => {
  setTimeout(() => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - STICKY_OFFSET,
        // Défilement instantané si le système demande de réduire les animations
        behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
      });
    }
  }, 100);
};
