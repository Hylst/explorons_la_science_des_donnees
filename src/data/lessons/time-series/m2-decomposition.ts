import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { CO2, ELNINO } from "./data";

/** Les trois étapes de la méthode classique à la main (la tendance est la première) */
const TENDANCE = lines(
  "# 1. tendance : moyenne mobile centrée sur 12 mois (13 points, les deux extrêmes comptent pour moitié)",
  "poids = np.r_[0.5, np.ones(11), 0.5] / 12",
  "tendance = co2.rolling(13, center=True).apply(lambda v: np.dot(v, poids), raw=True)",
);

export const moduleDecomposition: LessonModule = {
  id: "decomposition",
  title: "Décomposer une série",
  duration: "2 h",
  summary: "Séparer une série en tendance, saison et reste : à la main avec une moyenne mobile centrée, puis avec seasonal_decompose et STL, sur le CO2 et sur El Niño.",
  objectives: [
    "Décrire une série comme tendance + saison + reste, ou tendance × saison × reste",
    "Calculer à la main une décomposition par moyenne mobile centrée sur 12 mois",
    "Utiliser seasonal_decompose et STL de statsmodels et lire leurs trois composantes",
    "Lire l'amplitude de la saison et repérer dans le reste les épisodes irréguliers",
  ],
  sections: [
    {
      kind: "text",
      md: `### Trois composantes

Une série mensuelle comme le CO2 mêle plusieurs mouvements de natures différentes. On les sépare en trois composantes :

- la **tendance** : le mouvement lent, sur plusieurs années (ici, la montée du CO2) ;
- la **saison** : un motif qui se répète à intervalle fixe, ici tous les 12 mois ;
- le **reste** (ou résidu) : ce qui n'est expliqué ni par l'une ni par l'autre, le bruit et les épisodes irréguliers.

Deux façons de les assembler. Le modèle **additif** convient quand l'amplitude de la saison reste à peu près la même quel que soit le niveau de la série. Le modèle **multiplicatif** convient quand la saison grandit avec le niveau (les ventes d'une entreprise en croissance, par exemple). Prendre le logarithme de la série transforme un produit en somme : le multiplicatif devient additif.`,
    },
    {
      kind: "equation",
      latex: String.raw`y_t = T_t + S_t + R_t \qquad\qquad y_t = T_t \times S_t \times R_t`,
      caption: "Modèle additif (à gauche) et multiplicatif (à droite) : y est la série, T la tendance, S la saison, R le reste, à la date t.",
    },
    {
      kind: "text",
      md: `### La méthode classique, à la main

Elle tient en trois temps, et chacun se calcule avec pandas :

1. **La tendance** est une moyenne mobile **centrée** sur un cycle complet. En moyennant 12 mois, chaque mois de l'année entre une fois dans la moyenne : la saison s'annule. Une largeur paire n'a pas de centre : on prend 13 points et on compte les deux extrêmes pour moitié. Il manque donc 6 mois à chaque bout de la série.
2. **La saison** : on retire la tendance de la série, puis on fait la moyenne de l'écart pour chaque mois de l'année (tous les janviers ensemble, tous les février...). On recentre ce profil de 12 valeurs pour que sa moyenne soit nulle : la saison ne doit pas déplacer le niveau.
3. **Le reste** : ce qui subsiste, série moins tendance moins saison.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        CO2,
        "",
        TENDANCE,
        "",
        "# 2. saison : l'écart moyen de chaque mois à la tendance, recentré autour de zéro",
        "ecart = co2 - tendance",
        "profil = ecart.groupby(ecart.index.month).mean()",
        "profil = profil - profil.mean()",
        "saison = pd.Series(profil.loc[co2.index.month].to_numpy(), index=co2.index)",
        "",
        "# 3. reste : ce qui n'est expliqué ni par la tendance ni par la saison",
        "reste = co2 - tendance - saison",
        "",
        "print('mois sans tendance :', tendance.isna().sum())",
        "print(profil.round(2).to_string())",
        "print('pic en mois', profil.idxmax(), '; creux en mois', profil.idxmin())",
        "print(f'amplitude saisonnière : {profil.max() - profil.min():.2f} ppm')",
        "print(f'écart-type du reste : {reste.std():.2f} ppm')",
        "",
        "from statsmodels.tsa.seasonal import seasonal_decompose",
        "res = seasonal_decompose(co2, model='additive', period=12)",
        "ecart_max = max((res.trend - tendance).abs().max(), (res.seasonal - saison).abs().max(), (res.resid - reste).abs().max())",
        `print("identique à seasonal_decompose (à l'arrondi près) :", ecart_max < 1e-9)`,
      ),
      caption: "Le CO2 est au plus haut en mai (2,92 ppm au-dessus de la tendance) et au plus bas en octobre (3,14 ppm en dessous) : une amplitude de 6,07 ppm. Le reste est petit (écart-type 0,28 ppm). La fonction seasonal_decompose de statsmodels fait exactement ce calcul : le dernier test affiche True.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "La tendance (moyenne mobile centrée) est déjà calculée dans `tendance`. Calculez `ecart`, la série moins la tendance, puis `profil` : l'écart moyen de **chaque mois de l'année** (12 valeurs, indexées de 1 à 12), **recentré** pour que sa moyenne soit nulle. Rangez dans `mois_pic` le numéro du mois où le profil est le plus haut.",
      setup: lines(CO2, "", TENDANCE),
      starter: lines("ecart = co2 - tendance", "profil = None", "mois_pic = None"),
      solution: lines(
        "ecart = co2 - tendance",
        "profil = ecart.groupby(ecart.index.month).mean()",
        "profil = profil - profil.mean()",
        "mois_pic = int(profil.idxmax())",
        "print(profil.round(2).to_string())",
        "print('mois du pic :', mois_pic)",
      ),
      test: lines(
        "assert profil is not None, \"calculez profil : ecart.groupby(ecart.index.month).mean()\"",
        "assert list(profil.index) == list(range(1, 13)), f\"profil doit avoir 12 valeurs indexées de 1 à 12 (vous avez {list(profil.index)})\"",
        "assert abs(profil.mean()) < 1e-9, \"profil doit être recentré : soustrayez sa moyenne pour qu'elle soit nulle\"",
        "_e = co2 - tendance",
        "_p = _e.groupby(_e.index.month).mean()",
        "_p = _p - _p.mean()",
        "assert np.allclose(profil.to_numpy(), _p.to_numpy()), \"profil doit être l'écart moyen à la tendance de chaque mois, puis recentré\"",
        "assert mois_pic == int(_p.idxmax()), f\"mois_pic est le numéro du mois où profil est maximal (vous avez {mois_pic})\"",
      ),
      hint: "ecart.groupby(ecart.index.month).mean() donne 12 valeurs ; retirez leur moyenne ; idxmax() donne le numéro du mois.",
    },
    {
      kind: "text",
      md: `### Avec statsmodels : seasonal_decompose

\`seasonal_decompose(serie, model='additive', period=12)\` fait le calcul précédent et rend un objet à quatre attributs : \`observed\`, \`trend\`, \`seasonal\` et \`resid\`, tous des séries pandas. \`model='multiplicative'\` donne les facteurs saisonniers sous forme de coefficients proches de 1. \`res.plot()\` trace les quatre panneaux d'un coup.

L'argument \`period\` est le nombre de pas d'un cycle : 12 pour des mois avec un cycle annuel, 7 pour des jours avec un cycle hebdomadaire, 4 pour des trimestres. Une mauvaise période donne une décomposition sans sens, sans message d'erreur.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        CO2,
        "import matplotlib.pyplot as plt",
        "from statsmodels.tsa.seasonal import seasonal_decompose",
        "",
        "res = seasonal_decompose(co2, model='additive', period=12)",
        "print('tendance : mois sans valeur :', res.trend.isna().sum())",
        "print(f'reste : écart-type {res.resid.std():.2f} ppm, plus grand écart {res.resid.max():.2f} ppm en {res.resid.idxmax():%Y-%m}')",
        "",
        "mult = seasonal_decompose(co2, model='multiplicative', period=12)",
        "print(f'facteur saisonnier multiplicatif : de {mult.seasonal.min():.3f} à {mult.seasonal.max():.3f}')",
        "reste_mult = co2 - mult.trend * mult.seasonal   # reste du modèle multiplicatif, ramené en ppm",
        "print(f'écart-type du reste : additif {res.resid.std():.3f}, multiplicatif {reste_mult.std():.3f}')",
        "",
        "res.plot()",
        "plt.tight_layout()",
      ),
      caption: "Quatre panneaux : la série, la tendance (régulière, sans la saison), la saison (12 valeurs qui se répètent) et le reste (petit, sans structure visible). Les deux modèles se valent ici : le facteur saisonnier multiplicatif varie de 0,991 à 1,009, et son reste est même un peu plus petit (0,258 ppm contre 0,283) alors que l'amplitude de la saison semblait constante. En fait l'amplitude varie un peu au fil des années (voir STL plus bas). Le plus grand écart du modèle additif (1,11 ppm) tombe en octobre 1958, l'un des cinq mois que l'interpolation avait comblés sans tenir compte de la saison.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Décomposez `co2` avec `seasonal_decompose` (modèle **additif**, période de **12** mois) et rangez le résultat dans `res`. Rangez dans `amplitude` l'écart entre le plus haut et le plus bas de la composante saisonnière, et dans `mois_perdus` le nombre de mois pour lesquels la tendance n'est pas définie.",
      setup: CO2,
      starter: lines("res = None", "amplitude = None", "mois_perdus = None"),
      solution: lines(
        "from statsmodels.tsa.seasonal import seasonal_decompose",
        "",
        "res = seasonal_decompose(co2, model='additive', period=12)",
        "amplitude = res.seasonal.max() - res.seasonal.min()",
        "mois_perdus = int(res.trend.isna().sum())",
        "print(f'amplitude {amplitude:.2f} ppm ; tendance non définie pour {mois_perdus} mois')",
      ),
      test: lines(
        "from statsmodels.tsa.seasonal import seasonal_decompose as _sd",
        "assert res is not None, \"rangez le résultat de seasonal_decompose(...) dans res\"",
        "_r = _sd(co2, model='additive', period=12)",
        "assert np.allclose(res.seasonal.to_numpy(), _r.seasonal.to_numpy()), \"res doit venir de seasonal_decompose(co2, model='additive', period=12)\"",
        "assert amplitude is not None and abs(amplitude - (_r.seasonal.max() - _r.seasonal.min())) < 1e-9, \"amplitude = res.seasonal.max() - res.seasonal.min()\"",
        "assert mois_perdus == int(_r.trend.isna().sum()), f\"mois_perdus compte les valeurs vides de res.trend (vous avez {mois_perdus})\"",
      ),
      hint: "seasonal_decompose(co2, model='additive', period=12) ; res.seasonal est une série ; res.trend.isna().sum() compte les mois sans tendance.",
    },
    {
      kind: "note",
      tone: "tip",
      md: "Une bonne décomposition laisse un **reste sans structure** : il doit ressembler à du bruit autour de zéro. S'il garde des vagues, une saison qui change ou un saut brutal, la décomposition a manqué quelque chose. Regardez toujours le graphique du reste, pas seulement son écart-type.",
    },
    {
      kind: "text",
      md: `### STL : une saison qui peut évoluer

La méthode classique impose la **même** saison chaque année, perd 6 mois à chaque extrémité et réagit mal aux valeurs aberrantes. **STL** (Seasonal-Trend decomposition using Loess, Cleveland et ses collègues, 1990) lisse la tendance et la saison par des régressions locales (loess) : la saison peut changer lentement d'une année à l'autre, aucune valeur n'est perdue aux extrémités, et l'option \`robust=True\` réduit l'influence des points aberrants.

\`STL(serie, period=12).fit()\` renvoie le même type d'objet, avec \`trend\`, \`seasonal\` et \`resid\`. Les trois composantes se somment exactement à la série.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        CO2,
        "import matplotlib.pyplot as plt",
        "from statsmodels.tsa.seasonal import seasonal_decompose, STL",
        "",
        "classique = seasonal_decompose(co2, model='additive', period=12)",
        "stl = STL(co2, period=12).fit()",
        "",
        "amplitude = stl.seasonal.groupby(stl.seasonal.index.year).agg(lambda v: v.max() - v.min())",
        "amp_classique = classique.seasonal.max() - classique.seasonal.min()",
        "print('amplitude saisonnière STL (ppm) :')",
        "print(amplitude.loc[[1960, 1980, 2000]].round(2).to_string())",
        "print(f'amplitude classique, la même chaque année : {amp_classique:.2f} ppm')",
        "print(f'reste : écart-type {stl.resid.std():.2f} (STL) contre {classique.resid.std():.2f} (classique)')",
        "print('mois sans tendance : STL', stl.trend.isna().sum(), '; classique', classique.trend.isna().sum())",
        "hausse = (stl.trend.loc['2000-01-01'] - stl.trend.loc['1990-01-01']) / 10",
        "print(f'hausse de la tendance STL entre 1990 et 2000 : {hausse:.2f} ppm par an')",
        "print('somme exacte :', bool((stl.trend + stl.seasonal + stl.resid - co2).abs().max() < 1e-9))",
        "",
        "fig, ax = plt.subplots(figsize=(9, 3.5))",
        "ax.plot(amplitude.loc[1959:2000], label='STL')",
        "ax.axhline(amp_classique, linestyle='--', color='grey', label='méthode classique')",
        "ax.set_ylabel('amplitude saisonnière (ppm)')",
        "ax.legend()",
        "plt.tight_layout()",
      ),
      caption: "STL laisse la saison évoluer : son amplitude passe de 5,49 ppm en 1960 à 6,16 ppm en 1980, puis reste à 6,15 ppm en 2000, là où la méthode classique impose 6,07 ppm chaque année. Son reste est plus petit (écart-type 0,19 ppm contre 0,28), en partie parce que la méthode est plus souple, et elle ne perd aucun mois aux extrémités. La tendance STL monte de 1,52 ppm par an entre 1990 et 2000, en accord avec la hausse annuelle moyenne de 1,54 ppm des années 1990 vue au module 1.",
    },
    {
      kind: "text",
      md: `### El Niño : une saison forte et des épisodes irréguliers

La série \`elnino\` est la température de surface de la mer de la région dite Niño 1+2 (Pacifique est, au large de l'Équateur et du Pérou), mesurée chaque mois de 1950 à 2010 par la NOAA, l'agence américaine d'observation de l'océan et de l'atmosphère. Elle mêle une saison très marquée à des réchauffements irréguliers, les épisodes **El Niño**. La décomposition les range dans deux composantes différentes : la saison, régulière, et le **reste**, où se logent les épisodes.

Le reste mesure l'écart à la saison, pas la chaleur absolue : un mois très chaud pendant la saison chaude n'est pas forcément très inhabituel.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        ELNINO,
        "import matplotlib.pyplot as plt",
        "from statsmodels.tsa.seasonal import seasonal_decompose",
        "",
        "res = seasonal_decompose(elnino, model='additive', period=12)",
        "annee = res.seasonal.iloc[:12]   # une année de saison",
        "print(f'amplitude saisonnière : {res.seasonal.max() - res.seasonal.min():.2f} °C')",
        "print('pic saisonnier : mois', annee.idxmax().month, '; creux : mois', annee.idxmin().month)",
        "print(f'écart-type du reste : {res.resid.std():.2f} °C')",
        "print(f'mois le plus chaud : {elnino.idxmax():%Y-%m}, {elnino.max():.2f} °C')",
        "print(f'plus grand reste : {res.resid.idxmax():%Y-%m}, {res.resid.max():.2f} °C')",
        "",
        "fig, (haut, bas) = plt.subplots(2, 1, figsize=(9, 5), sharex=True)",
        "haut.plot(elnino.index, elnino, linewidth=0.8)",
        "haut.set_ylabel('température (°C)')",
        "bas.plot(res.resid.index, res.resid, linewidth=0.8)",
        "bas.axhline(0, color='grey', linewidth=0.5)",
        "bas.set_ylabel('reste (°C)')",
        "plt.tight_layout()",
      ),
      caption: "La saison domine : 5,65 °C d'amplitude, avec un maximum en mars et un minimum en septembre. Ce qui reste, les épisodes irréguliers, a un écart-type de 0,50 °C. Le mois le plus chaud de la série (mars 1998, 29,24 °C) n'est pas la plus grande anomalie : mars est déjà le mois le plus chaud de l'année. C'est juin 1983 qui s'écarte le plus de la saison (1,87 °C au-dessus), pendant l'épisode El Niño de 1982-1983, l'un des plus intenses connus.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Décomposez `elnino` avec `seasonal_decompose` (modèle additif, période 12). Rangez dans `mois_anomalie` la **date** (un `Timestamp`) où le **reste** est le plus grand, et dans `anomalie` sa valeur en °C.",
      setup: ELNINO,
      starter: lines("mois_anomalie = None", "anomalie = None"),
      solution: lines(
        "from statsmodels.tsa.seasonal import seasonal_decompose",
        "",
        "res = seasonal_decompose(elnino, model='additive', period=12)",
        "mois_anomalie = res.resid.idxmax()",
        "anomalie = res.resid.max()",
        "print(f'{mois_anomalie:%Y-%m} : {anomalie:.2f} °C au-dessus de la saison')",
      ),
      test: lines(
        "from statsmodels.tsa.seasonal import seasonal_decompose as _sd",
        "assert mois_anomalie is not None, \"rangez dans mois_anomalie la date où le reste est maximal : res.resid.idxmax()\"",
        "_r = _sd(elnino, model='additive', period=12)",
        "assert mois_anomalie == _r.resid.idxmax(), f\"ce n'est pas le mois où le reste est maximal (vous avez {mois_anomalie:%Y-%m})\"",
        "assert anomalie is not None and abs(anomalie - _r.resid.max()) < 1e-9, f\"anomalie est la valeur du reste à cette date, environ {_r.resid.max():.2f} °C\"",
      ),
      hint: "res.resid est une série indexée par les dates : idxmax() donne la date du maximum, max() sa valeur.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Décomposer **décrit** le passé, cela ne prévoit rien. La tendance d'une moyenne mobile centrée n'existe pas aux deux bouts de la série, justement là où l'on voudrait prévoir. Et une « tendance » n'est qu'un mouvement lent observé : rien ne garantit qu'il se prolonge. Le module suivant évalue de vraies prévisions.",
    },
  ],
  quiz: [
    {
      question: "Dans le modèle additif y = T + S + R, que représente R ?",
      options: [
        "La saison",
        "La tendance à long terme",
        "Ce qui n'est expliqué ni par la tendance ni par la saison : bruit et épisodes irréguliers",
        "La moyenne de la série",
      ],
      correct: 2,
      explanation: "R est le reste, ou résidu : la partie de la série qui subsiste une fois la tendance et la saison retirées. Un bon reste ressemble à du bruit autour de zéro.",
    },
    {
      question: "Quand préférer un modèle multiplicatif à un modèle additif ?",
      options: [
        "Quand la série contient des valeurs manquantes",
        "Quand la série est mesurée en pourcentages",
        "Quand la période est de 12",
        "Quand l'amplitude de la saison grandit avec le niveau de la série",
      ],
      correct: 3,
      explanation: "Si la saison est proportionnelle au niveau, un produit la décrit mieux qu'une somme. Si l'amplitude reste constante, l'additif suffit. Sur le CO2, les deux se valent presque.",
    },
    {
      question: "Pourquoi la moyenne mobile qui sert de tendance a-t-elle une largeur de 12 pour une série mensuelle ?",
      options: [
        "Parce que pandas n'accepte pas d'autre largeur",
        "Parce qu'une moyenne sur un cycle complet contient chaque mois une fois : la saison s'annule",
        "Parce qu'il y a 12 composantes à estimer",
        "Parce que cela supprime les valeurs aberrantes",
      ],
      correct: 1,
      explanation: "En moyennant exactement un cycle, les hauts et les bas de la saison se compensent : ce qui reste est la tendance. Une autre largeur laisserait une partie de la saison dans la tendance.",
    },
    {
      question: "Qu'apporte STL par rapport à la décomposition classique sur le CO2 ?",
      options: [
        "Il prévoit les mois à venir",
        "Il impose la même saison chaque année, ce qui est plus rigoureux",
        "Une saison qui peut évoluer lentement et aucune valeur perdue aux extrémités",
        "Il n'a pas besoin de connaître la période",
      ],
      correct: 2,
      explanation: "STL lisse par régressions locales : l'amplitude saisonnière peut passer de 5,49 ppm (1960) à 6,16 ppm (1980), et la tendance existe jusqu'aux extrémités. Il demande quand même la période.",
    },
    {
      question: "Dans la série El Niño, le mois le plus chaud (mars 1998) n'est pas celui du plus grand reste (juin 1983). Pourquoi ?",
      options: [
        "Parce que le reste mesure l'écart à la saison, et que mars est déjà le mois le plus chaud de l'année",
        "Parce que les données de 1998 sont fausses",
        "Parce que seasonal_decompose ignore les années récentes",
        "Parce que le reste est toujours maximal au début d'une série",
      ],
      correct: 0,
      explanation: "Le reste retire la saison : en mars, la saison apporte déjà environ 3 °C au-dessus de la moyenne. Juin 1983 s'écarte davantage de ce qui est attendu pour un mois de juin (1,87 °C).",
    },
  ],
};
