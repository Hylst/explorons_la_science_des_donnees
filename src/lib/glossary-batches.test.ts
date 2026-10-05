import { beforeEach, describe, expect, it } from "vitest";
import { GLOSSARY_BATCH, initialVisibleCount, rememberVisibleCount } from "./glossary-batches";

describe("lots du glossaire", () => {
  beforeEach(() => sessionStorage.clear());

  it("une nouvelle visite commence au premier lot, même si la session a vu plus de fiches", () => {
    rememberVisibleCount(120);
    expect(initialVisibleCount(false)).toBe(GLOSSARY_BATCH);
  });

  it("un retour (précédent, rechargement) reprend le nombre de fiches mémorisé", () => {
    rememberVisibleCount(120);
    expect(initialVisibleCount(true)).toBe(120);
  });

  it("une valeur absente ou invalide revient au premier lot", () => {
    expect(initialVisibleCount(true)).toBe(GLOSSARY_BATCH);
    sessionStorage.setItem("glossary-visible-count", "n'importe quoi");
    expect(initialVisibleCount(true)).toBe(GLOSSARY_BATCH);
  });
});
