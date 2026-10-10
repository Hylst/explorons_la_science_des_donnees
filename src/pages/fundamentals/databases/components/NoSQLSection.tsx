
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cloud, FileText, Network, Key, Lightbulb, Zap, AlertCircle, Table2 } from "lucide-react";

const NoSQLSection = () => {
  const nosqlTypes = {
    document: {
      icon: <FileText className="h-5 w-5" />,
      title: "Documents (Document Stores)",
      description: "Stockage de documents JSON/BSON flexibles",
      examples: ["MongoDB", "CouchDB", "Amazon DocumentDB"],
      useCases: [
        "Applications web modernes",
        "Catalogues de produits",
        "Gestion de contenu",
        "Profils utilisateurs"
      ],
      structure: `{
  "_id": "507f1f77bcf86cd799439011",
  "nom": "Alice Dupont",
  "age": 28,
  "competences": ["Python", "SQL", "Machine Learning"],
  "projets": [
    {
      "nom": "Analyse sentiment",
      "statut": "terminé",
      "technologies": ["NLP", "TensorFlow"]
    }
  ],
  "adresse": {
    "rue": "123 rue de la Data",
    "ville": "Paris",
    "cp": "75001"
  }
}`,
      advantages: [
        "Schéma flexible et évolutif",
        "Requêtes riches et expressives", 
        "Mise à l'échelle horizontale naturelle",
        "Performance sur lectures"
      ],
      disadvantages: [
        "Transactions multi-documents plus coûteuses qu'en relationnel",
        "Risque de duplication des données",
        "Courbe d'apprentissage"
      ]
    },
    keyvalue: {
      icon: <Key className="h-5 w-5" />,
      title: "Clé-valeur (Key-Value)",
      description: "Stockage simple clé-valeur, avec une très faible latence en mémoire (Redis)",
      examples: ["Redis", "Amazon DynamoDB", "Riak"],
      useCases: [
        "Cache et sessions",
        "Compteurs en temps réel",
        "Configuration d'applications",
        "Queues de messages"
      ],
      structure: `# Cache utilisateur
user:1234 -> {"nom": "Alice", "derniere_connexion": "2024-01-15"}

# Compteurs temps réel  
page_views:accueil -> 156789
active_users:now -> 1547

# Session web
session:abc123 -> {"user_id": 1234, "panier": [1, 5, 12]}

# Configuration
app:maintenance_mode -> false
app:max_upload_size -> 10485760`,
      advantages: [
        "Accès par clé très rapide",
        "Modèle très simple",
        "Mise à l'échelle facilitée par le partage des clés",
        "Faible latence"
      ],
      disadvantages: [
        "Modèle de données très simple",
        "Pas de requêtes complexes",
        "Pas de relations entre entités"
      ]
    },
    columnar: {
      icon: <Table2 className="h-5 w-5" />,
      title: "Colonnes larges (Column Family)",
      description: "Lignes regroupant des familles de colonnes, pensées pour de très gros volumes d'écritures (à ne pas confondre avec le stockage en colonnes des entrepôts analytiques)",
      examples: ["Cassandra", "HBase", "ScyllaDB"],
      useCases: [
        "Journaux et métriques",
        "IoT et capteurs",
        "Séries temporelles",
        "Historiques d'activité"
      ],
      structure: `# Famille de colonnes : user_activity
Row Key: user_1234_2024-01-15

Column Family: actions
  login:09:30:00 -> "success"
  page_view:09:31:15 -> "/dashboard" 
  click:09:32:45 -> "button_analytics"
  logout:10:45:20 -> "manual"

Column Family: metrics  
  session_duration -> 4500
  pages_visited -> 12
  actions_count -> 27`,
      advantages: [
        "Très performant sur gros volumes",
        "Bonne compression",
        "Distribution automatique",
        "Écritures très rapides"
      ],
      disadvantages: [
        "Complexité de modélisation",
        "Requêtes limitées",
        "Courbe d'apprentissage élevée"
      ]
    },
    graph: {
      icon: <Network className="h-5 w-5" />,
      title: "Graphes (Graph Databases)",
      description: "Gestion des relations et réseaux complexes",
      examples: ["Neo4j", "Amazon Neptune", "ArangoDB"],
      useCases: [
        "Réseaux sociaux",
        "Détection de fraude",
        "Moteurs de recommandation",
        "Analyse de dépendances"
      ],
      structure: `// Cypher Query (Neo4j)
CREATE (alice:User {nom: "Alice", age: 28})
CREATE (bob:User {nom: "Bob", age: 32})
CREATE (python:Skill {nom: "Python"})
CREATE (ml:Skill {nom: "Machine Learning"})

CREATE (alice)-[:KNOWS {since: 2020}]->(bob)
CREATE (alice)-[:HAS_SKILL {level: "expert"}]->(python)
CREATE (alice)-[:HAS_SKILL {level: "intermediate"}]->(ml);

// Recommandation : amis d'amis qui partagent au moins une compétence (données d'exemple à compléter)
MATCH (user:User {nom: "Alice"})
      -[:KNOWS]->()-[:KNOWS]->(recommendation:User)
WHERE NOT (user)-[:KNOWS]->(recommendation)
  AND recommendation <> user
  AND (user)-[:HAS_SKILL]->()<-[:HAS_SKILL]-(recommendation)
RETURN DISTINCT recommendation;`,
      advantages: [
        "Requêtes de traversée naturelles",
        "Performance sur relations complexes",
        "Modélisation intuitive",
        "ACID complet"
      ],
      disadvantages: [
        "Courbe d'apprentissage spécifique",
        "Pas optimal pour données tabulaires",
        "Écosystème plus restreint"
      ]
    }
  };

  const [selectedType, setSelectedType] = useState<keyof typeof nosqlTypes>("document");

  return (
    <section id="nosql" className="scroll-mt-24 space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Cloud className="h-8 w-8 text-purple-600" />
        <h2 className="text-3xl font-bold">Bases NoSQL - Au-delà du relationnel</h2>
      </div>

      {/* Introduction NoSQL */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Pourquoi NoSQL ? Des compromis différents du relationnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="mb-4">
                <strong>NoSQL</strong> (Not Only SQL) répond aux limites du relationnel face aux défis modernes :
                volumes massifs, variété des données, mise à l'échelle horizontale.
              </p>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Les 3V du Big Data (souvent étendus à 5V : + Véracité et Valeur)</h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Volume :</strong> Téraoctets → Pétaoctets</li>
                  <li>• <strong>Vélocité :</strong> Données qui arrivent en continu, parfois en temps réel</li>
                  <li>• <strong>Variété :</strong> JSON, XML, images, logs, graphes...</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="bg-red-50 p-3 rounded-lg">
                <h5 className="font-semibold text-red-800 mb-1">Limites SQL classique</h5>
                <ul className="text-xs space-y-1">
                  <li>• Schéma rigide difficile à faire évoluer</li>
                  <li>• Mise à l'échelle verticale limitée et coûteuse (le partage entre serveurs est possible en SQL, mais plus délicat)</li>
                  <li>• Jointures complexes sur gros volumes</li>
                  <li>• Données très variables : le JSON est possible en SQL (JSONB sous PostgreSQL) mais moins naturel</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <h5 className="font-semibold text-green-800 mb-1">Avantages NoSQL</h5>
                <ul className="text-xs space-y-1">
                  <li>• Flexibilité du schéma</li>
                  <li>• Répartition sur plusieurs serveurs souvent prévue dès la conception</li>
                  <li>• Performance sur gros volumes</li>
                  <li>• Souvent mieux adapté aux données très variables ou très volumineuses</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sélecteur de types */}
      <Card>
        <CardHeader>
          <CardTitle>Les 4 familles NoSQL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {Object.entries(nosqlTypes).map(([key, type]) => (
              <Button
                key={key}
                variant={selectedType === key ? "default" : "outline"}
                onClick={() => setSelectedType(key as keyof typeof nosqlTypes)}
                className="h-auto py-3 flex flex-col items-center gap-2 whitespace-normal text-center"
              >
                {type.icon}
                <span className="text-xs font-medium">{type.title}</span>
              </Button>
            ))}
          </div>

          <div className="space-y-6">
            {/* En-tête du type sélectionné */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {nosqlTypes[selectedType].icon}
              <div>
                <h3 className="text-xl font-bold">{nosqlTypes[selectedType].title}</h3>
                <p className="text-gray-600">{nosqlTypes[selectedType].description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Détails et cas d'usage */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cas d'usage typiques</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {nosqlTypes[selectedType].useCases.map((useCase, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Zap className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Technologies populaires</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {nosqlTypes[selectedType].examples.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Exemple de structure */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Structure des données</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-xs">
                      <code>{nosqlTypes[selectedType].structure}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Avantages et inconvénients */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="text-lg text-green-700">Avantages</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {nosqlTypes[selectedType].advantages.map((advantage, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span className="text-sm">{advantage}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="text-lg text-red-700">Limitations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {nosqlTypes[selectedType].disadvantages.map((disadvantage, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">•</span>
                        <span className="text-sm">{disadvantage}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Théorème CAP */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Théorème CAP : Choisir ses compromis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            Le théorème CAP (conjecture de Brewer en 2000, démontrée par Gilbert et Lynch en 2002) montre
            qu'un système distribué ne peut pas garantir à la fois les 3 propriétés suivantes. Comme une partition
            réseau ne peut pas être exclue, le vrai choix se fait entre cohérence et disponibilité quand elle survient :
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <h4 className="font-bold text-blue-800 mb-2">Consistency</h4>
              <p className="text-sm">
                Tous les nœuds voient les mêmes données au même moment
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <h4 className="font-bold text-green-800 mb-2">Availability</h4>
              <p className="text-sm">
                Le système reste opérationnel même en cas de panne
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <h4 className="font-bold text-purple-800 mb-2">Partition tolerance</h4>
              <p className="text-sm">
                Le système continue de fonctionner malgré les coupures réseau
              </p>
            </div>
          </div>

          <Tabs defaultValue="cp" className="w-full">
            <TabsList className="grid w-full h-auto grid-cols-1 sm:grid-cols-3">
              <TabsTrigger value="cp" className="whitespace-normal">CP (Consistency + Partition)</TabsTrigger>
              <TabsTrigger value="ap" className="whitespace-normal">AP (Availability + Partition)</TabsTrigger>
              <TabsTrigger value="ca" className="whitespace-normal">CA (sans partition)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cp" className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Systèmes CP</h4>
                <p className="text-sm mb-3">
                  Privilégient la cohérence : en cas de partition réseau, certains nœuds 
                  deviennent indisponibles pour maintenir la cohérence.
                </p>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold text-sm">Exemples :</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="secondary">MongoDB</Badge>
                      <Badge variant="secondary">ZooKeeper</Badge>
                      <Badge variant="secondary">HBase</Badge>
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-sm">Cas d'usage :</span>
                    <span className="text-sm"> Systèmes financiers, inventaires. MongoDB dépend de sa configuration (niveaux de garantie d'écriture et de lecture).</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="ap" className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Systèmes AP</h4>
                <p className="text-sm mb-3">
                  Privilégient la disponibilité : le système reste accessible même si 
                  les données peuvent être temporairement incohérentes.
                </p>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold text-sm">Exemples :</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="secondary">Cassandra</Badge>
                      <Badge variant="secondary">DynamoDB</Badge>
                      <Badge variant="secondary">CouchDB</Badge>
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-sm">Cas d'usage :</span>
                    <span className="text-sm"> Réseaux sociaux, catalogues produits. Cassandra et DynamoDB sont configurables : on peut renforcer la cohérence au prix de la disponibilité ou de la latence.</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="ca" className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Systèmes CA</h4>
                <p className="text-sm mb-3">
                  Cohérence et disponibilité sont possibles tant qu'aucune partition ne survient, par exemple pour une
                  base relationnelle sur un seul serveur. Dès que le système est réparti sur plusieurs nœuds, une partition
                  peut se produire : « CA » n'est donc pas une option réelle pour un système distribué.
                </p>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold text-sm">Exemples :</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="secondary">PostgreSQL</Badge>
                      <Badge variant="secondary">MySQL</Badge>
                      <Badge variant="secondary">Oracle</Badge>
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-sm">Limitation :</span>
                    <span className="text-sm"> Valable pour un seul nœud ; la réplication introduit à nouveau le compromis C ou A</span>
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

export default NoSQLSection;
