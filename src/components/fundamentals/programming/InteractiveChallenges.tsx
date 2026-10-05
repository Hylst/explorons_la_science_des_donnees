import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Trophy,
  Target,
  Clock,
  CheckCircle,
  Lightbulb,
  RotateCcw,
  Award,
  Zap,
  Brain,
  Code2,
  Eye,
  EyeOff,
  TrendingUp
} from "lucide-react";
import CourseHighlight from "@/components/courses/CourseHighlight";
import { readJSON, writeJSON, removeStorage, isStringArray } from "@/lib/storage";

// Types for challenges
interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  category: string;
  points: number;
  timeLimit?: number; // in minutes
  language: string;
  problem: string;
  starterCode: string;
  solution: string;
  testCases: TestCase[];
  hints: string[];
  learningObjectives: string[];
  tags: string[];
}

interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

interface UserProgress {
  completedChallenges: string[];
  totalPoints: number;
  timeSpent: number; // in minutes
  level: number;
}

const DEFAULT_PROGRESS: UserProgress = {
  completedChallenges: [],
  totalPoints: 0,
  timeSpent: 0,
  level: 1
};

// La clé v1 contenait des défis « réussis » par tirage aléatoire : elle n'est pas reprise
const PROGRESS_KEY = 'challenge-progress-v2';
const LEGACY_PROGRESS_KEY = 'challenge-progress';

/** Conserve chaque champ valide de la progression sauvegardée, complète le reste par défaut */
const parseUserProgress = (value: unknown): UserProgress | null => {
  if (typeof value !== 'object' || value === null) return null;
  const v = value as Record<string, unknown>;
  const num = (field: keyof UserProgress) =>
    typeof v[field] === 'number' && Number.isFinite(v[field]) ? (v[field] as number) : DEFAULT_PROGRESS[field] as number;
  return {
    completedChallenges: isStringArray(v.completedChallenges) ? v.completedChallenges : [],
    totalPoints: num('totalPoints'),
    timeSpent: num('timeSpent'),
    level: num('level')
  };
};

// Base des défis proposés (données statiques, hors du composant : référence stable pour les useMemo)
const challenges: Challenge[] = [
  {
    id: 'python-basics-1',
    title: 'Calculateur de Moyenne',
    description: 'Créez une fonction qui calcule la moyenne d\'une liste de nombres',
    difficulty: 'facile',
    category: 'Bases de Python',
    points: 10,
    timeLimit: 15,
    language: 'python',
    problem: `Écrivez une fonction appelée 'calculer_moyenne' qui prend une liste de nombres en paramètre et retourne leur moyenne.

Exemple:
- calculer_moyenne([1, 2, 3, 4, 5]) doit retourner 3.0
- calculer_moyenne([10, 20]) doit retourner 15.0`,
    starterCode: `def calculer_moyenne(nombres):
    # Votre code ici
    pass

# Test de votre fonction
resultat = calculer_moyenne([1, 2, 3, 4, 5])
print(f"Moyenne: {resultat}")`,
    solution: `def calculer_moyenne(nombres):
    if not nombres:  # Vérifier si la liste est vide
        return 0
    return sum(nombres) / len(nombres)

# Test de votre fonction
resultat = calculer_moyenne([1, 2, 3, 4, 5])
print(f"Moyenne: {resultat}")`,
    testCases: [
      {
        input: '[1, 2, 3, 4, 5]',
        expectedOutput: '3.0',
        description: 'Liste de nombres consécutifs'
      },
      {
        input: '[10, 20]',
        expectedOutput: '15.0',
        description: 'Deux nombres'
      },
      {
        input: '[100]',
        expectedOutput: '100.0',
        description: 'Un seul nombre'
      }
    ],
    hints: [
      'Utilisez la fonction sum() pour additionner tous les éléments',
      'Utilisez len() pour obtenir le nombre d\'éléments',
      'N\'oubliez pas de gérer le cas d\'une liste vide',
      'La moyenne = somme / nombre d\'éléments'
    ],
    learningObjectives: [
      'Manipulation des listes Python',
      'Fonctions built-in (sum, len)',
      'Gestion des cas limites',
      'Définition de fonctions'
    ],
    tags: ['functions', 'lists', 'math', 'basics']
  },
  {
    id: 'python-data-1',
    title: 'Analyse de Données Simples',
    description: 'Analysez un dataset de ventes et trouvez les insights clés',
    difficulty: 'moyen',
    category: 'Analyse de données',
    points: 25,
    timeLimit: 30,
    language: 'python',
    problem: `Vous avez un dictionnaire représentant les ventes mensuelles d'une entreprise.
Écrivez une fonction 'analyser_ventes' qui retourne un dictionnaire avec:
- 'total': le total des ventes
- 'moyenne': la moyenne mensuelle
- 'meilleur_mois': le mois avec les meilleures ventes
- 'croissance': True si les ventes augmentent globalement`,
    starterCode: `def analyser_ventes(ventes_mensuelles):
    # ventes_mensuelles = {'Jan': 1000, 'Feb': 1200, 'Mar': 1100, ...}
    # Votre code ici
    pass

# Test
ventes = {'Jan': 1000, 'Feb': 1200, 'Mar': 1100, 'Apr': 1300}
resultat = analyser_ventes(ventes)
print(resultat)`,
    solution: `def analyser_ventes(ventes_mensuelles):
    if not ventes_mensuelles:
        return {}
    
    valeurs = list(ventes_mensuelles.values())
    total = sum(valeurs)
    moyenne = total / len(valeurs)
    
    # Trouver le meilleur mois
    meilleur_mois = max(ventes_mensuelles, key=ventes_mensuelles.get)
    
    # Vérifier la croissance (comparer premier et dernier mois)
    mois_ordonnes = list(ventes_mensuelles.keys())
    croissance = ventes_mensuelles[mois_ordonnes[-1]] > ventes_mensuelles[mois_ordonnes[0]]
    
    return {
        'total': total,
        'moyenne': moyenne,
        'meilleur_mois': meilleur_mois,
        'croissance': croissance
    }`,
    testCases: [
      {
        input: "{'Jan': 1000, 'Feb': 1200, 'Mar': 1100, 'Apr': 1300}",
        expectedOutput: "{'total': 4600, 'moyenne': 1150.0, 'meilleur_mois': 'Apr', 'croissance': True}",
        description: 'Données de ventes croissantes'
      }
    ],
    hints: [
      'Utilisez sum() et len() pour calculer total et moyenne',
      'La fonction max() avec key peut trouver le meilleur mois',
      'Comparez le premier et dernier mois pour la croissance',
      'Les méthodes .keys() et .values() sont utiles pour les dictionnaires'
    ],
    learningObjectives: [
      'Manipulation des dictionnaires',
      'Fonctions d\'agrégation',
      'Analyse de données basique',
      'Logique conditionnelle'
    ],
    tags: ['dictionaries', 'data-analysis', 'aggregation', 'intermediate']
  },
  {
    id: 'python-ml-1',
    title: 'Classificateur Simple',
    description: 'Implémentez un classificateur k-NN basique',
    difficulty: 'difficile',
    category: 'Machine Learning',
    points: 50,
    timeLimit: 45,
    language: 'python',
    problem: `Implémentez un classificateur k-NN (k-Nearest Neighbors) simple.
La fonction doit prendre:
- points_entrainement: liste de tuples (x, y, classe)
- nouveau_point: tuple (x, y)
- k: nombre de voisins à considérer

Retournez la classe prédite basée sur les k plus proches voisins.`,
    starterCode: `import math

def distance_euclidienne(point1, point2):
    # Calculer la distance entre deux points
    pass

def knn_classifier(points_entrainement, nouveau_point, k=3):
    # Votre implémentation k-NN ici
    pass

# Test
data = [(1, 1, 'A'), (2, 2, 'A'), (3, 3, 'B'), (4, 4, 'B')]
resultat = knn_classifier(data, (2.2, 2.2), k=3)
print(f"Classe prédite: {resultat}")`,
    solution: `import math

def distance_euclidienne(point1, point2):
    return math.sqrt((point1[0] - point2[0])**2 + (point1[1] - point2[1])**2)

def knn_classifier(points_entrainement, nouveau_point, k=3):
    # Calculer les distances
    distances = []
    for point in points_entrainement:
        dist = distance_euclidienne((point[0], point[1]), nouveau_point)
        distances.append((dist, point[2]))  # (distance, classe)
    
    # Trier par distance et prendre les k plus proches
    distances.sort(key=lambda x: x[0])
    k_plus_proches = distances[:k]
    
    # Compter les votes pour chaque classe
    votes = {}
    for _, classe in k_plus_proches:
        votes[classe] = votes.get(classe, 0) + 1
    
    # Retourner la classe avec le plus de votes
    return max(votes, key=votes.get)`,
    testCases: [
      {
        input: "[(1, 1, 'A'), (2, 2, 'A'), (3, 3, 'B'), (4, 4, 'B')], (2.2, 2.2), 3",
        expectedOutput: "'A'",
        description: 'Classification avec k=3 (voisins A, B, A : aucune égalité)'
      }
    ],
    hints: [
      'La distance euclidienne: sqrt((x1-x2)² + (y1-y2)²)',
      'Triez les points par distance croissante',
      'Prenez les k premiers après tri',
      'Comptez les votes de chaque classe',
      'Retournez la classe majoritaire'
    ],
    learningObjectives: [
      'Algorithmes de machine learning',
      'Calcul de distances',
      'Tri et sélection de données',
      'Logique de vote/majorité'
    ],
    tags: ['machine-learning', 'knn', 'classification', 'advanced']
  },
  {
    id: 'js-dom-1',
    title: 'Gestionnaire de Tâches',
    description: 'Créez un gestionnaire de tâches interactif en JavaScript',
    difficulty: 'moyen',
    category: 'JavaScript DOM',
    points: 30,
    timeLimit: 25,
    language: 'javascript',
    problem: `Créez une classe TaskManager qui gère une liste de tâches.
La classe doit avoir les méthodes:
- addTask(task): ajouter une tâche
- removeTask(index): supprimer une tâche par index
- toggleTask(index): marquer/démarquer comme terminée
- getStats(): retourner {total, completed, pending}`,
    starterCode: `class TaskManager {
    constructor() {
        // Initialiser la liste des tâches
    }
    
    addTask(task) {
        // Ajouter une nouvelle tâche
    }
    
    removeTask(index) {
        // Supprimer une tâche
    }
    
    toggleTask(index) {
        // Basculer l'état d'une tâche
    }
    
    getStats() {
        // Retourner les statistiques
    }
}

// Test
const manager = new TaskManager();
manager.addTask({text: "Apprendre JavaScript", completed: false});
console.log(manager.getStats());`,
    solution: `class TaskManager {
    constructor() {
        this.tasks = [];
    }
    
    addTask(task) {
        this.tasks.push({
            text: task.text,
            completed: task.completed || false,
            id: Date.now()
        });
    }
    
    removeTask(index) {
        if (index >= 0 && index < this.tasks.length) {
            this.tasks.splice(index, 1);
        }
    }
    
    toggleTask(index) {
        if (index >= 0 && index < this.tasks.length) {
            this.tasks[index].completed = !this.tasks[index].completed;
        }
    }
    
    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const pending = total - completed;
        
        return { total, completed, pending };
    }
}`,
    testCases: [
      {
        input: 'Ajouter une tâche et vérifier les stats',
        expectedOutput: '{total: 1, completed: 0, pending: 1}',
        description: 'Test des statistiques de base'
      }
    ],
    hints: [
      'Utilisez un tableau pour stocker les tâches',
      'Chaque tâche peut être un objet avec text et completed',
      'splice() permet de supprimer des éléments d\'un tableau',
      'filter() peut compter les tâches terminées'
    ],
    learningObjectives: [
      'Classes JavaScript ES6',
      'Manipulation de tableaux',
      'Méthodes d\'objet',
      'Gestion d\'état'
    ],
    tags: ['javascript', 'classes', 'arrays', 'dom']
  }
];

/**
 * Interactive Programming Challenges Component
 * Provides gamified coding challenges with progress tracking,
 * hints system, and comprehensive feedback
 */
const InteractiveChallenges: React.FC = () => {
  // State management
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [userCode, setUserCode] = useState<string>('');
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [currentHint, setCurrentHint] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [userProgress, setUserProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Filter challenges based on selected criteria
  const filteredChallenges = useMemo(() => {
    return challenges.filter(challenge => {
      const categoryMatch = selectedCategory === 'all' || challenge.category === selectedCategory;
      const difficultyMatch = selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty;
      return categoryMatch && difficultyMatch;
    });
  }, [selectedCategory, selectedDifficulty]);

  // Get unique categories and difficulties
  const categories = useMemo(() => {
    const cats = [...new Set(challenges.map(c => c.category))];
    return ['all', ...cats];
  }, []);

  const difficulties = ['all', 'facile', 'moyen', 'difficile'];

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive]);

  // Load user progress from localStorage
  useEffect(() => {
    removeStorage(LEGACY_PROGRESS_KEY);
    const saved = parseUserProgress(readJSON<unknown>(PROGRESS_KEY, null));
    if (saved) {
      setUserProgress(saved);
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = useCallback((newProgress: UserProgress) => {
    setUserProgress(newProgress);
    writeJSON(PROGRESS_KEY, newProgress);
  }, []);

  // Start a challenge
  const startChallenge = useCallback((challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setUserCode(challenge.starterCode);
    setShowSolution(false);
    setShowHints(false);
    setCurrentHint(0);
    setTimeElapsed(0);
    // Le chronomètre ne tourne que sur un défi pas encore validé
    setIsTimerActive(!userProgress.completedChallenges.includes(challenge.id));
  }, [userProgress.completedChallenges]);

  // Les défis ne sont pas corrigés automatiquement : la réussite est déclarée par le visiteur lui-même, après
  // comparaison avec les cas de test et la solution. Pour exécuter sa solution, il dispose de l'éditeur de la page.
  const completeChallenge = useCallback(() => {
    if (!selectedChallenge || userProgress.completedChallenges.includes(selectedChallenge.id)) return;
    const totalPoints = userProgress.totalPoints + selectedChallenge.points;
    setIsTimerActive(false);
    saveProgress({
      completedChallenges: [...userProgress.completedChallenges, selectedChallenge.id],
      totalPoints,
      timeSpent: userProgress.timeSpent + Math.round(timeElapsed / 60),
      level: Math.floor(totalPoints / 100) + 1
    });
  }, [selectedChallenge, userProgress, timeElapsed, saveProgress]);

  // Annule une validation faite par erreur : les points du défi sont retirés
  const reopenChallenge = useCallback(() => {
    if (!selectedChallenge || !userProgress.completedChallenges.includes(selectedChallenge.id)) return;
    const totalPoints = Math.max(0, userProgress.totalPoints - selectedChallenge.points);
    saveProgress({
      ...userProgress,
      completedChallenges: userProgress.completedChallenges.filter(id => id !== selectedChallenge.id),
      totalPoints,
      level: Math.floor(totalPoints / 100) + 1
    });
  }, [selectedChallenge, userProgress, saveProgress]);

  // Show next hint
  const showNextHint = useCallback(() => {
    if (selectedChallenge && currentHint < selectedChallenge.hints.length - 1) {
      setCurrentHint(prev => prev + 1);
    }
  }, [selectedChallenge, currentHint]);

  // Reset challenge
  const resetChallenge = useCallback(() => {
    if (selectedChallenge) {
      setUserCode(selectedChallenge.starterCode);
      setShowSolution(false);
      setTimeElapsed(0);
      setIsTimerActive(!userProgress.completedChallenges.includes(selectedChallenge.id));
    }
  }, [selectedChallenge, userProgress.completedChallenges]);

  const isSelectedCompleted = selectedChallenge ? userProgress.completedChallenges.includes(selectedChallenge.id) : false;

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile': return 'bg-green-700 text-white';
      case 'moyen': return 'bg-yellow-700 text-white';
      case 'difficile': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Trophy className="h-8 w-8 text-yellow-600" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Défis de Programmation
          </h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Relevez des défis de programmation progressifs et gagnez des points !
          Écrivez votre solution, comparez-la aux cas de test et à la solution proposée, puis validez le défi vous-même.
        </p>
        <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
          Les défis ne sont pas corrigés automatiquement : la validation repose sur votre auto-évaluation.
          Pour essayer votre solution, copiez-la dans l'éditeur de code de cette page (Python, SQL ou JavaScript, exécutés dans votre navigateur).
          Votre progression reste enregistrée dans ce navigateur uniquement.
        </p>
      </div>

      {/* User Progress Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Votre Progression
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{userProgress.level}</div>
              <div className="text-sm text-blue-700">Niveau</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{userProgress.totalPoints}</div>
              <div className="text-sm text-yellow-700">Points</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{userProgress.completedChallenges.length}</div>
              <div className="text-sm text-green-700">Défis réussis</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{challenges.length - userProgress.completedChallenges.length}</div>
              <div className="text-sm text-purple-700">Défis restants</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{userProgress.timeSpent}</div>
              <div className="text-sm text-orange-700">Minutes codées</div>
            </div>
          </div>
          
          {/* Progress to next level */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <span>Progression vers le niveau {userProgress.level + 1}</span>
              <span>{userProgress.totalPoints % 100}/100 points</span>
            </div>
            <Progress value={(userProgress.totalPoints % 100)} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Challenge List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Défis Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Catégorie</label>
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'Toutes les catégories' : cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Difficulté</label>
                  <select 
                    value={selectedDifficulty} 
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    {difficulties.map(diff => (
                      <option key={diff} value={diff}>
                        {diff === 'all' ? 'Toutes les difficultés' : diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Challenge Cards */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredChallenges.map(challenge => {
                  const isCompleted = userProgress.completedChallenges.includes(challenge.id);
                  return (
                    <Card 
                      key={challenge.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedChallenge?.id === challenge.id ? 'ring-2 ring-blue-500' : ''
                      } ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}
                      onClick={() => startChallenge(challenge)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm">{challenge.title}</h4>
                          {isCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-3">{challenge.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                              {challenge.difficulty}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {challenge.points} pts
                            </Badge>
                          </div>
                          
                          {challenge.timeLimit && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {challenge.timeLimit}min
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {challenge.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Challenge Workspace */}
        <div className="lg:col-span-2">
          {selectedChallenge ? (
            <div className="space-y-4">
              {/* Challenge Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Code2 className="h-5 w-5" />
                        {selectedChallenge.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={`${getDifficultyColor(selectedChallenge.difficulty)}`}>
                          {selectedChallenge.difficulty}
                        </Badge>
                        <Badge variant="outline">{selectedChallenge.points} points</Badge>
                        <Badge variant="secondary">{selectedChallenge.language}</Badge>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-mono font-bold">
                        {formatTime(timeElapsed)}
                      </div>
                      {selectedChallenge.timeLimit && (
                        <div className="text-sm text-muted-foreground">
                          / {selectedChallenge.timeLimit}:00
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="max-w-none">
                    <p className="whitespace-pre-line">{selectedChallenge.problem}</p>
                  </div>
                  
                  {/* Learning Objectives */}
                  <div className="mt-4">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Objectifs d'apprentissage
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedChallenge.learningObjectives.map((obj, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {obj}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Code Editor */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Votre Solution</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={resetChallenge}>
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Reset
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowSolution(shown => !shown)}
                      >
                        {showSolution ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                        {showSolution ? 'Masquer la solution' : 'Voir la solution'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <div className="px-4 py-2 bg-gray-800 text-gray-200 text-sm font-mono flex items-center justify-between">
                      <span>💻 {selectedChallenge.language}</span>
                      <span>{userCode.length} caractères</span>
                    </div>
                    <Textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="min-h-64 font-mono text-sm bg-gray-900 text-gray-100 border-0 resize-none"
                      placeholder="Écrivez votre code ici..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Solution de référence */}
              {showSolution && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Lightbulb className="h-5 w-5" />
                      Solution proposée
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono"><code>{selectedChallenge.solution}</code></pre>
                    <p className="text-sm text-muted-foreground mt-2">
                      Un même problème a souvent plusieurs solutions : comparez la logique, pas seulement le texte.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Cas de test et validation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle className="h-5 w-5" />
                    Cas de test à vérifier
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Exécutez votre code dans votre propre environnement et vérifiez que vous obtenez ces résultats.
                  </p>
                  <div className="space-y-2">
                    {selectedChallenge.testCases.map((testCase, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-gray-50 border text-sm">
                        <div className="font-medium">{testCase.description}</div>
                        <div className="font-mono text-xs mt-1">
                          Entrée : <code>{testCase.input}</code> → Attendu : <code>{testCase.expectedOutput}</code>
                        </div>
                      </div>
                    ))}
                  </div>

                  {isSelectedCompleted ? (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <Trophy className="h-5 w-5" />
                        <span className="font-semibold">Défi validé !</span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        {selectedChallenge.points} points ajoutés à votre progression.
                      </p>
                      <Button size="sm" variant="ghost" className="mt-2" onClick={reopenChallenge}>
                        Annuler la validation
                      </Button>
                    </div>
                  ) : (
                    <Button className="mt-4 w-full" onClick={completeChallenge}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      J'ai réussi ce défi (+{selectedChallenge.points} points)
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Hints */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Indices ({currentHint + 1}/{selectedChallenge.hints.length})
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setShowHints(!showHints)}
                    >
                      {showHints ? 'Masquer' : 'Afficher'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                {showHints && (
                  <CardContent>
                    <div className="space-y-3">
                      {selectedChallenge.hints.slice(0, currentHint + 1).map((hint, idx) => (
                        <div key={idx} className="p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Badge variant="secondary" className="text-xs mt-0.5">
                              {idx + 1}
                            </Badge>
                            <span className="text-sm text-blue-800">{hint}</span>
                          </div>
                        </div>
                      ))}
                      
                      {currentHint < selectedChallenge.hints.length - 1 && (
                        <Button size="sm" variant="outline" onClick={showNextHint}>
                          Indice suivant
                        </Button>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <CardContent className="text-center">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Choisissez un défi</h3>
                <p className="text-muted-foreground">
                  Sélectionnez un défi dans la liste pour commencer à coder !
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Tips */}
      <CourseHighlight title="🎯 Conseils pour réussir les défis" type="tip">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Stratégie
            </h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Lisez attentivement l'énoncé</li>
              <li>• Décomposez le problème en étapes</li>
              <li>• Testez avec des exemples simples</li>
              <li>• Utilisez les indices si nécessaire</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Performance
            </h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Commencez par les défis faciles</li>
              <li>• Ne regardez la solution qu'après avoir cherché</li>
              <li>• Pratiquez régulièrement</li>
              <li>• Analysez vos erreurs</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Progression
            </h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Gagnez des points pour débloquer des niveaux</li>
              <li>• Explorez différentes catégories</li>
              <li>• Comparez votre solution à celle proposée</li>
              <li>• Rejouez un défi plus tard, sans indice</li>
            </ul>
          </div>
        </div>
      </CourseHighlight>
    </div>
  );
};

export default InteractiveChallenges;