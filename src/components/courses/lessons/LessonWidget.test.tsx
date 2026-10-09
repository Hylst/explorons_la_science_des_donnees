import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import LessonWidgetView from "./LessonWidget";
import type { LessonWidget } from "@/lib/lessons/types";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
let root: Root | undefined;
let container: HTMLDivElement | undefined;

const render = async (widget: LessonWidget) => {
  const div = document.createElement("div");
  document.body.appendChild(div);
  container = div;
  const r = createRoot(div);
  root = r;
  await act(async () => {
    r.render(<LessonWidgetView widget={widget} />);
  });
  // composants chargés à la demande : on attend leur arrivée
  // jusqu'à 5 s : sous charge (tests en parallèle), le chargement à la demande peut être lent
  for (let i = 0; i < 200 && div.querySelector(".animate-pulse"); i++) {
    await act(async () => {
      await wait(25);
    });
  }
  return div;
};

afterEach(() => {
  if (root) act(() => root!.unmount());
  container?.remove();
  root = undefined;
  container = undefined;
});

describe("LessonWidgetView", () => {
  it("affiche le banc d'essai NumPy, qui mesure dans le navigateur (aucun temps écrit à l'avance)", async () => {
    const div = await render("numpy-benchmark");
    expect(div.querySelector(".animate-pulse")).toBeNull();
    expect(div.textContent ?? "").toMatch(/NumPy/);
    expect(div.querySelector("button")).not.toBeNull();
  });

  it("affiche le schéma demandé", async () => {
    const div = await render("pandas-dataframe");
    expect(div.querySelector(".animate-pulse")).toBeNull();
    expect((div.textContent ?? "").length).toBeGreaterThan(50);
  });

  it.each(["venn-diagram", "activation-functions", "tangent-line", "riemann-sum"] as const)("affiche la figure mathématique %s", async (widget) => {
    const div = await render(widget);
    expect(div.querySelector(".animate-pulse")).toBeNull();
    expect(div.querySelector("svg")).not.toBeNull();
  });
});
