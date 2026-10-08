/**
 * MLOps and Data Engineering
 * Model deployment, infrastructure, data pipelines, and operational practices
 */

import { GlossaryEntry } from './types';

export const mlopsTerms: GlossaryEntry[] = [
  {
    term: "MLOps (Machine Learning Operations)",
    description: `Le MLOps rassemble les pratiques qui permettent de développer, déployer et maintenir des modèles de machine learning en production de façon fiable et reproductible. Il transpose au machine learning les idées du DevOps (automatisation, tests, intégration continue) en tenant compte de ce qui est propre au ML : les données et le modèle appris.

**Principe :** un cycle de vie qui ne s'arrête pas au déploiement.
- Données : collecte, validation, versionnement.
- Expérimentation : entraînement, suivi des essais, évaluation.
- Déploiement : mise en production, avec retour arrière possible.
- Surveillance : qualité des prédictions, dérive des données.
- Réentraînement : mise à jour du modèle quand c'est nécessaire.

**Ce qui diffère d'un logiciel classique :**
- Le comportement dépend des données, qui changent avec le temps.
- Il faut versionner le code, les données et le modèle.
- Un service peut fonctionner sans aucune erreur tout en produisant de mauvaises prédictions.

**Outils courants :** MLflow (suivi d'expériences, registre de modèles), DVC (versionnement des données), Airflow (orchestration), Kubeflow (pipelines sur Kubernetes), Docker, et les plateformes cloud de machine learning.

**En pratique :** le niveau d'outillage doit rester proportionné au projet. Pour un petit projet, un script versionné, un environnement reproductible et quelques tests de données valent mieux qu'une plateforme complète.`,
    category: "mlops",
    icon: "Settings"
  },
  {
    term: "Pipeline de données (Data Pipeline)",
    description: `Un pipeline de données est une suite d'étapes automatisées qui déplace et transforme des données depuis leurs sources vers une destination (entrepôt, lac de données, jeu d'entraînement).

**Étapes typiques :**
- Extraction : lecture des sources (bases de données, API, fichiers).
- Validation et nettoyage : contrôle des formats, des doublons, des valeurs manquantes.
- Transformation : jointures, agrégations, calcul de variables.
- Chargement : écriture vers la destination.
- Supervision : journaux et alertes en cas d'échec.

**Exemple :** chaque nuit, un pipeline lit les ventes du jour dans une base, retire les doublons, calcule des agrégats par produit et les écrit dans une table utilisée pour entraîner un modèle de prévision.

**Qualités attendues :**
- Idempotence : relancer le pipeline sur la même période ne duplique pas les données.
- Reprise sur erreur : on repart de l'étape qui a échoué.
- Traçabilité : on sait quelle version du code a produit quelle donnée.
- Tests de données à l'entrée et à la sortie.

**Outils :** Airflow, Prefect ou Dagster pour orchestrer ; Kafka pour transporter des événements ; Spark ou Flink pour traiter de gros volumes.

**Limites :** un pipeline casse souvent à cause d'un changement en amont (schéma d'une source, format d'une colonne), d'où l'intérêt des contrôles de qualité.`,
    category: "mlops",
    icon: "Layers"
  },
  {
    term: "Versioning de modèles (Model Versioning)",
    description: `Le versioning de modèles consiste à identifier, enregistrer et conserver chaque version d'un modèle avec tout ce qui permet de la reproduire et de la comparer. C'est l'équivalent de Git pour le code, adapté au fait qu'un modèle dépend aussi des données et de la configuration d'entraînement.

**Ce qu'il faut garder pour chaque version :**
- Le code (identifiant de commit).
- Les données d'entraînement (version, ou empreinte du fichier).
- Les hyperparamètres et la graine aléatoire.
- Les métriques d'évaluation.
- L'environnement (versions des bibliothèques).
- Le fichier du modèle sérialisé.

**Intérêt :**
- Reproduire un résultat.
- Comparer deux versions sur les mêmes données de test.
- Revenir à une version stable en cas de problème (rollback).
- Savoir quelle version a produit quelle prédiction (audit).

**Outils :** MLflow (suivi et registre de modèles), DVC (versionne les données et les modèles à côté de Git), Weights & Biases.

**Nommage :** une version sémantique (1.2.0) ou un identifiant dérivé du commit ou de la date. Inscrire la métrique dans le nom est déconseillé : elle se trouve dans les métadonnées.

**Limites :** les fichiers volumineux ne se versionnent pas tels quels dans Git (il faut un stockage dédié), et un entraînement n'est pas toujours exactement reproductible (parallélisme, GPU), même avec une graine fixée.`,
    category: "mlops",
    icon: "GitBranch"
  },
  {
    term: "Déploiement de modèles (Model Deployment)",
    description: `Le déploiement d'un modèle consiste à le rendre disponible dans un système réel, où il produit des prédictions pour des utilisateurs ou pour d'autres applications.

**Modes de déploiement :**
- Par lots : le modèle est exécuté périodiquement sur un ensemble de données.
- En ligne : le modèle est exposé par une API qui répond à chaque requête.
- Embarqué : le modèle tourne sur l'appareil (téléphone, caméra).
- En flux : le modèle traite des événements en continu.

**Étapes habituelles :**
1. Empaqueter le modèle avec ses dépendances, souvent dans un conteneur.
2. Tester : fonctionnement, performance, cohérence avec l'entraînement.
3. Déployer en pré-production (staging).
4. Passer en production, de préférence progressivement (canary, blue-green).
5. Surveiller, avec un plan de retour arrière.

**Points d'attention :**
- Latence et capacité à tenir la charge.
- Mêmes prétraitements qu'à l'entraînement : un écart (« training-serving skew ») dégrade les prédictions sans faire d'erreur visible.
- Sécurité (authentification, données personnelles) et journalisation des requêtes.

**Outils :** Docker et Kubernetes, serveurs de modèles (TensorFlow Serving, TorchServe), MLflow, services de déploiement des plateformes cloud.

**Limites :** un modèle déployé n'est pas un travail terminé : il doit être surveillé et mis à jour.`,
    category: "mlops",
    icon: "TrendingUp"
  },
  {
    term: "Inférence en lot vs temps réel (Batch vs Real-time Inference)",
    description: `L'inférence en lot calcule les prédictions pour un grand ensemble d'observations à intervalles planifiés ; l'inférence en temps réel calcule une prédiction à la demande, au moment où elle est nécessaire.

**Inférence en lot :**
- Principe : exécution planifiée (chaque nuit, chaque semaine), résultats stockés dans une table.
- Latence : sans importance immédiate (minutes ou heures).
- Avantages : simple à exploiter, bon débit, reprise facile en cas d'échec.
- Exemples : recommandations préparées chaque nuit, scores de risque mensuels.

**Inférence en temps réel :**
- Principe : un service répond à chaque requête, en quelques millisecondes à quelques secondes.
- Contraintes : disponibilité permanente, montée en charge, accès rapide aux variables d'entrée (voir Feature Store).
- Exemples : détection de fraude au moment d'un paiement, complétion d'une recherche.

**Choisir selon :**
- La fraîcheur nécessaire de la prédiction.
- Le volume de requêtes.
- Le coût et la complexité d'exploitation acceptables.

**Approche hybride :** on précalcule en lot ce qui change peu et l'on ajuste en temps réel avec le contexte immédiat, par exemple des recommandations de base mises à jour la nuit et réordonnées selon l'activité en cours.

**Limites :** une prédiction calculée en lot peut être périmée au moment où on l'utilise ; en temps réel, toutes les variables doivent être disponibles à l'instant de la requête.`,
    category: "mlops",
    icon: "Calendar"
  },
  {
    term: "Monitoring de modèles (Model Monitoring)",
    description: `Le monitoring de modèles est la surveillance d'un modèle en production pour détecter la dégradation de son service ou de ses prédictions avant que les utilisateurs ne la subissent.

**Trois niveaux de surveillance :**
- Service : latence, taux d'erreurs, utilisation des ressources (processeur, mémoire, GPU).
- Données : schéma, valeurs manquantes, plages de valeurs, distributions des variables d'entrée (voir Dérive des données).
- Modèle : métriques de qualité (précision, rappel, erreur moyenne) comparées à la vérité terrain, et distribution des prédictions.

**Difficulté propre au ML :** la vérité terrain arrive souvent avec retard (un défaut de paiement n'est connu que des mois plus tard). En attendant, on suit des indicateurs indirects : dérive des entrées, distribution des scores, indicateurs métier.

**Alertes :**
- Seuils fixes (par exemple un taux d'erreur maximal).
- Seuils relatifs à l'historique, pour tenir compte de la saisonnalité.
- Une alerte doit appeler une action précise : trop d'alertes finissent par être ignorées.

**Outils :** Prometheus et Grafana pour les métriques de service ; Evidently pour les rapports de dérive et de performance des modèles ; Great Expectations pour valider les données.

**En pratique :** décider à l'avance de ce qui déclenche un réentraînement, un retour à la version précédente ou une enquête.`,
    category: "mlops",
    icon: "Activity"
  },
  {
    term: "Dérive des données (Data Drift)",
    description: `La dérive des données (data drift) est un changement de la distribution des variables d'entrée entre la période d'entraînement et la période d'utilisation. Le modèle reçoit alors des données qui ressemblent moins à celles qu'il a apprises.

**Formes courantes :**
- Graduelle : évolution lente (vieillissement d'une clientèle).
- Soudaine : changement brutal (nouvelle source de données, capteur remplacé, événement exceptionnel).
- Saisonnière ou récurrente : retour périodique de motifs.

**Causes possibles :** changement de comportement des utilisateurs, modification d'un système en amont (format, unité, encodage), nouvelle population ciblée, échantillon d'entraînement peu représentatif.

**Détection :** on compare la distribution actuelle à une distribution de référence.
- Variable numérique : test de Kolmogorov-Smirnov, distance de Wasserstein.
- Variable catégorielle : test du χ².
- Indicateurs : Population Stability Index (PSI), divergence de Kullback-Leibler.
- Visuel : histogrammes superposés.

**Réponses :** enquêter sur l'origine, réentraîner sur des données récentes, choisir des variables plus stables.

**Remarque :** une dérive des entrées n'entraîne pas toujours une baisse de performance, et une baisse de performance peut survenir sans dérive des entrées (voir Dérive conceptuelle).`,
    category: "mlops",
    icon: "TrendingDown"
  },
  {
    term: "Dérive conceptuelle (Concept Drift)",
    description: `La dérive conceptuelle (concept drift) est un changement de la relation entre les variables d'entrée et la cible : pour les mêmes entrées X, la bonne réponse Y n'est plus la même. Le modèle appris devient obsolète, même si les données d'entrée semblent inchangées.

**Différence avec la dérive des données :**
- Dérive des données : la distribution de X change.
- Dérive conceptuelle : la relation entre X et Y change, c'est-à-dire P(Y | X).

**Exemples :**
- Des fraudeurs modifient leurs méthodes : les mêmes transactions ne sont plus classées de la même façon.
- Après un changement de contexte économique, les mêmes caractéristiques d'un client ne prédisent plus le même comportement d'achat.

**Formes :** soudaine, graduelle, incrémentale, récurrente (saisonnière), temporaire.

**Détection :**
- Suivre l'erreur du modèle dans le temps, ce qui suppose de disposer de la vérité terrain, parfois avec retard.
- Appliquer des algorithmes de détection sur le flux des erreurs : DDM, EDDM, ADWIN.
- À défaut, surveiller des indicateurs métier.

**Réponses :** réentraînement périodique ou déclenché par une alerte, pondération des données récentes, apprentissage en ligne.

**Limites :** sans vérité terrain, la détection reste indirecte.`,
    category: "mlops",
    icon: "RefreshCw"
  },
  {
    term: "CI/CD pour ML",
    description: `Le CI/CD pour ML adapte au machine learning l'intégration continue (CI) et la livraison continue (CD) : tests, entraînement, validation et déploiement sont automatisés et reproductibles.

**CI (intégration continue) :**
- Tests du code et du pipeline de données.
- Validation des données (schéma, valeurs manquantes, distributions).
- Entraînement rapide sur un petit échantillon pour vérifier que tout fonctionne.

**CD (livraison continue) :**
- Entraînement complet et évaluation du nouveau modèle.
- Comparaison avec le modèle en production : on ne le promeut que s'il respecte des seuils de qualité.
- Enregistrement dans le registre de modèles, puis déploiement en pré-production et progressivement en production.
- Retour arrière possible.

**Particularités du ML :**
- Un pipeline peut être déclenché par du code, de nouvelles données ou une dérive détectée.
- L'entraînement est coûteux : on ne le relance pas à chaque commit.
- Les résultats ne sont pas parfaitement déterministes : on teste avec des seuils et des tolérances.

**Outils :** GitHub Actions, GitLab CI ou Jenkins pour l'automatisation ; MLflow, Airflow ou Kubeflow pour les pipelines ; Great Expectations ou Evidently pour les tests de données ; Docker, Kubernetes ou Terraform pour le déploiement.

**En pratique :** on commence souvent par automatiser les tests de code et de données, avant d'automatiser l'entraînement et le déploiement.`,
    category: "mlops",
    icon: "GitBranch"
  },
  {
    term: "Feature Store",
    description: `Un feature store est un système qui stocke, versionne et fournit les variables (features) calculées à partir des données brutes, afin que l'entraînement et l'inférence utilisent exactement les mêmes définitions.

**Problème résolu :**
- Une variable recalculée séparément pour l'entraînement et pour la production finit par différer (« training-serving skew »).
- Des équipes recalculent parfois les mêmes variables, chacune de son côté.

**Composants :**
- Magasin hors ligne : historique des valeurs, utilisé pour construire les jeux d'entraînement (entrepôt, fichiers).
- Magasin en ligne : valeurs récentes accessibles avec une faible latence pour l'inférence (base clé-valeur).
- Registre : catalogue des variables, avec définition, propriétaire et version.
- Moteur de transformation : calcul des variables à partir des sources.

**Cohérence temporelle :** pour construire un exemple d'entraînement, on doit récupérer les valeurs telles qu'elles étaient à la date de l'exemple (jointure « point-in-time »), sinon des informations du futur s'infiltrent dans l'entraînement (fuite de données).

**Outils :** Feast (open source), Hopsworks, et les feature stores intégrés aux plateformes (SageMaker, Vertex AI, Databricks).

**Limites :** c'est une infrastructure de plus à exploiter. Elle se justifie surtout quand plusieurs modèles partagent des variables ou quand l'inférence en temps réel exige une faible latence.`,
    category: "mlops",
    icon: "Database"
  },
  {
    term: "Orchestration de workflows",
    description: `L'orchestration de workflows est la coordination automatique de tâches qui dépendent les unes des autres (ingestion, validation, entraînement, évaluation, déploiement) : ordre d'exécution, planification, reprises sur erreur et suivi.

**Concepts de base :**
- DAG (graphe orienté acyclique) : décrit les tâches et leurs dépendances, sans boucle.
- Planificateur : déclenche les exécutions à heure fixe ou sur événement.
- Exécuteur : lance les tâches sur les machines disponibles.
- Reprises (retries), alertes et historique des exécutions.
- Backfill : rejouer le workflow sur une période passée.

**Exemple :** ingestion, validation des données, calcul des variables, entraînement, évaluation, puis enregistrement du modèle uniquement si la métrique dépasse un seuil.

**Outils :** Apache Airflow (né chez Airbnb, aujourd'hui projet de l'Apache Software Foundation), Prefect, Dagster, Kubeflow Pipelines (sur Kubernetes).

**Bonnes pratiques :**
- Des tâches idempotentes : relancées, elles donnent le même résultat sans doublon.
- Des tâches petites, testables et paramétrées par la date traitée.
- Des limites de ressources et des alertes sur les échecs.

**Limites :** un orchestrateur coordonne le calcul sans l'effectuer (ce sont Spark, SQL ou Python qui calculent). Des dépendances trop nombreuses rendent le DAG difficile à maintenir.`,
    category: "mlops",
    icon: "Network"
  },
  {
    term: "Containerisation (Docker/Kubernetes)",
    description: `La containerisation empaquette une application avec ses dépendances (bibliothèques, environnement d'exécution) dans une image qui s'exécute de la même façon sur toute machine disposant d'un moteur de conteneurs.

**Docker :**
- Image : modèle figé contenant le code et ses dépendances.
- Conteneur : instance en cours d'exécution d'une image.
- Dockerfile : recette de construction de l'image.
- Registre : dépôt d'images (Docker Hub, registres cloud).

**Kubernetes :** orchestrateur de conteneurs. Il répartit les conteneurs sur un ensemble de machines, les redémarre en cas de panne, ajuste leur nombre selon la charge et gère la configuration et les secrets.

**Exemple :** Dockerfile d'un service Python (FastAPI) qui sert un modèle, dont le code se trouve dans le dossier app.

\`\`\`
FROM python:3.12-slim
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app/ app/
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0"]
\`\`\`

**Intérêt pour le ML :** mêmes versions de bibliothèques de l'entraînement à la production, isolation entre projets, déploiements et retours arrière reproductibles.

**Limites :**
- Un conteneur partage le noyau de la machine hôte : plus léger qu'une machine virtuelle, il est aussi moins isolé.
- L'accès aux GPU demande une configuration spécifique.
- Kubernetes a un coût de complexité : pour un petit service, un simple conteneur suffit souvent.`,
    category: "mlops",
    icon: "Layers"
  },
  {
    term: "Scalabilité horizontale vs verticale",
    description: `La scalabilité (ou passage à l'échelle) est la capacité d'un système à absorber une charge croissante. On peut l'obtenir en renforçant une machine (verticale) ou en ajoutant des machines (horizontale).

**Scalabilité verticale (scale up) :** augmenter les ressources d'une seule machine (processeurs, mémoire, disques, GPU).
- Avantages : simple, sans coordination entre machines, latence faible.
- Limites : plafond matériel, point de défaillance unique en cas de panne, coût qui croît vite pour les très grosses machines.

**Scalabilité horizontale (scale out) :** répartir la charge sur plusieurs machines derrière un répartiteur de charge.
- Avantages : pas de plafond théorique, tolérance aux pannes par redondance, ajout ou retrait d'instances selon la demande (autoscaling).
- Limites : plus complexe (état partagé, cohérence des données, réseau).

**Exemples en ML :**
- Un service d'inférence sans état se met à l'échelle horizontalement : on lance davantage de copies du même conteneur.
- Entraîner un modèle sur un GPU plus puissant est une montée en charge verticale ; répartir l'entraînement sur plusieurs machines est horizontal (entraînement distribué), avec un coût de communication.
- Une base de données avec état est plus difficile à répartir qu'un service sans état.

**En pratique :** on commence souvent par la solution verticale, plus simple, puis l'on passe à l'horizontale quand la charge, la disponibilité ou le coût l'exigent.`,
    category: "mlops",
    icon: "TrendingUp"
  },
  {
    term: "A/B Testing pour ML",
    description: `Un test A/B pour un modèle compare, en conditions réelles, la version actuelle (A) à une nouvelle version (B) : les utilisateurs sont répartis au hasard entre les deux, puis on teste statistiquement l'écart sur une métrique choisie à l'avance.

**Méthode :**
1. Formuler l'hypothèse et choisir la métrique principale (par exemple le taux de conversion), ainsi que des métriques de garde-fou (latence, erreurs).
2. Répartir les utilisateurs au hasard, par utilisateur plutôt que par requête, pour que chacun voie toujours la même version.
3. Fixer à l'avance la taille d'échantillon et la durée, par un calcul de puissance.
4. Analyser avec un test adapté (test de proportions, test t).
5. Décider.

**Pourquoi ne pas se contenter des métriques hors ligne ?** Une meilleure précision sur un jeu de validation ne garantit pas un meilleur effet sur le comportement des utilisateurs.

**Pièges :**
- Arrêter dès que le résultat paraît significatif : regarder les résultats en continu augmente les faux positifs.
- Effet de nouveauté : une nouvelle version attire parfois plus de clics au début.
- Interférences entre groupes (un même stock, une même file d'attente).
- Plusieurs métriques testées : risque de comparaisons multiples.

**Infrastructure :** répartition du trafic (50/50, 90/10), feature flags, tableaux de bord.

**Voir aussi :** « Test d'hypothèse » et « Erreurs de type I et de type II ».`,
    category: "mlops",
    icon: "GitBranch"
  },
  {
    term: "Shadow Mode",
    description: `Le mode fantôme (shadow mode) est une technique de déploiement qui évalue un nouveau modèle sur le trafic réel sans que ses prédictions aient d'effet sur les utilisateurs.

**Principe :**
- Le modèle actuel continue de répondre aux utilisateurs.
- Le nouveau modèle reçoit les mêmes requêtes en parallèle, mais ses prédictions ne sont pas renvoyées : elles sont seulement journalisées.
- On compare ensuite les deux : écarts entre prédictions, latence, taux d'erreurs et, quand la vérité terrain arrive, qualité des prédictions.

**Intérêt :** tester le nouveau modèle sur des données et des volumes réels, sans risque pour les utilisateurs. C'est une étape courante avant un déploiement canary ou un test A/B.

**Limites :**
- Le calcul est doublé, donc le coût aussi.
- Les utilisateurs ne voient pas les prédictions du nouveau modèle : leur réaction n'est pas mesurée. Pour cela, il faut un test A/B.
- Le modèle fantôme ne doit avoir aucun effet de bord (écritures en base, envoi de messages).
- La vérité terrain peut mettre du temps à arriver.`,
    category: "mlops",
    icon: "Eye"
  },
  {
    term: "Blue-Green Deployment",
    description: `Le déploiement blue-green maintient deux environnements de production identiques : l'un (bleu) sert le trafic actuel, l'autre (vert) reçoit la nouvelle version. Une fois la nouvelle version validée, on bascule le trafic de l'un vers l'autre.

**Déroulement :**
1. Déployer la nouvelle version dans l'environnement inactif (vert).
2. La tester sans trafic réel (tests de fumée, contrôles de santé).
3. Basculer le trafic, par le répartiteur de charge, le DNS ou le routage du cluster.
4. Surveiller, en gardant l'ancien environnement en attente.
5. Après un délai de sécurité, recycler l'ancien environnement.

**Avantages :**
- Mise en production sans interruption visible.
- Retour arrière rapide : il suffit de rebasculer vers l'ancien environnement.

**Limites :**
- Deux environnements à entretenir pendant la transition, donc des ressources doublées.
- Les bases de données et les migrations de schéma sont le point délicat : les deux versions doivent pouvoir travailler avec le même schéma.
- La bascule étant totale, un défaut de la nouvelle version touche tous les utilisateurs à la fois. Le déploiement canary limite ce risque en procédant par paliers.

**Pour un modèle :** deux déploiements du service de prédiction, l'ancien et le nouveau, avec un point d'entrée unique que l'on redirige de l'un vers l'autre.`,
    category: "mlops",
    icon: "RefreshCw"
  },
  {
    term: "Canary Deployment",
    description: `Le déploiement canary (ou canari) envoie la nouvelle version à une petite part du trafic, puis augmente cette part par paliers tant que les indicateurs restent bons. Le nom vient des canaris qu'emportaient les mineurs pour signaler un gaz dangereux : un petit groupe d'utilisateurs joue le rôle de signal d'alerte.

**Déroulement :**
1. Déployer la version canari à côté de la version stable.
2. Lui adresser une faible part du trafic (par exemple quelques pour cent).
3. Comparer ses indicateurs à ceux de la version stable : erreurs, latence, métriques du modèle, métriques métier.
4. Augmenter la part par paliers, ou revenir en arrière automatiquement si un seuil est franchi.

**Différences avec les autres approches :**
- Blue-green : bascule totale en une fois, alors que le canary est progressif.
- Test A/B : le canary vise à détecter une régression avant le déploiement général ; le test A/B mesure un effet sur le comportement des utilisateurs.

**Outils :** Argo Rollouts et Flagger sur Kubernetes, maillage de services comme Istio, feature flags.

**Limites :**
- Deux versions coexistent : elles doivent être compatibles (données, API).
- Il faut assez de trafic pour qu'un problème soit visible sur la petite part exposée.
- Le suivi des indicateurs doit être en place avant de commencer.`,
    category: "mlops",
    icon: "TrendingUp"
  },
  {
    term: "Data Lineage",
    description: `Le lignage des données (data lineage) retrace le parcours des données : d'où elles viennent, par quelles transformations elles sont passées et où elles sont utilisées.

**Niveaux :**
- Jeu de données ou table : quelle table alimente quelle autre.
- Colonne : comment une colonne est calculée à partir d'autres.
- Processus : quel traitement, quelle version du code, à quelle date.

**À quoi cela sert :**
- Analyse d'impact : que casse-t-on en modifiant cette colonne ou cette source ?
- Recherche de cause : d'où vient cette valeur aberrante dans un tableau de bord ou dans un jeu d'entraînement ?
- Audit et conformité : savoir où se trouvent les données personnelles (RGPD) et qui les utilise.
- Confiance : documenter l'origine des chiffres.

**Comment l'obtenir :** par collecte automatique de métadonnées (analyse des requêtes SQL, journaux des orchestrateurs) plutôt que par documentation manuelle, qui vieillit mal. OpenLineage est un standard ouvert pour échanger ces informations.

**Outils :** Apache Atlas, DataHub, OpenMetadata ; dbt génère un graphe de dépendances entre ses modèles.

**Limites :** le lignage reste incomplet pour les traitements faits hors des outils suivis (scripts isolés, tableurs), et sa maintenance a un coût.`,
    category: "mlops",
    icon: "GitBranch"
  },
  {
    term: "Data Quality Monitoring",
    description: `La surveillance de la qualité des données (data quality monitoring) contrôle de façon automatique et continue que les données respectent les attentes à chaque étape d'un pipeline : à l'entrée, après transformation, avant l'entraînement d'un modèle.

**Dimensions de la qualité :**
- Exactitude : les valeurs correspondent à la réalité.
- Complétude : peu de valeurs manquantes.
- Cohérence : pas de contradiction entre sources ou entre champs.
- Validité : formats, types et plages de valeurs respectés.
- Unicité : pas de doublons indésirables.
- Fraîcheur : données à jour.

**Exemples de contrôles :** le schéma est celui attendu ; la clé est unique ; le taux de valeurs manquantes reste sous un seuil ; l'âge est compris entre 0 et 120 ; le nombre de lignes du jour est proche de l'habituel ; la distribution d'une variable ne s'éloigne pas de l'historique.

**Quand une règle échoue :** alerter, bloquer le pipeline ou mettre les lignes en quarantaine, selon la gravité.

**Outils :** Great Expectations (règles appelées « attentes » et rapports de validation), Deequ (contrôles sur Spark), tests de dbt.

**Limites :**
- Les règles sont à maintenir ; trop strictes, elles déclenchent de fausses alertes.
- Elles ne détectent pas une valeur plausible mais fausse.`,
    category: "mlops",
    icon: "CheckCircle"
  },
  {
    term: "Model Registry",
    description: `Un registre de modèles (model registry) est un catalogue centralisé qui conserve les modèles entraînés et leurs versions, avec leurs métadonnées et leur étape dans le cycle de vie. Il fait le lien entre l'expérimentation et le déploiement.

**Contenu :**
- Le modèle sérialisé (pickle, ONNX, SavedModel...).
- Les métriques d'évaluation, les hyperparamètres, le lien vers l'essai d'entraînement et le commit.
- Les informations sur les données d'entraînement.
- La signature (forme des entrées et des sorties).
- Une documentation, par exemple une fiche de modèle (Mitchell et al., 2019).

**Cycle de vie :** chaque version porte un statut ou un alias, par exemple « en test », « pré-production », « production », « archivé ». Le passage d'une étape à l'autre peut exiger une validation (tests automatiques, relecture par une personne).

**À quoi cela sert :**
- Savoir quel modèle est en production et quel modèle l'a précédé.
- Retrouver comment un modèle a été produit.
- Contrôler qui peut promouvoir un modèle.
- Revenir à une version antérieure.

**Outils :** MLflow Model Registry, ainsi que les registres de modèles de SageMaker, d'Azure ML, de Vertex AI et de Weights & Biases.

**Limites :** un registre ne remplace ni la surveillance ni les tests ; il n'est utile que si l'enregistrement des modèles est systématique.`,
    category: "mlops",
    icon: "Database"
  },
  {
    term: "Experiment Tracking",
    description: `Le suivi d'expériences (experiment tracking) consiste à enregistrer, pour chaque essai d'entraînement, ce qui a été utilisé et ce qui a été obtenu, afin de comparer les essais et de pouvoir les reproduire.

**Ce que l'on enregistre :**
- Paramètres et hyperparamètres.
- Version du code (commit) et des données.
- Métriques, y compris leur évolution au fil des époques.
- Artefacts : modèle, graphiques, matrice de confusion.
- Environnement : versions des bibliothèques, matériel, durée.

**Exemple avec MLflow :** les valeurs sont données à titre d'illustration.

\`\`\`python
import mlflow

with mlflow.start_run():
    mlflow.log_param("learning_rate", 0.01)
    mlflow.log_metric("accuracy", 0.95)
    mlflow.log_artifact("model.pkl")
\`\`\`

**À quoi cela sert :** comparer des dizaines d'essais, retrouver quels paramètres ont donné le meilleur résultat, reproduire un résultat plusieurs semaines plus tard.

**Outils :** MLflow Tracking, Weights & Biases, TensorBoard, Comet, Sacred.

**Bonnes pratiques :**
- Donner aux essais des noms explicites et les regrouper par projet.
- Comparer les essais sur le même jeu de validation.
- Fixer les graines aléatoires.
- Ne pas choisir le modèle final d'après le jeu de test : à force de comparer, le jeu de validation finit lui aussi par être sur-ajusté.`,
    category: "mlops",
    icon: "BarChart3"
  },
  {
    term: "Infrastructure as Code (IaC)",
    description: `L'infrastructure as code (IaC) consiste à décrire l'infrastructure (serveurs, réseaux, bases de données, clusters, droits d'accès) dans des fichiers texte versionnés, qu'un outil applique automatiquement, plutôt que de la configurer à la main.

**Principe :**
- Approche déclarative : on décrit l'état souhaité, l'outil calcule les changements à appliquer.
- Les fichiers vivent dans Git : revue de code, historique, retour à une version antérieure.
- Le même code recrée l'environnement à l'identique, par exemple pour un test.

**Outils :** Terraform, Pulumi et AWS CloudFormation pour créer les ressources ; Ansible pour configurer les machines.

**Intérêt pour le ML :** recréer un environnement d'entraînement ou de service à l'identique, faire relire un changement d'infrastructure comme du code, détruire un environnement de test quand il n'est plus utile (ce qui limite les coûts).

**Exemple :** un fichier Terraform décrit un espace de stockage pour les jeux de données et un cluster Kubernetes ; la commande d'application crée ou met à jour ces ressources pour qu'elles correspondent au fichier.

**Limites :**
- L'état connu de l'infrastructure (le fichier d'état de Terraform) doit être protégé et partagé avec soin.
- Une modification manuelle dans la console crée un écart avec le code.
- Les secrets (mots de passe, clés) ne doivent pas être écrits en clair dans le dépôt.`,
    category: "mlops",
    icon: "Wrench"
  },
  {
    term: "Edge Computing",
    description: `L'edge computing consiste à exécuter les calculs au plus près de la source des données (téléphone, caméra, capteur, véhicule, passerelle locale) plutôt que dans un centre de données distant. En ML, il s'agit surtout de faire tourner l'inférence d'un modèle sur l'appareil.

**Intérêts :**
- Latence faible : pas d'aller-retour réseau.
- Fonctionnement hors connexion.
- Moins de données transférées.
- Confidentialité : les données brutes restent sur l'appareil.

**Contraintes :**
- Mémoire, puissance de calcul et énergie limitées : on compresse le modèle (quantification, élagage, distillation).
- Appareils hétérogènes, à mettre à jour en grand nombre.
- Surveillance plus difficile qu'avec un serveur central.
- Sécurité physique des appareils.

**Exemples :** détection d'un mot-clé de réveil sur un téléphone, contrôle visuel de pièces par une caméra en usine.

**Outils :** TensorFlow Lite, ONNX Runtime et Core ML permettent d'exécuter des modèles sur appareil.

**Limites :** l'entraînement lourd reste en général sur serveur ; sur l'appareil, on fait surtout de l'inférence, parfois un ajustement léger.`,
    category: "mlops",
    icon: "Cpu"
  },
  {
    term: "Model Compression",
    description: `La compression de modèle regroupe les techniques qui réduisent la taille mémoire, le temps de calcul ou la consommation d'énergie d'un modèle, en limitant la perte de précision. Elle sert à déployer sur des ressources restreintes (téléphone, capteur, serveur peu coûteux).

**Techniques principales :**
- Quantification : stocker les poids (et parfois les activations) avec moins de bits, par exemple des entiers sur 8 bits au lieu de nombres flottants sur 32 bits, soit environ quatre fois moins de mémoire pour les poids.
- Élagage (pruning) : supprimer les poids ou les neurones qui contribuent peu.
- Distillation : entraîner un petit modèle « élève » à reproduire les sorties d'un grand modèle « enseignant » (Hinton et al., 2015).
- Factorisation : approcher de grandes matrices de poids par des matrices plus petites.
- Architectures compactes, conçues dès le départ pour être légères (MobileNet, par exemple).

**Exemple :** un classifieur d'images quantifié en 8 bits tourne plus vite et occupe moins de mémoire sur un téléphone, au prix d'une précision parfois un peu plus faible.

**En pratique :** mesurer la précision, la latence et la mémoire avant et après, sur le matériel visé.

**Limites :**
- La perte de précision varie selon le modèle et la tâche ; un réentraînement ou un ajustement peut être nécessaire.
- Le gain dépend du matériel : un élagage non structuré ne rend pas toujours le calcul plus rapide.`,
    category: "mlops",
    icon: "TrendingDown"
  },
  {
    term: "Federated Learning",
    description: `L'apprentissage fédéré entraîne un modèle de façon collaborative à partir de données qui restent chez leurs détenteurs (téléphones, hôpitaux, banques). Chaque participant entraîne le modèle localement ; seules les mises à jour du modèle sont envoyées à un serveur, qui les agrège.

**Cycle de base (algorithme FedAvg, McMahan et al., 2017) :**
1. Le serveur envoie le modèle courant à un ensemble de participants.
2. Chacun l'entraîne quelques étapes sur ses propres données.
3. Les participants renvoient leurs paramètres mis à jour.
4. Le serveur calcule une moyenne pondérée et obtient un nouveau modèle.
5. On recommence.

**Intérêt :** éviter de centraliser des données sensibles ou volumineuses, ce qui facilite le respect de contraintes de confidentialité.

**Exemple :** améliorer la prédiction de texte d'un clavier à partir de la frappe sur les téléphones, ou entraîner un modèle de diagnostic avec les données de plusieurs hôpitaux qui ne peuvent pas les partager.

**Limites :**
- Les mises à jour peuvent elles-mêmes révéler des informations sur les données : on les protège par agrégation sécurisée ou confidentialité différentielle.
- Les données de chaque participant n'ont pas la même distribution, ce qui ralentit la convergence et peut dégrader le modèle.
- Les échanges répétés coûtent cher en communication, et les participants ne sont pas toujours disponibles.

**Outils :** Flower, TensorFlow Federated.`,
    category: "mlops",
    icon: "Network"
  },
  {
    term: "Data Mesh",
    description: `Le data mesh est une approche d'organisation des données à l'échelle d'une entreprise, proposée par Zhamak Dehghani en 2019. Au lieu de confier toutes les données à une équipe centrale, chaque domaine métier (commandes, marketing, logistique...) produit et publie ses données comme un produit.

**Quatre principes :**
- Propriété par domaine : l'équipe qui connaît les données en est responsable.
- Données comme produit : chaque jeu de données publié est documenté, facile à trouver, de qualité surveillée, avec un propriétaire identifié.
- Plateforme en libre-service : une équipe de plateforme fournit les outils communs (stockage, calcul, catalogue, surveillance) pour que les domaines soient autonomes.
- Gouvernance fédérée : des règles communes (sécurité, formats, identifiants) décidées ensemble et appliquées autant que possible automatiquement.

**Problème visé :** l'équipe de données centrale devient un goulot d'étranglement quand le nombre de sources et de demandes augmente.

**Exemple :** l'équipe « commandes » publie une table documentée des commandes validées, avec une fraîcheur et une qualité annoncées ; l'équipe marketing la consomme sans passer par l'équipe centrale.

**Limites :**
- C'est d'abord un changement d'organisation, pas un produit à acheter.
- Il suppose des compétences en données dans chaque domaine.
- Sans gouvernance commune, on risque des silos incompatibles.
- Il convient peu à une petite structure dotée d'une seule équipe de données.

**Voir aussi :** « Data Lake vs Data Warehouse » et « Data Governance ».`,
    category: "mlops",
    icon: "Network"
  },
  {
    term: "ETL/ELT (Extract, Transform, Load)",
    description: `ETL et ELT sont deux façons d'organiser le passage des données de leurs sources vers un entrepôt ou un lac de données.

**ETL (Extract, Transform, Load) :**
- On extrait les données des sources.
- On les transforme (nettoyage, jointures, agrégats) sur un serveur de traitement intermédiaire.
- On charge le résultat dans la destination.

**ELT (Extract, Load, Transform) :**
- On extrait, puis on charge d'abord les données brutes dans l'entrepôt ou le lac.
- On les transforme ensuite sur place, souvent en SQL.

**Comparaison :**
- ETL : la destination ne reçoit que des données déjà propres, ce qui aide à filtrer ou anonymiser avant le stockage.
- ELT : les données brutes sont conservées, on peut retransformer plus tard sans tout réextraire, et l'on profite de la puissance de calcul des entrepôts modernes. Les données brutes demandent en revanche une gouvernance, car elles peuvent contenir des données personnelles.

**Exemple :** une table de ventes est copiée telle quelle dans l'entrepôt (extraction et chargement), puis des requêtes SQL planifiées construisent les tables d'analyse (transformation).

**Outils :** Airflow pour orchestrer, dbt pour la partie transformation d'un ELT, Spark pour les gros volumes.

**En pratique :** le choix dépend du volume, de la destination et des contraintes de confidentialité ; de nombreux systèmes mélangent les deux.`,
    category: "mlops",
    icon: "Shuffle"
  },
  {
    term: "Data Lake vs Data Warehouse",
    description: `Un entrepôt de données (data warehouse) stocke des données structurées et modélisées, optimisées pour l'analyse en SQL ; un lac de données (data lake) stocke à moindre coût des données brutes de tout format.

**Entrepôt de données :**
- Schéma défini à l'écriture (schema-on-write) : on structure avant de charger.
- Tables relationnelles, souvent organisées en schéma en étoile (tables de faits et de dimensions).
- Données nettoyées, adaptées au reporting et à la BI.
- Exemples : BigQuery, Snowflake, Amazon Redshift.

**Lac de données :**
- Schéma appliqué à la lecture (schema-on-read).
- Fichiers dans leur format d'origine (CSV, JSON, Parquet, journaux, images, audio) sur du stockage objet.
- Flexible, adapté à l'exploration et au machine learning.
- Risque : sans catalogue ni gouvernance, il devient un « marécage de données » (data swamp) où l'on ne retrouve plus rien.

**Choisir :** pour des rapports fiables et récurrents, plutôt un entrepôt ; pour l'exploration, les données non structurées et l'entraînement de modèles, plutôt un lac. Beaucoup d'organisations utilisent les deux.

**Lakehouse :** architecture qui ajoute aux fichiers du lac des fonctions d'entrepôt (transactions ACID, schéma, versions) grâce à des formats de tables comme Delta Lake, Apache Iceberg ou Apache Hudi.`,
    category: "mlops",
    icon: "Database"
  },
  {
    term: "Stream Processing",
    description: `Le traitement de flux (stream processing) analyse les données au fil de leur arrivée, événement par événement ou par petits groupes, plutôt que de les accumuler pour un traitement par lots.

**Notions clés :**
- Événement : un fait horodaté (un clic, un paiement, une mesure de capteur).
- Fenêtres : regroupement des événements sur une durée (fenêtre fixe, glissante, de session).
- Temps d'événement et temps de traitement : les événements peuvent arriver en retard ou dans le désordre.
- État : valeurs conservées entre deux événements (un compteur, une moyenne mobile).
- Garanties de livraison : au moins une fois, exactement une fois.

**Exemple :** signaler une fraude potentielle en comptant, en quelques secondes, les paiements d'une même carte sur les dix dernières minutes.

**Outils :** Apache Kafka (transport et stockage d'événements), Apache Flink, Spark Structured Streaming, Kafka Streams.

**Usages en ML :** calcul de variables en temps réel, inférence en ligne, détection d'anomalies, surveillance.

**Limites :**
- Plus complexe qu'un traitement par lots : ordre des événements, doublons, état à sauvegarder, reprise après panne.
- Coût d'exploitation plus élevé.
- Souvent inutile quand une fraîcheur d'un jour suffit.`,
    category: "mlops",
    icon: "Zap"
  },
  {
    term: "Batch Processing",
    description: `Le traitement par lots (batch processing) exécute un traitement sur un grand volume de données accumulées, à intervalles planifiés (toutes les heures, chaque nuit) ou lorsqu'un volume est atteint.

**Caractéristiques :**
- Latence de minutes à heures acceptée.
- Débit élevé : les données sont découpées en partitions traitées en parallèle sur plusieurs machines.
- Reprise simple : en cas d'échec, on relance le lot.
- Résultats reproductibles sur des données figées.

**Exemple :** chaque nuit, calculer les agrégats de ventes de la veille et recalculer le score de tous les clients.

**Outils :** Apache Spark, Hadoop MapReduce (historique), SQL dans un entrepôt de données ; Airflow ou cron pour la planification.

**Architectures associées :**
- ETL et ELT sont généralement exécutés par lots.
- L'architecture lambda combine une couche par lots (calcul complet, précis) et une couche de flux (résultats récents), au prix d'une double logique à maintenir.

**Lot ou flux ?** Le lot convient quand une fraîcheur d'un jour ou d'une heure suffit ; le flux, quand une décision doit suivre l'événement de quelques secondes.

**Limites :**
- Les résultats sont périmés entre deux exécutions.
- La durée du lot croît avec le volume et peut dépasser la fenêtre disponible.
- Une erreur dans un lot nocturne n'est parfois détectée que le lendemain, d'où l'intérêt des contrôles de qualité.`,
    category: "mlops",
    icon: "Database"
  },
  {
    term: "Data Governance",
    description: `La gouvernance des données est l'ensemble des règles, des rôles et des processus qui encadrent la collecte, la qualité, l'accès, la sécurité, la conservation et l'usage des données d'une organisation.

**Éléments principaux :**
- Politiques : classification des données (publiques, internes, confidentielles), règles d'accès, durées de conservation.
- Rôles : propriétaire d'un jeu de données (responsable de son usage), data steward (responsable de sa qualité et de sa documentation), délégué à la protection des données.
- Catalogue et glossaire métier : où sont les données et ce que signifie chaque champ.
- Qualité et lignage : contrôles et traçabilité.
- Sécurité : droits d'accès, chiffrement, journaux.

**Cadre réglementaire :** en Europe, le RGPD impose notamment une base légale pour traiter des données personnelles, la minimisation des données, une durée de conservation limitée et des droits pour les personnes concernées (accès, rectification, effacement).

**Pour le machine learning :** documenter chaque jeu de données (origine, contenu, usages prévus et déconseillés), par exemple avec des fiches de données (Gebru et al., 2021), et savoir qui peut utiliser quelles données pour entraîner quel modèle.

**Limites :** une gouvernance trop lourde freine le travail, et sans rôles clairement attribués elle reste théorique. Elle doit rester proportionnée à la taille de l'organisation.`,
    category: "mlops",
    icon: "Shield"
  },
  {
    term: "Privacy-Preserving ML",
    description: `Le machine learning préservant la confidentialité regroupe les techniques qui limitent l'exposition des données personnelles pendant l'entraînement ou l'utilisation d'un modèle.

**Techniques principales :**
- Confidentialité différentielle : ajout de bruit calibré, de sorte que la présence ou l'absence d'une personne dans les données change peu le résultat (Dwork et al., 2006). Elle offre une garantie mathématique mesurée par un paramètre, ε.
- Apprentissage fédéré : les données restent chez leurs détenteurs, seules les mises à jour du modèle circulent.
- Calcul multipartite sécurisé : plusieurs parties calculent un résultat commun sans révéler leurs données respectives.
- Chiffrement homomorphe : calculs directement sur des données chiffrées, au prix d'un coût de calcul élevé.
- Environnements d'exécution de confiance : zones matérielles isolées.

**Compromis :** plus la protection est forte (plus de bruit), moins le modèle est précis. Le bon niveau dépend du risque et de l'usage.

**Précautions :**
- Supprimer le nom des personnes (pseudonymisation) ne suffit pas toujours : le recoupement d'autres champs peut permettre de les réidentifier.
- Un modèle peut mémoriser des exemples d'entraînement, ce qui permet certaines attaques (inférence d'appartenance).

**Limites :** ces techniques ajoutent de la complexité et du coût de calcul, et se combinent souvent (par exemple apprentissage fédéré avec confidentialité différentielle).`,
    category: "mlops",
    icon: "Shield"
  },
  {
    term: "Model Interpretability in Production",
    description: `L'interprétabilité en production consiste à garder la possibilité de comprendre et de justifier les prédictions d'un modèle une fois déployé, pour les utilisateurs, les équipes qui l'exploitent et les autorités qui le contrôlent.

**Pourquoi :**
- Confiance : comprendre pourquoi une décision est prise.
- Débogage : repérer une variable qui joue un rôle inattendu.
- Conformité : certains cadres réglementaires, comme le RGPD pour les décisions automatisées, ou des secteurs régulés (crédit, santé), peuvent exiger de pouvoir expliquer une décision.

**Approches :**
- Modèles intrinsèquement lisibles : régression, arbre de décision peu profond.
- Méthodes appliquées après coup : importance par permutation, SHAP (valeurs de Shapley ; Lundberg et Lee, 2017), LIME (Ribeiro et al., 2016), dépendance partielle.
- Explications locales (une prédiction) ou globales (le modèle dans son ensemble).

**En production :**
- Enregistrer l'explication avec la prédiction et la version du modèle.
- Suivre la stabilité des explications au cours du temps (importance des variables) : un changement peut signaler une dérive.
- Maîtriser le coût de calcul : SHAP peut être lent, on peut précalculer ou échantillonner.

**Limites :** une explication est une approximation du comportement du modèle, pas une cause dans le monde réel. Elle peut être instable ou trompeuse quand les variables sont fortement corrélées.`,
    category: "mlops",
    icon: "Eye"
  },
  {
    term: "Automated Machine Learning (AutoML)",
    description: `Le machine learning automatisé (AutoML) automatise tout ou partie de la chaîne de modélisation : prétraitement, création et sélection de variables, choix de l'algorithme, réglage des hyperparamètres et évaluation.

**Principe :** l'outil explore automatiquement un espace de pipelines et de modèles, et retient ceux qui obtiennent la meilleure métrique en validation croisée.

**Techniques :**
- Recherche aléatoire ou sur grille, optimisation bayésienne, algorithmes évolutionnaires.
- Méta-apprentissage : démarrer par les configurations qui ont bien fonctionné sur des jeux de données voisins.
- Arrêt précoce des essais peu prometteurs.
- Combinaison de plusieurs modèles (ensembles, empilement).
- Recherche d'architecture neuronale (NAS) pour les réseaux de neurones.

**Outils :** Auto-sklearn, TPOT, H2O AutoML, AutoGluon, et les services d'AutoML des plateformes cloud (Vertex AI, Azure ML, SageMaker Autopilot).

**Atouts :**
- Une première référence (baseline) solide obtenue rapidement.
- Un réglage répétitif automatisé.
- Un outil accessible à des personnes moins expertes.

**Limites :**
- Il ne remplace pas la compréhension du problème : définition de la cible, choix de la métrique, qualité des données et fuites de données restent à la charge de l'analyste.
- Le modèle obtenu peut être un empilement difficile à interpréter.
- Le coût de calcul peut être élevé, et à force de chercher on peut sur-ajuster le jeu de validation.

**En pratique :** s'en servir comme point de départ et comme comparaison, puis évaluer le modèle retenu sur un jeu de test jamais utilisé pendant la recherche.`,
    category: "mlops",
    icon: "Zap",
    synonyms: ["AutoML"]
  }
];