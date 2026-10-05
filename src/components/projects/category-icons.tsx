import {
  Brain,
  BarChart3,
  Database,
  Image,
  Zap,
  Globe,
  TrendingUp,
  Users,
  Calculator,
  PieChart
} from "lucide-react";

/** Icône de chaque catégorie de projet (identifiants définis dans data/projects.ts) */
export const categoryIcon = (category: string, className = "h-6 w-6") => {
  switch (category) {
    case "analyse": return <BarChart3 className={className} />;
    case "machine learning": return <Brain className={className} />;
    case "visualisation": return <PieChart className={className} />;
    case "nlp": return <Globe className={className} />;
    case "recommandation": return <Users className={className} />;
    case "regression": return <Calculator className={className} />;
    case "anomaly-detection": return <Zap className={className} />;
    case "computer-vision": return <Image className={className} />;
    case "finance": return <TrendingUp className={className} />;
    default: return <Database className={className} />;
  }
};
