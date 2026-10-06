import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

/** 40 avis courts, fictifs, écrits pour l'exercice (20 positifs, 20 négatifs), sur une médiathèque et son café */
const CORPUS = lines(
  "import numpy as np",
  "",
  "avis = [",
  "    ('Accueil chaleureux et conseils précieux, je reviendrai', 1),",
  "    ('Très bon choix de bandes dessinées, bravo à l équipe', 1),",
  "    ('Le café est délicieux et les gâteaux excellents', 1),",
  "    ('Endroit calme, parfait pour lire tranquillement', 1),",
  "    ('Personnel aimable et très disponible', 1),",
  "    ('Super atelier pour les enfants, ils ont adoré', 1),",
  "    ('Belle sélection de romans, j ai trouvé mon bonheur', 1),",
  "    ('Les horaires du samedi sont pratiques, merci', 1),",
  "    ('Très agréable, lumineux et bien rangé', 1),",
  "    ('Excellente soirée lecture, ambiance conviviale', 1),",
  "    ('Le prêt numérique fonctionne parfaitement', 1),",
  "    ('Bibliothécaires passionnés, conseils excellents', 1),",
  "    ('J adore le coin des jeux de société', 1),",
  "    ('Inscription rapide et simple, très bien', 1),",
  "    ('Un lieu chaleureux, on s y sent bien', 1),",
  "    ('Bonne surprise, beaucoup de nouveautés', 1),",
  "    ('Le café propose un très bon chocolat chaud', 1),",
  "    ('Merci pour la réservation rapide de mon livre', 1),",
  "    ('Spectacle génial, les enfants étaient ravis', 1),",
  "    ('Wifi rapide et places nombreuses, parfait pour travailler', 1),",
  "    ('Attente interminable au comptoir, très décevant', 0),",
  "    ('Le café était froid et cher', 0),",
  "    ('Trop de bruit, impossible de se concentrer', 0),",
  "    ('Personnel désagréable, je ne reviendrai pas', 0),",
  "    ('Le livre réservé n est jamais arrivé', 0),",
  "    ('Horaires trop courts, c est fermé quand je suis libre', 0),",
  "    ('Le wifi ne marche jamais, très frustrant', 0),",
  "    ('Les toilettes étaient sales, décevant', 0),",
  "    ('Atelier annulé sans prévenir, mauvaise organisation', 0),",
  "    ('Rayons en désordre, impossible de trouver quoi que ce soit', 0),",
  "    ('Le prêt numérique plante sans arrêt', 0),",
  "    ('Accueil froid et réponses sèches', 0),",
  "    ('Gâteaux secs et sans goût, décevant', 0),",
  "    ('Trop peu de nouveautés, choix pauvre', 0),",
  "    ('Inscription compliquée, formulaire interminable', 0),",
  "    ('Chaises inconfortables et lumière faible', 0),",
  "    ('Retard de remboursement de la caution, agaçant', 0),",
  "    ('Ambiance tendue, mauvaise expérience', 0),",
  "    ('Le spectacle était ennuyeux et trop long', 0),",
  "    ('Impossible de se garer, très pénible', 0),",
  "]",
  "textes = [t for t, _ in avis]",
  "etiquettes = np.array([e for _, e in avis])",
);

export const projectSentiment: LessonModule = {
  id: "beginner-4",
  title: "Projet guidé : analyser le sentiment d'avis courts",
  duration: "3 h",
  summary: "Quarante avis fictifs sur une médiathèque : une première méthode à base de listes de mots, puis un modèle appris, et un regard lucide sur leurs limites.",
  objectives: [
    "Transformer des textes en nombres (sac de mots, TF-IDF)",
    "Construire une méthode simple à base de lexique, puis un classifieur appris",
    "Évaluer en validation croisée sur un petit corpus, et lire les mots qui comptent",
    "Reconnaître les limites : négation, ironie, vocabulaire absent de l'entraînement",
  ],
  sections: [
    {
      kind: "text",
      md: `### Le contexte

Une médiathèque reçoit des avis courts et voudrait les trier automatiquement en **positifs** et **négatifs**, pour repérer vite les problèmes. Le corpus du projet compte **40 avis fictifs**, écrits pour l'exercice (20 positifs, 20 négatifs), sans apostrophes pour simplifier le découpage en mots.

Un corpus aussi petit sert à **comprendre la méthode**, pas à obtenir un outil fiable : un vrai projet demanderait des milliers d'avis annotés. Les outils clé en main comme TextBlob ou VADER sont conçus pour l'anglais ; en français, on construit sa méthode ou l'on choisit un modèle entraîné sur du français.`,
    },
    {
      kind: "text",
      md: "### Étape 1 : une méthode à base de lexique\n\nIdée la plus simple : deux listes de mots, positifs et négatifs ; un avis est positif s'il contient plus de mots positifs que de mots négatifs. C'est transparent, rapide, et souvent étonnamment correct... jusqu'à la première négation.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez la fonction `sentiment_lexique(texte)` : elle met le texte en **minuscules**, le découpe en mots (`split()`), compte les mots présents dans `POSITIFS` et dans `NEGATIFS`, et renvoie **1** s'il y a plus de mots positifs, **0** sinon. Rangez ensuite son exactitude sur tout le corpus dans `exactitude_lexique`.",
      setup: lines(
        CORPUS,
        "POSITIFS = {'chaleureux', 'bon', 'bonne', 'délicieux', 'excellents', 'excellente', 'parfait', 'aimable', 'adoré', 'bonheur', 'agréable', 'conviviale', 'parfaitement', 'passionnés', 'adore', 'génial', 'ravis', 'bravo', 'merci', 'super', 'rapide', 'bien'}",
        "NEGATIFS = {'décevant', 'froid', 'cher', 'bruit', 'impossible', 'désagréable', 'jamais', 'sales', 'annulé', 'mauvaise', 'désordre', 'plante', 'sèches', 'pauvre', 'compliquée', 'inconfortables', 'agaçant', 'tendue', 'ennuyeux', 'pénible', 'frustrant', 'interminable'}",
      ),
      starter: lines("def sentiment_lexique(texte):", "    return 1", "", "exactitude_lexique = None"),
      solution: lines(
        "def sentiment_lexique(texte):",
        "    mots = texte.lower().split()",
        "    positifs = sum(mot in POSITIFS for mot in mots)",
        "    negatifs = sum(mot in NEGATIFS for mot in mots)",
        "    return 1 if positifs > negatifs else 0",
        "",
        "predictions = np.array([sentiment_lexique(t) for t in textes])",
        "exactitude_lexique = (predictions == etiquettes).mean()",
        "print(exactitude_lexique)",
        "for t, p, e in zip(textes, predictions, etiquettes):",
        "    if p != e:",
        "        print('erreur :', t)",
      ),
      test: lines(
        "assert sentiment_lexique('Accueil chaleureux et conseils précieux') == 1, \"un avis avec un mot positif et aucun négatif doit valoir 1\"",
        "assert sentiment_lexique('Le café était froid et cher') == 0, \"un avis avec deux mots négatifs doit valoir 0\"",
        "assert sentiment_lexique('Tout va BIEN') == 1, \"pensez à mettre le texte en minuscules\"",
        "assert exactitude_lexique is not None and exactitude_lexique > 0.8, f\"l'exactitude du lexique sur le corpus devrait dépasser 0,8 (vous avez {exactitude_lexique})\"",
      ),
      hint: "texte.lower().split() donne la liste des mots ; sum(mot in POSITIFS for mot in mots) compte les mots positifs.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Le corrigé ne trouve aucune erreur sur le corpus : normal, les listes de mots ont été écrites en lisant ces mêmes avis. Ce score parfait ne prouve donc rien. Essayez plutôt des phrases nouvelles comme « pas bon du tout » ou « le spectacle n'était pas ennuyeux » : la méthode ignore la négation, l'ironie (« génial, encore fermé ») et tout mot absent de ses listes.",
    },
    {
      kind: "text",
      md: `### Étape 2 : des textes aux nombres

Pour qu'un modèle apprenne, chaque texte devient un vecteur :

- le **sac de mots** (\`CountVectorizer\`) compte les occurrences de chaque mot du vocabulaire, sans tenir compte de l'ordre ;
- **TF-IDF** (\`TfidfVectorizer\`) pondère ces comptes : un mot fréquent dans un avis mais rare dans le corpus pèse plus lourd qu'un mot présent partout (« le », « et »).

On obtient une grande matrice (un avis par ligne, un mot par colonne), surtout remplie de zéros.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        CORPUS,
        "from sklearn.feature_extraction.text import TfidfVectorizer",
        "",
        "vectoriseur = TfidfVectorizer()",
        "matrice = vectoriseur.fit_transform(textes)",
        "print('forme :', matrice.shape, ' (avis, mots du vocabulaire)')",
        "print('quelques mots :', list(vectoriseur.get_feature_names_out()[:12]))",
      ),
      caption: "Chaque avis devient une ligne de plus de 150 nombres, presque tous nuls : seuls ses propres mots ont un poids.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Construisez un pipeline `modele` qui enchaîne **`TfidfVectorizer()`** et une **régression logistique**, et rangez son exactitude moyenne en **validation croisée stratifiée à 5 plis** sur tout le corpus dans `exactitude_cv`.",
      setup: CORPUS,
      starter: lines(
        "from sklearn.feature_extraction.text import TfidfVectorizer",
        "from sklearn.linear_model import LogisticRegression",
        "from sklearn.pipeline import make_pipeline",
        "from sklearn.model_selection import cross_val_score",
        "",
        "modele = None",
        "exactitude_cv = None",
      ),
      solution: lines(
        "from sklearn.feature_extraction.text import TfidfVectorizer",
        "from sklearn.linear_model import LogisticRegression",
        "from sklearn.pipeline import make_pipeline",
        "from sklearn.model_selection import cross_val_score",
        "",
        "modele = make_pipeline(TfidfVectorizer(), LogisticRegression())",
        "exactitude_cv = cross_val_score(modele, textes, etiquettes, cv=5).mean()",
        "print(round(exactitude_cv, 3))",
      ),
      test: lines(
        "from sklearn.pipeline import Pipeline as _P",
        "assert isinstance(modele, _P), \"modele doit être un pipeline (make_pipeline)\"",
        "assert [type(e).__name__ for _, e in modele.steps] == ['TfidfVectorizer', 'LogisticRegression'], \"étapes attendues : TfidfVectorizer puis LogisticRegression\"",
        "assert exactitude_cv is not None and 0 <= exactitude_cv <= 1, \"rangez la moyenne des scores de validation croisée dans exactitude_cv\"",
      ),
      hint: "make_pipeline(TfidfVectorizer(), LogisticRegression()), puis cross_val_score(modele, textes, etiquettes, cv=5).mean().",
    },
    {
      kind: "text",
      md: "### Étape 3 : ce que le modèle a appris\n\nAvec une régression logistique, chaque mot reçoit un coefficient : positif, il pousse vers « avis positif » ; négatif, vers « avis négatif ». Les lire est le meilleur moyen de vérifier que le modèle s'appuie sur des indices sensés, et pas sur des hasards du corpus.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        CORPUS,
        "from sklearn.feature_extraction.text import TfidfVectorizer",
        "from sklearn.linear_model import LogisticRegression",
        "from sklearn.pipeline import make_pipeline",
        "",
        "modele = make_pipeline(TfidfVectorizer(), LogisticRegression()).fit(textes, etiquettes)",
        "mots = modele[0].get_feature_names_out()",
        "coefs = modele[1].coef_[0]",
        "ordre = np.argsort(coefs)",
        "print('vers négatif :', list(mots[ordre[:8]]))",
        "print('vers positif :', list(mots[ordre[-8:]][::-1]))",
        "nouveaux = ['Super ambiance et café excellent', 'Attente trop longue, très décevant', 'Pas bon du tout']",
        "print(dict(zip(nouveaux, modele.predict(nouveaux))))",
      ),
      caption: "Sur un corpus de 40 avis, certains mots « appris » relèvent du hasard ; et « Pas bon du tout » montre que la négation reste un piège pour un sac de mots.",
    },
    {
      kind: "text",
      md: `### Étape 4 : conclure honnêtement

- Le **lexique** obtient un score parfait, mais il a été construit en lisant le corpus : ce chiffre ne mesure rien. Le **modèle appris** n'atteint qu'environ 70 % en validation croisée : avec 32 avis d'entraînement par pli, il n'a vu la plupart des mots qu'une ou deux fois. Ni l'un ni l'autre ne dit ce qui se passerait sur de vrais avis.
- Le lexique est transparent mais rigide ; le modèle appris s'adapte au vocabulaire mais demande beaucoup d'exemples annotés, et s'appuie ici en partie sur des mots sans rapport avec le sentiment (« pour », « les », « était »).
- Les deux trébuchent sur la **négation** et l'**ironie**. Les modèles récents qui lisent la phrase entière (comme ceux présentés dans le cours sur les transformers) gèrent bien mieux ces cas.

Pour aller plus loin : ajoutez les paires de mots (\`TfidfVectorizer(ngram_range=(1, 2))\`) pour que « pas bon » devienne un indice à part entière, et écrivez vingt nouveaux avis pour tester le modèle sur des phrases qu'il n'a jamais vues.`,
    },
  ],
  quiz: [
    {
      question: "Que fait un sac de mots (CountVectorizer) ?",
      options: [
        "Il traduit le texte",
        "Il compte les occurrences de chaque mot du vocabulaire, sans tenir compte de leur ordre",
        "Il corrige l'orthographe",
        "Il garde seulement le premier mot",
      ],
      correct: 1,
      explanation: "Chaque texte devient un vecteur de comptes. L'ordre est perdu : « pas bon » et « bon, pas » donnent le même vecteur.",
    },
    {
      question: "Pourquoi TF-IDF donne-t-il peu de poids à des mots comme « le » ou « et » ?",
      options: [
        "Parce qu'ils sont courts",
        "Parce qu'ils apparaissent dans presque tous les textes et ne distinguent donc rien",
        "Parce qu'ils sont supprimés d'office",
        "Parce qu'ils sont positifs",
      ],
      correct: 1,
      explanation: "La partie IDF réduit le poids des mots présents partout ; les mots rares et caractéristiques pèsent davantage.",
    },
    {
      question: "Quel est le principal piège commun au lexique et au sac de mots ?",
      options: [
        "Les textes longs",
        "La négation et l'ironie",
        "Les majuscules",
        "Les chiffres",
      ],
      correct: 1,
      explanation: "« Pas bon » contient le mot « bon » ; « génial, encore fermé » contient « génial ». Sans lire la phrase dans son ensemble, ces méthodes se trompent.",
    },
  ],
};
