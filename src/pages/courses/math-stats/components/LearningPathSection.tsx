
import { TrendingUp, Clock, Target, BookOpen, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CourseHighlight from "@/components/courses/CourseHighlight";

const LearningPathSection = () => {
  const learningPhases = [
    { 
      phase: "Phase 1", 
      title: "Fondements Logiques", 
      duration: "2-3 semaines", 
      difficulty: "Débutant",
      topics: ["Ensembles & Relations", "Logique Booléenne", "Fonctions Élémentaires"],
      objectives: [
        "Se familiariser avec la notation mathématique",
        "Comprendre les structures logiques",
        "Bases du raisonnement déductif"
      ],
      projects: ["Exercices de logique", "Manipulation d'ensembles"],
      nextStep: "Vous serez prêt pour l'algèbre linéaire"
    },
    { 
      phase: "Phase 2", 
      title: "Algèbre Linéaire", 
      duration: "3-4 semaines", 
      difficulty: "Intermédiaire",
      topics: ["Vecteurs & Matrices", "Produits & Dimensions", "Décompositions (PCA, SVD)"],
      objectives: [
        "Manipuler matrices et vecteurs naturellement",
        "Comprendre les transformations linéaires",
        "Appliquer PCA pour réduction de dimension"
      ],
      projects: ["Implémentation PCA", "Compression d'images", "Analyse de données multidimensionnelles"],
      nextStep: "Base solide pour le machine learning"
    },
    { 
      phase: "Phase 3", 
      title: "Statistiques & Probabilités", 
      duration: "4-5 semaines", 
      difficulty: "Intermédiaire",
      topics: ["Stats Descriptives", "Distributions", "Inférence & Tests"],
      objectives: [
        "Analyser et résumer des datasets",
        "Modéliser l'incertitude avec les bonnes distributions",
        "Effectuer des tests d'hypothèses rigoureux"
      ],
      projects: ["Analyse exploratoire complète", "A/B testing", "Détection d'anomalies"],
      nextStep: "Compétences d'analyse de données opérationnelles"
    },
    { 
      phase: "Phase 4", 
      title: "Calcul & Optimisation", 
      duration: "3-4 semaines", 
      difficulty: "Avancé",
      topics: ["Dérivées & Gradients", "Optimisation Contrainte", "Algorithmes (SGD, Adam)"],
      objectives: [
        "Comprendre l'entraînement des modèles ML",
        "Optimiser fonctions de coût complexes",
        "Déboguer problèmes de convergence"
      ],
      projects: ["Implémentation descente de gradient", "Régression from scratch", "Hyperparameter tuning"],
      nextStep: "Prêt pour le deep learning avancé"
    },
    { 
      phase: "Phase 5", 
      title: "Application Intégrée", 
      duration: "2-3 semaines", 
      difficulty: "Expert",
      topics: ["Projets End-to-End", "ML Production", "Cas d'Usage Complexes"],
      objectives: [
        "Intégrer tous les concepts mathématiques",
        "Résoudre des problèmes business réels",
        "Communiquer résultats aux parties prenantes"
      ],
      projects: ["Système de recommandation", "Détection de fraude", "Prédiction de churn"],
      nextStep: "Autonomie complète en data science"
    }
  ];

  const studyTips = [
    {
      icon: <BookOpen className="h-5 w-5 text-blue-600" />,
      title: "Théorie & Pratique",
      tip: "Alternez 70% théorie / 30% implémentation. Codez chaque concept appris.",
      color: "blue"
    },
    {
      icon: <Users className="h-5 w-5 text-green-600" />,
      title: "Communauté",
      tip: "Rejoignez des groupes d'étude, expliquez concepts à d'autres pour mieux comprendre.",
      color: "green"
    },
    {
      icon: <Target className="h-5 w-5 text-purple-600" />,
      title: "Projets Concrets",
      tip: "Chaque semaine, appliquez sur un mini-projet avec données réelles.",
      color: "purple"
    },
    {
      icon: <Clock className="h-5 w-5 text-orange-600" />,
      title: "Régularité",
      tip: "Mieux vaut 1h/jour que 7h le weekend. Créez une routine d'apprentissage.",
      color: "orange"
    }
  ];

  const resources = [
    {
      category: "Livres",
      items: [
        "📚 'Mathematics for Machine Learning' - Deisenroth",
        "📊 'Introduction to Statistical Learning' - James et al.",
        "🧮 'Linear Algebra Done Right' - Axler",
        "📈 'Think Stats' - Downey"
      ]
    },
    {
      category: "Cours en Ligne",
      items: [
        "🎓 3Blue1Brown - Essence of Linear Algebra",
        "📺 Khan Academy - Statistiques & Probabilités",
        "💻 MIT OpenCourseWare - Mathematics",
        "🎯 Fast.ai - Practical Deep Learning Math"
      ]
    },
    {
      category: "Outils Pratiques",
      items: [
        "🐍 NumPy/SciPy pour calculs numériques",
        "📊 Matplotlib/Seaborn pour visualisations",
        "📓 Jupyter Notebooks pour expérimentation",
        "🔧 Desmos/GeoGebra pour visualisations mathématiques"
      ]
    }
  ];

  return (
    <section id="parcours" className="mb-16">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-indigo-600" />
        Votre Parcours d'Apprentissage Structuré
      </h2>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-xl border border-indigo-100">
        
        {/* Introduction au parcours */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-indigo-800">🎯 Progression Optimisée pour la Data Science</h3>
          <p className="text-gray-700 mb-6">
            Ce parcours est conçu pour vous amener progressivement de zéro à un niveau opérationnel en mathématiques 
            pour la data science. Chaque phase construit sur la précédente avec des projets pratiques pour ancrer les apprentissages.
          </p>
        </div>

        {/* Phases détaillées */}
        <div className="space-y-6 mb-12">
          {learningPhases.map((phase, index) => (
            <Card key={index} className="bg-white/80 hover:bg-white transition-all duration-300 border-l-4 border-indigo-400">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{phase.phase}: {phase.title}</CardTitle>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{phase.duration}</Badge>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            phase.difficulty === 'Débutant' ? 'bg-green-100 text-green-700' :
                            phase.difficulty === 'Intermédiaire' ? 'bg-yellow-100 text-yellow-700' :
                            phase.difficulty === 'Avancé' ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                          }`}
                        >
                          {phase.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">📚 Sujets Couverts</h4>
                    <ul className="space-y-1">
                      {phase.topics.map((topic, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                          <span className="w-1 h-1 bg-indigo-400 rounded-full" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">🎯 Objectifs</h4>
                    <ul className="space-y-1">
                      {phase.objectives.map((objective, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                          <span className="w-1 h-1 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">🛠️ Projets Pratiques</h4>
                    <ul className="space-y-1 mb-3">
                      {phase.projects.map((project, idx) => (
                        <li key={idx} className="text-xs text-blue-600 flex items-center gap-2">
                          <span className="w-1 h-1 bg-blue-400 rounded-full" />
                          {project}
                        </li>
                      ))}
                    </ul>
                    <div className="bg-purple-50 p-2 rounded text-xs">
                      <strong className="text-purple-700">Après cette phase:</strong>
                      <p className="text-purple-600 mt-1">{phase.nextStep}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Conseils d'apprentissage */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-indigo-800">💡 Conseils pour Maximiser Votre Apprentissage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studyTips.map((tip, index) => (
              <div key={index} className={`bg-${tip.color}-50 p-4 rounded-lg border border-${tip.color}-200`}>
                <div className="flex items-start gap-3">
                  {tip.icon}
                  <div>
                    <h4 className={`font-semibold text-${tip.color}-700 text-sm mb-1`}>{tip.title}</h4>
                    <p className={`text-xs text-${tip.color}-600`}>{tip.tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ressources */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-indigo-800">📖 Ressources Recommandées</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="bg-white/60">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-700">{resource.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {resource.items.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Motivation finale */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
          <CourseHighlight title="🏆 Votre Investissement en Temps" type="info">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">📊 Répartition Temporelle</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Total :</strong> 14-19 semaines (~4 mois)</li>
                  <li>• <strong>Rythme :</strong> 8-12h/semaine (estimation de l'auteur)</li>
                  <li>• <strong>Théorie :</strong> 70% du temps</li>
                  <li>• <strong>Pratique :</strong> 30% du temps</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">🎯 ROI de Votre Apprentissage</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Valeur ajoutée :</strong> comprendre pourquoi un modèle marche ou échoue</li>
                  <li>• <strong>Opportunités :</strong> Accès aux postes senior</li>
                  <li>• <strong>Autonomie :</strong> Résolution de problèmes complexes</li>
                  <li>• <strong>Innovation :</strong> Capacité à créer de nouveaux algorithmes</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm font-medium text-indigo-700">
                💪 4 mois d'effort intense = des années d'avantage concurrentiel
              </p>
            </div>
          </CourseHighlight>
        </div>
      </div>
    </section>
  );
};

export default LearningPathSection;
