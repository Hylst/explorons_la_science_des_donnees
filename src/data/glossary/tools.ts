/**
 * Langages, bibliothèques et outils de la data science.
 *
 * Les définitions ont une source unique : les dictionnaires utilisés pour les survols dans les cours
 * (components/fundamentals/definitions). Ce module les expose aussi dans la page Glossaire,
 * pour qu'un terme survolé dans un cours soit toujours retrouvable dans le glossaire.
 */

import type { GlossaryTermDefinition } from '@/components/ui/glossary-term';
import { programmingDefinitions } from '@/components/fundamentals/definitions/programming-definitions';
import { datavizDefinitions } from '@/components/fundamentals/definitions/dataviz-definitions';
import type { GlossaryEntry } from './types';

// Icône affichée sur la carte, par clé de définition
const ICONS: Record<string, string> = {
  python: 'Code',
  r: 'BarChart3',
  sql: 'Database',
  pandas: 'Layers',
  'jupyter-notebook': 'BookOpen',
  api: 'Network',
  github: 'GitBranch',
  matplotlib: 'LineChart',
  seaborn: 'Activity',
  tableau: 'Gauge',
  d3js: 'Code',
  'power-bi': 'BarChart3',
  heatmap: 'Target'
};

const toEntry = (key: string, definition: GlossaryTermDefinition): GlossaryEntry => {
  const body = definition.longDefinition ?? definition.shortDefinition;
  const examples = definition.examples?.length
    ? `\n\n**Exemples :** ${definition.examples.join(' ; ')}.`
    : '';
  return {
    term: definition.term,
    description: `${body}${examples}`,
    shortDefinition: definition.shortDefinition,
    longDefinition: definition.longDefinition,
    category: 'fondamentaux',
    icon: ICONS[key] ?? 'BookOpen',
    examples: definition.examples,
    relatedTerms: definition.relatedTerms,
    source: definition.source
  };
};

// « Visualisation de données » est déjà défini dans fundamentals.ts
const { 'visualisation-données': _alreadyDefined, ...datavizTools } = datavizDefinitions;

export const toolsTerms: GlossaryEntry[] = [
  ...Object.entries(programmingDefinitions),
  ...Object.entries(datavizTools)
].map(([key, definition]) => toEntry(key, definition));
