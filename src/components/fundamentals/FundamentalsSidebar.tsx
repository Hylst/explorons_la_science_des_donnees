
import { Brain, LightbulbIcon, History, ChartBar, Code } from "lucide-react";

export type FundamentalsSectionType = "statistics" | "programming" | "dataviz" | "dataprocessing" | "mathvisuals";

interface FundamentalsSidebarProps {
  currentSection: FundamentalsSectionType;
  onSectionChange: (section: FundamentalsSectionType) => void;
}

const FundamentalsSidebar = ({ currentSection, onSectionChange }: FundamentalsSidebarProps) => {
  const sidebarItems = [
    { 
      title: "Mathématiques et Statistiques", 
      href: "#statistics", 
      isActive: currentSection === "statistics",
      icon: <Brain className="h-4 w-4" />,
      section: "statistics" as FundamentalsSectionType,
      onClick: () => onSectionChange("statistics" as FundamentalsSectionType)
    },
    { 
      title: "Visualisations Mathématiques", 
      href: "#mathvisuals", 
      isActive: currentSection === "mathvisuals",
      icon: <ChartBar className="h-4 w-4" />,
      section: "mathvisuals" as FundamentalsSectionType,
      onClick: () => {
        onSectionChange("mathvisuals" as FundamentalsSectionType);
        // Scroll vers la section mathvisuals
        setTimeout(() => {
          const element = document.getElementById("mathvisuals");
          if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
              top: elementPosition - offset,
              behavior: "smooth"
            });
          }
        }, 100);
      }
    },
    { 
      title: "Programmation", 
      href: "#programming", 
      isActive: currentSection === "programming",
      icon: <Code className="h-4 w-4" />,
      section: "programming" as FundamentalsSectionType,
      onClick: () => onSectionChange("programming" as FundamentalsSectionType)
    },
    { 
      title: "Visualisation de données", 
      href: "#dataviz", 
      isActive: currentSection === "dataviz",
      icon: <LightbulbIcon className="h-4 w-4" />,
      section: "dataviz" as FundamentalsSectionType,
      onClick: () => onSectionChange("dataviz" as FundamentalsSectionType)
    },
    { 
      title: "Traitement des données", 
      href: "#dataprocessing", 
      isActive: currentSection === "dataprocessing",
      icon: <History className="h-4 w-4" />,
      section: "dataprocessing" as FundamentalsSectionType,
      onClick: () => onSectionChange("dataprocessing" as FundamentalsSectionType)
    },
  ];

  return { items: sidebarItems };
};

export default FundamentalsSidebar;
