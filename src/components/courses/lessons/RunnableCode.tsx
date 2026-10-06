import { useState } from "react";
import { Play, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FigureOutput from "@/components/ui/figure-output";
import { runCode, type RunResult } from "@/lib/runner";
import type { LessonLanguage } from "@/lib/lessons/types";

interface RunnableCodeProps {
  language: LessonLanguage;
  code: string;
  /** Exécuté avant le code, sans être affiché (création et remplissage des tables...) */
  setup?: string;
  caption?: string;
  /** Libellé accessible de la zone de code */
  label: string;
}

const LANGUAGE_NAME: Record<LessonLanguage, string> = { sql: "SQL (SQLite)", python: "Python" };

/** Exemple de leçon modifiable et réellement exécuté dans le navigateur */
const RunnableCode = ({ language, code, setup, caption, label }: RunnableCodeProps) => {
  const [value, setValue] = useState(code);
  const [result, setResult] = useState<RunResult | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    setResult(null);
    try {
      setResult(await runCode(language, setup ? `${setup}\n${value}` : value, setStatus));
    } finally {
      setRunning(false);
      setStatus(null);
    }
  };

  return (
    <figure className="mb-4 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-100 px-3 py-2 dark:bg-slate-800">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{LANGUAGE_NAME[language]} · modifiable</span>
        <div className="flex flex-wrap gap-2">
          {value !== code && (
            <Button type="button" size="sm" variant="ghost" onClick={() => setValue(code)}>
              <RotateCcw className="mr-1 h-4 w-4" aria-hidden="true" />
              Revenir à l'exemple
            </Button>
          )}
          <Button type="button" size="sm" onClick={run} disabled={running} className="bg-blue-600 text-white hover:bg-blue-700">
            {running ? <Loader2 className="mr-1 h-4 w-4 animate-spin" aria-hidden="true" /> : <Play className="mr-1 h-4 w-4" aria-hidden="true" />}
            Exécuter
          </Button>
        </div>
      </div>
      <textarea
        aria-label={label}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        spellCheck={false}
        rows={Math.min(18, Math.max(3, value.split("\n").length + 1))}
        className="block w-full resize-y bg-slate-900 p-3 font-mono text-sm leading-relaxed text-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
      />
      {(status || result) && (
        <div className="border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950" aria-live="polite">
          {status && <p className="text-sm text-slate-500">{status}</p>}
          {result?.error && <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-red-700 dark:text-red-400">{result.error}</pre>}
          {result?.output && <pre className="overflow-x-auto text-sm text-slate-800 dark:text-slate-200">{result.output}</pre>}
          {result && <FigureOutput images={result.images} />}
        </div>
      )}
      {caption && <figcaption className="bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-400">{caption}</figcaption>}
    </figure>
  );
};

export default RunnableCode;
