import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import ConditionalProbabilitySection from "./ConditionalProbabilitySection";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as { ResizeObserver?: unknown }).ResizeObserver ??= ResizeObserverStub;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(createElement(ConditionalProbabilitySection)));
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe("arbre de probabilités conditionnelles", () => {
  // Régression du 5 octobre 2026 : le chemin « Malade-Test - » était découpé sur le tiret, l'issue « Test - » n'était jamais
  // retrouvée et le bloc de calcul restait vide.
  it("chaque issue de l'arbre affiche son calcul détaillé, y compris celles dont le nom contient un tiret", () => {
    const issues = [...container.querySelectorAll<HTMLButtonElement>("button[aria-pressed]")];
    expect(issues.length).toBeGreaterThanOrEqual(4);
    expect(issues.some((button) => (button.textContent ?? "").includes("-"))).toBe(true);
    for (const issue of issues) {
      act(() => issue.click());
      const bloc = [...container.querySelectorAll("h6")].find((h) => (h.textContent ?? "").startsWith("Calculs pour"));
      expect(bloc, `issue « ${issue.textContent} »`).toBeTruthy();
      const calcul = bloc!.parentElement!.textContent ?? "";
      expect(calcul, `issue « ${issue.textContent} » : aucun calcul affiché`).toMatch(/P\([^)]+\) = \d/);
      expect(issue.getAttribute("aria-pressed")).toBe("true");
    }
  });
});
