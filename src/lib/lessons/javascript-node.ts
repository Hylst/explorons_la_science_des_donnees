import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

/**
 * Exécute du JavaScript sous Node avec le même noyau que le bac à sable du site (public/sandbox/js-core.js) :
 * même enveloppe (fonction asynchrone), même capture de console.log, même forme d'erreur (« Nom: message »).
 * Pour les tests uniquement ; le site, lui, exécute ce noyau dans un iframe isolé (lib/runner/javascript.ts).
 */
const CORE = fs.readFileSync(path.resolve(__dirname, "../../../public/sandbox/js-core.js"), "utf8");

export const runJavaScriptNode = async (code: string): Promise<{ output: string; error?: string }> => {
  // un contexte neuf par exécution, comme l'iframe neuf du site : aucun état ne passe d'une exécution à l'autre
  const context: Record<string, unknown> = { console: {}, setTimeout, addEventListener: () => {} };
  context.self = context;
  vm.createContext(context);
  vm.runInContext(CORE, context);
  const run = context.__runUserCode as (source: string) => Promise<{ output: string; error?: string }>;
  const result = await run(code);
  return { output: result.output, ...(result.error === undefined ? {} : { error: String(result.error) }) };
};
