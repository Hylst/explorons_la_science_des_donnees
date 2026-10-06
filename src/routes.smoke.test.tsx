/**
 * Test de fumée : chaque route canonique du site s'affiche sans déclencher l'ErrorBoundary.
 * Lent (une cinquantaine de pages à charger) : exclu de `npm test`, lancé par `npm run test:smoke`.
 * Il attrape ce que ni le typage ni les tests unitaires ne voient : un import qui échoue au chargement,
 * une variable utilisée avant sa définition, une erreur de rendu propre à une page.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
// Fichier exécuté par Node au build : import relatif, sans alias
import { collectRoutes } from "../scripts/collect-routes";
import App from "./App";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const routes = collectRoutes(process.cwd()).canonical;

beforeAll(() => {
  // jsdom n'implémente pas ces API que les pages (graphiques, animations, défilement) utilisent
  class Observer {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  vi.stubGlobal("ResizeObserver", Observer);
  vi.stubGlobal("IntersectionObserver", Observer);
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  }));
  window.scrollTo = () => {};
  Element.prototype.scrollIntoView = () => {};
});

let container: HTMLDivElement | undefined;
let root: Root | undefined;

afterEach(() => {
  if (root) act(() => root!.unmount());
  container?.remove();
  container = undefined;
  root = undefined;
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Identifiants présents plusieurs fois (une ancre ou un label ne vise alors que le premier) */
const idsEnDouble = (el: Element) => {
  const vus = new Map<string, number>();
  for (const node of el.querySelectorAll("[id]")) vus.set(node.id, (vus.get(node.id) ?? 0) + 1);
  return [...vus].filter(([, n]) => n > 1).map(([id, n]) => `${id} x${n}`);
};

describe("routes : chaque page s'affiche", () => {
  it("trouve les routes du site", () => {
    expect(routes.length).toBeGreaterThan(40);
  });

  it.each(routes)("%s", async (route) => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    window.history.pushState({}, "", route);
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    await act(async () => {
      root!.render(createElement(App));
    });
    // les pages sont chargées à la demande : on attend la fin du chargement (15 s au plus)
    const debut = Date.now();
    // les pages longues s'affichent par morceaux (ProgressiveSections) : on attend aussi la dernière section
    while (
      Date.now() - debut < 15000 &&
      ((container.textContent ?? "").includes("Chargement de la page") || container.querySelector("[data-sections-pending]"))
    ) {
      await act(async () => {
        await wait(50);
      });
    }
    const texte = container.textContent ?? "";
    expect(texte).not.toContain("Une erreur s'est produite");
    expect(texte).not.toContain("Chargement de la page");
    expect(container.querySelector("[data-sections-pending]"), `sections encore en attente sur ${route}`).toBeNull();
    expect(texte.length).toBeGreaterThan(300);
    expect(container.querySelectorAll("h1").length, `titres h1 de ${route} (il en faut exactement un)`).toBe(1);
    // un seul fil d'Ariane par page (régression du 5 octobre 2026 : /machine-learning/supervised en affichait deux, l'un sous l'autre)
    expect(container.querySelectorAll('nav[aria-label="breadcrumb"]').length, `fils d'Ariane de ${route}`).toBeLessThanOrEqual(1);
    // régression du 5 octobre 2026 : l'algèbre linéaire affichait chaque section deux fois, avec les mêmes id
    expect(idsEnDouble(container), `id en double sur ${route}`).toEqual([]);

    // Radix n'affiche que l'onglet actif : on active chaque onglet (y compris ceux qui apparaissent ensuite)
    // pour que le contenu des autres onglets soit rendu, lui aussi.
    const actives = new Set<string>();
    for (let passe = 0; passe < 3; passe++) {
      const onglets = [...container.querySelectorAll<HTMLElement>('[role="tab"]')];
      let nouveaux = 0;
      for (const onglet of onglets) {
        const cle = `${onglet.getAttribute("id") ?? ""}|${onglet.textContent}`;
        if (actives.has(cle)) continue;
        actives.add(cle);
        nouveaux++;
        await act(async () => {
          onglet.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true, button: 0 }));
          await wait(10);
        });
        expect(container.textContent ?? "", `onglet « ${onglet.textContent} » de ${route}`).not.toContain("Une erreur s'est produite");
        expect(idsEnDouble(container), `id en double, onglet « ${onglet.textContent} » de ${route}`).toEqual([]);
      }
      if (nouveaux === 0) break;
    }

    // chaque lien d'ancre (href="#x") de la page mène à un élément présent dans la page elle-même (barre latérale comprise)
    // Régression du 5 octobre 2026 : le guide des modèles pointait vers « #overview » et le guide des transformers vers « #data-transformers ».
    const page = container;
    const ancres = [...page.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]
      .map((a) => a.getAttribute("href") ?? "")
      .filter((href) => href.length > 1);
    const manquantes = [...new Set(ancres)].filter((href) => !page.querySelector(`[id="${href.slice(1)}"]`));
    expect(manquantes, `ancres sans cible sur ${route}`).toEqual([]);
  }, 60000);
});
