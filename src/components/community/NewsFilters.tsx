import { Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

interface NewsFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  selectedSource: string;
  onSourceChange: (source: string) => void;
  sourceNames: string[];
  category: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  resultCount: number;
}

/**
 * NewsFilters : recherche par texte, filtre par source et par catégorie. Tous les contrôles agissent
 * sur la liste affichée ; les catégories proposées sont celles qui existent réellement dans les articles.
 */
const NewsFilters: React.FC<NewsFiltersProps> = ({
  search,
  onSearchChange,
  selectedSource,
  onSourceChange,
  sourceNames,
  category,
  onCategoryChange,
  categories,
  resultCount
}) => (
  <>
    <div className="mb-6 flex flex-col lg:flex-row gap-4">
      <div className="relative flex-grow">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          aria-label="Rechercher dans les actualités"
          placeholder="Rechercher dans les actualités..."
          className="pl-9 w-full"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="w-full lg:w-64">
        <Select value={selectedSource} onValueChange={onSourceChange}>
          <SelectTrigger aria-label="Filtrer par source">
            <SelectValue placeholder="Toutes les sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les sources</SelectItem>
            {sourceNames.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-2 mb-2">
      <Filter className="h-4 w-4 text-muted-foreground" />
      {["all", ...categories].map((item) => (
        <Badge
          key={item}
          role="button"
          tabIndex={0}
          aria-pressed={category === item}
          variant={category === item ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onCategoryChange(item)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onCategoryChange(item);
            }
          }}
        >
          {item === "all" ? "Toutes" : item}
        </Badge>
      ))}
    </div>
    <p className="text-sm text-muted-foreground mb-6" aria-live="polite">
      {resultCount} article{resultCount > 1 ? "s" : ""}
    </p>
  </>
);

export default React.memo(NewsFilters);
