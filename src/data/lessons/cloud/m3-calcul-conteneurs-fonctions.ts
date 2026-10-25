import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

// Toutes les durées sont en secondes SIMULÉES. Rien n'est mesuré sur une vraie machine, un vrai conteneur
// ou une vraie fonction : la simulation montre des mécanismes (file d'attente, part série, démarrage à froid),
// pas les performances d'un fournisseur.
const FILE = lines(
  "import heapq",
  "import numpy as np",
  "",
  "# 200 tâches : arrivées espacées de 1 s en moyenne, durées de 2,65 s en moyenne (graine fixe)",
  "rng = np.random.default_rng(7)",
  "n = 200",
  "arrivees = np.cumsum(rng.exponential(1.0, n))",
  "durees = rng.lognormal(mean=0.9, sigma=0.5, size=n)",
  "",
  "def simuler_file(arrivees, durees, k):",
  "    # chaque ouvrier est représenté par l'instant où il sera libre ; le tas donne le premier libre",
  "    libres = [0.0] * k",
  "    heapq.heapify(libres)",
  "    attentes = []",
  "    fin = 0.0",
  "    for arrivee, duree in zip(arrivees, durees):",
  "        libre = heapq.heappop(libres)",
  "        debut = max(arrivee, libre)",
  "        attentes.append(debut - arrivee)",
  "        heapq.heappush(libres, debut + duree)",
  "        fin = max(fin, debut + duree)",
  "    return fin, np.array(attentes)",
);

const FROID = lines(
  "import numpy as np",
  "",
  "def simuler_froid(arrivees, duree_exec, garde, surcout_froid):",
  "    # une instance est libre à un instant donné ; elle est détruite si elle reste inactive plus de `garde` s",
  "    instances = []",
  "    nb_froids = 0",
  "    latences = []",
  "    for t in arrivees:",
  "        instances = [i for i in instances if t - i <= garde]",
  "        libres = [i for i in instances if i <= t]",
  "        if libres:",
  "            instances.remove(libres[0])          # une instance déjà chaude prend la requête",
  "            latence = duree_exec",
  "        else:",
  "            nb_froids += 1                        # il faut en démarrer une : démarrage à froid",
  "            latence = duree_exec + surcout_froid",
  "        instances.append(t + latence)             # elle sera libre à la fin de la requête",
  "        latences.append(latence)",
  "    return nb_froids, np.array(latences)",
);

export const moduleCalcul: LessonModule = {
  id: "calcul-conteneurs-fonctions",
  title: "Calcul : machines, conteneurs et fonctions",
  duration: "2 h 30",
  summary: "Distinguer machine virtuelle, conteneur et fonction sans serveur, simuler une file de tâches traitée par k ouvriers, mesurer l'accélération contre la loi d'Amdahl et voir ce que coûte un démarrage à froid.",
  objectives: [
    "Distinguer machine virtuelle, conteneur et fonction sans serveur par ce que l'on gère soi-même",
    "Simuler une file de tâches traitée par k ouvriers et lire la durée totale, l'attente et le taux d'utilisation",
    "Comparer une accélération mesurée à la loi d'Amdahl et expliquer son plafond",
    "Expliquer un démarrage à froid et simuler son effet selon le rythme des requêtes et le temps de garde",
  ],
  sections: [
    {
      kind: "text",
      md: `### Trois façons de louer du calcul

Au module 1, nous avons vu que le cloud se loue à la demande. Pour faire tourner un programme, trois formes dominent, de la plus libre à la plus guidée.

- La **machine virtuelle** (EC2 chez AWS, Compute Engine chez Google Cloud, Virtual Machines chez Azure) ressemble à un ordinateur complet : on choisit un nombre de processeurs, une quantité de mémoire, un système, et on y installe ce qu'on veut. On gère donc les mises à jour du système, les bibliothèques et l'arrêt de la machine. La facturation court tant que la machine est allumée, qu'elle travaille ou non.
- Le **conteneur** emballe un programme avec ses bibliothèques, sans embarquer un système complet : il démarre vite et s'exécute à l'identique partout, comme vu au module 3 du cours de MLOps. On l'exécute sur ses propres machines ou sur un service managé de conteneurs (Cloud Run chez Google Cloud, par exemple). On gère l'image ; le fournisseur gère de plus en plus le reste.
- La **fonction sans serveur** (*serverless* : Lambda chez AWS, Cloud Functions chez Google Cloud, Azure Functions chez Azure) est un petit morceau de code que le fournisseur lance quand une requête arrive. On ne gère ni machine ni système. On paie à l'exécution, et rien quand rien ne tourne. En contrepartie : des durées maximales par appel, peu de contrôle sur l'environnement, et un phénomène à connaître, le **démarrage à froid**.

Aucune de ces formes n'est « la bonne » : un entraînement de plusieurs heures sur un gros tableau va plutôt sur une machine ou un conteneur, une petite conversion de fichier déclenchée par un dépôt sur une fonction. Des hébergeurs européens et des solutions auto-hébergées proposent aussi ces trois formes ; les mécanismes de ce module s'y appliquent de la même façon.

Ce module se pratique en **simulation**. Les durées sont des secondes simulées : la simulation montre des mécanismes (file d'attente, part de travail non parallélisable, démarrage à froid), pas les performances d'un fournisseur. Elle ne montre ni le débit réel d'un disque ou du réseau, ni les quotas, ni les pannes.`,
    },
    {
      kind: "text",
      md: `### Une file de tâches et k ouvriers

Un cas de la vie courante en data science : des tâches arrivent (fichiers à convertir, modèles à évaluer, requêtes à servir), chacune dure un certain temps, et on dispose de **k ouvriers** (machines, conteneurs ou instances de fonction). Une tâche attend si les k ouvriers sont occupés.

La simulation ci-dessous traite 200 tâches arrivées au hasard (en moyenne une par seconde) et de durées variables (2,65 s en moyenne). Elle utilise un **tas** (\`heapq\`) pour retrouver à chaque fois l'ouvrier libre le plus tôt. Trois grandeurs se lisent :

- la **fin** : l'instant où la dernière tâche se termine ;
- l'**attente** : le temps passé dans la file avant le début de la tâche ;
- le **taux d'utilisation** : la part du temps des ouvriers réellement passée à travailler. Un ouvrier qui attend sans rien faire se paie quand même s'il s'agit d'une machine allumée.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        FILE,
        "",
        "print('travail total :', round(float(durees.sum()), 1), 's ; dernière arrivée :', round(float(arrivees[-1]), 1), 's')",
        "print('ouvriers   fin   attente moyenne   attente max   utilisation')",
        "for k in [1, 2, 3, 4, 6, 8, 16]:",
        "    fin, attentes = simuler_file(arrivees, durees, k)",
        "    utilisation = durees.sum() / (k * fin)",
        "    print(f'{k:8d} {fin:7.1f} {attentes.mean():12.2f} s {attentes.max():10.2f} s {utilisation:10.0%}')",
      ),
      caption: "Le travail total est de 530,4 s et la dernière tâche arrive à 205,8 s. Avec un seul ouvrier, tout finit à 531,2 s et la tâche la plus malchanceuse attend 323,69 s : la file ne se vide qu'après la dernière arrivée. Avec 2 ouvriers, la fin tombe à 267,1 s (attente moyenne 27,24 s). À 3 ouvriers, 211,8 s et 1,06 s d'attente moyenne. À partir de 4 ouvriers, la fin reste à 207,6 s : la dernière tâche arrive à 205,8 s, ajouter des ouvriers ne peut plus rien y changer. L'attente moyenne tombe à 0,26 s pour 4 ouvriers, 0,03 s pour 6, puis 0 pour 8 et 16. L'utilisation, elle, baisse : 99,9 % pour un ouvrier, 63,9 % pour 4, 16,0 % pour 16.",
    },
    {
      kind: "text",
      md: `La leçon tient en deux colonnes. Le **temps** s'améliore vite au début, puis plus du tout : une fois l'attente à zéro, le dernier arrivé donne le tempo. Le **taux d'utilisation** s'effondre à mesure qu'on ajoute des ouvriers. Entre 3 et 4 ouvriers, on gagne de l'attente ; à 16, on paie surtout des machines qui regardent passer les tâches. C'est le dilemme du dimensionnement : un compromis entre le confort des tâches (attente courte) et le coût (utilisation élevée).

Les services managés cherchent à le supprimer en ajustant k automatiquement, ce qui est l'élasticité du module 1. Mais un ajustement automatique demande un certain temps, justement le démarrage dont nous parlons plus bas.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "`arrivees` et `durees` sont deux petites listes de tâches. Écrivez `simuler_file(arrivees, durees, k)` qui renvoie le couple `(fin, attente_moyenne)` : l'instant de fin de la dernière tâche et l'attente moyenne dans la file. Chaque tâche, dans l'ordre d'arrivée, va sur l'ouvrier libre le plus tôt (tas `heapq`) et commence à `max(arrivee, instant où il est libre)`.",
      setup: lines(
        "import heapq",
        "arrivees = [0.0, 0.0, 0.0, 0.0]",
        "durees = [4.0, 3.0, 2.0, 1.0]",
      ),
      starter: lines(
        "def simuler_file(arrivees, durees, k):",
        "    return 0.0, 0.0",
      ),
      solution: lines(
        "def simuler_file(arrivees, durees, k):",
        "    libres = [0.0] * k",
        "    heapq.heapify(libres)",
        "    attentes = []",
        "    fin = 0.0",
        "    for arrivee, duree in zip(arrivees, durees):",
        "        libre = heapq.heappop(libres)",
        "        debut = max(arrivee, libre)",
        "        attentes.append(debut - arrivee)",
        "        heapq.heappush(libres, debut + duree)",
        "        fin = max(fin, debut + duree)",
        "    return fin, sum(attentes) / len(attentes)",
        "",
        "print(simuler_file(arrivees, durees, 2))",
      ),
      test: lines(
        "_fin, _att = simuler_file(arrivees, durees, 2)",
        "assert abs(_fin - 5.0) < 1e-9, f\"avec 2 ouvriers, les tâches 4, 3, 2 et 1 s finissent à 5 s (4 | 3 puis 2 | 4 puis 1) ; vous trouvez {_fin}\"",
        "assert abs(_att - 1.75) < 1e-9, f\"les attentes sont 0, 0, 3 et 4 s : la moyenne est 1,75 s ; vous trouvez {_att}\"",
        "_fin1, _att1 = simuler_file(arrivees, durees, 1)",
        "assert abs(_fin1 - 10.0) < 1e-9, f\"avec un seul ouvrier, tout se suit : 10 s ; vous trouvez {_fin1}\"",
        "_fin4, _att4 = simuler_file(arrivees, durees, 4)",
        "assert abs(_fin4 - 4.0) < 1e-9 and abs(_att4) < 1e-9, \"avec 4 ouvriers, personne n'attend et la fin est celle de la tâche la plus longue (4 s)\"",
        "_fin2, _att2 = simuler_file([0.0, 5.0], [1.0, 1.0], 1)",
        "assert abs(_att2) < 1e-9 and abs(_fin2 - 6.0) < 1e-9, \"une tâche qui arrive quand l'ouvrier est libre commence à son arrivée, pas avant : utilisez max(arrivee, libre)\"",
      ),
      hint: "Gardez dans une liste l'instant où chaque ouvrier sera libre. Pour chaque tâche : retirez le plus petit avec heappop, calculez le début, remettez début + durée avec heappush.",
    },
    {
      kind: "text",
      md: `### Plusieurs ouvriers sur un même travail : la loi d'Amdahl

Dans l'exemple précédent, les tâches étaient indépendantes. Autre situation : un **même** travail qu'on découpe en morceaux répartis sur k ouvriers (entraîner des modèles sur des plis différents, convertir des milliers de fichiers). On espère aller k fois plus vite. On y arrive rarement, car une partie du travail ne se découpe pas : lire la configuration, rassembler les résultats, écrire le fichier final.

Notons **s** la part du temps total qui est **strictement série** (non parallélisable), sur un seul ouvrier. Le reste, 1 − s, se répartit parfaitement entre k ouvriers. La durée avec k ouvriers vaut s + (1 − s)/k fois la durée avec un seul : c'est la **loi d'Amdahl**.`,
    },
    {
      kind: "equation",
      latex: "A(k) = \\frac{T(1)}{T(k)} = \\frac{1}{s + \\dfrac{1-s}{k}} \\qquad \\lim_{k \\to \\infty} A(k) = \\frac{1}{s}",
      narrow: "A(k) = \\frac{T(1)}{T(k)}\\\\ = \\frac{1}{s + \\dfrac{1-s}{k}}\\\\ \\lim_{k \\to \\infty} A(k) = \\frac{1}{s}",
      caption: "A(k) est l'accélération (rapport des durées avec 1 et avec k ouvriers), s la part série entre 0 et 1.",
    },
    {
      kind: "text",
      md: `Une part série de 5 % semble négligeable. Pourtant elle interdit toute accélération supérieure à **1/0,05 = 20**, même avec mille ouvriers. Avec 20 % de série, le plafond est 5. C'est ce qui rend les gros clusters décevants pour les programmes mal découpés.

La simulation suivante répartit un travail de 1 000 s en 400 morceaux de tailles inégales, tirés au hasard, plus une part série. Les ouvriers prennent les morceaux, du plus gros au plus petit, selon la règle « le premier libre prend le suivant ». On compare l'accélération **mesurée** à la formule.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import heapq",
        "import numpy as np",
        "import matplotlib.pyplot as plt",
        "",
        "rng = np.random.default_rng(3)",
        "",
        "def amdahl(s, k):",
        "    return 1 / (s + (1 - s) / k)",
        "",
        "def duree_job(s, k, morceaux=400, total=1000.0):",
        "    serie = s * total                                    # part qui ne se découpe pas",
        "    parts = rng.dirichlet(np.ones(morceaux)) * (1 - s) * total   # 400 morceaux inégaux",
        "    libres = [0.0] * k",
        "    heapq.heapify(libres)",
        "    for p in sorted(parts, reverse=True):",
        "        libre = heapq.heappop(libres)",
        "        heapq.heappush(libres, libre + p)",
        "    return serie + max(libres)",
        "",
        "ouvriers = [1, 2, 4, 8, 16, 64, 256]",
        "mesure = {}",
        "for s in [0.0, 0.05, 0.2]:",
        "    t1 = duree_job(s, 1)",
        "    mesure[s] = [t1 / duree_job(s, k) for k in ouvriers]",
        "    print('part série', s, ': mesuré', [round(float(a), 2) for a in mesure[s]])",
        "    print('               Amdahl', [round(amdahl(s, k), 2) for k in ouvriers])",
        "",
        "fig, ax = plt.subplots(figsize=(6.5, 3.6))",
        "rangs = range(len(ouvriers))                   # positions régulières : 1, 2, 4... 256 tiennent sur l'axe",
        "for s, couleur in zip([0.0, 0.05, 0.2], ['tab:green', 'tab:blue', 'tab:red']):",
        "    ax.plot(rangs, mesure[s], 'o-', color=couleur, label=f'mesuré, part série {s}')",
        "    ax.plot(rangs, [amdahl(s, k) for k in ouvriers], '--', color=couleur, alpha=0.5)",
        "ax.set_xticks(list(rangs), [str(k) for k in ouvriers])",
        "ax.set_xlabel(\"nombre d'ouvriers\")",
        "ax.set_ylabel('accélération')",
        "ax.set_title(\"Accélération mesurée (points) et loi d'Amdahl (tirets)\")",
        "ax.legend(fontsize=8)",
        "plt.tight_layout()",
        "plt.show()",
      ),
      caption: "Part série 5 % : l'accélération mesurée suit la formule jusqu'à 16 ouvriers (9,14 dans les deux cas) puis plafonne autour de 15,8 avec 256 ouvriers, alors que la formule donne 18,62 et que le plafond théorique est 20. Part série 20 % : 4,00 avec 16 ouvriers, 4,69 avec 256, pour un plafond de 5. Sans aucune part série, la formule promet 256 avec 256 ouvriers ; la simulation donne 50,21, et seulement 63,67 pour 64 au lieu de 64 : avec 400 morceaux inégaux, le dernier gros morceau dicte la fin. C'est un second plafond, que la formule ne voit pas : la granularité du découpage.",
    },
    {
      kind: "text",
      md: `Deux plafonds à retenir : la **part série** (loi d'Amdahl) et la **taille des morceaux** (un morceau ne se partage pas entre deux ouvriers). Dans la pratique s'y ajoutent des coûts que la simulation ignore : transferts de données entre machines, synchronisations, démarrage des ouvriers. L'accélération réelle est donc en général **inférieure** à celle de la formule.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `amdahl(s, k)` qui renvoie l'accélération prévue pour une part série `s` et `k` ouvriers, puis `ouvriers_pour_moitie(s)`, le plus petit nombre entier d'ouvriers pour lequel l'accélération atteint au moins la moitié du plafond 1/s. Vérifiez avec une boucle sur k (aucune formule exigée).",
      setup: "",
      starter: lines(
        "def amdahl(s, k):",
        "    return 1.0",
        "",
        "def ouvriers_pour_moitie(s):",
        "    return 1",
      ),
      solution: lines(
        "def amdahl(s, k):",
        "    return 1 / (s + (1 - s) / k)",
        "",
        "def ouvriers_pour_moitie(s):",
        "    k = 1",
        "    while amdahl(s, k) < 0.5 / s:",
        "        k += 1",
        "    return k",
        "",
        "print(amdahl(0.1, 10), ouvriers_pour_moitie(0.1))",
      ),
      test: lines(
        "assert abs(amdahl(0.1, 1) - 1.0) < 1e-9, \"avec un seul ouvrier, l'accélération vaut toujours 1\"",
        "assert abs(amdahl(0.0, 8) - 8.0) < 1e-9, \"sans part série, 8 ouvriers vont 8 fois plus vite\"",
        "assert abs(amdahl(0.1, 10) - 1 / (0.1 + 0.9 / 10)) < 1e-9, \"la formule est 1 / (s + (1 - s) / k)\"",
        "assert abs(amdahl(0.25, 1000) - 4.0) < 0.02, \"avec 25 % de série, l'accélération ne dépasse pas 4\"",
        "_k = ouvriers_pour_moitie(0.1)",
        "assert amdahl(0.1, _k) >= 0.5 / 0.1 and amdahl(0.1, _k - 1) < 0.5 / 0.1, f\"pour s = 0,1 le plafond est 10 ; il faut le plus petit k qui donne au moins 5 : {_k} ne convient pas\"",
      ),
      hint: "Pour le plus petit k : partez de 1 et augmentez tant que amdahl(s, k) est inférieure à la moitié du plafond, c'est-à-dire à 0,5 / s.",
    },
    {
      kind: "text",
      md: `### Le démarrage à froid

Une fonction sans serveur n'existe pas en permanence. Quand une requête arrive et qu'aucune **instance** n'est prête, le fournisseur doit en démarrer une : préparer l'environnement, charger le code et les bibliothèques. Ce délai supplémentaire est le **démarrage à froid** (*cold start*). Les requêtes suivantes, servies par une instance déjà « chaude », sont plus rapides. Le fournisseur garde l'instance un certain temps après la dernière requête, puis la détruit : c'est le **temps de garde** (sa valeur exacte dépend du service et n'est pas fixée ici).

Ce qui compte pour un projet de données : charger un gros modèle ou importer pandas et scikit-learn à chaque démarrage allonge le démarrage à froid. Deux parades : alléger l'environnement, et garder des instances prêtes en payant un peu pour le confort (les fournisseurs proposent une option d'instances toujours chaudes, à des conditions propres à chacun).

La simulation prend un surcoût de démarrage de 2 s et une exécution de 0,2 s, valeurs **fictives** choisies pour que l'effet se lise. Elle fait varier l'écart moyen entre requêtes (0,5 s à 120 s) et le temps de garde (10 s, 60 s, 600 s). Une instance occupée ne peut pas prendre une deuxième requête : si deux arrivent en même temps, la seconde subit un démarrage à froid.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        FROID,
        "",
        "rng = np.random.default_rng(11)",
        "print('écart moyen  garde   démarrages à froid   latence moyenne   latence 95e centile')",
        "for ecart in [0.5, 5, 30, 120]:",
        "    arrivees = np.cumsum(rng.exponential(ecart, 500))     # 500 requêtes",
        "    for garde in [10, 60, 600]:",
        "        nb, latences = simuler_froid(arrivees, 0.2, garde, 2.0)",
        "        print(f'{ecart:8} s {garde:5} s {nb:9d} ({nb / 500:6.1%}) {latences.mean():12.3f} s {np.percentile(latences, 95):12.2f} s')",
      ),
      caption: "Quand les requêtes sont serrées (une toutes les 0,5 s), seuls 6 démarrages sur 500 (1,2 %) sont à froid, quelle que soit la garde : les instances ne s'endorment jamais. À une requête toutes les 5 s, une garde de 10 s donne 84 démarrages à froid sur 500 (16,8 %, latence moyenne 0,536 s) ; avec 60 s ou 600 s, seulement 2. À une requête toutes les 30 s, la garde de 10 s est un désastre : 367 démarrages (73,4 %), 1,668 s de latence moyenne ; 60 s ramène à 68 (13,6 %), 600 s à 2. À une requête toutes les 120 s, 91,2 % de démarrages à froid avec 10 s de garde (latence moyenne 2,024 s) et encore 62,0 % avec 60 s. Les deux démarrages restants avec 600 s sont les tout premiers de la série. Le cas de 120 s est celui d'une fonction rarement appelée : elle paie presque à chaque fois, et c'est le plus mauvais pour une interface qu'un humain attend.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `compter_froids(arrivees, duree_exec, garde, surcout)` qui renvoie le nombre de requêtes à démarrage à froid. Gardez la liste des instants où chaque instance sera libre ; avant chaque requête à l'instant `t`, retirez celles inactives depuis plus de `garde` secondes (`t - libre > garde`) ; si l'une est libre (`libre <= t`), la requête est chaude et occupe cette instance jusqu'à `t + duree_exec`, sinon c'est un démarrage à froid qui occupe une nouvelle instance jusqu'à `t + duree_exec + surcout`.",
      setup: "",
      starter: lines(
        "def compter_froids(arrivees, duree_exec, garde, surcout):",
        "    return 0",
      ),
      solution: lines(
        "def compter_froids(arrivees, duree_exec, garde, surcout):",
        "    instances = []",
        "    froids = 0",
        "    for t in arrivees:",
        "        instances = [i for i in instances if t - i <= garde]",
        "        libres = [i for i in instances if i <= t]",
        "        if libres:",
        "            instances.remove(libres[0])",
        "            instances.append(t + duree_exec)",
        "        else:",
        "            froids += 1",
        "            instances.append(t + duree_exec + surcout)",
        "    return froids",
        "",
        "print(compter_froids([0, 1, 2, 100, 101], 0.1, 10, 0.5))",
      ),
      test: lines(
        "assert compter_froids([0, 1, 2, 100, 101], 0.1, 10, 0.5) == 2, \"la première requête (0) et celle de 100 s, après expiration de l'instance, sont à froid ; les autres sont chaudes\"",
        "assert compter_froids([0, 0, 0], 1.0, 10, 1.0) == 3, \"trois requêtes simultanées exigent trois instances : trois démarrages à froid\"",
        "assert compter_froids([0, 20], 0.1, 10, 0.5) == 2, \"20 s d'inactivité dépassent la garde de 10 s : la seconde requête est à froid\"",
        "assert compter_froids([0, 5], 0.1, 10, 0.5) == 1, \"5 s d'inactivité sont sous la garde de 10 s : la seconde requête est chaude\"",
        "assert compter_froids([], 0.1, 10, 0.5) == 0, \"aucune requête, aucun démarrage\"",
      ),
      hint: "Une instance qui sert une requête devient libre à t + durée (plus le surcoût pour un démarrage à froid). Elle expire si l'instant t est plus de `garde` secondes après le moment où elle est devenue libre.",
    },
    {
      kind: "text",
      md: `### Conteneur et fonction : le code à lire

Voici un **Dockerfile** qui emballe un petit service de prédiction, puis la commande qui déploie une **fonction** chez chacun des trois fournisseurs. Ces extraits sont **à lire** : ils ne tournent pas dans le moteur du site, qui n'a ni Docker, ni accès à un compte de fournisseur, ni réseau.

\`\`\`dockerfile
# Image de base avec Python ; une version précise vaut mieux que « latest »
FROM python:3.12-slim
WORKDIR /app
# les dépendances d'abord : cette couche est réutilisée tant que requirements.txt ne change pas
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# puis le code, qui change plus souvent
COPY service.py modele.pkl ./
# le conteneur écoute sur un port, et le service gère le reste
EXPOSE 8080
CMD ["python", "service.py"]
\`\`\`

L'ordre des instructions compte : chaque ligne crée une **couche** mise en cache. En plaçant l'installation des dépendances avant la copie du code, on évite de les réinstaller à chaque petite modification. Le conteneur se lance ensuite sur sa machine avec \`docker run\`, ou se publie dans le registre d'images du fournisseur choisi.

Déployer une fonction demande un dossier de code et un point d'entrée. Les noms, les options et les durées maximales changent d'un fournisseur à l'autre ; les commandes ci-dessous donnent la forme générale, à adapter d'après la documentation en vigueur.

\`\`\`bash
# AWS (Lambda) : on envoie une archive du code
aws lambda create-function --function-name predire \\
  --runtime python3.12 --handler service.gerer \\
  --zip-file fileb://paquet.zip --role <role-d-execution>

# Google Cloud (Cloud Functions) : on déploie un dossier de sources
gcloud functions deploy predire --runtime python312 \\
  --trigger-http --entry-point gerer --source .

# Azure (Azure Functions) : on publie une application de fonctions déjà créée
func azure functionapp publish <nom-de-l-application>
\`\`\`

Les trois commandes illustrent la même idée : on remet du code, on désigne la fonction à appeler, et le fournisseur s'occupe du reste. Le rôle ou l'identité d'exécution (les droits de la fonction) est un sujet du module 6.`,
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Un job de 600 s se décompose en une partie série de 60 s et le reste parfaitement parallélisable. Calculez dans `duree_k4` la durée avec 4 ouvriers (partie série plus partie parallèle divisée par 4), dans `acceleration` le rapport durée à 1 ouvrier sur durée à 4 ouvriers, et dans `plafond` l'accélération maximale possible, quel que soit le nombre d'ouvriers.",
      setup: lines("total = 600.0", "serie = 60.0"),
      starter: lines(
        "duree_k4 = 0.0",
        "acceleration = 0.0",
        "plafond = 0.0",
      ),
      solution: lines(
        "duree_k4 = serie + (total - serie) / 4",
        "acceleration = total / duree_k4",
        "plafond = total / serie",
        "print(duree_k4, round(acceleration, 2), plafond)",
      ),
      test: lines(
        "assert abs(duree_k4 - 195.0) < 1e-9, f\"60 s de série plus 540 s divisées par 4 font 195 s ; vous trouvez {duree_k4}\"",
        "assert abs(acceleration - 600 / 195) < 1e-9, f\"l'accélération est 600 / 195, soit environ 3,08 ; vous trouvez {acceleration}\"",
        "assert abs(plafond - 10.0) < 1e-9, f\"avec 10 % de série, le plafond est 10 ; vous trouvez {plafond}\"",
      ),
      hint: "La durée à k ouvriers est série + parallèle / k. Le plafond est la durée totale divisée par la durée série.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Une simulation n'est pas une mesure. Les durées de ce module sont inventées pour montrer des mécanismes : elles ne disent rien de la rapidité d'un fournisseur, de la latence réelle du réseau, des quotas, ni des pannes. Pour décider d'une architecture, on mesure sur le vrai service, avec ses données.",
    },
  ],
  quiz: [
    {
      question: "Quelle forme de calcul vous laisse le moins de choses à gérer vous-même ?",
      options: [
        "La machine virtuelle, car on choisit tout",
        "La fonction sans serveur, car le fournisseur gère la machine et le système",
        "Le conteneur lancé sur ses propres machines",
        "Aucune : elles demandent toutes la même gestion",
      ],
      correct: 1,
      explanation: "Avec une fonction, on remet du code et le fournisseur gère le reste. En contrepartie, on a moins de contrôle sur l'environnement et on subit des limites de durée et le démarrage à froid.",
    },
    {
      question: "Dans la simulation de file, l'attente moyenne tombe à 0,26 s avec 4 ouvriers, et l'utilisation à 63,9 %. Que se passe-t-il en passant à 16 ouvriers ?",
      options: [
        "La fin reste à 207,6 s, l'attente reste nulle et l'utilisation tombe à 16,0 %",
        "La fin est divisée par 4 et l'utilisation monte",
        "L'attente augmente à cause de la coordination",
        "L'utilisation reste identique, seule l'attente change",
      ],
      correct: 0,
      explanation: "Une fois l'attente à zéro, la dernière arrivée fixe la fin. Les ouvriers supplémentaires ne font qu'attendre, donc l'utilisation s'effondre : on paie pour rien si ce sont des machines allumées.",
    },
    {
      question: "Une part série de 20 % du travail : quelle accélération maximale la loi d'Amdahl autorise-t-elle, même avec un nombre immense d'ouvriers ?",
      options: [
        "20",
        "Aucune limite si on a assez d'ouvriers",
        "5",
        "80",
      ],
      correct: 2,
      explanation: "Le plafond est 1 divisé par la part série : 1 / 0,2 = 5. La partie série se joue sur un seul ouvrier quoi qu'il arrive, et elle finit par dominer la durée totale.",
    },
    {
      question: "Sans aucune part série, la simulation donne 50,21 avec 256 ouvriers, et non 256. Pourquoi ?",
      options: [
        "La loi d'Amdahl est fausse",
        "La simulation oublie de compter les ouvriers",
        "Le travail est découpé en seulement 400 morceaux inégaux : le plus gros morceau dicte la fin",
        "Les ouvriers sont trop nombreux pour que le tas fonctionne",
      ],
      correct: 2,
      explanation: "Un morceau ne se partage pas entre deux ouvriers. Avec beaucoup d'ouvriers, la durée est celle du plus gros morceau : c'est la granularité du découpage, un plafond que la formule d'Amdahl ne décrit pas.",
    },
    {
      question: "Pourquoi une fonction appelée seulement toutes les 120 s en moyenne subit-elle des démarrages à froid presque à chaque appel (91,2 % avec 10 s de garde) ?",
      options: [
        "Parce que le code de la fonction est trop long",
        "Parce que l'instance est détruite avant l'appel suivant, ce qui impose d'en démarrer une nouvelle",
        "Parce que le fournisseur facture chaque appel plus cher",
        "Parce que Python est lent au démarrage, quel que soit le fournisseur",
      ],
      correct: 1,
      explanation: "Si le temps entre deux appels dépasse la garde, l'instance a disparu quand la requête suivante arrive. Il faut en démarrer une, d'où le surcoût de latence, qui touche surtout les fonctions rarement appelées.",
    },
  ],
};
