
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { categoryIcon } from "./category-icons";
import { projects, allCategories, categoryLabel, LEVELS, LEVEL_LABELS } from "@/data/projects";

interface ProjectCategoriesProps {
  selectedCategory: string;
  /** Appelée avec l'identifiant de catégorie, ou « all » pour retirer le filtre */
  onSelectCategory: (category: string) => void;
}

/**
 * Catégories déduites des projets eux-mêmes (nombre réel de projets, niveaux réellement présents).
 * Un clic filtre la liste des projets ; un second clic retire le filtre.
 */
export function ProjectCategories({ selectedCategory, onSelectCategory }: ProjectCategoriesProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Catégories de projets</h2>
        <p className="text-muted-foreground">
          Choisissez une catégorie pour ne voir que ses projets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allCategories.map((category) => {
          const inCategory = projects.filter((project) => project.category === category);
          const levels = LEVELS.filter((level) => inCategory.some((project) => project.level === level));
          const selected = selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelectCategory(selected ? "all" : category)}
              className="text-left rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Card className={`h-full hover:shadow-lg transition-shadow ${selected ? "ring-2 ring-primary" : ""}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                      {categoryIcon(category)}
                    </div>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {levels.map((level) => (
                        <Badge key={level} variant="secondary" className="text-xs">{LEVEL_LABELS[level]}</Badge>
                      ))}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{categoryLabel(category)}</CardTitle>
                  <CardDescription className="text-sm">
                    {inCategory.map((project) => project.title).join(" · ")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{inCategory.length} projet{inCategory.length > 1 ? "s" : ""}</span>
                    <span>{selected ? "Filtre actif" : "Filtrer →"}</span>
                  </div>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
}
