import { describe, expect, it } from "vitest";
import { describeError } from "./describe-error";

describe("describeError", () => {
  it("garde le message d'une Error et le texte d'une chaîne", () => {
    expect(describeError(new Error("échec réseau"))).toBe("échec réseau");
    expect(describeError(new TypeError(""))).toBe("TypeError");
    expect(describeError("délai dépassé")).toBe("délai dépassé");
  });

  it("ne renvoie jamais « [object Object] » pour un objet (constaté sur le site en ligne le 11 octobre 2026)", () => {
    const circulaire: Record<string, unknown> = {};
    circulaire.self = circulaire;
    for (const valeur of [{}, { status: 404 }, { message: "stdlib absente" }, { name: "ExitStatus" }, circulaire, Object.create(null)]) {
      expect(describeError(valeur)).not.toContain("[object");
      expect(describeError(valeur).length).toBeGreaterThan(0);
    }
    expect(describeError({ message: "stdlib absente" })).toBe("stdlib absente");
    expect(describeError({ status: 404 })).toBe('{"status":404}');
    expect(describeError({ name: "ExitStatus" })).toBe('{"name":"ExitStatus"}');
  });

  it("tronque un objet volumineux", () => {
    expect(describeError({ texte: "x".repeat(1000) }).length).toBeLessThanOrEqual(301);
  });
});
