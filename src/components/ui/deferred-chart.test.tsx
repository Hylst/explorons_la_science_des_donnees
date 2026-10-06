import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Bar, BarChart } from "recharts";
import { DeferredResponsiveContainer } from "./deferred-chart";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | undefined;
let container: HTMLDivElement | undefined;

const render = async () => {
  const div = document.createElement("div");
  document.body.appendChild(div);
  container = div;
  const r = createRoot(div);
  root = r;
  await act(async () => {
    r.render(
      <DeferredResponsiveContainer width="100%" height={300}>
        <BarChart data={[{ x: 1 }]}>
          <Bar dataKey="x" />
        </BarChart>
      </DeferredResponsiveContainer>
    );
  });
  return div;
};

// jsdom n'a pas ResizeObserver, dont ResponsiveContainer a besoin
beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
});

afterEach(() => {
  if (root) act(() => root!.unmount());
  container?.remove();
  root = undefined;
  container = undefined;
  vi.unstubAllGlobals();
});

describe("DeferredResponsiveContainer", () => {
  it("réserve la taille exacte du graphique, puis le dessine à l'approche de l'écran", async () => {
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
    const div = await render();
    const boite = div.firstElementChild as HTMLElement;
    expect(div.querySelector(".recharts-responsive-container")).toBeNull();
    expect(boite.style.height).toBe("300px");
    expect(boite.style.width).toBe("100%");
    await act(async () => signaler(false));
    expect(div.querySelector(".recharts-responsive-container")).toBeNull();
    await act(async () => signaler(true));
    expect(div.querySelector(".recharts-responsive-container")).not.toBeNull();
  });

  it("dessine tout de suite sans IntersectionObserver", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const div = await render();
    expect(div.querySelector(".recharts-responsive-container")).not.toBeNull();
  });
});
