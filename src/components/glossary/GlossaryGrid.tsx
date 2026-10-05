import { useEffect, useRef, useState } from "react";
import { useNavigationType } from "react-router-dom";
import GlossaryCard from "./GlossaryCard";
import { GlossaryEntry } from "@/data/glossary/types";
import { Button } from "@/components/ui/button";
import { initialVisibleCount, rememberVisibleCount, GLOSSARY_BATCH } from "@/lib/glossary-batches";

interface GlossaryGridProps {
  entries: GlossaryEntry[];
  category?: string;
}

/**
 * Grille des fiches du glossaire, affichée par lots : 222 fiches rendues d'un coup bloquaient le navigateur
 * (Lighthouse mobile : 760 ms de blocage). Les lots suivants arrivent quand le bas de la liste approche,
 * ou au clic sur « Afficher la suite ». Le nombre affiché est mémorisé pour la session : au retour sur la page
 * (précédent, rechargement), la liste a de nouveau sa hauteur et la position de lecture peut être restaurée.
 */
const GlossaryGrid = ({ entries, category }: GlossaryGridProps) => {
  const filteredEntries = category ? entries.filter((entry) => entry.category === category) : entries;
  const navigationType = useNavigationType();
  const [visible, setVisible] = useState(() => initialVisibleCount(navigationType === "POP"));
  const sentinel = useRef<HTMLDivElement>(null);

  const total = filteredEntries.length;
  const shown = Math.min(visible, total);
  const hasMore = shown < total;

  useEffect(() => {
    rememberVisibleCount(visible);
  }, [visible]);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || !hasMore || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (observed) => {
        if (observed.some((entry) => entry.isIntersecting)) setVisible((count) => count + GLOSSARY_BATCH);
      },
      { rootMargin: "800px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, shown]);

  return (
    <>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 2xl:grid-cols-3">
        {filteredEntries.slice(0, shown).map((entry, idx) => (
          <GlossaryCard key={`${entry.term}-${idx}`} entry={entry} index={idx} />
        ))}
      </div>
      {hasMore && (
        <div ref={sentinel} className="mt-8 flex flex-col items-center gap-2 text-center">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {shown} termes affichés sur {total}
          </p>
          <Button
            type="button"
            variant="outline"
            className="whitespace-normal h-auto"
            onClick={() => setVisible((count) => count + GLOSSARY_BATCH)}
          >
            Afficher la suite
          </Button>
        </div>
      )}
    </>
  );
};

export default GlossaryGrid;
