
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
      <ResourcesSection />
    </div>
  );
};

export default ProgrammingSection;
