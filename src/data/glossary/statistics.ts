/**
 * Statistical Methods and Concepts
 * Core statistical concepts used in data science
 */

import { GlossaryEntry } from './types';

export const statisticsTerms: GlossaryEntry[] = [
  {
    term: "Statistiques",
    description: `Les statistiques sont la discipline qui recueille, résume et interprète des données afin de décrire une situation ou de décider malgré l'incertitude.

**Principe :**
- Collecter : définir ce que l'on veut mesurer et sur qui (plan d'étude, échantillonnage).
- Décrire : résumer les données observées (moyenne, médiane, écart-type, graphiques).
- Analyser : estimer, tester des hypothèses, modéliser.
- Communiquer : présenter les résultats avec leur incertitude.

**Deux grandes branches :**
- La statistique descriptive résume les données dont on dispose.
- La statistique inférentielle généralise d'un échantillon à une population, avec une marge d'erreur chiffrée (intervalles de confiance, tests).

**Exemple :** un sondage auprès de 1 000 personnes donne un pourcentage observé (description), puis un intervalle de confiance pour l'ensemble de la population (inférence).

**Limites :**
- Un résultat ne vaut que par la qualité des données : un échantillon biaisé reste biaisé, même s'il est grand.
- Une association observée n'établit pas à elle seule une relation de cause à effet.
- Un résultat « statistiquement significatif » n'est pas forcément important en pratique.`,
    category: "statistiques",
    icon: "BarChart3"
  },
  {
    term: "Population vs Échantillon",
    description: `La population est l'ensemble des unités sur lesquelles porte la question (tous les clients d'une entreprise, tous les patients atteints d'une maladie) ; l'échantillon est le sous-ensemble de cette population que l'on observe réellement.

**Principe :**
- Une grandeur calculée sur la population s'appelle un paramètre (moyenne μ, écart-type σ, proportion p). Calculée sur l'échantillon, c'est une statistique (x̄, s, p̂) qui sert à estimer le paramètre.
- Observer toute la population est souvent impossible ou trop coûteux, d'où l'échantillonnage.

**Méthodes d'échantillonnage :**
- Aléatoire simple : chaque unité a la même chance d'être tirée.
- Stratifié : on tire dans chaque sous-groupe (âge, région) pour le représenter.
- Par grappes : on tire des groupes entiers (écoles, magasins), puis on observe leurs membres.

**Exemple :** pour connaître la taille moyenne des adultes d'un pays, on mesure quelques milliers de personnes tirées au sort plutôt que tout le pays.

**Limites :**
- L'erreur due au hasard d'échantillonnage diminue quand la taille n augmente (de l'ordre de 1/√n), mais un biais de sélection ne disparaît pas en augmentant n.
- Un sondage auquel seules répondent les personnes motivées (biais d'auto-sélection) ne représente pas la population.`,
    category: "statistiques",
    icon: "Users"
  },
  {
    term: "Moyenne (Mean)",
    description: `La moyenne arithmétique est la somme des valeurs divisée par leur nombre : x̄ = (x₁ + x₂ + … + xₙ) / n. C'est le « point d'équilibre » des données.

**Propriétés :**
- Elle utilise toutes les valeurs.
- La somme des écarts à la moyenne est nulle.
- C'est la valeur qui minimise la somme des carrés des écarts, ce qui explique son rôle dans la variance et la régression.

**Exemple :** neuf personnes gagnent 30 k€ et une dixième 300 k€. La moyenne est (9 × 30 + 300) / 10 = 57 k€, un montant que presque personne ne gagne. La médiane, 30 k€, décrit mieux le groupe.

**Limites :**
- Elle est sensible aux valeurs extrêmes.
- Elle est peu parlante pour une distribution très asymétrique.

**Variantes :**
- Moyenne pondérée : certaines valeurs comptent davantage (notes avec coefficients).
- Moyenne géométrique : adaptée aux taux de croissance successifs.
- Moyenne harmonique : adaptée aux rapports, par exemple une vitesse moyenne sur des distances égales.`,
    category: "statistiques",
    icon: "BarChart3"
  },
  {
    term: "Médiane (Median)",
    description: `La médiane est la valeur qui partage les observations ordonnées en deux moitiés de même effectif : la moitié des valeurs lui est inférieure ou égale, l'autre moitié supérieure ou égale.

**Calcul :**
- On trie les valeurs par ordre croissant.
- Si n est impair, c'est la valeur centrale.
- Si n est pair, c'est la moyenne des deux valeurs centrales.

**Exemple :** avec neuf valeurs à 30 k€ et une à 300 k€, la médiane vaut 30 k€ alors que la moyenne vaut 57 k€. Ajouter un revenu extrême ne la déplace presque pas.

**En pratique :**
- On la préfère à la moyenne pour les données asymétriques ou comportant des valeurs extrêmes : salaires, prix immobiliers, temps de réponse.
- Pour une distribution étirée vers la droite, la moyenne est en général supérieure à la médiane ; l'inverse pour une distribution étirée vers la gauche. C'est une tendance, pas une règle absolue.

**Limites :**
- Elle ignore la valeur exacte des observations situées hors du centre.
- Elle se prête moins bien aux calculs théoriques que la moyenne.`,
    category: "statistiques",
    icon: "BarChart3"
  },
  {
    term: "Mode",
    description: `Le mode est la valeur (ou la modalité) la plus fréquente d'une série d'observations.

**Principe :**
- On compte les occurrences de chaque valeur ; le mode est celle qui apparaît le plus souvent.
- Pour une variable continue, on regroupe les valeurs en classes et l'on parle de classe modale.
- Une distribution est unimodale (un mode), bimodale (deux) ou multimodale. Plusieurs modes peuvent signaler le mélange de plusieurs sous-populations.

**Exemple :** dans une enquête sur les pointures, si la 42 apparaît 15 fois et aucune autre pointure davantage, le mode est 42. Pour une variable nominale comme la couleur préférée, le mode est le seul résumé central possible : il n'existe ni moyenne ni médiane.

**Limites :**
- Il peut ne pas être unique, ou être instable sur un petit échantillon.
- Il ne tient pas compte de l'ensemble de la distribution.
- Il est peu utilisé en statistique inférentielle.

**En pratique :** on l'utilise en complément de la moyenne et de la médiane, par exemple pour repérer le produit le plus vendu ou le défaut le plus fréquent.`,
    category: "statistiques",
    icon: "BarChart3"
  },
  {
    term: "Variance",
    description: `La variance mesure la dispersion des données autour de leur moyenne : c'est la moyenne des carrés des écarts à la moyenne.

**Formules :**
- Population : σ² = Σ(xᵢ − μ)² / N
- Échantillon : s² = Σ(xᵢ − x̄)² / (n − 1). Le diviseur n − 1 (correction de Bessel) évite de sous-estimer la variance de la population.

**Exemple :** pour 2, 4, 4, 4, 5, 5, 7, 9, la moyenne est 5 et la somme des carrés des écarts vaut 32. La variance de population est 32 / 8 = 4 ; la variance d'échantillon est 32 / 7 ≈ 4,57.

**Pourquoi des carrés ?** Les écarts positifs et négatifs ne s'annulent plus, et les grands écarts pèsent davantage.

**Limites :**
- L'unité est le carré de l'unité des données (des euros², par exemple), d'où l'usage de l'écart-type pour l'interprétation.
- Elle est sensible aux valeurs extrêmes.

**En pratique :** la variance intervient dans l'écart-type, la régression, l'ANOVA et la plupart des tests.`,
    category: "statistiques",
    icon: "BarChart3"
  },
  {
    term: "Écart-type (Standard Deviation)",
    description: `L'écart-type est la racine carrée de la variance : σ = √σ² (ou s = √s² pour un échantillon). Il mesure la dispersion dans la même unité que les données.

**Exemple :** pour 2, 4, 4, 4, 5, 5, 7, 9 (moyenne 5), la variance de population vaut 4 et l'écart-type 2 : les valeurs s'écartent typiquement de 2 unités de la moyenne.

**Règle empirique (loi normale) :** environ 68 % des valeurs se trouvent à moins de 1 écart-type de la moyenne, 95 % à moins de 2 et 99,7 % à moins de 3. Cette règle ne vaut que pour des données à peu près normales.

**En pratique :**
- Il permet de comparer la variabilité de deux séries exprimées dans la même unité.
- Il sert à standardiser : le score z = (x − x̄) / s indique de combien d'écarts-types une valeur s'éloigne de la moyenne.
- En finance, l'écart-type des rendements est une mesure courante de la volatilité.

**Limites :**
- Il est sensible aux valeurs extrêmes ; pour une distribution asymétrique, l'écart interquartile est plus robuste.
- Pour comparer des séries d'unités ou d'ordres de grandeur différents, on utilise le coefficient de variation (écart-type divisé par la moyenne, pour des valeurs positives).`,
    category: "statistiques",
    icon: "BarChart3"
  },
  {
    term: "Distribution normale (Gaussian)",
    description: `La distribution normale (ou loi de Laplace-Gauss) est une loi de probabilité continue, symétrique, dont la densité a la forme d'une cloche. Elle est entièrement définie par sa moyenne μ (position du centre) et son écart-type σ (largeur).

**Propriétés :**
- Moyenne, médiane et mode sont égaux à μ.
- Environ 68 % des valeurs sont à moins de 1σ de μ, 95 % à moins de 2σ, 99,7 % à moins de 3σ.
- Toute variable normale X se ramène à la loi normale centrée réduite (μ = 0, σ = 1) par Z = (X − μ) / σ.

**Pourquoi est-elle si présente ?** Le théorème central limite montre que la moyenne (ou la somme) d'un grand nombre de variables indépendantes, de variance finie, est approximativement normale, quelle que soit leur loi d'origine. C'est pourquoi les erreurs de mesure ou certaines grandeurs biologiques s'en approchent.

**Exemple :** la taille des adultes d'une population donnée est souvent bien approchée par une loi normale.

**Limites :**
- Beaucoup de phénomènes ne sont pas normaux : revenus, durées, nombres de visites sont asymétriques.
- Les queues de la loi normale sont fines : elle sous-estime parfois la fréquence des valeurs extrêmes.
- Il faut vérifier l'hypothèse (histogramme, diagramme quantile-quantile) avant d'employer des méthodes qui la supposent.`,
    category: "statistiques",
    icon: "TrendingUp"
  },
  {
    term: "Probabilité",
    description: `La probabilité est un nombre compris entre 0 et 1 qui quantifie la plausibilité qu'un événement se produise : 0 pour l'impossible, 1 pour le certain.

**Interprétations :**
- Classique : cas favorables divisés par cas possibles, quand tous les cas sont équiprobables (un dé équilibré donne 1/6 pour chaque face).
- Fréquentiste : limite de la fréquence observée quand l'expérience est répétée un grand nombre de fois.
- Bayésienne : degré de croyance, mis à jour avec les données.

**Règles de base :**
- P(non A) = 1 − P(A)
- P(A ou B) = P(A) + P(B) − P(A et B)
- P(A et B) = P(A) × P(B | A) ; si A et B sont indépendants, P(A et B) = P(A) × P(B)
- Théorème de Bayes : P(A | B) = P(B | A) × P(A) / P(B)

**Exemple :** la probabilité d'obtenir au moins un six en deux lancers de dé est 1 − (5/6)² = 11/36 ≈ 0,31.

**En pratique :** les probabilités fondent l'inférence statistique, les modèles probabilistes (régression logistique, classification) et la décision sous incertitude. Les lois usuelles (uniforme, binomiale, normale, Poisson) en sont les modèles de référence.`,
    category: "statistiques",
    icon: "Shuffle"
  },
  {
    term: "Test d'hypothèse",
    description: `Un test d'hypothèse est une procédure qui confronte une hypothèse de départ (l'hypothèse nulle H₀, souvent « pas d'effet ») aux données, pour décider si l'écart observé est plausible sous le seul effet du hasard.

**Démarche :**
1. Formuler H₀ et l'hypothèse alternative H₁.
2. Fixer le seuil de signification α avant de regarder les données (souvent 0,05).
3. Calculer une statistique de test à partir de l'échantillon.
4. En déduire la p-value.
5. Décider : si p < α, on rejette H₀ ; sinon on ne la rejette pas. Ne pas rejeter H₀ ne démontre pas qu'elle est vraie, seulement que les données ne suffisent pas à la contredire.

**Tests courants :** test t de Student (comparer des moyennes), test du χ² (indépendance de deux variables qualitatives), ANOVA (comparer plusieurs moyennes).

**Analogie :** comme dans un procès, H₀ est maintenue tant que les données ne la contredisent pas assez. Les deux erreurs possibles sont décrites à l'entrée « Erreurs de type I et de type II ».

**Exemple :** dans un test A/B, H₀ dit que deux versions d'une page ont le même taux de conversion ; on la rejette si l'écart observé serait très improbable dans ce cas.

**Limites :**
- Un résultat significatif n'implique pas un effet important : on regarde aussi la taille d'effet et l'intervalle de confiance.
- Chaque test suppose des conditions (indépendance, forme de la distribution, taille d'échantillon) à vérifier.
- Multiplier les tests augmente le risque de faux positifs.`,
    category: "statistiques",
    icon: "CheckCircle"
  },
  {
    term: "P-value",
    description: `La p-value est la probabilité, calculée en supposant l'hypothèse nulle H₀ vraie, d'obtenir un résultat au moins aussi extrême que celui observé.

**Exemple :** on lance 100 fois une pièce et l'on obtient 70 faces. Si la pièce est équilibrée, la probabilité d'obtenir 70 faces ou plus est d'environ 0,00004 (0,00008 en bilatéral, en comptant aussi 70 piles ou plus). Ce résultat serait très surprenant sous H₀, ce qui incite à douter que la pièce soit équilibrée.

**Lecture :**
- Une p-value petite indique que les données sont peu compatibles avec H₀.
- On rejette H₀ si p est inférieure au seuil α fixé à l'avance (0,05 par convention, sans justification théorique particulière).

**Ce que la p-value n'est pas :**
- Ce n'est pas la probabilité que H₀ soit vraie.
- Ce n'est pas la probabilité de se tromper.
- Elle ne mesure ni la taille ni l'importance d'un effet.

**Pièges :** tester de nombreuses hypothèses jusqu'à en trouver une avec p < 0,05 (« p-hacking ») produit des faux positifs, et la p-value dépend aussi de la taille de l'échantillon. En 2016, l'American Statistical Association a publié une mise au point sur son usage (Wasserstein et Lazar, 2016).

**En pratique :** on l'accompagne d'une taille d'effet et d'un intervalle de confiance.`,
    category: "statistiques",
    icon: "Divide"
  },
  {
    term: "Intervalle de confiance",
    description: `Un intervalle de confiance est une plage de valeurs, calculée à partir d'un échantillon, qui vise à encadrer un paramètre inconnu de la population (une moyenne, une proportion) avec un niveau de confiance donné, par exemple 95 %.

**Construction :** estimation ± marge d'erreur. Pour une moyenne et un grand échantillon, x̄ ± 1,96 × s / √n au niveau de 95 % (le coefficient vaut 1,645 pour 90 % et 2,576 pour 99 %). Pour un petit échantillon, on remplace 1,96 par un quantile de la loi de Student.

**Interprétation correcte :** si l'on répétait l'étude un grand nombre de fois, environ 95 % des intervalles ainsi construits contiendraient la vraie valeur. Le paramètre est fixe ; c'est l'intervalle qui varie d'un échantillon à l'autre. Dire « il y a 95 % de chances que la vraie valeur soit dans cet intervalle déjà calculé » relève d'une lecture bayésienne, pas de l'intervalle de confiance classique.

**Exemple :** un sondage de 1 000 personnes donne 52 % d'intentions de vote. La marge d'erreur à 95 % est d'environ 1,96 × √(0,52 × 0,48 / 1000) ≈ 3,1 points : l'intervalle va d'environ 49 % à 55 %.

**Largeur :**
- Elle diminue quand la taille de l'échantillon augmente (en 1/√n).
- Elle augmente avec la variabilité des données et avec le niveau de confiance exigé.

**Limites :** l'intervalle ne corrige ni un biais d'échantillonnage ni un modèle inadapté ; il ne couvre que l'incertitude due au hasard d'échantillonnage.`,
    category: "statistiques",
    icon: "Target"
  },
  {
    term: "Corrélation",
    description: `La corrélation mesure l'intensité et le sens de l'association entre deux variables. Le coefficient de Pearson, noté r, mesure plus précisément leur association linéaire.

**Coefficient de Pearson :** r = covariance(X, Y) / (σₓ × σᵧ), compris entre −1 et +1.
- r proche de +1 : quand X augmente, Y tend à augmenter.
- r proche de −1 : quand X augmente, Y tend à diminuer.
- r proche de 0 : pas d'association linéaire. Cela n'exclut pas une relation non linéaire, par exemple en forme de U.

**Autres coefficients :** Spearman (corrélation des rangs, adaptée aux relations monotones et peu sensible aux valeurs extrêmes) et Kendall (concordance des paires de rangs).

**Lecture :** les seuils « faible », « modérée », « forte » sont des conventions qui dépendent du domaine. Il vaut mieux regarder le nuage de points : les quatre jeux de données du quartet d'Anscombe (Anscombe, 1973) ont presque la même corrélation (environ 0,82) pour des graphiques très différents.

**Pièges :**
- Corrélation n'est pas causalité : une troisième variable (facteur de confusion) ou le hasard peuvent expliquer l'association.
- Quelques valeurs extrêmes peuvent créer ou masquer une corrélation.
- Une corrélation observée sur des moyennes de groupes ne s'applique pas forcément aux individus.

**En pratique :** une matrice de corrélation sert à explorer un jeu de données et à repérer des variables redondantes (multicolinéarité) avant une régression.`,
    category: "statistiques",
    icon: "GitBranch"
  },
  {
    term: "Régression",
    description: `La régression regroupe les méthodes qui modélisent une variable à expliquer (Y) en fonction d'une ou plusieurs variables explicatives (X), pour décrire la relation ou prédire Y.

**Régression linéaire :** Y = a + b·X + erreur. Les coefficients sont choisis par les moindres carrés ordinaires : on minimise la somme des carrés des résidus, c'est-à-dire des écarts entre valeurs observées et valeurs prédites.

**Variantes :**
- Multiple : plusieurs variables explicatives.
- Polynomiale : termes en X², X³… (encore linéaire en ses coefficients).
- Logistique : cible binaire, le modèle estime une probabilité ; elle sert à classer malgré son nom.
- Ridge et lasso : régularisation pour limiter le surapprentissage.

**Exemple :** prédire le prix d'un logement d'après sa surface. Le coefficient de la surface s'interprète comme la variation moyenne de prix associée à 1 m² de plus, les autres variables restant fixes.

**Évaluation :** R² (part de la variance de Y expliquée), RMSE (erreur typique), graphique des résidus, validation sur des données non utilisées pour l'ajustement.

**Limites :**
- Le modèle linéaire classique suppose une relation linéaire, des erreurs indépendantes, une variance constante et des résidus à peu près normaux (pour les tests et les intervalles).
- Une association n'est pas une causalité.
- Extrapoler hors de l'étendue des données est risqué.`,
    category: "statistiques",
    icon: "TrendingUp"
  },
  {
    term: "Statistiques bayésiennes (Bayesian Statistics)",
    description: `Les statistiques bayésiennes traitent la probabilité comme un degré de croyance, que l'on met à jour avec les données grâce au théorème de Bayes. Elles s'opposent à l'approche fréquentiste, où la probabilité est la fréquence à long terme d'un événement.

**Principe :** P(H | D) = P(D | H) × P(H) / P(D)
- P(H) : probabilité a priori, ce que l'on pense avant les données.
- P(D | H) : vraisemblance, probabilité des données si H est vraie.
- P(H | D) : probabilité a posteriori, croyance mise à jour.

L'a posteriori d'une analyse peut servir d'a priori à la suivante.

**Exemple :** une maladie touche 1 % de la population. Un test la détecte dans 90 % des cas (sensibilité) et donne un faux positif dans 5 % des cas sains. Après un test positif, la probabilité d'être malade est 0,9 × 0,01 / (0,9 × 0,01 + 0,05 × 0,99) ≈ 15 %, bien moins que ce que l'intuition suggère, parce que la maladie est rare.

**Atouts :**
- L'incertitude est résumée par une distribution complète (intervalles crédibles).
- On peut intégrer une connaissance préalable, utile quand les données sont peu nombreuses.

**Limites :**
- Le choix de l'a priori influence le résultat : on teste la sensibilité à ce choix.
- Les calculs passent souvent par des méthodes numériques (MCMC), parfois lentes.

**Outils :** Stan, PyMC.`,
    category: "statistiques",
    icon: "RefreshCw"
  },
  {
    term: "Quantiles/Percentiles/Quartiles",
    description: `Un quantile d'ordre p est une valeur en dessous de laquelle se trouve une proportion p des observations. Les quantiles décrivent la position d'une valeur dans la distribution, sans hypothèse sur sa forme.

**Cas particuliers :**
- Percentiles : 99 valeurs qui découpent les données en 100 parts ; le 90ᵉ percentile est dépassé par environ 10 % des observations.
- Quartiles : Q1 (25ᵉ percentile), Q2 (médiane, 50ᵉ) et Q3 (75ᵉ).
- Déciles : 9 valeurs qui découpent les données en 10 parts.

**Écart interquartile (IQR) :** Q3 − Q1. Il mesure la dispersion du centre des données et résiste aux valeurs extrêmes. La règle de Tukey signale comme atypiques les valeurs situées hors de [Q1 − 1,5 × IQR ; Q3 + 1,5 × IQR], ce que montre une boîte à moustaches.

**Exemple :** un temps de réponse de 200 ms au 95ᵉ percentile signifie que 95 % des requêtes sont traitées en 200 ms ou moins. C'est plus informatif que la moyenne quand quelques requêtes sont très lentes.

**Limites :** il existe plusieurs conventions de calcul (interpolation entre deux valeurs voisines). Selon la méthode choisie, les résultats peuvent différer légèrement sur de petits échantillons.`,
    category: "statistiques",
    icon: "BarChart3"
  },
  {
    term: "Erreurs de type I et de type II (Type I & II Errors)",
    description: `Lors d'un test d'hypothèse, deux erreurs sont possibles.

**Erreur de type I (faux positif) :** rejeter H₀ alors qu'elle est vraie. Sa probabilité est le seuil α, fixé à l'avance (souvent 0,05).

**Erreur de type II (faux négatif) :** ne pas rejeter H₀ alors qu'elle est fausse. Sa probabilité est β. La puissance du test, 1 − β, est la probabilité de détecter un effet réel.

**Résumé :**
- H₀ vraie et rejetée : erreur de type I.
- H₀ fausse et non rejetée : erreur de type II.
- Les deux autres cas sont des décisions correctes.

**Compromis :** pour une taille d'échantillon donnée, diminuer α augmente β. La puissance augmente avec la taille d'échantillon, la taille de l'effet à détecter et α, et diminue avec la variabilité des données. Un calcul de puissance avant l'étude permet de choisir la taille d'échantillon.

**Exemple :** pour un médicament, un faux positif conduit à adopter un traitement sans effet ; un faux négatif conduit à abandonner un traitement utile.

**Tests multiples :** avec 20 tests indépendants au seuil de 5 % et aucun effet réel, la probabilité d'obtenir au moins un faux positif est 1 − 0,95²⁰ ≈ 64 %. On corrige par la méthode de Bonferroni (seuil α/m pour m tests) ou en contrôlant le taux de fausses découvertes (Benjamini et Hochberg, 1995).`,
    category: "statistiques",
    icon: "AlertTriangle"
  },
  {
    term: "Chaînes de Markov Monte Carlo (MCMC)",
    description: `Les méthodes de Monte-Carlo par chaînes de Markov (MCMC) sont des algorithmes qui tirent des échantillons d'une loi de probabilité connue seulement à une constante près, typiquement la loi a posteriori d'un modèle bayésien dont le calcul exact est impossible.

**Principe :**
- On construit une chaîne de Markov : chaque nouvel état ne dépend que de l'état précédent.
- La chaîne est conçue pour que sa loi stationnaire soit la loi cible.
- Après une période de chauffe (burn-in), les états visités sont des tirages corrélés de la loi cible : on estime une espérance par une moyenne, E[f(θ)] ≈ (1/N) Σ f(θ⁽ⁱ⁾).

**Algorithmes courants :**
- Metropolis-Hastings : on propose un état à partir de l'état courant et on l'accepte avec une probabilité fondée sur le rapport des densités, sinon on reste sur place.
- Échantillonneur de Gibbs : on tire chaque variable selon sa loi conditionnelle aux autres.
- Hamiltonian Monte Carlo et sa variante NUTS : ils utilisent le gradient de la log-densité pour explorer les espaces de grande dimension. NUTS est l'algorithme par défaut de Stan et, pour les variables continues, de PyMC.

**Exemple :** une régression avec PyMC (code non exécuté ici).

\`\`\`python
import pymc as pm

with pm.Model():
    alpha = pm.Normal("alpha", 0, 10)
    beta = pm.Normal("beta", 0, 10)
    sigma = pm.HalfNormal("sigma", 5)
    pm.Normal("y", mu=alpha + beta * x, sigma=sigma, observed=y)
    idata = pm.sample(1000)
\`\`\`

**Diagnostics :** tracés des chaînes, statistique R̂ de Gelman-Rubin (comparaison de plusieurs chaînes, valeur attendue proche de 1), taille d'échantillon effective.

**Limites :** la convergence n'est jamais garantie en pratique, les lois à plusieurs modes sont difficiles à explorer et le coût de calcul peut être élevé. L'inférence variationnelle est plus rapide mais approchée.`,
    category: "statistiques",
    icon: "GitBranch"
  },
  {
    term: "Modèles de Markov cachés (Hidden Markov Models - HMM)",
    description: `Un modèle de Markov caché (HMM) est un modèle probabiliste dans lequel une suite d'observations est produite par un système qui passe d'un état à un autre selon une chaîne de Markov, mais dont les états ne sont pas observables directement.

**Composants :**
- Les états cachés (par exemple la catégorie grammaticale d'un mot).
- Les probabilités de transition entre états.
- Les probabilités d'émission : probabilité d'observer chaque valeur dans chaque état.
- La distribution initiale des états.

**Hypothèses :** l'état à l'instant t ne dépend que de l'état à l'instant t − 1, et chaque observation ne dépend que de l'état courant.

**Trois problèmes classiques :**
- Évaluation : probabilité d'une séquence d'observations (algorithme forward).
- Décodage : séquence d'états cachés la plus probable (algorithme de Viterbi).
- Apprentissage : estimer les paramètres à partir des observations (algorithme de Baum-Welch, cas particulier de l'algorithme EM).

**Exemple :** étiqueter chaque mot d'une phrase par sa catégorie grammaticale, ou retrouver les phonèmes d'un signal de parole. Les HMM ont aussi servi en bioinformatique (séquences d'ADN) et pour détecter des régimes dans des séries financières.

**Limites :** la mémoire d'un seul pas et le nombre d'états, à fixer à l'avance, sont des hypothèses fortes. Les réseaux de neurones ont largement remplacé les HMM en reconnaissance vocale et en traitement du langage. En Python, la bibliothèque hmmlearn permet de les ajuster.`,
    category: "statistiques",
    icon: "Eye"
  },
  {
    term: "Analyse de survie (Survival Analysis)",
    description: `L'analyse de survie regroupe les méthodes qui étudient le temps écoulé avant la survenue d'un événement (décès, panne d'une machine, désabonnement d'un client) en tenant compte des observations censurées.

**Notions de base :**
- Fonction de survie S(t) = P(T > t) : probabilité que l'événement ne se soit pas produit avant l'instant t.
- Fonction de risque h(t) : taux instantané de survenue de l'événement à l'instant t, sachant qu'il n'a pas encore eu lieu.

**Censure :** pour certains individus, la date de l'événement est inconnue : ils étaient encore sans événement à la fin du suivi (censure à droite), ou l'événement a eu lieu avant le début de l'observation (censure à gauche). Les ignorer, ou les traiter comme des événements, fausse les estimations.

**Méthodes :**
- Estimateur de Kaplan-Meier (1958) : estimation non paramétrique de S(t), en escalier ; le test du log-rank compare des groupes.
- Modèle de Cox (1972), à risques proportionnels : h(t | x) = h₀(t) × exp(β·x). On interprète les rapports de risque (hazard ratios) sans avoir à spécifier h₀.
- Modèles paramétriques : exponentiel (risque constant), Weibull (risque monotone).

**Exemple :** pour étudier le désabonnement, les clients encore abonnés à la date d'extraction sont censurés à droite : on sait seulement qu'ils sont restés au moins jusque-là.

**Outils :** survival (R) ; lifelines et scikit-survival (Python).

**Limites :** l'hypothèse de risques proportionnels doit être vérifiée, et une censure liée au risque d'événement (censure informative) biaise les résultats.`,
    category: "statistiques",
    icon: "Calendar"
  }
];