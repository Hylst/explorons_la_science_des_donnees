import type { LessonCourse } from "@/lib/lessons/types";
import { moduleImagesTableaux } from "./m1-images-tableaux";
import { moduleFiltresConvolution } from "./m2-filtres-convolution";
import { moduleCaracteristiquesClassification } from "./m3-caracteristiques-classification";
import { moduleReseauxConvolutifs } from "./m4-reseaux-convolutifs";
import { moduleAugmentationRobustesse } from "./m5-augmentation-robustesse";
import { moduleTransfertApprentissage } from "./m6-transfert-apprentissage";

/** Cours « Vision par ordinateur » : chiffres manuscrits fournis avec scikit-learn (load_digits), calculs NumPy, scipy et scikit-learn */
export const computerVisionCourse: LessonCourse = {
  id: "computer-vision",
  modules: [
    moduleImagesTableaux,
    moduleFiltresConvolution,
    moduleCaracteristiquesClassification,
    moduleReseauxConvolutifs,
    moduleAugmentationRobustesse,
    moduleTransfertApprentissage,
  ],
};
