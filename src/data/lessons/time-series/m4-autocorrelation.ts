import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { CO2, NIL, TACHES } from "./data";

export const moduleAutocorrelation: LessonModule = {
  id: "autocorrelation-stationnarite",
  title: "Autocorrélation et stationnarité",
  duration: "2 h",
  summary: "Lire un corrélogramme (acf, pacf), comprendre ce qu'est une série stationnaire, la rendre stationnaire par différenciation et tester la stationnarité sans se laisser tromper par les tests.",
  objectives: [
    "Calculer et interpréter l'autocorrélation et l'autocorrélation partielle d'une série (acf, pacf, plot_acf, plot_pacf)",
    "Repérer un cycle ou une tendance sur un corrélogramme, et distinguer un vrai pic d'un dépassement dû au hasard",
    "Définir la stationnarité et rendre une série stationnaire par différenciation (ordinaire et saisonnière)",
    "Utiliser les tests ADF et KPSS en connaissant leurs limites : un test ne remplace pas le graphique",
  ],
  sections: [
    {
      kind: "text",
      md: `### Une série qui ressemble à son passé

Dans un tableau ordinaire, on suppose que les lignes sont indépendantes. Dans une série temporelle, ce n'est presque jamais vrai : la température de demain ressemble à celle d'aujourd'hui, le débit d'un fleuve cette année dépend de celui de l'an dernier. Cette mémoire se mesure avec l'**autocorrélation de retard k** : la corrélation entre la série et la même série décalée de k pas de temps.

- Retard 1 : on compare chaque valeur à la précédente.
- Retard 12 sur des données mensuelles : on compare chaque mois au même mois de l'année précédente.

L'autocorrélation vaut 1 au retard 0 (la série est identique à elle-même) et reste entre -1 et 1. La liste de ses valeurs pour k = 1, 2, 3... s'appelle la **fonction d'autocorrélation**, ou **acf**, et son graphique le **corrélogramme**. Toute la suite du cours (ARIMA, SARIMA) repose sur cette lecture.`,
    },
    {
      kind: "equation",
      latex: String.raw`r_k = \frac{\sum_{t=1}^{n-k} (y_t - \bar{y})\,(y_{t+k} - \bar{y})}{\sum_{t=1}^{n} (y_t - \bar{y})^2}`,
      caption: "Autocorrélation de retard k : somme des produits d'écarts à la moyenne séparés de k pas, divisée par la somme des carrés des écarts. C'est la formule de statsmodels (acf).",
    },
    {
      kind: "text",
      md: `### Un exemple : les taches solaires

Le nombre annuel de taches à la surface du Soleil est suivi depuis 1700 (309 années dans la série fournie avec statsmodels). On sait qu'il monte et descend en cycles. Que raconte son corrélogramme ? \`acf\` donne les valeurs, \`plot_acf\` et \`plot_pacf\` les dessinent. La bande ombrée du graphique indique le seuil sous lequel une barre est compatible avec du hasard.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        TACHES,
        "import matplotlib.pyplot as plt",
        "from statsmodels.tsa.stattools import acf",
        "from statsmodels.graphics.tsaplots import plot_acf, plot_pacf",
        "",
        "r = acf(taches, nlags=15)",
        "for k in (1, 2, 5, 10, 11):",
        "    print(f'retard {k:2d} : {r[k]:+.2f}')",
        "print('seuil de signification à 95 % :', round(1.96 / np.sqrt(len(taches)), 3))",
        "",
        "fig, axes = plt.subplots(1, 2, figsize=(10, 3.5))",
        "plot_acf(taches, lags=30, ax=axes[0], title='Autocorrélation (acf)')",
        "plot_pacf(taches, lags=30, ax=axes[1], title='Autocorrélation partielle (pacf)')",
        "plt.tight_layout()",
        "plt.show()",
      ),
      caption: "Les barres de l'acf oscillent : fortement positives aux petits retards (0,82 au retard 1), négatives vers le retard 5 (-0,43), de nouveau positives vers les retards 10 et 11 (0,66 et 0,65). La série revient à des valeurs semblables environ tous les 10 à 11 ans : c'est le cycle solaire. Le seuil à 95 % est d'environ 0,11.",
    },
    {
      kind: "text",
      md: `### Lire un corrélogramme

- **Pics positifs réguliers** : un cycle. Ici l'acf est la plus haute au retard 10 (0,66), le retard 11 est presque à égalité (0,65) : la période est d'environ 10 à 11 ans, pas un nombre exact. Le cycle solaire est généralement donné à environ 11 ans.
- **Décroissance très lente depuis 1** : une tendance (on le verra avec le CO2).
- **Pics aux retards 12, 24, 36 sur des données mensuelles** : une saison annuelle.
- **Un dépassement isolé** : sans signification s'il n'est pas répété. Une barre sur vingt dépasse le seuil à 95 % **par pur hasard**.

L'**autocorrélation partielle** (pacf) de retard k est la corrélation entre y(t) et y(t-k) **une fois retirée l'influence des retards intermédiaires**. Sur les taches, elle vaut 0,82 au retard 1 puis -0,69 au retard 2, et reste ensuite plus petite, avec quelques barres qui dépassent encore le seuil aux retards 6 à 9 (de 0,18 à 0,26). Dans le module suivant, la pacf aidera à choisir l'ordre d'un modèle autorégressif : retenez dès maintenant que ces retards 6 à 9 existent.`,
    },
    {
      kind: "text",
      md: `### Du bruit pur, pour calibrer l'œil

Un **bruit blanc** est une suite de valeurs indépendantes : aucune autocorrélation réelle. Regardons son corrélogramme, sur autant de points que les taches solaires (graine fixée, donc reproductible). Combien de retards sur 40 dépassent le seuil de 95 % ?`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "import pandas as pd",
        "from statsmodels.tsa.stattools import acf",
        "",
        "rng = np.random.default_rng(0)",
        "bruit = pd.Series(rng.normal(size=309))   # 309 valeurs indépendantes, comme la longueur des taches solaires",
        "r = acf(bruit, nlags=40)",
        "seuil = 1.96 / np.sqrt(len(bruit))",
        "hors = [k for k in range(1, 41) if abs(r[k]) > seuil]",
        "print('seuil :', round(seuil, 3))",
        "print('retards qui dépassent le seuil :', hors)",
        "print('plus forte autocorrélation :', round(float(np.abs(r[1:]).max()), 3))",
        "print('attendus par hasard :', 0.05 * 40)",
      ),
      caption: "Sur du bruit pur, 1 retard sur 40 dépasse le seuil (le retard 11, avec 0,115 pour un seuil de 0,112) alors que le hasard en laisse passer environ 2 sur 40. Un pic isolé et à peine au-dessus du seuil ne prouve rien.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Calculez **à la main** l'autocorrélation de retard 1 des taches solaires, avec la formule du début du module : somme des produits des écarts à la moyenne de deux années consécutives, divisée par la somme des carrés des écarts. Rangez le résultat dans `r1`. Il doit retrouver la valeur de `acf`.",
      setup: TACHES,
      starter: "r1 = None",
      solution: lines(
        "ecarts = taches - taches.mean()",
        "r1 = (ecarts.iloc[1:].to_numpy() * ecarts.iloc[:-1].to_numpy()).sum() / (ecarts ** 2).sum()",
        "print(round(float(r1), 3))",
      ),
      test: lines(
        "from statsmodels.tsa.stattools import acf",
        `assert r1 is not None, "rangez l'autocorrélation de retard 1 dans r1"`,
        "attendu = float(acf(taches, nlags=1)[1])",
        `assert abs(float(r1) - attendu) < 1e-9, f"on attend environ {attendu:.3f} (vous avez {float(r1):.3f}) : somme des produits d'écarts consécutifs divisée par la somme des carrés des écarts"`,
      ),
      hint: "ecarts = taches - taches.mean(). Au numérateur, multipliez ecarts[1:] par ecarts[:-1] terme à terme (avec to_numpy() pour ne pas aligner sur les dates) et sommez ; au dénominateur, sommez ecarts ** 2.",
    },
    {
      kind: "text",
      md: `### Stationnarité

Les modèles de ce cours (AR, MA, ARIMA) apprennent des relations entre une valeur et ses voisines. Pour que ces relations aient un sens, il faut qu'elles soient les mêmes au début et à la fin de la série. On dit qu'une série est **stationnaire** quand sa moyenne, sa variance et ses autocorrélations ne dépendent pas de la date où on les mesure.

- Les taches solaires oscillent, mais autour d'un niveau à peu près stable : on les traite comme une série stationnaire.
- Le CO2 monte d'année en année et suit une saison : sa moyenne dépend de la date. Il n'est **pas** stationnaire.

La **différenciation** est le remède le plus courant :

- la **différence d'ordre 1**, y(t) - y(t-1), est la variation d'un mois sur l'autre ; elle retire une tendance (en pandas : \`diff()\`) ;
- la **différence saisonnière**, y(t) - y(t-12) pour des mois, est la variation par rapport au même mois un an plus tôt ; elle retire un motif qui se répète chaque année (en pandas : \`diff(12)\`).

On peut enchaîner les deux. Chaque différence fait perdre des valeurs au début de la série (1 puis 12) : d'où le \`dropna()\`.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        CO2,
        "import matplotlib.pyplot as plt",
        "from statsmodels.tsa.stattools import acf, adfuller",
        "",
        "series = {",
        "    'CO2 brut': co2,",
        "    'différence 1': co2.diff().dropna(),",
        "    'différence 12': co2.diff(12).dropna(),",
        "    'différences 1 et 12': co2.diff().diff(12).dropna(),",
        "}",
        "for nom, s in series.items():",
        "    p = adfuller(s)[1]",
        "    ra = acf(s, nlags=12)",
        "    print(f'{nom:22s} n={len(s)}  p ADF = {p:.4f}  acf(1) = {ra[1]:+.2f}  acf(12) = {ra[12]:+.2f}')",
        "",
        "fig, axes = plt.subplots(2, 1, figsize=(9, 5), sharex=True)",
        "axes[0].plot(co2.index, co2, linewidth=0.8)",
        "axes[0].set_ylabel('CO2 (ppm)')",
        "axes[1].plot(series['différences 1 et 12'], linewidth=0.8)",
        "axes[1].set_ylabel('après différences 1 et 12')",
        "plt.tight_layout()",
        "plt.show()",
      ),
      caption: "Le CO2 brut a un p de l'ADF de 0,9989 : rien ne permet de le dire stationnaire. Après une différence d'ordre 1, p = 0,0001, mais l'autocorrélation au retard 12 reste à 0,92 : la saison est toujours là. Une différence de 12 mois efface la saison (acf au retard 12 : 0,04) mais laisse une forte autocorrélation au retard 1 (0,81). Avec les deux différences, la série oscille autour de zéro sans tendance ni saison, avec des autocorrélations négatives aux retards 1 et 12 (-0,30 et -0,41).",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Rendez le CO2 stationnaire : appliquez une différence d'ordre 1, puis une différence saisonnière de 12 mois, supprimez les valeurs vides (`dropna()`) et rangez le résultat dans `co2_dd`. Avec `adfuller`, rangez la p-value du test ADF dans `p_adf`.",
      setup: CO2,
      starter: lines("from statsmodels.tsa.stattools import adfuller", "", "co2_dd = None", "p_adf = None"),
      solution: lines(
        "from statsmodels.tsa.stattools import adfuller",
        "",
        "co2_dd = co2.diff().diff(12).dropna()",
        "p_adf = adfuller(co2_dd)[1]",
        "print(len(co2_dd), 'valeurs, p ADF =', f'{p_adf:.1e}')",
      ),
      test: lines(
        "from statsmodels.tsa.stattools import adfuller",
        `assert co2_dd is not None, "rangez la série différenciée dans co2_dd : co2.diff().diff(12).dropna()"`,
        "attendu = co2.diff().diff(12).dropna()",
        `assert len(co2_dd) == len(attendu), f"la série différenciée doit avoir {len(attendu)} valeurs (13 de moins que co2) : vous en avez {len(co2_dd)}"`,
        `assert np.allclose(np.asarray(co2_dd), attendu.to_numpy()), "co2_dd doit contenir une différence d'ordre 1 puis une différence de 12 mois"`,
        `assert p_adf is not None and abs(p_adf - adfuller(attendu)[1]) < 1e-9, "p_adf est la p-value (deuxième valeur) renvoyée par adfuller(co2_dd)"`,
        `assert p_adf < 0.05, "la série différenciée doit être jugée stationnaire par l'ADF (p < 0,05)"`,
      ),
      hint: "co2.diff() retire la tendance, .diff(12) la saison, .dropna() les 13 premières valeurs vides. adfuller renvoie un tuple : la p-value est à l'indice 1.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "**Stationnaire ne veut pas dire sans autocorrélation.** Après la différence de 12 mois, le CO2 passe le test ADF (p = 0,0005) alors que son autocorrélation au retard 1 vaut encore 0,81. Une série stationnaire peut avoir beaucoup de mémoire : c'est précisément cette mémoire que les modèles du module suivant exploitent. Ne différenciez pas plus que nécessaire : une différence en trop fabrique de l'autocorrélation négative.",
    },
    {
      kind: "text",
      md: `### Tester la stationnarité, avec méfiance

Deux tests classiques, qui posent des questions **opposées** :

- **ADF** (Dickey-Fuller augmenté, \`adfuller\`) : l'hypothèse de départ est que la série a une **racine unitaire** (elle n'est pas stationnaire, comme une marche aléatoire). Une petite p-value fait **rejeter** cette hypothèse : la série ressemble à une série stationnaire.
- **KPSS** (\`kpss\`) : l'hypothèse de départ est que la série est **stationnaire** autour d'une constante (\`regression='c'\`) ou d'une tendance (\`'ct'\`). Une petite p-value fait **rejeter** la stationnarité.

Quand les deux tests concordent, c'est rassurant. Quand ils se contredisent, c'est un signal : il faut regarder la série. Autre limite : le KPSS compare à une table de valeurs critiques et ne renvoie qu'une p-value entre 0,01 et 0,10, avec un avertissement quand elle sort de la table (« p = 0,01 » se lit « au plus 0,01 »).

Le débit annuel du Nil (100 ans, de 1871 à 1970, en 10^8 m³) est un classique : la littérature statistique (Cobb, 1978) y étudie une rupture de niveau, que l'on situe vers 1898 et que l'on relie au barrage d'Assouan. Voyons ce que les tests en disent.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        NIL,
        "import warnings",
        "import matplotlib.pyplot as plt",
        "from statsmodels.tsa.stattools import adfuller, kpss",
        "",
        "# kpss avertit quand sa p-value sort de la table (0,01 à 0,10) : on lit alors « au plus 0,01 » ou « au moins 0,10 »",
        "warnings.filterwarnings('ignore', message='The test statistic is outside')",
        "",
        "print(f'ADF  sur toute la série : p = {adfuller(nil)[1]:.4f}')",
        `print(f"KPSS sur toute la série : p = {kpss(nil, regression='c')[1]:.2f}")`,
        "",
        "avant, apres = nil[:'1898'], nil['1899':]",
        `print(f"moyenne jusqu'en 1898 : {avant.mean():.1f} ({len(avant)} ans)")`,
        "print(f'moyenne depuis 1899   : {apres.mean():.1f} ({len(apres)} ans)')",
        "print(f'baisse : {avant.mean() - apres.mean():.1f}, soit {100 * (1 - apres.mean() / avant.mean()):.1f} %')",
        "for nom, s in (('avant', avant), ('après', apres)):",
        `    print(f"KPSS {nom} : p = {kpss(s, regression='c')[1]:.2f}")`,
        "",
        "fig, ax = plt.subplots(figsize=(9, 3.5))",
        "ax.plot(nil.index, nil, linewidth=1, label='débit annuel')",
        "ax.hlines(avant.mean(), avant.index[0], avant.index[-1], color='tab:red', label='moyenne avant 1899')",
        "ax.hlines(apres.mean(), apres.index[0], apres.index[-1], color='tab:green', label='moyenne depuis 1899')",
        "ax.set_ylabel('débit (10^8 m³)')",
        "ax.legend()",
        "plt.tight_layout()",
        "plt.show()",
      ),
      caption: "Sur toute la série, l'ADF rejette la racine unitaire (p = 0,0012) et le KPSS rejette la stationnarité (p = 0,01, valeur plancher de la table) : les deux tests se contredisent. Le graphique montre ce que les tests ne disent pas : le niveau passe d'une moyenne de 1 097,8 jusqu'en 1898 (28 ans) à 850,0 depuis 1899 (72 ans), soit une baisse de 247,8 ou 22,6 %. Pris séparément, chaque morceau passe le KPSS (p de 0,10 ou plus, valeur plafond de la table).",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Mesurez la rupture vous-même : rangez dans `moy_avant` le débit moyen du Nil **jusqu'en 1898 inclus**, dans `moy_apres` le débit moyen **depuis 1899**, et dans `ecart` leur différence (avant moins après).",
      setup: NIL,
      starter: lines("moy_avant = None", "moy_apres = None", "ecart = None"),
      solution: lines(
        "moy_avant = nil[:'1898'].mean()",
        "moy_apres = nil['1899':].mean()",
        "ecart = moy_avant - moy_apres",
        "print(round(moy_avant, 1), round(moy_apres, 1), round(ecart, 1))",
      ),
      test: lines(
        `assert moy_avant is not None and moy_apres is not None and ecart is not None, "rangez les deux moyennes et leur écart dans moy_avant, moy_apres et ecart"`,
        "avant, apres = nil[:'1898'], nil['1899':]",
        `assert abs(moy_avant - avant.mean()) < 1e-6, f"moy_avant est la moyenne des {len(avant)} années de 1871 à 1898 inclus (vous avez {moy_avant:.1f})"`,
        `assert abs(moy_apres - apres.mean()) < 1e-6, f"moy_apres est la moyenne des {len(apres)} années de 1899 à 1970 (vous avez {moy_apres:.1f})"`,
        `assert abs(ecart - (avant.mean() - apres.mean())) < 1e-6, "ecart = moy_avant - moy_apres"`,
      ),
      hint: "Avec un index de dates, nil[:'1898'] garde jusqu'à 1898 inclus et nil['1899':] garde à partir de 1899.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "**Un test ne remplace pas le graphique.** Sur le Nil, l'ADF conclut à une série plutôt stationnaire alors qu'une rupture de niveau de plus de 20 % la traverse. Une rupture, un changement de méthode de mesure, un événement exceptionnel : aucun test automatique ne s'en soucie à votre place. Tracez toujours la série, regardez ses moyennes par période, et gardez les tests pour confirmer ou nuancer ce que vous voyez.",
    },
    {
      kind: "text",
      md: `### Ce qu'il faut retenir pour la suite

- Un corrélogramme se lit par motifs (cycles, décroissance lente, multiples de la saison), jamais barre par barre.
- Une tendance se retire par une différence d'ordre 1, une saison annuelle par une différence de 12 mois sur des données mensuelles.
- Les tests ADF et KPSS aident, mais ils ne voient pas une rupture : le graphique d'abord.

Le module suivant utilise tout cela pour construire des modèles ARIMA : l'ordre de différenciation d vient de ce module, les ordres p et q de la lecture de l'acf et de la pacf, puis d'une comparaison honnête.`,
    },
  ],
  quiz: [
    {
      question: "Que mesure l'autocorrélation de retard 12 d'une série mensuelle ?",
      options: [
        "La corrélation entre chaque mois et le même mois de l'année précédente",
        "La corrélation entre deux séries différentes",
        "La moyenne des douze derniers mois",
        "La part de variance expliquée par la tendance",
      ],
      correct: 0,
      explanation: "Le retard k compare la série à elle-même décalée de k pas. Sur des mois, un décalage de 12 pas ramène au même mois, un an plus tôt : un pic à ce retard signale une saison annuelle.",
    },
    {
      question: "Sur le corrélogramme des taches solaires, les pics positifs reviennent autour des retards 10 et 11. Que faut-il en conclure ?",
      options: [
        "La série est un bruit blanc",
        "La série a une tendance linéaire",
        "La série présente un cycle d'environ 10 à 11 ans",
        "Les données contiennent des erreurs de saisie",
      ],
      correct: 2,
      explanation: "Des pics qui reviennent à intervalles réguliers signalent un cycle. Ici l'acf est maximale au retard 10 (0,66), à peine devant le retard 11 (0,65) : la période est d'environ 10 à 11 ans.",
    },
    {
      question: "Sur du bruit blanc, environ combien de retards sur 40 dépassent par hasard le seuil à 95 % ?",
      options: [
        "Aucun, jamais",
        "Environ 2",
        "Environ 20",
        "Tous les retards pairs",
      ],
      correct: 1,
      explanation: "Un seuil à 95 % est dépassé par hasard dans environ 5 % des cas, soit 2 retards sur 40. Un dépassement isolé et faible n'est donc pas une preuve d'autocorrélation.",
    },
    {
      question: "Une série mensuelle a une tendance et une saison annuelle. Quelles transformations la rendent le plus souvent stationnaire ?",
      options: [
        "Une différence d'ordre 1 puis une différence de 12 mois",
        "Trier les valeurs par ordre croissant",
        "Supprimer les mois d'hiver",
        "Prendre la moyenne de toute la série",
      ],
      correct: 0,
      explanation: "La différence d'ordre 1 retire la tendance, la différence de 12 mois retire la saison. Sur le CO2, les deux ensemble donnent une série qui oscille autour de zéro (p de l'ADF inférieur à 0,0001).",
    },
    {
      question: "Sur le Nil, l'ADF donne p = 0,0012 et le KPSS p = 0,01. Que faut-il en conclure ?",
      options: [
        "Les deux tests confirment que la série est stationnaire",
        "Les tests se contredisent, et le graphique révèle une chute de niveau vers 1898 que ni l'un ni l'autre ne signale clairement",
        "Le KPSS est faux parce que sa p-value est plafonnée",
        "Il faut toujours faire confiance à l'ADF",
      ],
      correct: 1,
      explanation: "L'ADF rejette la racine unitaire, le KPSS rejette la stationnarité : leurs hypothèses de départ sont opposées et ils se contredisent. La rupture de niveau (1 097,8 avant 1899, 850,0 après) se voit sur le graphique, pas dans une p-value.",
    },
  ],
};
