import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { RunResult } from "@/lib/runner";

// moteur simulé : ce test porte sur l'enregistrement de la progression (les exemples sont exécutés par les tests de src/data)
const runCode = vi.fn<(language: string, code: string) => Promise<RunResult>>();
vi.mock("@/lib/runner", () => ({ runCode: (language: string, code: string) => runCode(language, code) }));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
// le premier import de ces gros composants prend plusieurs secondes dans jsdom
vi.setConfig({ testTimeout: 30_000 });

let root: Root | undefined;
let container: HTMLDivElement | undefined;

const render = async (load: () => Promise<{ default: () => JSX.Element }>) => {
  vi.resetModules();
  const { default: Component } = await load();
  container = document.createElement("div");
  document.body.appendChild(container);
  const r = createRoot(container);
  root = r;
  await act(async () => r.render(<MemoryRouter><Component /></MemoryRouter>));
  return container;
};
const unmount = () => {
  if (root) act(() => root!.unmount());
  container?.remove();
  root = undefined;
};
const click = async (el: Element | null | undefined) => {
  expect(el, "élément à cliquer").toBeTruthy();
  await act(async () => {
    (el as HTMLElement).click();
  });
};
const button = (page: Element, label: string | RegExp) =>
  [...page.querySelectorAll("button")].find((b) => (typeof label === "string" ? b.textContent?.trim() === label : label.test(b.textContent ?? "")));
const stored = (id: string) => JSON.parse(localStorage.getItem(`course-progress-${id}`) ?? "null");

beforeEach(() => {
  localStorage.clear();
  runCode.mockReset();
});
afterEach(() => {
  unmount();
  localStorage.clear();
});

describe("progression de la page Programmation, enregistrée dans le navigateur", () => {
  it("exercices pratiques : réussi seulement après une vérification réussie, gardé au rechargement", async () => {
    let page = await render(() => import("./PracticalExercises"));
    expect(page.textContent).toContain("0 / 6");
    runCode.mockResolvedValueOnce({ output: "", error: "AssertionError: calculer_roi(1000, 3500) doit valoir 250.0", durationMs: 1 });
    await click(button(page, "Vérifier"));
    expect(stored("programming-exercises")).toBeNull();
    runCode.mockResolvedValueOnce({ output: "250.0 correct", durationMs: 1 });
    await click(button(page, "Vérifier"));
    expect(stored("programming-exercises").status).toEqual({ ex1: "done" });
    unmount();
    page = await render(() => import("./PracticalExercises"));
    expect(page.textContent).toContain("1 / 6");
  });

  it("concepts avancés : marqué comme lu, enregistré, puis annulé", async () => {
    const page = await render(() => import("./AdvancedConcepts"));
    await click(button(page, "Marquer comme lu"));
    expect(stored("advanced-concepts").status).toEqual({ "promises-basics": "done" });
    await click(button(page, /Concept lu/));
    expect(stored("advanced-concepts").status).toEqual({});
  });

  it("masterclass Python : exercice marqué terminé, enregistré, puis annulé", async () => {
    const page = await render(() => import("./PythonMasterclass"));
    await click(button(page, "Marquer terminé"));
    expect(Object.values(stored("python-masterclass").status)).toEqual(["done"]);
    expect(Object.keys(stored("python-masterclass").status)[0]).toMatch(/^exercice-[1-6]$/);
    await click(button(page, /Terminé \(annuler\)/));
    expect(stored("python-masterclass").status).toEqual({});
  });
});
