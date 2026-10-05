
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, Lock } from "lucide-react";

const SecuritySection = () => {
  return (
    <section id="security" className="scroll-mt-24 space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-red-600 flex-shrink-0" />
        <h2 className="text-3xl font-bold">Sécurité et protection des données</h2>
      </div>

      <Card className="border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
            🚨 Injections SQL : un risque majeur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-sm mb-3">
              <strong>Utilisez toujours des requêtes paramétrées (ou préparées)</strong> et ne construisez
              jamais une requête en concaténant une saisie utilisateur.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-red-800 mb-2">❌ DANGER</h3>
                <code className="bg-white p-2 rounded block text-xs break-all">
                  query = "SELECT * FROM users WHERE id = " + userId
                </code>
                <p className="text-xs mt-2">
                  Si userId vaut « 1 OR 1=1 », la requête devient{" "}
                  <code className="bg-white p-1 rounded break-all">SELECT * FROM users WHERE id = 1 OR 1=1</code>{" "}
                  et renvoie tous les utilisateurs.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-green-800 mb-2">✅ SÉCURISÉ</h3>
                <code className="bg-white p-2 rounded block text-xs break-all">
                  cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
                </code>
                <p className="text-xs mt-2">
                  La valeur est envoyée séparément du texte de la requête : le moteur ne l'interprète
                  jamais comme du SQL. Le marqueur varie selon le pilote (?, %s, :id, $1).
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 flex-shrink-0" />
              🔐 Contrôle d'accès
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h3 className="font-semibold">Principe du moindre privilège</h3>
                <p className="text-xs">Accorder uniquement les droits nécessaires</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <h3 className="font-semibold">Authentification forte</h3>
                <p className="text-xs">2FA pour les comptes d'administration, certificats, authentification centralisée (SSO ou IAM)</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <h3 className="font-semibold">Audit et logs</h3>
                <p className="text-xs">Garder une trace des accès sensibles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🔒 Protection des données</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• <strong>Chiffrement :</strong> TLS en transit, AES au repos</li>
              <li>• <strong>Pseudonymisation ou anonymisation :</strong> masquer ou supprimer les données personnelles (une donnée seulement pseudonymisée reste soumise au RGPD)</li>
              <li>• <strong>Sauvegarde :</strong> Chiffrée et testée</li>
              <li>• <strong>RGPD :</strong> droit à l'effacement des données personnelles</li>
              <li>• <strong>Surveillance :</strong> détection d'anomalies d'accès</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SecuritySection;
