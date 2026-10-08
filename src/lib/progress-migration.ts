import { isNumberArray, readJSON, readStorage, writeStorage } from "@/lib/storage";
import { markDone } from "@/hooks/use-course-progress";

const ANCIEN = "math-intro-completed";
const FAIT = "math-intro-progress-migrated";

/**
 * Le cours d'introduction aux mathématiques enregistrait ses modules terminés sous la clé « math-intro-completed »
 * (numéros 1 à 5). Depuis son passage au format des cours rédigés (8 octobre 2026), la progression passe par
 * use-course-progress (cours « math-intro », modules « module-1 » à « module-5 ») : on reprend une fois l'ancienne.
 */
export const migrateMathIntroProgress = (): void => {
  if (readStorage(FAIT) === "1") return;
  const termines = readJSON<number[]>(ANCIEN, [], isNumberArray).filter((n) => Number.isInteger(n) && n >= 1 && n <= 5);
  if (termines.length > 0) markDone("math-intro", termines.map((n) => `module-${n}`));
  writeStorage(FAIT, "1");
};
