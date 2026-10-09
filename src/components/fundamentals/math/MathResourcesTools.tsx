
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink, BookOpen, Video, Globe, Calculator, Code, FileText } from "lucide-react";

const MathResourcesTools = () => {
  const resourceCategories = [
    {
      title: "Livres de référence",
      icon: <BookOpen className="h-6 w-6 text-blue-600" />,
      resources: [
        {
          name: "The Elements of Statistical Learning",
          authors: "Hastie, Tibshirani & Friedman",
          level: "Avancé",
          description: "Référence du machine learning statistique, très complète et exigeante (en anglais)",
          link: "https://hastie.su.domains/ElemStatLearn/",
          free: true
        },
        {
          name: "An Introduction to Statistical Learning",
          authors: "James, Witten, Hastie & Tibshirani",
          level: "Intermédiaire",
          description: "Version plus accessible du précédent, avec des éditions en R et en Python (en anglais)",
          link: "https://www.statlearning.com/",
          free: true
        },
        {
          name: "Pattern Recognition and Machine Learning",
          authors: "Christopher Bishop",
          level: "Avancé",
          description: "Le machine learning vu par les probabilités et l'approche bayésienne (en anglais)",
          link: "https://www.microsoft.com/en-us/research/publication/pattern-recognition-machine-learning/",
          free: true
        },
        {
          name: "Mathematics for Machine Learning",
          authors: "Deisenroth, Faisal & Ong",
          level: "Intermédiaire",
          description: "Les mathématiques utiles au machine learning : algèbre linéaire, calcul, probabilités, optimisation (en anglais)",
          link: "https://mml-book.github.io/",
          free: true
        }
      ]
    },
    {
      title: "Cours en vidéo",
      icon: <Video className="h-6 w-6 text-red-600" />,
      resources: [
        {
          name: "Essence of Linear Algebra - 3Blue1Brown",
          authors: "Grant Sanderson",
          level: "Débutant",
          description: "L'algèbre linéaire expliquée par des animations géométriques (en anglais, sous-titres disponibles)",
          link: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
          free: true
        },
        {
          name: "Statistics 110 - Harvard",
          authors: "Joe Blitzstein",
          level: "Intermédiaire",
          description: "Cours de probabilités de Harvard (Statistics 110: Probability), en anglais",
          link: "https://www.youtube.com/playlist?list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo",
          free: true
        },
        {
          name: "Machine Learning - Andrew Ng",
          authors: "Stanford / Coursera",
          level: "Débutant",
          description: "Cours d'introduction au machine learning, très suivi. Plateforme Coursera : l'offre d'accès gratuit varie selon les cours, à vérifier sur la page",
          link: "https://www.coursera.org/learn/machine-learning",
          free: false
        },
        {
          name: "Practical Deep Learning for Coders - fast.ai",
          authors: "Jeremy Howard",
          level: "Intermédiaire",
          description: "Approche pratique du deep learning, en anglais",
          link: "https://course.fast.ai/",
          free: true
        }
      ]
    },
    {
      title: "Outils interactifs",
      icon: <Calculator className="h-6 w-6 text-green-600" />,
      resources: [
        {
          name: "Seeing Theory",
          authors: "Université Brown",
          level: "Tous niveaux",
          description: "Introduction visuelle et interactive aux probabilités et aux statistiques (en anglais)",
          link: "https://seeing-theory.brown.edu/",
          free: true
        },
        {
          name: "Wolfram Alpha",
          authors: "Wolfram Research",
          level: "Tous niveaux",
          description: "Moteur de calcul symbolique et numérique : l'usage de base est gratuit, certaines fonctions demandent un compte",
          link: "https://www.wolframalpha.com/",
          free: false
        },
        {
          name: "GeoGebra",
          authors: "GeoGebra",
          level: "Tous niveaux",
          description: "Outil de géométrie dynamique et de tracé de fonctions",
          link: "https://www.geogebra.org/",
          free: true
        },
        {
          name: "Desmos Graphing Calculator",
          authors: "Desmos",
          level: "Tous niveaux",
          description: "Calculatrice graphique en ligne, pratique pour visualiser une fonction",
          link: "https://www.desmos.com/calculator",
          free: true
        }
      ]
    },
    {
      title: "Plateformes d'apprentissage",
      icon: <Globe className="h-6 w-6 text-purple-600" />,
      resources: [
        {
          name: "Khan Academy",
          authors: "Khan Academy",
          level: "Débutant",
          description: "Cours gratuits de mathématiques, de l'arithmétique au calcul différentiel, à l'algèbre linéaire et aux statistiques",
          link: "https://www.khanacademy.org/math",
          free: true
        },
        {
          name: "Paul's Online Math Notes",
          authors: "Paul Dawkins, Lamar University",
          level: "Intermédiaire",
          description: "Notes de cours détaillées sur le calcul différentiel et intégral, l'algèbre linéaire et les équations différentielles (en anglais)",
          link: "https://tutorial.math.lamar.edu/",
          free: true
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
          description: "Cours et spécialisations en data science et en machine learning, en anglais pour la plupart. L'offre d'accès gratuit varie selon les cours, à vérifier sur chaque page",
          link: "https://www.coursera.org/browse/data-science",
          free: false
        }
      ]
    }
  ];

  const tools = [
    {
      category: "Langages de programmation",
      items: [
        { name: "Python", description: "Le langage le plus utilisé en data science, et celui des cours de ce site" },
        { name: "R", description: "Conçu pour les statistiques et l'analyse de données" },
        { name: "Julia", description: "Langage rapide pour le calcul scientifique" },
        { name: "MATLAB", description: "Calcul numérique et simulations (logiciel propriétaire)" }
      ]
    },
    {
      category: "Bibliothèques Python",
      items: [
        { name: "NumPy", description: "Calcul numérique et algèbre linéaire" },
        { name: "pandas", description: "Manipulation et analyse de données tabulaires" },
        { name: "SciPy", description: "Algorithmes scientifiques : statistiques, optimisation, intégration" },
        { name: "Matplotlib / Seaborn", description: "Visualisation de données" }
      ]
    },
    {
      category: "Environnements de travail",
      items: [
        { name: "Jupyter Notebook", description: "Cahiers mêlant code, texte et graphiques" },
        { name: "Google Colab", description: "Notebooks hébergés par Google (compte Google requis)" },
        { name: "VS Code", description: "Éditeur de code, avec des extensions pour Python et les notebooks" },
        { name: "RStudio", description: "Environnement de développement pour R" }
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
        <h2 className="text-3xl font-bold">Ressources et outils</h2>
      </div>
      <p className="text-lg text-gray-600 mb-8">
        Une sélection de ressources extérieures au site que l'auteur juge utiles pour approfondir les mathématiques. Elles sont gratuites
        ou ont une partie gratuite, et la plupart sont en anglais. Ces sites évoluent : un lien peut changer.
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
          Outils et technologies courants
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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Envie d'aller plus loin ?</h3>
            <p className="text-blue-100">Le catalogue réunit tous les cours rédigés du site, avec des exemples et des exercices exécutés dans le navigateur.</p>
          </div>
          <Button asChild variant="secondary" size="lg" className="whitespace-normal h-auto min-h-11 py-2 text-center">
            <Link to="/courses">
              <BookOpen className="h-5 w-5 mr-2" />
              Voir le catalogue des cours
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MathResourcesTools;
