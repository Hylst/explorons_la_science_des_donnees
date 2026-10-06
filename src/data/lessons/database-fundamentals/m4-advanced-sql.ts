import type { LessonModule } from "@/lib/lessons/types";
import { BIBLIOTHEQUE_SETUP } from "../datasets/bibliotheque";

export const moduleAdvancedSql: LessonModule = {
  id: "advanced-sql",
  title: "SQL avancé",
  duration: "3 h",
  summary: "Jointures externes, sous-requêtes, CTE, CASE, dates et fonctions de fenêtre : les outils des vraies analyses.",
  objectives: [
    "Choisir entre INNER JOIN et LEFT JOIN, et trouver les lignes sans correspondance",
    "Écrire une sous-requête et une CTE (WITH) pour découper une question en étapes",
    "Calculer avec les dates dans SQLite",
    "Classer et numéroter des lignes avec les fonctions de fenêtre",
  ],
  sections: [
    {
      kind: "text",
      md: `### INNER JOIN et LEFT JOIN

La jointure du module 2 (\`JOIN\`, aussi appelée \`INNER JOIN\`) ne garde que les lignes qui ont une correspondance **des deux côtés**. Un adhérent qui n'a jamais rien emprunté disparaît donc du résultat.

\`LEFT JOIN\` garde **toutes** les lignes de la table de gauche ; quand il n'y a pas de correspondance à droite, les colonnes de droite valent \`NULL\`. C'est l'outil pour répondre aux questions du type « qui n'a jamais... ».`,
    },
    {
      kind: "code",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      code: "SELECT a.prenom, COUNT(e.id) AS nb_emprunts\nFROM adherents AS a\nLEFT JOIN emprunts AS e ON e.adherent_id = a.id\nGROUP BY a.id, a.prenom\nORDER BY nb_emprunts DESC, a.prenom;",
      caption: "Lucas apparaît avec 0 emprunt. Remplacez LEFT JOIN par JOIN : il disparaît. Notez COUNT(e.id) et non COUNT(*), qui compterait 1 pour Lucas.",
    },
    {
      kind: "exercise",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      prompt: "Quels livres n'ont **jamais été empruntés** ? Colonne attendue : `titre`.",
      starter: "SELECT l.titre\nFROM livres AS l\nJOIN emprunts AS e ON e.livre_id = l.id;",
      solution: "SELECT l.titre\nFROM livres AS l\nLEFT JOIN emprunts AS e ON e.livre_id = l.id\nWHERE e.id IS NULL;",
      hint: "LEFT JOIN depuis livres, puis ne garder que les lignes où la partie emprunts est vide (IS NULL).",
    },
    {
      kind: "text",
      md: `### Sous-requêtes et CTE

Une **sous-requête** est une requête placée à l'intérieur d'une autre, entre parenthèses : dans un \`WHERE\` (\`WHERE annee > (SELECT AVG(annee) FROM livres)\`), avec \`IN\` (\`WHERE id IN (SELECT livre_id FROM emprunts)\`) ou avec \`EXISTS\`.

Quand la question se complique, une **CTE** (*Common Table Expression*) la découpe en étapes nommées, lisibles de haut en bas :

\`\`\`
WITH etape1 AS (SELECT ...),
     etape2 AS (SELECT ... FROM etape1 ...)
SELECT ... FROM etape2;
\`\`\`

Une CTE n'est pas plus rapide qu'une sous-requête : elle est surtout plus facile à lire, à vérifier étape par étape et à corriger.`,
    },
    {
      kind: "code",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      code: "-- Les auteurs dont au moins un livre est emprunté en ce moment\nSELECT nom\nFROM auteurs AS a\nWHERE EXISTS (\n  SELECT 1\n  FROM livres AS l\n  JOIN emprunts AS e ON e.livre_id = l.id\n  WHERE l.auteur_id = a.id AND e.date_retour IS NULL\n);",
      caption: "EXISTS est vrai dès que la sous-requête renvoie au moins une ligne. Elle fait ici référence à l'auteur de la requête principale (a.id).",
    },
    {
      kind: "exercise",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      prompt: "Quels adhérents ont emprunté **plus de livres que la moyenne** des adhérents qui ont emprunté au moins une fois ? Colonnes attendues : `prenom`, `nb` (leur nombre d'emprunts).\n\nConseil : une CTE qui compte les emprunts par adhérent, puis une requête qui compare chaque compte à la moyenne de cette CTE.",
      starter: "WITH par_adherent AS (\n  SELECT adherent_id, COUNT(*) AS nb\n  FROM emprunts\n  GROUP BY adherent_id\n)\nSELECT * FROM par_adherent;",
      solution: "WITH par_adherent AS (\n  SELECT adherent_id, COUNT(*) AS nb\n  FROM emprunts\n  GROUP BY adherent_id\n)\nSELECT a.prenom, p.nb\nFROM par_adherent AS p\nJOIN adherents AS a ON a.id = p.adherent_id\nWHERE p.nb > (SELECT AVG(nb) FROM par_adherent);",
    },
    {
      kind: "text",
      md: `### CASE et les dates

\`CASE WHEN condition THEN valeur ... ELSE valeur END\` crée une colonne calculée selon des conditions, comme un « si... alors » ligne par ligne.

SQLite n'a pas de type « date » : les dates sont stockées en texte au format \`AAAA-MM-JJ\`, qui a l'avantage de se trier correctement. Deux fonctions suffisent pour la plupart des calculs :

- \`strftime('%Y', date)\` extrait une partie de la date (\`%Y\` l'année, \`%m\` le mois) ;
- \`julianday(date)\` convertit une date en nombre de jours : la différence de deux \`julianday\` donne une durée en jours.

PostgreSQL et MySQL ont de vrais types de dates et d'autres fonctions (\`EXTRACT\`, \`DATEDIFF\`...) : c'est l'une des principales différences entre les SGBD.`,
    },
    {
      kind: "code",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      code: "SELECT e.id,\n       l.titre,\n       CASE WHEN e.date_retour IS NULL THEN 'en cours' ELSE 'rendu' END AS statut,\n       julianday(e.date_retour) - julianday(e.date_emprunt) AS duree_jours\nFROM emprunts AS e\nJOIN livres AS l ON l.id = e.livre_id\nORDER BY e.id;",
      caption: "Pour un emprunt en cours, la durée vaut NULL : toute opération avec NULL donne NULL.",
    },
    {
      kind: "exercise",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      prompt: "Quelle est la **durée moyenne**, en jours, d'un emprunt **rendu** ? Arrondissez à une décimale avec `ROUND(valeur, 1)`. Colonne attendue : `duree_moyenne`.",
      starter: "SELECT date_emprunt, date_retour FROM emprunts;",
      solution: "SELECT ROUND(AVG(julianday(date_retour) - julianday(date_emprunt)), 1) AS duree_moyenne\nFROM emprunts\nWHERE date_retour IS NOT NULL;",
      hint: "AVG de la différence de deux julianday, sur les emprunts dont la date de retour n'est pas NULL.",
    },
    {
      kind: "text",
      md: `### Les fonctions de fenêtre

Un \`GROUP BY\` résume chaque groupe en **une** ligne. Une **fonction de fenêtre** calcule quelque chose sur un groupe de lignes **sans les fusionner** : chaque ligne garde sa place et reçoit en plus le résultat du calcul. La syntaxe est \`fonction() OVER (PARTITION BY ... ORDER BY ...)\` :

- \`PARTITION BY\` découpe en groupes (par adhérent, par genre...) ;
- \`ORDER BY\` ordonne les lignes à l'intérieur de chaque groupe ;
- \`ROW_NUMBER()\` numérote 1, 2, 3... ; \`RANK()\` donne le même rang aux ex aequo ; \`SUM(...) OVER (...)\` fait un total cumulé.

Exemple classique : « le premier emprunt de chaque adhérent » ou « les deux livres les plus empruntés de chaque genre ».`,
    },
    {
      kind: "code",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      code: "WITH comptes AS (\n  SELECT l.titre, l.genre, COUNT(e.id) AS nb\n  FROM livres AS l\n  LEFT JOIN emprunts AS e ON e.livre_id = l.id\n  GROUP BY l.id\n)\nSELECT genre, titre, nb,\n       RANK() OVER (PARTITION BY genre ORDER BY nb DESC) AS rang\nFROM comptes\nORDER BY genre, rang, titre;",
      caption: "Le rang repart de 1 dans chaque genre. Les livres à égalité partagent le même rang.",
    },
    {
      kind: "exercise",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      prompt: "Pour chaque adhérent qui a emprunté, affichez son **premier emprunt** (le plus ancien). Colonnes attendues : `prenom`, `titre`, `date_emprunt`.",
      starter: "SELECT a.prenom, l.titre, e.date_emprunt\nFROM emprunts AS e\nJOIN adherents AS a ON a.id = e.adherent_id\nJOIN livres AS l ON l.id = e.livre_id;",
      solution: "WITH numerotes AS (\n  SELECT e.*, ROW_NUMBER() OVER (PARTITION BY e.adherent_id ORDER BY e.date_emprunt) AS n\n  FROM emprunts AS e\n)\nSELECT a.prenom, l.titre, nu.date_emprunt\nFROM numerotes AS nu\nJOIN adherents AS a ON a.id = nu.adherent_id\nJOIN livres AS l ON l.id = nu.livre_id\nWHERE nu.n = 1;",
      hint: "Numérotez les emprunts de chaque adhérent par date (ROW_NUMBER, PARTITION BY adherent_id), puis gardez le numéro 1.",
    },
  ],
  quiz: [
    {
      question: "Pourquoi utiliser LEFT JOIN plutôt que JOIN pour lister les adhérents et leur nombre d'emprunts ?",
      options: [
        "Parce que LEFT JOIN est plus rapide",
        "Parce que JOIN ferait disparaître les adhérents sans aucun emprunt",
        "Parce que JOIN ne fonctionne pas avec GROUP BY",
        "Il n'y a aucune différence",
      ],
      correct: 1,
      explanation: "JOIN ne garde que les lignes qui ont une correspondance des deux côtés. LEFT JOIN garde tous les adhérents, avec NULL côté emprunts pour ceux qui n'en ont pas.",
    },
    {
      question: "Avec LEFT JOIN, pourquoi écrire COUNT(e.id) et non COUNT(*) ?",
      options: [
        "COUNT(*) provoque une erreur avec LEFT JOIN",
        "COUNT(e.id) est plus rapide",
        "COUNT(*) compterait 1 pour un adhérent sans emprunt, car la ligne existe avec des NULL",
        "Les deux donnent toujours le même résultat",
      ],
      correct: 2,
      explanation: "COUNT(*) compte les lignes, y compris celle remplie de NULL qu'ajoute le LEFT JOIN. COUNT(colonne) ignore les NULL et donne bien 0.",
    },
    {
      question: "Qu'apporte surtout une CTE (WITH) par rapport à une sous-requête ?",
      options: [
        "Une exécution toujours plus rapide",
        "La possibilité de modifier les tables",
        "La lisibilité : la question est découpée en étapes nommées",
        "Le stockage permanent du résultat",
      ],
      correct: 2,
      explanation: "Une CTE nomme des étapes intermédiaires, qu'on peut lire et vérifier une par une. Elle n'est pas stockée et n'est pas, en général, plus rapide.",
    },
    {
      question: "Quelle différence entre GROUP BY et une fonction de fenêtre comme RANK() OVER (PARTITION BY genre ...) ?",
      options: [
        "GROUP BY fusionne chaque groupe en une ligne, la fonction de fenêtre garde toutes les lignes",
        "Aucune, c'est la même chose écrite autrement",
        "La fonction de fenêtre supprime les doublons",
        "GROUP BY ne fonctionne que sur une seule table",
      ],
      correct: 0,
      explanation: "Une fonction de fenêtre calcule sur un groupe de lignes mais rend une valeur pour chaque ligne : on garde le détail (chaque livre) tout en connaissant son rang dans son genre.",
    },
  ],
};
