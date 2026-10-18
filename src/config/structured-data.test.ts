// @vitest-environment node
import path from "node:path";
import { describe, expect, it } from "vitest";
import { isoFromFrenchDate, jsonLdTag, structuredData } from "../../scripts/structured-data";
import { COURSE_CATALOG } from "@/data/course-catalog";
import { SITE_URL } from "@/config/site";

const ROOT = path.resolve(__dirname, "../..");

describe("données structurées (JSON-LD) des pages générées", () => {
  const data = structuredData(ROOT);

  it("le site sur l'accueil, un Course par cours rédigé, un BlogPosting par article", () => {
    expect(data.get("/")?.["@type"]).toBe("WebSite");
    const rediges = COURSE_CATALOG.filter((c) => c.status === "redige");
    expect(rediges.length).toBe(11);
    for (const c of rediges) {
      const d = data.get(c.href);
      expect(d?.["@type"], c.href).toBe("Course");
      expect(d?.name).toBe(c.title);
      expect(d?.url).toBe(`${SITE_URL}${c.href.slice(1)}`);
      expect(d?.isAccessibleForFree).toBe(true);
    }
    const articles = [...data.keys()].filter((k) => k.startsWith("/blog/"));
    expect(articles.length).toBe(5);
    for (const k of articles) {
      expect(data.get(k)?.["@type"]).toBe("BlogPosting");
      expect(data.get(k)?.datePublished, k).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("aucune note, aucun prix, aucun nombre d'élèves : rien que le site ne sait pas", () => {
    const texte = JSON.stringify([...data.values()]);
    for (const interdit of ["aggregateRating", "offers", "price", "review", "numberOf"]) expect(texte).not.toContain(interdit);
  });

  it("dates françaises converties, balise sans fin de script possible", () => {
    expect(isoFromFrenchDate("2 octobre 2026")).toBe("2026-10-02");
    expect(isoFromFrenchDate("1er août 2025")).toBe("2025-08-01");
    expect(isoFromFrenchDate("octobre 2026")).toBeNull();
    const tag = jsonLdTag({ headline: "a </script><script>alert(1)</script>" });
    expect(tag.match(/<\/script>/g)).toHaveLength(1);
    expect(JSON.parse(tag.replace(/^\s*<script type="application\/ld\+json">/, "").replace(/<\/script>\s*$/, "")).headline).toContain("</script>");
  });
});
