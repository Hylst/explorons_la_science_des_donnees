
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink, BookOpen, Video, Globe, Calculator, Code, Headphones, FileText } from "lucide-react";

const MathResourcesTools = () => {
  const resourceCategories = [
    {
      title: "Livres Essentiels",
      icon: <BookOpen className="h-6 w-6 text-blue-600" />,
      resources: [
        {
          name: "The Elements of Statistical Learning",
          authors: "Hastie, Tibshirani & Friedman",
          level: "Avancé",
          description: "La bible du machine learning statistique",
          link: "https://hastie.su.domains/ElemStatLearn/",
          free: true
        },
        {
          name: "Introduction to Statistical Learning",
          authors: "James, Witten, Hastie & Tibshirani",
          level: "Intermédiaire",
          description: "Version plus accessible du précédent avec R",
          link: "https://www.statlearning.com/",
          free: true
        },
        {
          name: "Pattern Recognition and Machine Learning",
          authors: "Christopher Bishop",
          level: "Avancé",
          description: "Approche bayésienne du machine learning",
          link: "https://www.microsoft.com/en-us/research/publication/pattern-recognition-machine-learning/",
          free: true
        },
        {
          name: "Mathematics for Machine Learning",
          authors: "Deisenroth, Faisal & Ong",
          level: "Intermédiaire",
          description: "Mathématiques spécifiquement pour le ML",
          link: "https://mml-book.github.io/",
          free: true
        }
      ]
    },
    {
      title: "Cours Vidéo",
      icon: <Video className="h-6 w-6 text-red-600" />,
      resources: [
        {
          name: "Linear Algebra - 3Blue1Brown",
          authors: "Grant Sanderson",
          level: "Débutant",
          description: "Visualisations exceptionnelles de l'algèbre linéaire",
          link: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
          free: true
        },
        {
          name: "Statistics 110 - Harvard",
          authors: "Joe Blitzstein",
          level: "Intermédiaire",
          description: "Cours de probabilités de Harvard (Statistics 110: Probability)",
          link: "https://www.youtube.com/playlist?list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo",
          free: true
        },
        {
          name: "Machine Learning - Andrew Ng",
          authors: "Stanford/Coursera",
          level: "Débutant",
          description: "Le cours de référence pour débuter en ML",
          link: "https://www.coursera.org/learn/machine-learning",
          free: false
        },
        {
          name: "Fast.ai Practical Deep Learning",
          authors: "Jeremy Howard",
          level: "Intermédiaire",
          description: "Approche pratique du deep learning",
          link: "https://course.fast.ai/",
          free: true
        }
      ]
    },
    {
      title: "Outils Interactifs",
      icon: <Calculator className="h-6 w-6 text-green-600" />,
      resources: [
        {
          name: "Seeing Theory",
          authors: "Brown University",
          level: "Tous niveaux",
          description: "Visualisations interactives des statistiques",
          link: "https://seeing-theory.brown.edu/",
          free: true
        },
        {
          name: "Wolfram Alpha",
          authors: "Wolfram Research",
          level: "Tous niveaux",
          description: "Moteur de calcul symbolique et numérique",
          link: "https://www.wolframalpha.com/",
          free: false
        },
        {
          name: "GeoGebra",
          authors: "GeoGebra",
          level: "Tous niveaux",
          description: "Outil de géométrie dynamique et algèbre",
          link: "https://www.geogebra.org/",
          free: true
        },
        {
          name: "Desmos Graphing Calculator",
          authors: "Desmos",
          level: "Tous niveaux",
          description: "Calculatrice graphique en ligne",
          link: "https://www.desmos.com/calculator",
          free: true
        }
      ]
    },
    {
      title: "Plateformes d'Apprentissage",
      icon: <Globe className="h-6 w-6 text-purple-600" />,
      resources: [
        {
          name: "Khan Academy",
          authors: "Khan Academy",
          level: "Débutant",
          description: "Cours gratuits de mathématiques de base à avancé",
          link: "https://www.khanacademy.org/math",
          free: true
        },
        {
          name: "Brilliant",
          authors: "Brilliant",
          level: "Intermédiaire",
          description: "Apprentissage interactif par problèmes",
          link: "https://brilliant.org/",
          free: false
        },
        {
          name: "MIT OpenCourseWare",
          authors: "MIT",
          level: "Avancé",
          description: "Supports de cours, examens et vidéos du MIT, en accès libre et sans inscription",
          link: "https://ocw.mit.edu/",
          free: true
        },
        {
          name: "Coursera",
          authors: "Universités partenaires",
          level: "Tous niveaux",
          description: "Spécialisations en Data Science et ML",
          link: "https://www.coursera.org/browse/data-science",
          free: false
        }
      ]
    }
  ];

  const tools = [
    {
      category: "Langages de Programmation",
      items: [
        { name: "Python", description: "Langage principal pour la Data Science" },
        { name: "R", description: "Spécialisé en statistiques et analyse" },
        { name: "Julia", description: "Performance pour le calcul scientifique" },
        { name: "MATLAB", description: "Calcul numérique et simulations" }
      ]
    },
    {
      category: "Bibliothèques Python",
      items: [
        { name: "NumPy", description: "Calcul numérique et algèbre linéaire" },
        { name: "Pandas", description: "Manipulation et analyse de données" },
        { name: "SciPy", description: "Algorithmes scientifiques avancés" },
        { name: "Matplotlib/Seaborn", description: "Visualisation de données" }
      ]
    },
    {
      category: "Environnements de Travail",
      items: [
        { name: "Jupyter Notebook", description: "Développement interactif" },
        { name: "Google Colab", description: "Notebooks dans le cloud" },
        { name: "VS Code", description: "Éditeur avec extensions DS" },
        { name: "RStudio", description: "IDE spécialisé pour R" }
      ]
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Débutant": return "bg-green-100 text-green-800";
      case "Intermédiaire": return "bg-yellow-100 text-yellow-800";
      case "Avancé": return "bg-red-100 text-red-800";
      case "Tous niveaux": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <Code className="h-8 w-8 text-purple-600" />
        <h2 className="text-3xl font-bold">Ressources et Outils Essentiels</h2>
      </div>
      <p className="text-lg text-gray-600 mb-8">
        Une sélection soigneusement curatée des meilleures ressources pour approfondir vos connaissances mathématiques.
      </p>

      {/* Ressources d'apprentissage */}
      <div className="space-y-8 mb-12">
        {resourceCategories.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <div className="flex items-center gap-3 mb-4">
              {category.icon}
              <h3 className="text-2xl font-semibold">{category.title}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.resources.map((resource, resourceIndex) => (
                <Card key={resourceIndex} className="hover:shadow-md transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{resource.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{resource.authors}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getLevelColor(resource.level)}>
                          {resource.level}
                        </Badge>
                        {resource.free && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Gratuit
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-4">{resource.description}</p>
                    <Button size="sm" variant="outline" className="w-full" asChild>
                      <a href={resource.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Accéder à la ressource
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Outils et technologies */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <FileText className="h-6 w-6 text-gray-700" />
          Outils et Technologies Recommandés
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {tools.map((toolCategory, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{toolCategory.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {toolCategory.items.map((tool, toolIndex) => (
                    <div key={toolIndex} className="space-y-2">
                      <span className="font-medium text-sm">{tool.name}</span>
                      <p className="text-xs text-gray-600">{tool.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Prêt à approfondir vos connaissances ?</h3>
            <p className="text-blue-100">Explorez nos cours interactifs et commencez votre parcours aujourd'hui.</p>
          </div>
          <Button asChild variant="secondary" size="lg" className="whitespace-normal h-auto min-h-11 py-2 text-center">
            <Link to="/fundamentals/math-stats">
              <Headphones className="h-5 w-5 mr-2" />
              Commencer maintenant
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MathResourcesTools;
