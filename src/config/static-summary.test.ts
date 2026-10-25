// @vitest-environment node
// Résumé statique des pages générées (scripts/static-summary.ts) : plan des cours lu dans les sources, HTML échappé
import path from "node:path";
import { describe, expect, it } from "vitest";
import { lessonOutlines, staticSummary } from "../../scripts/static-summary";
import { COURSE_CATALOG } from "@/data/course-catalog";
import { SITE_BASE } from "@/config/site";

const ROOT = path.resolve(__dirname, "../..");

describe("résumé statique des pages générées", () => {
  it("plan de chaque cours rédigé (autant de modules que le catalogue) et des projets guidés", () => {
    const outlines = lessonOutlines(ROOT);
    const rediges = COURSE_CATALOG.filter((c) => c.status === "redige");
    expect(rediges).toHaveLength(15);
    for (const course of rediges) {
      const titles = outlines.get(course.href);
      expect(titles, course.href).toBeDefined();
      expect(titles?.length, course.href).toBe(course.modules);
      for (const t of titles ?? []) expect(t.trim().length, course.href).toBeGreaterThan(3);
    }
    expect(outlines.get("/projects")).toHaveLength(12);
    expect(outlines.get("/courses/programming/python-basics")?.[0]).toBe("Premiers pas avec Python");
  });

  it("titre, description, fil d'Ariane, plan, article et pages filles ; texte échappé, liens sous la base du site", () => {
    const html = staticSummary({
      name: "Cours <b>&</b>",
      description: 'Une "description"',
      crumbs: [{ route: "/", name: "Accueil" }, { route: "/courses", name: "Catalogue" }],
      children: [{ route: "/courses/x", name: "Fille" }],
      outline: ["Module <1>"],
      articleHtml: "<h2>Partie</h2><p>Texte</p>",
    });
    expect(html.startsWith('<div class="static-summary">')).toBe(true);
    expect(html).toContain("<h1>Cours &lt;b&gt;&amp;&lt;/b&gt;</h1>");
    expect(html).toContain("<p>Une &quot;description&quot;</p>");
    expect(html).toContain(`<nav aria-label="Fil d'Ariane"><ol><li><a href="${SITE_BASE}">Accueil</a></li><li><a href="${SITE_BASE}courses">Catalogue</a></li></ol></nav>`);
    expect(html).toContain("<li>Module &lt;1&gt;</li>");
    expect(html).toContain("<article><h2>Partie</h2><p>Texte</p></article>");
    expect(html).toContain(`<a href="${SITE_BASE}courses/x">Fille</a>`);
    // un seul h1, avant tout h2
    expect(html.match(/<h1>/g)).toHaveLength(1);
    expect(html.indexOf("<h1>")).toBeLessThan(html.indexOf("<h2>"));
  });

  it("accueil : ni fil d'Ariane ni section vide", () => {
    const html = staticSummary({ name: "Site", description: "D", crumbs: [], children: [] });
    expect(html).toBe('<div class="static-summary"><h1>Site</h1><p>D</p></div>');
  });
});
