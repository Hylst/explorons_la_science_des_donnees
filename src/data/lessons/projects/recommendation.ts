import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

/**
 * Emprunts fictifs d'une médiathèque : 400 lecteurs, 120 livres de 5 genres, générés avec une graine fixe.
 * Chaque lecteur a des goûts par genre (tirés au hasard) et chaque livre une popularité : l'emprunt en dépend.
 */
const DONNEES = lines(
  "import numpy as np",
  "import pandas as pd",
  "",
  "rng = np.random.default_rng(3)",
  "genres = ['Polar', 'SF', 'Roman', 'BD', 'Histoire']",
  "livres = pd.DataFrame({'genre': np.repeat(genres, 24)})",
  "livres['titre'] = [f'{g} {i + 1}' for g in genres for i in range(24)]",
  "popularite = rng.lognormal(0, 0.8, len(livres))",
  "gouts = rng.dirichlet(np.full(len(genres), 0.4), 400)  # goûts inventés de 400 lecteurs",
  "code_genre = livres['genre'].map({g: k for k, g in enumerate(genres)}).to_numpy()",
  "emprunts = np.zeros((400, len(livres)), dtype=int)",
  "for u in range(400):",
  "    p = gouts[u, code_genre] * popularite",
  "    emprunts[u, rng.choice(len(livres), size=rng.integers(5, 21), replace=False, p=p / p.sum())] = 1",
  "M = pd.DataFrame(emprunts, columns=livres['titre'])",
);

/** Un emprunt caché par lecteur (`cache`), le reste pour apprendre (`train`), et les deux mesures de l'étape 2 */
const PROTOCOLE = lines(
  "rng_test = np.random.default_rng(0)",
  "cache = np.array([rng_test.choice(np.flatnonzero(emprunts[u])) for u in range(400)])",
  "train = emprunts.copy()",
  "train[np.arange(400), cache] = 0",
  "",
  "def top_k(scores, k=10):",
  "    # les k livres les mieux notés pour chaque lecteur, parmi ceux qu'il n'a pas déjà empruntés",
  "    s = np.asarray(scores, dtype=float).copy()",
  "    s[train == 1] = -np.inf",
  "    return np.argsort(-s, axis=1)[:, :k]",
  "",
  "def taux_de_reussite(scores, k=10):",
  "    # part des lecteurs dont le livre caché figure dans leurs k recommandations",
  "    top = top_k(scores, k)",
  "    return float(np.mean([cache[u] in top[u] for u in range(len(top))]))",
  "",
  "def couverture(scores, k=10):",
  "    # nombre de livres différents recommandés à l'ensemble des lecteurs",
  "    return len(np.unique(top_k(scores, k)))",
);

const SIMILARITE = lines(
  "norme = np.linalg.norm(train, axis=0)",
  "S = (train.T @ train) / np.outer(norme, norme).clip(min=1e-9)",
  "np.fill_diagonal(S, 0)",
);

export const projectRecommendation: LessonModule = {
  id: "intermediate-1",
  title: "Projet guidé : recommander des livres",
  duration: "3 h",
  summary: "Les emprunts (fictifs) de 400 lecteurs d'une médiathèque : une évaluation honnête, une référence par popularité, puis un filtrage collaboratif par similarité entre livres, comparé et expliqué.",
  objectives: [
    "Représenter des emprunts par une matrice lecteurs × livres",
    "Évaluer des recommandations en cachant un emprunt par lecteur",
    "Construire un filtrage collaboratif par similarité cosinus entre livres",
    "Comparer à des références et discuter de la couverture et des nouveaux livres",
  ],
  sections: [
    {
      kind: "text",
      md: `### Le contexte

La médiathèque du cours voudrait proposer à chaque lecteur une liste de dix livres qu'il pourrait aimer. Elle connaît seulement les **emprunts** : qui a emprunté quoi. Elle n'a ni notes ni avis, c'est le cas le plus courant (on parle de retours **implicites**).

Les données sont **inventées pour l'exercice**, avec une graine fixe : 120 livres répartis en 5 genres, 400 lecteurs qui ont chacun des goûts par genre et empruntent de 5 à 20 livres, plus souvent les livres populaires. Les titres sont de simples étiquettes (« Polar 10 »). Savoir comment les données ont été fabriquées permet de vérifier ce que les méthodes retrouvent.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DONNEES,
        "import matplotlib.pyplot as plt",
        "",
        "print(M.iloc[:5, :6])",
        "print('emprunts :', int(M.to_numpy().sum()), ' cases remplies :', round(100 * M.to_numpy().mean(), 1), '%')",
        "par_livre = M.sum().sort_values(ascending=False)",
        "fig, ax = plt.subplots(figsize=(9, 3.2))",
        "ax.bar(range(len(par_livre)), par_livre.to_numpy())",
        "ax.set_xlabel('livres, du plus emprunté au moins emprunté')",
        "ax.set_ylabel('emprunts')",
        "plt.tight_layout()",
      ),
      caption: "La matrice compte 5 111 emprunts : 10,6 % des cases sont remplies, le reste est inconnu (un livre non emprunté n'est pas forcément un livre qui déplaît). Quelques livres concentrent beaucoup d'emprunts, une longue traîne en a peu : c'est la forme habituelle de ces données.",
    },
    {
      kind: "text",
      md: "### Étape 1 : décrire la matrice\n\nChaque ligne de `M` est un lecteur, chaque colonne un livre, et une case vaut 1 si le lecteur a emprunté le livre. Les sommes par colonne donnent la popularité des livres, les sommes par ligne l'activité des lecteurs.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Calculez `par_livre`, le **nombre d'emprunts de chaque livre** (une série pandas indexée par les titres), puis rangez dans `plus_emprunte` le titre du livre le plus emprunté et dans `moyenne_lecteur` le nombre moyen d'emprunts par lecteur.",
      setup: DONNEES,
      starter: lines("par_livre = None", "plus_emprunte = None", "moyenne_lecteur = None"),
      solution: lines(
        "par_livre = M.sum()",
        "plus_emprunte = par_livre.idxmax()",
        "moyenne_lecteur = M.sum(axis=1).mean()",
        "print(plus_emprunte, int(par_livre.max()), round(moyenne_lecteur, 1))",
      ),
      test: lines(
        "assert isinstance(par_livre, pd.Series), \"par_livre doit être une série pandas : M.sum()\"",
        "assert par_livre.index.equals(M.columns) and (par_livre == M.sum()).all(), \"par_livre doit compter les emprunts de chaque livre (somme par colonne)\"",
        "assert plus_emprunte == M.sum().idxmax(), f\"le livre le plus emprunté est {M.sum().idxmax()} (vous avez {plus_emprunte})\"",
        "assert moyenne_lecteur is not None and abs(moyenne_lecteur - M.sum(axis=1).mean()) < 1e-9, \"moyenne_lecteur : somme par ligne (axis=1), puis moyenne\"",
      ),
      hint: "M.sum() additionne chaque colonne ; .idxmax() donne l'étiquette du maximum ; M.sum(axis=1) additionne chaque ligne.",
    },
    {
      kind: "text",
      md: `### Étape 2 : évaluer avant de recommander

Pour juger une méthode, on **cache un emprunt** de chaque lecteur, tiré au hasard, et on recommande à partir des autres. Une recommandation réussit si le livre caché figure dans les dix livres proposés. Le **taux de réussite** est la part des lecteurs pour qui c'est le cas.

Les fonctions \`top_k\`, \`taux_de_reussite\` et \`couverture\` sont fournies dans les exercices. Une méthode y est représentée par une matrice de **scores** (une ligne par lecteur, une colonne par livre) : plus le score est haut, plus le livre est recommandé. Les livres déjà empruntés sont toujours exclus. Première référence : des scores tirés au hasard.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DONNEES,
        PROTOCOLE,
        "",
        "scores_hasard = np.random.default_rng(1).random(train.shape)",
        "print('hasard : taux de réussite', round(taux_de_reussite(scores_hasard), 3), ', livres différents recommandés :', couverture(scores_hasard))",
      ),
      caption: "Au hasard, le livre caché est dans la liste pour 9,5 % des lecteurs : environ 10 chances sur la centaine de livres non empruntés. Toute méthode doit faire nettement mieux.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Référence plus sérieuse : recommander à chacun les **livres les plus empruntés** qu'il n'a pas encore lus. Construisez `scores_pop`, une matrice 400 × 120 dont chaque ligne contient le nombre d'emprunts de chaque livre **dans `train`** (avec `np.tile`), puis rangez son taux de réussite dans `taux_pop`.",
      setup: lines(DONNEES, PROTOCOLE),
      starter: lines("scores_pop = np.zeros(train.shape)", "taux_pop = taux_de_reussite(scores_pop)"),
      solution: lines(
        "scores_pop = np.tile(train.sum(axis=0), (400, 1))",
        "taux_pop = taux_de_reussite(scores_pop)",
        "print('popularité :', round(taux_pop, 3), ', livres différents :', couverture(scores_pop))",
      ),
      test: lines(
        "assert np.shape(scores_pop) == (400, 120), f\"scores_pop doit avoir une ligne par lecteur et une colonne par livre (vous avez {np.shape(scores_pop)})\"",
        "assert np.allclose(scores_pop, np.tile(train.sum(axis=0), (400, 1))), \"chaque ligne doit contenir les emprunts de chaque livre, comptés dans train et non dans emprunts\"",
        "assert abs(taux_pop - taux_de_reussite(np.tile(train.sum(axis=0), (400, 1)))) < 1e-12, \"taux_pop doit être taux_de_reussite(scores_pop)\"",
      ),
      hint: "train.sum(axis=0) compte les emprunts de chaque livre ; np.tile(ligne, (400, 1)) la répète pour les 400 lecteurs.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Compter les emprunts dans `emprunts` plutôt que dans `train` ferait connaître à la méthode les livres cachés : une fuite d'information, qui gonfle le résultat. Tout ce que la méthode utilise doit venir de `train`.",
    },
    {
      kind: "text",
      md: `### Étape 3 : des livres qui se ressemblent

Le **filtrage collaboratif** part d'une idée simple : deux livres se ressemblent s'ils sont empruntés par les mêmes lecteurs. On représente chaque livre par sa colonne de \`train\` (qui l'a emprunté), et on mesure la ressemblance de deux colonnes par la **similarité cosinus** : le nombre de lecteurs communs, divisé par le produit des normes des deux colonnes. Elle vaut 0 sans lecteur commun et 1 pour deux livres empruntés exactement par les mêmes personnes. La diagonale (un livre avec lui-même) est mise à 0 pour ne pas compter.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Calculez `S`, la **matrice de similarité cosinus** entre les 120 livres (120 × 120) à partir de `train` : `train.T @ train` divisé par le produit extérieur des normes des colonnes (`np.linalg.norm(train, axis=0)`), avec une diagonale nulle.",
      setup: lines(DONNEES, PROTOCOLE),
      starter: lines("S = train.T @ train"),
      solution: lines(
        SIMILARITE,
        "print(S.shape, round(S.max(), 2))",
      ),
      test: lines(
        "_n = np.linalg.norm(train, axis=0)",
        "_S = (train.T @ train) / np.outer(_n, _n).clip(min=1e-9)",
        "np.fill_diagonal(_S, 0)",
        "assert np.shape(S) == (120, 120), f\"S doit comparer les 120 livres entre eux (vous avez {np.shape(S)})\"",
        "assert np.allclose(np.diag(S), 0), \"la diagonale de S doit être nulle : np.fill_diagonal(S, 0)\"",
        "assert np.max(S) <= 1 + 1e-9, \"une similarité cosinus ne dépasse pas 1 : divisez par le produit des normes\"",
        "assert np.allclose(S, _S), \"S doit être train.T @ train divisé par np.outer(norme, norme)\"",
      ),
      hint: "norme = np.linalg.norm(train, axis=0) ; S = (train.T @ train) / np.outer(norme, norme) ; np.fill_diagonal(S, 0).",
    },
    {
      kind: "text",
      md: "### Étape 4 : recommander par ressemblance\n\nLe score d'un livre pour un lecteur est la **somme de ses similarités avec les livres que ce lecteur a empruntés** : c'est le produit matriciel `train @ S`. Un livre proche de plusieurs de ses lectures monte en tête.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Calculez `scores_item = train @ S`, puis son taux de réussite dans `taux_item`. Le taux de la popularité est fourni dans `taux_pop` : la nouvelle méthode doit faire mieux.",
      setup: lines(DONNEES, PROTOCOLE, SIMILARITE, "taux_pop = taux_de_reussite(np.tile(train.sum(axis=0), (400, 1)))"),
      starter: lines("scores_item = np.tile(train.sum(axis=0), (400, 1))", "taux_item = taux_de_reussite(scores_item)"),
      solution: lines(
        "scores_item = train @ S",
        "taux_item = taux_de_reussite(scores_item)",
        "print('popularité :', round(taux_pop, 3), ' ressemblance :', round(taux_item, 3))",
      ),
      test: lines(
        "assert np.allclose(scores_item, train @ S), \"scores_item doit être train @ S : la somme des similarités avec les livres empruntés\"",
        "assert abs(taux_item - taux_de_reussite(train @ S)) < 1e-12, \"taux_item doit être taux_de_reussite(scores_item)\"",
        "assert taux_item > taux_pop, f\"la ressemblance devrait faire mieux que la popularité ({taux_item:.3f} contre {taux_pop:.3f})\"",
      ),
      hint: "Le produit matriciel s'écrit train @ S (400 × 120 fois 120 × 120).",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DONNEES,
        PROTOCOLE,
        SIMILARITE,
        "",
        "scores_item = train @ S",
        "u = 0",
        "print('lecteur 0, emprunts connus :', list(M.columns[train[u] == 1]))",
        "for j in top_k(scores_item)[u][:3]:",
        "    lus = np.flatnonzero(train[u])",
        "    proche = lus[np.argmax(S[j, lus])]",
        "    print('recommandé :', M.columns[j], ' parce que vous avez emprunté', M.columns[proche])",
      ),
      caption: "Une recommandation par ressemblance s'explique facilement : on montre le livre déjà emprunté qui lui ressemble le plus. Cette transparence aide le lecteur à juger la proposition, et la médiathèque à repérer une suggestion absurde.",
    },
    {
      kind: "text",
      md: `### Étape 5 : au-delà du taux de réussite

Un bon score ne suffit pas. La **couverture** compte combien de livres différents la méthode propose à l'ensemble des lecteurs : une méthode qui recommande toujours les mêmes titres réussit parfois, mais ne fait rien découvrir. On compare aussi une méthode fondée sur le **contenu** : recommander les livres des genres que le lecteur emprunte le plus, avec la popularité pour départager.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DONNEES,
        PROTOCOLE,
        SIMILARITE,
        "",
        "genre_un = np.eye(len(genres))[code_genre]  # 120 × 5 : le genre de chaque livre",
        "par_genre = train @ genre_un  # emprunts de chaque lecteur par genre",
        "methodes = {",
        "    'hasard': np.random.default_rng(1).random(train.shape),",
        "    'popularité': np.tile(train.sum(axis=0), (400, 1)),",
        "    'genre préféré': par_genre @ genre_un.T + 1e-3 * train.sum(axis=0),",
        "    'ressemblance': train @ S,",
        "}",
        "for nom, scores in methodes.items():",
        "    print(f'{nom:14} réussite {taux_de_reussite(scores):.3f}   livres différents {couverture(scores):3d}')",
      ),
      caption: "La popularité réussit pour 26,5 % des lecteurs mais ne propose que 21 livres différents à tout le monde. La ressemblance réussit pour 49,5 % et en propose 99. La méthode par genre la suit de près (46,8 %) : normal, puisque nous avons fabriqué des goûts par genre. Sur de vraies données, les goûts sont plus fins que le genre et l'écart est en général plus grand.",
    },
    {
      kind: "note",
      tone: "info",
      md: "Un livre qui vient d'arriver n'a aucun emprunt : sa colonne de `train` est vide, sa similarité avec tous les autres vaut 0 et la ressemblance ne le recommandera jamais. C'est le problème du **démarrage à froid**. Les méthodes fondées sur le contenu (genre, auteur, résumé) n'en souffrent pas : on les combine souvent avec le filtrage collaboratif.",
    },
    {
      kind: "text",
      md: `### Conclure honnêtement

- Les données sont inventées et les goûts suivent les genres par construction : les écarts mesurés ici montrent la méthode, pas ce que donnerait une vraie médiathèque.
- Retrouver un emprunt caché ne prouve pas qu'une recommandation est **utile** : le lecteur aurait peut-être trouvé ce livre seul. Seule une expérience réelle (proposer les listes à une partie des lecteurs et comparer) le mesure.
- Les historiques d'emprunt sont des **données personnelles** : une médiathèque qui recommande doit en informer ses lecteurs, limiter la durée de conservation et laisser refuser.
- Recommander ce qui ressemble à ce qu'on a déjà lu enferme un peu : garder une part de découverte (nouveautés, coups de cœur des bibliothécaires) est un choix éditorial, pas seulement technique.
- Sur un grand catalogue, la matrice de similarité devient énorme : on garde alors pour chaque livre ses voisins les plus proches, ou on passe par une factorisation de la matrice (par exemple \`TruncatedSVD\` de scikit-learn).`,
    },
  ],
  quiz: [
    {
      question: "Pourquoi cache-t-on un emprunt par lecteur avant de recommander ?",
      options: [
        "Pour accélérer les calculs",
        "Pour vérifier si la méthode retrouve un livre que le lecteur a réellement emprunté, sans le lui avoir montré",
        "Pour supprimer les lecteurs trop actifs",
        "Parce que la similarité cosinus l'exige",
      ],
      correct: 1,
      explanation: "On évalue sur ce que la méthode n'a pas vu. Si le livre caché servait au calcul, le résultat serait gonflé par une fuite d'information.",
    },
    {
      question: "La recommandation par popularité réussit pour un quart des lecteurs. Quel est son principal défaut ici ?",
      options: [
        "Elle est trop lente",
        "Elle propose presque les mêmes livres à tout le monde (21 titres pour 400 lecteurs)",
        "Elle recommande des livres déjà empruntés",
        "Elle ne fonctionne qu'avec des notes",
      ],
      correct: 1,
      explanation: "Sa couverture est faible : elle ne fait rien découvrir et renforce les livres déjà populaires.",
    },
    {
      question: "Un livre arrive dans le catalogue. Pourquoi la méthode par ressemblance ne peut-elle pas le recommander ?",
      options: [
        "Parce que son titre est inconnu",
        "Parce qu'il n'a aucun emprunt : sa similarité avec tous les autres livres vaut 0",
        "Parce que la matrice S est symétrique",
        "Elle le peut, sans difficulté",
      ],
      correct: 1,
      explanation: "C'est le démarrage à froid. Une méthode fondée sur le contenu (genre, auteur) peut le proposer en attendant les premiers emprunts.",
    },
    {
      question: "Que mesure la similarité cosinus entre deux colonnes de la matrice d'emprunts ?",
      options: [
        "La différence de popularité des deux livres",
        "La part de lecteurs communs, rapportée au nombre de lecteurs de chaque livre",
        "L'écart entre leurs dates de publication",
        "La probabilité qu'un lecteur emprunte les deux le même jour",
      ],
      correct: 1,
      explanation: "Le produit scalaire compte les lecteurs communs ; la division par les normes évite qu'un livre très populaire ressemble à tous les autres.",
    },
  ],
};
