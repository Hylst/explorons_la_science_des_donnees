import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

/**
 * Série de prix SIMULÉE : marche aléatoire géométrique (rendements journaliers gaussiens indépendants), graine fixée.
 * Par construction, rien n'y est prévisible : toute « bonne » stratégie trouvée sur ces données est due au hasard.
 * Paramètres choisis arbitrairement (dérive de 0,02 % par jour, volatilité de 1 % par jour, 1 260 jours ouvrés, soit 5 ans
 * à raison de 252 jours par an), sans lien avec un actif réel.
 * Tous les chiffres cités dans ce projet ont été mesurés le 24 octobre 2026 avec Pyodide 314.0.7 (NumPy, pandas).
 */
const SIMULATION = lines(
  "import numpy as np",
  "import pandas as pd",
  "",
  "def simuler(graine, jours=1260, derive=0.0002, vol=0.01, prix_initial=100.0):",
  "    rng = np.random.default_rng(graine)",
  "    rendements = rng.normal(derive - vol ** 2 / 2, vol, jours)      # marche aléatoire géométrique",
  "    dates = pd.bdate_range('2020-01-01', periods=jours)             # jours ouvrés",
  "    return pd.Series(prix_initial * np.exp(np.cumsum(rendements)), index=dates, name='prix')",
  "",
  "prix = simuler(0)",
);

/** Signal, moteur de backtest et indicateurs */
const MOTEUR = lines(
  "def croisement(prix, court, long):",
  "    # 1 si la moyenne mobile courte dépasse la longue, 0 sinon (et 0 tant que la longue n'est pas calculable)",
  "    mm_courte = prix.rolling(court).mean()",
  "    mm_longue = prix.rolling(long).mean()",
  "    return (mm_courte > mm_longue).astype(float).where(mm_longue.notna(), 0.0)",
  "",
  "def position_biaisee(prix, court, long):",
  "    # ATTENTION : la position du jour utilise le cours de clôture du jour même",
  "    return croisement(prix, court, long)",
  "",
  "def position(prix, court, long):",
  "    # la position du jour t se décide avec les cours jusqu'à la veille : on décale le signal d'un jour",
  "    return croisement(prix, court, long).shift(1).fillna(0.0)",
  "",
  "def rendements_strategie(prix, pos, frais=0.001):",
  "    r = prix.pct_change().fillna(0.0)                       # rendement de chaque jour",
  "    couts = pos.diff().abs().fillna(pos.abs()) * frais      # on paie à chaque changement de position",
  "    return pos * r - couts",
  "",
  "def indicateurs(rend):",
  "    courbe = (1 + rend).cumprod()                           # valeur du portefeuille, 1 au départ",
  "    total = courbe.iloc[-1] - 1",
  "    pic = np.maximum(courbe.cummax(), 1.0)                  # plus haut atteint jusque-là (au moins le départ)",
  "    return {'total': float(total),",
  "            'annuel': float((1 + total) ** (252 / len(rend)) - 1),",
  "            'volatilite': float(rend.std() * np.sqrt(252)),",
  "            'perte_max': float((courbe / pic - 1).min())}",
);

/** Recherche des meilleurs paramètres sur une fenêtre */
const GRILLE = lines(
  "COURTES = [5, 10, 15, 20, 30]",
  "LONGUES = [40, 60, 80, 100, 150, 200]",
  "PAIRES = [(c, l) for c in COURTES for l in LONGUES]",
  "",
  "def rendement_total(prix, court, long, debut, fin, frais=0.001):",
  "    # le signal est calculé sur toute la série (il a besoin de l'historique), le rendement mesuré sur [debut, fin[",
  "    rend = rendements_strategie(prix, position(prix, court, long), frais).iloc[debut:fin]",
  "    return float((1 + rend).prod() - 1)",
  "",
  "def meilleure_paire(prix, debut, fin):",
  "    scores = {(c, l): rendement_total(prix, c, l, debut, fin) for c, l in PAIRES}",
  "    return max(scores, key=scores.get), scores",
);

export const projectBacktest: LessonModule = {
  id: "advanced-3",
  title: "Projet guidé : un backtest honnête sur une série simulée",
  duration: "4 h",
  summary: "Tester une stratégie de croisement de moyennes mobiles sur une série de prix simulée : construire le signal et le moteur de backtest, intégrer les frais, calculer rendement, volatilité et perte maximale, puis mesurer deux pièges classiques, le biais d'anticipation et le surapprentissage des paramètres, sur une série où rien n'est prévisible par construction.",
  objectives: [
    "Simuler une série de prix par une marche aléatoire géométrique et en calculer les rendements",
    "Écrire un signal de croisement de moyennes mobiles et un moteur de backtest qui tient compte des frais de transaction",
    "Calculer et interpréter rendement, volatilité annualisée et perte maximale",
    "Mesurer le biais d'anticipation et le corriger en décalant le signal d'un jour",
    "Mesurer le surapprentissage des paramètres : choisir sur une période, tester sur une autre, répéter sur plusieurs graines",
  ],
  sections: [
    {
      kind: "note",
      tone: "warning",
      md: "Ce projet est un exercice pédagogique sur une série de prix simulée. Il ne constitue pas un conseil en investissement, ne recommande aucun produit ni aucun intermédiaire, et les performances passées ne préjugent pas des résultats futurs. Investir comporte un risque de perte en capital.",
    },
    {
      kind: "text",
      md: `### Le contexte

Un **backtest** rejoue une stratégie sur des données passées pour savoir ce qu'elle aurait fait. C'est un outil utile, et un des plus faciles à mal utiliser : on peut le tordre, sans le vouloir, jusqu'à lui faire dire n'importe quoi. Ce projet n'a pas pour but de trouver une stratégie qui gagne. Il montre comment on se trompe, et comment le mesurer.

**Les données sont simulées.** Le moteur du site n'a pas d'accès réseau et nous ne voulons pas de cours réels sous licence incertaine. Nous fabriquons donc une série par une **marche aléatoire géométrique** : chaque jour, le rendement est tiré au hasard, indépendamment des jours précédents (moyenne de 0,02 % par jour en espérance, écart-type de 1 %, 1 260 jours ouvrés, soit cinq ans à 252 jours par an), avec une graine pour que tout se reproduise. Ces paramètres sont choisis sans lien avec un actif réel.

Cette simulation a une propriété précieuse pour apprendre : **par construction, le passé ne dit rien du futur**. Aucune stratégie fondée sur les prix passés ne peut donc, en moyenne, faire mieux que le hasard une fois les frais payés. Si un backtest trouve une stratégie rentable ici, c'est une erreur de méthode ou de la chance, et nous savons laquelle. Sur de vrais marchés, on ne sait pas, et c'est ce qui rend la méthode d'autant plus importante.

Le plan :

- **étape 1** : simuler la série et lire ses rendements ;
- **étape 2** : écrire le signal de croisement de moyennes mobiles ;
- **étape 3** : le moteur de backtest et les frais ;
- **étape 4** : les indicateurs ;
- **étape 5** : le biais d'anticipation ;
- **étape 6** : le surapprentissage des paramètres ;
- **étape 7** : ce qu'on ne mesure pas, et backtrader.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        SIMULATION,
        "import matplotlib.pyplot as plt",
        "",
        "rendements = prix.pct_change().dropna()",
        "print('premier prix :', round(float(prix.iloc[0]), 2), ' dernier prix :', round(float(prix.iloc[-1]), 2))",
        "print('jours :', len(prix), ' du', prix.index[0].date(), 'au', prix.index[-1].date())",
        "print('rendement journalier moyen :', round(float(rendements.mean()) * 100, 3), '%  écart-type :', round(float(rendements.std()) * 100, 3), '%')",
        "print('rendement total du prix :', round(float(prix.iloc[-1] / prix.iloc[0] - 1) * 100, 1), '%')",
        "",
        "fig, ax = plt.subplots(figsize=(9, 3.5))",
        "ax.plot(prix.index, prix, color='tab:blue')",
        "ax.set_title('Prix simulé (graine 0), marche aléatoire géométrique')",
        "ax.set_ylabel('prix (unité arbitraire)')",
        "ax.grid(alpha=0.3)",
        "plt.tight_layout()",
      ),
      caption: "Une série qui monte, descend, semble parfois avoir des tendances : l'œil en voit toujours dans le hasard. Cette réalisation finit plus bas qu'elle n'a commencé alors que la dérive est positive : cinq ans de hasard à 1 % de volatilité par jour s'écartent beaucoup de la tendance moyenne.",
    },
    {
      kind: "equation",
      latex: "r_t = \\frac{P_t}{P_{t-1}} - 1 \\qquad \\sigma_{\\text{annuelle}} = \\sigma_{\\text{jour}} \\sqrt{252}",
      narrow: "r_t = \\frac{P_t}{P_{t-1}} - 1 \\\\ \\sigma_{\\text{annuelle}} = \\sigma_{\\text{jour}} \\sqrt{252}",
      caption: "Le rendement d'un jour est la variation relative du prix. La volatilité annualisée suppose des rendements indépendants : les variances s'additionnent, donc l'écart-type est multiplié par la racine du nombre de jours (252 jours ouvrés par an, une convention).",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Rangez dans `rendements` la série des rendements journaliers de `prix` (variation relative d'un jour à l'autre, sans la première date qui n'a pas de veille) et dans `vol_annuelle` la volatilité annualisée en pourcentage (écart-type des rendements journaliers fois `sqrt(252)`, fois 100).",
      setup: SIMULATION,
      starter: lines("rendements = prix.diff().dropna()", "vol_annuelle = 0.0"),
      solution: lines(
        "rendements = prix.pct_change().dropna()",
        "vol_annuelle = float(rendements.std() * np.sqrt(252) * 100)",
        "print(len(rendements), round(vol_annuelle, 2))",
      ),
      test: lines(
        "assert len(rendements) == len(prix) - 1, \"un rendement par jour sauf le premier, qui n'a pas de veille (dropna)\"",
        "assert abs(rendements.iloc[0] - (prix.iloc[1] / prix.iloc[0] - 1)) < 1e-12, \"rendement = prix du jour / prix de la veille - 1 : c'est pct_change(), pas diff() (qui donne un écart en unités de prix)\"",
        "assert abs(vol_annuelle - rendements.std() * np.sqrt(252) * 100) < 1e-9, \"vol_annuelle = écart-type des rendements journaliers x racine de 252 x 100, en %\"",
      ),
      hint: "prix.pct_change() calcule (prix / prix décalé d'un jour) - 1 ; dropna() enlève la première valeur manquante.",
    },
    {
      kind: "text",
      md: `### Étape 2 : le signal de croisement de moyennes mobiles

La stratégie la plus classique de l'analyse technique : on compare deux **moyennes mobiles** du prix, une sur une fenêtre courte (par exemple 10 jours) et une sur une fenêtre longue (par exemple 50 jours). Quand la courte passe au-dessus de la longue, le prix des derniers jours est plus haut que sa moyenne récente : on suppose une tendance haussière et on **détient** l'actif (position 1). Sinon on reste **à l'écart** (position 0). On n'envisage pas de vente à découvert, pour garder le modèle simple.

Dans une marche aléatoire, cette hypothèse (« ce qui monte continue de monter ») est fausse par construction. Voyons ce que le backtest en dit.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `croisement(prix, court, long)` : une série de la même longueur que `prix` qui vaut `1.0` quand la moyenne mobile de `court` jours (`prix.rolling(court).mean()`) est **strictement supérieure** à celle de `long` jours, et `0.0` sinon, y compris tant que la moyenne longue n'est pas calculable (les `long - 1` premiers jours).",
      setup: SIMULATION,
      starter: lines(
        "def croisement(prix, court, long):",
        "    return prix * 0.0",
      ),
      solution: lines(
        "def croisement(prix, court, long):",
        "    mm_courte = prix.rolling(court).mean()",
        "    mm_longue = prix.rolling(long).mean()",
        "    return (mm_courte > mm_longue).astype(float).where(mm_longue.notna(), 0.0)",
        "",
        "signal = croisement(prix, 10, 50)",
        "print(int(signal.sum()), 'jours en position sur', len(signal))",
      ),
      test: lines(
        "_s = croisement(prix, 10, 50)",
        "assert len(_s) == len(prix) and set(_s.unique()) <= {0.0, 1.0}, \"la sortie doit contenir seulement des 0.0 et des 1.0, un par jour\"",
        "assert (_s.iloc[:49] == 0).all(), \"tant que la moyenne sur 50 jours n'existe pas (49 premiers jours), la position est 0\"",
        "_c = np.convolve(prix.values, np.ones(10) / 10, 'valid')[40:]       # moyenne sur 10 jours, alignée à partir du jour 50",
        "_l = np.convolve(prix.values, np.ones(50) / 50, 'valid')",
        "assert np.array_equal(_s.values[49:], (_c > _l).astype(float)), \"1.0 quand la moyenne courte est strictement au-dessus de la longue\"",
      ),
      hint: "(a > b) donne des booléens ; .astype(float) les convertit en 1.0 et 0.0 ; .where(condition, 0.0) remplace par 0.0 là où la condition est fausse.",
    },
    {
      kind: "code",
      language: "python",
      setup: lines(SIMULATION, "", MOTEUR),
      code: lines(
        "import matplotlib.pyplot as plt",
        "",
        "pos = position(prix, 10, 50)",
        "fig, ax = plt.subplots(figsize=(9, 3.8))",
        "ax.plot(prix.index, prix, color='lightgray', label='prix')",
        "ax.plot(prix.index, prix.rolling(10).mean(), color='tab:orange', linewidth=1, label='moyenne 10 jours')",
        "ax.plot(prix.index, prix.rolling(50).mean(), color='tab:blue', linewidth=1.5, label='moyenne 50 jours')",
        "ax.fill_between(prix.index, prix.min(), prix.max(), where=pos > 0, color='tab:green', alpha=0.15, label='en position')",
        "ax.set_title('Croisement 10 / 50 sur la série simulée (graine 0)')",
        "ax.legend(loc='upper left', ncol=2, fontsize=8)",
        "ax.grid(alpha=0.3)",
        "plt.tight_layout()",
        "",
        "print('jours en position :', int(pos.sum()), 'sur', len(pos))",
        "print('changements de position :', int(pos.diff().abs().sum()))",
      ),
      caption: "Les bandes vertes marquent les périodes où la stratégie détient l'actif. Elle entre et sort souvent, et chaque entrée ou sortie coûte des frais, que l'étape suivante ajoute.",
    },
    {
      kind: "text",
      md: `### Étape 3 : le moteur de backtest, avec les frais

Une fois la position de chaque jour connue, le rendement de la stratégie est celui du prix **multiplié par la position** : 1 pour suivre le prix, 0 pour ne rien gagner ni perdre. À cela on retire les **frais de transaction** : à chaque changement de position (achat ou vente), on paie une fraction du montant échangé. Nous prenons 0,1 % par opération, une valeur arbitraire d'ordre de grandeur plausible ; les frais réels dépendent de l'intermédiaire, de l'actif et du montant, et il faut toujours les prendre en compte, car une stratégie qui change souvent de position peut perdre tout son rendement en frais.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `couts(pos, frais)` : la série des frais payés chaque jour, égale à `frais` multiplié par la valeur absolue du changement de position par rapport à la veille. Le premier jour, la « veille » est la position 0 : une première position de 1 coûte donc des frais.",
      setup: lines("import pandas as pd"),
      starter: lines(
        "def couts(pos, frais):",
        "    return pos * 0.0",
      ),
      solution: lines(
        "def couts(pos, frais):",
        "    return pos.diff().abs().fillna(pos.abs()) * frais",
        "",
        "pos = pd.Series([0.0, 1.0, 1.0, 0.0, 1.0])",
        "print(couts(pos, 0.01).tolist())",
      ),
      test: lines(
        "_pos = pd.Series([0.0, 1.0, 1.0, 0.0, 1.0])",
        "assert couts(_pos, 0.01).round(6).tolist() == [0.0, 0.01, 0.0, 0.01, 0.01], \"frais = 0,01 x |changement de position| : [0, 0.01, 0, 0.01, 0.01]\"",
        "assert couts(pd.Series([1.0, 1.0, 0.0]), 0.01).round(6).tolist() == [0.01, 0.0, 0.01], \"dès le premier jour, passer de 0 à 1 coûte des frais\"",
        "assert couts(pd.Series([0.0, 0.0, 0.0]), 0.5).sum() == 0, \"sans changement de position, pas de frais\"",
      ),
      hint: "pos.diff() donne le changement par rapport à la veille (vide le premier jour) ; fillna(pos.abs()) le remplace par la position elle-même.",
    },
    {
      kind: "text",
      md: `### Étape 4 : les indicateurs

Un rendement total seul ne suffit pas. Trois indicateurs se lisent toujours ensemble :

- le **rendement** (total, et annualisé pour comparer des durées différentes) ;
- la **volatilité** annualisée, qui mesure l'ampleur des variations : à rendement égal, moins elle est grande, mieux c'est ;
- la **perte maximale** (*maximum drawdown*) : la plus grande baisse, en pourcentage, entre un sommet de la valeur du portefeuille et le creux qui suit. C'est la mesure de ce que l'on aurait dû supporter pour détenir la stratégie.`,
    },
    {
      kind: "equation",
      latex: "C_t = \\prod_{s \\le t} (1 + r_s) \\qquad \\text{perte maximale} = \\min_t \\left( \\frac{C_t}{\\max_{0 \\le s \\le t} C_s} - 1 \\right)",
      narrow: "C_t = \\prod_{s \\le t} (1 + r_s) \\\\ \\text{perte maximale} = \\min_t \\left( \\frac{C_t}{\\max_{0 \\le s \\le t} C_s} - 1 \\right)",
      caption: "C est la valeur cumulée du portefeuille, avec C₀ = 1 au départ. Le rapport entre sa valeur et son plus haut précédent est toujours inférieur ou égal à 1 ; sa valeur minimale, moins 1, donne la pire baisse subie.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `perte_maximale(rend)` qui rend la perte maximale (un nombre négatif ou nul, par exemple -0.2 pour une baisse de 20 %) d'une série de rendements journaliers : valeur cumulée `(1 + rend).cumprod()` (le portefeuille vaut 1 au départ), rapport à son plus haut précédent (`np.maximum(courbe.cummax(), 1.0)`, le départ compris), puis le minimum de ce rapport moins 1.",
      setup: lines("import numpy as np", "import pandas as pd"),
      starter: lines(
        "def perte_maximale(rend):",
        "    return float(rend.min())",
      ),
      solution: lines(
        "def perte_maximale(rend):",
        "    courbe = (1 + rend).cumprod()",
        "    pic = np.maximum(courbe.cummax(), 1.0)          # le plus haut atteint, départ compris",
        "    return float((courbe / pic - 1).min())",
        "",
        "print(round(perte_maximale(pd.Series([0.10, -0.20, 0.05])), 4))",
      ),
      test: lines(
        "assert abs(perte_maximale(pd.Series([0.10, -0.20, 0.05])) - (-0.20)) < 1e-9, \"valeur 1,10 puis 0,88 puis 0,924 : la perte maximale est 0,88 / 1,10 - 1 = -0,20\"",
        "assert abs(perte_maximale(pd.Series([-0.10, -0.10])) - (-0.19)) < 1e-9, \"deux baisses de 10 % de suite : 0,9 x 0,9 - 1 = -0,19, pas -0,10\"",
        "assert perte_maximale(pd.Series([0.01, 0.02, 0.03])) == 0, \"une valeur qui ne fait que monter n'a aucune perte\"",
      ),
      hint: "courbe / pic vaut 1 au sommet et moins de 1 en dessous ; le creux le plus bas donne la perte maximale.",
    },
    {
      kind: "code",
      language: "python",
      setup: lines(SIMULATION, "", MOTEUR),
      code: lines(
        "import matplotlib.pyplot as plt",
        "",
        "rend_prix = prix.pct_change().fillna(0.0)                       # tout garder du début à la fin (acheter et conserver)",
        "rend_strat = rendements_strategie(prix, position(prix, 10, 50), frais=0.001)",
        "rend_strat_sans_frais = rendements_strategie(prix, position(prix, 10, 50), frais=0.0)",
        "",
        "for nom, r in [('acheter et conserver', rend_prix), ('croisement 10/50, frais 0,1 %', rend_strat), ('croisement 10/50, sans frais', rend_strat_sans_frais)]:",
        "    i = indicateurs(r)",
        "    print(f'{nom:30s} total {i[\"total\"] * 100:6.1f} %  annuel {i[\"annuel\"] * 100:5.1f} %  volatilité {i[\"volatilite\"] * 100:5.1f} %  perte max {i[\"perte_max\"] * 100:6.1f} %')",
        "",
        "pos = position(prix, 10, 50)",
        "print('changements de position :', int(pos.diff().abs().sum()), ' frais totaux (somme des frais journaliers) :', round(float(pos.diff().abs().fillna(pos.abs()).sum() * 0.001) * 100, 2), '%')",
        "",
        "fig, ax = plt.subplots(figsize=(9, 3.5))",
        "ax.plot(prix.index, (1 + rend_prix).cumprod(), label='acheter et conserver', color='lightgray')",
        "ax.plot(prix.index, (1 + rend_strat).cumprod(), label='croisement 10/50, frais 0,1 %', color='tab:blue')",
        "ax.set_title('Valeur du portefeuille (base 1), série simulée graine 0')",
        "ax.legend(fontsize=8)",
        "ax.grid(alpha=0.3)",
        "plt.tight_layout()",
      ),
      caption: "Sur cette série, acheter et conserver perd 23,5 % (volatilité de 15,6 %, perte maximale de 43,8 %). Le croisement 10/50 perd 22,2 % avec les frais et 19,3 % sans : 37 changements de position, soit 3,7 points de frais en simple somme, et 2,9 points d'écart sur le total. Sa volatilité (9,5 %) et sa perte maximale (31,2 %) sont plus basses, mais surtout parce qu'il n'est en position que 513 jours sur 1 260 : être souvent à l'écart réduit les variations, pas forcément le risque de mal choisir. Une seule série, donc une anecdote.",
    },
    {
      kind: "text",
      md: `### Étape 5 : le biais d'anticipation

Le piège le plus sournois et le plus courant : **utiliser, pour décider d'une position, une information qui n'était pas encore connue**. Dans notre signal, la moyenne mobile du jour t contient le prix de clôture du jour t. Si l'on s'en sert pour décider la position **du jour t**, on décide avec le résultat du jour : si le prix a beaucoup monté aujourd'hui, la moyenne courte monte, le signal passe à 1, et on « gagne » la hausse… qui a déjà eu lieu. C'est un biais d'anticipation (*look-ahead bias*).

En vrai, on ne connaît le cours de clôture qu'une fois la séance finie : le signal calculé à la clôture du jour t ne peut servir qu'à la position du **jour suivant**. La correction tient en un mot : \`shift(1)\`.

Comparons les deux versions sur **20 séries simulées** (graines 0 à 19), avec le même croisement 10/50 et les mêmes frais.`,
    },
    {
      kind: "code",
      language: "python",
      setup: lines(SIMULATION, "", MOTEUR),
      code: lines(
        "totaux = {'biaisée': [], 'décalée': []}",
        "for graine in range(20):",
        "    px = simuler(graine)",
        "    totaux['biaisée'].append(indicateurs(rendements_strategie(px, position_biaisee(px, 10, 50)))['total'])",
        "    totaux['décalée'].append(indicateurs(rendements_strategie(px, position(px, 10, 50)))['total'])",
        "",
        "for nom, valeurs in totaux.items():",
        "    v = np.array(valeurs)",
        "    print(f'position {nom:8s} rendement total moyen {v.mean() * 100:6.1f} %   médian {np.median(v) * 100:6.1f} %   séries gagnantes {int((v > 0).sum())} sur 20')",
      ),
      caption: "Sur 20 séries simulées, la position calculée avec le cours du jour même gagne en moyenne 13,2 % (médiane 9,8 %, 13 séries gagnantes sur 20), alors que la même stratégie avec le signal décalé d'un jour perd en moyenne 0,6 % (médiane 3,6 % de perte, 7 séries gagnantes sur 20). La seule différence est un jour de décalage : le gain de la première version vient de l'information du jour, qu'on ne possède pas encore au moment de décider.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `position_corrigee(prix, court, long)` : la position de chaque jour, calculée **sans** utiliser le prix du jour même (le signal de la veille, `shift(1)`, avec `0.0` pour le premier jour). Utilisez la fonction `croisement` déjà définie. Le test vérifie que la position d'un jour ne change pas quand on modifie le prix de ce jour.",
      setup: lines(SIMULATION, "", MOTEUR),
      starter: lines(
        "def position_corrigee(prix, court, long):",
        "    return croisement(prix, court, long)",
      ),
      solution: lines(
        "def position_corrigee(prix, court, long):",
        "    return croisement(prix, court, long).shift(1).fillna(0.0)",
        "",
        "print(int(position_corrigee(prix, 10, 50).sum()), 'jours en position')",
      ),
      test: lines(
        "_pos = position_corrigee(prix, 10, 50)",
        "assert len(_pos) == len(prix) and _pos.iloc[0] == 0.0, \"une valeur par jour, et 0.0 le premier jour (pas de veille)\"",
        "assert _pos.iloc[1:].equals(croisement(prix, 10, 50).iloc[:-1].set_axis(prix.index[1:])), \"la position du jour t doit être le signal de la veille : croisement(...).shift(1)\"",
        "_px = prix.copy()",
        "_px.iloc[-1] = _px.iloc[-1] * 3               # on change brutalement le dernier prix",
        "assert position_corrigee(_px, 10, 50).iloc[-1] == _pos.iloc[-1], \"fuite d'information : la position du dernier jour change quand on modifie le prix de ce même jour\"",
      ),
      hint: "Série.shift(1) décale les valeurs d'un jour vers l'avant ; le premier jour devient vide, que fillna(0.0) remplace.",
    },
    {
      kind: "text",
      md: `### Étape 6 : le surapprentissage des paramètres

Pourquoi 10 et 50 ? Si on essaie **toutes** les paires de fenêtres d'une grille et qu'on garde la meilleure, on fait de l'**apprentissage** : on choisit les paramètres qui s'ajustent le mieux au passé. Sur une série où le passé ne dit rien, ce qui s'ajuste le mieux est du bruit : c'est du **surapprentissage**.

Le contrôle consiste à choisir les paramètres sur une période (**échantillon d'apprentissage**), et à les évaluer sur une autre période que le choix n'a pas vue (**échantillon de test**). Nous coupons la série en deux : les 630 premiers jours pour choisir, les 630 suivants pour tester. La grille compte 30 paires : une fenêtre courte de 5, 10, 15, 20 ou 30 jours, une longue de 40, 60, 80, 100, 150 ou 200 jours.`,
    },
    {
      kind: "code",
      language: "python",
      setup: lines(SIMULATION, "", MOTEUR, "", GRILLE),
      code: lines(
        "# graine 0 : on choisit sur la première moitié, on teste sur la seconde",
        "meilleure, scores = meilleure_paire(prix, 0, 630)",
        "test = rendement_total(prix, *meilleure, 630, 1260)",
        "classement = sorted(scores, key=scores.get, reverse=True)",
        "print('cinq meilleures paires sur la période de choix :')",
        "for c, l in classement[:5]:",
        "    print(f'  {c:2d}/{l:3d} : choix {scores[(c, l)] * 100:6.1f} %   test {rendement_total(prix, c, l, 630, 1260) * 100:6.1f} %')",
        "print('paire retenue :', meilleure, ' rendement sur la période de test :', round(test * 100, 1), '%')",
        "print('acheter et conserver sur la période de test :', round(float(prix.iloc[-1] / prix.iloc[629] - 1) * 100, 1), '%')",
      ),
      caption: "Sur la graine 0, la meilleure paire du choix est 10/200, qui perd quand même 1,5 % sur la première moitié, puis 19,8 % sur la seconde, contre 17,2 % pour acheter et conserver. Les cinq meilleures paires du choix perdent toutes entre 14,4 % et 19,8 % en test. Cette série baisse sur toute la période, ce qui limite l'illustration : la répétition ci-dessous la complète.",
    },
    {
      kind: "text",
      md: `Une seule série ne prouve rien : c'est une anecdote. Pour savoir ce que vaut **la méthode** qui consiste à choisir la meilleure paire sur la période de choix, on la répète sur 20 séries simulées différentes.`,
    },
    {
      kind: "code",
      language: "python",
      setup: lines(SIMULATION, "", MOTEUR, "", GRILLE),
      code: lines(
        "choix, test, conserver = [], [], []",
        "for graine in range(20):",
        "    px = simuler(graine)",
        "    paire, scores = meilleure_paire(px, 0, 630)",
        "    choix.append(scores[paire])",
        "    test.append(rendement_total(px, *paire, 630, 1260))",
        "    conserver.append(float(px.iloc[-1] / px.iloc[629] - 1))",
        "choix, test, conserver = np.array(choix), np.array(test), np.array(conserver)",
        "",
        "print('rendement moyen sur la période de choix (meilleure paire) :', round(choix.mean() * 100, 1), '%   séries gagnantes :', int((choix > 0).sum()), 'sur 20')",
        "print('rendement moyen de la même paire sur la période de test    :', round(test.mean() * 100, 1), '%   séries gagnantes :', int((test > 0).sum()), 'sur 20')",
        "print('acheter et conserver, période de test, moyenne             :', round(conserver.mean() * 100, 1), '%')",
        "print('séries où la stratégie choisie bat acheter et conserver en test :', int((test > conserver).sum()), 'sur 20')",
      ),
      caption: "Sur 20 séries, la meilleure paire choisie gagne en moyenne 15,5 % sur la période de choix (14 séries gagnantes sur 20), et la même paire perd en moyenne 0,9 % sur la période de test (7 séries gagnantes sur 20), alors qu'acheter et conserver y gagne en moyenne 2,9 %. La stratégie choisie ne bat acheter et conserver que dans 7 séries sur 20. Le bon résultat sur la période de choix était du bruit retenu par la sélection, pas une régularité : c'est ce que le test révèle. Vingt séries donnent un ordre de grandeur, pas une estimation précise.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `evaluer_methode(prix)` qui applique la méthode complète à une série : choisir la meilleure paire sur les 630 premiers jours (avec `meilleure_paire(prix, 0, 630)`, qui rend la paire et le dictionnaire des scores), puis rendre le couple `(rendement sur la période de choix, rendement sur la période de test)` de cette paire (`rendement_total(prix, court, long, debut, fin)`). Appliquez-la à `simuler(3)` et rangez le résultat dans `resultat`.",
      setup: lines(SIMULATION, "", MOTEUR, "", GRILLE),
      starter: lines(
        "def evaluer_methode(prix):",
        "    return 0.0, 0.0",
        "",
        "resultat = evaluer_methode(simuler(3))",
      ),
      solution: lines(
        "def evaluer_methode(prix):",
        "    paire, scores = meilleure_paire(prix, 0, 630)",
        "    return scores[paire], rendement_total(prix, *paire, 630, 1260)",
        "",
        "resultat = evaluer_methode(simuler(3))",
        "print([round(x * 100, 1) for x in resultat])",
      ),
      test: lines(
        "_px = simuler(3)",
        "_paire, _scores = meilleure_paire(_px, 0, 630)",
        "assert abs(resultat[0] - max(_scores.values())) < 1e-12, \"le premier nombre est le rendement de la meilleure paire sur la période de choix (les 630 premiers jours)\"",
        "assert abs(resultat[1] - rendement_total(_px, *_paire, 630, 1260)) < 1e-12, \"le second nombre est le rendement de cette même paire sur les 630 jours suivants\"",
        "assert resultat[0] != resultat[1], \"les deux périodes ne doivent pas donner le même résultat\"",
      ),
      hint: "scores[paire] est le rendement sur la période de choix ; rendement_total(prix, *paire, 630, 1260) mesure la même paire sur la période suivante.",
    },
    {
      kind: "note",
      tone: "info",
      md: "Ce que l'on vient de mesurer s'appelle aussi le **biais de sélection** : avec 30 paires, la meilleure paire a de bonnes chances d'être excellente sur la période de choix juste parce qu'on en a essayé trente. Plus on essaie de variantes, plus la meilleure paraît bonne, et moins elle vaut hors échantillon. Avec de vrais marchés, on s'en protège en réservant une période jamais touchée, en rejouant la méthode sur plusieurs périodes successives (validation « en marche avant »), et en comptant honnêtement tous les essais faits.",
    },
    {
      kind: "text",
      md: lines(
        "### Étape 7 : ce qu'un backtest ne dit pas, et backtrader",
        "",
        "Même sans biais d'anticipation ni surapprentissage, un backtest reste une approximation. Quelques limites à garder en tête, sur de vraies données :",
        "",
        "- **les frais réels** : commissions, écart entre prix d'achat et prix de vente, impact de ses propres ordres sur le prix, taxes. Notre 0,1 % unique est une simplification ;",
        "- **les données elles-mêmes** : cours ajustés des dividendes et des divisions d'actions ou non, séries qui ne contiennent que les sociétés encore cotées aujourd'hui (le biais du survivant) ;",
        "- **un seul passé** : un historique n'est qu'une des trajectoires possibles ; une stratégie qui a bien marché sur 5 ans a pu profiter d'un régime de marché qui ne reviendra pas ;",
        "- **le nombre d'essais** : tout ce qu'on a essayé avant de garder une stratégie compte, même ce qu'on n'a pas écrit ;",
        "- **la distance entre le test et la réalité** : exécution des ordres, pannes, décisions humaines sous stress.",
        "",
        "Écrire son propre moteur, comme ici, aide à comprendre ce qu'il fait. En pratique, on s'appuie souvent sur une bibliothèque dédiée, comme **backtrader** : elle gère les ordres, les commissions, plusieurs actifs et des indicateurs prêts à l'emploi. Ce code ne tourne pas dans le moteur du site (backtrader n'y est pas, et il lit normalement des fichiers de cours). Sur votre machine, après `pip install backtrader`, une stratégie de croisement de moyennes mobiles s'écrit à peu près ainsi :",
        "",
        "```python",
        "import backtrader as bt",
        "",
        "class Croisement(bt.Strategy):",
        "    params = dict(court=10, long=50)",
        "",
        "    def __init__(self):",
        "        mm_courte = bt.indicators.SMA(self.data.close, period=self.p.court)",
        "        mm_longue = bt.indicators.SMA(self.data.close, period=self.p.long)",
        "        self.signal = bt.indicators.CrossOver(mm_courte, mm_longue)",
        "",
        "    def next(self):",
        "        # backtrader exécute l'ordre à l'ouverture de la séance suivante : pas de biais d'anticipation ici",
        "        if not self.position and self.signal > 0:",
        "            self.buy()",
        "        elif self.position and self.signal < 0:",
        "            self.close()",
        "",
        "cerveau = bt.Cerebro()",
        "cerveau.addstrategy(Croisement)",
        "cerveau.adddata(bt.feeds.PandasData(dataname=donnees))   # un DataFrame avec open, high, low, close, volume",
        "cerveau.broker.setcash(10000)",
        "cerveau.broker.setcommission(commission=0.001)            # 0,1 % par opération",
        "cerveau.run()",
        "print(cerveau.broker.getvalue())",
        "```",
        "",
        "Les résultats d'un tel code dépendent des données fournies : nous n'annonçons aucun résultat, puisque ce code n'a pas été exécuté sur le site. Remarquez que la bibliothèque ne dispense pas des précautions de ce projet : c'est à vous de séparer période de choix et période de test.",
      ),
    },
    {
      kind: "note",
      tone: "warning",
      md: "Rappel : cet exercice repose sur des prix simulés et ne constitue pas un conseil en investissement. Une stratégie qui marche sur un backtest n'est pas une stratégie qui marchera demain, et les performances passées ne préjugent pas des résultats futurs. Aucun intermédiaire, aucun produit n'est recommandé ici.",
    },
    {
      kind: "note",
      tone: "tip",
      md: "Pour aller plus loin : ajouter la vente à découvert (position -1), tester d'autres signaux (rebond sur une moyenne, seuils de volatilité), rejouer la méthode sur plusieurs fenêtres successives plutôt qu'une coupure unique, ou simuler une série avec une vraie tendance dans les rendements pour voir si la méthode la retrouve.",
    },
  ],
  quiz: [
    {
      question: "Pourquoi ce projet utilise-t-il une marche aléatoire simulée plutôt que des cours réels ?",
      options: [
        "Parce que les cours réels sont toujours faux",
        "Parce que, par construction, le passé n'y prédit pas le futur : toute stratégie rentable trouvée est de la chance ou une erreur de méthode, ce qui permet de mesurer ces erreurs",
        "Parce que Pyodide ne sait pas lire des fichiers",
        "Parce qu'une série simulée donne toujours de meilleurs résultats",
      ],
      correct: 1,
      explanation: "Sur des données réelles, on ne sait pas s'il existe un motif exploitable. Ici, on sait qu'il n'y en a pas, donc tout gain apparent mesure le biais de la méthode.",
    },
    {
      question: "Qu'est-ce que le biais d'anticipation (look-ahead bias) ?",
      options: [
        "Anticiper la hausse du marché",
        "Utiliser pour décider d'une position une information qui n'était pas encore connue au moment de la décision, comme le cours de clôture du jour même",
        "Choisir des paramètres sur la période de test",
        "Payer des frais trop élevés",
      ],
      correct: 1,
      explanation: "Le signal calculé avec le prix de clôture du jour ne peut servir qu'à la position du lendemain. shift(1) l'impose, et le test d'un changement du dernier prix le vérifie.",
    },
    {
      question: "Une stratégie choisie comme la meilleure sur 30 paires de paramètres gagne en moyenne beaucoup sur la période de choix et à peu près rien sur la période suivante. Qu'est-ce que cela illustre ?",
      options: [
        "Une panne du moteur de backtest",
        "Le surapprentissage : parmi de nombreux essais, le meilleur s'ajuste au bruit de la période de choix, pas à une régularité durable",
        "Que les frais de transaction ont disparu",
        "Que la période de test était trop courte pour calculer une moyenne",
      ],
      correct: 1,
      explanation: "Plus on essaie de variantes, plus la meilleure paraît bonne par hasard. Seule une période que le choix n'a jamais vue permet d'estimer ce qu'elle vaut vraiment.",
    },
    {
      question: "À quoi sert la perte maximale (maximum drawdown) ?",
      options: [
        "À mesurer le rendement annuel",
        "À mesurer la plus grande baisse entre un sommet de la valeur du portefeuille et le creux qui suit, c'est-à-dire ce qu'il aurait fallu supporter",
        "À calculer les frais totaux",
        "À remplacer la volatilité",
      ],
      correct: 1,
      explanation: "Deux stratégies de même rendement ne se valent pas si l'une a traversé une baisse de 40 % : la perte maximale mesure cet inconfort et ce risque, que le rendement total ne montre pas.",
    },
    {
      question: "Pourquoi un backtest doit-il toujours inclure des frais de transaction ?",
      options: [
        "Parce que c'est une obligation légale pour tout calcul",
        "Parce qu'une stratégie qui change souvent de position peut perdre tout son rendement en frais, et que ne pas les compter la rend artificiellement bonne",
        "Parce qu'ils rendent la courbe plus lisse",
        "Parce qu'ils sont toujours nuls pour les petits montants",
      ],
      correct: 1,
      explanation: "Chaque entrée et chaque sortie coûte. Une stratégie fréquente est beaucoup plus sensible aux frais qu'une stratégie qui change rarement de position.",
    },
    {
      question: "Un backtest sur 5 ans montre un bon résultat sans biais d'anticipation et avec une période de test séparée. Peut-on affirmer que la stratégie marchera à l'avenir ?",
      options: [
        "Oui, ces deux précautions suffisent",
        "Non : un historique n'est qu'une trajectoire possible, les frais réels et les conditions de marché peuvent différer, et les performances passées ne préjugent pas des résultats futurs",
        "Oui, si le rendement dépasse 10 % par an",
        "Oui, si on utilise backtrader",
      ],
      correct: 1,
      explanation: "Les précautions réduisent des erreurs connues, elles ne garantissent rien. Un backtest est un test de cohérence, pas une prévision.",
    },
  ],
};
