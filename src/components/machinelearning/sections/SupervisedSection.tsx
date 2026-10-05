
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GlossaryTerm } from "@/components/ui/glossary-term";
import { mlDefinitions } from "@/data/glossary/ml-definitions";

const SupervisedSection = () => {
  return (
    <section id="supervised" className="space-y-8">
      <h2 className="text-3xl font-bold mb-6">Apprentissage Supervisé</h2>
      
      <p className="text-lg mb-6">
        L'<GlossaryTerm definition={mlDefinitions["apprentissage-supervise"]}>apprentissage supervisé</GlossaryTerm> est une approche où l'algorithme apprend à partir de données étiquetées. 
        L'objectif est de prédire des valeurs pour de nouvelles données non étiquetées.
      </p>

      <Tabs defaultValue="classification" className="w-full mb-8">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 mb-6">
          <TabsTrigger value="classification">Classification</TabsTrigger>
          <TabsTrigger value="regression">Régression</TabsTrigger>
        </TabsList>
        
        <TabsContent value="classification" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">
                <GlossaryTerm definition={mlDefinitions["classification"]}>Classification</GlossaryTerm>
              </h3>
              <p className="mb-4">
                La classification consiste à prédire une catégorie ou une classe pour une instance de données. 
                La sortie est discrète (ex: spam/non-spam, malade/sain).
              </p>
              <h4 className="font-medium mt-4 mb-2">Algorithmes populaires :</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Régression logistique</li>
                <li>Arbres de décision</li>
                <li>Forêts aléatoires</li>
                <li>Machines à vecteurs de support (SVM)</li>
                <li>k-plus proches voisins (k-NN)</li>
                <li>Réseaux de neurones</li>
              </ul>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Exemple de code : Classification</CardTitle>
                <CardDescription>Utilisation de Scikit-learn pour un classifieur</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto text-sm">
                  <code>
{`from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Diviser les données
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42
)

# Créer et entraîner le modèle
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Prédictions
y_pred = model.predict(X_test)

# Évaluation
accuracy = accuracy_score(y_test, y_pred)
print(f"Exactitude (accuracy): {accuracy:.2f}")`}
                  </code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="regression" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">
                <GlossaryTerm definition={mlDefinitions["regression"]}>Régression</GlossaryTerm>
              </h3>
              <p className="mb-4">
                La régression consiste à prédire une valeur numérique continue, comme un prix, 
                une température ou un pourcentage.
              </p>
              <h4 className="font-medium mt-4 mb-2">Algorithmes populaires :</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Régression linéaire</li>
                <li>Régression polynomiale</li>
                <li>Régression par arbres de décision</li>
                <li>Forêts aléatoires pour la régression</li>
                <li>Réseaux de neurones</li>
                <li>Gradient Boosting (XGBoost, LightGBM)</li>
              </ul>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Exemple de code : Régression</CardTitle>
                <CardDescription>Utilisation de Scikit-learn pour un modèle de régression</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto text-sm">
                  <code>
{`from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import numpy as np

# Diviser les données
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42
)

# Créer et entraîner le modèle
model = LinearRegression()
model.fit(X_train, y_train)

# Prédictions
y_pred = model.predict(X_test)

# Évaluation
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
print(f"RMSE: {rmse:.2f}")`}
                  </code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-10 mb-6">
        <h3 className="text-xl font-semibold mb-6">Techniques de division des données</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Train-Test Split</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Division simple des données en ensemble d'entraînement (généralement 70-80%) et
                ensemble de test (20-30%).
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="bg-blue-500 h-4 w-9/12 rounded-sm"></div>
                <div className="bg-green-500 h-4 w-3/12 rounded-sm"></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>Entraînement</span>
                <span>Test</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Validation croisée</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Division des données en k sous-ensembles (folds), avec entraînement sur k-1 folds et
                test sur le fold restant, en alternant.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-1">
                  <div className="bg-green-500 h-3 w-2/12 rounded-sm"></div>
                  <div className="bg-blue-500 h-3 w-10/12 rounded-sm"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="bg-blue-500 h-3 w-2/12 rounded-sm"></div>
                  <div className="bg-green-500 h-3 w-2/12 rounded-sm"></div>
                  <div className="bg-blue-500 h-3 w-8/12 rounded-sm"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="bg-blue-500 h-3 w-4/12 rounded-sm"></div>
                  <div className="bg-green-500 h-3 w-2/12 rounded-sm"></div>
                  <div className="bg-blue-500 h-3 w-6/12 rounded-sm"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Train-Val-Test</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Division en trois ensembles: entraînement, validation pour le réglage des hyperparamètres, 
                et test pour l'évaluation finale.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="bg-blue-500 h-4 w-6/12 rounded-sm"></div>
                <div className="bg-purple-500 h-4 w-2/12 rounded-sm"></div>
                <div className="bg-green-500 h-4 w-4/12 rounded-sm"></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>Train</span>
                <span>Val</span>
                <span>Test</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SupervisedSection;
