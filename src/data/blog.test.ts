import { describe, expect, it } from "vitest";
import blogPostsMeta from "./blog-posts.json";
import { blogContents } from "./blog-contents";
import { sanitizeHtml } from "@/lib/sanitize";

const plain = (id: string) => blogContents[id].replace(/<[^>]+>/g, " ");

// Aucun article ne doit se faire passer pour un témoignage ou une expérience vécue : les mises en situation
// sont annoncées comme « cas d'école » et écrites à la troisième personne ou à l'impersonnel.
describe("articles de blog", () => {
  it("chaque article a un corps et chaque corps a une fiche", () => {
    expect(Object.keys(blogContents).sort()).toEqual(blogPostsMeta.map((post) => post.id).sort());
  });

  it("tout article étiqueté « Cas d'école » porte la note en tête de texte", () => {
    const cases = blogPostsMeta.filter((post) => post.categories.includes("Cas d'école"));
    expect(cases.length).toBeGreaterThan(0);
    for (const post of cases) {
      expect(blogContents[post.id], post.id).toContain("<strong>Cas d'école.</strong>");
    }
  });

  it("aucun article ne raconte d'expérience personnelle ni d'entretien", () => {
    for (const post of blogPostsMeta) {
      const text = plain(post.id);
      expect(text, post.id).not.toMatch(/\b(j'ai|j’ai|je suis|je me|mon équipe|mon manager|ma carrière|m'a poussé|me confie|interviewé|cher journal)\b/i);
      expect(text, post.id).not.toMatch(/«\s*[^»]{20,}»\s*,?\s*(me )?(confie|raconte|explique|admet)/i);
    }
  });

  it("aucune catégorie ne présente un texte comme un témoignage ou un récit vécu", () => {
    for (const post of blogPostsMeta) {
      for (const interdit of ["Témoignage", "Anecdote", "Aventure", "Récit fictif", "Récit"]) {
        expect(post.categories, post.id).not.toContain(interdit);
      }
    }
  });

  it("la date de publication ne précède pas la rédaction du texte actuel", () => {
    for (const post of blogPostsMeta) expect(post.date, post.id).toMatch(/2026/);
  });

  it("la désinfection HTML conserve les liens de référence, les blocs de code et la note en tête", () => {
    for (const post of blogPostsMeta) {
      const raw = blogContents[post.id];
      const clean = sanitizeHtml(raw);
      expect(clean.match(/<a /g)?.length ?? 0, post.id).toBe(raw.match(/<a /g)?.length ?? 0);
      expect(clean.match(/<pre>/g)?.length ?? 0, post.id).toBe(raw.match(/<pre>/g)?.length ?? 0);
      if (post.categories.includes("Cas d'école")) expect(clean, post.id).toContain("Cas d'école.");
    }
    expect(sanitizeHtml(blogContents["correlation-causation"])).toContain('href="https://doi.org/10.1111/j.1365-3016.2003.00534.x"');
  });

  it("le corps d'un article ne contient pas de titre h1 : la page affiche déjà le titre de l'article", () => {
    for (const post of blogPostsMeta) expect(blogContents[post.id], post.id).not.toMatch(/<h1[ >]/);
  });
});
