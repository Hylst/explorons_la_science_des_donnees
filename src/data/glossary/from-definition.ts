/**
 * Passage d'une définition « de survol » (dictionnaires des cours : components/fundamentals/definitions, data/…) à une
 * entrée du glossaire. Une seule source de texte : la définition survolée dans un cours est celle de la page Glossaire.
 */

import type { GlossaryCategory, GlossaryEntry } from './types';

export interface DefinitionLike {
  term: string;
  shortDefinition: string;
  longDefinition?: string;
  /** Ancien nom du champ « définition longue » dans data/data-preparation-enhanced-definitions */
  definition?: string;
  examples?: string[];
  relatedTerms?: string[];
  source?: string;
  sourceUrl?: string;
  synonyms?: string[];
  englishTerm?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
}

/** Forme comparable d'un terme : sans accents ni majuscules ni parenthèses (« ETL (Extract, Transform, Load) » donne « etl »). */
export const normalizeTerm = (term: string): string =>
  term
    .toLowerCase()
    .normalize('NFKD') // NFKD (et non NFD) : « R² » devient « r2 » et ne se confond pas avec le langage R
    .replace(/[̀-ͯ]/g, '')
    .replace(/\(.*?\)/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/** Toutes les formes sous lesquelles un terme peut être retrouvé : son nom, ses alias entre parenthèses, son nom anglais. */
export const termKeys = (term: string, englishTerm?: string): string[] => {
  const aliases = (term.match(/\(([^)]+)\)/g) ?? []).map((alias) => normalizeTerm(alias.slice(1, -1)));
  return [normalizeTerm(term), ...aliases, ...(englishTerm ? [normalizeTerm(englishTerm)] : [])].filter(Boolean);
};

export const definitionToEntry = (definition: DefinitionLike, category: GlossaryCategory, icon: string): GlossaryEntry => {
  const long = definition.longDefinition ?? definition.definition;
  const body = long ?? definition.shortDefinition;
  const examples = definition.examples?.length ? `\n\n**Exemples :** ${definition.examples.join(' ; ')}.` : '';
  const title =
    definition.englishTerm && normalizeTerm(definition.englishTerm) !== normalizeTerm(definition.term)
      ? `${definition.term} (${definition.englishTerm})`
      : definition.term;
  return {
    term: title,
    description: `${body}${examples}`,
    shortDefinition: definition.shortDefinition,
    longDefinition: long,
    category,
    icon,
    examples: definition.examples,
    relatedTerms: definition.relatedTerms,
    source: definition.source,
    sourceUrl: definition.sourceUrl,
    synonyms: definition.synonyms,
    englishTerm: definition.englishTerm,
    level: definition.level
  };
};
