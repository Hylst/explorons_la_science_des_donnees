import { lines } from "@/data/lessons/lines";
import type { LessonSection } from "@/lib/lessons/types";

type ExerciseSection = Extract<LessonSection, { kind: "exercise" }>;

/**
 * Exercices SQL vérifiés de la page Bases de données (section « Exercices pratiques corrigés »). Chaque scénario a de
 * petites tables SQLite aux données inventées (adresses en example.com) et une date de référence fixe : un résultat
 * qui dépend du jour (NOW()) ne pourrait pas être vérifié. Le moteur compare le dernier tableau de la réponse à celui
 * du corrigé (lib/lessons/check.ts). Testés par src/data/database-exercises.test.ts.
 */

export const ECOMMERCE = lines(
  "CREATE TABLE clients (id INTEGER PRIMARY KEY, nom TEXT, email TEXT, ville TEXT, date_inscription TEXT);",
  "INSERT INTO clients VALUES",
  "  (1, 'Alice Martin', 'alice@example.com', 'Lyon', '2025-01-10'),",
  "  (2, 'Bruno Petit', 'bruno@example.com', 'Paris', '2025-02-03'),",
  "  (3, 'Chloé Roux', 'chloe@example.com', 'Nantes', '2025-03-15'),",
  "  (4, 'David Leroy', 'david@example.com', 'Lille', '2025-05-20'),",
  "  (5, 'Emma Faure', 'emma@example.com', 'Paris', '2026-01-05');",
  "CREATE TABLE produits (id INTEGER PRIMARY KEY, nom TEXT, prix REAL, categorie TEXT, stock INTEGER);",
  "INSERT INTO produits VALUES",
  "  (1, 'Clavier', 49.90, 'accessoire', 120), (2, 'Souris', 19.90, 'accessoire', 300),",
  "  (3, 'Écran', 189.00, 'ecran', 40), (4, 'Casque', 79.00, 'audio', 60), (5, 'Webcam', 59.00, 'video', 25);",
  "CREATE TABLE commandes (id INTEGER PRIMARY KEY, client_id INTEGER, date_commande TEXT, total REAL);",
  "INSERT INTO commandes VALUES",
  "  (1, 1, '2026-01-12', 69.80), (2, 2, '2026-01-25', 189.00), (3, 1, '2026-02-08', 79.00),",
  "  (4, 3, '2026-02-14', 98.80), (5, 2, '2026-03-02', 128.90), (6, 4, '2025-11-20', 59.70),",
  "  (7, 1, '2026-03-28', 19.90), (8, 3, '2026-03-30', 238.90);",
  "CREATE TABLE details_commande (commande_id INTEGER, produit_id INTEGER, quantite INTEGER, prix_unitaire REAL);",
  "INSERT INTO details_commande VALUES",
  "  (1, 1, 1, 49.90), (1, 2, 1, 19.90), (2, 3, 1, 189.00), (3, 4, 1, 79.00), (4, 2, 2, 19.90), (4, 5, 1, 59.00),",
  "  (5, 1, 1, 49.90), (5, 4, 1, 79.00), (6, 2, 3, 19.90), (7, 2, 1, 19.90), (8, 3, 1, 189.00), (8, 1, 1, 49.90);",
);

export const RESEAU = lines(
  "CREATE TABLE utilisateurs (id INTEGER PRIMARY KEY, nom TEXT, ville TEXT);",
  "INSERT INTO utilisateurs VALUES",
  "  (1, 'Alice', 'Lyon'), (2, 'Bob', 'Lyon'), (3, 'Chloé', 'Paris'), (4, 'David', 'Lyon'),",
  "  (5, 'Emma', 'Nantes'), (6, 'Farid', 'Paris'), (7, 'Gaël', 'Lyon');",
  "-- chaque amitié est enregistrée dans les deux sens",
  "CREATE TABLE amities (user1_id INTEGER, user2_id INTEGER, statut TEXT);",
  "INSERT INTO amities VALUES",
  "  (1, 3, 'accepte'), (3, 1, 'accepte'), (1, 4, 'accepte'), (4, 1, 'accepte'),",
  "  (2, 3, 'accepte'), (3, 2, 'accepte'), (2, 4, 'accepte'), (4, 2, 'accepte'),",
  "  (2, 5, 'accepte'), (5, 2, 'accepte'), (3, 6, 'accepte'), (6, 3, 'accepte'),",
  "  (3, 4, 'accepte'), (4, 3, 'accepte'),",
  "  (4, 6, 'accepte'), (6, 4, 'accepte'), (4, 7, 'accepte'), (7, 4, 'accepte'),",
  "  (5, 6, 'accepte'), (6, 5, 'accepte'), (1, 5, 'en_attente'), (5, 1, 'en_attente');",
  "CREATE TABLE centres_interet (user_id INTEGER, interet TEXT);",
  "INSERT INTO centres_interet VALUES",
  "  (1, 'python'), (1, 'randonnée'), (1, 'jazz'), (2, 'python'), (2, 'jazz'), (2, 'cuisine'),",
  "  (3, 'randonnée'), (4, 'python'), (4, 'randonnée'), (4, 'jazz'), (4, 'échecs'),",
  "  (5, 'cuisine'), (6, 'jazz'), (6, 'python');",
);

export const USINE = lines(
  "CREATE TABLE machines (id INTEGER PRIMARY KEY, nom TEXT, zone TEXT);",
  "INSERT INTO machines VALUES (1, 'Presse A', 'Nord'), (2, 'Tour B', 'Nord'), (3, 'Fraiseuse C', 'Sud');",
  "CREATE TABLE capteurs (id INTEGER PRIMARY KEY, machine_id INTEGER, type_capteur TEXT, seuil_alerte REAL);",
  "INSERT INTO capteurs VALUES",
  "  (1, 1, 'temperature', 80), (2, 2, 'temperature', 75), (3, 3, 'temperature', 85),",
  "  (4, 1, 'vibration', 5), (5, 2, 'vibration', 5), (6, 3, 'vibration', 5);",
  "CREATE TABLE mesures (id INTEGER PRIMARY KEY, capteur_id INTEGER, valeur REAL, horodatage TEXT, qualite TEXT);",
  "INSERT INTO mesures (capteur_id, valeur, horodatage, qualite) VALUES",
  "  (1, 90.0, '2026-10-01 10:30:00', 'good'), (1, 82.0, '2026-10-01 11:15:00', 'good'), (1, 79.0, '2026-10-01 11:45:00', 'good'),",
  "  (2, 77.5, '2026-10-01 11:20:00', 'good'), (2, 81.0, '2026-10-01 11:50:00', 'bad'),",
  "  (3, 86.0, '2026-10-01 11:40:00', 'good'), (3, 92.0, '2026-10-01 11:55:00', 'good'),",
  "  (4, 2.0, '2026-09-28 08:00:00', 'good'), (4, 2.2, '2026-09-29 08:00:00', 'good'),",
  "  (4, 2.5, '2026-09-30 08:00:00', 'good'), (4, 3.1, '2026-10-01 08:00:00', 'good'),",
  "  (5, 1.5, '2026-09-28 08:00:00', 'good'), (5, 1.4, '2026-09-29 08:00:00', 'good'),",
  "  (5, 1.6, '2026-09-30 08:00:00', 'good'), (5, 1.5, '2026-10-01 08:00:00', 'good');",
  "CREATE TABLE maintenances (id INTEGER PRIMARY KEY, machine_id INTEGER, type TEXT, date_debut TEXT);",
  "INSERT INTO maintenances (machine_id, type, date_debut) VALUES",
  "  (1, 'panne', '2026-06-03'), (1, 'panne', '2026-07-15'), (1, 'panne', '2026-09-02'), (1, 'arret_urgence', '2026-08-10'),",
  "  (2, 'panne', '2026-05-20'), (2, 'panne', '2026-08-28'), (3, 'preventive', '2026-04-01'), (3, 'preventive', '2026-07-01'),",
  "  (3, 'panne', '2026-09-15');",
);

const ex = (setup: string, prompt: string, starter: string, solution: string, hint: string, ordered = true): ExerciseSection => ({
  kind: "exercise",
  language: "sql",
  setup,
  prompt,
  starter,
  solution,
  ordered,
  hint,
});

export interface DatabaseScenarioExercises {
  /** Identifiant stable (préfixe des clés de progression « database-exercises ») */
  id: "ecommerce" | "reseau" | "usine";
  setup: string;
  /** Requête d'exploration exécutable, pour voir les tables avant de répondre */
  exploration: string;
  /** Une entrée par question de l'énoncé ; null : question laissée à la solution de référence (à lire) */
  exercises: (ExerciseSection | null)[];
}

export const DATABASE_EXERCISES: DatabaseScenarioExercises[] = [
  {
    id: "ecommerce",
    setup: ECOMMERCE,
    exploration: lines("SELECT * FROM commandes;", "SELECT * FROM details_commande;"),
    exercises: [
      ex(
        ECOMMERCE,
        "Chiffre d'affaires par mois : colonnes `annee`, `mois` (texte, avec `strftime`) et `ca_mensuel` (somme des totaux, arrondie à 2 décimales avec `ROUND`), du mois le plus récent au plus ancien.",
        lines("SELECT date_commande, total", "FROM commandes;"),
        lines(
          "SELECT strftime('%Y', date_commande) AS annee,",
          "       strftime('%m', date_commande) AS mois,",
          "       ROUND(SUM(total), 2) AS ca_mensuel",
          "FROM commandes",
          "GROUP BY annee, mois",
          "ORDER BY annee DESC, mois DESC;",
        ),
        "En SQLite, `strftime('%Y', date)` et `strftime('%m', date)` extraient l'année et le mois. Groupez sur les deux, puis triez en ordre décroissant.",
      ),
      ex(
        ECOMMERCE,
        "Les 3 produits les plus vendus en quantité : colonnes `nom` et `total_vendu` (somme des quantités), du plus vendu au moins vendu ; à égalité, par nom.",
        lines("SELECT produit_id, quantite", "FROM details_commande;"),
        lines(
          "SELECT p.nom, SUM(dc.quantite) AS total_vendu",
          "FROM details_commande dc",
          "JOIN produits p ON dc.produit_id = p.id",
          "GROUP BY p.id, p.nom",
          "ORDER BY total_vendu DESC, p.nom",
          "LIMIT 3;",
        ),
        "Joignez `details_commande` à `produits` pour avoir le nom, groupez par produit, triez sur la somme puis sur le nom, et gardez 3 lignes avec `LIMIT 3`.",
      ),
      ex(
        ECOMMERCE,
        "Panier moyen par client ayant commandé : colonnes `nom`, `nb_commandes` et `panier_moyen` (moyenne des totaux, arrondie à 2 décimales), du plus grand panier moyen au plus petit.",
        lines("SELECT c.nom, co.total", "FROM clients c", "JOIN commandes co ON c.id = co.client_id;"),
        lines(
          "SELECT c.nom, COUNT(co.id) AS nb_commandes, ROUND(AVG(co.total), 2) AS panier_moyen",
          "FROM clients c",
          "JOIN commandes co ON c.id = co.client_id",
          "GROUP BY c.id, c.nom",
          "ORDER BY panier_moyen DESC;",
        ),
        "Un `JOIN` ne garde que les clients qui ont commandé ; `COUNT` et `AVG` se calculent par client avec `GROUP BY`.",
      ),
      ex(
        ECOMMERCE,
        "Nous sommes le 15 août 2026. Clients sans commande depuis 6 mois, **y compris ceux qui n'ont jamais commandé** : colonnes `nom` et `derniere_commande` (vide pour un client sans commande), par ordre alphabétique. La date limite s'écrit `date('2026-08-15', '-6 months')`.",
        lines(
          "SELECT c.nom, MAX(co.date_commande) AS derniere_commande",
          "FROM clients c",
          "JOIN commandes co ON c.id = co.client_id",
          "GROUP BY c.id, c.nom",
          "HAVING MAX(co.date_commande) < date('2026-08-15', '-6 months')",
          "ORDER BY c.nom;",
        ),
        lines(
          "SELECT c.nom, MAX(co.date_commande) AS derniere_commande",
          "FROM clients c",
          "LEFT JOIN commandes co ON c.id = co.client_id",
          "GROUP BY c.id, c.nom",
          "HAVING MAX(co.date_commande) IS NULL",
          "    OR MAX(co.date_commande) < date('2026-08-15', '-6 months')",
          "ORDER BY c.nom;",
        ),
        "Le `JOIN` de départ oublie les clients sans commande : un `LEFT JOIN` les garde, avec une dernière commande vide (`NULL`), qu'il faut accepter dans le `HAVING`.",
      ),
    ],
  },
  {
    id: "reseau",
    setup: RESEAU,
    exploration: lines("SELECT * FROM utilisateurs;", "SELECT * FROM amities WHERE user1_id < user2_id;"),
    exercises: [
      ex(
        RESEAU,
        "Amis communs d'Alice (id 1) et de Bob (id 2), amitiés acceptées seulement : une colonne `ami_commun` (le nom), par ordre alphabétique.",
        lines("SELECT user2_id", "FROM amities", "WHERE user1_id = 1;"),
        lines(
          "SELECT u.nom AS ami_commun",
          "FROM amities a1",
          "JOIN amities a2 ON a1.user2_id = a2.user2_id",
          "JOIN utilisateurs u ON u.id = a1.user2_id",
          "WHERE a1.user1_id = 1 AND a2.user1_id = 2",
          "  AND a1.statut = 'accepte' AND a2.statut = 'accepte'",
          "ORDER BY u.nom;",
        ),
        "Joignez `amities` à elle-même : la première copie part d'Alice, la seconde de Bob, et elles se rejoignent sur l'ami (`user2_id`).",
      ),
      ex(
        RESEAU,
        "Amis suggérés pour Alice (id 1) : les amis de ses amis qui ne sont ni Alice ni déjà ses amis (amitiés acceptées), avec le nombre d'amis communs. Colonnes `nom` et `amis_communs`, du plus grand nombre au plus petit ; à égalité, par nom.",
        lines("SELECT user2_id AS ami_id", "FROM amities", "WHERE user1_id = 1 AND statut = 'accepte';"),
        lines(
          "WITH amis_alice AS (",
          "    SELECT user2_id AS ami_id FROM amities WHERE user1_id = 1 AND statut = 'accepte'",
          ")",
          "SELECT u.nom, COUNT(DISTINCT a.user1_id) AS amis_communs",
          "FROM amities a",
          "JOIN amis_alice aa ON a.user1_id = aa.ami_id",
          "JOIN utilisateurs u ON u.id = a.user2_id",
          "WHERE a.statut = 'accepte'",
          "  AND a.user2_id != 1",
          "  AND a.user2_id NOT IN (SELECT ami_id FROM amis_alice)",
          "GROUP BY a.user2_id, u.nom",
          "ORDER BY amis_communs DESC, u.nom;",
        ),
        "Une CTE (`WITH amis_alice AS (...)`) garde les amis d'Alice ; leurs amis sont les `user2_id` des amitiés dont le `user1_id` est l'un d'eux. Excluez Alice et ses amis, puis comptez par candidat. L'invitation en attente d'Emma ne compte pas.",
      ),
      ex(
        RESEAU,
        "Utilisateurs qui partagent au moins 2 centres d'intérêt avec Alice (id 1) : colonnes `nom` et `interets_communs`, du plus grand nombre au plus petit ; à égalité, par nom.",
        lines("SELECT interet", "FROM centres_interet", "WHERE user_id = 1;"),
        lines(
          "SELECT u.nom, COUNT(*) AS interets_communs",
          "FROM centres_interet ci1",
          "JOIN centres_interet ci2 ON ci1.interet = ci2.interet",
          "JOIN utilisateurs u ON u.id = ci2.user_id",
          "WHERE ci1.user_id = 1 AND ci2.user_id != 1",
          "GROUP BY ci2.user_id, u.nom",
          "HAVING COUNT(*) >= 2",
          "ORDER BY interets_communs DESC, u.nom;",
        ),
        "Joignez `centres_interet` à elle-même sur l'intérêt, partez des intérêts d'Alice, comptez par autre utilisateur et filtrez les groupes avec `HAVING`.",
      ),
      null,
    ],
  },
  {
    id: "usine",
    setup: USINE,
    exploration: lines("SELECT * FROM capteurs;", "SELECT * FROM mesures ORDER BY horodatage;"),
    exercises: [
      ex(
        USINE,
        "Nous sommes le 1er octobre 2026 à 12 h. Surchauffes de la dernière heure : mesures de température au-dessus du seuil de leur capteur, de qualité `'good'`, prises après `'2026-10-01 11:00:00'`. Colonnes `machine`, `valeur`, `seuil_alerte` et `depassement` (valeur moins seuil), du plus grand dépassement au plus petit.",
        lines("SELECT capteur_id, valeur, horodatage", "FROM mesures;"),
        lines(
          "SELECT m.nom AS machine, mes.valeur, c.seuil_alerte, mes.valeur - c.seuil_alerte AS depassement",
          "FROM mesures mes",
          "JOIN capteurs c ON mes.capteur_id = c.id",
          "JOIN machines m ON c.machine_id = m.id",
          "WHERE c.type_capteur = 'temperature'",
          "  AND mes.valeur > c.seuil_alerte",
          "  AND mes.qualite = 'good'",
          "  AND mes.horodatage > '2026-10-01 11:00:00'",
          "ORDER BY depassement DESC;",
        ),
        "Deux jointures relient la mesure à son capteur (seuil, type) puis à sa machine (nom). Les dates sont des textes au format `AAAA-MM-JJ HH:MM:SS` : on les compare comme des chaînes.",
      ),
      ex(
        USINE,
        "Tendance des vibrations : pour chaque machine qui a des mesures de vibration, la moyenne de chaque jour et sa moyenne mobile sur 3 jours (le jour et les deux précédents), avec une fonction de fenêtre. Colonnes `machine`, `jour` (avec `date(horodatage)`), `moyenne` et `moyenne_mobile_3j` (arrondies à 2 décimales), triées par machine puis par jour.",
        lines(
          "SELECT m.nom AS machine, date(mes.horodatage) AS jour, ROUND(AVG(mes.valeur), 2) AS moyenne",
          "FROM mesures mes",
          "JOIN capteurs c ON mes.capteur_id = c.id",
          "JOIN machines m ON c.machine_id = m.id",
          "WHERE c.type_capteur = 'vibration'",
          "GROUP BY m.id, m.nom, jour",
          "ORDER BY machine, jour;",
        ),
        lines(
          "SELECT m.nom AS machine,",
          "       date(mes.horodatage) AS jour,",
          "       ROUND(AVG(mes.valeur), 2) AS moyenne,",
          "       ROUND(AVG(AVG(mes.valeur)) OVER (",
          "           PARTITION BY m.id ORDER BY date(mes.horodatage)",
          "           ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS moyenne_mobile_3j",
          "FROM mesures mes",
          "JOIN capteurs c ON mes.capteur_id = c.id",
          "JOIN machines m ON c.machine_id = m.id",
          "WHERE c.type_capteur = 'vibration'",
          "GROUP BY m.id, m.nom, jour",
          "ORDER BY machine, jour;",
        ),
        "Le départ calcule déjà la moyenne du jour. Ajoutez une colonne avec `AVG(AVG(mes.valeur)) OVER (PARTITION BY m.id ORDER BY ... ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)` : la fenêtre s'applique aux lignes déjà groupées par jour.",
      ),
      ex(
        USINE,
        "Pannes récurrentes : pour chaque machine et chaque type d'arrêt non prévu (`'panne'` ou `'arret_urgence'`) survenu au moins deux fois, le nombre d'occurrences. Colonnes `machine`, `type` et `nb_occurrences`, du plus grand nombre au plus petit ; à égalité, par machine.",
        lines("SELECT machine_id, type, date_debut", "FROM maintenances;"),
        lines(
          "SELECT m.nom AS machine, mt.type, COUNT(*) AS nb_occurrences",
          "FROM maintenances mt",
          "JOIN machines m ON mt.machine_id = m.id",
          "WHERE mt.type IN ('panne', 'arret_urgence')",
          "GROUP BY m.id, m.nom, mt.type",
          "HAVING COUNT(*) >= 2",
          "ORDER BY nb_occurrences DESC, machine;",
        ),
        "Filtrez les types avec `IN`, groupez par machine et par type, puis gardez les groupes d'au moins deux lignes avec `HAVING`. Les maintenances préventives ne comptent pas.",
      ),
      null,
    ],
  },
];
