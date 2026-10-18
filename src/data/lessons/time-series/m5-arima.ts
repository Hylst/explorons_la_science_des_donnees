import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";
import { NIL, TACHES } from "./data";

/** Nil : entraînement 1871-1960 (90 ans), test 1961-1970 (10 ans) */
const NIL_DECOUPE = lines(NIL, "", "train = nil[:'1960']", "test = nil['1961':]");

/** Taches solaires : entraînement 1700-1988 (289 ans), test 1989-2008 (20 ans) */
const TACHES_DECOUPE = lines(TACHES, "", "train = taches[:'1988']", "test = taches['1989':]");

export const moduleArima: LessonModule = {
  id: "arima",
  title: "Modèles ARIMA",
  duration: "2 h 30",
  summary: "Décrire une série par ses valeurs et ses chocs passés (AR, MA, ARIMA), choisir l'ordre avec l'AIC, vérifier les résidus, prévoir avec un intervalle et se comparer à une référence sur une période tenue à l'écart.",
  objectives: [
    "Distinguer un modèle autorégressif (AR), de moyenne mobile (MA) et ARIMA(p, d, q), et en ajuster un avec statsmodels",
    "Choisir l'ordre sur une petite grille avec l'AIC, en sachant qu'une grille n'explore que ce qu'on lui donne",
    "Diagnostiquer les résidus avec le test de Ljung-Box",
    "Prévoir avec un intervalle (get_forecast, conf_int) et comparer à une référence sur une période de test",
  ],
  sections: [
    {
      kind: "text",
      md: `### Trois briques : AR, MA, différence

Un modèle ARIMA (Box et Jenkins, 1970) décrit une série avec trois ingrédients. Dans les formules, ε désigne un **choc** : une petite surprise imprévisible, d'un pas de temps à l'autre, supposée sans mémoire (un bruit blanc).

- **AR(p), autorégressif** : la valeur du jour est une combinaison des p valeurs précédentes, plus un choc. C'est la mémoire de la série elle-même.
- **MA(q), moyenne mobile** : la valeur du jour est un choc d'aujourd'hui plus une part des q chocs précédents. C'est la mémoire des surprises passées. (Rien à voir avec la moyenne mobile du module 1, qui lisse une série.)
- **I(d), intégré** : on applique d'abord d différences (module précédent) pour rendre la série stationnaire, puis on modélise le résultat. **ARIMA(p, d, q)** assemble les trois.

Une règle de lecture classique, idéale mais rarement aussi nette sur des données réelles : la pacf s'annule après le retard p pour un AR(p), l'acf s'annule après le retard q pour un MA(q). Dans la pratique, on part de cette lecture, on essaie quelques ordres voisins, et on les compare avec l'**AIC**.`,
    },
    {
      kind: "equation",
      latex: String.raw`y_t = c + \phi_1 y_{t-1} + \dots + \phi_p y_{t-p} + \varepsilon_t + \theta_1 \varepsilon_{t-1} + \dots + \theta_q \varepsilon_{t-q}`,
      narrow: String.raw`\begin{aligned} y_t = c &+ \phi_1 y_{t-1} + \dots + \phi_p y_{t-p} \\ &+ \varepsilon_t + \theta_1 \varepsilon_{t-1} + \dots + \theta_q \varepsilon_{t-q} \end{aligned}`,
      caption: "Modèle ARMA(p, q) : p termes autorégressifs (les valeurs passées, coefficients φ) et q termes de moyenne mobile (les chocs passés, coefficients θ). ARIMA(p, d, q) applique ce modèle à la série différenciée d fois.",
    },
    {
      kind: "text",
      md: `### Premier modèle : le Nil

Le débit annuel du Nil compte 100 années, de 1871 à 1970. Nous gardons les 90 premières pour ajuster le modèle (\`train\`, 1871 à 1960) et les 10 dernières pour le juger (\`test\`, 1961 à 1970) : comme toujours, **le test vient après l'entraînement**. Dix années, c'est peu : gardez cette fragilité à l'esprit pour toutes les comparaisons qui suivent.

Nous prenons **d = 1**. Le module précédent a montré une rupture de niveau vers 1898, et la série a une autocorrélation qui retombe lentement (0,50 au retard 1, 0,38 au retard 2, 0,33 au retard 3). Une différence transforme une rupture de niveau en une seule valeur inhabituelle, que le modèle encaisse sans dévier. \`ARIMA(train, order=(p, d, q)).fit()\` ajuste le modèle ; \`summary()\` donne les coefficients et leurs p-values.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        NIL_DECOUPE,
        "from statsmodels.tsa.arima.model import ARIMA",
        "",
        "modele = ARIMA(train, order=(1, 1, 1)).fit()",
        "print(modele.summary().tables[1])",
        "print('AIC :', round(modele.aic, 1))",
      ),
      caption: "Les trois lignes du tableau : ar.L1 est le coefficient φ du retard 1 (0,259, p = 0,052), ma.L1 le coefficient θ du premier choc (-0,873, très significatif) et sigma2 la variance des chocs (environ 19 730, soit un choc typique d'environ 140 en 10^8 m³). L'AIC vaut 1139,7.",
    },
    {
      kind: "text",
      md: `### Choisir l'ordre : une petite grille et l'AIC

Faute de savoir quel ordre convient, on en essaie quelques-uns et on garde celui dont l'AIC est le plus petit. Ici, d = 1 est fixé et p varie de 0 à 2, q de 0 à 1 : six modèles. L'**AIC** (critère d'Akaike) vaut 2k - 2 ln(L), où k est le nombre de paramètres estimés et L la vraisemblance maximale : le premier terme pénalise la complexité, le second récompense l'ajustement. Plus il est petit, mieux c'est. On ne compare que des modèles ajustés sur les mêmes données et avec le même d. Le **BIC** fait de même avec une pénalité plus forte, donc il préfère des modèles plus simples.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        NIL_DECOUPE,
        "from statsmodels.tsa.arima.model import ARIMA",
        "",
        "resultats = []",
        "for p in range(3):",
        "    for q in range(2):",
        "        m = ARIMA(train, order=(p, 1, q)).fit()",
        "        resultats.append({'ordre': (p, 1, q), 'aic': round(m.aic, 1), 'bic': round(m.bic, 1)})",
        "tableau = pd.DataFrame(resultats).sort_values('aic')",
        "print(tableau.to_string(index=False))",
      ),
      caption: "L'AIC retient ARIMA(1, 1, 1) (1139,7), mais ARIMA(2, 1, 1) (1141,5) et ARIMA(0, 1, 1) (1141,7) sont à moins de 2 points : une telle différence ne sépare pas vraiment les trois modèles. Le BIC, plus sévère, choisit le plus simple, ARIMA(0, 1, 1) (1146,6). Sans composante de moyenne mobile (ARIMA(0, 1, 0)), l'AIC monte à 1165,5 : les chocs passés comptent.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Ajustez un **ARIMA(0, 1, 1)** sur `train`. Rangez dans `theta` son coefficient de moyenne mobile (la ligne `ma.L1` des paramètres, `modele.params`) et dans `aic` son AIC.",
      setup: NIL_DECOUPE,
      starter: lines("from statsmodels.tsa.arima.model import ARIMA", "", "theta = None", "aic = None"),
      solution: lines(
        "from statsmodels.tsa.arima.model import ARIMA",
        "",
        "modele = ARIMA(train, order=(0, 1, 1)).fit()",
        "theta = modele.params['ma.L1']",
        "aic = modele.aic",
        "print(round(theta, 3), round(aic, 1))",
      ),
      test: lines(
        "from statsmodels.tsa.arima.model import ARIMA",
        `assert theta is not None and aic is not None, "rangez le coefficient ma.L1 dans theta et l'AIC dans aic"`,
        "attendu = ARIMA(train, order=(0, 1, 1)).fit()",
        `assert abs(float(theta) - attendu.params['ma.L1']) < 1e-3, f"theta doit être le coefficient ma.L1 de l'ARIMA(0, 1, 1), environ {attendu.params['ma.L1']:.3f} (vous avez {float(theta):.3f})"`,
        `assert abs(float(aic) - attendu.aic) < 1e-3, f"l'AIC de l'ARIMA(0, 1, 1) vaut environ {attendu.aic:.1f} (vous avez {float(aic):.1f})"`,
      ),
      hint: "ARIMA(train, order=(0, 1, 1)).fit() donne un résultat dont .params['ma.L1'] est le coefficient et .aic l'AIC.",
    },
    {
      kind: "text",
      md: `### Les résidus : le modèle a-t-il tout compris ?

Un **résidu** est l'écart entre une valeur et ce que le modèle en attendait. Si le modèle a bien capté la mémoire de la série, ses résidus ne contiennent plus d'autocorrélation : ils ressemblent à un bruit blanc. Le test de **Ljung-Box** (\`acorr_ljungbox\`) examine l'ensemble des autocorrélations jusqu'à un retard donné. Son hypothèse de départ est « pas d'autocorrélation » : une **grande p-value est bon signe** (rien d'inquiétant n'est détecté), une p-value petite (sous 0,05) signale une structure que le modèle a laissée de côté.

Avec une différenciation (d = 1), le premier résidu n'est que l'initialisation du modèle : on l'écarte (\`resid.iloc[1:]\`).`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        NIL_DECOUPE,
        "import matplotlib.pyplot as plt",
        "from statsmodels.tsa.arima.model import ARIMA",
        "from statsmodels.stats.diagnostic import acorr_ljungbox",
        "from statsmodels.graphics.tsaplots import plot_acf",
        "",
        "modele = ARIMA(train, order=(1, 1, 1)).fit()",
        "print('premier résidu :', round(modele.resid.iloc[0]), ' première valeur de la série :', int(train.iloc[0]))",
        "residus = modele.resid.iloc[1:]   # on écarte le premier résidu (initialisation du modèle différencié)",
        "print('écart type des résidus :', round(residus.std(), 1))",
        "print(acorr_ljungbox(residus, lags=[5, 10]).round(3))",
        "",
        "fig, axes = plt.subplots(1, 2, figsize=(10, 3.5))",
        "axes[0].plot(residus, linewidth=0.8)",
        "axes[0].axhline(0, color='gray', linewidth=0.8)",
        `axes[0].set_title("Résidus de l'ARIMA(1, 1, 1)")`,
        "plot_acf(residus, lags=20, ax=axes[1], title='Autocorrélation des résidus')",
        "plt.tight_layout()",
        "plt.show()",
      ),
      caption: "Le premier résidu vaut 1 120, la première valeur de la série : ce n'est que l'initialisation, d'où son écartement. Pour les autres, les p-values de Ljung-Box sont grandes (0,975 à 5 retards, 0,531 à 10) : le test ne détecte pas d'autocorrélation restante. Sur l'acf des résidus, la barre la plus haute, au retard 10 (-0,20), reste tout juste sous le seuil simple de 0,21 (1,96 divisé par la racine de 89 résidus) : ce modèle est acceptable, sans être irréprochable.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Les taches solaires sont ajustées par un **AR(2)** (`ARIMA(train, order=(2, 0, 0))`, déjà dans `modele`). Faites le test de Ljung-Box sur ses résidus à **10 retards** : rangez la p-value dans `p_lb` et, dans `modele_ok`, `True` si elle dépasse 0,05 (rien d'inquiétant), `False` sinon.",
      setup: TACHES_DECOUPE,
      starter: lines(
        "from statsmodels.tsa.arima.model import ARIMA",
        "from statsmodels.stats.diagnostic import acorr_ljungbox",
        "",
        "modele = ARIMA(train, order=(2, 0, 0)).fit()",
        "p_lb = None",
        "modele_ok = None",
      ),
      solution: lines(
        "from statsmodels.tsa.arima.model import ARIMA",
        "from statsmodels.stats.diagnostic import acorr_ljungbox",
        "",
        "modele = ARIMA(train, order=(2, 0, 0)).fit()",
        "lb = acorr_ljungbox(modele.resid, lags=[10])",
        "p_lb = float(lb['lb_pvalue'].iloc[0])",
        "modele_ok = p_lb > 0.05",
        "print(round(p_lb, 4), modele_ok)",
      ),
      test: lines(
        "from statsmodels.tsa.arima.model import ARIMA",
        "from statsmodels.stats.diagnostic import acorr_ljungbox",
        `assert p_lb is not None and modele_ok is not None, "rangez la p-value dans p_lb et le verdict (True ou False) dans modele_ok"`,
        "attendu = float(acorr_ljungbox(ARIMA(train, order=(2, 0, 0)).fit().resid, lags=[10])['lb_pvalue'].iloc[0])",
        `assert abs(float(p_lb) - attendu) < 1e-6, f"p_lb est la p-value de Ljung-Box à 10 retards sur les résidus de l'AR(2), environ {attendu:.4f} (vous avez {float(p_lb):.4f})"`,
        `assert bool(modele_ok) == (attendu > 0.05), "modele_ok vaut True si la p-value dépasse 0,05, False sinon"`,
      ),
      hint: "acorr_ljungbox(modele.resid, lags=[10]) renvoie un tableau dont la colonne lb_pvalue contient la p-value ; lb['lb_pvalue'].iloc[0] en donne la première ligne.",
    },
    {
      kind: "text",
      md: `### Prévoir avec un intervalle

\`modele.get_forecast(steps=h)\` prévoit les h pas suivants. Son résultat donne \`predicted_mean\` (la prévision centrale) et \`conf_int(alpha=0.05)\` (l'**intervalle de prévision à 95 %**). L'intervalle s'élargit avec l'horizon : plus on prévoit loin, plus les chocs à venir s'accumulent. Il suppose que le modèle est juste et que les chocs sont de loi normale : c'est un ordre de grandeur, pas une garantie.

Comme toujours, une prévision ne vaut que **comparée à une référence** sur la période tenue à l'écart. Ici : la valeur du Nil en 1960 répétée (la naïve), et la moyenne de l'entraînement. On teste aussi ARIMA(0, 1, 1), le choix du BIC.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        NIL_DECOUPE,
        "import matplotlib.pyplot as plt",
        "from statsmodels.tsa.arima.model import ARIMA",
        "",
        "def mae(a, b):",
        "    return float(np.mean(np.abs(np.asarray(a) - np.asarray(b))))",
        "",
        "for ordre in [(1, 1, 1), (0, 1, 1)]:",
        "    prevision = ARIMA(train, order=ordre).fit().get_forecast(steps=len(test)).predicted_mean",
        "    print(f'MAE ARIMA{ordre} : {mae(test, prevision):.1f}')",
        "print(f'MAE naïve (valeur de 1960)  : {mae(test, train.iloc[-1]):.1f}')",
        `print(f"MAE moyenne de l'entraînement : {mae(test, train.mean()):.1f}")`,
        "",
        "f = ARIMA(train, order=(1, 1, 1)).fit().get_forecast(steps=len(test))",
        "bornes = f.conf_int(alpha=0.05)",
        "dans = (test.to_numpy() >= bornes.iloc[:, 0].to_numpy()) & (test.to_numpy() <= bornes.iloc[:, 1].to_numpy())",
        `print(f"valeurs réelles dans l'intervalle à 95 % : {dans.sum()} sur {len(test)}")`,
        `print("largeur de l'intervalle, 1er et 10e pas :", round(bornes.iloc[0, 1] - bornes.iloc[0, 0]), round(bornes.iloc[-1, 1] - bornes.iloc[-1, 0]))`,
        "",
        "fig, ax = plt.subplots(figsize=(9, 3.5))",
        "ax.plot(train['1930':].index, train['1930':], label='entraînement')",
        "ax.plot(test.index, test, color='black', label='réel')",
        "ax.plot(f.predicted_mean.index, f.predicted_mean, color='tab:red', label='prévision ARIMA(1, 1, 1)')",
        "ax.fill_between(bornes.index, bornes.iloc[:, 0], bornes.iloc[:, 1], color='tab:red', alpha=0.15, label='intervalle à 95 %')",
        "ax.legend(loc='lower left')",
        "plt.tight_layout()",
        "plt.show()",
      ),
      caption: "ARIMA(1, 1, 1) a une MAE de 118,0, la naïve 128,0 (le modèle fait environ 8 % mieux) mais la simple moyenne de l'entraînement fait 118,0 elle aussi : sur ces dix années, le modèle ne bat pas la moyenne. ARIMA(0, 1, 1), pourtant moins bon selon l'AIC, prévoit un peu mieux (113,2) : avec dix points de test, on ne tranche pas. Les 10 valeurs réelles tombent dans l'intervalle à 95 %, mais il est large : 551 au premier pas et 654 au dernier, pour une série qui varie de 456 à 1 370.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Avec un **ARIMA(0, 1, 1)** ajusté sur `train`, prévoyez les 10 années du test (`get_forecast`). Rangez les prévisions centrales dans `prevision`, leur erreur absolue moyenne par rapport à `test` dans `mae_arima`, et l'erreur absolue moyenne de la **naïve** (la dernière valeur de `train` répétée 10 fois) dans `mae_naive`.",
      setup: NIL_DECOUPE,
      starter: lines("from statsmodels.tsa.arima.model import ARIMA", "", "prevision = None", "mae_arima = None", "mae_naive = None"),
      solution: lines(
        "from statsmodels.tsa.arima.model import ARIMA",
        "",
        "modele = ARIMA(train, order=(0, 1, 1)).fit()",
        "prevision = modele.get_forecast(steps=len(test)).predicted_mean",
        "mae_arima = np.mean(np.abs(test.to_numpy() - prevision.to_numpy()))",
        "mae_naive = np.mean(np.abs(test.to_numpy() - train.iloc[-1]))",
        "print('ARIMA :', round(mae_arima, 1), ' naïve :', round(mae_naive, 1))",
      ),
      test: lines(
        "from statsmodels.tsa.arima.model import ARIMA",
        `assert prevision is not None and mae_arima is not None and mae_naive is not None, "rangez les prévisions dans prevision et les deux erreurs dans mae_arima et mae_naive"`,
        "attendue = ARIMA(train, order=(0, 1, 1)).fit().get_forecast(steps=10).predicted_mean.to_numpy()",
        `assert len(prevision) == 10, f"il faut une prévision par année du test, soit 10 (vous en avez {len(prevision)})"`,
        `assert np.allclose(np.asarray(prevision), attendue, atol=1e-3), "prevision doit être la prévision centrale (predicted_mean) de l'ARIMA(0, 1, 1) ajusté sur train"`,
        "erreur = float(np.mean(np.abs(test.to_numpy() - attendue)))",
        `assert abs(float(mae_arima) - erreur) < 1e-3, f"mae_arima est la moyenne des écarts absolus entre test et la prévision, environ {erreur:.1f} (vous avez {float(mae_arima):.1f})"`,
        "naive = float(np.mean(np.abs(test.to_numpy() - train.iloc[-1])))",
        `assert abs(float(mae_naive) - naive) < 1e-6, f"mae_naive compare test à la dernière valeur de train répétée, environ {naive:.1f} (vous avez {float(mae_naive):.1f})"`,
      ),
      hint: "get_forecast(steps=len(test)).predicted_mean donne les prévisions ; la MAE est np.mean(np.abs(test.to_numpy() - prevision.to_numpy())). Pour la naïve, soustrayez train.iloc[-1] à test.to_numpy().",
    },
    {
      kind: "note",
      tone: "warning",
      md: "**Un modèle plus savant n'est pas forcément meilleur.** Sur le Nil, ARIMA(1, 1, 1) ne bat pas la moyenne de l'entraînement (118,0 contre 118,0) et ne gagne qu'environ 8 % sur la naïve, sur dix années seulement. Le résultat dit surtout que cette série est difficile à prévoir : un peu de mémoire, beaucoup d'aléa. Affichez toujours la référence à côté du modèle, et ne concluez pas sur dix points de test.",
    },
    {
      kind: "text",
      md: `### Une grille ne trouve que ce qu'on lui donne : les taches solaires

Les taches solaires ont un cycle régulier, que l'on peut espérer faire modéliser par un AR. Entraînement : 1700 à 1988 (289 ans) ; test : 1989 à 2008 (20 ans, soit deux cycles). Une grille raisonnable aurait fait varier p de 1 à 4. Voyons ce que donne un balayage plus large : p de 1 à 9, avec l'AIC, le test de Ljung-Box et la MAE sur les 20 années tenues à l'écart. Rappelez-vous la pacf du module précédent : ses barres des retards 6 à 9 dépassaient encore le seuil.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        TACHES_DECOUPE,
        "import matplotlib.pyplot as plt",
        "from statsmodels.tsa.arima.model import ARIMA",
        "from statsmodels.stats.diagnostic import acorr_ljungbox",
        "",
        "def mae(a, b):",
        "    return float(np.mean(np.abs(np.asarray(a) - np.asarray(b))))",
        "",
        "prevues = {}",
        "for p in (1, 2, 3, 5, 7, 9):",
        "    m = ARIMA(train, order=(p, 0, 0)).fit()",
        "    prevues[p] = m.get_forecast(steps=len(test))",
        "    lb = acorr_ljungbox(m.resid, lags=[10])['lb_pvalue'].iloc[0]",
        "    print(f'AR({p}) : AIC = {m.aic:7.1f}   Ljung-Box p = {lb:.4f}   MAE sur 1989-2008 = {mae(test, prevues[p].predicted_mean):5.1f}')",
        `print(f"moyenne de l'entraînement : MAE = {mae(test, train.mean()):.1f}   dernière valeur : MAE = {mae(test, train.iloc[-1]):.1f}")`,
        "bornes = prevues[9].conf_int()",
        "print('bornes basses négatives, AR(9) :', int((bornes.iloc[:, 0] < 0).sum()), 'sur', len(test))",
        "",
        "fig, ax = plt.subplots(figsize=(9, 3.5))",
        "ax.plot(test.index, test, color='black', label='réel')",
        "ax.plot(test.index, prevues[2].predicted_mean, label='AR(2)')",
        "ax.plot(test.index, prevues[9].predicted_mean, label='AR(9)')",
        "ax.set_ylabel('taches solaires')",
        "ax.legend()",
        "plt.tight_layout()",
        "plt.show()",
      ),
      caption: "L'AIC passe de 2630,7 (AR(1)) à 2450,9 (AR(3)) puis à 2407,5 (AR(9)). Les résidus de l'AR(2) échouent au test de Ljung-Box (p = 0,0009 : il reste de l'autocorrélation) ; ceux de l'AR(9) passent (p = 0,97). Sur les 20 années tenues à l'écart, la MAE passe de 25,7 pour l'AR(2) à 10,6 pour l'AR(9), contre 44,0 pour la moyenne et 51,9 pour la dernière valeur. Une grille qui se serait arrêtée à p = 4 aurait retenu un AR(3) et manqué ce gain. Revers : 9 des 20 bornes basses de l'intervalle sont négatives, ce qui n'a pas de sens pour un nombre de taches (les chocs ne sont pas vraiment gaussiens).",
    },
    {
      kind: "note",
      tone: "tip",
      md: "**Bonnes habitudes de choix d'ordre.** (1) Partir des corrélogrammes, pas d'une grille à l'aveugle. (2) Vérifier que le meilleur ordre n'est pas au bord de la grille : s'il l'est, élargir. (3) Regarder les résidus (Ljung-Box) : un AIC bas ne dispense pas du diagnostic. (4) Garder le dernier mot à une période de test, et à la comparaison avec une référence simple.",
    },
  ],
  quiz: [
    {
      question: "Quelle est la différence entre un modèle AR(2) et un modèle MA(2) ?",
      options: [
        "L'AR(2) utilise les 2 dernières valeurs de la série, le MA(2) les 2 derniers chocs (erreurs) du modèle",
        "L'AR(2) sert aux séries mensuelles, le MA(2) aux séries annuelles",
        "Le MA(2) calcule une moyenne mobile pour lisser la série",
        "Il n'y en a pas, ce sont deux noms du même modèle",
      ],
      correct: 0,
      explanation: "Un modèle autorégressif s'appuie sur les valeurs passées de la série ; un modèle de moyenne mobile s'appuie sur les chocs passés. Ce n'est pas la moyenne mobile de lissage de pandas.",
    },
    {
      question: "Dans ARIMA(1, 1, 1), que représente le deuxième nombre ?",
      options: [
        "Le nombre de valeurs prévues",
        "Le nombre de différences appliquées à la série avant de modéliser",
        "L'ordre de la saison",
        "Le nombre de modèles comparés",
      ],
      correct: 1,
      explanation: "Le d de ARIMA(p, d, q) est le nombre de différenciations. d = 1 modélise les variations d'un pas à l'autre plutôt que la série elle-même.",
    },
    {
      question: "Sur les taches solaires, une grille limitée à p inférieur ou égal à 4 retient un AR(3), alors que l'AR(9) a un AIC de 2407,5 contre 2450,9. Quelle leçon en tirer ?",
      options: [
        "Il faut toujours choisir l'ordre le plus élevé possible",
        "L'AIC ne sert à rien",
        "Une grille n'explore que ce qu'on lui donne : la pacf, qui dépassait encore le seuil aux retards 6 à 9, invitait à élargir",
        "Le test de Ljung-Box est inutile",
      ],
      correct: 2,
      explanation: "Le meilleur ordre n'était pas dans la grille. On vérifie qu'il ne se trouve pas au bord, on lit les corrélogrammes, et l'on valide sur une période de test (MAE de 10,6 pour l'AR(9) contre 23,8 pour l'AR(3)).",
    },
    {
      question: "Le test de Ljung-Box sur les résidus d'un modèle donne p = 0,001. Que faut-il en conclure ?",
      options: [
        "Le modèle est excellent",
        "Il reste de l'autocorrélation dans les résidus : le modèle a laissé de la structure de côté",
        "Les résidus sont forcément nuls",
        "Le test n'est pas applicable aux séries temporelles",
      ],
      correct: 1,
      explanation: "L'hypothèse de départ du test est « pas d'autocorrélation dans les résidus ». Une petite p-value la rejette : le modèle est à revoir (ordre plus élevé, autre structure). C'est le cas de l'AR(2) sur les taches solaires.",
    },
    {
      question: "Sur le Nil, ARIMA(1, 1, 1) a une MAE de 118,0 sur 10 années de test, la naïve 128,0 et la moyenne de l'entraînement 118,0. Que dire ?",
      options: [
        "L'ARIMA est démontré meilleur que toute autre méthode",
        "Le gain sur la naïve est modeste (environ 8 %) et nul face à la moyenne : sur dix points, le modèle n'est pas démontré utile",
        "La moyenne est un modèle trop complexe",
        "Il faut recommencer avec un test aléatoire plutôt que chronologique",
      ],
      correct: 1,
      explanation: "Un modèle doit battre des références simples, et sur dix années de test les différences sont fragiles. Mieux vaut le dire tel quel que conclure à une supériorité que les données ne montrent pas.",
    },
  ],
};
