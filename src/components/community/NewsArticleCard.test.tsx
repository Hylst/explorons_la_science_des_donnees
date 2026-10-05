import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import NewsArticleCard from "./NewsArticleCard";
import type { NewsArticle } from "./rss";
import rssArticlesData from "@/data/rss-articles.json";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const LONG_URL = "https://www.example.org/" + "a-tres-long-segment-sans-espace/".repeat(6);

const article: NewsArticle = {
  ...(rssArticlesData.articles[0] as NewsArticle),
  title: `Titre avec ${LONG_URL}`,
  excerpt: `Un extrait qui cite une adresse (${LONG_URL}) sans aucun espace.`,
};

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(createElement(NewsArticleCard, { article })));
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const byText = (part: string) => [...container.querySelectorAll<HTMLElement>("h3, p")].find((el) => el.textContent?.includes(part));

describe("NewsArticleCard", () => {
  // Régression du 4 octobre 2026 : un extrait contenant une adresse légifrance sans espace élargissait /community
  // à 524 px sur un écran de 390 px. jsdom ne calcule pas la mise en page : on contrôle donc la classe qui l'évite.
  it("laisse les mots très longs (adresses) passer à la ligne dans le titre et l'extrait", () => {
    const title = byText("Titre avec");
    const excerpt = byText("Un extrait qui cite");
    expect(title, "titre introuvable").toBeDefined();
    expect(excerpt, "extrait introuvable").toBeDefined();
    expect(title?.className).toContain("break-words");
    expect(excerpt?.className).toContain("break-words");
  });

  it("ouvre l'article de la source dans un nouvel onglet, sans référent", () => {
    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toBe(article.url);
    expect(link?.getAttribute("target")).toBe("_blank");
    expect(link?.getAttribute("rel")).toContain("noopener");
  });
});
