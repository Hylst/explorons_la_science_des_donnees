
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Lightbulb } from "lucide-react";

const DataModelingSection = () => {
  return (
    <section id="data-modeling" className="scroll-mt-24 space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="h-8 w-8 text-purple-600" />
        <h2 className="text-3xl font-bold">Modélisation des Données</h2>
      </div>

      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Design de schéma : l'art de structurer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">🎯 Principes de normalisation</h4>
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h5 className="font-semibold text-blue-800">1NF - Première forme normale</h5>
                  <p className="text-sm">Éliminer les groupes répétitifs</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <h5 className="font-semibold text-green-800">2NF - Deuxième forme normale</h5>
                  <p className="text-sm">Éliminer les dépendances partielles</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <h5 className="font-semibold text-orange-800">3NF - Troisième forme normale</h5>
                  <p className="text-sm">Éliminer les dépendances transitives</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">⚡ Dénormalisation stratégique</h4>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm mb-2">
                  En Data Science, on dénormalise parfois pour la performance :
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Tables de faits pour l'analytique</li>
                  <li>• Vues matérialisées</li>
                  <li>• Agrégations précalculées</li>
                  <li>• Index dénormalisés</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>🏗️ Modélisation dimensionnelle</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Pour l'analytique et le Data Warehousing :</p>
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h5 className="font-semibold">Star Schema ⭐</h5>
                <p className="text-xs">Table de faits centrale + dimensions</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <h5 className="font-semibold">Snowflake Schema ❄️</h5>
                <p className="text-xs">Dimensions normalisées</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <h5 className="font-semibold">Galaxy Schema 🌌</h5>
                <p className="text-xs">Multiples tables de faits</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🔗 Gestion des relations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border-l-4 border-l-green-500 pl-3">
                <h5 className="font-semibold">1:N (Un à plusieurs)</h5>
                <p className="text-xs">Client → Commandes</p>
              </div>
              <div className="border-l-4 border-l-blue-500 pl-3">
                <h5 className="font-semibold">N:M (Plusieurs à plusieurs)</h5>
                <p className="text-xs">Produits ↔ Commandes (via table pivot)</p>
              </div>
              <div className="border-l-4 border-l-purple-500 pl-3">
                <h5 className="font-semibold">1:1 (Un à un)</h5>
                <p className="text-xs">User → Profil_Détaillé</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DataModelingSection;
