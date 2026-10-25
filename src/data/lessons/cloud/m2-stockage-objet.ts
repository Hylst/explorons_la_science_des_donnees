import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

// Un stockage d'objets en miniature : un dictionnaire clé -> liste de versions (octets). Il compte les requêtes et les
// octets lus, comme le fait une facture. Ce n'est pas un client de fournisseur : il illustre les mécanismes.
const CLASSE_SEAU = lines(
  "class Seau:",
  "    \"\"\"Un seau d'objets simulé : des clés (textes) associées à des contenus (octets).\"\"\"",
  "",
  "    def __init__(self, versionnage=False):",
  "        self.versionnage = versionnage",
  "        self.objets = {}          # clé -> liste des versions (la dernière est la version courante)",
  "        self.requetes = 0         # nombre d'appels, car un service d'objets facture aussi les requêtes",
  "        self.octets_lus = 0       # octets sortis du seau par get",
  "",
  "    def put(self, cle, contenu):",
  "        \"\"\"Écrit un objet ENTIER. Un objet est immuable : on ne modifie pas un octet, on le remplace.\"\"\"",
  "        self.requetes += 1",
  "        anciennes = self.objets.get(cle, []) if self.versionnage else []",
  "        self.objets[cle] = anciennes + [bytes(contenu)]",
  "",
  "    def get(self, cle, version=None):",
  "        self.requetes += 1",
  "        versions = self.objets.get(cle)",
  "        if not versions:",
  "            raise KeyError(cle)",
  "        contenu = versions[-1 if version is None else version]",
  "        if contenu is None:        # marqueur de suppression (seulement avec le versionnage)",
  "            raise KeyError(cle)",
  "        self.octets_lus += len(contenu)",
  "        return contenu",
  "",
  "    def delete(self, cle):",
  "        self.requetes += 1",
  "        if self.versionnage and cle in self.objets:",
  "            self.objets[cle] = self.objets[cle] + [None]     # l'objet semble supprimé, ses versions restent",
  "        else:",
  "            self.objets.pop(cle, None)",
  "",
  "    def list(self, prefixe=''):",
  "        \"\"\"Toutes les clés qui COMMENCENT par le préfixe : il n'y a pas de vrais dossiers.\"\"\"",
  "        self.requetes += 1",
  "        return sorted(c for c, v in self.objets.items() if c.startswith(prefixe) and v[-1] is not None)",
);

// Deux ans de ventes factices (graine fixe), un objet CSV par jour, rangé par partitions annee=/mois=/jour=.
const FABRIQUE_VENTES = lines(
  "import csv",
  "import io",
  "import datetime",
  "import numpy as np",
  "",
  "PRODUITS = ['cahier', 'stylo', 'sac', 'lampe', 'tasse', 'agenda']",
  "",
  "def cle_partition(jour):",
  "    \"\"\"La clé d'un objet : le chemin porte l'année, le mois et le jour (convention annee=2024).\"\"\"",
  "    return f\"ventes/annee={jour.year}/mois={jour.month:02d}/jour={jour.day:02d}.csv\"",
  "",
  "def fabriquer_ventes(seau, graine=3):",
  "    \"\"\"Écrit un CSV par jour du 1er janvier 2023 au 31 décembre 2024 (ventes inventées).\"\"\"",
  "    rng = np.random.default_rng(graine)",
  "    jour = datetime.date(2023, 1, 1)",
  "    while jour <= datetime.date(2024, 12, 31):",
  "        tampon = io.StringIO()",
  "        ecrivain = csv.writer(tampon, lineterminator='\\n')",
  "        ecrivain.writerow(['id_vente', 'date', 'produit', 'quantite', 'montant'])",
  "        for i in range(int(rng.integers(30, 60))):          # entre 30 et 59 ventes par jour",
  "            quantite = int(rng.integers(1, 6))",
  "            produit = PRODUITS[int(rng.integers(0, 6))]",
  "            montant = round(float(quantite * rng.uniform(2, 20)), 2)",
  "            ecrivain.writerow([f\"{jour.isoformat()}-{i:03d}\", jour.isoformat(), produit, quantite, montant])",
  "        seau.put(cle_partition(jour), tampon.getvalue().encode('utf-8'))",
  "        jour += datetime.timedelta(days=1)",
);

const PREPARATION = lines(CLASSE_SEAU, "", FABRIQUE_VENTES, "", "seau = Seau()", "fabriquer_ventes(seau)");

export const moduleStockageObjet: LessonModule = {
  id: "stockage-objet",
  title: "Stockage objet et organisation des données",
  duration: "2 h 30",
  summary: "Comprendre le stockage d'objets (seau, clés, préfixes, objets immuables, versionnage, classes de stockage, cohérence), en simuler un en Python, découper des données en partitions pour lire moins, et mesurer ce que la compression change.",
  objectives: [
    "Décrire un stockage d'objets : seau, clés, préfixes, objets immuables, métadonnées",
    "Expliquer le versionnage et le choix d'une classe de stockage",
    "Organiser des fichiers en partitions et mesurer le gain d'une lecture limitée à une partition",
    "Mesurer le gain d'une compression gzip sur du CSV et lire les commandes de copie des trois grands fournisseurs",
  ],
  sections: [
    {
      kind: "text",
      md: `### Un stockage d'objets, ce n'est pas un disque

Le **stockage d'objets** est le service de base du cloud pour ranger des fichiers : S3 (AWS), Cloud Storage (Google Cloud), Blob Storage (Azure). On y met des tables de données, des images, des sauvegardes, des modèles entraînés. Il est quasi illimité, durable, peu cher au volume et accessible de partout par Internet. En échange, il fonctionne autrement qu'un disque.

- Un **seau** (*bucket*, ou *conteneur* chez Azure) est le grand récipient qui contient les objets. Les règles de nommage (unicité, caractères autorisés) varient selon le fournisseur.
- Un **objet** est un contenu (des octets) accompagné de **métadonnées** (taille, type de contenu, date, étiquettes que vous choisissez).
- Une **clé** identifie l'objet dans le seau, par exemple \`ventes/annee=2024/mois=03/jour=05.csv\`. Les barres obliques ressemblent à des dossiers, mais **il n'y a pas de dossiers** : la clé est un seul texte. Les consoles affichent des dossiers par commodité, en regroupant les clés qui partagent un **préfixe**.
- Un objet est **immuable** : on ne modifie pas quelques octets au milieu, on **remplace l'objet entier**. Pour ajouter une ligne à un gros CSV, il faut le réécrire. C'est une raison de plus de découper les données en objets de taille raisonnable.
- Lister les objets revient à demander « toutes les clés qui commencent par ce préfixe » : c'est la seule forme de recherche rapide. Il n'y a pas d'index sur le contenu.

Le stockage d'objets est **l'endroit où les données de l'analyse vivent** : les entrepôts de données, les moteurs de calcul distribué et les outils d'apprentissage automatique y lisent leurs fichiers. D'où l'intérêt de bien les organiser.`,
    },
    {
      kind: "text",
      md: `### Versionnage, classes de stockage, cohérence

Trois notions de plus, que les trois fournisseurs proposent chacun à sa façon.

- Le **versionnage** garde les anciennes versions d'un objet quand on l'écrase ou le supprime. Supprimer ne détruit alors rien : on ajoute un marqueur de suppression, et on peut revenir en arrière. Le prix à payer : les anciennes versions occupent de la place et sont facturées, tant qu'on ne les nettoie pas (par une règle de cycle de vie). Un fichier écrasé par erreur devient alors rattrapable.
- Les **classes de stockage** règlent un compromis : un stockage pour des données **lues souvent** est plus cher au volume, mais pas aux accès ; un stockage d'**archive** est bien moins cher au volume, mais rendre une donnée prend du temps (parfois des heures) et la lecture coûte plus. Des **règles de cycle de vie** déplacent automatiquement les objets vers une classe plus économe quand ils vieillissent, ou les suppriment. Le module 4 chiffre ce raisonnement avec des tarifs fictifs.
- La **cohérence** décrit ce qu'on lit juste après une écriture. Dans un système à cohérence forte, un \`get\` voit tout de suite le dernier \`put\` ; dans un système à cohérence à terme, il peut voir brièvement l'ancienne version. Le comportement des services a évolué avec le temps et dépend du fournisseur et du type d'opération : **lisez la documentation actuelle**, et ne bâtissez pas un programme qui dépend d'une lecture instantanée sans l'avoir vérifié.

Toute la suite se fait sur un **seau simulé**, écrit en Python : un dictionnaire de clés vers des octets, qui compte aussi les requêtes et les octets lus, parce que ce sont ces deux nombres, avec le volume stocké, qui font la facture.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        CLASSE_SEAU,
        "",
        "# Un seau avec versionnage",
        "seau = Seau(versionnage=True)",
        "seau.put('modeles/prix.txt', b'version 1')",
        "seau.put('modeles/prix.txt', b'version 2, corrigee')      # on remplace l'objet entier",
        "print('version courante :', seau.get('modeles/prix.txt'))",
        "print('version 0        :', seau.get('modeles/prix.txt', version=0))",
        "print('nombre de versions gardées :', len(seau.objets['modeles/prix.txt']))",
        "",
        "seau.delete('modeles/prix.txt')                            # marqueur de suppression",
        "try:",
        "    seau.get('modeles/prix.txt')",
        "except KeyError:",
        "    print('après suppression : get échoue, list renvoie', seau.list('modeles/'))",
        "print('mais la version 1 existe encore :', seau.get('modeles/prix.txt', version=1))",
        "",
        "# Sans versionnage, l'écrasement est définitif",
        "simple = Seau()",
        "simple.put('a.txt', b'premier')",
        "simple.put('a.txt', b'second')",
        "print('sans versionnage :', len(simple.objets['a.txt']), 'seule version, contenu', simple.get('a.txt'))",
      ),
      caption: "Avec le versionnage, deux écritures laissent deux versions ; la version 0 reste lisible. Après la suppression, la lecture échoue et la liste du préfixe est vide, mais la version 1 se relit encore : la suppression n'a rien détruit. Sans versionnage, il ne reste qu'une version après deux écritures, et l'ancienne est perdue.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez la fonction `cle_partition(jour)` qui prend un objet `datetime.date` et renvoie la clé `ventes/annee=2024/mois=03/jour=05.csv` pour le 5 mars 2024 : l'année, puis le mois et le jour sur DEUX chiffres (`05`, pas `5`), pour que l'ordre alphabétique des clés suive l'ordre du calendrier.",
      setup: "import datetime",
      starter: lines("def cle_partition(jour):", "    return ''"),
      solution: lines(
        "def cle_partition(jour):",
        "    return f\"ventes/annee={jour.year}/mois={jour.month:02d}/jour={jour.day:02d}.csv\"",
        "",
        "print(cle_partition(datetime.date(2024, 3, 5)))",
      ),
      test: lines(
        "_c = cle_partition(datetime.date(2024, 3, 5))",
        "assert _c == 'ventes/annee=2024/mois=03/jour=05.csv', f\"la clé du 5 mars 2024 doit être ventes/annee=2024/mois=03/jour=05.csv, pas {_c!r}\"",
        "assert cle_partition(datetime.date(2023, 11, 20)) == 'ventes/annee=2023/mois=11/jour=20.csv', \"le mois 11 et le jour 20 s'écrivent tels quels\"",
        "assert cle_partition(datetime.date(2024, 2, 9)) < cle_partition(datetime.date(2024, 11, 1)), \"avec deux chiffres, le 2e mois doit se classer avant le 11e\"",
      ),
      hint: "Dans une chaîne formatée, {jour.month:02d} complète avec un zéro à gauche jusqu'à deux chiffres.",
    },
    {
      kind: "text",
      md: `### Découper en partitions

On a deux ans de ventes factices, un fichier CSV par jour, soit **731 objets** (2024 est bissextile). Chaque clé porte l'année, le mois et le jour : \`ventes/annee=2024/mois=03/jour=05.csv\`. Cette convention, où le chemin contient \`nom=valeur\`, s'appelle le **partitionnement** de style « Hive » ; les moteurs d'analyse la reconnaissent et s'en servent pour éviter de lire des objets inutiles.

L'intérêt est direct : pour répondre à « combien de ventes en mars 2024 ? », on **liste le préfixe** \`ventes/annee=2024/mois=03/\` et on ne lit que les 31 objets correspondants, sans toucher aux 700 autres. Les ventes sont inventées (graine fixe), les chiffres ne décrivent aucune boutique réelle.

L'exemple compare deux lectures et compte ce qu'une facture compterait : les **requêtes** et les **octets lus**.`,
    },
    {
      kind: "code",
      language: "python",
      setup: CLASSE_SEAU,
      code: lines(
        FABRIQUE_VENTES,
        "",
        "seau = Seau()",
        "fabriquer_ventes(seau)",
        "toutes = seau.list('ventes/')",
        "octets_total = sum(len(seau.objets[c][-1]) for c in toutes)",
        "print('objets :', len(toutes), ' octets stockés :', octets_total)",
        "print('première clé :', toutes[0])",
        "",
        "def compter_lignes(seau, cles):",
        "    \"\"\"Lit chaque objet et compte ses lignes de données (sans l'en-tête).\"\"\"",
        "    return sum(seau.get(c).decode('utf-8').count('\\n') - 1 for c in cles)",
        "",
        "# Lecture 1 : tout lire, y compris ce dont on n'a pas besoin",
        "seau.requetes = 0; seau.octets_lus = 0",
        "compter_lignes(seau, seau.list('ventes/'))",
        "print('lire tout       : requêtes', seau.requetes, ' octets lus', seau.octets_lus)",
        "",
        "# Lecture 2 : lister seulement le préfixe de la partition voulue",
        "seau.requetes = 0; seau.octets_lus = 0",
        "mars = seau.list('ventes/annee=2024/mois=03/')",
        "lignes_mars = compter_lignes(seau, mars)",
        "print('lire la partition : requêtes', seau.requetes, ' octets lus', seau.octets_lus,",
        "      ' objets', len(mars), ' lignes', lignes_mars)",
        "print('rapport des octets lus :', round(octets_total / seau.octets_lus, 1))",
      ),
      caption: "Les 731 objets pèsent 1 320 621 octets. Tout lire coûte 732 requêtes (une liste et 731 lectures) et 1 320 621 octets lus. Lister le préfixe de mars 2024 et ne lire que ces objets coûte 32 requêtes et 57 532 octets lus, pour 31 objets et 1 417 lignes : environ 23 fois moins d'octets. Ce n'est pas de la magie, c'est un rangement choisi pour la question la plus fréquente. Un rangement qui ne correspond pas aux questions posées n'aide pas : filtrer par produit, ici, obligerait à tout lire.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Un `seau` rempli de ventes est prêt, ainsi que `compter_lignes(seau, cles)` écrit plus haut. Écrivez la fonction `lignes_du_mois(seau, annee, mois)` qui renvoie le nombre de lignes de données des ventes de ce mois, en listant le préfixe `ventes/annee=2024/mois=03/` (adapté à l'année et au mois demandés, le mois sur deux chiffres) et en ne lisant que ces objets.",
      setup: lines(
        PREPARATION,
        "",
        "def compter_lignes(seau, cles):",
        "    return sum(seau.get(c).decode('utf-8').count('\\n') - 1 for c in cles)",
      ),
      starter: lines("def lignes_du_mois(seau, annee, mois):", "    return 0"),
      solution: lines(
        "def lignes_du_mois(seau, annee, mois):",
        "    prefixe = f\"ventes/annee={annee}/mois={mois:02d}/\"",
        "    return compter_lignes(seau, seau.list(prefixe))",
        "",
        "print(lignes_du_mois(seau, 2024, 3))",
      ),
      test: lines(
        "seau.requetes = 0; seau.octets_lus = 0",
        "_n = lignes_du_mois(seau, 2024, 3)",
        "assert _n == 1417, f\"mars 2024 compte 1 417 lignes de ventes, pas {_n}\"",
        "assert seau.octets_lus == 57532, f\"seuls les objets de mars 2024 (57 532 octets) doivent être lus, pas {seau.octets_lus} octets\"",
        "assert seau.requetes == 32, f\"il faut 1 requête de liste et 31 lectures, pas {seau.requetes} requêtes\"",
        "assert lignes_du_mois(seau, 2023, 12) > 0, \"décembre 2023 doit aussi fonctionner : le mois est sur deux chiffres dans la clé\"",
      ),
      hint: "Construisez le préfixe avec f\"ventes/annee={annee}/mois={mois:02d}/\", listez-le avec seau.list, puis passez la liste de clés à compter_lignes.",
    },
    {
      kind: "text",
      md: `### Petits objets contre gros objets

Une partition par jour donne 731 objets, c'est beaucoup de requêtes pour lire une année. Une partition par **mois** en donnerait 24, plus gros, moins nombreux. Le bon grain est un **compromis** : trop de petits objets multiplient les requêtes (facturées, et chacune a un temps d'attente) ; trop peu de gros objets obligent à lire beaucoup pour peu de lignes utiles, et à réécrire un gros objet pour une petite correction. Les moteurs d'analyse préfèrent généralement des objets de taille moyenne, et le bon réglage dépend de l'outil : on vérifie dans sa documentation.

Reste la **compression**. Un CSV est du texte répétitif, donc très compressible. On le compresse avec **gzip**, présent dans la bibliothèque standard de Python et reconnu partout. On le mesure sur les ventes de mars 2024, puis sur toute la collection, par jour puis par mois.`,
    },
    {
      kind: "code",
      language: "python",
      setup: PREPARATION,
      code: lines(
        "import gzip",
        "",
        "mars = seau.list('ventes/annee=2024/mois=03/')",
        "brut = b''.join(seau.objets[c][-1] for c in mars)           # tout mars en un seul contenu",
        "comprime = gzip.compress(brut)",
        "print('mars 2024 : brut', len(brut), 'octets, gzip', len(comprime), 'octets, rapport', round(len(comprime) / len(brut), 3))",
        "assert gzip.decompress(comprime) == brut                     # sans perte : on retrouve exactement l'original",
        "",
        "un_jour = seau.objets[mars[0]][-1]",
        "print('un seul jour : brut', len(un_jour), ' gzip', len(gzip.compress(un_jour)), ' rapport', round(len(gzip.compress(un_jour)) / len(un_jour), 3))",
        "",
        "toutes = seau.list('ventes/')",
        "total_brut = sum(len(seau.objets[c][-1]) for c in toutes)",
        "total_par_jour = sum(len(gzip.compress(seau.objets[c][-1])) for c in toutes)",
        "print('731 objets : brut', total_brut, ' gzip jour par jour', total_par_jour, ' rapport', round(total_par_jour / total_brut, 3))",
        "",
        "# Regrouper par mois avant de compresser (24 objets) : gzip voit plus de répétitions d'un coup",
        "par_mois = {}",
        "for c in toutes:",
        "    mois = c.split('/')[1] + '/' + c.split('/')[2]            # annee=2024/mois=03",
        "    par_mois.setdefault(mois, []).append(seau.objets[c][-1])",
        "total_par_mois = 0",
        "for mois, contenus in par_mois.items():",
        "    corps = contenus[0] + b''.join(x.split(b'\\n', 1)[1] for x in contenus[1:])      # un seul en-tête par mois",
        "    total_par_mois += len(gzip.compress(corps))",
        "print(len(par_mois), 'objets : gzip mois par mois', total_par_mois, ' rapport', round(total_par_mois / total_brut, 3))",
      ),
      caption: "Tout mars 2024 passe de 57 532 octets à 10 982 octets compressés : un rapport de 0,191, soit environ cinq fois moins. Un seul jour passe de 2 179 à 501 octets (0,23) : un petit objet se compresse moins bien, faute de répétitions. Sur les 731 objets, le total brut est de 1 320 621 octets, 319 662 compressés jour par jour (0,242) ; regroupés par mois, les 24 objets donnent 250 772 octets (0,19). Ces ventes sont régulières, fabriquées par une formule : des données réelles, plus variées, se compressent en général moins bien. Compresser réduit le volume stocké et transféré, mais demande de décompresser à la lecture, et certains outils lisent un fichier compressé moins facilement par morceaux.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "`donnees` contient les octets des ventes de mars 2024 (57 532 octets). Écrivez la fonction `rapport_gzip(octets)` qui renvoie la taille compressée avec `gzip.compress` divisée par la taille d'origine (un nombre entre 0 et 1 pour un contenu compressible).",
      setup: lines(
        PREPARATION,
        "donnees = b''.join(seau.objets[c][-1] for c in seau.list('ventes/annee=2024/mois=03/'))",
      ),
      starter: lines("def rapport_gzip(octets):", "    return 1.0"),
      solution: lines(
        "import gzip",
        "",
        "def rapport_gzip(octets):",
        "    return len(gzip.compress(octets)) / len(octets)",
        "",
        "print(round(rapport_gzip(donnees), 3))",
      ),
      test: lines(
        "_r = rapport_gzip(donnees)",
        "assert abs(_r - 0.191) < 0.001, f\"le rapport gzip des ventes de mars 2024 est de 0,191 ; vous obtenez {_r:.3f}\"",
        "assert rapport_gzip(b'abc' * 1000) < 0.05, \"un contenu très répétitif doit se compresser fortement\"",
      ),
      hint: "gzip.compress prend des octets et renvoie des octets : comparez simplement leurs longueurs avec len.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Un seau avec versionnage `seau_v` contient `rapports/bilan.txt` : sa dernière écriture a été supprimée par erreur (marqueur de suppression). Écrivez `restaurer(seau, cle)` qui rend l'objet de nouveau visible en réécrivant (`put`) son DERNIER contenu non supprimé comme nouvelle version.",
      setup: lines(
        CLASSE_SEAU,
        "seau_v = Seau(versionnage=True)",
        "seau_v.put('rapports/bilan.txt', b'brouillon')",
        "seau_v.put('rapports/bilan.txt', b'version definitive')",
        "seau_v.delete('rapports/bilan.txt')",
      ),
      starter: lines("def restaurer(seau, cle):", "    pass"),
      solution: lines(
        "def restaurer(seau, cle):",
        "    dernier = [v for v in seau.objets[cle] if v is not None][-1]",
        "    seau.put(cle, dernier)",
        "",
        "restaurer(seau_v, 'rapports/bilan.txt')",
        "print(seau_v.get('rapports/bilan.txt'), seau_v.list('rapports/'))",
      ),
      test: lines(
        "restaurer(seau_v, 'rapports/bilan.txt')",
        "try:",
        "    _contenu = seau_v.get('rapports/bilan.txt')",
        "except KeyError:",
        "    _contenu = None",
        "assert _contenu is not None, \"après restauration, l'objet doit de nouveau pouvoir être lu avec get\"",
        "assert _contenu == b'version definitive', f\"c'est la dernière version non supprimée qu'il faut restaurer, pas {_contenu!r}\"",
        "assert 'rapports/bilan.txt' in seau_v.list('rapports/'), \"l'objet restauré doit réapparaître dans la liste\"",
      ),
      hint: "seau.objets[cle] est la liste des versions, avec None pour un marqueur de suppression : gardez la dernière valeur qui n'est pas None et réécrivez-la avec put.",
    },
    {
      kind: "text",
      md: `### Les commandes des trois fournisseurs, à lire

Dans la vraie vie, on copie des fichiers vers un seau avec l'outil en ligne de commande de son fournisseur. **Ces commandes ne tournent pas dans le moteur du site** (pas de réseau, pas de compte) : elles sont à lire, ou à essayer sur votre machine, après avoir installé l'outil et configuré une identité. Les noms \`mon-seau\` et \`moncompte\` sont des exemples à remplacer.

Copier un fichier du jour vers la bonne partition :

\`\`\`bash
# AWS (S3)
aws s3 cp ventes_2024-03-05.csv s3://mon-seau/ventes/annee=2024/mois=03/jour=05.csv

# Google Cloud (Cloud Storage)
gcloud storage cp ventes_2024-03-05.csv gs://mon-seau/ventes/annee=2024/mois=03/jour=05.csv

# Azure (Blob Storage) : le seau s'appelle un conteneur, et il vit dans un compte de stockage
az storage blob upload --account-name moncompte --container-name mon-seau \\
  --name ventes/annee=2024/mois=03/jour=05.csv --file ventes_2024-03-05.csv
\`\`\`

Lister une partition, c'est lister un préfixe :

\`\`\`bash
aws s3 ls s3://mon-seau/ventes/annee=2024/mois=03/
gcloud storage ls gs://mon-seau/ventes/annee=2024/mois=03/
az storage blob list --account-name moncompte --container-name mon-seau --prefix ventes/annee=2024/mois=03/
\`\`\`

Les trois fournisseurs offrent le versionnage et les règles de cycle de vie, activés par une option du seau ou du compte. La syntaxe et les options changent d'un outil à l'autre et d'une version à l'autre : en cas de doute, l'aide en ligne de commande de l'outil (\`--help\`) fait foi, pas ce cours.`,
    },
    {
      kind: "note",
      tone: "warning",
      md: "Le seau simulé ne montre pas la **latence réseau**, les **limites de débit** par préfixe, les **erreurs temporaires** qu'il faut réessayer, ni les **droits d'accès** : par défaut, un seau est privé, et rendre un objet public est une décision à prendre avec le module 6 sous les yeux. Il ne reproduit pas non plus la facturation exacte (tranches, arrondis, sorties de données). Les nombres de ce module (octets, requêtes, rapports de compression) sont ceux de **cette** simulation et de ces données inventées.",
    },
  ],
  quiz: [
    {
      question: "Dans un stockage d'objets, que représentent les « dossiers » affichés par la console ?",
      options: [
        "Des répertoires réels, créés avant d'y déposer des fichiers",
        "Des partitions imposées par le fournisseur",
        "Des regroupements d'affichage de clés qui partagent un préfixe",
        "Des seaux imbriqués, chacun avec ses droits d'accès",
      ],
      correct: 2,
      explanation: "La clé est un texte unique. Les barres obliques servent seulement à regrouper visuellement les objets dont les clés commencent pareil : il n'existe pas de dossier à créer ni à supprimer.",
    },
    {
      question: "Pourquoi dit-on qu'un objet est immuable ?",
      options: [
        "Parce qu'on ne peut jamais le supprimer",
        "Parce qu'il est automatiquement chiffré",
        "Parce qu'on ne peut le lire qu'une seule fois",
        "Parce qu'on ne modifie pas une partie de son contenu : on le remplace en entier",
      ],
      correct: 3,
      explanation: "Il n'y a pas d'écriture au milieu d'un objet. Ajouter une ligne à un gros CSV impose de réécrire tout l'objet, d'où l'intérêt de découper les données en objets de taille raisonnable.",
    },
    {
      question: "Avec le versionnage activé, que se passe-t-il quand on supprime un objet ?",
      options: [
        "Il disparaît définitivement, comme sans versionnage",
        "Un marqueur de suppression est ajouté : l'objet semble absent mais ses versions précédentes peuvent être restaurées",
        "Toutes ses versions sont déplacées vers une autre région",
        "Le seau tout entier est suspendu",
      ],
      correct: 1,
      explanation: "C'est ce que montre la simulation : après delete, get échoue et list ne voit plus l'objet, mais la version 1 se relit encore. Ces anciennes versions occupent de la place tant qu'on ne les nettoie pas.",
    },
    {
      question: "Dans la simulation, lister le préfixe de mars 2024 plutôt que tout lire a coûté 32 requêtes et 57 532 octets lus, contre 732 requêtes et 1 320 621 octets. Qu'est-ce qui explique ce gain ?",
      options: [
        "Les données de mars sont compressées",
        "Le préfixe de la partition ne désigne que les 31 objets utiles, les autres ne sont jamais lus",
        "Le seau garde un cache des lectures précédentes",
        "Le versionnage supprime les objets inutiles",
      ],
      correct: 1,
      explanation: "Le gain vient du rangement : la clé contient annee= et mois=, et le préfixe permet de ne lister et lire que les objets de la période. Il n'y a ni cache ni compression dans cette mesure.",
    },
    {
      question: "Les ventes de mars 2024 passent de 57 532 à 10 982 octets avec gzip, mais un seul jour passe de 2 179 à 501 octets. Quelle lecture est la bonne ?",
      options: [
        "Gzip compresse toujours au même rapport, quelle que soit la taille",
        "Un petit objet se compresse un peu moins bien qu'un gros, qui contient plus de répétitions",
        "Un petit objet se compresse mieux qu'un gros",
        "La compression gzip fait perdre quelques lignes",
      ],
      correct: 1,
      explanation: "Les rapports sont 0,191 pour le mois et 0,23 pour le jour : plus de texte, plus de répétitions à exploiter. Et la compression est sans perte, ce que l'exemple vérifie en décompressant.",
    },
    {
      question: "Quel est l'inconvénient d'un stockage découpé en un très grand nombre de très petits objets ?",
      options: [
        "Il ne peut plus être partitionné",
        "Il ne peut plus être compressé",
        "Les requêtes se multiplient, et avec elles la facture et le temps d'attente",
        "Les objets deviennent mutables",
      ],
      correct: 2,
      explanation: "Chaque lecture ou liste est une requête, souvent facturée et toujours avec une latence. Lire une année en 731 objets de jour demande bien plus de requêtes qu'en 24 objets de mois : le grain est un compromis.",
    },
  ],
};
