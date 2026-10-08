import { lazy } from "react";
import ProgressiveSections from "@/components/layout/ProgressiveSections";
import ProgrammingIntro from "./programming/ProgrammingIntro";

// Environ 9 000 lignes de composants : l'introduction s'affiche d'abord, les sous-sections arrivent ensuite une à une
// (mesuré le 6 octobre 2026 : tout dessiner d'un coup bloquait le navigateur 2,3 s, processeur ralenti 4 fois)
const PythonMasterclass = lazy(() => import("./programming/PythonMasterclass"));
const LanguageComparison = lazy(() => import("./programming/LanguageComparison"));
const PracticalExercises = lazy(() => import("./programming/PracticalExercises"));
const AdvancedConcepts = lazy(() => import("./programming/AdvancedConcepts"));
const InteractiveChallenges = lazy(() => import("./programming/InteractiveChallenges"));
const CodeEditor = lazy(() => import("./programming/CodeEditor"));
const ToolingSection = lazy(() => import("./programming/ToolingSection"));
const ResourcesSection = lazy(() => import("./programming/ResourcesSection"));

const ProgrammingSection = () => {
  return (
    <div id="programming" className="space-y-12">
      <ProgressiveSections>
        <div id="programming-intro">
          <ProgrammingIntro />
        </div>
        <PythonMasterclass />
        <LanguageComparison />
        <PracticalExercises />
        <AdvancedConcepts />
        <div id="interactive-challenges">
          <InteractiveChallenges />
        </div>
        <div id="code-editor">
          <CodeEditor />
        </div>
        <ToolingSection />
        <ResourcesSection />
      </ProgressiveSections>
    </div>
  );
};

export default ProgrammingSection;
