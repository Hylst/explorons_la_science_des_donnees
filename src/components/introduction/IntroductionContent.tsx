
import DefinitionSection from "./sections/DefinitionSection";
import HistorySection from "./sections/HistorySection";
import PillarsSection from "./sections/PillarsSection";
import LifecycleSection from "./sections/LifecycleSection";
import ApplicationsSection from "./sections/ApplicationsSection";
import CareersSection from "./sections/CareersSection";
import ResourcesSection from "./sections/ResourcesSection";
import IntroConclusionSection from "./sections/IntroConclusionSection";

const IntroductionContent = () => {
  return (
    <div className="space-y-12">
      <DefinitionSection />
      <HistorySection />
      <PillarsSection />
      <LifecycleSection />
      <ApplicationsSection />
      <CareersSection />
      <ResourcesSection />
      <IntroConclusionSection />
    </div>
  );
};

export default IntroductionContent;
