import { useState } from "react";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CourseQuizQuestion {
  question: string;
  options: string[];
  /** Index de la bonne réponse dans `options` */
  correct: number;
  explanation: string;
}

interface CourseQuizBlockProps {
  title?: string;
  questions: CourseQuizQuestion[];
}

/**
 * Mini-quiz de fin de module : retour immédiat sous chaque question,
 * sans fenêtre bloquante, avec score final et possibilité de recommencer.
 */
const CourseQuizBlock = ({ title = "Vérifiez votre compréhension", questions }: CourseQuizBlockProps) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const answered = Object.keys(answers).length;
  const score = questions.filter((q, i) => answers[i] === q.correct).length;
  const finished = answered === questions.length;

  return (
    <Card className="my-8 border-amber-200 bg-amber-50/40">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2 text-lg">
          <span>{title}</span>
          <span className="text-sm font-normal text-gray-600">
            {answered}/{questions.length} réponses
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((q, qi) => {
          const chosen = answers[qi];
          const isAnswered = chosen !== undefined;
          return (
            <fieldset key={qi} className="space-y-2">
              <legend className="mb-2 font-medium text-gray-900">
                {qi + 1}. {q.question}
              </legend>
              <div className="grid gap-2">
                {q.options.map((option, oi) => {
                  const isChosen = chosen === oi;
                  const isRight = oi === q.correct;
                  return (
                    <Button
                      key={oi}
                      type="button"
                      variant="outline"
                      disabled={isAnswered}
                      aria-pressed={isChosen}
                      onClick={() => setAnswers((prev) => ({ ...prev, [qi]: oi }))}
                      className={cn(
                        "h-auto justify-start whitespace-normal py-2 text-left disabled:opacity-100",
                        isAnswered && isRight && "border-green-500 bg-green-50 text-green-900",
                        isAnswered && isChosen && !isRight && "border-red-400 bg-red-50 text-red-900"
                      )}
                    >
                      <span className="mr-2 font-semibold">{String.fromCharCode(65 + oi)}.</span>
                      {option}
                      {isAnswered && isRight && <CheckCircle className="ml-auto h-4 w-4 shrink-0 text-green-600" aria-label="Bonne réponse" />}
                      {isAnswered && isChosen && !isRight && <XCircle className="ml-auto h-4 w-4 shrink-0 text-red-600" aria-label="Réponse incorrecte" />}
                    </Button>
                  );
                })}
              </div>
              {isAnswered && (
                <p role="status" className={cn("rounded-md p-3 text-sm", chosen === q.correct ? "bg-green-50 text-green-900" : "bg-red-50 text-red-900")}>
                  <strong>{chosen === q.correct ? "Correct. " : "Pas tout à fait. "}</strong>
                  {q.explanation}
                </p>
              )}
            </fieldset>
          );
        })}
        {finished && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
            <p className="font-semibold text-gray-900" role="status">
              Score : {score}/{questions.length}
            </p>
            <Button type="button" variant="outline" size="sm" onClick={() => setAnswers({})}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Recommencer
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseQuizBlock;
