import { describe, expect, it } from "vitest";
import {
  allCategories,
  allTechnologies,
  categoryLabel,
  CATEGORY_LABELS,
  DEFAULT_FILTERS,
  durationBucket,
  hoursOf,
  LEVEL_LABELS,
  LEVELS,
  levelSummary,
  matchesFilters,
  projects,
  type Project,
  type ProjectFilterState,
} from "./projects";

type Status = "todo" | "started" | "done";

const statusTodo = () => "todo" as Status;
const withFilters = (changes: Partial<ProjectFilterState>): ProjectFilterState => ({ ...DEFAULT_FILTERS, ...changes });
const select = (changes: Partial<ProjectFilterState>, statusOf: (id: string) => Status = statusTodo) =>
  projects.filter((p) => matchesFilters(p, withFilters(changes), statusOf));
const ids = (list: Project[]) => list.map((p) => p.id);

/** Projet minimal pour les cas qui ne dépendent pas des données du site */
const sample = (overrides: Partial<Project> = {}): Project => ({
  id: "test-1",
  title: "Prévision des ventes",
  description: "Estimer les ventes futures d'un magasin.",
  level: "beginner",
  technologies: ["Python", "Pandas"],
  category: "analyse",
  duration: "3-5 heures",
  difficulty: 2,
  ...overrides,
});

describe("données des projets", () => {
  it("propose exactement 12 projets", () => {
    expect(projects).toHaveLength(12);
  });

  it("donne un identifiant unique à chaque projet", () => {
    const all = projects.map((p) => p.id);
    expect(new Set(all).size).toBe(all.length);
  });

  it("donne un titre unique à chaque projet", () => {
    const titles = projects.map((p) => p.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it.each(projects.map((p) => [p.id, p] as const))("le projet %s a tous ses champs renseignés", (_id, p) => {
    expect(p.title.trim().length).toBeGreaterThan(5);
    expect(p.description.trim().length).toBeGreaterThan(40);
    expect(LEVELS).toContain(p.level);
    expect(p.technologies.length).toBeGreaterThanOrEqual(3);
    expect(p.technologies.every((t) => t.trim().length > 0)).toBe(true);
    expect(new Set(p.technologies).size).toBe(p.technologies.length);
    expect(Number.isInteger(p.difficulty)).toBe(true);
    expect(p.difficulty).toBeGreaterThanOrEqual(1);
    expect(p.difficulty).toBeLessThanOrEqual(5);
    expect(p.prerequisites?.length ?? 0).toBeGreaterThan(0);
    expect(p.learningObjectives?.length ?? 0).toBeGreaterThanOrEqual(3);
    expect([...(p.prerequisites ?? []), ...(p.learningObjectives ?? [])].every((s) => s.trim().length > 0)).toBe(true);
  });

  it.each(projects.map((p) => [p.id, p] as const))("la durée du projet %s est exploitable (« min-max heures », min < max)", (_id, p) => {
    expect(p.duration).toMatch(/^\d+-\d+ heures$/);
    const [min, max] = hoursOf(p);
    expect(min).toBeGreaterThan(0);
    expect(max).toBeGreaterThan(min);
  });

  it.each(projects.map((p) => [p.id, p] as const))("la catégorie du projet %s a un libellé lisible", (_id, p) => {
    expect(CATEGORY_LABELS[p.category]).toBeTruthy();
    expect(categoryLabel(p.category)).toBe(CATEGORY_LABELS[p.category]);
  });

  it("l'identifiant commence par le niveau du projet", () => {
    for (const p of projects) expect(p.id.startsWith(`${p.level}-`)).toBe(true);
  });

  it("chaque niveau a un libellé et au moins un projet", () => {
    for (const level of LEVELS) {
      expect(LEVEL_LABELS[level]).toBeTruthy();
      expect(projects.some((p) => p.level === level)).toBe(true);
    }
  });
});

describe("hoursOf et durationBucket", () => {
  it("extrait les bornes d'une durée « 3-5 heures »", () => {
    expect(hoursOf(sample({ duration: "3-5 heures" }))).toEqual([3, 5]);
    expect(hoursOf(sample({ duration: "30-35 heures" }))).toEqual([30, 35]);
    expect(hoursOf(sample({ duration: "12 - 15 h" }))).toEqual([12, 15]);
  });

  it("renvoie [0, 0] pour une durée illisible", () => {
    expect(hoursOf(sample({ duration: "environ une semaine" }))).toEqual([0, 0]);
    expect(hoursOf(sample({ duration: "" }))).toEqual([0, 0]);
  });

  it("range par durée minimale : court jusqu'à 4 h, moyen de 5 à 12 h, long à partir de 13 h", () => {
    const bucket = (min: number) => durationBucket(sample({ duration: `${min}-${min + 2} heures` }));
    expect(bucket(1)).toBe("short");
    expect(bucket(4)).toBe("short");
    expect(bucket(5)).toBe("medium");
    expect(bucket(12)).toBe("medium");
    expect(bucket(13)).toBe("long");
    expect(bucket(30)).toBe("long");
  });
});

describe("matchesFilters", () => {
  describe("sans filtre actif", () => {
    it("retient tous les projets", () => {
      expect(select({})).toHaveLength(projects.length);
    });
  });

  describe("niveau", () => {
    it.each([
      ["beginner", 4],
      ["intermediate", 5],
      ["advanced", 3],
    ] as const)("le niveau %s retient %i projets", (level, count) => {
      const result = select({ level });
      expect(result).toHaveLength(count);
      expect(result.every((p) => p.level === level)).toBe(true);
    });

    it("les trois niveaux couvrent tous les projets sans recouvrement", () => {
      const all = LEVELS.flatMap((level) => ids(select({ level })));
      expect(all.sort()).toEqual(ids(projects).sort());
    });
  });

  describe("catégorie", () => {
    it("retient les projets de la catégorie choisie", () => {
      const result = select({ category: "nlp" });
      expect(ids(result).sort()).toEqual(["advanced-2", "beginner-4"]);
    });

    it("renvoie une liste vide pour une catégorie sans projet", () => {
      expect(select({ category: "inconnue" })).toEqual([]);
    });
  });

  describe("durée", () => {
    it("range les projets du site dans les trois tranches annoncées", () => {
      const short = select({ duration: "short" });
      const medium = select({ duration: "medium" });
      const long = select({ duration: "long" });
      expect(short.length + medium.length + long.length).toBe(projects.length);
      expect(short.every((p) => hoursOf(p)[0] <= 4)).toBe(true);
      expect(medium.every((p) => hoursOf(p)[0] >= 5 && hoursOf(p)[0] <= 12)).toBe(true);
      expect(long.every((p) => hoursOf(p)[0] >= 13)).toBe(true);
    });

    it("« court » retient le projet de 3-5 heures, pas celui de 30-35 heures", () => {
      expect(ids(select({ duration: "short" }))).toContain("beginner-1");
      expect(ids(select({ duration: "short" }))).not.toContain("advanced-3");
      expect(ids(select({ duration: "long" }))).toContain("advanced-3");
    });
  });

  describe("technologies", () => {
    it("retient les projets qui utilisent la technologie cochée", () => {
      const result = select({ technologies: ["Docker"] });
      expect(ids(result).sort()).toEqual(["advanced-3", "intermediate-2"]);
    });

    it("avec plusieurs technologies, exige qu'elles soient toutes utilisées (ET, pas OU)", () => {
      expect(ids(select({ technologies: ["Docker", "XGBoost"] }))).toEqual(["intermediate-2"]);
      expect(select({ technologies: ["Docker", "Streamlit"] })).toEqual([]);
    });

    it("la comparaison de technologie respecte la casse exacte du libellé", () => {
      expect(select({ technologies: ["docker"] })).toEqual([]);
    });

    it("chaque technologie proposée par les filtres retient au moins un projet", () => {
      for (const tech of allTechnologies) {
        expect(select({ technologies: [tech] }).length, tech).toBeGreaterThan(0);
      }
    });
  });

  describe("recherche texte", () => {
    it("trouve un mot du titre sans tenir compte de la casse", () => {
      expect(ids(select({ query: "IRIS" }))).toEqual(["beginner-2"]);
      expect(ids(select({ query: "iris" }))).toEqual(["beginner-2"]);
    });

    it("ignore les accents dans la requête et dans les données", () => {
      // Le titre contient « Médicales » et « Détection » : la requête sans accent doit les trouver
      expect(ids(select({ query: "medicales" }))).toEqual(["advanced-1"]);
      expect(ids(select({ query: "detection de fraudes" }))).toEqual(["intermediate-3"]);
      // et l'inverse : requête accentuée, donnée sans accent
      expect(ids(select({ query: "Régression" }))).toContain("intermediate-2");
    });

    it("cherche dans la description", () => {
      expect(ids(select({ query: "filtrage collaboratif" }))).toEqual(["intermediate-1"]);
    });

    it("cherche dans les technologies", () => {
      expect(ids(select({ query: "kafka" }))).toEqual(["intermediate-3"]);
    });

    it("cherche dans les objectifs d'apprentissage", () => {
      expect(ids(select({ query: "DICOM" }))).toEqual(["advanced-1"]);
    });

    it("cherche dans le libellé de la catégorie", () => {
      // « Vision par ordinateur » est le libellé de la catégorie computer-vision, absent des autres champs
      expect(ids(select({ query: "vision par ordinateur" }))).toEqual(["advanced-1"]);
    });

    it("ignore les espaces autour de la requête", () => {
      expect(ids(select({ query: "   iris   " }))).toEqual(["beginner-2"]);
    });

    it("une requête vide ou faite d'espaces ne filtre rien", () => {
      expect(select({ query: "" })).toHaveLength(projects.length);
      expect(select({ query: "   " })).toHaveLength(projects.length);
    });

    it("renvoie une liste vide quand rien ne correspond", () => {
      expect(select({ query: "zzzz-introuvable" })).toEqual([]);
    });

    it("ne confond pas les caractères spéciaux d'une expression régulière avec des jokers", () => {
      expect(select({ query: ".*" })).toEqual([]);
      expect(select({ query: "[a-z]+" })).toEqual([]);
    });
  });

  describe("progression", () => {
    const statuses: Record<string, Status> = { "beginner-1": "done", "beginner-2": "started" };
    const statusOf = (id: string): Status => statuses[id] ?? "todo";

    it("retient les projets au statut demandé", () => {
      expect(ids(select({ progress: "done" }, statusOf))).toEqual(["beginner-1"]);
      expect(ids(select({ progress: "started" }, statusOf))).toEqual(["beginner-2"]);
      expect(select({ progress: "todo" }, statusOf)).toHaveLength(projects.length - 2);
    });
  });

  describe("combinaison de filtres", () => {
    it("un projet doit satisfaire tous les filtres actifs", () => {
      expect(ids(select({ level: "beginner", technologies: ["Pandas"] })).sort()).toEqual(["beginner-1", "beginner-3"]);
      expect(ids(select({ level: "beginner", technologies: ["scikit-learn"] })).sort()).toEqual(["beginner-2", "beginner-4"]);
      expect(ids(select({ level: "beginner", technologies: ["Pandas"], category: "visualisation" }))).toEqual(["beginner-3"]);
      expect(ids(select({ level: "beginner", technologies: ["Pandas"], category: "visualisation", query: "covid", duration: "medium" }))).toEqual(["beginner-3"]);
    });

    it("renvoie une liste vide quand les filtres se contredisent", () => {
      expect(select({ level: "advanced", category: "analyse" })).toEqual([]);
      expect(select({ level: "beginner", duration: "long" })).toEqual([]);
    });
  });

  describe("sur un projet isolé", () => {
    it("un projet sans objectifs d'apprentissage reste filtrable", () => {
      const p = sample({ learningObjectives: undefined });
      expect(matchesFilters(p, withFilters({ query: "ventes" }), statusTodo)).toBe(true);
      expect(matchesFilters(p, withFilters({ query: "absent" }), statusTodo)).toBe(false);
    });

    it("une catégorie inconnue est recherchée sous son identifiant", () => {
      const p = sample({ category: "robotique", title: "Titre", description: "Texte" });
      expect(matchesFilters(p, withFilters({ query: "robotique" }), statusTodo)).toBe(true);
    });
  });
});

describe("valeurs dérivées des données", () => {
  it("allTechnologies : valeurs distinctes, triées, toutes issues des projets", () => {
    expect(new Set(allTechnologies).size).toBe(allTechnologies.length);
    expect([...allTechnologies]).toEqual([...allTechnologies].sort((a, b) => a.localeCompare(b)));
    const used = new Set(projects.flatMap((p) => p.technologies));
    expect(allTechnologies.length).toBe(used.size);
    expect(allTechnologies.every((t) => used.has(t))).toBe(true);
  });

  it("allCategories : une entrée par catégorie utilisée, triée par libellé", () => {
    expect(new Set(allCategories).size).toBe(allCategories.length);
    expect(new Set(allCategories)).toEqual(new Set(projects.map((p) => p.category)));
    const labels = allCategories.map(categoryLabel);
    expect(labels).toEqual([...labels].sort((a, b) => a.localeCompare(b)));
  });

  it("levelSummary : nombre de projets et fourchette de durée calculés sur les données", () => {
    expect(levelSummary("beginner")).toEqual({ count: 4, minHours: 3, maxHours: 7 });
    expect(levelSummary("intermediate")).toEqual({ count: 5, minHours: 3, maxHours: 18 });
    expect(levelSummary("advanced")).toEqual({ count: 3, minHours: 20, maxHours: 35 });
  });

  it("levelSummary : la somme des effectifs est le nombre total de projets", () => {
    const total = LEVELS.reduce((sum, level) => sum + levelSummary(level).count, 0);
    expect(total).toBe(projects.length);
  });
});
