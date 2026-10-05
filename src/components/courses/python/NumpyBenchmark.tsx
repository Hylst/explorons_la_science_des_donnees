import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { runCode } from '@/lib/runner';

/**
 * Mesure réelle, exécutée dans le navigateur du visiteur : somme des carrés de 1 million d'entiers,
 * Python pur (générateur) contre NumPy (vectorisé). Aucun temps n'est écrit à la main.
 */
const BENCHMARK_CODE = `import time
import numpy as np

N = 1_000_000
data = list(range(N))
array = np.arange(N)

def best_of(function, repeats=5):
    best = None
    for _ in range(repeats):
        start = time.perf_counter()
        function()
        elapsed = time.perf_counter() - start
        best = elapsed if best is None else min(best, elapsed)
    return best

python_time = best_of(lambda: sum(x * x for x in data))
numpy_time = best_of(lambda: int(np.sum(array * array)))
print(f"{python_time * 1000:.2f} {numpy_time * 1000:.3f}")`;

type State =
  | { phase: 'idle' }
  | { phase: 'running'; status: string }
  | { phase: 'done'; pythonMs: number; numpyMs: number }
  | { phase: 'error'; message: string };

const formatMs = (ms: number) => `${ms.toLocaleString('fr-FR', { maximumFractionDigits: ms < 10 ? 2 : 0 })} ms`;

const NumpyBenchmark: React.FC = () => {
  const [state, setState] = useState<State>({ phase: 'idle' });

  const measure = async () => {
    setState({ phase: 'running', status: 'Préparation de Python et de NumPy…' });
    const result = await runCode('python', BENCHMARK_CODE, (status) => setState({ phase: 'running', status }));
    const numbers = result.output.trim().split(/\s+/).map(Number);
    if (result.error || numbers.length !== 2 || numbers.some((n) => !Number.isFinite(n) || n <= 0)) {
      setState({ phase: 'error', message: result.error || 'Résultat inattendu : mesure impossible.' });
      return;
    }
    setState({ phase: 'done', pythonMs: numbers[0], numpyMs: numbers[1] });
  };

  return (
    <Card className="bg-gray-50">
      <CardContent className="p-4 space-y-3">
        <p className="text-sm text-gray-600">
          Somme des carrés de 1 million d'entiers : Python pur contre NumPy, mesurée sur votre machine.
        </p>
        {state.phase === 'done' ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <span>Python pur :</span>
              <span className="text-red-600 font-mono">{formatMs(state.pythonMs)}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span>NumPy :</span>
              <span className="text-green-600 font-mono">{formatMs(state.numpyMs)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between gap-2 font-semibold">
              <span>Gain mesuré :</span>
              <span className="text-blue-600">environ {Math.round(state.pythonMs / state.numpyMs).toLocaleString('fr-FR')} fois plus rapide</span>
            </div>
            <p className="text-xs text-gray-500">
              Meilleur de 5 essais. Python tourne ici compilé en WebAssembly : les temps absolus diffèrent d'un Python installé sur
              votre ordinateur, l'ordre de grandeur du rapport reste le message à retenir.
            </p>
          </div>
        ) : null}
        {state.phase === 'running' ? <p className="text-sm text-gray-600" role="status">{state.status}</p> : null}
        {state.phase === 'error' ? <p className="text-sm text-red-600" role="alert">{state.message}</p> : null}
        {state.phase !== 'running' && (
          <Button size="sm" variant="outline" onClick={measure} className="whitespace-normal h-auto">
            {state.phase === 'done' ? 'Mesurer à nouveau' : 'Mesurer sur ma machine'}
          </Button>
        )}
        {state.phase === 'idle' && (
          <p className="text-xs text-gray-500">
            Le premier lancement télécharge le moteur Python et NumPy (environ 15 Mo), puis ils restent en cache.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default NumpyBenchmark;
