export type RunnableLanguage = 'python' | 'javascript' | 'sql';

export interface RunResult {
  /** Sortie standard (print, console.log, résultats de requêtes) */
  output: string;
  /** Message d'erreur réel (trace Python, erreur SQL, exception JavaScript), le cas échéant */
  error?: string;
  /** Figures Matplotlib de l'exécution, en PNG encodé en base64 (Python uniquement) */
  images?: string[];
  /** Durée d'exécution du code, hors chargement du moteur */
  durationMs: number;
}

export type StatusListener = (message: string) => void;

/** Messages échangés avec les Web Workers (Python et SQL) */
export type WorkerRequest = { type: 'run'; id: number; code: string; baseUrl: string };
export type WorkerResponse =
  | { type: 'status'; id: number; message: string }
  | { type: 'started'; id: number }
  | { type: 'done'; id: number; output: string; error?: string; images?: string[] };
