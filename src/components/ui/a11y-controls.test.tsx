// Barres de progression et termes du glossaire : ce que lit un lecteur d'écran, ce que permet le clavier (24 octobre 2026)
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { Progress } from "./progress";
import { GlossaryTerm } from "./glossary-term";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const mounted: { root: Root; div: HTMLDivElement }[] = [];
const mount = (ui: React.ReactElement) => {
  const div = document.createElement("div");
  document.body.appendChild(div);
  const root = createRoot(div);
  act(() => root.render(ui));
  mounted.push({ root, div });
  return div;
};
afterEach(() => {
  for (const { root, div } of mounted.splice(0)) {
    act(() => root.unmount());
    div.remove();
  }
});

describe("Progress", () => {
  it("transmet sa valeur (elle restait « indéterminée ») et porte un nom", () => {
    const bar = mount(<Progress value={42} />).querySelector('[role="progressbar"]') as HTMLElement;
    expect(bar.getAttribute("aria-valuenow")).toBe("42");
    expect(bar.getAttribute("data-state")).not.toBe("indeterminate");
    expect(bar.getAttribute("aria-label")).toBe("Progression");
  });

  it("garde le nom donné par la page et borne une valeur hors limites", () => {
    const div = mount(<><Progress value={88} aria-label="Facilité d'apprentissage" /><Progress value={130} /><Progress value={Number.NaN} /></>);
    const [named, over, nan] = [...div.querySelectorAll('[role="progressbar"]')];
    expect(named.getAttribute("aria-label")).toBe("Facilité d'apprentissage");
    expect(over.getAttribute("aria-valuenow")).toBe("100");
    expect(nan.getAttribute("aria-valuenow")).toBeNull();
  });
});

describe("GlossaryTerm", () => {
  const definition = { term: "médiane", shortDefinition: "Valeur qui partage une série triée en deux moitiés." };

  for (const variant of ["click", "all"] as const) {
    it(`variante ${variant} : atteignable au clavier, ouverte par Entrée`, () => {
      const div = mount(<p>La <GlossaryTerm definition={definition} variant={variant}>médiane</GlossaryTerm> résiste.</p>);
      const trigger = div.querySelector('[role="button"]') as HTMLElement;
      expect(trigger.tagName).toBe("SPAN");
      expect(trigger.tabIndex).toBe(0);
      expect(document.querySelector('[role="dialog"]')).toBeNull();
      act(() => { trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })); });
      expect(document.querySelector('[role="dialog"]')?.textContent).toContain("deux moitiés");
    });
  }
});
