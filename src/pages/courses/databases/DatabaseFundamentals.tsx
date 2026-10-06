import { Database } from "lucide-react";
import LessonCoursePage from "@/components/courses/lessons/LessonCoursePage";
import { databaseFundamentalsCourse } from "@/data/lessons/database-fundamentals";

/** Cours « Fondamentaux des bases de données » : modules dans src/data/lessons/database-fundamentals */
const DatabaseFundamentals = () => (
  <LessonCoursePage
    course={databaseFundamentalsCourse}
    title="Fondamentaux des bases de données"
    categoryName="Bases de données"
    description="Du premier SELECT aux index, en passant par la modélisation et un aperçu du NoSQL : chaque exemple et chaque exercice tourne dans votre navigateur."
    level="Débutant"
    icon={Database}
    language="sql"
    next={
      <p>
        Le SQL de ce cours est celui de SQLite. PostgreSQL et MySQL, très utilisés sur les serveurs, parlent presque le même langage : les
        différences portent surtout sur les dates, quelques fonctions et les types. Pour continuer sans rien installer, l'éditeur de la page
        Programmation exécute aussi du SQL, et la page Bases de données des fondamentaux reprend ces notions sous un autre angle.
      </p>
    }
  />
);

export default DatabaseFundamentals;
