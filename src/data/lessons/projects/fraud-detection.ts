import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

/**
 * 40 000 transactions fictives de cartes bancaires, dont 320 fraudes (0,8 %), fabriquées avec une graine fixe.
 * Les fraudes suivent d'autres distributions que les transactions normales, mais elles se chevauchent.
 */
const DONNEES = lines(
  "import numpy as np",
  "import pandas as pd",
  "",
  "# 40 000 transactions fictives de cartes bancaires, dont 320 fraudes (0,8 %), fabriquées avec une graine fixe",
  "rng = np.random.default_rng(2024)",
  "n = 40000",
  "fraude = np.zeros(n, dtype=int)",
  "fraude[rng.choice(n, size=320, replace=False)] = 1",
  "f = fraude == 1  # vrai pour les fraudes : sert à fabriquer des variables qui diffèrent selon le cas",
  "",
  "# montant habituel du client, puis rapport entre le montant payé et cette habitude (plus élevé pour les fraudes)",
  "habituel = rng.lognormal(np.log(40), 0.5, n)",
  "rapport = np.where(f, rng.lognormal(0.9, 0.8, n), rng.lognormal(0.0, 0.55, n))",
  "",
  "# heure : les fraudes sont plus fréquentes la nuit, sans y être limitées",
  "p_normal = np.array([1, 0.5, 0.3, 0.3, 0.4, 1, 2, 4, 6, 7, 7, 8, 9, 8, 7, 7, 8, 9, 9, 8, 6, 4, 3, 2])",
  "p_fraude = np.array([6, 6, 6, 5, 5, 3, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 5])",
  "heure = np.where(f, rng.choice(24, n, p=p_fraude / p_fraude.sum()), rng.choice(24, n, p=p_normal / p_normal.sum()))",
  "",
  "# distance au lieu habituel (km) : proche en général, parfois très loin (un voyage pour les uns, une carte volée pour les autres)",
  "loin = np.where(f, rng.random(n) < 0.5, rng.random(n) < 0.04)",
  "distance = np.where(loin, rng.uniform(40, 1500, n), rng.exponential(np.where(f, 10, 6), n))",
  "",
  "transactions = pd.DataFrame({",
  "    'montant': (habituel * rapport).round(2),",
  "    'heure': heure,",
  "    'ratio_habituel': rapport.round(2),",
  "    'distance_km': distance.round(1),",
  "    'nouveau_commercant': (rng.random(n) < np.where(f, 0.55, 0.12)).astype(int),",
  "    'etranger': (rng.random(n) < np.where(f, 0.30, 0.04)).astype(int),",
  "    'nb_transactions_1h': 1 + rng.poisson(np.where(f, 1.2, 0.15), n),",
  "    'fraude': fraude,",
  "})",
);

/** Les sept variables du modèle : `heure` est remplacée par `nuit` */
const LISTE_VARIABLES = "VARIABLES = ['montant', 'ratio_habituel', 'distance_km', 'nouveau_commercant', 'etranger', 'nb_transactions_1h', 'nuit']";

/** Données de l'étape 2 : variable `nuit`, variables et cible, découpage stratifié (`X_train`, `X_test`, `y_train`, `y_test`) */
const PREPARATION = lines(
  DONNEES,
  "from sklearn.model_selection import train_test_split",
  "",
  "transactions['nuit'] = (transactions['heure'] <= 5).astype(int)",
  LISTE_VARIABLES,
  "X = transactions[VARIABLES]",
  "y = transactions['fraude']",
  "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, stratify=y, random_state=0)",
);

/** Le modèle de l'étape 3 (régression logistique équilibrée) et ses probabilités de fraude sur le test */
const MODELE = lines(
  PREPARATION,
  "from sklearn.pipeline import make_pipeline",
  "from sklearn.preprocessing import StandardScaler",
  "from sklearn.linear_model import LogisticRegression",
  "",
  "modele = make_pipeline(StandardScaler(), LogisticRegression(class_weight='balanced', max_iter=1000)).fit(X_train, y_train)",
  "proba = modele.predict_proba(X_test)[:, 1]",
);

/** Probabilités de fraude de l'entraînement calculées hors échantillon (validation croisée), pour choisir un seuil */
const PROBA_CV = lines(
  MODELE,
  "from sklearn.model_selection import StratifiedKFold, cross_val_predict",
  "",
  "decoupage = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)",
  "proba_cv = cross_val_predict(modele, X_train, y_train, cv=decoupage, method='predict_proba')[:, 1]",
);

/** Coût d'un seuil d'alerte (étape 5), tel que l'exercice le fait écrire */
const COUT = lines(
  "def cout_total(y_vrai, montants, alertes, cout_alerte=5.0):",
  "    y_vrai = np.asarray(y_vrai)",
  "    montants = np.asarray(montants)",
  "    alertes = np.asarray(alertes, dtype=bool)",
  "    manquees = (y_vrai == 1) & ~alertes  # fraudes qui n'ont pas déclenché d'alerte",
  "    return cout_alerte * alertes.sum() + montants[manquees].sum()",
);

export const projectFraud: LessonModule = {
  id: "intermediate-3",
  title: "Projet guidé : détecter des fraudes",
  duration: "3 h 30",
  summary: "40 000 transactions bancaires fictives dont 0,8 % de fraudes : mesurer le déséquilibre, évaluer avec la précision et le rappel, choisir un seuil d'alerte d'après un coût, puis comparer un modèle supervisé à un détecteur d'anomalies.",
  objectives: [
    "Mesurer un déséquilibre de classes et comprendre pourquoi l'exactitude ne dit presque rien",
    "Découper en gardant la proportion de fraudes, et évaluer avec la précision, le rappel et la précision moyenne",
    "Choisir un seuil d'alerte d'après un coût, sans se servir du jeu de test pour le régler",
    "Comparer un modèle supervisé à un détecteur d'anomalies, et reconnaître les limites d'un tel projet",
  ],
  sections: [
    {
      kind: "text",
      md: `### Le contexte

Une banque voudrait repérer, parmi les paiements par carte, ceux qui sont frauduleux, pour les faire vérifier avant qu'ils ne coûtent trop cher. Les fraudes sont rares et chaque vérification coûte du temps : il faut donc **bien choisir quelles transactions signaler**, et pas seulement bien les classer.

Les données de ce projet sont **entièrement inventées** : 40 000 transactions fictives, dont 320 fraudes, générées avec une graine fixe. Les fraudes y suivent d'autres distributions que les transactions normales (montant plus élevé que d'habitude, nuit, loin du domicile, nouveau commerçant, étranger, plusieurs paiements en peu de temps), mais ces distributions se **chevauchent** : aucune variable ne sépare les deux cas à elle seule. La réalité est bien plus compliquée que cette simulation, et les nombres du texte ne valent que pour ces données.

Chaque transaction est décrite par sept variables, plus la réponse à retrouver.

- \`montant\` : le montant payé, en euros ;
- \`heure\` : l'heure de la journée, de 0 à 23 ;
- \`ratio_habituel\` : le montant divisé par la dépense habituelle du client (1 : comme d'habitude, 3 : trois fois plus) ;
- \`distance_km\` : la distance au lieu habituel du client, en kilomètres ;
- \`nouveau_commercant\` : 1 si le client n'avait jamais payé chez ce commerçant ;
- \`etranger\` : 1 si le paiement a lieu à l'étranger ;
- \`nb_transactions_1h\` : le nombre de transactions de la carte dans l'heure écoulée, celle-ci comprise ;
- \`fraude\` : 1 si la transaction est une fraude, 0 sinon. C'est la cible.

Un système en production note chaque transaction au moment où elle arrive, avec une infrastructure que ce projet ne reproduit pas ; ici, on travaille sur un lot de transactions déjà enregistrées, mais la méthode (un score, un seuil choisi d'après des coûts, un suivi dans le temps) est la même. Les graines sont fixées partout : vous devriez retrouver les nombres du texte, à l'arrondi près.`,
    },
    {
      kind: "text",
      md: "### Étape 1 : explorer et mesurer le déséquilibre\n\nOn regarde d'abord la forme des données : combien de fraudes, et en quoi elles diffèrent des autres transactions. Le code qui fabrique les données est affiché en entier la première fois ; ensuite, `transactions` est déjà prêt.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DONNEES,
        "import matplotlib.pyplot as plt",
        "",
        "print(transactions.head().to_string())",
        "print()",
        "print(transactions['fraude'].value_counts())",
        "print('part des fraudes :', round(100 * transactions['fraude'].mean(), 2), '%')",
        "print()",
        "print(transactions.groupby('fraude').mean().T.round(2))",
        "",
        "# aucune variable ne sépare les deux cas à elle seule",
        "fraudes = transactions[transactions['fraude'] == 1]",
        "print('fraudes à moins de 20 km du lieu habituel :', round(100 * (fraudes['distance_km'] < 20).mean(), 1), '%')",
        "print('fraudes qui ne sont pas à l’étranger      :', round(100 * (fraudes['etranger'] == 0).mean(), 1), '%')",
        "par_heure = 100 * transactions.groupby('heure')['fraude'].mean()",
        "print('part de fraudes à 4 h :', round(par_heure[4], 1), '% ; à 18 h :', round(par_heure[18], 2), '%')",
        "",
        "fig, axes = plt.subplots(1, 2, figsize=(9, 3.6))",
        "axes[0].bar(par_heure.index, par_heure)",
        "axes[0].set_xlabel('heure')",
        "axes[0].set_ylabel('part de fraudes (%)')",
        "for valeur, nom in [(0, 'normales'), (1, 'fraudes')]:",
        "    montants = transactions.loc[transactions['fraude'] == valeur, 'montant']",
        "    axes[1].hist(np.log10(montants), bins=30, density=True, alpha=0.6, label=nom)",
        "axes[1].set_xlabel('montant (log10 des euros)')",
        "axes[1].set_ylabel('densité')",
        "axes[1].legend()",
        "fig.tight_layout()",
        "plt.show()",
      ),
      caption: "Sur 40 000 transactions, 320 sont des fraudes (0,8 %). Elles sont en moyenne plus chères (146 euros contre 53), plus souvent à l'étranger (28 % contre 4 %) et chez un nouveau commerçant (57 % contre 12 %), et se concentrent la nuit : à 4 h, 20,9 % des transactions sont frauduleuses, contre 0,17 % à 18 h. Mais aucune variable ne suffit : 42,5 % des fraudes ont lieu à moins de 20 km du lieu habituel du client, et 72,2 % ne sont pas à l'étranger.",
    },
    {
      kind: "text",
      md: `### Le piège de l'exactitude

L'**exactitude** (*accuracy*) est la part des réponses justes. Ici, 99,2 % des transactions sont normales : un « modèle » qui répondrait toujours *pas de fraude* aurait 99,2 % d'exactitude, et ne détecterait aucune fraude. Une exactitude élevée ne prouve donc rien quand la classe qui nous intéresse est aussi rare. Deux mesures regardent les fraudes elles-mêmes.

- La **précision** : parmi les transactions signalées, quelle part est réellement frauduleuse ? Elle évite de déranger des clients et de faire perdre du temps aux vérificateurs.
- Le **rappel** : parmi les fraudes, quelle part a été signalée ? Il limite l'argent perdu.

Les deux varient en sens inverse quand on signale plus ou moins de transactions. Tout le projet tourne autour de ce compromis.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "`transactions` est déjà chargé. Rangez dans `taux_fraude` la proportion de transactions frauduleuses (un nombre entre 0 et 1), et dans `exactitude_jamais` l'exactitude d'un « modèle » qui répondrait toujours *pas de fraude* (la part de ses réponses justes).",
      setup: DONNEES,
      starter: lines("taux_fraude = None", "exactitude_jamais = None"),
      solution: lines(
        "taux_fraude = transactions['fraude'].mean()",
        "exactitude_jamais = (transactions['fraude'] == 0).mean()",
        "print('part des fraudes :', round(taux_fraude, 4))",
        "print('exactitude du modèle qui ne détecte rien :', round(exactitude_jamais, 4))",
      ),
      test: lines(
        "assert taux_fraude is not None, \"rangez la proportion de fraudes dans taux_fraude\"",
        "assert abs(taux_fraude - transactions['fraude'].mean()) < 1e-9, f\"taux_fraude doit être la proportion de fraudes, entre 0 et 1 (vous avez {taux_fraude})\"",
        "assert exactitude_jamais is not None, \"rangez l'exactitude du modèle qui répond toujours « pas de fraude » dans exactitude_jamais\"",
        "assert abs(exactitude_jamais - (transactions['fraude'] == 0).mean()) < 1e-9, f\"ce modèle a raison à chaque transaction normale : exactitude_jamais doit être la part des transactions où fraude vaut 0 (vous avez {exactitude_jamais})\"",
      ),
      hint: "La colonne fraude vaut 1 pour une fraude et 0 sinon : sa moyenne est la proportion de fraudes. Un modèle qui répond toujours 0 a raison chaque fois que fraude vaut 0.",
    },
    {
      kind: "text",
      md: `### Étape 2 : préparer les variables et découper

\`heure\` pose un petit problème à une régression logistique : elle la lit comme un nombre, pour lequel 23 et 0 sont aussi éloignés que possible alors que ces deux heures se suivent. On la remplace par une variable plus parlante, \`nuit\`, qui vaut 1 de minuit à 5 h incluses. Ces bornes sont une hypothèse, appuyée sur le premier graphique de l'étape 1.

Ensuite, on met de côté un quart des transactions pour le test. Comme il n'y a que 320 fraudes, un tirage au hasard simple pourrait en placer un peu plus ou un peu moins que le quart attendu dans le test, et avec si peu de fraudes ces écarts pèsent : on **stratifie** le tirage (\`stratify=y\`) pour que l'entraînement et le test aient chacun 0,8 % de fraudes. Le test contient alors 80 fraudes seulement : c'est peu, et toutes les mesures de ce projet portent sur elles. Un autre découpage donnerait des nombres un peu différents.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "`transactions` et la liste `VARIABLES` (les sept colonnes du modèle, dont `nuit`) sont déjà prêtes. Ajoutez à `transactions` la colonne `nuit` (1 si `heure` est entre 0 et 5 inclus, 0 sinon). Rangez dans `X` les colonnes de `VARIABLES` et dans `y` la colonne `fraude`. Découpez avec `train_test_split` : un quart des transactions pour le test, tirage **stratifié** sur `y`, `random_state=0`, dans `X_train`, `X_test`, `y_train` et `y_test`.",
      setup: lines(DONNEES, LISTE_VARIABLES),
      starter: lines(
        "from sklearn.model_selection import train_test_split",
        "",
        "X = None",
        "y = None",
        "X_train = X_test = y_train = y_test = None",
      ),
      solution: lines(
        "from sklearn.model_selection import train_test_split",
        "",
        "transactions['nuit'] = (transactions['heure'] <= 5).astype(int)",
        "X = transactions[VARIABLES]",
        "y = transactions['fraude']",
        "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, stratify=y, random_state=0)",
        "print(len(X_train), 'transactions pour l’entraînement,', len(X_test), 'de test')",
        "print('fraudes :', y_train.sum(), 'pour l’entraînement,', y_test.sum(), 'en test')",
      ),
      test: lines(
        "assert 'nuit' in transactions.columns, \"ajoutez la colonne nuit à transactions\"",
        "assert (transactions['nuit'] == (transactions['heure'] <= 5)).all(), \"nuit doit valoir 1 pour les heures de 0 à 5 et 0 sinon\"",
        "assert X is not None and list(X.columns) == VARIABLES, \"X doit contenir les colonnes de VARIABLES, dans cet ordre\"",
        "assert y is not None and y.equals(transactions['fraude']), \"y doit être la colonne fraude\"",
        "assert X_train is not None and len(X_train) == 30000 and len(X_test) == 10000, \"le test doit compter un quart des transactions : 10 000 pour le test, 30 000 pour l'entraînement\"",
        "assert y_test.sum() == 80 and y_train.sum() == 240, f\"le tirage doit être stratifié (stratify=y) : 80 fraudes en test et 240 en entraînement (vous avez {y_test.sum()} et {y_train.sum()})\"",
      ),
      hint: "transactions['heure'] <= 5 est vrai de minuit à 5 h ; .astype(int) donne 0 ou 1. Puis train_test_split(X, y, test_size=0.25, stratify=y, random_state=0).",
    },
    {
      kind: "text",
      md: `### Étape 3 : un premier modèle, une régression logistique

Une **régression logistique** calcule, à partir des variables, une probabilité de fraude entre 0 et 1. On signale la transaction quand cette probabilité dépasse un **seuil**, 0,5 par défaut. Elle s'entraîne mieux quand les variables ont des échelles comparables (un montant en centaines d'euros et un indicateur 0/1 n'ont rien à voir) : on les standardise avec \`StandardScaler\`, dans un \`Pipeline\`. Le pipeline apprend les moyennes et les écarts-types sur l'entraînement seulement, puis les réapplique tels quels au test, ce qui évite qu'une information du test ne passe dans l'entraînement.

L'exemple compare deux versions du même modèle. Dans la seconde, \`class_weight='balanced'\` donne aux rares fraudes un poids plus fort dans l'apprentissage, de sorte que les deux classes pèsent autant au total.`,
    },
    {
      kind: "code",
      language: "python",
      setup: PREPARATION,
      code: lines(
        "from sklearn.pipeline import make_pipeline",
        "from sklearn.preprocessing import StandardScaler",
        "from sklearn.linear_model import LogisticRegression",
        "from sklearn.metrics import accuracy_score, average_precision_score, confusion_matrix, precision_score, recall_score",
        "",
        "for nom, poids in [('sans pondération', None), ('class_weight balanced', 'balanced')]:",
        "    modele = make_pipeline(StandardScaler(), LogisticRegression(class_weight=poids, max_iter=1000)).fit(X_train, y_train)",
        "    y_pred = modele.predict(X_test)",
        "    print('===', nom)",
        "    print(pd.DataFrame(confusion_matrix(y_test, y_pred), index=['normale', 'fraude'], columns=['sans alerte', 'alerte']))",
        "    print('exactitude', round(accuracy_score(y_test, y_pred), 4), '| précision', round(precision_score(y_test, y_pred), 3), '| rappel', round(recall_score(y_test, y_pred), 3))",
        "    print('précision moyenne', round(average_precision_score(y_test, modele.predict_proba(X_test)[:, 1]), 3))",
        "",
        "# ce que le dernier modèle a appris : un coefficient par variable standardisée",
        "print(pd.Series(modele[-1].coef_[0], index=VARIABLES).round(2).sort_values())",
      ),
      caption: "Sans pondération, le modèle signale 36 transactions, dont 32 fraudes (précision de 0,889), mais ne trouve que 32 des 80 fraudes (rappel de 0,4) ; son exactitude est de 99,48 %. Avec `balanced`, il signale 678 transactions et trouve 71 fraudes sur 80 (rappel de 0,887), au prix de 607 fausses alertes (précision de 0,105) ; son exactitude tombe à 93,84 %. La précision moyenne, qui ne dépend pas du seuil, est presque la même (0,664 et 0,666). Les coefficients se comparent entre eux puisque les variables sont standardisées : tous sont positifs, sauf celui du montant, presque nul (-0,01), l'information étant déjà portée par le ratio à l'habitude avec lequel il varie.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "`X_train`, `X_test`, `y_train` et `y_test` sont prêts. Construisez dans `modele` un pipeline (`make_pipeline`) qui enchaîne un `StandardScaler` et une `LogisticRegression(class_weight='balanced', max_iter=1000)`, et ajustez-le sur l'entraînement. Rangez dans `y_pred` ses prédictions pour le test (au seuil de 0,5), puis dans `precision` et `rappel` la précision et le rappel **de la classe fraude**.",
      setup: PREPARATION,
      starter: lines(
        "from sklearn.pipeline import make_pipeline",
        "from sklearn.preprocessing import StandardScaler",
        "from sklearn.linear_model import LogisticRegression",
        "from sklearn.metrics import precision_score, recall_score",
        "",
        "modele = None",
        "y_pred = None",
        "precision = None",
        "rappel = None",
      ),
      solution: lines(
        "from sklearn.pipeline import make_pipeline",
        "from sklearn.preprocessing import StandardScaler",
        "from sklearn.linear_model import LogisticRegression",
        "from sklearn.metrics import precision_score, recall_score",
        "",
        "modele = make_pipeline(StandardScaler(), LogisticRegression(class_weight='balanced', max_iter=1000)).fit(X_train, y_train)",
        "y_pred = modele.predict(X_test)",
        "precision = precision_score(y_test, y_pred)",
        "rappel = recall_score(y_test, y_pred)",
        "print('alertes :', int(y_pred.sum()), '| précision', round(precision, 3), '| rappel', round(rappel, 3))",
      ),
      test: lines(
        "from sklearn.metrics import precision_score as _ps, recall_score as _rs",
        "assert modele is not None and hasattr(modele, 'predict_proba'), \"modele doit être un pipeline ajusté : make_pipeline(StandardScaler(), LogisticRegression(...)).fit(X_train, y_train)\"",
        "assert y_pred is not None and len(y_pred) == len(y_test), \"y_pred doit contenir une prédiction par transaction du test (modele.predict(X_test))\"",
        "assert np.array_equal(np.asarray(y_pred), modele.predict(X_test)), \"y_pred doit être modele.predict(X_test)\"",
        "assert precision is not None and abs(precision - _ps(y_test, y_pred)) < 1e-9, \"precision doit être la précision de la classe fraude : precision_score(y_test, y_pred)\"",
        "assert rappel is not None and abs(rappel - _rs(y_test, y_pred)) < 1e-9, \"rappel doit être le rappel de la classe fraude : recall_score(y_test, y_pred)\"",
        "assert rappel > 0.8, f\"avec class_weight='balanced', le rappel doit dépasser 0,8 (vous avez {rappel:.2f})\"",
      ),
      hint: "make_pipeline(StandardScaler(), LogisticRegression(class_weight='balanced', max_iter=1000)).fit(X_train, y_train) ; puis modele.predict(X_test), precision_score(y_test, y_pred) et recall_score(y_test, y_pred).",
    },
    {
      kind: "note",
      tone: "info",
      md: "Pondérer les classes et baisser le seuil agissent presque de la même façon : les deux font signaler plus de transactions. Ici, la précision moyenne est la même avec et sans pondération (0,664 et 0,666) : la pondération n'a pas rendu le modèle meilleur, elle a déplacé le point de fonctionnement d'un rappel de 0,4 et d'une précision de 0,889 vers un rappel de 0,887 et une précision de 0,105. Où se placer entre les deux est une question de coûts (étape 5), pas une option à cocher.",
    },
    {
      kind: "text",
      md: `### Étape 4 : évaluer sans dépendre du seuil

La précision et le rappel dépendent du seuil. Pour juger le *classement* que produit le modèle, indépendamment du seuil, on regarde deux courbes.

- La courbe **ROC** (rappel contre taux de fausses alertes) et l'aire sous cette courbe (\`roc_auc_score\`).
- La courbe **précision-rappel** et la **précision moyenne** (\`average_precision_score\`), qui résume la précision obtenue aux différents niveaux de rappel.

Quand les fraudes sont aussi rares, la courbe ROC est trop indulgente : son taux de fausses alertes divise par les 9 920 transactions normales du test, si bien que quelques centaines de fausses alertes paraissent peu, alors qu'elles noient les vraies fraudes. La précision compare au contraire les vraies fraudes aux seules transactions signalées, et ne s'y laisse pas prendre. Sur un problème déséquilibré, on regarde donc la précision moyenne, avec pour repère le taux de fraudes : un score tiré au hasard obtient environ 0,008.`,
    },
    {
      kind: "code",
      language: "python",
      setup: MODELE,
      code: lines(
        "import matplotlib.pyplot as plt",
        "from sklearn.metrics import average_precision_score, precision_recall_curve, precision_score, recall_score, roc_auc_score, roc_curve",
        "",
        "print('aire sous la courbe ROC :', round(roc_auc_score(y_test, proba), 3))",
        "print('précision moyenne       :', round(average_precision_score(y_test, proba), 3))",
        "print('précision moyenne d’un score tiré au hasard :', round(y_test.mean(), 3))",
        "print()",
        "for seuil in (0.5, 0.8, 0.9, 0.95):",
        "    alerte = proba >= seuil",
        "    print(f'seuil {seuil} : {alerte.sum()} alertes, précision {precision_score(y_test, alerte):.2f}, rappel {recall_score(y_test, alerte):.2f}')",
        "",
        "fpr, tpr, _ = roc_curve(y_test, proba)",
        "precisions, rappels, _ = precision_recall_curve(y_test, proba)",
        "alerte = proba >= 0.5  # le point du seuil 0,5 sur chaque courbe",
        "fausses_alertes = (alerte & (y_test == 0)).sum() / (y_test == 0).sum()",
        "print('taux de fausses alertes au seuil 0,5 :', round(fausses_alertes, 3))",
        "fig, axes = plt.subplots(1, 2, figsize=(9, 3.8))",
        "axes[0].plot(fpr, tpr)",
        "axes[0].plot([0, 1], [0, 1], linestyle=':', color='gray')",
        "axes[0].scatter([fausses_alertes], [recall_score(y_test, alerte)], color='tab:red', zorder=3, label='seuil 0,5')",
        "axes[0].set_xlabel('taux de fausses alertes')",
        "axes[0].set_ylabel('rappel')",
        "axes[0].set_title('courbe ROC')",
        "axes[0].legend()",
        "axes[1].plot(rappels, precisions)",
        "axes[1].axhline(y_test.mean(), linestyle=':', color='gray', label='hasard')",
        "axes[1].scatter([recall_score(y_test, alerte)], [precision_score(y_test, alerte)], color='tab:red', zorder=3, label='seuil 0,5')",
        "axes[1].set_xlabel('rappel')",
        "axes[1].set_ylabel('précision')",
        "axes[1].set_title('courbe précision-rappel')",
        "axes[1].legend()",
        "fig.tight_layout()",
        "plt.show()",
      ),
      caption: "L'aire sous la courbe ROC est de 0,966, un score qui a l'air excellent. La précision moyenne n'est que de 0,666, pour un repère de 0,008. Les deux courbes montrent le même modèle au seuil 0,5 (point rouge) : sur la courbe ROC, il est tout en haut à gauche, avec 6,1 % de fausses alertes et 89 % des fraudes trouvées ; sur la courbe précision-rappel, il est à une précision de 0,10. Réduire les fausses alertes oblige à manquer des fraudes : à 0,95, il reste 114 alertes d'une précision de 0,49, pour un rappel de 0,70.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "`modele` (le pipeline équilibré de l'étape 3) est déjà ajusté et `proba` contient ses probabilités de fraude pour le test. Rangez dans `ap` la précision moyenne, dans `auc` l'aire sous la courbe ROC, et dans `precision_80` la **meilleure précision atteignable en gardant un rappel d'au moins 0,8**, lue sur la courbe précision-rappel (`precision_recall_curve`).",
      setup: MODELE,
      starter: lines(
        "from sklearn.metrics import average_precision_score, precision_recall_curve, roc_auc_score",
        "",
        "ap = None",
        "auc = None",
        "precision_80 = None",
      ),
      solution: lines(
        "from sklearn.metrics import average_precision_score, precision_recall_curve, roc_auc_score",
        "",
        "ap = average_precision_score(y_test, proba)",
        "auc = roc_auc_score(y_test, proba)",
        "precisions, rappels, _ = precision_recall_curve(y_test, proba)",
        "precision_80 = precisions[rappels >= 0.8].max()",
        "print('précision moyenne', round(ap, 3), '| aire ROC', round(auc, 3))",
        "print('précision maximale pour un rappel d’au moins 0,8 :', round(precision_80, 3))",
      ),
      test: lines(
        "from sklearn.metrics import average_precision_score as _ap, precision_recall_curve as _prc, roc_auc_score as _auc",
        "assert ap is not None and abs(ap - _ap(y_test, proba)) < 1e-9, \"ap doit être average_precision_score(y_test, proba)\"",
        "assert auc is not None and abs(auc - _auc(y_test, proba)) < 1e-9, \"auc doit être roc_auc_score(y_test, proba)\"",
        "_p, _r, _ = _prc(y_test, proba)",
        "assert precision_80 is not None and abs(precision_80 - _p[_r >= 0.8].max()) < 1e-9, f\"precision_80 doit être la plus grande précision parmi les points de la courbe dont le rappel est au moins 0,8 (vous avez {precision_80})\"",
      ),
      hint: "precision_recall_curve(y_test, proba) renvoie trois tableaux : précisions, rappels et seuils. precisions[rappels >= 0.8] garde les points voulus, .max() prend le meilleur.",
    },
    {
      kind: "text",
      md: `### Étape 5 : choisir le seuil d'après un coût

Le bon seuil n'est pas 0,5. Il dépend de ce que coûtent les deux types d'erreurs, et c'est une décision de l'entreprise plus que de la statistique. On pose ici deux règles, dont la seconde est **inventée** :

- une fraude non signalée coûte son montant ;
- chaque alerte coûte 5 euros de vérification (un appel au client, quelques minutes d'un analyste), qu'elle soit justifiée ou non.`,
    },
    {
      kind: "equation",
      latex: String.raw`C(s) = 5 \times |A(s)| + \sum_{i \in M(s)} m_i`,
      caption: "Coût total au seuil s : A(s) est l'ensemble des transactions signalées, M(s) celui des fraudes non signalées et m_i le montant de la fraude i, en euros.",
    },
    {
      kind: "text",
      md: `Pour choisir \`s\`, on calcule ce coût pour de nombreux seuils et on prend le plus bas. Mais **pas sur le jeu de test** : régler un paramètre sur lui, c'est le transformer en jeu d'entraînement, et le coût mesuré ensuite serait trop optimiste. On règle donc le seuil sur l'entraînement, avec des probabilités calculées **hors échantillon** : \`cross_val_predict\` coupe l'entraînement en 5 parties et note chacune avec un modèle entraîné sur les 4 autres, si bien qu'aucune transaction n'est notée par un modèle qui l'a vue. Le test ne sert qu'à vérifier le coût du seuil retenu. Ces probabilités sont fournies dans \`proba_cv\`.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "`proba_cv` contient la probabilité de fraude de chaque transaction de l'entraînement, calculée hors échantillon, et `seuils` une grille de seuils de 0,05 à 0,99. Écrivez la fonction `cout_total(y_vrai, montants, alertes, cout_alerte=5.0)` qui renvoie le coût total en euros : le montant de chaque fraude non signalée, plus `cout_alerte` par transaction signalée (`alertes` est un tableau de booléens, vrai pour une transaction signalée). Cherchez ensuite, parmi `seuils`, celui qui **minimise le coût** sur l'entraînement (`y_train`, `X_train['montant']` et `proba_cv >= seuil`) et rangez-le dans `seuil_optimal`.",
      setup: lines(PROBA_CV, "seuils = np.linspace(0.05, 0.99, 95)"),
      starter: lines(
        "def cout_total(y_vrai, montants, alertes, cout_alerte=5.0):",
        "    return 0.0",
        "",
        "seuil_optimal = None",
      ),
      solution: lines(
        COUT,
        "",
        "couts = [cout_total(y_train, X_train['montant'], proba_cv >= seuil) for seuil in seuils]",
        "seuil_optimal = seuils[int(np.argmin(couts))]",
        "print('seuil optimal :', round(seuil_optimal, 2), '| coût sur l’entraînement :', round(min(couts), 1), 'euros')",
      ),
      test: lines(
        "_y = np.array([1, 0, 1, 0])",
        "_m = np.array([100.0, 20.0, 50.0, 10.0])",
        "_c = cout_total(_y, _m, np.array([True, True, False, False]))",
        "assert abs(_c - 60.0) < 1e-9, f\"avec 2 alertes (2 x 5 euros) et une fraude de 50 euros non signalée, le coût doit être 60 euros (vous avez {_c})\"",
        "_c = cout_total(_y, _m, np.array([False, False, False, False]))",
        "assert abs(_c - 150.0) < 1e-9, f\"sans aucune alerte, on perd le montant de toutes les fraudes : 150 euros (vous avez {_c})\"",
        "_c = cout_total(_y, _m, np.array([True, True, True, True]))",
        "assert abs(_c - 20.0) < 1e-9, f\"avec une alerte par transaction, aucune fraude n'est manquée et le coût est 4 x 5 = 20 euros (vous avez {_c})\"",
        "_c = cout_total(_y, _m, np.array([True, True, False, False]), cout_alerte=10.0)",
        "assert abs(_c - 70.0) < 1e-9, f\"le prix d'une alerte est le paramètre cout_alerte : 2 x 10 + 50 = 70 euros (vous avez {_c})\"",
        "_vrai = y_train.to_numpy()",
        "_mont = X_train['montant'].to_numpy()",
        "_ref = []",
        "for _s in seuils:",
        "    _al = proba_cv >= _s",
        "    _ref.append(5.0 * _al.sum() + _mont[(_vrai == 1) & ~_al].sum())",
        "assert seuil_optimal is not None and abs(seuil_optimal - seuils[int(np.argmin(_ref))]) < 1e-9, f\"seuil_optimal doit être le seuil de la grille au coût total le plus bas sur l'entraînement (vous avez {seuil_optimal})\"",
      ),
      hint: "Les fraudes non signalées sont les transactions où y_vrai vaut 1 et l'alerte est fausse : (y_vrai == 1) & ~alertes. Leur montant s'additionne avec montants[masque].sum(). Puis np.argmin(couts) donne la position du coût minimal, à lire dans seuils.",
    },
    {
      kind: "code",
      language: "python",
      setup: PROBA_CV,
      code: lines(
        "import matplotlib.pyplot as plt",
        "",
        COUT,
        "",
        "seuils = np.linspace(0.05, 0.99, 95)",
        "couts_cv = [cout_total(y_train, X_train['montant'], proba_cv >= s) for s in seuils]",
        "seuil = seuils[int(np.argmin(couts_cv))]  # choisi sans regarder le test",
        "print('seuil choisi sur l’entraînement :', round(seuil, 2))",
        "",
        "montants_test = X_test['montant']",
        "aucune = np.zeros(len(y_test), dtype=bool)",
        "print('aucune alerte                 :', round(cout_total(y_test, montants_test, aucune), 1), 'euros')",
        "print('une alerte par transaction    :', round(cout_total(y_test, montants_test, ~aucune), 1), 'euros')",
        "for nom, s in [('seuil 0,5', 0.5), (f'seuil choisi ({seuil:.2f})', seuil)]:",
        "    alerte = proba >= s",
        "    vraies = (alerte & (y_test == 1)).sum()",
        "    print(f'{nom} : {alerte.sum()} alertes dont {vraies} fraudes, {round(cout_total(y_test, montants_test, alerte), 1)} euros')",
        "alerte = proba >= seuil",
        "manquees = montants_test[(y_test == 1) & ~alerte].sum()",
        "print(f'au seuil choisi : {5 * alerte.sum():.0f} euros de vérifications et {manquees:.1f} euros de fraudes manquées')",
        "",
        "# pour la vérification seulement : le seuil que le test aurait désigné",
        "couts_test = [cout_total(y_test, montants_test, proba >= s) for s in seuils]",
        "print('seuil optimal sur le test :', round(seuils[int(np.argmin(couts_test))], 2), ',', round(min(couts_test), 1), 'euros')",
        "proches = [s for s, c in zip(seuils, couts_test) if c <= 1.1 * min(couts_test)]",
        "print('seuils à moins de 10 % de cet optimum :', len(proches), 'sur', len(seuils), ', entre', round(min(proches), 2), 'et', round(max(proches), 2))",
        "",
        "# et si une vérification coûtait 1 ou 20 euros ?",
        "for prix in (1.0, 5.0, 20.0):",
        "    c = [cout_total(y_train, X_train['montant'], proba_cv >= s, cout_alerte=prix) for s in seuils]",
        "    print(f'vérification à {prix:.0f} euros : seuil optimal {seuils[int(np.argmin(c))]:.2f}')",
        "",
        "fig, ax = plt.subplots(figsize=(8, 3.6))",
        "ax.plot(seuils, couts_test)",
        "ax.axvline(0.5, linestyle=':', color='gray', label='seuil 0,5')",
        "ax.axvline(seuil, color='tab:red', label='seuil choisi')",
        "ax.set_ylim(0, 12000)",
        "ax.set_xlabel('seuil d’alerte')",
        "ax.set_ylabel('coût total sur le test (euros)')",
        "ax.legend()",
        "fig.tight_layout()",
        "plt.show()",
      ),
      caption: "Sur le test, les 80 fraudes coûteraient 10 021,9 euros si l'on ne signalait rien, et signaler toutes les transactions en coûterait 50 000. Au seuil 0,5, le modèle signale 678 transactions (dont 71 fraudes) pour 3 874,8 euros. Au seuil de 0,87, choisi sur l'entraînement sans regarder le test, il en signale 197 (dont 60 fraudes) pour 2 320,8 euros : 985 euros de vérifications et 1 335,8 euros de fraudes manquées. Le test aurait désigné 0,84 et 2 128,7 euros : en réglant le seuil à l'écart du test, on perd 9 % par rapport à cet optimum, que l'on ne peut pas connaître d'avance. La courbe est plate près de son minimum : 18 des 95 seuils de la grille, tous compris entre 0,78 et 0,96, restent à moins de 10 % de l'optimum. Le seuil exact importe donc moins que son ordre de grandeur.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Les 5 euros par alerte sont inventés, et le résultat en dépend : avec une vérification à 1 euro, le seuil optimal tombe à 0,68 ; à 20 euros, il monte à 0,97. Le coût réel d'une alerte comprend aussi ce qu'on chiffre mal (un client dont la carte est bloquée à tort, sa confiance perdue), et celui d'une fraude manquée ne se réduit pas à son montant (remboursement, enquête). Ces choix se discutent avec les personnes qui connaissent le métier, et on les réexamine quand les coûts changent.",
    },
    {
      kind: "text",
      md: `### Étape 6 : sans étiquettes, un détecteur d'anomalies

Jusqu'ici, le modèle a appris à partir de fraudes connues. Un **détecteur d'anomalies** fait autrement : il apprend à quoi ressemble l'ensemble des transactions, sans savoir lesquelles sont des fraudes, et signale celles qui s'en écartent. L'**Isolation Forest** isole chaque transaction par des coupures aléatoires successives sur les variables ; une transaction inhabituelle est isolée en peu de coupures et reçoit un score de suspicion élevé. Son \`score_samples\` va dans l'autre sens (plus la valeur est basse, plus la transaction est anormale) : on prend donc son opposé pour avoir un score qui monte avec la suspicion.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Entraînez sur `X_train` un `IsolationForest(n_estimators=200, random_state=0)`, **sans lui donner `y_train`**. Rangez dans `score_iso` un score de suspicion pour chaque transaction du test (plus il est grand, plus la transaction est inhabituelle : l'opposé de `score_samples`), puis dans `ap_iso` la précision moyenne de ce score par rapport à `y_test`.",
      setup: PREPARATION,
      starter: lines(
        "from sklearn.ensemble import IsolationForest",
        "from sklearn.metrics import average_precision_score",
        "",
        "score_iso = None",
        "ap_iso = None",
      ),
      solution: lines(
        "from sklearn.ensemble import IsolationForest",
        "from sklearn.metrics import average_precision_score",
        "",
        "iso = IsolationForest(n_estimators=200, random_state=0).fit(X_train)",
        "score_iso = -iso.score_samples(X_test)",
        "ap_iso = average_precision_score(y_test, score_iso)",
        "print('précision moyenne de l IsolationForest :', round(ap_iso, 3))",
      ),
      test: lines(
        "from sklearn.ensemble import IsolationForest as _IF",
        "from sklearn.metrics import average_precision_score as _ap",
        "assert score_iso is not None and len(score_iso) == len(y_test), \"score_iso doit contenir un score par transaction du test\"",
        "_ref = -_IF(n_estimators=200, random_state=0).fit(X_train).score_samples(X_test)",
        "assert np.allclose(score_iso, _ref), \"score_iso doit être l'opposé de score_samples(X_test) pour un IsolationForest(n_estimators=200, random_state=0) entraîné sur X_train\"",
        "assert ap_iso is not None and abs(ap_iso - _ap(y_test, _ref)) < 1e-9, \"ap_iso doit être average_precision_score(y_test, score_iso)\"",
      ),
      hint: "IsolationForest(n_estimators=200, random_state=0).fit(X_train) ne prend pas de y. -iso.score_samples(X_test) donne le score de suspicion ; average_precision_score(y_test, score_iso) le mesure.",
    },
    {
      kind: "code",
      language: "python",
      setup: MODELE,
      code: lines(
        "import matplotlib.pyplot as plt",
        "from sklearn.ensemble import IsolationForest",
        "from sklearn.metrics import average_precision_score, precision_recall_curve",
        "",
        "iso = IsolationForest(n_estimators=200, random_state=0).fit(X_train)  # sans y_train",
        "score_iso = -iso.score_samples(X_test)",
        "print('précision moyenne, régression logistique :', round(average_precision_score(y_test, proba), 3))",
        "print('précision moyenne, IsolationForest       :', round(average_precision_score(y_test, score_iso), 3))",
        "print('repère (score tiré au hasard)            :', round(y_test.mean(), 3))",
        "",
        "# à nombre d’alertes égal : les 100 transactions que chaque score juge les plus suspectes",
        "vrai = y_test.to_numpy()",
        "for nom, score in [('régression logistique', proba), ('IsolationForest', score_iso)]:",
        "    plus_suspectes = np.argsort(score)[::-1][:100]",
        "    print(nom, ':', vrai[plus_suspectes].sum(), 'fraudes parmi les 100 plus suspectes, sur', vrai.sum(), 'au total')",
        "",
        "fig, ax = plt.subplots(figsize=(6, 3.8))",
        "for nom, score in [('régression logistique', proba), ('IsolationForest', score_iso)]:",
        "    p, r, _ = precision_recall_curve(y_test, score)",
        "    ax.plot(r, p, label=nom)",
        "ax.set_xlabel('rappel')",
        "ax.set_ylabel('précision')",
        "ax.legend()",
        "fig.tight_layout()",
        "plt.show()",
      ),
      caption: "Le modèle supervisé garde l'avantage (0,666 contre 0,601), mais l'écart est mince pour un détecteur qui n'a vu aucune étiquette : parmi les 100 transactions jugées les plus suspectes, on trouve 55 fraudes avec la régression logistique et 53 avec l'IsolationForest, sur 80 au total. Ce cas est favorable au détecteur : ces fraudes sont rares et sortent de l'ordinaire sur plusieurs variables à la fois (montant, distance, étranger). Rien ne garantit qu'il en irait de même avec de vraies fraudes.",
    },
    {
      kind: "text",
      md: `L'IsolationForest ne remplace donc pas le modèle supervisé, qui reste meilleur ici. Son intérêt est ailleurs. Il n'a besoin d'aucune étiquette, alors qu'une fraude n'est confirmée que des jours ou des semaines plus tard, quand le client la conteste ou qu'une vérification aboutit. Et il ne cherche pas un type de fraude précis : il signale ce qui sort de l'ordinaire, y compris ce qu'il n'a jamais vu.

Pour le vérifier, l'exemple suivant invente trois **nouveaux types de fraudes**, que ni l'un ni l'autre des modèles n'a vus à l'entraînement. Il mesure la précision moyenne de chacun sur les transactions normales du test auxquelles on ajoute 80 fraudes de chaque type.

- **essai** : de petits montants, loin du domicile, à l'étranger, chez de nouveaux commerçants (une carte volée que l'on teste) ;
- **rafale** : plusieurs paiements de montant ordinaire en quelques minutes, chez de nouveaux commerçants ;
- **imitation** : des fraudes qui ressemblent en tout point à des transactions normales.`,
    },
    {
      kind: "code",
      language: "python",
      setup: MODELE,
      code: lines(
        "from sklearn.ensemble import IsolationForest",
        "from sklearn.metrics import average_precision_score",
        "",
        "iso = IsolationForest(n_estimators=200, random_state=0).fit(X_train)",
        "normales_test = X_test[y_test == 0]  # les 9 920 transactions normales du test",
        "",
        "def nouvelles_fraudes(genre, k=80, graine=5):",
        "    r = np.random.default_rng(graine)",
        "    habituel = r.lognormal(np.log(40), 0.5, k)",
        "    if genre == 'essai':  # petits montants, loin, à l'étranger, chez de nouveaux commerçants",
        "        rapport, distance = r.lognormal(-1.8, 0.4, k), r.uniform(40, 1500, k)",
        "        nouveau, etranger, nb = r.random(k) < 0.9, r.random(k) < 0.7, 1 + r.poisson(2.5, k)",
        "    elif genre == 'rafale':  # plusieurs paiements ordinaires en quelques minutes",
        "        rapport, distance = r.lognormal(-0.3, 0.4, k), r.exponential(6, k)",
        "        nouveau, etranger, nb = r.random(k) < 0.9, r.random(k) < 0.04, 3 + r.poisson(2.0, k)",
        "    else:  # imitation : tout ressemble à une transaction normale",
        "        rapport, distance = r.lognormal(0.0, 0.55, k), r.exponential(6, k)",
        "        nouveau, etranger, nb = r.random(k) < 0.12, r.random(k) < 0.04, 1 + r.poisson(0.15, k)",
        "    return pd.DataFrame({",
        "        'montant': (habituel * rapport).round(2), 'ratio_habituel': rapport.round(2), 'distance_km': distance.round(1),",
        "        'nouveau_commercant': nouveau.astype(int), 'etranger': etranger.astype(int), 'nb_transactions_1h': nb, 'nuit': 0,",
        "    })[VARIABLES]",
        "",
        "for genre in ['essai', 'rafale', 'imitation']:",
        "    Xn = pd.concat([normales_test, nouvelles_fraudes(genre)])",
        "    yn = np.r_[np.zeros(len(normales_test)), np.ones(80)]",
        "    ap_lr = average_precision_score(yn, modele.predict_proba(Xn)[:, 1])",
        "    ap_iso = average_precision_score(yn, -iso.score_samples(Xn))",
        "    print(genre.ljust(10), 'régression logistique', round(ap_lr, 3), '| IsolationForest', round(ap_iso, 3))",
      ),
      caption: "Le repère du hasard est de 0,008 dans chaque cas. Pour les paiements d'essai, l'IsolationForest fait mieux (0,943 contre 0,791) : ces transactions sont très inhabituelles, alors que le modèle supervisé a appris que les fraudes ont des montants élevés. Pour la rafale, c'est l'inverse (0,815 contre 0,197) : chaque paiement est banal, c'est leur nombre en une heure qui ne l'est pas, un signal que le modèle supervisé connaissait déjà et que l'IsolationForest, qui ne sait pas quelles variables comptent, repère mal. Enfin, une fraude qui imite une transaction normale n'est trouvée par aucun des deux (0,007 chacun, soit le hasard).",
    },
    {
      kind: "text",
      md: `### Étape 7 : conclure honnêtement

Ce que le projet a montré, sur ces données inventées :

- **Le déséquilibre change la façon d'évaluer.** Un modèle qui ne détecte rien a 99,2 % d'exactitude. La précision, le rappel et la précision moyenne (0,666, pour un repère de 0,008) disent ce qui compte.
- **Le seuil est une décision de coût.** Avec le même modèle, le coût est de 3 874,8 euros au seuil 0,5 et de 2 320,8 euros au seuil choisi sur l'entraînement, et il dépend des 5 euros par alerte que nous avons inventés.
- **Un détecteur d'anomalies complète un modèle supervisé sans le remplacer.** Il fait mieux sur les paiements d'essai (0,943 contre 0,791), bien moins bien sur la rafale (0,197 contre 0,815), et aucun des deux ne trouve une fraude qui imite une transaction normale.

Ce que le projet ne montre pas :

- **Des données réelles.** Les vraies données sont plus sales, plus riches et plus difficiles à séparer : les nombres ci-dessus ne se transposent pas.
- **Des résultats stables.** Le test ne compte que 80 fraudes, et un autre découpage donnerait d'autres nombres. On répète l'évaluation (validation croisée) et on regarde la dispersion.
- **Le passage du temps.** Nous avons découpé au hasard. En pratique, on entraîne sur le passé et on teste sur le futur, car les fraudeurs changent de méthode et les performances d'un modèle baissent avec le temps. On suit donc la précision des alertes semaine après semaine, la répartition des variables, et on réentraîne.
- **Les étiquettes tardives.** Une fraude n'est connue qu'une fois signalée ou vérifiée : les transactions récentes classées « normales » ne sont pas encore sûres, et l'on n'apprend que de ce qui a été vérifié.

Une alerte est une demande de vérification, pas un verdict sur une personne : un humain ou un second contrôle tranche, et le client dont la carte est bloquée à tort doit pouvoir corriger la situation vite.

Pour aller plus loin :

- comparez d'autres modèles (forêt aléatoire, gradient boosting) à la régression logistique avec la précision moyenne : avec si peu de fraudes, un modèle plus souple n'est pas forcément meilleur ;
- remplacez le découpage au hasard par un découpage dans le temps, en ajoutant une date aux transactions ;
- essayez de rééquilibrer les données (dupliquer les fraudes ou retirer des transactions normales) : la bibliothèque imbalanced-learn le propose, mais elle n'est pas disponible dans le moteur de ce site ;
- ajoutez des variables, comme le type de commerce ou le nombre de transactions de la journée, et regardez ce que change chaque ajout.`,
    },
  ],
  quiz: [
    {
      question: "Un modèle qui répond toujours « pas de fraude » obtient 99,2 % d'exactitude sur ces données. Que faut-il en conclure ?",
      options: [
        "Qu'il est presque parfait",
        "Que l'exactitude ne dit presque rien ici : il faut regarder la précision et le rappel des fraudes",
        "Que les données sont fausses",
        "Qu'avec si peu de fraudes, aucun modèle ne peut apprendre quoi que ce soit",
      ],
      correct: 1,
      explanation: "Quand 99,2 % des transactions sont normales, ne rien détecter suffit pour avoir raison presque tout le temps. La précision et le rappel portent sur les fraudes elles-mêmes.",
    },
    {
      question: "Pourquoi la précision moyenne est-elle plus parlante que l'aire sous la courbe ROC quand les fraudes sont très rares ?",
      options: [
        "Parce qu'elle ne dépend pas du modèle",
        "Parce que la courbe ROC est fausse quand les classes sont déséquilibrées",
        "Parce que la courbe ROC rapporte les fausses alertes au très grand nombre de transactions normales : quelques centaines de fausses alertes y paraissent peu, alors qu'elles noient les vraies fraudes",
        "Parce qu'elle vaut toujours 1 pour un bon modèle",
      ],
      correct: 2,
      explanation: "La précision compare les vraies fraudes aux seules transactions signalées, donc chaque fausse alerte pèse. Le taux de fausses alertes de la courbe ROC les dilue dans toutes les transactions normales.",
    },
    {
      question: "Pourquoi choisit-on le seuil d'alerte avec des probabilités hors échantillon sur l'entraînement, et non directement sur le jeu de test ?",
      options: [
        "Parce que le jeu de test est trop petit pour calculer un coût",
        "Parce qu'un seuil réglé sur le test donnerait un coût trop optimiste : le test doit rester intact pour vérifier le choix",
        "Parce que la validation croisée donne toujours le meilleur seuil possible",
        "Parce que le seuil doit toujours rester à 0,5",
      ],
      correct: 1,
      explanation: "Un paramètre réglé sur le jeu de test profite de ses particularités, et le résultat mesuré ensuite flatte le modèle. On règle sur l'entraînement, on vérifie sur le test.",
    },
    {
      question: "Dans quel cas un IsolationForest, entraîné sans étiquettes, est-il le plus utile ?",
      options: [
        "Toujours : il fait mieux qu'un modèle supervisé",
        "Quand on a peu ou pas de fraudes étiquetées, ou qu'on cherche des fraudes d'un type nouveau, à condition qu'elles se distinguent des transactions normales",
        "Quand les fraudes ressemblent exactement aux transactions normales",
        "Jamais : sans étiquettes, un modèle ne peut rien repérer",
      ],
      correct: 1,
      explanation: "Il ne signale que ce qui est inhabituel : il n'a besoin d'aucune étiquette, mais il ne trouve rien quand une fraude imite une transaction normale, et il reste moins précis qu'un modèle supervisé sur les fraudes déjà connues.",
    },
  ],
};
