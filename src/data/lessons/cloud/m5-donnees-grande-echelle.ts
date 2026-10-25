import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

// Jeu de ventes simulé (graine fixe, rien n'est téléchargé) : 60 000 lignes, 20 magasins dont la fréquentation
// décroît (le plus gros en reçoit plus du tiers), un montant à queue lourde. Le CSV est fabriqué en mémoire.
const PREPARATION = lines(
  "import io, zlib",
  "import numpy as np",
  "import pandas as pd",
  "",
  "rng = np.random.default_rng(42)",
  "n = 60000",
  "magasins = ['M%02d' % i for i in range(20)]",
  "poids = 1 / np.arange(1, 21) ** 1.2          # le magasin M00 est le plus fréquenté",
  "poids = poids / poids.sum()",
  "ventes = pd.DataFrame({",
  "    'magasin': rng.choice(magasins, size=n, p=poids),",
  "    'quantite': rng.integers(1, 8, size=n),",
  "    'montant': np.round(rng.lognormal(mean=3.0, sigma=0.8, size=n), 2),",
  "})",
  "# le CSV est écrit dans un fichier en mémoire, comme s'il venait d'un stockage objet",
  "tampon = io.StringIO()",
  "ventes.to_csv(tampon, index=False)",
  "texte_csv = tampon.getvalue()",
  "lignes_csv = texte_csv.splitlines()[1:]       # les lignes sans l'en-tête",
);

const PARTITIONS = lines(
  "def partition(cle, k):",
  "    # crc32 est stable d'une exécution à l'autre (le hash() de Python change à chaque lancement)",
  "    return zlib.crc32(cle.encode('utf-8')) % k",
  "",
  "charges_par_cle = ventes['magasin'].value_counts()",
  "",
  "def charges(k):",
  "    # nombre de lignes reçues par chacune des k partitions quand on répartit par magasin",
  "    c = np.zeros(k, dtype=int)",
  "    for magasin, nb in charges_par_cle.items():",
  "        c[partition(magasin, k)] += nb",
  "    return c",
);

export const moduleGrandeEchelle: LessonModule = {
  id: "donnees-grande-echelle",
  title: "Traiter des données trop grosses pour une machine",
  duration: "2 h 30",
  summary: "Lire un fichier par morceaux, savoir quelles agrégations se combinent (somme, compte, moyenne recomposée) et lesquelles non (la médiane), écrire un map / réduction en Python pur, répartir par clé de hachage et mesurer le déséquilibre ; Spark, Dask et une requête d'entrepôt en code à lire.",
  objectives: [
    "Lire un CSV par morceaux avec chunksize et combiner les résultats partiels",
    "Distinguer les agrégations qui se combinent de celles qui ne se combinent pas, et recomposer une moyenne ou un écart-type",
    "Écrire un traitement map / réduction en Python pur et le vérifier contre pandas",
    "Répartir des lignes par clé de hachage, mesurer le déséquilibre des partitions et comprendre le salage",
  ],
  sections: [
    {
      kind: "text",
      md: `### Quand les données ne tiennent plus en mémoire

Pandas charge un tableau **en entier dans la mémoire vive**. Tant que le fichier tient, c'est confortable. Quand il ne tient plus, il y a deux sorties :

- **Lire par morceaux** sur une seule machine : on traite un morceau, on garde un petit résultat partiel, on passe au suivant. La mémoire utilisée reste celle d'un morceau, pas celle du fichier.
- **Répartir sur plusieurs machines** : chacune traite une partie des données, puis on rassemble les résultats. C'est ce que font Spark, Dask et les entrepôts de données des fournisseurs de cloud.

Les deux sorties reposent sur **la même idée** : découper, calculer sur chaque part, **combiner**. Tout l'art est de savoir quels calculs se combinent. Ce module le montre sur des simulations, que vous pouvez exécuter ici.

Le jeu de données est **simulé** (graine fixe) : 60 000 ventes réparties dans 20 magasins, avec une quantité et un montant. Les magasins ne sont pas égaux : M00 est de loin le plus fréquenté. Ce détail servira à la fin. Le fichier est volontairement petit pour tenir dans le navigateur : les mécanismes sont ceux de fichiers mille fois plus gros, mais **cette simulation ne montre pas** le coût réel du réseau entre machines, des disques ni des pannes.`,
    },
    {
      kind: "text",
      md: `### Lire par morceaux avec chunksize

\`pandas.read_csv(..., chunksize=N)\` ne renvoie plus un tableau mais un **itérateur** : à chaque tour de boucle, un tableau de N lignes au plus. L'exemple lit le fichier par morceaux de 8 000 lignes et garde, pour chaque magasin, deux nombres : **la somme des montants et le nombre de lignes**. Ces deux nombres se combinent par simple addition d'un morceau à l'autre, puis la moyenne se **recompose** à la fin (somme divisée par compte). On compare avec la lecture complète, qui est possible ici parce que le fichier est petit.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        PREPARATION,
        "",
        "print('lignes :', len(ventes), ' taille du CSV :', len(texte_csv), 'octets')",
        "",
        "# --- Lecture par morceaux : on ne garde que somme et compte par magasin ---",
        "somme = {}",
        "compte = {}",
        "nb_morceaux = 0",
        "plus_gros = 0",
        "for morceau in pd.read_csv(io.StringIO(texte_csv), chunksize=8000):",
        "    nb_morceaux += 1",
        "    plus_gros = max(plus_gros, len(morceau))",
        "    partiel = morceau.groupby('magasin')['montant'].agg(['sum', 'count'])",
        "    for magasin, ligne in partiel.iterrows():",
        "        somme[magasin] = somme.get(magasin, 0.0) + ligne['sum']",
        "        compte[magasin] = compte.get(magasin, 0) + int(ligne['count'])",
        "print('morceaux lus :', nb_morceaux, ' lignes au plus en mémoire :', plus_gros)",
        "",
        "# La moyenne se recompose : somme totale divisée par compte total",
        "moyenne = {m: somme[m] / compte[m] for m in somme}",
        "print('M00 :', compte['M00'], 'ventes, montant moyen', round(moyenne['M00'], 4))",
        "",
        "# --- Contrôle contre la lecture complète (possible parce que le fichier est petit) ---",
        "reference = pd.read_csv(io.StringIO(texte_csv)).groupby('magasin')['montant'].mean()",
        "ecart = max(abs(moyenne[m] - reference[m]) for m in moyenne)",
        "print('plus grand écart avec pandas :', ecart)",
      ),
      caption: "Le CSV fait 703 886 octets pour 60 000 lignes. Il est lu en 8 morceaux de 8 000 lignes au plus : à aucun moment plus de 8 000 lignes ne sont en mémoire. M00 compte 20 926 ventes et un montant moyen de 27,8081. L'écart avec la lecture complète est de l'ordre de 7 × 10^-15, c'est-à-dire des arrondis de calcul : la recomposition est exacte.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez la fonction `somme_par_magasin(texte, taille)` : elle lit `texte` (un CSV) par morceaux de `taille` lignes avec `pd.read_csv(io.StringIO(texte), chunksize=taille)` et renvoie un dictionnaire magasin → somme des montants. Le test compare avec la lecture complète, pour deux tailles de morceau.",
      setup: PREPARATION,
      starter: lines(
        "def somme_par_magasin(texte, taille):",
        "    return {}",
      ),
      solution: lines(
        "def somme_par_magasin(texte, taille):",
        "    totaux = {}",
        "    for morceau in pd.read_csv(io.StringIO(texte), chunksize=taille):",
        "        # somme partielle du morceau, ajoutée au total déjà connu",
        "        for magasin, s in morceau.groupby('magasin')['montant'].sum().items():",
        "            totaux[magasin] = totaux.get(magasin, 0.0) + s",
        "    return totaux",
        "",
        "res = somme_par_magasin(texte_csv, 8000)",
        "print(len(res), 'magasins ; M00 :', round(res['M00'], 2))",
      ),
      test: lines(
        "_ref = ventes.groupby('magasin')['montant'].sum()",
        "for _taille in (1000, 8000):",
        "    _res = somme_par_magasin(texte_csv, _taille)",
        "    assert len(_res) == 20, f\"il faut 20 magasins dans le résultat, il y en a {len(_res)}\"",
        "    _ecart = max(abs(_res[m] - _ref[m]) for m in _ref.index)",
        "    assert _ecart < 1e-6, f\"avec des morceaux de {_taille} lignes, une somme s'écarte de {_ecart:.2f} : ajoutez le résultat de chaque morceau au total, ne l'écrasez pas\"",
      ),
      hint: "Gardez un dictionnaire totaux. Pour chaque morceau, calculez groupby('magasin')['montant'].sum(), puis ajoutez chaque valeur au total du même magasin (totaux.get(magasin, 0.0) + valeur).",
    },
    {
      kind: "text",
      md: `### Ce qui se combine et ce qui ne se combine pas

Une agrégation est **combinable** quand on peut la calculer à partir de petits résultats partiels, sans revoir les données :

- la **somme**, le **compte**, le **minimum**, le **maximum** : on combine par addition, minimum ou maximum ;
- la **moyenne** : on ne combine pas des moyennes, on combine **somme et compte**, puis on divise ;
- la **variance** : on garde le compte, la somme et la **somme des carrés**, car la variance vaut la moyenne des carrés moins le carré de la moyenne.

Ce qui **ne se combine pas** : la **médiane** et plus généralement les quantiles. La médiane de médianes n'est pas la médiane. Elle peut s'en approcher quand les morceaux se ressemblent, et s'en éloigner beaucoup quand ils sont différents, par exemple si le fichier est trié. C'est pourquoi les systèmes répartis proposent des quantiles **approchés** (des résumés compacts de la distribution) au lieu de la médiane exacte.

L'exemple montre deux erreurs classiques : la moyenne des moyennes de morceaux (les magasins ne sont pas présents en nombre égal dans chaque morceau) et la médiane des médianes, sur le fichier dans son ordre d'origine puis sur le même fichier trié par montant.`,
    },
    {
      kind: "equation",
      latex: "\\bar{x} = \\frac{\\sum_i S_i}{\\sum_i n_i} \\qquad \\sigma^2 = \\frac{\\sum_i Q_i}{\\sum_i n_i} - \\bar{x}^2",
      narrow: "\\bar{x} = \\frac{\\sum_i S_i}{\\sum_i n_i} \\\\ \\sigma^2 = \\frac{\\sum_i Q_i}{\\sum_i n_i} - \\bar{x}^2",
      caption: "Pour chaque morceau i : n_i le compte, S_i la somme et Q_i la somme des carrés. Trois nombres par morceau suffisent à recomposer la moyenne et la variance exactes de tout le fichier.",
    },
    {
      kind: "code",
      language: "python",
      setup: PREPARATION,
      code: lines(
        "TAILLE = 8000",
        "",
        "def morceaux(texte):",
        "    return pd.read_csv(io.StringIO(texte), chunksize=TAILLE)",
        "",
        "# --- Moyenne par magasin : bonne méthode contre moyenne des moyennes ---",
        "reference = ventes.groupby('magasin')['montant'].mean()",
        "moyennes_partielles = {}",
        "for morceau in morceaux(texte_csv):",
        "    for magasin, m in morceau.groupby('magasin')['montant'].mean().items():",
        "        moyennes_partielles.setdefault(magasin, []).append(m)",
        "fausse = {m: np.mean(v) for m, v in moyennes_partielles.items()}",
        "ecart = max(abs(fausse[m] - reference[m]) for m in fausse)",
        "print('moyenne des moyennes : écart maximal avec la vraie moyenne', round(float(ecart), 4))",
        "",
        "# --- Médiane : médiane des médianes de morceaux ---",
        "vraie = ventes['montant'].median()",
        "print('médiane vraie :', vraie)",
        "med = [m['montant'].median() for m in morceaux(texte_csv)]",
        "print('fichier dans son ordre : médiane des médianes', round(float(np.median(med)), 2))",
        "",
        "# même fichier, trié par montant : chaque morceau couvre une tranche de valeurs",
        "tri = io.StringIO()",
        "ventes.sort_values('montant').to_csv(tri, index=False)",
        "med_tri = [m['montant'].median() for m in morceaux(tri.getvalue())]",
        "print('fichier trié : médiane des médianes', round(float(np.median(med_tri)), 2),",
        "      ' moyenne des médianes', round(float(np.mean(med_tri)), 2))",
      ),
      caption: "La moyenne des moyennes s'écarte de la vraie moyenne de 0,50 au plus sur un magasin, alors que somme et compte donnaient un écart nul. La médiane vraie vaut 19,94. Dans l'ordre d'origine, les morceaux se ressemblent et la médiane des médianes donne 19,89 : on pourrait croire que ça marche. Sur le même fichier trié, elle donne 21,52 et la moyenne des médianes 30,32 : très loin. Un calcul faux qui tombe juste un jour est le plus dangereux.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `ecart_type_par_morceaux(texte, taille)` : elle lit `texte` par morceaux de `taille` lignes et renvoie l'écart-type (population, `ddof=0`) de la colonne `montant` **sans jamais garder plus d'un morceau en mémoire**. Gardez le compte, la somme et la somme des carrés, puis recomposez (formule ci-dessus).",
      setup: PREPARATION,
      starter: lines(
        "def ecart_type_par_morceaux(texte, taille):",
        "    return 0.0",
      ),
      solution: lines(
        "def ecart_type_par_morceaux(texte, taille):",
        "    nb = 0",
        "    somme = 0.0",
        "    somme_carres = 0.0",
        "    for morceau in pd.read_csv(io.StringIO(texte), chunksize=taille):",
        "        nb += len(morceau)",
        "        somme += morceau['montant'].sum()",
        "        somme_carres += (morceau['montant'] ** 2).sum()",
        "    moyenne = somme / nb",
        "    return float(np.sqrt(somme_carres / nb - moyenne ** 2))",
        "",
        "print(round(ecart_type_par_morceaux(texte_csv, 8000), 4), ' pandas :', round(ventes['montant'].std(ddof=0), 4))",
      ),
      test: lines(
        "_vrai = ventes['montant'].std(ddof=0)",
        "for _taille in (1000, 8000):",
        "    _res = ecart_type_par_morceaux(texte_csv, _taille)",
        "    assert abs(_res - _vrai) < 1e-6, f\"avec des morceaux de {_taille} lignes, vous trouvez {_res:.4f} au lieu de {_vrai:.4f} : variance = somme des carrés / compte - moyenne au carré\"",
      ),
      hint: "Trois accumulateurs : nb (compte), somme et somme_carres. La variance est somme_carres / nb - moyenne ** 2, l'écart-type en est la racine carrée.",
    },
    {
      kind: "text",
      md: `### Le modèle map / réduction

Quand il faut plusieurs machines, on reprend la même idée sous une forme plus stricte, le **map / réduction** (*MapReduce*) :

1. **map** : une fonction transforme chaque enregistrement en un ou plusieurs couples **(clé, valeur)**. Elle ne dépend d'aucun autre enregistrement, donc chaque machine peut la lancer sur sa part sans parler aux autres ;
2. **regroupement** (*shuffle*) : tous les couples de même clé sont **envoyés au même endroit**. C'est l'étape qui coûte cher en réseau ;
3. **réduction** : une fonction résume les valeurs d'une clé en un résultat.

Les agrégations combinables s'y écrivent naturellement. Ci-dessous, tout est en Python pur, sur une seule machine : le principe est visible, la répartition ne l'est pas. Le résultat est contrôlé contre pandas.`,
    },
    {
      kind: "code",
      language: "python",
      setup: PREPARATION,
      code: lines(
        "from collections import defaultdict",
        "",
        "def fonction_map(ligne):",
        "    # une ligne du CSV -> un couple (clé, valeur) ; la valeur est (nombre de ventes, montant)",
        "    magasin, quantite, montant = ligne.split(',')",
        "    return (magasin, (1, float(montant)))",
        "",
        "def fonction_reduce(cle, valeurs):",
        "    # toutes les valeurs d'une même clé -> un résultat",
        "    nb = sum(v[0] for v in valeurs)",
        "    total = sum(v[1] for v in valeurs)",
        "    return (cle, nb, total)",
        "",
        "# regroupement (shuffle) : on range les valeurs par clé",
        "groupes = defaultdict(list)",
        "for ligne in lignes_csv:",
        "    cle, valeur = fonction_map(ligne)",
        "    groupes[cle].append(valeur)",
        "",
        "resultat = sorted(fonction_reduce(cle, valeurs) for cle, valeurs in groupes.items())",
        "print(len(resultat), 'clés ; première :', resultat[0])",
        "",
        "# contrôle contre pandas",
        "reference = ventes.groupby('magasin')['montant'].agg(['count', 'sum'])",
        "identique = all(nb == reference.loc[cle, 'count'] and abs(total - reference.loc[cle, 'sum']) < 1e-6",
        "                for cle, nb, total in resultat)",
        "print('identique à pandas :', identique)",
      ),
      caption: "Le traitement produit 20 clés, la première étant M00 avec 20 926 ventes pour un total de 581 911,34. Compte et total sont identiques à ceux de pandas. Sur de vraies machines, c'est le regroupement qui déplace des données d'une machine à l'autre ; ici il se résume à remplir un dictionnaire, donc il ne coûte presque rien : la simulation sous-estime ce coût.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Avec le même schéma (map, regroupement, réduction), remplissez le dictionnaire `grosses_ventes` : magasin → nombre de ventes dont la quantité vaut **5 ou plus**. `lignes_csv` (les lignes `magasin,quantite,montant`) et `defaultdict` sont déjà disponibles.",
      setup: lines(PREPARATION, "from collections import defaultdict"),
      starter: lines("grosses_ventes = {}"),
      solution: lines(
        "groupes = defaultdict(list)",
        "for ligne in lignes_csv:",
        "    # map : (magasin, 1 si grosse vente, 0 sinon)",
        "    magasin, quantite, montant = ligne.split(',')",
        "    groupes[magasin].append(1 if int(quantite) >= 5 else 0)",
        "# réduction : on additionne les valeurs de chaque clé",
        "grosses_ventes = {magasin: sum(valeurs) for magasin, valeurs in groupes.items()}",
        "print(len(grosses_ventes), 'magasins ; M00 :', grosses_ventes['M00'])",
      ),
      test: lines(
        "_ref = ventes[ventes['quantite'] >= 5].groupby('magasin').size().to_dict()",
        "assert len(grosses_ventes) == 20, f\"il faut une entrée par magasin (20), il y en a {len(grosses_ventes)}\"",
        "_faux = [m for m in _ref if grosses_ventes.get(m) != _ref[m]]",
        "assert not _faux, f\"mauvais compte pour {_faux[:3]} : comptez les ventes de quantité >= 5, pas toutes les ventes\"",
      ),
      hint: "Le map renvoie 1 quand int(quantite) >= 5 et 0 sinon, rangé sous la clé magasin ; la réduction est une somme.",
    },
    {
      kind: "text",
      md: `### Répartir par clé : le hachage et le déséquilibre

Avec plusieurs machines, il faut décider **quelle machine reçoit quelle clé**. La méthode courante est le **hachage** : on calcule une empreinte numérique de la clé, puis son reste dans la division par le nombre de partitions *k*. Une même clé tombe toujours dans la même partition, ce qui permet de la réduire sur place. (Ici \`zlib.crc32\`, parce que le \`hash()\` de Python change à chaque lancement.)

Le piège est le **déséquilibre** (*data skew*). Le hachage répartit bien les **clés**, pas les **lignes** : si une clé est beaucoup plus fréquente que les autres, la partition qui la reçoit travaille bien plus que les autres, et c'est elle qui fixe la durée totale. On le mesure par le **facteur de déséquilibre** : la charge de la partition la plus chargée divisée par la charge moyenne. Il vaut 1 si tout est parfaitement réparti.

Deux remèdes :

- répartir **sans tenir compte de la clé** (au tourniquet) quand la réduction par clé n'est pas nécessaire tout de suite ;
- le **salage** (*salting*) : ajouter un suffixe aléatoire ou tournant à la clé pour la répartir en plusieurs sous-clés. Il faut ensuite une **seconde réduction** qui regroupe les sous-clés d'une même clé.`,
    },
    {
      kind: "code",
      language: "python",
      setup: PREPARATION,
      code: lines(
        "import matplotlib.pyplot as plt",
        "",
        PARTITIONS,
        "",
        "def facteur(charges_k):",
        "    return charges_k.max() / charges_k.mean()",
        "",
        "print('part du magasin M00 :', round(charges_par_cle['M00'] / len(ventes), 4))",
        "for k in (2, 4, 8, 16):",
        "    print('k =', k, ': facteur de déséquilibre', round(float(facteur(charges(k))), 2))",
        "",
        "# k = 4 : par clé, au tourniquet, puis avec salage de la clé sur 4 sous-clés",
        "par_cle = charges(4)",
        "tourniquet = np.bincount(np.arange(n) % 4, minlength=4)",
        "cles_salees = ventes['magasin'] + '#' + (np.arange(n) % 4).astype(str)",
        "sale = np.zeros(4, dtype=int)",
        "for sous_cle, nb in cles_salees.value_counts().items():",
        "    sale[partition(sous_cle, 4)] += nb",
        "print('par clé   :', par_cle, round(float(facteur(par_cle)), 2))",
        "print('tourniquet:', tourniquet, round(float(facteur(tourniquet)), 2))",
        "print('salage    :', sale, round(float(facteur(sale)), 2))",
        "",
        "fig, ax = plt.subplots(figsize=(7, 3.2))",
        "positions = np.arange(4)",
        "ax.bar(positions - 0.27, par_cle, 0.27, label='par clé')",
        "ax.bar(positions, sale, 0.27, label='avec salage')",
        "ax.bar(positions + 0.27, tourniquet, 0.27, label='tourniquet')",
        "ax.set_xticks(positions)",
        "ax.set_xticklabels(['partition 0', 'partition 1', 'partition 2', 'partition 3'])",
        "ax.set_ylabel('lignes reçues')",
        "ax.set_title('Charge des 4 partitions selon la méthode')",
        "ax.legend()",
        "plt.tight_layout()",
        "plt.show()",
      ),
      caption: "M00 reçoit 34,88 % des lignes. Répartir par clé donne, pour k = 4, les charges 16 033, 6 798, 29 338 et 7 831 lignes : la partition 2 travaille presque deux fois plus que la moyenne (facteur 1,96). Le facteur grimpe avec k : 1,51 pour 2 partitions, 1,96 pour 4, 2,90 pour 8 et 5,58 pour 16, car la partition qui porte M00 (20 926 lignes) ne peut pas descendre sous cette valeur quelle que soit la finesse du découpage. Le tourniquet est parfait (15 000 lignes partout, facteur 1,00). Le salage sur 4 sous-clés ramène le facteur à 1,24 : amélioré mais pas parfait, puisque les sous-clés se répartissent encore par hachage et peuvent se retrouver ensemble. Ajouter des machines n'aide pas si une seule clé domine.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `facteur_desequilibre(charges_k)` : la charge maximale divisée par la charge moyenne, arrondie à 2 décimales (`charges_k` est une liste ou un tableau de nombres de lignes, un par partition). Les fonctions `partition(cle, k)` et `charges(k)` de l'exemple sont disponibles.",
      setup: lines(PREPARATION, PARTITIONS),
      starter: lines(
        "def facteur_desequilibre(charges_k):",
        "    return 0.0",
      ),
      solution: lines(
        "def facteur_desequilibre(charges_k):",
        "    moyenne = sum(charges_k) / len(charges_k)",
        "    return round(max(charges_k) / moyenne, 2)",
        "",
        "print(facteur_desequilibre([10, 10, 20]), facteur_desequilibre(charges(8)))",
      ),
      test: lines(
        "assert facteur_desequilibre([5, 5, 5, 5]) == 1.0, \"des charges égales doivent donner un facteur de 1,0\"",
        "assert facteur_desequilibre([10, 10, 20]) == 1.5, f\"pour [10, 10, 20], le max est 20 et la moyenne 13,33 : attendu 1,5, obtenu {facteur_desequilibre([10, 10, 20])}\"",
        "assert abs(facteur_desequilibre(charges(16)) - 5.58) < 0.01, \"sur les 16 partitions par clé du jeu, le facteur attendu est 5,58\"",
      ),
      hint: "max(charges_k) divisé par la moyenne, c'est-à-dire sum(charges_k) / len(charges_k).",
    },
    {
      kind: "text",
      md: `### Spark, Dask et l'entrepôt : à lire

Les outils professionnels font exactement ce que vous venez de simuler (découper, calculer par part, regrouper par clé, combiner) en s'occupant de la répartition, des pannes et du réseau. **Aucun des extraits suivants ne tourne dans le moteur du site** : ils sont à lire, ou à essayer sur votre machine ou dans un compte cloud. Les trois grands fournisseurs proposent chacun un service pour faire tourner Spark (Amazon EMR, Google Cloud Dataproc, Azure Synapse Analytics, entre autres), et un entrepôt de données (Amazon Redshift, Google BigQuery, Azure Synapse). Des hébergeurs européens et des solutions auto-hébergées offrent aussi l'équivalent.

**PySpark** : la même agrégation par magasin. Le plan d'exécution (map, regroupement, réduction) est construit par Spark. La médiane exacte n'est pas combinable, Spark propose donc un quantile **approché**.

\`\`\`python
from pyspark.sql import SparkSession, functions as F

spark = SparkSession.builder.appName("ventes").getOrCreate()

# lecture répartie : un dossier de fichiers CSV dans un stockage objet
# (s3a:// pour S3, gs:// pour Cloud Storage, abfss:// pour Azure)
ventes = spark.read.csv("s3a://mon-seau/ventes/", header=True, inferSchema=True)

resume = ventes.groupBy("magasin").agg(
    F.count("*").alias("nb_ventes"),
    F.sum("montant").alias("total"),
    F.expr("percentile_approx(montant, 0.5)").alias("mediane_approchee"),
)
resume.write.mode("overwrite").parquet("s3a://mon-seau/resultats/par_magasin/")
\`\`\`

**Dask** garde l'interface de pandas mais travaille par morceaux, en parallèle, avec un calcul **paresseux** : rien ne se calcule avant \`.compute()\`.

\`\`\`python
import dask.dataframe as dd

ventes = dd.read_csv("ventes-*.csv")          # plusieurs fichiers, lus par morceaux
resume = ventes.groupby("magasin")["montant"].agg(["count", "sum"])
print(resume.compute())                        # c'est ici que le calcul a lieu
\`\`\`

**Une requête SQL d'entrepôt**, ici en dialecte BigQuery (Redshift et Synapse ont une syntaxe voisine, pas identique). Le filtre sur la colonne de date sert à ne lire que les partitions utiles, comme au module sur le stockage :

\`\`\`sql
SELECT
  magasin,
  COUNT(*) AS nb_ventes,
  SUM(montant) AS total,
  APPROX_QUANTILES(montant, 2)[OFFSET(1)] AS mediane_approchee
FROM \`mon_projet.mon_jeu.ventes\`
WHERE date_vente >= '2024-03-01'
GROUP BY magasin
ORDER BY total DESC;
\`\`\`

Dans les trois cas, la répartition par clé de \`GROUP BY\` ou de \`groupBy\` souffre du même **déséquilibre** que votre simulation si une clé domine.`,
    },
    {
      kind: "note",
      tone: "info",
      md: "Avant de passer à plusieurs machines, mesurez ce qu'une seule peut faire. Lire par morceaux, choisir de bons types de colonnes, ne charger que les colonnes utiles : cela suffit plus souvent qu'on ne le croit, et c'est bien moins cher à faire tourner et à comprendre qu'une grappe de machines.",
    },
  ],
  quiz: [
    {
      question: "Quelle est la bonne façon d'obtenir la moyenne d'une colonne en la lisant par morceaux ?",
      options: [
        "Calculer la moyenne de chaque morceau, puis la moyenne de ces moyennes",
        "Cumuler la somme et le compte de tous les morceaux, puis diviser la somme par le compte",
        "Calculer la médiane de chaque morceau et garder la plus grande",
        "Relire tout le fichier dans un seul tableau",
      ],
      correct: 1,
      explanation: "Somme et compte se combinent par addition, la moyenne se recompose à la fin. La moyenne des moyennes ignore que les morceaux n'ont pas le même poids : dans l'exemple, elle s'écartait de 0,50 sur un magasin.",
    },
    {
      question: "Pourquoi la médiane de médianes de morceaux n'est-elle pas la médiane du fichier ?",
      options: [
        "Parce que pandas ne sait pas calculer une médiane par morceaux",
        "Parce que la médiane est toujours égale à la moyenne",
        "Parce qu'une médiane ne se recompose pas à partir de médianes partielles : sur le fichier trié, on trouvait 21,52 au lieu de 19,94",
        "Parce que la médiane exige des nombres entiers",
      ],
      correct: 2,
      explanation: "La médiane dépend de la position de chaque valeur dans l'ensemble complet. Des médianes partielles ne contiennent pas cette information, d'où les quantiles approchés des systèmes répartis.",
    },
    {
      question: "Dans le modèle map / réduction, que fait l'étape de regroupement (shuffle) ?",
      options: [
        "Elle trie les résultats par ordre alphabétique pour l'affichage",
        "Elle compresse les fichiers avant leur envoi",
        "Elle envoie tous les couples de même clé au même endroit, ce qui coûte du réseau entre machines",
        "Elle supprime les clés en double",
      ],
      correct: 2,
      explanation: "La réduction d'une clé a besoin de toutes ses valeurs au même endroit. Ce déplacement est la partie la plus coûteuse d'un traitement réparti, et notre simulation, qui tient dans un dictionnaire, la sous-estime.",
    },
    {
      question: "Un magasin reçoit 35 % des lignes et on répartit par clé sur 16 partitions. Que se passe-t-il ?",
      options: [
        "Les 16 partitions ont à peu près la même charge grâce au hachage",
        "La partition qui reçoit ce magasin porte à elle seule plus de 20 000 lignes sur 60 000, et fixe la durée totale",
        "Les 15 autres partitions restent vides",
        "Le hachage refuse les clés trop fréquentes",
      ],
      correct: 1,
      explanation: "Le hachage répartit les clés, pas les lignes. Avec 16 partitions, le facteur de déséquilibre atteignait 5,58 dans la simulation, et ajouter des machines n'aurait rien changé tant que cette clé reste entière.",
    },
    {
      question: "Que fait le salage d'une clé (salting) ?",
      options: [
        "Il chiffre la clé pour la protéger",
        "Il ajoute un suffixe à la clé pour la répartir en plusieurs sous-clés, à regrouper ensuite par une seconde réduction",
        "Il supprime les lignes en double",
        "Il trie les partitions par taille",
      ],
      correct: 1,
      explanation: "Les sous-clés vont dans des partitions différentes, ce qui allège la partition surchargée (facteur ramené de 1,96 à 1,24 pour 4 partitions). Le prix est une étape supplémentaire pour recombiner les sous-clés.",
    },
  ],
};
