import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { GlossaryTerm } from '@/components/ui/glossary-term';
import { dataPreparationEnhancedDefinitions } from '../../../data/data-preparation-enhanced-definitions';
import { 
  Workflow, 
  Play, 
  Pause, 
  Monitor, 
  Cloud, 
  GitBranch, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Settings,
  Database,
  Zap
} from "lucide-react";
import CourseHighlight from "@/components/courses/CourseHighlight";
import RunnableCode from "@/components/courses/lessons/RunnableCode";
import { MONITORING_SIMULATION } from "@/data/data-quality-demos";

/**
 * Automation Section Component
 * Provides ETL pipelines, workflow orchestration, and production deployment tools
 */
export const AutomationSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("etl");

  /**
   * Automation categories
   */
  const automationCategories = [
    {
      id: "etl",
      name: "Pipelines ETL",
      icon: Database,
      description: "Extract, Transform, Load"
    },
    {
      id: "orchestration",
      name: "Orchestration",
      icon: Workflow,
      description: "Gestion des workflows"
    },
    {
      id: "monitoring",
      name: "Monitoring",
      icon: Monitor,
      description: "Surveillance qualité"
    },
    {
      id: "deployment",
      name: "Déploiement",
      icon: Cloud,
      description: "Mise en production"
    }
  ];

  /**
   * Trois pipelines d'exemple (fictifs) : ce qui compte est l'enchaînement des étapes, pas des durées ou des taux,
   * qui n'auraient de sens que mesurés. Le troisième montre l'intérêt d'une étape de validation qui bloque la suite.
   */
  const etlPipelines = [
    {
      id: "sales-pipeline",
      name: "Pipeline Ventes",
      status: "running",
      note: "La transformation est en cours ; le chargement attend qu'elle se termine.",
      stages: [
        { name: "Extraction", status: "completed" },
        { name: "Validation", status: "completed" },
        { name: "Transformation", status: "running" },
        { name: "Chargement", status: "pending" }
      ]
    },
    {
      id: "customer-pipeline",
      name: "Pipeline Clients",
      status: "completed",
      note: "Toutes les étapes ont réussi : les données sont disponibles pour les analyses.",
      stages: [
        { name: "Extraction", status: "completed" },
        { name: "Validation", status: "completed" },
        { name: "Transformation", status: "completed" },
        { name: "Chargement", status: "completed" }
      ]
    },
    {
      id: "inventory-pipeline",
      name: "Pipeline Inventaire",
      status: "error",
      note: "La validation a échoué : la transformation et le chargement ne sont pas lancés, les données douteuses n'atteignent pas les tableaux de bord.",
      stages: [
        { name: "Extraction", status: "completed" },
        { name: "Validation", status: "error" },
        { name: "Transformation", status: "skipped" },
        { name: "Chargement", status: "skipped" }
      ]
    }
  ];

  /**
   * Workflow orchestration templates
   */
  const workflowTemplates = [
    {
      name: "Data Ingestion Daily",
      description: "Ingestion quotidienne des données sources",
      schedule: "0 2 * * *",
      steps: 8,
      avgDuration: "25m"
    },
    {
      name: "Quality Check Weekly",
      description: "Contrôles qualité hebdomadaires",
      schedule: "0 6 * * 1",
      steps: 12,
      avgDuration: "45m"
    },
    {
      name: "ML Model Retrain",
      description: "Réentraînement des modèles ML",
      schedule: "0 1 1 * *",
      steps: 15,
      avgDuration: "2h 30m"
    }
  ];

  /**
   * Get status icon and color
   */
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "running":
        return { icon: <Play className="h-4 w-4 text-blue-500" />, color: "blue", bg: "bg-blue-50" };
      case "completed":
        return { icon: <CheckCircle className="h-4 w-4 text-green-500" />, color: "green", bg: "bg-green-50" };
      case "error":
        return { icon: <AlertCircle className="h-4 w-4 text-red-500" />, color: "red", bg: "bg-red-50" };
      case "pending":
        return { icon: <Clock className="h-4 w-4 text-gray-500" />, color: "gray", bg: "bg-gray-50" };
      default:
        return { icon: <Pause className="h-4 w-4 text-gray-500" />, color: "gray", bg: "bg-gray-50" };
    }
  };

  return (
    <section id="automation" className="space-y-12">
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-bold flex items-center justify-center gap-3">
          <Zap className="h-8 w-8 text-orange-500" />
          Automatisation des Processus
        </h2>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          L'automatisation permet de créer des pipelines robustes, reproductibles et scalables 
          pour traiter vos données de manière industrielle.
        </p>
      </div>

      <CourseHighlight type="concept" title="Écosystème d'Automatisation Complet">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {automationCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  activeTab === category.id ? 'ring-2 ring-orange-500 bg-orange-50' : ''
                }`}
                onClick={() => setActiveTab(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <IconComponent className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                  <h4 className="font-semibold mb-1">
                    <GlossaryTerm 
                      definition={dataPreparationEnhancedDefinitions[
                        category.id === 'etl' ? 'etl' :
                        category.id === 'orchestration' ? 'orchestration' :
                        category.id === 'monitoring' ? 'monitoring' :
                        'deployment'
                      ]}
                      variant="hover"
                      highlightStyle="glow"
                    >
                      {category.name}
                    </GlossaryTerm>
                  </h4>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CourseHighlight>

      {/* Automation Control Panel */}
      <Card className="bg-gradient-to-br from-orange-50 to-red-50">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-orange-500" />
              Centre de Contrôle Automatisation
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              {automationCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="etl" className="space-y-4">
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold mb-4">Un pipeline, étape par étape (exemples fictifs)</h4>
                <div className="space-y-4">
                  {etlPipelines.map((pipeline) => {
                    const statusDisplay = getStatusDisplay(pipeline.status);
                    return (
                      <Card key={pipeline.id} className={statusDisplay.bg}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              {statusDisplay.icon}
                              <div>
                                <h5 className="font-semibold">{pipeline.name}</h5>
                                <p className="text-sm text-muted-foreground">{pipeline.note}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {pipeline.stages.map((stage, index) => {
                              const stageStatus = getStatusDisplay(stage.status);
                              return (
                                <div key={index} className="text-center p-2 bg-white rounded border">
                                  <div className="flex items-center justify-center mb-1">
                                    {stageStatus.icon}
                                  </div>
                                  <div className="text-xs font-medium">{stage.name}</div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-3">🛠️ Configuration Pipeline ETL</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h6 className="font-medium mb-2">Sources de Données:</h6>
                      <ul className="text-blue-700 space-y-1">
                        <li>• Base PostgreSQL (CRM)</li>
                        <li>• API REST (E-commerce)</li>
                        <li>• Fichiers CSV (Inventaire)</li>
                        <li>• Kafka Streams (Temps réel)</li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="font-medium mb-2">Transformations:</h6>
                      <ul className="text-blue-700 space-y-1">
                        <li>• Nettoyage et validation</li>
                        <li>• Enrichissement géographique</li>
                        <li>• Calculs de métriques</li>
                        <li>• Agrégations temporelles</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="orchestration" className="space-y-4">
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold mb-4">🎼 Orchestration des Workflows</h4>
                <div className="space-y-4">
                  {workflowTemplates.map((workflow, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Workflow className="h-5 w-5 text-purple-500" />
                            <div>
                              <h5 className="font-semibold">{workflow.name}</h5>
                              <p className="text-sm text-muted-foreground">{workflow.description}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center p-2 bg-purple-50 rounded">
                            <div className="font-semibold text-purple-600">{workflow.schedule}</div>
                            <div className="text-purple-700">Planification</div>
                          </div>
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <div className="font-semibold text-blue-600">{workflow.steps}</div>
                            <div className="text-blue-700">Étapes</div>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <div className="font-semibold text-green-600">{workflow.avgDuration}</div>
                            <div className="text-green-700">Durée moy.</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
                    <CardHeader>
                      <CardTitle className="text-purple-700 flex items-center gap-2">
                        <GitBranch className="h-5 w-5" />
                        Orchestrateurs courants
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {[
                        { name: "Apache Airflow", role: "logiciel libre, enchaînements de tâches décrits en Python ; très répandu" },
                        { name: "Prefect", role: "logiciel libre, flux écrits comme des fonctions Python" },
                        { name: "Dagster", role: "logiciel libre, organisé autour des données produites" },
                        { name: "Azure Data Factory", role: "service géré du nuage de Microsoft" }
                      ].map((orchestrator) => (
                        <div key={orchestrator.name} className="p-2 bg-white rounded">
                          <div className="text-sm font-medium">{orchestrator.name}</div>
                          <div className="text-xs text-muted-foreground">{orchestrator.role}</div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-teal-50">
                    <CardHeader>
                      <CardTitle className="text-green-700 flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Ce que l'on planifie
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <ul className="text-sm space-y-2">
                        <li>• <strong>Quand</strong> : à heure fixe (tous les jours à 6 h) ou à l'arrivée d'un fichier</li>
                        <li>• <strong>Dans quel ordre</strong> : une tâche ne démarre que si celles dont elle dépend ont réussi</li>
                        <li>• <strong>En cas d'échec</strong> : combien de nouvelles tentatives, après quel délai</li>
                        <li>• <strong>Qui prévenir</strong> : une alerte quand une tâche échoue ou dure anormalement</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-4">
              <div className="bg-white p-6 rounded-lg border space-y-4">
                <h4 className="font-semibold">Monitoring de la qualité</h4>
                <p className="text-sm text-muted-foreground">
                  Surveiller un pipeline, c'est calculer à chaque exécution quelques indicateurs (lignes reçues, lignes rejetées par les contrôles, durée),
                  puis les comparer à ce qui est habituel pour déclencher une alerte quand l'écart devient trop grand.
                  L'exemple ci-dessous <strong>simule</strong> une semaine d'exécutions quotidiennes avec un générateur à graine fixe :
                  aucun pipeline réel n'a tourné, mais les indicateurs et les alertes sont bien calculés par le code, dans votre navigateur.
                  Modifiez un seuil, puis cliquez sur « Exécuter ».
                </p>
                <RunnableCode
                  language="python"
                  code={MONITORING_SIMULATION}
                  label="Simulation d'une semaine d'exécutions d'un pipeline et alertes calculées, modifiable"
                  caption="Deux incidents sont glissés exprès dans la simulation : le jeudi la source n'envoie qu'une partie des lignes, le samedi un format change et les contrôles rejettent beaucoup. Le jeudi, le taux de rejet reste normal (1,1 %) : seule l'alerte de volume détecte le problème. Un pipeline peut paraître sain alors qu'il a reçu bien moins de lignes que d'habitude. Les seuils sont des choix, à ajuster d'après l'historique de chaque pipeline."
                />

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-3">Indicateurs souvent surveillés</h5>
                  <ul className="text-sm text-blue-700 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                    <li>• <strong>Volume reçu</strong> : comparé à la médiane des jours précédents</li>
                    <li>• <strong>Taux de rejet</strong> : part des lignes refusées par les contrôles</li>
                    <li>• <strong>Durée d'exécution</strong> : comparée à la durée habituelle</li>
                    <li>• <strong>Fraîcheur</strong> : âge de la dernière donnée reçue</li>
                    <li>• <strong>Schéma</strong> : colonnes et types attendus</li>
                    <li>• <strong>Distribution</strong> : valeurs qui changent de nature d'un jour à l'autre</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="deployment" className="space-y-4">
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold mb-4">🚀 Déploiement en Production</h4>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        env: "Développement",
                        status: "essais",
                        version: "v2.1.3",
                        role: "on essaie et on casse sans conséquence",
                        color: "blue"
                      },
                      {
                        env: "Recette (staging)",
                        status: "vérification",
                        version: "v2.1.4-rc1",
                        role: "copie de la production, pour tester une nouvelle version dans des conditions réalistes",
                        color: "yellow"
                      },
                      {
                        env: "Production",
                        status: "en service",
                        version: "v2.1.2",
                        role: "ce qu'utilisent les personnes ; on n'y met que ce qui a passé la recette",
                        color: "green"
                      }
                    ].map((env, index) => (
                      <Card key={index} className={`bg-${env.color}-50 border-${env.color}-200`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-semibold">{env.env}</h5>
                            <Badge className={`bg-${env.color}-600`}>{env.status}</Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Version (exemple) :</span>
                              <span className="font-mono">{env.version}</span>
                            </div>
                            <p className="text-muted-foreground">{env.role}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="bg-gradient-to-br from-gray-50 to-blue-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Cloud className="h-5 w-5 text-blue-500" />
                        Infrastructure Cloud
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h6 className="font-medium mb-3">Plateformes courantes</h6>
                          <div className="space-y-2">
                            {[
                              { name: "AWS", services: "EC2, S3, RDS, Lambda" },
                              { name: "Azure", services: "VMs, Blob, SQL, Functions" },
                              { name: "GCP", services: "Compute, Storage, BigQuery" },
                              { name: "Kubernetes", services: "Pods, Services, Ingress" }
                            ].map((platform, index) => (
                              <div key={index} className="p-2 bg-white rounded border">
                                <div className="font-medium text-sm">{platform.name}</div>
                                <div className="text-xs text-muted-foreground">{platform.services}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h6 className="font-medium mb-3">Outils DevOps</h6>
                          <div className="space-y-2">
                            {[
                              { tool: "Docker", role: "emballer le programme et ses dépendances dans une image" },
                              { tool: "Terraform", role: "décrire l'infrastructure dans des fichiers versionnés" },
                              { tool: "Ansible", role: "configurer des serveurs de façon répétable" },
                              { tool: "Jenkins", role: "lancer tests et déploiements à chaque modification" }
                            ].map((tool) => (
                              <div key={tool.tool} className="p-2 bg-white rounded border">
                                <div className="text-sm font-medium">{tool.tool}</div>
                                <div className="text-xs text-muted-foreground">{tool.role}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h5 className="font-medium text-green-800 mb-3">✅ Checklist Déploiement</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h6 className="font-medium mb-2">Pré-déploiement:</h6>
                        <ul className="text-green-700 space-y-1">
                          <li>✓ Tests unitaires passés</li>
                          <li>✓ Tests d'intégration validés</li>
                          <li>✓ Revue de code approuvée</li>
                          <li>✓ Documentation mise à jour</li>
                        </ul>
                      </div>
                      <div>
                        <h6 className="font-medium mb-2">Post-déploiement:</h6>
                        <ul className="text-green-700 space-y-1">
                          <li>✓ Monitoring activé</li>
                          <li>✓ Alertes configurées</li>
                          <li>✓ Rollback plan prêt</li>
                          <li>✓ Équipe notifiée</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
};

export default AutomationSection;