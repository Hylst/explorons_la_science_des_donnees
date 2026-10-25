import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

// AUCUN prix réel : les tarifs ci-dessous sont FICTIFS, exprimés en « unités » inventées pour le cours, parce que les
// tarifs des fournisseurs changent et que le site n'affiche aucun prix. Seuls les rapports entre ces nombres
// ont un sens pédagogique ; ils ne représentent aucun fournisseur.
const TARIFS = lines(
  "# Tarifs FICTIFS en unités (jamais des euros ni des dollars) : ils ne représentent aucun fournisseur.",
  "TARIFS_FICTIFS = {",
  "    'calcul_demande_heure': 10.0,        # machine louée à la demande, par heure",
  "    'calcul_reserve_heure': 6.0,         # machine avec engagement : l'heure est due, utilisée ou non",
  "    'calcul_interruptible_heure': 3.0,   # machine pouvant être reprise par le fournisseur",
  "    'stockage_go_mois': 2.0,             # un gigaoctet stocké pendant un mois",
  "    'requetes_millier': 0.4,             # mille requêtes sur les données",
  "    'sortie_go': 9.0,                    # un gigaoctet qui sort du cloud vers l'extérieur",
  "}",
);

const ESTIMATEUR = lines(
  TARIFS,
  "",
  "def estimer_cout(projet, tarifs):",
  "    # une ligne par poste de dépense, puis le total",
  "    detail = {",
  "        'calcul': projet['heures_calcul'] * tarifs['calcul_demande_heure'],",
  "        'stockage': projet['stockage_go'] * projet['mois'] * tarifs['stockage_go_mois'],",
  "        'requetes': projet['requetes'] / 1000 * tarifs['requetes_millier'],",
  "        'sortie': projet['sortie_go'] * tarifs['sortie_go'],",
  "    }",
  "    detail['total'] = sum(detail.values())",
  "    return detail",
  "",
  "projet = {'heures_calcul': 120, 'stockage_go': 500, 'mois': 3, 'requetes': 2_000_000, 'sortie_go': 80}",
);

export const moduleCouts: LessonModule = {
  id: "estimer-couts",
  title: "Estimer et maîtriser les coûts",
  duration: "2 h 30",
  summary: "Savoir ce qui se paie dans le cloud (durée de calcul, volume et durée de stockage, requêtes, sortie de données), écrire un estimateur, comparer à la demande, réservé et interruptible, et traquer les ressources oubliées. Tous les tarifs du cours sont fictifs.",
  objectives: [
    "Décomposer le coût d'un projet en postes (calcul, stockage, requêtes, sortie de données) et écrire un estimateur",
    "Calculer le seuil à partir duquel une réservation devient plus avantageuse que la location à la demande",
    "Simuler des interruptions et des reprises, et expliquer le rôle des points de sauvegarde",
    "Repérer des ressources inactives dans un inventaire et mettre en place budgets et alertes",
  ],
  sections: [
    {
      kind: "text",
      md: `### Aucun prix réel dans ce module

Ce module parle d'argent sans citer un seul prix. Les tarifs des fournisseurs changent, varient d'une région à l'autre, et dépendent de remises qui ne regardent que les contrats. Ce site n'en affiche aucun. Tout ce qui suit est calculé avec des **tarifs fictifs, exprimés en « unités »** : ce ne sont ni des euros ni des dollars, et ils ne représentent aucun fournisseur. Seuls les **rapports** entre eux servent à comprendre : une heure de calcul réservé coûte, dans nos tarifs, 60 % d'une heure à la demande, parce que nous l'avons décidé ainsi, pas parce qu'un fournisseur le fait.

La méthode, elle, est réelle : avant de lancer quoi que ce soit, on **décompose** la dépense en postes, on **estime** chacun avec la grille officielle du fournisseur (leur outil de simulation de prix existe chez chacun des trois grands), et on **surveille** ensuite ce qui est vraiment dépensé. La simulation de ce module ne montre pas la facturation exacte : arrondis à la seconde ou à la minute, paliers de prix, taxes, remises et frais cachés d'un fournisseur ne s'y trouvent pas.`,
    },
    {
      kind: "text",
      md: `### Ce qui se paie

Quatre grandes familles de postes, valables chez tous les fournisseurs, mais avec des noms et des conditions différents.

- Le **calcul** se paie à la **durée** : machines virtuelles à l'heure ou à la seconde, fonctions à la durée d'exécution (module 3). Une machine allumée mais inactive se paie.
- Le **stockage** se paie au **volume et au temps** : des gigaoctets pendant des mois. Plus la classe de stockage est « froide » (accès rare, module 2), moins elle est chère à garder, mais plus elle coûte à relire.
- Les **requêtes** se paient parfois **à l'unité** : lectures et écritures d'objets, interrogations d'un entrepôt de données. Un million de petites requêtes inutiles se voit sur la facture.
- La **sortie de données** (*egress*) se paie souvent quand des données quittent le cloud, ou passent d'une région à une autre. Faire entrer des données est en général gratuit ou peu cher, les en sortir ne l'est pas : c'est un des mécanismes qui rendent un changement de fournisseur coûteux. À vérifier dans la grille du fournisseur choisi.

Un projet de données paie rarement un seul poste. Un modèle entraîné peu de temps sur beaucoup de données est dominé par le stockage ; un service très sollicité, par les requêtes et la sortie. D'où l'intérêt de l'estimer **avant** : la ligne qui domine n'est pas toujours celle qu'on croyait.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        ESTIMATEUR,
        "",
        "detail = estimer_cout(projet, TARIFS_FICTIFS)",
        "print('poste       unités    part')",
        "for poste, cout in detail.items():",
        "    print(f'{poste:10} {cout:8.1f} {cout / detail[\"total\"]:7.1%}')",
        "",
        "# et si on évitait toute sortie de données ?",
        "sans_sortie = estimer_cout(dict(projet, sortie_go=0), TARIFS_FICTIFS)",
        "print('sans sortie de données :', sans_sortie['total'], 'unités')",
      ),
      caption: "Pour 120 h de calcul, 500 Go stockés pendant 3 mois, 2 millions de requêtes et 80 Go sortants, l'estimation est de 5 720 unités. Le stockage domine avec 3 000 unités (52,4 %), devant le calcul (1 200, soit 21,0 %), les requêtes (800, soit 14,0 %) et la sortie (720, soit 12,6 %). Sans aucune sortie de données, le total tomberait à 5 000 unités. Ces chiffres sortent des tarifs fictifs ci-dessus : une grille réelle donnerait d'autres proportions, la démarche resterait la même.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "`estimer_cout`, `TARIFS_FICTIFS` et `projet` sont prêts. Calculez dans `detail` l'estimation du projet, dans `part_sortie` la part du poste `'sortie'` dans le total (un nombre entre 0 et 1) et dans `total_moitie_sortie` le total si la sortie de données était divisée par deux (`sortie_go` à 40).",
      setup: ESTIMATEUR,
      starter: lines(
        "detail = None",
        "part_sortie = 0.0",
        "total_moitie_sortie = 0.0",
      ),
      solution: lines(
        "detail = estimer_cout(projet, TARIFS_FICTIFS)",
        "part_sortie = detail['sortie'] / detail['total']",
        "total_moitie_sortie = estimer_cout(dict(projet, sortie_go=40), TARIFS_FICTIFS)['total']",
        "print(round(part_sortie, 3), total_moitie_sortie)",
      ),
      test: lines(
        "assert isinstance(detail, dict) and detail['total'] == 5720.0, \"detail doit être le résultat d'estimer_cout(projet, TARIFS_FICTIFS), dont le total est 5720\"",
        "assert abs(part_sortie - 720 / 5720) < 1e-9, f\"la part de la sortie est 720 / 5720, soit environ 0,126 ; vous trouvez {part_sortie}\"",
        "assert abs(total_moitie_sortie - 5360.0) < 1e-9, f\"avec 40 Go sortants, la sortie coûte 360 au lieu de 720 : le total est 5360 ; vous trouvez {total_moitie_sortie}\"",
      ),
      hint: "dict(projet, sortie_go=40) fabrique une copie du projet avec une valeur modifiée, sans toucher à l'original.",
    },
    {
      kind: "text",
      md: `### À la demande, réservé, interruptible

Une même heure de calcul s'achète de trois façons.

- **À la demande** : on paie à l'heure ce qu'on utilise, sans engagement. C'est le plus souple, et le plus cher à l'heure.
- **Réservé** : on s'engage sur une durée (un an ou plus) pour une capacité, contre un tarif horaire plus bas. L'engagement se paie **que la machine travaille ou non**. Chaque fournisseur a ses formules (réservations, engagements d'usage, plans d'épargne), avec des conditions propres.
- **Interruptible** (*spot* chez AWS, *préemptible* ou *Spot* chez Google Cloud, *Spot* chez Azure) : on utilise la capacité excédentaire du fournisseur, à un prix nettement plus bas, mais il peut la **reprendre** avec un court préavis. Le travail doit donc tolérer d'être interrompu.

Le choix se joue sur l'**utilisation**. Notre grille fictive : 10 unités l'heure à la demande, 6 unités l'heure réservé, à payer pour toutes les heures d'un mois de 720 heures (30 jours de 24 heures, une convention de calcul). Réserver coûte donc 6 × 720 = 4 320 unités par mois, quoi qu'on fasse. À la demande, on paie 10 unités par heure utilisée. Les deux se valent à l'**heure d'utilisation** :`,
    },
    {
      kind: "equation",
      latex: "u^{*} = \\frac{p_{r} \\times H}{p_{d}} = \\frac{6 \\times 720}{10} = 432 \\text{ h} \\qquad \\frac{u^{*}}{H} = 60\\,\\%",
      narrow: "u^{*} = \\frac{p_{r} \\times H}{p_{d}}\\\\ = \\frac{6 \\times 720}{10} = 432 \\text{ h}\\\\ \\frac{u^{*}}{H} = 60\\,\\%",
      caption: "p_r : tarif horaire réservé, p_d : tarif horaire à la demande, H : heures du mois, u* : heures d'utilisation à partir desquelles réserver est moins cher. Les tarifs sont ceux, fictifs, du cours.",
    },
    {
      kind: "text",
      md: `Dans notre grille, réserver ne se justifie que si la machine travaille **plus de 60 % du temps**. En dessous, on paie des heures vides. Pour un entraînement qui tourne quelques heures par semaine, la location à la demande (ou interruptible) est plus économique. Pour un service qui répond sans interruption, la réservation devient intéressante.

Reste l'interruptible : à 3 unités l'heure, il paraît imbattable. Mais une interruption fait perdre du travail. Si un entraînement de 20 heures est interrompu à la 19e et qu'il recommence de zéro, on a payé 19 heures pour rien. La parade s'appelle le **point de sauvegarde** (*checkpoint*) : on enregistre régulièrement l'état du travail, et après une interruption on reprend au dernier point. Plus ils sont rapprochés, moins on perd, mais chaque sauvegarde prend elle aussi un peu de temps (ce coût n'est pas simulé ici).

La simulation suivante fait travailler 2 000 fois un entraînement de **20 heures de travail** sur une machine interruptible. Chaque heure, il y a une probabilité *p* d'interruption (fictive : 0,02 et 0,1). L'heure en cours est perdue ; le travail revient au dernier point de sauvegarde (ou à zéro sans sauvegarde). On facture toutes les heures passées, perdues comprises, à 3 unités. On compare aux 20 × 10 = 200 unités de la location à la demande, sans interruption.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        TARIFS,
        "import numpy as np",
        "",
        "def simuler_job(travail, p, point_tous_les, rng):",
        "    progres = 0          # heures de travail conservées",
        "    facturees = 0        # heures payées, y compris celles perdues",
        "    interruptions = 0",
        "    while progres < travail:",
        "        facturees += 1",
        "        if rng.random() < p:                      # le fournisseur reprend la machine",
        "            interruptions += 1",
        "            if point_tous_les is None:",
        "                progres = 0                        # pas de sauvegarde : on repart de zéro",
        "            else:",
        "                progres = progres // point_tous_les * point_tous_les   # dernier point de sauvegarde",
        "        else:",
        "            progres += 1",
        "    return facturees, interruptions",
        "",
        "rng = np.random.default_rng(5)",
        "travail = 20",
        "a_la_demande = travail * TARIFS_FICTIFS['calcul_demande_heure']",
        "print('à la demande, sans interruption :', a_la_demande, 'unités')",
        "print('p      sauvegarde  heures payées  95e centile  interruptions  coût')",
        "for p in [0.02, 0.1]:",
        "    for point in [None, 10, 4, 1]:",
        "        res = np.array([simuler_job(travail, p, point, rng) for _ in range(2000)])",
        "        heures = res[:, 0]",
        "        cout = heures.mean() * TARIFS_FICTIFS['calcul_interruptible_heure']",
        "        nom = 'aucune' if point is None else f'toutes les {point} h'",
        "        print(f'{p:<6} {nom:<16} {heures.mean():8.2f} {np.percentile(heures, 95):10.1f} {res[:, 1].mean():12.2f} {cout:8.1f}')",
      ),
      caption: "Avec p = 0,02, l'interruptible gagne toujours : de 76,4 unités sans sauvegarde (25,46 heures payées en moyenne pour 20 de travail) à 61,2 avec une sauvegarde par heure (20,39 heures), contre 200 à la demande. Avec p = 0,1, une interruption toutes les dix heures en moyenne, tout change : sans sauvegarde, 73,38 heures payées en moyenne, 7,36 interruptions, et un coût moyen de 220,1 unités, donc PLUS cher que les 200 de la location à la demande ; dans le pire des cas courants (95e centile) on paie 184 heures. Une sauvegarde toutes les 10 heures ramène le coût à 110,8, toutes les 4 heures à 78,1, toutes les heures à 66,5 (22,16 heures payées). Ce que la simulation ne montre pas : le temps d'attente pour retrouver une machine après une reprise, le coût des sauvegardes elles-mêmes, et le fait que les vraies interruptions ne tombent pas à intervalles réguliers.",
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        TARIFS,
        "import matplotlib.pyplot as plt",
        "",
        "HEURES_MOIS = 720",
        "reserve_fixe = TARIFS_FICTIFS['calcul_reserve_heure'] * HEURES_MOIS     # dû même sans rien faire",
        "heures = list(range(0, HEURES_MOIS + 1, 10))",
        "demande = [TARIFS_FICTIFS['calcul_demande_heure'] * h for h in heures]",
        "",
        "seuil = reserve_fixe / TARIFS_FICTIFS['calcul_demande_heure']",
        "print('réserver coûte', reserve_fixe, 'unités par mois, quoi qu\\'il arrive')",
        "print('seuil de rentabilité :', seuil, 'heures,', f'{seuil / HEURES_MOIS:.0%}', 'du mois')",
        "for h in [50, 200, 432, 500, 720]:",
        "    d = TARIFS_FICTIFS['calcul_demande_heure'] * h",
        "    print(f'{h:4d} h : à la demande {d:7.0f}   réservé {reserve_fixe:7.0f}   moins cher : {\"réservé\" if reserve_fixe < d else \"à la demande\" if d < reserve_fixe else \"égalité\"}')",
        "",
        "fig, ax = plt.subplots(figsize=(6.5, 3.6))",
        "ax.plot(heures, demande, label='à la demande')",
        "ax.axhline(reserve_fixe, color='tab:red', label='réservé (dû en entier)')",
        "ax.axvline(seuil, color='gray', linestyle=':')",
        "ax.set_xlabel('heures utilisées dans le mois')",
        "ax.set_ylabel('coût en unités fictives')",
        "ax.set_title('Réservé contre à la demande (tarifs fictifs)')",
        "ax.legend()",
        "plt.tight_layout()",
        "plt.show()",
      ),
      caption: "Réserver coûte 4 320 unités par mois, utilisé ou non. Le seuil est de 432 heures, soit 60 % du mois. À 50 heures la demande coûte 500 unités, à 200 heures 2 000 : bien moins que 4 320. À 432 heures les deux sont à égalité, à 500 heures la demande coûte 5 000, soit plus que la réservation, et à 720 heures 7 200. Le trait pointillé du graphique marque ce seuil.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `option_la_moins_chere(heures)` qui renvoie `'demande'` ou `'reserve'` selon l'option qui coûte le moins pour un mois où la machine travaille `heures` heures. Utilisez `TARIFS_FICTIFS` et `HEURES_MOIS`. En cas d'égalité, renvoyez `'demande'` (pas d'engagement pour le même prix).",
      setup: lines(
        TARIFS,
        "HEURES_MOIS = 720",
      ),
      starter: lines(
        "def option_la_moins_chere(heures):",
        "    return 'demande'",
      ),
      solution: lines(
        "def option_la_moins_chere(heures):",
        "    demande = TARIFS_FICTIFS['calcul_demande_heure'] * heures",
        "    reserve = TARIFS_FICTIFS['calcul_reserve_heure'] * HEURES_MOIS",
        "    return 'reserve' if reserve < demande else 'demande'",
        "",
        "print(option_la_moins_chere(100), option_la_moins_chere(600))",
      ),
      test: lines(
        "assert option_la_moins_chere(100) == 'demande', \"pour 100 h, la demande coûte 1000 et la réservation 4320 : la demande gagne\"",
        "assert option_la_moins_chere(431) == 'demande', \"à 431 h la demande coûte 4310, moins que 4320\"",
        "assert option_la_moins_chere(432) == 'demande', \"à 432 h les deux coûtent 4320 : en cas d'égalité, renvoyez 'demande'\"",
        "assert option_la_moins_chere(433) == 'reserve', \"à 433 h la demande coûte 4330, plus que 4320 : la réservation gagne\"",
        "assert option_la_moins_chere(720) == 'reserve', \"pour un mois entier, la réservation gagne\"",
      ),
      hint: "Calculez les deux coûts du mois (réservé = tarif réservé × HEURES_MOIS) puis comparez-les.",
    },
    {
      kind: "text",
      md: `### Budgets, alertes et ressources oubliées

La dépense du cloud se découvre souvent **après coup**, sur la facture. Trois habitudes la rendent visible plus tôt.

- Un **budget** : une somme mensuelle fixée pour un projet. Les trois fournisseurs offrent un service de budgets avec des **alertes** : un message quand la dépense atteint un seuil (par exemple la moitié, les trois quarts, la totalité), ou quand la **prévision** de fin de mois dépasse le budget. Une alerte prévient, elle n'arrête rien par elle-même, sauf si on a prévu une action automatique.
- Des **étiquettes** (*tags*) sur chaque ressource : propriétaire, projet, environnement. Sans elles, une ligne de facture n'a pas de responsable à qui poser la question.
- Un **inventaire régulier** des ressources inactives. C'est la source classique de dépenses inutiles : une machine de test oubliée un vendredi soir, un disque resté après la suppression de sa machine, une adresse IP réservée pour rien, une base de démonstration jamais éteinte.

Éteindre une machine arrête souvent la facturation du calcul, mais pas celle de son disque. Voici les commandes à lire pour arrêter une machine chez chacun des trois fournisseurs. Elles ne tournent pas dans le moteur du site, qui n'a pas de compte de fournisseur ; les options exactes sont à vérifier dans la documentation en vigueur.

\`\`\`bash
# AWS (EC2) : arrêter une instance
aws ec2 stop-instances --instance-ids <identifiant>

# Google Cloud (Compute Engine) : arrêter une machine
gcloud compute instances stop <nom> --zone <zone>

# Azure (Virtual Machines) : libérer la machine pour arrêter la facturation du calcul
az vm deallocate --resource-group <groupe> --name <nom>
\`\`\`

Le code ci-dessous construit un **inventaire simulé** de 60 ressources (machines, volumes de disque, adresses IP, bases) avec pandas, graine fixe. Les tarifs sont encore fictifs (unités par jour). Les règles d'inactivité sont des exemples : machine dont l'usage moyen du processeur est sous 5 %, volume ou adresse IP non rattaché à une machine. Un vrai seuil se décide avec l'équipe, après vérification.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "import pandas as pd",
        "",
        "# Inventaire simulé : 60 ressources (graine fixe). Coûts journaliers FICTIFS en unités.",
        "rng = np.random.default_rng(21)",
        "n = 60",
        "cout_jour = {'machine': 12.0, 'volume': 3.0, 'adresse_ip': 0.5, 'base': 20.0}",
        "types = rng.choice(['machine', 'volume', 'adresse_ip', 'base'], n, p=[0.4, 0.3, 0.1, 0.2])",
        "inventaire = pd.DataFrame({",
        "    'id': [f'r{i:03d}' for i in range(n)],",
        "    'type': types,",
        "    'cree_il_y_a_jours': rng.integers(2, 400, n),",
        "    'cpu_moyen': np.round(rng.gamma(2.0, 12.0, n), 1).clip(0, 100),   # % d'usage du processeur",
        "    'rattache': rng.random(n) < 0.8,                                   # relié à une machine ?",
        "    'etiquette_proprietaire': rng.random(n) < 0.7,",
        "})",
        "inventaire['cout_jour'] = inventaire['type'].map(cout_jour)",
        "print(inventaire['type'].value_counts().to_dict())",
        "",
        "# règles d'inactivité (exemples) : machine à moins de 5 % de processeur, volume ou IP non rattaché",
        "machine_oisive = (inventaire['type'] == 'machine') & (inventaire['cpu_moyen'] < 5)",
        "volume_orphelin = (inventaire['type'] == 'volume') & ~inventaire['rattache']",
        "ip_orpheline = (inventaire['type'] == 'adresse_ip') & ~inventaire['rattache']",
        "inventaire['inactive'] = machine_oisive | volume_orphelin | ip_orpheline",
        "",
        "inactives = inventaire[inventaire['inactive']]",
        "print(inactives[['id', 'type', 'cpu_moyen', 'rattache', 'etiquette_proprietaire', 'cout_jour']].to_string(index=False))",
        "",
        "total_mois = inventaire['cout_jour'].sum() * 30",
        "perdu_mois = inactives['cout_jour'].sum() * 30",
        "print('ressources inactives :', len(inactives), 'sur', n)",
        "print('coût mensuel de tout l\\'inventaire :', total_mois, 'unités')",
        "print('dont ressources inactives :', perdu_mois, 'unités', f'({perdu_mois / total_mois:.1%})')",
        "print('inactives sans propriétaire connu :', int((~inactives['etiquette_proprietaire']).sum()))",
        "print('ressources sans étiquette (toutes) :', int((~inventaire['etiquette_proprietaire']).sum()))",
      ),
      caption: "L'inventaire contient 24 machines, 20 volumes, 9 bases et 7 adresses IP. Six ressources sont inactives selon les règles : 2 machines (24 unités par jour) et 4 volumes (12 par jour). Ramené à 30 jours, cela fait 1 080 unités sur 15 945 pour tout l'inventaire, soit 6,8 %. Parmi ces six, 4 n'ont pas d'étiquette de propriétaire, et 22 ressources sur 60 en manquent : sans propriétaire, impossible de demander « peut-on l'éteindre ? ». Un faible usage du processeur ne prouve pas l'inutilité (une machine peut attendre une rare requête urgente) : on vérifie avant d'éteindre.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "`inventaire` est un tableau pandas avec les colonnes `id`, `type`, `cpu_moyen` et `rattache`. Écrivez `inactives(inventaire, seuil_cpu)` qui renvoie la liste des `id` des machines (`type == 'machine'`) dont `cpu_moyen` est strictement inférieur à `seuil_cpu`, ainsi que des volumes (`type == 'volume'`) non rattachés, dans l'ordre du tableau.",
      setup: lines(
        "import pandas as pd",
        "inventaire = pd.DataFrame({",
        "    'id': ['a', 'b', 'c', 'd', 'e', 'f'],",
        "    'type': ['machine', 'machine', 'volume', 'volume', 'adresse_ip', 'machine'],",
        "    'cpu_moyen': [2.0, 40.0, 0.0, 0.0, 0.0, 4.9],",
        "    'rattache': [True, True, False, True, False, True],",
        "})",
      ),
      starter: lines(
        "def inactives(inventaire, seuil_cpu):",
        "    return []",
      ),
      solution: lines(
        "def inactives(inventaire, seuil_cpu):",
        "    machine = (inventaire['type'] == 'machine') & (inventaire['cpu_moyen'] < seuil_cpu)",
        "    volume = (inventaire['type'] == 'volume') & ~inventaire['rattache']",
        "    return list(inventaire.loc[machine | volume, 'id'])",
        "",
        "print(inactives(inventaire, 5))",
      ),
      test: lines(
        "assert inactives(inventaire, 5) == ['a', 'c', 'f'], f\"avec un seuil de 5 %, on attend ['a', 'c', 'f'] (machine à 2 %, volume non rattaché, machine à 4,9 %) ; vous trouvez {inactives(inventaire, 5)}\"",
        "assert inactives(inventaire, 1) == ['c'], f\"avec un seuil de 1 %, aucune machine n'est sous le seuil et seul le volume non rattaché reste : attendu ['c'] ; vous trouvez {inactives(inventaire, 1)}\"",
        "assert 'e' not in inactives(inventaire, 100), \"une adresse IP n'entre pas dans cette règle\"",
        "assert 'b' not in inactives(inventaire, 5), \"la machine à 40 % de processeur est active\"",
      ),
      hint: "Combinez deux masques booléens avec | : (type == 'machine') & (cpu_moyen < seuil), et (type == 'volume') & ~rattache.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Au 10 du mois, voici la dépense de chacun des 10 premiers jours, dans `depenses`. Calculez dans `projection` la dépense prévue pour un mois de 30 jours en prolongeant la moyenne journalière, et dans `alerte` un booléen vrai si cette projection dépasse `budget` (3 000 unités).",
      setup: lines(
        "depenses = [90.0, 110.0, 100.0, 95.0, 105.0, 120.0, 80.0, 100.0, 115.0, 85.0]",
        "budget = 3000.0",
      ),
      starter: lines(
        "projection = 0.0",
        "alerte = False",
      ),
      solution: lines(
        "moyenne = sum(depenses) / len(depenses)",
        "projection = moyenne * 30",
        "alerte = projection > budget",
        "print(projection, alerte)",
      ),
      test: lines(
        "assert abs(projection - 3000.0) < 1e-9, f\"la moyenne journalière est 100 : la projection sur 30 jours est 3000 ; vous trouvez {projection}\"",
        "assert alerte is False, \"3000 ne dépasse pas un budget de 3000 : l'alerte ne doit pas se déclencher à l'égalité (comparaison stricte)\"",
      ),
      hint: "Prolonger la moyenne : somme des dépenses divisée par le nombre de jours écoulés, multipliée par 30. L'alerte compare la projection au budget avec >.",
    },
    {
      kind: "note",
      tone: "info",
      md: "Pensez aussi aux alternatives : des hébergeurs européens et des solutions auto-hébergées existent, avec leurs propres modèles de coût. Comparer honnêtement demande le même exercice (décomposer en postes, estimer, surveiller) avec leurs grilles, qu'on ne peut pas lire d'ici.",
    },
  ],
  quiz: [
    {
      question: "Dans la grille fictive du cours, à partir de combien d'heures d'utilisation par mois la réservation devient-elle moins chère que la location à la demande ?",
      options: [
        "À partir de 432 heures, soit 60 % du mois",
        "Dès la première heure",
        "À partir de 720 heures, un mois plein",
        "Elle n'est jamais moins chère",
      ],
      correct: 0,
      explanation: "La réservation coûte 6 × 720 = 4 320 unités par mois, quoi qu'on fasse, contre 10 unités par heure à la demande : 4 320 / 10 = 432 heures. En dessous, on paie des heures vides.",
    },
    {
      question: "Dans la simulation, un entraînement de 20 heures sur machine interruptible avec p = 0,1 et aucune sauvegarde coûte en moyenne 220,1 unités, contre 200 à la demande. Pourquoi ?",
      options: [
        "Parce que le tarif interruptible est plus élevé que le tarif à la demande",
        "Parce que le fournisseur facture une pénalité par interruption",
        "Parce que la machine travaille plus lentement",
        "Parce que sans sauvegarde chaque interruption renvoie le travail à zéro, et que les heures perdues se paient quand même",
      ],
      correct: 3,
      explanation: "Le tarif horaire est bien plus bas, mais le nombre d'heures payées explose (73,38 en moyenne pour 20 de travail). Avec une sauvegarde par heure, il retombe à 22,16 heures et le coût à 66,5 unités.",
    },
    {
      question: "Quel poste de coût est souvent oublié quand on envisage de changer de fournisseur ou de région ?",
      options: [
        "Le calcul à la demande",
        "La sortie de données, souvent facturée au gigaoctet quand les données quittent le cloud",
        "Le nombre de lignes du code",
        "Le nom des ressources",
      ],
      correct: 1,
      explanation: "Faire entrer des données est en général peu cher, les en faire sortir se paie souvent. Dans l'exemple, la sortie pesait 12,6 % du total ; sur un très gros volume, elle peut dominer. À vérifier dans la grille choisie.",
    },
    {
      question: "L'inventaire simulé compte 6 ressources inactives sur 60, pour 6,8 % du coût mensuel. Quelle suite est la plus prudente ?",
      options: [
        "Supprimer immédiatement les six, puisqu'elles sont inactives",
        "Ignorer le résultat : 6,8 % n'est pas grand-chose",
        "Chercher les propriétaires (4 des 6 n'en ont pas d'étiquette) et vérifier avant d'éteindre ou de supprimer",
        "Réserver davantage de machines pour compenser",
      ],
      correct: 2,
      explanation: "Un faible usage du processeur ne prouve pas l'inutilité : on vérifie d'abord avec le propriétaire. Sans étiquette de propriétaire, personne à interroger : d'où l'intérêt d'étiqueter chaque ressource dès sa création.",
    },
    {
      question: "Quelle est la limite principale des chiffres de ce module ?",
      options: [
        "Ils viennent de tarifs fictifs en unités : seuls les rapports et la méthode sont instructifs, pas les valeurs",
        "Ils sont tirés de la grille tarifaire d'un fournisseur précis",
        "Ils sont en euros et valent pour toute l'Europe",
        "Ils ne dépendent d'aucune hypothèse",
      ],
      correct: 0,
      explanation: "Aucun prix réel n'est utilisé : les tarifs changent et varient selon la région et le contrat. On apprend à décomposer, estimer et surveiller, puis on recalcule avec la grille officielle du fournisseur choisi.",
    },
  ],
};
