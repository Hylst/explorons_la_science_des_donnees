
import StatisticsIntro from "./StatisticsIntro";
import DescriptiveStatistics from "./DescriptiveStatistics";
import InferentialStatistics from "./InferentialStatistics";
import ProbabilitiesSection from "./ProbabilitiesSection";
import LinearAlgebraSection from "./LinearAlgebraSection";
import AdvancedStatistics from "./AdvancedStatistics";
import PracticalAdvice from "./PracticalAdvice";

const StatisticsSection = () => {
  return (
    <div id="statistics" className="scroll-mt-24 border-l-4 border-ds-blue-500 pl-6 py-2">
      <StatisticsIntro />
      
      <h3 className="text-xl font-semibold mt-6 mb-4">Concepts statistiques clés</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <DescriptiveStatistics />
        <InferentialStatistics />
        <ProbabilitiesSection />
        <LinearAlgebraSection />
      </div>
      
      <AdvancedStatistics />
      
      <PracticalAdvice />
    </div>
  );
};

export default StatisticsSection;
