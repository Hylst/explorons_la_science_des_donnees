import React, { useMemo, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy,
  Target,
  Clock,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  RotateCcw,
  Home,
  Share2,
  Award,
  Brain,
  AlertTriangle,
  BookOpen,
  Star,
  Zap
} from "lucide-react";
import { QuizQuestion, SimpleQuizResults } from '@/types/quiz';
import { useErrorHandling } from '@/hooks/use-error-handling';

/**
 * Props for QuizResults component
 */
interface QuizResultsProps {
  results: SimpleQuizResults;
  questions: QuizQuestion[];
  categoryTitle: string;
  onRetakeQuiz: () => void;
  onBackToQuizzes: () => void;
}

/**
 * Get score color and message using modern object mapping
 */
const getScoreDisplay = (score: number) => {
  const scoreRanges = [
    {
      threshold: 90,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-300',
      icon: <Trophy className="h-8 w-8 text-yellow-500" />,
      message: 'Excellent',
      description: 'Beau résultat : vous semblez à l\'aise avec ce sujet.'
    },
    {
      threshold: 75,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-300',
      icon: <Award className="h-8 w-8 text-blue-500" />,
      message: 'Très bien',
      description: 'Bonne performance. Quelques points à revoir pour consolider vos acquis.'
    },
    {
      threshold: 60,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-300',
      icon: <Target className="h-8 w-8 text-yellow-500" />,
      message: 'Bien',
      description: 'Performance correcte. Continuez à vous entraîner pour progresser.'
    },
    {
      threshold: 0,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-300',
      icon: <AlertTriangle className="h-8 w-8 text-red-500" />,
      message: 'À améliorer',
      description: 'Il y a encore du travail. Révisez les concepts et retentez le quiz.'
    }
  ];
  
  return scoreRanges.find(range => score >= range.threshold) ?? scoreRanges[scoreRanges.length - 1];
};

/**
 * Get difficulty color using modern object mapping
 */
const getDifficultyColor = (difficulty: string): string => {
  const colorMap: Record<string, string> = {
    'Débutant': 'bg-green-100 text-green-800 border-green-300',
    'Intermédiaire': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Avancé': 'bg-red-100 text-red-800 border-red-300'
  };
  return colorMap[difficulty] ?? 'bg-gray-100 text-gray-800 border-gray-300';
};

/**
 * Format time display using ternary operator
 */
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return minutes > 0 ? `${minutes}min ${remainingSeconds}s` : `${remainingSeconds}s`;
};

/**
 * Calculate average time per question using arrow function composition
 */
const getAverageTime = (totalTime: number, totalQuestions: number): string => 
  formatTime(Math.round(totalTime / totalQuestions));

/**
 * Performance insight interface
 */
interface PerformanceInsight {
  type: string;
  icon: React.ReactNode;
  message: string;
  color: string;
}

/**
 * Get performance insights using modern array methods and functional programming
 */
const getPerformanceInsights = (results: SimpleQuizResults, questions: QuizQuestion[]): PerformanceInsight[] => {
  const insights: PerformanceInsight[] = [];
  
  // Time analysis using early returns
  const avgTime = results.totalTime / results.totalQuestions;
  const timeInsights = [
    {
      condition: avgTime < 30,
      insight: {
        type: 'time',
        icon: <Zap className="h-4 w-4" />,
        message: 'Vous avez répondu rapidement. Assurez-vous de bien lire chaque question.',
        color: 'text-yellow-600'
      }
    },
    {
      condition: avgTime > 120,
      insight: {
        type: 'time',
        icon: <Clock className="h-4 w-4" />,
        message: 'Prenez le temps de réfléchir, mais essayez d\'être plus efficace.',
        color: 'text-blue-600'
      }
    }
  ];
  
  timeInsights
    .filter(({ condition }) => condition)
    .forEach(({ insight }) => insights.push(insight));

  // Difficulty analysis using reduce and modern array methods
  const difficultyPerformance = questions.reduce((acc, question) => {
    const answer = results.answers.find(a => a.questionId === question.id);
    if (!answer) return acc;
    
    const current = acc.get(question.difficulty) ?? { correct: 0, total: 0 };
    acc.set(question.difficulty, {
      correct: current.correct + (answer.isCorrect ? 1 : 0),
      total: current.total + 1
    });
    return acc;
  }, new Map<string, { correct: number; total: number }>());

  Array.from(difficultyPerformance.entries())
    .map(([difficulty, perf]) => ({ difficulty, perf, percentage: (perf.correct / perf.total) * 100 }))
    .filter(({ perf }) => perf.total > 1)
    .forEach(({ difficulty, percentage }) => {
      if (percentage === 100) {
        insights.push({
          type: 'difficulty',
          icon: <Star className="h-4 w-4" />,
          message: `Parfait sur les questions ${difficulty.toLowerCase()}.`,
          color: 'text-green-600'
        });
      } else if (percentage < 50) {
        insights.push({
          type: 'difficulty',
          icon: <AlertTriangle className="h-4 w-4" />,
          message: `Travaillez davantage les questions ${difficulty.toLowerCase()}.`,
          color: 'text-red-600'
        });
      }
    });

  return insights;
};

/**
 * QuizResults component - Displays detailed quiz results and analysis - optimized with memoization
 */
const QuizResults: React.FC<QuizResultsProps> = ({ 
  results, 
  questions, 
  categoryTitle, 
  onRetakeQuiz, 
  onBackToQuizzes 
}) => {
  // Error handling hook
  const { error, handleError, clearError } = useErrorHandling();
  
  // Memoize expensive calculations
  const scoreDisplay = useMemo(() => getScoreDisplay(results.score), [results.score]);
  const insights: PerformanceInsight[] = useMemo(() => getPerformanceInsights(results, questions), [results, questions]);

  /**
   * Share results using modern async/await and optional chaining - memoized for performance
   */
  const handleShare = useCallback(async (): Promise<void> => {
    try {
      const shareData = {
        title: `Quiz ${categoryTitle} - ${results.score}%`,
        text: `Je viens de terminer le quiz "${categoryTitle}" avec un score de ${results.score} %.`,
        url: window.location.href
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard?.writeText(
          `Je viens de terminer le quiz "${categoryTitle}" avec un score de ${results.score} %.`
        );
      }
      clearError(); // Clear any previous errors
    } catch (err) {
      handleError(err as Error, { message: 'Failed to share results' });
    }
  }, [categoryTitle, results.score, handleError, clearError]);

  /**
   * Handle retake quiz with error handling
   */
  const handleRetakeQuiz = useCallback(() => {
    try {
      onRetakeQuiz();
      clearError();
    } catch (err) {
      handleError(err as Error, { message: 'Failed to retake quiz' });
    }
  }, [onRetakeQuiz, handleError, clearError]);

  /**
   * Handle back to quizzes with error handling
   */
  const handleBackToQuizzes = useCallback(() => {
    try {
      onBackToQuizzes();
      clearError();
    } catch (err) {
      handleError(err as Error, { message: 'Failed to navigate back to quizzes' });
    }
  }, [onBackToQuizzes, handleError, clearError]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-medium text-red-900 dark:text-red-100">
                  Erreur
                </h4>
                <p className="text-red-800 dark:text-red-200">
                  {error.message}
                </p>
                <Button variant="outline" size="sm" onClick={clearError}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Réessayer
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Résultats du Quiz
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {categoryTitle}
          </p>
        </div>

        {/* Main Score Card */}
        <Card className={`border-2 ${scoreDisplay.borderColor} ${scoreDisplay.bgColor}`}>
          <CardContent className="text-center py-8">
            <div className="space-y-6">
              <div className="flex justify-center">
                {scoreDisplay.icon}
              </div>
              
              <div className="space-y-2">
                <div className={`text-6xl font-bold ${scoreDisplay.color}`}>
                  {results.score}%
                </div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  {scoreDisplay.message}
                </div>
                <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                  {scoreDisplay.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {results.correctAnswers}/{results.totalQuestions}
                  </div>
                  <div className="text-sm text-gray-600">Bonnes réponses</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatTime(results.totalTime)}
                  </div>
                  <div className="text-sm text-gray-600">Temps total</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {getAverageTime(results.totalTime, results.totalQuestions)}
                  </div>
                  <div className="text-sm text-gray-600">Temps moyen</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strong Areas */}
          {results.strongAreas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <TrendingUp className="h-5 w-5" />
                  Points Forts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.strongAreas.map((area, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">{area}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Weak Areas */}
          {results.weakAreas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <TrendingDown className="h-5 w-5" />
                  Axes d'Amélioration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.weakAreas.map((area, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-red-800">{area}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Performance Insights */}
        {insights.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Analyse de Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className={insight.color}>
                      {insight.icon}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{insight.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Révision Détaillée
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {questions.map((question, index) => {
                const userAnswer = results.answers.find(a => a.questionId === question.id);
                if (!userAnswer) return null;

                return (
                  <div key={question.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">Question {index + 1}</Badge>
                          <Badge className={getDifficultyColor(question.difficulty)}>
                            {question.difficulty}
                          </Badge>
                          <Badge variant="secondary">{question.topic}</Badge>
                          {userAnswer.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {question.question}
                        </h4>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>Temps: {formatTime(userAnswer.timeSpent)}</div>
                        <div>{question.points} pts</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isCorrect = optionIndex === question.correctAnswer;
                        const isSelected = userAnswer.selectedAnswer === optionIndex;
                        
                        let styling = 'p-3 rounded border ';
                        if (isCorrect) {
                          styling += 'border-green-500 bg-green-50 text-green-800';
                        } else if (isSelected) {
                          styling += 'border-red-500 bg-red-50 text-red-800';
                        } else {
                          styling += 'border-gray-200 bg-gray-50 text-gray-700';
                        }

                        return (
                          <div key={optionIndex} className={styling}>
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              <div className="flex items-center gap-2">
                                {isSelected && (
                                  <Badge variant="outline" className="text-xs">
                                    Votre réponse
                                  </Badge>
                                )}
                                {isCorrect && (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded">
                      <div className="flex items-start gap-2">
                        <BookOpen className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-blue-900 dark:text-blue-100 text-sm mb-1">
                            Explication
                          </div>
                          <p className="text-blue-800 dark:text-blue-200 text-sm">
                            {question.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleRetakeQuiz} size="lg">
            <RotateCcw className="h-4 w-4 mr-2" />
            Refaire le quiz
          </Button>
          
          <Button variant="outline" onClick={handleShare} size="lg">
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
          
          <Button variant="outline" onClick={handleBackToQuizzes} size="lg">
            <Home className="h-4 w-4 mr-2" />
            Retour aux quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(QuizResults);