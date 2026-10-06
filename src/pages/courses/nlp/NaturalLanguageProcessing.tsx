import { MessageSquare } from "lucide-react";
import LessonCoursePage from "@/components/courses/lessons/LessonCoursePage";
import { nlpCourse } from "@/data/lessons/nlp";

/** Cours « Traitement du langage naturel » : modules dans src/data/lessons/nlp */
const NaturalLanguageProcessing = () => (
  <LessonCoursePage
    course={nlpCourse}
    title="Traitement du langage naturel"
    categoryName="Intelligence artificielle"
    description="Des mots aux nombres, puis aux modèles : nettoyage, TF-IDF, sentiment, entités, attention et génération, jusqu'à un petit assistant de FAQ, le tout exécuté dans votre navigateur."
    level="Intermédiaire"
    icon={MessageSquare}
    language="python"
    next={
      <p>
        Le projet guidé « analyser le sentiment d'avis courts », sur la page Projets, prolonge le module 4. Les cours de machine learning
        supervisé (validation croisée, régression logistique) et le guide des modèles de ML donnent le socle des modèles utilisés ici.
        Pour aller plus loin avec les transformeurs, les bibliothèques spaCy et transformers s'installent sur votre machine.
      </p>
    }
  />
);

export default NaturalLanguageProcessing;
