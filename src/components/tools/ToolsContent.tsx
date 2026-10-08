import { lazy } from "react";
import LazyBlock from "@/components/layout/LazyBlock";

// Chaque page d'outils n'affiche qu'une section : on ne charge que celle-là
// (avant le 6 octobre 2026, toutes étaient importées, graphiques Recharts compris, sur chaque page)
const ProgrammingTools = lazy(() => import("./sections/ProgrammingTools"));
const DataProcessingTools = lazy(() => import("./sections/DataProcessingTools"));
const MLFrameworks = lazy(() => import("./sections/MLFrameworks"));
const VisualizationTools = lazy(() => import("./sections/VisualizationTools"));
const ToolsOverview = lazy(() => import("./sections/ToolsOverview"));

interface ToolsContentProps {
  section: "overview" | "programming" | "data" | "ml" | "visualization";
}

const sectionFor = (section: ToolsContentProps["section"]) => {
  switch (section) {
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

const ToolsContent: React.FC<ToolsContentProps> = ({ section }) => <LazyBlock>{sectionFor(section)}</LazyBlock>;

export default ToolsContent;
