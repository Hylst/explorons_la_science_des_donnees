import { act } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import Blog from "./Blog";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const cleanups: (() => void)[] = [];
afterEach(() => cleanups.splice(0).forEach((c) => c()));

const render = (path: string) => {
  const div = document.createElement("div");
  document.body.appendChild(div);
  const root = createRoot(div);
  cleanups.push(() => { act(() => root.unmount()); div.remove(); });
  act(() => root.render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/blog/:id" element={<Blog />} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  ));
  return div;
};

// l'affichage d'un article connu (un seul h1, son titre) est vérifié par le test de fumée sur chaque article
describe("page d'un article du blog", () => {
  it("répond par la page 404 du site pour un article inconnu", () => {
    const page = render("/blog/article-qui-n-existe-pas");
    expect([...page.querySelectorAll("h1")].map((h) => h.textContent)).toEqual(["404"]);
    expect(page.textContent).toContain("Cette page est introuvable.");
    expect(page.textContent).not.toContain("Blog Data Science");
  });
});
