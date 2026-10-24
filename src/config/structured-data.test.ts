// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  BLOG_IMAGE_SIZE,
  blogArticles,
  breadcrumbList,
  isoFromFrenchDate,
  jsonLdTag,
  knownDates,
  pageNames,
  structuredData,
} from "../../scripts/structured-data";
import { collectRoutes } from "../../scripts/collect-routes";
import { COURSE_CATALOG } from "@/data/course-catalog";
import { LEGAL_UPDATED, SITE_URL } from "@/config/site";

const ROOT = path.resolve(__dirname, "../..");

describe("données structurées (JSON-LD) des pages générées", () => {
  const data = structuredData(ROOT);

  it("le site sur l'accueil, un Course par cours rédigé, un BlogPosting par article", () => {
    expect(data.get("/")?.["@type"]).toBe("WebSite");
    const rediges = COURSE_CATALOG.filter((c) => c.status === "redige");
    expect(rediges.length).toBe(14);
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

  it("fil d'Ariane : l'accueil, chaque niveau de l'URL qui est une page, puis la page ; aucun pour l'accueil", () => {
    const nameOf = pageNames(ROOT);
    const { canonical } = collectRoutes(ROOT);
    expect(breadcrumbList("/", nameOf)).toBeNull();
    for (const route of canonical.filter((r) => r !== "/")) {
      const items = (breadcrumbList(route, nameOf)?.itemListElement ?? []) as { position: number; name: string; item: string }[];
      expect(items[0], route).toMatchObject({ position: 1, name: "Accueil", item: SITE_URL });
      expect(items.at(-1), route).toMatchObject({ position: items.length, name: nameOf(route), item: `${SITE_URL}${route.slice(1)}` });
      items.forEach((it, i) => expect(it.position).toBe(i + 1));
      // chaque élément est une page réelle ; /courses/programming (qui n'en est pas une) est sauté
      for (const it of items.slice(1)) expect(canonical, route).toContain(`/${it.item.slice(SITE_URL.length)}`);
    }
    const python = (breadcrumbList("/courses/programming/python-basics", nameOf)?.itemListElement ?? []) as { name: string }[];
    expect(python.map((it) => it.name)).toEqual(["Accueil", "Catalogue des cours de data science", "Python pour la data science"]);
    expect(() => breadcrumbList("/pas-une-page", nameOf)).toThrow(/page sans nom/);
  });

  it("articles : illustration absolue de la taille annoncée, dates connues pour le sitemap", () => {
    const articles = blogArticles(ROOT);
    expect(articles).toHaveLength(5);
    for (const { route, image, datePublished, dateModified, post } of articles) {
      expect(image).toBe(`${SITE_URL}img/blog/${post.id}.webp`);
      expect(datePublished, route).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(dateModified >= datePublished, route).toBe(true);
      expect(data.get(route)?.dateModified, route).toBe(dateModified);
      // largeur et hauteur lues dans l'en-tête VP8 du fichier WebP
      const file = fs.readFileSync(path.join(ROOT, "public/img/blog", `${post.id}.webp`));
      const frame = file.indexOf("VP8 ") + 8;
      expect({ width: file.readUInt16LE(frame + 6) & 0x3fff, height: file.readUInt16LE(frame + 8) & 0x3fff }, route).toEqual(BLOG_IMAGE_SIZE);
    }
    const dates = knownDates(ROOT);
    expect([...dates.keys()].sort()).toEqual([...articles.map((a) => a.route), "/privacy", "/terms"].sort());
    // dernière modification, pas publication : trois articles ont été retouchés le 9 octobre
    for (const a of articles) expect(dates.get(a.route)).toBe(a.dateModified);
    expect(dates.get("/blog/data-science-jobs")).toBe("2026-10-09");
    expect(dates.get("/privacy")).toBe(isoFromFrenchDate(LEGAL_UPDATED));
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
