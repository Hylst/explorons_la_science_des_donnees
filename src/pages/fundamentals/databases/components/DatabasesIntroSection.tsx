
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Database,
  BarChart3,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Brain
} from "lucide-react";
import { SourceNote } from "@/components/ui/source-note";

const DatabasesIntroSection = () => {
  const analogies = {
    library: {
      title: "La Bibliothèque",
      description: "Une base de données, c'est comme une bibliothèque géante et ultra-organisée",
      details: [
        "Les tables = les rayonnages thématiques",
        "Les lignes = les livres individuels", 
        "Les colonnes = les caractéristiques (titre, auteur, année...)",
        "L'index = le catalogue pour trouver rapidement",
        "Le bibliothécaire = le SGBD qui gère tout"
      ]
    },
    city: {
      title: "La Ville",
      description: "Pensez à une base de données comme une ville bien planifiée",
      details: [
        "Les quartiers = les schémas/bases de données",
        "Les bâtiments = les tables",
        "Les appartements = les enregistrements",
        "Les adresses = les clés primaires",
        "Les routes = les relations entre tables"
      ]
    },
    excel: {
      title: "Excel, en plus structuré",
      description: "Si vous connaissez Excel, vous comprenez déjà les bases",
      details: [
        "Feuille Excel = Table de base de données",
        "Ligne Excel = Enregistrement (row)",
        "Colonne Excel = Champ (field/column)", 
        "Mais avec des MILLIONS de lignes",
        "Et des relations complexes entre feuilles"
      ]
    }
  };

  const [activeAnalogy, setActiveAnalogy] = useState<keyof typeof analogies>("library");

  return (
    <section id="databases-intro" className="scroll-mt-24 space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Database className="h-8 w-8 text-blue-600" />
        <h2 className="text-3xl font-bold">Introduction aux Bases de Données</h2>
      </div>

      {/* Définition avec analogies */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Qu'est-ce qu'une base de données ? (Avec analogies)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="text-lg mb-4">
                Une <strong>base de données</strong> est un système organisé pour stocker, 
                gérer et récupérer des informations de manière efficace et sécurisée.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-blue-800 mb-2">Définition simple</h4>
                <p className="text-sm">
                  C'est comme un classeur géant, mais digital, qui peut contenir des millions 
                  d'informations organisées de façon à les retrouver rapidement.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(analogies).map(([key, analogy]) => (
                  <Button
                    key={key}
                    variant={activeAnalogy === key ? "default" : "outline"}
                    size="sm"
                    aria-label={analogy.title}
                    onClick={() => setActiveAnalogy(key as keyof typeof analogies)}
                  >
                    {analogy.title.split(' ')[0]}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">{analogies[activeAnalogy].title}</h4>
                <p className="text-sm mb-3">{analogies[activeAnalogy].description}</p>
                <ul className="text-sm space-y-1">
                  {analogies[activeAnalogy].details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pourquoi c'est crucial en Data Science */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Pourquoi crucial en Data Science ?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Les données sont partout</h4>
                <p className="text-sm">
                  Une grande partie du temps d'un data scientist passe à collecter, nettoyer 
                  et préparer les données. Les ranger dans une base facilite beaucoup ce travail.
                </p>
              </div>
              
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Volume :</strong> Gestion de téraoctets de données</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Vélocité :</strong> Accès en temps réel aux informations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Variété :</strong> Différents types de données (texte, images, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Véracité :</strong> Qualité et fiabilité des données</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-orange-600" />
              Pipeline Data Science
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                <div>
                  <span className="font-semibold">Collecte</span>
                  <p className="text-xs text-gray-600">Ingestion des données sources</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                <div>
                  <span className="font-semibold">Stockage</span>
                  <p className="text-xs text-gray-600">Base de données structurée</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 bg-orange-50 rounded">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                <div>
                  <span className="font-semibold">Préparation</span>
                  <p className="text-xs text-gray-600">Nettoyage et transformation</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 bg-green-50 rounded">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                <div>
                  <span className="font-semibold">Analyse</span>
                  <p className="text-xs text-gray-600">Machine Learning et insights</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Le saviez-vous */}
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-cyan-600" />
            Le saviez-vous ?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Volumes</h4>
              <ul className="text-sm space-y-1">
                <li>• Environ <strong>9 octets sur 10</strong> sont des copies de données déjà existantes (IDC, 2020 : rapport d'environ 1 pour 9 entre données uniques et données copiées)</li>
                <li>• <strong>Google</strong> traite plus de 5 000 milliards de recherches par an, soit environ 158 000 par seconde (début 2025)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Grandes plateformes</h4>
              <ul className="text-sm space-y-1">
                <li>• <strong>Facebook</strong> stockait plus de 300 pétaoctets dans son entrepôt de données dès 2014, avec 600 téraoctets ajoutés par jour</li>
                <li>• <strong>Netflix</strong> estime que la personnalisation et les recommandations lui font économiser plus d'un milliard de dollars par an (2015)</li>
              </ul>
            </div>
          </div>
          <SourceNote
            consulted="1er octobre 2026"
            sources={[
              { label: "IDC, communiqué du 8 mai 2020 (données uniques et données copiées)", href: "https://www.businesswire.com/news/home/20200508005025/en/IDCs-Global-DataSphere-Forecast-Shows-Continued-Steady-Growth-in-the-Creation-and-Consumption-of-Data" },
              { label: "Search Engine Land (recherches Google)", href: "https://searchengineland.com/google-5-trillion-searches-per-year-452928" },
              { label: "Facebook Engineering, 2014", href: "https://engineering.fb.com/2014/04/10/core-infra/scaling-the-facebook-data-warehouse-to-300-pb/" },
              { label: "Gomez-Uribe et Hunt, ACM TMIS, 2015", href: "https://dl.acm.org/doi/10.1145/2843948" },
            ]}
          />
        </CardContent>
      </Card>

      {/* Types de données */}
      <Card>
        <CardHeader>
          <CardTitle>Types de données à gérer</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="structured" className="w-full">
            <TabsList className="grid w-full h-auto grid-cols-1 sm:grid-cols-3">
              <TabsTrigger value="structured">Structurées</TabsTrigger>
              <TabsTrigger value="semi-structured">Semi-structurées</TabsTrigger>
              <TabsTrigger value="unstructured">Non structurées</TabsTrigger>
            </TabsList>
            
            <TabsContent value="structured" className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Données structurées</h4>
                <p className="text-sm mb-3">
                  Données organisées en tables avec des colonnes et des types définis
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-sm mb-1">Exemples :</h5>
                    <ul className="text-xs space-y-1">
                      <li>• Tables SQL</li>
                      <li>• Fichiers CSV</li>
                      <li>• Feuilles Excel</li>
                      <li>• Données transactionnelles</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm mb-1">Technologies :</h5>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary">MySQL</Badge>
                      <Badge variant="secondary">PostgreSQL</Badge>
                      <Badge variant="secondary">Oracle</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="semi-structured" className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Données semi-structurées</h4>
                <p className="text-sm mb-3">
                  Données avec une structure flexible, souvent avec des métadonnées
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-sm mb-1">Exemples :</h5>
                    <ul className="text-xs space-y-1">
                      <li>• Fichiers JSON</li>
                      <li>• Documents XML</li>
                      <li>• APIs REST</li>
                      <li>• Logs d'applications</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm mb-1">Technologies :</h5>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary">MongoDB</Badge>
                      <Badge variant="secondary">Elasticsearch</Badge>
                      <Badge variant="secondary">CouchDB</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="unstructured" className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Données non structurées</h4>
                <p className="text-sm mb-3">
                  Données sans format prédéfini, nécessitant un traitement spécialisé
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-sm mb-1">Exemples :</h5>
                    <ul className="text-xs space-y-1">
                      <li>• Textes et documents</li>
                      <li>• Images et vidéos</li>
                      <li>• Emails et réseaux sociaux</li>
                      <li>• Audio et capteurs IoT</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm mb-1">Technologies :</h5>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary">Hadoop (HDFS)</Badge>
                      <Badge variant="secondary">S3 (stockage objet)</Badge>
                      <Badge variant="secondary">Data lake</Badge>
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

export default DatabasesIntroSection;
