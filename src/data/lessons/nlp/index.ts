import type { LessonCourse } from "@/lib/lessons/types";
import { moduleFoundations } from "./m1-foundations";
import { modulePreprocessing } from "./m2-preprocessing";
import { moduleFeatures } from "./m3-features";
import { moduleSentiment } from "./m4-sentiment";
import { moduleEntities } from "./m5-entities";
import { moduleTransformers } from "./m6-transformers";
import { moduleGeneration } from "./m7-generation";
import { moduleChatbot } from "./m8-chatbot";

/** Cours « Traitement du langage naturel » : 8 modules rédigés, exécutés avec Python, re, NumPy et scikit-learn (Pyodide) */
export const nlpCourse: LessonCourse = {
  id: "natural-language-processing",
  modules: [
    moduleFoundations,
    modulePreprocessing,
    moduleFeatures,
    moduleSentiment,
    moduleEntities,
    moduleTransformers,
    moduleGeneration,
    moduleChatbot,
  ],
};
