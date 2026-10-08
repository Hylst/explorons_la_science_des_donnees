import { Code } from "lucide-react";
import { Link } from "react-router-dom";
import LessonCoursePage from "@/components/courses/lessons/LessonCoursePage";
import { pythonCourse } from "@/data/lessons/python";

/** Cours « Python pour la data science » : modules dans src/data/lessons/python (identifiants module-1 à module-7 conservés) */
const PythonBasics = () => (
  <LessonCoursePage
    course={pythonCourse}
    title="Python pour la data science"
    categoryName="Programmation"
    description="Des premières lignes de Python à NumPy, pandas et Matplotlib : chaque exemple s'exécute dans votre navigateur, chaque exercice est vérifié."
    level="Débutant"
    icon={Code}
    language="python"
    next={
      <>
        <p>
          Pour continuer : le cours <Link to="/courses/databases/database-fundamentals" className="text-primary underline">Fondamentaux des bases de données</Link> pour
          SQL, puis <Link to="/courses/statistics/applied-statistics" className="text-primary underline">Statistiques appliquées</Link> et{" "}
          <Link to="/courses/machine-learning/supervised-learning" className="text-primary underline">Machine learning supervisé</Link>, qui réutilisent NumPy,
          pandas et Matplotlib. Les <Link to="/projects" className="text-primary underline">projets guidés</Link> mettent tout bout à bout.
        </p>
        <p className="mt-3">
          Les documentations officielles restent les meilleures références : le tutoriel de docs.python.org, les guides de démarrage de numpy.org,
          pandas.pydata.org et matplotlib.org.
        </p>
      </>
    }
  />
);

export default PythonBasics;
