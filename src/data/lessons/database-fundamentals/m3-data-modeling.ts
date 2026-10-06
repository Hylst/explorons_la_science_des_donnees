import type { LessonModule } from "@/lib/lessons/types";
import { BIBLIOTHEQUE_SETUP } from "../datasets/bibliotheque";

/** Une table « fourre-tout » telle qu'on en trouve dans les tableurs : tout est recopié sur chaque ligne */
const FOURRE_TOUT = `CREATE TABLE emprunts_brut (
  date_emprunt TEXT,
  prenom TEXT,
  ville TEXT,
  titre TEXT,
  auteur TEXT
);
INSERT INTO emprunts_brut VALUES
  ('2026-01-05', 'Inès', 'Rennes', 'L''Étranger', 'Albert Camus'),
  ('2026-01-20', 'Inès', 'Rennes', 'Frankenstein', 'Mary Shelley'),
  ('2026-02-01', 'Chloé', 'Vitré', 'L''Étranger', 'A. Camus'),
  ('2026-02-15', 'Inès', 'Renne', 'La Peste', 'Albert Camus'),
  ('2026-03-01', 'Malik', 'Rennes', 'Frankenstein', 'Mary Shelley'),
  ('2026-03-12', 'Tom', 'Rennes', 'L''Étranger', 'Albert Camus');`;

/** Plusieurs à plusieurs : un livre a plusieurs thèmes, un thème concerne plusieurs livres */
const THEMES = `CREATE TABLE themes (id INTEGER PRIMARY KEY, nom TEXT NOT NULL UNIQUE);
INSERT INTO themes (id, nom) VALUES (1, 'voyage'), (2, 'justice'), (3, 'mer'), (4, 'histoire'), (5, 'exil');
CREATE TABLE livres_themes (
  livre_id INTEGER NOT NULL REFERENCES livres(id),
  theme_id INTEGER NOT NULL REFERENCES themes(id),
  PRIMARY KEY (livre_id, theme_id)
);
INSERT INTO livres_themes (livre_id, theme_id) VALUES
  (3, 1), (3, 3), (4, 1), (2, 2), (1, 4), (8, 4), (6, 2), (11, 5), (11, 1), (10, 5);`;

export const moduleDataModeling: LessonModule = {
  id: "data-modeling",
  title: "Modélisation de données",
  duration: "2 h 30",
  summary: "Découper les informations en tables, les relier par des clés, et éviter les copies qui finissent par diverger.",
  objectives: [
    "Repérer les entités et les relations d'un problème (un à plusieurs, plusieurs à plusieurs)",
    "Expliquer les trois premières formes normales avec un exemple",
    "Créer une table avec ses contraintes (clé primaire, NOT NULL, UNIQUE, CHECK, clé étrangère)",
    "Savoir quand dénormaliser, et ce que cela coûte",
  ],
  sections: [
    {
      kind: "text",
      md: `### Le problème de la table fourre-tout

Avant d'avoir une base, beaucoup de bibliothèques tiennent un tableau unique : une ligne par emprunt, avec le prénom, la ville, le titre et l'auteur recopiés à chaque fois. C'est simple à remplir, mais regardez ce que cela donne au bout de quelques mois.`,
    },
    {
      kind: "code",
      language: "sql",
      setup: FOURRE_TOUT,
      code: "SELECT * FROM emprunts_brut;",
      caption: "Deux orthographes pour Camus, une ville mal tapée (« Renne ») : chaque copie est une occasion de se tromper.",
    },
    {
      kind: "text",
      md: `Trois défauts reviennent toujours avec ce genre de table :

- **anomalie de mise à jour** : si Inès déménage, il faut corriger toutes ses lignes ; en oublier une crée une contradiction ;
- **anomalie d'insertion** : impossible d'enregistrer un nouveau livre tant que personne ne l'a emprunté ;
- **anomalie de suppression** : effacer le seul emprunt de *La Peste* fait disparaître toute trace du livre.

La **modélisation** consiste à découper ces informations en **entités** (adhérent, livre, auteur, emprunt), chacune dans sa table, avec une clé primaire, puis à les relier par des clés étrangères. Chaque fait n'est alors écrit qu'à un seul endroit.`,
    },
    {
      kind: "exercise",
      language: "sql",
      setup: FOURRE_TOUT,
      prompt: "Mettez le doigt sur le problème : pour chaque **titre** de la table fourre-tout, comptez le nombre d'**orthographes différentes** de l'auteur, et ne gardez que les titres qui en ont plus d'une. Colonnes attendues : `titre`, `nb_orthographes`.",
      starter: "SELECT titre, auteur FROM emprunts_brut;",
      solution: "SELECT titre, COUNT(DISTINCT auteur) AS nb_orthographes\nFROM emprunts_brut\nGROUP BY titre\nHAVING COUNT(DISTINCT auteur) > 1;",
      hint: "COUNT(DISTINCT colonne) compte les valeurs différentes ; HAVING filtre les groupes.",
    },
    {
      kind: "text",
      md: `### Les relations entre entités

- **Un à plusieurs** : un auteur écrit plusieurs livres, un livre a un auteur (dans notre modèle simplifié). On place une clé étrangère du côté « plusieurs » : la colonne \`auteur_id\` dans \`livres\`.
- **Plusieurs à plusieurs** : un livre aborde plusieurs thèmes, et un thème concerne plusieurs livres. Une colonne ne suffit plus : on crée une **table d'association**, ici \`livres_themes\`, dont chaque ligne relie un livre à un thème. Sa clé primaire est le couple \`(livre_id, theme_id)\` : le même lien ne peut pas être enregistré deux fois.
- **Un à un** : plus rare, par exemple un adhérent et sa carte. On le modélise souvent avec une colonne unique (\`UNIQUE\`).

La table \`emprunts\` est elle-même une table d'association entre \`adherents\` et \`livres\`, enrichie de ses propres colonnes (les dates).`,
    },
    {
      kind: "code",
      language: "sql",
      setup: `${BIBLIOTHEQUE_SETUP}\n${THEMES}`,
      code: "SELECT l.titre, t.nom AS theme\nFROM livres_themes AS lt\nJOIN livres AS l ON l.id = lt.livre_id\nJOIN themes AS t ON t.id = lt.theme_id\nORDER BY l.titre, t.nom;",
      caption: "La table d'association se traverse avec deux jointures. Vingt mille lieues sous les mers a deux thèmes, le voyage en a trois livres.",
    },
    {
      kind: "exercise",
      language: "sql",
      setup: `${BIBLIOTHEQUE_SETUP}\n${THEMES}`,
      prompt: "Pour chaque thème qui a au moins un livre, donnez le **nombre de livres**. Colonnes attendues : `theme`, `nb_livres`.",
      starter: "SELECT nom AS theme FROM themes;",
      solution: "SELECT t.nom AS theme, COUNT(*) AS nb_livres\nFROM themes AS t\nJOIN livres_themes AS lt ON lt.theme_id = t.id\nGROUP BY t.nom;",
    },
    {
      kind: "text",
      md: `### Les formes normales, sans jargon

Les **formes normales** sont des règles qui chassent les répétitions. Chacune suppose la précédente.

- **Première forme normale (1NF)** : une seule valeur par case. Une colonne \`themes\` contenant \`'mer, voyage'\` viole la 1NF : impossible de chercher proprement « tous les livres sur la mer ». La solution est la table d'association vue plus haut.
- **Deuxième forme normale (2NF)** : quand la clé est composée de plusieurs colonnes, chaque autre colonne doit dépendre de **toute** la clé. Dans \`livres_themes\`, ajouter le titre du livre serait une erreur : le titre dépend du seul \`livre_id\`, pas du couple \`(livre_id, theme_id)\`. Il a sa place dans \`livres\`.
- **Troisième forme normale (3NF)** : une colonne ne doit pas dépendre d'une autre colonne qui n'est pas la clé. Dans la table fourre-tout, la ville dépend de l'adhérent, pas de l'emprunt : elle va dans \`adherents\`.

Résultat : les tables \`auteurs\`, \`livres\`, \`adherents\` et \`emprunts\` du cours. Le nom de Camus n'y est écrit qu'une fois.`,
    },
    {
      kind: "text",
      md: `### Créer une table avec ses contraintes

Les **contraintes** font respecter les règles par le SGBD lui-même, au lieu de compter sur la vigilance de chacun :

- \`PRIMARY KEY\` : identifiant unique de la ligne ;
- \`NOT NULL\` : la valeur est obligatoire ;
- \`UNIQUE\` : pas deux fois la même valeur ;
- \`CHECK (condition)\` : la valeur doit respecter une condition ;
- \`REFERENCES autre_table(colonne)\` : clé étrangère, la valeur doit exister dans l'autre table.`,
    },
    {
      kind: "code",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      code: "-- Sans cette ligne, SQLite n'applique pas les clés étrangères (comportement par défaut)\n-- PRAGMA foreign_keys = ON;\n\nINSERT INTO livres (id, titre, auteur_id, annee, genre) VALUES (99, 'Livre fantôme', 42, 2020, 'roman');\nSELECT id, titre, auteur_id FROM livres WHERE id = 99;",
      caption: "L'auteur 42 n'existe pas, et pourtant SQLite accepte le livre. Retirez les deux tirets devant PRAGMA et relancez : cette fois, il refuse.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Particularité de SQLite : les clés étrangères ne sont contrôlées qu'après `PRAGMA foreign_keys = ON;`, à exécuter à chaque connexion. PostgreSQL et MySQL (avec le moteur InnoDB) les contrôlent toujours.",
    },
    {
      kind: "exercise",
      language: "sql",
      prompt: "Les lecteurs peuvent noter les livres de 1 à 5. Modifiez la création de la table `avis` pour que la note soit **obligatoire** et **comprise entre 1 et 5**. Ne touchez pas aux INSERT : avec `INSERT OR IGNORE`, SQLite ignore en silence les lignes qui ne respectent pas une contrainte. Le SELECT final ne doit plus montrer que les avis valides.",
      starter: "CREATE TABLE avis (\n  id INTEGER PRIMARY KEY,\n  livre_id INTEGER NOT NULL,\n  note INTEGER\n);\nINSERT OR IGNORE INTO avis (id, livre_id, note) VALUES (1, 6, 5);\nINSERT OR IGNORE INTO avis (id, livre_id, note) VALUES (2, 6, 7);\nINSERT OR IGNORE INTO avis (id, livre_id, note) VALUES (3, 12, 4);\nINSERT OR IGNORE INTO avis (id, livre_id, note) VALUES (4, 13, NULL);\nINSERT OR IGNORE INTO avis (id, livre_id, note) VALUES (5, 13, 0);\nSELECT id, livre_id, note FROM avis;",
      solution: "CREATE TABLE avis (\n  id INTEGER PRIMARY KEY,\n  livre_id INTEGER NOT NULL,\n  note INTEGER NOT NULL CHECK (note BETWEEN 1 AND 5)\n);\nINSERT OR IGNORE INTO avis (id, livre_id, note) VALUES (1, 6, 5);\nINSERT OR IGNORE INTO avis (id, livre_id, note) VALUES (2, 6, 7);\nINSERT OR IGNORE INTO avis (id, livre_id, note) VALUES (3, 12, 4);\nINSERT OR IGNORE INTO avis (id, livre_id, note) VALUES (4, 13, NULL);\nINSERT OR IGNORE INTO avis (id, livre_id, note) VALUES (5, 13, 0);\nSELECT id, livre_id, note FROM avis;",
      hint: "Deux contraintes sur la colonne note : NOT NULL, et CHECK (note BETWEEN 1 AND 5).",
    },
    {
      kind: "text",
      md: `### Et la dénormalisation ?

Une base très découpée demande des jointures pour presque chaque question. Pour des tableaux de bord qui lisent beaucoup et écrivent peu, on accepte parfois de **dénormaliser** : recopier une information (le nom de l'auteur dans une table de statistiques), précalculer des totaux, ou créer une vue matérialisée.

C'est un choix assumé, avec une contrepartie : les copies doivent être tenues à jour, sinon on retrouve les anomalies du début. La règle pratique : normaliser d'abord, dénormaliser ensuite, seulement là où une mesure montre que c'est utile.`,
    },
  ],
  quiz: [
    {
      question: "Comment représenter « un livre a plusieurs thèmes, un thème concerne plusieurs livres » ?",
      options: [
        "Une colonne themes dans livres, avec les thèmes séparés par des virgules",
        "Une table d'association livres_themes (livre_id, theme_id)",
        "Une colonne livre_id dans themes",
        "Deux bases de données séparées",
      ],
      correct: 1,
      explanation: "Une relation plusieurs à plusieurs se modélise avec une table d'association. La liste séparée par des virgules viole la première forme normale.",
    },
    {
      question: "Dans la table fourre-tout, pourquoi la ville de l'adhérent pose-t-elle problème ?",
      options: [
        "Parce qu'elle dépend de l'adhérent et non de l'emprunt : elle est recopiée et peut diverger",
        "Parce qu'une ville ne peut pas être stockée en texte",
        "Parce qu'elle devrait être la clé primaire",
        "Elle ne pose aucun problème",
      ],
      correct: 0,
      explanation: "La ville est un fait sur l'adhérent. Recopiée sur chaque emprunt, elle finit par contenir des versions contradictoires (« Rennes », « Renne ») : c'est ce que la troisième forme normale évite.",
    },
    {
      question: "Que fait la contrainte CHECK (note BETWEEN 1 AND 5) ?",
      options: [
        "Elle trie les avis par note",
        "Elle calcule la note moyenne",
        "Elle refuse toute ligne dont la note n'est pas comprise entre 1 et 5",
        "Elle remplace les notes hors limites par 1 ou 5",
      ],
      correct: 2,
      explanation: "Une contrainte CHECK fait refuser la ligne par le SGBD. Attention : une note NULL passe un CHECK (la condition vaut « inconnu », pas « faux ») ; il faut ajouter NOT NULL pour la rendre obligatoire.",
    },
    {
      question: "Dans SQLite, une clé étrangère est-elle toujours contrôlée ?",
      options: [
        "Oui, dès la création de la table",
        "Non, seulement après PRAGMA foreign_keys = ON",
        "Seulement pour les colonnes de type texte",
        "Seulement si la table est vide",
      ],
      correct: 1,
      explanation: "Pour des raisons de compatibilité historique, SQLite ne contrôle les clés étrangères qu'une fois PRAGMA foreign_keys = ON exécuté, à chaque connexion.",
    },
  ],
};
