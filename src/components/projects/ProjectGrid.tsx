
import { memo, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CourseItemActions from "@/components/courses/CourseItemActions";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { categoryIcon } from "./category-icons";
import { categoryLabel, LEVEL_LABELS, type Project, type ProjectLevel } from "@/data/projects";
import { CheckCircle, Clock, Database, Star, Code, BarChart3, Brain } from "lucide-react";

interface ProjectGridProps {
  projects: Project[];
  /** Message affiché quand aucun projet ne correspond */
  emptyMessage?: string;
}

/** Classes complètes (jamais construites dynamiquement, sinon Tailwind ne les génère pas) */
const LEVEL_STYLES: Record<ProjectLevel, { color: string; banner: string; icon: React.ReactNode }> = {
  beginner: { color: "bg-green-100 text-green-800", banner: "from-emerald-500 to-teal-600", icon: <Code className="h-4 w-4" /> },
  intermediate: { color: "bg-yellow-100 text-yellow-800", banner: "from-amber-500 to-orange-600", icon: <BarChart3 className="h-4 w-4" /> },
  advanced: { color: "bg-red-100 text-red-800", banner: "from-rose-500 to-purple-700", icon: <Brain className="h-4 w-4" /> }
};

const DifficultyStars = ({ difficulty }: { difficulty: number }) => (
  <span className="flex gap-1" role="img" aria-label={`Difficulté ${difficulty} sur 5`}>
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-3 w-3 ${i < difficulty ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))}
  </span>
);

/**
 * Grille de projets. Elle affiche les projets qu'on lui donne (déjà filtrés) et l'avancement du visiteur,
 * enregistré dans son navigateur.
 */
export const ProjectGrid = memo(function ProjectGrid({ projects, emptyMessage }: ProjectGridProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { statusOf } = useCourseProgress("projects");

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <Database className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">Aucun projet trouvé</h3>
        <p className="text-muted-foreground">
          {emptyMessage ?? "Essayez de modifier vos filtres."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const level = LEVEL_STYLES[project.level];
          const status = statusOf(project.id);

          return (
            <Card key={project.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300">
              <div className={`h-32 w-full relative flex items-center justify-center bg-gradient-to-br ${level.banner}`}>
                <span className="text-white/90" aria-hidden="true">{categoryIcon(project.category, "h-12 w-12")}</span>
                <div className="absolute top-2 left-2 flex gap-2">
                  <Badge className={level.color}>
                    {level.icon}
                    <span className="ml-1">{LEVEL_LABELS[project.level]}</span>
                  </Badge>
                </div>
                {status !== "todo" && (
                  <div className="absolute top-2 right-2">
                    <Badge className={status === "done" ? "bg-green-600 text-white" : "bg-blue-600 text-white"}>
                      {status === "done" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {status === "done" ? "Terminé" : "En cours"}
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader className="pb-3">
                <h3 className="text-lg font-semibold line-clamp-2">{project.title}</h3>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {project.duration}
                  </div>
                  <Badge variant="outline" className="text-xs">{categoryLabel(project.category)}</Badge>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Difficulté :</span>
                  <DifficultyStars difficulty={project.difficulty} />
                </div>
              </CardHeader>

              <CardContent className="flex-grow space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.technologies.length - 4}
                    </Badge>
                  )}
                </div>
              </CardContent>

              <CardFooter className="pt-3">
                <Button className="w-full" onClick={() => setSelectedProject(project)}>
                  Voir le projet
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Dialog open={selectedProject !== null} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProject.title}</DialogTitle>
                <DialogDescription>{selectedProject.description}</DialogDescription>
              </DialogHeader>

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Badge className={LEVEL_STYLES[selectedProject.level].color}>{LEVEL_LABELS[selectedProject.level]}</Badge>
                <Badge variant="outline">{categoryLabel(selectedProject.category)}</Badge>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  {selectedProject.duration}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  Difficulté : <DifficultyStars difficulty={selectedProject.difficulty} />
                </span>
              </div>

              {selectedProject.learningObjectives && selectedProject.learningObjectives.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold">Objectifs d'apprentissage</h4>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {selectedProject.learningObjectives.map((objective) => (
                      <li key={objective}>{objective}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedProject.prerequisites && selectedProject.prerequisites.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold">Prérequis</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.prerequisites.map((prerequisite) => (
                      <Badge key={prerequisite} variant="secondary">
                        {prerequisite}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="mb-2 font-semibold">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <p className="rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                Ce projet est un sujet à réaliser vous-même : aucun jeu de données ni corrigé n'est fourni sur ce site.
                « Commencer » et « Terminé » enregistrent seulement votre avancement, dans ce navigateur.
              </p>

              <CourseItemActions
                courseId="projects"
                itemId={selectedProject.id}
                itemTitle={selectedProject.title}
                startLabel="Commencer le projet"
                className="pt-2"
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
});
