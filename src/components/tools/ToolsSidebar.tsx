import { useLocation } from "react-router-dom";
import {
  Code2,
  Database,
  LineChart,
  BarChart3,
  BrainCircuit,
  BookOpen,
  Wrench
} from "lucide-react";

/** Navigation des pages d'outils : chaque entrée est une vraie page (ou une ancre d'une vraie page) */
export const useToolsSidebar = () => {
  const { pathname } = useLocation();

  const entries = [
    { title: "Vue d'ensemble", href: "/tools", icon: <Wrench className="h-4 w-4" /> },
    { title: "Langages de programmation", href: "/tools/programming", icon: <Code2 className="h-4 w-4" /> },
    { title: "Outils de traitement des données", href: "/tools/data-processing", icon: <Database className="h-4 w-4" /> },
    { title: "Frameworks de Machine Learning", href: "/tools/ml-frameworks", icon: <BrainCircuit className="h-4 w-4" /> },
    { title: "Outils de visualisation", href: "/tools/visualization", icon: <LineChart className="h-4 w-4" /> },
    { title: "Outils de Business Intelligence", href: "/tools/visualization#bi-tools", icon: <BarChart3 className="h-4 w-4" /> },
    { title: "Livres, cours et formations", href: "/resources", icon: <BookOpen className="h-4 w-4" /> }
  ];

  return { items: entries.map((entry) => ({ ...entry, isActive: !entry.href.includes("#") && entry.href === pathname })) };
};
