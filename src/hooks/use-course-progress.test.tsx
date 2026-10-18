import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanupHooks, renderHook } from "./render-hook";

/** Le module garde un cache et des abonnés : on le recharge pour chaque test */
const loadModule = async () => {
  vi.resetModules();
  return import("./use-course-progress");
};

const stored = (courseId: string) => JSON.parse(localStorage.getItem(`course-progress-${courseId}`) ?? "null");

beforeEach(() => localStorage.clear());
afterEach(() => {
  cleanupHooks();
  localStorage.clear();
});

describe("useCourseProgress", () => {
  it("part de rien : tout est « à faire », sans note", async () => {
    const { useCourseProgress } = await loadModule();
    const h = renderHook(() => useCourseProgress("python-basics"));
    expect(h.current.statusOf("module-1")).toBe("todo");
    expect(h.current.noteOf("module-1")).toBe("");
    expect(h.current.countDone(["module-1", "module-2"])).toBe(0);
  });

  it("enregistre statut et note dans le navigateur, sous la clé du cours", async () => {
    const { useCourseProgress } = await loadModule();
    const h = renderHook(() => useCourseProgress("python-basics"));
    act(() => h.current.setStatus("module-1", "done"));
    act(() => h.current.setStatus("module-2", "started"));
    act(() => h.current.setNote("module-1", "revoir les listes"));
    expect(h.current.statusOf("module-1")).toBe("done");
    expect(h.current.statusOf("module-2")).toBe("started");
    expect(h.current.noteOf("module-1")).toBe("revoir les listes");
    expect(h.current.countDone(["module-1", "module-2", "module-3"])).toBe(1);
    expect(stored("python-basics")).toEqual({ status: { "module-1": "done", "module-2": "started" }, notes: { "module-1": "revoir les listes" } });
  });

  it("efface l'entrée quand on revient à « à faire » ou qu'on vide la note", async () => {
    const { useCourseProgress } = await loadModule();
    const h = renderHook(() => useCourseProgress("python-basics"));
    act(() => h.current.setStatus("module-1", "done"));
    act(() => h.current.setNote("module-1", "note"));
    act(() => h.current.setStatus("module-1", "todo"));
    act(() => h.current.setNote("module-1", "   "));
    expect(stored("python-basics")).toEqual({ status: {}, notes: {} });
  });

  it("partage la progression entre deux composants d'une même page, pas entre deux cours", async () => {
    const { useCourseProgress } = await loadModule();
    const liste = renderHook(() => useCourseProgress("projects"));
    const carte = renderHook(() => useCourseProgress("projects"));
    const autre = renderHook(() => useCourseProgress("math-intro"));
    act(() => liste.current.setStatus("beginner-1", "done"));
    expect(carte.current.statusOf("beginner-1")).toBe("done");
    expect(autre.current.statusOf("beginner-1")).toBe("todo");
    // une modification depuis la carte ne doit pas effacer celle de la liste
    act(() => carte.current.setNote("beginner-2", "à faire ce week-end"));
    expect(stored("projects")).toEqual({ status: { "beginner-1": "done" }, notes: { "beginner-2": "à faire ce week-end" } });
  });

  it("reprend une progression enregistrée lors d'une visite précédente", async () => {
    localStorage.setItem("course-progress-math-intro", JSON.stringify({ status: { "module-3": "done" }, notes: { "module-3": "ok" } }));
    const { useCourseProgress } = await loadModule();
    const h = renderHook(() => useCourseProgress("math-intro"));
    expect(h.current.statusOf("module-3")).toBe("done");
    expect(h.current.noteOf("module-3")).toBe("ok");
  });

  it("ignore une donnée enregistrée illisible ou d'un autre format", async () => {
    localStorage.setItem("course-progress-a", "{pas du json");
    localStorage.setItem("course-progress-b", JSON.stringify({ status: { "module-1": "fini" }, notes: {} }));
    localStorage.setItem("course-progress-c", JSON.stringify({ status: { "module-1": "done" }, notes: { "module-1": 3 } }));
    const { useCourseProgress } = await loadModule();
    for (const id of ["a", "b", "c"]) {
      const h = renderHook(() => useCourseProgress(id));
      expect(h.current.statusOf("module-1"), id).toBe("todo");
    }
  });

  it("relit la progression modifiée dans un autre onglet", async () => {
    const { useCourseProgress } = await loadModule();
    const h = renderHook(() => useCourseProgress("python-basics"));
    expect(h.current.statusOf("module-4")).toBe("todo");
    localStorage.setItem("course-progress-python-basics", JSON.stringify({ status: { "module-4": "done" }, notes: {} }));
    act(() => {
      window.dispatchEvent(new StorageEvent("storage", { key: "course-progress-python-basics" }));
    });
    expect(h.current.statusOf("module-4")).toBe("done");
  });

  it("markDone ajoute des éléments terminés sans effacer les autres", async () => {
    const { markDone, useCourseProgress } = await loadModule();
    const h = renderHook(() => useCourseProgress("math-intro"));
    act(() => h.current.setStatus("module-1", "started"));
    act(() => h.current.setNote("module-1", "note"));
    act(() => markDone("math-intro", ["module-2", "module-3"]));
    expect(stored("math-intro")).toEqual({ status: { "module-1": "started", "module-2": "done", "module-3": "done" }, notes: { "module-1": "note" } });
    expect(h.current.countDone(["module-1", "module-2", "module-3"])).toBe(2);
  });
});

describe("useProgressSummary", () => {
  it("additionne tous les cours enregistrés et se met à jour", async () => {
    localStorage.setItem("course-progress-math-intro", JSON.stringify({ status: { "module-1": "done", "module-2": "started" }, notes: { "module-1": "x" } }));
    localStorage.setItem("course-progress-vide", JSON.stringify({ status: {}, notes: {} }));
    localStorage.setItem("autre-cle", "sans rapport");
    const { useCourseProgress, useProgressSummary } = await loadModule();
    const summary = renderHook(() => useProgressSummary());
    expect(summary.current).toEqual({ done: 1, started: 1, notes: 1, courses: 1 });
    const h = renderHook(() => useCourseProgress("python-basics"));
    act(() => h.current.setStatus("module-1", "done"));
    expect(summary.current).toEqual({ done: 2, started: 1, notes: 1, courses: 2 });
  });
});
