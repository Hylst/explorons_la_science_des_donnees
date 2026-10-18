
import React from "react";
import { EducationalCard, QuizCard } from "@/components/ui/educational-cards";
import { Button } from "@/components/ui/button";
import LessonExercise from "@/components/courses/lessons/LessonExercise";
import RunnableCode from "@/components/courses/lessons/RunnableCode";
import { ML_EXERCISES, ML_PROGRAMS, type MlExercise } from "@/data/ml-practical";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { CheckCircle, Code, Copy, Download, ExternalLink, Lightbulb, Target, Zap } from "lucide-react";

/** Progression des deux exercices de la page : un élément « done » par exercice, posé après une vérification réussie */
const COURSE_ID = "ml-exercises";

const DIFFICULTY_COLORS: Record<MlExercise["difficulty"], string> = {
  "débutant": "bg-green-100 text-green-800",
  "intermédiaire": "bg-yellow-100 text-yellow-800",
  "avancé": "bg-red-100 text-red-800",
};

/** Un exercice : énoncé, exercice vérifié sur le cœur de la solution, pistes, solution complète (exécutable ou à lire) */
const MlExerciseCard = ({ exercise, number, done, onSolved }: { exercise: MlExercise; number: number; done: boolean; onSolved: () => void }) => {
  const [showHints, setShowHints] = React.useState(false);
  const [showSolution, setShowSolution] = React.useState(false);
  return (
    <EducationalCard title={exercise.title} type="exercice">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className={DIFFICULTY_COLORS[exercise.difficulty]}>{exercise.difficulty}</Badge>
          <Badge variant="outline">{exercise.estimatedTime}</Badge>
          {done && (
            <Badge className="bg-green-700 text-white gap-1">
              <CheckCircle className="h-3 w-3" aria-hidden="true" />
              réussi
            </Badge>
          )}
        </div>
        <div className="bg-white p-6 rounded-xl border-2 shadow-sm">
          <h4 className="font-semibold mb-3 text-gray-800">Énoncé :</h4>
          <p className="text-gray-700 leading-relaxed">{exercise.problem}</p>
        </div>
        <LessonExercise exercise={exercise.exercise} number={number} title="Exercice vérifié : le cœur de la solution" onSolved={onSolved} />
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowHints((v) => !v)} className="whitespace-normal h-auto min-h-9">
            <Lightbulb className="h-4 w-4 mr-1" aria-hidden="true" />
            {showHints ? "Masquer les pistes" : "Pistes pour le projet complet"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowSolution((v) => !v)} className="whitespace-normal h-auto min-h-9">
            <Code className="h-4 w-4 mr-1" aria-hidden="true" />
            {showSolution ? "Masquer la solution complète" : "Voir la solution complète"}
          </Button>
        </div>
        {showHints && (
          <ul className="text-sm space-y-1 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
            {exercise.hints.map((hint) => <li key={hint}>• {hint}</li>)}
          </ul>
        )}
        {showSolution && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">{exercise.solutionNote}</p>
            {exercise.solutionRunnable ? (
              <RunnableCode language="python" code={exercise.solution} label={`Solution complète de l'exercice « ${exercise.title} », modifiable`} />
            ) : (
              <pre className="bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm"><code>{exercise.solution}</code></pre>
            )}
          </div>
        )}
      </div>
    </EducationalCard>
  );
};

const PracticalExercisesSection = () => {
  const [activeCode, setActiveCode] = React.useState(0);
  const [copiedCode, setCopiedCode] = React.useState<number | null>(null);

  const codeExamples = ML_PROGRAMS;
  const { statusOf, setStatus } = useCourseProgress(COURSE_ID);

  const copyToClipboard = (code: string, index: number) => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopiedCode(index);
      setTimeout(() => setCopiedCode(null), 2000);
    }).catch(() => {
      // Presse-papiers indisponible (contexte non sécurisé, autorisation refusée) : le bouton Télécharger reste utilisable.
    });
  };

  const downloadCode = (example: { title: string; code: string }) => {
    const slug = example.title.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
    const url = URL.createObjectURL(new Blob([example.code], { type: "text/x-python;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slug}.py`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="practical-exercises" className="space-y-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Exercices pratiques et exemples de code
        </h2>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          Trois programmes complets, deux exercices vérifiés par le moteur du site (votre réussite est enregistrée dans ce navigateur), deux questions de quiz et des pistes pour un projet de recommandation
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Badge className="bg-purple-100 text-purple-800 px-4 py-2">Code complet</Badge>
          <Badge className="bg-blue-100 text-blue-800 px-4 py-2">Données synthétiques</Badge>
          <Badge className="bg-green-100 text-green-800 px-4 py-2">Cas d'usage</Badge>
        </div>
      </div>

      {/* Code Examples */}
      <EducationalCard title="Trois programmes complets" type="exemple">
        <div className="space-y-8">
          <div className="text-center mb-6">
            <p className="text-lg text-gray-700 mb-4">
              Le deuxième programme s'exécute dans cette page ; les deux autres se copient ou se téléchargent pour votre
              propre environnement Python (numpy, pandas, matplotlib et scikit-learn, plus seaborn pour le premier), et la
              page dit pourquoi. Les données du deuxième et du troisième sont générées par le code lui-même, avec une graine fixée.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {codeExamples.map((example, index) => (
              <button
                key={index}
                onClick={() => setActiveCode(index)}
                className={`min-w-0 p-6 rounded-xl text-left transition-all duration-500 border-2 hover:scale-105 ${
                  activeCode === index
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl border-blue-500"
                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-lg"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h4 className="font-bold text-lg min-w-0 break-words">{example.title}</h4>
                  <Badge className={`${activeCode === index ? 'bg-white text-blue-600' : 'bg-gray-100 text-gray-700'}`}>
                    {example.difficulty}
                  </Badge>
                </div>
                <p className={`text-sm mb-3 ${activeCode === index ? 'text-blue-100' : 'text-gray-600'}`}>
                  {example.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${activeCode === index ? 'text-blue-200' : 'text-gray-500'}`}>
                    Durée indicative : {example.estimatedTime}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <Card className="border-2 hover:shadow-2xl transition-all duration-500">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 p-3 rounded-lg">
                    <Code className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{codeExamples[activeCode].title}</CardTitle>
                    <CardDescription className="text-lg mt-1">{codeExamples[activeCode].description}</CardDescription>
                    <div className="flex items-center gap-4 mt-3">
                      <Badge className="bg-blue-100 text-blue-800">
                        {codeExamples[activeCode].difficulty}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800">
                        {codeExamples[activeCode].estimatedTime} (indicatif)
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => copyToClipboard(codeExamples[activeCode].code, activeCode)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    {copiedCode === activeCode ? (
                      <>
                        <span className="text-green-300">✓</span>
                        Copié
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copier le code
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadCode(codeExamples[activeCode])}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg">
                    <Download className="h-4 w-4" />
                    Télécharger
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <p className="px-6 pt-4 text-sm text-muted-foreground">{codeExamples[activeCode].note}</p>
              {codeExamples[activeCode].runnable ? (
                <div className="p-4">
                  <RunnableCode
                    key={codeExamples[activeCode].id}
                    language="python"
                    code={codeExamples[activeCode].code}
                    label={`Programme « ${codeExamples[activeCode].title} », modifiable`}
                  />
                </div>
              ) : (
                <div className="bg-gray-950 text-gray-100 p-8 overflow-x-auto">
                  <pre className="text-sm leading-relaxed">
                    <code>{codeExamples[activeCode].code}</code>
                  </pre>
                </div>
              )}
              
              {/* Outputs section */}
              <div className="bg-green-50 p-6 border-t-4 border-green-500">
                <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Résultats obtenus sur le moteur du site (scikit-learn 1.8, graine aléatoire fixée) :
                </h4>
                <div className="space-y-2">
                  {codeExamples[activeCode].outputs.map((output, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border border-green-200">
                      <code className="text-sm text-green-700">{output}</code>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </EducationalCard>

      {/* Practical Exercises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {ML_EXERCISES.map((exercise, index) => (
          <MlExerciseCard
            key={exercise.id}
            exercise={exercise}
            number={index + 1}
            done={statusOf(exercise.id) === "done"}
            onSolved={() => setStatus(exercise.id, "done")}
          />
        ))}
      </div>

      {/* Quiz avancés */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <QuizCard
          question="Dans un problème de classification avec des classes très déséquilibrées (99% classe A, 1% classe B), quelle stratégie d'évaluation est la plus appropriée ?"
          options={[
            "Utiliser uniquement l'accuracy globale",
            "Se concentrer sur la précision de la classe majoritaire",
            "Utiliser l'AUC-ROC et l'Average Precision avec validation stratifiée",
            "Équilibrer artificiellement le dataset de test"
          ]}
          correctAnswer={2}
          explanation="Avec 99 % d'exemples de la classe A, un modèle qui répond toujours A a une exactitude de 99 % : cette mesure ne dit presque rien. L'AUC-ROC et la précision moyenne (Average Precision, aire sous la courbe précision-rappel) jugent la qualité du classement des scores indépendamment du seuil de décision. La seconde est plus exigeante quand la classe rare est très rare, car l'AUC-ROC peut rester flatteuse. La validation stratifiée garde la proportion des classes dans chaque pli, et le jeu de test doit conserver la répartition réelle des classes (on ne le rééquilibre pas)."
          difficulty="difficile"
        />

        <QuizCard
          question="Qu'est-ce qui caractérise le mieux le surapprentissage (overfitting) dans un modèle de Machine Learning ?"
          options={[
            "Le modèle a une faible précision sur les données d'entraînement et de test",
            "Le modèle a une haute précision sur l'entraînement mais faible sur le test",
            "Le modèle prend trop de temps à s'entraîner",
            "Le modèle a besoin de plus de données d'entraînement"
          ]}
          correctAnswer={1}
          explanation="Le surapprentissage se caractérise par un modèle qui « mémorise » les données d'entraînement au lieu d'apprendre des régularités qui se généralisent. Il obtient d'excellents résultats sur les données qu'il a vues (entraînement) mais décroche sur de nouvelles données (test). C'est souvent le signe d'un modèle trop complexe pour la quantité de données disponible."
          difficulty="moyen"
        />
      </div>

      <EducationalCard title="Pour aller plus loin : un projet de recommandation pour une boutique en ligne" type="exercice">
        <div className="space-y-8">
          <div className="text-center">
            <p className="text-xl font-medium mb-4">
              Un projet à mener seul, avec vos propres données ou un jeu de données public
            </p>
            <p className="text-gray-600">
              Ce ne sont que des pistes : aucun jeu de données n'est fourni ici. Le catalogue des{" "}
              <Link to="/projects" className="text-blue-700 underline">projets</Link>{" "}
              propose une fiche sur un sujet voisin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-all duration-300">
              <h4 className="font-bold text-blue-800 mb-2">Étape 1 : explorer les données</h4>
              <div className="text-sm space-y-2">
                <p><strong>Un jeu de données typique (exemple fictif) :</strong></p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>environ un million d'interactions utilisateur-produit</li>
                  <li>100 000 utilisateurs et 50 000 produits</li>
                  <li>métadonnées : catégories, prix, marques</li>
                  <li>un historique sur plusieurs mois</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all duration-300">
              <h4 className="font-bold text-green-800 mb-2">Étape 2 : construire des variables</h4>
              <div className="text-sm space-y-2">
                <p><strong>Pistes :</strong></p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>représentations des produits (par exemple Word2Vec appliqué aux paniers)</li>
                  <li>saisonnalité des achats</li>
                  <li>similarités entre utilisateurs</li>
                  <li>profils de comportement</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200 hover:shadow-lg transition-all duration-300">
              <h4 className="font-bold text-purple-800 mb-2">Étape 3 : modéliser</h4>
              <div className="text-sm space-y-2">
                <p><strong>Approches :</strong></p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>factorisation matricielle (SVD, ALS)</li>
                  <li>filtrage collaboratif neuronal</li>
                  <li>combinaison de plusieurs approches</li>
                  <li>mise en service en ligne : un chantier à part</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border-2 border-red-200 hover:shadow-lg transition-all duration-300">
              <h4 className="font-bold text-red-800 mb-2">Étape 4 : mesurer l'effet</h4>
              <div className="text-sm space-y-2">
                <p><strong>Indicateurs :</strong></p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>taux de clic</li>
                  <li>taux de conversion</li>
                  <li>variation du chiffre d'affaires</li>
                  <li>test A/B</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-8 rounded-xl border-2 border-indigo-200">
            <h4 className="font-bold text-indigo-800 mb-6 text-xl text-center">Difficultés techniques à prévoir</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h5 className="font-bold text-red-600 mb-3">Démarrage à froid</h5>
                <p className="text-sm mb-3">Comment recommander à un nouvel utilisateur sans historique ?</p>
                <div className="bg-red-50 p-3 rounded">
                  <p className="text-xs"><strong>Piste :</strong> s'appuyer sur les métadonnées, sur des informations démographiques et sur les produits les plus populaires</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h5 className="font-bold text-blue-600 mb-3">Passage à l'échelle</h5>
                <p className="text-sm mb-3">Comment répondre à un très grand nombre de requêtes par seconde ?</p>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-xs"><strong>Piste :</strong> précalculer les recommandations, utiliser un cache, recourir à des algorithmes de recherche approchée (par exemple LSH)</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h5 className="font-bold text-green-600 mb-3">Diversité et précision</h5>
                <p className="text-sm mb-3">Comment concilier des recommandations précises et la découverte de nouveautés ?</p>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-xs"><strong>Piste :</strong> optimisation de plusieurs objectifs à la fois, compromis entre exploration et exploitation</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h5 className="font-bold text-purple-600 mb-3">Données creuses</h5>
                <p className="text-sm mb-3">Que faire quand presque toute la matrice utilisateur-produit est vide ?</p>
                <div className="bg-purple-50 p-3 rounded">
                  <p className="text-xs"><strong>Piste :</strong> factorisation matricielle, retours implicites (clics, achats), informations annexes sur les produits et les utilisateurs</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-8 rounded-xl border-2 border-yellow-200">
            <h4 className="font-bold text-orange-800 mb-4 text-center">Juger l'effet réel : le test A/B</h4>
            <p className="text-center text-sm text-gray-700 mb-4">
              Un système de recommandation se juge sur ce qu'il change vraiment (clics, achats, satisfaction), pas seulement
              sur sa précision hors ligne. Le gain dépend beaucoup du contexte : aucun chiffre ne peut être promis à l'avance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white p-6 rounded-lg">
                <div className="text-lg font-bold text-green-700">Groupe témoin</div>
                <p className="text-sm text-gray-600">Voit la page habituelle</p>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <div className="text-lg font-bold text-blue-700">Groupe test</div>
                <p className="text-sm text-gray-600">Voit les recommandations</p>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <div className="text-lg font-bold text-purple-700">Comparaison</div>
                <p className="text-sm text-gray-600">Écart des taux de conversion, avec un test statistique</p>
              </div>
            </div>
            <p className="text-center mt-4 text-sm text-gray-700">
              <strong>Objectif :</strong> construire le système, puis décider à partir de la mesure.
            </p>
          </div>
        </div>
      </EducationalCard>

      <EducationalCard title="Outils utiles" type="rappel">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border hover:shadow-lg transition-all duration-300">
            <h4 className="font-bold text-blue-600 mb-3 flex items-center gap-2">
              <Code className="h-5 w-5" />
              Notebooks Jupyter
            </h4>
            <p className="text-sm text-gray-600 mb-3">Environnement interactif pour l'expérimentation</p>
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-blue-500" />
              <a href="https://jupyter.org" target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm hover:underline">jupyter.org</a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border hover:shadow-lg transition-all duration-300">
            <h4 className="font-bold text-green-600 mb-3 flex items-center gap-2">
              <Target className="h-5 w-5" />
              MLflow
            </h4>
            <p className="text-sm text-gray-600 mb-3">Suivi et gestion des expériences ML</p>
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-green-500" />
              <a href="https://mlflow.org" target="_blank" rel="noopener noreferrer" className="text-green-500 text-sm hover:underline">mlflow.org</a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border hover:shadow-lg transition-all duration-300">
            <h4 className="font-bold text-purple-600 mb-3 flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              TensorBoard
            </h4>
            <p className="text-sm text-gray-600 mb-3">Visualisation des métriques d'entraînement</p>
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-purple-500" />
              <a href="https://www.tensorflow.org/tensorboard" target="_blank" rel="noopener noreferrer" className="text-purple-500 text-sm hover:underline">tensorflow.org/tensorboard</a>
            </div>
          </div>
        </div>
      </EducationalCard>
    </section>
  );
};

export default PracticalExercisesSection;
