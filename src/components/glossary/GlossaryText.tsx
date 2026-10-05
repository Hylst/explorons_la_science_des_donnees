import { memo, useMemo, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { normalizeGlossaryMarkdown, previewMarkdown } from "@/lib/glossary-markdown";

const TEXT = "text-gray-700 dark:text-gray-300";
/** Un titre markdown écrit dans une définition ne devient jamais un titre de la page (il n'y a qu'un seul h1) */
const Subheading = ({ children }: { children?: React.ReactNode }) => (
  <h4 className="mt-4 mb-2 font-semibold text-gray-900 dark:text-gray-100">{children}</h4>
);

const components: Components = {
  h1: Subheading,
  h2: Subheading,
  h3: Subheading,
  h4: Subheading,
  h5: Subheading,
  h6: Subheading,
  // Un paragraphe qui n'est qu'un texte en gras est un intertitre (« **Analogie :** »)
  p: ({ node, children }) => {
    const onlyBold = node?.children.length === 1 && node.children[0].type === "element" && node.children[0].tagName === "strong";
    return onlyBold ? (
      <p className="mt-4 mb-1.5 font-semibold text-gray-900 dark:text-gray-100">{children}</p>
    ) : (
      <p className={`mb-3 leading-relaxed ${TEXT}`}>{children}</p>
    );
  },
  strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>,
  em: ({ children }) => <em className="italic text-gray-800 dark:text-gray-200">{children}</em>,
  ul: ({ children }) => <ul className={`mb-3 ml-5 list-disc space-y-1 ${TEXT}`}>{children}</ul>,
  ol: ({ children }) => <ol className={`mb-3 ml-5 list-decimal space-y-1 ${TEXT}`}>{children}</ol>,
  li: ({ children }) => <li className={`pl-1 ${TEXT}`}>{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mb-3 border-l-4 border-blue-300 pl-3 italic text-gray-600 dark:border-blue-700 dark:text-gray-400">{children}</blockquote>
  ),
  // Bloc de code : cadre sombre, défilement horizontal, le code garde ses retours à la ligne ; code en ligne : pastille
  pre: ({ children }) => (
    <pre className="mb-3 overflow-x-auto rounded-md bg-slate-900 p-3 text-xs leading-relaxed text-slate-100 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit">
      {children}
    </pre>
  ),
  code: ({ children }) => (
    <code className="rounded bg-gray-200 px-1 py-0.5 font-mono text-[0.85em] text-gray-900 dark:bg-gray-700 dark:text-gray-100">{children}</code>
  ),
};

/** Définition du glossaire rendue en entier (markdown léger : voir lib/glossary-markdown). */
export const GlossaryMarkdown = memo(function GlossaryMarkdown({ text }: { text: string }) {
  const normalized = useMemo(() => normalizeGlossaryMarkdown(text), [text]);
  return (
    <div className="max-w-none text-sm leading-relaxed">
      <ReactMarkdown components={components}>{normalized}</ReactMarkdown>
    </div>
  );
});

interface ExpandableGlossaryTextProps {
  text: string;
  /** Au-delà de ce nombre de mots, seul le début (par blocs entiers) est affiché, avec « Voir plus » */
  wordLimit?: number;
}

/** Définition avec aperçu : le début par blocs entiers, puis « Voir plus » pour le reste. */
export const ExpandableGlossaryText = memo(function ExpandableGlossaryText({ text, wordLimit = 100 }: ExpandableGlossaryTextProps) {
  const [expanded, setExpanded] = useState(false);
  const preview = useMemo(() => previewMarkdown(text, wordLimit), [text, wordLimit]);

  return (
    <div className="space-y-3">
      <GlossaryMarkdown text={expanded || !preview.truncated ? text : preview.text} />
      {preview.truncated && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              aria-expanded={expanded}
              onClick={() => setExpanded((value) => !value)}
              className="h-auto p-0 font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {expanded ? <ChevronUp className="mr-1 h-4 w-4" /> : <ChevronDown className="mr-1 h-4 w-4" />}
              {expanded ? "Voir moins" : "Voir plus"}
            </Button>
            <span className="text-xs text-gray-500 dark:text-gray-400">{preview.totalWords} mots</span>
          </div>
        </div>
      )}
    </div>
  );
});
