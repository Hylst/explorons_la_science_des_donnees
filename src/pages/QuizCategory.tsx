import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuizCategories } from '@/hooks/useQuiz';
import { QuizQuestion, QuizCategory as QuizCategoryData, SimpleQuizResults } from '@/types/quiz';
import { getRandomQuestions } from '@/data/quizData';
import { saveQuizAttempt } from '@/lib/quiz-storage';
import QuizTaking from '@/components/quiz/QuizTaking';
import QuizResults from '@/components/quiz/QuizResults';
import ContentLayout from '@/components/layout/ContentLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, Brain, ArrowLeft, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import { SITE_NAME } from "@/config/site";

/**
 * QuizCategory page component - Handles individual quiz category sessions
 * Manages the flow from category overview to quiz taking to results
 */
const QuizCategory: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { getCategoryById } = useQuizCategories();
  
  const [currentView, setCurrentView] = useState<'overview' | 'taking' | 'results'>('overview');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [results, setResults] = useState<SimpleQuizResults | null>(null);
  const [category, setCategory] = useState<QuizCategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Une tentative n'est enregistrée qu'une fois, même si « Terminer » est cliqué deux fois
  const attemptSavedRef = useRef(false);

  useEffect(() => {
    if (!categoryId) {
      setError('ID de catégorie manquant');
      setLoading(false);
      return;
    }

    try {
      const categoryData = getCategoryById(categoryId);
      if (!categoryData) {
        setError('Catégorie de quiz introuvable');
        setLoading(false);
        return;
      }

      setCategory(categoryData);
      setLoading(false);
    } catch {
      setError('Erreur lors du chargement de la catégorie');
      setLoading(false);
    }
  }, [categoryId, getCategoryById]);

  /**
   * Start the quiz by generating random questions
   */
  const handleStartQuiz = () => {
    if (!category) return;
    
    try {
      const quizQuestions = getRandomQuestions(categoryId!, 10); // Get 10 random questions
      attemptSavedRef.current = false;
      setQuestions(quizQuestions);
      setCurrentView('taking');
    } catch {
      setError('Erreur lors de la génération des questions');
    }
  };

  /**
   * Handle quiz completion
   */
  const handleQuizComplete = (quizResults: SimpleQuizResults) => {
    setResults(quizResults);
    setCurrentView('results');

    // Enregistre la tentative pour les statistiques et l'historique (stockage local du navigateur)
    if (!attemptSavedRef.current && category && categoryId) {
      attemptSavedRef.current = true;
      saveQuizAttempt({
        id: `${categoryId}-${Date.now()}`,
        categoryId,
        category: category.title,
        title: `Quiz : ${category.title}`,
        date: new Date().toISOString(),
        duration: Math.max(1, Math.ceil(quizResults.totalTime / 60)),
        score: quizResults.score,
        totalQuestions: quizResults.totalQuestions,
        correctAnswers: quizResults.correctAnswers,
        difficulty: category.difficulty,
        status: 'completed',
        topics: [...new Set(questions.map(({ topic }) => topic))],
        weakAreas: quizResults.weakAreas,
        strongAreas: quizResults.strongAreas
      });
    }
  };

  /**
   * Handle quiz exit
   */
  const handleQuizExit = () => {
    navigate('/quiz');
  };

  /**
   * Handle retake quiz
   */
  const handleRetakeQuiz = () => {
    setResults(null);
    setCurrentView('overview');
  };

  /**
   * Handle back to quizzes
   */
  const handleBackToQuizzes = () => {
    navigate('/quiz');
  };

  if (loading) {
    return (
      <ContentLayout 
        title="Chargement..." 
        backLink={{ href: "/quiz", label: "Retour aux quiz" }}
        sidebar={{ items: [] }}
      >
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du quiz...</p>
        </div>
      </ContentLayout>
    );
  }

  if (error || !category) {
    return (
      <ContentLayout 
        title="Erreur" 
        backLink={{ href: "/quiz", label: "Retour aux quiz" }}
        sidebar={{ items: [] }}
      >
        <div className="text-center py-8">
          <AlertCircle className="h-10 w-10 text-red-600 mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Quiz introuvable</h2>
          <p className="text-gray-600 mb-4">{error || 'Cette catégorie de quiz n\'existe pas.'}</p>
          <Button asChild>
            <Link to="/quiz">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux quiz
            </Link>
          </Button>
        </div>
      </ContentLayout>
    );
  }

  const pageTitle = `Quiz : ${category.title} - ${SITE_NAME}`;

  // Quiz taking view
  if (currentView === 'taking' && questions.length > 0) {
    return (
      <ContentLayout
        title={category.title}
        backLink={{
          href: "/quiz",
          label: "Retour aux quiz"
        }}
        sidebar={{ items: [] }}
      >
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={`Quiz de data science : ${category.description}.`} />
        </Helmet>
        <QuizTaking
          questions={questions}
          categoryTitle={category.title}
          onComplete={handleQuizComplete}
          onExit={handleQuizExit}
        />
      </ContentLayout>
    );
  }

  // Quiz results view
  if (currentView === 'results' && results) {
    return (
      <ContentLayout
        title={`Résultats - ${category.title}`}
        backLink={{
          href: "/quiz",
          label: "Retour aux quiz"
        }}
        sidebar={{ items: [] }}
      >
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={`Quiz de data science : ${category.description}.`} />
        </Helmet>
        <QuizResults
          results={results}
          questions={questions}
          categoryTitle={category.title}
          onRetakeQuiz={handleRetakeQuiz}
          onBackToQuizzes={handleBackToQuizzes}
        />
      </ContentLayout>
    );
  }

  // Quiz overview/start view
  return (
    <ContentLayout
      title={category.title}
      backLink={{
        href: "/quiz",
        label: "Retour aux quiz"
      }}
      sidebar={{ items: [] }}
    >
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={`Quiz de data science : ${category.description}.`} />
      </Helmet>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Category Header */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h1 className="flex items-center gap-3 text-2xl font-semibold leading-none tracking-tight">
                <Brain className="h-6 w-6 text-blue-600" />
                {category.title}
              </h1>
              <Badge className="bg-blue-100 text-blue-800">
                {category.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">{category.description}</p>
            
            {/* Quiz Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{category.questions?.length || 0}</div>
                <div className="text-sm text-gray-600">Questions disponibles</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{category.estimatedTime}</div>
                <div className="text-sm text-gray-600">Minutes estimées</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <Brain className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">{category.topics?.length || 0}</div>
                <div className="text-sm text-gray-600">Sujets couverts</div>
              </div>
            </div>

            {/* Topics */}
            {category.topics && category.topics.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Sujets couverts :</h3>
                <div className="flex flex-wrap gap-2">
                  {category.topics.map((topic: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Start Quiz Button */}
            <div className="text-center">
              <Button 
                onClick={handleStartQuiz}
                size="lg"
                className="px-8 py-3"
                disabled={!category.questions || category.questions.length === 0}
              >
                <Target className="h-5 w-5 mr-2" />
                Commencer le quiz
              </Button>
              {(!category.questions || category.questions.length === 0) && (
                <p className="text-sm text-gray-500 mt-2">
                  Aucune question disponible pour cette catégorie
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
};

export default QuizCategory;