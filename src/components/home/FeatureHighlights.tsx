
import { useSyncExternalStore } from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { asset } from "@/lib/asset";
import { SITE_NAME } from "@/config/site";
import { getQuizAttempts, subscribeQuizAttempts } from "@/lib/quiz-storage";
import { useProgressSummary } from "@/hooks/use-course-progress";

const features = [
  {
    title: "Apprentissage structuré",
    description: "Parcours progressifs, des bases aux notions avancées"
  },
  {
    title: "Contenu théorique approfondi",
    description: "Concepts expliqués avec clarté et rigueur"
  },
  {
    title: "Code exécuté dans votre navigateur",
    description: "Python (pandas, scikit-learn), SQL et JavaScript, sans rien installer"
  },
  {
    title: "Projets pratiques",
    description: "Des fiches de projets classées par niveau et par domaine"
  },
  {
    title: "Glossaire et ressources",
    description: "Définitions, livres, sites et outils sélectionnés"
  },
  {
    title: "Quiz et mode hors ligne",
    description: "Suivez vos résultats ; le site s'installe et fonctionne sans connexion"
  },
];

// Exemple affiché : il s'exécute tel quel dans l'éditeur de code (Python, scikit-learn fournis par le site)
const EXAMPLE_CODE = `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

# Charger un jeu de données d'exemple (fleurs d'iris)
X, y = load_iris(return_X_y=True)

# Séparer entraînement et test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=0
)

print(f"Entraînement : {X_train.shape}")
print(f"Test : {X_test.shape}")`;

/** Progression et résultats de quiz du visiteur : lus dans son navigateur, jamais inventés */
const YourProgress = () => {
  const progress = useProgressSummary();
  const attempts = useSyncExternalStore(subscribeQuizAttempts, getQuizAttempts);
  const best = attempts.reduce((max, attempt) => Math.max(max, attempt.score), 0);
  const last = attempts[0];
  const hasProgress = progress.done + progress.started > 0;

  return (
    <>
      <div className="bg-background rounded-lg shadow-lg p-4">
        <h4 className="text-sm font-medium mb-2">Votre progression</h4>
        {hasProgress ? (
          <div className="grid grid-cols-2 gap-2 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{progress.done}</div>
              <div className="text-xs text-muted-foreground">terminé{progress.done > 1 ? "s" : ""}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{progress.started}</div>
              <div className="text-xs text-muted-foreground">en cours</div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Aucun module commencé pour l'instant.{" "}
            <Link to="/courses" className="text-blue-500 underline hover:no-underline">Voir les cours</Link>
          </p>
        )}
        <p className="mt-2 text-[11px] text-muted-foreground">Enregistré dans ce navigateur uniquement.</p>
      </div>

      <div className="bg-background rounded-lg shadow-lg p-4">
        <h4 className="text-sm font-medium mb-2">Vos quiz</h4>
        {attempts.length > 0 ? (
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{best} %</div>
            <div className="text-xs text-muted-foreground">
              meilleur score sur {attempts.length} quiz terminé{attempts.length > 1 ? "s" : ""}
            </div>
            {last && <div className="mt-1 text-xs text-muted-foreground truncate">Dernier : {last.category}, {last.score} %</div>}
            <Link to="/quiz" className="mt-2 inline-block text-xs text-blue-500 underline hover:no-underline">Voir l'historique</Link>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Aucun quiz terminé pour l'instant.{" "}
            <Link to="/quiz" className="text-blue-500 underline hover:no-underline">Faire un quiz</Link>
          </p>
        )}
      </div>
    </>
  );
};

const FeatureHighlights = () => {
  return (
    <section className="py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Pourquoi apprendre avec <span className="gradient-heading">{SITE_NAME}</span> ?
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Ce site combine des explications théoriques rigoureuses avec des exemples de code
              que vous pouvez exécuter vous-même, gratuitement et sans créer de compte.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-ds-blue-100 to-ds-purple-100 rounded-2xl p-8 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-6 w-full max-w-md">
                {/* Code snippet */}
                <div className="col-span-2 bg-background rounded-lg shadow-lg p-4 min-w-0">
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <span className="text-sm font-medium">exemple.py</span>
                    <Link to="/fundamentals/programming#code-editor" className="text-xs text-blue-500 underline hover:no-underline">
                      Essayer dans l'éditeur
                    </Link>
                  </div>
                  <pre className="text-xs sm:text-sm font-mono overflow-x-auto">
                    <code className="language-python">{EXAMPLE_CODE}</code>
                  </pre>
                </div>

                <YourProgress />
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full bg-gradient-to-br from-ds-blue-500/20 to-ds-purple-500/20 rounded-2xl"></div>
          </div>
        </div>
      </div>
      <div className="relative h-[500px] w-full mt-12">
        <img
          src={asset("svg/data_science_explorer_apprentissage.svg")}
          alt="Composants d'une expérience d'apprentissage : parcours, quiz, éditeur de code, glossaire et ressources"
          className="absolute top-0 left-0 w-full h-full opacity-80"
        />
      </div>
    </section>
  );
};

export default FeatureHighlights;
