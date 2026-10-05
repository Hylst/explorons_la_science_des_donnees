
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, SlidersHorizontal, X, Filter } from "lucide-react";
import {
  DEFAULT_FILTERS,
  DURATION_LABELS,
  LEVELS,
  LEVEL_LABELS,
  PROGRESS_LABELS,
  allCategories,
  allTechnologies,
  categoryLabel,
  type DurationFilter,
  type ProgressFilter,
  type ProjectFilterState
} from "@/data/projects";

interface AdvancedProjectSearchProps {
  filters: ProjectFilterState;
  onChange: (filters: ProjectFilterState) => void;
  resultCount: number;
  totalCount: number;
}

/**
 * Recherche de projets. Toutes les options viennent des projets eux-mêmes et chaque filtre agit sur la liste :
 * niveau, durée, catégorie, technologies, et progression du visiteur (enregistrée dans son navigateur).
 */
export function AdvancedProjectSearch({ filters, onChange, resultCount, totalCount }: AdvancedProjectSearchProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const update = <K extends keyof ProjectFilterState>(key: K, value: ProjectFilterState[K]) =>
    onChange({ ...filters, [key]: value });

  const toggleTechnology = (tech: string) =>
    update(
      "technologies",
      filters.technologies.includes(tech) ? filters.technologies.filter((item) => item !== tech) : [...filters.technologies, tech]
    );

  const activeFiltersCount =
    (filters.query.trim() ? 1 : 0) +
    (filters.level !== "all" ? 1 : 0) +
    (filters.duration !== "all" ? 1 : 0) +
    (filters.category !== "all" ? 1 : 0) +
    (filters.progress !== "all" ? 1 : 0) +
    filters.technologies.length;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Recherche de Projets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Barre de recherche principale */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            aria-label="Rechercher un projet"
            placeholder="Rechercher par titre, description, technologie..."
            className="pl-10"
            value={filters.query}
            onChange={(e) => update("query", e.target.value)}
          />
        </div>

        {/* Filtres rapides */}
        <div className="flex flex-wrap gap-2">
          <Select value={filters.level} onValueChange={(value) => update("level", value as ProjectFilterState["level"])}>
            <SelectTrigger className="w-44" aria-label="Niveau">
              <SelectValue placeholder="Niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous niveaux</SelectItem>
              {LEVELS.map((level) => (
                <SelectItem key={level} value={level}>{LEVEL_LABELS[level]}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.duration} onValueChange={(value) => update("duration", value as DurationFilter)}>
            <SelectTrigger className="w-48" aria-label="Durée">
              <SelectValue placeholder="Durée" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toute durée</SelectItem>
              {Object.entries(DURATION_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            aria-expanded={showAdvanced}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtres avancés
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {activeFiltersCount > 0 && (
            <Button variant="ghost" onClick={() => onChange(DEFAULT_FILTERS)} className="gap-2">
              <X className="h-4 w-4" />
              Effacer
            </Button>
          )}
        </div>

        {/* Filtres avancés */}
        {showAdvanced && (
          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Catégorie</label>
                <Select value={filters.category} onValueChange={(value) => update("category", value)}>
                  <SelectTrigger aria-label="Catégorie">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes catégories</SelectItem>
                    {allCategories.map((category) => (
                      <SelectItem key={category} value={category}>{categoryLabel(category)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Ma progression</label>
                <Select value={filters.progress} onValueChange={(value) => update("progress", value as ProgressFilter)}>
                  <SelectTrigger aria-label="Ma progression">
                    <SelectValue placeholder="Progression" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les projets</SelectItem>
                    {Object.entries(PROGRESS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Technologies (le projet doit toutes les utiliser)</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>
                      {filters.technologies.length === 0
                        ? "Sélectionner des technologies"
                        : `${filters.technologies.length} sélectionnée${filters.technologies.length > 1 ? "s" : ""}`}
                    </span>
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 max-h-64 overflow-y-auto">
                  {allTechnologies.map((tech) => (
                    <DropdownMenuCheckboxItem
                      key={tech}
                      checked={filters.technologies.includes(tech)}
                      onCheckedChange={() => toggleTechnology(tech)}
                      // Le menu reste ouvert : on coche plusieurs technologies d'affilée
                      onSelect={(event) => event.preventDefault()}
                    >
                      {tech}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Technologies sélectionnées */}
            {filters.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    role="button"
                    tabIndex={0}
                    aria-label={`Retirer ${tech}`}
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => toggleTechnology(tech)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        toggleTechnology(tech);
                      }
                    }}
                  >
                    {tech}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        <p className="text-sm text-muted-foreground" aria-live="polite">
          {resultCount} projet{resultCount > 1 ? "s" : ""} sur {totalCount}
        </p>
      </CardContent>
    </Card>
  );
}
