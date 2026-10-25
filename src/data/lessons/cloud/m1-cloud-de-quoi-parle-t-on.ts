import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

// Demande horaire simulée sur 7 jours (graine fixe) : creux la nuit, bosse en journée, semaine plus chargée que le
// week-end, bruit de 8 %, et une heure (la 61e) multipliée par 3 pour figurer une campagne qui marche trop bien.
// Rien n'est mesuré sur un vrai service : tout est hypothèse déclarée dans le texte.
const SIMULATION = lines(
  "import numpy as np",
  "",
  "rng = np.random.default_rng(42)",
  "heures = np.arange(7 * 24)                     # 168 heures, du lundi 0 h au dimanche 23 h",
  "heure_du_jour = heures % 24",
  "jour = heures // 24",
  "# creux de 120 demandes par heure la nuit, bosse en journée, deux fois moins le week-end",
  "base = 120 + 100 * np.clip(np.sin((heure_du_jour - 6) / 24 * 2 * np.pi), 0, None)",
  "base = base * np.where(jour >= 5, 0.5, 1.0)",
  "demande = base * rng.normal(1.0, 0.08, size=heures.size)",
  "demande[60] *= 3.0                             # une heure de campagne : trois fois la demande habituelle",
  "demande = np.round(demande).astype(int)",
  "",
  "DEBIT = 50    # hypothèse : une machine sert 50 demandes par heure",
  "",
  "def bilan(machines, demande):",
  "    \"\"\"machines : nombre de machines allumées à chaque heure. Renvoie les trois mesures du module.\"\"\"",
  "    capacite = machines * DEBIT",
  "    servies = np.minimum(demande, capacite)",
  "    return {",
  "        'heures_machines': int(machines.sum()),",
  "        'non_servies': int(demande.sum() - servies.sum()),",
  "        'utilisation': float(servies.sum() / capacite.sum()),",
  "    }",
);

export const moduleCloudIntro: LessonModule = {
  id: "cloud-de-quoi-parle-t-on",
  title: "Le cloud, de quoi parle-t-on ?",
  duration: "2 h",
  summary: "Distinguer IaaS, PaaS, SaaS et services managés, savoir qui est responsable de quoi, comprendre régions et zones de disponibilité, puis mesurer par simulation ce que l'élasticité change par rapport à une capacité fixe.",
  objectives: [
    "Situer un service sur l'échelle IaaS, PaaS, SaaS et dire ce que le fournisseur gère à votre place",
    "Appliquer le modèle de responsabilité partagée à des exemples concrets",
    "Expliquer le rôle des régions et des zones de disponibilité, et ce qu'elles ne garantissent pas",
    "Comparer par simulation une capacité fixe et une capacité élastique : utilisation, heures-machines, demandes non servies",
  ],
  sections: [
    {
      kind: "text",
      md: `### Le cloud, c'est l'ordinateur de quelqu'un d'autre, avec un compteur

Le **cloud** (« nuage ») désigne l'usage de ressources informatiques (calcul, stockage, réseau, bases de données, services d'analyse) **louées à la demande**, par Internet, chez un fournisseur qui les exploite dans ses centres de données. Trois mots résument l'idée : **à la demande** (on crée une ressource en quelques minutes, sans acheter de machine), **à l'usage** (on paie ce qu'on consomme, à la durée ou au volume), **en libre-service** (tout se pilote par une interface web, une ligne de commande ou du code).

Ce cours est **neutre entre fournisseurs**. Les trois plus connus, **AWS**, **Google Cloud** et **Azure**, proposent des services équivalents sous des noms différents ; on les cite à égalité, sans en préférer aucun. Il existe aussi des hébergeurs européens et des solutions que l'on héberge soi-même : les mécanismes vus ici s'y retrouvent, même si les noms changent. Aucun prix réel n'est cité : ils changent souvent, et un cours qui les recopie vieillit mal. On enseigne les **mécanismes**.

Pour un projet de data science, le cloud sert à trois choses : **stocker** des données trop grosses ou trop partagées pour un portable, **calculer** davantage ou plus longtemps que sa propre machine ne le permet, et **mettre en service** un modèle pour que d'autres l'utilisent.`,
    },
    {
      kind: "text",
      md: `### IaaS, PaaS, SaaS et services managés

On range les offres selon **la part du travail que le fournisseur prend à sa charge**. Plus on monte, moins on gère, et moins on a la main.

- **IaaS** (*Infrastructure as a Service*) : on loue des briques brutes, une machine virtuelle, un disque, un réseau. Vous installez le système, les bibliothèques, vous appliquez les mises à jour. Exemples : EC2 (AWS), Compute Engine (Google Cloud), Virtual Machines (Azure).
- **PaaS** (*Platform as a Service*) : on fournit son programme, la plateforme s'occupe de le faire tourner (système, montée en charge, redémarrage). Exemples : Cloud Run (Google Cloud), les fonctions Lambda (AWS) ou Azure Functions, à mi-chemin entre plateforme et « sans serveur ».
- **SaaS** (*Software as a Service*) : on utilise un logiciel fini, sans rien installer, une messagerie ou un tableur en ligne par exemple. Vous ne gérez que vos données et vos comptes.
- **Service managé** : un composant précis (base de données, entrepôt de données, stockage d'objets) dont le fournisseur gère l'installation, les sauvegardes et les mises à jour. Exemples : S3, Cloud Storage et Blob Storage pour les fichiers ; BigQuery, Redshift et Synapse pour l'analyse de tables.

Les frontières sont floues et les fournisseurs inventent des intermédiaires. Retenez la question utile : **« qu'est-ce que je dois encore faire moi-même ? »** Un service managé vous décharge de l'exploitation, pas de la réflexion : il faut toujours choisir où ranger les données, qui y accède et combien cela coûtera.`,
    },
    {
      kind: "text",
      md: `### Qui est responsable de quoi

Le **modèle de responsabilité partagée** découpe les tâches entre le fournisseur et vous. Le principe, commun aux trois grands fournisseurs :

- le fournisseur est responsable **du cloud lui-même** : bâtiments, électricité, matériel, réseau interne, couche de virtualisation ;
- vous êtes responsable **de ce que vous mettez dans le cloud** : vos données, vos comptes et leurs droits, la configuration de vos services.

La ligne se déplace avec le type de service :

- sur une **machine virtuelle** (IaaS), le système d'exploitation, ses correctifs, le pare-feu de la machine et les logiciels installés sont à vous ;
- sur une **plateforme** (PaaS), le fournisseur gère le système ; votre code et ses dépendances restent à vous ;
- sur un **logiciel** (SaaS), il reste vos données, vos utilisateurs et leurs droits.

Ce qui reste **toujours** à vous : **qui a le droit de lire vos données**. Une immense partie des fuites de données dans le cloud vient d'un fichier laissé ouvert par erreur, non d'une attaque contre le fournisseur. Le module 6 y revient.`,
    },
    {
      kind: "text",
      md: `### Régions et zones de disponibilité

Un fournisseur organise ses centres de données en **régions**, des zones géographiques (une grande ville, un pays) où l'on choisit d'installer ses ressources. Chaque région comprend plusieurs **zones de disponibilité** : des centres de données distincts, avec leur propre alimentation et leur propre réseau, reliés entre eux par des liaisons rapides.

Choisir une région, c'est arbitrer entre :

- la **latence** : plus les données sont proches des utilisateurs, plus la réponse est rapide ;
- la **réglementation** : certaines données doivent rester dans un pays ou une zone juridique (voir le module 6) ;
- le **catalogue** et le **coût** : tous les services n'existent pas partout, et les tarifs varient d'une région à l'autre ;
- la **résilience** : répartir sur plusieurs zones protège d'une panne de zone, répartir sur plusieurs régions protège d'une panne de région.

Chaque fournisseur emploie ses mots (région, zone, *availability zone*, *zone de disponibilité*), mais l'idée est la même. Le nombre de régions de chacun change souvent ; il ne sera pas cité ici.`,
    },
    {
      kind: "text",
      md: `### L'élasticité, ou payer pour la demande et non pour le pic

L'**élasticité** est la capacité d'augmenter ou de réduire les ressources **pendant que le besoin évolue**, de façon automatique ou en quelques minutes. C'est l'avantage le plus concret du cloud face à un serveur acheté : un serveur acheté doit être dimensionné pour **le pire jour de l'année**, et il reste presque vide le reste du temps. Avec l'élasticité, on allume des machines quand la demande monte et on les éteint quand elle redescend.

On le mesure par simulation. Les hypothèses, **toutes inventées pour l'exemple** :

- la demande est un nombre de requêtes par heure sur sept jours (168 heures), avec un creux la nuit, une bosse en journée, une semaine plus chargée que le week-end et un peu de bruit ;
- une heure de **campagne** multiplie la demande par trois ;
- une machine sert **50 requêtes par heure**, et la machine allumée est facturée à l'heure entière.

Trois mesures comparent les stratégies : les **heures-machines** (ce qu'on paie), le **taux d'utilisation** (la part de la capacité réellement servie, donc le contraire du gaspillage) et les **demandes non servies** (ce qu'on perd quand la capacité manque).`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        SIMULATION,
        "",
        "print('demande : moyenne', round(float(demande.mean()), 1), ' minimum', demande.min(), ' maximum', demande.max())",
        "print('heure du pic :', int(demande.argmax()), ' total demandé :', int(demande.sum()))",
        "",
        "# Stratégie 1 : capacité fixe dimensionnée sur le pic, toujours allumée",
        "pic = int(np.ceil(demande.max() / DEBIT))",
        "fixe_pic = np.full(heures.size, pic)",
        "# Stratégie 2 : capacité fixe dimensionnée sur la demande moyenne",
        "moyenne = int(np.ceil(demande.mean() / DEBIT))",
        "fixe_moyenne = np.full(heures.size, moyenne)",
        "# Stratégie 3 : capacité qui suit la demande heure par heure (élasticité parfaite)",
        "elastique = np.ceil(demande / DEBIT).astype(int)",
        "",
        "for nom, machines in [('fixe sur le pic', fixe_pic), ('fixe sur la moyenne', fixe_moyenne), ('élastique parfaite', elastique)]:",
        "    b = bilan(machines, demande)",
        "    print(nom, ':', int(machines.max()), 'machines au plus,', b['heures_machines'], 'heures-machines,',",
        "          'utilisation', round(b['utilisation'], 3), ', non servies', b['non_servies'])",
      ),
      caption: "La demande va de 50 à 571 requêtes par heure, avec une moyenne de 131,6 ; le pic, à l'heure 60, est la campagne. Dimensionnée sur ce pic, la capacité fixe compte 12 machines en permanence : 2 016 heures-machines pour une utilisation de 0,219, soit moins d'un quart de la capacité servie. Dimensionnée sur la moyenne (3 machines, 504 heures-machines), elle est mieux remplie (0,776) mais laisse 2 547 requêtes sur 22 102 sans réponse, soit 11,5 %. La capacité qui suit la demande ne perd rien, avec 538 heures-machines et une utilisation de 0,822 : environ le quart des heures-machines de la capacité fixe sur le pic. Une machine ne se met pas en route en une seconde, et la demande réelle ne se connaît pas d'avance : la suite le simule.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "La demande `demande` et la constante `DEBIT` (50 requêtes par heure et par machine) sont prêtes. Calculez dans `machines_pic` le nombre de machines nécessaires pour absorber le pic de demande (arrondi à l'entier supérieur : `np.ceil`, puis `int`), et dans `heures_machines_fixe` les heures-machines d'une capacité fixe de ce nombre de machines sur les 168 heures.",
      setup: SIMULATION,
      starter: lines("machines_pic = 0", "heures_machines_fixe = 0"),
      solution: lines(
        "machines_pic = int(np.ceil(demande.max() / DEBIT))",
        "heures_machines_fixe = machines_pic * len(demande)",
        "print(machines_pic, 'machines,', heures_machines_fixe, 'heures-machines')",
      ),
      test: lines(
        "assert machines_pic == int(np.ceil(demande.max() / DEBIT)), f\"il faut diviser le pic ({demande.max()}) par le débit d'une machine et arrondir vers le haut, pas {machines_pic}\"",
        "assert heures_machines_fixe == machines_pic * 168, f\"une capacité fixe est allumée 168 heures : {machines_pic} × 168, pas {heures_machines_fixe}\"",
      ),
      hint: "np.ceil arrondit vers le haut ; la capacité fixe garde le même nombre de machines à chaque heure, donc le total est ce nombre multiplié par 168.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Avec la fonction `bilan` déjà définie, calculez dans `utilisation_pic` le taux d'utilisation de la capacité fixe dimensionnée sur le pic (`np.full(len(demande), machines_pic)` machines à chaque heure), et dans `part_non_servie` la part de la demande totale qui reste sans réponse avec une capacité fixe de 6 machines (un nombre entre 0 et 1).",
      setup: lines(SIMULATION, "machines_pic = int(np.ceil(demande.max() / DEBIT))"),
      starter: lines("utilisation_pic = 0", "part_non_servie = 1"),
      solution: lines(
        "utilisation_pic = bilan(np.full(len(demande), machines_pic), demande)['utilisation']",
        "b6 = bilan(np.full(len(demande), 6), demande)",
        "part_non_servie = b6['non_servies'] / demande.sum()",
        "print('utilisation', round(utilisation_pic, 3), ' part non servie avec 6 machines', round(part_non_servie, 4))",
      ),
      test: lines(
        "assert abs(utilisation_pic - 0.219) < 0.001, f\"l'utilisation de 12 machines fixes devrait être proche de 0,219, pas {utilisation_pic:.3f}\"",
        "assert abs(part_non_servie - 0.0123) < 0.0005, f\"avec 6 machines fixes, la part non servie devrait être proche de 0,0123 (1,2 %), pas {part_non_servie:.4f}\"",
      ),
      hint: "bilan renvoie un dictionnaire : 'utilisation' pour la première mesure, 'non_servies' pour la seconde, à diviser par demande.sum().",
    },
    {
      kind: "text",
      md: `### Quand la capacité arrive en retard

L'élasticité parfaite de l'exemple suppose qu'on **connaît la demande de l'heure avant qu'elle n'arrive**. Dans la vraie vie, un système règle la capacité d'après ce qu'il vient d'observer, et la machine demandée met un moment à devenir disponible. On simule le cas le plus simple : **la capacité de l'heure est réglée sur la demande de l'heure précédente**. On y ajoute une **marge de sécurité** : on vise une capacité supérieure d'un pourcentage donné à la demande observée.

Une marge plus grande réduit les demandes perdues, mais fait monter les heures-machines et baisser l'utilisation. Tout le travail de réglage d'un dispositif de montée en charge est ce compromis entre **gaspillage** et **risque**.`,
    },
    {
      kind: "code",
      language: "python",
      setup: SIMULATION,
      code: lines(
        "import matplotlib.pyplot as plt",
        "",
        "def avec_retard(demande, marge):",
        "    \"\"\"Capacité réglée sur la demande de l'heure précédente, majorée de la marge.\"\"\"",
        "    visee = np.ceil(demande * (1 + marge) / DEBIT).astype(int)",
        "    return np.concatenate([[visee[0]], visee[:-1]])    # décalage d'une heure",
        "",
        "for marge in [0, 0.25, 0.5, 1.0]:",
        "    b = bilan(avec_retard(demande, marge), demande)",
        "    print('marge', marge, ':', b['heures_machines'], 'heures-machines, utilisation', round(b['utilisation'], 3),",
        "          ', non servies', b['non_servies'], '(', round(100 * b['non_servies'] / demande.sum(), 2), '% )')",
        "",
        "fig, ax = plt.subplots(figsize=(8, 3.6))",
        "ax.plot(heures, demande, color='black', label='demande (requêtes par heure)')",
        "ax.step(heures, np.full(heures.size, 12) * DEBIT, color='tab:red', label='capacité fixe sur le pic (12 machines)')",
        "ax.step(heures, avec_retard(demande, 0.25) * DEBIT, color='tab:blue', label='capacité élastique, marge de 25 %')",
        "ax.set_xlabel('heure de la semaine')",
        "ax.set_ylabel('requêtes par heure')",
        "ax.legend(fontsize=8)",
        "plt.tight_layout()",
      ),
      caption: "Réglée sur l'heure précédente et sans marge, la capacité tient en 539 heures-machines mais laisse 567 requêtes sans réponse (2,57 %), surtout à la campagne, qui arrive sans prévenir, et à la montée du matin. Une marge de 25 % donne 636 heures-machines et 275 requêtes perdues (1,24 %) ; 50 %, 742 heures-machines et 221 perdues (1,0 %) ; 100 %, 966 heures-machines et 71 perdues (0,32 %), pour une utilisation de 0,456. Même avec 100 % de marge, on reste à moins de la moitié des 2 016 heures-machines de la capacité fixe sur le pic. Aucune stratégie ne supprime le compromis : on déplace le curseur entre gaspillage et demandes perdues. La figure montre ce qu'on devine dans les chiffres : la capacité fixe dépasse presque toujours la demande de très loin, alors que la capacité élastique la suit avec un pas d'avance ou de retard.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez la fonction `machines_avec_marge(demande, marge)` qui renvoie, pour chaque heure, le nombre de machines allumées quand la capacité est réglée sur la demande de l'heure PRÉCÉDENTE majorée de `marge` (par exemple 0,25 pour 25 %), arrondi à l'entier supérieur. La première heure reprend sa propre valeur visée. Utilisez `np.concatenate` pour décaler d'une heure.",
      setup: SIMULATION,
      starter: lines(
        "def machines_avec_marge(demande, marge):",
        "    return np.zeros(len(demande), dtype=int)",
      ),
      solution: lines(
        "def machines_avec_marge(demande, marge):",
        "    visee = np.ceil(demande * (1 + marge) / DEBIT).astype(int)",
        "    return np.concatenate([[visee[0]], visee[:-1]])",
        "",
        "b = bilan(machines_avec_marge(demande, 0.25), demande)",
        "print(b['heures_machines'], 'heures-machines,', b['non_servies'], 'non servies')",
      ),
      test: lines(
        "_m = machines_avec_marge(demande, 0.25)",
        "assert len(_m) == 168, f\"la fonction doit renvoyer une valeur par heure (168), pas {len(_m)}\"",
        "_b = bilan(_m, demande)",
        "assert _b['heures_machines'] == 636, f\"avec 25 % de marge on attend 636 heures-machines, pas {_b['heures_machines']}\"",
        "assert _b['non_servies'] == 275, f\"avec 25 % de marge on attend 275 requêtes non servies, pas {_b['non_servies']}\"",
        "_b0 = bilan(machines_avec_marge(demande, 0), demande)",
        "assert _b0['non_servies'] > _b['non_servies'], \"sans marge, il doit y avoir plus de requêtes perdues qu'avec 25 % de marge\"",
      ),
      hint: "Calculez d'abord la capacité visée à chaque heure : np.ceil(demande * (1 + marge) / DEBIT). Puis décalez-la d'un cran, en gardant la première valeur pour la première heure.",
    },
    {
      kind: "text",
      md: `### Zones de disponibilité : répartir pour résister aux pannes

Une machine tombe en panne, une zone peut tomber en panne (coupure d'électricité, incident réseau). **Répartir un service sur plusieurs zones** le protège tant que les pannes ne surviennent pas ensemble. On le simule avec une hypothèse **inventée et très forte** : chaque zone est indisponible **2 % des heures**, indépendamment des autres. Le service répartit sur deux zones est indisponible seulement quand **les deux** tombent en même temps.

Cette simulation n'est pas un chiffre de disponibilité d'un fournisseur : elle montre un **mécanisme**, et aussi sa limite. Si une cause commune peut tout arrêter (une panne de la région, une erreur de configuration que vous avez vous-même déployée partout), l'indépendance tombe et la protection avec elle.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import numpy as np",
        "",
        "rng = np.random.default_rng(7)",
        "N = 100000          # nombre d'heures simulées",
        "p_zone = 0.02       # hypothèse inventée : une zone est en panne 2 % des heures",
        "pannes = rng.random((N, 3)) < p_zone      # une colonne par zone, True = zone en panne",
        "",
        "une = pannes[:, 0].mean()",
        "deux = pannes[:, :2].all(axis=1).mean()   # indisponible seulement si les deux zones tombent",
        "trois = pannes.all(axis=1).mean()",
        "print('service dans 1 zone  : indisponible', round(float(une), 4), 'des heures')",
        "print('service dans 2 zones : indisponible', round(float(deux), 5), 'des heures')",
        "print('service dans 3 zones : indisponible', round(float(trois), 6), 'des heures')",
        "",
        "# Une cause commune (panne de région, mauvaise configuration) casse l'indépendance",
        "commune = rng.random(N) < 0.005           # hypothèse inventée : 0,5 % des heures",
        "deux_avec_commune = (pannes[:, :2].all(axis=1) | commune).mean()",
        "print('2 zones avec une cause commune à 0,5 % :', round(float(deux_avec_commune), 5))",
      ),
      caption: "Avec une zone en panne 2 % des heures, un service dans une seule zone est indisponible 1,93 % des heures simulées (le tirage fluctue autour de 2 %). Dans deux zones, 0,04 % ; dans trois, 0,001 % : chaque zone ajoutée divise la panne par plusieurs dizaines. Mais dès qu'une cause commune frappe 0,5 % des heures, l'indisponibilité de deux zones remonte à 0,556 %, soit plus de dix fois plus. Ajouter des zones ne protège pas d'une erreur qui les touche toutes en même temps : c'est pourquoi on teste aussi ses propres déploiements. Les 2 % et les 0,5 % sont des hypothèses du cours, non des mesures de fournisseurs.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Reprenez la simulation avec `pannes` (une colonne par zone, `True` quand la zone est en panne). Calculez dans `indispo_deux` la fraction des heures où les deux premières zones sont en panne ensemble, et dans `indispo_au_moins_une` la fraction des heures où AU MOINS UNE des deux premières zones est en panne.",
      setup: lines(
        "import numpy as np",
        "rng = np.random.default_rng(7)",
        "pannes = rng.random((100000, 3)) < 0.02",
      ),
      starter: lines("indispo_deux = 0", "indispo_au_moins_une = 0"),
      solution: lines(
        "indispo_deux = pannes[:, :2].all(axis=1).mean()",
        "indispo_au_moins_une = pannes[:, :2].any(axis=1).mean()",
        "print(round(float(indispo_deux), 5), round(float(indispo_au_moins_une), 4))",
      ),
      test: lines(
        "assert 0.0001 < indispo_deux < 0.001, f\"les deux zones en panne ensemble sont rares (autour de 0,0004), pas {indispo_deux}\"",
        "assert 0.03 < indispo_au_moins_une < 0.05, f\"au moins une zone sur deux en panne arrive environ 4 % des heures, pas {indispo_au_moins_une}\"",
        "assert indispo_au_moins_une > indispo_deux, \"« au moins une » est toujours plus fréquent que « les deux ensemble »\"",
      ),
      hint: "all(axis=1) vaut True quand toutes les colonnes de la ligne le sont, any(axis=1) quand au moins une l'est. mean() d'un tableau de booléens donne une fraction.",
    },
    {
      kind: "text",
      md: `### Correspondance des noms entre les trois fournisseurs

Les services se ressemblent d'un fournisseur à l'autre, pas les noms. Voici les familles que ce cours rencontrera, sans classement ni préférence. Cette liste n'est pas exhaustive, et chaque service a des particularités propres.

- **Machines virtuelles** : EC2 (AWS), Compute Engine (Google Cloud), Virtual Machines (Azure).
- **Stockage d'objets** (fichiers) : S3 (AWS), Cloud Storage (Google Cloud), Blob Storage (Azure).
- **Fonctions sans serveur** : Lambda (AWS), Cloud Functions (Google Cloud), Azure Functions (Azure).
- **Conteneurs gérés** : Cloud Run (Google Cloud) ; chacun des trois fournisseurs en a une ou plusieurs versions.
- **Identités et droits d'accès** : IAM (AWS), IAM (Google Cloud), Entra ID (Azure).
- **Entrepôts de données** : Redshift (AWS), BigQuery (Google Cloud), Synapse (Azure).

Apprenez le **concept** (objet, fonction, entrepôt), pas le nom commercial : c'est le concept qui reste quand une offre est rebaptisée.`,
    },
    {
      kind: "note",
      tone: "warning",
      md: "Une simulation n'est pas le cloud. Celles de ce module ne montrent pas la **latence réseau** réelle, les **quotas** qui limitent le nombre de machines allumables, les **pannes partielles**, le **temps de démarrage** variable d'une machine ou la **facturation exacte** (granularité, arrondis, remises). Elles servent à comprendre les compromis (capacité fixe contre élastique, marge contre perte, une zone contre plusieurs) avec des chiffres que l'on peut recalculer, pas à prévoir une facture.",
    },
  ],
  quiz: [
    {
      question: "Vous louez une machine virtuelle et vous y installez vous-même votre base de données. De quel modèle de service relève cette situation, et qui applique les correctifs du système ?",
      options: [
        "IaaS : le système d'exploitation et ses correctifs sont à votre charge",
        "SaaS : le fournisseur applique tous les correctifs",
        "PaaS : le fournisseur gère aussi votre base de données",
        "Service managé : le fournisseur sauvegarde la base à votre place",
      ],
      correct: 0,
      explanation: "Une machine virtuelle est de l'IaaS : le fournisseur gère le matériel et la virtualisation, vous gérez le système, les logiciels installés et leurs mises à jour.",
    },
    {
      question: "Dans le modèle de responsabilité partagée, qu'est-ce qui reste à votre charge quel que soit le type de service ?",
      options: [
        "L'alimentation électrique du centre de données",
        "Le remplacement des disques en panne",
        "Le choix de qui peut lire vos données",
        "La sécurité physique des bâtiments",
      ],
      correct: 2,
      explanation: "Le fournisseur sécurise l'infrastructure ; les droits d'accès à vos données et à vos comptes restent à vous, même pour un logiciel entièrement géré. C'est la cause fréquente des fuites.",
    },
    {
      question: "Dans la simulation, une capacité fixe dimensionnée sur le pic (12 machines) a une utilisation de 0,219. Que signifie ce nombre ?",
      options: [
        "Que 21,9 % des requêtes ont été perdues",
        "Qu'environ un cinquième seulement de la capacité payée a servi à répondre à la demande",
        "Que les machines sont tombées en panne 21,9 % du temps",
        "Que la demande a baissé de 21,9 % pendant la semaine",
      ],
      correct: 1,
      explanation: "L'utilisation est le rapport entre ce qui a été servi et la capacité allumée. Avec 0,219, plus des trois quarts de la capacité payée n'ont rien fait : c'est le coût d'un dimensionnement sur le pire moment.",
    },
    {
      question: "Pourquoi la capacité fixe dimensionnée sur la demande moyenne n'est-elle pas une bonne solution dans la simulation ?",
      options: [
        "Elle coûte plus cher que la capacité sur le pic",
        "Elle est mieux remplie mais laisse environ 11,5 % de la demande sans réponse",
        "Elle ne peut pas être utilisée avec plusieurs zones",
        "Elle donne une utilisation de 0,219",
      ],
      correct: 1,
      explanation: "Avec 3 machines, l'utilisation monte à 0,776 mais 2 547 requêtes sur 22 102 ne sont pas servies. Une capacité trop juste économise des heures-machines et perd des utilisateurs.",
    },
    {
      question: "Quel est l'effet d'une marge de sécurité plus grande dans une capacité qui suit la demande avec une heure de retard ?",
      options: [
        "Moins de requêtes perdues, mais plus d'heures-machines et une utilisation plus basse",
        "Moins de requêtes perdues, plus d'heures-machines et une meilleure utilisation",
        "Plus de requêtes perdues et moins d'heures-machines",
        "Aucun effet, car la demande est la même",
      ],
      correct: 0,
      explanation: "Dans la simulation, passer de 0 à 100 % de marge fait descendre les requêtes perdues de 567 à 71, monter les heures-machines de 539 à 966 et tomber l'utilisation de 0,799 à 0,456. C'est un compromis.",
    },
    {
      question: "Dans la simulation, passer d'une à deux zones fait tomber l'indisponibilité de 1,93 % à 0,04 %. Quelle condition cette conclusion suppose-t-elle ?",
      options: [
        "Que le fournisseur ait plus de régions que de zones",
        "Que les zones tombent en panne indépendamment les unes des autres",
        "Que les trois zones soient dans trois pays différents",
        "Que le service soit un logiciel de type SaaS",
      ],
      correct: 1,
      explanation: "Le calcul repose sur l'indépendance. Dès qu'une cause commune existe (panne de région, mauvaise configuration déployée partout), l'indisponibilité de deux zones remonte à 0,556 % dans la simulation.",
    },
  ],
};
