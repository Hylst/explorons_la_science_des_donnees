import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { HelmetProvider } from "react-helmet-async";
import { Suspense, lazy } from "react";

import ErrorBoundary from "@/components/ui/error-boundary";
import { PageLoading } from "@/components/ui/loading-states";

// Lazy load main pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Introduction = lazy(() => import("./pages/Introduction"));
const Fundamentals = lazy(() => import("./pages/Fundamentals"));
const MachineLearning = lazy(() => import("./pages/MachineLearning"));
const Tools = lazy(() => import("./pages/Tools"));
const Projects = lazy(() => import("./pages/Projects"));
const Resources = lazy(() => import("./pages/Resources"));
const Quiz = lazy(() => import("./pages/Quiz"));
const QuizCategory = lazy(() => import("./pages/QuizCategory"));
const Community = lazy(() => import("./pages/Community"));
const Blog = lazy(() => import("./pages/Blog"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Glossary = lazy(() => import("./pages/Glossary"));
const About = lazy(() => import("./pages/About"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Contact = lazy(() => import("./pages/Contact"));
// Lazy load fundamentals pages
const MathStats = lazy(() => import("./pages/fundamentals/MathStats"));
const Programming = lazy(() => import("./pages/fundamentals/Programming"));
const Databases = lazy(() => import("./pages/fundamentals/Databases"));
const DataPreparationRefactored = lazy(() => import("./pages/fundamentals/DataPreparationRefactored"));

// Course routing component
import CourseRouter from './components/routing/CourseRouter';
import ScrollManager from './components/routing/ScrollManager';
import RouteMeta from "./components/routing/RouteMeta";
import { LEGACY_REDIRECTS } from './config/routes';

// Lazy load math-stats subpages
const ProbabilityTheory = lazy(() => import("./pages/fundamentals/math-stats/ProbabilityTheory"));
const DescriptiveStatistics = lazy(() => import("./pages/fundamentals/math-stats/DescriptiveStatistics"));
const LinearAlgebra = lazy(() => import("./pages/fundamentals/math-stats/LinearAlgebra"));
const DifferentialCalculus = lazy(() => import("./pages/fundamentals/math-stats/DifferentialCalculus"));
const AdvancedStatistics = lazy(() => import("./pages/fundamentals/math-stats/AdvancedStatistics"));
const IntegralCalculus = lazy(() => import("./pages/fundamentals/math-stats/IntegralCalculus"));

// Lazy load Machine Learning imports
const SupervisedLearning = lazy(() => import("./pages/machine-learning/SupervisedLearning"));
const UnsupervisedLearning = lazy(() => import("./pages/machine-learning/UnsupervisedLearning"));
const ReinforcementLearning = lazy(() => import("./pages/machine-learning/ReinforcementLearning"));

// Lazy load Course pages
const CoursesIndex = lazy(() => import("./pages/courses/CoursesIndex"));
const DataVisualizationTools = lazy(() => import("./pages/tools/DataVisualization"));
const ProgrammingToolsPage = lazy(() => import("./pages/tools/ProgrammingTools"));
const DataProcessingToolsPage = lazy(() => import("./pages/tools/DataProcessingTools"));
const MLFrameworksPage = lazy(() => import("./pages/tools/MLFrameworks"));

/**
 * Loading fallback component for lazy-loaded routes
 * Provides a consistent loading experience across the application
 */
const PageLoadingFallback = () => (
  <PageLoading message="Chargement de la page..." />
);

const App = () => (
  <ErrorBoundary showDetails={import.meta.env.DEV}>
    <ThemeProvider defaultTheme="light">
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <ScrollManager />
            <RouteMeta />
            <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/introduction" element={<Introduction />} />
            <Route path="/fundamentals" element={<Fundamentals />} />
            <Route path="/fundamentals/math-stats" element={<MathStats />} />
            <Route path="/fundamentals/math-stats/probability-theory" element={<ProbabilityTheory />} />
            <Route path="/fundamentals/math-stats/descriptive-statistics" element={<DescriptiveStatistics />} />
            <Route path="/fundamentals/math-stats/linear-algebra" element={<LinearAlgebra />} />
            <Route path="/fundamentals/math-stats/differential-calculus" element={<DifferentialCalculus />} />
            <Route path="/fundamentals/math-stats/advanced-statistics" element={<AdvancedStatistics />} />
            <Route path="/fundamentals/math-stats/integral-calculus" element={<IntegralCalculus />} />
            <Route path="/fundamentals/data-preparation" element={<DataPreparationRefactored />} />
            <Route path="/fundamentals/programming" element={<Programming />} />
            <Route path="/fundamentals/databases" element={<Databases />} />
            <Route path="/machine-learning" element={<MachineLearning />} />
            <Route path="/machine-learning/supervised" element={<SupervisedLearning />} />
            <Route path="/machine-learning/unsupervised" element={<UnsupervisedLearning />} />
            <Route path="/machine-learning/reinforcement" element={<ReinforcementLearning />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quiz/:categoryId" element={<QuizCategory />} />
            <Route path="/community" element={<Community />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<Blog />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Course pages */}
            <Route path="/courses" element={<CoursesIndex />} />
            <Route path="/courses/*" element={<CourseRouter />} />
            
            {/* Tools Routes */}
            <Route path="/tools/programming" element={<ProgrammingToolsPage />} />
            <Route path="/tools/data-processing" element={<DataProcessingToolsPage />} />
            <Route path="/tools/ml-frameworks" element={<MLFrameworksPage />} />
            <Route path="/tools/visualization" element={<DataVisualizationTools />} />
            
            {/* Anciennes URL : voir src/config/routes.ts */}
            {LEGACY_REDIRECTS.map(({ from, to }) => (
              <Route key={from} path={from} element={<Navigate to={to} replace />} />
            ))}

            <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
