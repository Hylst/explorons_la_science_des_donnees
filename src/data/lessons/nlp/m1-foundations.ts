import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { DOCUMENTS } from "./data";

export const moduleFoundations: LessonModule = {
  id: "nlp-foundations",
  title: "Fondamentaux du traitement du langage",
  duration: "1 h 30",
  summary: "Ce qui rend le langage difficile pour une machine, les grandes tâches du domaine, et un premier comptage de mots.",
  objectives: [
    "Citer les grandes tâches du traitement automatique du langage",
    "Expliquer pourquoi l'ambiguïté rend le langage difficile à traiter",
    "Découper un texte en mots (tokenisation simple) et compter leurs occurrences",
  ],
  sections: [
    {
      kind: "text",
      md: `### Faire comprendre des textes à une machine

Le **traitement automatique du langage** (TAL, ou NLP en anglais) regroupe les méthodes qui permettent à un programme de travailler sur des textes : les classer, en extraire des informations, les traduire, les résumer, en produire.

Quelques tâches classiques :

- **classification** : trier des avis en positifs et négatifs, des courriels en indésirables ou non ;
- **extraction d'information** : repérer des noms de personnes, de lieux, des dates, des montants (les « entités nommées ») ;
- **recherche d'information** : retrouver les documents qui répondent à une question ;
- **traduction**, **résumé**, **génération** de texte, **dialogue**.

Ce cours avance des méthodes les plus simples (compter des mots) aux principes des grands modèles de langage, en montrant à chaque étape ce que chaque méthode sait faire, et ce qu'elle ne sait pas faire.`,
    },
    {
      kind: "text",
      md: `### Pourquoi c'est difficile

Le langage est plein d'**ambiguïtés** que nous levons sans y penser :

- un mot a plusieurs sens : « avocat » (le fruit ou le juriste), « livre » (l'ouvrage ou la monnaie) ;
- une phrase a plusieurs lectures : « Il a vu l'homme avec des jumelles » (qui tient les jumelles ?) ;
- le sens dépend du contexte et de l'intention : « Génial, encore fermé ! » est un reproche ;
- la négation inverse tout : « pas mal » est plutôt un compliment.

Ajoutez les fautes de frappe, les abréviations, les langues mélangées : un programme qui se contente de chercher des mots-clés se trompe vite. Tout le domaine consiste à trouver des représentations du texte qui capturent assez de sens pour la tâche visée.`,
    },
    {
      kind: "text",
      md: "### Un premier traitement : découper et compter\n\nLa toute première étape consiste à **découper** le texte en unités, les **tokens** (souvent des mots). La méthode la plus simple découpe sur les espaces, mais garde alors la ponctuation collée aux mots (« heures. »). Une expression régulière comme `\\w+` ne garde que les suites de lettres et de chiffres.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import re",
        "from collections import Counter",
        "",
        DOCUMENTS,
        "",
        "texte = ' '.join(documents).lower()",
        "print('découpage sur les espaces :', texte.split()[:10])",
        "mots = re.findall(r'\\w+', texte)",
        "print('avec une expression régulière :', mots[:10])",
        "print('mots les plus fréquents :', Counter(mots).most_common(6))",
      ),
      caption: "En tête viennent des mots outils (« de », « le », « la », « les ») qui disent peu de choses sur le contenu ; seul « médiathèque » parle du sujet. Le module 2 apprend à écarter ces mots outils.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez la fonction `tokeniser(texte)` qui renvoie la liste des mots du texte **en minuscules**, sans ponctuation (utilisez `re.findall` avec le motif `\\w+`). Par exemple, `tokeniser('Bonjour, la Médiathèque !')` doit renvoyer `['bonjour', 'la', 'médiathèque']`.",
      starter: lines("import re", "", "def tokeniser(texte):", "    return texte.split()"),
      solution: lines("import re", "", "def tokeniser(texte):", "    return re.findall(r'\\w+', texte.lower())", "", "print(tokeniser('Bonjour, la Médiathèque !'))"),
      test: lines(
        "assert tokeniser('Bonjour, la Médiathèque !') == ['bonjour', 'la', 'médiathèque'], f\"on attend ['bonjour', 'la', 'médiathèque'] (vous avez {tokeniser('Bonjour, la Médiathèque !')})\"",
        "assert tokeniser('Ouvert à 9h, le samedi.') == ['ouvert', 'à', '9h', 'le', 'samedi'], \"la ponctuation doit disparaître et les chiffres rester\"",
      ),
      hint: "re.findall(r'\\w+', texte.lower()) : \\w+ désigne une suite de lettres, chiffres ou tirets bas, accents compris.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Avec `Counter`, trouvez le **mot le plus fréquent** des documents qui contient **au moins 4 lettres** (pour écarter les petits mots outils). Rangez-le dans `mot_frequent`.",
      setup: lines("import re", "from collections import Counter", DOCUMENTS, "mots = re.findall(r'\\w+', ' '.join(documents).lower())"),
      starter: "mot_frequent = Counter(mots).most_common(1)[0][0]",
      solution: lines(
        "longs = [m for m in mots if len(m) >= 4]",
        "mot_frequent = Counter(longs).most_common(1)[0][0]",
        "print(Counter(longs).most_common(5))",
      ),
      test: "assert mot_frequent == 'médiathèque', f\"parmi les mots d'au moins 4 lettres, « médiathèque » est le plus fréquent (vous avez « {mot_frequent} »)\"",
      hint: "Filtrez d'abord la liste : [m for m in mots if len(m) >= 4], puis Counter(...).most_common(1).",
    },
  ],
  quiz: [
    {
      question: "Laquelle de ces tâches relève de l'extraction d'information ?",
      options: ["Trier des courriels en indésirables ou non", "Repérer les dates et les noms de lieux dans des articles", "Traduire un texte", "Résumer un rapport"],
      correct: 1,
      explanation: "Extraire des entités (dates, lieux, personnes, montants) d'un texte est la tâche type de l'extraction d'information. Trier des courriels est une classification.",
    },
    {
      question: "Pourquoi « Génial, encore fermé ! » pose-t-il problème à une méthode par mots-clés ?",
      options: [
        "Parce qu'il est trop court",
        "Parce que le mot « génial » est positif alors que la phrase exprime un reproche (ironie)",
        "Parce qu'il contient une virgule",
        "Il ne pose aucun problème",
      ],
      correct: 1,
      explanation: "Le sens vient de l'ensemble de la phrase et du contexte : chercher des mots positifs ou négatifs isolés ne suffit pas.",
    },
    {
      question: "Qu'est-ce qu'un token ?",
      options: [
        "Un mot de passe",
        "Une unité du texte obtenue par découpage (souvent un mot, parfois un morceau de mot)",
        "Une phrase entière",
        "Une erreur de syntaxe",
      ],
      correct: 1,
      explanation: "Le découpage en tokens est la première étape de presque tous les traitements. Les modèles récents découpent souvent en morceaux de mots.",
    },
  ],
};
