/**
 * Type definitions for glossary terms
 * Provides strong typing for all glossary-related data structures
 */

/**
 * Enhanced GlossaryEntry interface combining best of both systems
 */
export interface GlossaryEntry {
  term: string;
  description: string;
  shortDefinition?: string; // For backward compatibility
  longDefinition?: string;
  category: GlossaryCategory;
  icon: string;
  examples?: string[];
  relatedTerms?: string[];
  source?: string;
  sourceUrl?: string;
  domain?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  synonyms?: string[];
  englishTerm?: string;
}

/**
 * Available categories for glossary terms
 * Ensures consistent categorization across the application
 */
export type GlossaryCategory = 
  | 'fondamentaux'
  | 'statistiques'
  | 'machine-learning'
  | 'deep-learning'
  | 'nlp'
  | 'computer-vision'
  | 'preprocessing'
  | 'evaluation'
  | 'mlops'
  | 'data-engineering';

/**
 * Category metadata for display purposes
 */
export interface CategoryInfo {
  id: GlossaryCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
}

/**
 * Category configuration with display information
 */
export const CATEGORY_INFO: Record<GlossaryCategory, CategoryInfo> = {
  'fondamentaux': {
    id: 'fondamentaux',
    name: 'Fondamentaux',
    description: 'Concepts de base de la data science',
    icon: 'BookOpen',
    color: 'blue'
  },
  'statistiques': {
    id: 'statistiques',
    name: 'Statistiques',
    description: 'Méthodes statistiques et probabilités',
    icon: 'BarChart3',
    color: 'green'
  },
  'machine-learning': {
    id: 'machine-learning',
    name: 'Machine Learning',
    description: 'Algorithmes d\'apprentissage automatique',
    icon: 'Cpu',
    color: 'purple'
  },
  'deep-learning': {
    id: 'deep-learning',
    name: 'Deep Learning',
    description: 'Réseaux de neurones et apprentissage profond',
    icon: 'Network',
    color: 'red'
  },
  'nlp': {
    id: 'nlp',
    name: 'NLP',
    description: 'Traitement du langage naturel',
    icon: 'MessageSquare',
    color: 'orange'
  },
  'computer-vision': {
    id: 'computer-vision',
    name: 'Computer Vision',
    description: 'Vision par ordinateur et traitement d\'images',
    icon: 'Eye',
    color: 'cyan'
  },
  'preprocessing': {
    id: 'preprocessing',
    name: 'Preprocessing',
    description: 'Préparation et transformation des données',
    icon: 'Wrench',
    color: 'yellow'
  },
  'evaluation': {
    id: 'evaluation',
    name: 'Évaluation',
    description: 'Métriques et évaluation des modèles',
    icon: 'Target',
    color: 'pink'
  },
  'mlops': {
    id: 'mlops',
    name: 'MLOps',
    description: 'Opérations et déploiement ML',
    icon: 'Settings',
    color: 'indigo'
  },
  'data-engineering': {
    id: 'data-engineering',
    name: 'Data Engineering',
    description: 'Infrastructure et pipelines de données',
    icon: 'Database',
    color: 'gray'
  }
};