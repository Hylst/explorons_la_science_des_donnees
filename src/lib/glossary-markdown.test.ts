import { describe, expect, it } from "vitest";
import {
  countWords,
  normalizeGlossaryMarkdown,
  previewMarkdown,
  splitBlocks,
  splitFences,
  splitSections,
} from "./glossary-markdown";

const CODE = "```python\nimport numpy as np\n\n# Un commentaire qui ne doit jamais devenir un titre\nx = np.arange(3)\n```";

describe("splitFences", () => {
  it("sépare le texte et les blocs de code, lignes ``` comprises", () => {
    const parts = splitFences(`Avant\n${CODE}\nAprès`);
    expect(parts.map((p) => p.code)).toEqual([false, true, false]);
    expect(parts[1].text.startsWith("```python")).toBe(true);
    expect(parts[1].text.endsWith("```")).toBe(true);
  });

  it("un bloc non fermé court jusqu'à la fin (comme en markdown)", () => {
    const parts = splitFences("Avant\n```\ncode sans fin\nencore du code");
    expect(parts.map((p) => p.code)).toEqual([false, true]);
    expect(parts[1].text).toContain("encore du code");
  });
});

describe("normalizeGlossaryMarkdown", () => {
  it("transforme les puces « • » en puces markdown", () => {
    const out = normalizeGlossaryMarkdown("**Échelle :**\n• **0.9** : excellent\n• **0.8** : très bon");
    expect(out).toContain("- **0.9** : excellent");
    expect(out).toContain("- **0.8** : très bon");
    expect(out).not.toContain("•");
  });

  it("met une ligne vide autour d'un titre en gras et avant une liste, pour que chaque élément ait sa place", () => {
    const out = normalizeGlossaryMarkdown("Intro\n**Titre :**\nTexte du titre\n**Autre :**\n- un\n- deux");
    expect(out).toBe("Intro\n\n**Titre :**\n\nTexte du titre\n\n**Autre :**\n\n- un\n- deux");
  });

  it("ne modifie jamais le contenu d'un bloc de code (commentaires, « • », lignes vides)", () => {
    const risque = "```\n# titre apparent\n• puce apparente\n**gras apparent**\n\n\n\nfin\n```";
    const out = normalizeGlossaryMarkdown(`Avant\n${risque}\nAprès`);
    expect(out).toContain(risque);
  });

  it("sépare en paragraphes les étiquettes en gras d'une définition écrite sur une seule ligne", () => {
    const out = normalizeGlossaryMarkdown("Le clustering regroupe. **Objectif :** partitionner (K-means). **Analogie :** trier une bibliothèque.");
    expect(out).toBe("Le clustering regroupe.\n\n**Objectif :** partitionner (K-means).\n\n**Analogie :** trier une bibliothèque.");
  });

  it("sépare aussi les étiquettes écrites « **Libellé** : » (deux-points hors du gras), mais pas les numéros « 1) » ni les puces", () => {
    expect(normalizeGlossaryMarkdown("K-Means regroupe. **Principe** : partitionner. **Analogie** : une ville.")).toBe(
      "K-Means regroupe.\n\n**Principe** : partitionner.\n\n**Analogie** : une ville.",
    );
    const inline = "Étapes : 1) **Initialisation** : choisir k centres. 2) **Assignation** : rattacher chaque point.";
    expect(normalizeGlossaryMarkdown(inline)).toBe(inline);
    const puce = "- **Simple** : une perspective. **Multi-têtes** : plusieurs perspectives.";
    expect(normalizeGlossaryMarkdown(puce)).toBe(puce);
  });

  it("ne sépare pas un gras qui n'est pas une étiquette, ni ce qui est dans un bloc de code", () => {
    expect(normalizeGlossaryMarkdown("Une phrase. **Important** à retenir.")).toBe("Une phrase. **Important** à retenir.");
    const code = "```\nx = 1. **Libellé :** y\n```";
    expect(normalizeGlossaryMarkdown(code)).toBe(code);
  });

  it("est stable : normaliser deux fois donne le même texte", () => {
    const once = normalizeGlossaryMarkdown(`**A :**\n• un\n• deux\n${CODE}\n**B :**\ntexte`);
    expect(normalizeGlossaryMarkdown(once)).toBe(once);
  });
});

describe("splitBlocks et previewMarkdown", () => {
  const long = (n: number) => Array.from({ length: n }, (_, i) => `mot${i}`).join(" ");

  it("un bloc de code reste un seul bloc, lignes vides comprises", () => {
    const blocks = splitBlocks(normalizeGlossaryMarkdown(`Avant\n\n${CODE}\n\nAprès`));
    expect(blocks).toEqual(["Avant", CODE, "Après"]);
  });

  it("ne coupe pas un texte court", () => {
    const preview = previewMarkdown("Un texte court.", 100);
    expect(preview.truncated).toBe(false);
    expect(preview.text).toBe("Un texte court.");
  });

  it("garde des blocs entiers : une liste n'est jamais coupée au milieu", () => {
    const items = Array.from({ length: 12 }, (_, i) => `- élément ${i} ${long(8)}`).join("\n");
    const preview = previewMarkdown(`${long(60)}\n\n${items}\n\n${long(200)}`, 100);
    expect(preview.truncated).toBe(true);
    const kept = preview.text.split("\n").filter((line) => line.startsWith("- "));
    expect([0, 12]).toContain(kept.length);
  });

  it("ne coupe jamais un bloc de code", () => {
    const preview = previewMarkdown(`${long(90)}\n\n${CODE}\n\n${long(300)}`, 100);
    const fences = (preview.text.match(/```/g) ?? []).length;
    expect(fences % 2).toBe(0);
  });

  it("ne finit pas sur un titre sans son contenu", () => {
    const preview = previewMarkdown(`${long(95)}\n\n**Un titre :**\n\n${long(200)}`, 100);
    expect(preview.truncated).toBe(true);
    expect(preview.text.trimEnd().endsWith("**Un titre :**")).toBe(false);
  });

  it("un premier paragraphe très long est coupé à la fin d'une phrase", () => {
    const phrase = (i: number) => `Phrase numéro ${i} avec ${long(9)}.`;
    const text = Array.from({ length: 40 }, (_, i) => phrase(i)).join(" ");
    const preview = previewMarkdown(text, 50);
    expect(preview.truncated).toBe(true);
    expect(preview.text.endsWith(".")).toBe(true);
    expect(countWords(preview.text)).toBeLessThan(90);
  });
});

describe("splitSections", () => {
  const body = (n: number) => Array.from({ length: n }, (_, i) => `mot${i}`).join(" ");

  it("fait une section par titre en gras, avec une introduction", () => {
    const sections = splitSections(`${body(20)}\n\n**🎨 Analogie :**\n${body(30)}\n\n**Étapes :**\n- un\n- deux\n\n**Limites :**\n${body(10)}`);
    expect(sections.map((s) => s.title)).toEqual(["Introduction", "🎨 Analogie", "Étapes", "Limites"]);
    expect(sections[2].content).toContain("- un");
  });

  it("reporte un titre sans contenu en tête de la section suivante", () => {
    const sections = splitSections(`${body(20)}\n\n**Deux approches :**\n\n**Agglomératif :**\n${body(20)}\n\n**Divisif :**\n${body(20)}`);
    expect(sections.map((s) => s.title)).toEqual(["Introduction", "Agglomératif", "Divisif"]);
    expect(sections[1].content.startsWith("**Deux approches :**")).toBe(true);
  });

  it("ne confond pas un commentaire de code avec un titre, et renvoie [] s'il y a trop peu de sections", () => {
    expect(splitSections(`${body(30)}\n\n${CODE}\n\n${body(30)}`)).toEqual([]);
  });
});
