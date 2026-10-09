import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GlossaryTerm } from '@/components/ui/glossary-term';
import { dataPreparationEnhancedDefinitions } from '@/data/data-preparation-enhanced-definitions';
import { Search, Code, BarChart3, Lightbulb } from 'lucide-react';

/**
 * Audit section component for Data Preparation page
 * Covers data quality audit and assessment techniques
 */
const AuditSection: React.FC = () => {
  const dataQualityDimensions = [
    {
      name: "Exactitude",
      description: "Les données correspondent-elles à la réalité ?",
      example: "L'âge de Jean est-il vraiment de 150 ans ?",
      impact: "Résultats d'analyse faussés",
      metrics: ["Taux d'erreur", "Validation croisée"]
    },
    {
      name: "Complétude", 
      description: "Toutes les données nécessaires sont-elles présentes ?",
      example: "Manque-t-il des dates de naissance ?",
      impact: "Biais d'échantillonnage",
      metrics: ["% de valeurs manquantes", "Couverture des champs"]
    },
    {
      name: "Cohérence",
      description: "Les données sont-elles uniformes et logiques ?",
      example: "Format de dates : 01/02/2023 vs 2023-02-01",
      impact: "Erreurs de traitement",
      metrics: ["Violations de règles", "Écarts de format"]
    },
    {
      name: "Fraîcheur",
      description: "Les données sont-elles à jour ?",
      example: "Prix d'un produit modifié il y a 6 mois",
      impact: "Décisions obsolètes",
      metrics: ["Âge des données", "Fréquence de mise à jour"]
    },
    {
      name: "Validité",
      description: "Les données respectent-elles les contraintes définies ?",
      example: "Code postal avec 6 chiffres au lieu de 5",
      impact: "Erreurs de système",
      metrics: ["Contraintes violées", "Formats invalides"]
    },
    {
      name: "Unicité",
      description: "Chaque entité est-elle représentée une seule fois ?",
      example: "Client présent 3 fois avec des variantes de nom",
      impact: "Surestimation des volumes",
      metrics: ["Taux de doublons", "Clés en double"]
    }
  ];

  const auditTools = [
    {
      tool: "fg-data-profiling (ex ydata-profiling, ex pandas-profiling)",
      language: "Python",
      description: "Génère un rapport HTML de profilage d'un tableau pandas",
      features: ["Statistiques descriptives", "Histogrammes", "Corrélations", "Valeurs manquantes"],
      code: "from data_profiling import ProfileReport\nProfileReport(df).to_file('report.html')"
    },
    {
      tool: "Great Expectations",
      language: "Python",
      description: "Tests automatisés de la qualité des données",
      features: ["Assertions sur les données", "Documentation générée", "Intégration CI/CD", "Alertes"],
      code: "ExpectColumnValuesToBeBetween(column='age', min_value=0, max_value=120)  # l'API varie selon la version"
    },
    {
      tool: "Deequ (Amazon)",
      language: "Scala / Spark",
      description: "Bibliothèque Spark pour grands volumes (PyDeequ pour Python)",
      features: ["Métriques qualité", "Contraintes", "Détection d'anomalies", "Suggestions"],
      code: "VerificationSuite().onData(df).addCheck(check).run()  // Scala ; PyDeequ : VerificationSuite(spark)"
    }
  ];

  const qualityKPIs = [
    { metric: "Complétude", value: "94,2 %", trend: "up", target: "95 %", color: "orange" },
    { metric: "Exactitude", value: "87,5 %", trend: "down", target: "90 %", color: "orange" },
    { metric: "Unicité", value: "99,1 %", trend: "stable", target: "99 %", color: "green" },
    { metric: "Cohérence", value: "82,3 %", trend: "up", target: "85 %", color: "orange" },
    { metric: "Fraîcheur", value: "91,8 %", trend: "up", target: "90 %", color: "green" },
    { metric: "Validité", value: "96,4 %", trend: "stable", target: "95 %", color: "green" }
  ];

  return (
    <section id="audit" className="space-y-12">
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-bold flex items-center justify-center gap-3">
          <Search className="h-8 w-8 text-orange-500" />
          Audit de qualité des données
        </h2>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          Avant de nettoyer, il faut diagnostiquer. L'audit de qualité révèle les problèmes 
          cachés et guide les actions de remédiation.
        </p>
      </div>

      {/* Dimensions de qualité */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Les six dimensions de la qualité des données</CardTitle>
          <p className="text-center text-muted-foreground">
            Six questions pour évaluer la qualité d'un jeu de données, chacune avec des métriques qu'on peut calculer
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataQualityDimensions.map((dimension, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700">
                    <GlossaryTerm 
                      definition={dataPreparationEnhancedDefinitions[
                        dimension.name === 'Exactitude' ? 'exactitude' :
                        dimension.name === 'Complétude' ? 'complétude' :
                        dimension.name === 'Cohérence' ? 'cohérence' :
                        dimension.name === 'Fraîcheur' ? 'fraîcheur' :
                        dimension.name === 'Validité' ? 'validité' :
                        'unicité'
                      ]}
                      variant="hover"
                      highlightStyle="glow"
                    >
                      {dimension.name}
                    </GlossaryTerm>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{dimension.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h5 className="font-medium text-sm text-blue-700 mb-1">Exemple :</h5>
                    <p className="text-sm text-blue-600">{dimension.example}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <h5 className="font-medium text-sm text-red-700 mb-1">Impact :</h5>
                    <p className="text-sm text-red-600">{dimension.impact}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h5 className="font-medium text-sm text-green-700 mb-1">Métriques :</h5>
                    <div className="flex flex-wrap gap-1">
                      {dimension.metrics.map((metric, mIndex) => (
                        <Badge key={mIndex} variant="outline" className="text-xs text-green-600">
                          {metric}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audit automatisé */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-purple-500" />
              Outils d'audit automatisé
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {auditTools.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-purple-700">
                      <GlossaryTerm 
                        definition={dataPreparationEnhancedDefinitions[
                          item.tool.toLowerCase().includes('pandas') ? 'pandasProfiling' :
                          item.tool.toLowerCase().includes('great') ? 'greatExpectations' :
                          'deequ'
                        ]}
                        variant="hover"
                        highlightStyle="underline"
                      >
                        {item.tool}
                      </GlossaryTerm>
                    </h4>
                    <Badge variant="outline">{item.language}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.features.map((feature, fIndex) => (
                      <Badge key={fIndex} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <code className="text-xs bg-muted p-2 rounded block overflow-x-auto whitespace-pre">
                    {item.code}
                  </code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              Tableau de bord qualité (exemple)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Indicateurs que l'on peut suivre à chaque exécution pour repérer une dégradation de la qualité.
              Les valeurs ci-dessous sont un exemple fictif, pas une mesure.
            </p>
            
            <div className="space-y-4">
              {qualityKPIs.map((kpi, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${kpi.color === 'green' ? 'bg-green-500' : 'bg-orange-500'}`} />
                    <span className="font-medium">
                      <GlossaryTerm 
                        definition={dataPreparationEnhancedDefinitions['qualityKPIs']}
                        variant="hover"
                        highlightStyle="underline"
                      >
                        {kpi.metric}
                      </GlossaryTerm>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{kpi.value}</span>
                    <span className="text-xs text-muted-foreground">/ {kpi.target}</span>
                    <div className={`w-4 h-4 ${
                      kpi.trend === 'up' ? 'text-green-500' : 
                      kpi.trend === 'down' ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      {kpi.trend === 'up' ? '↗' : kpi.trend === 'down' ? '↘' : '→'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <Lightbulb className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-700">
                <strong>Conseil :</strong> calculez ces métriques dans votre pipeline à chaque exécution,
                et fixez les seuils avec les personnes qui utilisent les données.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Framework d'évaluation */}
      <Card className="bg-gradient-to-br from-orange-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-orange-500" />
            Méthode d'audit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-orange-700">1️⃣ Préparation</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Définir les objectifs d'audit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Identifier les sources de données</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Établir les critères de qualité</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-orange-700">2️⃣ Exécution</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Profilage automatisé des données</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Tests de validation personnalisés</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Analyse des anomalies</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-orange-700">3️⃣ Rapport</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Synthèse des problèmes identifiés</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Priorisation des actions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Plan de remédiation</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default AuditSection;