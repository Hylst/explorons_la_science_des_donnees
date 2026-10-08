import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { glossaryTerms } from "@/data/glossary";
import { countWords, previewMarkdown, splitSections } from "@/lib/glossary-markdown";
import GlossaryCard from "./GlossaryCard";
import { GlossaryMarkdown } from "./GlossaryText";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const render = (text: string) => act(() => root.render(createElement(GlossaryMarkdown, { text })));
/** Nombre de blocs de code fermés dans la source */
const fencedBlocks = (text: string) => Math.floor((text.match(/^\s*```/gm) ?? []).length / 2);

describe("carte du glossaire", () => {
  it("chaque catégorie affiche un nom lisible (pas l'identifiant brut) dans son badge", () => {
    const categories = [...new Set(glossaryTerms.map((term) => term.category))];
    expect(categories.length).toBeGreaterThanOrEqual(7);
    for (const category of categories) {
      const term = glossaryTerms.find((t) => t.category === category)!;
      act(() => root.render(createElement(GlossaryCard, { entry: term, index: 0 })));
      const badge = container.querySelector("[class*='rounded-full']");
      const texte = (badge?.textContent ?? "").trim();
      expect(texte, `catégorie ${category}`).not.toBe(category);
      expect(texte[0], `catégorie ${category}`).toBe(texte[0]?.toUpperCase());
    }
  });
});

describe("rendu des définitions du glossaire", () => {
  it("le test lit bien toutes les définitions (garde-fou contre un balayage vide)", () => {
    expect(glossaryTerms.length).toBeGreaterThan(150);
    expect(glossaryTerms.filter((term) => term.description.includes("```")).length).toBeGreaterThan(15);
  });

  it("chaque définition est rendue sans reste de syntaxe : ni ```, ni puce « • », ni titre de page, ni numéro isolé", () => {
    const problemes: string[] = [];
    for (const term of glossaryTerms) {
      render(term.description);
      const where = term.term;
      if (container.querySelector("h1, h2, h3")) problemes.push(`${where} : titre h1 à h3 dans la définition`);
      const text = container.textContent ?? "";
      if (text.includes("```")) problemes.push(`${where} : « \`\`\` » visible`);
      if (text.includes("•")) problemes.push(`${where} : puce « • » visible`);
      // hors blocs de code, où ** est l'opérateur de puissance de Python
      const clone = container.cloneNode(true) as HTMLElement;
      clone.querySelectorAll("pre").forEach((pre) => pre.remove());
      if (/\*\*[^*\s][^*]*\*\*/.test(clone.textContent ?? "")) problemes.push(`${where} : **gras** non interprété`);
      const blocs = container.querySelectorAll("pre").length;
      if (blocs !== fencedBlocks(term.description)) problemes.push(`${where} : ${blocs} bloc(s) de code rendu(s) pour ${fencedBlocks(term.description)}`);
      for (const p of container.querySelectorAll("p")) {
        if (/^\d+[.)]$/.test((p.textContent ?? "").trim())) problemes.push(`${where} : numéro de liste seul sur sa ligne`);
      }
      for (const li of container.querySelectorAll("li")) {
        if ((li.textContent ?? "").trim().length < 3) problemes.push(`${where} : élément de liste vide`);
      }
    }
    expect(problemes).toEqual([]);
  });

  it("les listes écrites avec des puces ou des numéros deviennent de vraies listes", () => {
    // AUC : puces « • » ; BERT : liste numérotée « 1. »
    const avecPuces = glossaryTerms.find((term) => term.term.startsWith("AUC"));
    const numerotee = glossaryTerms.find((term) => term.term.startsWith("BERT"));
    expect(avecPuces && numerotee).toBeTruthy();
    render(avecPuces!.description);
    expect(container.querySelectorAll("ul > li").length).toBeGreaterThan(2);
    render(numerotee!.description);
    expect(container.querySelectorAll("ol > li").length).toBeGreaterThan(2);
  });

  it("l'aperçu de chaque définition ne coupe aucun bloc de code et garde un début lisible", () => {
    for (const term of glossaryTerms) {
      const preview = previewMarkdown(term.description, 100);
      expect(((preview.text.match(/^\s*```/gm) ?? []).length) % 2, `${term.term} : bloc de code coupé dans l'aperçu`).toBe(0);
      expect(preview.text.trim().length, term.term).toBeGreaterThan(0);
      if (preview.truncated) expect(countWords(preview.text), `${term.term} : aperçu trop long`).toBeLessThan(260);
    }
  });

  it("les définitions de plus de 500 mots se découpent en sections qui gardent le texte", () => {
    // Depuis la réécriture sobre du 8 octobre 2026, aucune définition réelle ne dépasse 500 mots : texte construit pour le test
    const paragraphe = "Un modèle apprend des exemples, puis on vérifie sur des données qu'il n'a pas vues. ".repeat(12);
    const longue = ["Définition de départ.", "**Principe :**", paragraphe, "**Exemple :**", paragraphe, "- premier point", "- second point", "**Limites :**", paragraphe, "**En pratique :**", paragraphe, "**Pièges :**", paragraphe].join("\n");
    const longues = [{ term: "Texte de test", description: longue }];
    expect(countWords(longue)).toBeGreaterThan(500);
    for (const term of longues) {
      const sections = splitSections(term.description);
      expect(sections.length, `${term.term} : aucune section`).toBeGreaterThanOrEqual(3);
      const mots = sections.reduce((n, s) => n + countWords(s.content), 0);
      expect(mots, `${term.term} : texte perdu dans le découpage`).toBeGreaterThan(countWords(term.description) * 0.85);
    }
  });
});
