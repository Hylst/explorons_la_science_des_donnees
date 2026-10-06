import type { LessonModule } from "@/lib/lessons/types";
import { BIBLIOTHEQUE_SETUP } from "../datasets/bibliotheque";

export const modulePerformance: LessonModule = {
  id: "performance",
  title: "Performance et indexation",
  duration: "2 h 30",
  summary: "Ce qu'est un index, comment lire le plan d'une requête, et comment les transactions protègent les données.",
  objectives: [
    "Expliquer ce qu'est un index, ce qu'il accélère et ce qu'il coûte",
    "Lire le plan d'exécution d'une requête avec EXPLAIN QUERY PLAN",
    "Écrire des conditions qui permettent d'utiliser un index",
    "Utiliser une transaction (BEGIN, COMMIT, ROLLBACK) et expliquer ACID",
  ],
  sections: [
    {
      kind: "text",
      md: `### L'index, comme à la fin d'un livre

Pour trouver tous les passages qui parlent de « baleine » dans un gros livre, on peut lire toutes les pages (c'est un **parcours complet**), ou ouvrir l'index à la fin, qui renvoie directement aux bonnes pages.

Un **index** de base de données joue le même rôle : c'est une structure **triée** (le plus souvent un arbre B) sur une ou plusieurs colonnes, qui permet de retrouver les lignes voulues sans lire toute la table. La clé primaire est toujours indexée ; pour les autres colonnes, on crée l'index soi-même :

\`\`\`
CREATE INDEX idx_emprunts_adherent ON emprunts(adherent_id);
\`\`\`

Sur nos quatorze emprunts, la différence est invisible. Sur des millions de lignes, elle sépare une réponse immédiate d'une requête qui prend du temps.`,
    },
    {
      kind: "text",
      md: `### Lire le plan d'une requête

Comme SQL est déclaratif, c'est le SGBD qui décide comment exécuter une requête. \`EXPLAIN QUERY PLAN\` (dans SQLite ; \`EXPLAIN\` dans PostgreSQL et MySQL) montre ce plan sans exécuter la requête. Dans la colonne \`detail\` :

- \`SCAN emprunts\` : la table est lue en entier ;
- \`SEARCH emprunts USING INDEX ...\` : l'index est utilisé pour aller directement aux bonnes lignes.`,
    },
    {
      kind: "code",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      code: "EXPLAIN QUERY PLAN\nSELECT * FROM emprunts WHERE adherent_id = 3;\n\nCREATE INDEX idx_emprunts_adherent ON emprunts(adherent_id);\n\nEXPLAIN QUERY PLAN\nSELECT * FROM emprunts WHERE adherent_id = 3;",
      caption: "Le même SELECT, avant puis après la création de l'index : SCAN devient SEARCH.",
    },
    {
      kind: "exercise",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      prompt: "Les bibliothécaires cherchent souvent les emprunts d'un livre précis. Créez un index nommé exactement `idx_emprunts_livre` sur la colonne `livre_id` de `emprunts`, puis vérifiez le plan : la colonne `detail` doit indiquer que l'index est utilisé.",
      starter: "-- Créez l'index ici\n\nEXPLAIN QUERY PLAN\nSELECT * FROM emprunts WHERE livre_id = 6;",
      solution: "CREATE INDEX idx_emprunts_livre ON emprunts(livre_id);\n\nEXPLAIN QUERY PLAN\nSELECT * FROM emprunts WHERE livre_id = 6;",
      columns: ["detail"],
      hint: "CREATE INDEX nom ON table(colonne); avant le EXPLAIN QUERY PLAN.",
    },
    {
      kind: "text",
      md: `### Ce que coûte un index

Un index n'est pas gratuit :

- il occupe de la **place** (c'est une copie triée de la colonne, avec un renvoi vers chaque ligne) ;
- il **ralentit les écritures** : chaque INSERT, UPDATE ou DELETE doit aussi mettre l'index à jour ;
- il ne sert à rien sur une petite table, ni sur une colonne qui n'a que deux ou trois valeurs différentes.

On indexe donc les colonnes souvent utilisées dans \`WHERE\`, dans les jointures (\`ON\`) et dans \`ORDER BY\`, sur des tables qui grossissent, et on vérifie avec le plan.

Un **index composé** porte sur plusieurs colonnes, et **l'ordre compte** : un index sur \`(adherent_id, date_emprunt)\` sert pour « les emprunts de l'adhérent 3 » et pour « les emprunts de l'adhérent 3 en mars », mais pas pour « tous les emprunts de mars », comme un annuaire trié par nom puis prénom n'aide pas à chercher un prénom seul.`,
    },
    {
      kind: "text",
      md: `### Les conditions qui empêchent l'index

Un index sur \`date_emprunt\` est trié sur la valeur brute de la colonne. Si la condition applique d'abord une fonction à la colonne, par exemple \`strftime('%m', date_emprunt) = '03'\`, le SGBD doit calculer cette fonction pour chaque ligne : il ne peut plus se servir de l'ordre de l'index.

La parade : exprimer la condition **sur la colonne elle-même**, par exemple avec un intervalle \`date_emprunt >= '2026-03-01' AND date_emprunt < '2026-04-01'\`.`,
    },
    {
      kind: "code",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      code: "CREATE INDEX idx_emprunts_date ON emprunts(date_emprunt);\n\n-- Fonction appliquée à la colonne : parcours complet\nEXPLAIN QUERY PLAN\nSELECT * FROM emprunts WHERE strftime('%Y-%m', date_emprunt) = '2026-03';\n\n-- Condition sur la colonne : l'index est utilisé\nEXPLAIN QUERY PLAN\nSELECT * FROM emprunts WHERE date_emprunt >= '2026-03-01' AND date_emprunt < '2026-04-01';",
      caption: "Les deux requêtes renvoient les mêmes emprunts de mars 2026, mais seule la seconde profite de l'index.",
    },
    {
      kind: "exercise",
      language: "sql",
      setup: `${BIBLIOTHEQUE_SETUP}\nCREATE INDEX idx_emprunts_date ON emprunts(date_emprunt);`,
      prompt: "Un index `idx_emprunts_date` existe déjà sur `date_emprunt`. Réécrivez la condition de la requête (les emprunts de **février 2026**) pour que le plan utilise cet index au lieu de parcourir toute la table.",
      starter: "EXPLAIN QUERY PLAN\nSELECT * FROM emprunts WHERE strftime('%Y-%m', date_emprunt) = '2026-02';",
      solution: "EXPLAIN QUERY PLAN\nSELECT * FROM emprunts WHERE date_emprunt >= '2026-02-01' AND date_emprunt < '2026-03-01';",
      columns: ["detail"],
      hint: "Un intervalle sur la colonne elle-même : à partir du 1er février inclus, jusqu'au 1er mars exclu.",
    },
    {
      kind: "text",
      md: `### Les transactions

Un retour de livre modifie deux choses : la date de retour de l'emprunt, et le stock disponible. Si le programme s'arrête entre les deux, la base devient incohérente. Une **transaction** regroupe plusieurs instructions en un tout :

- \`BEGIN;\` ouvre la transaction ;
- \`COMMIT;\` valide tout ;
- \`ROLLBACK;\` annule tout, comme si rien ne s'était passé.

Les bases relationnelles garantissent quatre propriétés, résumées par **ACID** : **atomicité** (tout ou rien), **cohérence** (les contraintes déclarées restent respectées), **isolation** (les transactions simultanées ne se gênent pas, à un niveau réglable selon le SGBD) et **durabilité** (une fois validé, c'est enregistré, même en cas de panne).`,
    },
    {
      kind: "code",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      code: "BEGIN;\nUPDATE emprunts SET date_retour = '2026-04-10' WHERE id = 11;\nUPDATE livres SET exemplaires = exemplaires + 1 WHERE id = 6;\nCOMMIT;\n\nSELECT e.id, e.date_retour, l.titre, l.exemplaires\nFROM emprunts AS e JOIN livres AS l ON l.id = e.livre_id\nWHERE e.id = 11;",
      caption: "Les deux modifications sont validées ensemble par COMMIT. Remplacez COMMIT par ROLLBACK : aucune des deux ne reste.",
    },
    {
      kind: "exercise",
      language: "sql",
      setup: BIBLIOTHEQUE_SETUP,
      prompt: "On s'aperçoit en cours de route que l'opération est une erreur : **annulez** la transaction au lieu de la valider. Le SELECT final doit montrer les exemplaires d'origine de *L'Étranger*.",
      starter: "BEGIN;\nUPDATE livres SET exemplaires = exemplaires - 1 WHERE id = 6;\nCOMMIT;\n\nSELECT titre, exemplaires FROM livres WHERE id = 6;",
      solution: "BEGIN;\nUPDATE livres SET exemplaires = exemplaires - 1 WHERE id = 6;\nROLLBACK;\n\nSELECT titre, exemplaires FROM livres WHERE id = 6;",
    },
    {
      kind: "text",
      md: `### Le piège des requêtes en boucle (N+1)

Un programme affiche les adhérents, puis, **pour chacun**, envoie une requête pour récupérer ses emprunts : une requête pour la liste, plus une par adhérent. Avec six adhérents, c'est sept requêtes ; avec dix mille, c'est dix mille et une, et chaque aller-retour vers la base coûte du temps.

C'est le problème dit **N+1**, fréquent avec les outils qui transforment les tables en objets (les ORM). La solution est presque toujours de laisser la base faire le travail en une seule requête, avec une jointure ou un regroupement, comme dans les modules 2 et 4.`,
    },
  ],
  quiz: [
    {
      question: "Que signifie SCAN dans le plan d'une requête SQLite ?",
      options: [
        "Que l'index est utilisé",
        "Que la table est lue en entier",
        "Que la requête contient une erreur",
        "Que le résultat est mis en cache",
      ],
      correct: 1,
      explanation: "SCAN indique un parcours complet de la table. SEARCH ... USING INDEX indique que l'index sert à aller directement aux bonnes lignes.",
    },
    {
      question: "Quel est l'inconvénient principal d'un index ?",
      options: [
        "Il rend les SELECT plus lents",
        "Il empêche les jointures",
        "Il occupe de la place et ralentit les écritures",
        "Il supprime les doublons de la colonne",
      ],
      correct: 2,
      explanation: "Chaque insertion, modification ou suppression doit aussi mettre l'index à jour, et l'index occupe de la place. On n'indexe donc que ce qui sert.",
    },
    {
      question: "Pourquoi WHERE strftime('%m', date_emprunt) = '03' n'utilise-t-il pas l'index sur date_emprunt ?",
      options: [
        "Parce que la fonction est appliquée à la colonne : il faut la calculer pour chaque ligne",
        "Parce que les index ne fonctionnent pas sur les dates",
        "Parce que strftime n'existe pas dans SQLite",
        "Parce qu'il faut écrire le mois sans zéro",
      ],
      correct: 0,
      explanation: "L'index est trié sur la valeur brute. Une fonction appliquée à la colonne oblige à tout recalculer ; une condition sur la colonne elle-même (un intervalle de dates) permet d'utiliser l'ordre de l'index.",
    },
    {
      question: "Que garantit l'atomicité, le A de ACID ?",
      options: [
        "Que les données sont chiffrées",
        "Qu'une transaction s'applique entièrement ou pas du tout",
        "Que deux transactions ne peuvent jamais s'exécuter en même temps",
        "Que la base répond en moins d'une seconde",
      ],
      correct: 1,
      explanation: "Avec l'atomicité, une transaction ne laisse jamais la base à moitié modifiée : soit tout est validé (COMMIT), soit tout est annulé (ROLLBACK ou panne).",
    },
  ],
};
