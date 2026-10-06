import { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";

const TEXT = "text-gray-700 dark:text-gray-300";

// Dans un module, le titre du module est un h3 : les intertitres du texte deviennent des h4 et h5
const components: Components = {
  h1: ({ children }) => <h4 className="mt-6 mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{children}</h4>,
  h2: ({ children }) => <h4 className="mt-6 mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{children}</h4>,
  h3: ({ children }) => <h4 className="mt-6 mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{children}</h4>,
  h4: ({ children }) => <h5 className="mt-4 mb-2 font-semibold text-gray-900 dark:text-gray-100">{children}</h5>,
  p: ({ children }) => <p className={`mb-3 leading-relaxed ${TEXT}`}>{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => <ul className={`mb-3 ml-5 list-disc space-y-1 ${TEXT}`}>{children}</ul>,
  ol: ({ children }) => <ol className={`mb-3 ml-5 list-decimal space-y-1 ${TEXT}`}>{children}</ol>,
  li: ({ children }) => <li className="pl-1">{children}</li>,
  pre: ({ children }) => (
    <pre className="mb-3 overflow-x-auto rounded-md bg-slate-900 p-3 text-sm leading-relaxed text-slate-100 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit">
      {children}
    </pre>
  ),
  code: ({ children }) => (
    <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[0.9em] text-gray-900 dark:bg-gray-800 dark:text-gray-100">{children}</code>
  ),
  // aucun lien externe dans les leçons (le site n'appelle aucun tiers) : un lien éventuel reste du texte
  a: ({ children }) => <span className="underline">{children}</span>,
};

/** Texte d'une leçon (markdown sans tableaux : react-markdown sans extension GFM) */
const LessonMarkdown = memo(function LessonMarkdown({ md }: { md: string }) {
  return <ReactMarkdown components={components}>{md}</ReactMarkdown>;
});

export default LessonMarkdown;
