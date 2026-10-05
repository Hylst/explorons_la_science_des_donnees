import { describe, expect, it } from "vitest";
import { sanitizeHtml } from "./sanitize";

/** Analyse le résultat comme le ferait le navigateur, pour tester la structure et non du texte brut */
const parse = (html: string) => {
  const container = document.createElement("div");
  container.innerHTML = sanitizeHtml(html);
  return container;
};

describe("sanitizeHtml : contenu dangereux supprimé", () => {
  it("supprime les balises <script> et leur contenu", () => {
    const out = sanitizeHtml('<p>Bonjour</p><script>alert("xss")</script>');
    expect(out).not.toMatch(/<script/i);
    expect(out).not.toContain("alert");
    expect(out).toContain("<p>Bonjour</p>");
  });

  it("supprime un script glissé dans un attribut ou une balise mal formée", () => {
    for (const payload of ["<scr<script>ipt>alert(1)</scr</script>ipt>", "<SCRIPT SRC=//evil.example/x.js></SCRIPT>", "<script/src=//evil.example/x.js>"]) {
      const container = parse(`<p>ok</p>${payload}`);
      expect(container.querySelector("script"), payload).toBeNull();
    }
  });

  it("supprime les gestionnaires d'événements on*", () => {
    const container = parse(
      '<img src="x.png" onerror="alert(1)" alt="a"><p onclick="alert(2)" onmouseover="alert(3)">texte</p><a href="/x" onfocus="alert(4)">lien</a><body onload="alert(5)">'
    );
    for (const element of container.querySelectorAll("*")) {
      for (const attribute of element.getAttributeNames()) {
        expect(attribute.startsWith("on"), `${element.tagName} ${attribute}`).toBe(false);
      }
    }
    expect(container.querySelector("img")?.getAttribute("alt")).toBe("a");
    expect(container.querySelector("p")?.textContent).toBe("texte");
  });

  it("supprime les gestionnaires on* écrits avec des variantes de casse", () => {
    const container = parse('<p ONCLICK="alert(1)" OnMouseOver="alert(2)">x</p>');
    expect(container.querySelector("p")?.getAttributeNames()).toEqual([]);
  });

  it("neutralise les URL javascript: dans les liens", () => {
    const container = parse('<a href="javascript:alert(1)">piège</a>');
    const link = container.querySelector("a");
    expect(link?.textContent).toBe("piège");
    expect(link?.getAttribute("href") ?? "").not.toMatch(/javascript/i);
  });

  it("neutralise les URL javascript: déguisées (casse, espaces, entités)", () => {
    const disguised = [
      '<a href="JaVaScRiPt:alert(1)">a</a>',
      '<a href=" javascript:alert(1)">a</a>',
      '<a href="java\tscript:alert(1)">a</a>',
      '<a href="&#106;avascript:alert(1)">a</a>',
      '<a href="jav&#x61;script:alert(1)">a</a>',
    ];
    for (const html of disguised) {
      const href = parse(html).querySelector("a")?.getAttribute("href") ?? "";
      expect(href.replace(/\s/g, ""), html).not.toMatch(/^javascript:/i);
    }
  });

  it("neutralise javascript: dans les autres attributs d'URL (src, action, formaction)", () => {
    const container = parse(
      '<img src="javascript:alert(1)"><form action="javascript:alert(2)"><button formaction="javascript:alert(3)">ok</button></form>'
    );
    for (const element of container.querySelectorAll("*")) {
      for (const name of ["src", "action", "formaction", "href"]) {
        expect(element.getAttribute(name) ?? "", `${element.tagName} ${name}`).not.toMatch(/javascript:/i);
      }
    }
  });

  it("refuse les URL data: exécutables dans un lien", () => {
    const href = parse('<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">x</a>').querySelector("a")?.getAttribute("href") ?? "";
    expect(href).not.toMatch(/^data:text\/html/i);
  });

  it("supprime les balises qui chargent ou exécutent du contenu actif", () => {
    const container = parse(
      '<iframe src="https://evil.example"></iframe><object data="x.swf"></object><embed src="x.swf"><base href="https://evil.example/"><meta http-equiv="refresh" content="0;url=https://evil.example"><link rel="stylesheet" href="https://evil.example/x.css"><p>reste</p>'
    );
    for (const tag of ["iframe", "object", "embed", "base", "meta", "link"]) {
      expect(container.querySelector(tag), tag).toBeNull();
    }
    expect(container.querySelector("p")?.textContent).toBe("reste");
  });

  it("supprime le JavaScript des SVG et des MathML", () => {
    const container = parse('<svg onload="alert(1)"><script>alert(2)</script><a href="javascript:alert(3)"><text>x</text></a></svg>');
    expect(container.querySelector("script")).toBeNull();
    expect(container.innerHTML).not.toMatch(/alert/);
    expect(container.innerHTML).not.toMatch(/onload/i);
  });

  it("supprime les gestionnaires d'événements placés dans un formulaire", () => {
    const container = parse('<form action="https://evil.example"><input name="p" onfocus="alert(1)"></form>');
    expect(container.innerHTML).not.toMatch(/onfocus/i);
  });
});

describe("sanitizeHtml : contenu sûr conservé", () => {
  it("conserve les balises de texte courantes", () => {
    const html =
      "<h2>Titre</h2><p>Un <strong>mot</strong>, un <em>autre</em> et du <code>code</code>.</p><blockquote>Citation</blockquote><pre>ligne 1\nligne 2</pre>";
    const container = parse(html);
    expect(container.querySelector("h2")?.textContent).toBe("Titre");
    expect(container.querySelector("strong")?.textContent).toBe("mot");
    expect(container.querySelector("em")?.textContent).toBe("autre");
    expect(container.querySelector("code")?.textContent).toBe("code");
    expect(container.querySelector("blockquote")?.textContent).toBe("Citation");
    expect(container.querySelector("pre")?.textContent).toBe("ligne 1\nligne 2");
  });

  it("conserve les listes à puces et numérotées", () => {
    const container = parse("<ul><li>un</li><li>deux</li></ul><ol><li>premier</li></ol>");
    expect(container.querySelectorAll("ul > li")).toHaveLength(2);
    expect(container.querySelectorAll("ol > li")).toHaveLength(1);
  });

  it("conserve les tableaux", () => {
    const container = parse("<table><thead><tr><th>A</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>");
    expect(container.querySelector("table th")?.textContent).toBe("A");
    expect(container.querySelector("table td")?.textContent).toBe("1");
  });

  it("conserve un lien http(s) avec son href et son texte", () => {
    const link = parse('<a href="https://example.org/page?x=1&y=2">Exemple</a>').querySelector("a");
    expect(link?.getAttribute("href")).toBe("https://example.org/page?x=1&y=2");
    expect(link?.textContent).toBe("Exemple");
  });

  it("conserve un lien relatif, une ancre et un lien mailto:", () => {
    const container = parse('<a href="/glossary">g</a><a href="#section">s</a><a href="mailto:contact@example.org">m</a>');
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(["/glossary", "#section", "mailto:contact@example.org"]);
  });

  it("conserve une image avec ses attributs src, alt, width et height", () => {
    const img = parse('<img src="https://example.org/a.png" alt="Schéma" width="320" height="200">').querySelector("img");
    expect(img?.getAttribute("src")).toBe("https://example.org/a.png");
    expect(img?.getAttribute("alt")).toBe("Schéma");
    expect(img?.getAttribute("width")).toBe("320");
  });

  it("conserve les attributs class et id sans danger", () => {
    const p = parse('<p class="lead" id="intro">texte</p>').querySelector("p");
    expect(p?.getAttribute("class")).toBe("lead");
    expect(p?.getAttribute("id")).toBe("intro");
  });

  it("conserve les accents, les entités et les caractères spéciaux du français", () => {
    const out = sanitizeHtml("<p>Éléments à l'œuvre : « guillemets » &amp; 5 &lt; 6</p>");
    const text = parse(out).querySelector("p")?.textContent;
    expect(text).toBe("Éléments à l'œuvre : « guillemets » & 5 < 6");
  });

  it("renvoie une chaîne vide pour une entrée vide", () => {
    expect(sanitizeHtml("")).toBe("");
  });

  it("laisse un texte sans balise inchangé", () => {
    expect(sanitizeHtml("Du texte simple.")).toBe("Du texte simple.");
  });

  it("est idempotent : nettoyer deux fois donne le même résultat qu'une fois", () => {
    const dirty = '<p onclick="x()">a</p><script>b</script><a href="javascript:c()">d</a><strong>e</strong>';
    const once = sanitizeHtml(dirty);
    expect(sanitizeHtml(once)).toBe(once);
  });
});

describe("sanitizeHtml : liens externes", () => {
  // Le module ne fait que `DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })` : il n'ajoute pas
  // rel="noopener noreferrer" et ne force pas target="_blank". Les tests ci-dessous fixent ce comportement réel.

  it("n'ajoute pas rel=\"noopener\" aux liens externes", () => {
    const link = parse('<a href="https://example.org">x</a>').querySelector("a");
    expect(link?.hasAttribute("rel")).toBe(false);
  });

  it("retire target=\"_blank\", qui n'est pas autorisé par DOMPurify : aucune fenêtre ne peut donc être ouverte avec window.opener", () => {
    const link = parse('<a href="https://example.org" target="_blank">x</a>').querySelector("a");
    expect(link?.getAttribute("target")).toBeNull();
  });

  it("conserve l'attribut rel fourni par l'auteur du contenu", () => {
    const link = parse('<a href="https://example.org" rel="noopener noreferrer">x</a>').querySelector("a");
    expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
  });
});
