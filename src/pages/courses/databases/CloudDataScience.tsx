import { Cloud } from "lucide-react";
import LessonCoursePage from "@/components/courses/lessons/LessonCoursePage";
import { cloudCourse } from "@/data/lessons/cloud";

/** Cours « Le cloud pour la data science » : modules dans src/data/lessons/cloud */
const CloudDataScience = () => (
  <LessonCoursePage
    course={cloudCourse}
    title="Le cloud pour la data science"
    categoryName="Bases de données"
    description="Stockage objet, calcul, coûts, données trop grosses pour une machine, sécurité et données personnelles : les mécanismes du cloud, sans favori entre fournisseurs, mesurés sur des simulations en Python."
    level="Intermédiaire"
    icon={Cloud}
    language="python"
    next={
      <p>
        Les commandes des fournisseurs citées en code à lire (AWS, Google Cloud, Azure) demandent un compte chez eux ; leurs offres
        gratuites et leurs tarifs changent souvent, vérifiez-les sur leur site. Le cours de bases de données revient sur SQL, et le
        cours MLOps sur la mise en service d'un modèle.
      </p>
    }
  />
);

export default CloudDataScience;
