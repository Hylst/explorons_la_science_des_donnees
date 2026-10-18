import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CardContent, CardHeader } from "./card";

const render = (ui: ReactElement) => {
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(ui);
  return { container };
};
const classes = (el: Element) => el.getAttribute("class")?.split(/\s+/) ?? [];

describe("marge intérieure des cartes sur téléphone", () => {
  it("passe à 16 px à gauche et à droite sous 640 px par défaut", () => {
    const { container } = render(<><CardHeader /><CardContent className="pt-6 text-sm" /></>);
    const [header, content] = [...container.children];
    expect(classes(header)).toEqual(expect.arrayContaining(["p-6", "max-sm:px-4"]));
    expect(classes(content)).toEqual(expect.arrayContaining(["p-6", "pt-6", "max-sm:px-4"]));
  });

  it("respecte une marge horizontale fixée par la carte, avec ou sans préfixe", () => {
    for (const cls of ["p-0", "px-8", "pl-8", "md:p-8", "!p-2", "pr-6 pt-4"]) {
      const { container } = render(<CardContent className={cls} />);
      expect(classes(container.firstElementChild as Element), cls).not.toContain("max-sm:px-4");
    }
  });

  it("ne confond pas une marge verticale avec une marge horizontale", () => {
    for (const cls of ["py-8", "pb-2", "pt-0", "gap-4 space-y-2"]) {
      const { container } = render(<CardContent className={cls} />);
      expect(classes(container.firstElementChild as Element), cls).toContain("max-sm:px-4");
    }
  });
});
