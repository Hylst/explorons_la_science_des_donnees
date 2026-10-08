import { Layers } from "lucide-react";
import { Link } from "react-router-dom";
import LessonCoursePage from "@/components/courses/lessons/LessonCoursePage";
import { transformersCourse } from "@/data/lessons/transformers";

/** Cours « Transformers en machine learning » : modules dans src/data/lessons/transformers */
const TransformersGuide = () => (
  <LessonCoursePage
    course={transformersCourse}
    title="Transformers en machine learning"
    categoryName="Machine Learning"
    description="Les deux sens du mot : les transformations de données de scikit-learn (mise à l'échelle, encodage, pipelines), puis l'architecture Transformer (attention multi-têtes, BERT, GPT, ViT), programmées en NumPy."
    level="Intermédiaire"
    icon={Layers}
    language="python"
    next={
      <p>
        Le cours de{" "}
        <Link to="/courses/nlp/natural-language-processing" className="text-primary underline">traitement du langage naturel</Link> pose les bases
        de l'attention et de la génération de texte ; le{" "}
        <Link to="/courses/machine-learning/supervised-learning" className="text-primary underline">cours de machine learning supervisé</Link> utilise
        les pipelines de prétraitement vus ici.
      </p>
    }
  />
);

export default TransformersGuide;
