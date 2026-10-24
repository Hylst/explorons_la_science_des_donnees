import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

/** Chiffres manuscrits de scikit-learn (1 797 images de 8 x 8), pixels ramenés entre 0 et 1 */
const CHIFFRES = lines(
  "import numpy as np",
  "from sklearn.datasets import load_digits",
  "from sklearn.model_selection import train_test_split",
  "from sklearn.linear_model import LogisticRegression",
  "from sklearn.neighbors import KNeighborsClassifier",
  "from sklearn.naive_bayes import GaussianNB",
  "from sklearn.ensemble import VotingClassifier, StackingClassifier",
  "",
  "X, y = load_digits(return_X_y=True)",
  "X = X / 16.0",
);

/** Tumeurs du sein (569 cas, 30 mesures) : découpage 70 / 30 et cinq modèles de base, dont un 1 plus proche voisin */
const CANCER = lines(
  "import numpy as np",
  "from sklearn.datasets import load_breast_cancer",
  "from sklearn.model_selection import train_test_split, cross_val_predict",
  "from sklearn.pipeline import make_pipeline",
  "from sklearn.preprocessing import StandardScaler",
  "from sklearn.linear_model import LogisticRegression",
  "from sklearn.neighbors import KNeighborsClassifier",
  "from sklearn.tree import DecisionTreeClassifier",
  "from sklearn.naive_bayes import GaussianNB",
  "",
  "X, y = load_breast_cancer(return_X_y=True)",
  "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)",
  "bases = [",
  "    ('logreg', make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000))),",
  "    ('knn', make_pipeline(StandardScaler(), KNeighborsClassifier(5))),",
  "    ('arbre', DecisionTreeClassifier(max_depth=4, random_state=0)),",
  "    ('bayes', GaussianNB()),",
  "    ('1nn', KNeighborsClassifier(1)),",
  "]",
);

export const module7: LessonModule = {
  id: "vote-et-empilement",
  title: "Combiner des modèles : vote et empilement",
  duration: "1 h 30",
  summary: "Faire voter des modèles différents, puis empiler leurs prédictions sous un méta-modèle (stacking) : pourquoi les prédictions doivent venir d'une validation croisée, et pourquoi juger le gain sur plusieurs découpages.",
  objectives: [
    "Distinguer vote dur, vote doux et empilement (stacking)",
    "Expliquer pourquoi le méta-modèle doit apprendre sur des prédictions hors échantillon, et les construire avec cross_val_predict",
    "Utiliser VotingClassifier et StackingClassifier de scikit-learn",
    "Mesurer un gain sur plusieurs découpages avant d'y croire",
  ],
  sections: [
    {
      kind: "text",
      md: `### Plusieurs avis valent-ils mieux qu'un ?

Le module sur le boosting combinait des arbres entre eux. On peut aussi combiner des modèles **de natures différentes** : une régression logistique, des plus proches voisins, un classifieur bayésien naïf. S'ils se trompent sur des exemples différents, leur combinaison peut faire mieux que chacun.

- **Vote dur** : chaque modèle donne sa classe, la majorité l'emporte.
- **Vote doux** : on fait la moyenne des probabilités prédites par chaque modèle, puis on prend la classe la plus probable. Un modèle très sûr de lui pèse plus qu'un modèle hésitant.
- **Empilement** (*stacking*) : au lieu d'une moyenne fixe, un **méta-modèle** apprend comment combiner les prédictions des modèles de base. Si l'un d'eux est fiable sur certaines classes, le méta-modèle peut lui donner plus de poids là.`,
    },
    {
      kind: "code",
      language: "python",
      setup: CHIFFRES,
      code: lines(
        "from sklearn.ensemble import RandomForestClassifier",
        "",
        "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)",
        "bases = [",
        "    ('logreg', LogisticRegression(max_iter=2000)),",
        "    ('knn', KNeighborsClassifier(5)),",
        "    ('foret', RandomForestClassifier(n_estimators=50, random_state=0)),",
        "]",
        "for nom, modele in bases:",
        "    print(f'{nom:8}', round(modele.fit(X_train, y_train).score(X_test, y_test), 4))",
        "",
        "vote = VotingClassifier(bases, voting='soft').fit(X_train, y_train)",
        "print('vote doux', round(vote.score(X_test, y_test), 4))",
        "",
        "pile = StackingClassifier(bases, final_estimator=LogisticRegression(max_iter=2000), cv=5).fit(X_train, y_train)",
        "print('empilement', round(pile.score(X_test, y_test), 4))",
      ),
      caption: "Sur les 450 chiffres de test, les plus proches voisins font le mieux seuls (0,98), devant la forêt (0,9711) et la régression logistique (0,9689). Le vote doux égale le meilleur (0,98) et l'empilement le dépasse de peu (0,9822), soit une image de plus bien classée. Un gain aussi petit demande vérification : c'est l'objet de la fin du module.",
    },
    {
      kind: "text",
      md: `### Le piège de l'empilement : la fuite

Pour entraîner le méta-modèle, il faut les prédictions des modèles de base sur les données d'apprentissage. La tentation : entraîner chaque modèle sur ces données, puis lui faire prédire **ces mêmes données**. Mais un modèle qui a appris ses exemples par cœur les prédit parfaitement. Le cas extrême est le plus proche voisin (k = 1) : chaque exemple d'apprentissage est son propre voisin, il ne se trompe jamais sur eux. Le méta-modèle croit alors avoir trouvé un modèle infaillible et lui fait trop confiance.

La parade : des prédictions **hors échantillon**. On coupe les données d'apprentissage en 5 parts ; chaque part est prédite par un modèle entraîné sur les 4 autres. \`cross_val_predict\` fait exactement cela, et \`StackingClassifier\` l'utilise en interne (paramètre \`cv\`). Chaque prédiction vient alors d'un modèle qui n'a pas vu l'exemple, comme sur de vraies données nouvelles.`,
    },
    {
      kind: "code",
      language: "python",
      setup: CANCER,
      code: lines(
        "# prédictions sur les données d'apprentissage elles-mêmes : la fuite",
        "dans_echantillon = np.column_stack([m.fit(X_train, y_train).predict_proba(X_train)[:, 1] for _, m in bases])",
        "naif = LogisticRegression(max_iter=2000).fit(dans_echantillon, y_train)",
        "",
        "# prédictions hors échantillon, par validation croisée à 5 parts",
        "hors = np.column_stack([cross_val_predict(m, X_train, y_train, cv=5, method='predict_proba')[:, 1] for _, m in bases])",
        "correct = LogisticRegression(max_iter=2000).fit(hors, y_train)",
        "",
        "noms = [n for n, _ in bases]",
        "print('poids du méta-modèle naïf   :', dict(zip(noms, naif.coef_[0].round(2))))",
        "print('poids du méta-modèle correct:', dict(zip(noms, correct.coef_[0].round(2))))",
        "test = np.column_stack([m.fit(X_train, y_train).predict_proba(X_test)[:, 1] for _, m in bases])",
        "print('test, naïf :', round(naif.score(test, y_test), 4), ' correct :', round(correct.score(test, y_test), 4))",
      ),
      caption: "Données de tumeurs du sein (569 cas, 30 mesures, fournies avec scikit-learn). Le méta-modèle naïf donne son plus gros poids (2,84) au plus proche voisin, qui ne s'est jamais trompé sur les données d'apprentissage ; avec des prédictions hors échantillon, ce poids tombe à 1,10 et la régression logistique devient le modèle le plus écouté (3,16). Sur ce test, les deux font 0,9415 : la fuite fausse les poids ici sans changer le score, mais rien ne garantit qu'il en soit ainsi sur d'autres données.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Les données de tumeurs (`X_train`, `y_train`) et la liste `bases` (cinq modèles, le dernier est le plus proche voisin `1nn`) sont prêtes. Construisez la matrice `hors` des probabilités de la classe 1 prédites **hors échantillon** (validation croisée à 5 parts) par chaque modèle de base, une colonne par modèle. Entraînez dessus une régression logistique `meta` (max_iter=2000) et rangez dans `poids_1nn` le coefficient qu'elle donne au plus proche voisin (dernière colonne).",
      setup: CANCER,
      starter: lines(
        "hors = np.column_stack([m.fit(X_train, y_train).predict_proba(X_train)[:, 1] for _, m in bases])",
        "meta = LogisticRegression(max_iter=2000).fit(hors, y_train)",
        "poids_1nn = meta.coef_[0][-1]",
      ),
      solution: lines(
        "hors = np.column_stack([cross_val_predict(m, X_train, y_train, cv=5, method='predict_proba')[:, 1] for _, m in bases])",
        "meta = LogisticRegression(max_iter=2000).fit(hors, y_train)",
        "poids_1nn = meta.coef_[0][-1]",
        "print('poids du plus proche voisin :', round(poids_1nn, 2))",
      ),
      test: lines(
        "assert np.shape(hors) == (len(y_train), 5), f\"hors doit avoir une ligne par exemple d'apprentissage et une colonne par modèle, soit {(len(y_train), 5)}\"",
        "_h = np.column_stack([cross_val_predict(m, X_train, y_train, cv=5, method='predict_proba')[:, 1] for _, m in bases])",
        "assert np.allclose(hors, _h), \"les prédictions doivent venir de cross_val_predict(..., cv=5, method='predict_proba') : avec fit puis predict sur X_train, le plus proche voisin a recopié les réponses\"",
        "assert abs(poids_1nn - LogisticRegression(max_iter=2000).fit(_h, y_train).coef_[0][-1]) < 1e-6, \"poids_1nn : coefficient de la dernière colonne dans le méta-modèle\"",
      ),
      hint: "cross_val_predict(modele, X_train, y_train, cv=5, method='predict_proba') renvoie une probabilité par classe ; [:, 1] garde la classe 1.",
    },
    {
      kind: "text",
      md: `### Un gain d'une image n'est pas un gain

Sur 450 images de test, une image vaut 0,22 point. Le gain de l'empilement sur les chiffres (0,9822 contre 0,98) tient à **une** image. Recommençons avec d'autres découpages (\`random_state\` de 0 à 2) et trois modèles de base rapides : régression logistique, plus proches voisins et bayésien naïf. Comparé au meilleur des trois sur chaque découpage, l'empilement perd 2 images, puis 3, puis en gagne 2. Ni gain ni perte nets : sur ces données, les plus proches voisins font déjà presque tout le travail, et les autres modèles apportent peu d'avis vraiment différents.

L'empilement aide quand les modèles de base sont **bons et variés** (ils se trompent sur des exemples différents) et quand il y a assez de données pour que le méta-modèle apprenne quelque chose. Il coûte cher : chaque modèle de base est entraîné 6 fois (5 pour la validation croisée, 1 sur tout), et la combinaison est plus difficile à expliquer qu'un modèle seul.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Pour `random_state` valant 0, 1 et 2 (découpage 75 / 25 stratifié), entraînez les trois modèles de base ci-dessous, puis un `StackingClassifier` (méta-modèle : régression logistique, max_iter=2000, `cv=5`). Rangez dans `ecarts` les trois différences « réussite de l'empilement moins réussite du meilleur modèle de base », et dans `toujours_mieux` un booléen qui dit si l'empilement gagne à chaque découpage.",
      setup: lines(
        CHIFFRES,
        "def bases_rapides():",
        "    return [('logreg', LogisticRegression(max_iter=2000)), ('knn', KNeighborsClassifier(5)), ('bayes', GaussianNB())]",
      ),
      starter: lines("ecarts = []", "toujours_mieux = True"),
      solution: lines(
        "ecarts = []",
        "for graine in range(3):",
        "    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=graine, stratify=y)",
        "    meilleur = max(m.fit(X_train, y_train).score(X_test, y_test) for _, m in bases_rapides())",
        "    pile = StackingClassifier(bases_rapides(), final_estimator=LogisticRegression(max_iter=2000), cv=5)",
        "    ecarts.append(pile.fit(X_train, y_train).score(X_test, y_test) - meilleur)",
        "toujours_mieux = all(e > 0 for e in ecarts)",
        "print([round(e, 4) for e in ecarts], toujours_mieux)",
      ),
      test: lines(
        "assert len(ecarts) == 3, f\"il faut un écart par découpage, donc 3 valeurs (vous en avez {len(ecarts)})\"",
        "_e = []",
        "for _g in range(3):",
        "    _a, _b, _c, _d = train_test_split(X, y, test_size=0.25, random_state=_g, stratify=y)",
        "    _m = max(m.fit(_a, _c).score(_b, _d) for _, m in bases_rapides())",
        "    _e.append(StackingClassifier(bases_rapides(), final_estimator=LogisticRegression(max_iter=2000), cv=5).fit(_a, _c).score(_b, _d) - _m)",
        "assert np.allclose(ecarts, _e), \"chaque écart : réussite de l'empilement moins celle du meilleur des trois modèles, sur le même découpage\"",
        "assert toujours_mieux == all(e > 0 for e in _e), \"toujours_mieux n'est vrai que si les trois écarts sont positifs\"",
      ),
      hint: "Une boucle for graine in range(3) ; max(...) sur les trois réussites donne le meilleur modèle de base.",
    },
    {
      kind: "note",
      tone: "tip",
      md: "Pour une régression, `VotingRegressor` fait la moyenne des prédictions et `StackingRegressor` apprend leur combinaison, avec les mêmes précautions. L'empilement est très utilisé dans les concours de prédiction, où quelques millièmes comptent ; en production, un modèle seul un peu moins bon mais plus simple à surveiller et à expliquer est souvent préférable.",
    },
  ],
  quiz: [
    {
      question: "Quelle différence entre vote doux et vote dur ?",
      options: [
        "Le vote doux utilise moins de modèles",
        "Le vote doux fait la moyenne des probabilités prédites, le vote dur compte les classes prédites",
        "Le vote dur pondère les modèles par leur réussite",
        "Il n'y a aucune différence en classification",
      ],
      correct: 1,
      explanation: "Avec le vote doux, un modèle très sûr de lui pèse plus qu'un modèle hésitant ; avec le vote dur, chaque modèle compte pour une voix.",
    },
    {
      question: "Pourquoi le méta-modèle d'un empilement doit-il apprendre sur des prédictions hors échantillon ?",
      options: [
        "Pour aller plus vite",
        "Parce qu'un modèle prédit trop bien ses propres données d'apprentissage : le méta-modèle lui ferait trop confiance",
        "Parce que scikit-learn ne sait pas faire autrement",
        "Pour réduire le nombre de colonnes",
      ],
      correct: 1,
      explanation: "Sur ses données d'apprentissage, le plus proche voisin ne se trompe jamais : le méta-modèle naïf lui donnait le plus gros poids (2,84 contre 1,10 hors échantillon).",
    },
    {
      question: "Sur 450 images de test, l'empilement fait 0,9822 et le meilleur modèle seul 0,98. Que conclure ?",
      options: [
        "L'empilement est meilleur, c'est prouvé",
        "Rien encore : l'écart tient à une image ; il faut le mesurer sur plusieurs découpages",
        "L'empilement est moins bon",
        "Le test est trop grand",
      ],
      correct: 1,
      explanation: "Une image vaut 0,22 point. Sur trois découpages, l'empilement à trois modèles rapides a perdu deux fois et gagné une fois face au meilleur modèle seul.",
    },
    {
      question: "Dans quel cas l'empilement a-t-il le plus de chances d'aider ?",
      options: [
        "Quand tous les modèles de base sont identiques",
        "Quand les modèles de base sont bons et se trompent sur des exemples différents",
        "Quand il y a très peu de données",
        "Quand un seul modèle de base est utilisé",
      ],
      correct: 1,
      explanation: "Combiner n'apporte que si les avis diffèrent utilement. Des modèles qui font les mêmes erreurs n'ont rien à s'apprendre ; avec trop peu de données, le méta-modèle apprend du bruit.",
    },
  ],
};
