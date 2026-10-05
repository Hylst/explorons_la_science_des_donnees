
import GlossaryCard from "./GlossaryCard";
import { GlossaryEntry } from "@/data/glossary/types";

interface GlossaryGridProps {
  entries: GlossaryEntry[];
  category?: string;
}

/**
 * Grid component for displaying glossary entries with enhanced cards
 * Features responsive layout and improved visual design
 */
const GlossaryGrid = ({ entries, category }: GlossaryGridProps) => {
  const filteredEntries = category 
    ? entries.filter(entry => entry.category === category)
    : entries;

  return (
    <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
      {filteredEntries.map((entry, idx) => (
        <GlossaryCard
          key={`${entry.term}-${idx}`}
          entry={entry}
          index={idx}
        />
      ))}
    </div>
  );
};

export default GlossaryGrid;
