import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { CORPUS } from "../projects/sentiment-analysis";

const IMPORTS = lines(
  "from sklearn.feature_extraction.text import CountVectorizer",
  "from sklearn.naive_bayes import MultinomialNB",
  "from sklearn.pipeline import make_pipeline",
  "from sklearn.model_selection import cross_val_score",
);

const NEGATION = lines(
  "import re",
  "",
  "NEGATIONS = {'ne', 'n', 'pas', 'jamais', 'sans'}",
  "",
  "def marquer_negation(texte):",
  "    mots = re.findall(r'\\w+', texte.lower())",
  "    sortie = []",
  "    for i, mot in enumerate(mots):",
  "        if i > 0 and mots[i - 1] in NEGATIONS and mot not in NEGATIONS:",
  "            sortie.append('non_' + mot)",
  "        else:",
  "            sortie.append(mot)",
  "    return ' '.join(sortie)",
);

export const moduleSentiment: LessonModule = {
  id: "sentiment-analysis",
  title: "Analyse de sentiment",
  duration: "2 h 30",
  summary: "Un classifieur bayésien naïf sur des avis courts, les bigrammes et le marquage de la négation, et une évaluation qui ne se raconte pas d'histoires.",
  objectives: [
    "Expliquer le principe du classifieur bayésien naïf sur des comptages de mots",
    "Entraîner et évaluer un classifieur de sentiment en validation croisée",
    "Traiter la négation avec des bigrammes ou un marquage explicite",
    "Interpréter prudemment un score obtenu sur un petit corpus",
  ],
  sections: [
    {
      kind: "text",
      md: `### Trois familles de méthodes

Classer un avis en positif ou négatif peut se faire :

- avec un **lexique** : des listes de mots positifs et négatifs, que l'on compte (le projet guidé sur les avis commence ainsi) ;
- avec un **modèle appris** sur des avis étiquetés, à partir d'un sac de mots : c'est l'objet de ce module ;
- avec un **modèle pré-entraîné** sur d'énormes quantités de texte, puis ajusté à la tâche : c'est l'approche actuelle la plus performante, abordée au module 6.

Ce module reprend les **40 avis fictifs** du projet guidé (20 positifs, 20 négatifs) avec un autre modèle, le **bayésien naïf**.`,
    },
    {
      kind: "text",
      md: `### Le bayésien naïf

Le classifieur **bayésien naïf multinomial** estime, pour chaque classe, la probabilité de voir chaque mot : « décevant » est fréquent dans les avis négatifs, « chaleureux » dans les positifs. Pour un nouvel avis, il combine les probabilités de ses mots avec la règle de Bayes et choisit la classe la plus probable.

Il est dit **naïf** parce qu'il suppose les mots indépendants les uns des autres, ce qui est faux (« pas » et « bon » ne sont pas indépendants !). Malgré cela, il marche souvent bien sur les textes, s'entraîne instantanément et sert de référence classique. Un **lissage** (paramètre \`alpha\`, 1 par défaut) évite qu'un mot jamais vu dans une classe ne rende sa probabilité nulle.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        CORPUS,
        IMPORTS,
        "",
        "for ngrammes in [(1, 1), (1, 2)]:",
        "    modele = make_pipeline(CountVectorizer(ngram_range=ngrammes), MultinomialNB())",
        "    scores = cross_val_score(modele, textes, etiquettes, cv=5)",
        "    print('n-grammes', ngrammes, ': moyenne', round(scores.mean(), 3), ', plis', scores.round(2))",
      ),
      caption: "Moyennes de 0,70 (mots seuls) et 0,75 (avec les paires de mots), mais des plis qui vont de 0,5 à 1 : chaque pli ne contient que 8 avis. Sur 40 avis, l'écart entre les deux réglages (2 avis) ne prouve pas grand-chose.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Construisez un pipeline `modele` qui enchaîne un **`CountVectorizer` avec les mots et les paires de mots** (`ngram_range=(1, 2)`) et un **`MultinomialNB`**, puis entraînez-le sur tous les avis (`textes`, `etiquettes`).",
      setup: lines(CORPUS, IMPORTS),
      starter: "modele = make_pipeline(CountVectorizer(), MultinomialNB()).fit(textes, etiquettes)",
      solution: lines(
        "modele = make_pipeline(CountVectorizer(ngram_range=(1, 2)), MultinomialNB()).fit(textes, etiquettes)",
        "nouveaux = ['Je ne reviendrai pas', 'Le café n est pas bon']",
        "print(list(zip(nouveaux, modele.predict(nouveaux).tolist())))",
      ),
      test: lines(
        "assert [type(e).__name__ for _, e in modele.steps] == ['CountVectorizer', 'MultinomialNB'], \"étapes attendues : CountVectorizer puis MultinomialNB\"",
        "assert modele.steps[0][1].ngram_range == (1, 2), f\"le vectoriseur doit compter les mots et les paires de mots : ngram_range=(1, 2) (vous avez {modele.steps[0][1].ngram_range})\"",
        "assert hasattr(modele.steps[1][1], 'classes_'), \"le pipeline doit être entraîné avec .fit(textes, etiquettes)\"",
      ),
      hint: "make_pipeline(CountVectorizer(ngram_range=(1, 2)), MultinomialNB()).fit(textes, etiquettes).",
    },
    {
      kind: "text",
      md: `### Marquer la négation

Les paires de mots aident, mais seulement pour les paires vues à l'entraînement. Une astuce ancienne et simple : **marquer** le mot qui suit une négation. « pas bon » devient « pas non_bon », et « non_bon » est un mot distinct de « bon », que le modèle peut apprendre à associer aux avis négatifs. Les corpus du cours n'ont pas d'apostrophes (« n est »), d'où le « n » dans la liste des négations.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `marquer_negation(texte)` : découpez le texte en mots minuscules (`re.findall(r'\\w+', ...)`), puis préfixez par `non_` chaque mot **qui suit immédiatement** un mot de `NEGATIONS`, sauf s'il est lui-même une négation. Renvoyez les mots joints par des espaces. Par exemple, `'Pas bon du tout'` donne `'pas non_bon du tout'`.",
      setup: "NEGATIONS = {'ne', 'n', 'pas', 'jamais', 'sans'}",
      starter: lines("import re", "", "def marquer_negation(texte):", "    return ' '.join(re.findall(r'\\w+', texte.lower()))"),
      solution: lines(
        NEGATION.replace("NEGATIONS = {'ne', 'n', 'pas', 'jamais', 'sans'}\n\n", ""),
        "",
        "print(marquer_negation('Pas bon du tout'))",
        "print(marquer_negation('Le café n est pas bon'))",
      ),
      test: lines(
        "assert marquer_negation('Pas bon du tout') == 'pas non_bon du tout', f\"on attend 'pas non_bon du tout' (vous avez '{marquer_negation('Pas bon du tout')}')\"",
        "assert marquer_negation('Le café n est pas bon') == 'le café n non_est pas non_bon', f\"on attend 'le café n non_est pas non_bon' (vous avez '{marquer_negation('Le café n est pas bon')}')\"",
        "assert marquer_negation('Ne pas déranger') == 'ne pas non_déranger', \"une négation qui suit une négation ne doit pas être préfixée : 'ne pas non_déranger'\"",
      ),
      hint: "Parcourez les mots avec enumerate ; si i > 0 et que mots[i - 1] est dans NEGATIONS (et que le mot n'y est pas), ajoutez 'non_' + mot.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        CORPUS,
        IMPORTS,
        NEGATION,
        "",
        "nouveaux = ['Pas bon du tout', 'Le café n est pas bon', 'Génial, encore fermé']",
        "simple = make_pipeline(CountVectorizer(), MultinomialNB()).fit(textes, etiquettes)",
        "marque = make_pipeline(CountVectorizer(), MultinomialNB())",
        "marque.fit([marquer_negation(t) for t in textes], etiquettes)",
        "p_simple = simple.predict_proba(nouveaux)[:, 1]",
        "p_marque = marque.predict_proba([marquer_negation(t) for t in nouveaux])[:, 1]",
        "for texte, a, b in zip(nouveaux, p_simple, p_marque):",
        "    print(texte, ': probabilité positive', round(a, 2), 'puis', round(b, 2), 'avec le marquage')",
      ),
      caption: "« Le café n est pas bon » passe de 0,53 (jugé positif) à 0,22 ; « Pas bon du tout » de 0,74 à 0,49, tout juste négatif. L'ironie de « Génial, encore fermé » reste à 0,49 dans les deux cas : aucun comptage de mots ne la comprend.",
    },
    {
      kind: "note",
      tone: "info",
      md: "Le marquage reste grossier : dans « je ne reviendrai pas le mardi », il marque aussi « le » (non_le). Les modèles pré-entraînés du module 6 traitent la négation et une partie de l'ironie bien mieux, parce qu'ils lisent chaque mot dans le contexte de toute la phrase.",
    },
  ],
  quiz: [
    {
      question: "Pourquoi le bayésien naïf est-il dit « naïf » ?",
      options: [
        "Parce qu'il est facile à tromper",
        "Parce qu'il suppose les mots indépendants les uns des autres",
        "Parce qu'il n'utilise pas de probabilités",
        "Parce qu'il ne fonctionne que sur de petits textes",
      ],
      correct: 1,
      explanation: "L'hypothèse d'indépendance est fausse pour le langage, mais le modèle reste souvent utile : rapide, simple, et une bonne référence.",
    },
    {
      question: "Un modèle obtient 0,75 en validation croisée sur 40 avis, un autre 0,70. Que conclure ?",
      options: [
        "Le premier est nettement meilleur",
        "Pas grand-chose : l'écart représente 2 avis et les plis varient de 0,5 à 1",
        "Le second est meilleur",
        "Il faut garder les deux",
      ],
      correct: 1,
      explanation: "Avec si peu de données, la variabilité d'un pli à l'autre dépasse l'écart observé. Il faudrait beaucoup plus d'avis pour départager les deux réglages.",
    },
    {
      question: "À quoi sert le marquage « pas bon » vers « pas non_bon » ?",
      options: [
        "À corriger l'orthographe",
        "À faire de « bon » nié un mot distinct, que le modèle peut associer aux avis négatifs",
        "À supprimer les mots négatifs",
        "À traduire le texte",
      ],
      correct: 1,
      explanation: "Sans marquage, « bon » compte pour le positif même dans « pas bon ». Avec, « non_bon » devient un indice à part.",
    },
  ],
};
