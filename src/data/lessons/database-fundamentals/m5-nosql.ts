import type { LessonModule } from "@/lib/lessons/types";

/**
 * Fiches de livres stockées comme documents JSON : chaque fiche a sa propre forme (la dernière n'a pas d'emplacement).
 * Les mots-clés et les emplacements sont inventés pour l'exercice.
 */
const FICHES = `CREATE TABLE fiches (id INTEGER PRIMARY KEY, doc TEXT NOT NULL);
INSERT INTO fiches (id, doc) VALUES
  (1, '{"titre": "Vingt mille lieues sous les mers", "public": "jeunesse", "mots_cles": ["mer", "voyage", "sous-marin"], "emplacement": {"site": "Centre", "rayon": "Aventure"}}'),
  (2, '{"titre": "Le Tour du monde en quatre-vingts jours", "public": "jeunesse", "mots_cles": ["voyage", "pari"], "emplacement": {"site": "Centre", "rayon": "Aventure"}}'),
  (3, '{"titre": "Frankenstein", "public": "adulte", "mots_cles": ["science", "créature"], "emplacement": {"site": "Nord", "rayon": "Science-fiction"}}'),
  (4, '{"titre": "Fondation", "public": "adulte", "mots_cles": ["science", "empire", "voyage"], "emplacement": {"site": "Nord", "rayon": "Science-fiction"}}'),
  (5, '{"titre": "L''Étranger", "public": "adulte", "mots_cles": ["justice", "absurde"], "emplacement": {"site": "Centre", "rayon": "Romans"}}'),
  (6, '{"titre": "Stupeur et tremblements", "public": "adulte", "mots_cles": ["travail", "Japon"]}');`;

export const moduleNosql: LessonModule = {
  id: "nosql-intro",
  title: "Introduction au NoSQL",
  duration: "2 h",
  summary: "Les autres familles de bases de données, ce qu'elles échangent contre quoi, et des documents JSON interrogés dans SQLite.",
  objectives: [
    "Décrire les quatre grandes familles NoSQL et un usage typique de chacune",
    "Expliquer le théorème CAP avec ses nuances",
    "Interroger des documents JSON avec json_extract, ->> et json_each",
    "Choisir un modèle de données selon le problème, sans dogme",
  ],
  sections: [
    {
      kind: "text",
      md: `### Pourquoi d'autres modèles ?

Le modèle relationnel demande de fixer les colonnes à l'avance et de répartir les données dans des tables reliées. C'est une force (cohérence, requêtes libres) et parfois une gêne : données dont la forme varie d'un élément à l'autre, volumes répartis sur de nombreux serveurs, accès toujours faits par la même clé, relations très nombreuses à parcourir.

Le terme **NoSQL** (souvent lu « *not only SQL* ») regroupe des bases qui font d'autres compromis. Ce n'est pas une famille unique, et ce n'est pas « mieux » ou « moins bien » que le relationnel : c'est différent, pour d'autres usages.`,
    },
    {
      kind: "text",
      md: `### Les quatre familles

- **Documents** (MongoDB, CouchDB) : chaque élément est un document, souvent en JSON, qui peut contenir des listes et des sous-objets. Pratique quand la forme des données varie, ou quand on lit toujours un objet entier (une fiche produit, un profil).
- **Clé-valeur** (Redis, et DynamoDB dans son usage le plus simple) : on range une valeur sous une clé, et on la retrouve par cette clé, très vite. Idéal pour un cache ou des sessions ; on ne pose pas de questions complexes dessus.
- **Colonnes larges** (Cassandra, HBase) : des lignes regroupées en familles de colonnes, réparties sur de nombreux serveurs, pensées pour de très gros volumes d'écritures (journaux, mesures de capteurs). À ne pas confondre avec le stockage « en colonnes » des entrepôts analytiques.
- **Graphes** (Neo4j) : des nœuds reliés par des relations. Parcourir « les amis des amis » ou un réseau de transport y est naturel, là où il faudrait de nombreuses jointures en SQL.

À l'inverse, les bases relationnelles savent désormais stocker et interroger du JSON (PostgreSQL avec son type \`JSONB\`, SQLite avec ses fonctions JSON) : la frontière est moins nette qu'il y a quinze ans.`,
    },
    {
      kind: "text",
      md: `### Le théorème CAP, en nuances

Quand une base est répartie sur plusieurs serveurs, une coupure réseau peut les isoler les uns des autres (une **partition**). Le théorème CAP dit qu'à ce moment-là, il faut choisir entre :

- la **cohérence** (*Consistency*) : tout le monde lit la dernière valeur écrite, quitte à refuser de répondre ;
- la **disponibilité** (*Availability*) : chaque serveur continue de répondre, quitte à renvoyer une valeur un peu ancienne.

Deux nuances importantes : ce choix ne se pose que **pendant** une partition (le reste du temps, on arbitre plutôt entre cohérence et rapidité), et beaucoup de bases permettent de régler ce compromis requête par requête. Classer une base une fois pour toutes en « CP » ou « AP » est donc une simplification.`,
    },
    {
      kind: "text",
      md: `### Des documents JSON dans SQLite

Pour toucher du doigt le modèle « documents » sans installer MongoDB, rangeons des fiches de livres en JSON dans une colonne texte de SQLite. Chaque fiche a sa propre forme : la dernière n'a pas d'emplacement.

Trois outils suffisent pour commencer :

- \`json_extract(doc, '$.titre')\` lit une valeur à un chemin (\`$\` est la racine, \`.\` descend dans un objet) ;
- \`doc ->> '$.emplacement.site'\` fait la même chose en plus court ;
- \`json_each(doc, '$.mots_cles')\` transforme une liste JSON en lignes, que l'on peut joindre, filtrer et compter.`,
    },
    {
      kind: "code",
      language: "sql",
      setup: FICHES,
      code: "SELECT id,\n       json_extract(doc, '$.titre') AS titre,\n       doc ->> '$.public' AS public,\n       doc ->> '$.emplacement.site' AS site\nFROM fiches;",
      caption: "Un champ absent donne NULL, sans erreur : c'est la souplesse (et le risque) du modèle documents.",
    },
    {
      kind: "exercise",
      language: "sql",
      setup: FICHES,
      prompt: "Affichez le **titre** des fiches destinées au public `jeunesse`. Colonne attendue : `titre`.",
      starter: "SELECT doc FROM fiches;",
      solution: "SELECT json_extract(doc, '$.titre') AS titre\nFROM fiches\nWHERE json_extract(doc, '$.public') = 'jeunesse';",
      hint: "json_extract (ou ->>) dans le SELECT pour le titre, et dans le WHERE pour le public.",
    },
    {
      kind: "code",
      language: "sql",
      setup: FICHES,
      code: "SELECT json_extract(f.doc, '$.titre') AS titre, j.value AS mot_cle\nFROM fiches AS f, json_each(f.doc, '$.mots_cles') AS j\nORDER BY f.id, j.key;",
      caption: "json_each produit une ligne par élément de la liste : la fiche est en quelque sorte jointe à ses propres mots-clés.",
    },
    {
      kind: "exercise",
      language: "sql",
      setup: FICHES,
      prompt: "Comptez les fiches **par site**, en laissant de côté les fiches sans emplacement. Colonnes attendues : `site`, `nb`.",
      starter: "SELECT doc ->> '$.emplacement.site' AS site\nFROM fiches;",
      solution: "SELECT doc ->> '$.emplacement.site' AS site, COUNT(*) AS nb\nFROM fiches\nWHERE doc ->> '$.emplacement.site' IS NOT NULL\nGROUP BY site;",
    },
    {
      kind: "exercise",
      language: "sql",
      setup: FICHES,
      prompt: "Quels **mots-clés** apparaissent dans **au moins deux** fiches ? Colonnes attendues : `mot_cle`, `nb` (le nombre de fiches).",
      starter: "SELECT j.value AS mot_cle\nFROM fiches AS f, json_each(f.doc, '$.mots_cles') AS j;",
      solution: "SELECT j.value AS mot_cle, COUNT(*) AS nb\nFROM fiches AS f, json_each(f.doc, '$.mots_cles') AS j\nGROUP BY j.value\nHAVING COUNT(*) >= 2;",
      hint: "Regroupez par j.value et gardez les groupes d'au moins deux lignes avec HAVING.",
    },
    {
      kind: "text",
      md: `### Comment choisir ?

Quelques questions simples guident le choix bien mieux qu'un effet de mode :

- **Quelles questions poserez-vous aux données ?** Des questions variées, imprévues, avec des regroupements : le relationnel est très à l'aise. Toujours la même lecture par clé : un magasin clé-valeur suffit.
- **La forme des données varie-t-elle beaucoup ?** Une colonne JSON dans une base relationnelle est souvent un bon compromis avant de changer de système.
- **Quel volume, réparti comment ?** Des millions de lignes tiennent très bien dans PostgreSQL sur un seul serveur. Les bases distribuées deviennent utiles bien au-delà, ou pour des besoins de disponibilité particuliers.
- **Les relations sont-elles le cœur du problème ?** Recommandations, réseaux, dépendances : une base orientée graphes peut simplifier beaucoup de requêtes.

Et dans le doute, commencer par une base relationnelle reste un choix raisonnable : on peut toujours ajouter un cache ou un moteur spécialisé plus tard.`,
    },
  ],
  quiz: [
    {
      question: "Pour un cache de sessions, lu et écrit sans cesse par une clé, quelle famille convient le mieux ?",
      options: [
        "Une base orientée graphes",
        "Un magasin clé-valeur comme Redis",
        "Un entrepôt analytique en colonnes",
        "Une feuille de calcul partagée",
      ],
      correct: 1,
      explanation: "On accède toujours à une session par sa clé, et il faut aller vite : c'est exactement le cas d'usage d'un magasin clé-valeur.",
    },
    {
      question: "Que dit le théorème CAP ?",
      options: [
        "Qu'une base ne peut jamais être à la fois rapide et cohérente",
        "Qu'en cas de partition réseau, il faut choisir entre cohérence et disponibilité",
        "Que les bases NoSQL sont toujours disponibles",
        "Que les bases relationnelles ne peuvent pas être réparties",
      ],
      correct: 1,
      explanation: "Le choix entre cohérence et disponibilité ne s'impose que pendant une partition. Hors partition, l'arbitrage porte plutôt sur la cohérence et la rapidité, et il est souvent réglable.",
    },
    {
      question: "Que renvoie json_extract(doc, '$.emplacement.site') pour une fiche qui n'a pas d'emplacement ?",
      options: [
        "Une erreur qui arrête la requête",
        "Une chaîne vide",
        "NULL",
        "La valeur de la fiche précédente",
      ],
      correct: 2,
      explanation: "Un chemin absent donne NULL. Le modèle documents tolère des formes variées, mais il faut penser à ces NULL dans les filtres et les comptes.",
    },
    {
      question: "Quelle affirmation est la plus juste ?",
      options: [
        "NoSQL a remplacé le relationnel, qui n'est plus utilisé",
        "Le relationnel ne sait pas stocker de JSON",
        "Relationnel et NoSQL font des compromis différents ; le choix dépend des questions posées aux données",
        "Une base NoSQL est toujours plus rapide",
      ],
      correct: 2,
      explanation: "Les deux approches coexistent. PostgreSQL et SQLite stockent du JSON, et beaucoup de systèmes combinent une base relationnelle avec un cache ou un moteur spécialisé.",
    },
  ],
};
