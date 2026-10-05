import { describe, expect, it } from "vitest";
import { sidebarBounds } from "./use-sidebar-bounds";

describe("bornes de la barre latérale", () => {
  it("commence sous la barre de navigation, jusqu'en bas quand le pied de page est hors écran", () => {
    expect(sidebarBounds(65, 2642, 900)).toEqual({ top: 65, bottom: 0 });
  });

  it("s'arrête au-dessus du pied de page quand il entre à l'écran (cas mesuré : 405 px recouverts)", () => {
    expect(sidebarBounds(65, 495, 900)).toEqual({ top: 65, bottom: 405 });
  });

  it("ne donne jamais de valeur négative (barre de navigation sortie de l'écran)", () => {
    expect(sidebarBounds(-10, 1200, 900)).toEqual({ top: 0, bottom: 0 });
  });
});
