import { BarChart3 } from "lucide-react";
import LessonCoursePage from "@/components/courses/lessons/LessonCoursePage";
import { dataVisualizationCourse } from "@/data/lessons/data-visualization";

/** Cours « Visualisation de données » : modules dans src/data/lessons/data-visualization */
const DataVisualization = () => (
  <LessonCoursePage
    course={dataVisualizationCourse}
    title="Visualisation de données"
    categoryName="Visualisation"
    description="Choisir le bon graphique, maîtriser Matplotlib, montrer des distributions, comprendre la grammaire des graphiques, le web et les tableaux de bord."
    level="Intermédiaire"
    icon={BarChart3}
    language="python"
    next={
      <p>
        Les graphiques de ce cours sont produits par Matplotlib, le seul outil de dessin installé dans le moteur Python du site. Seaborn,
        Plotly, Altair et D3.js, présentés en lecture, s'installent sans difficulté sur votre machine, et les principes vus ici s'y appliquent
        tels quels. La page Outils de visualisation compare ces bibliothèques et les outils de tableaux de bord.
      </p>
    }
  />
);

export default DataVisualization;
