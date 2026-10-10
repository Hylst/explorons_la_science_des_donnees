
import { EducationalCard } from "@/components/ui/educational-cards";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Application {
  icon: React.ReactNode;
  title: string;
  description: string;
  examples: string[];
  industry: string;
  difficulty: "Débutant" | "Intermédiaire" | "Avancé";
}

interface ApplicationsSectionProps {
  title: string;
  applications: Application[];
  description?: string;
}

const ApplicationsSection = ({ title, applications, description }: ApplicationsSectionProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Débutant": return "bg-green-100 text-green-800";
      case "Intermédiaire": return "bg-yellow-100 text-yellow-800";
      case "Avancé": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center">{title}</h2>

      {description && (
        <EducationalCard title="Vue d'ensemble" type="concept">
          <p className="text-gray-700 leading-relaxed">{description}</p>
        </EducationalCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((app, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {app.icon}
                  <CardTitle className="text-lg">{app.title}</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">{app.industry}</Badge>
              </div>
              <div className="flex gap-2">
                <Badge className={getDifficultyColor(app.difficulty)} title="Difficulté de mise en œuvre (avis de l'auteur)">{app.difficulty}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">{app.description}</p>
              <div>
                <h4 className="font-medium text-sm mb-2">Exemples :</h4>
                <ul className="text-xs space-y-1">
                  {app.examples.map((example, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsSection;
