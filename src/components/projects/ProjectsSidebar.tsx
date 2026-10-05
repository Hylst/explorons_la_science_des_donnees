
import {
  Target,
  BarChart3,
  TrendingUp,
  Search,
  Filter,
  BookOpen,
  Rocket
} from "lucide-react";
import { scrollToSection } from "@/lib/scroll";

export type ProjectsSectionType = "overview" | "stats" | "search" | "categories" | "beginner" | "intermediate" | "advanced";

interface ProjectsSidebarProps {
  currentSection: ProjectsSectionType;
  onSectionChange: (section: ProjectsSectionType) => void;
}

const SECTIONS: { section: ProjectsSectionType; title: string; icon: React.ReactNode }[] = [
  { section: "overview", title: "Vue d'ensemble", icon: <BookOpen className="h-4 w-4" /> },
  { section: "stats", title: "Les projets en chiffres", icon: <BarChart3 className="h-4 w-4" /> },
  { section: "search", title: "Recherche et filtres", icon: <Search className="h-4 w-4" /> },
  { section: "categories", title: "Catégories", icon: <Filter className="h-4 w-4" /> },
  { section: "beginner", title: "Projets débutants", icon: <Target className="h-4 w-4" /> },
  { section: "intermediate", title: "Projets intermédiaires", icon: <TrendingUp className="h-4 w-4" /> },
  { section: "advanced", title: "Projets avancés", icon: <Rocket className="h-4 w-4" /> }
];

const ProjectsSidebar = ({ currentSection, onSectionChange }: ProjectsSidebarProps) => {
  const sidebarItems = SECTIONS.map(({ section, title, icon }) => ({
    title,
    href: `#${section}`,
    isActive: currentSection === section,
    icon,
    section,
    onClick: () => {
      onSectionChange(section);
      scrollToSection(section);
    }
  }));

  return { items: sidebarItems };
};

export default ProjectsSidebar;
