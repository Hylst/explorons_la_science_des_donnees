import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { RunResult, WorkerRequest, WorkerResponse } from "./types";

type Handler = (event: { data?: WorkerResponse; message?: string }) => void;

/** Faux Worker global : retient l'URL du script pour savoir quel moteur (Python ou SQL) est lancé */
class FakeWorker {
  static instances: FakeWorker[] = [];
  posted: WorkerRequest[] = [];
  terminated = false;
  private handlers = new Set<Handler>();

  constructor(
    public url: URL,
    public options?: WorkerOptions
  ) {
    FakeWorker.instances.push(this);
  }
  addEventListener(type: string, handler: Handler) {
    if (type === "message") this.handlers.add(handler);
  }
  removeEventListener(type: string, handler: Handler) {
    if (type === "message") this.handlers.delete(handler);
  }
  postMessage(message: WorkerRequest) {
    this.posted.push(message);
  }
  terminate() {
    this.terminated = true;
  }
  reply(response: { type: "started" } | { type: "done"; output: string; error?: string }) {
    const id = this.posted[this.posted.length - 1].id;
    [...this.handlers].forEach((handler) => handler({ data: { ...response, id } as WorkerResponse }));
  }
}

/** Le module crée ses exécuteurs au chargement : on le recharge pour repartir de workers inexistants */
const loadRunner = async () => {
  vi.resetModules();
  return import("./index");
};

const track = (promise: Promise<RunResult>) => {
  const state: { settled: boolean; result?: RunResult } = { settled: false };
  void promise.then((result) => {
    state.settled = true;
    state.result = result;
  });
  return state;
};

beforeEach(() => {
  vi.useFakeTimers();
  FakeWorker.instances = [];
  vi.stubGlobal("Worker", FakeWorker);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("isRunnable", () => {
  it("accepte les trois langages exécutables", async () => {
    const { isRunnable } = await loadRunner();
    expect(isRunnable("python")).toBe(true);
    expect(isRunnable("sql")).toBe(true);
    expect(isRunnable("javascript")).toBe(true);
  });

  it("refuse les autres langages et les écritures approchantes", async () => {
    const { isRunnable } = await loadRunner();
    for (const language of ["r", "julia", "Python", "SQL", "js", "", "python3"]) {
      expect(isRunnable(language), language).toBe(false);
    }
  });
});

describe("runCode : délais d'attente par langage", () => {
  it("Python tourne dans un worker python.worker et s'arrête après 30 secondes", async () => {
    const { runCode } = await loadRunner();
    const state = track(runCode("python", "while True: pass"));
    await vi.advanceTimersByTimeAsync(0);
    expect(FakeWorker.instances).toHaveLength(1);
    const worker = FakeWorker.instances[0];
    expect(worker.url.pathname).toMatch(/python\.worker\.ts$/);
    expect(worker.options?.type).toBe("module");
    expect(worker.posted[0]).toMatchObject({ type: "run", code: "while True: pass" });

    worker.reply({ type: "started" });
    await vi.advanceTimersByTimeAsync(29_999);
    expect(state.settled).toBe(false);
    expect(worker.terminated).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(state.settled).toBe(true);
    expect(worker.terminated).toBe(true);
    expect(state.result?.error).toContain("30 secondes");
    expect(state.result?.output).toBe("");
  });

  it("SQL tourne dans un worker sql.worker et s'arrête après 15 secondes", async () => {
    const { runCode } = await loadRunner();
    const state = track(runCode("sql", "WITH RECURSIVE t(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM t) SELECT count(*) FROM t;"));
    await vi.advanceTimersByTimeAsync(0);
    const worker = FakeWorker.instances[0];
    expect(worker.url.pathname).toMatch(/sql\.worker\.ts$/);

    worker.reply({ type: "started" });
    await vi.advanceTimersByTimeAsync(14_999);
    expect(state.settled).toBe(false);
    expect(worker.terminated).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(state.settled).toBe(true);
    expect(worker.terminated).toBe(true);
    expect(state.result?.error).toContain("15 secondes");
  });

  it("Python et SQL utilisent des workers distincts : arrêter l'un ne touche pas l'autre", async () => {
    const { runCode } = await loadRunner();
    const python = track(runCode("python", "print(1)"));
    const sql = track(runCode("sql", "SELECT 1;"));
    await vi.advanceTimersByTimeAsync(0);
    expect(FakeWorker.instances).toHaveLength(2);
    const [pythonWorker, sqlWorker] = FakeWorker.instances;
    expect(pythonWorker.url.pathname).toMatch(/python\.worker\.ts$/);
    expect(sqlWorker.url.pathname).toMatch(/sql\.worker\.ts$/);

    sqlWorker.reply({ type: "started" });
    pythonWorker.reply({ type: "started" });
    pythonWorker.reply({ type: "done", output: "1\n" });
    await vi.advanceTimersByTimeAsync(15_000);
    expect(python.result?.output).toBe("1\n");
    expect(pythonWorker.terminated).toBe(false);
    expect(sql.settled).toBe(true);
    expect(sqlWorker.terminated).toBe(true);
  });

  it("un résultat rendu à temps n'est pas transformé en dépassement", async () => {
    const { runCode } = await loadRunner();
    const state = track(runCode("python", "print('ok')"));
    await vi.advanceTimersByTimeAsync(0);
    const worker = FakeWorker.instances[0];
    worker.reply({ type: "started" });
    await vi.advanceTimersByTimeAsync(29_000);
    worker.reply({ type: "done", output: "ok\n" });
    await vi.advanceTimersByTimeAsync(60_000);
    expect(state.result).toMatchObject({ output: "ok\n" });
    expect(state.result?.error).toBeUndefined();
    expect(worker.terminated).toBe(false);
  });
});
