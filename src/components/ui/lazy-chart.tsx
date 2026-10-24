import { lazy, Suspense, useEffect, useRef, useState, type ComponentType } from "react";

/** Marge autour de l'écran : le graphique est chargé un peu avant d'apparaître (comme DeferredResponsiveContainer) */
const MARGE = "400px 0px";

type Taille = number | string;
const taille = (v: Taille) => (typeof v === "number" ? `${v}px` : v);

interface Props {
  /** Module du graphique : son export par défaut dessine un ResponsiveContainer de 100 % × 100 % */
  load: () => Promise<{ default: ComponentType }>;
  width?: Taille;
  height?: Taille;
}

/**
 * Graphique chargé à l'approche de l'écran, module compris. `DeferredResponsiveContainer` diffère le dessin, mais le
 * composant qui l'emploie importe Recharts et le fait télécharger et évaluer avant d'apparaître (1,2 s de travail mesuré
 * sur /fundamentals, le 6 octobre 2026). Ici, Recharts n'arrive qu'avec le module du graphique. La boîte a toujours
 * la taille du graphique : la page ne bouge pas. Sans IntersectionObserver (tests), chargement immédiat.
 */
export const LazyChart = ({ load, width = "100%", height = "100%" }: Props) => {
  const boite = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === "undefined");
  const [Graphique] = useState(() => lazy(load));

  useEffect(() => {
    if (visible || !boite.current) return;
    const observateur = new IntersectionObserver(
      (entrees) => {
        if (entrees.some((e) => e.isIntersecting)) {
          setVisible(true);
          observateur.disconnect();
        }
      },
      { rootMargin: MARGE }
    );
    observateur.observe(boite.current);
    return () => observateur.disconnect();
  }, [visible]);

  return (
    <div ref={boite} aria-hidden={visible ? undefined : true} style={{ width: taille(width), height: taille(height) }}>
      {visible && (
        <Suspense fallback={null}>
          <Graphique />
        </Suspense>
      )}
    </div>
  );
};
