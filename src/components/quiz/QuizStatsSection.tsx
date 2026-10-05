import React, { useMemo, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp, 
  Award, 
  Calendar,
  BarChart3,
  Flame,
  CheckCircle
} from "lucide-react";
import { useQuizStats, useQuizHistory, useQuizCategories } from "@/hooks/useQuiz";

/**
 * Category icon mapping
 */
const getCategoryIcon = (categoryId: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    'data-visualization': <BarChart3 className="h-5 w-5" />,
    'programming': <Target className="h-5 w-5" />,
    'machine-learning': <Target className="h-5 w-5" />,
    'statistics': <BarChart3 className="h-5 w-5" />,
    'data-preparation': <Target className="h-5 w-5" />,
    'databases': <Target className="h-5 w-5" />,
    'big-data': <BarChart3 className="h-5 w-5" />,
    'ethics': <Target className="h-5 w-5" />
  };
  return iconMap[categoryId] || <Target className="h-5 w-5" />;
};

/**
 * Get achievement icon component
 */
const getAchievementIcon = (iconName: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    'trophy': <Trophy className="h-5 w-5" />,
    'award': <Award className="h-5 w-5" />,
    'flame': <Flame className="h-5 w-5" />,
    'target': <Target className="h-5 w-5" />,
    'check-circle': <CheckCircle className="h-5 w-5" />
  };
  return iconMap[iconName] || <Trophy className="h-5 w-5" />;
};

/**
 * Get achievement category color - optimized with object map
 */
const getAchievementColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    completion: 'bg-gray-100 text-gray-800 border-gray-300',
    score: 'bg-blue-100 text-blue-800 border-blue-300',
    streak: 'bg-purple-100 text-purple-800 border-purple-300',
    time: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    special: 'bg-green-100 text-green-800 border-green-300'
  };
  return colorMap[category] ?? 'bg-gray-100 text-gray-800 border-gray-300';
};

/**
 * Get score color based on percentage - optimized with ternary operators
 */
const getScoreColor = (score: number): string => 
  score >= 90 ? 'text-green-600' :
  score >= 75 ? 'text-blue-600' :
  score >= 60 ? 'text-yellow-600' : 'text-red-600';

/**
 * Format time duration - optimized arrow function
 */
const formatTime = (minutes: number): string => {
  const [hours, mins] = [Math.floor(minutes / 60), minutes % 60];
  return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
};

/**
 * QuizStatsSection component - Displays user quiz statistics and progress - optimized with memoization
 */
const QuizStatsSection: React.FC = () => {
  const { stats } = useQuizStats();
  const { history } = useQuizHistory();
  const { categories } = useQuizCategories();

  // Memoize expensive calculations
  const userStats = stats;
  const completionPercentage = useMemo(() => 
    Math.round((userStats.categoriesCompleted / userStats.totalCategories) * 100), 
    [userStats.categoriesCompleted, userStats.totalCategories]
  );

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Vos Statistiques de Performance
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Suivez votre progression et identifiez vos points forts et axes d'amélioration.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Trophy className="h-8 w-8 mx-auto text-yellow-500" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {userStats.totalAttempts}
              </div>
              <div className="text-sm text-gray-600">Quiz Complétés</div>
            </div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Target className="h-8 w-8 mx-auto text-blue-500" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {userStats.totalQuestionsAnswered}
              </div>
              <div className="text-sm text-gray-600">Questions Répondues</div>
            </div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <TrendingUp className="h-8 w-8 mx-auto text-green-500" />
              <div className={`text-2xl font-bold ${getScoreColor(userStats.averageScore)}`}>
                {userStats.averageScore}%
              </div>
              <div className="text-sm text-gray-600">Score Moyen</div>
            </div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Clock className="h-8 w-8 mx-auto text-purple-500" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatTime(userStats.totalTimeSpent)}
              </div>
              <div className="text-sm text-gray-600">Temps Total</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Progression Générale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Catégories complétées</span>
                <span className="font-medium">{userStats.categoriesCompleted}/{userStats.totalCategories}</span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
              <div className="text-center text-sm text-gray-600">
                {completionPercentage}% de progression globale
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center space-y-1">
                <div className="text-lg font-bold text-green-600">{userStats.bestScore}%</div>
                <div className="text-sm text-gray-600">Meilleur Score</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-lg font-bold text-orange-600">{userStats.currentStreak}</div>
                <div className="text-sm text-gray-600">Série Actuelle</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-lg font-bold text-blue-600">{userStats.longestStreak}</div>
                <div className="text-sm text-gray-600">Plus Longue Série</div>
              </div>
            </div>
        </CardContent>
      </Card>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            Performance par Catégorie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.keys(userStats.categoryStats).length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune performance à afficher</p>
                <p className="text-sm">Vos scores par catégorie apparaîtront après votre premier quiz</p>
              </div>
            )}
            {Object.entries(userStats.categoryStats).map(([categoryId, categoryData]) => {
              const category = categories.find(cat => cat.id === categoryId);
              const categoryTitle = category?.title || categoryId;
              
              return (
                <div key={categoryId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                        {getCategoryIcon(categoryId)}
                      </div>
                      <div>
                        <div className="font-medium">{categoryTitle}</div>
                        <div className="text-sm text-gray-600">
                          {categoryData.attempts} tentative{categoryData.attempts > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getScoreColor(categoryData.bestScore)}`}>
                        {categoryData.bestScore}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {categoryData.lastAttempt.toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                  <Progress value={categoryData.bestScore} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            Activité Récente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {history.length > 0 ? (
              history.slice(0, 5).map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{attempt.category}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(attempt.date).toLocaleDateString('fr-FR')} • {attempt.totalQuestions} questions
                    </div>
                  </div>
                  <Badge className={`${getScoreColor(attempt.score)} bg-transparent border`}>
                    {attempt.score}%
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune activité récente</p>
                <p className="text-sm">Commencez un quiz pour voir votre activité ici</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Réalisations Débloquées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userStats.achievements.length > 0 ? (
              userStats.achievements.map((achievement) => (
                <div key={achievement.id} className={`p-4 rounded-lg border-2 ${getAchievementColor(achievement.category)}`}>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white dark:bg-gray-100 shadow-sm">
                      {getAchievementIcon(achievement.icon)}
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium">{achievement.title}</div>
                      <div className="text-sm opacity-80">{achievement.description}</div>
                      <div className="text-xs opacity-60">
                        Débloqué le {achievement.unlockedAt.toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-8">
                <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune réalisation débloquée</p>
                <p className="text-sm">Complétez des quiz pour débloquer des réalisations</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default memo(QuizStatsSection);