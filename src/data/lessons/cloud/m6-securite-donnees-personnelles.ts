import type { LessonModule } from "@/lib/lessons/types";
import { lines } from "../lines";

// Évaluateur de politiques d'accès : un joker * dans les motifs, refus par défaut, un Deny explicite l'emporte.
// Les actions (stockage:lire...) et les ressources (seau-donnees/...) sont inventées, neutres entre fournisseurs.
const EVALUATEUR = lines(
  "import json, re",
  "",
  "def correspond(motif, valeur):",
  "    # le joker * remplace n'importe quelle suite de caractères (y compris /)",
  "    expression = '^' + '.*'.join(re.escape(morceau) for morceau in motif.split('*')) + '$'",
  "    return re.match(expression, valeur) is not None",
  "",
  "def est_autorise(politique, action, ressource):",
  "    permis = False",
  "    for instruction in politique:",
  "        concerne = (any(correspond(a, action) for a in instruction['actions'])",
  "                    and any(correspond(r, ressource) for r in instruction['ressources']))",
  "        if not concerne:",
  "            continue",
  "        if instruction['effet'] == 'Deny':",
  "            return False          # un refus explicite l'emporte toujours",
  "        permis = True             # un Allow ne suffit que si aucun Deny ne s'applique",
  "    return permis                 # sans règle qui s'applique : refusé par défaut",
);

const POLITIQUE_ANALYSTE = lines(
  "politique_analyste = json.loads('''[",
  "  {\"effet\": \"Allow\", \"actions\": [\"stockage:lire\", \"stockage:lister\"], \"ressources\": [\"seau-donnees/*\"]},",
  "  {\"effet\": \"Allow\", \"actions\": [\"stockage:ecrire\"], \"ressources\": [\"seau-donnees/resultats/*\"]},",
  "  {\"effet\": \"Deny\", \"actions\": [\"*\"], \"ressources\": [\"seau-donnees/personnel/*\"]}",
  "]''')",
);

const POLITIQUE_AUDIT = lines(
  "politique_audit = json.loads('''[",
  "  {\"effet\": \"Allow\", \"actions\": [\"stockage:lire\"], \"ressources\": [\"seau-donnees/brut/*\"]},",
  "  {\"effet\": \"Allow\", \"actions\": [\"*\"], \"ressources\": [\"seau-donnees/*\"]},",
  "  {\"effet\": \"Allow\", \"actions\": [\"stockage:lire\"], \"ressources\": [\"*\"]},",
  "  {\"effet\": \"Deny\", \"actions\": [\"*\"], \"ressources\": [\"*\"]}",
  "]''')",
);

// Population simulée (graine fixe) : 2 000 personnes, âge, code postal fictif (10 départements, 4 communes) et sexe.
const PERSONNES = lines(
  "import numpy as np",
  "import pandas as pd",
  "",
  "rng = np.random.default_rng(7)",
  "n = 2000",
  "departements = ['10', '22', '35', '44', '59', '67', '69', '75', '84', '92']",
  "codes = ['%s%03d' % (d, c) for d in departements for c in range(4)]      # 40 codes postaux fictifs",
  "personnes = pd.DataFrame({",
  "    'age': rng.integers(18, 90, n),",
  "    'code_postal': rng.choice(codes, n),",
  "    'sexe': rng.choice(['F', 'H'], n),",
  "})",
  "# version généralisée : tranches d'âge et département au lieu de l'âge exact et du code postal",
  "personnes['tranche'] = pd.cut(personnes['age'], [17, 39, 59, 89], labels=['18-39', '40-59', '60-89']).astype(str)",
  "personnes['departement'] = personnes['code_postal'].str[:2]",
);

export const moduleSecurite: LessonModule = {
  id: "securite-donnees-personnelles",
  title: "Sécurité, identités et données personnelles",
  duration: "2 h",
  summary: "Identités et rôles, moindre privilège, secrets hors du code, chiffrement, journaux d'accès, localisation des données et RGPD ; un évaluateur de politiques d'accès en Python, la pseudonymisation par HMAC contre le hachage sans clé, et la différence entre pseudonymiser et anonymiser.",
  objectives: [
    "Expliquer le moindre privilège et lire une politique d'accès avec ses refus explicites et son refus par défaut",
    "Écrire un petit évaluateur de politiques et repérer une règle trop large",
    "Pseudonymiser un identifiant avec un HMAC et montrer pourquoi un hachage sans clé se retrouve par force brute",
    "Distinguer pseudonymisation et anonymisation en mesurant la ré-identification par recoupement",
  ],
  sections: [
    {
      kind: "text",
      md: `### Qui a le droit de faire quoi, sur quoi

Dans un projet de données au cloud, la sécurité commence par une question simple : **qui** (ou quel programme) a le droit de faire **quelle action** sur **quelle ressource** ? Les trois fournisseurs répondent avec le même vocabulaire de fond, sous des noms différents : le service d'identités et d'accès s'appelle IAM chez AWS et chez Google Cloud, et Microsoft Entra ID avec le contrôle d'accès par rôles (RBAC) chez Azure.

- Une **identité** est un utilisateur humain, un groupe, ou une **identité de service** (un compte réservé à un programme, par exemple le travail qui lit les données chaque nuit).
- Un **rôle** est un ensemble de permissions qu'on donne à une identité.
- Une **politique** est la liste des règles qui disent « autorisé » ou « refusé » pour une action sur une ressource.

Deux principes à retenir tout de suite. Le **moindre privilège** : chaque identité reçoit seulement ce dont elle a besoin, pour la durée dont elle a besoin. Et le **refus par défaut** : ce qui n'est pas explicitement autorisé est interdit. Un *Deny* explicite l'emporte sur tout *Allow*.

La **responsabilité partagée** du premier module reste valable : le fournisseur protège ses centres de données et son infrastructure, mais **qui peut lire vos données est votre réglage**. Les fuites de données les plus courantes viennent de droits trop larges, pas de pirates qui forcent des machines.

Ce module est un cours technique, pas un avis juridique. Pour les questions de droit, consultez la personne chargée de la protection des données de votre organisation.`,
    },
    {
      kind: "text",
      md: `### Un évaluateur de politiques

Pour comprendre les politiques, le plus simple est d'en écrire un évaluateur minimal. Les règles ci-dessous sont **inventées et neutres** (actions \`stockage:lire\`, ressources \`seau-donnees/...\`) ; les vraies politiques ont une syntaxe propre à chaque fournisseur, et vous en verrez une plus loin. L'algorithme est celui des vraies plateformes :

1. rien n'est autorisé au départ ;
2. on parcourt les règles qui **concernent** la demande (l'action et la ressource correspondent, le joker \`*\` remplaçant n'importe quelle suite de caractères) ;
3. si l'une d'elles est un **Deny**, la demande est refusée, quoi que disent les autres ;
4. sinon, si l'une est un **Allow**, elle est autorisée.

La politique de l'exemple donne à un analyste la lecture de tout le seau, l'écriture dans le seul dossier \`resultats\`, et **interdit tout** dans le dossier \`personnel\`. Chaque décision est notée dans un **journal** : c'est le principe des journaux d'accès, vu plus bas.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        EVALUATEUR,
        "from collections import Counter",
        "",
        POLITIQUE_ANALYSTE,
        "",
        "demandes = [",
        "    ('stockage:lire', 'seau-donnees/brut/ventes.csv'),",
        "    ('stockage:ecrire', 'seau-donnees/resultats/rapport.csv'),",
        "    ('stockage:ecrire', 'seau-donnees/brut/ventes.csv'),",
        "    ('stockage:lire', 'seau-donnees/personnel/clients.csv'),",
        "    ('stockage:supprimer', 'seau-donnees/brut/ventes.csv'),",
        "    ('calcul:demarrer', 'machine/12'),",
        "]",
        "journal = []                                   # chaque décision est conservée",
        "for action, ressource in demandes:",
        "    decision = est_autorise(politique_analyste, action, ressource)",
        "    journal.append((action, ressource, decision))",
        "    print('AUTORISÉ' if decision else 'REFUSÉ  ', action, ressource)",
        "",
        "bilan = Counter(decision for _, _, decision in journal)",
        "print('autorisées :', bilan[True], ' refusées :', bilan[False])",
        "print('le joker * couvre seau-donnees/ :', correspond('seau-donnees/*', 'seau-donnees/'),",
        "      ' et seau-autre/x :', correspond('seau-donnees/*', 'seau-autre/x'))",
      ),
      caption: "Sur six demandes, deux sont autorisées (lire dans brut, écrire dans resultats) et quatre refusées : écrire dans brut (aucune règle ne l'autorise), lire dans personnel (le Deny l'emporte alors que la première règle autorisait la lecture de tout le seau), supprimer (jamais accordé) et démarrer une machine (aucune règle ne la concerne : refus par défaut). La simulation ne montre pas les vraies subtilités des plateformes (conditions, héritage entre comptes, politiques multiples).",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez la fonction `est_autorise(politique, action, ressource)` qui applique l'algorithme décrit : refusé par défaut, un `Deny` qui concerne la demande la refuse, sinon un `Allow` qui la concerne l'autorise. La fonction `correspond(motif, valeur)` (gestion du joker `*`) et la liste `politique_analyste` sont fournies.",
      setup: lines(
        "import json, re",
        "",
        "def correspond(motif, valeur):",
        "    expression = '^' + '.*'.join(re.escape(morceau) for morceau in motif.split('*')) + '$'",
        "    return re.match(expression, valeur) is not None",
        "",
        POLITIQUE_ANALYSTE,
      ),
      starter: lines(
        "def est_autorise(politique, action, ressource):",
        "    return False",
      ),
      solution: lines(
        "def est_autorise(politique, action, ressource):",
        "    permis = False",
        "    for instruction in politique:",
        "        concerne = (any(correspond(a, action) for a in instruction['actions'])",
        "                    and any(correspond(r, ressource) for r in instruction['ressources']))",
        "        if not concerne:",
        "            continue",
        "        if instruction['effet'] == 'Deny':",
        "            return False",
        "        permis = True",
        "    return permis",
        "",
        "print(est_autorise(politique_analyste, 'stockage:lire', 'seau-donnees/brut/ventes.csv'))",
      ),
      test: lines(
        "assert est_autorise(politique_analyste, 'stockage:lire', 'seau-donnees/brut/ventes.csv') is True, \"lire dans brut est autorisé par la première règle\"",
        "assert est_autorise(politique_analyste, 'stockage:ecrire', 'seau-donnees/resultats/rapport.csv') is True, \"écrire dans resultats est autorisé par la deuxième règle\"",
        "assert est_autorise(politique_analyste, 'stockage:ecrire', 'seau-donnees/brut/ventes.csv') is False, \"écrire dans brut n'est autorisé par aucune règle : refus par défaut\"",
        "assert est_autorise(politique_analyste, 'stockage:lire', 'seau-donnees/personnel/clients.csv') is False, \"lire dans personnel : le Deny explicite doit l'emporter sur l'Allow\"",
        "assert est_autorise([], 'stockage:lire', 'seau-donnees/x') is False, \"sans aucune règle, tout est refusé\"",
      ),
      hint: "Gardez un booléen permis, faux au départ. Pour chaque règle qui concerne la demande : si c'est un Deny, renvoyez False tout de suite ; si c'est un Allow, passez permis à True. Renvoyez permis à la fin.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Une politique trop large est un Allow dont l'action ou la ressource vaut exactement `\"*\"` (tout autoriser, ou tout autoriser sur tout). Écrivez `indices_trop_larges(politique)` qui renvoie la liste des positions (à partir de 0) des règles `Allow` de ce genre dans `politique_audit`. Un `Deny` large est volontaire et ne compte pas.",
      setup: lines("import json", "", POLITIQUE_AUDIT),
      starter: lines(
        "def indices_trop_larges(politique):",
        "    return []",
      ),
      solution: lines(
        "def indices_trop_larges(politique):",
        "    trouvees = []",
        "    for position, instruction in enumerate(politique):",
        "        if instruction['effet'] == 'Allow' and ('*' in instruction['actions'] or '*' in instruction['ressources']):",
        "            trouvees.append(position)",
        "    return trouvees",
        "",
        "print(indices_trop_larges(politique_audit))",
      ),
      test: lines(
        "_res = indices_trop_larges(politique_audit)",
        "assert _res == [1, 2], f\"les règles trop larges sont aux positions 1 (toutes les actions) et 2 (toutes les ressources) ; vous renvoyez {_res}\"",
        "assert indices_trop_larges([]) == [], \"une politique vide n'a aucune règle trop large\"",
      ),
      hint: "Parcourez la liste avec enumerate, ne regardez que les règles dont l'effet est Allow, et testez si '*' figure dans la liste des actions ou dans celle des ressources.",
    },
    {
      kind: "text",
      md: `### Secrets, chiffrement et journaux

**Les secrets restent hors du code.** Un mot de passe de base de données, une clé d'accès, un jeton d'API écrits dans un fichier de code finissent dans le dépôt, dans l'historique, dans une copie de travail oubliée. Même effacés plus tard, ils restent dans l'historique et il faut les **considérer comme compromis** et les remplacer. Les bonnes pratiques sont simples : lire le secret depuis une **variable d'environnement** ou, mieux, depuis un **gestionnaire de secrets** (AWS Secrets Manager, Google Secret Manager, Azure Key Vault), qui contrôle qui le lit et garde la trace de chaque lecture ; donner au programme une **identité de service** plutôt qu'une clé à copier ; faire **tourner** les secrets (les remplacer régulièrement).

**Chiffrer au repos et en transit.**

- **Au repos** : les données stockées (disque, stockage objet, base) sont chiffrées. Les services le proposent, souvent activé par défaut ; vous choisissez en général qui gère la clé de chiffrement : le fournisseur, ou vous-même dans un service de clés (AWS KMS, Google Cloud KMS, Azure Key Vault). Gérer sa clé permet de la révoquer, au prix d'une responsabilité de plus.
- **En transit** : les échanges passent par TLS (le \`https\`), pour qu'un tiers qui écoute le réseau ne lise rien.

Le chiffrement protège contre le vol d'un disque ou l'écoute d'une ligne. Il ne protège **pas** contre une identité qui a le droit de lire : celle-ci reçoit les données déchiffrées. Les politiques d'accès et le chiffrement se complètent, ils ne se remplacent pas.

**Les journaux d'accès** (CloudTrail et les journaux d'accès S3 chez AWS, Cloud Audit Logs chez Google Cloud, journal d'activité chez Azure) enregistrent qui a fait quoi, quand et avec quel résultat. On y repère un compte qui lit soudain tout le stockage ou une série de refus répétés. Ils ne servent que si quelqu'un les **lit** (alertes) et si eux-mêmes sont protégés (un journal qu'on peut effacer ne prouve rien). Notre petit \`journal\` de l'exemple en est la version minuscule.`,
    },
    {
      kind: "text",
      md: `### Une politique réelle et le moindre privilège, à lire

Voici une vraie politique AWS (JSON), et la même idée pour Google Cloud et Azure. **Ces extraits ne tournent pas dans le moteur du site** : ils sont à lire, ou à essayer dans votre propre compte, sur un seau d'essai.

La politique donne la lecture du seul dossier \`donnees/\` du seau \`mon-seau\` et interdit explicitement toute suppression. Le champ \`Version\` n'est pas une date de votre politique : c'est la version fixe du langage de politiques.

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "LireLesDonnees",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::mon-seau", "arn:aws:s3:::mon-seau/donnees/*"]
    },
    {
      "Sid": "RefuserLaSuppression",
      "Effect": "Deny",
      "Action": "s3:DeleteObject",
      "Resource": "arn:aws:s3:::mon-seau/*"
    }
  ]
}
\`\`\`

Remarquez que la même forme que notre évaluateur apparaît : effet, actions, ressources avec joker, un Deny qui l'emporte. Ce qui est plus fin dans la vraie plateforme (conditions sur l'adresse réseau, sur l'heure, sur une étiquette ; politiques posées à plusieurs niveaux) n'est pas simulé ici.

Chez Google Cloud et Azure, on attache plutôt un **rôle prédéfini** à une identité sur une ressource :

\`\`\`bash
# Google Cloud : le compte de service peut lire les objets du seau, rien d'autre
gcloud storage buckets add-iam-policy-binding gs://mon-seau \\
  --member="serviceAccount:analyse@mon-projet.iam.gserviceaccount.com" \\
  --role="roles/storage.objectViewer"

# Azure : l'identité reçoit le rôle de lecteur de blobs sur ce compte de stockage seulement
az role assignment create \\
  --assignee "<identifiant-de-l-identite>" \\
  --role "Storage Blob Data Reader" \\
  --scope "/subscriptions/<abonnement>/resourceGroups/<groupe>/providers/Microsoft.Storage/storageAccounts/moncompte"
\`\`\`

Dans les trois cas, le réflexe est le même : le rôle le plus restreint qui suffit, sur la ressource la plus précise possible, jamais « tout sur tout » pour que ça marche vite.`,
    },
    {
      kind: "text",
      md: `### Localisation des données et RGPD

Une **donnée à caractère personnel** est toute information qui se rapporte à une personne identifiée ou identifiable (article 4 du RGPD, le règlement européen sur la protection des données). Un nom, un numéro de client, une adresse électronique en sont, mais aussi un identifiant de cookie ou la combinaison de plusieurs informations qui désignent une seule personne.

Ce que cela change pour un projet cloud :

- **Où sont les données ?** Les fournisseurs proposent le choix de la **région** où stocker et traiter. Choisir une région dans l'Union européenne est un réglage de départ, pas une garantie suffisante à lui seul : copies de sauvegarde, journaux, services d'assistance et accès à distance peuvent concerner d'autres lieux. Le chapitre V du RGPD encadre les **transferts** hors de l'Union.
- **Qui traite ?** Le fournisseur de cloud agit en général comme **sous-traitant** (article 28) : un contrat encadre ce qu'il peut faire de vos données. Le choix du fournisseur est une décision juridique et stratégique autant que technique. Des hébergeurs européens et des solutions auto-hébergées existent, et peuvent être le bon choix selon le contexte.
- **Quelles mesures ?** L'article 32 demande des mesures de sécurité adaptées au risque, et cite notamment la **pseudonymisation** et le **chiffrement**. Contrôle des accès, journaux et secrets bien gardés en font partie.
- **Combien de données ?** Le principe le plus efficace est de **ne pas collecter ni garder** ce dont on n'a pas besoin. Une donnée qu'on n'a pas ne peut pas fuir.

Un projet de data science n'a presque jamais besoin des noms, adresses ou numéros des personnes : il a besoin de **regroupements**, de **tendances**. C'est là qu'interviennent pseudonymiser et anonymiser.`,
    },
    {
      kind: "text",
      md: `### Pseudonymiser : un hachage ne suffit pas

**Pseudonymiser** (article 4), c'est remplacer un identifiant direct (un numéro de client) par un **pseudonyme** de sorte que les données ne se rapportent plus à une personne précise **sans information supplémentaire**, conservée à part. Les données pseudonymisées restent des données personnelles : la protection s'allège, elle ne disparaît pas.

L'idée qui vient d'abord est de **hacher** l'identifiant (SHA-256 par exemple). C'est trompeur : un hachage est **déterministe et public**. Si les identifiants possibles sont peu nombreux (six chiffres, un million de valeurs), un attaquant essaie **tous les identifiants possibles**, calcule leur hachage, et retrouve celui qu'il cherche. Cela s'appelle une attaque par **force brute**, et elle est très rapide quand l'espace est petit.

La parade est le **HMAC**, un hachage **avec clé secrète** : sans la clé, impossible de calculer le pseudonyme d'un identifiant candidat, donc de vérifier une hypothèse. Avec la clé, le pseudonyme est **stable** (même identifiant, même pseudonyme), ce qui permet de **joindre** des tables. Tout repose alors sur la garde de la clé (voir les secrets), qu'on conserve ailleurs que dans le jeu de données.`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        "import hashlib, hmac, time",
        "",
        "cle_secrete = b'cle-secrete-d-exemple'            # factice : en vrai, dans un gestionnaire de secrets",
        "",
        "def pseudonyme(identifiant, cle):",
        "    return hmac.new(cle, identifiant.encode('utf-8'), hashlib.sha256).hexdigest()[:16]",
        "",
        "ident = '047318'                                    # un numéro de client à six chiffres (inventé)",
        "p = pseudonyme(ident, cle_secrete)",
        "print('pseudonyme :', p)",
        "print('stable avec la même clé :', p == pseudonyme(ident, cle_secrete),",
        "      ' avec une autre clé :', pseudonyme(ident, b'autre-cle'))",
        "",
        "# --- Attaque par force brute sur un simple hachage SHA-256 (sans clé) ---",
        "empreinte = hashlib.sha256(ident.encode('utf-8')).hexdigest()",
        "debut = time.time()",
        "essais = 0",
        "for i in range(1000000):                            # les 1 000 000 d'identifiants à six chiffres",
        "    essais += 1",
        "    if hashlib.sha256(('%06d' % i).encode('utf-8')).hexdigest() == empreinte:",
        "        print('identifiant retrouvé :', '%06d' % i, 'en', essais, 'essais')",
        "        break",
        "print('durée de la force brute :', round(time.time() - debut, 1), 's')",
        "",
        "# --- La même attaque contre le HMAC, sans connaître la clé ---",
        "trouve = None",
        "for i in range(200000):",
        "    if pseudonyme('%06d' % i, b'cle-devinee') == p:",
        "        trouve = '%06d' % i",
        "print('HMAC, 200 000 essais avec une clé devinée, identifiant trouvé :', trouve)",
      ),
      caption: "Le simple hachage SHA-256 de 047318 est retrouvé après 47 319 essais, en une fraction de seconde (la durée affichée dépend de votre machine). Contre le HMAC, 200 000 essais avec une clé devinée, qui incluent pourtant le bon identifiant, ne trouvent rien : sans la clé, on ne peut pas vérifier une hypothèse. Avec la clé, le pseudonyme est en revanche stable d'un appel à l'autre. Un attaquant qui volerait la clé en même temps que les données retrouverait tout : la clé est le vrai secret. Cet espace de six chiffres est petit ; un identifiant long et aléatoire résisterait mieux, mais ne dispense pas de la clé.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `pseudonyme(identifiant, cle)` : le HMAC-SHA256 de l'identifiant (en octets UTF-8) avec la clé (déjà en octets), en hexadécimal, **tronqué aux 16 premiers caractères**. Utilisez `hmac.new(cle, message, hashlib.sha256)`.",
      setup: "import hashlib, hmac",
      starter: lines(
        "def pseudonyme(identifiant, cle):",
        "    return identifiant",
      ),
      solution: lines(
        "def pseudonyme(identifiant, cle):",
        "    return hmac.new(cle, identifiant.encode('utf-8'), hashlib.sha256).hexdigest()[:16]",
        "",
        "print(pseudonyme('C-1001', b'une-cle'))",
      ),
      test: lines(
        "_p = pseudonyme('C-1001', b'une-cle')",
        "assert isinstance(_p, str) and len(_p) == 16, f\"le pseudonyme doit faire 16 caractères hexadécimaux, pas {_p!r}\"",
        "assert 'C-1001' not in _p, \"le pseudonyme ne doit pas contenir l'identifiant\"",
        "assert _p == pseudonyme('C-1001', b'une-cle'), \"le même identifiant avec la même clé doit toujours donner le même pseudonyme\"",
        "assert _p != pseudonyme('C-1001', b'une-autre-cle'), \"une autre clé doit donner un autre pseudonyme : utilisez bien la clé\"",
        "assert _p == hmac.new(b'une-cle', b'C-1001', hashlib.sha256).hexdigest()[:16], \"attendu : HMAC-SHA256 en hexadécimal, 16 premiers caractères\"",
      ),
      hint: "hmac.new(cle, identifiant.encode('utf-8'), hashlib.sha256).hexdigest() donne le texte hexadécimal complet ; gardez les 16 premiers caractères avec [:16].",
    },
    {
      kind: "text",
      md: `### Anonymiser est plus difficile qu'il n'y paraît

Des données sont **anonymes** quand plus personne, avec des moyens raisonnables, ne peut retrouver la personne. Retirer le nom et l'identifiant **ne suffit pas** : le recoupement de quelques informations ordinaires (âge, code postal, sexe) peut désigner une personne précise. On appelle ces informations des **quasi-identifiants**.

Une mesure simple est la taille du **plus petit groupe** de personnes qui partagent les mêmes valeurs de quasi-identifiants. Si ce groupe est d'**une seule** personne, cette ligne est unique et peut être ré-identifiée par quelqu'un qui connaît ces trois informations (c'est l'idée du *k*-anonymat : chaque combinaison doit être partagée par au moins *k* personnes).

Le remède courant est la **généralisation** : on remplace l'âge exact par une tranche, le code postal par le département. La contrepartie est une perte de précision : on ne peut plus analyser finement ce qu'on a effacé. L'exemple le mesure sur 2 000 personnes simulées (graine fixe, codes postaux fictifs).`,
    },
    {
      kind: "code",
      language: "python",
      code: lines(
        PERSONNES,
        "",
        "def plus_petit_groupe(tableau, colonnes):",
        "    return int(tableau.groupby(colonnes).size().min())",
        "",
        "def part_uniques(tableau, colonnes):",
        "    # part des lignes qui sont seules de leur groupe",
        "    return float((tableau.groupby(colonnes)['age'].transform('size') == 1).mean())",
        "",
        "avant = ['age', 'code_postal', 'sexe']",
        "apres = ['tranche', 'departement', 'sexe']",
        "for nom, colonnes in [('âge exact, code postal, sexe', avant), ('tranche, département, sexe', apres)]:",
        "    print(nom, ':', personnes.groupby(colonnes).ngroups, 'groupes, plus petit groupe',",
        "          plus_petit_groupe(personnes, colonnes), ', lignes uniques', round(100 * part_uniques(personnes, colonnes), 1), '%')",
      ),
      caption: "Avec l'âge exact, le code postal et le sexe, les 2 000 personnes se répartissent en 1 692 groupes, le plus petit en compte 1, et 70,6 % des lignes sont uniques : presque tout le monde est ré-identifiable par recoupement, alors qu'aucun nom n'apparaît. Après généralisation (3 tranches d'âge, 10 départements, sexe), il reste 60 groupes, le plus petit regroupe 17 personnes et plus aucune ligne n'est unique. Cela ne prouve pas que les données sont anonymes : d'autres colonnes, ou d'autres jeux de données à croiser, peuvent encore faire surgir une personne.",
    },
    {
      kind: "exercise",
      language: "python",
      prompt: "Écrivez `plus_petit_groupe(tableau, colonnes)` qui renvoie, sous forme d'entier, la taille du plus petit groupe de lignes qui partagent les mêmes valeurs dans `colonnes`. Le tableau `personnes` est prêt, avec les colonnes `age`, `code_postal`, `sexe`, `tranche` et `departement`.",
      setup: PERSONNES,
      starter: lines(
        "def plus_petit_groupe(tableau, colonnes):",
        "    return 0",
      ),
      solution: lines(
        "def plus_petit_groupe(tableau, colonnes):",
        "    return int(tableau.groupby(colonnes).size().min())",
        "",
        "print(plus_petit_groupe(personnes, ['age', 'code_postal', 'sexe']),",
        "      plus_petit_groupe(personnes, ['tranche', 'departement', 'sexe']))",
      ),
      test: lines(
        "_a = plus_petit_groupe(personnes, ['age', 'code_postal', 'sexe'])",
        "_b = plus_petit_groupe(personnes, ['tranche', 'departement', 'sexe'])",
        "assert isinstance(_a, int), \"renvoyez un entier (int)\"",
        "assert _a == 1, f\"avec l'âge exact et le code postal, le plus petit groupe compte 1 personne ; vous trouvez {_a}\"",
        "assert _b == 17, f\"après généralisation, le plus petit groupe compte 17 personnes ; vous trouvez {_b}\"",
      ),
      hint: "groupby(colonnes).size() donne la taille de chaque groupe ; il suffit d'en prendre le minimum.",
    },
    {
      kind: "note",
      tone: "warning",
      md: "Un hachage sans clé n'est pas une protection, un HMAC n'est qu'une pseudonymisation (les données restent personnelles tant que la clé existe), et des tranches d'âge n'anonymisent rien si une autre colonne désigne la personne. Dans le doute, **collectez moins**, gardez moins longtemps, et demandez l'avis de la personne chargée de la protection des données.",
    },
  ],
  quiz: [
    {
      question: "Une politique contient un Allow qui autorise la lecture de tout le seau et un Deny sur le dossier personnel/. Que se passe-t-il pour une lecture dans personnel/ ?",
      options: [
        "Elle est autorisée, car le Allow est écrit en premier",
        "Elle est autorisée, car la lecture est une action inoffensive",
        "Elle est refusée, car un Deny explicite l'emporte sur tout Allow",
        "Elle dépend de l'ordre alphabétique des règles",
      ],
      correct: 2,
      explanation: "Les plateformes évaluent tous les refus explicites avant de regarder les autorisations. Notre simulation le montrait : la lecture de clients.csv dans personnel était refusée alors que la première règle autorisait tout le seau.",
    },
    {
      question: "Pourquoi une règle Allow avec comme action « * » sur la ressource « * » est-elle à éviter ?",
      options: [
        "Parce qu'elle ralentit l'évaluation des politiques",
        "Parce qu'elle viole le moindre privilège : l'identité reçoit tous les droits sur tout, bien au-delà de son besoin",
        "Parce que le joker n'est pas permis dans les politiques",
        "Parce qu'elle crée des journaux d'accès trop longs",
      ],
      correct: 1,
      explanation: "Le moindre privilège limite les dégâts si une identité est compromise ou se trompe. Un droit trop large est la cause la plus courante de fuite de données dans le cloud.",
    },
    {
      question: "Pourquoi un simple hachage SHA-256 de numéros de client à six chiffres ne pseudonymise-t-il pas correctement ?",
      options: [
        "Parce que SHA-256 produit des empreintes trop courtes",
        "Parce que SHA-256 peut être inversé mathématiquement",
        "Parce qu'il n'est pas déterministe",
        "Parce que seuls un million de valeurs sont possibles : on les hache toutes et on retrouve l'identifiant (47 319 essais dans l'exemple)",
      ],
      correct: 3,
      explanation: "Le hachage est public et déterministe : l'attaquant calcule lui-même les empreintes de tous les candidats. Avec un espace de six chiffres, c'est l'affaire de quelques secondes. Le HMAC ajoute une clé secrète qu'il ne peut pas deviner.",
    },
    {
      question: "Les données de l'exemple ne contiennent plus aucun nom, mais 70,6 % des lignes sont uniques sur l'âge, le code postal et le sexe. Que faut-il en conclure ?",
      options: [
        "Qu'elles sont anonymes, puisqu'il n'y a aucun nom",
        "Que ces lignes restent ré-identifiables par recoupement : l'absence de nom ne suffit pas à anonymiser",
        "Que le code postal doit être chiffré par TLS",
        "Que le sexe est le seul quasi-identifiant",
      ],
      correct: 1,
      explanation: "Quelqu'un qui connaît l'âge, le code postal et le sexe d'une personne retrouve sa ligne quand elle est seule de son groupe. La généralisation (tranches, département) a ramené le plus petit groupe à 17 personnes.",
    },
    {
      question: "Que protège le chiffrement des données au repos ?",
      options: [
        "Contre le vol d'un disque ou d'une copie des fichiers, mais pas contre une identité autorisée à lire les données",
        "Contre toute lecture, y compris par les identités autorisées",
        "Contre l'écoute du réseau entre le navigateur et le service",
        "Contre les erreurs de politique d'accès",
      ],
      correct: 0,
      explanation: "Une identité autorisée reçoit les données déchiffrées : le chiffrement au repos et les politiques d'accès se complètent. L'écoute du réseau relève du chiffrement en transit (TLS).",
    },
  ],
};
