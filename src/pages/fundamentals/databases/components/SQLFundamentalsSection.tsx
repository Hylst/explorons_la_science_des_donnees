
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Server, 
  Code, 
  Play,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Database
} from "lucide-react";

const SQLFundamentalsSection = () => {
  const sqlExamples = {
    select: {
      title: "SELECT - Lire les données",
      description: "La base de tout : récupérer des informations",
      code: `-- Exemple simple
SELECT nom, age, salaire 
FROM employes 
WHERE departement = 'IT' 
  AND age > 25
ORDER BY salaire DESC
LIMIT 10;

-- Avec agrégations
SELECT 
    departement,
    COUNT(*) as nb_employes,
    AVG(salaire) as salaire_moyen,
    MAX(salaire) as salaire_max
FROM employes 
GROUP BY departement
HAVING AVG(salaire) > 50000;`,
      explanation: "Cette requête trouve les 10 employés IT les mieux payés, puis calcule des statistiques par département."
    },
    insert: {
      title: "INSERT - Ajouter des données",
      description: "Créer de nouveaux enregistrements",
      code: `-- Insertion simple
INSERT INTO employes (nom, age, departement, salaire)
VALUES ('Alice Dupont', 28, 'IT', 55000);

-- Insertion multiple
INSERT INTO employes (nom, age, departement, salaire)
VALUES 
    ('Bob Martin', 32, 'Marketing', 48000),
    ('Claire Petit', 29, 'IT', 62000),
    ('David Moreau', 35, 'Finance', 71000);

-- Insertion depuis une autre table
INSERT INTO employes_archives
SELECT * FROM employes 
WHERE date_embauche < '2020-01-01';`,
      explanation: "INSERT permet d'ajouter de nouvelles données, soit manuellement soit depuis d'autres sources."
    },
    update: {
      title: "UPDATE - Modifier les données",
      description: "Mettre à jour des enregistrements existants",
      code: `-- Mise à jour simple
UPDATE employes 
SET salaire = salaire * 1.05 
WHERE departement = 'IT';

-- Mise à jour conditionnelle
UPDATE employes 
SET 
    salaire = CASE 
        WHEN anciennete > 5 THEN salaire * 1.1
        WHEN anciennete > 2 THEN salaire * 1.05
        ELSE salaire * 1.02
    END,
    date_maj = NOW()
WHERE status = 'actif';`,
      explanation: "UPDATE modifie les données existantes. Attention au WHERE pour éviter de tout modifier !"
    },
    join: {
      title: "JOIN - Relier les tables",
      description: "Combiner des données de plusieurs tables",
      code: `-- INNER JOIN (intersection)
SELECT 
    e.nom,
    e.salaire,
    d.nom_departement,
    p.nom_projet
FROM employes e
INNER JOIN departements d ON e.dept_id = d.id
INNER JOIN projets p ON e.projet_id = p.id;

-- LEFT JOIN (tous les employés, même sans projet)
SELECT 
    e.nom,
    COALESCE(p.nom_projet, 'Aucun projet') as projet
FROM employes e
LEFT JOIN projets p ON e.projet_id = p.id;

-- Agrégation avec JOIN
SELECT 
    d.nom_departement,
    COUNT(e.id) as nb_employes,
    SUM(e.salaire) as masse_salariale
FROM departements d
LEFT JOIN employes e ON d.id = e.dept_id
GROUP BY d.id, d.nom_departement;`,
      explanation: "Les JOINs relient les tables. INNER = intersection, LEFT = tous les éléments de gauche."
    }
  };

  const [activeExample, setActiveExample] = useState<keyof typeof sqlExamples>("select");

  return (
    <section id="sql-fundamentals" className="scroll-mt-24 space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Server className="h-8 w-8 text-green-600" />
        <h2 className="text-3xl font-bold">Fondamentaux SQL</h2>
      </div>

      {/* Introduction SQL */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            SQL : Le langage universel des données
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="mb-4">
                <strong>SQL (Structured Query Language)</strong> est LE langage pour communiquer 
                avec les bases de données relationnelles. Créé en 1974, il reste très utilisé !
              </p>
              
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-green-800 mb-2">🎯 Pourquoi SQL ?</h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Standard :</strong> Fonctionne sur la plupart des bases de données relationnelles (avec des variantes de dialecte)</li>
                  <li>• <strong>Puissant :</strong> Requêtes complexes en quelques lignes</li>
                  <li>• <strong>Optimisé :</strong> Performances exceptionnelles</li>
                  <li>• <strong>Déclaratif :</strong> On dit QUOI, pas COMMENT</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">🏗️ Anatomie d'une requête SQL</h4>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex">
                  <span className="text-blue-600 font-bold w-16">SELECT</span>
                  <span className="text-gray-600">quelles colonnes</span>
                </div>
                <div className="flex">
                  <span className="text-purple-600 font-bold w-16">FROM</span>
                  <span className="text-gray-600">quelle table</span>
                </div>
                <div className="flex">
                  <span className="text-orange-600 font-bold w-16">WHERE</span>
                  <span className="text-gray-600">quelles conditions</span>
                </div>
                <div className="flex">
                  <span className="text-green-600 font-bold w-16">GROUP BY</span>
                  <span className="text-gray-600">regrouper par</span>
                </div>
                <div className="flex">
                  <span className="text-red-600 font-bold w-16">ORDER BY</span>
                  <span className="text-gray-600">trier par</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exemples interactifs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Exemples SQL interactifs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            {Object.entries(sqlExamples).map(([key, example]) => (
              <Button
                key={key}
                variant={activeExample === key ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveExample(key as keyof typeof sqlExamples)}
                className="text-xs"
              >
                {example.title.split(' ')[0]}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Play className="h-4 w-4 text-green-600" />
              <h4 className="font-semibold">{sqlExamples[activeExample].title}</h4>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              {sqlExamples[activeExample].description}
            </p>

            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">
                <code>{sqlExamples[activeExample].code}</code>
              </pre>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-blue-800 mb-1">💡 Explication</h5>
                  <p className="text-sm text-blue-700">
                    {sqlExamples[activeExample].explanation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ACID Properties */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-purple-600" />
            🔒 Propriétés ACID : La fiabilité des données
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            Les bases de données relationnelles garantissent 4 propriétés essentielles 
            pour la fiabilité des transactions :
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">🔹 Atomicité</h4>
                <p className="text-sm mb-2">
                  Tout ou rien : une transaction réussit complètement ou échoue complètement.
                </p>
                <div className="bg-white p-2 rounded text-xs font-mono">
                  BEGIN TRANSACTION;<br/>
                  UPDATE compte SET solde = solde - 100 WHERE id = 1;<br/>
                  UPDATE compte SET solde = solde + 100 WHERE id = 2;<br/>
                  COMMIT; -- Ou ROLLBACK si erreur
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🔹 Cohérence</h4>
                <p className="text-sm mb-2">
                  Les données respectent toujours les règles métier et contraintes.
                </p>
                <div className="bg-white p-2 rounded text-xs">
                  Contraintes : clés étrangères, CHECK, NOT NULL, UNIQUE...
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">🔹 Isolation</h4>
                <p className="text-sm mb-2">
                  Les transactions simultanées ne s'interfèrent pas.
                </p>
                <div className="bg-white p-2 rounded text-xs">
                  Niveaux : READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">🔹 Durabilité</h4>
                <p className="text-sm mb-2">
                  Une fois validée, une transaction est permanente même en cas de panne.
                </p>
                <div className="bg-white p-2 rounded text-xs">
                  Logs de transactions, checkpoints, recovery automatique
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bonnes pratiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            ✅ Bonnes pratiques SQL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">✅ À faire</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Utiliser des index sur les colonnes WHERE</li>
                    <li>• Éviter SELECT * (spécifier les colonnes)</li>
                    <li>• Utiliser LIMIT pour les gros résultats</li>
                    <li>• Comparer EXISTS et IN sur les grosses sous-requêtes (selon le SGBD, les plans diffèrent)</li>
                    <li>• Analyser les plans d'exécution</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">❌ À éviter</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Fonctions dans les clauses WHERE</li>
                    <li>• Jointures sans conditions appropriées</li>
                    <li>• N+1 queries (requêtes en boucle)</li>
                    <li>• Index inutiles (ralentissent les écritures)</li>
                    <li>• Requêtes non préparées</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">🚨 Injections SQL</h4>
                    <p className="text-sm mb-3">
                      Une faille classique de sécurité web (catégorie « Injection » de l'OWASP Top 10) ! Toujours utiliser des requêtes préparées.
                    </p>
                    <div className="space-y-2">
                      <div>
                        <span className="text-red-600 font-semibold text-xs">❌ DANGER :</span>
                        <code className="bg-white p-1 rounded text-xs ml-2">
                          "SELECT * FROM users WHERE id = " + userId
                        </code>
                      </div>
                      <div>
                        <span className="text-green-600 font-semibold text-xs">✅ SÉCURISÉ :</span>
                        <code className="bg-white p-1 rounded text-xs ml-2">
                          "SELECT * FROM users WHERE id = ?"
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="maintenance" className="space-y-4">
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h5 className="font-semibold text-blue-800 mb-1">📝 Conventions de nommage</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Tables en minuscules, pluriel : <code>employes</code>, <code>commandes</code></li>
                    <li>• Colonnes descriptives : <code>date_creation</code>, <code>prix_unitaire</code></li>
                    <li>• Clés étrangères explicites : <code>client_id</code>, <code>produit_id</code></li>
                  </ul>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h5 className="font-semibold text-yellow-800 mb-1">📚 Documentation</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Commenter les requêtes complexes</li>
                    <li>• Documenter les procédures stockées</li>
                    <li>• Maintenir un schéma de base de données à jour</li>
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

export default SQLFundamentalsSection;
