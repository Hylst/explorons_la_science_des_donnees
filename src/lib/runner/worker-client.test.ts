import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createWorkerRunner } from "./worker-client";
import type { RunResult, WorkerRequest, WorkerResponse } from "./types";

type Handler = (event: { data?: WorkerResponse; message?: string }) => void;

/** Réponse du worker ; sans identifiant, elle répond à la dernière demande reçue */
type Reply =
  | { type: "status"; message: string; id?: number }
  | { type: "started"; id?: number }
  | { type: "done"; output: string; error?: string; images?: string[]; id?: number };

/** Faux Worker : enregistre ce qu'on lui envoie et permet de simuler ses réponses */
class FakeWorker {
  posted: WorkerRequest[] = [];
  terminated = false;
  private handlers: Record<string, Set<Handler>> = { message: new Set(), error: new Set() };

  addEventListener(type: string, handler: Handler) {
    (this.handlers[type] ??= new Set()).add(handler);
  }
  removeEventListener(type: string, handler: Handler) {
    this.handlers[type]?.delete(handler);
  }
  postMessage(message: WorkerRequest) {
    this.posted.push(message);
  }
  terminate() {
    this.terminated = true;
  }

  listenerCount(type: string) {
    return this.handlers[type]?.size ?? 0;
  }
  reply(response: Reply) {
    const id = response.id ?? this.posted[this.posted.length - 1].id;
    const event = { data: { ...response, id } as WorkerResponse };
    [...this.handlers.message].forEach((handler) => handler(event));
  }
  fail(message: string) {
    [...this.handlers.error].forEach((handler) => handler({ message }));
  }
}

const TIMEOUT = 5000;
const TIMEOUT_MESSAGE = "Délai dépassé (test).";

let workers: FakeWorker[];
let makeWorker: ReturnType<typeof vi.fn>;

const newRunner = (timeoutMs = TIMEOUT) => createWorkerRunner(makeWorker as unknown as () => Worker, timeoutMs, TIMEOUT_MESSAGE);

/** Laisse les promesses en attente se dérouler (la file d'exécution passe par des microtâches) */
const flush = () => vi.advanceTimersByTimeAsync(0);

/** Suit l'état d'une promesse sans l'attendre */
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
  workers = [];
  makeWorker = vi.fn(() => {
    const worker = new FakeWorker();
    workers.push(worker);
    return worker;
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("createWorkerRunner : exécution nominale", () => {
  it("crée le worker à la première exécution seulement, pas avant", async () => {
    const run = newRunner();
    expect(makeWorker).not.toHaveBeenCalled();
    void run("print(1)");
    await flush();
    expect(makeWorker).toHaveBeenCalledTimes(1);
  });

  it("envoie le code au worker avec un identifiant et l'URL de base du site", async () => {
    const run = newRunner();
    void run("print('salut')");
    await flush();
    expect(workers[0].posted).toHaveLength(1);
    const message = workers[0].posted[0];
    expect(message.type).toBe("run");
    expect(message.code).toBe("print('salut')");
    expect(Number.isInteger(message.id)).toBe(true);
    expect(message.baseUrl).toMatch(/^https?:\/\/[^/]+\/$/);
  });

  it("renvoie la sortie du worker une fois l'exécution terminée", async () => {
    const run = newRunner();
    const state = track(run("print(1)"));
    await flush();
    workers[0].reply({ type: "started" });
    await vi.advanceTimersByTimeAsync(250);
    workers[0].reply({ type: "done", output: "1\n" });
    await flush();
    expect(state.settled).toBe(true);
    expect(state.result?.output).toBe("1\n");
    expect(state.result?.error).toBeUndefined();
  });

  it("transmet les figures Matplotlib renvoyées par le worker", async () => {
    const run = newRunner();
    const state = track(run("plt.plot([1, 2])"));
    await flush();
    workers[0].reply({ type: "started" });
    workers[0].reply({ type: "done", output: "", images: ["aGVsbG8=", "d29ybGQ="] });
    await flush();
    expect(state.result?.images).toEqual(["aGVsbG8=", "d29ybGQ="]);
  });

  it("mesure la durée à partir du démarrage réel du code, pas du chargement du moteur", async () => {
    const run = newRunner(60000);
    const state = track(run("code"));
    await flush();
    await vi.advanceTimersByTimeAsync(3000); // chargement du moteur
    workers[0].reply({ type: "started" });
    await vi.advanceTimersByTimeAsync(250);
    workers[0].reply({ type: "done", output: "" });
    await flush();
    expect(state.result?.durationMs).toBeGreaterThanOrEqual(250);
    expect(state.result?.durationMs).toBeLessThan(300);
  });

  it("transmet l'erreur du code (trace réelle) sans la confondre avec un dépassement du délai", async () => {
    const run = newRunner();
    const state = track(run("1/0"));
    await flush();
    workers[0].reply({ type: "started" });
    workers[0].reply({ type: "done", output: "", error: "ZeroDivisionError: division by zero" });
    await flush();
    expect(state.result?.error).toBe("ZeroDivisionError: division by zero");
    expect(workers[0].terminated).toBe(false);
  });

  it("transmet les messages d'état au rappel sans terminer l'exécution", async () => {
    const run = newRunner();
    const onStatus = vi.fn();
    const state = track(run("x", onStatus));
    await flush();
    workers[0].reply({ type: "status", message: "Chargement de NumPy" });
    expect(onStatus).toHaveBeenCalledWith("Chargement de NumPy");
    expect(state.settled).toBe(false);
  });

  it("ignore les messages dont l'identifiant n'est pas celui de l'exécution en cours", async () => {
    const run = newRunner();
    const state = track(run("x"));
    await flush();
    const currentId = workers[0].posted[0].id;
    workers[0].reply({ type: "done", output: "ancienne exécution", id: currentId + 100 });
    await flush();
    expect(state.settled).toBe(false);
    workers[0].reply({ type: "done", output: "bonne exécution" });
    await flush();
    expect(state.result?.output).toBe("bonne exécution");
  });

  it("accepte une fin d'exécution sans message « started » (échec avant le démarrage du code)", async () => {
    const run = newRunner();
    const state = track(run("x"));
    await flush();
    workers[0].reply({ type: "done", output: "", error: "Chargement impossible" });
    await flush();
    expect(state.result?.error).toBe("Chargement impossible");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("réutilise le même worker pour les exécutions successives", async () => {
    const run = newRunner();
    const first = run("a");
    await flush();
    workers[0].reply({ type: "done", output: "a" });
    await first;
    const second = run("b");
    await flush();
    expect(makeWorker).toHaveBeenCalledTimes(1);
    expect(workers[0].posted.map((m) => m.code)).toEqual(["a", "b"]);
    expect(workers[0].posted[1].id).not.toBe(workers[0].posted[0].id);
    workers[0].reply({ type: "done", output: "b" });
    expect((await second).output).toBe("b");
  });

  it("n'exécute qu'une demande à la fois : la suivante attend la fin de la précédente", async () => {
    const run = newRunner();
    const first = track(run("premier"));
    const second = track(run("second"));
    await flush();
    expect(workers[0].posted.map((m) => m.code)).toEqual(["premier"]);
    workers[0].reply({ type: "done", output: "1" });
    await flush();
    expect(first.settled).toBe(true);
    expect(workers[0].posted.map((m) => m.code)).toEqual(["premier", "second"]);
    expect(second.settled).toBe(false);
    workers[0].reply({ type: "done", output: "2" });
    await flush();
    expect(second.result?.output).toBe("2");
  });

  it("retire ses écouteurs du worker à la fin de chaque exécution", async () => {
    const run = newRunner();
    void run("x");
    await flush();
    expect(workers[0].listenerCount("message")).toBe(1);
    expect(workers[0].listenerCount("error")).toBe(1);
    workers[0].reply({ type: "done", output: "" });
    await flush();
    expect(workers[0].listenerCount("message")).toBe(0);
    expect(workers[0].listenerCount("error")).toBe(0);
  });
});

describe("createWorkerRunner : délai d'attente", () => {
  it("n'arme pas le minuteur tant que le code n'a pas démarré (le chargement du moteur ne compte pas)", async () => {
    const run = newRunner();
    const state = track(run("x"));
    await flush();
    await vi.advanceTimersByTimeAsync(TIMEOUT * 10);
    expect(state.settled).toBe(false);
    expect(workers[0].terminated).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("interrompt à la milliseconde près : rien avant le délai, arrêt du worker au délai", async () => {
    const run = newRunner();
    const state = track(run("while True: pass"));
    await flush();
    workers[0].reply({ type: "started" });
    await vi.advanceTimersByTimeAsync(TIMEOUT - 1);
    expect(state.settled).toBe(false);
    expect(workers[0].terminated).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(state.settled).toBe(true);
    expect(workers[0].terminated).toBe(true);
  });

  it("renvoie le message de dépassement, sans sortie, avec la durée écoulée", async () => {
    const run = newRunner();
    const state = track(run("while True: pass"));
    await flush();
    workers[0].reply({ type: "started" });
    await vi.advanceTimersByTimeAsync(TIMEOUT);
    expect(state.result).toMatchObject({ output: "", error: TIMEOUT_MESSAGE });
    expect(state.result?.durationMs).toBeGreaterThanOrEqual(TIMEOUT);
  });

  it("un résultat reçu avant le délai annule le minuteur : le worker n'est pas arrêté ensuite", async () => {
    const run = newRunner();
    const state = track(run("x"));
    await flush();
    workers[0].reply({ type: "started" });
    await vi.advanceTimersByTimeAsync(TIMEOUT - 1);
    workers[0].reply({ type: "done", output: "à temps" });
    await vi.advanceTimersByTimeAsync(TIMEOUT * 10);
    expect(state.result?.output).toBe("à temps");
    expect(state.result?.error).toBeUndefined();
    expect(workers[0].terminated).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("recrée le worker à l'exécution suivante après un dépassement", async () => {
    const run = newRunner();
    const first = track(run("boucle infinie"));
    await flush();
    workers[0].reply({ type: "started" });
    await vi.advanceTimersByTimeAsync(TIMEOUT);
    expect(first.settled).toBe(true);
    expect(workers[0].terminated).toBe(true);

    const second = track(run("print(2)"));
    await flush();
    expect(makeWorker).toHaveBeenCalledTimes(2);
    expect(workers[1]).not.toBe(workers[0]);
    expect(workers[1].posted.map((m) => m.code)).toEqual(["print(2)"]);
    // l'ancien worker ne reçoit rien de plus
    expect(workers[0].posted).toHaveLength(1);
    workers[1].reply({ type: "started" });
    workers[1].reply({ type: "done", output: "2\n" });
    await flush();
    expect(second.result?.output).toBe("2\n");
  });

  it("une demande en attente derrière une boucle infinie s'exécute après l'arrêt du worker", async () => {
    const run = newRunner();
    const first = track(run("boucle infinie"));
    const second = track(run("print(3)"));
    await flush();
    workers[0].reply({ type: "started" });
    await vi.advanceTimersByTimeAsync(TIMEOUT);
    expect(first.result?.error).toBe(TIMEOUT_MESSAGE);
    expect(workers).toHaveLength(2);
    expect(workers[1].posted.map((m) => m.code)).toEqual(["print(3)"]);
    expect(second.settled).toBe(false);
  });

  it("retire les écouteurs du worker arrêté et ne laisse aucun minuteur actif", async () => {
    const run = newRunner();
    void run("x");
    await flush();
    workers[0].reply({ type: "started" });
    await vi.advanceTimersByTimeAsync(TIMEOUT);
    expect(workers[0].listenerCount("message")).toBe(0);
    expect(workers[0].listenerCount("error")).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("respecte le délai propre à chaque exécuteur", async () => {
    const short = newRunner(1000);
    const state = track(short("x"));
    await flush();
    workers[0].reply({ type: "started" });
    await vi.advanceTimersByTimeAsync(999);
    expect(state.settled).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(state.settled).toBe(true);
  });
});

describe("createWorkerRunner : échec de chargement du worker", () => {
  it("arrête le worker et renvoie un message explicite avec la cause", async () => {
    const run = newRunner();
    const state = track(run("x"));
    await flush();
    workers[0].fail("Failed to fetch");
    await flush();
    expect(workers[0].terminated).toBe(true);
    expect(state.result?.output).toBe("");
    expect(state.result?.error).toContain("n'a pas pu démarrer");
    expect(state.result?.error).toContain("Failed to fetch");
    expect(state.result?.durationMs).toBe(0);
  });

  it("indique « erreur de chargement » quand l'événement n'a pas de message", async () => {
    const run = newRunner();
    const state = track(run("x"));
    await flush();
    workers[0].fail("");
    await flush();
    expect(state.result?.error).toContain("erreur de chargement");
  });

  it("recrée un worker à l'exécution suivante", async () => {
    const run = newRunner();
    void run("x");
    await flush();
    workers[0].fail("boom");
    await flush();
    void run("y");
    await flush();
    expect(makeWorker).toHaveBeenCalledTimes(2);
    expect(workers[1].posted.map((m) => m.code)).toEqual(["y"]);
  });

  it("annule le minuteur de délai si l'erreur survient après le démarrage", async () => {
    const run = newRunner();
    const state = track(run("x"));
    await flush();
    workers[0].reply({ type: "started" });
    workers[0].fail("plantage du worker");
    await vi.advanceTimersByTimeAsync(TIMEOUT * 5);
    expect(state.result?.error).toContain("plantage du worker");
    expect(vi.getTimerCount()).toBe(0);
  });
});
