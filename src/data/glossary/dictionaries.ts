/**
 * Termes survolés dans les cours qui n'ont pas d'entrée écrite à la main dans le glossaire :
 * statistiques, traitement et préparation des données. Même principe que tools.ts : un terme survolé dans un cours doit
 * toujours être retrouvable dans la page Glossaire (test dictionaries.test.ts).
 */

import { dataProcessingDefinitions } from '@/components/fundamentals/definitions/data-processing-definitions';
import { statisticsDefinitions } from '@/components/fundamentals/definitions/statistics-definitions';
import { dataPreparationEnhancedDefinitions as richDataPreparation } from '@/components/fundamentals/definitions/data-preparation-enhanced-definitions';
import { dataPreparationEnhancedDefinitions as thinDataPreparation } from '@/data/data-preparation-enhanced-definitions';
import { definitionToEntry, normalizeTerm, termKeys, type DefinitionLike } from './from-definition';
import type { GlossaryCategory, GlossaryEntry } from './types';

// Termes qui relèvent plutôt de l'ingénierie des données que de la préparation
const ENGINEERING = new Set(['etl', 'data warehouse', 'orchestration', 'monitoring', 'deploiement']);

const categoryOf = (definition: DefinitionLike, fallback: GlossaryCategory): GlossaryCategory =>
  ENGINEERING.has(normalizeTerm(definition.term)) ? 'data-engineering' : fallback;

const ICONS: Record<GlossaryCategory, string> = {
  fondamentaux: 'BookOpen',
  statistiques: 'BarChart3',
  'machine-learning': 'Cpu',
  'deep-learning': 'Network',
  nlp: 'MessageSquare',
  'computer-vision': 'Eye',
  preprocessing: 'Layers',
  evaluation: 'Target',
  mlops: 'GitBranch',
  'data-engineering': 'Database'
};

// Les 18 termes de la version riche (définition longue, exemples, termes liés) remplacent leur version courte
const rich = new Map(Object.values(richDataPreparation).map((definition) => [normalizeTerm(definition.term), definition as DefinitionLike]));
const dataPreparation = (Object.values(thinDataPreparation) as unknown as DefinitionLike[]).map((thin) => {
  const better = rich.get(normalizeTerm(thin.term));
  return better ? { ...thin, ...better, term: thin.term } : thin;
});

const sources: { definitions: DefinitionLike[]; category: GlossaryCategory }[] = [
  { definitions: Object.values(dataProcessingDefinitions) as DefinitionLike[], category: 'preprocessing' },
  { definitions: Object.values(statisticsDefinitions) as DefinitionLike[], category: 'statistiques' },
  { definitions: dataPreparation, category: 'preprocessing' }
];

/** Entrées issues des dictionnaires, sans doublon entre elles (le premier gagne). Le filtre contre les entrées écrites à la main est dans index.ts. */
export const dictionaryTerms: GlossaryEntry[] = (() => {
  const seen = new Set<string>();
  const entries: GlossaryEntry[] = [];
  for (const { definitions, category } of sources) {
    for (const definition of definitions) {
      const keys = termKeys(definition.term, definition.englishTerm);
      if (keys.some((key) => seen.has(key))) continue;
      keys.forEach((key) => seen.add(key));
      const finalCategory = categoryOf(definition, category);
      entries.push(definitionToEntry(definition, finalCategory, ICONS[finalCategory]));
    }
  }
  return entries;
})();
