import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { CO2 } from "./data";

/** Relevés hebdomadaires bruts (avec leurs trous), sans la moyenne mensuelle : pour l'exercice sur le rééchantillonnage */
const HEBDO = lines(
  "import numpy as np",
  "import pandas as pd",
  "import statsmodels.api as sm",
  "",
  "co2_hebdo = sm.datasets.co2.load_pandas().data['co2']",
);

export const moduleDonneesDatees: LessonModule = {
  id: "donnees-datees",
  title: "Données datées avec pandas",
  duration: "2 h",
  summary: "Ranger des relevés sur un index de dates, les sélectionner et les rééchantillonner, combler leurs trous, puis en tirer les premiers indicateurs (décalage, différence, moyenne mobile).",
  objectives: [
    "Reconnaître une série temporelle et la ranger sur un index de dates avec une fréquence",
    "Sélectionner une période par dates et rééchantillonner avec resample",
    "Repérer les valeurs manquantes et les combler avec interpolate, en sachant ce que cela suppose",
    "Calculer un décalage, une différence, une variation relative et une moyenne mobile (shift, diff, pct_change, rolling)",
  ],
  sections: [
    {
      kind: "text",
      md: `### Une série temporelle, c'est quoi ?

Une **série temporelle** est une suite de mesures d'une même grandeur, prises à des dates successives. Ce qui la distingue d'un tableau ordinaire : l'**ordre compte**. Deux mesures voisines se ressemblent souvent, la mesure d'aujourd'hui dépend de celle d'hier, et on ne peut ni mélanger les lignes ni les tirer au hasard sans perdre l'information qu'on cherche.

Ce cours travaille sur quatre séries **réelles**, fournies avec la bibliothèque statsmodels (rien n'est téléchargé) : la concentration de CO2 dans l'air à Mauna Loa (Hawaï), le débit annuel du Nil, le nombre annuel de taches solaires et la température de la mer dans une région du Pacifique est (le phénomène El Niño). Ce module et le suivant utilisent le CO2 : des prélèvements d'air du réseau de l'institut Scripps à Mauna Loa, dont les relevés commencent en 1958 (Keeling et Whorf). Les mesures sont en **ppm** (parties par million).`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import pandas as pd",
        "import statsmodels.api as sm",
        "import matplotlib.pyplot as plt",
        "",
        "co2_hebdo = sm.datasets.co2.load_pandas().data['co2']",
        "print(co2_hebdo.head(4))",
        `print("type de l'index :", type(co2_hebdo.index).__name__)`,
        "print('fréquence :', co2_hebdo.index.freq)",
        "print('de', co2_hebdo.index[0].date(), 'à', co2_hebdo.index[-1].date())",
        "print('relevés :', len(co2_hebdo), ' dont manquants :', co2_hebdo.isna().sum())",
        "",
        "fig, ax = plt.subplots(figsize=(9, 3.5))",
        "ax.plot(co2_hebdo.index, co2_hebdo, linewidth=0.8)",
        "ax.set_ylabel('CO2 (ppm)')",
        "ax.set_title('CO2 à Mauna Loa, un relevé par semaine')",
        "plt.tight_layout()",
      ),
      caption: "2 284 relevés hebdomadaires, tous les samedis, du 29 mars 1958 au 29 décembre 2001, dont 59 manquants (2,6 %). La courbe monte de 316,1 à 371,5 ppm en près de quarante-quatre ans et dessine une oscillation régulière : une saison par an.",
    },
    {
      kind: "text",
      md: `### L'index de dates

Ce qui fait d'une \`Series\` pandas une série temporelle, c'est son **index** : un \`DatetimeIndex\`, c'est-à-dire de vraies dates (et non des textes). Il donne accès à tout le calendrier (\`index.year\`, \`index.month\`, \`index.dayofweek\`) et aux outils de ce module. Il porte aussi une **fréquence** (\`index.freq\`) quand les dates sont régulières : ici \`W-SAT\`, une semaine qui finit un samedi.

- \`pd.to_datetime(textes, format='%d/%m/%Y')\` convertit des textes en dates. Donnez le format : « 05/03/2024 » est le 5 mars en France mais le 3 mai dans la convention américaine.
- \`pd.date_range(début, periods=n, freq=...)\` fabrique un index régulier : \`'D'\` pour des jours, \`'W'\` des semaines, \`'MS'\` des débuts de mois, \`'ME'\` des fins de mois, \`'YS'\` des débuts d'année.
- \`serie.asfreq('D')\` rend un index régulier en insérant une ligne pour chaque date absente (sa valeur est alors \`NaN\`). Les modèles de statsmodels, vus plus loin, réclament un index régulier avec une fréquence.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import pandas as pd",
        "",
        "textes = ['05/03/2024', '06/03/2024', '08/03/2024']   # 5, 6 et 8 mars : le jour vient avant le mois",
        "dates = pd.to_datetime(textes, format='%d/%m/%Y')",
        "mesures = pd.Series([12.0, 13.5, 11.0], index=dates, name='mesure')",
        "print(mesures)",
        "print('fréquence connue :', mesures.index.freq)",
        "",
        "reguliere = mesures.asfreq('D')   # une ligne par jour : le 7 mars, absent, devient NaN",
        "print(reguliere)",
        "print(pd.date_range('2024-01-01', periods=4, freq='MS'))",
        "print(pd.date_range('2024-01-31', periods=4, freq='ME'))",
      ),
      caption: "Trois relevés fictifs pour voir le mécanisme. Sans fréquence (None), l'index n'est pas régulier : après asfreq('D'), le 7 mars apparaît avec une valeur vide. Les débuts de mois (MS) tombent le 1er, les fins de mois (ME) le 31, 29 (2024 est bissextile), 31 et 30.",
    },
    {
      kind: "text",
      md: `### Sélectionner par dates

Avec un index de dates, on découpe avec des textes de dates, **bornes comprises**, sans écrire de comparaison :

\`\`\`python
co2['1990']                # toute l'année 1990
co2['1990':'1999']         # de janvier 1990 à décembre 1999
co2['1999-12':'2000-02']   # trois mois
\`\`\`

Un texte plus court désigne une période entière : \`'1999'\` va du 1er janvier au 31 décembre, \`'1999-12'\` tout décembre. C'est la base du découpage entre passé et futur du module 3.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Dans `co2` (moyennes mensuelles, déjà prêtes), sélectionnez par dates les mois de **1990 à 1999 inclus** et rangez-les dans `decennie`. Rangez leur moyenne dans `moyenne_decennie`.",
      setup: CO2,
      starter: lines("decennie = co2", "moyenne_decennie = None"),
      solution: lines(
        "decennie = co2['1990':'1999']",
        "moyenne_decennie = decennie.mean()",
        "print(len(decennie), 'mois, moyenne', round(moyenne_decennie, 2), 'ppm')",
      ),
      test: lines(
        "assert len(decennie) == 120, f\"il faut 120 mois, de janvier 1990 à décembre 1999 (vous en avez {len(decennie)})\"",
        "assert decennie.index[0] == pd.Timestamp('1990-01-01') and decennie.index[-1] == pd.Timestamp('1999-12-01'), \"la période doit aller de 1990-01 à 1999-12 : co2['1990':'1999']\"",
        "_attendu = co2[(co2.index.year >= 1990) & (co2.index.year <= 1999)].mean()",
        "assert moyenne_decennie is not None and abs(moyenne_decennie - _attendu) < 1e-9, f\"moyenne_decennie doit être la moyenne de ces 120 mois, environ {_attendu:.2f}\"",
      ),
      hint: "co2['1990':'1999'] garde les deux bornes ; .mean() donne la moyenne.",
    },
    {
      kind: "text",
      md: `### Rééchantillonner et combler les trous

\`resample\` regroupe une série par période, comme un \`groupby\` sur le calendrier : \`co2_hebdo.resample('MS').mean()\` donne une moyenne par mois, étiquetée au **premier jour du mois**. Les semaines manquantes (\`NaN\`) sont simplement ignorées par la moyenne : un mois n'est vide que si **aucune** de ses semaines n'a de valeur.

Il reste alors à décider quoi faire des mois vides. \`interpolate()\` relie par une droite la valeur d'avant et celle d'après. C'est une hypothèse, pas une mesure : elle convient pour un trou isolé, beaucoup moins pour un long trou en pleine saison.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import pandas as pd",
        "import statsmodels.api as sm",
        "",
        "co2_hebdo = sm.datasets.co2.load_pandas().data['co2']",
        "brut = co2_hebdo.resample('MS').mean()       # moyenne des semaines de chaque mois",
        "print('mois :', len(brut), ' mois sans aucune valeur :', brut.isna().sum())",
        "print(brut[brut.isna()].index.strftime('%Y-%m').tolist())",
        "",
        "complet = brut.interpolate()                 # droite entre la valeur d'avant et celle d'après",
        "print(brut['1964-01':'1964-05'])",
        "print(complet['1964-01':'1964-05'])",
        "",
        "annuel = complet.resample('YS').mean()",
        "print('moyenne 1959 :', round(annuel.loc['1959-01-01'], 2), 'ppm ; moyenne 2001 :', round(annuel.loc['2001-01-01'], 2), 'ppm')",
      ),
      caption: "526 mois, dont 5 sans aucune valeur : juin et octobre 1958, puis février, mars et avril 1964. L'interpolation comble les trois mois de 1964 par une droite entre 319,4 ppm (janvier) et 322,0 ppm (mai). Pour 1958, seuls dix mois sont couverts : on compare plutôt 1959 (316,00 ppm en moyenne) et 2001 (370,85 ppm).",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "À partir de `co2_hebdo` (relevés hebdomadaires bruts), calculez `brut` : la moyenne **mensuelle** étiquetée au premier jour du mois. Rangez dans `mois_vides` le nombre de mois sans aucune valeur, et dans `complet` la série `brut` dont les trous sont comblés par **interpolation**.",
      setup: HEBDO,
      starter: lines("brut = None", "mois_vides = None", "complet = None"),
      solution: lines(
        "brut = co2_hebdo.resample('MS').mean()",
        "mois_vides = int(brut.isna().sum())",
        "complet = brut.interpolate()",
        "print(len(brut), 'mois dont', mois_vides, 'vides ; après interpolation :', complet.isna().sum(), 'vide')",
      ),
      test: lines(
        "assert brut is not None, \"calculez brut avec co2_hebdo.resample('MS').mean()\"",
        "assert len(brut) == 526 and brut.index[0] == pd.Timestamp('1958-03-01'), f\"brut doit avoir une valeur par mois, de 1958-03 à 2001-12, soit 526 mois (vous en avez {len(brut)})\"",
        "_par_mois = co2_hebdo.groupby([co2_hebdo.index.year, co2_hebdo.index.month]).mean()",
        "assert np.allclose(brut.to_numpy(), _par_mois.to_numpy(), equal_nan=True), \"brut doit être la moyenne des relevés de chaque mois\"",
        "assert mois_vides == int(_par_mois.isna().sum()), f\"mois_vides compte les mois dont la moyenne est NaN (vous avez {mois_vides})\"",
        "assert complet is not None and complet.isna().sum() == 0, \"complet ne doit plus avoir de valeur vide : brut.interpolate()\"",
        "assert np.allclose(complet.to_numpy(), _par_mois.interpolate().to_numpy()), \"complet doit être brut.interpolate()\"",
      ),
      hint: "resample('MS').mean(), puis isna().sum() pour compter les mois vides, puis interpolate().",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Le moteur du site utilise **pandas 3**, qui a supprimé les anciens alias de fréquence `'M'`, `'Y'`, `'Q'` et `'H'`. `resample` avec `'M'` s'arrête sur l'erreur `'M' is no longer supported for offsets. Please use 'ME' instead.` Utilisez `'MS'` ou `'ME'` pour les mois, `'YS'` ou `'YE'` pour les années, `'QS'` ou `'QE'` pour les trimestres (S pour le début de période, E pour la fin). On trouve encore les anciens alias dans beaucoup de tutoriels.",
    },
    {
      kind: "text",
      md: `### Décaler, différencier, lisser

Quatre opérations reviennent partout en séries temporelles :

- \`serie.shift(k)\` **décale** la série de k pas : chaque date reçoit la valeur d'il y a k pas. Elle laisse k valeurs vides au début.
- \`serie.diff(k)\` calcule \`serie - serie.shift(k)\` : la **différence** avec la valeur d'il y a k pas. Sur des mois, \`diff(12)\` compare chaque mois au même mois un an plus tôt, ce qui élimine l'effet de la saison.
- \`serie.pct_change(k)\` donne la même variation **relative** (en fraction, à multiplier par 100 pour des pour cent).
- \`serie.rolling(n).mean()\` est la **moyenne mobile** : la moyenne des n dernières valeurs. Elle lisse le bruit et les oscillations plus courtes que la fenêtre. Les n - 1 premières valeurs sont vides, faute de n valeurs.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        CO2,
        "import matplotlib.pyplot as plt",
        "",
        "decale = co2.shift(12)                   # le même mois, un an plus tôt",
        "hausse = co2.diff(12)                    # co2 - co2.shift(12) : hausse sur un an, en ppm",
        "relative = co2.pct_change(12) * 100      # la même hausse, en pour cent",
        "lisse = co2.rolling(12).mean()           # moyenne des 12 derniers mois",
        "",
        "tableau = pd.DataFrame({'co2': co2, 'décalée': decale, 'hausse': hausse, 'lissée': lisse})",
        "print(tableau.iloc[10:15].round(2))",
        "print('valeurs vides :', hausse.isna().sum(), 'pour diff(12),', lisse.isna().sum(), 'pour rolling(12)')",
        "print('hausse annuelle moyenne :', round(hausse.mean(), 2), 'ppm, soit', round(relative.mean(), 2), '% par an')",
        "h = hausse['1960':'1999']",
        "print(h.groupby(h.index.year // 10 * 10).mean().round(2))",
        "",
        "fig, (haut, bas) = plt.subplots(2, 1, figsize=(9, 5), sharex=True)",
        "haut.plot(co2.index, co2, linewidth=0.8, label='mensuel')",
        "haut.plot(lisse.index, lisse, linewidth=2, label='moyenne mobile sur 12 mois')",
        "haut.set_ylabel('CO2 (ppm)')",
        "haut.legend()",
        "bas.plot(hausse.index, hausse, linewidth=0.8)",
        "bas.set_ylabel('hausse sur 12 mois (ppm)')",
        "plt.tight_layout()",
      ),
      caption: "La moyenne mobile sur 12 mois efface la saison et laisse voir la tendance ; la hausse sur 12 mois, elle, compare chaque mois au même mois de l'année précédente. En moyenne, le CO2 monte de 1,29 ppm par an (0,38 % par an). Par décennie, la hausse annuelle moyenne passe de 0,86 ppm dans les années 1960 à 1,23 dans les années 1970, 1,61 dans les années 1980 et 1,54 dans les années 1990 : la montée s'accélère puis se stabilise.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Calculez dans `hausse` la hausse de `co2` par rapport au **même mois un an plus tôt** (en ppm), dans `hausse_moyenne` sa moyenne, et dans `lisse` la **moyenne mobile sur 12 mois** de `co2` (chaque valeur regarde les 12 derniers mois).",
      setup: CO2,
      starter: lines("hausse = None", "hausse_moyenne = None", "lisse = None"),
      solution: lines(
        "hausse = co2.diff(12)",
        "hausse_moyenne = hausse.mean()",
        "lisse = co2.rolling(12).mean()",
        "print(round(hausse_moyenne, 2), 'ppm par an ;', lisse.isna().sum(), 'valeurs vides au début de la moyenne mobile')",
      ),
      test: lines(
        "assert hausse is not None, \"calculez hausse avec co2.diff(12)\"",
        "assert hausse.isna().sum() == 12, f\"diff(12) laisse 12 valeurs vides au début (vous en avez {hausse.isna().sum()})\"",
        "_v = co2.to_numpy()",
        "assert np.allclose(hausse.dropna().to_numpy(), _v[12:] - _v[:-12]), \"hausse doit être co2 moins co2 décalé de 12 mois\"",
        "assert hausse_moyenne is not None and abs(hausse_moyenne - (_v[12:] - _v[:-12]).mean()) < 1e-9, \"hausse_moyenne doit être la moyenne de hausse (les valeurs vides sont ignorées)\"",
        "assert lisse is not None and lisse.isna().sum() == 11, \"rolling(12) laisse 11 valeurs vides au début : co2.rolling(12).mean()\"",
        "assert abs(lisse.iloc[-1] - _v[-12:].mean()) < 1e-9, \"la dernière valeur de lisse doit être la moyenne des 12 derniers mois\"",
      ),
      hint: "co2.diff(12) pour la hausse sur un an ; co2.rolling(12).mean() pour la moyenne mobile.",
    },
    {
      kind: "note",
      tone: "info",
      md: "`interpolate()` relie les points comme s'ils étaient régulièrement espacés : sur un index de dates irrégulier, `interpolate(method='time')` tient compte des écarts réels. Attention aussi : la droite utilise la valeur **d'après**, donc une information du futur. Pour analyser une série passée, ce n'est pas gênant ; pour évaluer une prévision (module 3), comblez les trous en n'utilisant que le passé (`ffill()` répète la dernière valeur connue) ou faites-le seulement dans la période d'entraînement.",
    },
  ],
  quiz: [
    {
      question: "Qu'est-ce qui distingue une série temporelle d'un tableau de données ordinaire ?",
      options: [
        "Elle contient forcément des nombres décimaux",
        "L'ordre des lignes compte : les mesures voisines sont liées, on ne peut pas les mélanger",
        "Elle a toujours une saisonnalité",
        "Elle ne peut pas avoir de valeurs manquantes",
      ],
      correct: 1,
      explanation: "Les mesures successives dépendent les unes des autres. Mélanger ou tirer au hasard les lignes détruit cette structure, qui est justement ce qu'on cherche à modéliser.",
    },
    {
      question: "Que renvoie co2_hebdo.resample('MS').mean() ?",
      options: [
        "Une valeur par semaine, inchangée",
        "La somme de toutes les semaines",
        "Une valeur par mois, étiquetée au premier jour du mois, moyenne des semaines de ce mois",
        "Une erreur, car 'MS' n'existe plus dans pandas 3",
      ],
      correct: 2,
      explanation: "resample regroupe par période. 'MS' désigne des mois étiquetés à leur début ('ME' à leur fin). C'est 'M' seul qui a été supprimé de pandas 3.",
    },
    {
      question: "Sur une série mensuelle, que calcule serie.diff(12) ?",
      options: [
        "La différence entre chaque mois et le mois précédent",
        "La moyenne des 12 derniers mois",
        "La différence entre chaque mois et le même mois un an plus tôt",
        "L'écart entre le maximum et le minimum de l'année",
      ],
      correct: 2,
      explanation: "diff(k) soustrait la valeur d'il y a k pas. Avec k = 12 sur des mois, on compare des mois de même rang : la saison s'élimine.",
    },
    {
      question: "Pourquoi co2.rolling(12).mean() commence-t-il par 11 valeurs vides ?",
      options: [
        "Parce que les 11 premiers mois sont toujours aberrants",
        "Parce qu'une moyenne sur 12 valeurs n'existe pas tant que la fenêtre n'a pas 12 valeurs",
        "Parce que pandas retire la saison",
        "Parce que la série a 11 trous",
      ],
      correct: 1,
      explanation: "La fenêtre regarde les 12 dernières valeurs : au premier mois elle n'en a qu'une, au douzième elle en a douze. Les 11 premiers résultats restent vides.",
    },
    {
      question: "Pourquoi se méfier d'interpolate() quand on veut évaluer une prévision ?",
      options: [
        "Parce qu'elle supprime l'index de dates",
        "Parce qu'elle ne fonctionne que sur des entiers",
        "Parce que la droite utilise la valeur d'après, c'est-à-dire une information du futur",
        "Parce qu'elle change la fréquence de la série",
      ],
      correct: 2,
      explanation: "Combler un trou avec une droite entre la valeur d'avant et celle d'après emprunte au futur. Pour juger une prévision, on ne doit disposer que du passé au moment de prévoir.",
    },
  ],
};
