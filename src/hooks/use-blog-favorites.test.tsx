import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanupHooks, renderHook } from "./render-hook";

const KEY = "blog-favorites-v1";

const loadModule = async () => {
  vi.resetModules();
  return import("./use-blog-favorites");
};

beforeEach(() => localStorage.clear());
afterEach(() => {
  cleanupHooks();
  localStorage.clear();
});

describe("useBlogFavorites", () => {
  it("ajoute puis retire un favori, et l'enregistre dans le navigateur", async () => {
    const { useBlogFavorites } = await loadModule();
    const h = renderHook(() => useBlogFavorites());
    expect(h.current.favorites).toEqual([]);
    act(() => h.current.toggleFavorite("article-a"));
    act(() => h.current.toggleFavorite("article-b"));
    expect(h.current.isFavorite("article-a")).toBe(true);
    expect(JSON.parse(localStorage.getItem(KEY) ?? "null")).toEqual(["article-a", "article-b"]);
    act(() => h.current.toggleFavorite("article-a"));
    expect(h.current.isFavorite("article-a")).toBe(false);
    expect(h.current.favorites).toEqual(["article-b"]);
    expect(JSON.parse(localStorage.getItem(KEY) ?? "null")).toEqual(["article-b"]);
  });

  it("partage les favoris entre la liste et la page d'un article", async () => {
    const { useBlogFavorites } = await loadModule();
    const liste = renderHook(() => useBlogFavorites());
    const article = renderHook(() => useBlogFavorites());
    act(() => article.current.toggleFavorite("article-a"));
    expect(liste.current.isFavorite("article-a")).toBe(true);
  });

  it("reprend les favoris enregistrés et ignore une valeur d'un autre format", async () => {
    localStorage.setItem(KEY, JSON.stringify(["article-c"]));
    let mod = await loadModule();
    expect(renderHook(() => mod.useBlogFavorites()).current.favorites).toEqual(["article-c"]);
    cleanupHooks();
    localStorage.setItem(KEY, JSON.stringify([1, 2]));
    mod = await loadModule();
    expect(renderHook(() => mod.useBlogFavorites()).current.favorites).toEqual([]);
  });

  it("relit les favoris modifiés dans un autre onglet", async () => {
    const { useBlogFavorites } = await loadModule();
    const h = renderHook(() => useBlogFavorites());
    localStorage.setItem(KEY, JSON.stringify(["article-d"]));
    act(() => {
      window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
    });
    expect(h.current.favorites).toEqual(["article-d"]);
  });
});
