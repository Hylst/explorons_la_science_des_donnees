import { Suspense, type ReactNode } from "react";

/**
 * Attente d'un bloc chargé à la demande (`React.lazy`) : la page s'affiche sans lui, puis il arrive.
 * La marque `data-sections-pending` fait attendre `ScrollManager` (restauration de la position au retour,
 * ancres) et le test de fumée jusqu'à son arrivée ; la réserve de hauteur évite que le pied de page remonte.
 */
const LazyBlock = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<div data-sections-pending="" aria-hidden="true" className="min-h-[50vh]" />}>{children}</Suspense>
);

export default LazyBlock;
