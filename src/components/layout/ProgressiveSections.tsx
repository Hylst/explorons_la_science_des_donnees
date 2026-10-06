import { Children, Suspense, useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { positionKey } from "@/lib/scroll-key";
import { getSavedPosition } from "@/lib/scroll-positions";
import { initialSectionCount } from "@/lib/progressive-sections";

/** Exécute `callback` quand le navigateur est libre (ou peu après, s'il ne sait pas le dire) ; renvoie l'annulation */
const whenIdle = (callback: () => void): (() => void) => {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout: 500 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, 50);
  return () => window.clearTimeout(id);
};

/**
 * Affiche une longue page par morceaux : les premières sections tout de suite, les autres une par une ensuite,
 * pour que le haut de la page s'affiche vite sans un long calcul d'un seul tenant. Tout le contenu finit par
 * être affiché en quelques instants (la recherche dans la page le trouve), et d'emblée au retour sur la page.
 *
 * Les sections peuvent être chargées à la demande (`React.lazy`) : chacune a sa propre attente, marquée
 * `data-sections-pending` comme la réserve de fin, pour que `ScrollManager` attende la page complète
 * avant de restaurer une position ou de viser une ancre.
 */
const ProgressiveSections = ({ children }: { children: ReactNode }) => {
  const sections = Children.toArray(children);
  const total = sections.length;
  const location = useLocation();
  const navigationType = useNavigationType();
  const [count, setCount] = useState(() =>
    initialSectionCount(total, {
      isPop: navigationType === "POP",
      hasSavedPosition: getSavedPosition(positionKey(location)) !== undefined,
      hasHash: location.hash.length > 1,
    })
  );

  // Ancre demandée en cours de lecture (sommaire, lien interne) : la section visée doit exister
  useEffect(() => {
    if (location.hash.length > 1) setCount(total);
  }, [location.hash, total]);

  useEffect(() => {
    if (count >= total) return;
    return whenIdle(() => setCount((c) => Math.min(c + 1, total)));
  }, [count, total]);

  return (
    <>
      {sections.slice(0, count).map((section, i) => (
        <Suspense key={i} fallback={<div data-sections-pending="" aria-hidden="true" />}>
          {section}
        </Suspense>
      ))}
      {/* Réserve de la place pour la suite : le pied de page ne remonte pas puis ne redescend pas */}
      {count < total && <div data-sections-pending="" aria-hidden="true" className="min-h-[50vh]" />}
    </>
  );
};

export default ProgressiveSections;
