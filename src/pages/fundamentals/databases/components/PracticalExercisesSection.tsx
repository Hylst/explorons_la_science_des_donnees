
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, PlayCircle, AlertCircle, Lightbulb } from "lucide-react";

const PracticalExercisesSection = () => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const exercises = [
    {
      title: "E-commerce : Analyse des ventes",
      level: "Débutant",
      description: "Analysez les données de vente d'une boutique en ligne",
      context: `Vous travaillez pour une boutique en ligne qui vend des produits tech. 
                La base contient des commandes, produits, clients et avis.`,
      tables: [
        "clients (id, nom, email, ville, date_inscription)",
        "produits (id, nom, prix, categorie, stock)",
        "commandes (id, client_id, date_commande, total)",
        "details_commande (commande_id, produit_id, quantite, prix_unitaire)"
      ],
      questions: [
        "Trouvez le chiffre d'affaires total par mois",
        "Identifiez les 5 produits les plus vendus",
        "Calculez le panier moyen par client",
        "Trouvez les clients qui n'ont pas commandé depuis 6 mois"
      ],
      solution: `-- 1. Chiffre d'affaires par mois
SELECT 
    YEAR(date_commande) as annee,
    MONTH(date_commande) as mois,
    SUM(total) as ca_mensuel
FROM commandes 
GROUP BY YEAR(date_commande), MONTH(date_commande)
ORDER BY annee DESC, mois DESC;

-- 2. Top 5 produits les plus vendus
SELECT 
    p.nom,
    SUM(dc.quantite) as total_vendu,
    SUM(dc.quantite * dc.prix_unitaire) as revenus
FROM details_commande dc
JOIN produits p ON dc.produit_id = p.id
GROUP BY p.id, p.nom
ORDER BY total_vendu DESC
LIMIT 5;

-- 3. Panier moyen par client  
SELECT 
    c.nom,
    COUNT(co.id) as nb_commandes,
    AVG(co.total) as panier_moyen,
    SUM(co.total) as total_depense
FROM clients c
LEFT JOIN commandes co ON c.id = co.client_id
GROUP BY c.id, c.nom
HAVING COUNT(co.id) > 0
ORDER BY panier_moyen DESC;

-- 4. Clients inactifs (6+ mois)
SELECT 
    c.nom, 
    c.email,
    MAX(co.date_commande) as derniere_commande,
    DATEDIFF(NOW(), MAX(co.date_commande)) as jours_inactivite
FROM clients c
JOIN commandes co ON c.id = co.client_id
GROUP BY c.id, c.nom, c.email
HAVING MAX(co.date_commande) < DATE_SUB(NOW(), INTERVAL 6 MONTH)
ORDER BY derniere_commande ASC;`,
      explanation: `Ces requêtes combinent plusieurs concepts clés :
                   - Agrégations (SUM, COUNT, AVG) pour les métriques business
                   - Jointures pour relier les données entre tables
                   - Fonctions de date pour analyser les tendances temporelles
                   - Conditions HAVING pour filtrer les groupes`
    },
    {
      title: "Réseau social : Recommandations d'amis",
      level: "Intermédiaire", 
      description: "Implémentez un système de recommandation d'amis",
      context: `Vous développez la fonctionnalité "Amis suggérés" d'un réseau social. 
                L'objectif est de suggérer de nouveaux contacts basés sur les amis communs.`,
      tables: [
        "utilisateurs (id, nom, email, ville, age, profession)",
        "amities (user1_id, user2_id, date_amitie, statut)",
        "posts (id, user_id, contenu, date_post, likes)",
        "centres_interet (user_id, interet, niveau)"
      ],
      questions: [
        "Trouvez les amis communs entre deux utilisateurs",
        "Suggérez 5 amis potentiels basés sur les amis communs",
        "Identifiez les utilisateurs avec des centres d'intérêt similaires",
        "Calculez le score de compatibilité entre utilisateurs"
      ],
      solution: `-- 1. Amis communs entre Alice (id=1) et Bob (id=2)
SELECT 
    u.nom as ami_commun,
    u.ville,
    COUNT(*) as interactions
FROM amities a1
JOIN amities a2 ON a1.user2_id = a2.user2_id
JOIN utilisateurs u ON a1.user2_id = u.id
LEFT JOIN posts p ON u.id = p.user_id AND p.date_post > DATE_SUB(NOW(), INTERVAL 30 DAY)
WHERE a1.user1_id = 1 AND a2.user1_id = 2
  AND a1.statut = 'accepte' AND a2.statut = 'accepte'
GROUP BY u.id, u.nom, u.ville
ORDER BY interactions DESC;

-- 2. Recommandations d'amis (amis d'amis)
WITH amis_alice AS (
    SELECT user2_id as ami_id 
    FROM amities 
    WHERE user1_id = 1 AND statut = 'accepte'
),
candidats AS (
    SELECT 
        a.user2_id as candidat_id,
        COUNT(DISTINCT a.user1_id) as amis_communs,
        u.nom, u.ville
    FROM amities a
    JOIN amis_alice aa ON a.user1_id = aa.ami_id
    JOIN utilisateurs u ON a.user2_id = u.id
    WHERE a.user2_id != 1 
      AND a.user2_id NOT IN (SELECT ami_id FROM amis_alice)
      AND a.statut = 'accepte'
    GROUP BY a.user2_id, u.nom, u.ville
)
SELECT * FROM candidats 
ORDER BY amis_communs DESC
LIMIT 5;

-- 3. Utilisateurs avec centres d'intérêt similaires
SELECT 
    u2.nom,
    COUNT(DISTINCT ci1.interet) as interets_communs,
    GROUP_CONCAT(ci1.interet) as interets_partages
FROM centres_interet ci1
JOIN centres_interet ci2 ON ci1.interet = ci2.interet
JOIN utilisateurs u2 ON ci2.user_id = u2.id
WHERE ci1.user_id = 1 AND ci2.user_id != 1
GROUP BY u2.id, u2.nom
HAVING interets_communs >= 2
ORDER BY interets_communs DESC;

-- 4. Score de compatibilité composite
-- Cette requête réutilise la CTE « candidats » de la requête 2 : recopiez son WITH (amis_alice, candidats)
-- devant elle pour l'exécuter seule.
SELECT 
    u.nom,
    (amis_communs * 0.4 + interets_communs * 0.3 + proximite_geo * 0.3) as score_compatibilite
FROM (
    SELECT 
        candidat_id,
        nom,
        amis_communs,
        COALESCE(interets.nb_interets, 0) as interets_communs,
        CASE 
            WHEN ville = (SELECT ville FROM utilisateurs WHERE id = 1) THEN 10
            ELSE 0 
        END as proximite_geo
    FROM candidats
    LEFT JOIN (
        SELECT ci2.user_id, COUNT(*) as nb_interets
        FROM centres_interet ci1
        JOIN centres_interet ci2 ON ci1.interet = ci2.interet
        WHERE ci1.user_id = 1
        GROUP BY ci2.user_id
    ) interets ON candidats.candidat_id = interets.user_id
) scores
JOIN utilisateurs u ON scores.candidat_id = u.id
ORDER BY score_compatibilite DESC;`,
      explanation: `Cet exercice avancé utilise :
                   - WITH clauses (CTE) pour structurer les requêtes complexes
                   - Jointures multiples pour croiser différentes sources
                   - Fonctions d'agrégation avec GROUP_CONCAT
                   - Calculs de scores pondérés avec CASE`
    },
    {
      title: "IoT Industriel : Monitoring en temps réel",
      level: "Avancé",
      description: "Analysez les données de capteurs industriels",
      context: `Une usine surveille ses machines via des capteurs IoT. Vous devez détecter 
                les anomalies, prédire les pannes et optimiser la maintenance.`,
      tables: [
        "machines (id, nom, type, zone, date_installation)",
        "capteurs (id, machine_id, type_capteur, seuil_alerte)",
        "mesures (id, capteur_id, valeur, timestamp, qualite)",
        "maintenances (id, machine_id, type, date_debut, date_fin, cout)"
      ],
      questions: [
        "Détectez les machines en surchauffe (température > seuil)",
        "Calculez la tendance de dégradation par machine",
        "Identifiez les patterns de pannes récurrentes",
        "Optimisez la planification de maintenance prédictive"
      ],
      solution: `-- 1. Détection des surchauffes en temps réel
SELECT 
    m.nom as machine,
    m.zone,
    c.type_capteur,
    mes.valeur as temperature_actuelle,
    c.seuil_alerte,
    mes.valeur - c.seuil_alerte as depassement,
    mes.timestamp
FROM mesures mes
JOIN capteurs c ON mes.capteur_id = c.id
JOIN machines m ON c.machine_id = m.id
WHERE c.type_capteur = 'temperature'
  AND mes.valeur > c.seuil_alerte
  AND mes.timestamp > DATE_SUB(NOW(), INTERVAL 1 HOUR)
  AND mes.qualite = 'good'
ORDER BY depassement DESC, mes.timestamp DESC;

-- 2. Tendance de dégradation (moyenne mobile)
SELECT 
    m.nom,
    DATE(mes.timestamp) as jour,
    AVG(mes.valeur) as moyenne_quotidienne,
    AVG(AVG(mes.valeur)) OVER (
        PARTITION BY m.id 
        ORDER BY DATE(mes.timestamp) 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) as moyenne_mobile_7j,
    CASE 
        WHEN AVG(mes.valeur) > LAG(AVG(mes.valeur), 7) OVER (
            PARTITION BY m.id ORDER BY DATE(mes.timestamp)
        ) THEN 'DEGRADATION'
        ELSE 'STABLE'
    END as tendance
FROM mesures mes
JOIN capteurs c ON mes.capteur_id = c.id
JOIN machines m ON c.machine_id = m.id
WHERE c.type_capteur = 'vibration'
  AND mes.timestamp > DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY m.id, m.nom, DATE(mes.timestamp)
ORDER BY m.nom, jour DESC;

-- 3. Patterns de pannes récurrentes  
WITH pannes AS (
    SELECT 
        m.id as machine_id,
        m.nom,
        mt.date_debut,
        mt.type as type_panne,
        DAYOFWEEK(mt.date_debut) as jour_semaine,
        HOUR(mt.date_debut) as heure,
        LAG(mt.date_debut) OVER (
            PARTITION BY m.id 
            ORDER BY mt.date_debut
        ) as panne_precedente
    FROM maintenances mt
    JOIN machines m ON mt.machine_id = m.id
    WHERE mt.type IN ('panne', 'arret_urgence')
)
SELECT 
    nom as machine,
    type_panne,
    COUNT(*) as nb_occurrences,
    AVG(TIMESTAMPDIFF(HOUR, panne_precedente, date_debut)) as intervalle_moyen_h,
    CASE jour_semaine
        WHEN 1 THEN 'Dimanche'
        WHEN 2 THEN 'Lundi' 
        WHEN 3 THEN 'Mardi'
        WHEN 4 THEN 'Mercredi'
        WHEN 5 THEN 'Jeudi'
        WHEN 6 THEN 'Vendredi'
        WHEN 7 THEN 'Samedi'
    END as jour_frequent,
    ROUND(AVG(heure), 0) as heure_frequente
FROM pannes
WHERE panne_precedente IS NOT NULL
GROUP BY machine_id, nom, type_panne, jour_semaine
HAVING nb_occurrences >= 3
ORDER BY nb_occurrences DESC;

-- 4. Score de maintenance prédictive
-- Le score est calculé dans une sous-requête : un alias défini dans un SELECT
-- ne peut pas être réutilisé dans ce même SELECT (le CASE vient donc après).
SELECT
    machine,
    age_annees,
    utilisation_quotidienne,
    variabilite_mesures,
    score_maintenance,
    CASE
        WHEN score_maintenance > 80 THEN 'URGENT'
        WHEN score_maintenance > 60 THEN 'PLANIFIER'
        WHEN score_maintenance > 40 THEN 'SURVEILLER'
        ELSE 'NORMAL'
    END as priorite
FROM (
    SELECT
        m.nom as machine,
        -- Facteur âge (plus vieille = plus risquée)
        ROUND(DATEDIFF(NOW(), m.date_installation) / 365.0, 1) as age_annees,
        -- Facteur utilisation récente
        COUNT(mes.id) / 24.0 as utilisation_quotidienne,
        -- Facteur dérive des mesures
        STDDEV(mes.valeur) as variabilite_mesures,
        -- Score de maintenance composite (0-100)
        LEAST(100,
            (DATEDIFF(NOW(), m.date_installation) / 365.0 * 10) +
            (COUNT(mes.id) / 24.0 * 5) +
            (STDDEV(mes.valeur) * 2) +
            (COALESCE(MAX(pannes_recentes.nb_pannes), 0) * 15)
        ) as score_maintenance
    FROM machines m
    LEFT JOIN capteurs c ON m.id = c.machine_id
    LEFT JOIN mesures mes ON c.id = mes.capteur_id
        AND mes.timestamp > DATE_SUB(NOW(), INTERVAL 24 HOUR)
    LEFT JOIN (
        SELECT
            machine_id,
            COUNT(*) as nb_pannes
        FROM maintenances
        WHERE date_debut > DATE_SUB(NOW(), INTERVAL 90 DAY)
          AND type = 'panne'
        GROUP BY machine_id
    ) pannes_recentes ON m.id = pannes_recentes.machine_id
    GROUP BY m.id, m.nom, m.date_installation
) scores
ORDER BY score_maintenance DESC;`,
      explanation: `Cet exercice expert utilise des techniques avancées :
                   - Fonctions de fenêtrage (OVER, LAG) pour l'analyse temporelle
                   - Une CTE et des sous-requêtes pour structurer l'analyse
                   - Calculs statistiques (STDDEV, moyennes mobiles)
                   - Scoring prédictif avec facteurs pondérés`
    }
  ];

  const currentEx = exercises[currentExercise];

  return (
    <section id="exercises" className="scroll-mt-24 space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Code className="h-8 w-8 text-green-600" />
        <h2 className="text-3xl font-bold">Exercices Pratiques Corrigés</h2>
      </div>

      <p className="text-sm text-gray-600">
        Les corrigés utilisent la syntaxe MySQL (<code>NOW()</code>, <code>DATE_SUB</code>, <code>DATEDIFF</code>, <code>STDDEV</code>,
        <code>LEAST</code>, <code>DAYOFWEEK</code>, <code>HOUR</code>, <code>TIMESTAMPDIFF</code>). L&apos;éditeur SQL du site (page Programmation)
        exécute SQLite sur une base vide : pour y essayer une requête, créez d&apos;abord les tables, puis remplacez les fonctions de date par
        <code>date(&apos;now&apos;, &apos;-6 months&apos;)</code> et <code>julianday(&apos;now&apos;) - julianday(colonne)</code> ; SQLite n&apos;a ni <code>STDDEV</code>,
        ni <code>DAYOFWEEK</code>, ni <code>HOUR</code>, ni <code>TIMESTAMPDIFF</code> (utilisez <code>strftime</code>), et <code>min(a, b)</code> tient lieu de <code>LEAST</code>.
      </p>

      {/* Sélecteur d'exercices */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Choisissez votre défi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exercises.map((exercise, index) => (
              <Button
                key={index}
                variant={currentExercise === index ? "default" : "outline"}
                onClick={() => {
                  setCurrentExercise(index);
                  setShowSolution(false);
                }}
                className="h-auto py-4 flex flex-col items-start gap-2 whitespace-normal"
              >
                <div className="flex flex-wrap items-center gap-2 w-full">
                  <span className="font-semibold">{exercise.title}</span>
                  <Badge 
                    variant={
                      exercise.level === "Débutant" ? "secondary" :
                      exercise.level === "Intermédiaire" ? "default" : "destructive"
                    }
                  >
                    {exercise.level}
                  </Badge>
                </div>
                <p className="text-xs text-left">{exercise.description}</p>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exercice actuel */}
      <div className="space-y-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{currentEx.title}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge 
                    variant={
                      currentEx.level === "Débutant" ? "secondary" :
                      currentEx.level === "Intermédiaire" ? "default" : "destructive"
                    }
                  >
                    {currentEx.level}
                  </Badge>
                  <span className="text-sm text-gray-600">{currentEx.description}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">📖 Contexte</h4>
                <p className="text-sm">{currentEx.context}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">🗄️ Schéma de base de données</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentEx.tables.map((table, index) => (
                    <div key={index} className="bg-white p-2 rounded border font-mono text-xs">
                      {table}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">❓ Questions à résoudre</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  {currentEx.questions.map((question, index) => (
                    <li key={index}>{question}</li>
                  ))}
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solution */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5" />
                Solution complète
              </CardTitle>
              <Button
                onClick={() => setShowSolution(!showSolution)}
                variant={showSolution ? "secondary" : "default"}
              >
                {showSolution ? "Masquer" : "Révéler"} la solution
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showSolution ? (
              <div className="space-y-4">
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
                    <code>{currentEx.solution}</code>
                  </pre>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-green-800 mb-1">💡 Explication détaillée</h5>
                      <p className="text-sm text-green-700 whitespace-pre-line">
                        {currentEx.explanation}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-800 mb-2">🚀 Pour aller plus loin</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Testez les requêtes avec différents jeux de données</li>
                    <li>• Analysez les plans d'exécution avec EXPLAIN</li>
                    <li>• Optimisez avec des index appropriés</li>
                    <li>• Adaptez les requêtes à votre SGBD (MySQL, PostgreSQL, etc.)</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">
                  Essayez d'abord de résoudre l'exercice par vous-même, 
                  puis cliquez sur "Révéler la solution" pour voir la correction détaillée.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navigation entre exercices */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button
          variant="outline"
          onClick={() => {
            setCurrentExercise(Math.max(0, currentExercise - 1));
            setShowSolution(false);
          }}
          disabled={currentExercise === 0}
        >
          ← Exercice précédent
        </Button>
        
        <span className="text-sm text-gray-600">
          Exercice {currentExercise + 1} sur {exercises.length}
        </span>
        
        <Button
          variant="outline"
          onClick={() => {
            setCurrentExercise(Math.min(exercises.length - 1, currentExercise + 1));
            setShowSolution(false);
          }}
          disabled={currentExercise === exercises.length - 1}
        >
          Exercice suivant →
        </Button>
      </div>
    </section>
  );
};

export default PracticalExercisesSection;
