
import ProgrammingIntro from "./programming/ProgrammingIntro";
import PythonMasterclass from "./programming/PythonMasterclass";
import LanguageComparison from "./programming/LanguageComparison";
import PracticalExercises from "./programming/PracticalExercises";
import AdvancedConcepts from "./programming/AdvancedConcepts";
import InteractiveChallenges from "./programming/InteractiveChallenges";
import CodeEditor from "./programming/CodeEditor";
import ResourcesSection from "./programming/ResourcesSection";

const ProgrammingSection = () => {
  return (
    <div id="programming" className="space-y-12">
      <div id="programming-intro">
        <ProgrammingIntro />
      </div>
      <div id="python-masterclass">
        <PythonMasterclass />
      </div>
      <div id="language-comparison">
        <LanguageComparison />
      </div>
      <div id="practical-exercises">
        <PracticalExercises />
      </div>
      <div id="advanced-concepts">
        <AdvancedConcepts />
      </div>
      <div id="interactive-challenges">
        <InteractiveChallenges />
      </div>
      <div id="code-editor">
        <CodeEditor />
      </div>
      <div id="resources">
        <ResourcesSection />
      </div>
    </div>
  );
};

export default ProgrammingSection;
