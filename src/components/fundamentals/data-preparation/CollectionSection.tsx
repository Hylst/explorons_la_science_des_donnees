import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Database, FileText, Globe, Plug, Radio, ScanSearch, Shield, ShoppingCart, Users, type LucideIcon } from 'lucide-react';
import { GlossaryTerm } from '@/components/ui/glossary-term';
import { dataPreparationEnhancedDefinitions } from '../../../data/data-preparation-enhanced-definitions';
import CourseHighlight from '@/components/courses/CourseHighlight';

/**
 * Collection section component for Data Preparation page
 * Covers data collection strategies and sources
 */
const CollectionSection: React.FC = () => {
  const dataSources: { category: string; sources: { name: string; icon: LucideIcon; example: string }[] }[] = [
    {
      category: "Données internes",
      sources: [
        { name: "Bases de données transactionnelles", icon: Database, example: "CRM, ERP, Comptabilité" },
        { name: "Logs et fichiers système", icon: FileText, example: "Serveurs web, applications" },
        { name: "Capteurs IoT", icon: Radio, example: "Température, géolocalisation" },
        { name: "Données utilisateur", icon: Users, example: "Clics, préférences, historique" }
      ]
    },
    {
      category: "Données externes",
      sources: [
        { name: "APIs publiques", icon: Plug, example: "Météo, réseaux sociaux, finance" },
        { name: "Open Data", icon: Globe, example: "Gouvernement, INSEE, Banque Mondiale" },
        { name: "Données d'achat", icon: ShoppingCart, example: "Nielsen, Kantar, panels" },
        { name: "Web scraping", icon: ScanSearch, example: "Sites e-commerce, actualités (après vérification des conditions d'utilisation et du droit applicable)" }
      ]
    }
  ];

  const collectionChecklist = [
    "Définir les objectifs métier précis",
    "Cartographier les sources disponibles",
    "Évaluer la qualité des sources",
    "Négocier les accès et autorisations",
    "Planifier la fréquence de collecte",
    "Prévoir les mécanismes de sauvegarde",
    "Documenter les métadonnées",
    "Tester sur un échantillon"
  ];

  return (
    <section id="collection" className="space-y-12">
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-bold flex items-center justify-center gap-3">
          <Database className="h-8 w-8 text-blue-500" />
          Collecte et acquisition des données
        </h2>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          La qualité de votre analyse commence dès la collecte. Une stratégie d'acquisition 
          bien pensée évite une grande partie des problèmes de qualité en aval.
        </p>
      </div>

      {/* Sources de données */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Sources de données courantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {dataSources.map((category, catIndex) => (
              <div key={catIndex} className="space-y-4">
                <h4 className="font-semibold text-lg text-primary border-b pb-2">
                  <GlossaryTerm 
                    definition={dataPreparationEnhancedDefinitions['collecte']}
                    variant="hover"
                    highlightStyle="glow"
                  >
                    {category.category}
                  </GlossaryTerm>
                </h4>
                <div className="space-y-3">
                  {category.sources.map((source, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <source.icon className="h-6 w-6 shrink-0 text-blue-600" aria-hidden="true" />
                      <div className="flex-1">
                        <h5 className="font-medium">{source.name}</h5>
                        <p className="text-sm text-muted-foreground">{source.example}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Stratégie de collecte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <CourseHighlight type="info" title="Framework SMART pour la collecte">
              <div className="mb-2">
                <GlossaryTerm 
                  definition={dataPreparationEnhancedDefinitions['smartFramework']}
                  variant="hover"
                  highlightStyle="underline"
                >
                  Framework SMART
                </GlossaryTerm>
              </div>
              <ul className="space-y-2 text-sm">
                <li><strong>Spécifique :</strong> Quelles données exactement ?</li>
                <li><strong>Mesurable :</strong> Comment quantifier la qualité ?</li>
                <li><strong>Accessible :</strong> Peut-on obtenir ces données ?</li>
                <li><strong>Réaliste :</strong> Budget et compétences suffisants ?</li>
                <li><strong>Temporel :</strong> Délais et fréquence de mise à jour ?</li>
              </ul>
            </CourseHighlight>

            <div className="space-y-4">
              <h4 className="font-semibold">Liste de contrôle de la collecte</h4>
              {collectionChecklist.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exemple concret de stratégie */}
      <CourseHighlight type="example" title="Cas pratique (fictif) : un site de vente en ligne étudie le comportement de ses clients">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Objectif métier</h4>
            <p className="text-sm mb-4">Réduire le taux d'abandon de panier. L'objectif chiffré se fixe à partir du taux mesuré sur le site, pas d'une moyenne du secteur.</p>
            
            <h4 className="font-semibold mb-3">Données à collecter</h4>
            <ul className="text-sm space-y-1">
              <li>• Pages visitées et temps passé</li>
              <li>• Produits ajoutés/supprimés du panier</li>
              <li>• Étapes d'abandon dans le tunnel</li>
              <li>• Données démographiques client (uniquement si elles sont nécessaires et déclarées)</li>
              <li>• Historique des commandes</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Sources identifiées</h4>
            <ul className="text-sm space-y-1">
              <li>• Mesure d'audience du site (comportement web, avec le consentement requis par la réglementation)</li>
              <li>• Base CRM (profil client)</li>
              <li>• Logs serveur (performance technique)</li>
              <li>• Enquêtes satisfaction (feedback qualitatif)</li>
              <li>• Données concurrentielles (benchmarking)</li>
            </ul>
            
            <h4 className="font-semibold mb-3 mt-4">Fréquence</h4>
            <ul className="text-sm space-y-1">
              <li>• Temps réel : clics, ajouts panier</li>
              <li>• Quotidien : commandes, abandons</li>
              <li>• Hebdomadaire : satisfaction, benchmark</li>
            </ul>
          </div>
        </div>
      </CourseHighlight>

      {/* Best Practices */}
      <Card className="bg-gradient-to-br from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-500" />
            Bonnes pratiques de collecte
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-blue-700">Planification</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Commencer par les besoins métier, pas par les données disponibles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Privilégier la qualité à la quantité</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Prévoir l'évolution des besoins futurs</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-green-700">Gouvernance</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Respecter les réglementations (RGPD, etc.) : ne collecter que ce qui est nécessaire, informer les personnes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Documenter les sources et transformations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Mettre en place des contrôles d'accès</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default CollectionSection;