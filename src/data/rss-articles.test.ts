import { describe, expect, it } from "vitest";
import snapshot from "./rss-articles.json";
import exclusions from "./rss-exclusions.json";

const PROMO = exclusions.patterns.map((p) => new RegExp(p, "iu"));

describe("instantané des actualités", () => {
  it("les motifs d'exclusion reconnaissent un article promotionnel et laissent passer un article ordinaire", () => {
    const matches = (title: string, url = "https://exemple.org/article") => PROMO.some((re) => re.test(title) || re.test(url));
    expect(matches("Devenez AI Engineer : la formation complète pour maîtriser l'IA")).toBe(true);
    expect(matches("Un article", "https://exemple.org/formation-ai-engineer")).toBe(true);
    expect(matches("Skewness and Kurtosis: From Moments to Machine Learning")).toBe(false);
    expect(matches("Feux de forêt par commune en France, depuis 1973")).toBe(false);
  });

  it("ne reprend aucun article promotionnel (le site n'a pas de côté commercial)", () => {
    const promotional = snapshot.articles.filter((a) => PROMO.some((re) => re.test(a.title) || re.test(a.url)));
    expect(promotional.map((a) => a.title)).toEqual([]);
  });
});
