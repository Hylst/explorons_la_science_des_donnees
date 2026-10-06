import { describe, expect, it } from "vitest";
import { durationMinutes, formatMinutes, totalDuration } from "./duration";

describe("durées des modules", () => {
  it("lit les formats utilisés dans les cours", () => {
    expect(durationMinutes("1 h 30")).toBe(90);
    expect(durationMinutes("3 h")).toBe(180);
    expect(durationMinutes("45 min")).toBe(45);
    expect(durationMinutes("2h30")).toBe(150);
  });

  it("refuse un texte qui n'est pas une durée", () => {
    expect(() => durationMinutes("bientôt")).toThrow();
    expect(() => durationMinutes("")).toThrow();
  });

  it("additionne et met en forme", () => {
    expect(totalDuration(["1 h 30", "3 h", "2 h 30"])).toBe("7 h");
    expect(totalDuration(["1 h 30", "45 min"])).toBe("2 h 15");
    expect(formatMinutes(45)).toBe("45 min");
    expect(formatMinutes(125)).toBe("2 h 05");
  });
});
