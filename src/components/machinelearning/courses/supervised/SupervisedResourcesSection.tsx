
import { EducationalCard } from "@/components/ui/educational-cards";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Video, Globe, Code, Users, ExternalLink, CheckCircle, AlertCircle, Lightbulb } from "lucide-react";

const resources = {
  books: [
    {
      title: "The Elements of Statistical Learning",
      authors: "Trevor Hastie, Robert Tibshirani, Jerome Friedman",
      description: "Une référence académique en apprentissage statistique. Traite en profondeur la théorie de l'apprentissage supervisé, avec une approche mathématique rigoureuse.",
      difficulty: "Avancé" as const,
      language: "Anglais",
      url: "https://hastie.su.domains/ElemStatLearn/",
      topics: ["Théorie", "Statistiques", "Algorithmes", "Mathématiques"],
      type: "book" as const,
      free: true
    },
    {
      title: "Hands-On Machine Learning with Scikit-Learn and PyTorch",
      authors: "Aurélien Géron",
      description: "Guide pratique avec implémentations en Python, qui mêle théorie et pratique. Il suppose de connaître un peu Python.",
      difficulty: "Intermédiaire" as const,
      language: "Anglais",
      url: "https://www.oreilly.com/library/view/hands-on-machine-learning/9798341607972/",
      topics: ["Python", "Scikit-learn", "Projets pratiques", "PyTorch"],
      type: "book" as const,
      free: false
    },
    {
      title: "Pattern Recognition and Machine Learning",
      authors: "Christopher Bishop",
      description: "Approche bayésienne de l'apprentissage automatique, utile pour comprendre les fondements probabilistes de l'apprentissage supervisé.",
      difficulty: "Avancé" as const,
      language: "Anglais",
      url: "https://www.microsoft.com/en-us/research/wp-content/uploads/2006/01/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf",
      topics: ["Probabilités", "Bayésien", "Théorie", "Mathématiques"],
      type: "book" as const,
      free: true
    },
    {
      title: "Machine Learning Yearning",
      authors: "Andrew Ng",
      description: "Guide stratégique (2018) pour structurer un projet de ML : séparation des données, analyse des erreurs, choix des priorités.",
      difficulty: "Intermédiaire" as const,
      language: "Anglais",
      url: "https://info.deeplearning.ai/machine-learning-yearning-book",
      topics: ["Stratégie", "Bonnes pratiques", "Gestion de projet", "Évaluation"],
      type: "book" as const,
      free: true
    },
    {
      title: "Introduction to Statistical Learning",
      authors: "Gareth James, Daniela Witten, Trevor Hastie, Robert Tibshirani (et Jonathan Taylor pour l'édition Python)",
      description: "Version accessible d'ESL, adaptée à une première approche statistique de l'apprentissage supervisé. Existe avec des exemples en R et avec des exemples en Python.",
      difficulty: "Débutant" as const,
      language: "Anglais",
      url: "https://www.statlearning.com/",
      topics: ["R", "Python", "Statistiques", "Exercices"],
      type: "book" as const,
      free: true
    }
  ],
  courses: [
    {
      title: "Machine Learning (Stanford CS229)",
      description: "Un cours très connu d'apprentissage automatique de Stanford. Couvre les principaux algorithmes supervisés avec rigueur mathématique.",
      difficulty: "Intermédiaire" as const,
      language: "Anglais",
      url: "http://cs229.stanford.edu/",
      topics: ["Théorie", "Algorithmes", "Mathématiques", "Python/Octave"],
      type: "video" as const,
      free: true
    },
    {
      title: "Machine Learning Specialization, cours 1 (Andrew Ng)",
      description: "Premier cours de la spécialisation d'Andrew Ng sur Coursera : régression et classification supervisées, en Python. Il remplace l'ancien cours en Octave. Inscription gratuite d'après la page du cours ; exercices notés et certificat en option.",
      difficulty: "Débutant" as const,
      language: "Anglais",
      url: "https://www.coursera.org/learn/machine-learning",
      topics: ["Python", "Régression", "Classification", "Introduction"],
      type: "video" as const,
      free: false
    },
    {
      title: "Fast.ai Practical Deep Learning",
      description: "Approche « de haut en bas » : on commence par des projets concrets, puis on explique la théorie. Centré sur le deep learning.",
      difficulty: "Intermédiaire" as const,
      language: "Anglais",
      url: "https://course.fast.ai/",
      topics: ["Deep Learning", "PyTorch", "Projets réels", "Top-down"],
      type: "video" as const,
      free: true
    },
    {
      title: "CS231n: Convolutional Neural Networks",
      description: "Cours de Stanford spécialisé en vision par ordinateur : classification et détection d'images avec des réseaux de neurones convolutifs.",
      difficulty: "Avancé" as const,
      language: "Anglais",
      url: "http://cs231n.stanford.edu/",
      topics: ["Computer Vision", "CNNs", "PyTorch", "Classification d'images"],
      type: "video" as const,
      free: true
    }
  ],
  websites: [
    {
      title: "Scikit-learn Documentation",
      description: "Documentation officielle de la bibliothèque Python très utilisée : guide utilisateur, référence de l'API et exemples pour les algorithmes supervisés.",
      url: "https://scikit-learn.org/stable/",
      topics: ["Python", "API", "Exemples", "Tutoriels"],
      type: "website" as const,
      difficulty: "Intermédiaire" as const,
      language: "Anglais",
      free: true
    },
    {
      title: "Hugging Face - Trending Papers",
      description: "Articles de recherche populaires en machine learning, liés à leurs implémentations sur GitHub. Successeur de Papers With Code, fermé en juillet 2025.",
      url: "https://huggingface.co/papers/trending",
      topics: ["Research", "Code", "Papers"],
      type: "website" as const,
      difficulty: "Avancé" as const,
      language: "Anglais",
      free: true
    },
    {
      title: "Kaggle Learn",
      description: "Micro-cours gratuits et pratiques, avec des jeux de données réels, qui introduisent les techniques d'apprentissage supervisé.",
      url: "https://www.kaggle.com/learn",
      topics: ["Pratique", "Datasets", "Compétitions", "Notebooks"],
      type: "website" as const,
      difficulty: "Débutant" as const,
      language: "Anglais",
      free: true
    },
    {
      title: "Machine Learning Mastery",
      description: "Blog de Jason Brownlee : tutoriels pratiques, guides pas à pas et conseils pour progresser en apprentissage supervisé.",
      url: "https://machinelearningmastery.com/",
      topics: ["Tutoriels", "Python", "Conseils pratiques", "Exemples"],
      type: "website" as const,
      difficulty: "Intermédiaire" as const,
      language: "Anglais",
      free: true
    },
    {
      title: "Towards Data Science",
      description: "Publication en ligne d'articles écrits par des praticiens, avec des retours d'expérience. Qualité inégale : à lire avec esprit critique.",
      url: "https://towardsdatascience.com/",
      topics: ["Articles", "Expérience", "Théorie", "Pratique"],
      type: "website" as const,
      difficulty: "Intermédiaire" as const,
      language: "Anglais",
      free: true
    },
    {
      title: "Google Machine Learning Crash Course",
      description: "Introduction pratique au machine learning par Google : vidéos animées, visualisations interactives et exercices.",
      url: "https://developers.google.com/machine-learning/crash-course",
      topics: ["Interactif", "Google", "Exercices", "Débutant"],
      type: "website" as const,
      difficulty: "Débutant" as const,
      language: "Anglais",
      free: true
    }
  ]
};

// Convertir en format attendu par ResourcesSection
const allResources = [
  ...resources.books,
  ...resources.courses,
  ...resources.websites
];

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


const SupervisedResourcesSection = () => {
  const tips = [
    "Commencez par « Introduction to Statistical Learning » pour une base solide",
    "Pratiquez avec Scikit-learn avant de passer aux frameworks complexes",
    "Alternez théorie et pratique pour une meilleure compréhension",
    "Rejoignez des communautés pour échanger et progresser"
  ];

  const warnings = [
    "Ne sautez pas les bases mathématiques (algèbre linéaire, probabilités, statistiques) : elles aident à comprendre ce que font les algorithmes",
    "Évitez de collectionner les cours sans pratiquer",
    "Attention aux cours obsolètes : vérifiez les dates de publication",
    "Ne négligez pas la préparation des données : elle prend souvent beaucoup de temps"
  ];

  const bestPractices = [
    "Implémentez à la main au moins une fois un algorithme simple (régression linéaire, k plus proches voisins, arbre de décision)",
    "Travaillez sur des projets personnels pour consolider",
    "Participez à des compétitions Kaggle pour vous challenger",
    "Documentez vos apprentissages dans un blog ou notebook"
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center">📚 Ressources pour découvrir l'apprentissage supervisé</h2>
      <p className="text-center text-gray-600 max-w-3xl mx-auto">
        Sélection commentée de ressources pour s'initier à l'apprentissage supervisé et progresser,
        des bases théoriques aux applications pratiques. Elles sont toutes en anglais.
      </p>

      {/* Conseils et avertissements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EducationalCard title="💡 Conseils d'apprentissage" type="saviez-vous">
          <ul className="space-y-2 text-sm">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </EducationalCard>

        <EducationalCard title="⚠️ Points d'attention" type="rappel">
          <ul className="space-y-2 text-sm">
            {warnings.map((warning, index) => (
              <li key={index} className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </EducationalCard>

        <EducationalCard title="✅ Bonnes pratiques" type="concept">
          <ul className="space-y-2 text-sm">
            {bestPractices.map((practice, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{practice}</span>
              </li>
            ))}
          </ul>
        </EducationalCard>
      </div>

      {/* Liste des ressources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allResources.map((resource, index) => (
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
              <div className="flex flex-wrap gap-1 mb-3">
                {resource.topics.slice(0, 3).map((topic, topicIndex) => (
                  <Badge key={topicIndex} variant="secondary" className="text-xs">
                    {topic}
                  </Badge>
                ))}
                {resource.topics.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{resource.topics.length - 3}
                  </Badge>
                )}
              </div>
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

export default SupervisedResourcesSection;
