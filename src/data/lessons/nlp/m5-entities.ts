import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

/** Texte fictif écrit pour le cours (personne, salle et dates inventées) */
const TEXTE = lines(
  "texte = ('Le 12 mars 2026, Mme Durand a réservé la salle Jules-Verne de la médiathèque de Nantes pour 45 €. '",
  "         'Rendez-vous le 03/04/2026 ; la caution de 7,50 euros sera rendue le 1er avril.')",
);

const MOIS = "janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre";

export const moduleEntities: LessonModule = {
  id: "named-entity",
  title: "Reconnaissance d'entités nommées",
  duration: "2 h",
  summary: "Repérer dates, montants, personnes et lieux : des expressions régulières pour les formats fixes, l'annotation BIO, et ce que font les modèles appris.",
  objectives: [
    "Définir les entités nommées et les principales catégories",
    "Extraire des dates et des montants avec des expressions régulières",
    "Lire et produire une annotation au format BIO",
    "Savoir quand des règles suffisent et quand il faut un modèle appris",
  ],
  sections: [
    {
      kind: "text",
      md: `### Qu'est-ce qu'une entité nommée

Une **entité nommée** est un segment de texte qui désigne un objet précis du monde : une **personne** (« Mme Durand »), un **lieu** (« Nantes »), une **organisation**, une **date**, un **montant**... Les repérer permet par exemple d'indexer des articles par lieu, de remplir automatiquement un formulaire, ou d'anonymiser des documents.

Deux grandes approches :

- des **règles** : expressions régulières et listes de noms connues. Parfait pour les formats fixes (dates numériques, montants, numéros, adresses électroniques), fragile pour le reste ;
- des **modèles appris** sur des textes annotés à la main, qui s'appuient sur le contexte : « Durand » est une personne après « Mme », un lieu dans « rue Durand ».`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import re",
        "",
        TEXTE,
        "",
        "for trouve in re.finditer(r'\\b\\d{1,2}/\\d{1,2}/\\d{4}\\b', texte):",
        "    print('date numérique :', trouve.group(), 'aux positions', trouve.span())",
        `motif_mois = r'\\b\\d{1,2}(?:er)? (?:${MOIS})(?: \\d{4})?\\b'`,
        "print('dates en toutes lettres :', re.findall(motif_mois, texte))",
      ),
      caption: "re.finditer donne aussi la position de chaque entité dans le texte, ce dont on a besoin pour la surligner ou la masquer.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `extraire_montants(texte)` qui renvoie la **liste des montants en euros** du texte, sous forme de **nombres** (`float`). Un montant est un nombre entier, éventuellement suivi d'une virgule et d'un ou deux chiffres, puis d'une espace facultative et de « € » ou « euro(s) ». Sur le texte fourni, on attend `[45.0, 7.5]`.",
      setup: TEXTE,
      starter: lines("import re", "", "def extraire_montants(texte):", "    return re.findall(r'\\d+', texte)"),
      solution: lines(
        "import re",
        "",
        "def extraire_montants(texte):",
        "    nombres = re.findall(r'(\\d+(?:,\\d{1,2})?) ?(?:€|euros?\\b)', texte)",
        "    return [float(n.replace(',', '.')) for n in nombres]",
        "",
        "print(extraire_montants(texte))",
        "print(extraire_montants('Une salle à 1 200 € ?'))",
      ),
      test: lines(
        "assert extraire_montants(texte) == [45.0, 7.5], f\"on attend [45.0, 7.5] (vous avez {extraire_montants(texte)})\"",
        "assert extraire_montants('Tarif : 3 euros, 12,5 € ou 2 euro') == [3.0, 12.5, 2.0], \"« euro », « euros » et « € » doivent être reconnus, la virgule convertie en point\"",
        "assert extraire_montants('Ouvert 6 jours sur 7') == [], \"un nombre sans unité monétaire n'est pas un montant\"",
      ),
      hint: "Un groupe capturant pour le nombre : (\\d+(?:,\\d{1,2})?), puis ' ?(?:€|euros?\\b)'. Remplacez la virgule par un point avant float().",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Le corrigé affiche aussi le résultat pour « 1 200 € » : il ne trouve que 200, car l'espace des milliers coupe le nombre. Chaque règle a ses angles morts ; il faut les chercher avec des exemples variés, et les tester.",
    },
    {
      kind: "text",
      md: `### L'annotation BIO

Pour entraîner un modèle, on annote chaque **mot** d'un texte avec une étiquette :

- **B-TYPE** (*begin*) pour le premier mot d'une entité ;
- **I-TYPE** (*inside*) pour les mots suivants de la même entité ;
- **O** (*outside*) pour les mots hors entité.

« Mme Durand habite Saint-Nazaire » découpé en mots donne : Mme (B-PER), Durand (I-PER), habite (O), Saint-Nazaire (B-LOC). Le modèle apprend alors à prédire une étiquette par mot, en tenant compte des mots voisins.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `etiqueter_bio(mots, entites)` : `mots` est une liste de mots, `entites` une liste de triplets `(debut, fin, type)` où `debut` est l'indice du premier mot de l'entité et `fin` l'indice **après** le dernier (comme dans une tranche Python). Renvoyez la liste des étiquettes BIO, une par mot.",
      starter: lines("def etiqueter_bio(mots, entites):", "    return ['O'] * len(mots)"),
      solution: lines(
        "def etiqueter_bio(mots, entites):",
        "    etiquettes = ['O'] * len(mots)",
        "    for debut, fin, genre in entites:",
        "        etiquettes[debut] = 'B-' + genre",
        "        for i in range(debut + 1, fin):",
        "            etiquettes[i] = 'I-' + genre",
        "    return etiquettes",
        "",
        "mots = ['Mme', 'Durand', 'habite', 'Saint-Nazaire']",
        "print(etiqueter_bio(mots, [(0, 2, 'PER'), (3, 4, 'LOC')]))",
      ),
      test: lines(
        "_m = ['Mme', 'Durand', 'habite', 'Saint-Nazaire']",
        "assert etiqueter_bio(_m, [(0, 2, 'PER'), (3, 4, 'LOC')]) == ['B-PER', 'I-PER', 'O', 'B-LOC'], f\"on attend ['B-PER', 'I-PER', 'O', 'B-LOC'] (vous avez {etiqueter_bio(_m, [(0, 2, 'PER'), (3, 4, 'LOC')])})\"",
        "_m2 = ['La', 'Bibliothèque', 'nationale', 'de', 'France', 'ouvre']",
        "assert etiqueter_bio(_m2, [(1, 5, 'ORG')]) == ['O', 'B-ORG', 'I-ORG', 'I-ORG', 'I-ORG', 'O'], \"une entité de 4 mots : un B- puis trois I-\"",
        "assert etiqueter_bio(['Bonjour'], []) == ['O'], \"sans entité, tout est O\"",
      ),
      hint: "Partez de ['O'] * len(mots) ; pour chaque entité, mettez 'B-' + type à l'indice debut et 'I-' + type de debut + 1 à fin - 1.",
    },
    {
      kind: "text",
      md: lines(
        "### Avec un modèle appris : spaCy",
        "",
        "La bibliothèque **spaCy** fournit des modèles prêts à l'emploi pour le français. Elle n'est pas disponible dans le moteur de ce site ; voici le code à lire, à exécuter sur votre machine après `pip install spacy` et `python -m spacy download fr_core_news_sm` :",
        "",
        "```python",
        "import spacy",
        "",
        "nlp = spacy.load('fr_core_news_sm')",
        "doc = nlp('Mme Durand a réservé une salle à la médiathèque de Nantes.')",
        "for entite in doc.ents:",
        "    print(entite.text, entite.label_)",
        "```",
        "",
        "Les modèles français de spaCy reconnaissent quatre catégories : personnes (PER), lieux (LOC), organisations (ORG) et divers (MISC). Ils sont appris en partie sur WikiNER, un corpus tiré de Wikipédia : ils ne repèrent ni les dates ni les montants, que l'on confie volontiers à des règles. Un système réel combine souvent les deux.",
      ),
    },
  ],
  quiz: [
    {
      question: "Pour extraire des numéros de téléphone au format fixe, que choisir en premier ?",
      options: ["Un grand modèle de langage", "Une expression régulière", "Un classifieur bayésien", "Une lemmatisation"],
      correct: 1,
      explanation: "Un format fixe se décrit très bien par une règle, rapide, transparente et testable. Les modèles appris servent quand le contexte compte.",
    },
    {
      question: "Dans l'annotation BIO, que signifie I-LOC ?",
      options: [
        "Le premier mot d'un lieu",
        "Un mot qui continue une entité de type lieu commencée avant",
        "Un mot hors entité",
        "Un lieu inconnu",
      ],
      correct: 1,
      explanation: "B- marque le début d'une entité, I- sa suite, O les mots hors entité.",
    },
    {
      question: "Pourquoi un modèle appris reconnaît-il mieux « Durand » comme personne qu'une liste de noms ?",
      options: [
        "Parce qu'il connaît tous les noms de famille",
        "Parce qu'il s'appuie sur le contexte (« Mme Durand », « rue Durand »)",
        "Parce qu'il ignore les majuscules",
        "Il ne le reconnaît pas mieux",
      ],
      correct: 1,
      explanation: "Le même mot peut être une personne, un lieu ou une organisation selon les mots voisins ; une liste ne voit pas ce contexte.",
    },
  ],
};
