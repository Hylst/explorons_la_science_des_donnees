import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

export const module1: LessonModule = {
  id: "deux-sens-du-mot",
  title: "Deux sens pour un mot : transformeur de données et architecture Transformer",
  duration: "1 h",
  summary:
    "Le mot « transformer » désigne deux choses sans rapport en machine learning : un objet de scikit-learn qui prépare les données (fit / transform) et une architecture de réseau de neurones fondée sur l'attention. Ce module apprend à les distinguer et à situer la suite du cours.",
  objectives: [
    "Distinguer le transformeur de données (prétraitement) de l'architecture Transformer (réseau de neurones)",
    "Expliquer le contrat fit / transform de scikit-learn et ce qu'un transformeur apprend",
    "Écrire son propre transformeur, utilisable dans un Pipeline",
    "Situer les cinq modules suivants et savoir dans quel sens chaque terme y est employé",
  ],
  sections: [
    {
      kind: "text",
      md: `### Un mot, deux sens

En anglais, un *transformer* est tout ce qui transforme quelque chose. Le monde de la data science a retenu ce nom pour deux idées **qui n'ont rien à voir** :

- **le transformeur de données** : un objet de scikit-learn qui prend un tableau de nombres et en renvoie un autre, plus adapté à un modèle. \`StandardScaler\` centre et réduit les colonnes, \`OneHotEncoder\` transforme une catégorie en colonnes de 0 et de 1. C'est du **prétraitement** ;
- **l'architecture Transformer** : un type de réseau de neurones fondé sur le mécanisme d'attention, présenté par Vaswani et ses coauteurs en 2017 dans l'article *Attention Is All You Need*. BERT, GPT et les Vision Transformers en sont des variantes.

Les deux sont employés dans les mêmes projets, ce qui entretient la confusion. Ce cours les traite l'un après l'autre : les modules 2, 3 et 6 portent sur les transformeurs de données, les modules 4 et 5 sur l'architecture.`,
    },
    {
      kind: "text",
      md: `### Premier sens : fit puis transform

Un transformeur de scikit-learn respecte un contrat très simple, à deux méthodes :

- \`fit(X)\` **apprend** quelque chose sur les données, par exemple la moyenne et l'écart-type de chaque colonne ;
- \`transform(X)\` **applique** ce qui a été appris, sur ces données ou sur d'autres.

\`fit_transform(X)\` enchaîne les deux. La séparation compte : on apprend sur le jeu d'entraînement, puis on applique la même transformation, sans la réapprendre, au jeu de test et aux données futures. Le module 2 montre ce qui arrive quand on oublie cette règle.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from sklearn.preprocessing import StandardScaler",
        "",
        "notes = np.array([[8.0], [12.0], [14.0], [16.0]])",
        "scaler = StandardScaler()",
        "scaler.fit(notes)",
        "print('moyenne apprise :', scaler.mean_)",
        "print('écart-type appris :', scaler.scale_.round(3))",
        "print('notes transformées :', scaler.transform(notes).round(2).ravel())",
        "print('une nouvelle note, 10 :', scaler.transform(np.array([[10.0]])).round(2))",
      ),
      caption:
        "Quatre notes sur 20, moyenne 12,5 et écart-type 2,958 appris par fit. Une nouvelle note de 10 est transformée avec ces mêmes valeurs : elle se place à 0,85 écart-type sous la moyenne des quatre notes d'origine.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Écrivez votre propre transformeur `CentreurReducteur`. Sa méthode `fit(X, y=None)` apprend la moyenne et l'écart-type de chaque colonne (avec **n** au dénominateur, comme `StandardScaler`) et les range dans `moyenne_` et `ecart_type_` ; si l'écart-type d'une colonne est nul, on le remplace par 1 pour ne pas diviser par zéro. `fit` renvoie `self`. Sa méthode `transform(X)` renvoie `(X - moyenne_) / ecart_type_`. Grâce à `TransformerMixin`, `fit_transform` existe déjà.",
      starter: lines(
        "import numpy as np",
        "from sklearn.base import BaseEstimator, TransformerMixin",
        "",
        "class CentreurReducteur(BaseEstimator, TransformerMixin):",
        "    def fit(self, X, y=None):",
        "        # à compléter : apprendre moyenne_ et ecart_type_ colonne par colonne",
        "        return self",
        "",
        "    def transform(self, X):",
        "        # à compléter : appliquer ce qui a été appris",
        "        return np.asarray(X, dtype=float)",
      ),
      solution: lines(
        "import numpy as np",
        "from sklearn.base import BaseEstimator, TransformerMixin",
        "",
        "class CentreurReducteur(BaseEstimator, TransformerMixin):",
        "    def fit(self, X, y=None):",
        "        X = np.asarray(X, dtype=float)",
        "        self.moyenne_ = X.mean(axis=0)",
        "        ecart_type = X.std(axis=0)",
        "        self.ecart_type_ = np.where(ecart_type == 0, 1.0, ecart_type)",
        "        return self",
        "",
        "    def transform(self, X):",
        "        X = np.asarray(X, dtype=float)",
        "        return (X - self.moyenne_) / self.ecart_type_",
        "",
        "A = np.array([[1.0, 5.0], [2.0, 5.0], [6.0, 5.0], [7.0, 5.0]])",
        "print(CentreurReducteur().fit_transform(A).round(2))",
      ),
      test: lines(
        "from sklearn.preprocessing import StandardScaler as _SS",
        "_A = np.array([[1.0, 5.0], [2.0, 5.0], [6.0, 5.0], [7.0, 5.0]])",
        "_B = np.array([[3.0, 5.0], [10.0, 6.0]])",
        "_t = CentreurReducteur()",
        "assert _t.fit(_A) is _t, \"fit doit renvoyer self, pour que l'on puisse écrire fit(...).transform(...)\"",
        "assert hasattr(_t, 'moyenne_') and hasattr(_t, 'ecart_type_'), \"après fit, le transformeur doit avoir appris moyenne_ et ecart_type_\"",
        "_ref = _SS().fit(_A)",
        "assert np.allclose(_t.moyenne_, _ref.mean_), f\"moyenne_ devrait valoir {_ref.mean_} (vous avez {_t.moyenne_})\"",
        "assert np.allclose(_t.ecart_type_, _ref.scale_), f\"ecart_type_ devrait valoir {_ref.scale_} : n au dénominateur, et 1 si l'écart-type est nul (vous avez {_t.ecart_type_})\"",
        "assert np.allclose(_t.transform(_B), _ref.transform(_B)), \"transform doit utiliser la moyenne et l'écart-type appris sur A, pas ceux de B\"",
        "assert np.allclose(CentreurReducteur().fit_transform(_A), _ref.transform(_A)), \"fit_transform doit donner le même résultat que fit puis transform\"",
      ),
      hint: "Dans fit : self.moyenne_ = X.mean(axis=0) et X.std(axis=0), puis np.where(ecart_type == 0, 1.0, ecart_type). Dans transform : (X - self.moyenne_) / self.ecart_type_.",
    },
    {
      kind: "note",
      tone: "info",
      md: "Dans scikit-learn, les attributs **appris pendant fit** portent un tiret bas final : `mean_`, `scale_`, `n_features_in_`. Ceux que l'on règle soi-même à la création n'en ont pas (`with_mean`, `n_neighbors`). Cette convention permet de reconnaître d'un coup d'œil ce qu'un objet a retenu, et de vérifier qu'il a bien été entraîné.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "from sklearn.compose import ColumnTransformer",
        "from sklearn.decomposition import PCA",
        "from sklearn.feature_extraction.text import TfidfVectorizer",
        "from sklearn.linear_model import LogisticRegression",
        "from sklearn.neighbors import KNeighborsClassifier",
        "from sklearn.preprocessing import MinMaxScaler, OneHotEncoder, StandardScaler",
        "",
        "objets = [StandardScaler(), MinMaxScaler(), OneHotEncoder(), PCA(), TfidfVectorizer(), ColumnTransformer([]), LogisticRegression(), KNeighborsClassifier()]",
        "for objet in objets:",
        "    print(f'{type(objet).__name__:<22} transform : {hasattr(objet, \"transform\")!s:<6} predict : {hasattr(objet, \"predict\")}')",
      ),
      caption:
        "Les six premiers objets ont transform sans predict : ce sont des transformeurs, qu'il s'agisse de mettre à l'échelle, d'encoder, de réduire les dimensions ou de compter des mots (TfidfVectorizer, vu dans le cours de traitement du langage). Les deux derniers prédisent : ce sont des modèles.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt:
        "Un `StandardScaler` a été appris sur des mesures (taille en cm, poids en kg) : voici `scaler` et les valeurs centrées-réduites `Z`. Écrivez `retrouver(scaler, Z)` qui **inverse** la transformation et renvoie les mesures d'origine, en utilisant seulement les attributs appris `mean_` et `scale_` (sans appeler `inverse_transform`).",
      setup: lines(
        "import numpy as np",
        "from sklearn.preprocessing import StandardScaler",
        "",
        "mesures = np.array([[150.0, 52.0], [165.0, 60.0], [180.0, 81.0], [172.0, 70.0]])",
        "scaler = StandardScaler().fit(mesures)",
        "Z = scaler.transform(mesures)",
      ),
      starter: lines("def retrouver(scaler, Z):", "    # à compléter à l'aide de scaler.mean_ et scaler.scale_", "    return Z"),
      solution: lines(
        "def retrouver(scaler, Z):",
        "    return Z * scaler.scale_ + scaler.mean_",
        "",
        "print(retrouver(scaler, Z).round(1))",
      ),
      test: lines(
        "_r = retrouver(scaler, Z)",
        "assert np.allclose(_r, mesures), f\"on doit retrouver les mesures d'origine, c'est-à-dire z × écart-type + moyenne (première ligne obtenue : {np.round(_r[0], 2)}, attendue : {mesures[0]})\"",
        "_autres = np.array([[0.0, 0.0], [1.0, -1.0]])",
        "assert np.allclose(retrouver(scaler, _autres), scaler.inverse_transform(_autres)), \"la fonction doit marcher sur n'importe quelles valeurs centrées-réduites, pas seulement sur Z\"",
      ),
      hint: "La transformation est z = (x - moyenne) / écart-type. Pour la défaire : x = z × écart-type + moyenne, avec scaler.scale_ et scaler.mean_.",
    },
    {
      kind: "text",
      md: `### Second sens : l'architecture Transformer

Dans l'autre sens, un **Transformer** n'est pas un outil de préparation mais un **modèle**, avec des millions de paramètres appris. Il reçoit une séquence (des mots, des morceaux d'image) et produit une séquence de vecteurs en laissant chaque élément « regarder » tous les autres. Le calcul central, l'**attention**, tient en une formule, que le module 4 programme pas à pas :`,
    },
    {
      kind: "equation",
      latex: String.raw`\text{Attention}(Q,K,V) \;=\; \operatorname{softmax}\!\left(\frac{Q\,K^{\top}}{\sqrt{d_k}}\right)V`,
      caption: "L'attention de l'architecture Transformer (Vaswani et al., 2017) : Q, K et V sont des matrices construites à partir de la séquence, d_k est la dimension des clés",
    },
    {
      kind: "note",
      tone: "warning",
      md: "La bibliothèque Python **transformers** de Hugging Face contient des modèles du **second** sens (BERT, GPT, ViT...). Elle ne contient pas les transformeurs de données de scikit-learn (`sklearn.preprocessing`, `sklearn.compose`...). Quand une page parle de « transformers », regardez le contexte : `fit_transform`, `Pipeline` ou `ColumnTransformer` désignent le prétraitement ; `attention`, `BERT`, `token` ou `GPU` désignent l'architecture. Le cours de traitement du langage du site programme l'attention une première fois ; les modules 4 et 5 de ce cours vont plus loin.",
    },
  ],
  quiz: [
    {
      question: "Que fait `fit` dans `StandardScaler().fit(X_train)` ?",
      options: [
        "Il remplace X_train par des valeurs centrées-réduites",
        "Il calcule et mémorise la moyenne et l'écart-type de chaque colonne",
        "Il entraîne un réseau de neurones",
        "Il supprime les valeurs extrêmes",
      ],
      correct: 1,
      explanation: "fit apprend les statistiques (mean_ et scale_) sans rien renvoyer d'utile en soi ; c'est transform qui applique la transformation avec ce qui a été appris.",
    },
    {
      question: "Parmi ces objets de scikit-learn, lequel est un transformeur de données ?",
      options: ["LogisticRegression", "KNeighborsClassifier", "OneHotEncoder", "accuracy_score"],
      correct: 2,
      explanation: "OneHotEncoder a fit et transform et ne prédit rien. LogisticRegression et KNeighborsClassifier sont des modèles (predict), et accuracy_score est une simple fonction de mesure.",
    },
    {
      question: "La bibliothèque Python `transformers` de Hugging Face sert surtout à :",
      options: [
        "Mettre à l'échelle des colonnes numériques",
        "Utiliser des modèles de l'architecture Transformer, comme BERT ou GPT",
        "Remplacer scikit-learn",
        "Encoder des variables catégorielles",
      ],
      correct: 1,
      explanation: "Malgré le nom, elle ne contient pas les transformeurs de données de scikit-learn : elle rassemble des modèles fondés sur l'attention et leurs outils.",
    },
    {
      question: "Que signifie le tiret bas final dans `scaler.mean_` ?",
      options: [
        "L'attribut est privé et inaccessible",
        "L'attribut a été calculé pendant fit",
        "L'attribut est obsolète",
        "L'attribut est un nombre entier",
      ],
      correct: 1,
      explanation: "C'est une convention de scikit-learn : les attributs appris à partir des données se terminent par un tiret bas. Avant fit, ils n'existent pas.",
    },
  ],
};
