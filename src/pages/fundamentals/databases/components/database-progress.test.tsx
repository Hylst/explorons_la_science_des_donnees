import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { RunResult } from "@/lib/runner";

// moteur simulé : ce test porte sur l'enregistrement de la réussite (les requêtes sont exécutées par src/data/database-exercises.test.ts)
const runCode = vi.fn<(language: string, code: string) => Promise<RunResult>>();
vi.mock("@/lib/runner", () => ({ runCode: (language: string, code: string) => runCode(language, code) }));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
vi.setConfig({ testTimeout: 30_000 });

let root: Root | undefined;
let container: HTMLDivElement | undefined;

const render = async () => {
  vi.resetModules();
  const { default: Section } = await import("./PracticalExercisesSection");
  container = document.createElement("div");
  document.body.appendChild(container);
  const r = createRoot(container);
  root = r;
  await act(async () => r.render(<Section />));
  return container;
};
const click = async (el: Element | null | undefined) => {
  expect(el, "élément à cliquer").toBeTruthy();
  await act(async () => {
    (el as HTMLElement).click();
  });
};
const stored = () => JSON.parse(localStorage.getItem("course-progress-database-exercises") ?? "null");
const TABLE_ATTENDUE = "annee | mois | ca_mensuel\n-----+------+-----------\n2026 | 03   | 387.7";
const TABLE_FAUSSE = "date_commande | total\n--------------+------\n2026-01-12    | 69.8";

beforeEach(() => {
  localStorage.clear();
  runCode.mockReset();
});
afterEach(() => {
  if (root) act(() => root!.unmount());
  container?.remove();
  root = undefined;
  localStorage.clear();
});

describe("exercices de la page Bases de données", () => {
  it("une question n'est réussie qu'après une vérification réussie ; le compteur du scénario suit", async () => {
    const page = await render();
    expect(page.textContent).toContain("0 question(s) réussie(s) sur 4");
    const verifier = () => [...page.querySelectorAll("button")].find((b) => b.textContent?.trim() === "Vérifier");
    // mauvaise réponse : le corrigé et la réponse donnent des tableaux différents
    runCode.mockImplementation(async (_l, code) => ({ output: /strftime/.test(code) ? TABLE_ATTENDUE : TABLE_FAUSSE, durationMs: 1 }));
    await click(verifier());
    expect(runCode).toHaveBeenCalledWith("sql", expect.stringContaining("CREATE TABLE commandes"));
    expect(stored()).toBeNull();
    // bonne réponse : mêmes tableaux
    runCode.mockImplementation(async () => ({ output: TABLE_ATTENDUE, durationMs: 1 }));
    await click(verifier());
    expect(stored().status).toEqual({ "ecommerce-q1": "done" });
    expect(page.textContent).toContain("1 question(s) réussie(s) sur 4");
    expect(page.textContent).toContain("Question 1 (réussie)");
  });

  it("les questions sans réponse unique renvoient à la solution complète", async () => {
    const page = await render();
    await click([...page.querySelectorAll("button")].find((b) => b.textContent?.includes("Réseau social")));
    expect(page.textContent).toContain("0 question(s) réussie(s) sur 3");
    expect(page.textContent).toContain("Question 4 : un score composite");
  });
});
