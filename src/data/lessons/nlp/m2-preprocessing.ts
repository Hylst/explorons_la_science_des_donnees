import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { MOTS_VIDES } from "./data";

export const modulePreprocessing: LessonModule = {
  id: "text-preprocessing",
  title: "Préparer le texte",
  duration: "2 h",
  summary: "Minuscules, accents, ponctuation, mots vides, racines : chaque nettoyage aide une tâche et en gêne une autre.",
  objectives: [
    "Construire une fonction de nettoyage de texte pas à pas",
    "Retirer les mots vides, en sachant ce que l'on perd",
    "Retirer les accents avec unicodedata, et en mesurer les effets",
    "Comprendre la racinisation et la lemmatisation, et leurs limites",
  ],
  sections: [
    {
      kind: "text",
      md: `### Pourquoi nettoyer

Pour un ordinateur, « Livre », « livre » et « livres » sont trois chaînes différentes. Le **prétraitement** ramène les variantes à une forme commune, pour que les comptages et les modèles regroupent ce qui doit l'être. Les opérations courantes :

- passer en **minuscules** ;
- retirer la **ponctuation** et, parfois, les **chiffres** ;
- retirer les **accents** (utile quand les textes sont saisis sans soin, nuisible quand l'accent distingue des mots : « où » et « ou ») ;
- retirer les **mots vides** (*stopwords*) : « le », « de », « et »... très fréquents et peu porteurs de sens ;
- ramener les mots à une forme de base : **racinisation** ou **lemmatisation**.

Aucune de ces étapes n'est obligatoire : on les choisit selon la tâche. Pour détecter une négation, retirer « ne » et « pas » serait une catastrophe.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import re",
        "import unicodedata",
        "",
        "def sans_accents(texte):",
        "    # NFD sépare chaque lettre de son accent ; on retire ensuite les accents (catégorie Mn)",
        "    decompose = unicodedata.normalize('NFD', texte)",
        "    return ''.join(c for c in decompose if unicodedata.category(c) != 'Mn')",
        "",
        "phrase = 'La Médiathèque prête des DVD ; l’inscription est OBLIGATOIRE à l’accueil !'",
        "print(phrase.lower())",
        "print(sans_accents(phrase.lower()))",
        "print(re.findall(r'\\w+', sans_accents(phrase.lower())))",
      ),
      caption: "Chaque étape transforme un peu plus le texte : minuscules, puis accents retirés, puis découpage en mots sans la ponctuation.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez la fonction `nettoyer(texte)` qui renvoie la liste des mots du texte **en minuscules**, **sans ponctuation** et **sans les mots vides** de l'ensemble `MOTS_VIDES` (fourni). Par exemple, `nettoyer('Le prêt de livres est gratuit.')` doit renvoyer `['prêt', 'livres', 'gratuit']`.",
      setup: MOTS_VIDES,
      starter: lines("import re", "", "def nettoyer(texte):", "    return re.findall(r'\\w+', texte.lower())"),
      solution: lines(
        "import re",
        "",
        "def nettoyer(texte):",
        "    mots = re.findall(r'\\w+', texte.lower())",
        "    return [m for m in mots if m not in MOTS_VIDES]",
        "",
        "print(nettoyer('Le prêt de livres est gratuit.'))",
      ),
      test: lines(
        "assert nettoyer('Le prêt de livres est gratuit.') == ['prêt', 'livres', 'gratuit'], f\"on attend ['prêt', 'livres', 'gratuit'] (vous avez {nettoyer('Le prêt de livres est gratuit.')})\"",
        "assert nettoyer('Ouvert le SAMEDI et le dimanche') == ['ouvert', 'samedi', 'dimanche'], \"les mots vides doivent disparaître, quelle que soit leur casse\"",
      ),
      hint: "Découpez d'abord avec re.findall(r'\\w+', texte.lower()), puis gardez les mots qui ne sont pas dans MOTS_VIDES.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "La liste de mots vides contient « ne » et « pas ». Avec ce nettoyage, « pas bon » devient « bon » : parfait pour chercher des documents par thème, désastreux pour analyser un sentiment. Le module 4 y revient.",
    },
    {
      kind: "text",
      md: `### Racines et lemmes

- La **racinisation** (*stemming*) coupe les terminaisons selon des règles : « gratuits », « gratuite », « gratuitement » deviennent « gratuit ». Rapide, mais grossier : elle produit parfois des racines qui ne sont pas des mots, et regroupe à tort des mots sans rapport.
- La **lemmatisation** ramène chaque mot à sa forme de dictionnaire, en tenant compte de sa nature : « sont » devient « être », « chevaux » devient « cheval ». Plus juste, mais il faut un dictionnaire et une analyse grammaticale.

En Python, NLTK propose un raciniseur pour le français (Snowball) et spaCy un lemmatiseur. Ils ne sont pas disponibles dans le moteur de ce site : l'exercice ci-dessous construit un raciniseur jouet, juste pour toucher du doigt l'idée et ses limites.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez un raciniseur **jouet** `raciniser(mot)` : si le mot se termine par l'un des suffixes de la liste `SUFFIXES` (essayés **dans l'ordre**, du plus long au plus court) et qu'il reste **au moins 3 lettres**, on retire ce suffixe ; sinon on renvoie le mot tel quel.",
      setup: "SUFFIXES = ['ement', 'ions', 'ent', 'es', 'e', 's']",
      starter: lines("def raciniser(mot):", "    return mot"),
      solution: lines(
        "def raciniser(mot):",
        "    for suffixe in SUFFIXES:",
        "        if mot.endswith(suffixe) and len(mot) - len(suffixe) >= 3:",
        "            return mot[: -len(suffixe)]",
        "    return mot",
        "",
        "for m in ['gratuitement', 'gratuites', 'gratuit', 'ateliers', 'lisent', 'rue']:",
        "    print(m, '->', raciniser(m))",
      ),
      test: lines(
        "assert raciniser('gratuitement') == 'gratuit', f\"« gratuitement » doit donner « gratuit » (vous avez « {raciniser('gratuitement')} »)\"",
        "assert raciniser('gratuites') == 'gratuit', \"« gratuites » doit donner « gratuit » (suffixe es)\"",
        "assert raciniser('ateliers') == 'atelier', \"« ateliers » doit donner « atelier »\"",
        "assert raciniser('rue') == 'rue', \"« rue » doit rester tel quel : il ne resterait que 2 lettres\"",
      ),
      hint: "Une boucle sur SUFFIXES ; mot.endswith(suffixe) et len(mot) - len(suffixe) >= 3 ; mot[:-len(suffixe)] retire le suffixe.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "SUFFIXES = ['ement', 'ions', 'ent', 'es', 'e', 's']",
        "",
        "def raciniser(mot):",
        "    for suffixe in SUFFIXES:",
        "        if mot.endswith(suffixe) and len(mot) - len(suffixe) >= 3:",
        "            return mot[: -len(suffixe)]",
        "    return mot",
        "",
        "for m in ['lisent', 'dent', 'parent', 'moment', 'gâteaux']:",
        "    print(m, '->', raciniser(m))",
      ),
      caption: "Les limites sautent aux yeux : « parent » devient « par », « moment » devient « mom », et « gâteaux » n'est pas reconnu comme pluriel. Les vrais raciniseurs ont des dizaines de règles et d'exceptions, et restent imparfaits.",
    },
  ],
  quiz: [
    {
      question: "Pourquoi retirer les mots vides peut-il être une mauvaise idée ?",
      options: [
        "Parce que cela rend le texte plus long",
        "Parce que certains mots vides portent du sens pour la tâche, comme « ne » et « pas » pour le sentiment",
        "Parce que Python ne le permet pas",
        "Ce n'est jamais une mauvaise idée",
      ],
      correct: 1,
      explanation: "Les mots vides sont peu utiles pour le thème d'un texte, mais une négation inverse le sentiment : le prétraitement dépend de la tâche.",
    },
    {
      question: "Quelle différence entre racinisation et lemmatisation ?",
      options: [
        "Aucune",
        "La racinisation coupe les terminaisons selon des règles ; la lemmatisation ramène à la forme du dictionnaire",
        "La lemmatisation est plus rapide",
        "La racinisation ne fonctionne qu'en anglais",
      ],
      correct: 1,
      explanation: "La racinisation est rapide mais grossière (« parent » peut devenir « par ») ; la lemmatisation (« sont » vers « être ») demande un dictionnaire et une analyse grammaticale.",
    },
    {
      question: "Que fait unicodedata.normalize('NFD', texte) ?",
      options: [
        "Il traduit le texte",
        "Il sépare chaque lettre accentuée en une lettre de base suivie de son accent",
        "Il supprime la ponctuation",
        "Il met le texte en minuscules",
      ],
      correct: 1,
      explanation: "Après cette décomposition, les accents sont des caractères à part (catégorie Mn) que l'on peut retirer.",
    },
  ],
};
