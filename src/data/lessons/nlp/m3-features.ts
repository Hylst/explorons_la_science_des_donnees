import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { DOCUMENTS, MOTS_VIDES } from "./data";

export const moduleFeatures: LessonModule = {
  id: "feature-extraction",
  title: "Représenter des textes par des nombres",
  duration: "2 h 30",
  summary: "Sac de mots, n-grammes et TF-IDF, puis la similarité cosinus pour retrouver le document le plus proche d'une question.",
  objectives: [
    "Construire un sac de mots et des n-grammes avec CountVectorizer",
    "Expliquer et calculer la pondération TF-IDF",
    "Mesurer la ressemblance de deux textes avec la similarité cosinus",
    "Construire un petit moteur de recherche",
  ],
  sections: [
    {
      kind: "text",
      md: `### Le sac de mots

Un modèle travaille sur des nombres. La représentation la plus simple d'un texte est le **sac de mots** : on fixe un vocabulaire (tous les mots vus), et chaque texte devient un vecteur qui compte combien de fois il contient chaque mot. L'ordre des mots est perdu, d'où le nom.

\`CountVectorizer\` de scikit-learn fait tout : découpage, minuscules, vocabulaire, comptage. Avec \`ngram_range=(1, 2)\`, il compte aussi les **paires de mots consécutifs** (bigrammes), ce qui garde un peu d'ordre local : « pas bon » devient un indice à part entière.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DOCUMENTS,
        "from sklearn.feature_extraction.text import CountVectorizer",
        "",
        "vectoriseur = CountVectorizer()",
        "matrice = vectoriseur.fit_transform(documents)",
        "print('forme :', matrice.shape, '(documents, mots)')",
        "vocabulaire = vectoriseur.get_feature_names_out()",
        "premier = matrice[0].toarray()[0]",
        "print('mots du premier document :', [vocabulaire[i] for i in premier.nonzero()[0]])",
        "",
        "bigrammes = CountVectorizer(ngram_range=(1, 2)).fit(documents)",
        "print('avec les bigrammes :', len(bigrammes.get_feature_names_out()), 'colonnes')",
      ),
      caption: "Par défaut, CountVectorizer ignore les mots d'une seule lettre (« l », « à ») : son motif de découpage exige au moins deux caractères.",
    },
    {
      kind: "text",
      md: `### TF-IDF : pondérer selon la rareté

Un mot présent dans beaucoup de documents (« de », « le », « médiathèque » ici) aide peu à les distinguer. **TF-IDF** multiplie deux termes :

- **TF** (*term frequency*) : la fréquence du mot dans le document ;
- **IDF** (*inverse document frequency*) : un poids d'autant plus fort que le mot est **rare** dans l'ensemble des documents, de l'ordre de \`log(nombre de documents / nombre de documents contenant le mot)\`.

Un mot fréquent dans un document mais rare ailleurs obtient un poids élevé : c'est souvent un bon résumé du document. \`TfidfVectorizer\` fait le calcul (avec un lissage) et normalise chaque vecteur.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DOCUMENTS,
        MOTS_VIDES,
        "from sklearn.feature_extraction.text import TfidfVectorizer",
        "",
        "for mots_vides in [None, sorted(MOTS_VIDES)]:",
        "    vectoriseur = TfidfVectorizer(stop_words=mots_vides)",
        "    poids = vectoriseur.fit_transform(documents)[1].toarray()[0]",
        "    mots = vectoriseur.get_feature_names_out()",
        "    meilleurs = poids.argsort()[::-1][:4]",
        "    print('mots vides retirés :', mots_vides is not None)",
        "    print('   ', [(mots[i], round(float(poids[i]), 2)) for i in meilleurs])",
      ),
      caption: "Dans la phrase sur le prêt de livres, « de » apparaît deux fois et l'emporte (0,37) malgré son IDF faible. Une fois les mots vides retirés, les mots rares de la phrase arrivent en tête à égalité (0,39) : sur des phrases aussi courtes, chaque mot n'apparaît qu'une fois.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Entraînez un `TfidfVectorizer` **sans les mots vides** (paramètre `stop_words`, qui attend une **liste**), puis trouvez le mot dont l'**IDF est le plus faible**, c'est-à-dire le mot le moins utile pour distinguer les documents. Les IDF sont dans `vectoriseur.idf_`, dans le même ordre que `vectoriseur.get_feature_names_out()`. Rangez ce mot dans `mot_commun`.",
      setup: lines(DOCUMENTS, MOTS_VIDES, "from sklearn.feature_extraction.text import TfidfVectorizer"),
      starter: lines("vectoriseur = TfidfVectorizer(stop_words=sorted(MOTS_VIDES))", "vectoriseur.fit(documents)", "mot_commun = None"),
      solution: lines(
        "vectoriseur = TfidfVectorizer(stop_words=sorted(MOTS_VIDES))",
        "vectoriseur.fit(documents)",
        "mots = vectoriseur.get_feature_names_out()",
        "mot_commun = mots[vectoriseur.idf_.argmin()]",
        "print(mot_commun, round(vectoriseur.idf_.min(), 2))",
      ),
      test: "assert mot_commun == 'médiathèque', f\"sans les mots vides, « médiathèque » (dans 3 documents sur 6) a l'IDF le plus faible (vous avez « {mot_commun} »)\"",
      hint: "vectoriseur.idf_.argmin() donne la position du plus petit IDF ; get_feature_names_out()[position] le mot.",
    },
    {
      kind: "text",
      md: `### Similarité cosinus et recherche

Deux textes représentés par des vecteurs sont **proches** si leurs vecteurs pointent dans la même direction. La **similarité cosinus** mesure l'angle entre eux : 1 pour des textes qui ont exactement les mêmes proportions de mots, 0 pour des textes sans aucun mot commun.

Un petit **moteur de recherche** s'en déduit : on vectorise la question avec le même vectoriseur que les documents, on calcule sa similarité avec chacun, et on renvoie le plus proche. C'est le principe (très simplifié) des premiers moteurs de recherche, et une brique encore utilisée aujourd'hui.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez la fonction `rechercher(question)` qui renvoie le **document le plus proche** de la question, au sens de la similarité cosinus entre vecteurs TF-IDF. Le vectoriseur est déjà entraîné sur les documents (`vectoriseur`, `matrice`).",
      setup: lines(
        DOCUMENTS,
        "from sklearn.feature_extraction.text import TfidfVectorizer",
        "from sklearn.metrics.pairwise import cosine_similarity",
        "vectoriseur = TfidfVectorizer()",
        "matrice = vectoriseur.fit_transform(documents)",
      ),
      starter: lines("def rechercher(question):", "    return documents[0]"),
      solution: lines(
        "def rechercher(question):",
        "    vecteur = vectoriseur.transform([question])",
        "    similarites = cosine_similarity(vecteur, matrice)[0]",
        "    return documents[similarites.argmax()]",
        "",
        "print(rechercher('Quand ouvre la médiathèque ?'))",
        "print(rechercher('atelier bande dessinée'))",
      ),
      test: lines(
        "assert rechercher('atelier de bande dessinée') == documents[2], \"une question sur la bande dessinée doit renvoyer le document sur l'atelier de BD\"",
        "assert rechercher('livres numériques à réserver') == documents[3], \"une question sur les livres numériques doit renvoyer le document sur la réservation\"",
        "assert rechercher('boissons et gâteaux') == documents[4], \"une question sur les gâteaux doit renvoyer le document sur le café\"",
      ),
      hint: "vectoriseur.transform([question]) (et non fit_transform : on garde le vocabulaire des documents), puis cosine_similarity(vecteur, matrice)[0].argmax().",
    },
  ],
  quiz: [
    {
      question: "Que perd la représentation en sac de mots ?",
      options: ["Le vocabulaire", "L'ordre des mots", "La fréquence des mots", "Le nombre de documents"],
      correct: 1,
      explanation: "Le sac de mots compte les mots sans tenir compte de leur position : « le chat mange la souris » et « la souris mange le chat » ont le même vecteur. Les n-grammes gardent un peu d'ordre local.",
    },
    {
      question: "Pourquoi l'IDF donne-t-il un poids faible à un mot présent dans tous les documents ?",
      options: [
        "Parce qu'il est mal orthographié",
        "Parce qu'un mot présent partout ne permet pas de distinguer les documents",
        "Parce qu'il est trop long",
        "Parce que le calcul est plus rapide",
      ],
      correct: 1,
      explanation: "L'IDF vaut environ log(N / nombre de documents contenant le mot) : il est minimal quand le mot apparaît partout.",
    },
    {
      question: "Dans le moteur de recherche, pourquoi utiliser transform et non fit_transform sur la question ?",
      options: [
        "Pour aller plus vite uniquement",
        "Pour garder le vocabulaire et les poids appris sur les documents, et comparer des vecteurs de même dimension",
        "Parce que fit_transform n'existe pas",
        "Il n'y a aucune différence",
      ],
      correct: 1,
      explanation: "fit_transform réapprendrait un vocabulaire à partir de la seule question : les vecteurs ne seraient plus comparables à ceux des documents.",
    },
  ],
};
