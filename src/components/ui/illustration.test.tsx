// Transparence sur les images générées par IA (24 octobre 2026) : chaque image produite par un modèle porte l'étiquette,
// et les SVG dessinés pour le site ne la portent pas.
import fs from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AI_IMAGE_LABEL, Illustration } from "./illustration";
import { ANIMATED_COURSE_IMAGES, isAiCourseImage } from "@/lib/course-image";
import { COURSE_CATALOG, FEATURED_COURSE_IDS } from "@/data/course-catalog";

const ROOT = path.resolve(__dirname, "../../..");

describe("étiquette des images générées par IA", () => {
  it("affichée quand ai est vrai, absente sinon", () => {
    expect(renderToStaticMarkup(<Illustration ai src="x.webp" />)).toContain(AI_IMAGE_LABEL);
    expect(renderToStaticMarkup(<Illustration ai={false} src="x.svg" />)).not.toContain(AI_IMAGE_LABEL);
  });

  it("chaque carte de cours en WebP (générée par IA) est signalée, pas les SVG animés", () => {
    for (const course of COURSE_CATALOG) {
      const ai = isAiCourseImage(course.id);
      expect(ai, course.id).toBe(!(course.id in ANIMATED_COURSE_IMAGES));
      if (ai) expect(fs.existsSync(path.join(ROOT, "public/img/courses", `${course.id}.webp`)), course.id).toBe(true);
    }
  });

  it("toutes les pages qui affichent une image du blog ou d'un cours passent par l'étiquette", () => {
    for (const file of ["src/components/blog/BlogPost.tsx", "src/components/blog/BlogPostCard.tsx", "src/pages/courses/CoursesIndex.tsx", "src/components/home/LatestArticles.tsx"]) {
      const source = fs.readFileSync(path.join(ROOT, file), "utf8");
      expect(source, file).toMatch(/<Illustration\b|<AiImageLabel\b/);
    }
    // les images du blog sont toutes générées : l'étiquette y est inconditionnelle ; celles des cours dépendent du cours
    for (const file of ["src/components/blog/BlogPost.tsx", "src/components/blog/BlogPostCard.tsx"]) {
      expect(fs.readFileSync(path.join(ROOT, file), "utf8"), file).toMatch(/<Illustration\s+ai\s/);
    }
    expect(fs.readFileSync(path.join(ROOT, "src/pages/courses/CoursesIndex.tsx"), "utf8")).toMatch(/ai=\{isAiCourseImage\(course\.id\)\}/);
    // aucune autre balise img ne montre ces images sans étiquette
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walk(full);
        else if (/\.tsx$/.test(e.name) && !/\.test\.tsx$/.test(e.name)) {
          const s = fs.readFileSync(full, "utf8");
          if (/(blogImage|courseImage)\(/.test(s) && !/<Illustration\b|<AiImageLabel\b/.test(s)) offenders.push(path.relative(ROOT, full));
        }
      }
    };
    walk(path.join(ROOT, "src"));
    expect(offenders).toEqual([]);
  });

  it("les trois cartes de l'accueil sont des SVG dessinés pour le site (aucune étiquette attendue)", () => {
    for (const id of FEATURED_COURSE_IDS) expect(isAiCourseImage(id), id).toBe(false);
  });
});
