import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, FileText, BarChart3, Settings } from "lucide-react";
import CourseHighlight from "@/components/courses/CourseHighlight";
import RunnableCode from "@/components/courses/lessons/RunnableCode";
import { VALIDATION_RAPPORT } from "@/data/data-quality-demos";

/**
 * Validation Section Component
 * Provides comprehensive data quality validation and testing tools
 */
export const ValidationSection: React.FC = () => {
  const [activeTest, setActiveTest] = useState<string>("quality");

  /**
   * Data quality test categories
   */
  const testCategories = [
    {
      id: "quality",
      name: "Tests de qualité",
      icon: CheckCircle,
      description: "Complétude, exactitude, cohérence"
    },
    {
      id: "metrics",
      name: "Métriques",
      icon: BarChart3,
      description: "Indicateurs de qualité et leur calcul"
    },
    {
      id: "compliance",
      name: "Conformité",
      icon: Shield,
      description: "Respect des règles et standards"
    },
    {
      id: "business",
      name: "Cohérence métier",
      icon: Settings,
      description: "Règles métier et logique du domaine"
    }
  ];

  /**
   * Familles de contrôles : ce qu'on vérifie, comment le calculer avec pandas, un exemple de violation.
   * Aucun score ici : les chiffres d'un rapport se calculent sur des données (voir le rapport exécutable plus haut).
   */
  const qualityChecks = [
    {
      name: "Complétude",
      question: "Les champs obligatoires sont-ils renseignés ?",
      code: "df['client_id'].notna().mean()",
      example: "une commande sans identifiant de client",
      critical: false
    },
    {
      name: "Validité des formats",
      question: "Les valeurs ont-elles la forme attendue ?",
      code: "df['code_postal'].str.fullmatch('[0-9]{5}')",
      example: "un code postal à quatre chiffres, une adresse électronique sans domaine",
      critical: false
    },
    {
      name: "Cohérence temporelle",
      question: "Les dates s'enchaînent-elles dans le bon ordre ?",
      code: "(df['livraison'] >= df['commande']).mean()",
      example: "une livraison datée de la veille de la commande",
      critical: true
    },
    {
      name: "Unicité des identifiants",
      question: "Chaque identifiant n'apparaît-il qu'une fois ?",
      code: "df['client_id'].duplicated().sum()",
      example: "deux fiches différentes avec le même identifiant",
      critical: true
    }
  ];

  /**
   * Règles métier : chaque règle s'écrit comme un test qui renvoie vrai ou faux pour chaque ligne
   */
  const businessRules = [
    {
      rule: "Âge entre 0 et 120 ans",
      code: "df['age'].between(0, 120)",
      why: "un âge de 150 ans est une erreur de saisie, pas un client"
    },
    {
      rule: "Montant de vente strictement positif",
      code: "df['montant'] > 0",
      why: "un montant nul ou négatif peut être un avoir, un test ou une erreur : à distinguer avec les équipes concernées"
    },
    {
      rule: "Date de livraison postérieure ou égale à la date de commande",
      code: "df['livraison'] >= df['commande']",
      why: "l'ordre inverse signale une date mal saisie ou un fuseau horaire mal géré"
    },
    {
      rule: "Code produit présent dans le catalogue",
      code: "df['produit'].isin(catalogue['produit'])",
      why: "un produit inconnu fausse toutes les analyses par produit"
    }
  ];

  return (
    <section id="validation" className="space-y-12">
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-bold flex items-center justify-center gap-3">
          <Shield className="h-8 w-8 text-green-500" />
          Validation des données
        </h2>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          La validation vérifie que vos données respectent les standards de qualité, 
          les règles métier et les exigences de conformité avant utilisation. Le rapport exécutable calcule ses chiffres sur un petit tableau inventé ;
          les onglets décrivent les familles de contrôles et la façon de les calculer.
        </p>
      </div>

      <CourseHighlight type="concept" title="Quatre familles de contrôles">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {testCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  activeTest === category.id ? 'ring-2 ring-green-500 bg-green-50' : ''
                }`}
                onClick={() => setActiveTest(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <IconComponent className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <h4 className="font-semibold mb-1">{category.name}</h4>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CourseHighlight>

      {/* Validation Dashboard */}
      <Card className="bg-gradient-to-br from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Un rapport de validation, calculé
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Valider, c'est écrire chaque règle sous forme de test, l'appliquer à toutes les lignes, puis compter les violations.
              L'exemple ci-dessous fabrique vingt commandes inventées, avec quelques défauts glissés exprès, et produit le rapport
              à partir de ces données : le code s'exécute dans votre navigateur et chaque nombre est calculé.
              Modifiez une règle ou une valeur, puis cliquez sur « Exécuter ».
            </p>
            <RunnableCode
              language="python"
              code={VALIDATION_RAPPORT}
              label="Rapport de validation sur des commandes inventées, modifiable"
              caption="Sept règles, vingt commandes. Le statut dépend d'un seuil (SEUIL_ERREUR) qui est un choix à faire avec les personnes qui connaissent les données. La somme des violations dépasse le nombre de lignes concernées, car une même ligne peut enfreindre plusieurs règles : ne pas additionner les violations pour compter les lignes défectueuses."
            />
          </div>

          <p className="text-sm text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
            Les onglets suivants passent en revue les familles de contrôles : ce que chacune vérifie et comment la calculer.
            Ils ne donnent aucun score, car un score n'a de sens que calculé sur de vraies données, comme dans le rapport ci-dessus.
          </p>

          <Tabs value={activeTest} onValueChange={setActiveTest}>
            <TabsList className="grid w-full grid-cols-4">
              {testCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="quality" className="space-y-4">
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold mb-4">Tests de qualité des données</h4>
                <div className="space-y-4">
                  {qualityChecks.map((check) => (
                    <div key={check.name} className="p-4 border rounded-lg">
                      <div className="font-medium flex flex-wrap items-center gap-2">
                        {check.name}
                        {check.critical && (
                          <Badge variant="destructive" className="text-xs">Critique</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{check.question}</p>
                      <p className="text-sm mt-2">
                        Calcul avec pandas : <code className="bg-gray-100 px-1 rounded text-xs [overflow-wrap:anywhere]">{check.code}</code>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Exemple de violation : {check.example}.</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  « Critique » veut dire qu'une seule violation peut fausser les analyses (des dates dans le désordre, un identifiant
                  partagé par deux personnes) : on bloque la livraison des données plutôt que de signaler et continuer.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold mb-4">Indicateurs de validation et leur calcul</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      category: "Complétude",
                      metrics: [
                        { name: "Taux de remplissage", formula: "cellules renseignées / cellules attendues" },
                        { name: "Lignes complètes", formula: "lignes dont tous les champs obligatoires sont renseignés / lignes" }
                      ]
                    },
                    {
                      category: "Exactitude",
                      metrics: [
                        { name: "Formats valides", formula: "valeurs au bon format / valeurs renseignées" },
                        { name: "Valeurs dans les bornes", formula: "valeurs dans la plage admise / valeurs renseignées" },
                        { name: "Cohérence référentielle", formula: "clés trouvées dans la table de référence / clés" }
                      ]
                    },
                    {
                      category: "Cohérence",
                      metrics: [
                        { name: "Règles métier respectées", formula: "lignes sans aucune violation / lignes" },
                        { name: "Ordre des dates", formula: "paires de dates dans le bon ordre / paires renseignées" }
                      ]
                    }
                  ].map((category) => (
                    <Card key={category.category}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">{category.category}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {category.metrics.map((metric) => (
                          <div key={metric.name}>
                            <div className="text-sm font-medium">{metric.name}</div>
                            <div className="text-xs text-muted-foreground">{metric.formula}</div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Un indicateur isolé dit peu de choses : on le suit d'une livraison de données à l'autre, et on fixe ses seuils
                  d'alerte avec les personnes qui connaissent les données. Attention à ne pas additionner les violations de plusieurs
                  règles pour compter les lignes défectueuses : une même ligne peut en enfreindre plusieurs.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-4">
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold mb-4">Conformité : les questions à se poser</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-blue-700 flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Données personnelles (RGPD)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-2">
                        <li>• Quelles colonnes contiennent des données personnelles, directement ou par recoupement ?</li>
                        <li>• Sur quelle base légale sont-elles traitées (consentement, contrat, obligation légale, intérêt légitime...) ?</li>
                        <li>• Peut-on retrouver et effacer les données d'une personne qui le demande ?</li>
                        <li>• Combien de temps les garde-t-on, et qui y a accès ?</li>
                        <li>• Sont-elles protégées pendant leur transfert et leur stockage ?</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-green-700 flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Documentation et traçabilité
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-2">
                        <li>• Chaque colonne a-t-elle une définition, une unité, une source (dictionnaire de données) ?</li>
                        <li>• Sait-on qui a modifié quoi, et quand ?</li>
                        <li>• Les règles de validation sont-elles écrites et versionnées avec le code ?</li>
                        <li>• Pour aller plus loin, des référentiels existent : la norme ISO 8000 sur la qualité des données, le guide DAMA-DMBOK sur la gestion des données.</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="business" className="space-y-4">
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold mb-4">Contrôles de cohérence métier</h4>
                <div className="space-y-4">
                  {businessRules.map((rule) => (
                    <div key={rule.rule} className="p-4 border rounded-lg">
                      <div className="font-medium">{rule.rule}</div>
                      <p className="text-sm mt-2">
                        Test : <code className="bg-gray-100 px-1 rounded text-xs [overflow-wrap:anywhere]">{rule.code}</code>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Pourquoi : {rule.why}.</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">Dans quel ordre corriger</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• D'abord les violations critiques, qui faussent tout le reste (dates incohérentes, identifiants en double).</li>
                    <li>• Ensuite celles qui demandent l'avis des équipes concernées (montants nuls ou négatifs : erreur ou avoir ?).</li>
                    <li>• Puis automatiser les contrôles, pour qu'ils tournent à chaque nouvelle livraison de données.</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
};

export default ValidationSection;