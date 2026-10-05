import { describe, expect, it } from "vitest";
import { formatMinutes } from "./format-duration";

describe("formatMinutes", () => {
  it("affiche les durées de moins d'une heure en minutes", () => {
    expect(formatMinutes(1)).toBe("1 min");
    expect(formatMinutes(25)).toBe("25 min");
    expect(formatMinutes(45)).toBe("45 min");
  });

  it("affiche zéro minute", () => {
    expect(formatMinutes(0)).toBe("0 min");
  });

  it("bascule en heures à partir de 60 minutes (limite 59 / 60)", () => {
    expect(formatMinutes(59)).toBe("59 min");
    expect(formatMinutes(60)).toBe("1 h");
  });

  it("n'écrit pas de minutes pour un nombre entier d'heures", () => {
    expect(formatMinutes(120)).toBe("2 h");
    expect(formatMinutes(180)).toBe("3 h");
    expect(formatMinutes(600)).toBe("10 h");
  });

  it("complète les minutes sur deux chiffres après l'heure", () => {
    expect(formatMinutes(61)).toBe("1 h 01");
    expect(formatMinutes(65)).toBe("1 h 05");
    expect(formatMinutes(75)).toBe("1 h 15");
    expect(formatMinutes(119)).toBe("1 h 59");
    expect(formatMinutes(125)).toBe("2 h 05");
  });

  it("gère de grandes durées", () => {
    expect(formatMinutes(1440)).toBe("24 h");
    expect(formatMinutes(1501)).toBe("25 h 01");
  });

  it("reste cohérent : heures et minutes retrouvent la durée d'origine", () => {
    for (let minutes = 60; minutes < 600; minutes += 7) {
      const match = formatMinutes(minutes).match(/^(\d+) h(?: (\d{2}))?$/);
      expect(match, `${minutes} min`).not.toBeNull();
      const total = Number(match?.[1]) * 60 + Number(match?.[2] ?? 0);
      expect(total).toBe(minutes);
    }
  });
});
