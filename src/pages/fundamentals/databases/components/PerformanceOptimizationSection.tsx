
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, AlertTriangle, CheckCircle } from "lucide-react";

const PerformanceOptimizationSection = () => {
  return (
    <section id="performance" className="scroll-mt-24 space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="h-8 w-8 text-yellow-600 flex-shrink-0" />
        <h2 className="text-3xl font-bold">Optimisation et Performance</h2>
      </div>

      <Card className="border-l-4 border-l-yellow-500">
        <CardHeader>
          <CardTitle>Les index : un levier de performance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            Un index est une structure triée (souvent un arbre B) qui évite de parcourir toute la table,
            comme l&apos;index d&apos;un livre ; en contrepartie il occupe de la place et ralentit les écritures.
          </p>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-6">
            <pre className="text-sm">
              <code>CREATE INDEX idx_commandes_client ON commandes(client_id);</code>
            </pre>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-green-700">Bonnes pratiques</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Index sur colonnes WHERE fréquentes
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Index composés pour requêtes multi-colonnes (l&apos;ordre des colonnes compte)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Analyser les plans d&apos;exécution
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-red-700">Pièges à éviter</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  Trop d&apos;index (ralentit les écritures)
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  Index sur colonnes peu sélectives (booléens, statuts à 2 ou 3 valeurs)
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  Fonction appliquée à la colonne indexée dans WHERE (ex. YEAR(date_commande) = 2024)
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Optimisation requêtes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li>• Lire le plan d&apos;exécution (EXPLAIN, ou EXPLAIN QUERY PLAN sous SQLite)</li>
              <li>• Éviter SELECT *</li>
              <li>• Optimiser les JOIN</li>
              <li>• Utiliser LIMIT approprié</li>
              <li>• Requêtes préparées</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Partitionnement</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li>• Par plage (dates, identifiants)</li>
              <li>• Par hachage (répartition régulière)</li>
              <li>• Par liste (catégories)</li>
              <li>• Sharding : répartition sur plusieurs serveurs (plus complexe)</li>
              <li>• Archiver les anciennes partitions</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mise en cache</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li>• Cache de requêtes (retiré de MySQL 8.0 : à éviter de compter dessus)</li>
              <li>• Cache de résultats côté application</li>
              <li>• Redis ou Memcached devant la base</li>
              <li>• Vues matérialisées (PostgreSQL, Oracle...)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PerformanceOptimizationSection;
