import { BookOpenCheck } from "lucide-react";
import LessonCoursePage from "@/components/courses/lessons/LessonCoursePage";
import { rLanguageCourse } from "@/data/lessons/r-language";

/** Cours « R pour la data science » : modules dans src/data/lessons/r-language */
const RLanguage = () => (
  <LessonCoursePage
    course={rLanguageCourse}
    title="R pour la data science"
    categoryName="Programmation"
    description="Lire du R quand on connaît Python, ou l'inverse : vecteurs et tableaux, dplyr, ggplot2, tests et régressions. Le code R est à lire ; son équivalent Python s'exécute dans votre navigateur."
    level="Intermédiaire"
    icon={BookOpenCheck}
    language="python"
    next={
      <p>
        Pour exécuter le code R des modules, installez R (et RStudio ou Positron si vous voulez un environnement complet) sur votre
        machine : les jeux iris, stackloss et Nile y sont fournis. Le cours de statistiques appliquées et celui de visualisation de données
        prolongent les modules 3 et 4 en Python.
      </p>
    }
  />
);

export default RLanguage;
