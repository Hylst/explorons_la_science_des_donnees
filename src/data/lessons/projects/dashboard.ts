import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

/**
 * Données macroéconomiques des États-Unis, 1959T1 à 2009T3 (203 trimestres), fournies avec statsmodels (domaine public :
 * FRED de la Réserve fédérale de Saint-Louis, et Bureau of Labor Statistics pour le chômage ; relevés de décembre 2009).
 * `eco` : PIB réel (milliards de dollars de 2005, rythme annuel), chômage (%), indice des prix (base 100 en 1982-1984),
 * taux à 3 mois (%), population (millions), puis croissance et inflation sur un an (%) et PIB par habitant (dollars de 2005).
 * Chiffres vérifiés le 24 octobre 2026 avec statsmodels de Pyodide 314.0.7.
 */
const BRUT = lines(
  "import numpy as np",
  "import pandas as pd",
  "import statsmodels.api as sm",
  "",
  "brut = sm.datasets.macrodata.load_pandas().data",
  "trimestres = pd.PeriodIndex.from_fields(year=brut['year'].astype(int), quarter=brut['quarter'].astype(int), freq='Q-DEC')",
  "eco = pd.DataFrame({",
  "    'pib': brut['realgdp'].values,",
  "    'chomage': brut['unemp'].values,",
  "    'prix': brut['cpi'].values,",
  "    'taux': brut['tbilrate'].values,",
  "    'population': brut['pop'].values,",
  "}, index=trimestres)",
);

const ECO = lines(
  BRUT,
  "eco['croissance'] = eco['pib'].pct_change(4) * 100",
  "eco['inflation'] = eco['prix'].pct_change(4) * 100",
  "eco['pib_hab'] = eco['pib'] / eco['population'] * 1000",
);

export const projectDashboard: LessonModule = {
  id: "beginner-3",
  title: "Projet guidé : un tableau de bord d'indicateurs",
  duration: "3 h",
  summary: "Cinquante ans de données économiques réelles des États-Unis : choisir les indicateurs, les calculer avec pandas, les présenter dans un tableau de bord Matplotlib lisible, filtrable par période, puis voir comment Streamlit le rend interactif.",
  objectives: [
    "Préparer une série trimestrielle avec pandas (PeriodIndex, variations sur un an)",
    "Choisir et calculer des indicateurs clés, avec leur unité et leur période",
    "Composer un tableau de bord de petits graphiques cohérents avec Matplotlib",
    "Écrire une fonction qui recalcule le tableau de bord pour une période choisie, comme le ferait un filtre interactif",
  ],
  sections: [
    {
      kind: "text",
      md: `### Le contexte

Un **tableau de bord** réunit sur une page quelques indicateurs choisis, pour qu'on puisse suivre une situation d'un coup d'œil. Le difficile n'est pas de tracer des courbes, c'est de **choisir** : quels indicateurs, avec quelle unité, sur quelle période, et comment éviter qu'un graphique trompe.

Ce projet utilise des données **réelles** fournies avec la bibliothèque statsmodels (rien n'est téléchargé) : 203 trimestres de l'économie des États-Unis, de début 1959 à l'été 2009. Elles viennent de la Réserve fédérale de Saint-Louis (base FRED) et du Bureau of Labor Statistics pour le chômage, et sont du domaine public. On n'y garde que cinq colonnes :

- le **PIB réel**, en milliards de dollars de 2005 (l'effet des prix est retiré), exprimé en rythme annuel ;
- le **taux de chômage**, en pourcentage de la population active ;
- l'**indice des prix** à la consommation (base 100 en 1982-1984) ;
- le **taux d'intérêt** des bons du Trésor à 3 mois, en pourcentage ;
- la **population**, en millions d'habitants.

L'idée vient d'un sujet de la page Projets, un tableau de bord fait avec Streamlit. Streamlit ne tourne pas dans ce site : on construit ici le tableau de bord avec pandas et Matplotlib, et la dernière étape montre le code Streamlit équivalent, à lancer sur votre machine.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        BRUT,
        "",
        "print(eco.head(3))",
        "print('...')",
        "print(eco.tail(2))",
        "print('trimestres :', len(eco), ' de', eco.index[0], 'à', eco.index[-1])",
        "print('valeurs manquantes :', int(eco.isna().sum().sum()))",
      ),
      caption: "Un PeriodIndex trimestriel (1959Q1 à 2009Q3) : chaque ligne est un trimestre, pas une date précise. Aucune valeur ne manque. Le PIB passe de 2 710 à 12 990 milliards de dollars de 2005, la population de 177 à 308 millions d'habitants.",
    },
    {
      kind: "text",
      md: `### Étape 1 : des niveaux aux variations

Un niveau brut (12 990 milliards) parle peu. Les tableaux de bord économiques montrent surtout des **variations** :

- la **croissance** : variation du PIB réel par rapport au **même trimestre de l'année précédente**, en %. Comparer à un an d'écart neutralise les effets de saison qui resteraient ; avec des trimestres, c'est un décalage de 4 lignes : \`pct_change(4)\` ;
- l'**inflation** : même calcul sur l'indice des prix ;
- le **PIB par habitant**, qui tient compte de la croissance de la population.

Les quatre premiers trimestres n'ont pas d'année précédente : leur croissance est vide (\`NaN\`).`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Ajoutez à `eco` trois colonnes : `croissance` (variation du PIB sur un an, en %), `inflation` (variation de `prix` sur un an, en %) et `pib_hab` (PIB par habitant en dollars : le PIB est en milliards et la population en millions, donc `pib / population * 1000`).",
      setup: BRUT,
      starter: lines(
        "eco['croissance'] = eco['pib'].pct_change() * 100",
        "eco['inflation'] = eco['prix'].pct_change() * 100",
        "eco['pib_hab'] = eco['pib'] / eco['population']",
      ),
      solution: lines(
        "eco['croissance'] = eco['pib'].pct_change(4) * 100",
        "eco['inflation'] = eco['prix'].pct_change(4) * 100",
        "eco['pib_hab'] = eco['pib'] / eco['population'] * 1000",
        "print(eco[['croissance', 'inflation', 'pib_hab']].tail(3).round(1))",
      ),
      test: lines(
        "assert eco['croissance'].isna().sum() == 4, \"la croissance compare au même trimestre un an plus tôt : pct_change(4), les 4 premiers trimestres restent vides\"",
        "assert abs(eco['croissance'].iloc[-1] - (eco['pib'].iloc[-1] / eco['pib'].iloc[-5] - 1) * 100) < 1e-9, \"croissance = (PIB / PIB d'il y a 4 trimestres - 1) × 100\"",
        "assert abs(eco['inflation'].iloc[-1] - (eco['prix'].iloc[-1] / eco['prix'].iloc[-5] - 1) * 100) < 1e-9, \"inflation : même calcul sur la colonne prix\"",
        "assert abs(eco['pib_hab'].iloc[0] - 15300.1) < 0.1, \"pib_hab en dollars : pib (milliards) / population (millions) × 1000, soit environ 15 300 dollars en 1959\"",
      ),
      hint: "pct_change(4) compare chaque ligne à celle située 4 lignes plus haut.",
    },
    {
      kind: "text",
      md: `### Étape 2 : les indicateurs clés

En tête d'un tableau de bord, on place quelques **indicateurs clés** : un nombre, son unité, sa période. Sur toute la période :

- le chômage culmine à **10,7 %** fin 1982 et descend au plus bas à **3,4 %** fin 1968 ;
- l'inflation sur un an atteint **14,6 %** début 1980 ;
- la croissance va de **−3,8 %** au deuxième trimestre 2009 (la crise financière) à **+8,5 %** fin 1965 ; 21 trimestres ont une croissance négative ;
- le PIB réel est multiplié par **4,79** en cinquante ans, mais le PIB par habitant seulement par **2,76** (de 15 300 à 42 175 dollars de 2005) : une partie de la croissance vient de la population.

Ce dernier point illustre le premier piège d'un tableau de bord : le choix de l'indicateur oriente la lecture. Les deux nombres sont vrais ; ils ne disent pas la même chose.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez une fonction `indicateurs(df, debut, fin)` qui renvoie un dictionnaire pour la période allant de `debut` à `fin` (des années, en texte, bornes comprises) avec les clés `'chomage_moyen'`, `'chomage_max'`, `'croissance_moyenne'` et `'inflation_moyenne'`. Calculez-la pour les années 1980 (`'1980'` à `'1989'`) et rangez le résultat dans `annees_80`.",
      setup: ECO,
      starter: lines(
        "def indicateurs(df, debut, fin):",
        "    return {}",
        "",
        "annees_80 = indicateurs(eco, '1980', '1989')",
      ),
      solution: lines(
        "def indicateurs(df, debut, fin):",
        "    p = df.loc[debut:fin]",
        "    return {",
        "        'chomage_moyen': p['chomage'].mean(),",
        "        'chomage_max': p['chomage'].max(),",
        "        'croissance_moyenne': p['croissance'].mean(),",
        "        'inflation_moyenne': p['inflation'].mean(),",
        "    }",
        "",
        "annees_80 = indicateurs(eco, '1980', '1989')",
        "print({k: round(v, 2) for k, v in annees_80.items()})",
      ),
      test: lines(
        "_cles = {'chomage_moyen', 'chomage_max', 'croissance_moyenne', 'inflation_moyenne'}",
        "assert set(annees_80) == _cles, f\"le dictionnaire doit avoir exactement les clés {sorted(_cles)}\"",
        "_p = eco.loc['1980':'1989']",
        "assert len(_p) == 40, \"la période 1980-1989 compte 40 trimestres\"",
        "assert abs(annees_80['chomage_moyen'] - _p['chomage'].mean()) < 1e-9, \"chomage_moyen : moyenne du chômage sur les 40 trimestres (eco.loc['1980':'1989'])\"",
        "assert annees_80['chomage_max'] == 10.7, \"chomage_max des années 1980 : 10,7 %, fin 1982\"",
        "assert abs(annees_80['inflation_moyenne'] - _p['inflation'].mean()) < 1e-9, \"inflation_moyenne : moyenne de la colonne inflation sur la période\"",
        "_d = indicateurs(eco, '2000', '2009')",
        "assert abs(_d['croissance_moyenne'] - eco.loc['2000':'2009', 'croissance'].mean()) < 1e-9, \"la fonction doit marcher pour n'importe quelle période, par exemple '2000' à '2009'\"",
      ),
      hint: "Avec un PeriodIndex, df.loc['1980':'1989'] garde tous les trimestres de 1980 à 1989 inclus.",
    },
    {
      kind: "note",
      tone: "info",
      md: "Par décennie, les moyennes changent beaucoup : années 1970, chômage 6,2 % et inflation 7,2 % ; années 1980, 7,3 % et 5,4 % ; années 1990, 5,8 % et 3,0 % ; de 2000 à l'été 2009, 5,4 % et 2,6 %, avec une croissance moyenne tombée à 2,0 %. La dernière « décennie » ne compte que 39 trimestres : un indicateur se lit toujours avec sa période.",
    },
    {
      kind: "text",
      md: `### Étape 3 : composer le tableau de bord

Quelques règles simples rendent un tableau de bord lisible :

- **peu d'indicateurs**, chacun dans son propre petit graphique, alignés sur le même axe du temps (\`sharex=True\`) : l'œil compare les dates d'un graphique à l'autre ;
- un **titre qui dit ce qu'on voit** et l'**unité** sur chaque axe ;
- une **ligne de référence** quand elle aide la lecture (zéro pour la croissance : au-dessous, l'économie recule) ;
- pas de double axe vertical : deux échelles sur un même graphique permettent de faire dire n'importe quoi à deux courbes ;
- la **source** en bas de page.`,
    },
    {
      kind: "code",
      language: "python",
      setup: ECO,
      code: lines(
        "import matplotlib.pyplot as plt",
        "",
        "def tableau_de_bord(df, debut, fin):",
        "    p = df.loc[debut:fin]",
        "    x = p.index.to_timestamp()",
        "    fig, axes = plt.subplots(2, 2, figsize=(10, 6), sharex=True)",
        "    axes[0, 0].plot(x, p['croissance'], color='tab:blue')",
        "    axes[0, 0].axhline(0, color='gray', linewidth=0.8)",
        "    axes[0, 0].set_title('Croissance du PIB réel sur un an (%)')",
        "    axes[0, 1].plot(x, p['chomage'], color='tab:red')",
        "    axes[0, 1].set_title('Taux de chômage (%)')",
        "    axes[1, 0].plot(x, p['inflation'], color='tab:orange')",
        "    axes[1, 0].axhline(0, color='gray', linewidth=0.8)",
        "    axes[1, 0].set_title('Inflation sur un an (%)')",
        "    axes[1, 1].plot(x, p['taux'], color='tab:green')",
        "    axes[1, 1].set_title('Taux à 3 mois (%)')",
        "    for ax in axes.flat:",
        "        ax.grid(alpha=0.3)",
        "    fig.suptitle(f'États-Unis, {p.index[0]} à {p.index[-1]}')",
        "    fig.text(0.01, 0.01, 'Source : FRED et BLS, via statsmodels (macrodata)', fontsize=8, color='gray')",
        "    fig.tight_layout(rect=(0, 0.03, 1, 1))",
        "    return fig",
        "",
        "tableau_de_bord(eco, '1959', '2009')",
      ),
      caption: "Quatre petits graphiques sur le même axe du temps. On y lit les grands épisodes : l'inflation et les taux d'intérêt très élevés autour de 1980, le pic de chômage de fin 1982 qui suit, la récession de 2008-2009 en bas à gauche. Appeler tableau_de_bord(eco, '2000', '2009') redessine la même page sur une autre période.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Trouvez le trimestre de **chômage maximal** sur toute la période et rangez-le dans `pic` (un élément de l'index, par exemple `pd.Period('1982Q4')`). Puis rangez dans `inflation_un_an_avant` l'inflation sur un an **quatre trimestres avant** ce pic.",
      setup: ECO,
      starter: lines("pic = eco['chomage'].max()", "inflation_un_an_avant = None"),
      solution: lines(
        "pic = eco['chomage'].idxmax()",
        "inflation_un_an_avant = eco.loc[pic - 4, 'inflation']",
        "print(pic, eco.loc[pic, 'chomage'], ' inflation un an avant :', round(inflation_un_an_avant, 2))",
      ),
      test: lines(
        "assert isinstance(pic, pd.Period), \"pic doit être un trimestre de l'index (idxmax), pas la valeur du chômage (max)\"",
        "assert pic == pd.Period('1982Q4'), \"le chômage culmine au quatrième trimestre 1982\"",
        "assert inflation_un_an_avant is not None and abs(inflation_un_an_avant - eco.loc[pd.Period('1981Q4'), 'inflation']) < 1e-9, \"un Period se décale par soustraction : pic - 4 est le même trimestre un an plus tôt (1981Q4)\"",
      ),
      hint: "idxmax() renvoie l'étiquette de la ligne du maximum ; avec des Period, pic - 4 recule de quatre trimestres.",
    },
    {
      kind: "text",
      md: lines(
        "### Étape 4 : le rendre interactif avec Streamlit",
        "",
        "Notre fonction `tableau_de_bord(df, debut, fin)` fait déjà le travail d'un filtre : il ne manque qu'un curseur pour choisir la période. C'est ce qu'apporte **Streamlit**, qui transforme un script Python en page web. Ce code ne tourne pas dans le moteur du site ; sur votre machine, après `pip install streamlit statsmodels matplotlib`, enregistrez-le dans `app.py` et lancez `streamlit run app.py` :",
        "",
        "```python",
        "import streamlit as st",
        "import pandas as pd",
        "import statsmodels.api as sm",
        "",
        "@st.cache_data                     # les données ne sont chargées qu'une fois",
        "def charger():",
        "    brut = sm.datasets.macrodata.load_pandas().data",
        "    index = pd.PeriodIndex.from_fields(year=brut['year'].astype(int), quarter=brut['quarter'].astype(int), freq='Q-DEC')",
        "    eco = pd.DataFrame({'pib': brut['realgdp'].values, 'chomage': brut['unemp'].values,",
        "                        'prix': brut['cpi'].values, 'taux': brut['tbilrate'].values}, index=index)",
        "    eco['croissance'] = eco['pib'].pct_change(4) * 100",
        "    eco['inflation'] = eco['prix'].pct_change(4) * 100",
        "    return eco",
        "",
        "eco = charger()",
        "st.title('Économie des États-Unis, 1959-2009')",
        "debut, fin = st.slider('Période', 1959, 2009, (1990, 2009))",
        "p = eco.loc[str(debut):str(fin)]",
        "",
        "col1, col2, col3 = st.columns(3)",
        "col1.metric('Chômage moyen', f\"{p['chomage'].mean():.1f} %\")",
        "col2.metric('Croissance moyenne', f\"{p['croissance'].mean():.1f} %\")",
        "col3.metric('Inflation moyenne', f\"{p['inflation'].mean():.1f} %\")",
        "st.line_chart(p[['croissance', 'chomage', 'inflation']].set_axis(p.index.to_timestamp()))",
        "st.caption('Source : FRED et BLS, via statsmodels (macrodata)')",
        "```",
        "",
        "Chaque mouvement du curseur relance le script de haut en bas avec les nouvelles valeurs : c'est le modèle de Streamlit, simple à écrire, qu'il faut garder léger (d'où `st.cache_data` pour ne pas recharger les données). Pour le partager, il faut un serveur qui exécute Python ; une page statique comme ce site n'y suffit pas.",
      ),
    },
    {
      kind: "note",
      tone: "tip",
      md: "Pour aller plus loin : ajouter le PIB par habitant à côté du PIB, montrer la valeur du dernier trimestre et sa variation dans chaque indicateur clé, ou permettre de choisir les indicateurs affichés. Gardez la règle de départ : chaque ajout doit aider à lire, pas seulement remplir la page.",
    },
  ],
  quiz: [
    {
      question: "Pourquoi calculer la croissance par rapport au même trimestre de l'année précédente (pct_change(4)) ?",
      options: [
        "Parce que pct_change ne marche qu'avec 4",
        "Pour comparer des trimestres de même saison et lisser les effets saisonniers restants",
        "Pour avoir quatre fois plus de valeurs",
        "Parce que le PIB n'est publié qu'une fois par an",
      ],
      correct: 1,
      explanation: "Comparer un trimestre au même trimestre un an plus tôt neutralise ce qui revient chaque année à la même saison. Les quatre premiers trimestres n'ont pas de point de comparaison.",
    },
    {
      question: "Le PIB réel est multiplié par 4,79 entre 1959 et 2009, le PIB par habitant par 2,76. Que montre l'écart ?",
      options: [
        "Une erreur dans les données",
        "Qu'une partie de la croissance du PIB vient de la croissance de la population",
        "Que l'inflation a été retirée deux fois",
        "Que le PIB par habitant est toujours plus petit",
      ],
      correct: 1,
      explanation: "La population passe de 177 à 308 millions. Les deux indicateurs sont justes, mais ils racontent des histoires différentes : le choix de l'indicateur oriente la lecture.",
    },
    {
      question: "Pourquoi éviter un graphique à double axe vertical dans un tableau de bord ?",
      options: [
        "Matplotlib ne sait pas le faire",
        "Parce que le choix des deux échelles permet de faire croiser ou coller deux courbes à volonté, et suggère des liens qui n'existent pas",
        "Parce que c'est plus lent à afficher",
        "Parce qu'il faut toujours une seule couleur",
      ],
      correct: 1,
      explanation: "Avec deux échelles libres, on peut aligner n'importe quelles courbes. De petits graphiques séparés, sur le même axe du temps, permettent la comparaison sans ce piège.",
    },
    {
      question: "Que se passe-t-il quand on bouge un curseur dans une application Streamlit ?",
      options: [
        "Seul le graphique concerné est recalculé, comme dans un tableur",
        "Le script est réexécuté de haut en bas avec la nouvelle valeur",
        "La page est envoyée par e-mail",
        "Rien tant qu'on n'a pas cliqué sur Enregistrer",
      ],
      correct: 1,
      explanation: "Streamlit relance tout le script à chaque interaction ; st.cache_data évite de recharger les données à chaque fois.",
    },
  ],
};
