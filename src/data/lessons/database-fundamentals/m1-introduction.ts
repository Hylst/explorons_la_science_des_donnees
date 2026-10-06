import type { LessonModule } from "@/lib/lessons/types";
import { BIBLIOTHEQUE_SETUP } from "../datasets/bibliotheque";

export const moduleIntroduction: LessonModule = {
  id: "db-intro",
  title: "Introduction aux bases de données",
  duration: "1 h 30",
  summary: "Ce qu'est une base de données, ce qu'elle apporte par rapport à un tableur, et une première requête.",
  objectives: [
    "Expliquer ce qu'une base de données apporte par rapport à un tableur",
    "Reconnaître une table, une ligne, une colonne et une clé primaire",
    "Lire et lancer une première requête SELECT",
  ],
  sections: [
    {
      kind: "text",
      md: `### Pourquoi pas un simple tableur ?

Un tableur est parfait pour une liste de quelques centaines de lignes que l'on consulte seul. Les choses se compliquent quand :

- plusieurs personnes modifient les mêmes données en même temps ;
- les données se répètent (le nom d'un auteur recopié sur chaque ligne de ses livres, avec une faute une fois sur dix) ;
- on veut poser des questions précises (« quels livres sont empruntés en ce moment, et par qui ? ») sur des milliers ou des millions de lignes.

Une **base de données** range les informations dans des tables reliées entre elles, et un **système de gestion de base de données** (SGBD) se charge de les stocker, de les protéger et de répondre aux questions. On lui parle avec un langage, le plus souvent **SQL** (*Structured Query Language*).

Quelques SGBD que vous croiserez : **SQLite** (une base dans un simple fichier, très répandue dans les applications et les téléphones), **PostgreSQL** et **MySQL** (des serveurs utilisés par de nombreux sites). Les exemples de ce cours tournent sur SQLite, directement dans votre navigateur : rien à installer.`,
    },
    {
      kind: "text",
      md: `### Le vocabulaire de base

- Une **table** regroupe des informations du même type : les livres, les auteurs, les emprunts.
- Une **ligne** (ou enregistrement) décrit un élément : un livre précis.
- Une **colonne** (ou attribut) décrit une caractéristique, avec un type : le titre (texte), l'année (entier).
- La **clé primaire** identifie chaque ligne sans ambiguïté : ici, la colonne \`id\`. Deux livres peuvent avoir le même titre, jamais le même \`id\`.
- Une **clé étrangère** fait référence à la clé primaire d'une autre table : la colonne \`auteur_id\` de la table \`livres\` désigne une ligne de la table \`auteurs\`.`,
    },
    {
      kind: "note",
      tone: "info",
      md: `Tout le cours utilise la même petite base : le réseau de bibliothèques d'une ville, avec quatre tables (\`auteurs\`, \`livres\`, \`adherents\`, \`emprunts\`). Les auteurs, les titres et les années de publication sont réels ; les exemplaires, les adhérents et les emprunts sont inventés. La base est recréée à chaque exécution : vous pouvez tout modifier sans rien casser.`,
    },
    {
      kind: "code",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      code: "SELECT * FROM livres;",
      caption: "SELECT * affiche toutes les colonnes de la table. Cliquez sur « Exécuter ».",
    },
    {
      kind: "text",
      md: `### Lire une requête

\`SELECT titre, annee FROM livres;\` se lit presque comme une phrase : *sélectionne* les colonnes \`titre\` et \`annee\` *depuis* la table \`livres\`. Le point-virgule termine l'instruction.

SQL est un langage **déclaratif** : on décrit le résultat voulu, pas la façon de l'obtenir. C'est le SGBD qui choisit comment parcourir les données. Les mots-clés (\`SELECT\`, \`FROM\`) s'écrivent souvent en majuscules par habitude, mais \`select\` fonctionne aussi.`,
    },
    {
      kind: "code",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      code: "SELECT titre, annee FROM livres;",
      caption: "Seules les colonnes demandées apparaissent, dans l'ordre demandé. Essayez d'inverser titre et annee.",
    },
    {
      kind: "exercise",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      prompt: "Affichez le **nom** et le **pays** de tous les auteurs (deux colonnes, dans cet ordre).",
      starter: "SELECT * FROM auteurs;",
      solution: "SELECT nom, pays FROM auteurs;",
      hint: "Remplacez l'étoile par la liste des colonnes voulues, séparées par une virgule.",
    },
    {
      kind: "exercise",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      prompt: "La bibliothèque veut connaître son stock : affichez le **titre** et le nombre d'**exemplaires** de chaque livre.",
      starter: "SELECT titre FROM livres;",
      solution: "SELECT titre, exemplaires FROM livres;",
    },
    {
      kind: "text",
      md: `### Relationnel et NoSQL, en deux mots

Les bases de ce cours sont **relationnelles** : des tables aux colonnes fixées à l'avance, reliées par des clés. C'est le modèle le plus répandu pour les données bien structurées. Les bases dites **NoSQL** (documents, clé-valeur, graphes...) font d'autres compromis, utiles pour certains usages : le module 5 en parle. Commencer par le relationnel reste le plus sûr, car ses idées (clés, requêtes, index) se retrouvent partout.`,
    },
  ],
  quiz: [
    {
      question: "À quoi sert une clé primaire ?",
      options: [
        "À identifier chaque ligne d'une table sans ambiguïté",
        "À trier automatiquement la table",
        "À chiffrer les données sensibles",
        "À relier deux bases de données entre elles",
      ],
      correct: 0,
      explanation: "La clé primaire (ici la colonne id) prend une valeur différente pour chaque ligne : on peut ainsi désigner un livre précis, même si deux livres ont le même titre.",
    },
    {
      question: "Dans la table livres, que représente la colonne auteur_id ?",
      options: [
        "Le nombre de livres écrits par l'auteur",
        "Une clé étrangère qui désigne une ligne de la table auteurs",
        "Une copie du nom de l'auteur",
        "La clé primaire de la table livres",
      ],
      correct: 1,
      explanation: "auteur_id contient l'identifiant d'un auteur : c'est une clé étrangère. Le nom n'est écrit qu'une fois, dans la table auteurs, ce qui évite les copies qui divergent.",
    },
    {
      question: "Que fait la requête SELECT titre FROM livres; ?",
      options: [
        "Elle supprime tous les titres",
        "Elle affiche toutes les colonnes de la table livres",
        "Elle affiche la colonne titre de toutes les lignes de la table livres",
        "Elle affiche le premier titre seulement",
      ],
      correct: 2,
      explanation: "SELECT choisit les colonnes, FROM la table. Sans autre condition, toutes les lignes sont renvoyées.",
    },
    {
      question: "Pourquoi dit-on que SQL est un langage déclaratif ?",
      options: [
        "Parce qu'il faut déclarer chaque variable",
        "Parce qu'on décrit le résultat voulu et que le SGBD choisit comment l'obtenir",
        "Parce qu'il ne sert qu'à créer des tables",
        "Parce qu'il s'écrit obligatoirement en majuscules",
      ],
      correct: 1,
      explanation: "On écrit ce que l'on veut obtenir, pas les étapes pour l'obtenir. Le moteur décide de l'ordre de lecture des données, de l'usage des index, etc.",
    },
  ],
};
