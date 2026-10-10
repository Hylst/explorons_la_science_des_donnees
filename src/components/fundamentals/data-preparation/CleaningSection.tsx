import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import CourseHighlight from '@/components/courses/CourseHighlight';
import { GlossaryTerm } from '@/components/ui/glossary-term';
import { typedDataPreparationDefinitions } from '../../../data/data-preparation-enhanced-definitions';
import { 
  Trash2, 
  AlertTriangle, 
  Copy, 
  CheckCircle, 
  XCircle, 
  Code
} from 'lucide-react';

/**
 * CleaningSection Component
 * 
 * This component handles the "Data Cleaning" section of the data preparation page.
 * It covers techniques for handling missing data, outliers, and duplicates with
 * interactive examples and code snippets.
 */
const CleaningSection: React.FC = () => {
  const [activeCleaningTab, setActiveCleaningTab] = useState('missing');
  const [showCleaningCode, setShowCleaningCode] = useState(false);
  const [showCaseStudy, setShowCaseStudy] = useState(false);

  return (
    <section id="cleaning" className="space-y-12">
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-bold flex items-center justify-center gap-3">
          <Trash2 className="h-8 w-8 text-red-500" />
          Nettoyage des Données
        </h2>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          Le nettoyage prend souvent une part importante du temps d'un projet, et il conditionne la fiabilité de tout le reste.
          Il s'agit de corriger, compléter ou écarter, et d'harmoniser les données pour les rendre exploitables.
        </p>
      </div>

      <CourseHighlight type="warning" title="Trois défauts à traiter">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <h4 className="font-semibold text-red-700">
              <GlossaryTerm 
                definition={typedDataPreparationDefinitions['donneesManquantes']}
                variant="hover"
                highlightStyle="glow"
              >
                Données Manquantes
              </GlossaryTerm>
            </h4>
            <p className="text-sm text-red-600">
              Les valeurs manquantes sont fréquentes dans les jeux de données réels et peuvent biaiser l'analyse si on les ignore
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
            <h4 className="font-semibold text-orange-700">
              <GlossaryTerm 
                definition={typedDataPreparationDefinitions['outliers']}
                variant="hover"
                highlightStyle="glow"
              >
                Valeurs Aberrantes
              </GlossaryTerm>
            </h4>
            <p className="text-sm text-orange-600">
              Les valeurs aberrantes peuvent être des erreurs ou des cas exceptionnels réels : on ne les traite pas de la même façon
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
              <Copy className="h-8 w-8 text-yellow-500" />
            </div>
            <h4 className="font-semibold text-yellow-700">
              <GlossaryTerm 
                definition={typedDataPreparationDefinitions['doublons']}
                variant="hover"
                highlightStyle="glow"
              >
                Doublons
              </GlossaryTerm>
            </h4>
            <p className="text-sm text-yellow-600">
              Les doublons faussent les effectifs et les statistiques, et peuvent biaiser les modèles
            </p>
          </div>
        </div>
      </CourseHighlight>

      <Tabs value={activeCleaningTab} onValueChange={setActiveCleaningTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="missing">Données Manquantes</TabsTrigger>
          <TabsTrigger value="outliers">Valeurs Aberrantes</TabsTrigger>
          <TabsTrigger value="duplicates">Doublons</TabsTrigger>
        </TabsList>

        <TabsContent value="missing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                Gestion des Données Manquantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700">Techniques de détection</h4>
                  <div className="space-y-3">
                    {[
                      { method: "df.isnull().sum()", desc: "Comptage par colonne" },
                      { method: "missingno.matrix(df)", desc: "Visualisation de l'emplacement des valeurs manquantes (bibliothèque missingno)" },
                      { method: "df.info()", desc: "Aperçu général : types et nombre de valeurs non nulles" }
                    ].map((technique, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Code className="h-4 w-4 text-blue-500" />
                        <div>
                          <code className="text-sm font-mono text-blue-600">{technique.method}</code>
                          <p className="text-xs text-slate-600">{technique.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700">Stratégies de traitement</h4>
                  <p className="text-xs text-muted-foreground">
                    Il n'existe pas de seuil de pourcentage qui décide à lui seul : le choix dépend surtout de la cause du manque.
                  </p>
                  <div className="space-y-3">
                    {[
                      { strategy: "Suppression", pros: "Simple, rapide", cons: "Perte d'information", when: "Peu de manques, au hasard", key: "suppression" },
                      { strategy: "Imputation", pros: "Conserve les lignes", cons: "Peut introduire des biais", when: "Manque modéré", key: "imputation" },
                      { strategy: "Modélisation", pros: "Utilise les autres variables", cons: "Plus complexe", when: "Variables liées entre elles", key: "modelisation" }
                    ].map((strat, index) => (
                      <Card key={index} className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-slate-700">
                              <GlossaryTerm 
                                definition={typedDataPreparationDefinitions[strat.key === 'suppression' ? 'suppression' : strat.key === 'modelisation' ? 'modelisation' : 'imputation']}
                                variant="hover"
                                highlightStyle="underline"
                              >
                                {strat.strategy}
                              </GlossaryTerm>
                            </h5>
                            <Badge variant="outline" className="text-xs">{strat.when}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-green-600">{strat.pros}</div>
                            <div className="text-red-600">{strat.cons}</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-semibold text-blue-700">Exemple pratique : imputation</h5>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowCleaningCode(!showCleaningCode)}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    {showCleaningCode ? 'Masquer' : 'Voir'} Code
                  </Button>
                </div>
                
                {showCleaningCode && (
                  <div className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                    <pre>{`# Imputation par la médiane pour les variables numériques
import numpy as np
from sklearn.impute import SimpleImputer

# Créer l'imputer
imputer = SimpleImputer(strategy='median')

# Appliquer sur les colonnes numériques
# (dans un vrai projet de modélisation : fit sur le jeu d'entraînement seulement,
#  puis transform sur le jeu de test, pour éviter une fuite de données)
numeric_cols = df.select_dtypes(include=[np.number]).columns
df[numeric_cols] = imputer.fit_transform(df[numeric_cols])

# Imputation par le mode pour les variables catégorielles
for col in df.select_dtypes(include=['object', 'string']).columns:
    df[col] = df[col].fillna(df[col].mode()[0])

print(f"Données manquantes après imputation: {df.isnull().sum().sum()}")`}</pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outliers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Détection et Traitement des Valeurs Aberrantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    method: "IQR Method",
                    description: "Hors de [Q1 − 1,5 × IQR ; Q3 + 1,5 × IQR]",
                    pros: "Simple, sans hypothèse de normalité, peu influencée par les extrêmes",
                    cons: "Seuil 1,5 conventionnel ; peu adapté aux distributions très asymétriques",
                    code: "Q1 = df.quantile(0.25)\nQ3 = df.quantile(0.75)\nIQR = Q3 - Q1\noutliers = (df < Q1 - 1.5*IQR) | (df > Q3 + 1.5*IQR)",
                    key: "iqr"
                  },
                  {
                    method: "Z-Score",
                    description: "|z| > 3",
                    pros: "Simple, adapté aux données à peu près normales",
                    cons: "La moyenne et l'écart type sont eux-mêmes tirés par les extrêmes ; peu sensible sur de petits échantillons",
                    code: "import numpy as np\nfrom scipy import stats\n\nz_scores = np.abs(stats.zscore(df))\noutliers = z_scores > 3",
                    key: "zscore"
                  },
                  {
                    method: "Isolation Forest",
                    description: "Détection par apprentissage non supervisé",
                    pros: "Regarde plusieurs variables à la fois",
                    cons: "Plus complexe à expliquer ; il faut fixer la part d'anomalies attendue",
                    code: "from sklearn.ensemble import IsolationForest\n\niso = IsolationForest(contamination=0.1, random_state=0)\noutliers = iso.fit_predict(df) == -1",
                    key: "isolationForest"
                  }
                ].map((method, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-3">
                      <div className="text-center">
                        <h4 className="font-semibold text-orange-700">
                          <GlossaryTerm 
                          definition={typedDataPreparationDefinitions[method.key] || {
                            term: method.method,
                            shortDefinition: method.description,
                            definition: method.description,
                            examples: []
                          }}
                          variant="hover"
                          highlightStyle="glow"
                        >
                            {method.method}
                          </GlossaryTerm>
                        </h4>
                        <p className="text-sm text-orange-600">{method.description}</p>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="text-green-600">{method.pros}</div>
                        <div className="text-red-600">{method.cons}</div>
                      </div>
                      <details className="text-xs">
                        <summary className="cursor-pointer text-blue-600 hover:text-blue-800">Voir code</summary>
                        <pre className="bg-slate-100 p-2 rounded mt-2 overflow-x-auto">
                          <code>{method.code}</code>
                        </pre>
                      </details>
                    </div>
                  </Card>
                ))}
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important :</strong> ne supprimez pas automatiquement les valeurs aberrantes.
                  Ce sont parfois des cas réels et instructifs, parfois des erreurs de saisie ou de mesure à corriger à la source :
                  il faut chercher laquelle des deux avant d'agir.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="duplicates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Copy className="h-5 w-5 text-yellow-500" />
                Gestion des Doublons
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700">Types de doublons</h4>
                  <div className="space-y-3">
                    {[
                      { type: "Exact", desc: "Lignes identiques", example: "Jean Dupont, Jean Dupont" },
                      { type: "Approché", desc: "Même entité, écriture proche", example: "J. Dupont, Jean Dupont" },
                      { type: "Après harmonisation", desc: "Identiques une fois les formats alignés", example: "01/01/2023 et 2023-01-01 (même jour)" }
                    ].map((dup, index) => (
                      <Card key={index} className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{dup.type}</Badge>
                            <span className="text-sm font-medium">{dup.desc}</span>
                          </div>
                          <p className="text-xs text-slate-600 italic">{dup.example}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700">Stratégies de déduplication</h4>
                  <div className="space-y-3">
                    {[
                      { method: "drop_duplicates()", use: "Doublons exacts", params: "df.drop_duplicates(subset=['col1', 'col2'])", key: "doublons" },
                      { method: "fuzzy matching", use: "Similarité textuelle (bibliothèque rapidfuzz, score de 0 à 100)", params: "rapidfuzz.fuzz.ratio(a, b) > 90", key: "fuzzyMatching" },
                      { method: "Record Linkage", use: "Entités décrites par plusieurs champs (bibliothèque recordlinkage)", params: "recordlinkage.Index()", key: "recordLinkage" }
                    ].map((strat, index) => (
                      <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                        <div className="space-y-2">
                          <code className="text-sm font-mono text-yellow-700">
                            <GlossaryTerm 
                              definition={typedDataPreparationDefinitions[strat.key] || {
                                term: strat.method,
                                shortDefinition: strat.use,
                                definition: strat.use,
                                examples: []
                              }}
                              variant="hover"
                              highlightStyle="underline"
                            >
                              {strat.method}
                            </GlossaryTerm>
                          </code>
                          <p className="text-xs text-yellow-600">{strat.use}</p>
                          <code className="text-xs text-slate-500">{strat.params}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Practical Case Study */}
      <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-700">Cas pratique : nettoyage de données de patients (fictives)</CardTitle>
            <Button 
              variant="outline" 
              onClick={() => setShowCaseStudy(!showCaseStudy)}
            >
              {showCaseStudy ? 'Masquer' : 'Voir'} Étude de Cas
            </Button>
          </div>
        </CardHeader>
        {showCaseStudy && (
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-red-700 flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Avant Nettoyage (exemple fictif)
                </h4>
                <div className="bg-red-50 p-4 rounded-lg space-y-3">
                  <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                    <div className="font-semibold">ID</div>
                    <div className="font-semibold">Nom</div>
                    <div className="font-semibold">Âge</div>
                    <div className="font-semibold">Diagnostic</div>
                  </div>
                  {[
                    ["P001", "Jean Dupont", "45", "Diabète"],
                    ["P001", "J. DUPONT", "45", "diabete"],
                    ["P002", "Marie Martin", "NULL", "Hypertension"],
                    ["P003", "Paul Durand", "150", "Asthme"],
                    ["P004", "", "67", ""]
                  ].map((row, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 text-xs font-mono py-1 border-b border-red-200">
                      {row.map((cell, cellIndex) => (
                        <div key={cellIndex} className={cell === "NULL" || cell === "" || cell === "150" || cell === "diabete" ? "text-red-600 font-semibold" : ""}>
                          {cell || "(vide)"}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium text-red-600">Problèmes Identifiés :</h5>
                  <ul className="text-sm text-red-600 space-y-1">
                    <li>• Doublon P001 (formats différents)</li>
                    <li>• Âge manquant P002</li>
                    <li>• Âge aberrant P003 (150 ans)</li>
                    <li>• Données manquantes P004</li>
                    <li>• Incohérence casse diagnostic</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-green-700 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Après Nettoyage
                </h4>
                <div className="bg-green-50 p-4 rounded-lg space-y-3">
                  <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                    <div className="font-semibold">ID</div>
                    <div className="font-semibold">Nom Complet</div>
                    <div className="font-semibold">Âge</div>
                    <div className="font-semibold">Diagnostic</div>
                  </div>
                  {[
                    ["P001", "Jean Dupont", "45", "Diabète"],
                    ["P002", "Marie Martin", "(manquant)", "Hypertension"],
                    ["P003", "Paul Durand", "(manquant)", "Asthme"]
                  ].map((row, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 text-xs font-mono py-1 border-b border-green-200">
                      {row.map((cell, cellIndex) => (
                        <div key={cellIndex} className="text-green-700">
                          {cell}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <h5 className="font-semibold text-green-700 mb-2">Actions Correctives</h5>
                  <ul className="text-sm text-green-600 space-y-1">
                    <li>• Fusion des doublons P001</li>
                    <li>• Âge impossible P003 (150) marqué manquant, jamais « corrigé » à la main</li>
                    <li>• Standardisation des noms et de la casse du diagnostic</li>
                    <li>• Ligne P004 écartée (identité et diagnostic absents), décision documentée</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h5 className="font-semibold text-blue-700 mb-2">Enrichissements</h5>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• Colonne indicatrice « âge manquant »</li>
                    <li>• Imputation de l'âge (médiane) après découpage train/test</li>
                    <li>• Nom complet normalisé</li>
                    <li>• Validation métier (âge entre 0 et 120)</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4">
                  <h5 className="font-semibold text-purple-700 mb-2">Prêt pour Analyse</h5>
                  <ul className="text-sm text-purple-600 space-y-1">
                    <li>• Effectifs par diagnostic</li>
                    <li>• Âge moyen par diagnostic (valeurs manquantes exclues)</li>
                    <li>• Profilage des patients</li>
                    <li>• Documentation des exclusions</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-semibold text-blue-700 mb-3">Pipeline de Nettoyage Appliqué</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h6 className="font-medium mb-2">Étapes de nettoyage :</h6>
                  <ol className="text-blue-600 space-y-1">
                    <li>1. Harmoniser la casse, les espaces et les formats</li>
                    <li>2. Repérer les doublons (identifiant et nom normalisé)</li>
                    <li>3. Valider les contraintes métier (âge)</li>
                    <li>4. Marquer comme manquantes les valeurs impossibles</li>
                    <li>5. Écarter ce qui est inexploitable, en le documentant</li>
                  </ol>
                </div>
                <div>
                  <h6 className="font-medium mb-2">Règles métier possibles :</h6>
                  <ul className="text-blue-600 space-y-1">
                    <li>• Âge entre 0 et 120 ans (appliquée ici)</li>
                    <li>• Date de sortie postérieure ou égale à la date d'admission</li>
                    <li>• Code postal français à cinq chiffres</li>
                    <li>• Diagnostic présent dans la nomenclature utilisée</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </section>
  );
};

export default CleaningSection;