import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Target, Clock, Layers, Code, Trophy } from "lucide-react";
import { projects, LEVELS, LEVEL_LABELS, levelSummary, allTechnologies, allCategories, hoursOf } from "@/data/projects";
import { useCourseProgress } from "@/hooks/use-course-progress";

const hours = projects.map(hoursOf);
const MIN_HOURS = Math.min(...hours.map(([min]) => min));
const MAX_HOURS = Math.max(...hours.map(([, max]) => max));

/**
 * Chiffres calculés sur les projets de la page (jamais saisis à la main), et sur l'avancement du visiteur,
 * qui reste dans son navigateur. Le site est statique : il ne compte ni participants, ni notes, ni certificats.
 */
export function ProjectStats() {
  const { statusOf } = useCourseProgress("projects");
  const done = projects.filter((project) => statusOf(project.id) === "done").length;
  const started = projects.filter((project) => statusOf(project.id) === "started").length;

  const stats = [
    {
      icon: <Target className="h-5 w-5" />,
      label: "Projets proposés",
      value: String(projects.length),
      description: LEVELS.map((level) => `${levelSummary(level).count} ${LEVEL_LABELS[level].toLowerCase()}`).join(" · "),
      color: "text-blue-600"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: "Durée par projet",
      value: `${MIN_HOURS} à ${MAX_HOURS} h`,
      description: "Durée indicative annoncée pour chaque projet",
      color: "text-purple-600"
    },
    {
      icon: <Layers className="h-5 w-5" />,
      label: "Catégories",
      value: String(allCategories.length),
      description: "Analyse, machine learning, NLP, vision...",
      color: "text-teal-600"
    },
    {
      icon: <Code className="h-5 w-5" />,
      label: "Technologies",
      value: String(allTechnologies.length),
      description: "Bibliothèques et outils utilisés",
      color: "text-orange-600"
    },
    {
      icon: <Trophy className="h-5 w-5" />,
      label: "Vos projets terminés",
      value: `${done}/${projects.length}`,
      description: started > 0 ? `${started} en cours · enregistré dans ce navigateur` : "Enregistré dans ce navigateur uniquement",
      color: "text-green-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Les projets en chiffres</h2>
        <p className="text-muted-foreground">
          Ces chiffres sont calculés sur les projets de cette page.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className={stat.color}>{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm font-medium">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
