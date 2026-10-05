/**
 * Redirections des anciennes URL : source unique, rendue dans App.tsx.
 *
 * Schéma d'URL canonique :
 * - pages de section : /fundamentals/*, /machine-learning/*, /tools/*
 * - cours détaillés : /courses/<catégorie>/<cours> (voir CourseRouter)
 *
 * Les chemins sont absolus ; une route statique est prioritaire sur /courses/*,
 * donc les anciennes URL de cours peuvent aussi être déclarées ici.
 */
export const LEGACY_REDIRECTS: ReadonlyArray<{ from: string; to: string }> = [
  // Doublons /courses/... des pages de section
  { from: '/courses/fundamentals/math-stats', to: '/fundamentals/math-stats' },
  { from: '/courses/fundamentals/programming', to: '/fundamentals/programming' },
  { from: '/courses/machine-learning/supervised', to: '/machine-learning/supervised' },
  // Même contenu servi par deux routes : la page de section fait foi (tous les liens du site y mènent)
  { from: '/courses/math-stats/integral-calculus', to: '/fundamentals/math-stats/integral-calculus' },

  // Anciennes URL de cours
  { from: '/course/python-basics', to: '/courses/programming/python-basics' },
  { from: '/course/applied-statistics', to: '/courses/statistics/applied-statistics' },
  { from: '/course/supervised-ml', to: '/courses/machine-learning/supervised-learning' },
  { from: '/course/databases', to: '/courses/databases/database-fundamentals' },
  { from: '/course/dataviz', to: '/courses/dataviz/data-visualization' },
  { from: '/course/nlp', to: '/courses/nlp/natural-language-processing' },
  { from: '/programming/python', to: '/courses/programming/python-basics' },
  { from: '/statistics/applied', to: '/courses/statistics/applied-statistics' },
  { from: '/ml/supervised', to: '/courses/machine-learning/supervised-learning' },

  // Anciennes catégories de cours (slugs français)
  { from: '/courses/fondations-mathematiques-et-logiques', to: '/fundamentals/math-stats' },
  { from: '/courses/programmation-et-algorithmes', to: '/fundamentals/programming' },
  { from: '/courses/bases-de-donnees-et-stockage', to: '/fundamentals/databases' },
  { from: '/courses/machine-learning-et-ia', to: '/machine-learning' },
  { from: '/courses/visualisation-de-donnees', to: '/courses/dataviz/data-visualization' },
  { from: '/courses/nlp-et-traitement-du-langage', to: '/courses/nlp/natural-language-processing' },

  // Anciens cours sous les slugs français
  { from: '/courses/fondations-mathematiques-et-logiques/math-intro', to: '/courses/math-stats/math-intro' },
  { from: '/courses/programmation-et-algorithmes/python-basics', to: '/courses/programming/python-basics' },
  { from: '/courses/bases-de-donnees-et-stockage/database-fundamentals', to: '/courses/databases/database-fundamentals' },
  { from: '/courses/machine-learning-et-ia/supervised-learning', to: '/courses/machine-learning/supervised-learning' },
  { from: '/courses/visualisation-de-donnees/data-visualization', to: '/courses/dataviz/data-visualization' },
  { from: '/courses/nlp-et-traitement-du-langage/natural-language-processing', to: '/courses/nlp/natural-language-processing' },

  // Liens morts historiques
  { from: '/community/blog', to: '/blog' },
  { from: '/events', to: '/community#events' },
  { from: '/fundamentals/machine-learning', to: '/machine-learning' },
];
