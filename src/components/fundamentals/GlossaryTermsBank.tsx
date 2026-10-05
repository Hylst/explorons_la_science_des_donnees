
import { useState } from "react";
import { 
  glossaryTerms, 
  getTermsByCategory, 
  searchTerms
} from "@/data/glossary";
import { GlossaryEntry, GlossaryCategory } from "@/data/glossary/types";
import { GlossaryTerm, GlossaryTermDefinition } from "@/components/ui/glossary-term";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen } from "lucide-react";

type Category = "all" | GlossaryCategory;

/**
 * Convert GlossaryEntry to GlossaryTermDefinition for backward compatibility
 */
function convertEntryToDefinition(entry: GlossaryEntry): GlossaryTermDefinition {
  return {
    term: entry.term,
    shortDefinition: entry.shortDefinition || entry.description.substring(0, 150) + "...",
    longDefinition: entry.longDefinition || entry.description,
    examples: entry.examples,
    relatedTerms: entry.relatedTerms,
    source: entry.source,
    sourceUrl: entry.sourceUrl,
    domain: entry.domain as "statistics" | "programming" | "dataviz" | "dataprocessing" | "machinelearning" | "general",
    level: entry.level,
    synonyms: entry.synonyms,
    englishTerm: entry.englishTerm
  };
}

/**
 * Main GlossaryTermsBank component with modern glossary integration
 */
const GlossaryTermsBank = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("all");

  /**
   * Get filtered terms based on search and category
   */
  const getFilteredTerms = (): GlossaryEntry[] => {
    let terms = category === "all" ? glossaryTerms : getTermsByCategory(category);
    
    if (search) {
      terms = searchTerms(search);
      if (category !== "all") {
        terms = terms.filter(term => term.category === category);
      }
    }
    
    return terms.sort((a, b) => a.term.localeCompare(b.term));
  };

  const filteredTerms = getFilteredTerms();

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 my-8">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-ds-blue-500" />
        <h3 className="text-lg font-semibold">Banque de termes techniques</h3>
      </div>
      
      <div className="mb-4 relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input 
          type="text" 
          placeholder="Rechercher un terme..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <Tabs defaultValue="all" onValueChange={(value) => setCategory(value as Category)}>
        <TabsList className="grid grid-cols-6 mb-4">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="statistiques">Stats</TabsTrigger>
          <TabsTrigger value="machine-learning">ML</TabsTrigger>
          <TabsTrigger value="deep-learning">DL</TabsTrigger>
          <TabsTrigger value="nlp">NLP</TabsTrigger>
          <TabsTrigger value="mlops">MLOps</TabsTrigger>
        </TabsList>
        
        {/* Dynamic tab content */}
        {["all", "statistiques", "machine-learning", "deep-learning", "nlp", "mlops"].map(cat => (
          <TabsContent key={cat} value={cat} className="mt-0">
            <TermsList terms={filteredTerms} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

/**
 * Terms list component that displays filtered glossary terms
 */
interface TermsListProps {
  terms: GlossaryEntry[];
}

const TermsList = ({ terms }: TermsListProps) => {
  if (terms.length === 0) {
    return <p className="text-center py-4 text-gray-500">Aucun terme correspondant trouvé</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {terms.map((entry) => {
        const definition = convertEntryToDefinition(entry);
        return (
          <div key={entry.term} className="border rounded-md p-3 hover:bg-gray-50 transition-colors">
            <GlossaryTerm definition={definition}>
              <h4 className="font-medium text-ds-blue-600 cursor-pointer hover:underline">{entry.term}</h4>
            </GlossaryTerm>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {entry.shortDefinition || entry.description.substring(0, 100) + "..."}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default GlossaryTermsBank;
