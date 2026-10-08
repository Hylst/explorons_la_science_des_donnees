
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { DeferredResponsiveContainer } from "@/components/ui/deferred-chart";
import { BrainCircuit, Check, BookOpen, ExternalLink } from "lucide-react";
import { SourceNote } from "@/components/ui/source-note";

const MLFrameworks = () => {
  // Stack Overflow Developer Survey 2024, section « Other frameworks and libraries », part de TOUS les répondants
  // (45 841 réponses ; pas seulement des data scientists). Relevé le 1er octobre 2026 sur survey.stackoverflow.co.
  // XGBoost et LightGBM ne figurent pas dans cette enquête.
  const frameworkData = [
    { name: 'scikit-learn', users: 10.6 },
    { name: 'PyTorch', users: 10.6 },
    { name: 'TensorFlow', users: 10.1 },
    { name: 'Hugging Face', users: 4.5 },
    { name: 'Keras', users: 4.3 },
  ];

  // Répartition ILLUSTRATIVE : aucune enquête ne publie une telle ventilation, les proportions servent seulement à
  // illustrer qu'il existe plusieurs grands domaines d'application. Ne pas les citer comme des statistiques.
  const mlApplicationData = [
    { name: 'Vision par ordinateur', value: 30 },
    { name: 'NLP', value: 25 },
    { name: 'Prédiction numérique', value: 20 },
    { name: 'Séries temporelles', value: 12 },
    { name: 'Recommandation', value: 8 },
    { name: 'Autres', value: 5 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div id="ml-frameworks" className="space-y-10">
      <h2 className="text-2xl font-bold">Frameworks et bibliothèques de Machine Learning</h2>
      <p className="text-lg mb-6">
        Les frameworks de Machine Learning fournissent les outils et les structures nécessaires pour développer, 
        entraîner et déployer des modèles d'apprentissage automatique.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Graphique de popularité */}
        <Card>
          <CardHeader>
            <CardTitle>Popularité des frameworks ML</CardTitle>
            <CardDescription>Part des répondants de l'enquête Stack Overflow 2024 qui utilisent la bibliothèque (tous les développeurs interrogés, pas seulement les data scientists)</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-80">
              <DeferredResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={frameworkData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 15]} unit=" %" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip formatter={(value: number) => [`${value.toLocaleString('fr-FR')} %`, 'Répondants']} />
                  <Legend />
                  <Bar dataKey="users" name="% des répondants" fill="#8884d8" />
                </BarChart>
              </DeferredResponsiveContainer>
              <SourceNote
                className="text-center mt-4"
                consulted="1er octobre 2026"
                sources={[{ label: "Stack Overflow Developer Survey 2024, Other frameworks and libraries", href: "https://survey.stackoverflow.co/2024/technology" }]}
              />
              <p className="text-xs text-muted-foreground text-center">XGBoost et LightGBM, très utilisés sur les données tabulaires, ne figurent pas dans cette enquête.</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Graphique des applications */}
        <Card>
          <CardHeader>
            <CardTitle>Domaines d'application du ML</CardTitle>
            <CardDescription>Répartition illustrative des grands domaines d'application (proportions indicatives, non issues d'une enquête)</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-80">
              <DeferredResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mlApplicationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)} %`}
                    labelLine={false}
                  >
                    {mlApplicationData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value} %`, 'Proportion illustrative']} />
                </PieChart>
              </DeferredResponsiveContainer>
              <p className="text-xs text-gray-500 text-center mt-4">
                Les frameworks ML s'adaptent à différents domaines d'application, 
                certains étant spécialisés pour des tâches spécifiques. Les proportions ci-dessus sont illustratives.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Section scikit-learn */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 hover:shadow-md transition-all">
          <CardHeader className="bg-blue-50 rounded-t-lg border-b">
            <CardTitle className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-700" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0" />
                <path fill="#FFF" d="M6.34 19.26c-.62 0-1.137-.468-1.137-1.088 0-.635.53-1.088 1.137-1.088.62 0 1.13.453 1.13 1.088 0 .62-.51 1.088-1.13 1.088m9.162-1.917c.015-.15.022-.306.022-.465 0-1.853-.995-2.95-2.662-2.95-1.7 0-2.848 1.173-2.848 2.95 0 1.828 1.058 2.95 2.907 2.95.473 0 .935-.08 1.344-.259l-.112-.643c-.393.156-.743.23-1.184.23-1.217 0-1.946-.724-1.946-2.25v-.04h4.473l.006-.523zm-4.488-.68l.015-.523c0-1.157.59-1.665 1.624-1.665.965 0 1.5.45 1.5 1.649 0 .149-.007.45-.022.54h-3.117zm-7.291-2.27l1.887 4.292 2.036-4.291h1.069l-2.72 5.56c-.468.962-.943 1.286-1.866 1.286l-.38-.015-.13-.672c.132.022.321.022.453.022.468 0 .758-.173 1-.713l.16-.35-2.75-5.119h1.24v.001zm12.74 3.042v-2.685h1.295v-.704h-1.295v-.919c0-.612.25-.877.828-.877.234 0 .396.03.562.067l.102-.657a3.874 3.874 0 00-.746-.119c-.489 0-.905.142-1.15.403-.278.306-.416.702-.416 1.326v.776h-.935v.705h.935v2.684h.82z" />
              </svg>
              scikit-learn
            </CardTitle>
            <CardDescription>
              Bibliothèque Python de Machine Learning classique
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-blue-50">Classification</Badge>
                <Badge variant="outline" className="bg-blue-50">Régression</Badge>
                <Badge variant="outline" className="bg-blue-50">Clustering</Badge>
                <Badge variant="outline" className="bg-blue-50">Prétraitement</Badge>
                <Badge variant="outline" className="bg-blue-50">Pipelines</Badge>
                <Badge variant="outline" className="bg-blue-50">Validation croisée</Badge>
              </div>
              
              <p>
                Scikit-learn est la bibliothèque de référence pour le Machine Learning classique en Python.
                Elle propose une interface cohérente pour une grande variété d'algorithmes, facilitant
                l'expérimentation et le déploiement de modèles.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
                <h4 className="font-medium text-blue-700 mb-2">Exemple de code scikit-learn</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm overflow-x-auto">
                  <pre>{`from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

# Préparer les données
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42
)

# Créer un pipeline
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('classifier', RandomForestClassifier(n_estimators=100))
])

# Entraîner le modèle
pipeline.fit(X_train, y_train)

# Faire des prédictions
y_pred = pipeline.predict(X_test)

# Évaluer le modèle
accuracy = accuracy_score(y_test, y_pred)
print(f"Précision du modèle : {accuracy:.2f}")`}</pre>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-4">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm">Idéal pour démarrer en Machine Learning et pour de nombreux cas d'utilisation professionnels</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:row-span-2 hover:shadow-md transition-all">
          <CardHeader className="bg-gray-50 rounded-t-lg">
            <CardTitle>Quand utiliser quel framework ?</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="p-3 border rounded-lg bg-blue-50">
                <h5 className="font-medium text-blue-700 mb-1">scikit-learn</h5>
                <ul className="text-sm space-y-1 list-disc pl-5">
                  <li>Algorithmes classiques (arbres, SVM, etc.)</li>
                  <li>Jeux de données de taille moyenne</li>
                  <li>Prétraitement des données</li>
                  <li>Prototypage rapide</li>
                </ul>
              </div>
              
              <div className="p-3 border rounded-lg bg-red-50">
                <h5 className="font-medium text-red-700 mb-1">TensorFlow / Keras</h5>
                <ul className="text-sm space-y-1 list-disc pl-5">
                  <li>Deep learning complexe</li>
                  <li>Déploiement en production</li>
                  <li>LiteRT (ex-TensorFlow Lite) pour mobile et appareils embarqués</li>
                  <li>TensorFlow.js pour navigateur</li>
                </ul>
              </div>
              
              <div className="p-3 border rounded-lg bg-orange-50">
                <h5 className="font-medium text-orange-700 mb-1">PyTorch</h5>
                <ul className="text-sm space-y-1 list-disc pl-5">
                  <li>Recherche et expérimentation</li>
                  <li>Vision par ordinateur avancée</li>
                  <li>Traitement du langage naturel</li>
                  <li>Modèles personnalisés complexes</li>
                </ul>
              </div>
              
              <div className="p-3 border rounded-lg bg-green-50">
                <h5 className="font-medium text-green-700 mb-1">XGBoost / LightGBM</h5>
                <ul className="text-sm space-y-1 list-disc pl-5">
                  <li>Compétitions et défis ML</li>
                  <li>Problèmes avec données tabulaires</li>
                  <li>Souvent très performants sur ce type de données</li>
                  <li>Algorithmes à base d'arbres</li>
                </ul>
              </div>
              
              <div className="p-3 border rounded-lg bg-purple-50">
                <h5 className="font-medium text-purple-700 mb-1">Hugging Face</h5>
                <ul className="text-sm space-y-1 list-disc pl-5">
                  <li>Modèles de langage préentraînés</li>
                  <li>Ajustement fin (fine-tuning) de transformers</li>
                  <li>NLP et génération de texte</li>
                  <li>Partage et collaboration</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Section Deep Learning Frameworks */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="bg-red-50 rounded-t-lg border-b">
            <CardTitle className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 32 32">
                <path fill="#ff6f00" d="M16 8.657l-9.88 5.457v10.344L16 30.094l9.88-5.636V14.114z" />
                <path fill="#ff6f00" d="M9.3 14.219l6.7-3.735l6.7 3.735l-6.7 3.735z" />
                <path fill="#ff9500" d="M16 30.095L6.12 24.458V13.2L16 8.657V2.124L2 10.57v15.16L16 35.876V30.095z" />
                <path fill="#ff9500" d="M16 2.124v6.532l-9.88 5.543L2 10.57L16 2.124zm0 28.752l-9.88-5.637L9.3 21.71L16 25.444v5.432z" />
                <path fill="#ff9500" d="M6.12 13.2l3.18 1.856L6.12 16.906V13.2z" />
                <path fill="#f57c00" d="M16 30.095v5.782l14-8.146V10.571L16 2.124v6.533l9.88 5.543v10.343L16 30.095zm0-4.65l6.7-3.736l3.18 1.856L16 30.094v-4.65z" />
                <path fill="#ff9500" d="M25.88 13.2v3.705l-3.18-1.849l3.18-1.856z" />
              </svg>
              TensorFlow
            </CardTitle>
            <CardDescription>
              Plateforme open source de bout en bout pour le machine learning
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-red-50">Deep Learning</Badge>
                <Badge variant="outline" className="bg-red-50">Keras API</Badge>
                <Badge variant="outline" className="bg-red-50">TensorBoard</Badge>
                <Badge variant="outline" className="bg-red-50">TF Serving</Badge>
                <Badge variant="outline" className="bg-red-50">LiteRT</Badge>
              </div>
              
              <p className="text-sm">
                TensorFlow est un framework complet développé par Google qui prend en charge la recherche,
                le développement et le déploiement de modèles de machine learning, avec un accent particulier
                sur les réseaux de neurones profonds.
              </p>
              
              <div className="p-3 bg-red-50 rounded-lg">
                <h4 className="font-medium mb-2 text-red-700">Points forts</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Écosystème complet pour la production</li>
                  <li>TensorFlow Extended (TFX) pour les pipelines ML</li>
                  <li>Keras comme API de haut niveau intuitive</li>
                  <li>Déploiement cloud via Vertex AI (Google Cloud)</li>
                  <li>Optimisé pour la performance et le déploiement</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="bg-orange-50 rounded-t-lg border-b">
            <CardTitle className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 32 32">
                <path fill="#f74141" d="M23.1 24.2c-.7-.8-1.3-1.8-1.8-2.9C24.5 19.6 27 16.9 27 14c0-6.1-9.5-11-9.5-11S8 7.9 8 14c0 2.9 2.5 5.6 5.9 7.3-.5 1-1.1 2-1.9 2.9c-2.4 2.7-5.2 4.2-5.2 4.2s11.9 6.9 21.6-.2c-.6-.4-3.3-1.9-5.3-4z" />
                <path fill="#f74141" d="M17.7 19.8c3.6-.8 5.1-2.7 5.1-2.7s-1.3 5.3-5.1 5.3c-3.8 0-5.1-5.2-5.1-5.2s1.5 1.9 5.1 2.6z" />
                <path fill="#f64242" d="M12.4 10.5s-1.7 2.6 0 5.2c2.1 3.1 8.2 1.6 9.9 0c1.7-1.7 0-5.2 0-5.2s-3.4 4.1-9.9 0z" />
                <path fill="none" stroke="#ec1d1d" strokeWidth="0.5" strokeLinecap="round" d="M14.8 13.9c1.1.7 3.6 1.2 5.5-.7" />
              </svg>
              PyTorch
            </CardTitle>
            <CardDescription>
              Framework de deep learning orienté recherche avec une approche dynamique
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-orange-50">Graphes dynamiques</Badge>
                <Badge variant="outline" className="bg-orange-50">Recherche</Badge>
                <Badge variant="outline" className="bg-orange-50">PyTorch Lightning</Badge>
                <Badge variant="outline" className="bg-orange-50">TorchVision</Badge>
                <Badge variant="outline" className="bg-orange-50">TorchAudio</Badge>
              </div>
              
              <p className="text-sm">
                PyTorch, créé à l'origine par Facebook AI Research (aujourd'hui Meta) et désormais hébergé par la PyTorch Foundation, offre une approche souple et intuitive
                du deep learning avec des graphes de calcul dynamiques qui facilitent le débogage et
                l'expérimentation.
              </p>
              
              <div className="p-3 bg-orange-50 rounded-lg">
                <h4 className="font-medium mb-2 text-orange-700">Points forts</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>API pythonique et intuitive</li>
                  <li>Graphes de calcul dynamiques (définition par l'exécution)</li>
                  <li>Débogage facile avec les outils Python standard</li>
                  <li>Populaire dans la recherche et le milieu académique</li>
                  <li>Écosystème riche pour la vision par ordinateur et le NLP</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="bg-green-50 rounded-t-lg border-b">
            <CardTitle className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 32 32">
                <path fill="#346c9c" d="M17.1 2c-1.2.1-2.5.3-3.4.6-3.1.9-3.7 2.7-3.7 6.1v4.5h7.4v.9H6.9c-2.1 0-4 1.3-4.6 3.7-.7 2.7-.7 4.4 0 7.2.5 2.1 1.8 3.7 4 3.7h2.5v-5.3c0-2.4 2.1-4.5 4.6-4.5h7.4c2 0 3.7-1.7 3.7-3.7V8.7c0-2-1.7-3.5-3.7-3.8-1.3-.2-2.6-.3-3.7-.2zm-4 2.2c.8 0 1.4.6 1.4 1.4 0 .8-.6 1.4-1.4 1.4-.8 0-1.4-.6-1.4-1.4 0-.8.6-1.4 1.4-1.4z" />
                <path fill="#fed941" d="M24.9 13.9v5.1c0 2.5-2.1 4.6-4.6 4.6h-7.4c-2 0-3.7 1.7-3.7 3.7v6.9c0 2 1.7 3.1 3.7 3.7 2.4.7 4.6.8 7.4 0 1.9-.5 3.7-1.6 3.7-3.7v-4.5h-7.4v-.9h11.1c2.1 0 2.9-1.5 3.7-3.7.8-2.3.8-4.4 0-7.2-.6-2-1.6-3.7-3.7-3.7h-2.8zm-4.2 27.7c.8 0 1.4.6 1.4 1.4 0 .8-.6 1.4-1.4 1.4-.8 0-1.4-.6-1.4-1.4 0-.8.7-1.4 1.4-1.4z" />
              </svg>
              XGBoost et LightGBM
            </CardTitle>
            <CardDescription>
              Bibliothèques optimisées pour les algorithmes à base d'arbres de décision
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-green-50">Boosting</Badge>
                <Badge variant="outline" className="bg-green-50">Gradient Boosting</Badge>
                <Badge variant="outline" className="bg-green-50">Données tabulaires</Badge>
                <Badge variant="outline" className="bg-green-50">Haute performance</Badge>
              </div>
              
              <p className="text-sm">
                XGBoost et LightGBM sont des implémentations optimisées d'algorithmes de gradient boosting,
                offrant souvent de très bonnes performances pour les problèmes de classification et de régression
                sur des données tabulaires.
              </p>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-100 mt-4">
                <h4 className="font-medium text-green-700 mb-2">Exemple de code XGBoost</h4>
                <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-xs overflow-x-auto">
                  <pre>{`import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import root_mean_squared_error

# Préparer les données
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Convertir en DMatrix (format optimisé pour XGBoost)
dtrain = xgb.DMatrix(X_train, label=y_train)
dtest = xgb.DMatrix(X_test, label=y_test)

# Configurer les paramètres
params = {
    'objective': 'reg:squarederror',
    'max_depth': 6,
    'eta': 0.1,
    'subsample': 0.8,
    'colsample_bytree': 0.8
}

# Entraîner le modèle
model = xgb.train(
    params,
    dtrain,
    num_boost_round=100,
    evals=[(dtest, 'test')],
    early_stopping_rounds=10
)

# Faire des prédictions
preds = model.predict(dtest)
rmse = root_mean_squared_error(y_test, preds)
print(f"RMSE : {rmse:.4f}")`}</pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="bg-purple-50 rounded-t-lg border-b">
            <CardTitle className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 64 64">
                <path fill="#ffb7b7" d="M19.19 62.89l-4.41-3.5V20.57l-.44-2.2 1.32-4.85 8.59-6.17 15.2 2.2 4.85 7.05 1.32 4.41v32.42l-4.41 4.41-9.91 3.53-12.11 1.52z" />
                <path fill="#ff8585" d="M44.61 21.01v32.42l-4.41 4.41-9.91 3.53V7.54l15.2 2.2 4.85 7.05 1.32 4.41-.44 2.2-6.61-2.39z" />
                <path fill="#f9f9f9" d="M6.19 17.05l8.59 5.73v30.22l4.41 3.97V17.05l-1.32-3.53-2.64-2.7-5.29-.39-3.75 6.62zm15.64-5.73v44.23l2.2 1.76 4.41.44v-9.78l2.65 2.2 2.2-2.64V11.32l-2.2-3.97-9.26-2.2v5.17z" />
                <path fill="#efefef" d="M30.34 11.32v44.25l-4.1 1.18V11.32l-2.2-3.97-2.21-.53v-5.17l6.61 1.58 2.2 3.97-.3 4.12z" />
                <path fill="#ffdd57" d="M26.15 7.35v44.22l6.61 3.53 1.76-1.76V5.15l-8.37 2.2z" />
                <path fill="#ffd303" d="M32.76 5.15v48.19l1.76-1.76 4.85-2.2V5.15h-6.61z" />
              </svg>
              Hugging Face Transformers
            </CardTitle>
            <CardDescription>
              Bibliothèque pour les modèles de langage préentraînés et le NLP
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-purple-50">NLP</Badge>
                <Badge variant="outline" className="bg-purple-50">Transformers</Badge>
                <Badge variant="outline" className="bg-purple-50">BERT, GPT</Badge>
                <Badge variant="outline" className="bg-purple-50">Fine-tuning</Badge>
                <Badge variant="outline" className="bg-purple-50">Transfer Learning</Badge>
              </div>
              
              <p className="text-sm">
                Hugging Face Transformers est très utilisée pour le traitement du langage naturel : elle donne accès
                à de nombreuses architectures (BERT, GPT-2, T5, CamemBERT...) et à des modèles préentraînés partagés sur le Hugging Face Hub.
              </p>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mt-4">
                <h4 className="font-medium text-purple-700 mb-2">Exemple de code Hugging Face</h4>
                <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-xs overflow-x-auto">
                  <pre>{`from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# Charger le tokenizer et le modèle préentraîné
# Attention : "camembert-base" est un modèle de base. La tête de classification est initialisée au hasard,
# donc sans fine-tuning (par exemple avec Trainer) ou sans choisir un modèle déjà ajusté à votre tâche,
# la classe prédite plus bas n'a aucun sens.
tokenizer = AutoTokenizer.from_pretrained("camembert-base")
model = AutoModelForSequenceClassification.from_pretrained("camembert-base", num_labels=2)

# Préparer le texte
text = "J'adore les bibliothèques de machine learning!"
inputs = tokenizer(text, return_tensors="pt")

# Faire une prédiction
with torch.no_grad():
    outputs = model(**inputs)
    
# Traiter les résultats
logits = outputs.logits
predicted_class = torch.argmax(logits, dim=1).item()`}</pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section AutoML */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <BrainCircuit className="h-6 w-6 mr-2 text-blue-700" />
          AutoML et démocratisation du Machine Learning
        </h3>
        
        <p className="mb-6">
          L'AutoML (Machine Learning automatisé) vise à rendre les techniques d'apprentissage automatique
          accessibles aux non-spécialistes en automatisant les tâches complexes comme la sélection de modèles,
          le réglage des hyperparamètres et la construction de variables (feature engineering).
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-blue-700 mb-2">AutoML en Python</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Auto-sklearn</li>
              <li>TPOT</li>
              <li>AutoKeras</li>
              <li>PyCaret</li>
            </ul>
            <p className="text-xs mt-2 text-gray-600">
              Solutions programmatiques qui s'intègrent au flux de travail Python
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-blue-700 mb-2">Plateformes Cloud</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Google Cloud AutoML</li>
              <li>Azure Automated ML</li>
              <li>Amazon SageMaker Autopilot</li>
              <li>IBM Watson AutoAI</li>
            </ul>
            <p className="text-xs mt-2 text-gray-600">
              Solutions intégrées avec l'infrastructure cloud et les services associés
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-blue-700 mb-2">Plateformes spécialisées</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>H2O.ai</li>
              <li>DataRobot</li>
              <li>Dataiku</li>
              <li>Ludwig</li>
            </ul>
            <p className="text-xs mt-2 text-gray-600">
              Solutions complètes avec interfaces visuelles et fonctionnalités avancées
            </p>
          </div>
        </div>
      </div>
      
      {/* Section MLOps */}
      <div className="mt-12">
        <h3 className="text-xl font-bold mb-4">MLOps : de l'expérimentation à la production</h3>
        <p className="mb-6">
          MLOps (Machine Learning Operations) combine les pratiques DevOps avec le machine learning pour
          gérer le cycle de vie complet des modèles ML, de l'expérimentation au déploiement et à la surveillance.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Gestion d'expériences</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>MLflow</li>
                <li>Weights & Biases</li>
                <li>Comet ML</li>
                <li>ClearML</li>
              </ul>
              <div className="mt-2 text-xs text-gray-600">
                Suivi des métriques, paramètres et artefacts lors de l'entraînement des modèles
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Orchestration</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Kubeflow</li>
                <li>Airflow</li>
                <li>Metaflow</li>
                <li>Prefect</li>
              </ul>
              <div className="mt-2 text-xs text-gray-600">
                Gestion et automatisation des workflows de machine learning
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Déploiement</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>BentoML</li>
                <li>TensorFlow Serving</li>
                <li>Seldon Core</li>
                <li>KServe</li>
              </ul>
              <div className="mt-2 text-xs text-gray-600">
                Mise en production des modèles sous forme d'API ou de services
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Surveillance</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Evidently AI</li>
                <li>Fiddler AI</li>
                <li>Prometheus/Grafana</li>
              </ul>
              <div className="mt-2 text-xs text-gray-600">
                Suivi des performances et détection de dérive des modèles en production
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h4 className="font-medium text-blue-700 mb-4">Ressources d'apprentissage</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <a href="https://scikit-learn.org/stable/getting_started.html" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-white rounded-lg border hover:bg-blue-50 transition-colors">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                <span>Prise en main de scikit-learn</span>
                <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
              </a>
              <a href="https://www.tensorflow.org/tutorials" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-white rounded-lg border hover:bg-blue-50 transition-colors">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                <span>Tutoriels TensorFlow</span>
                <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
              </a>
              <a href="https://docs.pytorch.org/tutorials/" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-white rounded-lg border hover:bg-blue-50 transition-colors">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                <span>Tutoriels PyTorch</span>
                <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
              </a>
            </div>
            <div className="space-y-3">
              <a href="https://huggingface.co/docs" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-white rounded-lg border hover:bg-blue-50 transition-colors">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                <span>Documentation Hugging Face</span>
                <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
              </a>
              <a href="https://www.kaggle.com/learn" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-white rounded-lg border hover:bg-blue-50 transition-colors">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                <span>Kaggle Learn</span>
                <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
              </a>
              <a href="https://www.fast.ai/" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-white rounded-lg border hover:bg-blue-50 transition-colors">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                <span>Cours fast.ai</span>
                <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLFrameworks;
