import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

export const module4: LessonModule = {
  id: "clustering",
  title: "Regrouper sans étiquette : le clustering",
  duration: "2 h 30",
  summary: "K-Means écrit à la main, classification hiérarchique et DBSCAN comparés sur des données simulées dont on connaît les groupes : ce que chaque méthode suppose, comment choisir le nombre de groupes, et pourquoi aucune ne gagne partout.",
  objectives: [
    "Expliquer l'algorithme de K-Means, son critère (l'inertie) et ses limites, dont la sensibilité à l'initialisation",
    "Lire un dendrogramme et le couper pour obtenir des groupes",
    "Régler DBSCAN (eps, min_samples) et interpréter les points de bruit",
    "Choisir une méthode d'après la forme attendue des groupes, et évaluer un résultat avec l'indice de Rand ajusté quand on connaît la vérité",
  ],
  sections: [
    {
      kind: "text",
      md: `### Chercher des groupes sans réponse connue

En apprentissage non supervisé, il n'y a pas de colonne « réponse ». Le **clustering** (ou partitionnement) cherche à regrouper des observations semblables : des clients, des articles, des relevés. Rien ne dit ce qu'est un « bon » regroupement, car cela dépend de ce qu'on veut en faire. Un résultat se juge d'abord à son utilité et à sa lisibilité.

Pour comparer des **méthodes** sans ambiguïté, ce module travaille sur des données **simulées** dont on connaît les groupes d'origine. On mesure alors l'accord entre le regroupement trouvé et la vérité avec l'**indice de Rand ajusté** (ARI) : il vaut 1 quand les deux partitions sont identiques (à la numérotation près), environ 0 quand le regroupement ne vaut pas mieux que le hasard, et peut être légèrement négatif. Sur de vraies données, cette vérité n'existe pas : c'est une limite à garder en tête.

Le projet guidé « segmenter des clients », sur la page Projets, applique K-Means, la classification hiérarchique et les mesures internes (silhouette, inertie) à un cas concret. Ici, on s'intéresse au fonctionnement et au choix de la méthode.`,
    },
    {
      kind: "text",
      md: `### K-Means : des centres et des affectations

Imaginez que vous placez k tables dans une salle et que chaque invité s'assoit à la table la plus proche. Vous déplacez ensuite chaque table au centre du groupe d'invités qui l'entoure, et les invités se réassoient à la table la plus proche. Vous répétez jusqu'à ce que plus personne ne bouge. C'est K-Means :

1. choisir k centres de départ (par défaut, scikit-learn utilise \`k-means++\`, qui les prend éloignés les uns des autres) ;
2. **affecter** chaque point au centre le plus proche ;
3. **déplacer** chaque centre à la moyenne des points qui lui sont affectés ;
4. recommencer 2 et 3 jusqu'à stabilité.

Ce procédé cherche à rendre petite la somme des carrés des distances de chaque point au centre de son groupe, appelée **inertie**.`,
    },
    {
      kind: "equation",
      latex: String.raw`J = \sum_{j=1}^{k} \sum_{x_i \in C_j} \lVert x_i - \mu_j \rVert^2, \qquad \mu_j = \frac{1}{|C_j|} \sum_{x_i \in C_j} x_i`,
      caption: "C_j est le j-ième groupe, μ_j son centre (la moyenne de ses points). Chaque étape d'affectation et chaque étape de déplacement ne peut que faire baisser J ou la laisser inchangée.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from sklearn.cluster import KMeans",
        "from sklearn.datasets import make_blobs",
        "",
        "X, vrai = make_blobs(n_samples=300, centers=4, cluster_std=0.8, random_state=0)",
        "",
        "",
        "def affecter(X, centres):",
        "    \"\"\"Indice du centre le plus proche de chaque point.\"\"\"",
        "    distances = np.linalg.norm(X[:, None, :] - centres[None, :, :], axis=2)",
        "    return distances.argmin(axis=1)",
        "",
        "",
        "def deplacer(X, etiquettes, centres):",
        "    \"\"\"Nouveau centre de chaque groupe : la moyenne de ses points.\"\"\"",
        "    return np.array([X[etiquettes == j].mean(axis=0) if np.any(etiquettes == j) else centres[j] for j in range(len(centres))])",
        "",
        "",
        "def inertie(X, etiquettes, centres):",
        "    return float(((X - centres[etiquettes]) ** 2).sum())",
        "",
        "",
        "rng = np.random.default_rng(1)",
        "centres = X[rng.choice(len(X), size=4, replace=False)]",
        "for tour in range(1, 51):",
        "    etiquettes = affecter(X, centres)",
        "    print(f\"tour {tour:2d} : inertie {inertie(X, etiquettes, centres):8.1f}\")",
        "    nouveaux = deplacer(X, etiquettes, centres)",
        "    if np.allclose(nouveaux, centres):",
        "        break",
        "    centres = nouveaux",
        "",
        "reference = KMeans(n_clusters=4, n_init=10, random_state=0).fit(X)",
        "print(\"KMeans de scikit-learn (10 initialisations) :\", round(reference.inertia_, 1))",
      ),
      caption: "Quatre groupes simulés, légèrement chevauchants. L'inertie ne remonte jamais d'un tour à l'autre ; la boucle s'arrête quand les centres ne bougent plus.",
    },
    {
      kind: "text",
      md: `À partir de centres tirés au hasard parmi les points, l'inertie passe de 1 061,5 au premier tour à 369,5 au septième, sans jamais remonter, puis les centres ne bougent plus et la boucle s'arrête. Notre petite implémentation retrouve exactement l'inertie de \`KMeans\` de scikit-learn (369,5). La bibliothèque ajoute surtout une meilleure initialisation, plusieurs essais et du calcul rapide.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez la fonction `inertie_des_groupes(X, etiquettes)` : pour chaque groupe, calculez son centre (la moyenne de ses points) puis la somme des carrés des distances de ses points à ce centre ; renvoyez le total. Le test la compare à l'attribut `inertia_` d'un `KMeans`.",
      starter: lines(
        "import numpy as np",
        "from sklearn.cluster import KMeans",
        "from sklearn.datasets import make_blobs",
        "",
        "X, vrai = make_blobs(n_samples=300, centers=4, cluster_std=0.8, random_state=0)",
        "modele = KMeans(n_clusters=4, n_init=10, random_state=0).fit(X)",
        "",
        "",
        "def inertie_des_groupes(X, etiquettes):",
        "    total = 0.0",
        "    # pour chaque groupe : centre = moyenne de ses points, puis somme des carrés des distances à ce centre",
        "    return total",
        "",
        "",
        "mon_inertie = inertie_des_groupes(X, modele.labels_)",
        "print(mon_inertie, modele.inertia_)",
      ),
      solution: lines(
        "import numpy as np",
        "from sklearn.cluster import KMeans",
        "from sklearn.datasets import make_blobs",
        "",
        "X, vrai = make_blobs(n_samples=300, centers=4, cluster_std=0.8, random_state=0)",
        "modele = KMeans(n_clusters=4, n_init=10, random_state=0).fit(X)",
        "",
        "",
        "def inertie_des_groupes(X, etiquettes):",
        "    total = 0.0",
        "    for j in np.unique(etiquettes):",
        "        points = X[etiquettes == j]",
        "        centre = points.mean(axis=0)",
        "        total += ((points - centre) ** 2).sum()",
        "    return float(total)",
        "",
        "",
        "mon_inertie = inertie_des_groupes(X, modele.labels_)",
        "print(mon_inertie, modele.inertia_)",
      ),
      test: lines(
        "assert abs(mon_inertie - modele.inertia_) < 1e-6 * modele.inertia_, f\"l'inertie de KMeans vaut {modele.inertia_:.1f}, votre fonction renvoie {mon_inertie:.1f}\"",
        "_un_groupe = inertie_des_groupes(X, np.zeros(len(X), dtype=int))",
        "_attendu = float(((X - X.mean(axis=0)) ** 2).sum())",
        "assert abs(_un_groupe - _attendu) < 1e-6 * _attendu, f\"avec un seul groupe, l'inertie est la somme des carrés des écarts à la moyenne générale ({_attendu:.1f}), vous renvoyez {_un_groupe:.1f}\"",
      ),
      hint: "for j in np.unique(etiquettes) : points = X[etiquettes == j] ; centre = points.mean(axis=0) ; total += ((points - centre) ** 2).sum().",
    },
    {
      kind: "text",
      md: `### Le point faible : l'initialisation

K-Means ne garantit pas de trouver le meilleur regroupement, seulement un regroupement dont plus aucune étape ne peut améliorer l'inertie : un **minimum local**. Le résultat dépend donc des centres de départ. Pour s'en convaincre, lançons-le huit fois avec des centres de départ tirés au hasard (\`init="random"\`, une seule initialisation), puis avec la valeur par défaut de scikit-learn (\`k-means++\` et 10 initialisations, on garde la meilleure).`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "from sklearn.cluster import KMeans",
        "from sklearn.datasets import make_blobs",
        "from sklearn.metrics import adjusted_rand_score",
        "",
        "X, vrai = make_blobs(n_samples=300, centers=4, cluster_std=0.8, random_state=0)",
        "",
        "print(\"une seule initialisation aléatoire, graines 0 à 7 :\")",
        "for graine in range(8):",
        "    modele = KMeans(n_clusters=4, init=\"random\", n_init=1, random_state=graine).fit(X)",
        "    print(f\"  graine {graine} : inertie {modele.inertia_:6.1f}, ARI {adjusted_rand_score(vrai, modele.labels_):.3f}\")",
        "",
        "modele = KMeans(n_clusters=4, n_init=10, random_state=0).fit(X)",
        "print(f\"k-means++, 10 initialisations : inertie {modele.inertia_:6.1f}, ARI {adjusted_rand_score(vrai, modele.labels_):.3f}\")",
      ),
      caption: "Une initialisation malchanceuse enferme l'algorithme dans un regroupement moins bon, que l'inertie permet de repérer.",
    },
    {
      kind: "text",
      md: `Sept graines sur huit mènent à la même inertie, 369,5, et à un ARI de 0,946 : c'est le meilleur regroupement connu pour ces données (l'ARI n'est pas égal à 1 car les groupes simulés se chevauchent un peu). La graine 5 se bloque à 669,3, avec un ARI de 0,587 : deux vrais groupes ont été fusionnés et un autre coupé en deux. Rien dans le résultat ne signale l'échec, hormis une inertie plus haute. C'est pourquoi on lance l'algorithme plusieurs fois (\`n_init\`) et l'on garde la plus basse inertie, ce que scikit-learn fait par défaut.`,
    },
    {
      kind: "text",
      md: `### Choisir k

Le nombre de groupes k est à donner à l'avance. On ne peut pas le choisir en minimisant l'inertie, car elle décroît toujours quand k augmente (avec autant de groupes que de points, elle est nulle). Deux repères aident :

- la **méthode du coude** : on trace l'inertie en fonction de k et l'on cherche le point où la baisse devient lente ;
- le **coefficient de silhouette** (entre −1 et 1) : pour chaque point, il compare la distance moyenne aux points de son groupe à la distance moyenne aux points du groupe voisin le plus proche ; plus il est haut, plus les groupes sont compacts et séparés.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "from sklearn.cluster import KMeans",
        "from sklearn.datasets import make_blobs",
        "from sklearn.metrics import silhouette_score",
        "",
        "X, vrai = make_blobs(n_samples=300, centers=4, cluster_std=0.8, random_state=0)",
        "",
        "print(\"k   inertie   silhouette\")",
        "for k in range(2, 9):",
        "    modele = KMeans(n_clusters=k, n_init=10, random_state=0).fit(X)",
        "    print(f\"{k}  {modele.inertia_:8.1f}  {silhouette_score(X, modele.labels_):10.3f}\")",
      ),
      caption: "Les données ont été simulées avec 4 groupes : ici les deux repères le retrouvent.",
    },
    {
      kind: "text",
      md: `L'inertie chute fortement jusqu'à k = 4 (1 348,9 pour k = 2, 708,8 pour k = 3, 369,5 pour k = 4), puis ne baisse plus que lentement (326,3 pour k = 5) : le coude est en 4. La silhouette est maximale en 4 (0,580). Ces repères sont ici d'accord parce que les groupes sont compacts et bien séparés ; sur des données réelles ils se contredisent souvent, et la décision se prend en s'aidant aussi de l'interprétation des groupes (voir le projet guidé de segmentation).`,
    },
    {
      kind: "note",
      tone: "warning",
      md: `La silhouette et l'inertie supposent des groupes compacts et arrondis. Sur des formes allongées ou imbriquées, elles peuvent préférer un mauvais découpage. Et comme K-Means repose sur des distances, il faut mettre les variables à l'échelle (par exemple avec \`StandardScaler\`) quand elles ont des unités différentes.`,
    },
    {
      kind: "text",
      md: `### La classification hiérarchique ascendante

Au lieu de partir de k centres, cette méthode part de la situation inverse : **chaque point est son propre groupe**. À chaque étape, elle fusionne les deux groupes les plus proches, jusqu'à n'en avoir plus qu'un. L'historique des fusions forme un arbre, le **dendrogramme**, dont la hauteur des branches mesure la « distance » à laquelle deux groupes ont été fusionnés. On obtient les groupes en **coupant** l'arbre à une hauteur choisie, ou en demandant k groupes.

Il reste à définir la distance entre deux groupes, la **liaison** (\`linkage\`) :

- **Ward** fusionne les groupes dont la réunion augmente le moins la variance totale intra-groupe : il donne des groupes compacts et de tailles voisines, avec une distance euclidienne ;
- **liaison complète** : distance entre les deux points les plus éloignés des groupes ; groupes compacts ;
- **liaison moyenne** : moyenne des distances entre les points des deux groupes ;
- **liaison simple** : distance entre les deux points les plus proches ; elle suit des formes allongées, mais un petit pont de points la fait fusionner des groupes distincts (effet de chaîne).

Le dendrogramme évite de fixer k à l'avance, mais pas de choisir : il faut décider où couper. Un repère courant est de couper juste avant un grand saut de hauteur.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import matplotlib.pyplot as plt",
        "import numpy as np",
        "from scipy.cluster.hierarchy import dendrogram, fcluster, linkage",
        "from sklearn.datasets import make_blobs",
        "",
        "X, vrai = make_blobs(n_samples=30, centers=3, cluster_std=0.7, random_state=1)",
        "Z = linkage(X, method=\"ward\")",
        "print(\"hauteurs des 5 dernières fusions :\", np.round(Z[-5:, 2], 2))",
        "",
        "seuil = 8",
        "fig, ax = plt.subplots(figsize=(9, 3.5))",
        "dendrogram(Z, ax=ax, color_threshold=seuil)",
        "ax.axhline(seuil, color=\"gray\", linestyle=\"--\")",
        "ax.set_xlabel(\"observations\")",
        "ax.set_ylabel(\"hauteur de fusion (Ward)\")",
        "plt.tight_layout()",
        "plt.show()",
        "",
        "etiquettes = fcluster(Z, t=seuil, criterion=\"distance\")",
        "print(\"coupe à la hauteur\", seuil, \":\", len(set(etiquettes)), \"groupes, effectifs\", np.bincount(etiquettes)[1:])",
      ),
      caption: "Trente points simulés en trois groupes. Les fusions sont basses tant qu'on rassemble des points voisins, puis deux fusions hautes réunissent des groupes éloignés : la coupe en pointillés isole trois groupes.",
    },
    {
      kind: "text",
      md: `Les trois dernières fusions du dendrogramme sont à 3,27 (hauteur de la fusion qui laisse trois groupes), puis 14,59, puis 44,29 : après un long plateau de petites fusions, deux sauts nets. Couper à 8, entre 3,27 et 14,59, laisse trois groupes de 10 points chacun. Notez que \`scipy\` (\`linkage\`, \`dendrogram\`, \`fcluster\`) et \`AgglomerativeClustering\` de scikit-learn donnent, pour la liaison de Ward, les mêmes groupes ; le premier permet de tracer le dendrogramme, le second se range dans un pipeline scikit-learn.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "La hiérarchie `Z` (méthode de Ward) est calculée sur 90 points issus de 3 groupes, et les hauteurs de ses 5 dernières fusions sont affichées. Choisissez `seuil` (un nombre) pour que la coupe `fcluster(Z, t=seuil, criterion=\"distance\")` donne exactement les 3 groupes d'origine.",
      starter: lines(
        "import numpy as np",
        "from scipy.cluster.hierarchy import fcluster, linkage",
        "from sklearn.datasets import make_blobs",
        "from sklearn.metrics import adjusted_rand_score",
        "",
        "X, vrai = make_blobs(n_samples=90, centers=3, cluster_std=0.7, random_state=1)",
        "Z = linkage(X, method=\"ward\")",
        "print(\"hauteurs des 5 dernières fusions :\", np.round(Z[-5:, 2], 2))",
        "",
        "seuil = 0.5",
        "etiquettes = fcluster(Z, t=seuil, criterion=\"distance\")",
        "print(len(set(etiquettes)), \"groupes\")",
      ),
      solution: lines(
        "import numpy as np",
        "from scipy.cluster.hierarchy import fcluster, linkage",
        "from sklearn.datasets import make_blobs",
        "from sklearn.metrics import adjusted_rand_score",
        "",
        "X, vrai = make_blobs(n_samples=90, centers=3, cluster_std=0.7, random_state=1)",
        "Z = linkage(X, method=\"ward\")",
        "print(\"hauteurs des 5 dernières fusions :\", np.round(Z[-5:, 2], 2))",
        "",
        "seuil = 10",
        "etiquettes = fcluster(Z, t=seuil, criterion=\"distance\")",
        "print(len(set(etiquettes)), \"groupes, ARI\", round(adjusted_rand_score(vrai, etiquettes), 3))",
      ),
      test: lines(
        "_n = len(set(etiquettes))",
        "assert _n == 3, f\"avec seuil = {seuil}, la coupe donne {_n} groupes au lieu de 3 : cherchez une hauteur entre la dernière « petite » fusion et la première « grande »\"",
        "_ari = adjusted_rand_score(vrai, etiquettes)",
        "assert _ari > 0.95, f\"les 3 groupes ne correspondent pas aux groupes d'origine (ARI = {_ari:.2f})\"",
      ),
      hint: "Les hauteurs montrent un grand saut entre la 3e et la 4e valeur affichée (4,58 puis 28,39). Un seuil entre les deux sépare les petites fusions des grandes.",
    },
    {
      kind: "text",
      md: `### DBSCAN : des zones denses séparées par du vide

DBSCAN raisonne en **densité**. Deux réglages :

- \`eps\` : un rayon ;
- \`min_samples\` : le nombre de points (le point lui-même compris) qu'il faut trouver dans ce rayon pour considérer qu'on est dans une zone dense.

Un point qui a au moins \`min_samples\` points dans son rayon \`eps\` est un **point central**. Deux points centraux voisins appartiennent au même groupe, et le groupe s'étend de proche en proche ; les points non centraux situés dans le rayon d'un point central rejoignent son groupe ; tous les autres sont déclarés **bruit** et reçoivent l'étiquette −1.

DBSCAN n'exige pas de fixer k, repère des formes quelconques et signale le bruit, ce qu'aucune des deux autres méthodes ne fait. Mais il est sensible à \`eps\`, il suppose une densité à peu près uniforme (un seul \`eps\` pour tous les groupes), et il perd en pertinence quand les dimensions sont nombreuses.

Mettons les trois familles à l'épreuve sur deux jeux : quatre groupes compacts (blobs) et deux demi-cercles imbriqués (lunes). Les variables sont mises à l'échelle.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import matplotlib.pyplot as plt",
        "from sklearn.cluster import AgglomerativeClustering, DBSCAN, KMeans",
        "from sklearn.datasets import make_blobs, make_moons",
        "from sklearn.metrics import adjusted_rand_score",
        "from sklearn.preprocessing import StandardScaler",
        "",
        "jeux = {",
        "    \"blobs\": make_blobs(n_samples=300, centers=4, cluster_std=0.8, random_state=0),",
        "    \"lunes\": make_moons(n_samples=300, noise=0.07, random_state=0),",
        "}",
        "methodes = {",
        "    \"K-Means\": lambda k: KMeans(n_clusters=k, n_init=10, random_state=0),",
        "    \"Ward\": lambda k: AgglomerativeClustering(n_clusters=k, linkage=\"ward\"),",
        "    \"liaison simple\": lambda k: AgglomerativeClustering(n_clusters=k, linkage=\"single\"),",
        "    \"DBSCAN (eps=0.3)\": lambda k: DBSCAN(eps=0.3, min_samples=5),  # DBSCAN ne prend pas k",
        "}",
        "",
        "fig, axes = plt.subplots(len(jeux), len(methodes), figsize=(12, 5.5))",
        "print(f\"{'ARI':8s}\" + \"\".join(f\"{nom:>20s}\" for nom in methodes))",
        "for i, (nom_jeu, (X, vrai)) in enumerate(jeux.items()):",
        "    X = StandardScaler().fit_transform(X)",
        "    k = len(set(vrai))",
        "    ligne = f\"{nom_jeu:8s}\"",
        "    for j, (nom_methode, fabrique) in enumerate(methodes.items()):",
        "        etiquettes = fabrique(k).fit_predict(X)",
        "        ari = adjusted_rand_score(vrai, etiquettes)",
        "        ligne += f\"{ari:20.3f}\"",
        "        axes[i, j].scatter(X[:, 0], X[:, 1], c=etiquettes, s=8, cmap=\"viridis\")",
        "        axes[i, j].set_title(f\"{nom_methode} : ARI {ari:.2f}\", fontsize=9)",
        "        axes[i, j].set_xticks([])",
        "        axes[i, j].set_yticks([])",
        "    print(ligne)",
        "plt.tight_layout()",
        "plt.show()",
      ),
      caption: "Pour DBSCAN, les points de bruit (étiquette −1) sont dessinés dans la première couleur de la palette.",
    },
    {
      kind: "text",
      md: `La leçon se lit dans le tableau d'ARI.

- Sur les groupes compacts (blobs), K-Means (0,904) et Ward (0,921) retrouvent bien les groupes. La liaison simple échoue (0,000) : elle range 297 points dans un seul groupe et isole trois points écartés, car les vrais groupes se touchent par endroits et se trouvent reliés par des chaînes de points proches. DBSCAN, avec ce \`eps\`, ne fait pas mieux que 0,304.
- Sur les lunes, K-Means (0,461) coupe les deux demi-cercles par une droite au lieu de les suivre, alors que la liaison simple (1,000) et DBSCAN (0,993) retrouvent les deux formes.

Aucune méthode n'est la meilleure : chacune convient à une **forme** de groupe. K-Means et Ward cherchent des groupes compacts ; la liaison simple et DBSCAN suivent la continuité. Il faut regarder ses données (un nuage de points, quand les dimensions le permettent) avant de choisir.

Reste à régler DBSCAN. Une aide classique : regarder, pour chaque point, la distance à son 5ᵉ plus proche voisin (le point lui-même compte pour le premier, comme dans \`min_samples=5\`). Un \`eps\` plus petit que la plupart de ces distances ne trouvera presque aucune zone dense. Voici ces distances sur les lunes, et l'effet de \`eps\`.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "from sklearn.cluster import DBSCAN",
        "from sklearn.datasets import make_moons",
        "from sklearn.metrics import adjusted_rand_score",
        "from sklearn.neighbors import NearestNeighbors",
        "from sklearn.preprocessing import StandardScaler",
        "",
        "X, vrai = make_moons(n_samples=300, noise=0.07, random_state=0)",
        "X = StandardScaler().fit_transform(X)",
        "",
        "distances = NearestNeighbors(n_neighbors=5).fit(X).kneighbors(X)[0][:, -1]",
        "print(\"distance au 5e voisin, centiles 50 / 90 / 95 / 99 :\", np.round(np.percentile(distances, [50, 90, 95, 99]), 3))",
        "",
        "print(\"eps    groupes  bruit   ARI\")",
        "for eps in [0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5]:",
        "    etiquettes = DBSCAN(eps=eps, min_samples=5).fit_predict(X)",
        "    groupes = len(set(etiquettes) - {-1})",
        "    bruit = np.mean(etiquettes == -1)",
        "    print(f\"{eps:<5g} {groupes:7d}  {bruit:5.1%}  {adjusted_rand_score(vrai, etiquettes):.3f}\")",
      ),
      caption: "Un bon eps se trouve vers le haut de la distribution des distances au 5e voisin ; trop petit, tout est du bruit ; trop grand, tout fusionne.",
    },
    {
      kind: "text",
      md: `Les distances au 5ᵉ voisin sont comprises, pour 90 % des points, sous 0,184. Avec \`eps\` = 0,1, on obtient 15 groupes minuscules et 63,3 % de bruit. Pour 0,25, 0,3 et 0,4, on trouve exactement les 2 groupes attendus (ARI entre 0,987 et 0,993). À 0,5, les deux demi-cercles se touchent et fusionnent en un seul groupe (ARI nul). La plage utile est assez large ici, mais ce n'est pas toujours le cas, surtout si les groupes n'ont pas la même densité.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Deux cercles concentriques (`make_circles`) ne se séparent pas avec K-Means. Choisissez `eps` pour que `DBSCAN(eps=eps, min_samples=5)` trouve **exactement 2 groupes**, avec moins de 5 % de bruit. Les variables sont mises à l'échelle ; essayez plusieurs valeurs et regardez le nombre de groupes obtenu.",
      starter: lines(
        "import numpy as np",
        "from sklearn.cluster import DBSCAN",
        "from sklearn.datasets import make_circles",
        "from sklearn.metrics import adjusted_rand_score",
        "from sklearn.preprocessing import StandardScaler",
        "",
        "X, vrai = make_circles(n_samples=300, factor=0.5, noise=0.05, random_state=0)",
        "X = StandardScaler().fit_transform(X)",
        "",
        "eps = 0.05",
        "etiquettes = DBSCAN(eps=eps, min_samples=5).fit_predict(X)",
        "print(len(set(etiquettes) - {-1}), \"groupes,\", f\"{np.mean(etiquettes == -1):.1%} de bruit\")",
      ),
      solution: lines(
        "import numpy as np",
        "from sklearn.cluster import DBSCAN",
        "from sklearn.datasets import make_circles",
        "from sklearn.metrics import adjusted_rand_score",
        "from sklearn.preprocessing import StandardScaler",
        "",
        "X, vrai = make_circles(n_samples=300, factor=0.5, noise=0.05, random_state=0)",
        "X = StandardScaler().fit_transform(X)",
        "",
        "eps = 0.35",
        "etiquettes = DBSCAN(eps=eps, min_samples=5).fit_predict(X)",
        "print(len(set(etiquettes) - {-1}), \"groupes,\", f\"{np.mean(etiquettes == -1):.1%} de bruit\")",
      ),
      test: lines(
        "_etiquettes = DBSCAN(eps=eps, min_samples=5).fit_predict(X)",
        "_groupes = len(set(_etiquettes) - {-1})",
        "_bruit = float(np.mean(_etiquettes == -1))",
        "assert _groupes == 2, f\"avec eps = {eps}, DBSCAN trouve {_groupes} groupe(s) au lieu de 2 ; trop petit, il trouve des miettes ou rien, trop grand, il fusionne tout\"",
        "assert _bruit < 0.05, f\"avec eps = {eps}, {_bruit:.1%} des points sont du bruit : visez moins de 5 %\"",
        "assert adjusted_rand_score(vrai, _etiquettes) > 0.9, \"les deux groupes trouvés ne sont pas les deux cercles\"",
      ),
      hint: "Essayez des valeurs entre 0.05 et 0.5 (par exemple dans une boucle) et affichez le nombre de groupes. Les valeurs trop petites donnent beaucoup de bruit, les trop grandes un seul groupe ; il y a une plage entre les deux.",
    },
    {
      kind: "note",
      tone: "tip",
      md: `Pour choisir une méthode, deux questions suffisent souvent. Connaissez-vous le nombre de groupes, et des groupes compacts sont-ils plausibles ? Alors K-Means ou Ward. Les formes sont-elles allongées ou incurvées, ou y a-t-il du bruit à écarter ? Alors DBSCAN. Voulez-vous voir comment les groupes s'emboîtent à plusieurs échelles ? Alors la classification hiérarchique. Dans tous les cas, mettez les variables à l'échelle, regardez les groupes obtenus, et vérifiez que d'autres réglages ou une autre méthode donnent des groupes comparables.`,
    },
    {
      kind: "note",
      tone: "info",
      md: `Coût de calcul : K-Means se prête aux grands jeux (il existe une variante par petits lots, \`MiniBatchKMeans\`). La classification hiérarchique doit conserver les distances entre toutes les paires de points : sa mémoire croît comme le carré du nombre de points et son temps au moins autant, ce qui la limite à des jeux de taille modeste. DBSCAN dépend de la recherche des voisins, efficace en faible dimension.`,
    },
  ],
  quiz: [
    {
      question: "Que signifie une étiquette -1 attribuée par DBSCAN ?",
      options: [
        "Le groupe le plus petit",
        "Une erreur de calcul",
        "Un point de bruit : il n'est dans une zone assez dense ni lui-même ni à proximité d'un point central",
        "Le groupe de plus grande densité",
      ],
      correct: 2,
      explanation: "DBSCAN ne force pas chaque point à entrer dans un groupe : ceux qui ne sont pas dans une zone dense sont étiquetés -1 (bruit).",
    },
    {
      question: "Pourquoi ne peut-on pas choisir k en cherchant l'inertie la plus basse ?",
      options: [
        "Parce qu'elle diminue chaque fois qu'on ajoute un groupe, jusqu'à zéro quand il y a autant de groupes que de points",
        "Parce que l'inertie est toujours négative",
        "Parce que l'inertie ne dépend pas de k",
        "Parce que scikit-learn ne la calcule pas",
      ],
      correct: 0,
      explanation: "Plus de centres signifie que chaque point est plus proche de son centre : l'inertie baisse toujours. On cherche donc le coude de la courbe, ou on s'aide de la silhouette.",
    },
    {
      question: "Pourquoi lance-t-on K-Means avec plusieurs initialisations (n_init) ?",
      options: [
        "Pour augmenter le nombre de groupes",
        "Pour mettre les variables à l'échelle",
        "Pour accélérer le calcul",
        "Parce que l'algorithme peut s'arrêter dans un minimum local qui dépend des centres de départ ; on garde l'essai d'inertie la plus basse",
      ],
      correct: 3,
      explanation: "Dans nos essais, une graine sur huit a donné un regroupement nettement moins bon, que seule l'inertie plus haute permettait de repérer. Plusieurs essais réduisent ce risque.",
    },
    {
      question: "Quelle méthode retrouve le mieux les deux demi-cercles imbriqués d'un jeu « lunes » ?",
      options: [
        "K-Means, car il cherche des groupes compacts",
        "DBSCAN ou la liaison simple, qui suivent la continuité des points",
        "Aucune méthode de clustering",
        "Toutes donnent le même résultat",
      ],
      correct: 1,
      explanation: "K-Means sépare les points par la proximité à des centres, ce qui coupe les demi-cercles. Les méthodes fondées sur la densité ou la liaison simple suivent la chaîne de points voisins.",
    },
    {
      question: "Pourquoi l'indice de Rand ajusté ne peut-il pas servir sur la plupart des données réelles ?",
      options: [
        "Parce qu'il est trop lent à calculer",
        "Parce qu'il dépend de k uniquement",
        "Parce qu'il compare le regroupement à une vérité connue, qui n'existe pas en apprentissage non supervisé",
        "Parce qu'il ne fonctionne qu'avec K-Means",
      ],
      correct: 2,
      explanation: "L'ARI mesure l'accord avec des groupes de référence. Sans étiquettes, on se rabat sur des critères internes (silhouette, inertie) et surtout sur l'utilité et la lisibilité des groupes.",
    },
  ],
};
