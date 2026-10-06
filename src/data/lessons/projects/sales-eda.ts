import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

/** Ventes fictives d'une petite boutique culturelle, avec des défauts volontaires (prix manquants, catégories mal saisies, doublons) */
const BRUT = lines(
  "import numpy as np",
  "import pandas as pd",
  "import matplotlib.pyplot as plt",
  "",
  "rng = np.random.default_rng(7)",
  "n = 300",
  "ventes = pd.DataFrame({",
  "    'date': pd.Timestamp('2025-01-01') + pd.to_timedelta(rng.integers(0, 365, n), unit='D'),",
  "    'categorie': rng.choice(['Livres', 'Jeux', 'Papeterie', 'Musique'], n, p=[0.4, 0.25, 0.2, 0.15]),",
  "    'quantite': rng.integers(1, 6, n),",
  "    'prix_unitaire': rng.uniform(3, 40, n).round(2),",
  "})",
  "ventes.loc[rng.choice(n, 12, replace=False), 'prix_unitaire'] = np.nan",
  "ventes.loc[[5, 17, 42], 'categorie'] = ['livres', 'LIVRES ', 'Jeux ']",
  "ventes = pd.concat([ventes, ventes.iloc[[10, 20, 30]]], ignore_index=True)",
);

/** État après le nettoyage (étapes 2 et 3), repris par les étapes suivantes */
const NETTOYE = lines(
  BRUT,
  "ventes = ventes.drop_duplicates().copy()",
  "ventes['categorie'] = ventes['categorie'].str.strip().str.capitalize()",
  "ventes['prix_unitaire'] = ventes['prix_unitaire'].fillna(ventes.groupby('categorie')['prix_unitaire'].transform('median'))",
  "ventes['chiffre_affaires'] = ventes['quantite'] * ventes['prix_unitaire']",
);

export const projectSalesEda: LessonModule = {
  id: "beginner-1",
  title: "Projet guidé : analyse exploratoire des ventes",
  duration: "3 h",
  summary: "Un an de ventes (fictives) d'une petite boutique culturelle : découvrir les données, les nettoyer, calculer, montrer, conclure.",
  objectives: [
    "Mener une analyse exploratoire du début à la fin, dans le bon ordre",
    "Repérer et corriger des défauts réels : doublons, saisies incohérentes, valeurs manquantes",
    "Calculer des indicateurs par catégorie et par mois",
    "Présenter deux graphiques et une conclusion honnête",
  ],
  sections: [
    {
      kind: "text",
      md: `### Le contexte

Une petite boutique culturelle (livres, jeux, papeterie, musique) vous confie l'export de ses ventes de 2025, tiré de sa caisse. Elle se pose trois questions : **quelles catégories rapportent le plus ?**, **l'activité varie-t-elle selon les mois ?**, **les données sont-elles fiables ?**

Les données sont **fictives**, générées pour l'exercice, mais leurs défauts sont ceux que l'on rencontre vraiment : quelques prix manquants, des catégories saisies à la main sans uniformité, des lignes en double après un export. Chaque étape repart des données préparées par les étapes précédentes : vous pouvez faire les exercices dans l'ordre, ou consulter les corrigés pour avancer.`,
    },
    {
      kind: "text",
      md: "### Étape 1 : découvrir les données\n\nAvant tout calcul, on regarde : combien de lignes, quelles colonnes, quels types, combien de valeurs manquantes, et quelles valeurs prennent les colonnes de texte.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        BRUT,
        "",
        "print(ventes.shape)",
        "print(ventes.head())",
        "print(ventes.isna().sum())",
        "print(ventes['categorie'].value_counts())",
      ),
      caption: "value_counts révèle déjà le problème : « livres », « LIVRES » et « Jeux » avec une espace finale sont comptés comme des catégories à part.",
    },
    {
      kind: "text",
      md: "### Étape 2 : doublons et catégories\n\nUne ligne entièrement identique à une autre est un doublon d'export : on la retire avec `drop_duplicates()`. Pour les catégories, on retire les espaces superflues (`str.strip()`) et on uniformise la casse (`str.capitalize()`).",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Retirez les **doublons** de `ventes`, puis **uniformisez** la colonne `categorie` (espaces superflues retirées, première lettre en majuscule). Il doit rester **300 ventes** et **4 catégories**.",
      setup: BRUT,
      starter: "ventes = ventes.copy()",
      solution: lines(
        "ventes = ventes.drop_duplicates().copy()",
        "ventes['categorie'] = ventes['categorie'].str.strip().str.capitalize()",
        "print(len(ventes), sorted(ventes['categorie'].unique()))",
      ),
      test: lines(
        "assert len(ventes) == 300, f\"après suppression des 3 doublons, il doit rester 300 ventes (il y en a {len(ventes)})\"",
        "assert sorted(ventes['categorie'].unique()) == ['Jeux', 'Livres', 'Musique', 'Papeterie'], f\"on attend exactement 4 catégories (vous avez {sorted(ventes['categorie'].unique())})\"",
      ),
      hint: "ventes.drop_duplicates() ; puis ventes['categorie'].str.strip().str.capitalize().",
    },
    {
      kind: "text",
      md: `### Étape 3 : les prix manquants

Douze prix sont manquants. Trois options, à choisir en connaissance de cause :

- **supprimer** les lignes : simple, mais on perd des ventes réelles et le chiffre d'affaires sera sous-estimé ;
- **remplacer par la moyenne générale** : mauvais choix ici, un jeu et un carnet n'ont pas le même prix ;
- **remplacer par la médiane de la catégorie** : un compromis raisonnable, que l'on **signale** dans le rapport.

\`groupby(...).transform('median')\` renvoie, pour chaque ligne, la médiane de sa catégorie : parfait pour \`fillna\`.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Remplacez les **prix manquants** par la **médiane des prix de la même catégorie**, puis créez la colonne **`chiffre_affaires`** (quantité × prix unitaire). Il ne doit plus rester aucun prix manquant.",
      setup: lines(BRUT, "ventes = ventes.drop_duplicates().copy()", "ventes['categorie'] = ventes['categorie'].str.strip().str.capitalize()"),
      starter: lines("ventes = ventes.dropna()", "ventes['chiffre_affaires'] = ventes['quantite'] * ventes['prix_unitaire']"),
      solution: lines(
        "mediane_categorie = ventes.groupby('categorie')['prix_unitaire'].transform('median')",
        "ventes['prix_unitaire'] = ventes['prix_unitaire'].fillna(mediane_categorie)",
        "ventes['chiffre_affaires'] = ventes['quantite'] * ventes['prix_unitaire']",
        "print(ventes['prix_unitaire'].isna().sum(), round(ventes['chiffre_affaires'].sum(), 2))",
      ),
      test: lines(
        "assert len(ventes) == 300, \"on garde toutes les ventes : on remplace les prix manquants au lieu de supprimer les lignes\"",
        "assert ventes['prix_unitaire'].isna().sum() == 0, \"il reste des prix manquants\"",
        "assert 'chiffre_affaires' in ventes, \"créez la colonne chiffre_affaires\"",
        "assert (ventes['chiffre_affaires'] == ventes['quantite'] * ventes['prix_unitaire']).all(), \"chiffre_affaires = quantite × prix_unitaire\"",
      ),
      hint: "ventes.groupby('categorie')['prix_unitaire'].transform('median') donne la médiane de la catégorie de chaque ligne ; passez-la à fillna.",
    },
    {
      kind: "text",
      md: "### Étape 4 : calculer les indicateurs\n\nDeux questions, deux regroupements : le chiffre d'affaires **par catégorie**, et **par mois**. Pour les mois, `ventes['date'].dt.to_period('M')` donne le mois de chaque vente.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Calculez le **chiffre d'affaires total par catégorie**, trié du plus grand au plus petit, dans `ca_categorie` (une série pandas indexée par la catégorie), puis le **chiffre d'affaires par mois** dans `ca_mensuel` (12 valeurs).",
      setup: NETTOYE,
      starter: lines("ca_categorie = ventes.groupby('categorie')['quantite'].sum()", "ca_mensuel = None"),
      solution: lines(
        "ca_categorie = ventes.groupby('categorie')['chiffre_affaires'].sum().sort_values(ascending=False)",
        "ca_mensuel = ventes.groupby(ventes['date'].dt.to_period('M'))['chiffre_affaires'].sum()",
        "print(ca_categorie.round(0))",
        "print(ca_mensuel.round(0))",
      ),
      test: lines(
        "attendu = ventes.groupby('categorie')['chiffre_affaires'].sum().sort_values(ascending=False)",
        "assert list(ca_categorie.index) == list(attendu.index), f\"ordre attendu des catégories : {list(attendu.index)}\"",
        "assert (abs(ca_categorie.values - attendu.values) < 1e-6).all(), \"ca_categorie doit additionner la colonne chiffre_affaires\"",
        "assert ca_mensuel is not None and len(ca_mensuel) == 12, \"ca_mensuel doit compter 12 mois\"",
        "assert abs(ca_mensuel.sum() - ventes['chiffre_affaires'].sum()) < 1e-6, \"la somme des mois doit égaler le chiffre d'affaires total\"",
      ),
      hint: "groupby('categorie')['chiffre_affaires'].sum().sort_values(ascending=False) ; pour les mois, groupby(ventes['date'].dt.to_period('M')).",
    },
    {
      kind: "text",
      md: "### Étape 5 : montrer\n\nDeux graphiques suffisent : des **barres horizontales triées** pour comparer les catégories, et une **courbe** pour l'évolution mensuelle. Titres qui disent ce qu'il faut voir, axes nommés, unité indiquée.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        NETTOYE,
        "",
        "ca_categorie = ventes.groupby('categorie')['chiffre_affaires'].sum().sort_values()",
        "ca_mensuel = ventes.groupby(ventes['date'].dt.to_period('M'))['chiffre_affaires'].sum()",
        "",
        "fig, (gauche, droite) = plt.subplots(1, 2, figsize=(10, 3.5))",
        "gauche.barh(ca_categorie.index, ca_categorie.values)",
        "gauche.set_title('Les livres font le plus gros chiffre')",
        "gauche.set_xlabel(\"chiffre d'affaires (€, données fictives)\")",
        "droite.plot(ca_mensuel.index.astype(str), ca_mensuel.values, marker='o')",
        "droite.set_title(\"Chiffre d'affaires par mois\")",
        "droite.tick_params(axis='x', labelrotation=60)",
        "plt.tight_layout()",
        "plt.show()",
      ),
      caption: "Le titre du graphique de gauche énonce la conclusion ; celui de droite reste descriptif, car les variations mensuelles d'un jeu fictif tiré au hasard n'ont pas de sens particulier.",
    },
    {
      kind: "text",
      md: `### Étape 6 : conclure honnêtement

Un bon rapport d'analyse exploratoire tient en quelques lignes :

- **ce qu'on a trouvé** : les livres représentent la plus grande part du chiffre d'affaires ; la musique la plus petite ;
- **ce qu'on a corrigé et comment** : 3 doublons retirés, 3 catégories mal saisies uniformisées, 12 prix manquants remplacés par la médiane de leur catégorie (une hypothèse, qui sous-estime peut-être les écarts) ;
- **ce qu'on ne peut pas conclure** : ici, des variations d'un mois à l'autre sans cause connue ; une tendance réelle demanderait plusieurs années et le contexte de la boutique (soldes, fermetures, rentrée).

Pour aller plus loin : ajoutez le **panier moyen** par catégorie, ou comparez les ventes du week-end à celles de la semaine (\`dt.dayofweek\`).`,
    },
  ],
  quiz: [
    {
      question: "Par quoi commencer une analyse exploratoire ?",
      options: [
        "Par entraîner un modèle",
        "Par regarder les données : dimensions, types, valeurs manquantes, valeurs des colonnes de texte",
        "Par faire un graphique en camembert",
        "Par supprimer les colonnes inutiles au hasard",
      ],
      correct: 1,
      explanation: "Les défauts (doublons, saisies incohérentes, valeurs manquantes) se voient dès la découverte, et changent tous les calculs suivants.",
    },
    {
      question: "Pourquoi remplacer un prix manquant par la médiane de sa catégorie plutôt que par la moyenne générale ?",
      options: [
        "Parce que c'est plus rapide",
        "Parce que les prix varient beaucoup d'une catégorie à l'autre, et que la médiane résiste aux valeurs extrêmes",
        "Parce que pandas l'impose",
        "Il n'y a aucune différence",
      ],
      correct: 1,
      explanation: "Un jeu et un carnet n'ont pas le même prix : la médiane de la catégorie est une estimation bien plus plausible que la moyenne de tout le magasin.",
    },
    {
      question: "Que doit mentionner le rapport final à propos du nettoyage ?",
      options: [
        "Rien, c'est un détail technique",
        "Ce qui a été corrigé et comment, car ces choix influencent les résultats",
        "Seulement le nombre de lignes final",
        "Le code complet",
      ],
      correct: 1,
      explanation: "Remplacer des valeurs manquantes est une hypothèse. Le lecteur doit savoir combien de valeurs sont concernées et quelle règle a été appliquée.",
    },
  ],
};
