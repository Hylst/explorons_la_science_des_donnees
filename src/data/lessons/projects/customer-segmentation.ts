import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

/**
 * 300 clients fictifs d'un café-médiathèque, fabriqués à partir de 4 profils qui se chevauchent (graine fixe).
 * `vrai_groupe` garde le profil d'origine : il ne sert qu'à mesurer ce qu'un choix change, jamais à construire les groupes.
 */
const DONNEES = lines(
  "import numpy as np",
  "import pandas as pd",
  "import matplotlib.pyplot as plt",
  "",
  "# 300 clients fictifs, fabriqués à partir de 4 profils que l'algorithme ne verra jamais",
  "rng = np.random.default_rng(42)",
  "profil = np.repeat([0, 1, 2, 3], [95, 100, 60, 45])",
  "jours = np.array([16, 65, 45, 190])[profil] * rng.lognormal(0, 0.5, 300)",
  "visites = np.maximum(1, rng.poisson(np.array([34, 10, 6, 3.5])[profil]))",
  "panier = np.array([8.5, 14, 33, 11])[profil] * rng.lognormal(0, 0.27, 300)",
  "ordre = rng.permutation(300)",
  "clients = pd.DataFrame({",
  "    'jours_depuis_visite': jours.round().astype(int)[ordre],",
  "    'visites_par_an': visites[ordre],",
  "    'panier_moyen': panier.round(2)[ordre],",
  "})",
  "vrai_groupe = profil[ordre]  # connu seulement parce que nous avons fabriqué les données",
);

/** Données du projet, colonnes standardisées (`scaler`, `X_std`) */
const STANDARDISE = lines(
  DONNEES,
  "from sklearn.preprocessing import StandardScaler",
  "",
  "scaler = StandardScaler().fit(clients)",
  "X_std = scaler.transform(clients)",
);

/** Inertie et silhouette pour k de 2 à 8 (étape 3) */
const BALAYAGE = lines(
  STANDARDISE,
  "from sklearn.cluster import KMeans",
  "from sklearn.metrics import silhouette_score",
  "",
  "inerties, silhouettes = {}, {}",
  "for k in range(2, 9):",
  "    modele = KMeans(n_clusters=k, n_init=10, random_state=0).fit(X_std)",
  "    inerties[k] = modele.inertia_",
  "    silhouettes[k] = silhouette_score(X_std, modele.labels_)",
);

/** Le modèle retenu : 4 groupes sur les données standardisées (étapes 4 et 5) */
const GROUPES = lines(
  STANDARDISE,
  "from sklearn.cluster import KMeans",
  "",
  "km = KMeans(n_clusters=4, n_init=10, random_state=0).fit(X_std)",
);

export const projectSegmentation: LessonModule = {
  id: "intermediate-4",
  title: "Projet guidé : segmenter des clients",
  duration: "3 h",
  summary: "Regrouper 300 clients fictifs d'un café-médiathèque avec KMeans : mettre à l'échelle, choisir le nombre de groupes, décrire les groupes, et mesurer ce que cette segmentation vaut.",
  objectives: [
    "Comprendre pourquoi KMeans demande des variables mises à l'échelle, et le mesurer",
    "Choisir le nombre de groupes avec l'inertie et la silhouette, sans leur faire dire plus qu'elles ne disent",
    "Décrire les groupes dans les unités d'origine et leur donner des noms prudents",
    "Reconnaître les limites : hasard de l'initialisation, autre méthode, forme des groupes, stabilité",
  ],
  sections: [
    {
      kind: "text",
      md: `### Le contexte

Un café-médiathèque voudrait mieux connaître sa clientèle pour adapter ses horaires, ses animations et ses invitations à revenir. Il ne cherche pas à *prédire* quoi que ce soit : il n'y a aucune « bonne réponse » à retrouver. Il veut seulement **regrouper les clients qui se ressemblent**, puis regarder ce que ces groupes ont en commun. C'est de l'**apprentissage non supervisé**, et la méthode s'appelle le **clustering** (ou partitionnement).

Les données de ce projet sont **entièrement inventées** : 300 clients fictifs, décrits par trois nombres.

- \`jours_depuis_visite\` : le nombre de jours écoulés depuis la dernière visite ;
- \`visites_par_an\` : le nombre de visites sur l'année ;
- \`panier_moyen\` : la dépense moyenne par visite, en euros.

Ces clients ont été fabriqués à partir de **quatre profils** (avec du hasard, pour que les profils se chevauchent), et la variable \`vrai_groupe\` garde le profil d'origine de chacun. **Dans un vrai projet, cette information n'existe pas.** On ne s'en servira que pour mesurer l'effet de quelques choix et pour vérifier ce que l'on a trouvé : la démarche, elle, se déroule sans elle. Les graines sont fixées partout, vous devriez donc retrouver les nombres du texte (à l'arrondi près).`,
    },
    {
      kind: "text",
      md: "### Étape 1 : explorer\n\nAvant tout algorithme, on regarde. `describe()` donne l'échelle de chaque variable, la corrélation dit si certaines varient ensemble, et deux nuages de points montrent comment les clients se répartissent. Le code qui fabrique les données est affiché en entier la première fois ; ensuite, `clients` et `vrai_groupe` sont déjà prêts.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        DONNEES,
        "",
        "print(clients.head())",
        "print(clients.describe().round(1))",
        "print(clients.corr().round(2))",
        "",
        "reguliers = clients[clients['visites_par_an'] >= 25]",
        "print(len(reguliers), 'clients ont 25 visites ou plus ; le plus ancien passage remonte à', reguliers['jours_depuis_visite'].max(), 'jours')",
        "print(clients['visites_par_an'].between(16, 24).sum(), 'clients seulement ont entre 16 et 24 visites')",
        "",
        "fig, axes = plt.subplots(1, 2, figsize=(9, 3.6))",
        "axes[0].scatter(clients['jours_depuis_visite'], clients['visites_par_an'], s=12)",
        "axes[0].set_xlabel('jours depuis la dernière visite')",
        "axes[0].set_ylabel('visites par an')",
        "axes[1].scatter(clients['visites_par_an'], clients['panier_moyen'], s=12)",
        "axes[1].set_xlabel('visites par an')",
        "axes[1].set_ylabel('panier moyen (€)')",
        "fig.tight_layout()",
        "plt.show()",
      ),
      caption: "Les clients réguliers se détachent : 91 ont 25 visites ou plus, et leur dernier passage remonte à 47 jours au plus. Entre 16 et 24 visites par an, il n'y a presque personne (5 clients) ; ailleurs, les nuages se fondent les uns dans les autres. Les corrélations (-0,52 entre jours et visites, -0,46 entre visites et panier) vont dans le même sens : plus on vient souvent, plus on est passé récemment, et moins on dépense par visite.",
    },
    {
      kind: "text",
      md: `### Étape 2 : mettre les variables à l'échelle

KMeans range les clients en groupes en mesurant des **distances** : chaque client est un point, et il rejoint le groupe dont le centre est le plus proche. Or une distance additionne des écarts exprimés en jours, en visites et en euros. Si une variable a des valeurs beaucoup plus grandes que les autres, c'est elle qui décide à elle seule de qui est « proche » de qui.

C'est exactement le cas ici : les jours depuis la dernière visite ont un écart-type de 76,3, contre 13,1 pour les visites et 10,1 pour le panier. Pour mesurer l'effet, il faut une règle : l'**indice de Rand ajusté** (ARI, \`adjusted_rand_score\`) compare deux partitions des mêmes clients. Il vaut 1 si elles sont identiques (aux numéros de groupes près) et environ 0 si leur accord ne dépasse pas celui du hasard. On compare ici les groupes trouvés aux profils cachés, ce qui n'est possible que parce que nous les avons fabriqués.`,
    },
    {
      kind: "code",
      language: "python",
      setup: DONNEES,
      code: lines(
        "from sklearn.cluster import KMeans",
        "from sklearn.metrics import adjusted_rand_score",
        "",
        "# part de chaque colonne dans la variance totale (en %)",
        "part = clients.var() / clients.var().sum()",
        "print((part * 100).round(1))",
        "",
        "# KMeans directement sur les valeurs brutes",
        "km_brut = KMeans(n_clusters=4, n_init=10, random_state=0).fit(clients)",
        "print('effectifs des groupes :', np.bincount(km_brut.labels_))",
        "print('accord avec les profils cachés (ARI) :', round(adjusted_rand_score(vrai_groupe, km_brut.labels_), 2))",
        "print(pd.DataFrame(km_brut.cluster_centers_, columns=clients.columns).round(1))",
      ),
      caption: "Les jours pèsent 95,5 % de la variance totale : KMeans a surtout découpé cet axe, avec des centres étagés à environ 23, 69, 178 et 360 jours, et l'accord avec les profils cachés n'est que de 0,33.",
    },
    {
      kind: "text",
      md: `Le soupçon se confirme. Les centres s'étagent selon les jours, dont un groupe de **8 clients seulement**, absents depuis près d'un an, et aucun groupe ne ressort par son panier (les centres sont entre 9,9 et 19,2 euros). Les visites et les paniers, qui comptent chacun pour moins de 3 % de la variance, sont presque ignorés.

La parade est la **standardisation** : on retranche à chaque variable sa moyenne et on la divise par son écart-type. Chaque colonne a alors une moyenne de 0 et un écart-type de 1, et pèse autant que les autres dans les distances. \`StandardScaler\` s'en charge, et retient les moyennes et écarts-types utilisés, ce qui permettra de revenir aux unités d'origine pour décrire les groupes (étape 4).`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Standardisez les trois colonnes de `clients` avec `StandardScaler` et rangez le tableau obtenu dans `X_std`. Ajustez ensuite un `KMeans` à 4 groupes (`n_init=10`, `random_state=0`) sur `X_std`, et rangez dans `ari_std` l'indice de Rand ajusté entre `vrai_groupe` et les groupes trouvés.",
      setup: DONNEES,
      starter: lines(
        "from sklearn.preprocessing import StandardScaler",
        "from sklearn.cluster import KMeans",
        "from sklearn.metrics import adjusted_rand_score",
        "",
        "X_std = None",
        "ari_std = None",
      ),
      solution: lines(
        "from sklearn.preprocessing import StandardScaler",
        "from sklearn.cluster import KMeans",
        "from sklearn.metrics import adjusted_rand_score",
        "",
        "X_std = StandardScaler().fit_transform(clients)",
        "km_std = KMeans(n_clusters=4, n_init=10, random_state=0).fit(X_std)",
        "ari_std = adjusted_rand_score(vrai_groupe, km_std.labels_)",
        "print('moyennes nulles :', np.allclose(X_std.mean(axis=0), 0), ', écarts-types :', X_std.std(axis=0).round(3))",
        "print('effectifs des groupes :', np.bincount(km_std.labels_))",
        "print('ARI :', round(ari_std, 2))",
      ),
      test: lines(
        "from sklearn.preprocessing import StandardScaler as _SS",
        "from sklearn.cluster import KMeans as _KM",
        "from sklearn.metrics import adjusted_rand_score as _ari",
        "assert X_std is not None and getattr(X_std, 'shape', None) == (300, 3), \"X_std doit être un tableau de 300 lignes et 3 colonnes (les trois variables standardisées)\"",
        "assert np.allclose(X_std.mean(axis=0), 0, atol=1e-6) and np.allclose(X_std.std(axis=0), 1, atol=1e-6), \"après standardisation, chaque colonne a une moyenne de 0 et un écart-type de 1\"",
        "assert ari_std is not None, \"rangez l'indice de Rand ajusté dans ari_std\"",
        "_ref = _ari(vrai_groupe, _KM(n_clusters=4, n_init=10, random_state=0).fit_predict(_SS().fit_transform(clients)))",
        "assert abs(ari_std - _ref) < 1e-6, f\"ari_std doit comparer vrai_groupe aux groupes de KMeans(n_clusters=4, n_init=10, random_state=0) ajusté sur X_std (vous avez {ari_std:.3f})\"",
      ),
      hint: "StandardScaler().fit_transform(clients) renvoie le tableau standardisé ; KMeans(n_clusters=4, n_init=10, random_state=0).fit(X_std).labels_ donne les groupes ; adjusted_rand_score(vrai_groupe, groupes) donne l'ARI.",
    },
    {
      kind: "note",
      tone: "info",
      md: "Après standardisation, l'accord avec les profils cachés passe de 0,33 à 0,79, et les quatre groupes comptent 51, 115, 95 et 39 clients : plus de groupe minuscule, et les trois variables comptent. Standardiser est pourtant une décision, pas un réflexe : on choisit de donner le même poids à un écart-type de chaque variable. Pour une variable très étirée comme les jours (médiane de 41, maximum de 541), certains prennent d'abord le logarithme ; c'est une piste de fin de projet.",
    },
    {
      kind: "text",
      md: `### Étape 3 : choisir le nombre de groupes

KMeans demande de fixer le nombre de groupes, \`k\`, **avant** de commencer, et rien dans les données ne le donne directement. Deux repères aident.

- L'**inertie** (\`inertia_\`) est la somme des carrés des distances entre chaque client et le centre de son groupe. Elle baisse à chaque groupe ajouté (au pire, un groupe par client la ramène à zéro) : on ne cherche donc pas son minimum, mais un **coude**, le point où un groupe de plus n'apporte plus grand-chose.
- Le **score de silhouette** (\`silhouette_score\`) compare, pour chaque client, sa distance moyenne aux autres membres de son groupe à sa distance moyenne au groupe voisin le plus proche. Sa moyenne est comprise entre -1 et 1 : près de 1, les groupes sont compacts et bien séparés ; près de 0, ils se chevauchent. Il peut baisser quand on ajoute un groupe, on en cherche donc le maximum.

À partir d'ici, \`scaler\` (le \`StandardScaler\` ajusté sur \`clients\`) et \`X_std\` (les variables standardisées) sont déjà prêts. On calcule les deux repères pour k de 2 à 8.`,
    },
    {
      kind: "code",
      language: "python",
      setup: STANDARDISE,
      code: lines(
        "from sklearn.cluster import KMeans",
        "from sklearn.metrics import silhouette_score",
        "",
        "inerties, silhouettes = {}, {}",
        "for k in range(2, 9):",
        "    modele = KMeans(n_clusters=k, n_init=10, random_state=0).fit(X_std)",
        "    inerties[k] = modele.inertia_",
        "    silhouettes[k] = silhouette_score(X_std, modele.labels_)",
        "    print(k, 'groupes : inertie', round(inerties[k], 1), ', silhouette', round(silhouettes[k], 3))",
        "",
        "fig, axes = plt.subplots(1, 2, figsize=(9, 3.4))",
        "axes[0].plot(list(inerties), list(inerties.values()), marker='o')",
        "axes[0].set_xlabel('nombre de groupes k')",
        "axes[0].set_ylabel('inertie')",
        "axes[1].plot(list(silhouettes), list(silhouettes.values()), marker='o', color='tab:green')",
        "axes[1].set_xlabel('nombre de groupes k')",
        "axes[1].set_ylabel('score de silhouette')",
        "fig.tight_layout()",
        "plt.show()",
      ),
      caption: "La courbe de l'inertie plie vers 4 groupes sans former un coude net, et la silhouette culmine à 4 avant de redescendre. Les deux courbes orientent, elles ne décident pas à votre place.",
    },
    {
      kind: "text",
      md: "Lire un coude à l'œil est subjectif. On peut le chiffrer par la **baisse relative** de l'inertie à chaque groupe ajouté : l'inertie à k - 1 groupes moins l'inertie à k groupes, divisée par l'inertie à k - 1 groupes.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Les dictionnaires `inerties` et `silhouettes` (clés : k de 2 à 8) sont déjà calculés, comme dans l'exemple ci-dessus. Rangez dans `gains` le dictionnaire donnant, pour k de 3 à 8, la **baisse relative** de l'inertie en passant de k - 1 à k groupes, et dans `k_silhouette` la valeur de k dont le score de silhouette est le plus élevé.",
      setup: BALAYAGE,
      starter: lines("gains = {}", "k_silhouette = None"),
      solution: lines(
        "gains = {k: (inerties[k - 1] - inerties[k]) / inerties[k - 1] for k in range(3, 9)}",
        "k_silhouette = max(silhouettes, key=silhouettes.get)",
        "print({k: round(g, 3) for k, g in gains.items()})",
        "print('meilleur k selon la silhouette :', k_silhouette)",
      ),
      test: lines(
        "assert sorted(gains) == list(range(3, 9)), f\"gains doit avoir pour clés les valeurs de k de 3 à 8 (clés actuelles : {sorted(gains)})\"",
        "for _k in range(3, 9):",
        "    _attendu = (inerties[_k - 1] - inerties[_k]) / inerties[_k - 1]",
        "    assert abs(gains[_k] - _attendu) < 1e-9, f\"gains[{_k}] doit être la baisse d'inertie entre {_k - 1} et {_k} groupes, divisée par l'inertie à {_k - 1} groupes (vous avez {gains[_k]:.3f})\"",
        "assert k_silhouette == max(silhouettes, key=silhouettes.get), f\"k_silhouette doit être le k dont le score de silhouette est le plus élevé (vous avez {k_silhouette})\"",
      ),
      hint: "Une compréhension de dictionnaire sur k de 3 à 8 : (inerties[k - 1] - inerties[k]) / inerties[k - 1]. Pour le meilleur k : max(silhouettes, key=silhouettes.get).",
    },
    {
      kind: "text",
      md: `### Lire ces repères avec honnêteté

La silhouette est la plus haute pour 4 groupes (0,553), mais 5 groupes font presque aussi bien (0,545) et 3 groupes ne sont pas très loin (0,522). L'inertie baisse de 40 % en passant à 3 groupes, de 45 % en passant à 4, puis de 21 % seulement en passant à 5 : un coude se devine à 4, sans être franc. Sur des données réelles, les courbes sont souvent encore moins lisibles, et deux personnes de bonne foi retiendraient parfois 3 ou 5.

Quand les repères ne tranchent pas, on s'appuie sur des critères qui ne viennent pas du calcul. Peut-on **décrire** chaque groupe en une phrase ? Chaque groupe est-il **assez gros** pour qu'on agisse (une animation, un message) ? Le découpage est-il **stable** (étape 5) ? Ici, on retient 4 groupes.`,
    },
    {
      kind: "text",
      md: `### Étape 4 : décrire et nommer les groupes

Un groupe n'est qu'un numéro tant qu'on ne l'a pas décrit. On regarde donc ses **centres** : le client moyen de chaque groupe. KMeans les calcule dans l'espace standardisé, en écarts-types, ce qui ne parle à personne ; \`scaler.inverse_transform\` les ramène aux jours, aux visites et aux euros. Le résultat est le même que la moyenne des clients de chaque groupe, calculée à la main avec \`groupby\`.

L'exemple affiche aussi, pour une fois, le tableau croisé entre les profils cachés et les groupes trouvés. Il n'a de sens que parce que les données sont fictives.`,
    },
    {
      kind: "code",
      language: "python",
      setup: STANDARDISE,
      code: lines(
        "from sklearn.cluster import KMeans",
        "",
        "km = KMeans(n_clusters=4, n_init=10, random_state=0).fit(X_std)",
        "",
        "# les centres sont calculés en écarts-types : on les ramène aux unités d'origine",
        "centres = pd.DataFrame(scaler.inverse_transform(km.cluster_centers_), columns=clients.columns)",
        "centres['effectif'] = np.bincount(km.labels_)",
        "print(centres.round(1))",
        "",
        "# même résultat en moyennant directement les clients de chaque groupe",
        "print(clients.groupby(km.labels_).mean().round(1))",
        "",
        "# on ne peut comparer aux profils cachés que parce que les données sont fictives",
        "print(pd.crosstab(vrai_groupe, km.labels_, rownames=['profil caché'], colnames=['groupe trouvé']))",
        "",
        "fig, axes = plt.subplots(1, 2, figsize=(9, 3.6))",
        "for g in range(4):",
        "    m = km.labels_ == g",
        "    axes[0].scatter(clients.loc[m, 'jours_depuis_visite'], clients.loc[m, 'visites_par_an'], s=12, label=f'groupe {g}')",
        "    axes[1].scatter(clients.loc[m, 'visites_par_an'], clients.loc[m, 'panier_moyen'], s=12)",
        "axes[0].scatter(centres['jours_depuis_visite'], centres['visites_par_an'], marker='X', s=120, color='black')",
        "axes[1].scatter(centres['visites_par_an'], centres['panier_moyen'], marker='X', s=120, color='black')",
        "axes[0].set_xlabel('jours depuis la dernière visite')",
        "axes[0].set_ylabel('visites par an')",
        "axes[1].set_xlabel('visites par an')",
        "axes[1].set_ylabel('panier moyen (€)')",
        "axes[0].legend(fontsize=8)",
        "fig.tight_layout()",
        "plt.show()",
      ),
      caption: "Les croix noires sont les centres. Là où deux groupes se touchent (les groupes 0 et 1 sur le second graphique), la frontière est une ligne tracée par l'algorithme, pas une coupure visible dans les données.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "`km` (le KMeans à 4 groupes ajusté sur `X_std`) et `scaler` sont déjà prêts. Rangez dans `centres` un tableau (DataFrame) de 4 lignes et 3 colonnes (celles de `clients`) donnant les centres **dans les unités d'origine**, et dans `groupe_eloigne` le numéro du groupe dont le centre a le plus grand nombre de jours depuis la dernière visite.",
      setup: GROUPES,
      starter: lines("centres = None", "groupe_eloigne = None"),
      solution: lines(
        "centres = pd.DataFrame(scaler.inverse_transform(km.cluster_centers_), columns=clients.columns)",
        "groupe_eloigne = int(centres['jours_depuis_visite'].idxmax())",
        "print(centres.round(1))",
        "print('groupe le plus éloigné :', groupe_eloigne)",
      ),
      test: lines(
        "assert centres is not None and np.asarray(centres).shape == (4, 3), \"centres doit avoir 4 lignes (un groupe par ligne) et 3 colonnes (les variables)\"",
        "_ref = clients.groupby(km.labels_).mean()",
        "assert np.allclose(np.asarray(centres, dtype=float), _ref.values, atol=1e-6), \"les centres doivent être exprimés dans les unités d'origine (jours, visites par an, euros), pas en écarts-types\"",
        "assert groupe_eloigne == int(_ref['jours_depuis_visite'].idxmax()), f\"le groupe le plus éloigné est celui dont le centre a le plus grand nombre de jours (vous avez {groupe_eloigne})\"",
      ),
      hint: "scaler.inverse_transform(km.cluster_centers_) renvoie un tableau ; pd.DataFrame(..., columns=clients.columns) lui donne ses colonnes ; centres['jours_depuis_visite'].idxmax() donne la ligne du maximum.",
    },
    {
      kind: "text",
      md: `### Donner des noms, avec prudence

Voici ce que disent les centres, avec des noms qui ne sont que des raccourcis pour en parler.

- **Les habitués** (95 clients) : en moyenne 33,8 visites par an, dernier passage il y a 17,1 jours, panier de 8,7 euros. Ils viennent souvent et dépensent peu à chaque fois.
- **Les occasionnels** (115 clients) : 8,9 visites par an, dernier passage il y a 69,6 jours, panier de 14,2 euros. C'est le plus gros groupe, et le plus ordinaire.
- **Les gros paniers** (51 clients) : seulement 6,4 visites par an, mais 35,0 euros dépensés par visite, dernier passage il y a 49,8 jours.
- **Les éloignés** (39 clients) : 4,2 visites par an et un dernier passage il y a 231,1 jours en moyenne.

Le **numéro** d'un groupe, lui, ne veut rien dire : avec une autre graine, le groupe 0 peut devenir le groupe 2. Le tableau croisé de l'exemple le montre déjà (le profil caché 0 est devenu le groupe 2). Raisonnez toujours sur les centres, jamais sur les numéros.

Le même tableau rappelle que la séparation n'est pas parfaite : sur 300 clients, 27 sont rangés dans un autre groupe que celui de leur profil d'origine, dont 11 des 60 clients du profil caché 2 (celui des gros paniers), rattachés aux occasionnels.`,
    },
    {
      kind: "note",
      tone: "warning",
      md: "Un groupe est un résumé, pas une personne. Un client « éloigné » est peut-être parti en vacances, et un « gros panier » a pu faire un seul achat pour un cadeau. Ces groupes servent à **adapter un service** (horaires, animations, façon d'inviter à revenir), pas à décider du sort de quelqu'un. Avec de vraies données de clients, la question de leur usage (information des personnes, consentement, données personnelles) se pose avant tout calcul.",
    },
    {
      kind: "text",
      md: `### Étape 5 : connaître les limites

Une segmentation donne toujours *un* résultat ; reste à savoir ce qu'il vaut. Quatre vérifications, des plus techniques aux plus conceptuelles.

**1. Le hasard de l'initialisation.** KMeans part de centres tirés au hasard et les ajuste pas à pas : selon le départ, il peut s'arrêter sur un résultat médiocre. Le paramètre \`n_init\` relance l'algorithme plusieurs fois et garde le meilleur (l'inertie la plus basse). L'exemple compare 10 graines avec un seul essai (\`n_init=1\`) et avec dix essais, pour 4 groupes puis pour 6.`,
    },
    {
      kind: "code",
      language: "python",
      setup: STANDARDISE,
      code: lines(
        "from sklearn.cluster import KMeans",
        "",
        "for k in (4, 6):",
        "    seul = [KMeans(n_clusters=k, n_init=1, random_state=s).fit(X_std).inertia_ for s in range(10)]",
        "    dix = [KMeans(n_clusters=k, n_init=10, random_state=s).fit(X_std).inertia_ for s in range(10)]",
        "    print(k, 'groupes, n_init=1  : inertie de', round(min(seul), 1), 'à', round(max(seul), 1))",
        "    print(k, 'groupes, n_init=10 : inertie de', round(min(dix), 1), 'à', round(max(dix), 1))",
      ),
      caption: "À 4 groupes, les 10 graines aboutissent toutes à la même inertie, 164,3 : la structure est franche. À 6 groupes avec un seul essai, l'inertie varie de 109,5 à 142,0 selon la graine ; avec dix essais, les 10 graines trouvent toutes 109,5. Quand les groupes sont moins nets, il vaut mieux ne pas compter sur un seul départ.",
    },
    {
      kind: "text",
      md: "**2. Une méthode, un point de vue.** Un autre algorithme donnerait-il les mêmes groupes ? La classification hiérarchique ascendante (`AgglomerativeClustering`, avec la liaison de Ward) fusionne les clients de proche en proche, au lieu de chercher des centres. Si les deux méthodes s'accordent largement, les groupes ne sont pas un caprice de KMeans ; si elles divergent, c'est un avertissement.",
    },
    {
      kind: "code",
      language: "python",
      setup: GROUPES,
      code: lines(
        "from sklearn.cluster import AgglomerativeClustering",
        "from sklearn.metrics import adjusted_rand_score",
        "",
        "ward = AgglomerativeClustering(n_clusters=4, linkage='ward').fit(X_std)",
        "print('effectifs triés, KMeans :', np.sort(np.bincount(km.labels_)))",
        "print('effectifs triés, Ward   :', np.sort(np.bincount(ward.labels_)))",
        "print('accord entre les deux (ARI) :', round(adjusted_rand_score(km.labels_, ward.labels_), 2))",
      ),
      caption: "L'accord est élevé (0,86) sans être total : les effectifs triés restent voisins (39, 51, 95 et 115 pour KMeans ; 46, 55, 95 et 104 pour Ward).",
    },
    {
      kind: "text",
      md: "**3. La forme des groupes.** KMeans rattache chaque client au centre le plus proche : il suppose des groupes plutôt **compacts, arrondis et de tailles comparables**, et quand ce n'est pas le cas, il se trompe sans prévenir. Exemple classique, sans rapport avec nos clients : deux croissants entrelacés. La liaison simple de la classification hiérarchique (chaque point est relié à son plus proche voisin, de proche en proche) suit leur forme, là où KMeans les coupe par une droite.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import matplotlib.pyplot as plt",
        "from sklearn.datasets import make_moons",
        "from sklearn.cluster import KMeans, AgglomerativeClustering",
        "from sklearn.metrics import adjusted_rand_score",
        "",
        "X, vrai = make_moons(n_samples=300, noise=0.06, random_state=0)",
        "kmeans = KMeans(n_clusters=2, n_init=10, random_state=0).fit_predict(X)",
        "chaine = AgglomerativeClustering(n_clusters=2, linkage='single').fit_predict(X)",
        "print('KMeans, accord avec les deux croissants (ARI) :', round(adjusted_rand_score(vrai, kmeans), 2))",
        "print('liaison simple, accord avec les deux croissants :', round(adjusted_rand_score(vrai, chaine), 2))",
        "",
        "fig, axes = plt.subplots(1, 2, figsize=(8, 3.4))",
        "for ax, etiquettes, titre in [(axes[0], kmeans, 'KMeans'), (axes[1], chaine, 'liaison simple')]:",
        "    ax.scatter(X[:, 0], X[:, 1], c=etiquettes, s=12)",
        "    ax.set_title(titre)",
        "fig.tight_layout()",
        "plt.show()",
      ),
      caption: "KMeans coupe le plan par une droite et mélange les deux croissants (ARI de 0,23) ; la liaison simple suit leur forme et les retrouve exactement (ARI de 1,0). Aucune méthode n'est la meilleure en soi : chacune fait une hypothèse sur la forme des groupes.",
    },
    {
      kind: "text",
      md: "**4. La stabilité.** Si l'on retire un cinquième des clients au hasard, retrouve-t-on les mêmes groupes ? Si oui, la segmentation repose sur quelque chose de solide ; sinon, elle dépend de quelques clients. On le mesure : pour 10 sous-échantillons de 240 clients tirés au hasard, on ajuste le même KMeans, puis on compare ses groupes à ceux du modèle ajusté sur les 300 clients (restreints aux mêmes 240) avec l'ARI. Plus la moyenne est proche de 1, plus la segmentation est stable.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "`km` (KMeans à 4 groupes sur les 300 clients), `X_std`, `KMeans` et la liste `sous_echantillons` (10 tableaux de 240 indices de clients) sont déjà prêts. Pour chaque sous-échantillon `idx`, ajustez un `KMeans(n_clusters=4, n_init=10, random_state=0)` sur `X_std[idx]`, et rangez dans la liste `aris` l'indice de Rand ajusté entre `km.labels_[idx]` et les groupes du sous-échantillon. Rangez ensuite la moyenne de `aris` dans `stabilite`.",
      setup: lines(
        GROUPES,
        "",
        "r = np.random.default_rng(0)",
        "sous_echantillons = [r.choice(300, size=240, replace=False) for _ in range(10)]",
      ),
      starter: lines(
        "from sklearn.metrics import adjusted_rand_score",
        "",
        "aris = []",
        "stabilite = None",
      ),
      solution: lines(
        "from sklearn.metrics import adjusted_rand_score",
        "",
        "aris = []",
        "for idx in sous_echantillons:",
        "    km_sous = KMeans(n_clusters=4, n_init=10, random_state=0).fit(X_std[idx])",
        "    aris.append(adjusted_rand_score(km.labels_[idx], km_sous.labels_))",
        "stabilite = float(np.mean(aris))",
        "print([round(a, 3) for a in aris])",
        "print('stabilité moyenne :', round(stabilite, 3), ', pire cas :', round(min(aris), 3))",
      ),
      test: lines(
        "from sklearn.cluster import KMeans as _KM",
        "from sklearn.metrics import adjusted_rand_score as _ari",
        "assert len(aris) == len(sous_echantillons), f\"aris doit contenir un score par sous-échantillon ({len(sous_echantillons)} attendus, vous en avez {len(aris)})\"",
        "_ref = [_ari(km.labels_[_i], _KM(n_clusters=4, n_init=10, random_state=0).fit(X_std[_i]).labels_) for _i in sous_echantillons]",
        "assert np.allclose(aris, _ref, atol=1e-6), \"chaque score compare les groupes du modèle complet restreints au sous-échantillon (km.labels_[idx]) à ceux du modèle ajusté sur ce sous-échantillon\"",
        "assert stabilite is not None and abs(stabilite - float(np.mean(_ref))) < 1e-6, f\"stabilite doit être la moyenne des scores de aris (vous avez {stabilite})\"",
      ),
      hint: "Pour chaque idx : ajustez un KMeans sur X_std[idx] (mêmes paramètres que km), puis comparez km.labels_[idx] à ses labels_ avec adjusted_rand_score. np.mean(aris) donne la moyenne.",
    },
    {
      kind: "text",
      md: `### Étape 6 : conclure

- **Mettre à l'échelle** change beaucoup : l'accord avec les profils cachés passe de 0,33 à 0,79 avec la seule standardisation.
- **Choisir k** n'est pas un calcul mais un compromis : l'inertie et la silhouette orientent (ici vers 4, avec 5 tout près), l'interprétation et l'utilité décident.
- **Les groupes retenus sont assez stables** (accord moyen de 0,985 quand on retire un cinquième des clients, 0,957 dans le pire des dix essais) et proches de ceux d'une autre méthode (0,86). Refaites l'exercice précédent avec 5 groupes, pour \`km\` comme pour les sous-échantillons : la moyenne est de 0,961, mais le pire des dix essais tombe à 0,728, un argument de plus pour retenir 4.
- **Ces nombres valent pour des données inventées**, faites pour que le clustering trouve quelque chose. Avec de vraies données, les groupes sont plus flous, et une segmentation reste un résumé commode, jamais une vérité.

Pour aller plus loin :

- prenez le logarithme de \`jours_depuis_visite\` avant de standardiser, et comparez les groupes ;
- essayez \`GaussianMixture\` (groupes de formes et de tailles variées, avec une appartenance probabiliste) ou \`DBSCAN\` (qui ne demande pas de fixer k) ;
- ajoutez une quatrième variable, par exemple le nombre d'animations suivies, et regardez ce qui change ;
- refaites le projet sur de vraies données anonymisées, en vous demandant d'abord ce qu'on s'autorise à en faire.`,
    },
  ],
  quiz: [
    {
      question: "Pourquoi standardise-t-on les variables avant d'appliquer KMeans ?",
      options: [
        "Pour que le calcul soit plus rapide",
        "Pour supprimer les valeurs extrêmes",
        "Pour qu'une variable aux grandes valeurs (comme des jours) ne décide pas seule des distances",
        "Parce que KMeans ne fonctionne qu'avec des moyennes nulles",
      ],
      correct: 2,
      explanation: "KMeans repose sur des distances, qui additionnent des écarts de variables d'unités différentes. Sans mise à l'échelle, la variable aux plus grandes valeurs domine et les autres comptent à peine.",
    },
    {
      question: "Pourquoi ne choisit-on pas simplement le nombre de groupes qui minimise l'inertie ?",
      options: [
        "Parce qu'elle diminue à chaque groupe ajouté : le minimum serait un groupe par client, sans intérêt",
        "Parce qu'elle ne dépend pas du nombre de groupes",
        "Parce qu'elle ne se calcule qu'avec les profils réels",
        "Parce qu'elle augmente toujours avec le nombre de groupes",
      ],
      correct: 0,
      explanation: "L'inertie baisse mécaniquement quand on ajoute des groupes. On cherche donc un coude, c'est-à-dire le moment où un groupe de plus n'apporte plus grand-chose.",
    },
    {
      question: "Les scores de silhouette de 4 groupes et de 5 groupes sont très proches. Que faut-il en conclure ?",
      options: [
        "Que 5 groupes est un mauvais choix",
        "Que 4 est la vérité des données",
        "Que le calcul est faux",
        "Que le score ne tranche pas : il faut d'autres critères, comme l'interprétation, l'utilité et la stabilité",
      ],
      correct: 3,
      explanation: "Un maximum de silhouette est un repère, pas un verdict. Quand deux valeurs de k font presque aussi bien, on choisit aussi d'après ce que l'on sait décrire, ce que l'on peut en faire et la stabilité des groupes.",
    },
    {
      question: "KMeans sépare mal deux croissants entrelacés alors qu'une autre méthode y parvient. Pourquoi ?",
      options: [
        "Parce que les données contiennent trop de points",
        "Parce que KMeans cherche des groupes compacts autour d'un centre, ce qui n'est pas la forme d'un croissant",
        "Parce que KMeans exige exactement trois variables",
        "Parce que les croissants n'ont pas de centre calculable",
      ],
      correct: 1,
      explanation: "KMeans rattache chaque point au centre le plus proche : il découpe l'espace en zones convexes. Un groupe en forme de croissant, ou très allongé, ne s'y prête pas.",
    },
    {
      question: "À quoi sert le paramètre n_init de KMeans ?",
      options: [
        "À fixer le nombre de groupes",
        "À choisir le nombre de variables utilisées",
        "À lancer l'algorithme plusieurs fois avec des centres de départ différents et à garder le meilleur résultat",
        "À standardiser les données",
      ],
      correct: 2,
      explanation: "Le résultat dépend des centres de départ, tirés au hasard. Avec plusieurs essais, on garde celui d'inertie la plus faible, ce qui rend le résultat moins sensible à la graine.",
    },
  ],
};
