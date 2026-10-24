import fs from "node:fs";
import path from "node:path";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LazyChart } from "./lazy-chart";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | undefined;
let container: HTMLDivElement | undefined;

const Graphique = () => <svg data-testid="graphique" />;

const render = async (load: () => Promise<{ default: () => JSX.Element }>) => {
  const div = document.createElement("div");
  document.body.appendChild(div);
  container = div;
  const r = createRoot(div);
  root = r;
  await act(async () => {
    r.render(<LazyChart load={load} height={250} width="70%" />);
  });
  return div;
};

afterEach(() => {
  if (root) act(() => root!.unmount());
  container?.remove();
  root = undefined;
  container = undefined;
  vi.unstubAllGlobals();
});

describe("LazyChart", () => {
  it("réserve la taille du graphique et ne charge son module qu'à l'approche de l'écran", async () => {
    let signaler: (visible: boolean) => void = () => {};
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: (entrees: { isIntersecting: boolean }[]) => void) {
          signaler = (visible) => callback([{ isIntersecting: visible }]);
        }
        observe() {}
        disconnect() {}
      }
    );
    const load = vi.fn(async () => ({ default: Graphique }));
    const div = await render(load);
    const boite = div.firstElementChild as HTMLElement;
    expect(boite.style.height).toBe("250px");
    expect(boite.style.width).toBe("70%");
    await act(async () => signaler(false));
    expect(load).not.toHaveBeenCalled();
    expect(div.querySelector("svg")).toBeNull();
    await act(async () => signaler(true));
    expect(load).toHaveBeenCalledTimes(1);
    expect(div.querySelector("svg")).not.toBeNull();
    // la boîte garde sa taille une fois le graphique arrivé : la page ne bouge pas
    expect(boite.style.height).toBe("250px");
  });

  it("charge tout de suite sans IntersectionObserver", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const div = await render(async () => ({ default: Graphique }));
    expect(div.querySelector("svg")).not.toBeNull();
  });
});

describe("/fundamentals : Recharts hors du premier affichage", () => {
  // Ces fichiers font partie des deux premières sections de /fundamentals : un import de recharts (ou de
  // deferred-chart, qui l'importe) y ramènerait la bibliothèque avant l'affichage (performance 87 → 92, 24 octobre 2026)
  const ROOT = path.resolve(__dirname, "../..");
  const fichiers = [
    ...fs.readdirSync(path.join(ROOT, "components/fundamentals/statistics")).filter((f) => f.endsWith(".tsx")).map((f) => `components/fundamentals/statistics/${f}`),
    "components/fundamentals/MathVisualsSection.tsx",
    "components/fundamentals/math-visuals-data.ts",
  ];
  it.each(fichiers)("%s n'importe ni recharts ni deferred-chart", (fichier) => {
    const source = fs.readFileSync(path.join(ROOT, fichier), "utf8");
    expect(source).not.toMatch(/from ["'](recharts|@\/components\/ui\/(deferred-chart|chart))["']/);
  });
});
