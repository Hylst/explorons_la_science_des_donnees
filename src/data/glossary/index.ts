/**
 * Glossary Terms Index
 * Main entry point that combines all categorized glossary terms
 */

import { fundamentalsTerms } from './fundamentals';
import { statisticsTerms } from './statistics';
import { machineLearningTerms } from './machine-learning';
import { deepLearningTerms } from './deep-learning';
import { nlpTerms } from './nlp';
import { mlopsTerms } from './mlops';
import { evaluationTerms } from './evaluation';
import { toolsTerms } from './tools';
import { GlossaryCategory } from './types';

// Export types and constants
export * from './types';

// Combine all terms into a single array
export const glossaryTerms = [
  ...fundamentalsTerms,
  ...toolsTerms,
  ...statisticsTerms,
  ...machineLearningTerms,
  ...deepLearningTerms,
  ...nlpTerms,
  ...mlopsTerms,
  ...evaluationTerms
];

// Export individual term arrays for potential future use
export {
  fundamentalsTerms,
  toolsTerms,
  statisticsTerms,
  machineLearningTerms,
  deepLearningTerms,
  nlpTerms,
  mlopsTerms,
  evaluationTerms
};

// Utility functions for working with glossary terms
export const getTermsByCategory = (category: GlossaryCategory) => {
  return glossaryTerms.filter(term => term.category === category);
};

export const searchTerms = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return glossaryTerms.filter(term => 
    term.term.toLowerCase().includes(lowercaseQuery) ||
    term.description.toLowerCase().includes(lowercaseQuery)
  );
};

export const getTermByName = (termName: string) => {
  return glossaryTerms.find(term => 
    term.term.toLowerCase() === termName.toLowerCase()
  );
};

export const getTotalTermsCount = () => glossaryTerms.length;

export const getCategoriesCount = () => {
  const categories = new Set(glossaryTerms.map(term => term.category));
  return categories.size;
};