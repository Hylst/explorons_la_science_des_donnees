import type { LessonModule } from "@/lib/lessons/types";
import { BIBLIOTHEQUE_SETUP } from "../datasets/bibliotheque";

export const moduleSqlBasics: LessonModule = {
  id: "sql-basics",
  title: "SQL : les fondamentaux",
  duration: "3 h",
  summary: "Filtrer, trier, compter, regrouper, relier deux tables et modifier des données.",
  objectives: [
    "Filtrer des lignes avec WHERE et trier avec ORDER BY",
    "Compter et résumer avec COUNT, SUM, AVG et GROUP BY",
    "Relier deux tables avec une jointure",
    "Modifier des données avec INSERT, UPDATE et DELETE",
  ],
  sections: [
    {
      kind: "text",
      md: `### Filtrer avec WHERE

\`WHERE\` garde les lignes qui respectent une condition. On compare avec \`=\`, \`<>\` (différent), \`<\`, \`>\`, \`<=\`, \`>=\`, on combine avec \`AND\` et \`OR\`, et on cherche un motif dans un texte avec \`LIKE\` (\`%\` remplace n'importe quelle suite de caractères). Les textes s'écrivent entre apostrophes : \`'roman'\`.`,
    },
    {
      kind: "code",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      code: "SELECT titre, annee, genre\nFROM livres\nWHERE genre = 'roman' AND annee > 1900;",
      caption: "Les romans publiés après 1900. Essayez OR à la place de AND, ou WHERE titre LIKE 'L%'.",
    },
    {
      kind: "text",
      md: `### Trier et limiter

\`ORDER BY\` trie le résultat : \`ASC\` (croissant, par défaut) ou \`DESC\` (décroissant). On peut trier sur plusieurs colonnes : la seconde départage les égalités de la première. \`LIMIT n\` ne garde que les n premières lignes, et \`DISTINCT\` retire les doublons.

Sans \`ORDER BY\`, **l'ordre des lignes n'est pas garanti** : il peut changer d'un SGBD à l'autre, ou après une mise à jour. Si l'ordre compte, on le demande.`,
    },
    {
      kind: "code",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      code: "SELECT titre, annee\nFROM livres\nORDER BY annee DESC\nLIMIT 3;\n\nSELECT DISTINCT genre FROM livres;",
      caption: "Deux requêtes à la suite : les trois livres les plus récents, puis la liste des genres sans doublon.",
    },
    {
      kind: "exercise",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      prompt: "Affichez le **titre** et l'**annee** des livres publiés **après 1900**, du plus ancien au plus récent. À année égale, classez par titre.",
      starter: "SELECT titre, annee FROM livres;",
      solution: "SELECT titre, annee\nFROM livres\nWHERE annee > 1900\nORDER BY annee, titre;",
      ordered: true,
      hint: "Il faut un WHERE pour l'année, puis un ORDER BY sur deux colonnes : annee, puis titre.",
    },
    {
      kind: "text",
      md: `### Compter et résumer

Les **fonctions d'agrégation** résument plusieurs lignes en une valeur : \`COUNT(*)\` (nombre de lignes), \`SUM\`, \`AVG\` (moyenne), \`MIN\`, \`MAX\`. Avec \`GROUP BY\`, le calcul se fait **par groupe** : une ligne de résultat par valeur de la colonne de regroupement.

\`AS\` donne un nom à une colonne calculée. Pour filtrer les groupes eux-mêmes (« les genres qui ont au moins trois livres »), on utilise \`HAVING\`, qui s'applique après le regroupement, alors que \`WHERE\` s'applique avant, ligne par ligne.`,
    },
    {
      kind: "code",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      code: "SELECT genre, COUNT(*) AS nb_livres, SUM(exemplaires) AS nb_exemplaires\nFROM livres\nGROUP BY genre\nHAVING COUNT(*) >= 2\nORDER BY nb_livres DESC;",
      caption: "Par genre : nombre de livres et d'exemplaires, en ne gardant que les genres qui ont au moins deux livres.",
    },
    {
      kind: "exercise",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      prompt: "Comptez les adhérents **par ville** : deux colonnes, `ville` et `nb` (le nombre d'adhérents).",
      starter: "SELECT ville FROM adherents;",
      solution: "SELECT ville, COUNT(*) AS nb\nFROM adherents\nGROUP BY ville;",
      hint: "COUNT(*) AS nb, et un GROUP BY sur la ville.",
    },
    {
      kind: "text",
      md: `### Les valeurs manquantes : NULL

Un emprunt qui n'est pas encore rendu n'a pas de \`date_retour\` : la case contient \`NULL\`, qui signifie « inconnu ». Piège classique : \`NULL\` n'est égal à rien, pas même à lui-même. La condition \`date_retour = NULL\` n'est donc jamais vraie ; on écrit \`date_retour IS NULL\` (ou \`IS NOT NULL\`).`,
    },
    {
      kind: "exercise",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      prompt: "Quels emprunts ne sont **pas encore rendus** ? Affichez leur `id` et leur `date_emprunt`.\n\nLa réponse de départ contient le piège décrit plus haut : exécutez-la pour voir ce qu'elle renvoie, puis corrigez-la.",
      starter: "SELECT id, date_emprunt\nFROM emprunts\nWHERE date_retour = NULL;",
      solution: "SELECT id, date_emprunt\nFROM emprunts\nWHERE date_retour IS NULL;",
    },
    {
      kind: "text",
      md: `### Relier deux tables : la jointure

Le titre d'un livre est dans \`livres\`, le nom de son auteur dans \`auteurs\`. Pour les afficher ensemble, on **joint** les deux tables sur la clé : chaque livre est associé à la ligne d'auteur dont l'\`id\` vaut son \`auteur_id\`.

\`\`\`
SELECT livres.titre, auteurs.nom
FROM livres
JOIN auteurs ON auteurs.id = livres.auteur_id;
\`\`\`

On peut donner un alias court à chaque table (\`livres AS l\`, puis \`l.titre\`). Le module 4 détaille les différentes jointures, dont celles qui gardent les lignes sans correspondance.`,
    },
    {
      kind: "code",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      code: "SELECT l.titre, a.nom, a.pays\nFROM livres AS l\nJOIN auteurs AS a ON a.id = l.auteur_id\nWHERE a.pays <> 'France';",
      caption: "Les livres d'auteurs qui ne sont pas français, avec le nom et le pays de l'auteur.",
    },
    {
      kind: "exercise",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      prompt: "Affichez, pour chaque emprunt, le **titre** du livre et le **prenom** de l'adhérent (deux colonnes : `titre`, `prenom`).",
      starter: "SELECT livre_id, adherent_id FROM emprunts;",
      solution: "SELECT l.titre, ad.prenom\nFROM emprunts AS e\nJOIN livres AS l ON l.id = e.livre_id\nJOIN adherents AS ad ON ad.id = e.adherent_id;",
      hint: "Partez de emprunts, puis faites deux jointures : une vers livres, une vers adherents.",
    },
    {
      kind: "text",
      md: `### Modifier les données

- \`INSERT INTO table (colonnes) VALUES (...)\` ajoute une ligne ;
- \`UPDATE table SET colonne = valeur WHERE ...\` modifie des lignes ;
- \`DELETE FROM table WHERE ...\` en supprime.

Pour \`UPDATE\` et \`DELETE\`, **le WHERE est vital** : sans lui, toutes les lignes de la table sont modifiées ou supprimées. Un bon réflexe : écrire d'abord le \`SELECT\` avec le même \`WHERE\`, vérifier les lignes touchées, puis seulement lancer la modification.`,
    },
    {
      kind: "code",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      code: "-- L'emprunt 6 est rendu aujourd'hui\nUPDATE emprunts SET date_retour = '2026-04-10' WHERE id = 6;\n\n-- Un nouvel adhérent s'inscrit\nINSERT INTO adherents (id, prenom, ville, inscription) VALUES (7, 'Nora', 'Rennes', '2026-04-10');\n\nSELECT * FROM emprunts WHERE id = 6;\nSELECT * FROM adherents WHERE ville = 'Rennes';",
      caption: "Les modifications sont faites, puis vérifiées avec deux SELECT. La base est recréée à la prochaine exécution.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Essayez de retirer le `WHERE id = 6` de l'UPDATE dans l'exemple ci-dessus, puis affichez toute la table `emprunts` : tous les emprunts ont désormais la même date de retour. Sur une vraie base, ce serait une mauvaise journée.",
    },
  ],
  quiz: [
    {
      question: "Quelle différence entre WHERE et HAVING ?",
      options: [
        "Aucune, ce sont deux synonymes",
        "WHERE filtre les lignes avant le regroupement, HAVING filtre les groupes après",
        "HAVING ne fonctionne qu'avec ORDER BY",
        "WHERE ne s'utilise qu'avec des nombres",
      ],
      correct: 1,
      explanation: "WHERE travaille ligne par ligne, avant GROUP BY ; HAVING porte sur le résultat des groupes, par exemple COUNT(*) >= 2.",
    },
    {
      question: "Que renvoie WHERE date_retour = NULL ?",
      options: [
        "Les emprunts non rendus",
        "Une erreur de syntaxe",
        "Aucune ligne, car NULL n'est égal à rien",
        "Tous les emprunts",
      ],
      correct: 2,
      explanation: "Une comparaison avec NULL donne « inconnu », jamais « vrai ». Il faut écrire IS NULL.",
    },
    {
      question: "Sans ORDER BY, dans quel ordre arrivent les lignes ?",
      options: [
        "Dans l'ordre de la clé primaire, toujours",
        "Dans l'ordre alphabétique de la première colonne",
        "Dans un ordre qui n'est pas garanti",
        "Dans l'ordre inverse de leur insertion",
      ],
      correct: 2,
      explanation: "Le SGBD renvoie les lignes dans l'ordre qui l'arrange. Il ressemble souvent à l'ordre d'insertion, mais rien ne le garantit : si l'ordre compte, on écrit ORDER BY.",
    },
    {
      question: "Que fait UPDATE livres SET exemplaires = 0; (sans WHERE) ?",
      options: [
        "Rien, il manque une condition",
        "Il met à zéro les exemplaires du premier livre seulement",
        "Il met à zéro les exemplaires de tous les livres",
        "Il supprime la colonne exemplaires",
      ],
      correct: 2,
      explanation: "Sans WHERE, la modification s'applique à toutes les lignes. D'où le réflexe : vérifier d'abord avec un SELECT utilisant le même WHERE.",
    },
  ],
};
