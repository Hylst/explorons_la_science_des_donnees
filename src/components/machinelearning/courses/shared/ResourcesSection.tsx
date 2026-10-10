
import { EducationalCard } from "@/components/ui/educational-cards";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Video, Globe, Code, Users, ExternalLink, CheckCircle, AlertCircle, Lightbulb } from "lucide-react";

interface Resource {
  title: string;
  description: string;
  type: "book" | "video" | "website" | "code" | "community";
  difficulty: "Débutant" | "Intermédiaire" | "Avancé";
  language: string;
  url?: string;
  free: boolean;
}

interface ResourcesSectionProps {
  title: string;
  resources: Resource[];
  tips?: string[];
  warnings?: string[];
  bestPractices?: string[];
}

const ResourcesSection = ({ title, resources, tips = [], warnings = [], bestPractices = [] }: ResourcesSectionProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "book": return <Book className="h-5 w-5 text-blue-600" />;
      case "video": return <Video className="h-5 w-5 text-red-600" />;
      case "website": return <Globe className="h-5 w-5 text-green-600" />;
      case "code": return <Code className="h-5 w-5 text-purple-600" />;
      case "community": return <Users className="h-5 w-5 text-orange-600" />;
      default: return <Book className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Débutant": return "bg-green-100 text-green-800";
      case "Intermédiaire": return "bg-yellow-100 text-yellow-800";
      case "Avancé": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };


  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center">{title}</h2>

      {/* Conseils et avertissements */}
      {(tips.length > 0 || warnings.length > 0 || bestPractices.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tips.length > 0 && (
            <EducationalCard title="Conseils d'apprentissage" type="saviez-vous">
              <ul className="space-y-2 text-sm">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </EducationalCard>
          )}

          {warnings.length > 0 && (
            <EducationalCard title="Points d'attention" type="rappel">
              <ul className="space-y-2 text-sm">
                {warnings.map((warning, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </EducationalCard>
          )}

          {bestPractices.length > 0 && (
            <EducationalCard title="Bonnes pratiques" type="concept">
              <ul className="space-y-2 text-sm">
                {bestPractices.map((practice, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </EducationalCard>
          )}
        </div>
      )}

      {/* Liste des ressources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(resource.type)}
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                </div>
                {resource.free && (
                  <Badge className="bg-green-100 text-green-800 text-xs">Gratuit</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(resource.difficulty)}>{resource.difficulty}</Badge>
                <Badge variant="outline" className="text-xs">{resource.language}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
              <div className="flex items-center justify-between">
                <span />
                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                  >
                    Accéder <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResourcesSection;
