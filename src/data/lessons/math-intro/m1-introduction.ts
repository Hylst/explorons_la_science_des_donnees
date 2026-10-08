import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

export const module1: LessonModule = {
  id: "module-1",
  title: "Pourquoi les mathématiques ?",
  duration: "1 h 30",
  summary: "Ce que les mathématiques font dans un projet de données : représenter, modéliser, apprendre, raisonner sous incertitude, et comment lire une formule.",
  objectives: [
    "Expliquer le rôle des vecteurs, des fonctions de coût et des probabilités dans un projet de données",
    "Représenter des observations par des vecteurs de caractéristiques et calculer une distance entre elles",
    "Écrire en Python une fonction de coût simple (l'erreur quadratique moyenne)",
    "Traduire en code une formule qui utilise le signe somme",
  ],
  sections: [
    {
      kind: "text",
      md: `### Ce que les mathématiques font dans un projet de données

Un projet de données, c'est souvent la même suite de gestes, et chacun s'appuie sur un domaine des mathématiques :

- **représenter** : un jeu de données est un tableau de nombres. Chaque observation (un livre, un client, une image) devient un **vecteur** de nombres, appelé vecteur de caractéristiques, et tout le jeu une **matrice**. C'est le domaine de l'algèbre linéaire ;
- **modéliser** : un modèle est une **fonction** qui transforme les caractéristiques en une prédiction, avec des paramètres à déterminer ;
- **apprendre** : on mesure l'erreur du modèle avec une **fonction de coût**, puis on cherche les paramètres qui la rendent la plus petite. Les **dérivées** indiquent dans quel sens modifier les paramètres ;
- **raisonner sous incertitude** : les données sont un échantillon bruité d'une réalité plus vaste. Les **probabilités** et les statistiques décrivent ce bruit, et les **intégrales** servent dès que les variables sont continues ;
- **organiser** : filtrer, regrouper, séparer les données d'entraînement et de test relève de la théorie des **ensembles** et de la logique.

Ce cours suit cet ordre : les nombres et les ensembles (module 2), les fonctions (module 3), les dérivées (module 4), les intégrales (module 5). Le niveau requis est celui du lycée ; l'objectif est de comprendre les idées, et chaque idée est vérifiée par un petit calcul que vous pouvez modifier.`,
    },
    {
      kind: "text",
      md: `### Une ligne de tableau est un vecteur

Prenons cinq ouvrages d'une médiathèque, décrits par trois caractéristiques : le nombre de pages, l'année de parution et le nombre d'emprunts par an. Les valeurs sont inventées pour l'exemple. Ce tableau est une **matrice** de 5 lignes et 3 colonnes ; chaque ligne est un **vecteur** de trois nombres.

La **distance euclidienne** entre deux vecteurs u et v généralise le théorème de Pythagore : on additionne les carrés des écarts, coordonnée par coordonnée, puis on prend la racine carrée.`,
    },
    {
      kind: "equation",
      latex: String.raw`d(u, v) = \sqrt{\sum_{i=1}^{p} (u_i - v_i)^2}`,
      caption: "Distance euclidienne entre deux vecteurs à p coordonnées.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "# colonnes : pages, année de parution, emprunts par an (valeurs inventées)",
        "livres = np.array([",
        "    [320, 1998, 12],",
        "    [310, 2005, 14],",
        "    [96, 1998, 2],",
        "    [512, 2011, 30],",
        "    [128, 2003, 5],",
        "])",
        "print('forme de la matrice :', livres.shape)",
        "print('premier livre (une ligne) :', livres[0])",
        "print('toutes les pages (une colonne) :', livres[:, 0])",
        "",
        "d01 = np.linalg.norm(livres[0] - livres[1])",
        "d02 = np.linalg.norm(livres[0] - livres[2])",
        "print(f'distance entre les livres 0 et 1 : {d01:.2f}')",
        "print(f'distance entre les livres 0 et 2 : {d02:.2f}')",
      ),
      caption: "Une ligne est un vecteur, une colonne est une variable. La distance entre les livres 0 et 2 (224,22) est bien plus grande qu'entre les livres 0 et 1 (12,37), mais regardez d'où elle vient dans l'exemple suivant.",
    },
    {
      kind: "code",
      language: "python",
      setup: lines(
        "import numpy as np",
        "livres = np.array([[320, 1998, 12], [310, 2005, 14], [96, 1998, 2], [512, 2011, 30], [128, 2003, 5]])",
      ),
      code: lines(
        "# contribution de chaque caractéristique à la distance entre les livres 0 et 2",
        "ecarts_carres = (livres[0] - livres[2]) ** 2",
        "print('carrés des écarts (pages, année, emprunts) :', ecarts_carres)",
        "print(f'part des pages : {ecarts_carres[0] / ecarts_carres.sum():.1%}')",
        "",
        "# on centre chaque colonne puis on la divise par son écart type",
        "centres = (livres - livres.mean(axis=0)) / livres.std(axis=0)",
        "print('livres standardisés :')",
        "print(np.round(centres, 2))",
        "print('nouvelles distances :', np.linalg.norm(centres[0] - centres[1]).round(2), np.linalg.norm(centres[0] - centres[2]).round(2))",
      ),
      caption: "Les pages représentent 99,8 % de la somme des carrés, simplement parce que ce nombre est plus grand que les autres : l'échelle des variables compte. Après standardisation, chaque colonne a une moyenne nulle et un écart type de 1, les trois caractéristiques pèsent comparablement, et les distances deviennent 1,46 et 1,81.",
    },
    {
      kind: "note",
      tone: "info",
      md: "Une distance n'a de sens que si les coordonnées sont comparables. C'est pourquoi beaucoup d'algorithmes fondés sur des distances (plus proches voisins, classification automatique en groupes) demandent de standardiser les variables d'abord.",
    },
    {
      kind: "text",
      md: `### Un modèle est une fonction, apprendre c'est réduire une erreur

Le modèle le plus simple relie une variable x (la surface d'un logement) à une variable à prédire y (son prix) par une droite. La prédiction est notée ŷ (« y chapeau »), pour la distinguer du vrai prix y. Les nombres a (la pente) et b (l'ordonnée à l'origine) sont les **paramètres** du modèle.`,
    },
    {
      kind: "equation",
      latex: String.raw`\hat{y} = a\,x + b`,
      caption: "Modèle linéaire à une variable : la prédiction est une fonction affine de x.",
    },
    {
      kind: "text",
      md: "Pour choisir a et b, il faut un critère. On mesure l'écart entre chaque prix réel y_i et la prédiction, on l'élève au carré (pour que les écarts positifs et négatifs ne s'annulent pas), puis on fait la moyenne sur les n observations. C'est la **fonction de coût** J, aussi appelée erreur quadratique moyenne. **Apprendre**, ici, c'est trouver les valeurs de a et b qui rendent J la plus petite possible.",
    },
    {
      kind: "equation",
      latex: String.raw`J(a, b) = \frac{1}{n} \sum_{i=1}^{n} \bigl( y_i - (a\,x_i + b) \bigr)^2`,
      caption: "Erreur quadratique moyenne du modèle ŷ = a x + b sur n observations.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "# données simulées par le code (elles ne viennent d'aucun marché réel) :",
        "# prix = 3000 x surface + 20000, plus un bruit aléatoire",
        "rng = np.random.default_rng(0)",
        "surface = rng.uniform(20, 120, size=30)",
        "prix = 3000 * surface + 20000 + rng.normal(0, 15000, size=30)",
        "",
        "def cout(a, b):",
        "    return np.mean((prix - (a * surface + b)) ** 2)",
        "",
        "for a, b in [(1000, 0), (2000, 50000), (3000, 20000)]:",
        "    print(f'a = {a}, b = {b} : coût = {cout(a, b):.3e}')",
        "",
        "a_opt, b_opt = np.polyfit(surface, prix, 1)",
        "print(f'moindres carrés : a = {a_opt:.1f}, b = {b_opt:.1f}, coût = {cout(a_opt, b_opt):.3e}')",
      ),
      caption: "Plus la droite colle aux points, plus le coût est faible : 3,34 × 10¹⁰, puis 3,46 × 10⁹, puis 2,15 × 10⁸. np.polyfit renvoie la droite qui minimise exactement ce coût (1,97 × 10⁸, pour a = 2996,4 et b = 24 404,1). Le coût minimal reste du même ordre que la variance du bruit ajouté (15 000 au carré, soit 2,25 × 10⁸) : aucun modèle ne peut prédire le bruit. Le module 4 montre comment une descente de gradient retrouve cette droite pas à pas.",
    },
    {
      kind: "text",
      md: `### Les probabilités : mettre à jour une croyance

Quand on classe un message comme indésirable à partir d'un mot qu'il contient, on raisonne avec des **probabilités conditionnelles**. Le **théorème de Bayes** donne la probabilité d'une cause (le message est un indésirable) sachant l'observation (il contient le mot) à partir de la probabilité inverse, plus facile à estimer.`,
    },
    {
      kind: "equation",
      latex: String.raw`P(\text{indésirable} \mid \text{mot}) = \frac{P(\text{mot} \mid \text{indésirable}) \; P(\text{indésirable})}{P(\text{mot})}`,
      caption: "Théorème de Bayes. Le dénominateur vaut P(mot | indésirable) P(indésirable) + P(mot | normal) P(normal).",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "# taux inventés pour l'exemple",
        "p_indesirable = 0.30         # 30 % des messages sont des indésirables",
        "p_mot_si_indesirable = 0.60  # 60 % d'entre eux contiennent le mot",
        "p_mot_si_normal = 0.05       # 5 % des messages normaux le contiennent aussi",
        "",
        "numerateur = p_mot_si_indesirable * p_indesirable",
        "denominateur = numerateur + p_mot_si_normal * (1 - p_indesirable)",
        "print(f'P(mot) = {denominateur:.3f}')",
        "print(f'P(indésirable | mot) = {numerateur / denominateur:.3f}')",
      ),
      caption: "Avant de lire le message, la probabilité d'un indésirable était de 0,30. Une fois le mot observé, elle monte à 0,837. Les probabilités se mettent à jour avec les preuves.",
    },
    {
      kind: "text",
      md: `### Lire une formule

Les formules du cours utilisent quelques symboles qui reviennent partout :

- **Σ** (sigma majuscule) : une somme. Σ de i = 1 à n de x_i signifie x_1 + x_2 + ... + x_n ;
- **x_i** : le i-ème élément d'une liste ; **ŷ** : une valeur prédite ; **x̄** : une moyenne ;
- **∈** : « appartient à » (3 ∈ ℕ) ; **∀** : « pour tout » ; **⊂** : « est inclus dans » ;
- **f : X → Y** : une fonction qui associe à chaque élément de X un élément de Y ;
- **∇** (nabla) : le gradient, vecteur des dérivées (module 4) ; **∫** : une intégrale (module 5).

Presque toute formule se traduit en code : un signe Σ est une boucle qui accumule, ou un appel à \`sum\` ou à \`np.sum\`. Prendre l'habitude de faire cette traduction est la meilleure façon de comprendre une formule.`,
    },
    {
      kind: "equation",
      latex: String.raw`\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_i`,
      caption: "La moyenne : on additionne les n valeurs, puis on divise par n.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "valeurs = [3, 1, 4, 1, 5]",
        "n = len(valeurs)",
        "",
        "total = 0",
        "for xi in valeurs:   # la somme des x_i, terme après terme",
        "    total += xi",
        "moyenne = total / n  # (1 / n) fois la somme",
        "",
        "print('somme :', total, sum(valeurs), np.sum(valeurs))",
        "print('moyenne :', moyenne, np.mean(valeurs))",
      ),
      caption: "La boucle, la fonction sum de Python et np.sum donnent la même somme, et la même moyenne une fois divisée par n.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Traduisez la formule de l'erreur quadratique moyenne en une fonction `eqm(y_vrai, y_pred)` qui renvoie la moyenne des carrés des écarts entre les valeurs réelles et les valeurs prédites. Par exemple, `eqm([1, 2, 3], [2, 2, 5])` vaut (1 + 0 + 4) / 3.",
      starter: lines("import numpy as np", "", "def eqm(y_vrai, y_pred):", "    return 0.0"),
      solution: lines(
        "import numpy as np",
        "",
        "def eqm(y_vrai, y_pred):",
        "    ecarts = np.array(y_vrai) - np.array(y_pred)",
        "    return np.mean(ecarts ** 2)",
        "",
        "print(eqm([1, 2, 3], [2, 2, 5]))",
      ),
      test: lines(
        "_r = eqm([1, 2, 3], [2, 2, 5])",
        `assert abs(_r - 5 / 3) < 1e-9, f"avec y_vrai = [1, 2, 3] et y_pred = [2, 2, 5], on attend (1 + 0 + 4) / 3 = 1.6667 (vous avez {_r})"`,
        "_r = eqm([10, 20], [12, 20])",
        `assert abs(_r - 2) < 1e-9, f"avec [10, 20] et [12, 20], on attend (4 + 0) / 2 = 2.0 (vous avez {_r})"`,
        "_r = eqm([4, 4, 4], [4, 4, 4])",
        `assert _r == 0, f"des prédictions parfaites doivent donner une erreur nulle (vous avez {_r})"`,
      ),
      hint: "Soustrayez les deux tableaux (np.array(y_vrai) - np.array(y_pred)), élevez le résultat au carré avec ** 2, puis prenez la moyenne avec np.mean.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `distance(u, v)`, la distance euclidienne entre deux vecteurs de même longueur, d'après la formule du début du module. Par exemple, la distance entre (0, 0) et (3, 4) est 5.",
      starter: lines("import numpy as np", "", "def distance(u, v):", "    return 0.0"),
      solution: lines(
        "import numpy as np",
        "",
        "def distance(u, v):",
        "    ecarts = np.array(u) - np.array(v)",
        "    return np.sqrt(np.sum(ecarts ** 2))",
        "",
        "print(distance([0, 0], [3, 4]))",
      ),
      test: lines(
        "_r = distance([0, 0], [3, 4])",
        `assert abs(_r - 5) < 1e-9, f"la distance entre (0, 0) et (3, 4) est 5, par Pythagore (vous avez {_r})"`,
        "_r = distance([1, 1, 1, 1], [0, 0, 0, 0])",
        `assert abs(_r - 2) < 1e-9, f"la distance entre (1, 1, 1, 1) et l'origine est la racine de 4, soit 2 (vous avez {_r})"`,
        "_r = distance([2, 5, 7], [2, 5, 7])",
        `assert _r == 0, f"un point est à une distance nulle de lui-même (vous avez {_r})"`,
      ),
      hint: "Soustrayez les deux vecteurs, élevez chaque écart au carré, additionnez, puis prenez la racine carrée avec np.sqrt.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Voici cinq points et un modèle très simple, ŷ = a x (une droite qui passe par l'origine). La fonction `cout(a)` renvoie l'erreur quadratique moyenne pour une pente a, et `candidats` contient les pentes 0, 0,1, 0,2, ... jusqu'à 5. Trouvez dans `candidats` la pente qui donne le **coût le plus faible** et rangez-la dans `meilleure_pente`. C'est, en miniature, ce que fait un algorithme d'apprentissage.",
      setup: lines(
        "import numpy as np",
        "x = np.array([1, 2, 3, 4, 5])",
        "y = np.array([2.1, 3.9, 6.2, 7.8, 10.1])",
        "",
        "def cout(a):",
        "    return np.mean((y - a * x) ** 2)",
        "",
        "candidats = np.arange(0, 5.01, 0.1)",
      ),
      starter: "meilleure_pente = 0.0",
      solution: lines("meilleure_pente = min(candidats, key=cout)", "print(meilleure_pente, cout(meilleure_pente))"),
      test: `assert abs(float(meilleure_pente) - 2.0) < 0.05, f"la pente qui colle le mieux aux points est voisine de 2 (vous avez {meilleure_pente})"`,
      hint: "Calculez le coût de chaque candidat, par exemple avec une liste [cout(a) for a in candidats], et gardez celui dont le coût est minimal (min avec key=cout, ou np.argmin).",
    },
    {
      kind: "text",
      md: `### La suite du cours

- **Module 2, nombres et ensembles** : les types de nombres, ce que l'ordinateur en fait (les flottants ont des limites), et les opérations sur les ensembles.
- **Module 3, fonctions** : domaine, image, fonctions usuelles, composition et fonctions d'activation.
- **Module 4, dérivées** : la dérivée comme limite, les différences finies, le gradient et la descente de gradient.
- **Module 5, intégrales** : l'aire sous une courbe, les sommes de Riemann, et le lien avec les probabilités.

L'algèbre linéaire, les probabilités et les statistiques ont leurs propres pages sur le site : ce cours en pose les bases et renvoie vers elles.`,
    },
  ],
  quiz: [
    {
      question: "Que mesure une fonction de coût (ou de perte) ?",
      options: [
        "La durée d'exécution de l'algorithme",
        "L'écart entre les prédictions du modèle et les valeurs réelles, que l'apprentissage cherche à réduire",
        "Le nombre de lignes du jeu de données",
        "Le prix de l'entraînement du modèle",
      ],
      correct: 1,
      explanation: "La fonction de coût résume en un nombre la qualité des prédictions pour des paramètres donnés. Apprendre revient à chercher les paramètres qui la rendent la plus petite.",
    },
    {
      question: "Dans le modèle ŷ = a x + b, que sont a et b ?",
      options: ["Les données observées", "Des paramètres du modèle, dont l'apprentissage cherche les valeurs", "Des probabilités", "Deux fonctions de coût"],
      correct: 1,
      explanation: "x est l'entrée et ŷ la prédiction ; a (la pente) et b (l'ordonnée à l'origine) sont les paramètres que l'on ajuste pour réduire le coût.",
    },
    {
      question: "Quelle branche des mathématiques décrit l'incertitude et le bruit des données ?",
      options: ["Les probabilités et les statistiques", "La théorie des ensembles seule", "La géométrie euclidienne", "L'arithmétique modulaire"],
      correct: 0,
      explanation: "Les probabilités décrivent l'incertitude, et les statistiques permettent de l'estimer à partir des données : c'est la base de l'inférence et des tests.",
    },
    {
      question: "Pourquoi standardise-t-on souvent les variables avant de calculer des distances ?",
      options: [
        "Pour que les nombres soient entiers",
        "Pour qu'une variable aux grandes valeurs (comme le nombre de pages) ne domine pas la distance à elle seule",
        "Pour supprimer les valeurs négatives",
        "Pour que la distance soit toujours nulle",
      ],
      correct: 1,
      explanation: "La distance additionne des carrés d'écarts : une variable dont l'échelle est grande y pèse davantage. Centrer et réduire chaque colonne rend les contributions comparables.",
    },
    {
      question: "Que fait le signe Σ (sigma majuscule) dans une formule ?",
      options: ["Il multiplie tous les termes", "Il additionne une suite de termes", "Il calcule une dérivée", "Il prend la racine carrée"],
      correct: 1,
      explanation: "Σ de i = 1 à n de x_i est la somme x_1 + x_2 + ... + x_n. En Python, c'est une boucle qui accumule, ou sum et np.sum.",
    },
  ],
};
