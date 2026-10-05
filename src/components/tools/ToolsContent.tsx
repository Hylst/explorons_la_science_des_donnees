
import ProgrammingTools from "./sections/ProgrammingTools";
import DataProcessingTools from "./sections/DataProcessingTools";
import MLFrameworks from "./sections/MLFrameworks";
import VisualizationTools from "./sections/VisualizationTools";
import ToolsOverview from "./sections/ToolsOverview";

interface ToolsContentProps {
  section: "overview" | "programming" | "data" | "ml" | "visualization";
}

const ToolsContent: React.FC<ToolsContentProps> = ({ section }) => {
  switch (section) {
    case "overview":
      return <ToolsOverview />;
    case "programming":
      return <ProgrammingTools />;
    case "data":
      return <DataProcessingTools />;
    case "ml":
      return <MLFrameworks />;
    case "visualization":
      return <VisualizationTools />;
    default:
      return <ToolsOverview />;
  }
};

export default ToolsContent;
