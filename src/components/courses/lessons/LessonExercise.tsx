import { useState } from "react";
import { CheckCircle2, XCircle, Loader2, Eye, EyeOff, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import FigureOutput from "@/components/ui/figure-output";
import LessonMarkdown from "./LessonMarkdown";
import { runCode, type RunResult } from "@/lib/runner";
import { compareSqlOutputs } from "@/lib/lessons/check";
import type { LessonSection } from "@/lib/lessons/types";

type ExerciseSection = Extract<LessonSection, { kind: "exercise" }>;

interface LessonExerciseProps {
  exercise: ExerciseSection;
  /** Numéro affiché (« Exercice 2 ») */
  number: number;
}

type Verdict = { ok: boolean; message: string } | null;

const withSetup = (setup: string | undefined, code: string) => (setup ? `${setup}\n${code}` : code);

/**
 * Exercice vérifié par le vrai moteur : en SQL, le résultat de la réponse est comparé à celui du corrigé
 * sur les mêmes données ; en Python, la réponse est suivie des tests de l'exercice (assert).
 */
const LessonExercise = ({ exercise, number }: LessonExerciseProps) => {
  const [answer, setAnswer] = useState(exercise.starter);
  const [result, setResult] = useState<RunResult | null>(null);
  const [verdict, setVerdict] = useState<Verdict>(null);
  const [running, setRunning] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const check = async () => {
    setRunning(true);
    setVerdict(null);
    try {
      if (exercise.language === "sql") {
        const [mine, expected] = await Promise.all([
          runCode("sql", withSetup(exercise.setup, answer)),
          runCode("sql", withSetup(exercise.setup, exercise.solution)),
        ]);
        setResult(mine);
        if (mine.error) {
          setVerdict({ ok: false, message: "La requête provoque une erreur : lisez le message ci-dessous." });
        } else {
          const comparison = compareSqlOutputs(expected.output, mine.output, exercise.ordered, exercise.columns);
          setVerdict(comparison.ok ? { ok: true, message: "Bravo, c'est le résultat attendu." } : { ok: false, message: comparison.reason });
        }
      } else {
        const code = `${withSetup(exercise.setup, answer)}\n${exercise.test ?? ""}`;
        const mine = await runCode("python", code);
        setResult(mine);
        if (!mine.error) setVerdict({ ok: true, message: "Bravo, tous les tests passent." });
        else if (/AssertionError/.test(mine.error)) {
          const detail = mine.error.split("AssertionError").pop()?.replace(/^:\s*/, "").trim();
          setVerdict({ ok: false, message: detail ? `Pas encore : ${detail}` : "Pas encore : un test ne passe pas." });
        } else setVerdict({ ok: false, message: "Le code provoque une erreur : lisez le message ci-dessous." });
      }
    } finally {
      setRunning(false);
    }
  };

  return (
    <section className="mb-6 rounded-lg border-2 border-indigo-200 bg-indigo-50/40 p-4 dark:border-indigo-800 dark:bg-indigo-950/30">
      <h4 className="mb-2 font-semibold text-indigo-900 dark:text-indigo-200">Exercice {number}</h4>
      <LessonMarkdown md={exercise.prompt} />
      <textarea
        aria-label={`Votre réponse à l'exercice ${number}`}
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        spellCheck={false}
        rows={Math.min(16, Math.max(4, answer.split("\n").length + 1))}
        className="block w-full resize-y rounded-md bg-slate-900 p-3 font-mono text-sm leading-relaxed text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" onClick={check} disabled={running || !answer.trim()} className="bg-indigo-600 text-white hover:bg-indigo-700">
          {running && <Loader2 className="mr-1 h-4 w-4 animate-spin" aria-hidden="true" />}
          Vérifier
        </Button>
        {exercise.hint && (
          <Button type="button" variant="outline" onClick={() => setShowHint((v) => !v)}>
            <Lightbulb className="mr-1 h-4 w-4" aria-hidden="true" />
            {showHint ? "Masquer l'indice" : "Indice"}
          </Button>
        )}
        <Button type="button" variant="outline" onClick={() => setShowSolution((v) => !v)}>
          {showSolution ? <EyeOff className="mr-1 h-4 w-4" aria-hidden="true" /> : <Eye className="mr-1 h-4 w-4" aria-hidden="true" />}
          {showSolution ? "Masquer le corrigé" : "Voir le corrigé"}
        </Button>
      </div>
      <div aria-live="polite">
        {verdict && (
          <p className={`mt-3 flex items-start gap-2 rounded-md p-3 text-sm ${verdict.ok ? "bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-200" : "bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-200"}`}>
            {verdict.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" /> : <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />}
            <span>{verdict.message}</span>
          </p>
        )}
      </div>
      {result && (result.output || result.error) && (
        <div className="mt-3 rounded-md border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">
          <p className="mb-1 text-xs font-medium text-slate-500">Votre résultat</p>
          {result.error && <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-red-700 dark:text-red-400">{result.error}</pre>}
          {result.output && <pre className="overflow-x-auto text-sm text-slate-800 dark:text-slate-200">{result.output}</pre>}
          <FigureOutput images={result.images} />
        </div>
      )}
      {showHint && exercise.hint && (
        <div className="mt-3 rounded-md bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200">
          <LessonMarkdown md={exercise.hint} />
        </div>
      )}
      {showSolution && (
        <div className="mt-3">
          <p className="mb-1 text-xs font-medium text-slate-500">Corrigé (une solution possible parmi d'autres)</p>
          <pre className="overflow-x-auto rounded-md bg-slate-900 p-3 text-sm text-slate-100">{exercise.solution}</pre>
        </div>
      )}
    </section>
  );
};

export default LessonExercise;
