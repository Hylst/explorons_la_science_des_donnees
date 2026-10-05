import { describe, expect, it } from "vitest";
import { dataProcessingDefinitions } from "@/components/fundamentals/definitions/data-processing-definitions";
import { datavizDefinitions } from "@/components/fundamentals/definitions/dataviz-definitions";
import { programmingDefinitions } from "@/components/fundamentals/definitions/programming-definitions";
import { statisticsDefinitions } from "@/components/fundamentals/definitions/statistics-definitions";
import { dataPreparationEnhancedDefinitions } from "@/data/data-preparation-enhanced-definitions";
import { glossaryTerms } from "./index";
import { normalizeTerm, termKeys } from "./from-definition";

const known = new Set(glossaryTerms.flatMap((entry) => termKeys(entry.term, entry.englishTerm)));

describe("glossaire et dictionnaires de survol des cours", () => {
  // Principe écrit dans tools.ts : un terme survolé dans un cours doit toujours être retrouvable dans la page Glossaire.
  const dictionaries: Record<string, { term: string; englishTerm?: string }[]> = {
    programmation: Object.values(programmingDefinitions),
    "visualisation de données": Object.values(datavizDefinitions),
    statistiques: Object.values(statisticsDefinitions),
    "traitement des données": Object.values(dataProcessingDefinitions),
    "préparation des données": Object.values(dataPreparationEnhancedDefinitions as unknown as { term: string }[]),
  };

  it("le test lit bien les dictionnaires (garde-fou contre un balayage vide)", () => {
    expect(Object.values(dictionaries).flat().length).toBeGreaterThan(60);
  });

  it.each(Object.keys(dictionaries))("chaque terme survolé dans les cours (%s) est retrouvable dans le glossaire", (name) => {
    const absents = dictionaries[name].filter((entry) => !termKeys(entry.term, entry.englishTerm).some((key) => known.has(key))).map((entry) => entry.term);
    expect(absents).toEqual([]);
  });

  it("aucun terme n'apparaît deux fois dans le glossaire (même nom ou même alias)", () => {
    const seen = new Map<string, string>();
    const doublons: string[] = [];
    for (const entry of glossaryTerms) {
      const main = normalizeTerm(entry.term);
      if (seen.has(main)) doublons.push(`${seen.get(main)} / ${entry.term}`);
      else seen.set(main, entry.term);
    }
    expect(doublons).toEqual([]);
  });

  it("les termes ajoutés depuis les dictionnaires ont une vraie définition et une catégorie connue", () => {
    const categories = new Set(["fondamentaux", "statistiques", "machine-learning", "deep-learning", "nlp", "computer-vision", "preprocessing", "evaluation", "mlops", "data-engineering"]);
    for (const entry of glossaryTerms) {
      expect(entry.description.trim().length, entry.term).toBeGreaterThan(40);
      expect(categories.has(entry.category), `${entry.term} : catégorie ${entry.category}`).toBe(true);
    }
  });
});
