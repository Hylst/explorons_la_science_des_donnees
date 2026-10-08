// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { runPythonNode } from "@/lib/lessons/python-node";
import {
  HOPITAL_INDICATEURS,
  HOPITAL_INDICATEURS_PREAMBULE,
  HOPITAL_MESURER,
  HOPITAL_NETTOYER,
  HOPITAL_NETTOYER_PREAMBULE,
  MONITORING_SIMULATION,
  VALIDATION_RAPPORT,
} from "./data-quality-demos";

/**
 * Les exemples de la page « Préparation des données » calculent leurs chiffres avec le moteur du site (Pyodide, pandas 3,
 * sans réseau). Chaque nombre cité dans une légende ou un texte de la page est vérifié ici : si le code change et que le
 * résultat bouge, ce test échoue et la légende doit être corrigée.
 */

/** Exécute comme le fait RunnableCode : le préambule (non affiché) puis le code de l'exemple */
const executer = async (code: string, preambule?: string) => {
  const resultat = await runPythonNode(preambule ? `${preambule}\n${code}` : code);
  expect(resultat.error, resultat.error).toBeUndefined();
  return resultat.output;
};

const TEMPS_MAX = 120_000;

describe("cas pratique hospitalier (données inventées)", () => {
  it("exemple 1 : mesure les défauts du tableau brut", async () => {
    const sortie = await executer(HOPITAL_MESURER);
    expect(sortie).toContain("Lignes : 14");
    expect(sortie).toContain("Doublons exacts : 0");
    expect(sortie).toContain("Formats de date différents : 3");
    expect(sortie).toContain("Dates illisibles : 1");
    expect(sortie).toContain("Âges hors de 0 à 120 ans : 1");
    expect(sortie).toContain("Coûts négatifs : 1");
    expect(sortie).toContain("Coûts non numériques : 1");
    expect(sortie).toContain("Diagnostics à normaliser : 3");
  }, TEMPS_MAX);

  it("exemple 2 : nettoie, retire les doublons cachés par les variantes de noms et compare la complétude", async () => {
    const sortie = await executer(HOPITAL_NETTOYER, HOPITAL_NETTOYER_PREAMBULE);
    expect(sortie).toContain("Doublons repérés une fois noms et diagnostics normalisés : 2");
    expect(sortie).toContain("Lignes conservées : 12 sur 14");
    // La complétude de l'âge baisse : un âge impossible devient une valeur manquante
    expect(sortie).toMatch(/age\s+92\.9\s+83\.3/);
    // Les dates ISO sont lues comme telles (le 1er mars, pas le 3 janvier)
    expect(sortie).toContain("2024-03-01");
    expect(sortie).not.toContain("2024-01-03");
  }, TEMPS_MAX);

  it("exemple 3 : les doublons changent le taux de réadmission et la durée moyenne", async () => {
    const sortie = await executer(HOPITAL_INDICATEURS, HOPITAL_INDICATEURS_PREAMBULE);
    expect(sortie).toMatch(/séjours\s+13\s+11/);
    expect(sortie).toMatch(/réadmissions sous 30 jours\s+2\s+2/);
    expect(sortie).toMatch(/taux de réadmission \(%\)\s+15\.4\s+18\.2/);
    expect(sortie).toMatch(/durée moyenne \(jours\)\s+3\.6\s+3\.4/);
  }, TEMPS_MAX);

  it("le piège cité dans la page existe : format='mixed' avec dayfirst=True lit une date ISO à l'envers", async () => {
    const sortie = await executer(
      [
        "import pandas as pd",
        "iso = pd.Series(['2024-03-01'])",
        "print(pd.to_datetime(iso, format='mixed', dayfirst=True)[0].date())",
      ].join("\n"),
    );
    // Si pandas corrige ce comportement, la remarque de la page (et le commentaire de lire_dates) doivent être retirés
    expect(sortie).toContain("2024-01-03");
  }, TEMPS_MAX);
});

describe("rapport de validation (commandes inventées)", () => {
  it("calcule les violations de chaque règle, les taux et les statuts", async () => {
    const sortie = await executer(VALIDATION_RAPPORT);
    expect(sortie).toContain("20 commandes inventées, 7 règles");
    expect(sortie).toMatch(/Âge entre 0 et 120 ans\s+1\s+95\.0\s+avertissement/);
    expect(sortie).toMatch(/Livraison le jour de la commande ou après\s+3\s+85\.0\s+erreur/);
    expect(sortie).toMatch(/Code produit présent au catalogue\s+0\s+100\.0\s+ok/);
    expect(sortie).toContain("Violations au total : 12");
    expect(sortie).toContain("Lignes avec au moins une violation : 11 sur 20");
    expect(sortie).toContain("Identifiant unique : C010, C010");
  }, TEMPS_MAX);
});

describe("simulation de monitoring (graine fixe)", () => {
  it("calcule les indicateurs de la semaine et déclenche les trois alertes attendues", async () => {
    const sortie = await executer(MONITORING_SIMULATION);
    expect(sortie).toContain("SIMULATION : 7 exécutions quotidiennes");
    expect(sortie).toContain("Lignes reçues : 64721");
    expect(sortie).toContain("Lignes rejetées : 1633");
    expect(sortie).toContain("Taux de rejet global : 2.52 %");
    expect(sortie).toContain("Alertes déclenchées : 3 sur 21 contrôles");
    expect(sortie).toContain("- 2024-03-07 : 5655 lignes reçues, moins de 70 % du volume médian");
    expect(sortie).toContain("- 2024-03-09 : taux de rejet de 9.0 %");
    expect(sortie).toContain("- 2024-03-09 : durée de 23.0 min");
    // Le jeudi du volume réduit n'a pas de taux de rejet anormal : seule l'alerte de volume le voit (légende de la page)
    expect(sortie).toMatch(/2024-03-07\s+5655\s+60\s+5\.4\s+1\.1\s+False\s+True\s+False/);
  }, TEMPS_MAX);

  it("est reproductible : deux exécutions donnent exactement le même résultat", async () => {
    const premiere = await executer(MONITORING_SIMULATION);
    const seconde = await executer(MONITORING_SIMULATION);
    expect(seconde).toBe(premiere);
  }, TEMPS_MAX);
});

describe("pages : aucun résultat écrit à la main", () => {
  const dossier = path.resolve(__dirname, "../components/fundamentals/data-preparation");
  const lire = (nom: string) => fs.readFileSync(path.join(dossier, nom), "utf8");

  it("le cas pratique n'affiche plus de résultat métier inventé", () => {
    const source = lire("EnhancedDataQualitySection.tsx");
    for (const interdit of ["12.3%", "2,847", "AUC = 0.84", "1.2M€", "450%", "340 réadmissions", "+23%", "97% de complétude", "60% nettoyage", "15,000", "45,000", "12,000"]) {
      expect(source, interdit).not.toContain(interdit);
    }
  });

  it("le rapport de validation et le monitoring ne sont plus des chiffres typés à la main", () => {
    const validation = lire("ValidationSection.tsx");
    expect(validation).not.toContain("overallScore");
    expect(validation).not.toContain("aucune donnée n'est analysée");
    const automatisation = lire("AutomationSection.tsx");
    expect(automatisation).not.toContain("startMonitoring");
    expect(automatisation).not.toContain("1.2M records/hour");
    expect(automatisation).not.toContain("aucune mesure réelle");
  });

  it("chaque page utilise bien ses exemples exécutables", () => {
    expect(lire("EnhancedDataQualitySection.tsx")).toContain("HOPITAL_NETTOYER");
    expect(lire("ValidationSection.tsx")).toContain("VALIDATION_RAPPORT");
    expect(lire("AutomationSection.tsx")).toContain("MONITORING_SIMULATION");
  });
});
