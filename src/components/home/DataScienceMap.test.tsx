import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import DataScienceMap from "./DataScienceMap";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(createElement(MemoryRouter, null, createElement(DataScienceMap))));
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

// Le SVG des liaisons est étiré à la taille du bloc (viewBox 0 0 100 100, preserveAspectRatio="none") : tout ce qui y est
// dessiné en unités du repère est agrandi et déformé. Le 11 octobre 2026, le numéro d'étape y occupait 12 % de la largeur,
// son cercle devenait une grande ellipse et la pointe de flèche un grand triangle par-dessus les étapes.
describe("DataScienceMap : SVG étiré des liaisons", () => {
  const stretched = () => {
    const svgs = [...container.querySelectorAll('svg[preserveAspectRatio="none"]')];
    expect(svgs).toHaveLength(1);
    return svgs[0];
  };

  it("ne contient ni texte, ni cercle, ni marqueur (ils seraient déformés)", () => {
    expect(stretched().querySelectorAll("text, circle, ellipse, marker, [marker-end], [marker-start]")).toHaveLength(0);
  });

  it("chaque liaison garde une épaisseur en pixels (non-scaling-stroke)", () => {
    const paths = [...stretched().querySelectorAll("path")];
    expect(paths.length).toBeGreaterThan(5);
    for (const path of paths) expect(path.getAttribute("vector-effect")).toBe("non-scaling-stroke");
  });
});
