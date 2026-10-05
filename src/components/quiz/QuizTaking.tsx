import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Flag, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  BookOpen,
  Target,
  Award,
  RotateCcw,
  AlertTriangle
} from "lucide-react";
import { QuizQuestion, QuizAnswer, SimpleQuizResults } from '@/types/quiz';
import { useErrorHandling } from '@/hooks/use-error-handling';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";



/**
 * Props for QuizTaking component
 */
interface QuizTakingProps {
  questions: QuizQuestion[];
  categoryTitle: string;
  onComplete: (results: SimpleQuizResults) => void;
  onExit: () => void;
}

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
 * Format time display using modern string formatting
 */
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * QuizTaking component - Handles the quiz taking interface
 */
const QuizTaking: React.FC<QuizTakingProps> = ({ 
  questions, 
  categoryTitle, 
  onComplete, 
  onExit 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<string, QuizAnswer>>(new Map());
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [totalTime, setTotalTime] = useState(0);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const { error, handleError, clearError } = useErrorHandling();

  // Memoized calculations for performance
  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);
  const progress = useMemo(() => ((currentQuestionIndex + 1) / questions.length) * 100, [currentQuestionIndex, questions.length]);
  const isLastQuestion = useMemo(() => currentQuestionIndex === questions.length - 1, [currentQuestionIndex, questions.length]);

  /**
   * Update timer every second
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  /**
   * Load existing answer when question changes
   */
  useEffect(() => {
    const existingAnswer = userAnswers.get(currentQuestion.id);
    if (existingAnswer) {
      setSelectedOption(existingAnswer.selectedAnswer);
      setIsAnswered(true);
      setShowExplanation(true);
    } else {
      setSelectedOption(null);
      setIsAnswered(false);
      setShowExplanation(false);
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex, currentQuestion.id, userAnswers]);

  /**
   * Handle option selection with early return pattern - memoized for performance
   */
  const handleOptionSelect = useCallback((optionIndex: number): void => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
  }, [isAnswered]);

  /**
   * Submit answer for current question using modern arrow function - memoized for performance
   */
  const submitAnswer = useCallback(() => {
    try {
      if (selectedOption === null || isAnswered) return;
      
      const isCorrect = selectedOption === currentQuestion.correctAnswer;
      
      const answer: QuizAnswer = {
          questionId: currentQuestion.id,
          selectedAnswer: selectedOption,
          isCorrect,
          timeSpent: Math.round((Date.now() - questionStartTime) / 1000),
          timestamp: new Date()
      };

      setUserAnswers(prev => new Map(prev).set(currentQuestion.id, answer));
      setIsAnswered(true);
      setShowExplanation(true);
      clearError(); // Clear any previous errors
    } catch (err) {
      handleError(err as Error, { message: 'Failed to submit answer' });
    }
  }, [selectedOption, isAnswered, questionStartTime, currentQuestion.correctAnswer, currentQuestion.id, handleError, clearError]);

  /**
   * Calculate and display quiz results using modern array methods - memoized for performance
   */
  const handleFinishQuiz = useCallback((): void => {
    try {
      const answers = Array.from(userAnswers.values());
      const correctAnswers = answers.filter(({ isCorrect }) => isCorrect).length;
      const score = Math.round((correctAnswers / questions.length) * 100);
      
      // Analyze performance by topic using reduce
      const topicPerformance = questions.reduce((acc, question) => {
        const answer = userAnswers.get(question.id);
        if (!answer) return acc;
        
        const current = acc.get(question.topic) ?? { correct: 0, total: 0 };
        acc.set(question.topic, {
          correct: current.correct + (answer.isCorrect ? 1 : 0),
          total: current.total + 1
        });
        return acc;
      }, new Map<string, { correct: number; total: number }>());

      const { weakAreas, strongAreas } = Array.from(topicPerformance.entries())
        .reduce((areas, [topic, performance]) => {
          const percentage = (performance.correct / performance.total) * 100;
          if (percentage < 60) {
            areas.weakAreas.push(topic);
          } else if (percentage >= 80) {
            areas.strongAreas.push(topic);
          }
          return areas;
        }, { weakAreas: [] as string[], strongAreas: [] as string[] });

      const results: SimpleQuizResults = {
        score,
        totalQuestions: questions.length,
        correctAnswers,
        totalTime,
        answers,
        weakAreas,
        strongAreas
      };

      onComplete(results);
      clearError(); // Clear any previous errors
    } catch (err) {
      handleError(err as Error, { message: 'Failed to complete quiz' });
    }
  }, [userAnswers, questions, totalTime, onComplete, handleError, clearError]);

  /**
   * Navigate to next question using ternary operator - memoized for performance
   */
  const handleNextQuestion = useCallback((): void => {
    try {
      isLastQuestion ? handleFinishQuiz() : setCurrentQuestionIndex(prev => prev + 1);
    } catch (err) {
      handleError(err as Error, { message: 'Failed to navigate to next question' });
    }
  }, [isLastQuestion, handleFinishQuiz, handleError]);

  /**
   * Navigate to previous question with guard clause - memoized for performance
   */
  const handlePreviousQuestion = useCallback((): void => {
    try {
      if (currentQuestionIndex <= 0) return;
      setCurrentQuestionIndex(prev => prev - 1);
    } catch (err) {
      handleError(err as Error, { message: 'Failed to navigate to previous question' });
    }
  }, [currentQuestionIndex, handleError]);

  /**
   * Handle quiz exit - memoized for performance
   */
  const handleExit = useCallback((): void => setShowExitDialog(true), []);

  /**
   * Confirm quiz exit - memoized for performance
   */
  const confirmExit = useCallback((): void => {
    setShowExitDialog(false);
    onExit();
  }, [onExit]);

  /**
   * Get option styling based on state using modern conditional logic
   */
  const getOptionStyling = (optionIndex: number): string => {
    if (!isAnswered) {
      return selectedOption === optionIndex 
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
        : 'border-gray-200 hover:border-gray-300';
    }

    // Show correct/incorrect after answering
    const isCorrectAnswer = optionIndex === currentQuestion.correctAnswer;
    const isSelectedWrong = selectedOption === optionIndex && !isCorrectAnswer;
    
    if (isCorrectAnswer) return 'border-green-500 bg-green-50 dark:bg-green-900/20';
    if (isSelectedWrong) return 'border-red-500 bg-red-50 dark:bg-red-900/20';
    
    return 'border-gray-200';
  };

  /**
   * Get option icon using early returns and modern JSX
   */
  const getOptionIcon = (optionIndex: number): JSX.Element | null => {
    if (!isAnswered) return null;

    const isCorrectAnswer = optionIndex === currentQuestion.correctAnswer;
    const isSelectedWrong = selectedOption === optionIndex && !isCorrectAnswer;
    
    if (isCorrectAnswer) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (isSelectedWrong) return <XCircle className="h-5 w-5 text-red-600" />;
    
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto space-y-6">
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
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {categoryTitle}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Question {currentQuestionIndex + 1} sur {questions.length}</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(totalTime)}
              </div>
            </div>
          </div>
          
          <Button variant="outline" onClick={handleExit}>
            <Flag className="h-4 w-4 mr-2" />
            Quitter
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progression</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                    {currentQuestion.difficulty}
                  </Badge>
                  <Badge variant="secondary">
                    {currentQuestion.topic}
                  </Badge>
                  <Badge variant="outline">
                    {currentQuestion.points} pts
                  </Badge>
                </div>
                <CardTitle className="text-xl leading-relaxed">
                  {currentQuestion.question}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    getOptionStyling(index)
                  } ${!isAnswered ? 'hover:shadow-sm' : ''}`}
                  onClick={() => handleOptionSelect(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedOption === index 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {selectedOption === index && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-gray-900 dark:text-white">{option}</span>
                    </div>
                    {getOptionIcon(index)}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            {!isAnswered && (
              <div className="flex justify-center">
                <Button 
                  onClick={submitAnswer}
                  disabled={selectedOption === null}
                  size="lg"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Valider la réponse
                </Button>
              </div>
            )}

            {/* Explanation */}
            {showExplanation && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">
                      Explication
                    </h4>
                    <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Précédent
          </Button>

          {isAnswered && (
            <Button onClick={handleNextQuestion}>
              {isLastQuestion ? (
                <>
                  <Award className="h-4 w-4 mr-2" />
                  Terminer le quiz
                </>
              ) : (
                <>
                  Suivant
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Quitter le quiz ?
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir quitter ce quiz ? Votre progression sera perdue.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>
              Continuer le quiz
            </Button>
            <Button variant="destructive" onClick={confirmExit}>
              Quitter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default memo(QuizTaking);