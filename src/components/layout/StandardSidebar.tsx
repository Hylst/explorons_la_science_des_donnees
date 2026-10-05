
import React from "react";
import { Home } from "lucide-react";

interface StandardSidebarProps {
  currentPage?: string;
  sections?: Array<{
    title: string;
    href: string;
    icon?: React.ReactNode;
  }>;
}

export const createStandardSidebar = ({ currentPage, sections = [] }: StandardSidebarProps) => {
  const defaultSections = [
    {
      title: "Accueil",
      href: "/",
      icon: <Home className="h-4 w-4" />,
      isActive: currentPage === "home"
    }
  ];

  const customSections = sections.map(section => ({
    ...section,
    isActive: false
  }));

  return { items: [...defaultSections, ...customSections] };
};
