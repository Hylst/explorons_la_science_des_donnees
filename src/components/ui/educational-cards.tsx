
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, BookOpen, Zap, Eye, AlertCircle, CheckCircle, Brain, TrendingUp, Users, Target } from "lucide-react";

interface EducationalCardProps {
  title: string;
  children: React.ReactNode;
  type?: "zoom" | "rappel" | "saviez-vous" | "exemple" | "exercice" | "concept" | "analogie" | "application";
  className?: string;
}

export const EducationalCard = ({ title, children, type = "zoom", className = "" }: EducationalCardProps) => {
  const getCardStyle = () => {
    switch (type) {
      case "zoom":
        return "border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 dark:from-blue-950/50 dark:to-blue-900/50";
      case "rappel":
        return "border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 dark:from-orange-950/50 dark:to-orange-900/50";
      case "saviez-vous":
        return "border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 dark:from-green-950/50 dark:to-green-900/50";
      case "exemple":
        return "border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 dark:from-purple-950/50 dark:to-purple-900/50";
      case "exercice":
        return "border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 dark:from-red-950/50 dark:to-red-900/50";
      case "concept":
        return "border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 dark:from-indigo-950/50 dark:to-indigo-900/50";
      case "analogie":
        return "border-l-4 border-l-teal-500 bg-gradient-to-r from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 dark:from-teal-950/50 dark:to-teal-900/50";
      case "application":
        return "border-l-4 border-l-pink-500 bg-gradient-to-r from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 dark:from-pink-950/50 dark:to-pink-900/50";
      default:
        return "border-l-4 border-l-gray-500 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "zoom":
        return <Eye className="h-5 w-5 text-blue-600" />;
      case "rappel":
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case "saviez-vous":
        return <Lightbulb className="h-5 w-5 text-green-600" />;
      case "exemple":
        return <BookOpen className="h-5 w-5 text-purple-600" />;
      case "exercice":
        return <Zap className="h-5 w-5 text-red-600" />;
      case "concept":
        return <Brain className="h-5 w-5 text-indigo-600" />;
      case "analogie":
        return <Users className="h-5 w-5 text-teal-600" />;
      case "application":
        return <Target className="h-5 w-5 text-pink-600" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  return (
    <Card className={`transition-all duration-500 hover:shadow-xl hover:scale-[1.02] transform ${getCardStyle()} ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg">
          {getIcon()}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
};

interface QuizProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty?: "facile" | "moyen" | "difficile";
}

export const QuizCard = ({ question, options, correctAnswer, explanation, difficulty = "moyen" }: QuizProps) => {
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
  const [showResult, setShowResult] = React.useState(false);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const resetQuiz = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case "facile": return "bg-green-100 text-green-800";
      case "moyen": return "bg-yellow-100 text-yellow-800";
      case "difficile": return "bg-red-100 text-red-800";
    }
  };

  return (
    <Card className="border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 transition-all duration-500 hover:shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="h-5 w-5 text-indigo-600" />
            Quiz
          </CardTitle>
          <Badge className={getDifficultyColor()}>{difficulty}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="font-medium text-gray-800">{question}</p>
          
          <div className="space-y-3">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                  showResult
                    ? index === correctAnswer
                      ? "bg-green-100 border-green-500 text-green-800 shadow-lg"
                      : index === selectedAnswer
                      ? "bg-red-100 border-red-500 text-red-800"
                      : "bg-gray-100 border-gray-300"
                    : "bg-white border-gray-300 hover:bg-indigo-50 hover:border-indigo-300 hover:shadow-md"
                }`}
              >
                <span className="font-medium mr-3 text-lg">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>

          {showResult && (
            <div className="mt-6 p-6 bg-white rounded-xl border-2 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                {selectedAnswer === correctAnswer ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-red-600" />
                )}
                <span className="font-semibold text-lg">
                  {selectedAnswer === correctAnswer ? "Excellent ! 🎉" : "Pas tout à fait..."}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{explanation}</p>
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Recommencer
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface ExerciseProps {
  title: string;
  problem: string;
  solution: string;
  hints?: string[];
  difficulty?: "débutant" | "intermédiaire" | "avancé";
  estimatedTime?: string;
}

export const ExerciseCard = ({ title, problem, solution, hints = [], difficulty = "intermédiaire", estimatedTime = "15 min" }: ExerciseProps) => {
  const [showSolution, setShowSolution] = React.useState(false);
  const [showHints, setShowHints] = React.useState(false);
  const [currentHint, setCurrentHint] = React.useState(0);

  const getDifficultyColor = () => {
    switch (difficulty) {
      case "débutant": return "bg-green-100 text-green-800";
      case "intermédiaire": return "bg-yellow-100 text-yellow-800";
      case "avancé": return "bg-red-100 text-red-800";
    }
  };

  return (
    <EducationalCard title={title} type="exercice">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Badge className={getDifficultyColor()}>{difficulty}</Badge>
          <Badge variant="outline">⏱️ {estimatedTime}</Badge>
        </div>

        <div className="bg-white p-6 rounded-xl border-2 shadow-sm">
          <h4 className="font-semibold mb-3 text-gray-800">📋 Énoncé :</h4>
          <p className="text-gray-700 leading-relaxed">{problem}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {hints.length > 0 && (
            <button
              onClick={() => setShowHints(!showHints)}
              className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium shadow-sm"
            >
              {showHints ? "Masquer les indices 🙈" : "Voir les indices 💡"}
            </button>
          )}
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium shadow-sm"
          >
            {showSolution ? "Masquer la solution 🙈" : "Voir la solution ✅"}
          </button>
        </div>

        {showHints && hints.length > 0 && (
          <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-200 shadow-sm">
            <h4 className="font-semibold mb-3 text-yellow-800">💡 Indices :</h4>
            <div className="space-y-3">
              {hints.slice(0, currentHint + 1).map((hint, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                  <span className="font-medium text-yellow-600">#{index + 1}</span>
                  <p className="text-sm text-gray-700">{hint}</p>
                </div>
              ))}
              {currentHint < hints.length - 1 && (
                <button
                  onClick={() => setCurrentHint(currentHint + 1)}
                  className="text-sm text-yellow-600 hover:text-yellow-800 font-medium"
                >
                  Indice suivant ➡️
                </button>
              )}
            </div>
          </div>
        )}

        {showSolution && (
          <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200 shadow-sm">
            <h4 className="font-semibold mb-3 text-green-800">✅ Solution :</h4>
            <div className="text-sm whitespace-pre-wrap text-gray-700 font-mono bg-white p-4 rounded-lg border">
              {solution}
            </div>
          </div>
        )}
      </div>
    </EducationalCard>
  );
};

interface ProgressiveDisclosureProps {
  title: string;
  levels: {
    title: string;
    content: React.ReactNode;
    difficulty: "basic" | "intermediate" | "advanced";
  }[];
}

export const ProgressiveDisclosure = ({ title, levels }: ProgressiveDisclosureProps) => {
  const [currentLevel, setCurrentLevel] = React.useState(0);

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "basic": return "🟢";
      case "intermediate": return "🟡";
      case "advanced": return "🔴";
    }
  };

  return (
    <Card className="border-2 hover:shadow-xl transition-all duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {levels.map((level, index) => (
              <button
                key={index}
                onClick={() => setCurrentLevel(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  currentLevel === index
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {getDifficultyIcon(level.difficulty)} {level.title}
              </button>
            ))}
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl min-h-[200px] transition-all duration-500">
            <h4 className="font-semibold mb-3">{levels[currentLevel].title}</h4>
            {levels[currentLevel].content}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
