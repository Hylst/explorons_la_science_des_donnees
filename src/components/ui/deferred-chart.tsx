import { useEffect, useRef, useState, type ComponentProps } from "react";
import { ResponsiveContainer } from "recharts";

/** Marge autour de l'écran : un graphique est dessiné un peu avant d'apparaître */
const MARGE = "400px 0px";

type Props = ComponentProps<typeof ResponsiveContainer>;

const taille = (v: Props["width"]) => (typeof v === "number" ? `${v}px` : v);

/**
 * Remplaçant de `ResponsiveContainer` (mêmes propriétés) qui ne dessine le graphique qu'à l'approche de l'écran.
 * Dessiner un graphique Recharts coûte cher : sur une page longue, les dessiner tous au chargement bloque le navigateur.
 * La boîte réservée a exactement la taille du graphique, si bien que la page ne bouge pas quand il arrive
 * (la restauration de la position de lecture au retour reste juste). Sans IntersectionObserver (tests), dessin immédiat.
 */
export const DeferredResponsiveContainer = (props: Props) => {
  const boite = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === "undefined");

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

  if (visible) return <ResponsiveContainer {...props} />;
  return (
    <div
      ref={boite}
      aria-hidden="true"
      style={{
        width: taille(props.width ?? "100%"),
        height: taille(props.height ?? "100%"),
        minWidth: taille(props.minWidth),
        minHeight: taille(props.minHeight),
      }}
    />
  );
};
