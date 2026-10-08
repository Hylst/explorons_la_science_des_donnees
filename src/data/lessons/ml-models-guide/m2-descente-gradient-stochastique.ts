import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

export const module2: LessonModule = {
  id: "descente-gradient-stochastique",
  title: "Descente de gradient stochastique",
  duration: "2 h",
  summary: "Le principe de la descente de gradient écrit en NumPy, puis SGDClassifier : mise à l'échelle indispensable, apprentissage par lots avec partial_fit, effet du taux d'apprentissage, et ce que cette méthode apporte vraiment.",
  objectives: [
    "Expliquer la descente de gradient et sa version stochastique, et écrire la mise à jour des poids",
    "Prévoir l'effet d'un taux d'apprentissage trop petit, bien choisi ou trop grand",
    "Entraîner un SGDClassifier dans un pipeline avec mise à l'échelle, et mesurer ce que la mise à l'échelle change",
    "Entraîner un modèle par lots avec partial_fit, et dire dans quels cas la méthode est utile",
  ],
  sections: [
    {
      kind: "text",
      md: `### Descendre une pente dans le brouillard

Entraîner un modèle linéaire, c'est chercher les poids **w** qui rendent une **perte** L(w) la plus petite possible : la perte mesure l'écart entre les prédictions du modèle et les réponses connues. Imaginez une randonneuse dans le brouillard qui veut rejoindre le fond d'une vallée : elle ne voit pas la vallée, mais sent la pente sous ses pieds. À chaque pas, elle marche dans la direction où le sol descend le plus vite. Cette direction, c'est l'opposé du **gradient** de la perte, le vecteur de ses dérivées partielles.

La règle de mise à jour s'écrit :`,
    },
    {
      kind: "equation",
      latex: String.raw`w \leftarrow w - \eta \,\nabla L(w), \qquad L(w) = \frac{1}{n}\sum_{i=1}^{n} \ell(w;\, x_i, y_i)`,
      caption: "Descente de gradient : η est le taux d'apprentissage (la longueur du pas), L la perte moyenne sur les n exemples, ℓ la perte d'un seul exemple.",
    },
    {
      kind: "text",
      md: `Calculer ∇L demande de parcourir les n exemples à chaque pas. La version **stochastique** triche intelligemment : elle estime le gradient avec **un seul exemple tiré au hasard** (ou un petit lot), ce qui est beaucoup moins cher et un peu bruité, puis fait un pas, et recommence.`,
    },
    {
      kind: "equation",
      latex: String.raw`w \leftarrow w - \eta \,\nabla \ell(w;\, x_i, y_i) \quad \text{avec } i \text{ tiré au hasard}`,
      caption: "Descente de gradient stochastique : le pas est calculé sur l'exemple i seulement.",
    },
    {
      kind: "text",
      md: `Le chemin est plus tremblant que celui de la descente complète, mais on avance dès le premier exemple. Un passage sur tous les exemples s'appelle une **époque**. Un point est essentiel : le pas dépend de η, et choisir η est le réglage le plus délicat de la méthode. Regardons-le sur le cas le plus simple, la fonction f(w) = (w − 3)², dont le minimum est en w = 3 et dont la dérivée est 2(w − 3).`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "def f_prime(w):",
        "    return 2 * (w - 3)  # dérivée de f(w) = (w - 3)²",
        "",
        "",
        "for eta in [0.1, 0.5, 0.9, 1.0, 1.1]:",
        "    w = 0.0",
        "    trace = [w]",
        "    for _ in range(20):",
        "        w = w - eta * f_prime(w)",
        "        trace.append(w)",
        "    print(f\"eta = {eta:3.1f} : w après 3 pas = {trace[3]:8.3f}, après 20 pas = {trace[20]:9.3f}\")",
      ),
      caption: "Le minimum est en w = 3. Un pas bien choisi y arrive vite ; un pas trop grand oscille, puis s'en éloigne.",
    },
    {
      kind: "equation",
      latex: String.raw`w_{t+1} - 3 = (1 - 2\eta)\,(w_t - 3)`,
      caption: "Pour f(w) = (w − 3)², l'écart au minimum est multiplié à chaque pas par 1 − 2η : il diminue si |1 − 2η| < 1, c'est-à-dire si 0 < η < 1.",
    },
    {
      kind: "text",
      md: `La formule explique la sortie : avec η = 0,5 le facteur est nul et l'on tombe sur le minimum en un pas ; avec η = 0,1 et η = 0,9 le facteur vaut respectivement 0,8 et −0,8 : on converge, directement dans le premier cas, en alternant de part et d'autre dans le second, avec exactement le même écart restant après 20 pas ; avec η = 1 le facteur est −1 et l'on oscille sans fin entre 0 et 6 ; avec η = 1,1 le facteur est −1,2 et l'écart grossit à chaque pas. Pour un modèle réel, il n'y a pas de formule aussi simple, mais le même compromis : trop petit, on avance si lentement qu'on s'arrête avant d'arriver ; trop grand, on rebondit de part et d'autre de la vallée.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez la fonction `descente(f_prime, w0, eta, n_pas)` qui part de `w0`, applique `n_pas` fois la mise à jour `w = w - eta * f_prime(w)` et renvoie la valeur finale de `w`.",
      starter: lines(
        "def descente(f_prime, w0, eta, n_pas):",
        "    w = w0",
        "    # appliquez n_pas fois la mise à jour du gradient",
        "    return w",
        "",
        "",
        "resultat = descente(lambda w: 2 * (w - 3), 0.0, 0.1, 100)",
        "print(resultat)",
      ),
      solution: lines(
        "def descente(f_prime, w0, eta, n_pas):",
        "    w = w0",
        "    for _ in range(n_pas):",
        "        w = w - eta * f_prime(w)",
        "    return w",
        "",
        "",
        "resultat = descente(lambda w: 2 * (w - 3), 0.0, 0.1, 100)",
        "print(resultat)",
      ),
      test: lines(
        "_f = lambda w: 2 * (w - 3)",
        "_un_pas = descente(_f, 0.0, 0.1, 1)",
        "assert abs(_un_pas - 0.6) < 1e-12, f\"après un pas depuis 0 avec eta = 0.1, w doit valoir 0.6 (vous avez {_un_pas})\"",
        "_trois = descente(_f, 0.0, 0.4, 3)",
        "assert abs(_trois - (3 - 3 * 0.2 ** 3)) < 1e-9, f\"après 3 pas avec eta = 0.4, w doit valoir {3 - 3 * 0.2 ** 3} (vous avez {_trois})\"",
        "assert abs(descente(_f, 10.0, 0.1, 0) - 10.0) < 1e-12, \"avec 0 pas, w ne bouge pas\"",
        "assert abs(descente(lambda w: 4 * w ** 3 - 4 * w, 2.0, 0.01, 500) - 1.0) < 1e-3, \"la fonction doit marcher pour n'importe quelle dérivée (ici celle de w^4 - 2w^2, qui a un minimum en 1)\"",
      ),
      hint: "Une boucle for _ in range(n_pas): w = w - eta * f_prime(w). Pensez à renvoyer w après la boucle.",
    },
    {
      kind: "text",
      md: `### La descente stochastique à la main

Voici la méthode complète sur un problème de régression linéaire, écrite en NumPy. Les données sont simulées : y = 2·x₁ − x₂ + 1 plus un bruit. À chaque époque on mélange les exemples ; pour chaque exemple, on calcule l'erreur de la prédiction et on corrige les poids et le biais en proportion de cette erreur. Pour comparer, on calcule aussi la solution exacte des moindres carrés.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "rng = np.random.default_rng(0)",
        "n = 1000",
        "X = rng.normal(size=(n, 2))",
        "y = 2 * X[:, 0] - 1 * X[:, 1] + 1 + rng.normal(scale=0.5, size=n)",
        "",
        "w = np.zeros(2)",
        "b = 0.0",
        "eta = 0.01",
        "for epoque in range(1, 6):",
        "    for i in rng.permutation(n):",
        "        erreur = (X[i] @ w + b) - y[i]",
        "        w -= eta * erreur * X[i]",
        "        b -= eta * erreur",
        "    mse = np.mean((X @ w + b - y) ** 2)",
        "    print(f\"époque {epoque} : poids {np.round(w, 3)}, biais {b:.3f}, erreur quadratique moyenne {mse:.4f}\")",
        "",
        "A = np.column_stack([X, np.ones(n)])",
        "exact = np.linalg.lstsq(A, y, rcond=None)[0]",
        "print(\"moindres carrés exacts :\", np.round(exact, 3), \"erreur\", round(float(np.mean((A @ exact - y) ** 2)), 4))",
      ),
      caption: "Les poids se rapprochent vite de la solution exacte (2, −1, 1 avec le bruit) mais continuent à trembloter d'une époque à l'autre : le bruit du tirage au sort ne disparaît pas avec un pas constant.",
    },
    {
      kind: "text",
      md: `### SGDClassifier : la même idée, prête à l'emploi

\`SGDClassifier\` (classification) et \`SGDRegressor\` (régression) de scikit-learn appliquent cette méthode à des modèles linéaires. Les réglages principaux :

- \`loss\` : la perte minimisée. Par défaut \`"hinge"\` (on obtient un SVM linéaire) ; avec \`"log_loss"\`, on obtient une régression logistique et l'on dispose de \`predict_proba\` ;
- \`alpha\` et \`penalty\` : la régularisation (par défaut, pénalité L2 et \`alpha=0.0001\`) ;
- \`learning_rate\` et \`eta0\` : le taux d'apprentissage, constant ou décroissant (par défaut \`"optimal"\`, qui le fait décroître selon une formule fondée sur \`alpha\`) ;
- \`max_iter\` et \`tol\` : le nombre maximal d'époques et le seuil d'arrêt ; \`n_iter_\` donne le nombre d'époques réellement faites.

Une conséquence directe de la formule de mise à jour : le pas sur chaque poids est proportionnel à la valeur de la variable correspondante. Si une variable est mille fois plus grande que les autres, elle domine tout, et il n'existe pas de pas qui convienne à toutes les variables à la fois. **La mise à l'échelle n'est pas une option.** Le jeu des tumeurs du sein en est une bonne démonstration, car ses variables ont des ordres de grandeur très différents.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "from sklearn.datasets import load_breast_cancer",
        "from sklearn.linear_model import LogisticRegression, SGDClassifier",
        "from sklearn.model_selection import StratifiedKFold, cross_val_score",
        "from sklearn.pipeline import make_pipeline",
        "from sklearn.preprocessing import StandardScaler",
        "",
        "X, y = load_breast_cancer(return_X_y=True)",
        "print(\"écarts-types des variables : de\", X.std(axis=0).min().round(4), \"à\", X.std(axis=0).max().round(1))",
        "decoupage = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)",
        "",
        "modeles = {",
        "    \"SGD, variables brutes\": SGDClassifier(random_state=0),",
        "    \"SGD, mis à l'échelle\": make_pipeline(StandardScaler(), SGDClassifier(random_state=0)),",
        "    \"SGD à perte logistique, mis à l'échelle\": make_pipeline(StandardScaler(), SGDClassifier(loss=\"log_loss\", random_state=0)),",
        "    \"LogisticRegression, mise à l'échelle\": make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)),",
        "}",
        "for nom, modele in modeles.items():",
        "    scores = cross_val_score(modele, X, y, cv=decoupage)",
        "    print(f\"{nom:42s} {scores.mean():.3f} ± {scores.std():.3f}\")",
      ),
      caption: "Sans mise à l'échelle, la méthode se comporte mal : exactitude moyenne bien plus basse et très variable d'un pli à l'autre.",
    },
    {
      kind: "text",
      md: `Les écarts-types des variables vont de 0,0026 à 568,9. Sans mise à l'échelle, SGD n'atteint que 0,766 d'exactitude moyenne, avec un écart-type de 0,123 entre les plis : le résultat change beaucoup selon les données vues. Avec un \`StandardScaler\` dans le pipeline, il passe à 0,965 (écart-type 0,010). La régression logistique exacte, calculée par un autre algorithme, obtient 0,979 : SGD s'en approche sans l'égaler ici, ce qui n'a rien d'anormal pour une méthode dont la précision est limitée par le bruit du tirage au sort.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Construisez avec `make_pipeline` un modèle qui met les variables à l'échelle (`StandardScaler`) puis entraîne un `SGDClassifier(loss=\"log_loss\", random_state=0)`. Rangez-le dans `modele`, et rangez dans `score` son exactitude moyenne en validation croisée à 5 plis (`cross_val_score(modele, X, y, cv=5)`) sur les données du jeu **wine**.",
      starter: lines(
        "from sklearn.datasets import load_wine",
        "from sklearn.linear_model import SGDClassifier",
        "from sklearn.model_selection import cross_val_score",
        "from sklearn.pipeline import make_pipeline",
        "from sklearn.preprocessing import StandardScaler",
        "",
        "X, y = load_wine(return_X_y=True)",
        "",
        "modele = None",
        "score = None",
      ),
      solution: lines(
        "from sklearn.datasets import load_wine",
        "from sklearn.linear_model import SGDClassifier",
        "from sklearn.model_selection import cross_val_score",
        "from sklearn.pipeline import make_pipeline",
        "from sklearn.preprocessing import StandardScaler",
        "",
        "X, y = load_wine(return_X_y=True)",
        "",
        "modele = make_pipeline(StandardScaler(), SGDClassifier(loss=\"log_loss\", random_state=0))",
        "score = cross_val_score(modele, X, y, cv=5).mean()",
        "print(round(score, 3))",
      ),
      test: lines(
        "from sklearn.pipeline import Pipeline as _Pipeline",
        "assert isinstance(modele, _Pipeline), \"modele doit être un pipeline construit avec make_pipeline\"",
        "assert isinstance(modele.steps[0][1], StandardScaler), \"la première étape du pipeline doit être un StandardScaler\"",
        "assert isinstance(modele.steps[-1][1], SGDClassifier), \"la dernière étape doit être un SGDClassifier\"",
        "assert modele.steps[-1][1].loss == \"log_loss\" and modele.steps[-1][1].random_state == 0, \"le SGDClassifier doit avoir loss='log_loss' et random_state=0\"",
        "assert score is not None, \"score doit contenir l'exactitude moyenne en validation croisée\"",
        "_attendu = cross_val_score(modele, X, y, cv=5).mean()",
        "assert abs(score - _attendu) < 1e-9, f\"score : on attend {_attendu:.3f} (cv=5), vous avez {score:.3f}\"",
      ),
      hint: "make_pipeline(StandardScaler(), SGDClassifier(loss=\"log_loss\", random_state=0)), puis cross_val_score(modele, X, y, cv=5).mean().",
    },
    {
      kind: "text",
      md: `### Apprendre par lots : partial_fit

\`fit\` a besoin de toutes les données en mémoire. \`partial_fit\` apprend **à partir d'un paquet de données à la fois**, en continuant là où le modèle s'était arrêté. C'est ce qui permet :

- de traiter des données trop grosses pour la mémoire, lues par morceaux ;
- de suivre des données qui arrivent au fil de l'eau, sans tout réentraîner.

Trois précautions. Au premier appel, il faut donner la liste des \`classes\` possibles (le modèle ne peut pas deviner qu'une classe absente du premier lot existe). Chaque appel fait **une seule époque** sur le lot reçu. Et la mise à l'échelle doit elle aussi se faire par lots : \`StandardScaler\` possède son propre \`partial_fit\`, qui met à jour moyenne et écart-type au fur et à mesure.

scikit-learn met les poids à jour exemple par exemple, même dans \`partial_fit\` : un « lot » n'est qu'un paquet de données présenté au modèle.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from sklearn.datasets import make_classification",
        "from sklearn.linear_model import LogisticRegression, SGDClassifier",
        "from sklearn.model_selection import train_test_split",
        "from sklearn.preprocessing import StandardScaler",
        "",
        "X, y = make_classification(n_samples=6000, n_features=20, n_informative=5, n_clusters_per_class=1, class_sep=1.5, random_state=0)",
        "X_app, X_test, y_app, y_test = train_test_split(X, y, test_size=1000, random_state=0)",
        "lots = list(zip(np.array_split(X_app, 10), np.array_split(y_app, 10)))",
        "",
        "echelle = StandardScaler()",
        "modele = SGDClassifier(loss=\"log_loss\", random_state=0)",
        "vus = 0",
        "for numero, (X_lot, y_lot) in enumerate(lots, start=1):",
        "    echelle.partial_fit(X_lot)",
        "    modele.partial_fit(echelle.transform(X_lot), y_lot, classes=np.unique(y))",
        "    vus += len(X_lot)",
        "    exactitude = modele.score(echelle.transform(X_test), y_test)",
        "    print(f\"lot {numero:2d} : {vus:5d} exemples vus, exactitude sur le test {exactitude:.3f}\")",
        "",
        "reference = LogisticRegression(max_iter=1000).fit(echelle.transform(X_app), y_app)",
        "print(\"régression logistique sur tout d'un coup :\", round(reference.score(echelle.transform(X_test), y_test), 3))",
      ),
      caption: "Données simulées (make_classification). Après le premier lot, le modèle est déjà bon ; ensuite l'exactitude oscille un peu à chaque lot, puisque chaque lot déplace légèrement les poids.",
    },
    {
      kind: "text",
      md: `Le modèle est utilisable dès le premier lot de 500 exemples (0,990 d'exactitude sur le jeu de test), puis son exactitude oscille entre 0,967 et 0,994 selon les lots, sans progresser de façon régulière. La régression logistique ajustée en une fois sur les 5 000 exemples obtient 0,994. Apprendre par lots n'est donc pas gratuit : on gagne en mémoire et en souplesse, et l'on accepte un résultat un peu plus tremblant.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Les variables `lots` (une liste de 5 couples `(X_lot, y_lot)` de données déjà mises à l'échelle), `X_test` et `y_test` sont déjà définies. Entraînez `modele`, un `SGDClassifier(loss=\"log_loss\", random_state=0)`, lot après lot avec `partial_fit` (les classes sont 0 et 1).",
      setup: lines(
        "import numpy as np",
        "from sklearn.datasets import load_breast_cancer",
        "from sklearn.linear_model import SGDClassifier",
        "from sklearn.model_selection import train_test_split",
        "from sklearn.preprocessing import StandardScaler",
        "",
        "X, y = load_breast_cancer(return_X_y=True)",
        "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)",
        "_echelle = StandardScaler().fit(X_train)",
        "X_train, X_test = _echelle.transform(X_train), _echelle.transform(X_test)",
        "lots = list(zip(np.array_split(X_train, 5), np.array_split(y_train, 5)))",
      ),
      starter: lines(
        "modele = SGDClassifier(loss=\"log_loss\", random_state=0)",
        "# entraînez le modèle lot après lot avec partial_fit",
      ),
      solution: lines(
        "modele = SGDClassifier(loss=\"log_loss\", random_state=0)",
        "for X_lot, y_lot in lots:",
        "    modele.partial_fit(X_lot, y_lot, classes=[0, 1])",
        "print(round(modele.score(X_test, y_test), 3))",
      ),
      test: lines(
        "assert hasattr(modele, \"coef_\"), \"le modèle n'est pas encore entraîné : appelez partial_fit sur chaque lot\"",
        "assert modele.t_ == 1 + len(X_train), f\"chaque exemple doit avoir été vu une fois (t_ vaut {modele.t_}, on attend {1 + len(X_train)}) : un seul appel de partial_fit par lot\"",
        "assert modele.score(X_test, y_test) > 0.9, f\"l'exactitude sur le test devrait dépasser 0.9 (elle vaut {modele.score(X_test, y_test):.3f})\"",
      ),
      hint: "for X_lot, y_lot in lots: modele.partial_fit(X_lot, y_lot, classes=[0, 1]).",
    },
    {
      kind: "text",
      md: `### Le taux d'apprentissage, de près

Pour voir l'effet de η sur un vrai modèle, on entraîne le même \`SGDClassifier\` avec un taux **constant** (\`learning_rate="constant"\`, \`eta0=η\`) pendant 100 époques (un \`partial_fit\` sur tout le jeu d'entraînement par époque), et l'on note la perte logistique sur l'entraînement après 1, 5, 20 et 100 époques. Les variables sont mises à l'échelle.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from sklearn.datasets import load_breast_cancer",
        "from sklearn.linear_model import SGDClassifier",
        "from sklearn.metrics import log_loss",
        "from sklearn.model_selection import train_test_split",
        "from sklearn.preprocessing import StandardScaler",
        "",
        "X, y = load_breast_cancer(return_X_y=True)",
        "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)",
        "echelle = StandardScaler().fit(X_train)",
        "X_train, X_test = echelle.transform(X_train), echelle.transform(X_test)",
        "",
        "print(\"eta0     perte après 1, 5, 20 et 100 époques       exactitude test\")",
        "for eta0 in [0.0001, 0.001, 0.01, 0.1, 1.0, 10.0]:",
        "    modele = SGDClassifier(loss=\"log_loss\", learning_rate=\"constant\", eta0=eta0, random_state=0)",
        "    pertes = []",
        "    for epoque in range(100):",
        "        modele.partial_fit(X_train, y_train, classes=[0, 1])",
        "        pertes.append(log_loss(y_train, modele.predict_proba(X_train)))",
        "    reperes = [round(pertes[k - 1], 3) for k in (1, 5, 20, 100)]",
        "    print(f\"{eta0:<8g} {str(reperes):42s} {modele.score(X_test, y_test):.3f}\")",
      ),
      caption: "Une perte plus basse est meilleure. Le jeu de test n'a que 143 exemples : une seule erreur de plus change l'exactitude de 0,007.",
    },
    {
      kind: "text",
      md: `La lecture est la même que sur la parabole. Avec η = 0,0001, la perte est encore à 0,132 après 100 époques : le modèle apprend, mais trop lentement. Avec η = 0,01 et η = 0,1 elle descend vite (0,043 et 0,030 après 100 époques). Avec η = 1 elle cesse de décroître régulièrement (0,566 après une époque, 0,169 après cinq, puis 0,239 et 0,246), et avec η = 10 elle monte : 1,027 après une époque, 3,048 après cent. Le modèle s'éloigne de la solution au lieu de s'en approcher.

Pour l'exactitude sur le test, la différence entre η = 0,001 et η = 0,1 (0,965 contre 0,951, soit deux exemples sur 143) est trop petite pour trancher. En pratique, on essaie plusieurs valeurs espacées de puissances de dix, on regarde la courbe de perte, et l'on garde la plus grande valeur qui reste stable. La valeur par défaut \`learning_rate="optimal"\` évite ce réglage à la main : elle décroît au fil des pas, ce qui est une réponse au bruit résiduel vu plus haut.`,
    },
    {
      kind: "note",
      tone: "tip",
      md: `Un taux d'apprentissage qui décroît (\`"optimal"\`, \`"invscaling"\`, \`"adaptive"\`) donne souvent un résultat plus stable qu'un taux constant : grand au début pour avancer vite, petit à la fin pour ne plus trembler. Dès qu'un \`SGDClassifier\` donne des résultats étranges, regardez d'abord deux choses : la mise à l'échelle, puis le taux d'apprentissage.`,
    },
    {
      kind: "text",
      md: `### Quand choisir SGD, et quand ne pas le choisir

On entend souvent que la descente de gradient stochastique est « extrêmement rapide sur de gros jeux de données ». C'est plus nuancé. Le banc d'essai ci-dessous compare, sur des données simulées de taille croissante, la régression logistique de scikit-learn (un solveur exact, L-BFGS) et un \`SGDClassifier\` à perte logistique.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import time",
        "from sklearn.datasets import make_classification",
        "from sklearn.linear_model import LogisticRegression, SGDClassifier",
        "from sklearn.preprocessing import StandardScaler",
        "",
        "for n in [2000, 20000, 100000]:",
        "    X, y = make_classification(n_samples=n, n_features=20, n_informative=5, n_clusters_per_class=1, class_sep=1.5, random_state=0)",
        "    X = StandardScaler().fit_transform(X)",
        "",
        "    debut = time.perf_counter()",
        "    exact = LogisticRegression(max_iter=1000).fit(X, y)",
        "    t_exact = time.perf_counter() - debut",
        "",
        "    debut = time.perf_counter()",
        "    sgd = SGDClassifier(loss=\"log_loss\", random_state=0).fit(X, y)",
        "    t_sgd = time.perf_counter() - debut",
        "",
        "    print(f\"n = {n:6d} : LogisticRegression {t_exact:.2f} s (exactitude {exact.score(X, y):.3f}) ; SGD {t_sgd:.2f} s (exactitude {sgd.score(X, y):.3f}, {sgd.n_iter_} époques)\")",
      ),
      caption: "Les durées dépendent de votre machine et de votre navigateur. Elles montrent surtout que, sur des données denses de cette taille, la méthode exacte n'est pas battue.",
    },
    {
      kind: "text",
      md: `Lors de nos mesures, la régression logistique exacte était aussi rapide que SGD ou plus rapide aux trois tailles, pour une exactitude identique à un millième près. Sur des données denses de ce genre (vingt variables, jusqu'à cent mille exemples), un solveur exact n'est donc pas battu. L'intérêt de SGD est ailleurs :

- **l'apprentissage par lots** (\`partial_fit\`), quand les données ne tiennent pas en mémoire ou arrivent en continu ;
- **les données creuses de très grande dimension**, comme le texte (des dizaines de milliers de colonnes presque toutes nulles) : chaque mise à jour ne coûte que le nombre de valeurs non nulles de l'exemple ;
- **la souplesse** : en changeant \`loss\`, on passe du SVM linéaire à la régression logistique, et \`SGDRegressor\` couvre la régression.

Sur un jeu qui tient en mémoire et que l'on peut ajuster en une fois, comparez-le toujours à \`LogisticRegression\`, \`LinearSVC\` ou \`Ridge\` avant de le préférer : ces références sont plus stables.`,
    },
    {
      kind: "note",
      tone: "warning",
      md: `SGD apporte un modèle **linéaire** : une frontière de décision plate (un plan dans l'espace des variables). Si la relation est franchement non linéaire, aucun réglage de \`alpha\` ou de η n'y changera rien. On peut transformer les variables avant (polynômes, approximation de noyau) ou choisir une autre famille (arbres, boosting, réseaux), comme l'explique le reste de ce guide.`,
    },
  ],
  quiz: [
    {
      question: "Pourquoi la mise à l'échelle des variables est-elle indispensable avant un SGDClassifier ?",
      options: [
        "Parce que scikit-learn refuse les variables non centrées",
        "Parce que sinon le modèle ne peut pas utiliser partial_fit",
        "Parce que le pas de mise à jour d'un poids est proportionnel à la valeur de sa variable : une variable à grande échelle domine, et aucun taux d'apprentissage ne convient à toutes",
        "Elle ne l'est pas : elle sert seulement à accélérer le calcul",
      ],
      correct: 2,
      explanation: "Dans la mise à jour w ← w − η·erreur·x, la taille du pas dépend de x. Avec des variables d'ordres de grandeur très différents, les pas sont démesurés pour les unes et minuscules pour les autres.",
    },
    {
      question: "Que se passe-t-il si le taux d'apprentissage constant est beaucoup trop grand ?",
      options: [
        "La perte peut cesser de diminuer et même augmenter : les pas dépassent le minimum et le modèle s'en éloigne",
        "L'apprentissage est simplement plus rapide",
        "Le modèle devient plus régularisé",
        "Le modèle s'arrête après une époque",
      ],
      correct: 0,
      explanation: "Comme pour la parabole, un pas trop long fait rebondir de part et d'autre du minimum, voire s'en éloigner. À l'inverse, un pas trop petit rend l'apprentissage lent.",
    },
    {
      question: "Que faut-il fournir lors du premier appel à partial_fit d'un SGDClassifier ?",
      options: [
        "Le nombre d'époques",
        "Le taux d'apprentissage",
        "Rien de particulier",
        "La liste des classes possibles (paramètre classes)",
      ],
      correct: 3,
      explanation: "Le modèle ne peut pas deviner les classes absentes du premier lot. On les lui donne une fois pour toutes au premier appel avec classes=...",
    },
    {
      question: "Avec SGDClassifier(loss=\"hinge\"), c'est-à-dire sa valeur par défaut, quel modèle entraîne-t-on ?",
      options: [
        "Une régression logistique",
        "Un SVM linéaire, entraîné par descente de gradient stochastique",
        "Une forêt aléatoire",
        "Un perceptron multicouche",
      ],
      correct: 1,
      explanation: "La perte « hinge » est celle des SVM. Pour obtenir une régression logistique et des probabilités avec predict_proba, il faut choisir loss=\"log_loss\".",
    },
    {
      question: "Pour quelle raison principale choisirait-on SGD plutôt qu'un solveur exact ?",
      options: [
        "Il est toujours plus rapide, quelle que soit la taille des données",
        "Il peut représenter des frontières non linéaires",
        "Il peut apprendre par lots (données qui ne tiennent pas en mémoire ou qui arrivent en continu), et passe bien à l'échelle pour de très grands volumes ou des données creuses de grande dimension",
        "Il n'a aucun hyperparamètre à régler",
      ],
      correct: 2,
      explanation: "Le principal atout est de pouvoir apprendre par petits paquets. Sur des données denses de taille modeste, un solveur exact est souvent aussi rapide et plus stable, et SGD reste un modèle linéaire avec des réglages délicats.",
    },
  ],
};
