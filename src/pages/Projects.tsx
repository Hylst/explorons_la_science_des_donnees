
import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import ContentLayout from "@/components/layout/ContentLayout";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { ProjectCategories } from "@/components/projects/ProjectCategories";
import { ProjectStats } from "@/components/projects/ProjectStats";
import { AdvancedProjectSearch } from "@/components/projects/AdvancedProjectSearch";
import ProjectsSidebar, { ProjectsSectionType } from "@/components/projects/ProjectsSidebar";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";
import { useSectionTracker } from "@/hooks/use-section-tracker";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { scrollToSection } from "@/lib/scroll";
import {
  DEFAULT_FILTERS,
  LEVELS,
  levelSummary,
  matchesFilters,
  projects,
  type ProjectFilterState,
  type ProjectLevel
} from "@/data/projects";
import { Rocket, Target, Trophy, TrendingUp, BookOpen, Code, Search } from "lucide-react";

/** Les technologies les plus utilisées par les projets, calculées sur les données */
const topTechnologies = (() => {
  const counts = new Map<string, number>();
  projects.forEach((project) => project.technologies.forEach((tech) => counts.set(tech, (counts.get(tech) ?? 0) + 1)));
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 5).map(([tech]) => tech);
})();

/** Classes complètes (jamais construites dynamiquement, sinon Tailwind ne les génère pas) */
const LEVEL_SECTIONS: Record<ProjectLevel, { title: string; description: string; icon: ReactNode; iconBox: string }> = {
  beginner: {
    title: "Projets pour débutants",
    description: "Des projets pour vos premières analyses et vos premiers modèles.",
    icon: <BookOpen className="h-5 w-5 text-green-600" />,
    iconBox: "bg-green-100"
  },
  intermediate: {
    title: "Projets intermédiaires",
    description: "Des projets plus complets, qui combinent plusieurs techniques et outils.",
    icon: <TrendingUp className="h-5 w-5 text-yellow-600" />,
    iconBox: "bg-yellow-100"
  },
  advanced: {
    title: "Projets avancés",
    description: "Des projets exigeants, qui demandent de solides bases en machine learning.",
    icon: <Rocket className="h-5 w-5 text-red-600" />,
    iconBox: "bg-red-100"
  }
};

const Projects = () => {
  const sections: ProjectsSectionType[] = [
    "overview", "stats", "search", "categories", "beginner", "intermediate", "advanced"
  ];
  const { currentSection } = useSectionTracker<ProjectsSectionType>(sections);
  const [filters, setFilters] = useState<ProjectFilterState>(DEFAULT_FILTERS);
  const { statusOf } = useCourseProgress("projects");

  useSmoothScroll();

  const { items: sidebarItems } = ProjectsSidebar({
    currentSection,
    onSectionChange: () => {}
  });

  const filteredProjects = useMemo(
    () => projects.filter((project) => matchesFilters(project, filters, statusOf)),
    [filters, statusOf]
  );
  const filtersActive =
    filters.query.trim() !== "" || filters.level !== "all" || filters.duration !== "all" ||
    filters.category !== "all" || filters.progress !== "all" || filters.technologies.length > 0;

  /** Filtre par catégorie, puis défilement jusqu'au premier niveau qui a des résultats */
  const selectCategory = (category: string) => {
    const next = { ...filters, category };
    setFilters(next);
    if (category !== "all") {
      const firstLevel = LEVELS.find((level) => projects.some((project) => project.level === level && matchesFilters(project, next, statusOf)));
      if (firstLevel) scrollToSection(firstLevel);
    }
  };

  return (
    <ContentLayout
      title="Projets Data Science"
      backLink={{ href: "/", label: "Retour à l'accueil" }}
      sidebar={{ items: sidebarItems }}
    >
      <section className="py-8">
        <div id="overview">
          <UnifiedHeroSection
            variant="page"
            title="Projets Data Science"
            description={`Mettez en pratique vos compétences avec ${projects.length} projets, du débutant à l'avancé. Chaque projet indique sa durée, ses prérequis, ses objectifs et ses technologies ; votre avancement est enregistré dans votre navigateur.`}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 mb-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{projects.length} projets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Du débutant à l'avancé, avec durée, prérequis et objectifs
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Suivi de progression</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Marquez vos projets comme commencés ou terminés et ajoutez vos notes
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                  <Code className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Technologies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {topTechnologies.join(", ")} et bien d'autres
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                  <Search className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Recherche et filtres</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Par niveau, durée, catégorie, technologie ou progression
                </p>
              </CardContent>
            </Card>
          </div>

          <p className="text-sm text-muted-foreground bg-muted/50 rounded-md px-4 py-3 mb-12">
            Ces projets sont des sujets à réaliser vous-même : aucun jeu de données ni corrigé n'est fourni sur ce site.
            Pour contribuer à de vrais projets open source, consultez la section « Contribuer » de la{" "}
            <Link to="/community#contribute" className="underline text-primary">page Communauté</Link>.
          </p>
        </div>

        <div className="space-y-16">
          <div id="stats">
            <ProjectStats />
          </div>

          <div id="search">
            <AdvancedProjectSearch
              filters={filters}
              onChange={setFilters}
              resultCount={filteredProjects.length}
              totalCount={projects.length}
            />
          </div>

          <div id="categories">
            <ProjectCategories selectedCategory={filters.category} onSelectCategory={selectCategory} />
          </div>

          {LEVELS.map((level) => {
            const section = LEVEL_SECTIONS[level];
            const summary = levelSummary(level);
            return (
              <div id={level} key={level}>
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 ${section.iconBox} rounded-lg flex items-center justify-center`}>
                      {section.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{section.title}</h2>
                      <p className="text-muted-foreground mb-4">{section.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">
                      {summary.count} projet{summary.count > 1 ? "s" : ""}
                    </Badge>
                    <Badge variant="outline">
                      {summary.minHours} à {summary.maxHours} heures
                    </Badge>
                    <Badge variant="outline">Prérequis indiqués</Badge>
                  </div>
                </div>
                <ProjectGrid
                  projects={filteredProjects.filter((project) => project.level === level)}
                  emptyMessage={filtersActive ? "Aucun projet de ce niveau ne correspond aux filtres actuels." : undefined}
                />
              </div>
            );
          })}
        </div>
      </section>
    </ContentLayout>
  );
};

export default Projects;
