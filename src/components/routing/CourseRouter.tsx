import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load course components
const MathIntroCourse = React.lazy(() => import('../../pages/courses/math-stats/math-intro'));
const InferentialStatisticsCourse = React.lazy(() => import('../../pages/courses/math-stats/inferential-statistics'));
const PythonBasics = React.lazy(() => import('../../pages/courses/programming/PythonBasics'));
const AppliedStatistics = React.lazy(() => import('../../pages/courses/statistics/AppliedStatistics'));
const SupervisedLearningCourse = React.lazy(() => import('../../pages/courses/machine-learning/SupervisedLearningCourse'));
const DatabaseFundamentals = React.lazy(() => import('../../pages/courses/databases/DatabaseFundamentals'));
const DataVisualization = React.lazy(() => import('../../pages/courses/dataviz/DataVisualization'));
const NaturalLanguageProcessing = React.lazy(() => import('../../pages/courses/nlp/NaturalLanguageProcessing'));
const MLModelsGuide = React.lazy(() => import('../../pages/courses/MLModelsGuide'));
const TransformersGuide = React.lazy(() => import('../../pages/courses/TransformersGuide'));
const NotFound = React.lazy(() => import('../../pages/NotFound'));

/**
 * Centralized course routing component that handles all course-related routes
 * and provides consistent URL patterns across the application
 */
const CourseRouter: React.FC = () => {
  return (
    <Routes>
      {/* Math & Statistics Courses */}
      <Route path="math-stats/math-intro" element={<MathIntroCourse />} />
      <Route path="math-stats/inferential-statistics" element={<InferentialStatisticsCourse />} />
      <Route path="statistics/applied-statistics" element={<AppliedStatistics />} />
      
      {/* Programming Courses */}
      <Route path="programming/python-basics" element={<PythonBasics />} />
      
      {/* Database Courses */}
      <Route path="databases/database-fundamentals" element={<DatabaseFundamentals />} />
      
      {/* Data Visualization Courses */}
      <Route path="dataviz/data-visualization" element={<DataVisualization />} />
      
      {/* Machine Learning Courses */}
      <Route path="machine-learning/supervised-learning" element={<SupervisedLearningCourse />} />
      <Route path="machine-learning/ml-models-guide" element={<MLModelsGuide />} />
      <Route path="machine-learning/transformers" element={<TransformersGuide />} />
      
      {/* NLP Courses */}
      <Route path="nlp/natural-language-processing" element={<NaturalLanguageProcessing />} />
      
      {/* Anciennes URL : déclarées dans src/config/routes.ts (rendues par App.tsx) */}

      {/* Cours inconnu : vraie 404 plutôt qu'une redirection silencieuse qui masque les liens morts */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default CourseRouter;