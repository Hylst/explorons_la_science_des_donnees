// @vitest-environment node
// Règles 301 pour Nginx (scripts/nginx-redirects.ts) : une par ancienne URL, sans jamais attraper une adresse canonique
import path from "node:path";
import { describe, expect, it } from "vitest";
import { nginxRedirects } from "../../scripts/nginx-redirects";
import { collectRoutes } from "../../scripts/collect-routes";
import { LEGACY_REDIRECTS } from "./routes";

const rules = nginxRedirects("/data_science_explorer/")
  .split("\n")
  .filter((l) => l.startsWith("location"))
  .map((l) => {
    const m = /^location ~ (\S+) \{ return 301 (\S+); \}$/.exec(l);
    if (!m) throw new Error("règle illisible : " + l);
    return { re: new RegExp(m[1]), target: m[2] };
  });
const redirect = (url: string) => rules.find((r) => r.re.test(url))?.target;

describe("règles Nginx des anciennes URL", () => {
  it("une règle par entrée de LEGACY_REDIRECTS", () => {
    expect(rules).toHaveLength(LEGACY_REDIRECTS.length);
  });

  it("chaque ancienne URL est redirigée vers sa cible, avec ou sans barre finale ou index.html", () => {
    for (const { from, to } of LEGACY_REDIRECTS) {
      const [target, fragment] = to.split("#");
      const expected = `/data_science_explorer${target}$is_args$args${fragment ? "#" + fragment : ""}`;
      for (const suffix of ["", "/", "/index.html"]) expect(redirect(`/data_science_explorer${from}${suffix}`), from + suffix).toBe(expected);
    }
  });

  it("aucune adresse canonique ni sous-page n'est redirigée", () => {
    const { canonical } = collectRoutes(path.resolve(__dirname, "../.."));
    expect(canonical.length).toBeGreaterThanOrEqual(57);
    for (const route of canonical) {
      for (const suffix of ["", "/", "/index.html"]) expect(redirect(`/data_science_explorer${route === "/" ? "" : route}${suffix}`), route).toBeUndefined();
    }
    expect(redirect("/data_science_explorer/course/python-basics-bis")).toBeUndefined();
    expect(redirect("/data_science_explorer/courses/fundamentals/math-stats/autre")).toBeUndefined();
  });
});
