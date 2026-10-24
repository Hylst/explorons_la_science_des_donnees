import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

// Données réelles de scikit-learn (569 tumeurs, 30 mesures), découpées une fois pour toutes (graine 0).
const DONNEES = lines(
  "import time, hashlib",
  "import numpy as np",
  "import pandas as pd",
  "from sklearn.datasets import load_breast_cancer",
  "from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold",
  "from sklearn.pipeline import Pipeline",
  "from sklearn.preprocessing import StandardScaler",
  "from sklearn.linear_model import LogisticRegression",
  "from sklearn.ensemble import RandomForestClassifier",
  "from sklearn.tree import DecisionTreeClassifier",
  "",
  "X, y = load_breast_cancer(return_X_y=True)",
  "X_app, X_test, y_app, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)",
);

// Le journal d'expériences maison et les 13 expériences de l'exemple.
const JOURNAL = lines(
  DONNEES,
  "",
  "def empreinte(tableau):",
  "    # empreinte courte (12 caractères) des octets du tableau : change si une seule valeur change",
  "    return hashlib.sha256(np.ascontiguousarray(tableau).tobytes()).hexdigest()[:12]",
  "",
  "journal = []   # une expérience = un dictionnaire",
  "plis = StratifiedKFold(5, shuffle=True, random_state=0)",
  "",
  "def lancer(nom, modele, parametres):",
  "    debut = time.perf_counter()",
  "    scores = cross_val_score(modele, X_app, y_app, cv=plis)",
  "    journal.append({'nom': nom, 'parametres': str(parametres), 'donnees': empreinte(X_app),",
  "                    'moyenne': scores.mean(), 'ecart_type': scores.std(),",
  "                    'duree_s': time.perf_counter() - debut, 'modele': modele})",
  "",
  "for C in [0.001, 0.01, 0.1, 1, 10, 100]:",
  "    lancer('logistique', Pipeline([('echelle', StandardScaler()), ('modele', LogisticRegression(C=C, max_iter=2000))]), {'C': C})",
  "for profondeur in [1, 2, 3, 5, None]:",
  "    lancer('arbre', DecisionTreeClassifier(max_depth=profondeur, random_state=0), {'max_depth': profondeur})",
  "for n in [10, 100]:",
  "    lancer('foret', RandomForestClassifier(n_estimators=n, random_state=0), {'n_estimators': n})",
);

export const moduleSuiviExperiences: LessonModule = {
  id: "suivi-experiences",
  title: "Suivre ses expériences",
  duration: "2 h",
  summary: "Tenir un journal d'expériences (paramètres, empreinte des données, métriques, durée), le lire comme un tableau, comparer sans se raconter d'histoire, et voir à quoi ressemble le même suivi avec MLflow.",
  objectives: [
    "Enregistrer pour chaque essai ses paramètres, l'empreinte de ses données, ses métriques et sa durée",
    "Transformer le journal en tableau, le trier et en tirer une comparaison honnête",
    "Distinguer une vraie différence de performance d'un écart dans le bruit de la validation croisée",
    "Lire un suivi d'expériences MLflow et le rapprocher du journal fait à la main",
  ],
  sections: [
    {
      kind: "text",
      md: `### Le problème : « c'était lequel, le bon essai ? »

Après une semaine d'essais, on retrouve des fichiers nommés \`modele_final.pkl\`, \`modele_final2.pkl\`, \`modele_vraiment_final.pkl\`, et personne ne sait avec quels paramètres, quelles données ni quel score. Le **suivi d'expériences** consiste à écrire, pour chaque essai, de quoi le **retrouver et le refaire** :

- les **paramètres** (type de modèle, hyperparamètres, graine) ;
- une **empreinte des données** : un résumé court qui change dès qu'une valeur change, pour savoir si deux essais ont vu le même tableau ;
- les **métriques** (ici la réussite en validation croisée, moyenne et écart-type des plis) ;
- la **durée** et, selon le cas, la version du code et des bibliothèques.

Il n'y a pas besoin d'outil pour commencer : une liste de dictionnaires suffit. Les outils servent quand les essais se comptent en centaines, ou qu'une équipe doit partager le même journal.

Le jeu est celui du module précédent, sans altération : **569 tumeurs**, 30 mesures, découpées une fois pour toutes en 426 lignes d'apprentissage et 143 de test. Tous les essais sont comparés par validation croisée à 5 plis **sur l'apprentissage seulement**. Le test reste de côté.`,
    },
    {
      kind: "text",
      md: `### L'empreinte des données

L'empreinte vient de \`hashlib.sha256\` appliquée aux octets du tableau (\`tableau.tobytes()\`). Deux tableaux identiques donnent la même empreinte ; modifier une seule valeur, même de 0,001, en donne une complètement différente. On n'en garde que les 12 premiers caractères pour la lisibilité : c'est suffisant pour repérer un changement, pas pour une garantie de sécurité.

Utilité concrète : si deux essais portent la même empreinte, ils ont vu les mêmes données et leur comparaison est légitime. Si l'empreinte diffère, quelqu'un a changé le jeu, le nettoyage ou le découpage, et l'écart de score peut venir de là.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        JOURNAL,
        "",
        "# L'empreinte : stable pour les mêmes données, différente dès qu'une valeur change",
        "modifie = X_app.copy()",
        "modifie[0, 0] += 0.001",
        "print('empreinte des données    :', empreinte(X_app))",
        "print('même tableau, encore une fois :', empreinte(X_app))",
        "print('une valeur changée de 0,001   :', empreinte(modifie))",
        "",
        "# Le journal devient un tableau pandas : on peut le trier, filtrer, tracer",
        "print()",
        "print(len(journal), 'expériences, 1 seule empreinte de données :', len({e['donnees'] for e in journal}) == 1)",
        "tableau = pd.DataFrame(journal).drop(columns='modele').sort_values('moyenne', ascending=False).reset_index(drop=True)",
        "print(tableau[['nom', 'parametres', 'moyenne', 'ecart_type']].round(4).to_string())",
      ),
      caption: "Treize essais : six régressions logistiques (C de 0,001 à 100), cinq arbres de profondeur 1, 2, 3, 5 ou illimitée, deux forêts (10 et 100 arbres). Tous portent la même empreinte de données. En tête : la régression logistique avec C = 1 (0,9812 en moyenne, écart-type des plis 0,0120), puis C = 0,1 (0,9765) et C = 10 (0,9694). Dernière : C = 0,001 (0,8802). Les arbres vont de 0,9061 à 0,9272, les forêts de 0,9483 (10 arbres) à 0,9671 (100 arbres).",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez la fonction `empreinte(tableau)` qui renvoie les **12 premiers caractères** de l'empreinte SHA-256 (en hexadécimal) des octets du tableau : `hashlib.sha256(np.ascontiguousarray(tableau).tobytes()).hexdigest()`. `X_app` est prêt.",
      setup: DONNEES,
      starter: lines(
        "def empreinte(tableau):",
        "    return ''",
      ),
      solution: lines(
        "def empreinte(tableau):",
        "    return hashlib.sha256(np.ascontiguousarray(tableau).tobytes()).hexdigest()[:12]",
        "",
        "print(empreinte(X_app))",
      ),
      test: lines(
        "_e = empreinte(X_app)",
        "assert isinstance(_e, str) and len(_e) == 12, \"l'empreinte doit être une chaîne de 12 caractères : .hexdigest()[:12]\"",
        "assert _e == hashlib.sha256(np.ascontiguousarray(X_app).tobytes()).hexdigest()[:12], \"utilisez SHA-256 sur tableau.tobytes() (hashlib.sha256(...).hexdigest())\"",
        "assert empreinte(X_app.copy()) == _e, \"deux tableaux identiques doivent avoir la même empreinte\"",
        "_m = X_app.copy()",
        "_m[0, 0] += 0.001",
        "assert empreinte(_m) != _e, \"une valeur modifiée doit changer l'empreinte\"",
      ),
      hint: "hashlib.sha256 prend des octets ; tableau.tobytes() donne ceux d'un tableau NumPy. hexdigest() renvoie le texte, [:12] en garde le début.",
    },
    {
      kind: "text",
      md: `### Comparer honnêtement

Le tableau trié donne envie de crier victoire pour la première ligne. Trois précautions.

- **Lire l'écart-type des plis.** La moyenne de 5 plis cache une dispersion. Ici, la meilleure moyenne a un écart-type de 0,0120 : toute expérience dont la moyenne est à moins de 0,0120 de la tête n'est pas distinguable d'elle avec ces seules mesures. C'est le cas de **3 expériences** sur 13 (C = 1, C = 0,1 et C = 10). Ce n'est pas un test statistique, c'est un garde-fou.
- **Se méfier du maximum de nombreux essais.** Plus on essaie de réglages, plus la meilleure moyenne a de chances d'être flatteuse par pur hasard : on a choisi le gagnant sur les mesures mêmes qui le classent. D'où le jeu de test gardé de côté, à consulter peu et à la fin.
- **Regarder la durée.** Un gain de 0,01 qui multiplie le temps d'entraînement par plusieurs dizaines n'a pas le même intérêt selon l'usage.

L'exemple suivant refait l'ajustement de chaque essai sur tout l'apprentissage et le mesure sur le test (143 tumeurs : un seul exemple mal classé change la réussite de 0,007).`,
    },
    {
      kind: "code",
      language: "python",
      setup: JOURNAL,
      code: lines(
        "# Chaque expérience est réajustée sur tout l'apprentissage, puis mesurée sur le test",
        "for e in journal:",
        "    e['modele'].fit(X_app, y_app)",
        "    e['test'] = e['modele'].score(X_test, y_test)",
        "",
        "tableau = pd.DataFrame(journal).drop(columns='modele').sort_values('moyenne', ascending=False).reset_index(drop=True)",
        "print(tableau[['nom', 'parametres', 'moyenne', 'test']].round(4).to_string())",
        "",
        "print()",
        "print('corrélation des rangs (Spearman) entre validation et test :',",
        "      round(tableau['moyenne'].corr(tableau['test'], method='spearman'), 3))",
        "tete = tableau.iloc[0]",
        "print('tête de la validation : moyenne', round(tete['moyenne'], 4), ' réussite sur le test', round(tete['test'], 4))",
        "print('durée de la forêt de 100 arbres / de la régression C = 1 :',",
        "      round(tableau.loc[tableau['parametres'] == \"{'n_estimators': 100}\", 'duree_s'].iloc[0] /",
        "            tableau.loc[tableau['parametres'] == \"{'C': 1}\", 'duree_s'].iloc[0]), 'fois')",
      ),
      caption: "La tête de la validation (régression logistique C = 1) réussit aussi 0,9580 sur le test, à égalité avec C = 0,1 : ici, le choix sur la validation était bon. Mais son 0,9812 de validation redescend à 0,9580 sur le test : le score du gagnant, choisi parmi 13, est optimiste d'environ deux points. Le classement ne se conserve pas à l'identique : la forêt de 100 arbres (0,9671 en validation) réussit 0,9441 sur le test, moins que celle de 10 arbres (0,9510). La corrélation des rangs entre validation et test est de 0,905 : élevée, pas parfaite. Un seul découpage de 143 tumeurs : ces écarts de quelques exemples ne suffisent pas à départager des modèles voisins. Le rapport de durée varie d'une exécution à l'autre : lisez-le dans votre navigateur, il n'est pas écrit ici.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Le `journal` (13 expériences) et le tableau trié `tableau` (colonnes `moyenne` et `ecart_type`, meilleure expérience en première ligne) sont prêts. Rangez dans `indistinguables` le **nombre d'expériences** dont la moyenne est supérieure ou égale à `meilleure moyenne - écart-type de la meilleure`, la meilleure comprise.",
      setup: lines(
        JOURNAL,
        "tableau = pd.DataFrame(journal).drop(columns='modele').sort_values('moyenne', ascending=False).reset_index(drop=True)",
      ),
      starter: lines("indistinguables = 1"),
      solution: lines(
        "meilleure = tableau.loc[0, 'moyenne']",
        "marge = tableau.loc[0, 'ecart_type']",
        "indistinguables = int((tableau['moyenne'] >= meilleure - marge).sum())",
        "print(indistinguables, 'expériences sur', len(tableau))",
      ),
      test: lines(
        "_m = tableau.loc[0, 'moyenne'] - tableau.loc[0, 'ecart_type']",
        "_attendu = int((tableau['moyenne'] >= _m).sum())",
        "assert indistinguables == _attendu, f\"il faut compter les lignes dont la moyenne dépasse meilleure - écart-type (le test en trouve {_attendu}), pas {indistinguables}\"",
      ),
      hint: "Une comparaison sur une colonne pandas donne des booléens ; .sum() les compte.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "La fonction `lancer(nom, modele, parametres)` ajoute une expérience au `journal` (qui en compte déjà 13). Lancez une expérience de nom `'knn'` avec un `Pipeline` en deux étapes (`StandardScaler`, puis `KNeighborsClassifier(n_neighbors=5)`) et les paramètres `{'n_neighbors': 5}`.",
      setup: JOURNAL,
      starter: lines(
        "from sklearn.neighbors import KNeighborsClassifier",
        "# complétez : lancer('knn', ..., {'n_neighbors': 5})",
      ),
      solution: lines(
        "from sklearn.neighbors import KNeighborsClassifier",
        "voisins = Pipeline([('echelle', StandardScaler()), ('modele', KNeighborsClassifier(n_neighbors=5))])",
        "lancer('knn', voisins, {'n_neighbors': 5})",
        "print(journal[-1]['nom'], round(journal[-1]['moyenne'], 4))",
      ),
      test: lines(
        "assert len(journal) == 14, f\"le journal doit compter 14 expériences après la vôtre, il en a {len(journal)} : appelez lancer(...)\"",
        "assert journal[-1]['nom'] == 'knn' and journal[-1]['parametres'] == str({'n_neighbors': 5}), \"nom 'knn' et paramètres {'n_neighbors': 5} attendus\"",
        "assert 0.9 < journal[-1]['moyenne'] < 1.0, \"la moyenne de validation croisée est hors de l'intervalle plausible : avez-vous gardé le StandardScaler ?\"",
      ),
      hint: "Un Pipeline se construit comme dans le module 1 : une liste de couples (nom, objet). La fonction lancer calcule les scores et remplit le journal à votre place.",
    },
    {
      kind: "text",
      md: `### Le même suivi avec MLflow

**MLflow** est une bibliothèque libre qui fait ce que fait notre journal, avec en plus un serveur, une interface web pour comparer les essais et un stockage des modèles. Il ne tourne pas dans le moteur de ce site : le code ci-dessous est à lire, ou à essayer sur votre machine après installation. Comparez avec notre fonction \`lancer\` : on retrouve les paramètres, les métriques et le modèle.

\`\`\`python
import mlflow
import mlflow.sklearn

mlflow.set_experiment("cancer-du-sein")

for C in [0.01, 0.1, 1, 10]:
    with mlflow.start_run(run_name=f"logistique-C{C}"):
        mlflow.log_param("C", C)
        mlflow.log_param("empreinte_donnees", empreinte(X_app))
        modele = Pipeline([("echelle", StandardScaler()),
                           ("modele", LogisticRegression(C=C, max_iter=2000))])
        scores = cross_val_score(modele, X_app, y_app, cv=plis)
        mlflow.log_metric("moyenne_cv", scores.mean())
        mlflow.log_metric("ecart_type_cv", scores.std())
        modele.fit(X_app, y_app)
        mlflow.sklearn.log_model(modele, "modele")
\`\`\`

Chaque passage dans \`with mlflow.start_run()\` crée un essai ; \`log_param\` note une entrée, \`log_metric\` une mesure, \`log_model\` range le modèle ajusté avec son environnement. Ensuite, la commande \`mlflow ui\` ouvre une page locale où l'on trie et compare les essais. Ce que l'outil apporte, c'est le partage et le confort ; ce qu'il n'apporte pas, c'est la rigueur de comparaison : les précautions de la section précédente restent à votre charge.`,
    },
    {
      kind: "note",
      tone: "tip",
      md: "Un bon journal se lit sans vous : si un collègue ne peut pas retrouver, à partir d'une seule ligne, les données, le code et les paramètres d'un essai, il manque une colonne. Notez aussi les essais décevants : ce sont eux qui évitent de refaire deux fois la même erreur.",
    },
  ],
  quiz: [
    {
      question: "À quoi sert l'empreinte (hash) des données dans le journal d'une expérience ?",
      options: [
        "À chiffrer les données pour les protéger",
        "À accélérer l'entraînement du modèle",
        "À repérer si deux essais ont vu exactement les mêmes données, donc si leur comparaison est légitime",
        "À remplacer la validation croisée",
      ],
      correct: 2,
      explanation: "Deux tableaux identiques ont la même empreinte et une seule valeur modifiée suffit à la changer. Si les empreintes diffèrent, un écart de score peut venir des données plutôt que du modèle.",
    },
    {
      question: "La meilleure expérience a une moyenne de 0,9812 et un écart-type de 0,0120 ; deux autres sont à 0,9765 et 0,9694. Que peut-on en dire ?",
      options: [
        "Qu'elles sont indistinguables de la meilleure avec ces seules mesures, leur écart étant inférieur à 0,0120",
        "Que la meilleure est certainement meilleure que les deux autres",
        "Que les deux autres sont à rejeter",
        "Qu'il faut choisir la plus rapide à entraîner sans autre examen",
      ],
      correct: 0,
      explanation: "Les écarts (0,0047 et 0,0118) sont plus petits que la dispersion des plis. La moyenne de la tête n'est pas assez au-dessus du reste pour affirmer qu'elle gagne. On peut alors choisir sur d'autres critères : simplicité, durée.",
    },
    {
      question: "Pourquoi le score de validation du gagnant (0,9812) est-il plus élevé que sa réussite sur le test (0,9580) ?",
      options: [
        "Parce que le test est toujours truqué",
        "Parce que le gagnant a été choisi parmi 13 essais sur ces mêmes mesures de validation, ce qui les rend optimistes",
        "Parce que le modèle a été entraîné sur le test",
        "Parce que la validation croisée ne sert à rien",
      ],
      correct: 1,
      explanation: "Choisir le maximum d'un grand nombre d'essais sélectionne aussi une part de chance. Le jeu de test, gardé de côté, donne une mesure moins flatteuse, donc plus proche de ce qu'on verra ensuite.",
    },
    {
      question: "Que fait mlflow.log_param(\"C\", 1) ?",
      options: [
        "Il entraîne un modèle avec C = 1",
        "Il enregistre dans l'essai en cours que le paramètre C valait 1",
        "Il choisit automatiquement la meilleure valeur de C",
        "Il compare l'essai aux précédents et affiche un classement",
      ],
      correct: 1,
      explanation: "log_param note une entrée de l'essai, comme la clé 'parametres' de notre dictionnaire. L'entraînement et le choix restent votre code ; MLflow garde la trace et la rend consultable.",
    },
  ],
};
