import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { MOTS_VIDES } from "./data";

/** Foire aux questions fictive de la médiathèque du cours */
const FAQ = lines(
  "faq = [",
  "    ('Quels sont les horaires d ouverture de la médiathèque ?', 'Du mardi au samedi, de 10 h à 18 h ; le samedi, dès 9 h.'),",
  "    ('Combien de livres puis-je emprunter ?', 'Jusqu à 10 documents, pour 3 semaines.'),",
  "    ('L inscription est-elle gratuite ?', 'Oui, l inscription est gratuite pour tous.'),",
  "    ('Comment réserver un livre numérique ?', 'Depuis le site de la médiathèque, rubrique Numérique.'),",
  "    ('Y a-t-il des ateliers pour les enfants ?', 'Oui, un atelier de bande dessinée chaque mercredi après-midi.'),",
  "    ('Peut-on travailler sur place avec le wifi ?', 'Oui, le wifi est gratuit et des tables sont à disposition.'),",
  "]",
  "questions = [q for q, _ in faq]",
  "INCONNU = 'Je ne sais pas répondre à cette question : demandez à l accueil.'",
);

const IMPORTS = lines(
  "from sklearn.feature_extraction.text import TfidfVectorizer",
  "from sklearn.metrics.pairwise import cosine_similarity",
);

const VECTORISEUR = lines(
  "vectoriseur = TfidfVectorizer(strip_accents='unicode', stop_words=sorted(MOTS_VIDES))",
  "matrice = vectoriseur.fit_transform(questions)",
  "SEUIL = 0.3",
);

const REPONDRE = lines(
  "def repondre(question):",
  "    similarites = cosine_similarity(vectoriseur.transform([question]), matrice)[0]",
  "    if similarites.max() < SEUIL:",
  "        return INCONNU",
  "    return faq[similarites.argmax()][1]",
);

export const moduleChatbot: LessonModule = {
  id: "chatbot-project",
  title: "Projet : un assistant de foire aux questions",
  duration: "2 h 30",
  summary: "Assembler le cours : un assistant qui retrouve la bonne réponse d'une FAQ par similarité TF-IDF, sait dire « je ne sais pas », et s'évalue honnêtement.",
  objectives: [
    "Construire un assistant de FAQ par recherche de la question la plus proche",
    "Ajouter un seuil de similarité pour savoir dire « je ne sais pas »",
    "Évaluer l'assistant sur un jeu de questions de test",
    "Situer cette approche par rapport aux assistants à base de grands modèles",
  ],
  sections: [
    {
      kind: "text",
      md: `### Le principe

Beaucoup d'assistants de service client ne « comprennent » rien : ils **retrouvent** la question la plus proche dans une liste de questions fréquentes et renvoient la réponse associée, écrite par un humain. Avantage majeur : la réponse est toujours exacte... à condition d'avoir trouvé la bonne question.

Le projet réutilise les modules précédents : nettoyage (accents et mots vides, module 2), TF-IDF et similarité cosinus (module 3). Il y ajoute un **seuil** : en dessous d'une certaine similarité, l'assistant avoue ne pas savoir, plutôt que de répondre à côté.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        FAQ,
        IMPORTS,
        "",
        "# Version naïve : aucun nettoyage, aucun seuil",
        "naif = TfidfVectorizer()",
        "matrice_naive = naif.fit_transform(questions)",
        "for q in ['Quel temps fera-t-il demain ?', 'Quand est-ce ouvert ?']:",
        "    s = cosine_similarity(naif.transform([q]), matrice_naive)[0]",
        "    print(q, '->', faq[s.argmax()][1], '(similarité', round(s.max(), 2), ')')",
      ),
      caption: "La version naïve répond toujours, même à côté : la météo de demain obtient la réponse sur les ateliers (0,42, à cause de « il »), et « Quand est-ce ouvert ? » celle sur l'inscription (0,50, à cause de « est »).",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `repondre(question)` : vectorisez la question avec `vectoriseur` (déjà entraîné, **sans accents ni mots vides**), calculez sa similarité cosinus avec chaque question de la FAQ (`matrice`), puis renvoyez la **réponse** de la question la plus proche, **sauf** si la meilleure similarité est inférieure à `SEUIL` (0,3) : renvoyez alors `INCONNU`.",
      setup: lines(FAQ, MOTS_VIDES, IMPORTS, VECTORISEUR),
      starter: lines(
        "def repondre(question):",
        "    similarites = cosine_similarity(vectoriseur.transform([question]), matrice)[0]",
        "    return faq[similarites.argmax()][1]",
      ),
      solution: lines(REPONDRE, "", "for q in ['horaires d ouverture', 'Quel temps fera-t-il demain ?']:", "    print(q, '->', repondre(q))"),
      test: lines(
        "assert repondre('horaires d ouverture') == faq[0][1], \"« horaires d ouverture » doit obtenir la réponse sur les horaires\"",
        "assert repondre('reserver un livre numerique') == faq[3][1], \"même sans accents, la question sur le livre numérique doit être reconnue\"",
        "assert repondre('Où se garer ?') == INCONNU, f\"aucune question de la FAQ ne parle de stationnement : on attend INCONNU (vous avez « {repondre('Où se garer ?')} »)\"",
        "assert repondre('Quel temps fera-t-il demain ?') == INCONNU, \"la météo n'est pas dans la FAQ : on attend INCONNU\"",
      ),
      hint: "Après le calcul des similarités : if similarites.max() < SEUIL: return INCONNU, sinon faq[similarites.argmax()][1].",
    },
    {
      kind: "text",
      md: `### Évaluer l'assistant

Essayer trois questions ne suffit pas. On prépare un **jeu de test** : des questions formulées autrement que dans la FAQ, chacune avec l'indice de la bonne réponse, ou \`None\` si l'assistant doit avouer ne pas savoir. Le taux de bonnes réponses sur ce jeu, et surtout l'examen des **erreurs**, guident les améliorations.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `evaluer(tests)` : `tests` est une liste de couples `(question, attendu)`, où `attendu` est l'indice de la bonne entrée de la FAQ, ou `None` si la bonne réponse est `INCONNU`. Renvoyez la **proportion** de questions pour lesquelles `repondre` donne la bonne réponse. Calculez ensuite `taux = evaluer(TESTS)`.",
      setup: lines(
        FAQ,
        MOTS_VIDES,
        IMPORTS,
        VECTORISEUR,
        REPONDRE,
        "TESTS = [",
        "    ('À quelle heure ouvre la médiathèque ?', 0),",
        "    ('combien de livres emprunter', 1),",
        "    ('Le wifi est-il gratuit ?', 5),",
        "    ('Puis-je réserver un livre ?', 3),",
        "    ('les enfants peuvent-ils venir ?', 4),",
        "    ('Quand est-ce ouvert ?', 0),",
        "    ('Combien coûte un café ?', None),",
        "    ('Où se garer ?', None),",
        "]",
      ),
      starter: lines("def evaluer(tests):", "    return 1.0", "", "taux = evaluer(TESTS)"),
      solution: lines(
        "def evaluer(tests):",
        "    bons = 0",
        "    for question, attendu in tests:",
        "        bonne = INCONNU if attendu is None else faq[attendu][1]",
        "        if repondre(question) == bonne:",
        "            bons += 1",
        "    return bons / len(tests)",
        "",
        "taux = evaluer(TESTS)",
        "print('taux de bonnes réponses :', taux)",
        "for question, attendu in TESTS:",
        "    print(question, '->', repondre(question))",
      ),
      test: lines(
        "assert evaluer([('Où se garer ?', None)]) == 1.0, \"une question hors FAQ attendue None doit compter juste quand repondre renvoie INCONNU\"",
        "assert evaluer([('Où se garer ?', 0)]) == 0.0, \"si repondre renvoie INCONNU alors qu'une réponse était attendue, c'est une erreur\"",
        "assert abs(taux - 0.75) < 1e-9, f\"l'assistant répond juste à 6 questions de test sur 8 : on attend 0.75 (vous avez {taux})\"",
      ),
      hint: "Pour chaque test, la bonne réponse est INCONNU si attendu is None, sinon faq[attendu][1] ; comptez les égalités et divisez par len(tests).",
    },
    {
      kind: "text",
      md: `### Lire les erreurs

Les deux erreurs sont instructives :

- « Quand est-ce ouvert ? » n'obtient rien (similarité nulle) : « ouvert » et « ouverture » sont deux mots différents pour TF-IDF. Une racinisation ou des **variantes de questions** dans la FAQ (« Quand est-ce ouvert ? », « À quelle heure ouvrez-vous ? ») corrigeraient ce cas ;
- « Combien coûte un café ? » reçoit la réponse sur l'emprunt de livres (similarité 0,50, à cause de « combien ») : exactement la même similarité que « À quelle heure ouvre la médiathèque ? », qui, elle, est juste. **Aucun seuil** ne sépare ces deux cas : il faut une meilleure représentation du sens.

Les assistants actuels remplacent TF-IDF par des **plongements de phrases** (des vecteurs calculés par un transformeur, où deux formulations d'une même question sont proches), et confient parfois la rédaction de la réponse à un grand modèle de langage, à partir des documents retrouvés : c'est la génération augmentée par la recherche (RAG) évoquée au module 7. Le principe reste celui de ce projet : retrouver d'abord, répondre ensuite, et savoir dire « je ne sais pas ».`,
    },
    {
      kind: "note",
      tone: "tip",
      md: "Pour aller plus loin : ajoutez à chaque entrée de la FAQ deux ou trois variantes de la question, écrivez dix nouvelles questions de test, et mesurez à nouveau le taux. Indiquez toujours clairement à l'utilisateur qu'il parle à un programme.",
    },
  ],
  quiz: [
    {
      question: "À quoi sert le seuil de similarité ?",
      options: [
        "À accélérer la recherche",
        "À répondre « je ne sais pas » quand aucune question de la FAQ n'est assez proche",
        "À supprimer les mots vides",
        "À traduire les questions",
      ],
      correct: 1,
      explanation: "Sans seuil, l'assistant renvoie toujours la question la plus proche, même quand elle n'a aucun rapport : mieux vaut avouer ne pas savoir.",
    },
    {
      question: "Pourquoi retirer les mots vides améliore-t-il cet assistant ?",
      options: [
        "Parce que les questions deviennent plus courtes à lire",
        "Parce que des mots comme « il » ou « est » créaient des ressemblances sans rapport avec le sens",
        "Parce que TF-IDF ne fonctionne pas avec les mots vides",
        "Cela ne change rien",
      ],
      correct: 1,
      explanation: "Dans la version naïve, la météo de demain ressemblait à la question sur les ateliers à cause du seul mot « il ».",
    },
    {
      question: "« Combien coûte un café ? » et « À quelle heure ouvre la médiathèque ? » ont la même similarité maximale (0,50). Qu'en conclure ?",
      options: [
        "Il suffit d'ajuster le seuil",
        "Le seuil ne peut pas séparer ces deux cas : il faut une meilleure représentation du sens (variantes, plongements de phrases)",
        "Les deux réponses sont justes",
        "Il faut retirer la question sur les horaires",
      ],
      correct: 1,
      explanation: "L'une est juste et l'autre fausse avec le même score : aucun seuil ne peut les départager. Le problème est dans la représentation.",
    },
  ],
};
