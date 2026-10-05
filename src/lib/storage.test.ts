import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  isNumberArray,
  isStringArray,
  isStringRecord,
  readJSON,
  readStorage,
  removeStorage,
  storageKeys,
  writeJSON,
  writeStorage,
} from "./storage";

/** Simule un stockage bloqué (navigation privée, cookies refusés) : toute méthode de Storage lève une exception */
const blockStorage = () => {
  const error = () => {
    throw new DOMException("Accès au stockage refusé", "SecurityError");
  };
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(error);
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(error);
  vi.spyOn(Storage.prototype, "removeItem").mockImplementation(error);
  vi.spyOn(Storage.prototype, "key").mockImplementation(error);
};

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

describe("readStorage", () => {
  it("renvoie la valeur enregistrée", () => {
    localStorage.setItem("cle", "valeur");
    expect(readStorage("cle")).toBe("valeur");
  });

  it("renvoie null pour une clé absente", () => {
    expect(readStorage("absente")).toBeNull();
  });

  it("renvoie null sans lever d'exception quand le stockage est bloqué", () => {
    blockStorage();
    expect(() => readStorage("cle")).not.toThrow();
    expect(readStorage("cle")).toBeNull();
  });
});

describe("writeStorage", () => {
  it("écrit la valeur et la rend lisible", () => {
    writeStorage("cle", "valeur");
    expect(localStorage.getItem("cle")).toBe("valeur");
    expect(readStorage("cle")).toBe("valeur");
  });

  it("remplace une valeur existante", () => {
    writeStorage("cle", "ancienne");
    writeStorage("cle", "nouvelle");
    expect(readStorage("cle")).toBe("nouvelle");
  });

  it("ne lève pas d'exception quand le quota est dépassé et n'écrit rien", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Quota dépassé", "QuotaExceededError");
    });
    expect(() => writeStorage("cle", "x".repeat(10))).not.toThrow();
    expect(setItem).toHaveBeenCalledTimes(1);
    setItem.mockRestore();
    expect(localStorage.getItem("cle")).toBeNull();
  });

  it("ne lève pas d'exception quand le stockage est bloqué", () => {
    blockStorage();
    expect(() => writeStorage("cle", "valeur")).not.toThrow();
  });
});

describe("removeStorage", () => {
  it("supprime la clé", () => {
    localStorage.setItem("cle", "valeur");
    removeStorage("cle");
    expect(localStorage.getItem("cle")).toBeNull();
  });

  it("laisse les autres clés intactes", () => {
    localStorage.setItem("a", "1");
    localStorage.setItem("b", "2");
    removeStorage("a");
    expect(localStorage.getItem("b")).toBe("2");
  });

  it("ne lève pas d'exception quand le stockage est bloqué", () => {
    blockStorage();
    expect(() => removeStorage("cle")).not.toThrow();
  });
});

describe("storageKeys", () => {
  it("ne renvoie que les clés qui commencent par le préfixe", () => {
    localStorage.setItem("course-progress-python", "{}");
    localStorage.setItem("course-progress-sql", "{}");
    localStorage.setItem("quiz-attempts-v1", "[]");
    localStorage.setItem("mon-course-progress-x", "{}");
    expect(storageKeys("course-progress-").sort()).toEqual(["course-progress-python", "course-progress-sql"]);
  });

  it("renvoie une liste vide si aucune clé ne correspond", () => {
    localStorage.setItem("autre", "1");
    expect(storageKeys("course-progress-")).toEqual([]);
  });

  it("ne renvoie aucun doublon", () => {
    writeStorage("p-1", "a");
    writeStorage("p-1", "b");
    writeStorage("p-2", "c");
    const keys = storageKeys("p-");
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys).toHaveLength(2);
  });

  it("renvoie une liste vide, sans exception, quand le stockage est bloqué", () => {
    localStorage.setItem("p-1", "a");
    blockStorage();
    expect(() => storageKeys("p-")).not.toThrow();
    expect(storageKeys("p-")).toEqual([]);
  });
});

describe("readJSON et writeJSON", () => {
  it("font un aller-retour fidèle sur un objet imbriqué", () => {
    const value = { status: { m1: "done" }, notes: { m1: "à relire" }, liste: [1, 2, 3], vide: null };
    writeJSON("objet", value);
    expect(readJSON("objet", null)).toEqual(value);
  });

  it("font un aller-retour fidèle sur un tableau, un nombre et un booléen", () => {
    writeJSON("tableau", ["a", "b"]);
    writeJSON("nombre", 42);
    writeJSON("booleen", false);
    expect(readJSON<string[]>("tableau", [])).toEqual(["a", "b"]);
    expect(readJSON<number>("nombre", 0)).toBe(42);
    expect(readJSON<boolean>("booleen", true)).toBe(false);
  });

  it("enregistre bien du JSON dans le stockage", () => {
    writeJSON("cle", { a: 1 });
    expect(localStorage.getItem("cle")).toBe('{"a":1}');
  });

  it("renvoie la valeur par défaut pour une clé absente", () => {
    const fallback = { defaut: true };
    expect(readJSON("absente", fallback)).toBe(fallback);
  });

  it("renvoie la valeur par défaut, sans exception, pour un JSON invalide", () => {
    localStorage.setItem("corrompu", "{pas du json");
    expect(() => readJSON("corrompu", [])).not.toThrow();
    expect(readJSON("corrompu", ["défaut"])).toEqual(["défaut"]);
  });

  it("renvoie la valeur par défaut pour une valeur tronquée", () => {
    localStorage.setItem("tronque", '{"a":[1,2');
    expect(readJSON("tronque", "défaut")).toBe("défaut");
  });

  it("applique le validateur : une valeur du mauvais type donne la valeur par défaut", () => {
    writeJSON("liste", { pas: "un tableau" });
    expect(readJSON<string[]>("liste", [], isStringArray)).toEqual([]);
    writeJSON("liste", ["a", 2]);
    expect(readJSON<string[]>("liste", ["défaut"], isStringArray)).toEqual(["défaut"]);
  });

  it("applique le validateur : une valeur conforme est renvoyée telle quelle", () => {
    writeJSON("liste", ["a", "b"]);
    expect(readJSON<string[]>("liste", [], isStringArray)).toEqual(["a", "b"]);
  });

  it("renvoie la valeur par défaut, sans exception, quand le stockage est bloqué", () => {
    blockStorage();
    expect(() => readJSON("cle", 7)).not.toThrow();
    expect(readJSON("cle", 7)).toBe(7);
  });

  it("writeJSON ne lève pas d'exception quand le quota est dépassé", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Quota dépassé", "QuotaExceededError");
    });
    expect(() => writeJSON("gros", { donnees: "x".repeat(100) })).not.toThrow();
  });

  it("writeJSON ne lève pas d'exception quand le stockage est bloqué", () => {
    blockStorage();
    expect(() => writeJSON("cle", [1, 2, 3])).not.toThrow();
  });
});

describe("validateurs", () => {
  it("isStringArray accepte les tableaux de chaînes, vide compris", () => {
    expect(isStringArray([])).toBe(true);
    expect(isStringArray(["a", "b"])).toBe(true);
  });

  it("isStringArray refuse tout le reste", () => {
    expect(isStringArray(["a", 1])).toBe(false);
    expect(isStringArray([null])).toBe(false);
    expect(isStringArray("a")).toBe(false);
    expect(isStringArray({ 0: "a", length: 1 })).toBe(false);
    expect(isStringArray(null)).toBe(false);
    expect(isStringArray(undefined)).toBe(false);
  });

  it("isNumberArray accepte les nombres finis", () => {
    expect(isNumberArray([])).toBe(true);
    expect(isNumberArray([0, -1.5, 3])).toBe(true);
  });

  it("isNumberArray refuse NaN, Infinity, chaînes et non-tableaux", () => {
    expect(isNumberArray([1, Number.NaN])).toBe(false);
    expect(isNumberArray([Infinity])).toBe(false);
    expect(isNumberArray(["1"])).toBe(false);
    expect(isNumberArray(1)).toBe(false);
    expect(isNumberArray(null)).toBe(false);
  });

  it("isStringRecord accepte un objet dont toutes les valeurs sont des chaînes", () => {
    expect(isStringRecord({})).toBe(true);
    expect(isStringRecord({ a: "x", b: "y" })).toBe(true);
  });

  it("isStringRecord refuse null, les tableaux et les valeurs non textuelles", () => {
    expect(isStringRecord(null)).toBe(false);
    expect(isStringRecord(["a"])).toBe(false);
    expect(isStringRecord({ a: 1 })).toBe(false);
    expect(isStringRecord({ a: "x", b: null })).toBe(false);
    expect(isStringRecord("texte")).toBe(false);
  });
});

describe("clés de stockage du site", () => {
  /** Constantes `const XXX_KEY = '...'` déclarées dans le code source (hors tests) */
  const collectKeys = (): { name: string; value: string; file: string }[] => {
    const found: { name: string; value: string; file: string }[] = [];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.(ts|tsx)$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) {
          const source = fs.readFileSync(full, "utf8");
          for (const m of source.matchAll(/^\s*(?:export\s+)?const\s+([A-Z_]*KEY)\s*=\s*['"]([^'"]+)['"]/gm)) {
            found.push({ name: m[1], value: m[2], file: path.relative(process.cwd(), full) });
          }
        }
      }
    };
    walk(path.resolve(process.cwd(), "src"));
    return found;
  };

  it("repère les clés déclarées (garde-fou contre un balayage vide)", () => {
    expect(collectKeys().length).toBeGreaterThanOrEqual(8);
  });

  it("deux modules n'utilisent jamais la même clé pour des données différentes", () => {
    const byValue = new Map<string, string[]>();
    for (const { value, name, file } of collectKeys()) {
      byValue.set(value, [...(byValue.get(value) ?? []), `${file} (${name})`]);
    }
    const duplicates = [...byValue.entries()].filter(([, owners]) => owners.length > 1);
    expect(duplicates).toEqual([]);
  });
});
