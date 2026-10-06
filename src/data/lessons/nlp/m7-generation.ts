import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { DOCUMENTS } from "./data";

const BIGRAMMES = lines(
  "import re",
  "from collections import Counter, defaultdict",
  "",
  "def compter_bigrammes(mots):",
  "    suivants = defaultdict(Counter)",
  "    for mot, suivant in zip(mots, mots[1:]):",
  "        suivants[mot][suivant] += 1",
  "    return dict(suivants)",
);

const TEMPERATURE = lines(
  "import numpy as np",
  "",
  "def probas_temperature(scores, temperature):",
  "    z = np.asarray(scores, dtype=float) / temperature",
  "    e = np.exp(z - z.max())",
  "    return e / e.sum()",
);

export const moduleGeneration: LessonModule = {
  id: "gpt-generation",
  title: "Modèles de langage et génération",
  duration: "2 h",
  summary: "Prédire le mot suivant : un modèle de bigrammes programmé à la main, la température, puis ce que font (et ne font pas) les grands modèles comme GPT.",
  objectives: [
    "Définir un modèle de langage comme la prédiction du mot suivant",
    "Construire et utiliser un modèle de bigrammes",
    "Expliquer l'effet de la température sur la génération",
    "Comprendre pourquoi un modèle génératif peut affirmer des choses fausses",
  ],
  sections: [
    {
      kind: "text",
      md: `### Prédire le mot suivant

Un **modèle de langage** attribue une probabilité à chaque mot possible après un début de texte : après « la médiathèque ouvre le », « samedi » est plus probable que « parapluie ». Pour **générer** du texte, on choisit un mot selon ces probabilités, on l'ajoute, et on recommence.

Le plus simple des modèles de langage ne regarde que **le mot précédent** : c'est un modèle de **bigrammes**, que l'on estime en comptant quels mots suivent quels mots dans un corpus. Les modèles GPT (Radford et al., 2018, puis leurs successeurs) font la même chose, prédire le mot (en fait le sous-mot) suivant, mais avec un transformeur qui tient compte de milliers de mots de contexte, et après un entraînement sur une énorme quantité de texte.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `compter_bigrammes(mots)` qui renvoie un **dictionnaire** : à chaque mot, il associe un `Counter` des mots qui le suivent dans la liste. Le dernier mot, qui n'a pas de suivant, n'a pas d'entrée (sauf s'il apparaît aussi plus tôt).",
      starter: lines("from collections import Counter", "", "def compter_bigrammes(mots):", "    return {}"),
      solution: lines(BIGRAMMES, "", "print(compter_bigrammes(['la', 'médiathèque', 'ouvre', 'la', 'médiathèque', 'ferme']))"),
      test: lines(
        "from collections import Counter as _C",
        "_r = compter_bigrammes(['la', 'médiathèque', 'ouvre', 'la', 'médiathèque', 'ferme'])",
        "assert 'la' in _r, f\"« la » est suivi deux fois de « médiathèque » : il doit avoir une entrée (clés obtenues : {sorted(_r)})\"",
        "assert _r['la'] == _C({'médiathèque': 2}), f\"après « la », on attend Counter({{'médiathèque': 2}}) (vous avez {_r['la']})\"",
        "assert _r['médiathèque'] == _C({'ouvre': 1, 'ferme': 1}), \"après « médiathèque » viennent « ouvre » et « ferme », une fois chacun\"",
        "assert 'ferme' not in _r, \"« ferme », dernier mot, n'a pas de suivant\"",
      ),
      hint: "zip(mots, mots[1:]) parcourt les paires de mots consécutifs ; un defaultdict(Counter) évite de tester l'existence de la clé.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DOCUMENTS,
        BIGRAMMES,
        "",
        "mots = re.findall(r'\\w+', ' '.join(documents).lower())",
        "suivants = compter_bigrammes(mots)",
        "print('après « la » :', suivants['la'].most_common())",
        "",
        "# Génération gloutonne : toujours le suivant le plus fréquent",
        "mot, phrase = 'le', ['le']",
        "for _ in range(8):",
        "    if mot not in suivants:",
        "        break",
        "    mot = suivants[mot].most_common(1)[0][0]",
        "    phrase.append(mot)",
        "print(' '.join(phrase))",
      ),
      caption: "Avec six phrases de corpus, le modèle recopie des morceaux de phrases et tourne vite en rond : il a peu d'exemples et ne voit qu'un mot en arrière.",
    },
    {
      kind: "text",
      md: `### La température

Toujours prendre le mot le plus probable donne un texte répétitif. On **tire au hasard** selon les probabilités, après les avoir ajustées par une **température** T : on divise les scores du modèle par T avant la softmax.

- T petit (0,2) : la distribution se concentre sur le mot le plus probable, le texte est prévisible ;
- T = 1 : les probabilités du modèle telles quelles ;
- T grand (2 et plus) : la distribution s'aplatit, le texte devient plus varié, puis incohérent.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `probas_temperature(scores, temperature)` : divisez les scores par la température, puis appliquez une **softmax stable** (soustraire le maximum avant l'exponentielle). Renvoyez un tableau NumPy de probabilités.",
      setup: "import numpy as np",
      starter: lines(
        "def probas_temperature(scores, temperature):",
        "    z = np.asarray(scores, dtype=float)",
        "    e = np.exp(z - z.max())",
        "    return e / e.sum()",
      ),
      solution: lines(TEMPERATURE, "", "for t in [0.2, 1, 5]:", "    print(t, probas_temperature([2.0, 1.0, 0.0], t).round(3))"),
      test: lines(
        "assert np.allclose(probas_temperature([2.0, 1.0, 0.0], 1), [0.66524096, 0.24472847, 0.09003057]), \"à T = 1, on retrouve la softmax des scores\"",
        "_p = probas_temperature([2.0, 1.0, 0.0], 0.2)",
        "assert _p[0] > 0.99, f\"à T = 0,2, le premier mot doit dépasser 0,99 de probabilité (vous avez {_p[0]:.3f}) : divisez les scores par la température\"",
        "_q = probas_temperature([2.0, 1.0, 0.0], 100)",
        "assert np.allclose(_q, 1 / 3, atol=0.01), \"à T = 100, la distribution doit être presque uniforme\"",
      ),
      hint: "z = np.asarray(scores, dtype=float) / temperature, puis la softmax stable sur z.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DOCUMENTS,
        BIGRAMMES,
        TEMPERATURE,
        "",
        "mots = re.findall(r'\\w+', ' '.join(documents).lower())",
        "suivants = compter_bigrammes(mots)",
        "rng = np.random.default_rng(42)",
        "",
        "def generer(debut, temperature, longueur=8):",
        "    phrase = [debut]",
        "    for _ in range(longueur):",
        "        if phrase[-1] not in suivants:",
        "            break",
        "        candidats = list(suivants[phrase[-1]])",
        "        scores = np.log([suivants[phrase[-1]][c] for c in candidats])",
        "        phrase.append(rng.choice(candidats, p=probas_temperature(scores, temperature)))",
        "    return ' '.join(phrase)",
        "",
        "for t in [0.2, 1, 3]:",
        "    print('T =', t, ':', generer('la', t))",
      ),
      caption: "Les scores sont ici les logarithmes des comptages : à T = 1, on tire exactement selon les fréquences observées. Changez la graine (42) ou la température pour voir varier les phrases.",
    },
    {
      kind: "text",
      md: `### Ce que fait vraiment un grand modèle

Un grand modèle de langage produit, mot après mot, une suite **plausible** au vu de ses données d'entraînement. Il n'a pas de base de faits qu'il consulterait : quand l'information lui manque, il peut produire une réponse fluide, assurée... et fausse. On parle d'**hallucination**.

Pour cette raison, on l'utilise volontiers en lui fournissant les documents pertinents dans la question (c'est l'idée de la génération augmentée par la recherche, ou RAG), on vérifie ses affirmations, et on ne lui confie pas seul des décisions qui engagent. Le module suivant construit la partie « recherche » d'un tel assistant.`,
    },
  ],
  quiz: [
    {
      question: "Qu'est-ce qu'un modèle de bigrammes ?",
      options: [
        "Un modèle qui traduit mot à mot",
        "Un modèle qui prédit le mot suivant à partir du seul mot précédent",
        "Un modèle qui compte les lettres",
        "Un transformeur à deux couches",
      ],
      correct: 1,
      explanation: "Il estime la probabilité de chaque mot suivant en comptant les paires de mots consécutifs d'un corpus.",
    },
    {
      question: "Quel est l'effet d'une température très basse ?",
      options: [
        "Le texte devient très varié",
        "Le modèle choisit presque toujours le mot le plus probable",
        "Le modèle s'arrête",
        "Aucun effet",
      ],
      correct: 1,
      explanation: "Diviser les scores par un petit nombre accentue les écarts : la softmax concentre presque toute la probabilité sur le meilleur score.",
    },
    {
      question: "Pourquoi un grand modèle de langage peut-il « halluciner » ?",
      options: [
        "Parce qu'il est mal programmé",
        "Parce qu'il produit une suite plausible de mots, sans vérifier les faits",
        "Parce qu'il manque de mémoire vive",
        "Parce que la température est toujours trop haute",
      ],
      correct: 1,
      explanation: "La plausibilité n'est pas la vérité : d'où l'intérêt de lui fournir des sources et de vérifier ses réponses.",
    },
  ],
};
