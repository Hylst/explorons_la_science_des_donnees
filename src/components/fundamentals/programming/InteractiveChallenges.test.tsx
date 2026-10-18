import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { RunResult } from "@/lib/runner";

// le moteur est simulé : ce test porte sur l'enregistrement de la réussite, pas sur l'exécution (voir challenges.test.ts)
const runCode = vi.fn<(language: string, code: string) => Promise<RunResult>>();
vi.mock("@/lib/runner", () => ({ runCode: (language: string, code: string) => runCode(language, code) }));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | undefined;
let container: HTMLDivElement | undefined;

/** Le hook de progression garde un cache au niveau du module : on recharge le composant pour chaque test */
const render = async () => {
  vi.resetModules();
  const { default: InteractiveChallenges } = await import("./InteractiveChallenges");
  container = document.createElement("div");
  document.body.appendChild(container);
  const r = createRoot(container);
  root = r;
  await act(async () => r.render(<InteractiveChallenges />));
  return container;
};

const click = async (el: Element | null | undefined) => {
  expect(el, "élément à cliquer").toBeTruthy();
  await act(async () => {
    (el as HTMLElement).click();
  });
};

const byText = (page: Element, selector: string, text: string) =>
  [...page.querySelectorAll(selector)].find((e) => (e.textContent ?? "").includes(text));

const stored = () => JSON.parse(localStorage.getItem("course-progress-challenges") ?? "null");

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

// le premier import du composant (icônes, moteur simulé, données) prend plusieurs secondes
vi.setConfig({ testTimeout: 30_000 });

describe("défis de programmation vérifiés", () => {
  it("n'enregistre la réussite qu'après une vérification réussie, avec le moteur du langage du défi", async () => {
    const page = await render();
    expect(page.textContent).toContain("0 sur 4");
    await click(byText(page, '[role="button"]', "Gestionnaire de tâches"));
    // la réponse de départ échoue : rien n'est enregistré
    runCode.mockResolvedValueOnce({ output: "", error: "AssertionError: Une liste neuve donne ...", durationMs: 1 });
    await click(byText(page, "button", "Vérifier"));
    expect(runCode).toHaveBeenLastCalledWith("javascript", expect.stringContaining("verifier("));
    expect(page.textContent).toContain("Pas encore : Une liste neuve donne ...");
    expect(stored()?.status?.["js-dom-1"]).toBeUndefined();
    // les tests passent : le défi est réussi et le reste après un nouvel affichage
    runCode.mockResolvedValueOnce({ output: "{}", durationMs: 1 });
    await click(byText(page, "button", "Vérifier"));
    expect(stored().status).toEqual({ "js-dom-1": "done" });
    expect(page.textContent).toContain("1 sur 4");
    expect(page.textContent).toContain("Défi réussi : vos tests sont passés.");
  });

  it("vérifie un défi Python avec le moteur Python", async () => {
    const page = await render();
    await click(byText(page, '[role="button"]', "Calculateur de moyenne"));
    runCode.mockResolvedValueOnce({ output: "3.0", durationMs: 1 });
    await click(byText(page, "button", "Vérifier"));
    expect(runCode).toHaveBeenLastCalledWith("python", expect.stringContaining("calculer_moyenne([])"));
    expect(stored().status).toEqual({ "python-basics-1": "done" });
  });

  it("annonce les anciennes validations à la main sans les reprendre, puis efface les anciennes clés", async () => {
    localStorage.setItem("challenge-progress-v2", JSON.stringify({ completedChallenges: ["python-basics-1", "js-dom-1"], totalPoints: 40, timeSpent: 3, level: 1 }));
    localStorage.setItem("challenge-progress", "{}");
    const page = await render();
    expect(page.textContent).toContain("Vous aviez validé 2 défis à la main");
    expect(page.textContent).toContain("0 sur 4");
    expect(localStorage.getItem("challenge-progress-v2")).toBeNull();
    expect(localStorage.getItem("challenge-progress")).toBeNull();
  });

  it("ne plante pas avec une ancienne valeur illisible", async () => {
    localStorage.setItem("challenge-progress-v2", "{pas du json");
    const page = await render();
    expect(page.textContent).toContain("Défis disponibles");
    expect(page.textContent).not.toContain("Vous aviez validé");
  });
});
