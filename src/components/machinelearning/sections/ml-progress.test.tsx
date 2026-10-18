import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { RunResult } from "@/lib/runner";

// moteur simulé : ce test porte sur l'enregistrement de la réussite (les codes sont exécutés par src/data/ml-practical.test.ts)
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
  await act(async () => r.render(<MemoryRouter><Section /></MemoryRouter>));
  return container;
};
const click = async (el: Element | null | undefined) => {
  expect(el, "élément à cliquer").toBeTruthy();
  await act(async () => {
    (el as HTMLElement).click();
  });
};
const stored = () => JSON.parse(localStorage.getItem("course-progress-ml-exercises") ?? "null");

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

describe("exercices de la page Machine learning", () => {
  it("un exercice n'est réussi qu'après une vérification réussie, et le reste au rechargement", async () => {
    let page = await render();
    const verifier = () => [...page.querySelectorAll("button")].filter((b) => b.textContent?.trim() === "Vérifier");
    expect(verifier()).toHaveLength(2);
    runCode.mockResolvedValueOnce({ output: "", error: "AssertionError: le cosinus entre (1, 0) et (1, 1) vaut 1/√2", durationMs: 1 });
    await click(verifier()[0]);
    expect(stored()).toBeNull();
    runCode.mockResolvedValueOnce({ output: "1 2", durationMs: 1 });
    await click(verifier()[0]);
    expect(stored().status).toEqual({ recommandation: "done" });
    act(() => root!.unmount());
    root = undefined;
    container?.remove();
    page = await render();
    expect(page.textContent).toContain("réussi");
  });

  it("le programme exécutable est proposé à l'exécution, les deux autres à la lecture avec leur raison", async () => {
    const page = await render();
    const onglet = (titre: string) => [...page.querySelectorAll("button")].find((b) => b.textContent?.includes(titre));
    expect(page.textContent).toContain("seaborn, que le moteur du site ne propose pas");
    await click(onglet("Régression et visualisation"));
    expect([...page.querySelectorAll("button")].some((b) => b.textContent?.trim() === "Exécuter")).toBe(true);
    await click(onglet("Clustering : segmentation de clients"));
    expect(page.textContent).toContain("limite de 30 secondes");
  });
});
