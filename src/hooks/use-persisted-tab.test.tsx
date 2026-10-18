import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, cleanupHooks, renderHook } from "./render-hook";
import { usePersistedTab } from "./use-persisted-tab";

beforeEach(() => localStorage.clear());
afterEach(() => {
  cleanupHooks();
  localStorage.clear();
});

describe("usePersistedTab", () => {
  it("ouvre l'onglet par défaut lors d'une première visite", () => {
    const h = renderHook(() => usePersistedTab("onglet-test", "introduction"));
    expect(h.current[0]).toBe("introduction");
  });

  it("mémorise l'onglet choisi et le rouvre à la visite suivante", () => {
    const first = renderHook(() => usePersistedTab("onglet-test", "introduction"));
    act(() => first.current[1]("exercices"));
    expect(first.current[0]).toBe("exercices");
    expect(localStorage.getItem("onglet-test")).toBe("exercices");
    cleanupHooks();
    const next = renderHook(() => usePersistedTab("onglet-test", "introduction"));
    expect(next.current[0]).toBe("exercices");
  });

  it("garde un onglet par clé", () => {
    localStorage.setItem("onglet-a", "modeles");
    expect(renderHook(() => usePersistedTab("onglet-a", "introduction")).current[0]).toBe("modeles");
    expect(renderHook(() => usePersistedTab("onglet-b", "introduction")).current[0]).toBe("introduction");
  });
});
