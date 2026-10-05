
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CourseHighlight from "@/components/courses/CourseHighlight";
import { Calculator, CheckCircle, XCircle, Trophy, Target } from "lucide-react";

const InteractiveExercises = () => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  const [score, setScore] = useState(0);

  const exercises = [
    {
      id: 1,
      title: "Produit scalaire",
      question: "Calculez le produit scalaire de v₁ = [3, 4] et v₂ = [2, 1]",
      options: ["11", "10", "14", "7"],
      correct: 1,
      explanation: "3×2 + 4×1 = 6 + 4 = 10",
      hint: "Multipliez coordonnée par coordonnée puis additionnez"
    },
    {
      id: 2,
      title: "Multiplication matricielle",
      question: "Que donne la multiplication [[2,1],[3,4]] × [5,2]ᵀ ?",
      options: ["[10, 15]", "[11, 22]", "[12, 23]", "[12, 20]"],
      correct: 2,
      explanation: "Ligne 1: 2×5 + 1×2 = 12, Ligne 2: 3×5 + 4×2 = 23",
      hint: "Chaque ligne de la matrice doit être multipliée avec le vecteur"
    },
    {
      id: 3,
      title: "Déterminant 2×2",
      question: "Quel est le déterminant de [[5,2],[3,1]] ?",
      options: ["1", "8", "16", "-1"],
      correct: 3,
      explanation: "det = (5×1) - (2×3) = 5 - 6 = -1",
      hint: "Pour une matrice 2×2: ad - bc"
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentExercise] = answerIndex.toString();
    setUserAnswers(newAnswers);
    
    if (answerIndex === exercises[currentExercise].correct) {
      setScore(score + 1);
    }
    setShowSolution(true);
  };

  const nextExercise = () => {
    setShowSolution(false);
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    }
  };

  const resetQuiz = () => {
    setCurrentExercise(0);
    setUserAnswers([]);
    setShowSolution(false);
    setScore(0);
  };

  const currentEx = exercises[currentExercise];
  const isComplete = currentExercise === exercises.length - 1 && showSolution;

  return (
    <section id="exercises" className="mb-12">
      <h2 className="text-3xl font-bold mb-6">7. Exercices Interactifs</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  {currentEx.title}
                </CardTitle>
                <Badge variant="outline">
                  {currentExercise + 1} / {exercises.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-medium text-blue-800 mb-2">Question :</p>
                  <p className="text-blue-700">{currentEx.question}</p>
                </div>

                {!showSolution && (
                  <div className="space-y-3">
                    <p className="font-medium">Choisissez votre réponse :</p>
                    <div className="grid grid-cols-2 gap-3">
                      {currentEx.options.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => handleAnswer(index)}
                          className="text-left justify-start"
                        >
                          {String.fromCharCode(65 + index)}. {option}
                        </Button>
                      ))}
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <p className="text-sm text-yellow-700">
                        <strong>💡 Indice :</strong> {currentEx.hint}
                      </p>
                    </div>
                  </div>
                )}

                {showSolution && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      {parseInt(userAnswers[currentExercise]) === currentEx.correct ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <p className="font-medium">
                        {parseInt(userAnswers[currentExercise]) === currentEx.correct ? "Correct !" : "Incorrect"}
                      </p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="font-medium text-green-800 mb-2">Solution :</p>
                      <p className="text-green-700 mb-2">
                        La bonne réponse est : <strong>{currentEx.options[currentEx.correct]}</strong>
                      </p>
                      <p className="text-green-600 text-sm">{currentEx.explanation}</p>
                    </div>

                    <div className="flex justify-between">
                      {!isComplete ? (
                        <Button onClick={nextExercise} className="ml-auto">
                          Exercice suivant →
                        </Button>
                      ) : (
                        <Button onClick={resetQuiz} className="ml-auto">
                          Recommencer le quiz
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Progression
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Score</span>
                    <span>{score} / {exercises.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(score / exercises.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  {exercises.map((ex, index) => (
                    <div key={ex.id} className="flex items-center gap-2 text-sm">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        index < currentExercise || (index === currentExercise && showSolution) 
                          ? 'bg-blue-100 text-blue-600' 
                          : index === currentExercise 
                            ? 'bg-yellow-100 text-yellow-600' 
                            : 'bg-gray-100 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <span className={
                        index <= currentExercise ? 'text-gray-900' : 'text-gray-500'
                      }>
                        {ex.title}
                      </span>
                      {userAnswers[index] !== undefined && (
                        parseInt(userAnswers[index]) === ex.correct ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )
                      )}
                    </div>
                  ))}
                </div>

                {isComplete && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="font-medium text-blue-800 mb-1">Quiz terminé !</p>
                    <p className="text-sm text-blue-600">
                      {score === exercises.length ? "🎉 Trois sur trois, bravo !" :
                       score >= 2 ? "👍 Bien joué, encore un petit effort !" :
                       "📚 Un tour dans le cours, puis on réessaie !"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <CourseHighlight title="🎯 Défis bonus" type="concept">
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-orange-600" />
                <span>Calculer l'inverse d'une matrice 3×3</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-600" />
                <span>Calculer une décomposition en valeurs singulières (SVD) avec NumPy et reconstruire la matrice</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-600" />
                <span>Prédire une note manquante en factorisant une petite matrice utilisateurs × films</span>
              </div>
            </div>
          </CourseHighlight>
        </div>
      </div>
    </section>
  );
};

export default InteractiveExercises;
