import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

/** Simulation avec graine : trois variables, une étiquette qui dépend de x1 et x2, un modèle entraîné sur la référence. */
const SIM = lines(
  "import numpy as np",
  "import pandas as pd",
  "from scipy import stats",
  "from sklearn.linear_model import LogisticRegression",
  "from sklearn.metrics import accuracy_score",
  "",
  "NOMS = ['x1', 'x2', 'x3']",
  "",
  "def tirer(n, graine, population=0.0, capteur=0.0, poids=(1.5, 1.0, 0.0)):",
  "    \"\"\"Simule n cas : trois variables normales, une étiquette qui dépend de x1 et x2 (poids) plus du bruit.",
  "    population : décalage réel de x1 dans le monde ; capteur : décalage de la seule mesure de x1.\"\"\"",
  "    rng = np.random.default_rng(graine)",
  "    X = pd.DataFrame(rng.normal(size=(n, 3)), columns=NOMS)",
  "    X['x1'] += population",
  "    score = X.to_numpy() @ np.array(poids) + rng.normal(size=n)",
  "    y = (score > 0).astype(int)",
  "    X['x1'] += capteur                       # ce que l'on enregistre, pas ce qui est vrai",
  "    return X, y",
  "",
  "# la référence : les données d'entraînement, et le modèle en service",
  "X_ref, y_ref = tirer(2000, 0)",
  "modele = LogisticRegression().fit(X_ref, y_ref)",
);

/** Douze périodes de 500 cas dont la relation entre x2 et l'étiquette change doucement. */
const LOTS = lines(
  "# 12 périodes de 500 cas : le poids de x2 passe doucement de +1 à -1 (une dérive de concept progressive)",
  "T = 12",
  "lots = [tirer(500, 100 + t, poids=(1.5, 1.0 - 2.0 * t / (T - 1), 0.0)) for t in range(T)]",
  "XH = pd.concat([x for x, _ in lots], ignore_index=True)",
  "yH = np.concatenate([y for _, y in lots])",
);

const DEMO1 = lines(
  "def psi(reference, nouveau, n_classes=10, eps=1e-4):",
  "    \"\"\"Indice de stabilité de population : classes = déciles de la référence.\"\"\"",
  "    bords = np.quantile(reference, np.linspace(0, 1, n_classes + 1))",
  "    bords[0], bords[-1] = -np.inf, np.inf",
  "    p = np.histogram(reference, bords)[0] / len(reference)",
  "    q = np.histogram(nouveau, bords)[0] / len(nouveau)",
  "    p, q = np.clip(p, eps, None), np.clip(q, eps, None)      # évite log(0) et la division par 0",
  "    return float(np.sum((q - p) * np.log(q / p)))",
  "",
  "X_val, y_val = tirer(1000, 1)",
  "print('exactitude sur des données comme celles de la référence :', round(accuracy_score(y_val, modele.predict(X_val)), 3))",
  "",
  "scenarios = {",
  "    'stable': {},",
  "    'population (x1 monte de 0,5)': {'population': 0.5},",
  "    'capteur (x1 lu 0,5 trop haut)': {'capteur': 0.5},",
  "    'concept (x2 change de signe)': {'poids': (1.5, -1.0, 0.0)},",
  "}",
  "lignes = []",
  "for nom, parametres in scenarios.items():",
  "    X, y = tirer(1000, 2, **parametres)",
  "    ligne = {'scénario': nom, 'exactitude': round(accuracy_score(y, modele.predict(X)), 3)}",
  "    for c in NOMS:",
  "        ligne['KS p ' + c] = f\"{stats.ks_2samp(X_ref[c], X[c]).pvalue:.2g}\"",
  "        ligne['PSI ' + c] = round(psi(X_ref[c], X[c]), 3)",
  "    lignes.append(ligne)",
  "print(pd.DataFrame(lignes).set_index('scénario').T.to_string())",
);

const DEMO2 = lines(
  "rng = np.random.default_rng(7)",
  "n_variables, n_essais = 50, 60",
  "brutes, corrigees = [], []",
  "for _ in range(n_essais):",
  "    # aucune dérive : référence et nouveauté viennent de la même loi",
  "    ref = rng.normal(size=(1000, n_variables))",
  "    nouveau = rng.normal(size=(500, n_variables))",
  "    p = stats.ks_2samp(ref, nouveau, axis=0).pvalue       # un test par colonne, en un seul appel",
  "    brutes.append((p < 0.05).sum())                       # seuil de 5 % pour chaque variable",
  "    corrigees.append((p < 0.05 / n_variables).sum())      # seuil divisé par le nombre de variables",
  "brutes, corrigees = np.array(brutes), np.array(corrigees)",
  "print(f'seuil 5 % : {brutes.mean():.2f} fausses alertes par contrôle en moyenne, au moins une dans {(brutes > 0).mean():.0%} des contrôles')",
  "print(f'seuil corrigé : {corrigees.mean():.2f} fausse alerte par contrôle en moyenne, au moins une dans {(corrigees > 0).mean():.0%} des contrôles')",
);

const DEMO3 = lines(
  "fixe = LogisticRegression().fit(*lots[0])          # entraîné une fois, sur la première période",
  "resultats = []",
  "for t in range(2, T):",
  "    X_t, y_t = lots[t]                             # la période à prédire ; ses étiquettes arrivent après coup",
  "    historique = LogisticRegression().fit(XH.iloc[:500 * t], yH[:500 * t])               # tout le passé",
  "    fenetre = LogisticRegression().fit(XH.iloc[500 * (t - 2):500 * t], yH[500 * (t - 2):500 * t])   # deux dernières périodes",
  "    resultats.append({'période': t,",
  "                      'jamais réentraîné': accuracy_score(y_t, fixe.predict(X_t)),",
  "                      'tout l historique': accuracy_score(y_t, historique.predict(X_t)),",
  "                      'fenêtre de 2': accuracy_score(y_t, fenetre.predict(X_t))})",
  "tableau = pd.DataFrame(resultats).set_index('période')",
  "print(tableau.round(3).to_string())",
  "print('moyenne :'); print(tableau.mean().round(3).to_string())",
);

export const moduleSurveillerDerive: LessonModule = {
  id: "surveiller-derive",
  title: "Surveiller la dérive et réentraîner",
  duration: "2 h 30",
  summary: "Un modèle vieillit sans que son code change : le monde bouge. Détecter la dérive des entrées avec le test de Kolmogorov-Smirnov et l'indice de stabilité de population, comprendre qu'une alerte n'est pas une perte de performance et qu'une perte peut survenir sans alerte, maîtriser les fausses alertes, et réentraîner sur une fenêtre récente.",
  objectives: [
    "Distinguer la dérive des entrées de la dérive de concept, et dire ce que chacune casse",
    "Détecter une dérive avec le test de Kolmogorov-Smirnov et l'indice de stabilité de population (PSI), codé en NumPy",
    "Mesurer les fausses alertes quand on teste beaucoup de variables et les limiter par une correction",
    "Réentraîner sur une fenêtre récente et mesurer le gain, en sachant ce qui peut mal tourner",
  ],
  sections: [
    {
      kind: "text",
      md: `### Un modèle vieillit sans que son code change

Un modèle apprend sur le passé et sert dans le présent. Tant que le présent ressemble au passé, tout va bien. Puis une clientèle change, un capteur est remplacé, une loi modifie un comportement : le code est le même, les prédictions se dégradent. On parle de **dérive** (*drift*). Trois situations se distinguent, car elles n'appellent pas la même réaction :

- la **dérive des entrées** (ou des covariables) : la distribution des variables change. Les clients sont plus jeunes, une mesure monte ;
- la **dérive de concept** : la relation entre les variables et ce qu'on prédit change. Les mêmes entrées n'ont plus le même sens ;
- la **dérive des étiquettes** : la part de chaque classe change (la fraude double). Nous ne l'étudions pas ici.

La difficulté est que la vérité arrive en retard. Savoir si un prêt est remboursé, si un client est parti, prend des mois. En attendant, on ne voit que les **entrées**, et on surveille leur distribution comme signe avant-coureur. Ce module montre ce que ce signe vaut et ce qu'il ne vaut pas.

Tout le module repose sur une **simulation avec graine** : trois variables normales (\`x1\`, \`x2\`, \`x3\`), une étiquette qui vaut 1 quand \`1,5 x1 + x2\` plus un bruit est positif (\`x3\` n'a aucun rôle). On l'a choisie parce qu'elle permet de **provoquer** chaque dérive et de savoir la vérité, ce qu'aucun jeu réel n'offre. En contrepartie, elle est bien plus sage que la réalité : un seul échantillon par scénario, aucune saison, aucune corrélation entre variables.`,
    },
    {
      kind: "text",
      md: `### Deux outils pour comparer des distributions

Pour dire si les données du moment ressemblent à la **référence** (les données d'entraînement), on compare deux distributions variable par variable. Deux outils classiques.

Le **test de Kolmogorov-Smirnov** (KS) compare les deux fonctions de répartition et retient leur plus grand écart \`D\`. Il donne une *p-valeur* : la probabilité d'un écart au moins aussi grand si les deux échantillons venaient de la même loi. Une p-valeur petite signale une différence. Avec \`scipy.stats.ks_2samp\`, il ne suppose aucune forme de loi.`,
    },
    {
      kind: "equation",
      latex: "D = \\max_{x} \\left| F_{\\mathrm{ref}}(x) - F_{\\mathrm{nouv}}(x) \\right|",
      caption: "F est la fonction de répartition empirique : la part des valeurs inférieures ou égales à x. D vaut 0 pour deux échantillons identiques et tend vers 1 quand ils ne se recouvrent plus.",
    },
    {
      kind: "text",
      md: `L'**indice de stabilité de population** (PSI) vient de la pratique du risque de crédit. On découpe la variable en \`K\` classes d'après la référence (souvent ses déciles, donc 10 classes de 10 % chacune), on compte la part \`p\` de la référence et la part \`q\` des nouvelles données dans chaque classe, et on additionne :`,
    },
    {
      kind: "equation",
      latex: "\\mathrm{PSI} = \\sum_{k=1}^{K} \\left( q_k - p_k \\right) \\ln \\frac{q_k}{p_k}",
      caption: "Chaque terme est positif ou nul, car (q - p) et ln(q / p) ont toujours le même signe. Le PSI vaut 0 si les parts sont identiques et grandit quand elles s'écartent. Une classe vide (q = 0) rendrait le logarithme infini : on borne les parts à un petit minimum, 0,0001 ici.",
    },
    {
      kind: "text",
      md: `Une règle empirique, née dans la pratique du crédit et sans justification théorique, lit le PSI ainsi : **moins de 0,1**, stable ; **de 0,1 à 0,25**, à surveiller ; **plus de 0,25**, changement notable. Ce sont des repères pour fixer un premier seuil d'alerte, que l'on ajuste ensuite à son cas. Contrairement à la p-valeur de KS, le PSI **ne dépend pas de la taille de l'échantillon** de la même façon : un échantillon énorme rend KS significatif pour des écarts sans importance pratique, quand le PSI mesure l'ampleur du changement.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `psi(reference, nouveau, n_classes=10, eps=1e-4)` : les classes sont les `n_classes` quantiles réguliers de la **référence** (la première classe va jusqu'à moins l'infini, la dernière jusqu'à plus l'infini) ; `p` et `q` sont les parts de la référence et des nouvelles données dans chaque classe, bornées en dessous par `eps` (`np.clip`) ; la fonction renvoie la somme de (q - p) ln(q / p).",
      setup: SIM,
      starter: lines(
  "def psi(reference, nouveau, n_classes=10, eps=1e-4):",
  "    return 0.0",
),
      solution: lines(
  "def psi(reference, nouveau, n_classes=10, eps=1e-4):",
  "    # classes : les déciles de la référence, la première et la dernière ouvertes vers l'infini",
  "    bords = np.quantile(reference, np.linspace(0, 1, n_classes + 1))",
  "    bords[0], bords[-1] = -np.inf, np.inf",
  "    p = np.histogram(reference, bords)[0] / len(reference)",
  "    q = np.histogram(nouveau, bords)[0] / len(nouveau)",
  "    p, q = np.clip(p, eps, None), np.clip(q, eps, None)",
  "    return float(np.sum((q - p) * np.log(q / p)))",
  "",
  "print(round(psi(X_ref['x1'], tirer(1000, 2, population=0.5)[0]['x1']), 3))",
),
      test: lines(
  "assert abs(psi(X_ref['x1'], X_ref['x1'])) < 1e-9, \"comparée à elle-même, une variable a un PSI de 0 : les proportions p et q sont identiques\"",
  "_stable = psi(X_ref['x1'], tirer(1000, 2)[0]['x1'])",
  "assert _stable < 0.05, f\"un nouvel échantillon de la même loi doit rester sous 0,05, pas {_stable:.3f}\"",
  "_decale = psi(X_ref['x1'], tirer(1000, 2, population=0.5)[0]['x1'])",
  "assert 0.29 < _decale < 0.31, f\"pour x1 décalée de 0,5, le PSI attendu est d'environ 0,30 (déciles de la référence), pas {_decale:.3f}\"",
  "_loin = psi(X_ref['x1'], X_ref['x1'] + 100)",
  "assert np.isfinite(_loin) and _loin > 1, \"des données toutes hors de la référence doivent donner un PSI fini et grand : bornez les proportions avec np.clip(…, eps, None)\"",
  "_grosses = psi(X_ref['x1'], tirer(1000, 2, population=0.5)[0]['x1'], n_classes=5)",
  "assert abs(_grosses - _decale) > 1e-6, \"n_classes doit changer le nombre de classes (np.linspace(0, 1, n_classes + 1))\"",
),
      hint: "np.quantile(reference, np.linspace(0, 1, n_classes + 1)) donne les bords ; remplacez le premier et le dernier par -np.inf et np.inf ; np.histogram(valeurs, bords)[0] compte par classe.",
    },
    {
      kind: "text",
      md: `### Quatre mondes, une seule maquette

Le modèle (une régression logistique) est entraîné sur 2 000 cas de référence. On lui présente ensuite 1 000 nouveaux cas dans quatre situations :

- **stable** : rien n'a changé ;
- **population** : le monde a changé, \`x1\` est plus élevée de 0,5 en moyenne, et l'étiquette suit toujours la même règle ;
- **capteur** : le monde n'a pas changé, mais l'instrument de mesure de \`x1\` lit 0,5 de trop. L'étiquette dépend de la vraie \`x1\`, que le modèle ne voit plus ;
- **concept** : les entrées ne changent pas, mais l'effet de \`x2\` s'inverse (son poids passe de +1 à -1).

On calcule, pour chaque variable, la p-valeur de KS et le PSI, et l'exactitude réelle du modèle, que dans la vie on ne connaîtrait qu'avec retard.`,
    },
    {
      kind: "code",
      language: "python",
      setup: SIM,
      code: DEMO1,
      caption: "Sur des données comme celles de la référence, l'exactitude est de 0,844. Scénario stable : 0,829 (l'écart de 1,5 point avec 0,844 est le bruit d'un échantillon de 1 000), p-valeurs de KS de 0,086, 0,32 et 0,071 pour x1, x2, x3, PSI de 0,016, 0,023 et 0,009 : aucune alerte. Population : KS donne 7,3e-33 pour x1 et son PSI monte à 0,302 (au-dessus du repère de 0,25), mais l'exactitude est de 0,839, aucune perte. Capteur : les mêmes alertes sur x1, avec cette fois une exactitude de 0,786, soit environ 4 points de perdus. Concept : aucune alerte (mêmes p-valeurs et PSI que le stable) et une exactitude de 0,624.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Trois leçons de ce tableau. **Une alerte n'est pas une panne** : dans le scénario « population », x1 a nettement bougé et le modèle va très bien, car la règle qui lie x1 à l'étiquette n'a pas changé. **Une panne peut ne déclencher aucune alerte** : dans le scénario « concept », les entrées sont intactes, et l'exactitude s'effondre de 0,83 à 0,62. **Deux scénarios identiques pour les alarmes** (population et capteur) **diffèrent pour la performance** : seule la comparaison avec les étiquettes réelles, quand elles arrivent, tranche. Surveiller les entrées prévient tôt, mais ne remplace pas de mesurer la performance dès que la vérité est connue.",
    },
    {
      kind: "text",
      md: `### Tester beaucoup de variables : les fausses alertes

Un vrai modèle a des dizaines de variables. Tester chacune au seuil habituel de 5 % pose un problème de **multiplicité** : même si rien n'a changé, chaque test a 5 % de chances de crier. Sur 50 variables, on s'attend à 50 × 0,05 = 2,5 fausses alertes par contrôle, et à ce qu'au moins une survienne presque à chaque fois (1 - 0,95^50, soit environ 92 %). Une surveillance qui sonne tout le temps finit par ne plus être écoutée.

Le remède le plus simple est la **correction de Bonferroni** : diviser le seuil par le nombre de tests, ici 0,05 / 50 = 0,001. Elle est prudente (elle laisse passer quelques vraies dérives faibles) mais efficace contre le bruit. D'autres corrections existent, moins sévères. On le mesure : 60 contrôles de 50 variables **sans aucune dérive** (une référence de 1 000 cas, 500 nouveaux cas, tirés de la même loi).`,
    },
    {
      kind: "code",
      language: "python",
      setup: SIM,
      code: DEMO2,
      caption: "Avec le seuil de 5 % sur chaque variable, il y a en moyenne 2,57 fausses alertes par contrôle (attendu : 2,5) et au moins une dans 90 % des contrôles (attendu : 92 %). Avec le seuil corrigé, 0,05 fausse alerte par contrôle en moyenne et au moins une dans 5 % des contrôles seulement. Soixante contrôles ne donnent qu'une estimation approximative : le pourcentage bouge de quelques points avec la graine.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `colonnes_en_derive(reference, nouveau, alpha=0.05)` : elle reçoit deux tableaux pandas aux mêmes colonnes et renvoie la **liste des noms de colonnes** dont la p-valeur du test de Kolmogorov-Smirnov est inférieure à `alpha` divisé par le nombre de colonnes (correction de Bonferroni).",
      setup: SIM,
      starter: lines(
  "def colonnes_en_derive(reference, nouveau, alpha=0.05):",
  "    return []",
),
      solution: lines(
  "def colonnes_en_derive(reference, nouveau, alpha=0.05):",
  "    p = stats.ks_2samp(reference, nouveau, axis=0).pvalue      # un p par colonne",
  "    seuil = alpha / reference.shape[1]                         # correction de Bonferroni",
  "    return [c for c, pc in zip(reference.columns, p) if pc < seuil]",
  "",
  "print(colonnes_en_derive(X_ref, tirer(1000, 2, population=0.5)[0]))",
),
      test: lines(
  "assert colonnes_en_derive(X_ref, tirer(1000, 2)[0]) == [], \"sans dérive, aucune colonne ne doit être signalée\"",
  "_r = colonnes_en_derive(X_ref, tirer(1000, 2, population=0.5)[0])",
  "assert _r == ['x1'], f\"seule x1 a dérivé, la liste doit être ['x1'], pas {_r}\"",
  "_rng = np.random.default_rng(7)",
  "_noms = [f'v{j}' for j in range(50)]",
  "_ref50 = pd.DataFrame(_rng.normal(size=(1000, 50)), columns=_noms)",
  "_nouv50 = pd.DataFrame(_rng.normal(size=(500, 50)), columns=_noms)",
  "_r50 = colonnes_en_derive(_ref50, _nouv50)",
  "assert _r50 == [], f\"50 variables sans aucune dérive : avec un seuil de 5 % chacune, deux fausses alertes apparaissent ici ; divisez le seuil par le nombre de colonnes (Bonferroni). Colonnes signalées : {_r50}\"",
),
      hint: "stats.ks_2samp(reference, nouveau, axis=0).pvalue donne une p-valeur par colonne. Le seuil est alpha / reference.shape[1].",
    },
    {
      kind: "text",
      md: `### Réentraîner : sur quoi, et quand

Quand la dérive est confirmée, la réponse habituelle est de **réentraîner** le modèle. Mais sur quoi ? Trois choix :

- **ne jamais réentraîner** : le modèle vieillit ;
- réentraîner sur **tout l'historique** : beaucoup de données, mais l'ancien monde pèse autant que le nouveau ;
- réentraîner sur une **fenêtre récente** : moins de données, mais plus proches du présent.

Simulons une dérive de concept **progressive** : douze périodes de 500 cas, où le poids de \`x2\` passe doucement de +1 à -1. À chaque période, on prédit avec le modèle disponible, et on regarde l'exactitude. Les étiquettes d'une période ne servent qu'à entraîner les suivantes : on ne triche pas en les utilisant d'avance.`,
    },
    {
      kind: "code",
      language: "python",
      setup: SIM,
      code: lines(
        LOTS,
        "",
        DEMO3,
      ),
      caption: "Sur les dix périodes évaluées, le modèle jamais réentraîné tombe de 0,784 à 0,612 à la dernière période, avec une moyenne de 0,708. Celui qui réentraîne sur tout l'historique perd moins (0,744 à la dernière, moyenne de 0,761) : le passé lointain le tire en arrière. La fenêtre des deux dernières périodes suit le mouvement : 0,838 à la dernière, moyenne de 0,810. Un seul scénario simulé, une dérive régulière et lente : sur une dérive brutale, ou qui revient en arrière, le classement peut changer.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `modele_fenetre(X, y, taille)` : elle entraîne et renvoie une `LogisticRegression` sur les **`taille` dernières lignes seulement** (les plus récentes) de `X` (un tableau pandas) et de `y` (un tableau NumPy).",
      setup: lines(SIM, "", LOTS),
      starter: lines(
  "def modele_fenetre(X, y, taille):",
  "    return LogisticRegression().fit(X, y)",
),
      solution: lines(
  "def modele_fenetre(X, y, taille):",
  "    # seules les `taille` dernières lignes (les plus récentes) servent à l'entraînement",
  "    return LogisticRegression().fit(X.iloc[-taille:], y[-taille:])",
  "",
  "modele_recent = modele_fenetre(XH.iloc[:-500], yH[:-500], 1000)",
  "X_der, y_der = lots[-1]",
  "print('exactitude sur la dernière période :', round(accuracy_score(y_der, modele_recent.predict(X_der)), 3))",
),
      test: lines(
  "_passe_X, _passe_y = XH.iloc[:-500], yH[:-500]",
  "_m = modele_fenetre(_passe_X, _passe_y, 1000)",
  "_attendu = LogisticRegression().fit(XH.iloc[-1500:-500], yH[-1500:-500])",
  "assert np.allclose(_m.coef_, _attendu.coef_), \"le modèle doit être entraîné sur les 1000 dernières lignes seulement : X.iloc[-taille:] et y[-taille:]\"",
  "_tout = LogisticRegression().fit(_passe_X, _passe_y)",
  "_X_der, _y_der = lots[-1]",
  "_gain = accuracy_score(_y_der, _m.predict(_X_der)) - accuracy_score(_y_der, _tout.predict(_X_der))",
  "assert _gain > 0.05, f\"sur la dernière période, la fenêtre doit battre le modèle de tout l'historique d'au moins 5 points (écart mesuré : {_gain:.3f})\"",
),
      hint: "X.iloc[-taille:] garde les dernières lignes d'un tableau pandas ; y[-taille:] celles d'un tableau NumPy.",
    },
    {
      kind: "text",
      md: `### Réentraîner sans se tirer une balle dans le pied

Un réentraînement automatique déclenché à chaque alerte est une mauvaise idée. Quelques garde-fous :

- **Chercher la cause d'abord.** Dans le scénario « capteur », réentraîner sur les mesures faussées apprendrait la panne et la rendrait invisible. Une alerte appelle une enquête (le capteur, l'extraction des données, un changement de définition) avant un réentraînement.
- **Valider le nouveau modèle comme n'importe quel candidat**, avec les tests du module précédent : seuil, direction, non-régression. Un modèle réentraîné peut être pire que le précédent.
- **Garder l'ancienne version** pour revenir en arrière, et noter laquelle répond (la version figure dans chaque réponse du service).
- **Choisir la taille de la fenêtre** comme un réglage : trop courte, le modèle est bruité ; trop longue, il est en retard. Ici 1 000 cas ; sur d'autres données, cela se teste.
- **Compter avec le retard des étiquettes.** On ne peut entraîner que sur ce dont on connaît déjà la vérité.`,
    },
    {
      kind: "note",
      tone: "info",
      md: "Une simulation n'est pas une preuve pour votre cas. Avec des données réelles, les entrées sont corrélées, les saisons existent, et les dérives se mélangent. Le bon réflexe est de s'en servir comme **banc d'essai** de la surveillance : provoquer chaque dérive sur vos propres données historiques, vérifier que l'outil sonne quand il faut et se tait quand il faut, avant de lui confier la production.",
    },
  ],
  quiz: [
    {
      question: "Dans la simulation, les entrées n'ont pas bougé mais l'exactitude du modèle passe de 0,83 à 0,62. De quelle dérive s'agit-il, et la détecte-t-on avec KS sur les entrées ?",
      options: [
        "Dérive des entrées, et KS la détecte",
        "Dérive de concept : la relation a changé, KS sur les entrées ne la voit pas",
        "Dérive des étiquettes, et KS la détecte",
        "Aucune dérive : c'est seulement le hasard de l'échantillon",
      ],
      correct: 1,
      explanation: "Quand c'est la relation entre les variables et l'étiquette qui change, la distribution des entrées reste la même et les tests sur les entrées ne sonnent pas. Seule la mesure de la performance, avec les vraies étiquettes, la révèle.",
    },
    {
      question: "Dans le scénario « population », x1 monte de 0,5 : KS et le PSI sonnent, mais l'exactitude ne baisse pas. Pourquoi ?",
      options: [
        "Parce que les tests de dérive se trompent toujours",
        "Parce que la règle qui lie x1 à l'étiquette n'a pas changé : le modèle reste valable dans la nouvelle zone",
        "Parce que 1 000 cas ne suffisent pas pour mesurer une exactitude",
        "Parce que la graine aléatoire est fixée",
      ],
      correct: 1,
      explanation: "Une dérive des entrées ne casse le modèle que si celui-ci est mal adapté aux nouvelles valeurs (extrapolation, relation non linéaire). Ici le modèle est linéaire et la règle est restée la même : l'alerte est justifiée, la perte ne l'est pas.",
    },
    {
      question: "On teste 50 variables sans aucune dérive, avec un seuil de 5 % pour chacune. Combien de fausses alertes attend-on en moyenne par contrôle ?",
      options: [
        "Aucune, puisqu'il n'y a pas de dérive",
        "Environ 0,05",
        "Environ 25",
        "Environ 2,5",
      ],
      correct: 3,
      explanation: "Chaque test se trompe une fois sur vingt quand rien n'a changé : 50 × 0,05 = 2,5. L'exemple du module en mesure 2,57 sur 60 contrôles.",
    },
    {
      question: "Que fait la correction de Bonferroni, et quel est son prix ?",
      options: [
        "Elle divise le seuil par le nombre de tests ; elle réduit les fausses alertes mais peut laisser passer de petites vraies dérives",
        "Elle multiplie le seuil par le nombre de tests ; elle détecte tout mais coûte plus cher en calcul",
        "Elle supprime les variables qui ont dérivé",
        "Elle remplace le test de Kolmogorov-Smirnov par le PSI",
      ],
      correct: 0,
      explanation: "En divisant le seuil par le nombre de tests (0,05 / 50 = 0,001 ici), on garde environ 5 % de chances d'au moins une fausse alerte par contrôle, au prix d'une sensibilité moindre aux dérives faibles.",
    },
    {
      question: "Dans le scénario « capteur », pourquoi vaut-il mieux enquêter que réentraîner aussitôt sur les nouvelles mesures ?",
      options: [
        "Parce que réentraîner est toujours interdit",
        "Parce que le réentraînement est trop long",
        "Parce que le modèle apprendrait la panne du capteur comme si c'était la réalité, et la rendrait invisible",
        "Parce que la dérive disparaît d'elle-même",
      ],
      correct: 2,
      explanation: "Une mesure fausse n'est pas un changement du monde. Réentraîner dessus intègre l'erreur au modèle. Réparer la mesure est la bonne réponse, pas adapter le modèle à la panne.",
    },
    {
      question: "Pourquoi la fenêtre récente fait-elle mieux que tout l'historique dans l'exemple de dérive progressive ?",
      options: [
        "Parce qu'elle contient plus de données",
        "Parce que les anciennes périodes, où la relation était différente, tirent l'historique en arrière ; la fenêtre ne garde que le présent",
        "Parce qu'elle n'utilise jamais d'étiquettes",
        "Parce qu'elle est toujours meilleure, quelle que soit la dérive",
      ],
      correct: 1,
      explanation: "Quand le monde change régulièrement, les vieux exemples décrivent une relation qui n'existe plus. Le prix d'une fenêtre est qu'elle a moins de données, et rien ne garantit qu'elle gagne si la dérive est brutale ou cyclique.",
    },
  ],
};
