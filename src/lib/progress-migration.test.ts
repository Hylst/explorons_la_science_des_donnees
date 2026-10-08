import { beforeEach, describe, expect, it } from "vitest";
import { migrateMathIntroProgress } from "./progress-migration";

const progression = () => JSON.parse(localStorage.getItem("course-progress-math-intro") ?? "null");

describe("migrateMathIntroProgress", () => {
  beforeEach(() => localStorage.clear());

  it("reprend les modules terminés de l'ancien format, une seule fois", () => {
    localStorage.setItem("math-intro-completed", JSON.stringify([1, 3, 9]));
    migrateMathIntroProgress();
    expect(progression().status).toEqual({ "module-1": "done", "module-3": "done" });
    // une seconde reprise ne refait rien, même si l'ancienne clé change entre-temps
    localStorage.setItem("math-intro-completed", JSON.stringify([2]));
    migrateMathIntroProgress();
    expect(progression().status).toEqual({ "module-1": "done", "module-3": "done" });
  });

  it("ne crée rien quand il n'y a pas d'ancienne progression", () => {
    migrateMathIntroProgress();
    expect(progression()).toBeNull();
    expect(localStorage.getItem("math-intro-progress-migrated")).toBe("1");
  });
});
