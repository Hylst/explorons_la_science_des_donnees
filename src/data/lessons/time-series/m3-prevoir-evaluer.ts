import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { CO2, TACHES } from "./data";

/** Découpage dans le temps : le passé jusqu'en décembre 1999, les 24 mois suivants à prévoir */
const DECOUPAGE = lines("train = co2[:'1999-12']", "test = co2['2000-01':]");

export const modulePrevoirEvaluer: LessonModule = {
  id: "prevoir-evaluer",
  title: "Prévoir et évaluer honnêtement",
  duration: "2 h",
  summary: "Découper une série dans le temps, se donner des références simples, mesurer l'erreur (MAE, MAPE et ses pièges), répéter l'évaluation à plusieurs dates et regarder l'effet de l'horizon.",
  objectives: [
    "Découper une série dans le temps, jamais au hasard, et expliquer pourquoi",
    "Construire trois références simples (moyenne, naïve, naïve saisonnière) et les mesurer par la MAE",
    "Reconnaître les pièges du MAPE",
    "Évaluer à plusieurs dates avec TimeSeriesSplit et lire l'effet de l'horizon de prévision",
  ],
  sections: [
    {
      kind: "text",
      md: `### Prévoir, c'est juger sur un futur qu'on ne connaît pas

Un modèle de prévision se juge sur des données qu'il n'a **pas vues**. Pour une série temporelle, « pas vues » veut dire « **postérieures** » à celles qui ont servi à construire le modèle. Deux mots de vocabulaire :

- l'**origine** est la dernière date connue au moment de prévoir ;
- l'**horizon** (h) est le nombre de pas entre l'origine et la date prévue : prévoir à h = 1 mois, c'est prévoir le mois suivant.

Sur le CO2 mensuel, on se place en décembre 1999 : on garde les mois jusqu'à cette date pour apprendre (\`train\`, 502 mois) et on met de côté les 24 mois suivants (\`test\`), de janvier 2000 à décembre 2001. Le test ne sert qu'à **juger**, à la fin.

Avant tout modèle, on se donne des **références** très simples, que n'importe quel modèle sérieux doit battre :

- la **moyenne** : prévoir la moyenne de tout le passé ;
- la **naïve** : répéter le dernier relevé connu ;
- la **naïve saisonnière** : prévoir chaque mois par la valeur du même mois un an plus tôt (ici, répéter la dernière année).`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        CO2,
        "import matplotlib.pyplot as plt",
        "",
        DECOUPAGE,
        "print(len(train), 'mois pour apprendre,', len(test), 'mois pour juger')",
        "",
        "moyenne = np.full(24, train.mean())                      # la moyenne de tout le passé",
        "naive = np.full(24, train.iloc[-1])                      # le dernier relevé, répété",
        "saisonniere = np.tile(train.iloc[-12:].to_numpy(), 2)     # la dernière année, répétée deux fois",
        "",
        "def mae(reel, prevu):",
        "    return np.mean(np.abs(reel - prevu))   # erreur absolue moyenne, en ppm",
        "",
        "for nom, prevu in [('moyenne', moyenne), ('naïve', naive), ('naïve saisonnière', saisonniere)]:",
        "    print(f'{nom:<18} MAE = {mae(test.to_numpy(), prevu):6.2f} ppm')",
        "print('mois sous-estimés par la naïve saisonnière :', int((test.to_numpy() > saisonniere).sum()), 'sur 24')",
        "",
        "fig, ax = plt.subplots(figsize=(9, 3.5))",
        "ax.plot(train['1997':], color='grey', label='passé')",
        "ax.plot(test, color='black', label='réel')",
        "ax.plot(test.index, naive, linestyle='--', label='naïve')",
        "ax.plot(test.index, saisonniere, linestyle=':', label='naïve saisonnière')",
        "ax.set_ylabel('CO2 (ppm)')",
        "ax.legend()",
        "plt.tight_layout()",
      ),
      caption: "La moyenne de tout le passé (338 ppm) se trompe de près de 32 ppm : avec une tendance, elle est inutilisable (elle n'est pas sur le graphique, hors de l'échelle). La naïve se trompe de 2,42 ppm en moyenne, la naïve saisonnière de 1,88 ppm. Cette dernière sous-estime les 24 mois : elle répète la dernière année et ignore que le CO2 a monté depuis.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Faites le découpage dans le temps : `train` doit contenir les mois **jusqu'à décembre 1999**, `test` les **24 mois suivants** (par dates, sans tirage au hasard). Construisez `prevision_naive` (le dernier mois de `train`, répété 24 fois, un tableau NumPy) et sa MAE dans `mae_naive`.",
      setup: CO2,
      starter: lines(
        "from sklearn.model_selection import train_test_split",
        "",
        "train, test = train_test_split(co2, test_size=24, random_state=0)",
        "prevision_naive = None",
        "mae_naive = None",
      ),
      solution: lines(
        DECOUPAGE,
        "prevision_naive = np.full(24, train.iloc[-1])",
        "mae_naive = np.mean(np.abs(test.to_numpy() - prevision_naive))",
        "print(train.index[-1].date(), test.index[0].date(), test.index[-1].date())",
        "print('MAE de la naïve :', round(mae_naive, 2), 'ppm')",
      ),
      test: lines(
        "assert len(test) == 24, f\"le test doit contenir 24 mois (vous en avez {len(test)})\"",
        "assert test.index[0] == pd.Timestamp('2000-01-01') and test.index[-1] == pd.Timestamp('2001-12-01'), \"le test doit couvrir les 24 derniers mois, de 2000-01 à 2001-12 : découpez par dates, sans tirage au hasard\"",
        "assert train.index[-1] == pd.Timestamp('1999-12-01'), f\"l'entraînement doit s'arrêter en 1999-12 (vous avez {train.index[-1]:%Y-%m})\"",
        "assert prevision_naive is not None and len(prevision_naive) == 24 and np.allclose(prevision_naive, train.iloc[-1]), \"prevision_naive répète 24 fois le dernier mois de train\"",
        "assert mae_naive is not None and abs(mae_naive - np.mean(np.abs(test.to_numpy() - train.iloc[-1]))) < 1e-9, \"mae_naive est la moyenne des écarts absolus entre test et la prévision\"",
      ),
      hint: "co2[:'1999-12'] pour le passé, co2['2000-01':] pour la suite ; np.full(24, valeur) répète une valeur ; np.mean(np.abs(...)) donne la MAE.",
    },
    {
      kind: "text",
      md: `### Pourquoi jamais au hasard

\`train_test_split\` de scikit-learn **mélange** les lignes par défaut, ce qui convient à des individus indépendants, pas à une série. Un mois tiré au hasard pour le test a ses deux voisins dans l'entraînement : le modèle n'a plus qu'à relier deux points connus. En situation réelle, le mois d'après n'existe pas encore. L'évaluation au hasard est donc **trop optimiste**, et l'écart peut être grand.

L'expérience ci-dessous le mesure : on « prévoit » des mois tirés au hasard par la droite qui relie leurs voisins connus, puis on fait la même chose avec les 24 derniers mois, où la droite n'a plus de voisin à droite et reste plate.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        CO2,
        "from sklearn.model_selection import train_test_split",
        "",
        "valeurs = co2.to_numpy()",
        "positions = np.arange(len(co2))",
        "",
        "def mae(reel, prevu):",
        "    return np.mean(np.abs(reel - prevu))",
        "",
        "# 1. découpage au hasard : 24 mois tirés au hasard (hors extrémités) servent de test",
        "for graine in range(5):",
        "    rng = np.random.default_rng(graine)",
        "    test_pos = np.sort(rng.choice(positions[1:-1], 24, replace=False))",
        "    train_pos = np.setdiff1d(positions, test_pos)",
        "    prevu = np.interp(test_pos, train_pos, valeurs[train_pos])   # la droite entre les voisins connus",
        "    print('au hasard, graine', graine, ': MAE =', round(mae(valeurs[test_pos], prevu), 2), 'ppm')",
        "",
        "# 2. découpage dans le temps : les 24 derniers mois",
        "train_pos, test_pos = positions[:-24], positions[-24:]",
        "prevu = np.interp(test_pos, train_pos, valeurs[train_pos])      # au-delà du dernier point connu, la droite reste plate",
        "print('dans le temps      : MAE =', round(mae(valeurs[test_pos], prevu), 2), 'ppm')",
        "",
        "# le piège de train_test_split : il mélange par défaut",
        "a, b = train_test_split(co2, test_size=24)",
        `print("test dans l'ordre du temps ?", b.index.is_monotonic_increasing)`,
        "a, b = train_test_split(co2, test_size=24, shuffle=False)",
        "print('avec shuffle=False, le test va de', b.index[0].strftime('%Y-%m'), 'à', b.index[-1].strftime('%Y-%m'))",
      ),
      caption: "Au hasard, l'erreur est de 0,31 à 0,57 ppm selon la graine ; dans le temps, elle est de 2,42 ppm, soit quatre à huit fois plus. C'est exactement l'erreur de la naïve : la droite plate répète le dernier relevé. Le tirage au hasard promet une précision qu'on n'aura jamais à l'usage. Pour couper dans le temps avec scikit-learn, il faut shuffle=False.",
    },
    {
      kind: "text",
      md: `### Mesurer l'erreur : MAE et MAPE

La **MAE** (erreur absolue moyenne) est la moyenne des écarts, sans signe, entre la valeur réelle et la prévision. Elle s'exprime dans l'unité de la série : une MAE de 1,88 ppm se lit directement. Le **MAPE** divise chaque écart par la valeur réelle : il s'exprime en pour cent, ce qui permet de comparer des séries d'échelles différentes. Il a trois pièges :

- il n'est **pas défini** quand une valeur réelle vaut zéro, et il **explose** quand elle s'en approche ;
- il est **asymétrique** : une prévision trop basse ne peut pas dépasser 100 % d'erreur, une prévision trop haute n'a pas de plafond ;
- il n'a pas de sens pour une grandeur dont le zéro est arbitraire, comme une température en degrés Celsius.

Quand le niveau est élevé, comme le CO2 autour de 370 ppm, il écrase au contraire toutes les différences. L'exemple qui suit montre les deux effets.`,
    },
    {
      kind: "equation",
      latex: String.raw`\mathrm{MAE} = \frac{1}{n} \sum_{t=1}^{n} \lvert y_t - \hat{y}_t \rvert \qquad\qquad \mathrm{MAPE} = \frac{100}{n} \sum_{t=1}^{n} \frac{\lvert y_t - \hat{y}_t \rvert}{\lvert y_t \rvert}`,
      caption: "y_t est la valeur réelle à la date t, ŷ_t la valeur prévue, n le nombre de dates prévues. La MAE a l'unité de la série ; le MAPE est en pour cent.",
    },
    {
      kind: "code",
      language: "python",
      setup: lines(CO2, TACHES),
      code: lines(
        "import numpy as np",
        "",
        "# co2 et taches sont déjà chargées",
        DECOUPAGE,
        "reel = test.to_numpy()",
        "references = {",
        "    'moyenne': np.full(24, train.mean()),",
        "    'naïve': np.full(24, train.iloc[-1]),",
        "    'naïve saisonnière': np.tile(train.iloc[-12:].to_numpy(), 2),",
        "}",
        "for nom, prevu in references.items():",
        "    mae = np.mean(np.abs(reel - prevu))",
        "    mape = 100 * np.mean(np.abs(reel - prevu) / np.abs(reel))",
        "    print(f'{nom:<18} MAE = {mae:6.2f} ppm   MAPE = {mape:5.2f} %')",
        "",
        "# le piège du zéro : taches solaires, prévues par l'année précédente",
        "erreur = (taches - taches.shift(1)).abs()",
        "relative = erreur / taches.abs()",
        "print('années à zéro tache :', taches[taches == 0].index.year.tolist(), '; années sous 5 taches :', int((taches < 5).sum()))",
        "print('MAE de la naïve :', round(erreur.mean(), 1), 'taches')",
        "print('MAPE de la naïve :', 100 * relative.mean(), '%')",
        "print('MAPE sans les années à zéro :', round(100 * relative.replace(np.inf, np.nan).mean(), 1), '%')",
        "",
        "# l'asymétrie : valeur réelle 100",
        "print('prévu 0 :', abs(100 - 0) / 100, '; prévu 300 :', abs(100 - 300) / 100)",
      ),
      caption: "Sur le CO2, les erreurs relatives sont minuscules pour tout le monde (8,63 %, 0,65 % et 0,51 %) : une erreur de 0,5 % semble excellente, alors que la hausse annuelle du CO2 n'est elle-même que de 0,38 % par an (module 1). Sur les taches solaires, trois années affichent zéro tache (1711, 1712 et 1810) : le MAPE de la naïve est infini. En les écartant, il vaut 56,2 % alors que la MAE est de 18,2 taches, un chiffre dominé par les années de faible activité. Enfin, pour une valeur réelle de 100, une prévision à 0 coûte 100 % d'erreur, une prévision à 300 coûte 200 %.",
    },
    {
      kind: "text",
      md: `### Ajouter la tendance à la naïve saisonnière

La naïve saisonnière répète la dernière année, mais le CO2 monte d'environ 1,3 ppm par an : sur 24 mois, elle prend du retard chaque année un peu plus (c'est ce que vous avez vu, 24 sous-estimations sur 24). Une référence plus exigeante lui ajoute la **hausse annuelle moyenne** du passé : une fois pour la première année prévue, deux fois pour la seconde. C'est la référence à battre dans la suite du cours.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "`prevision_saison` répète la dernière année de `train`. Calculez `hausse`, la **hausse annuelle moyenne** de `train` (la moyenne de `train.diff(12)`). Construisez `prevision_derive` : `prevision_saison` plus `hausse` pour les 12 premiers mois, et plus **2 × `hausse`** pour les 12 suivants. Calculez sa MAE dans `mae_derive`.",
      setup: lines(CO2, DECOUPAGE, "prevision_saison = np.tile(train.iloc[-12:].to_numpy(), 2)"),
      starter: lines("hausse = None", "prevision_derive = prevision_saison", "mae_derive = None"),
      solution: lines(
        "hausse = train.diff(12).mean()",
        "prevision_derive = prevision_saison + hausse * np.r_[np.ones(12), 2 * np.ones(12)]",
        "mae_derive = np.mean(np.abs(test.to_numpy() - prevision_derive))",
        "mae_saison = np.mean(np.abs(test.to_numpy() - prevision_saison))",
        "print(f'hausse annuelle moyenne : {hausse:.2f} ppm')",
        "print(f'MAE : {mae_saison:.2f} ppm sans la tendance, {mae_derive:.2f} ppm avec')",
      ),
      test: lines(
        "_h = train.diff(12).mean()",
        "assert hausse is not None and abs(hausse - _h) < 1e-9, \"hausse est la moyenne de train.diff(12), en ppm par an\"",
        "_p = prevision_saison + _h * np.r_[np.ones(12), 2 * np.ones(12)]",
        "assert len(prevision_derive) == 24 and np.allclose(prevision_derive, _p), \"prevision_derive = prevision_saison + hausse pour les 12 premiers mois, + 2 * hausse pour les 12 suivants\"",
        "assert mae_derive is not None and abs(mae_derive - np.mean(np.abs(test.to_numpy() - _p))) < 1e-9, \"mae_derive est la MAE de prevision_derive sur test\"",
        "assert mae_derive < np.mean(np.abs(test.to_numpy() - prevision_saison)), \"avec la tendance, l'erreur devrait être plus faible que celle de la naïve saisonnière\"",
      ),
      hint: "train.diff(12).mean() ; np.r_[np.ones(12), 2 * np.ones(12)] donne les multiplicateurs 1 puis 2.",
    },
    {
      kind: "text",
      md: `### Plusieurs origines : la validation glissante

Un seul découpage ne donne qu'**une** mesure, qui dépend de la période choisie. On répète donc l'évaluation à plusieurs origines qui avancent dans le temps : à chaque fois, on apprend sur le passé jusqu'à l'origine, on prévoit les mois suivants, on mesure l'erreur. C'est la **validation glissante** (*rolling origin*). Avec scikit-learn, \`TimeSeriesSplit(n_splits=5, test_size=24)\` fournit les cinq découpages ; l'apprentissage s'agrandit à chaque fois et le test reste dans le futur de l'apprentissage.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        CO2,
        "from sklearn.model_selection import TimeSeriesSplit",
        "",
        "valeurs = co2.to_numpy()",
        "decoupages = TimeSeriesSplit(n_splits=5, test_size=24)",
        "maes_n, maes_s = [], []",
        "print('origine -> mois prévus            MAE naïve   MAE saisonnière')",
        "for apprentissage, essai in decoupages.split(co2):",
        "    passe, reel = valeurs[apprentissage], valeurs[essai]",
        "    maes_n.append(np.mean(np.abs(reel - np.full(24, passe[-1]))))",
        "    maes_s.append(np.mean(np.abs(reel - np.tile(passe[-12:], 2))))",
        "    origine, debut, fin = co2.index[apprentissage[-1]], co2.index[essai[0]], co2.index[essai[-1]]",
        "    print(f'{origine:%Y-%m} -> {debut:%Y-%m} à {fin:%Y-%m}      {maes_n[-1]:.2f}        {maes_s[-1]:.2f}')",
        "print(f'moyenne     : naïve {np.mean(maes_n):.2f}, saisonnière {np.mean(maes_s):.2f}')",
        "print(f'écart-type  : naïve {np.std(maes_n):.2f}, saisonnière {np.std(maes_s):.2f}')",
      ),
      caption: "Cinq origines, de décembre 1991 à décembre 1999. La dernière est exactement le test de tout à l'heure (2,42 et 1,88). La naïve saisonnière fait mieux sur quatre découpages sur cinq, mais pas sur 1998-1999 (3,72 ppm contre 3,20 pour la naïve) : un seul découpage aurait pu donner l'une ou l'autre conclusion. Son erreur varie de 1,12 à 3,72 ppm selon la période (moyenne 2,38, écart-type 0,88). On rapporte donc la moyenne et la dispersion, pas un seul chiffre.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Avec `TimeSeriesSplit(n_splits=5, test_size=24)`, calculez la MAE de la **naïve** (le dernier mois connu, répété 24 fois) à chacun des cinq découpages. Rangez les cinq valeurs, dans l'ordre, dans la liste `maes`, et leur moyenne dans `mae_moyenne`.",
      setup: CO2,
      starter: lines("from sklearn.model_selection import TimeSeriesSplit", "", "maes = []", "mae_moyenne = None"),
      solution: lines(
        "from sklearn.model_selection import TimeSeriesSplit",
        "",
        "maes = []",
        "for apprentissage, essai in TimeSeriesSplit(n_splits=5, test_size=24).split(co2):",
        "    prevu = co2.iloc[apprentissage[-1]]   # le dernier mois connu",
        "    maes.append(np.mean(np.abs(co2.iloc[essai].to_numpy() - prevu)))",
        "mae_moyenne = np.mean(maes)",
        "print([round(m, 2) for m in maes], 'moyenne', round(mae_moyenne, 2))",
      ),
      test: lines(
        "assert len(maes) == 5, f\"il faut une MAE par découpage, soit 5 valeurs (vous en avez {len(maes)})\"",
        "_v = co2.to_numpy()",
        "_attendu = []",
        "for _k in range(5):",
        "    _fin = len(_v) - 24 * (5 - _k)   # l'apprentissage compte _fin mois, le test les 24 suivants",
        "    _attendu.append(np.mean(np.abs(_v[_fin:_fin + 24] - _v[_fin - 1])))",
        "assert np.allclose(maes, _attendu), f\"les MAE attendues sont {[round(m, 2) for m in _attendu]} (vous avez {[round(float(m), 2) for m in maes]})\"",
        "assert mae_moyenne is not None and abs(mae_moyenne - np.mean(_attendu)) < 1e-9, \"mae_moyenne est la moyenne des cinq MAE\"",
      ),
      hint: "Dans la boucle sur .split(co2), apprentissage[-1] est la position du dernier mois connu ; co2.iloc[essai] donne les 24 mois à prévoir.",
    },
    {
      kind: "text",
      md: `### L'horizon compte

Une erreur n'a de sens qu'avec son **horizon**. Prévoir le mois prochain et prévoir dans deux ans sont deux problèmes différents. Pour le voir, on mesure l'erreur des deux références à chaque horizon de 1 à 24 mois, en faisant avancer l'origine de mars 1983 à la fin de la série : ce sont de 202 à 225 origines selon l'horizon.

Pour la naïve saisonnière, la valeur de référence est celle du même mois de la **dernière année déjà connue** : un an avant la date prévue jusqu'à 12 mois d'horizon, deux ans avant au-delà.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        CO2,
        "import matplotlib.pyplot as plt",
        "",
        "valeurs = co2.to_numpy()",
        "debut = 300          # première origine : mars 1983",
        "mae_naive, mae_saison = [], []",
        "for h in range(1, 25):",
        "    cibles = np.arange(debut + h, len(valeurs))          # les mois prévus ; l'origine est h mois avant",
        "    mae_naive.append(np.mean(np.abs(valeurs[cibles] - valeurs[cibles - h])))",
        "    retour = 12 * int(np.ceil(h / 12))                   # 12 mois en arrière jusqu'à h = 12, 24 ensuite",
        "    mae_saison.append(np.mean(np.abs(valeurs[cibles] - valeurs[cibles - retour])))",
        "",
        "for h in [1, 3, 6, 12, 13, 18, 24]:",
        "    print(f'horizon {h:>2} mois : naïve {mae_naive[h - 1]:.2f}   saisonnière {mae_saison[h - 1]:.2f}')",
        "",
        "fig, ax = plt.subplots(figsize=(9, 3.5))",
        "ax.plot(range(1, 25), mae_naive, marker='o', markersize=3, label='naïve')",
        "ax.plot(range(1, 25), mae_saison, marker='o', markersize=3, label='naïve saisonnière')",
        "ax.set_xlabel('horizon (mois)')",
        "ax.set_ylabel('MAE (ppm)')",
        "ax.legend()",
        "plt.tight_layout()",
      ),
      caption: "L'erreur de la naïve ne croît pas avec l'horizon : 1,13 ppm à 1 mois, 3,72 à 6 mois (la saison est alors à l'opposé), 1,56 à 12 mois (même saison, il ne reste que la hausse annuelle). La naïve saisonnière est stable, autour de 1,58 ppm, jusqu'à 12 mois, puis double (3,14 ppm à 13 mois) parce qu'il faut remonter deux ans en arrière et donc rater deux ans de hausse. À 1 mois, la naïve simple fait mieux que la saisonnière (1,13 ppm contre 1,58) : la meilleure référence dépend de l'horizon. Une MAE ne se cite jamais sans son horizon.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "**La fuite d'information** est l'erreur la plus courante en prévision : toute étape qui a regardé le futur avant de prévoir rend l'évaluation trop belle. Combler des trous par interpolation sur toute la série, centrer et réduire avec la moyenne et l'écart-type de toute la série, choisir un réglage parce qu'il donne la meilleure erreur sur le test : trois fuites. La règle : tout ce qui est calculé ou choisi l'est avec le passé seul, et le test se regarde **une fois**, à la fin. Pour régler un modèle, on utilise la validation glissante à l'intérieur de l'entraînement.",
    },
    {
      kind: "note",
      tone: "tip",
      md: "Une MAE seule ne dit rien. Présentez toujours un modèle **avec la référence qu'il doit battre, au même horizon** : 0,4 ppm paraît excellent face à 1,88 ppm (la naïve saisonnière), beaucoup moins face à 0,37 ppm (la même référence avec la hausse annuelle). Les modules suivants construisent de vrais modèles et les comparent à ces références.",
    },
  ],
  quiz: [
    {
      question: "Pourquoi ne faut-il pas tirer au hasard les mois du jeu de test d'une série temporelle ?",
      options: [
        "Parce que scikit-learn ne sait pas faire de tirage",
        "Parce que le test serait trop petit",
        "Parce que les voisins des mois tirés sont dans l'entraînement : le modèle connaît déjà le futur et l'évaluation est trop optimiste",
        "Parce que le tirage supprime la saison",
      ],
      correct: 2,
      explanation: "Avec un tirage au hasard, prévoir revient à relier des points connus. Dans l'expérience du cours, l'erreur passe de 0,31 à 0,57 ppm au hasard à 2,42 ppm dans le temps.",
    },
    {
      question: "Sur une série mensuelle à saison annuelle, que prévoit la naïve saisonnière ?",
      options: [
        "Le dernier relevé connu, répété",
        "La valeur du même mois un an plus tôt",
        "La moyenne de tout le passé",
        "La valeur du mois précédent plus la hausse annuelle",
      ],
      correct: 1,
      explanation: "Elle répète le cycle de la dernière année connue. Elle respecte la saison mais ignore la tendance, d'où ses 24 sous-estimations sur le CO2 ; ajouter la hausse annuelle corrige l'essentiel.",
    },
    {
      question: "Pourquoi le MAPE est-il inutilisable pour les taches solaires prévues année par année ?",
      options: [
        "Parce que la série est trop courte",
        "Parce qu'une valeur réelle égale à zéro rend l'erreur relative infinie, et une valeur proche de zéro la fait exploser",
        "Parce que le MAPE ne s'applique qu'aux séries mensuelles",
        "Parce que les taches solaires sont mesurées en pour cent",
      ],
      correct: 1,
      explanation: "Le MAPE divise par la valeur réelle. Trois années affichent zéro tache : le MAPE de la naïve est infini, et sans elles il reste dominé par les années de faible activité (56,2 %).",
    },
    {
      question: "Sur cinq découpages glissants, la naïve saisonnière bat la naïve quatre fois, mais perd en 1998-1999. Que conclure ?",
      options: [
        "Qu'elle est toujours meilleure, la perte est un accident",
        "Qu'il faut garder le découpage qui l'avantage",
        "Qu'elle est le plus souvent meilleure, pas toujours : on rapporte la moyenne et la dispersion des erreurs",
        "Que la validation glissante est inutile",
      ],
      correct: 2,
      explanation: "Un seul découpage aurait donné une conclusion ou son contraire. Moyenne (2,38 contre 2,74 ppm) et dispersion des erreurs donnent une image plus honnête.",
    },
    {
      question: "Pour la naïve sur le CO2, l'erreur à 6 mois d'horizon (3,72 ppm) dépasse celle à 12 mois (1,56 ppm). Pourquoi ?",
      options: [
        "À 6 mois la saison est à l'opposé de celle du dernier relevé ; à 12 mois on retrouve la même saison, il ne reste que la hausse annuelle",
        "Parce que le calcul est faux : l'erreur croît toujours avec l'horizon",
        "Parce que 12 mois est un horizon plus court que 6 mois",
        "Parce que la naïve utilise la moyenne de tout le passé",
      ],
      correct: 0,
      explanation: "Sur une série saisonnière, l'erreur d'une prévision n'est pas croissante en l'horizon : elle dépend de la phase de la saison. Entre 1 et 12 mois, l'erreur de la naïve est la plus forte à 6 mois et retombe à 12 mois.",
    },
  ],
};
