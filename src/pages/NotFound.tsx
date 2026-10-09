
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { Home, BookOpen, Brain, Database, BarChart3, Code } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Smart suggestions based on the URL path
  const suggestions = useMemo(() => {
    const path = location.pathname.toLowerCase();
    
    if (path.includes('cours') || path.includes('course')) {
      return [
        { title: "Catalogue des cours", href: "/courses", icon: BookOpen, description: "Tous les cours du catalogue" },
        { title: "Bases de Python", href: "/courses/programming/python-basics", icon: Code, description: "Commencez par les bases de Python" },
        { title: "Machine Learning", href: "/courses/machine-learning/supervised-learning", icon: Brain, description: "Le cours d'apprentissage supervisé" }
      ];
    }
    
    if (path.includes('python') || path.includes('programming')) {
      return [
        { title: "Bases de Python", href: "/courses/programming/python-basics", icon: Code, description: "Fondamentaux de Python pour la Data Science" },
        { title: "Fondamentaux", href: "/fundamentals/programming", icon: Code, description: "Bases de la programmation" }
      ];
    }
    
    if (path.includes('ml') || path.includes('machine') || path.includes('learning')) {
      return [
        { title: "Machine Learning", href: "/machine-learning", icon: Brain, description: "La section Machine Learning" },
        { title: "ML Supervisé", href: "/courses/machine-learning/supervised-learning", icon: Brain, description: "Cours d'apprentissage supervisé" }
      ];
    }
    
    if (path.includes('data') || path.includes('base') || path.includes('sql')) {
      return [
        { title: "Bases de données", href: "/courses/databases/database-fundamentals", icon: Database, description: "SQL, NoSQL et gestion de données" },
        { title: "Fondamentaux", href: "/fundamentals/databases", icon: Database, description: "Concepts de bases de données" }
      ];
    }
    
    if (path.includes('viz') || path.includes('visual') || path.includes('chart')) {
      return [
        { title: "Visualisation", href: "/courses/dataviz/data-visualization", icon: BarChart3, description: "Créer des visualisations lisibles" },
        { title: "Outils", href: "/tools", icon: BarChart3, description: "Outils de visualisation" }
      ];
    }
    
    // Default suggestions
    return [
      { title: "Accueil", href: "/", icon: Home, description: "Retourner à la page d'accueil" },
      { title: "Catalogue des cours", href: "/courses", icon: BookOpen, description: "Tous les cours du catalogue" },
      { title: "Machine Learning", href: "/machine-learning", icon: Brain, description: "La section Machine Learning" }
    ];
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="max-w-4xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-4 gradient-heading">404</h1>
          <p className="text-xl text-muted-foreground mb-4">
            Cette page est introuvable.
          </p>
          <p className="text-muted-foreground mb-2">
            URL demandée : <code className="bg-muted px-2 py-1 rounded text-sm">{location.pathname}</code>
          </p>
          <p className="text-muted-foreground">
            Elle a peut-être été déplacée, renommée ou est temporairement indisponible.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Quelques pages utiles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((suggestion, index) => {
              const IconComponent = suggestion.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className="h-6 w-6 text-primary" />
                      <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                    </div>
                    <CardDescription className="text-left">
                      {suggestion.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button asChild variant="outline" className="w-full">
                      <Link to={suggestion.href}>Accéder</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <Button asChild size="lg">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Link>
          </Button>
          
          <div className="text-sm text-muted-foreground">
            <p>Si vous pensez qu'il s'agit d'une erreur, vous pouvez :</p>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <Link to="/courses" className="text-primary hover:underline">
                Parcourir le catalogue des cours
              </Link>
              <Link to="/fundamentals" className="text-primary hover:underline">
                Voir les fondamentaux
              </Link>
              <Link to="/resources" className="text-primary hover:underline">
                Consulter les ressources
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
