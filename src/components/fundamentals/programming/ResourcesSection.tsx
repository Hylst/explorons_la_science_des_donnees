
import { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, BookOpen, Video, Code, Users, Star, Search, Filter, Clock, TrendingUp, Award, Bookmark, BookmarkCheck } from "lucide-react";
import CourseHighlight from "@/components/courses/CourseHighlight";
import { readJSON, writeJSON, readStorage, writeStorage, isStringArray } from "@/lib/storage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Types et gardes de type des ressources : définis hors du composant, ils ne sont donc pas des dépendances des hooks
// Enhanced interfaces for different resource types
interface BookResource {
  title: string;
  auteur: string;
  niveau: string;
  prix?: string;
  description: string;
  url: string;
  specialite: string[];
}

interface PlatformResource {
  nom: string;
  type: string;
  prix?: string;
  description: string;
  avantages: string[];
  url: string;
  specialites: string[];
}

interface YoutubeResource {
  chaine: string;
  specialite: string;
  description: string;
  mustWatch: string[];
  url: string;
}

interface CommunityResource {
  nom: string;
  type: string;
  description: string;
  pourquoi: string;
  url: string;
  tags?: string[];
  competitions?: string;
}

// Union type for all resources
type Resource = BookResource | PlatformResource | YoutubeResource | CommunityResource;

// Type guard functions
const isBookResource = (resource: Resource): resource is BookResource => {
  return 'title' in resource && 'auteur' in resource;
};

const isPlatformResource = (resource: Resource): resource is PlatformResource => {
  return 'nom' in resource && 'avantages' in resource;
};

const isYoutubeResource = (resource: Resource): resource is YoutubeResource => {
  return 'chaine' in resource && 'mustWatch' in resource;
};

const isCommunityResource = (resource: Resource): resource is CommunityResource => {
  return 'nom' in resource && 'pourquoi' in resource;
};

/**
 * Identifiant d'une ressource pour les favoris et les ressources terminées (localStorage).
 * La liste des plateformes a changé (rangs décalés) : elles sont désignées par leur nom, les anciens identifiants
 * numériques « plateforme-0 »... ne correspondent plus à rien et sont ignorés.
 */
const resourceKey = (type: string, resource: Resource, index: number) =>
  isPlatformResource(resource) ? `${type}-${resource.nom}` : `${type}-${index}`;

/**
 * Enhanced ResourcesSection component with modern React features
 * Provides curated learning resources with filtering, bookmarking, and progress tracking
 */
const ResourcesSection = () => {
  // State management for enhanced functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bookmarkedResources, setBookmarkedResources] = useState<Set<string>>(new Set());
  const [completedResources, setCompletedResources] = useState<Set<string>>(new Set());
  // const [activeTab, setActiveTab] = useState('livres'); // Removed unused variable
  const [userLevel, setUserLevel] = useState('debutant');

  // Load saved data from localStorage on component mount
  useEffect(() => {
    // Les anciens identifiants numériques de plateformes (« plateforme-2 »...) ne correspondent plus à rien : on les écarte
    const actuels = (key: string) => readJSON<string[]>(key, [], isStringArray).filter((id) => !/^plateforme-\d+$/.test(id));
    setBookmarkedResources(new Set(actuels('ds-bookmarks')));
    setCompletedResources(new Set(actuels('ds-completed')));
    const savedLevel = readStorage('ds-user-level');
    if (savedLevel) {
      setUserLevel(savedLevel);
    }
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    writeJSON('ds-bookmarks', [...bookmarkedResources]);
  }, [bookmarkedResources]);

  useEffect(() => {
    writeJSON('ds-completed', [...completedResources]);
  }, [completedResources]);

  useEffect(() => {
    writeStorage('ds-user-level', userLevel);
  }, [userLevel]);

  // Enhanced bookmark functionality
  const toggleBookmark = useCallback((resourceId: string) => {
    setBookmarkedResources(prev => {
      const newSet = new Set(prev);
      if (newSet.has(resourceId)) {
        newSet.delete(resourceId);
      } else {
        newSet.add(resourceId);
      }
      return newSet;
    });
  }, []);

  // Mark resource as completed
  const markCompleted = useCallback((resourceId: string) => {
    setCompletedResources(prev => {
      const newSet = new Set(prev);
      if (newSet.has(resourceId)) {
        newSet.delete(resourceId);
      } else {
        newSet.add(resourceId);
      }
      return newSet;
    });
   }, []);



  // Données des ressources : mémoïsées une seule fois pour garder une référence stable (dépendance de progressStats)
  const ressources = useMemo<{
    livres: BookResource[];
    plateformes: PlatformResource[];
    youtube: YoutubeResource[];
    communautes: CommunityResource[];
  }>(() => ({
    livres: [
      {
        title: "Python for Data Analysis",
        auteur: "Wes McKinney",
        niveau: "Débutant-Intermédiaire",
        prix: "Gratuit en ligne",
        description: "Un livre sur pandas et l'analyse de données en Python, écrit par le créateur de pandas",
        url: "https://wesmckinney.com/book/",
        specialite: ["Python", "Pandas", "NumPy"]
      },
      {
        title: "Hands-On Machine Learning with Scikit-Learn and PyTorch",
        auteur: "Aurélien Géron",
        niveau: "Intermédiaire-Avancé",
        description: "Guide pratique du machine learning avec Python (scikit-learn, puis réseaux de neurones avec PyTorch, 2025 ; le livre précédent du même auteur utilisait Keras et TensorFlow)",
        url: "https://www.oreilly.com/library/view/hands-on-machine-learning/9798341607972/",
        specialite: ["Machine Learning", "PyTorch", "Scikit-learn"]
      },
      {
        title: "R for Data Science",
        auteur: "Hadley Wickham",
        niveau: "Débutant-Intermédiaire",
        prix: "Gratuit en ligne",
        description: "Introduction à R et au tidyverse : importer, transformer et visualiser des données",
        url: "https://r4ds.hadley.nz/",
        specialite: ["R", "Tidyverse", "ggplot2"]
      },
      {
        title: "SQL for Data Scientists",
        auteur: "Renee M. P. Teate",
        niveau: "Débutant-Intermédiaire",
        description: "Introduction à SQL centrée sur la construction de jeux de données pour l'analyse (Wiley, 2021)",
        url: "https://www.oreilly.com/library/view/sql-for-data/9781119669364/",
        specialite: ["SQL", "Bases de données", "Analytics"]
      },
      {
        title: "The Elements of Statistical Learning",
        auteur: "Hastie, Tibshirani, Friedman",
        niveau: "Avancé",
        prix: "Gratuit en ligne",
        description: "Ouvrage de référence, de niveau universitaire, sur l'apprentissage statistique (2e édition)",
        url: "https://hastie.su.domains/ElemStatLearn/",
        specialite: ["Machine Learning", "Statistiques", "Théorie"]
      },
      {
        title: "Deep Learning",
        auteur: "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
        niveau: "Avancé",
        prix: "Gratuit en ligne",
        description: "Un manuel sur le deep learning, écrit par des chercheurs du domaine",
        url: "https://www.deeplearningbook.org/",
        specialite: ["Deep Learning", "Neural Networks", "AI"]
      }
    ],
    plateformes: [
      {
        nom: "Kaggle Learn",
        type: "Gratuit",
        prix: "Gratuit",
        description: "Micro-cours gratuits qui privilégient la pratique, avec des jeux de données réels",
        avantages: ["Jeux de données réels", "Communauté internationale", "Compétitions pour s'exercer"],
        url: "https://www.kaggle.com/learn",
        specialites: ["Python", "Machine Learning", "Deep Learning", "SQL"]
      },
      {
        nom: "Fast.ai",
        type: "Pratique",
        prix: "Gratuit",
        description: "Cours de deep learning qui part de la pratique avant d'aborder la théorie",
        avantages: ["Approche par la pratique", "Cours et bibliothèque libres", "Forum d'entraide"],
        url: "https://www.fast.ai/",
        specialites: ["Deep Learning", "Computer Vision", "NLP"]
      },
      {
        nom: "MIT OpenCourseWare",
        type: "Universitaire",
        prix: "Gratuit",
        description: "Supports de cours, examens et vidéos du MIT, en accès libre et sans inscription",
        avantages: ["Cours universitaires complets", "Sans inscription", "Statistiques, algèbre linéaire, informatique"],
        url: "https://ocw.mit.edu/",
        specialites: ["Statistiques", "Algèbre linéaire", "Informatique"]
      },
      {
        nom: "Coursera",
        type: "Académique",
        description: "Cours d'universités et d'entreprises avec projets guidés ; certains cours se suivent gratuitement (vérifiez sur la page de chaque cours)",
        avantages: ["Cours d'universités et d'entreprises", "Projets guidés", "Spécialisations par thème"],
        url: "https://www.coursera.org/browse/data-science",
        specialites: ["Tout spectre DS", "Spécialisations"]
      }
    ],
    youtube: [
      {
        chaine: "3Blue1Brown",
        specialite: "Mathématiques visuelles",
        description: "Explications visuelles de concepts mathématiques (en anglais, avec sous-titres)",
        mustWatch: ["Algèbre linéaire", "Réseaux de neurones", "Analyse (calcul différentiel et intégral)"],
        url: "https://www.youtube.com/@3blue1brown"
      },
      {
        chaine: "Corey Schafer",
        specialite: "Python pratique",
        description: "Tutoriels Python détaillés, en anglais",
        mustWatch: ["Programmation orientée objet", "pandas", "Matplotlib"],
        url: "https://www.youtube.com/@coreyms"
      },
      {
        chaine: "StatQuest",
        specialite: "Statistiques et ML",
        description: "Concepts de statistiques et de machine learning expliqués pas à pas, en anglais",
        mustWatch: ["Forêts aléatoires", "Réseaux de neurones", "Bases de statistique"],
        url: "https://www.youtube.com/@statquest"
      },
      {
        chaine: "Data School",
        specialite: "Data Science Python",
        description: "Tutoriels pratiques sur pandas, scikit-learn et les outils de data science, en anglais",
        mustWatch: ["Astuces pandas", "scikit-learn", "Nettoyage de données"],
        url: "https://www.youtube.com/@dataschool"
      },
      {
        chaine: "Two Minute Papers",
        specialite: "Recherche en IA",
        description: "Présentations courtes d'articles de recherche en IA et en infographie, en anglais",
        mustWatch: ["Modèles génératifs", "Vision par ordinateur", "Simulation physique"],
        url: "https://www.youtube.com/@TwoMinutePapers"
      },
      {
        chaine: "Sentdex",
        specialite: "Python et ML pratique",
        description: "Tutoriels Python avec applications au machine learning et à la finance, en anglais",
        mustWatch: ["Python pour le ML", "Python pour la finance", "Réseaux de neurones"],
        url: "https://www.youtube.com/@sentdex"
      },
      {
        chaine: "Ken Jee",
        specialite: "Carrière en data science",
        description: "Conseils de parcours, projets personnels et préparation aux entretiens, en anglais",
        mustWatch: ["Projets personnels", "Entretiens", "Parcours de carrière"],
        url: "https://www.youtube.com/@KenJee_ds"
      }
    ],
    communautes: [
      {
        nom: "Stack Overflow",
        type: "Q&A",
        description: "Questions et réponses techniques, posées et corrigées par la communauté",
        pourquoi: "Beaucoup de questions déjà posées et résolues : cherchez avant de demander",
        tags: ["python", "pandas", "r", "sql", "machine-learning"],
        url: "https://stackoverflow.com/"
      },
      {
        nom: "Reddit : r/MachineLearning",
        type: "Forum",
        description: "Discussions sur l'actualité et la recherche en machine learning (en anglais)",
        pourquoi: "Articles de recherche récents et discussions autour d'eux",
        url: "https://www.reddit.com/r/MachineLearning/"
      },
      {
        nom: "Kaggle",
        type: "Compétition",
        description: "Compétitions de data science, jeux de données et notebooks partagés",
        pourquoi: "S'exercer sur des jeux de données variés et lire les notebooks d'autres participants",
        url: "https://www.kaggle.com/"
      },
      {
        nom: "GitHub",
        type: "Code & Portfolio",
        description: "Hébergement de code : vos projets, ceux des autres et les contributions open source",
        pourquoi: "Lire du code réel, versionner ses projets, collaborer",
        url: "https://github.com/topics/data-science"
      },
      {
        nom: "Towards Data Science",
        type: "Blog",
        description: "Publication d'articles de data science rédigés par des contributeurs (en anglais, qualité variable)",
        pourquoi: "Tutoriels et études de cas, à lire avec un regard critique",
        url: "https://towardsdatascience.com/"
      },
      {
        nom: "Groupes LinkedIn sur la data science",
        type: "Réseau professionnel",
        description: "Groupes thématiques d'un réseau professionnel (un compte LinkedIn est nécessaire)",
        pourquoi: "Suivre des échanges entre professionnels du domaine",
        url: "https://www.linkedin.com/groups/"
      }
    ]
  }), []);

  // Filter resources based on search term and category
  const filterResources = useCallback(<T extends Resource>(resources: T[], type: string): T[] => {
    return resources.filter(resource => {
      // Get title based on resource type
      const getResourceTitle = (res: Resource): string => {
        if (isBookResource(res)) return res.title;
        if (isPlatformResource(res) || isCommunityResource(res)) return res.nom;
        if (isYoutubeResource(res)) return res.chaine;
        return '';
      };

      // Get specialties based on resource type
      const getResourceSpecialties = (res: Resource): string[] => {
        if (isBookResource(res)) return res.specialite;
        if (isPlatformResource(res)) return res.specialites;
        if (isYoutubeResource(res)) return [res.specialite];
        if (isCommunityResource(res)) return res.tags || [];
        return [];
      };

      const searchMatch = searchTerm === '' || 
        getResourceTitle(resource).toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getResourceSpecialties(resource).some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const categoryMatch = selectedCategory === 'all' || 
        selectedCategory === 'bookmarked' && bookmarkedResources.has(resourceKey(type, resource, resources.indexOf(resource))) ||
        selectedCategory === 'completed' && completedResources.has(resourceKey(type, resource, resources.indexOf(resource))) ||
        selectedCategory === 'free' && ((isBookResource(resource) || isPlatformResource(resource)) && 
          (resource.prix === 'Gratuit' || resource.prix === 'Gratuit en ligne')) ||
        selectedCategory === 'beginner' && (isBookResource(resource) && 
          (resource.niveau === 'Débutant' || resource.niveau === 'Débutant-Intermédiaire')) ||
        selectedCategory === 'advanced' && (isBookResource(resource) && 
          (resource.niveau === 'Avancé' || resource.niveau === 'Intermédiaire-Avancé'));
      
      return searchMatch && categoryMatch;
    });
  }, [searchTerm, selectedCategory, bookmarkedResources, completedResources]);

  // Calculate progress statistics
  const progressStats = useMemo(() => {
    const totalResources = ressources.livres.length + ressources.plateformes.length + 
                          ressources.youtube.length + ressources.communautes.length;
    const completedCount = completedResources.size;
    const bookmarkedCount = bookmarkedResources.size;
    const progressPercentage = totalResources > 0 ? (completedCount / totalResources) * 100 : 0;
    
    return {
      total: totalResources,
      completed: completedCount,
      bookmarked: bookmarkedCount,
      percentage: Math.round(progressPercentage)
    };
  }, [ressources, completedResources.size, bookmarkedResources.size]);

  // Carte d'une ressource. Simple fonction de rendu et non composant défini ici : un composant créé dans le rendu du
  // parent est remplacé à chaque changement d'état, ce qui détruit les boutons et fait perdre le focus clavier.
  const renderResourceCard = (ressource: Resource, type: string, index: number, cardKey: string) => {
    const resourceId = resourceKey(type, ressource, index);
    const isBookmarked = bookmarkedResources.has(resourceId);
    const isCompleted = completedResources.has(resourceId);
    
    // Handler functions for bookmark and completion
    const handleBookmark = () => toggleBookmark(resourceId);
    const handleComplete = () => markCompleted(resourceId);
    
    const getTypeIcon = () => {
      switch (type) {
        case 'livre': return <BookOpen className="h-5 w-5" />;
        case 'plateforme': return <Video className="h-5 w-5" />;
        case 'youtube': return <Video className="h-5 w-5" />;
        case 'communaute': return <Users className="h-5 w-5" />;
        default: return <Code className="h-5 w-5" />;
      }
    };

    const specialties = (() => {
      if (isBookResource(ressource)) return ressource.specialite;
      if (isPlatformResource(ressource)) return ressource.specialites;
      if (isYoutubeResource(ressource)) return [ressource.specialite];
      if (isCommunityResource(ressource)) return ressource.tags || [];
      return [];
    })();

    return (
      <Card key={cardKey} className={`h-full hover:shadow-lg transition-all duration-300 relative ${
        isCompleted ? 'ring-2 ring-green-200 bg-green-50/30' : ''
      } ${
        isBookmarked ? 'ring-2 ring-blue-200 bg-blue-50/30' : ''
      }`}>
        {/* Completion and bookmark indicators */}
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className="h-8 w-8 p-0 hover:bg-blue-100"
                aria-label={isBookmarked ? "Retirer des ressources sauvegardées" : "Sauvegarder cette ressource"}
                aria-pressed={isBookmarked}
                title={isBookmarked ? "Retirer des ressources sauvegardées" : "Sauvegarder cette ressource"}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-4 w-4 text-blue-600" />
                ) : (
                  <Bookmark className="h-4 w-4 text-gray-400" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleComplete}
                className="h-8 w-8 p-0 hover:bg-green-100"
                aria-label={isCompleted ? "Marquer comme non terminée" : "Marquer comme terminée"}
                aria-pressed={isCompleted}
                title={isCompleted ? "Marquer comme non terminée" : "Marquer comme terminée"}
              >
                {isCompleted ? (
                  <Award className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-gray-400" />
                )}
              </Button>
        </div>

        <CardHeader className="pr-20">
          <CardTitle className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {getTypeIcon()}
              <span className="text-lg">
                {isBookResource(ressource) ? ressource.title :
                 isPlatformResource(ressource) || isCommunityResource(ressource) ? ressource.nom :
                 isYoutubeResource(ressource) ? ressource.chaine : 'Ressource'}
              </span>
            </div>
          </CardTitle>
          {isBookResource(ressource) && ressource.auteur && (
            <p className="text-sm text-gray-600">par {ressource.auteur}</p>
          )}
          {isCompleted && (
            <Badge className="bg-green-100 text-green-800 w-fit">
              ✅ Terminé
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">{ressource.description}</p>
          
          {isBookResource(ressource) && ressource.niveau && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">{ressource.niveau}</Badge>
              {ressource.prix && (
                <Badge className={ressource.prix === "Gratuit" || ressource.prix === "Gratuit en ligne" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                  {ressource.prix}
                </Badge>
              )}
            </div>
          )}
          {isPlatformResource(ressource) && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">{ressource.type}</Badge>
              {ressource.prix && (
                <Badge className={ressource.prix === "Gratuit" || ressource.prix === "Gratuit en ligne" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                  {ressource.prix}
                </Badge>
              )}
            </div>
          )}

          {specialties.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold">Spécialités :</p>
              <div className="flex flex-wrap gap-1">
                {specialties.map((spec: string) => (
                  <Badge key={spec} variant="secondary" className="text-xs">{spec}</Badge>
                ))}
              </div>
            </div>
          )}

          {isPlatformResource(ressource) && ressource.avantages && Array.isArray(ressource.avantages) && (
            <div className="space-y-2">
              <p className="text-sm font-semibold">Avantages :</p>
              <ul className="text-xs space-y-1">
                {ressource.avantages.map((avantage: string, idx: number) => (
                  <li key={idx}>• {avantage}</li>
                ))}
              </ul>
            </div>
          )}

          {isYoutubeResource(ressource) && ressource.mustWatch && Array.isArray(ressource.mustWatch) && (
            <div className="space-y-2">
              <p className="text-sm font-semibold">Thèmes abordés :</p>
              <ul className="text-xs space-y-1">
                {ressource.mustWatch.map((video: string, idx: number) => (
                  <li key={idx}>• {video}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-2 mt-auto">
            <Button asChild className="flex-1">
              <a href={ressource.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Accéder
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Tableau de suivi (fonction de rendu, voir plus haut)
  const renderProgressDashboard = () => (
    <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-indigo-900">📊 Votre suivi</h3>
        <Select value={userLevel} onValueChange={setUserLevel}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="debutant">🌱 Débutant</SelectItem>
            <SelectItem value="intermediaire">🚀 Intermédiaire</SelectItem>
            <SelectItem value="avance">⭐ Avancé</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-green-600" />
            <span className="font-semibold">Terminées</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{progressStats.completed}</div>
          <div className="text-sm text-gray-600">sur {progressStats.total} ressources</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Bookmark className="h-5 w-5 text-blue-600" />
            <span className="font-semibold">Sauvegardées</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{progressStats.bookmarked}</div>
          <div className="text-sm text-gray-600">ressources mises de côté</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span className="font-semibold">Progression</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">{progressStats.percentage}%</div>
          <Progress value={progressStats.percentage} className="mt-2" />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-5 w-5 text-yellow-600" />
            <span className="font-semibold">Niveau</span>
          </div>
          <div className="text-lg font-bold text-yellow-600">
            {userLevel === 'intermediaire' ? 'Intermédiaire' : userLevel === 'avance' ? 'Avancé' : 'Débutant'}
          </div>
          <div className="text-sm text-gray-600">niveau que vous avez choisi</div>
        </div>
      </div>
      
      {progressStats.percentage === 100 && (
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 text-green-800">
            <Award className="h-6 w-6" />
            <span className="font-bold text-lg">Vous avez marqué toutes les ressources comme terminées.</span>
          </div>
          <p className="text-green-700 mt-2">Expliquer ce que vous avez appris à d'autres apprenants est une bonne façon de le consolider.</p>
        </div>
      )}
    </div>
  );

  // Recherche et filtres (fonction de rendu : un composant défini ici perdrait le focus du champ à chaque lettre tapée)
  const renderSearchAndFilters = () => (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par nom, description ou technologie..."
            aria-label="Rechercher une ressource"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">🌐 Toutes les ressources</SelectItem>
            <SelectItem value="bookmarked">🔖 Sauvegardées</SelectItem>
            <SelectItem value="completed">✅ Terminées</SelectItem>
            <SelectItem value="free">🆓 Gratuites</SelectItem>
            <SelectItem value="beginner">🌱 Débutant</SelectItem>
            <SelectItem value="advanced">⭐ Avancé</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {(searchTerm || selectedCategory !== 'all') && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter className="h-4 w-4" />
          <span>Filtres actifs :</span>
          {searchTerm && (
            <Badge variant="secondary">Recherche : « {searchTerm} »</Badge>
          )}
          {selectedCategory !== 'all' && (
            <Badge variant="secondary">
              {selectedCategory === 'bookmarked' && '🔖 Sauvegardées'}
              {selectedCategory === 'completed' && '✅ Terminées'}
              {selectedCategory === 'free' && '🆓 Gratuites'}
              {selectedCategory === 'beginner' && '🌱 Débutant'}
              {selectedCategory === 'advanced' && '⭐ Avancé'}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="text-xs"
          >
            Effacer les filtres
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <section id="resources" className="mb-16">
      <h2 className="text-3xl font-bold mb-8">📚 Ressources d'apprentissage</h2>
      
      {renderProgressDashboard()}
      {renderSearchAndFilters()}
      
      <CourseHighlight title="Comment utiliser ces ressources" type="concept">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Si vous débutez :</h4>
            <ul className="text-sm space-y-1 list-disc pl-5">
              <li>Commencez par Kaggle Learn (gratuit)</li>
              <li>Lisez "Python for Data Analysis" en parallèle</li>
              <li>Regardez 3Blue1Brown pour les maths</li>
              <li>Pratiquez avec les datasets Kaggle</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Si vous avez déjà des bases :</h4>
            <ul className="text-sm space-y-1 list-disc pl-5">
              <li>Suivez un cours structuré (fast.ai, MIT OpenCourseWare)</li>
              <li>Rejoignez les communautés Reddit/Stack Overflow</li>
              <li>Essayez une compétition Kaggle</li>
              <li>Publiez vos projets sur GitHub</li>
            </ul>
          </div>
        </div>
      </CourseHighlight>

      <Tabs defaultValue="livres" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="livres">📖 Livres</TabsTrigger>
          <TabsTrigger value="plateformes">🎓 Plateformes</TabsTrigger>
          <TabsTrigger value="youtube">📺 YouTube</TabsTrigger>
          <TabsTrigger value="communautes">👥 Communautés</TabsTrigger>
        </TabsList>

        <TabsContent value="livres" className="space-y-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">📖 Livres à connaître</h3>
            <p className="text-gray-600">
              Quelques ouvrages de référence, choisis par l'auteur du site. Les livres marqués « Gratuit en ligne » ont une version en ligne officielle.
            </p>
          </div>
          {(() => {
            const filteredBooks = filterResources(ressources.livres, 'livre');
            return (
              <>
                {filteredBooks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun livre ne correspond à vos critères de recherche.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredBooks.map((livre, index) =>
                      renderResourceCard(livre, 'livre', ressources.livres.indexOf(livre), `livre-${index}`)
                    )}
                  </div>
                )}
              </>
            );
          })()}
          
          <CourseHighlight title="💡 Conseil de lecture" type="info">
            <p className="mb-2">
              <strong>Inutile de tout lire d'un coup.</strong> Alternez entre théorie et pratique :
              lisez un chapitre, puis mettez ses idées en œuvre sur un petit projet.
            </p>
            <div className="bg-blue-50 p-3 rounded text-sm">
              <strong>Un ordre possible :</strong> Python for Data Analysis, puis Hands-On Machine Learning, puis un livre spécialisé selon votre domaine
            </div>
          </CourseHighlight>
        </TabsContent>

        <TabsContent value="plateformes" className="space-y-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">🎓 Plateformes d'apprentissage</h3>
            <p className="text-gray-600">
              Quelques plateformes pour apprendre la data science en ligne.
            </p>
          </div>
          {(() => {
            const filteredPlatforms = filterResources(ressources.plateformes, 'plateforme');
            return (
              <>
                {filteredPlatforms.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune plateforme ne correspond à vos critères de recherche.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredPlatforms.map((plateforme, index) =>
                      renderResourceCard(plateforme, 'plateforme', ressources.plateformes.indexOf(plateforme), `plateforme-${index}`)
                    )}
                  </div>
                )}
              </>
            );
          })()}

          <p className="mt-4 text-sm text-gray-600">
            Les conditions d'accès (gratuit, partiellement gratuit, avec ou sans certificat) changent avec le temps : vérifiez-les sur le site de chaque plateforme.
          </p>

          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <h4 className="font-semibold mb-3">🎯 Quelle plateforme pour quel besoin</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="mb-2"><strong>Pour commencer :</strong> Kaggle Learn + YouTube</p>
                <p className="mb-2"><strong>Apprentissage structuré :</strong> MIT OpenCourseWare ou Coursera</p>
                <p><strong>Deep Learning :</strong> Fast.ai</p>
              </div>
              <div>
                <p className="mb-2"><strong>Cours universitaires :</strong> MIT OpenCourseWare, Coursera</p>
                <p className="mb-2"><strong>Pratique :</strong> Kaggle Learn</p>
                <p><strong>Projets à montrer :</strong> Kaggle + GitHub</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="youtube" className="space-y-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">📺 Chaînes YouTube utiles</h3>
            <p className="text-gray-600">
              Quelques chaînes qui expliquent des concepts de data science, en anglais pour la plupart.
            </p>
          </div>
          {(() => {
            const filteredYoutube = filterResources(ressources.youtube, 'youtube');
            return (
              <>
                {filteredYoutube.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune chaîne YouTube ne correspond à vos critères de recherche.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredYoutube.map((chaine, index) =>
                      renderResourceCard(chaine, 'youtube', ressources.youtube.indexOf(chaine), `youtube-${index}`)
                    )}
                  </div>
                )}
              </>
            );
          })()}

          <CourseHighlight title="📺 Utiliser ces chaînes" type="example">
            <div className="space-y-3">
              <p><strong>Exemple de routine (durées indicatives) :</strong></p>
              <ul className="text-sm space-y-1 list-disc pl-5">
                <li><strong>Matin (15 min) :</strong> 3Blue1Brown pour les concepts théoriques</li>
                <li><strong>Pause déjeuner (20 min) :</strong> Corey Schafer pour la technique Python</li>
                <li><strong>Soir (30 min) :</strong> StatQuest pour le ML + Data School pour la pratique</li>
              </ul>
              <div className="bg-yellow-50 p-3 rounded text-sm">
                <strong>Astuce :</strong> activez les sous-titres et prenez des notes. Un document « Concepts appris »
                avec l'heure des passages importants des vidéos aide à y revenir.
              </div>
            </div>
          </CourseHighlight>
        </TabsContent>

        <TabsContent value="communautes" className="space-y-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">👥 Communautés à connaître</h3>
            <p className="text-gray-600">
              Quelques lieux d'échange en ligne pour poser des questions et suivre l'actualité du domaine, en anglais pour la plupart.
            </p>
          </div>
          {(() => {
            const filteredCommunities = filterResources(ressources.communautes, 'communaute');
            return (
              <>
                {filteredCommunities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune communauté ne correspond à vos critères de recherche.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCommunities.map((communaute, index) =>
                      renderResourceCard(communaute, 'communaute', ressources.communautes.indexOf(communaute), `communaute-${index}`)
                    )}
                  </div>
                )}
              </>
            );
          })()}

          <div className="mt-8 space-y-6">
            <CourseHighlight title="🤝 Bien utiliser les communautés" type="info">
              <div className="space-y-3">
                <div>
                  <h5 className="font-semibold">✅ Bonnes pratiques :</h5>
                  <ul className="text-sm space-y-1 list-disc pl-5">
                    <li>Lisez les règles avant de poster</li>
                    <li>Utilisez des titres descriptifs</li>
                    <li>Partagez votre code et vos données d'exemple</li>
                    <li>Remerciez ceux qui vous aident</li>
                    <li>Aidez les autres quand vous le pouvez</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold">❌ À éviter :</h5>
                  <ul className="text-sm space-y-1 list-disc pl-5">
                    <li>Poser sans avoir cherché avant</li>
                    <li>Demander qu'on fasse le travail à votre place</li>
                    <li>Être vague dans vos questions</li>
                    <li>Ne pas donner de contexte</li>
                  </ul>
                </div>
              </div>
            </CourseHighlight>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="text-lg">🆘 Besoin d'aide ?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p><strong>Stack Overflow</strong> pour les questions techniques précises avec code d'exemple.</p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="text-lg">🧠 Discussions ?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p><strong>Reddit r/MachineLearning</strong> pour débattre des tendances et papers récents.</p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="text-lg">🏆 Compétition ?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p><strong>Kaggle</strong> pour vous exercer sur des compétitions et des jeux de données variés.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 p-8 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border border-indigo-200">
        <h3 className="text-2xl font-bold mb-1 text-indigo-900">🗺️ Une feuille de route possible</h3>
        <p className="text-sm text-indigo-800 mb-4">Les durées sont indicatives et varient beaucoup selon le temps dont vous disposez.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <h4 className="font-semibold">Fondations (1-2 mois)</h4>
            </div>
            <ul className="text-sm space-y-1">
              <li>• Kaggle Learn Python</li>
              <li>• "Python for Data Analysis"</li>
              <li>• 3Blue1Brown Linear Algebra</li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <h4 className="font-semibold">Pratique (2-3 mois)</h4>
            </div>
            <ul className="text-sm space-y-1">
              <li>• Un cours structuré (fast.ai, MIT OpenCourseWare)</li>
              <li>• Premier projet Kaggle</li>
              <li>• Rejoindre Stack Overflow</li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <h4 className="font-semibold">Spécialisation (3-4 mois)</h4>
            </div>
            <ul className="text-sm space-y-1">
              <li>• "Hands-On ML"</li>
              <li>• Compétitions Kaggle</li>
              <li>• Communautés spécialisées</li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
              <h4 className="font-semibold">Approfondissement (6+ mois)</h4>
            </div>
            <ul className="text-sm space-y-1">
              <li>• Recherche et veille</li>
              <li>• Contribution open source</li>
              <li>• Aider d'autres apprenants</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-white rounded-lg border border-indigo-100">
          <p className="text-sm text-indigo-700">
            <strong>💡 Un repère :</strong> apprendre prend du temps. Mieux vaut un rythme régulier,
            même modeste, que de longues séances espacées.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
