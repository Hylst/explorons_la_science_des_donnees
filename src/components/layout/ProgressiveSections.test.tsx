import { act, lazy } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import ProgressiveSections from "./ProgressiveSections";
import { INITIAL_SECTIONS, initialSectionCount } from "@/lib/progressive-sections";
import { positionKey } from "@/lib/scroll-key";
import { resetSavedPositionsForTests, setSavedPosition } from "@/lib/scroll-positions";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const SECTIONS = ["un", "deux", "trois", "quatre", "cinq"];

let container: HTMLDivElement | undefined;
let root: Root | undefined;

const render = async (entry: string) => {
  const div = document.createElement("div");
  document.body.appendChild(div);
  container = div;
  const r = createRoot(div);
  root = r;
  await act(async () => {
    r.render(
      <MemoryRouter initialEntries={[entry]}>
        <ProgressiveSections>
          {SECTIONS.map((id) => (
            <section key={id} id={id} />
          ))}
        </ProgressiveSections>
      </MemoryRouter>
    );
  });
};

const shown = () => [...(container?.querySelectorAll("section") ?? [])].map((s) => s.id);

beforeEach(() => {
  sessionStorage.clear();
  resetSavedPositionsForTests();
});

afterEach(() => {
  if (root) act(() => root!.unmount());
  container?.remove();
  root = undefined;
  container = undefined;
});

describe("initialSectionCount", () => {
  it("n'affiche que les premières sections à une première visite", () => {
    expect(initialSectionCount(9, { isPop: true, hasSavedPosition: false, hasHash: false })).toBe(INITIAL_SECTIONS);
    expect(initialSectionCount(9, { isPop: false, hasSavedPosition: true, hasHash: false })).toBe(INITIAL_SECTIONS);
    expect(initialSectionCount(1, { isPop: false, hasSavedPosition: false, hasHash: false })).toBe(1);
  });

  it("affiche tout au retour sur une position mémorisée ou vers une ancre", () => {
    expect(initialSectionCount(9, { isPop: true, hasSavedPosition: true, hasHash: false })).toBe(9);
    expect(initialSectionCount(9, { isPop: false, hasSavedPosition: false, hasHash: true })).toBe(9);
  });
});

describe("ProgressiveSections", () => {
  it("affiche les premières sections, puis toutes les autres, une réserve de place en attendant", async () => {
    await render("/page");
    expect(shown()).toEqual(SECTIONS.slice(0, INITIAL_SECTIONS));
    expect(container?.querySelector("[data-sections-pending]")).not.toBeNull();
    for (let i = 0; i < 20 && shown().length < SECTIONS.length; i++) {
      await act(async () => {
        await wait(60);
      });
    }
    expect(shown()).toEqual(SECTIONS);
    expect(container?.querySelector("[data-sections-pending]")).toBeNull();
  });

  it("affiche tout d'emblée quand une position de lecture va être restaurée", async () => {
    // MemoryRouter : navigation initiale POP, clé « default », comme un rechargement
    setSavedPosition(positionKey({ key: "default", pathname: "/page", search: "", hash: "" }), 1200);
    await render("/page");
    expect(shown()).toEqual(SECTIONS);
  });

  it("garde une marque d'attente tant qu'une section chargée à la demande n'est pas arrivée", async () => {
    let arrive: (module: { default: () => JSX.Element }) => void = () => {};
    const Tardive = lazy(() => new Promise<{ default: () => JSX.Element }>((resolve) => (arrive = resolve)));
    const div = document.createElement("div");
    document.body.appendChild(div);
    container = div;
    const r = createRoot(div);
    root = r;
    await act(async () => {
      r.render(
        <MemoryRouter initialEntries={["/page#tardive"]}>
          <ProgressiveSections>
            <section id="premiere" />
            <Tardive />
          </ProgressiveSections>
        </MemoryRouter>
      );
    });
    expect(shown()).toEqual(["premiere"]);
    expect(div.querySelector("[data-sections-pending]")).not.toBeNull();
    await act(async () => {
      arrive({ default: () => <section id="tardive" /> });
      await wait(10);
    });
    expect(shown()).toEqual(["premiere", "tardive"]);
    expect(div.querySelector("[data-sections-pending]")).toBeNull();
  });

  it("affiche tout d'emblée quand l'adresse vise une ancre", async () => {
    await render("/page#quatre");
    expect(shown()).toEqual(SECTIONS);
  });
});
