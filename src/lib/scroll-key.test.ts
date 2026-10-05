import { describe, expect, it } from "vitest";
import { positionKey } from "./scroll-key";

describe("positionKey", () => {
  it("distingue deux pages chargées en entier dans le même onglet (clé « default » pour les deux)", () => {
    const a = positionKey({ key: "default", pathname: "/fundamentals/math-stats/linear-algebra", search: "", hash: "" });
    const b = positionKey({ key: "default", pathname: "/fundamentals/databases", search: "", hash: "#exercises" });
    expect(a).not.toBe(b);
  });

  it("retrouve la même clé au rechargement de la même adresse", () => {
    const location = { key: "default", pathname: "/glossary", search: "?q=svm", hash: "" };
    expect(positionKey(location)).toBe(positionKey({ ...location }));
  });

  it("distingue deux entrées d'historique de la même page", () => {
    expect(positionKey({ key: "abc", pathname: "/blog", search: "", hash: "" })).not.toBe(
      positionKey({ key: "def", pathname: "/blog", search: "", hash: "" })
    );
  });
});
