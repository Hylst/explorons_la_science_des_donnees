import { describe, expect, it } from "vitest";
import { glossaryTerms } from "./index";
import { termKeys } from "./from-definition";

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

/**
 * Ton du site : sobre, jamais publicitaire. Le glossaire a été réécrit dans ce sens le 8 octobre 2026
 * (il comptait des centaines d'émojis et des « révolutionne », « magie ») ; ce test l'empêche de revenir.
 */
describe("glossaire : ton sobre", () => {
  const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

  it("ne contient ni émoji ni tiret cadratin", () => {
    const hits = glossaryTerms.filter((t) => EMOJI.test(text(t)) || text(t).includes("—")).map((t) => t.term);
    expect(hits).toEqual([]);
  });

  it("ne contient pas de formules publicitaires", () => {
    const hits = glossaryTerms.filter((t) => /révolution|magie|magique|démocratis|incroyable|ultime|game.?changer/i.test(text(t))).map((t) => t.term);
    expect(hits).toEqual([]);
  });

  // Régression du 8 octobre 2026 : « Cross-Validation » et « Validation croisée (Cross-Validation) », « AutoML » et
  // « Automated Machine Learning (AutoML) » s'affichaient deux fois. On compare aussi les noms entre parenthèses et anglais.
  it("ne contient pas deux fois la même notion", () => {
    const vus = new Map<string, string>();
    const doublons: string[] = [];
    for (const t of glossaryTerms) {
      for (const cle of termKeys(t.term, t.englishTerm)) {
        const deja = vus.get(cle);
        if (deja && deja !== t.term) doublons.push(`${deja} / ${t.term}`);
        vus.set(cle, t.term);
      }
    }
    expect([...new Set(doublons)]).toEqual([]);
  });
});
