
import { ExerciseCard, EducationalCard } from "@/components/ui/educational-cards";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, GitBranch, Target, Star } from "lucide-react";

interface Project {
  title: string;
  description: string;
  problem: string;
  solution: string;
  hints: string[];
  difficulty: "débutant" | "intermédiaire" | "avancé";
  estimatedTime: string;
  skills: string[];
  tools: string[];
  category: string;
}

interface ProjectsSectionProps {
  title: string;
  projects: Project[];
  description?: string;
}

const ProjectsSection = ({ title, projects, description }: ProjectsSectionProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "débutant": return "bg-green-100 text-green-800";
      case "intermédiaire": return "bg-yellow-100 text-yellow-800";
      case "avancé": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center">{title}</h2>

      {description && (
        <EducationalCard title="🚀 Mode d'emploi des projets" type="concept">
          <p className="text-gray-700 leading-relaxed mb-4">{description}</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Conseils :</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Commencez par comprendre le problème avant de coder</li>
              <li>• Testez votre solution sur des données simples d'abord</li>
              <li>• Documentez votre code et vos décisions</li>
              <li>• N'hésitez pas à consulter les indices si vous êtes bloqué</li>
              <li>• La solution affichée est une façon de faire parmi d'autres : exécutez-la, puis comparez avec votre approche</li>
            </ul>
          </div>
        </EducationalCard>
      )}

      <div className="space-y-8">
        {projects.map((project, index) => (
          <div key={index}>
            <ExerciseCard
              title={project.title}
              problem={project.problem}
              solution={project.solution}
              hints={project.hints}
              difficulty={project.difficulty}
              estimatedTime={project.estimatedTime}
            />

            <Card className="mt-4 bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-blue-600" />
                  Détails du projet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      Compétences développées
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {project.skills.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <GitBranch className="h-4 w-4" />
                      Outils utilisés
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {project.tools.map((tool, idx) => (
                        <Badge key={idx} className="bg-purple-100 text-purple-800 text-xs">{tool}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Catégorie
                    </h4>
                    <Badge className={getDifficultyColor(project.difficulty)}>{project.category}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;
