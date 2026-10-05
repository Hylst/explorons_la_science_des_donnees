import React, { useState, useMemo, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Calendar,
  Clock,
  BarChart3,
  Trophy,
  RefreshCw,
  Eye,
  TrendingUp,
  Filter,
  Search,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useQuizHistory } from "@/hooks/useQuiz";

/**
 * Get status icon and color using modern object mapping
 */
const getStatusDisplay = (status: string) => {
  const statusMap = {
    completed: { icon: <CheckCircle className="h-4 w-4" />, color: 'text-green-600', label: 'Terminé' },
    abandoned: { icon: <XCircle className="h-4 w-4" />, color: 'text-red-600', label: 'Abandonné' },
    in_progress: { icon: <AlertCircle className="h-4 w-4" />, color: 'text-yellow-600', label: 'En cours' }
  } as const;
  
  return statusMap[status as keyof typeof statusMap] ?? 
    { icon: <AlertCircle className="h-4 w-4" />, color: 'text-gray-600', label: 'Inconnu' };
};

/**
 * Get difficulty color using modern object mapping
 */
const getDifficultyColor = (difficulty: string) => {
  const difficultyMap = {
    'Débutant': 'bg-green-100 text-green-800 border-green-300',
    'Intermédiaire': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Avancé': 'bg-red-100 text-red-800 border-red-300'
  } as const;
  
  return difficultyMap[difficulty as keyof typeof difficultyMap] ?? 'bg-gray-100 text-gray-800 border-gray-300';
};

/**
 * Get score color based on percentage using modern conditional logic
 */
const getScoreColor = (score: number): string => {
  return score >= 90 ? 'text-green-600' :
         score >= 75 ? 'text-blue-600' :
         score >= 60 ? 'text-yellow-600' : 'text-red-600';
};

/**
 * Format date for display using modern arrow function
 */
const formatDate = (dateString: string): string => 
  new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

/**
 * Format duration using modern conditional logic
 */
const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}min`;
  
  const [hours, mins] = [Math.floor(minutes / 60), minutes % 60];
  return `${hours}h ${mins}min`;
};

/**
 * QuizHistorySection component - Displays user's quiz attempt history - optimized with memoization
 */
const QuizHistorySection: React.FC = () => {
  const { history, clearHistory } = useQuizHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [confirmClear, setConfirmClear] = useState(false);

  // Memoize quiz data and categories
  const quizData = history;
  const categories = useMemo(() => [...new Set(quizData.map(({ category }) => category))], [quizData]);
  
  // Memoize expensive filtering and sorting operations
  const filteredHistory = useMemo(() => {
    return quizData
      .filter(({ title, category, status }) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = [title, category].some(field => 
          field.toLowerCase().includes(searchLower)
        );
        const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
        const matchesStatus = selectedStatus === 'all' || status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        const sortMap = {
          date: () => new Date(b.date).getTime() - new Date(a.date).getTime(),
          score: () => b.score - a.score,
          duration: () => b.duration - a.duration
        } as const;
        
        return sortMap[sortBy as keyof typeof sortMap]?.() ?? 0;
      });
  }, [quizData, searchTerm, selectedCategory, selectedStatus, sortBy]);

  /** Effacement de l'historique en deux clics, sans boîte de dialogue bloquante */
  const handleClear = useCallback((): void => {
    if (!confirmClear) {
      setConfirmClear(true);
      window.setTimeout(() => setConfirmClear(false), 4000);
      return;
    }
    clearHistory();
    setConfirmClear(false);
  }, [confirmClear, clearHistory]);

  /**
   * Toggle expanded state for quiz details using modern Set operations - memoized for performance
   */
  const toggleExpanded = useCallback((quizId: string): void => {
    setExpandedItems(prev => {
      const newExpanded = new Set(prev);
      newExpanded.has(quizId) ? newExpanded.delete(quizId) : newExpanded.add(quizId);
      return newExpanded;
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Historique de vos Quiz
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Consultez vos tentatives passées et analysez votre progression au fil du temps.
        </p>
        {history.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClear}>
            {confirmClear ? 'Cliquez à nouveau pour confirmer' : "Effacer l'historique"}
          </Button>
        )}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-500" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rechercher</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Titre ou catégorie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Catégorie</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="abandoned">Abandonné</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Trier par</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="score">Score</SelectItem>
                  <SelectItem value="duration">Durée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quiz History List */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {history.length === 0 ? "Vous n'avez pas encore terminé de quiz" : 'Aucun quiz trouvé'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {history.length === 0
                  ? "Vos résultats apparaîtront ici dès votre premier quiz. Ils sont enregistrés dans ce navigateur uniquement."
                  : 'Essayez de modifier vos critères de recherche.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredHistory.map((quiz) => {
            const statusDisplay = getStatusDisplay(quiz.status);
            const isExpanded = expandedItems.has(quiz.id);

            return (
              <Card key={quiz.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {quiz.title}
                          </h3>
                          <Badge className={getDifficultyColor(quiz.difficulty)}>
                            {quiz.difficulty}
                          </Badge>
                          <div className={`flex items-center gap-1 ${statusDisplay.color}`}>
                            {statusDisplay.icon}
                            <span className="text-sm font-medium">{statusDisplay.label}</span>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {quiz.category}
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(quiz.date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDuration(quiz.duration)}
                          </div>
                          {quiz.status === 'completed' && (
                            <div className="flex items-center gap-1">
                              <Trophy className="h-4 w-4" />
                              {quiz.correctAnswers}/{quiz.totalQuestions} questions
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {quiz.status === 'completed' && (
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getScoreColor(quiz.score)}`}>
                              {quiz.score}%
                            </div>
                            <div className="text-sm text-gray-500">Score</div>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleExpanded(quiz.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            {isExpanded ? 'Masquer' : 'Détails'}
                            <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </Button>
                          
                          {quiz.status === 'completed' && (
                            <Button asChild variant="outline" size="sm">
                              <Link to={`/quiz/${quiz.categoryId}`}>
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Refaire
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && quiz.status === 'completed' && (
                    <div className="border-t bg-gray-50 dark:bg-gray-800 p-6 space-y-6">
                      {/* Topics Covered */}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                          Sujets Couverts
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {quiz.topics.map((topic, index) => (
                            <Badge key={index} variant="secondary">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Performance Analysis */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Strong Areas */}
                        {quiz.strongAreas.length > 0 && (
                          <div>
                            <h4 className="font-medium text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              Points Forts
                            </h4>
                            <div className="space-y-2">
                              {quiz.strongAreas.map((area, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  {area}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Weak Areas */}
                        {quiz.weakAreas.length > 0 && (
                          <div>
                            <h4 className="font-medium text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              Axes d'Amélioration
                            </h4>
                            <div className="space-y-2">
                              {quiz.weakAreas.map((area, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <XCircle className="h-4 w-4 text-red-500" />
                                  {area}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Summary Stats */}
      {filteredHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Résumé de la Période
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const completedQuizzes = filteredHistory.filter(({ status }) => status === 'completed');
              const totalDuration = filteredHistory.reduce((acc, { duration }) => acc + duration, 0);
              const averageScore = completedQuizzes.length > 0 
                ? Math.round(completedQuizzes.reduce((acc, { score }) => acc + score, 0) / completedQuizzes.length)
                : 0;
              const bestScore = completedQuizzes.length > 0 
                ? Math.max(...completedQuizzes.map(({ score }) => score))
                : 0;
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {completedQuizzes.length}
                    </div>
                    <div className="text-sm text-gray-600">Quiz Terminés</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {averageScore}%
                    </div>
                    <div className="text-sm text-gray-600">Score Moyen</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(totalDuration)}min
                    </div>
                    <div className="text-sm text-gray-600">Temps Total</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {bestScore}%
                    </div>
                    <div className="text-sm text-gray-600">Meilleur Score</div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default memo(QuizHistorySection);