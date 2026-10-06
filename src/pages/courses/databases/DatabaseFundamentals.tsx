import { Database, Play, CheckCircle2, BookOpen } from "lucide-react";
import CourseLayout from "@/components/layout/CourseLayout";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";
import LessonModuleView from "@/components/courses/lessons/LessonModuleView";
import { databaseFundamentalsCourse } from "@/data/lessons/database-fundamentals";
import { totalDuration } from "@/lib/lessons/duration";

const COURSE = databaseFundamentalsCourse;
const TOTAL = totalDuration(COURSE.modules.map((m) => m.duration));

/**
 * Cours « Fondamentaux des bases de données » : modules rédigés (src/data/lessons/database-fundamentals),
 * exemples et exercices exécutés par le vrai SQLite du site, exercices vérifiés en comparant les résultats.
 */
const DatabaseFundamentals = () => (
  <CourseLayout title="Fondamentaux des bases de données" categoryName="Bases de données" courseName="Fondamentaux des bases de données">
    <div className="space-y-8">
      <UnifiedHeroSection
        variant="course"
        titleAs="h2"
        title="Fondamentaux des bases de données"
        description="Du premier SELECT aux index, en passant par la modélisation et un aperçu du NoSQL : chaque exemple et chaque exercice tourne dans votre navigateur."
        icon={Database}
        courseInfo={{
          level: "Débutant",
          duration: `${TOTAL} (indicatif)`,
          modules: COURSE.modules.length,
        }}
      />

      <section className="rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/40">
        <h2 className="mb-3 text-xl font-semibold text-blue-950 dark:text-blue-100">Comment ça marche</h2>
        <ul className="grid grid-cols-1 gap-3 text-sm text-blue-950 md:grid-cols-3 dark:text-blue-100">
          <li className="flex gap-2">
            <Play className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span>Les exemples sont modifiables : changez une requête, cliquez sur « Exécuter », le vrai moteur SQLite répond.</span>
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span>Les exercices sont vérifiés : votre résultat est comparé à celui du corrigé, sur les mêmes données. Plusieurs requêtes différentes peuvent être justes.</span>
          </li>
          <li className="flex gap-2">
            <BookOpen className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span>Votre progression et vos notes restent dans ce navigateur. La base d'exemple est recréée à chaque exécution : vous ne pouvez rien casser.</span>
          </li>
        </ul>
      </section>

      <section aria-labelledby="modules-titre" className="space-y-4">
        <h2 id="modules-titre" className="text-2xl font-bold">Les modules</h2>
        {COURSE.modules.map((module, index) => (
          <LessonModuleView key={module.id} courseId={COURSE.id} module={module} number={index + 1} defaultOpen={index === 0} />
        ))}
      </section>

      <section className="rounded-xl border border-slate-200 p-5 dark:border-slate-700">
        <h2 className="mb-2 text-xl font-semibold">Et ensuite ?</h2>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Le SQL de ce cours est celui de SQLite. PostgreSQL et MySQL, très utilisés sur les serveurs, parlent presque le même langage :
          les différences portent surtout sur les dates, quelques fonctions et les types. Pour continuer sans rien installer,
          l'éditeur de la page Programmation exécute aussi du SQL, et la page Bases de données des fondamentaux reprend ces notions sous un autre angle.
        </p>
      </section>
    </div>
  </CourseLayout>
);

export default DatabaseFundamentals;
