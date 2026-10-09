import { useState } from "react";
import { asset } from "@/lib/asset";
import { GlossaryTerm } from "@/components/ui/glossary-term";
import { mlDefinitions } from "@/data/glossary/ml-definitions";
import { EducationalCard, ExerciseCard } from "@/components/ui/educational-cards";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Users, TreePine, Bot, Code, CheckCircle, ArrowRight, Lightbulb, Eye } from "lucide-react";

const IntroSectionRefactored = () => {
  const [activeSection, setActiveSection] = useState("models-work");

  return (
    <section id="introduction" className="space-y-16">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          Introduction au Machine Learning
        </h2>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          Six leçons sur les fondamentaux du ML (arbres de décision, validation, forêts aléatoires), avec des exercices corrigés. Le plan est inspiré du cours{" "}
          <a href="https://www.kaggle.com/learn/intro-to-machine-learning" target="_blank" rel="noopener noreferrer" className="text-primary underline">
            Intro to Machine Learning
          </a>{" "}
          de Kaggle Learn.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Badge variant="secondary" className="px-4 py-2">📚 Inspiré de Kaggle Learn</Badge>
          <Badge variant="secondary" className="px-4 py-2">💻 Exercices Pratiques</Badge>
          <Badge variant="secondary" className="px-4 py-2">🐍 Python & Pandas</Badge>
          <Badge variant="secondary" className="px-4 py-2">📊 Schémas</Badge>
        </div>
      </div>

      <div className="flex justify-center mb-12">
        <div className="relative group">
          <img
            src={asset("svg/machine_learning_apercu.svg")}
            alt="Schéma : les trois familles du machine learning (supervisé, non supervisé, par renforcement) et les quatre étapes d'un projet"
            className="w-[80%] max-w-4xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>

      {/* Objectifs d'apprentissage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader className="text-center">
            <Target className="h-8 w-8 text-primary mx-auto mb-2" />
            <CardTitle className="text-lg">Objectifs</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Comprendre les modèles ML</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Explorer des données</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Créer votre premier modèle</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-secondary/20 hover:border-secondary/40 transition-colors">
          <CardHeader className="text-center">
            <Code className="h-8 w-8 text-secondary mx-auto mb-2" />
            <CardTitle className="text-lg">Outils</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Bot className="h-4 w-4 text-blue-500" />pandas pour l'analyse</li>
              <li className="flex items-center gap-2"><Bot className="h-4 w-4 text-blue-500" />scikit-learn pour le ML</li>
              <li className="flex items-center gap-2"><Bot className="h-4 w-4 text-blue-500" />Jupyter Notebooks</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-accent/20 hover:border-accent/40 transition-colors">
          <CardHeader className="text-center">
            <Users className="h-8 w-8 text-accent mx-auto mb-2" />
            <CardTitle className="text-lg">Prérequis</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Lightbulb className="h-4 w-4 text-yellow-500" />Python de base</li>
              <li className="flex items-center gap-2"><Lightbulb className="h-4 w-4 text-yellow-500" />Notions de moyenne et d'erreur</li>
              <li className="flex items-center gap-2"><Lightbulb className="h-4 w-4 text-yellow-500" />Curiosité d'apprendre</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Navigation tabs for the 6 sections */}
      <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto p-1">
          <TabsTrigger value="models-work" className="text-xs p-3 h-auto flex flex-col gap-1">
            <span className="text-lg">🌱</span>
            <span>Comment Fonctionnent les Modèles</span>
          </TabsTrigger>
          <TabsTrigger value="data-exploration" className="text-xs p-3 h-auto flex flex-col gap-1">
            <span className="text-lg">🔍</span>
            <span>Exploration des Données</span>
          </TabsTrigger>
          <TabsTrigger value="first-model" className="text-xs p-3 h-auto flex flex-col gap-1">
            <span className="text-lg">🧪</span>
            <span>Premier Modèle</span>
          </TabsTrigger>
          <TabsTrigger value="model-validation" className="text-xs p-3 h-auto flex flex-col gap-1">
            <span className="text-lg">📊</span>
            <span>Validation</span>
          </TabsTrigger>
          <TabsTrigger value="overfitting" className="text-xs p-3 h-auto flex flex-col gap-1">
            <span className="text-lg">⚖️</span>
            <span>Sur/Sous-ajustement</span>
          </TabsTrigger>
          <TabsTrigger value="random-forests" className="text-xs p-3 h-auto flex flex-col gap-1">
            <span className="text-lg">🌲</span>
            <span>Forêts Aléatoires</span>
          </TabsTrigger>
        </TabsList>

        {/* Section 1: How Models Work */}
        <TabsContent value="models-work" className="space-y-8">
          <div className="text-center mb-8">
            <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
              🌱 Comment Fonctionnent les Modèles
            </h3>
            <p className="text-xl text-muted-foreground">Comprendre ce qu'est un modèle prédictif, à travers les arbres de décision</p>
          </div>

          {/* Concept principal */}
          <EducationalCard title="Qu'est-ce qu'un modèle de Machine Learning ?" type="concept" className="mb-6">
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <Lightbulb className="h-8 w-8 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-lg leading-relaxed">
                    Un <GlossaryTerm definition={mlDefinitions.modèle}>modèle</GlossaryTerm> de machine learning est
                    une <strong>fonction apprise à partir d'exemples</strong> : elle prend des informations en entrée
                    et renvoie une prédiction. Ses réglages internes (les paramètres) sont ajustés pour que ses prédictions
                    collent aux exemples connus.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border-l-4 border-green-400">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <TreePine className="h-5 w-5" />
                    Arbre de Décision : Votre Premier Modèle
                  </h4>
                  <p className="text-green-700 mb-4">
                    Un arbre de décision fonctionne comme un questionnaire. Il pose des questions successives
                    sur les données pour arriver à une prédiction. Les prix ci-dessous sont des valeurs d'illustration, inventées.
                  </p>
                  <div className="bg-white p-4 rounded border-2 border-dashed border-green-300">
                    <p className="text-sm font-mono text-green-600">
                      Surface &gt; 150 m² ?<br/>
                      ├─ OUI → Chambres &gt; 3 ?<br/>
                      │   ├─ OUI → Prix élevé<br/>
                      │   └─ NON → Prix moyen<br/>
                      └─ NON → Garage ?<br/>
                          ├─ OUI → Prix moyen-bas<br/>
                          └─ NON → Prix bas
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Exemple Concret : Prix d'une Maison
                  </h4>
                  <p className="text-blue-700 mb-4">
                    Pour prédire le prix d'une maison, notre modèle examine des caractéristiques comme :
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-blue-600">
                      <CheckCircle className="h-4 w-4" />
                      Surface habitable (m²)
                    </li>
                    <li className="flex items-center gap-2 text-blue-600">
                      <CheckCircle className="h-4 w-4" />
                      Nombre de chambres
                    </li>
                    <li className="flex items-center gap-2 text-blue-600">
                      <CheckCircle className="h-4 w-4" />
                      Localisation (quartier)
                    </li>
                    <li className="flex items-center gap-2 text-blue-600">
                      <CheckCircle className="h-4 w-4" />
                      Année de construction
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </EducationalCard>

          {/* Visualisation interactive */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Eye className="h-5 w-5" />
                Comment un arbre découpe les données
              </CardTitle>
              <CardDescription>
                Un arbre de décision divise l'espace des données en régions plus homogènes (mêmes quatre régions que l'arbre ci-dessus, prix inventés)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-6 rounded-lg border-2 border-dashed border-purple-300">
                <div className="text-center mb-4">
                  <p className="font-semibold text-purple-700">Les quatre régions</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-green-100 p-3 rounded border-l-4 border-green-500">
                    <strong className="text-green-700">Région 1 :</strong><br/>
                    Surface &gt; 150 m² et chambres &gt; 3<br/>
                    <span className="text-green-600">→ Prix élevé (par exemple plus de 300 k€)</span>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded border-l-4 border-yellow-500">
                    <strong className="text-yellow-700">Région 2 :</strong><br/>
                    Surface &gt; 150 m² et chambres ≤ 3<br/>
                    <span className="text-yellow-600">→ Prix moyen (par exemple 200 à 300 k€)</span>
                  </div>
                  <div className="bg-orange-100 p-3 rounded border-l-4 border-orange-500">
                    <strong className="text-orange-700">Région 3 :</strong><br/>
                    Surface ≤ 150 m² avec garage<br/>
                    <span className="text-orange-600">→ Prix moyen-bas (par exemple 150 à 200 k€)</span>
                  </div>
                  <div className="bg-red-100 p-3 rounded border-l-4 border-red-500">
                    <strong className="text-red-700">Région 4 :</strong><br/>
                    Surface ≤ 150 m² sans garage<br/>
                    <span className="text-red-600">→ Prix bas (par exemple moins de 150 k€)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <ExerciseCard
            title="🎯 Exercice Pratique : Construisez Votre Arbre de Décision"
            problem="Vous conseillez une concession automobile. Dessinez un arbre de décision pour prédire si un client achètera plutôt une voiture électrique. Vous devez poser exactement 3 questions pour répartir les clients. (Exercice de réflexion : aucune donnée de ventes n'est fournie.)"
            solution={`
**Une solution possible** (les seuils sont des exemples, à valider sur des données de ventes réelles) :

1. **Le client peut-il recharger à domicile ou au travail ?**
   - NON → plutôt une hybride ou une thermique
   - OUI → question 2

2. **Son trajet quotidien est-il inférieur à environ 150 km ?**
   - NON → plutôt une hybride rechargeable
   - OUI → question 3

3. **Son budget atteint-il environ 30 000 € (aides comprises) ?**
   - NON → plutôt une autre motorisation, ou une voiture d'occasion
   - OUI → **achat d'une électrique probable**

**Logique :** chaque question écarte un groupe de clients pour qui l'électrique est peu adaptée : d'abord la contrainte pratique de recharge, puis l'autonomie nécessaire, enfin le budget. Un arbre appris sur de vraies données choisirait ses questions et ses seuils lui-même, en cherchant à séparer au mieux les acheteurs des autres.
            `}
            hints={[
              "Commencez par la contrainte la plus éliminatoire (la recharge)",
              "Pensez aux contraintes d'usage quotidien (distance)",
              "Le budget départage les clients restants",
              "Chaque question doit diviser les clients en groupes distincts"
            ]}
            difficulty="débutant"
            estimatedTime="10 min"
          />

          <div className="bg-gradient-to-r from-green-700 to-emerald-700 text-white p-6 rounded-lg">
            <h4 className="font-bold text-xl mb-3 flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              Points Clés à Retenir
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 mt-0.5 flex-shrink-0" />
                Un modèle ML est une fonction apprise à partir d'exemples pour faire des prédictions
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 mt-0.5 flex-shrink-0" />
                Les arbres de décision sont intuitifs et visuels
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 mt-0.5 flex-shrink-0" />
                Chaque "split" divise les données en groupes plus homogènes
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 mt-0.5 flex-shrink-0" />
                Le choix des questions (et de leurs seuils) détermine la qualité du modèle
              </li>
            </ul>
          </div>
        </TabsContent>

        {/* Section 2: Basic Data Exploration */}
        <TabsContent value="data-exploration" className="space-y-8">
          <EducationalCard title="🔍 2. Premiers pas dans l'exploration des données" type="concept">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border-l-4 border-blue-500">
                <h4 className="font-bold text-blue-800 mb-3">🎯 Objectif : Apprendre à explorer un dataset avec Pandas</h4>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                    <h5 className="font-semibold text-green-800 mb-2">📥 1. Chargement des données</h5>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto">
                      import pandas as pd<br/>
                      data = pd.read_csv('melbourne_housing.csv')
                    </div>
                    <p className="text-sm mt-2">Première étape : charger les données depuis un fichier CSV (ici melb_data.csv, jeu « Melbourne Housing Snapshot » publié sur Kaggle, à télécharger).</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
                    <h5 className="font-semibold text-purple-800 mb-2">🔍 2. Analyse descriptive</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-purple-50 p-3 rounded">
                        <div className="font-mono text-sm mb-1">data.describe()</div>
                        <p className="text-xs">Statistiques de base (moyenne, médiane, etc.)</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded">
                        <div className="font-mono text-sm mb-1">data.columns</div>
                        <p className="text-xs">Liste toutes les colonnes disponibles</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-500">
                    <h5 className="font-semibold text-yellow-800 mb-2">🎯 3. Identification des variables</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-yellow-50 p-3 rounded">
                        <strong>Features (caractéristiques) :</strong>
                        <p className="text-sm">Rooms, Bathroom, Landsize, BuildingArea...</p>
                      </div>
                      <div className="bg-orange-50 p-3 rounded">
                        <strong>Target (variable cible) :</strong>
                        <p className="text-sm">Price (ce qu'on veut prédire)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </EducationalCard>

          <ExerciseCard
            title="Exercice : Exploration du Dataset Melbourne House Prices"
            problem="Explorez le jeu de données des prix immobiliers de Melbourne (fichier melb_data.csv, publié sur Kaggle et non fourni sur ce site) et calculez quelques statistiques : prix médian, nombre moyen de chambres, taille moyenne du terrain."
            solution="Prix médian : 903 000 AUD | Chambres : 2,94 en moyenne | Terrain : 558 m² en moyenne (fichier melb_data.csv, 13 580 lignes)"
            hints={[
              "Utilisez data['Price'].median() pour le prix médian",
              "data['Rooms'].mean() pour la moyenne des chambres",
              "Price, Rooms et Landsize n'ont aucune valeur manquante dans ce fichier ; un dropna() sur tout le tableau supprimerait plus de la moitié des lignes (colonnes BuildingArea, YearBuilt...), donc ne l'appliquez qu'aux colonnes utilisées"
            ]}
            difficulty="débutant"
            estimatedTime="10 min"
          />
        </TabsContent>

        {/* Section 3: Your First ML Model */}
        <TabsContent value="first-model" className="space-y-8">
          <EducationalCard title="🧪 3. Votre premier modèle" type="concept">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-l-4 border-purple-500">
                <h4 className="font-bold text-purple-800 mb-3">🎯 Objectif : Construire un modèle prédictif simple</h4>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                    <h5 className="font-semibold text-blue-800 mb-2">1️⃣ Sélection des features et de la target</h5>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto mb-2">
                      features = ['Rooms', 'Bathroom', 'Landsize']<br/>
                      X = data[features]<br/>
                      y = data['Price']
                    </div>
                    <p className="text-sm">Choisissez soigneusement vos variables d'entrée (X) et votre cible (y).</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                    <h5 className="font-semibold text-green-800 mb-2">2️⃣ Utilisation de scikit-learn</h5>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto mb-2">
                      from sklearn.tree import DecisionTreeRegressor<br/>
                      model = DecisionTreeRegressor(random_state=1)<br/>
                      model.fit(X, y)  # Entraînement<br/>
                      predictions = model.predict(X)  # Prédictions
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
                      <div className="bg-green-50 p-2 rounded text-center">
                        <strong className="text-xs">Définir</strong>
                        <p className="text-xs">DecisionTreeRegressor</p>
                      </div>
                      <div className="bg-blue-50 p-2 rounded text-center">
                        <strong className="text-xs">Entraîner</strong>
                        <p className="text-xs">model.fit(X, y)</p>
                      </div>
                      <div className="bg-purple-50 p-2 rounded text-center">
                        <strong className="text-xs">Prédire</strong>
                        <p className="text-xs">model.predict()</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border-l-4 border-red-500">
                    <h5 className="font-semibold text-red-800 mb-2">3️⃣ Évaluation avec la MAE</h5>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto mb-2">
                      from sklearn.metrics import mean_absolute_error<br/>
                      mae = mean_absolute_error(y, predictions)
                    </div>
                    <div className="bg-red-50 p-3 rounded">
                      <p className="text-sm"><strong>MAE (Mean Absolute Error) :</strong> Moyenne des erreurs en valeur absolue, exprimée dans l'unité de la cible (ici des dollars australiens). Plus elle est basse, mieux c'est.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </EducationalCard>

          <ExerciseCard
            title="Exercice : Construisez votre premier modèle"
            problem="Créez un modèle de prédiction de prix avec les features : Rooms, Bathroom, Landsize. Calculez la MAE sur vos prédictions."
            solution="MAE ≈ 222 640 AUD avec DecisionTreeRegressor(random_state=1) sur 13 580 maisons (mesurée avec scikit-learn 1.8 ; elle peut varier légèrement selon la version). Attention : cette MAE est calculée sur les données d'entraînement, donc trop optimiste."
            hints={[
              "N'oubliez pas d'importer DecisionTreeRegressor",
              "Utilisez random_state=1 pour des résultats reproductibles",
              "La MAE vous donne l'erreur moyenne en valeur absolue"
            ]}
            difficulty="intermédiaire"
            estimatedTime="15 min"
          />
        </TabsContent>

        {/* Section 4: Model Validation */}
        <TabsContent value="model-validation" className="space-y-8">
          <EducationalCard title="📊 4. Validation d'un modèle" type="concept">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border-l-4 border-orange-500">
                <h4 className="font-bold text-orange-800 mb-3">🎯 Objectif : Valider la fiabilité d'un modèle</h4>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border-l-4 border-red-500">
                    <h5 className="font-semibold text-red-800 mb-2">⚠️ Le piège du score sur les données d'entraînement</h5>
                    <p className="text-sm mb-3">
                      Un modèle performant sur les données d'entraînement peut <strong>échouer sur de nouvelles données</strong>.
                      C'est comme réviser avec les réponses du test - on ne teste pas vraiment ses connaissances !
                    </p>
                    <div className="bg-red-50 p-3 rounded">
                      <p className="text-xs"><strong>Analogie :</strong> un étudiant qui mémorise les réponses réussira les mêmes questions, mais pas forcément un nouveau test.</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                    <h5 className="font-semibold text-green-800 mb-2">✅ Solution : Train-Test Split</h5>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto mb-2">
                      from sklearn.model_selection import train_test_split<br/>
                      X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=1)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <div className="bg-green-50 p-3 rounded">
                        <strong className="text-sm">80 % pour l'entraînement</strong>
                        <p className="text-xs">Le modèle apprend sur ces données</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded">
                        <strong className="text-sm">20 % pour la validation</strong>
                        <p className="text-xs">Test sur données "inédites"</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
                    <h5 className="font-semibold text-purple-800 mb-2">📏 Calcul de la MAE sur la validation</h5>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto mb-2">
                      model.fit(X_train, y_train)<br/>
                      val_predictions = model.predict(X_val)<br/>
                      val_mae = mean_absolute_error(y_val, val_predictions)
                    </div>
                    <p className="text-sm">Cette MAE reflète mieux la performance du modèle sur des données nouvelles.</p>
                  </div>
                </div>
              </div>
            </div>
          </EducationalCard>

          <ExerciseCard
            title="Exercice : Implémentation du Train-Test Split"
            problem="Séparez vos données en 80 % d'entraînement et 20 % de validation. Comparez la MAE sur l'entraînement et sur la validation."
            solution="Avec test_size=0.2 et random_state=1 : MAE entraînement ≈ 207 700 AUD | MAE validation ≈ 441 500 AUD. L'erreur double environ sur des données jamais vues : l'arbre non limité surapprend."
            hints={[
              "Utilisez test_size=0.2 pour une séparation 80 % / 20 %",
              "Fixez random_state pour des résultats reproductibles",
              "La MAE de validation est généralement plus élevée"
            ]}
            difficulty="intermédiaire"
            estimatedTime="10 min"
          />
        </TabsContent>

        {/* Section 5: Underfitting and Overfitting */}
        <TabsContent value="overfitting" className="space-y-8">
          <EducationalCard title="⚖️ 5. Sous-ajustement et sur-ajustement" type="concept">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border-l-4 border-yellow-500">
                <h4 className="font-bold text-yellow-800 mb-3">🎯 Objectif : Diagnostiquer les problèmes de complexité du modèle</h4>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                      <h5 className="font-semibold text-blue-800 mb-2">📉 Sous-ajustement (Underfitting)</h5>
                      <div className="space-y-2 text-sm">
                        <p><strong>Définition :</strong> Modèle trop simple</p>
                        <p><strong>Symptôme :</strong> Arbre avec peu de feuilles</p>
                        <p><strong>Problème :</strong> N'arrive pas à capturer les tendances</p>
                        <div className="bg-blue-50 p-2 rounded">
                          <p className="text-xs"><strong>Analogie :</strong> Étudiant qui n'a pas assez révisé</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border-l-4 border-red-500">
                      <h5 className="font-semibold text-red-800 mb-2">📈 Sur-ajustement (Overfitting)</h5>
                      <div className="space-y-2 text-sm">
                        <p><strong>Définition :</strong> Modèle trop complexe</p>
                        <p><strong>Symptôme :</strong> Arbre avec trop de feuilles</p>
                        <p><strong>Problème :</strong> Mémorise le bruit des données</p>
                        <div className="bg-red-50 p-2 rounded">
                          <p className="text-xs"><strong>Analogie :</strong> Étudiant qui connaît par cœur mais ne comprend pas</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                    <h5 className="font-semibold text-green-800 mb-2">🎛️ Contrôle via max_leaf_nodes</h5>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto mb-2">
                      model = DecisionTreeRegressor(max_leaf_nodes=100, random_state=1)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
                      <div className="bg-red-100 p-2 rounded text-center">
                        <strong className="text-xs">Peu de feuilles</strong>
                        <p className="text-xs">Underfitting</p>
                      </div>
                      <div className="bg-green-100 p-2 rounded text-center">
                        <strong className="text-xs">Juste ce qu'il faut</strong>
                        <p className="text-xs">Bon compromis</p>
                      </div>
                      <div className="bg-red-100 p-2 rounded text-center">
                        <strong className="text-xs">Trop de feuilles</strong>
                        <p className="text-xs">Overfitting</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg">
                    <h5 className="font-semibold text-purple-800 mb-2">🎯 Trouver le bon compromis</h5>
                    <p className="text-sm mb-2">Testez différentes valeurs de max_leaf_nodes et choisissez celle qui minimise la MAE de validation (valeurs mesurées sur melb_data.csv avec Rooms, Bathroom et Landsize ; elles dépendent des variables choisies) :</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div className="bg-green-200 p-2 rounded"><strong>50 feuilles → MAE: 368 400</strong></div>
                      <div className="bg-white p-2 rounded">100 feuilles → MAE: 369 700</div>
                      <div className="bg-white p-2 rounded">250 feuilles → MAE: 382 600</div>
                      <div className="bg-white p-2 rounded">500 feuilles → MAE: 386 700</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </EducationalCard>

          <ExerciseCard
            title="Exercice : Expérimentation avec max_leaf_nodes"
            problem="Testez différentes valeurs de max_leaf_nodes (50, 100, 250, 500) et trouvez celle qui donne la meilleure MAE de validation."
            solution="Sur melb_data.csv avec Rooms, Bathroom et Landsize (random_state=1) : 50 feuilles → MAE ≈ 368 400 AUD ; 100 → 369 700 ; 250 → 382 600 ; 500 → 386 700. La meilleure des quatre valeurs est 50 ; avec d'autres variables, l'optimum change."
            hints={[
              "Créez une boucle pour tester différentes valeurs",
              "Stockez les MAE de validation pour chaque test",
              "La meilleure valeur minimise la MAE de validation"
            ]}
            difficulty="intermédiaire"
            estimatedTime="15 min"
          />
        </TabsContent>

        {/* Section 6: Random Forests */}
        <TabsContent value="random-forests" className="space-y-8">
          <EducationalCard title="🌲 6. Forêts aléatoires (random forests)" type="concept">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border-l-4 border-green-500">
                <h4 className="font-bold text-green-800 mb-3">🎯 Objectif : Améliorer les prédictions avec des ensembles d'arbres</h4>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border-l-4 border-orange-500">
                    <h5 className="font-semibold text-orange-800 mb-2">⚠️ Limites des arbres de décision uniques</h5>
                    <p className="text-sm mb-3">
                      Les arbres de décision sont <strong>sensibles aux petites variations</strong> des données.
                      Changer quelques points peut créer un arbre complètement différent !
                    </p>
                    <div className="bg-orange-50 p-3 rounded">
                      <p className="text-xs"><strong>Analogie :</strong> Demander son avis à une seule personne est risqué ; recueillir plusieurs avis indépendants et les moyenner est plus stable.</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                    <h5 className="font-semibold text-green-800 mb-2">🌳 Principe des Forêts Aléatoires</h5>
                    <div className="space-y-3">
                      <p className="text-sm">Une forêt aléatoire combine <strong>plusieurs arbres</strong>, chacun entraîné sur un échantillon tiré au hasard avec remise, et limité à un sous-ensemble de variables tiré au hasard à chaque coupure :</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-green-50 p-3 rounded text-center">
                          <TreePine className="h-6 w-6 mx-auto mb-2 text-green-600" />
                          <p className="text-xs"><strong>Arbre 1</strong><br/>Données échantillon A</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded text-center">
                          <TreePine className="h-6 w-6 mx-auto mb-2 text-green-600" />
                          <p className="text-xs"><strong>Arbre 2</strong><br/>Données échantillon B</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded text-center">
                          <TreePine className="h-6 w-6 mx-auto mb-2 text-green-600" />
                          <p className="text-xs"><strong>Arbre N</strong><br/>Données échantillon N</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-blue-100 p-3 rounded">
                          <p className="text-sm"><strong>Prédiction finale (régression) =</strong> moyenne des prédictions de tous les arbres</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                    <h5 className="font-semibold text-blue-800 mb-2">📊 Atouts des forêts aléatoires</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <div className="bg-blue-50 p-2 rounded text-sm">
                          <strong>🛡️ Réduction du sur-ajustement</strong><br/>
                          <span className="text-xs">La moyenne lisse les erreurs individuelles des arbres</span>
                        </div>
                        <div className="bg-blue-50 p-2 rounded text-sm">
                          <strong>🎯 Meilleure généralisation</strong><br/>
                          <span className="text-xs">Souvent plus stable qu'un arbre seul sur des données nouvelles</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-blue-50 p-2 rounded text-sm">
                          <strong>⚡ Parallélisable</strong><br/>
                          <span className="text-xs">Les arbres sont indépendants, donc entraînables en parallèle (n_jobs)</span>
                        </div>
                        <div className="bg-blue-50 p-2 rounded text-sm">
                          <strong>🔧 Peu de réglages</strong><br/>
                          <span className="text-xs">Donne souvent un bon résultat avec les paramètres par défaut</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
                    <h5 className="font-semibold text-purple-800 mb-2">💻 Utilisation avec scikit-learn</h5>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto mb-2">
                      from sklearn.ensemble import RandomForestRegressor<br/>
                      rf_model = RandomForestRegressor(n_estimators=100, random_state=1)<br/>
                      rf_model.fit(X_train, y_train)<br/>
                      rf_predictions = rf_model.predict(X_val)
                    </div>
                    <p className="text-sm"><strong>n_estimators=100</strong> signifie qu'on utilise 100 arbres dans la forêt.</p>
                  </div>
                </div>
              </div>
            </div>
          </EducationalCard>

          <ExerciseCard
            title="Exercice : remplacement par une forêt aléatoire"
            problem="Remplacez votre arbre de décision par une forêt aléatoire de 100 arbres. Comparez les MAE de validation."
            solution="Random Forest (100 arbres, random_state=1) : MAE de validation ≈ 408 100 AUD, contre ≈ 441 500 pour l'arbre non limité, mais pas meilleure que l'arbre limité à 50 feuilles (≈ 368 400) : avec ces trois variables seulement, la forêt n'apporte pas d'amélioration nette. En ajoutant la latitude, la longitude et la distance au centre, la MAE passe à ≈ 177 100 pour la forêt (≈ 221 800 pour un arbre à 500 feuilles)."
            hints={[
              "Importez RandomForestRegressor depuis sklearn.ensemble",
              "Utilisez n_estimators=100 pour 100 arbres",
              "Comparez la MAE avec votre modèle d'arbre unique"
            ]}
            difficulty="débutant"
            estimatedTime="10 min"
          />

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border-l-4 border-emerald-500">
            <h4 className="font-bold text-emerald-800 mb-4 text-center">✅ Points clés du cours</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg">
                  <h5 className="font-semibold text-blue-800 mb-1">🎯 Public visé</h5>
                  <p className="text-sm">Débutants en Python, sans prérequis en ML</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <h5 className="font-semibold text-green-800 mb-1">🛠️ Outils</h5>
                  <p className="text-sm">pandas pour l'exploration, scikit-learn pour la modélisation</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <h5 className="font-semibold text-purple-800 mb-1">📚 Pédagogie</h5>
                  <p className="text-sm">Approche pratique avec exercices intégrés</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg">
                  <h5 className="font-semibold text-orange-800 mb-1">💻 Environnement</h5>
                  <p className="text-sm">Python, pandas et scikit-learn, par exemple dans un notebook Jupyter sur votre machine</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <h5 className="font-semibold text-red-800 mb-1">📥 Données</h5>
                  <p className="text-sm">Le fichier melb_data.csv est à télécharger sur Kaggle ; il n'est pas fourni ici</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <h5 className="font-semibold text-teal-800 mb-1">🧩 Exercices</h5>
                  <p className="text-sm">Énoncé, indices progressifs et solution à afficher</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default IntroSectionRefactored;
