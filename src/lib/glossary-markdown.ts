/**
 * Mise en forme des définitions du glossaire.
 *
 * Les définitions sont écrites à la main dans un markdown léger : titres en gras sur leur propre ligne (« **Analogie :** »),
 * puces « • » ou « - », listes numérotées, blocs de code entre ```. Ces fonctions préparent ce texte pour react-markdown et
 * le découpent par blocs entiers : on ne coupe jamais au milieu d'une liste ou d'un bloc de code, et rien n'est réécrit
 * à l'intérieur du code.
 */

export interface TextSegment {
  code: boolean;
  text: string;
}

const FENCE = /^\s*```/;
/** Une ligne qui n'est qu'un titre en gras : « **🎨 Analogie Artistique :** » */
const BOLD_TITLE = /^\s*\*\*[^*\n]+\*\*\s*$/;
const LIST_ITEM = /^\s*(?:[-*+]|\d+[.)])\s+/;
/** Une étiquette en gras après une fin de phrase, avec les deux-points dedans ou dehors : « . **Objectif :** » ou « . **Objectif** : » */
const LABEL_AFTER_SENTENCE = /([.!?\u2026])[ \t]+(\*\*[^*\n]{2,60}?(?:[ \u00a0]?:\*\*|\*\*[ \u00a0]?:))/g;

/** Découpe le texte en segments de texte et en blocs de code (lignes ``` comprises). Un bloc non fermé court jusqu'à la fin. */
export const splitFences = (source: string): TextSegment[] => {
  const segments: TextSegment[] = [];
  let current: string[] = [];
  let inCode = false;
  const flush = () => {
    if (current.length) segments.push({ code: inCode, text: current.join("\n") });
    current = [];
  };
  for (const line of source.replace(/\r\n/g, "\n").split("\n")) {
    if (FENCE.test(line)) {
      if (!inCode) {
        flush();
        inCode = true;
        current.push(line);
      } else {
        current.push(line);
        flush();
        inCode = false;
      }
      continue;
    }
    current.push(line);
  }
  flush();
  return segments;
};

/**
 * Prépare un segment de texte : « • » devient une puce markdown, un titre en gras et le début d'une liste ont une ligne vide
 * avant eux, et ce qui suit un titre commence un nouveau paragraphe.
 */
const normalizeTextSegment = (text: string): string => {
  const out: string[] = [];
  // Une étiquette en gras qui suit une fin de phrase (« … données. **Objectif :** … » ou « … **Objectif** : … ») ouvre un nouveau
  // paragraphe. Les lignes de liste sont laissées telles quelles, et un numéro « 1) » devant l'étiquette empêche la coupure.
  const spaced = text
    .split("\n")
    .map((line) => (LIST_ITEM.test(line) ? line : line.replace(LABEL_AFTER_SENTENCE, "$1\n\n$2")))
    .join("\n");
  for (const raw of spaced.split("\n")) {
    const line = raw.replace(/^(\s*)•\s*/, "$1- ");
    const previous = out.length ? out[out.length - 1] : "";
    if (previous.trim() !== "" && line.trim() !== "") {
      const startsList = LIST_ITEM.test(line) && !LIST_ITEM.test(previous);
      if (BOLD_TITLE.test(line) || BOLD_TITLE.test(previous) || startsList) out.push("");
    }
    out.push(line);
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").replace(/^\n+|\n+$/g, "");
};

/** Texte prêt pour react-markdown. Le contenu des blocs de code n'est jamais modifié. */
export const normalizeGlossaryMarkdown = (source: string): string =>
  splitFences(source)
    .map((segment) => (segment.code ? segment.text : normalizeTextSegment(segment.text)))
    .filter((text) => text.trim() !== "")
    .join("\n\n")
    .trim();

export const countWords = (text: string): number => {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
};

/** Blocs séparés par une ligne vide (un bloc de code reste un seul bloc, lignes vides comprises). Texte déjà normalisé. */
export const splitBlocks = (normalized: string): string[] =>
  splitFences(normalized).flatMap((segment) =>
    segment.code ? [segment.text] : segment.text.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean),
  );

const isTitleBlock = (block: string): boolean => !block.includes("\n") && BOLD_TITLE.test(block);

export interface Preview {
  /** Texte à afficher (blocs entiers) */
  text: string;
  truncated: boolean;
  totalWords: number;
}

/**
 * Début de la définition, jusqu'à environ `wordLimit` mots, par blocs entiers : une liste, un bloc de code ou un paragraphe n'est
 * jamais coupé, et l'aperçu ne finit jamais sur un titre sans son contenu. Seul un premier paragraphe très long est coupé,
 * à la fin d'une phrase.
 */
export const previewMarkdown = (source: string, wordLimit: number): Preview => {
  const normalized = normalizeGlossaryMarkdown(source);
  const blocks = splitBlocks(normalized);
  const totalWords = countWords(normalized);
  if (totalWords <= wordLimit) return { text: normalized, truncated: false, totalWords };

  const kept: string[] = [];
  let words = 0;
  for (const block of blocks) {
    const size = countWords(block);
    if (kept.length > 0 && words + size > wordLimit * 1.5) break;
    kept.push(block);
    words += size;
    if (words >= wordLimit) break;
  }
  while (kept.length > 1 && isTitleBlock(kept[kept.length - 1])) kept.pop();

  if (kept.length === 1 && countWords(kept[0]) > wordLimit * 1.5 && !kept[0].startsWith("```") && !LIST_ITEM.test(kept[0])) {
    const sentences = kept[0].split(/(?<=[.!?])\s+/);
    let cut = "";
    for (const sentence of sentences) {
      if (cut && countWords(`${cut} ${sentence}`) > wordLimit) break;
      cut = cut ? `${cut} ${sentence}` : sentence;
    }
    kept[0] = cut;
  }
  const text = kept.join("\n\n");
  return { text, truncated: kept.length < blocks.length || text.length < normalized.length, totalWords };
};

export interface Section {
  title: string;
  content: string;
}

const cleanTitle = (block: string): string => block.replace(/\*\*/g, "").replace(/\s*:\s*$/, "").trim();

/**
 * Sections d'une longue définition : chaque titre en gras ouvre une section ; le texte qui précède le premier titre forme
 * l'« Introduction ». Un titre sans contenu est reporté en tête de la section suivante. Renvoie [] s'il y a moins de trois sections.
 */
export const splitSections = (source: string): Section[] => {
  const blocks = splitBlocks(normalizeGlossaryMarkdown(source));
  const sections: { title: string; raw: string; blocks: string[] }[] = [{ title: "Introduction", raw: "", blocks: [] }];
  for (const block of blocks) {
    if (isTitleBlock(block)) sections.push({ title: cleanTitle(block), raw: block, blocks: [] });
    else sections[sections.length - 1].blocks.push(block);
  }
  const merged: Section[] = [];
  let carried: string[] = [];
  for (const section of sections) {
    if (section.blocks.length === 0) {
      if (section.raw) carried.push(section.raw);
      continue;
    }
    merged.push({ title: section.title, content: [...carried, ...section.blocks].join("\n\n") });
    carried = [];
  }
  return merged.length >= 3 ? merged : [];
};
