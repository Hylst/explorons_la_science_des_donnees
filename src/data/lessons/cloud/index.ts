import type { LessonCourse } from "@/lib/lessons/types";
import { moduleCloudIntro } from "./m1-cloud-de-quoi-parle-t-on";
import { moduleStockageObjet } from "./m2-stockage-objet";
import { moduleCalcul } from "./m3-calcul-conteneurs-fonctions";
import { moduleCouts } from "./m4-estimer-couts";
import { moduleGrandeEchelle } from "./m5-donnees-grande-echelle";
import { moduleSecurite } from "./m6-securite-donnees-personnelles";

/** Cours « Le cloud pour la data science » : neutre entre fournisseurs, commandes à lire, pratique en Python sur des simulations */
export const cloudCourse: LessonCourse = {
  id: "cloud-data-science",
  modules: [
    moduleCloudIntro,
    moduleStockageObjet,
    moduleCalcul,
    moduleCouts,
    moduleGrandeEchelle,
    moduleSecurite,
  ],
};
