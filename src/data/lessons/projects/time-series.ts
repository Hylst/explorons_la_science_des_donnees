import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

/** Fréquentation quotidienne fictive d'une médiathèque (2024-2025), générée avec une graine fixe pour l'exercice */
const DONNEES = lines(
  "import numpy as np",
  "import pandas as pd",
  "",
  "rng = np.random.default_rng(7)",
  "jours = pd.date_range('2024-01-01', '2025-12-31', freq='D')",
  "t = np.arange(len(jours))",
  "semaine = np.array([0.0, 1.0, 1.3, 0.9, 1.0, 1.6, 0.7])[jours.dayofweek]  # fermé le lundi",
  "ete = 1 - 0.35 * np.exp(-((jours.dayofyear - 215) / 25.0) ** 2)  # creux d'été, début août",
  "visites = np.round((120 + 0.03 * t) * semaine * ete + rng.normal(0, 12, len(jours)) * (semaine > 0))",
  "serie = pd.Series(np.clip(visites, 0, None), index=jours, name='visites')",
);

const DECOUPAGE = lines("train = serie[:'2025-06-30']", "test = serie['2025-07-01':][:56]");

const VARIABLES = lines(
  "def variables(index):",
  "    # jour de la semaine et mois en indicatrices, plus une tendance (nombre de jours écoulés)",
  "    jours = pd.get_dummies(index.dayofweek, prefix='j', dtype=float).reindex(columns=[f'j_{k}' for k in range(7)], fill_value=0.0)",
  "    mois = pd.get_dummies(index.month, prefix='m', dtype=float).reindex(columns=[f'm_{k}' for k in range(1, 13)], fill_value=0.0)",
  "    X = pd.concat([jours.reset_index(drop=True), mois.reset_index(drop=True)], axis=1)",
  "    X['t'] = np.asarray((index - pd.Timestamp('2024-01-01')).days)",
  "    X.index = index",
  "    return X",
);

export const projectTimeSeries: LessonModule = {
  id: "intermediate-5",
  title: "Projet guidé : prévoir une fréquentation",
  duration: "3 h",
  summary: "Deux ans de fréquentation quotidienne (fictive) d'une médiathèque : saisonnalités, découpage dans le temps, prévisions de référence, puis un modèle simple, évalués honnêtement.",
  objectives: [
    "Manipuler une série temporelle avec pandas (index de dates, moyennes glissantes, rééchantillonnage)",
    "Repérer les saisonnalités hebdomadaire et annuelle",
    "Découper les données dans le temps, sans mélanger passé et futur",
    "Comparer un modèle à des prévisions de référence, au bon horizon",
  ],
  sections: [
    {
      kind: "text",
      md: `### Le contexte

La médiathèque du cours voudrait prévoir sa fréquentation des huit semaines de l'été 2025 pour organiser les plannings. Elle dispose du nombre de visites par jour depuis janvier 2024.

Ces données sont **inventées pour l'exercice** : elles sont générées avec une graine fixe, à partir d'un niveau qui augmente doucement, d'un rythme dans la semaine (fermeture le lundi, affluence le samedi), d'un creux en été et d'un bruit aléatoire. Les connaître permet de vérifier que les méthodes retrouvent bien ce qui a été mis dedans. Une vraie série réserverait plus de surprises : jours fériés, travaux, animations, météo.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DONNEES,
        "import matplotlib.pyplot as plt",
        "",
        "print(serie.head(8))",
        "fig, ax = plt.subplots(figsize=(9, 3.5))",
        "ax.plot(serie.index, serie, linewidth=0.6, alpha=0.5, label='visites par jour')",
        "ax.plot(serie.index, serie.rolling(7).mean(), linewidth=2, label='moyenne sur 7 jours')",
        "ax.set_ylabel('visites')",
        "ax.legend()",
        "plt.tight_layout()",
      ),
      caption: "Au jour le jour, la courbe est illisible : la fermeture du lundi la fait tomber à zéro chaque semaine. La moyenne glissante sur 7 jours efface ce rythme et laisse voir la tendance et le creux de l'été.",
    },
    {
      kind: "text",
      md: "### Étape 1 : la saisonnalité de la semaine\n\nUn index de dates donne accès au jour de la semaine (`serie.index.dayofweek`, de 0 pour lundi à 6 pour dimanche). Regrouper selon ce jour fait apparaître le rythme hebdomadaire.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Calculez `par_jour`, la **fréquentation moyenne par jour de la semaine** : une série pandas indexée de 0 (lundi) à 6 (dimanche). Puis rangez dans `jour_max` le numéro du jour le plus fréquenté.",
      setup: DONNEES,
      starter: lines("par_jour = None", "jour_max = None"),
      solution: lines(
        "par_jour = serie.groupby(serie.index.dayofweek).mean()",
        "jour_max = int(par_jour.idxmax())",
        "print(par_jour.round(1))",
        "print('jour le plus fréquenté :', jour_max)",
      ),
      test: lines(
        "assert isinstance(par_jour, pd.Series), \"par_jour doit être une série pandas : serie.groupby(serie.index.dayofweek).mean()\"",
        "_attendu = serie.groupby(serie.index.dayofweek).mean()",
        "assert list(par_jour.index) == list(range(7)), f\"par_jour doit être indexée de 0 à 6 (vous avez {list(par_jour.index)})\"",
        "assert np.allclose(par_jour.to_numpy(), _attendu.to_numpy()), \"les moyennes par jour ne sont pas les bonnes\"",
        "assert jour_max == 5, f\"le jour le plus fréquenté est le samedi, numéro 5 (vous avez {jour_max})\"",
      ),
      hint: "serie.groupby(serie.index.dayofweek).mean(), puis int(par_jour.idxmax()).",
    },
    {
      kind: "text",
      md: "### Étape 2 : la saisonnalité de l'année\n\n`resample` regroupe la série par période : `'MS'` pour des mois (étiquetés au premier jour du mois), `'W'` pour des semaines. La moyenne mensuelle de 2024 montre le creux de l'été.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(DONNEES, "", "mensuel = serie['2024'].resample('MS').mean().round(1)", "mensuel.index = mensuel.index.strftime('%Y-%m')", "print(mensuel)"),
      caption: "Juillet et août 2024 tournent autour de 90 visites par jour en moyenne, contre 104 à 122 le reste de l'année : un modèle qui ignore la saison se tromperait précisément l'été, la période à prévoir.",
    },
    {
      kind: "text",
      md: `### Étape 3 : découper dans le temps

Pour évaluer une prévision, on se place à une date passée, on ne garde que ce qui était connu avant, et on compare la prévision à ce qui s'est réellement produit ensuite. **Jamais de tirage au hasard** : mélanger les jours ferait apprendre au modèle le futur qu'il doit prévoir. Ici, l'entraînement s'arrête le 30 juin 2025 et le test couvre les 56 jours suivants.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Construisez `train` (toute la série **jusqu'au 30 juin 2025 inclus**) et `test` (les **56 jours** qui suivent, à partir du 1er juillet 2025), en sélectionnant par dates.",
      setup: DONNEES,
      starter: lines("from sklearn.model_selection import train_test_split", "train, test = train_test_split(serie, test_size=56, random_state=0)"),
      solution: lines(DECOUPAGE, "print(train.index[-1].date(), test.index[0].date(), test.index[-1].date(), len(test))"),
      test: lines(
        "assert len(test) == 56, f\"le test doit contenir 56 jours (vous en avez {len(test)})\"",
        "assert test.index.is_monotonic_increasing and train.index.is_monotonic_increasing, \"les jours doivent rester dans l'ordre : sélectionnez par dates, sans tirage au hasard\"",
        "assert str(test.index[0].date()) == '2025-07-01', f\"le test doit commencer le 2025-07-01 (vous avez {test.index[0].date()})\"",
        "assert str(train.index[-1].date()) == '2025-06-30', f\"l'entraînement doit finir le 2025-06-30 (vous avez {train.index[-1].date()})\"",
      ),
      hint: "Avec un index de dates, serie[:'2025-06-30'] inclut la borne ; serie['2025-07-01':][:56] prend les 56 jours suivants.",
    },
    {
      kind: "text",
      md: `### Étape 4 : une prévision de référence

Avant tout modèle, une **référence** simple : répéter la dernière semaine connue sur les huit semaines à prévoir. Elle reproduit le rythme de la semaine, mais pas le creux de l'été qui commence. L'erreur se mesure par l'**erreur absolue moyenne** (MAE) : l'écart moyen, en visites par jour, entre prévision et réalité.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Construisez `prevision_naive` : les **7 dernières valeurs de `train`** répétées pour couvrir les 56 jours du test (un tableau NumPy de 56 valeurs, avec `np.tile`). Calculez son erreur absolue moyenne par rapport à `test` dans `mae_naive`.",
      setup: lines(DONNEES, DECOUPAGE),
      starter: lines("prevision_naive = np.full(56, train.mean())", "mae_naive = None"),
      solution: lines(
        "prevision_naive = np.tile(train.to_numpy()[-7:], 8)",
        "mae_naive = np.mean(np.abs(test.to_numpy() - prevision_naive))",
        "print('MAE de la référence :', round(mae_naive, 1), 'visites par jour')",
      ),
      test: lines(
        "_p = np.tile(train.to_numpy()[-7:], 8)",
        "assert len(prevision_naive) == 56, f\"la prévision doit couvrir 56 jours (vous en avez {len(prevision_naive)})\"",
        "assert np.allclose(prevision_naive, _p), \"la prévision doit répéter les 7 dernières valeurs de train, dans l'ordre (np.tile(..., 8))\"",
        "assert mae_naive is not None and abs(mae_naive - np.mean(np.abs(test.to_numpy() - _p))) < 1e-9, f\"mae_naive doit être la moyenne des écarts absolus entre test et la prévision (vous avez {mae_naive})\"",
      ),
      hint: "train.to_numpy()[-7:] donne la dernière semaine ; np.tile(semaine, 8) la répète 8 fois ; np.mean(np.abs(test.to_numpy() - prevision_naive)).",
    },
    {
      kind: "text",
      md: `### Étape 5 : un modèle avec le calendrier

Une régression linéaire peut apprendre l'effet de chaque **jour de la semaine** et de chaque **mois**, plus une **tendance**, à partir de variables construites depuis la date (fonction \`variables\` fournie). Elle a vu l'été 2024 : elle peut en reproduire le creux en 2025. Ces variables sont connues à l'avance pour n'importe quelle date future, ce qui rend la prévision possible à huit semaines.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Entraînez une `LinearRegression` sur `variables(train.index)` et `train`, prédisez les jours du test dans `prevision_modele`, puis calculez `mae_modele`. La référence de l'étape 4 est fournie dans `mae_naive`.",
      setup: lines(
        DONNEES,
        DECOUPAGE,
        VARIABLES,
        "from sklearn.linear_model import LinearRegression",
        "mae_naive = np.mean(np.abs(test.to_numpy() - np.tile(train.to_numpy()[-7:], 8)))",
      ),
      starter: lines("prevision_modele = np.full(len(test), train.mean())", "mae_modele = np.mean(np.abs(test.to_numpy() - prevision_modele))"),
      solution: lines(
        "modele = LinearRegression().fit(variables(train.index), train)",
        "prevision_modele = modele.predict(variables(test.index))",
        "mae_modele = np.mean(np.abs(test.to_numpy() - prevision_modele))",
        "print('référence :', round(mae_naive, 1), ' modèle :', round(mae_modele, 1))",
      ),
      test: lines(
        "_m = LinearRegression().fit(variables(train.index), train)",
        "_p = _m.predict(variables(test.index))",
        "assert len(prevision_modele) == 56, f\"il faut une prévision par jour du test (vous en avez {len(prevision_modele)})\"",
        "assert np.allclose(prevision_modele, _p), \"la prévision doit venir d'une LinearRegression entraînée sur variables(train.index) et train\"",
        "assert abs(mae_modele - np.mean(np.abs(test.to_numpy() - _p))) < 1e-9, \"mae_modele doit être l'erreur absolue moyenne de cette prévision\"",
        "assert mae_modele < mae_naive, f\"le modèle devrait faire mieux que la référence ({mae_modele:.1f} contre {mae_naive:.1f})\"",
      ),
      hint: "LinearRegression().fit(variables(train.index), train), puis .predict(variables(test.index)).",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DONNEES,
        DECOUPAGE,
        VARIABLES,
        "import matplotlib.pyplot as plt",
        "from sklearn.linear_model import LinearRegression",
        "",
        "naive = np.tile(train.to_numpy()[-7:], 8)",
        "modele = LinearRegression().fit(variables(train.index), train)",
        "prevue = modele.predict(variables(test.index))",
        "for nom, p in [('référence', naive), ('modèle', prevue)]:",
        "    print(nom, ': MAE', round(np.mean(np.abs(test.to_numpy() - p)), 1))",
        "fig, ax = plt.subplots(figsize=(9, 3.5))",
        "ax.plot(test.index, test, color='black', linewidth=1, label='réel')",
        "ax.plot(test.index, naive, linestyle='--', label='dernière semaine répétée')",
        "ax.plot(test.index, prevue, label='régression sur le calendrier')",
        "ax.set_ylabel('visites')",
        "ax.legend()",
        "plt.tight_layout()",
      ),
      caption: "Sur les huit semaines de l'été 2025, la référence se trompe de 24 visites par jour en moyenne et le modèle de 14 : la référence continue au niveau de fin juin, le modèle descend avec le creux d'août qu'il a appris en 2024.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Une autre référence, « le même jour la semaine précédente » (`serie.shift(7)`), fait encore mieux sur ce test (environ 12 visites d'erreur). Mais elle utilise des valeurs de juillet et d'août, inconnues le 30 juin : elle ne vaut que pour prévoir à sept jours. Comparer des méthodes n'a de sens qu'**au même horizon**, avec les seules informations disponibles au moment de prévoir.",
    },
    {
      kind: "text",
      md: `### Étape 6 : un modèle de séries temporelles

Le moteur du site fournit **statsmodels**, la bibliothèque Python de référence pour les modèles classiques de séries temporelles. Un **SARIMA** prévoit la série à partir de ses propres valeurs passées. Ici, il travaille sur les écarts d'une semaine à l'autre (saisonnalité de 7 jours), et il donne en plus un **intervalle de prévision**. Au premier lancement, le navigateur télécharge statsmodels (environ 8 Mo) : comptez quelques secondes de plus.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DONNEES,
        DECOUPAGE,
        "import matplotlib.pyplot as plt",
        "from statsmodels.tsa.statespace.sarimax import SARIMAX",
        "",
        "modele = SARIMAX(train, order=(0, 1, 1), seasonal_order=(0, 1, 1, 7)).fit(disp=False)",
        "prevision = modele.get_forecast(56)",
        "centrale = prevision.predicted_mean",
        "bornes = prevision.conf_int(alpha=0.2)  # intervalle de prévision à 80 %",
        "print('MAE du SARIMA :', round(np.mean(np.abs(test.to_numpy() - centrale.to_numpy())), 1), 'visites par jour')",
        "dedans = ((test >= bornes.iloc[:, 0]) & (test <= bornes.iloc[:, 1])).mean()",
        "print('jours réels dans l\\'intervalle à 80 % :', round(100 * dedans), '%')",
        "fig, ax = plt.subplots(figsize=(9, 3.5))",
        "ax.plot(test.index, test, color='black', linewidth=1, label='réel')",
        "ax.plot(test.index, centrale, label='SARIMA')",
        "ax.fill_between(test.index, bornes.iloc[:, 0], bornes.iloc[:, 1], alpha=0.25, label='intervalle à 80 %')",
        "ax.set_ylabel('visites')",
        "ax.legend()",
        "plt.tight_layout()",
      ),
      caption: "Le SARIMA se trompe de 21,5 visites par jour : à peine mieux que la référence (24), loin de la régression sur le calendrier (14). Il reproduit le rythme de la semaine, mais rien dans les dernières semaines de juin n'annonce le creux d'août. Son intervalle à 80 % ne contient que 70 % des jours réels : il suppose que l'été prolonge le printemps.",
    },
    {
      kind: "text",
      md: `### Conclure honnêtement

- Le modèle n'a vu qu'**un seul été** : il suppose que 2025 ressemblera à 2024. Un été pluvieux, une fermeture pour travaux ou une grande animation le prendraient en défaut.
- Une seule date de coupure ne suffit pas pour juger : on répète l'évaluation à plusieurs dates (c'est ce que fait \`TimeSeriesSplit\` de scikit-learn), et on regarde la dispersion des erreurs.
- Une prévision utile donne aussi une **marge d'incertitude**, pas seulement un chiffre.
- Un modèle plus savant n'est pas forcément meilleur : le SARIMA fait à peine mieux que la référence, faute de connaître la saison de l'année. On peut lui donner les variables de calendrier (\`SARIMAX(train, exog=...)\`), ou essayer d'autres modèles (Prophet, absent du moteur de ce site) : toujours face à la même référence, au même horizon.`,
    },
  ],
  quiz: [
    {
      question: "Pourquoi ne faut-il pas découper une série temporelle par tirage au hasard ?",
      options: [
        "Parce que pandas ne le permet pas",
        "Parce que le modèle apprendrait des jours postérieurs à ceux qu'il doit prévoir",
        "Parce que le jeu de test serait trop petit",
        "Ce n'est pas un problème",
      ],
      correct: 1,
      explanation: "En situation réelle, on ne connaît que le passé. Mélanger les jours donne une évaluation trop optimiste, qui ne se retrouvera pas en pratique.",
    },
    {
      question: "Que fait serie.rolling(7).mean() ?",
      options: [
        "Elle trie la série",
        "Elle calcule, pour chaque jour, la moyenne des 7 derniers jours",
        "Elle regroupe la série par semaine calendaire",
        "Elle supprime les lundis",
      ],
      correct: 1,
      explanation: "La moyenne glissante lisse le rythme de la semaine. resample('W') regrouperait plutôt par semaine calendaire, une valeur par semaine.",
    },
    {
      question: "La prévision « même jour la semaine précédente » a une erreur plus faible que le modèle sur le test. Peut-on en conclure qu'elle est meilleure pour prévoir l'été le 30 juin ?",
      options: [
        "Oui, l'erreur est plus faible",
        "Non : elle utilise des valeurs de l'été, inconnues le 30 juin ; elle ne vaut qu'à sept jours d'horizon",
        "Oui, si le test est assez long",
        "Non, car elle ne tient pas compte des lundis",
      ],
      correct: 1,
      explanation: "On compare des méthodes au même horizon et avec les mêmes informations disponibles. Sinon, la comparaison est faussée par une fuite d'information.",
    },
    {
      question: "Le SARIMA à saisonnalité hebdomadaire fait à peine mieux que la référence sur l'été 2025. Pourquoi ?",
      options: [
        "statsmodels fonctionne mal dans un navigateur",
        "Il prolonge le rythme de la semaine et le niveau récent, sans rien savoir du creux d'août",
        "Il faudrait un test plus court",
        "Un SARIMA ne peut pas prévoir plus de sept jours",
      ],
      correct: 1,
      explanation: "Le modèle ne voit que la saisonnalité de 7 jours. Le creux de l'été est une saison annuelle : il faut la lui donner (variables de calendrier en entrée) ou disposer de plusieurs années d'historique.",
    },
  ],
};
