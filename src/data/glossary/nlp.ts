/**
 * Natural Language Processing
 * Text analysis, language models and text-processing techniques
 *
 * Style : définition dans la première phrase, puis de courts blocs à titre en gras (fonctionnement, exemple, pièges).
 * Les exemples reprennent ceux du cours « Traitement du langage naturel » (médiathèque fictive). Les extraits Python
 * sont exécutables avec NumPy et scikit-learn, et leur affichage écrit en commentaire est le vrai.
 * Les notions déjà présentes ailleurs ne sont pas répétées : Embeddings, Mécanisme d'attention, Attention multi-têtes,
 * Architecture Transformer, BERT, GPT, Modèles de langage (deep-learning.ts), Naive Bayes (machine-learning.ts).
 */

import { GlossaryEntry } from './types';

export const nlpTerms: GlossaryEntry[] = [
  {
    term: "Analyse de sentiment (Sentiment Analysis)",
    englishTerm: "Sentiment Analysis",
    description: `L'analyse de sentiment est une tâche de classification qui détermine l'attitude exprimée dans un texte : positive, négative, neutre, parfois une note sur une échelle. On l'applique par exemple à des avis de lecteurs.

**Trois familles de méthodes :**
• Un lexique : des listes de mots positifs et négatifs que l'on compte. Simple et transparent, mais aveugle au contexte.
• Un modèle appris : un classifieur (bayésien naïf, régression logistique...) entraîné sur des textes étiquetés, à partir d'un sac de mots ou de poids TF-IDF.
• Un modèle pré-entraîné de type BERT, ajusté sur la tâche, qui lit chaque mot dans le contexte de toute la phrase.

**Exemple :**
« Le café n'est pas bon » contient « bon » : un simple comptage de mots peut donc le juger positif. Marquer la négation (« pas non_bon »), ajouter des bigrammes ou utiliser un modèle qui lit la phrase entière aide à traiter ce cas.

**Pièges :**
• L'ironie (« Génial, encore fermé ! ») échappe à tout comptage de mots.
• Le vocabulaire dépend du domaine : un mot positif ici peut être négatif ailleurs.
• Les étiquettes sont subjectives : deux personnes classent parfois un avis différemment.
• Sur un petit corpus, un score ne prouve pas grand-chose : évaluez en validation croisée.`,
    category: "nlp",
    icon: "MessageSquare",
    level: "beginner",
    relatedTerms: [
      "Sac de mots (Bag of Words)",
      "TF-IDF (Term Frequency-Inverse Document Frequency)",
      "N-grammes (N-grams)",
      "Naive Bayes",
      "Mots vides (Stop Words)",
      "BERT (Bidirectional Encoder Representations from Transformers)"
    ],
    synonyms: ["Analyse d'opinion", "Opinion mining"]
  },
  {
    term: "TF-IDF (Term Frequency-Inverse Document Frequency)",
    englishTerm: "TF-IDF",
    description: `TF-IDF pondère chaque mot d'un document par deux quantités : sa fréquence dans ce document (TF) et la rareté du mot dans l'ensemble des documents (IDF). Un mot fréquent dans un document mais rare ailleurs reçoit un poids élevé : c'est souvent un bon résumé de ce document.

**Formule :**
TF-IDF(t, d) = TF(t, d) × IDF(t), où IDF(t) est de l'ordre de log(N / n_t), avec N le nombre de documents et n_t le nombre de documents qui contiennent le mot t. scikit-learn ajoute un lissage et normalise chaque vecteur.

**Exemple :**
Dans une série de phrases sur la médiathèque, le mot « médiathèque » figure dans plusieurs d'entre elles : son IDF est faible. « bande » et « dessinée », présents dans une seule phrase, pèsent davantage dans celle-ci.

**Usages :**
• Recherche de documents, avec la similarité cosinus.
• Entrée d'un classifieur de textes.
• Extraction de mots-clés.

**Limites :**
• L'ordre des mots et le sens sont ignorés : « voiture » et « automobile » sont deux colonnes sans lien.
• L'IDF dépend du corpus : il change si l'on ajoute des documents, et il est peu fiable avec très peu de documents.
• Le résultat dépend du prétraitement (mots vides, minuscules, filtrage par min_df et max_df).`,
    category: "nlp",
    icon: "BarChart3",
    level: "intermediate",
    relatedTerms: [
      "Sac de mots (Bag of Words)",
      "Similarité cosinus (Cosine Similarity)",
      "Mots vides (Stop Words)",
      "N-grammes (N-grams)"
    ]
  },
  {
    term: "N-grammes (N-grams)",
    englishTerm: "N-grams",
    description: `Un n-gramme est une suite de n éléments consécutifs d'un texte, mots ou caractères : un unigramme pour n = 1, un bigramme pour n = 2, un trigramme pour n = 3. Les n-grammes gardent un peu d'ordre local, que le sac de mots efface.

**Exemple :**
\`\`\`python
from sklearn.feature_extraction.text import CountVectorizer

vectoriseur = CountVectorizer(ngram_range=(2, 2))
vectoriseur.fit(["la médiathèque ouvre le samedi"])
print(vectoriseur.get_feature_names_out())
# ['la médiathèque' 'le samedi' 'médiathèque ouvre' 'ouvre le']
\`\`\`

**À quoi ils servent :**
• Capter des expressions : « pas bon » devient un indice à part entière.
• Estimer un modèle de langage : un modèle de bigrammes prédit le mot suivant à partir du seul mot précédent.
• Les n-grammes de caractères aident à reconnaître la langue d'un texte ou à tolérer les fautes de frappe.

**Compromis :**
• Un n petit garde peu de contexte, mais les n-grammes reviennent souvent et se généralisent bien.
• Un n grand garde plus de contexte, mais le nombre de colonnes explose et la plupart des n-grammes ne s'observent qu'une fois.
• On se limite souvent aux mots et aux paires de mots, soit ngram_range=(1, 2).`,
    category: "nlp",
    icon: "Layers",
    level: "beginner",
    relatedTerms: [
      "Sac de mots (Bag of Words)",
      "Tokenisation (Tokenization)",
      "Modèles de langage (Language Models)",
      "TF-IDF (Term Frequency-Inverse Document Frequency)"
    ]
  },
  {
    term: "Tokenisation (Tokenization)",
    englishTerm: "Tokenization",
    description: `La tokenisation découpe un texte en unités appelées tokens : le plus souvent des mots, des morceaux de mots ou des caractères. C'est la première étape de presque tout traitement du langage, car un programme manipule une suite de tokens plutôt que du texte brut.

**Comment faire :**
• Couper sur les espaces est le plus simple, mais la ponctuation reste collée aux mots (« heures. »).
• Une expression régulière comme \`\\w+\` ne garde que les suites de lettres et de chiffres.
• Les modèles récents découpent en sous-mots (voir « Tokenisation en sous-mots »).

**Exemple :**
\`\`\`python
import re

phrase = "L'atelier de Saint-Nazaire coûte 7,50 euros."
print(phrase.split())
# ["L'atelier", 'de', 'Saint-Nazaire', 'coûte', '7,50', 'euros.']
print(re.findall(r"\\w+", phrase))
# ['L', 'atelier', 'de', 'Saint', 'Nazaire', 'coûte', '7', '50', 'euros']
\`\`\`

**Pièges :**
En français, les apostrophes, les traits d'union et les virgules décimales font couper au mauvais endroit : ici « Saint-Nazaire » et « 7,50 » sont chacun coupés en deux. Le bon découpage dépend de la langue et de la tâche. Les bibliothèques spécialisées, comme spaCy, embarquent des règles propres à chaque langue.`,
    category: "nlp",
    icon: "Hash",
    level: "beginner",
    relatedTerms: [
      "Tokenisation en sous-mots (Subword Tokenization)",
      "Mots vides (Stop Words)",
      "Sac de mots (Bag of Words)",
      "N-grammes (N-grams)"
    ],
    synonyms: ["Token", "Découpage du texte"]
  },
  {
    term: "Tokenisation en sous-mots (Subword Tokenization)",
    englishTerm: "Subword Tokenization",
    description: `La tokenisation en sous-mots découpe les mots rares en morceaux plus fréquents et garde les mots courants entiers. Le vocabulaire reste de taille raisonnable (quelques dizaines de milliers d'unités) et aucun mot n'est totalement inconnu.

**Comment ça marche :**
• BPE (Byte-Pair Encoding) part des caractères et fusionne, étape après étape, la paire de symboles voisins la plus fréquente du corpus, jusqu'à atteindre la taille de vocabulaire voulue. Son emploi pour la traduction automatique a été proposé par Sennrich et al. (2016).
• WordPiece, utilisé par BERT, suit une idée voisine mais choisit ses morceaux selon un autre critère statistique.
• Les modèles de la famille GPT utilisent une variante de BPE.

**Exemple (illustratif) :**
Un mot comme « médiathèque » peut être coupé en « média » et « thèque ». Le découpage réel dépend du vocabulaire appris sur le corpus d'entraînement.

**À savoir :**
• La longueur d'un texte, pour ces modèles, se compte en tokens et non en mots.
• Un mot rare, un nom propre ou une faute de frappe coûtent plusieurs tokens.
• Un vocabulaire appris surtout sur une langue découpe souvent plus finement les autres.`,
    category: "nlp",
    icon: "Divide",
    level: "intermediate",
    relatedTerms: [
      "Tokenisation (Tokenization)",
      "BERT (Bidirectional Encoder Representations from Transformers)",
      "GPT (Generative Pre-trained Transformer)",
      "Modèles de langage (Language Models)"
    ],
    synonyms: ["BPE", "Byte-Pair Encoding", "WordPiece"]
  },
  {
    term: "Mots vides (Stop Words)",
    englishTerm: "Stop Words",
    description: `Les mots vides sont des mots très fréquents qui portent peu de sens par eux-mêmes : « le », « de », « et », « un »... On les retire souvent avant de compter les mots, pour que les mots porteurs du sujet ressortent.

**Comment ça marche :**
On dispose d'une liste et l'on écarte les tokens qui y figurent. NLTK et spaCy en proposent une pour le français ; scikit-learn n'en intègre qu'une pour l'anglais, mais le paramètre stop_words des vectoriseurs accepte la liste de votre choix.

**Exemple :**
« Le prêt de livres est gratuit » devient « prêt livres gratuit ».

**Pièges :**
• Aucune liste n'est universelle : elle se choisit et se relit selon la tâche.
• Ces mots peuvent compter. Retirer « ne » et « pas » transforme « pas bon » en « bon », ce qui est désastreux pour l'analyse de sentiment.
• Pour chercher des documents par thème, les retirer aide. Pour la traduction ou la génération de texte, on les garde.
• Les modèles de type BERT reçoivent tous les mots, car ils tirent parti de la phrase entière.`,
    category: "nlp",
    icon: "Wrench",
    level: "beginner",
    relatedTerms: [
      "Tokenisation (Tokenization)",
      "TF-IDF (Term Frequency-Inverse Document Frequency)",
      "Analyse de sentiment (Sentiment Analysis)"
    ],
    synonyms: ["Stopwords", "Mots outils"]
  },
  {
    term: "Racinisation (Stemming)",
    englishTerm: "Stemming",
    description: `La racinisation ramène les variantes d'un mot à une racine commune en coupant leurs terminaisons selon des règles : « gratuit », « gratuite » et « gratuits » donnent la même racine, et les comptages les regroupent.

**Comment ça marche :**
Un raciniseur applique une suite de règles sur les suffixes, sans dictionnaire ni analyse grammaticale. Il est rapide. NLTK propose le raciniseur Snowball pour le français.

**Exemple :**
Avec une règle simpliste qui retire la terminaison « ent », « parent » devient « par » et « moment » devient « mom » : ce sont des racines, pas des mots. Les vrais raciniseurs ont des dizaines de règles et d'exceptions, mais restent imparfaits.

**Pièges :**
• Il regroupe parfois à tort des mots sans rapport.
• Il en laisse d'autres séparés : « ouvert » et « ouverture » gardent des racines différentes.
• La racine n'est pas toujours lisible, ce qui gêne l'interprétation.
• La lemmatisation est plus fidèle, mais demande un dictionnaire et une analyse grammaticale.`,
    category: "nlp",
    icon: "TreePine",
    level: "beginner",
    relatedTerms: [
      "Lemmatisation (Lemmatization)",
      "Tokenisation (Tokenization)",
      "Mots vides (Stop Words)"
    ],
    synonyms: ["Stemming"]
  },
  {
    term: "Lemmatisation (Lemmatization)",
    englishTerm: "Lemmatization",
    description: `La lemmatisation ramène chaque mot à son lemme, c'est-à-dire sa forme de dictionnaire : l'infinitif pour un verbe, le singulier pour un nom, le masculin singulier pour un adjectif. « sont » devient « être » et « chevaux » devient « cheval ».

**Comment ça marche :**
Il faut connaître la nature grammaticale du mot (verbe, nom, adjectif...) et disposer d'un dictionnaire ou d'un modèle appris. En Python, spaCy fournit un lemmatiseur pour le français.

**Exemple :**
La phrase « Les ateliers sont gratuits » se ramène aux lemmes « le », « atelier », « être » et « gratuit ». Les trois formes « gratuit », « gratuite » et « gratuits » partagent ainsi un seul lemme.

**Pièges :**
• Le contexte est nécessaire : « est » est le verbe « être » dans « il est là », mais le point cardinal dans « l'est de la France ».
• C'est plus lent que la racinisation.
• Les mots rares, les noms propres et les fautes de frappe sont plus souvent mal traités.
• Les modèles récents s'en passent le plus souvent, mais les méthodes à base de comptages en profitent.`,
    category: "nlp",
    icon: "BookOpen",
    level: "beginner",
    relatedTerms: [
      "Racinisation (Stemming)",
      "Tokenisation (Tokenization)",
      "Sac de mots (Bag of Words)"
    ]
  },
  {
    term: "Sac de mots (Bag of Words)",
    englishTerm: "Bag of Words",
    description: `Le sac de mots représente un texte par le nombre de fois où il contient chaque mot d'un vocabulaire fixé. L'ordre des mots est perdu, d'où le nom : on a vidé les mots dans un sac.

**Comment ça marche :**
On construit le vocabulaire (tous les mots vus dans les textes), puis chaque texte devient un vecteur : une colonne par mot, dont la valeur est le nombre d'occurrences. Ces vecteurs alimentent un classifieur ou une mesure de similarité.

**Exemple :**
\`\`\`python
from sklearn.feature_extraction.text import CountVectorizer

phrases = ["la médiathèque ouvre le samedi", "le samedi la médiathèque ouvre"]
vectoriseur = CountVectorizer()
matrice = vectoriseur.fit_transform(phrases)
print(vectoriseur.get_feature_names_out())
# ['la' 'le' 'médiathèque' 'ouvre' 'samedi']
print(matrice.toarray())
# [[1 1 1 1 1]
#  [1 1 1 1 1]]
\`\`\`

**Pièges :**
• Deux phrases dont l'ordre diffère ont le même vecteur. Les n-grammes rendent un peu d'ordre.
• Les vecteurs sont immenses et presque toujours nuls (matrices creuses).
• CountVectorizer passe en minuscules et ignore par défaut les mots d'une seule lettre.
• Deux mots de sens proche occupent deux colonnes sans lien, ce que les plongements corrigent en partie.`,
    category: "nlp",
    icon: "Database",
    level: "beginner",
    relatedTerms: [
      "TF-IDF (Term Frequency-Inverse Document Frequency)",
      "N-grammes (N-grams)",
      "Similarité cosinus (Cosine Similarity)",
      "Embeddings"
    ],
    synonyms: ["Bag-of-words", "BoW"]
  },
  {
    term: "Similarité cosinus (Cosine Similarity)",
    englishTerm: "Cosine Similarity",
    description: `La similarité cosinus mesure la ressemblance de deux vecteurs par l'angle qu'ils forment, et non par leur longueur : cos(a, b) = (a · b) / (‖a‖ × ‖b‖), le produit scalaire divisé par le produit des normes.

**Comment ça marche :**
Elle vaut 1 si les deux vecteurs pointent dans la même direction, 0 s'ils sont orthogonaux et -1 s'ils sont opposés. Avec des comptages de mots ou des poids TF-IDF, jamais négatifs, elle va de 0 (aucun mot en commun) à 1. Comme la longueur ne compte pas, un long document et un court qui ont les mêmes proportions de mots obtiennent 1.

**Exemple :**
\`\`\`python
import numpy as np

def cosinus(a, b):
    a, b = np.array(a, dtype=float), np.array(b, dtype=float)
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))

print(round(cosinus([1, 1, 0], [2, 2, 0]), 2))  # 1.0
print(round(cosinus([1, 1, 0], [1, 0, 1]), 2))  # 0.5
print(round(cosinus([1, 1, 0], [0, 0, 1]), 2))  # 0.0
\`\`\`

**Usage et limites :**
Un petit moteur de recherche en découle : on vectorise la question avec le même vectoriseur que les documents (transform, pas fit_transform), puis on renvoie le document le plus proche. Mais « ouvert » et « ouverture » n'ont aucun mot en commun : la similarité est nulle.`,
    category: "nlp",
    icon: "Target",
    level: "intermediate",
    relatedTerms: [
      "TF-IDF (Term Frequency-Inverse Document Frequency)",
      "Sac de mots (Bag of Words)",
      "Embeddings",
      "Génération augmentée par la recherche (RAG)"
    ]
  },
  {
    term: "Reconnaissance d'entités nommées (NER)",
    englishTerm: "Named Entity Recognition",
    description: `La reconnaissance d'entités nommées repère, dans un texte, les segments qui désignent un objet précis (personne, lieu, organisation, date, montant...) et leur attribue un type. C'est une tâche d'extraction d'information.

**Deux approches :**
• Des règles : expressions régulières et listes de noms. Très bien pour les formats fixes (dates numériques, montants, adresses électroniques), fragile pour le reste.
• Des modèles appris sur des textes annotés à la main, souvent au format BIO : ils s'appuient sur le contexte.

Les modèles français de spaCy distinguent PER (personnes), LOC (lieux), ORG (organisations) et MISC (divers). Ils ne repèrent ni les dates ni les montants, que l'on confie volontiers à des règles.

**Exemple :**
Dans « Mme Durand a réservé la salle de la médiathèque de Nantes pour 45 € », « Durand » (ou « Mme Durand », selon la convention d'annotation) est une personne, « Nantes » un lieu, « 45 € » un montant.

**Pièges :**
• Le type dépend du contexte : « Durand » est une personne après « Mme », un lieu dans « rue Durand ».
• Les conventions d'annotation varient d'un corpus à l'autre.
• Un modèle est moins sûr sur un domaine éloigné de ses données d'entraînement : vérifiez sur un échantillon de vos textes.`,
    category: "nlp",
    icon: "Eye",
    level: "intermediate",
    relatedTerms: [
      "Annotation BIO (BIO Tagging)",
      "Tokenisation (Tokenization)"
    ],
    synonyms: ["NER", "Extraction d'entités", "Entités nommées"]
  },
  {
    term: "Annotation BIO (BIO Tagging)",
    englishTerm: "BIO Tagging",
    description: `L'annotation BIO est une façon d'étiqueter un texte mot par mot pour marquer les entités nommées. Chaque mot reçoit B-TYPE (begin : premier mot d'une entité), I-TYPE (inside : mot suivant de la même entité) ou O (outside : hors entité).

**Exemple :**
Pour « Mme Durand habite Saint-Nazaire » :
\`\`\`
Mme            B-PER
Durand         I-PER
habite         O
Saint-Nazaire  B-LOC
\`\`\`

**Pourquoi deux étiquettes B et I :**
Elles indiquent où une entité commence, donc deux entités du même type côte à côte restent séparées. Le modèle apprend à prédire une étiquette par mot, en tenant compte des mots voisins ; on reconstitue ensuite les entités en regroupant chaque B- avec les I- qui le suivent.

**Variantes et limites :**
• Les formats BILOU et BIOES ajoutent des étiquettes pour le dernier mot et pour les entités d'un seul mot.
• Certaines suites sont incohérentes (I-LOC juste après O) : il faut les corriger ou les interdire au décodage.
• Une entité contenue dans une autre (« Université de Nantes » contient « Nantes ») ne s'exprime pas avec une seule couche d'étiquettes.`,
    category: "nlp",
    icon: "CheckCircle",
    level: "intermediate",
    relatedTerms: [
      "Reconnaissance d'entités nommées (NER)",
      "Tokenisation (Tokenization)"
    ],
    synonyms: ["BIO", "IOB", "Format BIO"]
  },
  {
    term: "Word2vec",
    englishTerm: "Word2vec",
    description: `Word2vec est une méthode, publiée par Mikolov et al. en 2013, qui apprend un plongement de mots : chaque mot reçoit un vecteur de quelques centaines de nombres, appris pour que des mots employés dans des contextes semblables aient des vecteurs proches.

**Comment ça marche :**
Un réseau de neurones très simple s'entraîne sur un grand corpus à une tâche de prédiction : deviner un mot à partir de ses voisins (variante CBOW), ou deviner les voisins à partir d'un mot (variante skip-gram). Les vecteurs sont un sous-produit de cet entraînement.

**Exemple :**
« livre » et « roman » apparaissent dans des contextes proches (« emprunter un... ») : leurs vecteurs sont voisins, alors que dans un sac de mots ce sont deux colonnes sans lien. Les auteurs ont aussi remarqué que certaines relations deviennent des directions : en anglais, vecteur(king) - vecteur(man) + vecteur(woman) est proche de vecteur(queen). Ce résultat célèbre ne se vérifie pas à tous les coups.

**Limites :**
• Un seul vecteur par mot, quel que soit le sens : « avocat » a le même vecteur au tribunal et dans une salade. Les transformeurs calculent un vecteur par mot dans sa phrase, grâce à l'attention.
• Les vecteurs reflètent le corpus d'entraînement, avec ses biais.`,
    category: "nlp",
    icon: "Network",
    level: "intermediate",
    relatedTerms: [
      "Embeddings",
      "Mécanisme d'attention (Attention Mechanism)",
      "Sac de mots (Bag of Words)"
    ],
    synonyms: ["Plongement de mots", "Word embedding"]
  },
  {
    term: "Température (Temperature)",
    englishTerm: "Temperature",
    description: `En génération de texte, la température est un réglage qui rend le choix du mot suivant plus ou moins aléatoire. Le modèle calcule un score pour chaque mot possible ; on divise ces scores par la température T avant de les transformer en probabilités avec la fonction softmax.

**Effet de T :**
• T petit (0,2) : la distribution se concentre sur le mot le plus probable, le texte est prévisible et répétitif. À la limite, on choisit toujours ce mot.
• T = 1 : les probabilités du modèle, telles quelles.
• T grand : la distribution s'aplatit, le texte devient plus varié, puis incohérent.

**Exemple :**
\`\`\`python
import numpy as np

def probas(scores, temperature):
    z = np.array(scores, dtype=float) / temperature
    e = np.exp(z - z.max())
    return e / e.sum()

for t in [0.2, 1, 5]:
    print(t, probas([2.0, 1.0, 0.0], t).round(3))
# 0.2 [0.993 0.007 0.   ]
# 1 [0.665 0.245 0.09 ]
# 5 [0.402 0.329 0.269]
\`\`\`

**Limite :**
Baisser la température rend les réponses plus stables, pas plus exactes : un modèle peut répéter la même erreur à chaque essai.`,
    category: "nlp",
    icon: "Gauge",
    level: "intermediate",
    relatedTerms: [
      "Modèles de langage (Language Models)",
      "Hallucination des modèles de langage (Hallucination)",
      "GPT (Generative Pre-trained Transformer)"
    ]
  },
  {
    term: "Hallucination des modèles de langage (Hallucination)",
    englishTerm: "Hallucination",
    description: `On parle d'hallucination quand un modèle de langage produit une réponse fluide et assurée, mais fausse ou sans fondement : un fait inventé, une référence qui n'existe pas, un détail erroné.

**Pourquoi cela arrive :**
Un modèle de langage produit, mot après mot, une suite plausible au vu de ses données d'entraînement. Il ne consulte pas de base de faits, et plausible ne veut pas dire vrai. Quand l'information lui manque, il peut compléter quand même.

**Exemple :**
Demandez à un modèle les horaires d'une médiathèque qu'il ne connaît pas : il peut répondre par des horaires vraisemblables, et pourtant inventés.

**Pour s'en protéger :**
• Lui fournir les documents pertinents dans la question et lui demander de s'y limiter (voir la génération augmentée par la recherche).
• Lui permettre de répondre « je ne sais pas ».
• Vérifier ses affirmations, surtout les chiffres, les citations et les références.
• Ne pas lui confier seul une décision qui engage quelqu'un.

**Limite :**
Ces mesures réduisent le risque sans l'éliminer, et un ton assuré n'est pas un indice de justesse.`,
    category: "nlp",
    icon: "AlertTriangle",
    level: "beginner",
    relatedTerms: [
      "Génération augmentée par la recherche (RAG)",
      "Modèles de langage (Language Models)",
      "Température (Temperature)",
      "GPT (Generative Pre-trained Transformer)"
    ],
    synonyms: ["Confabulation"]
  },
  {
    term: "Génération augmentée par la recherche (RAG)",
    englishTerm: "Retrieval-Augmented Generation",
    description: `La génération augmentée par la recherche (RAG) associe un moteur de recherche à un modèle de langage : on retrouve d'abord les passages pertinents dans une collection de documents, puis on les donne au modèle avec la question pour qu'il rédige sa réponse à partir d'eux. Le terme vient de Lewis et al. (2020) ; il désigne aujourd'hui plus largement ce schéma « retrouver, puis rédiger ».

**Comment ça marche :**
1. Découper les documents en passages et les représenter par des vecteurs (TF-IDF ou plongements de phrases).
2. Vectoriser la question et retrouver les passages les plus proches, par similarité cosinus.
3. Composer une consigne qui contient la question et ces passages.
4. Demander au modèle de répondre en s'appuyant sur eux, en citant ses sources.

**Exemple :**
L'assistant de foire aux questions de la médiathèque fait déjà la partie « retrouver » : TF-IDF, similarité cosinus et un seuil pour dire « je ne sais pas ». Confier la rédaction de la réponse à un modèle, à partir de la réponse retrouvée, en ferait un RAG minimal.

**Limites :**
• Si la recherche ramène le mauvais passage, ou aucun, la réponse est mauvaise.
• Le modèle peut ignorer ou déformer les passages : l'hallucination reste possible.
• Les documents doivent être tenus à jour.`,
    category: "nlp",
    icon: "Search",
    level: "intermediate",
    relatedTerms: [
      "Hallucination des modèles de langage (Hallucination)",
      "Similarité cosinus (Cosine Similarity)",
      "TF-IDF (Term Frequency-Inverse Document Frequency)",
      "Embeddings",
      "Modèles de langage (Language Models)"
    ],
    synonyms: ["RAG", "Retrieval-Augmented Generation"]
  }
];
