
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { GlossaryTerm } from "@/components/ui/glossary-term";
import { mlDefinitions } from "@/data/glossary/ml-definitions";

const confusionMatrixData = [
  { name: 'True Positive', value: 120 },
  { name: 'False Positive', value: 15 },
  { name: 'False Negative', value: 20 },
  { name: 'True Negative', value: 140 }
];

const COLORS = ['#0088FE', '#FF8042', '#FFBB28', '#00C49F'];

const learningCurveData = [
  { samples: 10, trainingError: 0.02, validationError: 0.6 },
  { samples: 50, trainingError: 0.06, validationError: 0.45 },
  { samples: 100, trainingError: 0.09, validationError: 0.35 },
  { samples: 200, trainingError: 0.11, validationError: 0.28 },
  { samples: 500, trainingError: 0.13, validationError: 0.22 },
  { samples: 1000, trainingError: 0.14, validationError: 0.19 },
];

const EvaluationSection = () => {
  return (
    <section id="evaluation" className="space-y-8">
      <h2 className="text-3xl font-bold mb-6">Évaluation des Modèles</h2>
      
      <p className="text-lg mb-8">
        L'<GlossaryTerm definition={mlDefinitions["evaluation-modele"]}>évaluation</GlossaryTerm> permet de mesurer les performances d'un modèle de machine learning et de comparer
        différentes approches pour sélectionner la plus appropriée.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <h3 className="text-xl font-semibold mb-4">Métriques pour la classification</h3>
          <div className="space-y-3">
            <div className="border p-3 rounded-md">
              <p className="font-medium">Exactitude (Accuracy)</p>
              <p className="text-sm text-muted-foreground">Proportion de prédictions correctes parmi toutes les prédictions</p>
              <p className="text-sm font-mono mt-1">Accuracy = (TP + TN) / (TP + TN + FP + FN)</p>
            </div>
            <div className="border p-3 rounded-md">
              <p className="font-medium">
                <GlossaryTerm definition={mlDefinitions["precision"]}>Précision (Precision)</GlossaryTerm>
              </p>
              <p className="text-sm text-muted-foreground">Proportion des positifs identifiés qui sont réellement positifs</p>
              <p className="text-sm font-mono mt-1">Precision = TP / (TP + FP)</p>
            </div>
            <div className="border p-3 rounded-md">
              <p className="font-medium">
                <GlossaryTerm definition={mlDefinitions["rappel"]}>Rappel (Recall)</GlossaryTerm>
              </p>
              <p className="text-sm text-muted-foreground">Proportion des positifs réels qui ont été correctement identifiés</p>
              <p className="text-sm font-mono mt-1">Recall = TP / (TP + FN)</p>
            </div>
            <div className="border p-3 rounded-md">
              <p className="font-medium">
                <GlossaryTerm definition={mlDefinitions["f1-score"]}>F1-Score</GlossaryTerm>
              </p>
              <p className="text-sm text-muted-foreground">Moyenne harmonique de la précision et du rappel</p>
              <p className="text-sm font-mono mt-1">F1 = 2 * (Precision * Recall) / (Precision + Recall)</p>
            </div>
            <div className="border p-3 rounded-md">
              <p className="font-medium">
                <GlossaryTerm definition={mlDefinitions["auc-roc"]}>AUC-ROC</GlossaryTerm>
              </p>
              <p className="text-sm text-muted-foreground">Aire sous la courbe ROC, mesure la capacité du modèle à distinguer les classes</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Métriques pour la régression</h3>
          <div className="space-y-3">
            <div className="border p-3 rounded-md">
              <p className="font-medium">
                <GlossaryTerm definition={mlDefinitions["mse"]}>MSE (Mean Squared Error)</GlossaryTerm>
              </p>
              <p className="text-sm text-muted-foreground">Moyenne des carrés des erreurs</p>
              <p className="text-sm font-mono mt-1">MSE = (1/n) * Σ(y_i - ŷ_i)²</p>
            </div>
            <div className="border p-3 rounded-md">
              <p className="font-medium">
                <GlossaryTerm definition={mlDefinitions["rmse"]}>RMSE (Root Mean Squared Error)</GlossaryTerm>
              </p>
              <p className="text-sm text-muted-foreground">Racine carrée de MSE</p>
              <p className="text-sm font-mono mt-1">RMSE = √MSE</p>
            </div>
            <div className="border p-3 rounded-md">
              <p className="font-medium">MAE (Mean Absolute Error)</p>
              <p className="text-sm text-muted-foreground">Moyenne des valeurs absolues des erreurs</p>
              <p className="text-sm font-mono mt-1">MAE = (1/n) * Σ|y_i - ŷ_i|</p>
            </div>
            <div className="border p-3 rounded-md">
              <p className="font-medium">
                <GlossaryTerm definition={mlDefinitions["r-carre"]}>R² (Coefficient de détermination)</GlossaryTerm>
              </p>
              <p className="text-sm text-muted-foreground">Proportion de la variance expliquée par le modèle</p>
              <p className="text-sm font-mono mt-1">R² = 1 - (Σ(y_i - ŷ_i)² / Σ(y_i - ȳ)²)</p>
            </div>
          </div>

          <div className="mt-8 mb-4">
            <h3 className="text-xl font-semibold mb-4">
              <GlossaryTerm definition={mlDefinitions["matrice-confusion"]}>Matrice de confusion</GlossaryTerm>
            </h3>
            <p className="mb-4 text-sm">
              Tableau qui montre les prédictions correctes et incorrectes pour chaque classe.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-10 mt-10 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl">
        <h3 className="text-xl font-semibold mb-6">Visualisation : Matrice de confusion</h3>
        <div className="flex justify-center mb-8 mt-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={confusionMatrixData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8">
                {confusionMatrixData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Exemple illustratif : 295 prédictions fictives (exactitude ≈ 88 %, précision ≈ 89 %, rappel ≈ 86 %), pas un résultat mesuré.
        </p>
      </div>

      <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl">
        <h3 className="text-xl font-semibold mb-6">Courbe d'apprentissage</h3>
        <p className="mb-4">
          Les courbes d'apprentissage montrent comment l'erreur d'entraînement et de validation évoluent
          en fonction du nombre d'échantillons d'apprentissage.
        </p>
        <div className="flex justify-center mt-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={learningCurveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="samples" label={{ value: 'Nombre d\'échantillons', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Erreur', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="trainingError" name="Erreur d'entraînement" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="validationError" name="Erreur de validation" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Courbes illustratives (valeurs inventées pour montrer la forme typique) : l'erreur d'entraînement augmente avec le nombre d'exemples, l'erreur de validation diminue, et les deux se rapprochent.
        </p>
        <div className="mt-4 text-sm">
          <p className="font-medium">Interprétation :</p>
          <ul className="list-disc pl-6 mt-2">
            <li>
              <span className="font-medium">
                <GlossaryTerm definition={mlDefinitions["underfitting"]} highlightStyle="dotted">High Bias (sous-apprentissage)</GlossaryTerm>
              </span> : Erreurs d'entraînement et de validation élevées
            </li>
            <li>
              <span className="font-medium">
                <GlossaryTerm definition={mlDefinitions["overfitting"]} highlightStyle="dotted">High Variance (sur-apprentissage)</GlossaryTerm>
              </span> : Erreur d'entraînement faible mais erreur de validation élevée
            </li>
            <li><span className="font-medium">Bon équilibre</span> : Erreurs d'entraînement et de validation proches et relativement faibles</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default EvaluationSection;
