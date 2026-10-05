import { describe, expect, it } from "vitest";
import { contrastRatio, readableTextColor } from "./contrast";

describe("contrastRatio", () => {
  it("vaut 21 entre noir et blanc, dans les deux sens", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(contrastRatio("#ffffff", "#000000")).toBeCloseTo(21, 5);
  });

  it("vaut 1 entre deux couleurs identiques", () => {
    expect(contrastRatio("#3776ab", "#3776ab")).toBeCloseTo(1, 5);
  });

  it("accepte la forme courte #rgb", () => {
    expect(contrastRatio("#fff", "#000")).toBeCloseTo(21, 5);
  });

  it("renvoie null pour une couleur qui n'est pas hexadécimale", () => {
    expect(contrastRatio("rgb(0, 0, 0)", "#ffffff")).toBeNull();
    expect(contrastRatio("#ffffff", "bleu")).toBeNull();
  });
});

describe("readableTextColor", () => {
  it("choisit le blanc sur un fond sombre", () => {
    expect(readableTextColor("#1e3a8a")).toBe("#ffffff");
    expect(readableTextColor("#000000")).toBe("#ffffff");
  });

  it("choisit le bleu nuit sur un fond clair (jaune, orange vif, vert clair)", () => {
    expect(readableTextColor("#eab308")).toBe("#0f172a");
    expect(readableTextColor("#f29111")).toBe("#0f172a");
    expect(readableTextColor("#84cc16")).toBe("#0f172a");
  });

  it("le texte retenu atteint au moins 4,5:1 sur les couleurs de marque du site", () => {
    // Couleurs de langages et de types de corrélation utilisées en fond de pastille
    for (const background of ["#3776ab", "#f29111", "#10b981", "#f59e0b", "#ef4444", "#6b7280", "#276dc3", "#9558b2"]) {
      const text = readableTextColor(background);
      expect(contrastRatio(background, text) ?? 0, background).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("renvoie le blanc quand le fond n'est pas lisible", () => {
    expect(readableTextColor("transparent")).toBe("#ffffff");
  });
});
