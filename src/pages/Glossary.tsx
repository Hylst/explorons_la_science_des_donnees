import { useState, useMemo } from 'react';
import { Search, X, BookOpen, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import UnifiedHeroSection from '@/components/ui/unified-hero-section';
import GlossaryGrid from '@/components/glossary/GlossaryGrid';
import { glossaryTerms } from '@/data/glossary-terms';

const Glossary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("alphabetical");


  // Extract unique categories from entries
  const categories = useMemo(() => {
    const cats = [...new Set(glossaryTerms.map(entry => entry.category).filter(Boolean))];
    return ["all", ...cats.sort()];
  }, []);

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    const filtered = glossaryTerms.filter(entry => {
      const matchesSearch = entry.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           entry.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || entry.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort entries
    if (sortBy === "alphabetical") {
      filtered.sort((a, b) => a.term.localeCompare(b.term));
    } else if (sortBy === "category") {
      filtered.sort((a, b) => (a.category || "").localeCompare(b.category || ""));
    }

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  // Category display names
  const getCategoryDisplayName = (category: string) => {
    const displayNames = {
      "all": "Toutes les catégories",
      "fondamentaux": "Fondamentaux",
      "machine-learning": "Machine Learning",
      "deep-learning": "Deep Learning",
      "statistiques": "Statistiques",
      "nlp": "Traitement du Langage",
      "computer-vision": "Vision par Ordinateur",
      "preprocessing": "Préparation des Données",
      "mlops": "MLOps & Production",
      "evaluation": "Évaluation des modèles",
      "data-engineering": "Ingénierie des Données",
      "visualization": "Visualisation"
    };
    return displayNames[category as keyof typeof displayNames] || category;
  };

  return (
    <Layout>
      <div className="min-h-screen">
        <UnifiedHeroSection
          variant="page"
          title="Glossaire Data Science"
          description="Un glossaire interactif des concepts de la data science"
        />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{glossaryTerms.length}</div>
              <div className="text-sm text-muted-foreground">Termes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{categories.length - 1}</div>
              <div className="text-sm text-muted-foreground">Catégories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{filteredEntries.length}</div>
              <div className="text-sm text-muted-foreground">Résultats</div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Rechercher un terme..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value || "")}
                className="pl-10 pr-4 py-2 w-full"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => setSelectedCategory(category ?? "all")}
                >
                  {getCategoryDisplayName(category)}
                </Badge>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex justify-center gap-2">
              <Button
                variant={sortBy === "alphabetical" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("alphabetical")}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Alphabétique
              </Button>
              <Button
                variant={sortBy === "category" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("category")}
              >
                <Filter className="w-4 h-4 mr-2" />
                Par Catégorie
              </Button>
            </div>
          </div>
          
          {/* Results */}
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Aucun résultat trouvé</p>
                <p className="text-sm">Essayez de modifier vos critères de recherche</p>
              </div>
              <Button onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }} variant="outline">
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <GlossaryGrid entries={filteredEntries} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Glossary;
