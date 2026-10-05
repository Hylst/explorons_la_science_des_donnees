import React, { useMemo, memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Code,
  Calculator,
  Brain,
  BarChart3,
  Database,
  Zap,
  Server,
  Target,
  type LucideIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuizCategories, useQuizStats } from "@/hooks/useQuiz";

// Icon mapping for categories using modern object syntax
const iconMap: Record<string, LucideIcon> = {
  programming: Code,
  'math-stats': Calculator,
  'machine-learning': Brain,
  'data-visualization': BarChart3,
  'data-preparation': Database,
  'deep-learning': Zap,
  'big-data': Server,
  'business-intelligence': Target
} as const;

/**
 * Quiz Categories Section Component - optimized with memoization
 * Displays available quiz categories with their information and progress
 */
const QuizCategoriesSection: React.FC = () => {
  const { categories, loading, error, getQuizStats } = useQuizCategories();
  const { progress } = useQuizStats();
  
  // Les calculs mémorisés restent avant tout retour anticipé : l'ordre des hooks doit être constant
  const stats = useMemo(() => getQuizStats(), [getQuizStats]);
  // Meilleur score moyen sur les catégories déjà tentées (0 tant qu'aucun quiz n'a été terminé)
  const avgProgress = useMemo(() => {
    const progressValues = Object.values(progress);
    return progressValues.length > 0
      ? Math.round(progressValues.reduce((sum, p) => sum + p.bestScore, 0) / progressValues.length)
      : 0;
  }, [progress]);

  if (loading) return <div className="text-center py-8">Chargement des catégories...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Erreur: {error}</div>;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Choisissez votre Domaine d'Évaluation
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Sélectionnez une catégorie pour tester vos connaissances. Chaque quiz propose des questions adaptées à votre niveau avec des explications détaillées.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const IconComponent = iconMap[category.id] ?? Brain;
          const { id, title, description, difficulty, estimatedTime, questions, topics } = category;
          const [visibleTopics, remainingCount] = [topics.slice(0, 3), Math.max(0, topics.length - 3)];
          
          return (
            <Card key={id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {difficulty}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{estimatedTime} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="h-4 w-4" />
                    <span>{questions.length} questions</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {visibleTopics.map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {remainingCount > 0 && (
                      <Badge variant="outline" className="text-xs">
                        +{remainingCount}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Button asChild className="w-full">
                  <Link to={`/quiz/${id}`}>
                    Commencer le quiz
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalCategories}</div>
            <div className="text-sm text-muted-foreground">Catégories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.totalQuestions}</div>
            <div className="text-sm text-muted-foreground">Questions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalTime}min</div>
            <div className="text-sm text-muted-foreground">Temps total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{avgProgress}%</div>
            <div className="text-sm text-muted-foreground">Progression</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default memo(QuizCategoriesSection);