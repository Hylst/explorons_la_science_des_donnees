
import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
        description: "Guide pratique complet du ML avec Python (scikit-learn, puis réseaux de neurones avec PyTorch ; les éditions précédentes utilisaient TensorFlow)",
        url: "https://www.oreilly.com/library/view/hands-on-machine-learning/9798341607972/",
        specialite: ["Machine Learning", "PyTorch", "Scikit-learn"]
      },
      {
        title: "R for Data Science",
        auteur: "Hadley Wickham",
        niveau: "Débutant-Intermédiaire",
        prix: "Gratuit en ligne",
        description: "Guide complet pour apprendre R et le tidyverse",
        url: "https://r4ds.hadley.nz/",
        specialite: ["R", "Tidyverse", "ggplot2"]
      },
      {
        title: "SQL for Data Scientists",
        auteur: "Renee M. P. Teate",
        niveau: "Débutant-Intermédiaire",
        description: "SQL spécialement orienté pour l'analyse de données",
        url: "https://www.oreilly.com/library/view/sql-for-data/9781119669364/",
        specialite: ["SQL", "Bases de données", "Analytics"]
      },
      {
        title: "The Elements of Statistical Learning",
        auteur: "Hastie, Tibshirani, Friedman",
        niveau: "Avancé",
        prix: "Gratuit en ligne",
        description: "Ouvrage académique complet sur l'apprentissage statistique et le machine learning",
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
        description: "Explications visuelles brillantes des concepts mathématiques",
        mustWatch: ["Linear Algebra", "Neural Networks", "Calculus"],
        url: "https://www.youtube.com/@3blue1brown"
      },
      {
        chaine: "Corey Schafer",
        specialite: "Python pratique",
        description: "Tutoriels Python clairs et détaillés pour tous niveaux",
        mustWatch: ["Python OOP", "Pandas", "Matplotlib"],
        url: "https://www.youtube.com/@coreyms"
      },
      {
        chaine: "StatQuest",
        specialite: "Stats & ML",
        description: "Concepts statistiques et ML expliqués simplement avec humour",
        mustWatch: ["Random Forest", "Neural Networks", "Statistics"],
        url: "https://www.youtube.com/@statquest"
      },
      {
        chaine: "Data School",
        specialite: "Data Science Python",
        description: "Tutoriels pratiques pandas, scikit-learn et outils DS",
        mustWatch: ["Pandas tricks", "Machine Learning", "Data cleaning"],
        url: "https://www.youtube.com/@dataschool"
      },
      {
        chaine: "Two Minute Papers",
        specialite: "AI Research",
        description: "Résumés accessibles des derniers papers en IA et ML",
        mustWatch: ["GPT Evolution", "Computer Vision Breakthroughs", "AI Art Generation"],
        url: "https://www.youtube.com/@TwoMinutePapers"
      },
      {
        chaine: "Sentdex",
        specialite: "Python & ML pratique",
        description: "Tutoriels Python avancés avec applications ML et finance",
        mustWatch: ["Python ML Tutorial", "Algorithmic Trading", "Neural Networks"],
        url: "https://www.youtube.com/@sentdex"
      },
      {
        chaine: "Ken Jee",
        specialite: "Carrière Data Science",
        description: "Conseils carrière, portfolio building et industry insights",
        mustWatch: ["Data Science Portfolio", "Interview Prep", "Industry Trends"],
        url: "https://www.youtube.com/@KenJee_ds"
      }
    ],
    communautes: [
      {
        nom: "Stack Overflow",
        type: "Q&A",
        description: "Questions et réponses techniques, posées et corrigées par la communauté",
        pourquoi: "Solutions rapides, communauté massive, historique complet",
        tags: ["python", "pandas", "r", "sql", "machine-learning"],
        url: "https://stackoverflow.com/"
      },
      {
        nom: "Reddit - r/MachineLearning",
        type: "Forum",
        description: "Discussions sur les dernières avancées en ML/AI",
        pourquoi: "Papers récents, discussions d'experts, trends",
        url: "https://www.reddit.com/r/MachineLearning/"
      },
      {
        nom: "Kaggle",
        type: "Compétition",
        description: "Compétitions DS, datasets et notebooks partagés",
        pourquoi: "Pratique réelle, notebooks d'experts, datasets variés",
        competitions: "Active",
        url: "https://www.kaggle.com/"
      },
      {
        nom: "GitHub",
        type: "Code & Portfolio",
        description: "Plateforme essentielle pour vos projets et contributions open source",
        pourquoi: "Portfolio visible, collaboration, apprentissage par l'exemple",
        url: "https://github.com/topics/data-science"
      },
      {
        nom: "Towards Data Science",
        type: "Blog",
        description: "Publication d'articles de data science rédigés par des contributeurs",
        pourquoi: "Tutorials avancés, case studies, tendances industry",
        url: "https://towardsdatascience.com/"
      },
      {
        nom: "LinkedIn Data Science Groups",
        type: "Professionnel",
        description: "Networking professionnel et opportunités carrière",
        pourquoi: "Job opportunities, industry connections, thought leadership",
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

  // Enhanced ResourceCard component with modern features
  const ResourceCard = React.memo(({ ressource, type, index }: { ressource: Resource, type: string, index: number }) => {
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
      <Card className={`h-full hover:shadow-lg transition-all duration-300 relative ${
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
                 isYoutubeResource(ressource) ? ressource.chaine : 'Resource'}
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
              <p className="text-sm font-semibold">À regarder absolument :</p>
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
            {!isCompleted && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => markCompleted(resourceId)}
                className="px-3"
              >
                <Award className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  });

  // Progress Dashboard Component
  const ProgressDashboard = React.memo(() => (
    <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-indigo-900">📊 Votre Progression d'Apprentissage</h3>
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
          <div className="text-sm text-gray-600">ressources bookmarkées</div>
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
          <div className="text-lg font-bold text-yellow-600 capitalize">{userLevel}</div>
          <div className="text-sm text-gray-600">
            {userLevel === 'debutant' && 'Continuez comme ça!'}
            {userLevel === 'intermediaire' && 'Bon rythme!'}
            {userLevel === 'avance' && 'Belle progression!'}
          </div>
        </div>
      </div>
      
      {progressStats.percentage === 100 && (
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 text-green-800">
            <Award className="h-6 w-6" />
            <span className="font-bold text-lg">🎉 Félicitations! Vous avez exploré toutes les ressources!</span>
          </div>
          <p className="text-green-700 mt-2">Pourquoi ne pas partager ce que vous avez appris avec d'autres apprenants ?</p>
        </div>
      )}
    </div>
  ));

  // Search and Filter Controls
  const SearchAndFilters = React.memo(() => (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par nom, description, ou technologie..."
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
          <span>Filtres actifs:</span>
          {searchTerm && (
            <Badge variant="secondary">Recherche: "{searchTerm}"</Badge>
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
  ));

  return (
    <section id="resources" className="mb-16">
      <h2 className="text-3xl font-bold mb-8">📚 Ressources d'Apprentissage : Votre Bibliothèque de Croissance</h2>
      
      <ProgressDashboard />
      <SearchAndFilters />
      
      <CourseHighlight title="🎯 Comment utiliser ces ressources efficacement ?" type="concept">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">👶 Si vous débutez :</h4>
            <ul className="text-sm space-y-1 list-disc pl-5">
              <li>Commencez par Kaggle Learn (gratuit)</li>
              <li>Lisez "Python for Data Analysis" en parallèle</li>
              <li>Regardez 3Blue1Brown pour les maths</li>
              <li>Pratiquez avec les datasets Kaggle</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">🚀 Si vous avez des bases :</h4>
            <ul className="text-sm space-y-1 list-disc pl-5">
              <li>Suivez un cours structuré (fast.ai, MIT OpenCourseWare)</li>
              <li>Rejoignez les communautés Reddit/Stack Overflow</li>
              <li>Participez aux compétitions Kaggle</li>
              <li>Construisez un portfolio sur GitHub</li>
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
              Sélection des ouvrages les plus recommandés par la communauté data science mondiale.
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
                    {filteredBooks.map((livre, index) => (
                      <ResourceCard key={`livre-${index}`} ressource={livre} type="livre" index={ressources.livres.indexOf(livre)} />
                    ))}
                  </div>
                )}
              </>
            );
          })()}
          
          <CourseHighlight title="💡 Conseil de lecture" type="info">
            <p className="mb-2">
              <strong>Ne lisez pas tout d'un coup !</strong> Alternez entre théorie et pratique. 
              Lisez un chapitre, puis implémentez les concepts sur un petit projet.
            </p>
            <div className="bg-blue-50 p-3 rounded text-sm">
              <strong>Ordre recommandé :</strong> Python for Data Analysis → Hands-On ML → livre spécialisé selon votre domaine
            </div>
          </CourseHighlight>
        </TabsContent>

        <TabsContent value="plateformes" className="space-y-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">🎓 Plateformes d'Apprentissage</h3>
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
                    {filteredPlatforms.map((plateforme, index) => (
                      <ResourceCard key={`plateforme-${index}`} ressource={plateforme} type="plateforme" index={ressources.plateformes.indexOf(plateforme)} />
                    ))}
                  </div>
                )}
              </>
            );
          })()}

          <p className="mt-4 text-sm text-gray-600">
            Les conditions d'accès (gratuit, partiellement gratuit, avec ou sans certificat) changent avec le temps : vérifiez-les sur le site de chaque plateforme.
          </p>

          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <h4 className="font-semibold mb-3">🎯 Guide de choix de plateforme</h4>
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
              Les créateurs qui expliquent le mieux les concepts de data science.
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
                    {filteredYoutube.map((chaine, index) => (
                      <ResourceCard key={`youtube-${index}`} ressource={chaine} type="youtube" index={ressources.youtube.indexOf(chaine)} />
                    ))}
                  </div>
                )}
              </>
            );
          })()}

          <CourseHighlight title="📺 Stratégie YouTube efficace" type="example">
            <div className="space-y-3">
              <p><strong>Routine suggérée :</strong></p>
              <ul className="text-sm space-y-1 list-disc pl-5">
                <li><strong>Matin (15 min) :</strong> 3Blue1Brown pour les concepts théoriques</li>
                <li><strong>Pause déjeuner (20 min) :</strong> Corey Schafer pour la technique Python</li>
                <li><strong>Soir (30 min) :</strong> StatQuest pour le ML + Data School pour la pratique</li>
              </ul>
              <div className="bg-yellow-50 p-3 rounded text-sm">
                <strong>Pro tip :</strong> Activez les sous-titres automatiques et prenez des notes. 
                Créez un document "Concepts appris" avec timestamps des vidéos importantes.
              </div>
            </div>
          </CourseHighlight>
        </TabsContent>

        <TabsContent value="communautes" className="space-y-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">👥 Communautés à connaître</h3>
            <p className="text-gray-600">
              Rejoignez la conversation mondiale de la data science et accélérez votre apprentissage.
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
                    {filteredCommunities.map((communaute, index) => (
                      <ResourceCard key={`communaute-${index}`} ressource={communaute} type="communaute" index={ressources.communautes.indexOf(communaute)} />
                    ))}
                  </div>
                )}
              </>
            );
          })()}

          <div className="mt-8 space-y-6">
            <CourseHighlight title="🤝 Comment bien utiliser les communautés" type="info">
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
                  <p><strong>Kaggle</strong> pour améliorer vos skills avec des défis réels et datasets quality.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 p-8 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border border-indigo-200">
        <h3 className="text-2xl font-bold mb-4 text-indigo-900">🗺️ Votre Feuille de Route d'Apprentissage</h3>
        
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
              <li>• Mentorat d'autres apprenants</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-white rounded-lg border border-indigo-100">
          <p className="text-sm text-indigo-700">
            <strong>💡 Rappel important :</strong> La data science est un marathon, pas un sprint. 
            Restez régulier, soyez patient avec vous-même, et célébrez chaque petite victoire ! 
            La communauté est là pour vous accompagner. 🚀
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
