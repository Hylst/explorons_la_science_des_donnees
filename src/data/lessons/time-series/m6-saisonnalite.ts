import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { CO2 } from "./data";

/** CO2 mensuel : entraînement jusqu'en décembre 1999 (502 mois), test sur les 24 derniers mois (2000 et 2001) */
const CO2_DECOUPE = lines(CO2, "", "train = co2[:-24]", "test = co2[-24:]");

/** Erreur absolue moyenne, utilisée dans plusieurs exemples */
const MAE = lines("def mae(reel, prevu):", "    return float(np.mean(np.abs(np.asarray(reel) - np.asarray(prevu))))");

export const moduleSaisonnalite: LessonModule = {
  id: "saisonnalite-lissage",
  title: "Saisonnalité et lissage exponentiel",
  duration: "2 h 30",
  summary: "Prévoir une série saisonnière (le CO2 de Mauna Loa) avec un SARIMA et avec le lissage exponentiel de Holt-Winters, les comparer à la naïve saisonnière sur 24 mois tenus à l'écart, et éviter les pièges classiques de l'évaluation.",
  objectives: [
    "Ajuster un SARIMA (SARIMAX avec seasonal_order) et lire son ordre saisonnier",
    "Appliquer le lissage exponentiel simple, de Holt et de Holt-Winters, et savoir ce que chaque ingrédient ajoute",
    "Comparer plusieurs modèles sur une période tenue à l'écart, face à la naïve saisonnière",
    "Repérer trois pièges : fuite d'information, horizon trop long, choix du modèle sur une seule fenêtre",
  ],
  sections: [
    {
      kind: "text",
      md: `### Quand la série a une saison

Un ARIMA ordinaire ne sait pas qu'il existe douze mois dans l'année. Le **SARIMA** (ARIMA saisonnier) ajoute un deuxième jeu de réglages qui agissent aux retards multiples de la période m (12 pour des données mensuelles). Son écriture complète est **SARIMA(p, d, q)(P, D, Q)m** :

- (p, d, q) : les ordres vus au module précédent (autorégressif, différences, moyenne mobile), pour la dynamique d'un mois à l'autre ;
- (P, D, Q) : les mêmes ingrédients pour la dynamique d'une année à l'autre : D différences de 12 mois, P termes autorégressifs et Q termes de moyenne mobile aux retards 12, 24, 36...

En statsmodels : \`SARIMAX(serie, order=(p, d, q), seasonal_order=(P, D, Q, m))\`. Le module 4 a montré qu'après une différence d'ordre 1 et une différence de 12 mois, le CO2 garde des autocorrélations négatives aux retards 1 et 12 (-0,30 et -0,41) : c'est exactement ce que captent deux termes de moyenne mobile, l'un ordinaire (θ), l'autre saisonnier (Θ). D'où le modèle (0, 1, 1)(0, 1, 1)12, un classique de Box et Jenkins (1970).`,
    },
    {
      kind: "equation",
      latex: String.raw`(1 - B)\,(1 - B^{12})\; y_t = (1 + \theta_1 B)\,(1 + \Theta_1 B^{12})\; \varepsilon_t`,
      narrow: String.raw`\begin{aligned} &(1 - B)\,(1 - B^{12})\; y_t \\ &= (1 + \theta_1 B)\,(1 + \Theta_1 B^{12})\; \varepsilon_t \end{aligned}`,
      caption: "SARIMA(0, 1, 1)(0, 1, 1)12 écrit avec l'opérateur de retard B (B y(t) = y(t-1)). À gauche : une différence d'ordre 1 et une différence de 12 mois. À droite : un terme de moyenne mobile au retard 1 (θ) et un au retard 12 (Θ).",
    },
    {
      kind: "text",
      md: `### Le protocole : 24 mois tenus à l'écart

Nous mettons de côté les **24 derniers mois** (janvier 2000 à décembre 2001) comme période de test et nous ajustons tout sur les 502 mois précédents. Les modèles ne verront jamais ces 24 mois avant d'être jugés. Trois références d'abord, sans aucun modèle :

- la **naïve** : la dernière valeur répétée (elle ignore la saison et la tendance) ;
- la **naïve saisonnière** : chaque mois est prévu par le même mois de la dernière année connue (elle suit la saison, mais pas la hausse) ;
- la **naïve saisonnière avec dérive** : comme la précédente, mais on ajoute à chaque mois la hausse observée sur la dernière année (une année de plus pour la deuxième année prévue). C'est une référence exigeante pour une série qui monte et qui a une saison.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        CO2_DECOUPE,
        "",
        MAE,
        "",
        `print("entraînement :", len(train), "mois, jusqu'en", train.index[-1].strftime("%Y-%m"))`,
        `print("test :", len(test), "mois, de", test.index[0].strftime("%Y-%m"), "à", test.index[-1].strftime("%Y-%m"))`,
        "",
        "naive = np.full(24, train.iloc[-1])",
        "saisonniere = np.tile(train.to_numpy()[-12:], 2)",
        "derive = train.iloc[-1] - train.iloc[-13]   # hausse sur la dernière année d'entraînement",
        "saisonniere_derive = np.concatenate([train.to_numpy()[-12:] + derive, train.to_numpy()[-12:] + 2 * derive])",
        "",
        "print(f'hausse sur la dernière année : {derive:.3f} ppm')",
        "print(f'MAE naïve                      : {mae(test, naive):.3f}')",
        "print(f'MAE naïve saisonnière          : {mae(test, saisonniere):.3f}')",
        "print(f'MAE naïve saisonnière + dérive : {mae(test, saisonniere_derive):.3f}')",
      ),
      caption: "La naïve se trompe de 2,420 ppm en moyenne, la naïve saisonnière de 1,882 (elle suit la saison mais rate la hausse de plus d'un ppm par an), et la naïve saisonnière avec dérive de 0,541. Voilà la barre à franchir : un modèle qui ne fait pas mieux que 0,541 n'apporte rien.",
    },
    {
      kind: "text",
      md: `### Le lissage exponentiel

Le **lissage exponentiel** prévoit à partir d'une moyenne pondérée du passé où les poids décroissent exponentiellement : l'observation la plus récente compte le plus. Trois variantes, qui ajoutent chacune un ingrédient :

- **simple** (\`SimpleExpSmoothing\`) : un niveau, réglé par α. La prévision est le dernier niveau lissé, partout.
- **de Holt** (\`Holt\`) : un niveau et une **tendance** (β). La prévision monte ou descend en ligne droite.
- **de Holt-Winters** (\`ExponentialSmoothing\` avec \`seasonal_periods\`) : niveau, tendance et **saison** (γ). La saison peut être **additive** (le même écart en ppm chaque année) ou **multiplicative** (un écart proportionnel au niveau).

Pour le lissage simple, le niveau lissé est une moyenne entre la dernière observation (poids α) et le niveau précédent : niveau(t) = α y(t) + (1 - α) niveau(t-1). Si α vaut 1, le niveau est la dernière valeur : c'est la naïve. Si α est proche de 0, le niveau bouge peu.

Les paramètres α, β, γ sont estimés automatiquement en minimisant les erreurs sur l'entraînement. Aucune hypothèse de stationnarité, pas de différence à choisir : c'est un modèle simple, rapide, et souvent difficile à battre.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        CO2_DECOUPE,
        "import matplotlib.pyplot as plt",
        "from statsmodels.tsa.holtwinters import ExponentialSmoothing, SimpleExpSmoothing, Holt",
        "",
        MAE,
        "",
        "modeles = {",
        "    'lissage simple': SimpleExpSmoothing(train),",
        "    'Holt (tendance)': Holt(train),",
        "    'Holt-Winters additif': ExponentialSmoothing(train, trend='add', seasonal='add', seasonal_periods=12),",
        "}",
        "noms = {'smoothing_level': 'alpha', 'smoothing_trend': 'beta', 'smoothing_seasonal': 'gamma'}",
        "previsions = {}",
        "for nom, modele in modeles.items():",
        "    res = modele.fit()",
        "    previsions[nom] = res.forecast(24)",
        "    params = {noms[k]: round(float(v), 3) for k, v in res.params.items() if k in noms and not np.isnan(v)}",
        "    print(f'{nom:22s} MAE = {mae(test, previsions[nom]):6.3f}   {params}')",
        "",
        "holt = previsions['Holt (tendance)']",
        `print("Holt : dernière variation mensuelle", round(train.iloc[-1] - train.iloc[-2], 2), "ppm ; prévu pour décembre 2001 :", round(holt.iloc[-1], 1), "contre", round(test.iloc[-1], 1), "observé")`,
        "hw = previsions['Holt-Winters additif']",
        "print('erreur moyenne (réel - prévu) de Holt-Winters :', round(float(np.mean(test.to_numpy() - hw.to_numpy())), 3), 'ppm')",
        "",
        "fig, ax = plt.subplots(figsize=(9, 3.5))",
        "ax.plot(train['1997':].index, train['1997':], label='entraînement')",
        "ax.plot(test.index, test, color='black', label='réel')",
        "ax.plot(hw.index, hw, color='tab:red', label='Holt-Winters additif')",
        "ax.plot(test.index, previsions['Holt (tendance)'], color='tab:green', linestyle='--', label='Holt (sans saison)')",
        "ax.set_ylabel('CO2 (ppm)')",
        "ax.legend(loc='upper left')",
        "plt.tight_layout()",
        "plt.show()",
      ),
      caption: "Le lissage simple choisit α = 1 : il retombe exactement sur la naïve (MAE 2,420). Holt, qui ajoute une tendance mais pas de saison, dérape à 13,418 ppm : avec α et β à 1, la pente est la dernière variation mensuelle (+1,25 ppm de novembre à décembre 1999, un mouvement saisonnier), prolongée pendant 24 mois jusqu'à 397,9 ppm prévus pour décembre 2001, contre 371,0 observés. Holt-Winters additif (α = 0,566, β = 0,010, γ = 0,138) tombe à 0,236 ppm, mieux que la meilleure naïve (0,541). Il reste un défaut : l'erreur moyenne signée vaut -0,218 ppm, c'est-à-dire que presque toute l'erreur est un biais (le modèle prévoit en moyenne trop haut).",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Ajustez un **Holt-Winters additif** (`ExponentialSmoothing` avec `trend='add'`, `seasonal='add'` et `seasonal_periods=12`) sur `train`. Rangez ses prévisions pour les 24 mois du test dans `prevision_hw` et leur erreur absolue moyenne dans `mae_hw`.",
      setup: CO2_DECOUPE,
      starter: lines("from statsmodels.tsa.holtwinters import ExponentialSmoothing", "", "prevision_hw = None", "mae_hw = None"),
      solution: lines(
        "from statsmodels.tsa.holtwinters import ExponentialSmoothing",
        "",
        "res = ExponentialSmoothing(train, trend='add', seasonal='add', seasonal_periods=12).fit()",
        "prevision_hw = res.forecast(24)",
        "mae_hw = np.mean(np.abs(test.to_numpy() - prevision_hw.to_numpy()))",
        "print('MAE Holt-Winters additif :', round(mae_hw, 3))",
      ),
      test: lines(
        "from statsmodels.tsa.holtwinters import ExponentialSmoothing",
        `assert prevision_hw is not None and mae_hw is not None, "rangez les prévisions dans prevision_hw et leur erreur dans mae_hw"`,
        `assert len(prevision_hw) == 24, f"il faut une prévision par mois du test, soit 24 (vous en avez {len(prevision_hw)})"`,
        "attendue = ExponentialSmoothing(train, trend='add', seasonal='add', seasonal_periods=12).fit().forecast(24).to_numpy()",
        `assert np.allclose(np.asarray(prevision_hw), attendue, atol=1e-3), "prevision_hw doit venir d'un Holt-Winters additif ajusté sur train (trend='add', seasonal='add', seasonal_periods=12)"`,
        "erreur = float(np.mean(np.abs(test.to_numpy() - attendue)))",
        `assert abs(float(mae_hw) - erreur) < 1e-3, f"mae_hw est la moyenne des écarts absolus entre test et la prévision, environ {erreur:.3f} (vous avez {float(mae_hw):.3f})"`,
        "naive_saisonniere = float(np.mean(np.abs(test.to_numpy() - np.tile(train.to_numpy()[-12:], 2))))",
        `assert mae_hw < naive_saisonniere, "le modèle doit faire mieux que la naïve saisonnière"`,
      ),
      hint: "ExponentialSmoothing(train, trend='add', seasonal='add', seasonal_periods=12).fit() donne un résultat dont .forecast(24) renvoie les 24 prochains mois. La MAE : np.mean(np.abs(test.to_numpy() - prevision_hw.to_numpy())).",
    },
    {
      kind: "note",
      tone: "tip",
      md: "**Essayez `damped_trend=True`** : la tendance s'amortit au lieu de se prolonger en ligne droite. Sur ce test, la MAE tombe à 0,209. Ne retenez pas ce modèle pour autant : le choisir parce qu'il fait mieux sur le test, c'est choisir sur le test (voir les pièges plus bas).",
    },
    {
      kind: "text",
      md: `### Un SARIMA pour le même problème

Même protocole, autre famille de modèles. \`SARIMAX\` (du module \`statsmodels.tsa.statespace.sarimax\`) s'ajuste avec \`fit(disp=False)\` (qui supprime les messages de l'optimiseur) et prévoit avec \`get_forecast\`, exactement comme ARIMA au module précédent, intervalle compris. Nous comparons le modèle classique (0, 1, 1)(0, 1, 1)12 à une variante avec un terme autorégressif de plus, (1, 1, 1)(0, 1, 1)12. Le calcul prend quelques secondes.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        CO2_DECOUPE,
        "import matplotlib.pyplot as plt",
        "from statsmodels.tsa.statespace.sarimax import SARIMAX",
        "",
        MAE,
        "",
        "for ordre in [(0, 1, 1), (1, 1, 1)]:",
        "    modele = SARIMAX(train, order=ordre, seasonal_order=(0, 1, 1, 12)).fit(disp=False)",
        "    f = modele.get_forecast(steps=24)",
        "    print(f'SARIMA{ordre}(0, 1, 1)12 : AIC = {modele.aic:.1f}   MAE = {mae(test, f.predicted_mean):.3f}')",
        "    if ordre == (0, 1, 1):",
        "        simple, f_simple = modele, f",
        "",
        "print(simple.params.round(3))",
        "bornes = f_simple.conf_int(alpha=0.05)",
        "dans = (test.to_numpy() >= bornes.iloc[:, 0].to_numpy()) & (test.to_numpy() <= bornes.iloc[:, 1].to_numpy())",
        `print("mois réels dans l'intervalle à 95 % :", int(dans.sum()), "sur", len(test))`,
        "",
        "fig, ax = plt.subplots(figsize=(9, 3.5))",
        "ax.plot(train['1997':].index, train['1997':], label='entraînement')",
        "ax.plot(test.index, test, color='black', label='réel')",
        "ax.plot(test.index, f_simple.predicted_mean, color='tab:red', label='SARIMA(0, 1, 1)(0, 1, 1)12')",
        "ax.fill_between(bornes.index, bornes.iloc[:, 0], bornes.iloc[:, 1], color='tab:red', alpha=0.15, label='intervalle à 95 %')",
        "ax.set_ylabel('CO2 (ppm)')",
        "ax.legend(loc='upper left')",
        "plt.tight_layout()",
        "plt.show()",
      ),
      caption: "Les deux SARIMA donnent presque la même prévision : MAE de 0,359 pour (0, 1, 1)(0, 1, 1)12 et de 0,355 avec un terme autorégressif de plus, pour un AIC meilleur de 2,6 points (251,2 contre 253,8). Le gain est trop petit pour justifier le paramètre supplémentaire. Dans le modèle simple, θ = -0,347 et Θ = -0,848 : un coefficient saisonnier proche de -1 est le signe d'une saison très stable d'une année à l'autre. Les 24 mois réels tombent dans l'intervalle à 95 %. Avec 0,359, le SARIMA bat la meilleure référence (0,541) mais pas le Holt-Winters (0,236).",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Ajustez un **SARIMA(0, 1, 1)(0, 1, 1)12** sur `train` (`SARIMAX`, avec `fit(disp=False)`). Rangez dans `prevision_sarima` sa prévision centrale pour les 24 mois du test (`get_forecast(...).predicted_mean`), dans `mae_sarima` son erreur absolue moyenne et dans `n_dans` le nombre de mois réels (sur 24) qui tombent dans son intervalle de prévision à 95 %.",
      setup: CO2_DECOUPE,
      starter: lines("from statsmodels.tsa.statespace.sarimax import SARIMAX", "", "prevision_sarima = None", "mae_sarima = None", "n_dans = None"),
      solution: lines(
        "from statsmodels.tsa.statespace.sarimax import SARIMAX",
        "",
        "modele = SARIMAX(train, order=(0, 1, 1), seasonal_order=(0, 1, 1, 12)).fit(disp=False)",
        "f = modele.get_forecast(steps=24)",
        "prevision_sarima = f.predicted_mean",
        "mae_sarima = np.mean(np.abs(test.to_numpy() - prevision_sarima.to_numpy()))",
        "bornes = f.conf_int(alpha=0.05)",
        "n_dans = int(((test.to_numpy() >= bornes.iloc[:, 0].to_numpy()) & (test.to_numpy() <= bornes.iloc[:, 1].to_numpy())).sum())",
        `print("MAE SARIMA :", round(mae_sarima, 3), " mois dans l'intervalle :", n_dans)`,
      ),
      test: lines(
        "from statsmodels.tsa.statespace.sarimax import SARIMAX",
        `assert prevision_sarima is not None and mae_sarima is not None and n_dans is not None, "rangez la prévision, son erreur et le nombre de mois dans l'intervalle dans prevision_sarima, mae_sarima et n_dans"`,
        `assert len(prevision_sarima) == 24, f"il faut une prévision par mois du test, soit 24 (vous en avez {len(prevision_sarima)})"`,
        "ref = SARIMAX(train, order=(0, 1, 1), seasonal_order=(0, 1, 1, 12)).fit(disp=False).get_forecast(steps=24)",
        `assert np.allclose(np.asarray(prevision_sarima), ref.predicted_mean.to_numpy(), atol=1e-2), "prevision_sarima doit être la prévision centrale du SARIMA(0, 1, 1)(0, 1, 1)12 ajusté sur train"`,
        "erreur = float(np.mean(np.abs(test.to_numpy() - ref.predicted_mean.to_numpy())))",
        `assert abs(float(mae_sarima) - erreur) < 1e-2, f"mae_sarima est la moyenne des écarts absolus entre test et la prévision, environ {erreur:.3f} (vous avez {float(mae_sarima):.3f})"`,
        "b = ref.conf_int(alpha=0.05)",
        "attendu = int(((test.to_numpy() >= b.iloc[:, 0].to_numpy()) & (test.to_numpy() <= b.iloc[:, 1].to_numpy())).sum())",
        `assert n_dans == attendu, f"n_dans est le nombre de mois réels compris entre les bornes de conf_int(alpha=0.05), soit {attendu} ici (vous avez {n_dans})"`,
      ),
      hint: "SARIMAX(train, order=(0, 1, 1), seasonal_order=(0, 1, 1, 12)).fit(disp=False), puis get_forecast(steps=24). conf_int() donne un tableau à deux colonnes (borne basse, borne haute) ; comparez test.to_numpy() à chacune.",
    },
    {
      kind: "text",
      md: `### Le bilan, côte à côte

Rassemblons tout sur les mêmes 24 mois : trois références, le Holt-Winters additif et le SARIMA. Le tableau donne l'erreur sur les 24 mois, puis sur la première et sur la deuxième année prévue : plus on s'éloigne de la dernière observation, plus l'erreur grandit, et c'est la raison pour laquelle on précise toujours l'**horizon**.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        CO2_DECOUPE,
        "import matplotlib.pyplot as plt",
        "from statsmodels.tsa.holtwinters import ExponentialSmoothing",
        "from statsmodels.tsa.statespace.sarimax import SARIMAX",
        "",
        MAE,
        "",
        "derive = train.iloc[-1] - train.iloc[-13]",
        "dernier_an = train.to_numpy()[-12:]",
        "hw = ExponentialSmoothing(train, trend='add', seasonal='add', seasonal_periods=12).fit().forecast(24)",
        "sarima = SARIMAX(train, order=(0, 1, 1), seasonal_order=(0, 1, 1, 12)).fit(disp=False).get_forecast(steps=24).predicted_mean",
        "prevus = {",
        "    'naïve': np.full(24, train.iloc[-1]),",
        "    'naïve saisonnière': np.tile(dernier_an, 2),",
        "    'naïve saisonnière + dérive': np.concatenate([dernier_an + derive, dernier_an + 2 * derive]),",
        "    'Holt-Winters additif': hw.to_numpy(),",
        "    'SARIMA (0,1,1)(0,1,1)12': sarima.to_numpy(),",
        "}",
        "bilan = pd.DataFrame({",
        "    nom: {'MAE 24 mois': mae(test, p), 'MAE année 1': mae(test[:12], p[:12]), 'MAE année 2': mae(test[12:], p[12:])}",
        "    for nom, p in prevus.items()",
        "}).T.round(3)",
        "print(bilan.sort_values('MAE 24 mois'))",
        "",
        "fig, ax = plt.subplots(figsize=(8, 3))",
        "bilan['MAE 24 mois'].sort_values(ascending=False).plot.barh(ax=ax)",
        "ax.set_xlabel('erreur absolue moyenne sur 24 mois (ppm)')",
        "plt.tight_layout()",
        "plt.show()",
      ),
      caption: "Classement sur 24 mois : Holt-Winters additif (0,236), SARIMA (0,359), naïve saisonnière avec dérive (0,541), naïve saisonnière (1,882), naïve (2,420). Holt-Winters fait plus de deux fois mieux que la meilleure référence, le SARIMA un peu plus d'une fois et demie. Pour chaque méthode, la deuxième année est moins bien prévue que la première : Holt-Winters 0,213 puis 0,258, SARIMA 0,292 puis 0,427, naïve saisonnière avec dérive 0,379 puis 0,704.",
    },
    {
      kind: "text",
      md: `### Trois pièges

- **La fuite d'information.** Toute information du futur qui s'infiltre dans l'ajustement fausse l'évaluation : juger un modèle sur des mois qui ont servi à le régler, calculer une moyenne ou interpoler sur toute la série avant de la découper, et surtout **choisir** le modèle, son ordre ou ses options en regardant l'erreur sur le test. Le test ne sert qu'une fois, à la fin. Pour choisir, on réserve une fenêtre de **validation** placée avant le test.
- **L'horizon trop long.** Une prévision à 24 mois et une prévision à 11 ans n'ont rien de comparable : l'erreur grandit avec l'horizon, et la structure estimée aujourd'hui peut ne plus tenir. Annoncez toujours l'horizon avec l'erreur.
- **Le sur-ajustement de l'ordre.** Ajouter des paramètres améliore toujours l'ajustement sur l'entraînement, pas forcément la prévision : l'exemple SARIMA ci-dessus l'a montré (un terme de plus, un gain de 0,004 ppm). Préférez le modèle le plus simple qui tient la comparaison avec les références.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        CO2_DECOUPE,
        "from statsmodels.tsa.holtwinters import ExponentialSmoothing",
        "",
        MAE,
        "",
        "# 1. Horizon trop long : on ajuste jusqu'en décembre 1990 et on prévoit les 132 mois suivants",
        "tr, te = co2[:'1990-12'], co2['1991-01':]",
        "res = ExponentialSmoothing(tr, trend='add', seasonal='add', seasonal_periods=12).fit()",
        "erreurs = np.abs(te.to_numpy() - res.forecast(len(te)).to_numpy())",
        "par_annee = pd.Series(erreurs).groupby(np.arange(len(te)) // 12).mean().round(2)",
        "print('MAE par année de prévision (1 à 11) :', par_annee.tolist())",
        "print('MAE sur les 132 mois :', round(float(erreurs.mean()), 2))",
        "",
        "# 2. Fuite d'information : évaluer un modèle sur des mois qui ont servi à l'ajuster",
        "tout = ExponentialSmoothing(co2, trend='add', seasonal='add', seasonal_periods=12).fit()",
        "print('MAE sur les 24 derniers mois, modèle ajusté avec eux :', round(mae(test, tout.fittedvalues.iloc[-24:]), 3))",
        "vrai = ExponentialSmoothing(train, trend='add', seasonal='add', seasonal_periods=12).fit()",
        "print('MAE de la vraie prévision à 24 mois, hors échantillon  :', round(mae(test, vrai.forecast(24)), 3))",
      ),
      caption: "Horizon : le même type de modèle, ajusté jusqu'en 1990, se trompe de 0,30 à 1,10 ppm par an pendant les sept premières années prévues, puis de 2,37 à 2,92 ppm de la huitième à la onzième ; sur les 132 mois la MAE est de 1,38, bien loin des 0,236 mesurés à 24 mois (l'erreur ne croît pas régulièrement, mais l'ordre de grandeur change). Fuite : évalué sur des mois qu'il a servi à ajuster, le modèle paraît se tromper de 0,187 ppm seulement, contre 0,236 pour la vraie prévision, soit environ 21 % d'optimisme (l'écart mêle deux causes : le modèle a vu ces mois, et il ne prévoit ici qu'un mois à l'avance).",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Choisissez le type de saison **sans regarder le test**. Pour `'add'` puis `'mul'` (Holt-Winters avec `trend='add'`, `seasonal=` la valeur essayée et `seasonal_periods=12`), ajustez sur `train_v` (jusqu'à fin 1997), prévoyez les 24 mois de `valid` (1998 et 1999) et rangez les deux erreurs absolues moyennes dans le dictionnaire `mae_valid` (clés `'add'` et `'mul'`). Rangez dans `choix` la saison de plus petite erreur. Ajustez ensuite ce choix sur `train` et rangez son erreur sur `test` dans `mae_test`.",
      setup: lines(CO2_DECOUPE, "train_v = co2[:-48]", "valid = co2[-48:-24]"),
      starter: lines("from statsmodels.tsa.holtwinters import ExponentialSmoothing", "", "mae_valid = {}", "choix = None", "mae_test = None"),
      solution: lines(
        "from statsmodels.tsa.holtwinters import ExponentialSmoothing",
        "",
        "mae_valid = {}",
        "for saison in ('add', 'mul'):",
        "    res = ExponentialSmoothing(train_v, trend='add', seasonal=saison, seasonal_periods=12).fit()",
        "    mae_valid[saison] = np.mean(np.abs(valid.to_numpy() - res.forecast(24).to_numpy()))",
        "choix = min(mae_valid, key=mae_valid.get)",
        "res = ExponentialSmoothing(train, trend='add', seasonal=choix, seasonal_periods=12).fit()",
        "mae_test = np.mean(np.abs(test.to_numpy() - res.forecast(24).to_numpy()))",
        "print({k: round(float(v), 3) for k, v in mae_valid.items()}, 'choix :', choix, ' MAE test :', round(float(mae_test), 3))",
      ),
      test: lines(
        "from statsmodels.tsa.holtwinters import ExponentialSmoothing",
        `assert choix is not None and mae_test is not None and len(mae_valid) > 0, "remplissez mae_valid (clés 'add' et 'mul'), choix et mae_test"`,
        `assert set(mae_valid) == {'add', 'mul'}, "mae_valid doit avoir deux clés : 'add' et 'mul'"`,
        "def _mae(a, b):",
        "    return float(np.mean(np.abs(np.asarray(a) - np.asarray(b))))",
        "attendu = {s: _mae(valid, ExponentialSmoothing(train_v, trend='add', seasonal=s, seasonal_periods=12).fit().forecast(24)) for s in ('add', 'mul')}",
        "for s in ('add', 'mul'):",
        `    assert abs(float(mae_valid[s]) - attendu[s]) < 1e-3, f"mae_valid['{s}'] est l'erreur sur valid d'un modèle ajusté sur train_v, environ {attendu[s]:.3f} (vous avez {float(mae_valid[s]):.3f})"`,
        `assert choix == min(attendu, key=attendu.get), "choix est la saison dont l'erreur est la plus petite sur la validation (pas sur le test)"`,
        "final = _mae(test, ExponentialSmoothing(train, trend='add', seasonal=choix, seasonal_periods=12).fit().forecast(24))",
        `assert abs(float(mae_test) - final) < 1e-3, f"mae_test est l'erreur sur test du modèle choisi, ajusté sur train, environ {final:.3f} (vous avez {float(mae_test):.3f})"`,
      ),
      hint: "Une boucle for saison in ('add', 'mul') qui ajuste sur train_v et compare res.forecast(24) à valid.to_numpy(). Le choix : min(mae_valid, key=mae_valid.get). Le test n'intervient qu'à la dernière étape.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "**La validation peut se tromper aussi.** Sur ces deux fenêtres de 24 mois, le classement s'inverse : la saison multiplicative gagne sur la validation (0,864 contre 1,370) et perd sur le test (0,443 contre 0,236). Une fenêtre de 24 mois est un échantillon mince. Une validation glissante (module 3), avec plusieurs origines, est plus fiable. Ajustons chaque modèle jusqu'en décembre de l'année précédente et prévoyons les 12 mois suivants, pour chaque année de 1991 à 1998 : la saison multiplicative a une MAE moyenne de 0,42 contre 0,53 pour l'additive, et gagne 5 fois sur 8. Elle paraît un peu meilleure en moyenne, mais elle perd 3 fois sur 8 et perd sur le test : quand les modèles sont aussi proches, le choix compte moins que l'honnêteté de l'évaluation.",
    },
    {
      kind: "text",
      md: `### Ce qu'il faut retenir

- Une série saisonnière se prévoit avec un SARIMA ou avec un lissage de Holt-Winters ; aucun des deux n'est meilleur par principe (ici Holt-Winters gagne, avec 0,236 contre 0,359).
- Dans tous les cas : une période de test tenue à l'écart, une référence naïve saisonnière (avec dérive si la série monte), un horizon annoncé, et un modèle choisi sans regarder le test.`,
    },
  ],
  quiz: [
    {
      question: "Dans SARIMAX(serie, order=(0, 1, 1), seasonal_order=(0, 1, 1, 12)), que représente le dernier nombre, 12 ?",
      options: [
        "Le nombre de mois à prévoir",
        "La période de la saison, en nombre de pas de temps",
        "Le nombre de paramètres du modèle",
        "L'ordre de la moyenne mobile saisonnière",
      ],
      correct: 1,
      explanation: "Le quatrième élément de seasonal_order est la période m de la saison : 12 pour des données mensuelles qui se répètent chaque année. Les trois premiers (P, D, Q) sont les ordres saisonniers.",
    },
    {
      question: "Sur le CO2, le lissage exponentiel simple choisit α = 1 et sa MAE est identique à celle de la naïve (2,420). Pourquoi ?",
      options: [
        "C'est un hasard",
        "Avec α = 1, le niveau lissé est la dernière observation : la prévision est la dernière valeur répétée, donc la naïve",
        "Le lissage simple utilise toujours la naïve saisonnière",
        "Le test était trop court",
      ],
      correct: 1,
      explanation: "Le niveau lissé est α fois la dernière valeur plus (1 - α) fois le niveau précédent. Avec α = 1 il ne garde que la dernière valeur. Sur une série qui monte et qui a une saison, l'optimiseur n'a rien trouvé de mieux.",
    },
    {
      question: "Pourquoi le modèle de Holt (niveau et tendance, sans saison) se trompe-t-il de 13,4 ppm en moyenne sur le CO2 ?",
      options: [
        "Il utilise trop de paramètres",
        "Il estime une pente à partir d'une variation mensuelle qui est en réalité saisonnière (+1,25 ppm), puis la prolonge pendant 24 mois",
        "Il ne sait pas gérer les valeurs positives",
        "Les données du CO2 contiennent des valeurs manquantes",
      ],
      correct: 1,
      explanation: "Sans composante saisonnière, le modèle prend la montée de novembre à décembre pour une tendance et l'extrapole : 397,9 ppm prévus pour décembre 2001 contre 371,0 observés. Une saison ignorée devient une erreur de tendance.",
    },
    {
      question: "Lequel de ces gestes est une fuite d'information ?",
      options: [
        "Découper la série dans l'ordre du temps",
        "Comparer plusieurs modèles sur le jeu de test, puis annoncer l'erreur du meilleur comme sa performance",
        "Comparer le modèle à la naïve saisonnière",
        "Annoncer l'horizon de la prévision",
      ],
      correct: 1,
      explanation: "Choisir sur le test, c'est laisser l'information du futur guider le choix : l'erreur annoncée est optimiste. Pour choisir, on réserve une fenêtre de validation avant le test, et l'on ne touche au test qu'à la fin.",
    },
    {
      question: "Un Holt-Winters ajusté jusqu'en 1990 a une MAE de 0,5 ppm la première année prévue, mais d'environ 2,7 à 2,9 ppm les dernières années (sur 11 ans). Que montre cet exemple ?",
      options: [
        "Que le modèle est faux",
        "Que l'erreur d'une prévision à 24 mois ne se transpose pas à un horizon bien plus long : il faut annoncer l'horizon avec l'erreur",
        "Que le CO2 est stationnaire",
        "Que le test est inutile",
      ],
      correct: 1,
      explanation: "Plus l'horizon est long, plus la structure estimée sur le passé a le temps de s'éloigner de la réalité. Une MAE mesurée à 24 mois ne dit rien d'une prévision à 10 ans.",
    },
  ],
};
