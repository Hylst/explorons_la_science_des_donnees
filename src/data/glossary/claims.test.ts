import { describe, expect, it } from "vitest";
import { glossaryTerms } from "./index";

/**
 * Le glossaire est du texte pédagogique : il ne doit pas attribuer de chiffres inventés à des organisations réelles
 * (étude, cabinet, entreprise). Les chiffres sourcés vont dans docs/SOURCES.md et un SourceNote, ou portent leur référence.
 */
const text = (term: (typeof glossaryTerms)[number]) => [term.description, term.shortDefinition, term.longDefinition, ...(term.examples ?? [])].filter(Boolean).join("\n");

describe("glossaire : pas de chiffre inventé attribué à une organisation", () => {
  it("n'a aucune attribution à un cabinet d'étude (« Selon Gartner... »)", () => {
    const hits = glossaryTerms.filter((t) => /selon (gartner|mckinsey|forrester|idc|deloitte|bcg|accenture)/i.test(text(t))).map((t) => t.term);
    expect(hits).toEqual([]);
  });

  it("n'a aucun taux d'adoption inventé (« Adopté par 70 % des entreprises Fortune 500 »)", () => {
    const hits = glossaryTerms.filter((t) => /(adopt|utilis)[ée]e?s? par \d+ ?%|fortune \d{3,4}/i.test(text(t))).map((t) => t.term);
    expect(hits).toEqual([]);
  });

  it("n'attribue pas de gain chiffré à une entreprise nommée, sauf s'il porte sa référence", () => {
    const company = /(netflix|uber|amazon|spotify|airbnb|google|meta|facebook|tesla|openai|microsoft)[^.\n]{0,120}\d[\d.,]*\s?(%|x\b|m\$|milliards?|millions?)/i;
    const hits = glossaryTerms.filter((t) => company.test(text(t)) && !/\(gomez-uribe et hunt, 2015\)|\(brown et al\.|\(radford et al\.|\(sanh et al\./i.test(text(t))).map((t) => t.term);
    expect(hits).toEqual([]);
  });

  it("n'annonce pas de ROI ou de gain en pourcentage sous forme de puce d'impact", () => {
    const hits = glossaryTerms.filter((t) => /^\s*- \*\*[^*]+\*\* :\s*[+\-−]\d+ ?%/m.test(text(t))).map((t) => t.term);
    expect(hits).toEqual([]);
  });
});
