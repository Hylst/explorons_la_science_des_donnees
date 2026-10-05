# Registre des sources des chiffres externes

Ce document recense les chiffres du site qui décrivent le monde réel (enquêtes, registres de paquets, salaires, prix, statistiques de marché), leur origine, la date de consultation et le niveau de vérification. Il complète la ligne « Source : ... , consulté le ... » affichée sous chaque chiffre par le composant `SourceNote` (`src/components/ui/source-note.tsx`).

Date de consultation de toutes les sources : **1er octobre 2026**.

## Niveaux de vérification

| Niveau | Sens |
|---|---|
| page lue | La source primaire a été ouverte et la valeur lue à la source (page web, API, PDF). |
| extrait de recherche | La valeur a été obtenue par un moteur de recherche ou par un relais (article de presse, miroir) et n'a pas été relue à la source. |
| non vérifié | Aucune source consultée ou source inaccessible : la valeur est donnée telle quelle et signalée comme telle. |

Les niveaux des sections 1, 2 et 7 reprennent les rapports de recherche R1 (programmation, langages, frameworks) et R2 (statistiques de pratique) du 1er octobre 2026. Ceux de la section 8 viennent des notes de recherche R3-a (salaires) de la même date. Pour les sections 3 à 6, 9 et 10, le niveau est précisé ligne par ligne, avec la façon dont il a été établi.

## Lecture rapide : où sont les `SourceNote`

| Fichier | Page du site | Contenu sourcé |
|---|---|---|
| `src/components/tools/sections/ProgrammingTools.tsx` | `/tools/programming` | Usage des langages (Stack Overflow 2021 à 2025), taille des registres de paquets |
| `src/components/tools/sections/MLFrameworks.tsx` | `/tools/ml-frameworks` | Popularité des frameworks (Stack Overflow 2024) |
| `src/components/fundamentals/programming/LanguageComparison.tsx` | `/fundamentals/programming` | Usage des langages (Stack Overflow 2021 à 2025) |
| `src/components/fundamentals/programming/ProgrammingIntro.tsx` | `/fundamentals/programming` | Usage chez les praticiens (Anaconda), PyPy, PyPI |
| `src/components/fundamentals/data-preparation/IntroductionSection.tsx` | `/fundamentals/data-preparation` | Part du temps consacrée à la préparation des données |
| `src/components/tools/sections/DataProcessingTools.tsx` | `/tools/data-processing` | Part du temps consacrée au chargement et au nettoyage (Anaconda 2020 et 2022, mêmes sources que ci-dessus) |
| `src/components/introduction/sections/HistorySection.tsx` | `/introduction` | Repères datés : TensorFlow publié en open source (9 novembre 2015, blog Google), GPT-3 : Brown et al., « Language Models are Few-Shot Learners », arXiv 2005.14165 (175 milliards de paramètres) ; sources connues, non rouvertes lors de cette passe |
| `src/pages/fundamentals/databases/components/DatabasesIntroSection.tsx` | `/fundamentals/databases` | Volumes de données et impact business |
| `src/components/introduction/sections/CareersSection.tsx` | `/introduction` | Fourchettes de salaires Apec |

---

## 1. Taille des registres de paquets

- **Où** : `/tools/programming`, carte « Taille des registres de paquets » (`ProgrammingTools.tsx`, constante `packageEcosystemData`, graphique en barres à échelle logarithmique).
- **Source du rapport** : R1-e.
- **Ce que mesure chaque valeur** : les unités diffèrent d'un registre à l'autre (projets, paquets, projets indexés). Le graphique compare des volumes, pas la qualité des paquets, et la page le dit sous le graphique.

| Langage (registre) | Valeur affichée | Source et URL | Niveau |
|---|---|---|---|
| Python (PyPI) | 905 050 projets | PyPI, page d'accueil (« 905,050 projects », en-tête serveur du 1er octobre 2026, 07:33 GMT) : https://pypi.org/ . Recoupement par l'index « Simple » (API JSON PEP 691) : 903 239 noms de projets, soit 0,2 % d'écart (cache de la page d'accueil ou définition légèrement différente, non vérifié) : https://pypi.org/simple/ | page lue |
| R (CRAN) | 25 284 paquets | CRAN, page des paquets disponibles (« features 25284 available packages ») : https://cran.r-project.org/web/packages/ . Recoupement par le fichier PACKAGES (25 284 noms uniques, 25 299 lignes « Package: ») : https://cran.r-project.org/src/contrib/PACKAGES | page lue |
| Julia (General) | 14 438 paquets, dont 1 849 « _jll » (enveloppes binaires générées automatiquement) et 12 589 hors JLL | Entrées de la section `[packages]` de `Registry.toml`, registre JuliaRegistries/General (dernier commit lu : 1er octobre 2026, 07:33 UTC) : https://raw.githubusercontent.com/JuliaRegistries/General/master/Registry.toml (lien affiché par le site : https://github.com/JuliaRegistries/General) | page lue |
| JavaScript (npm) | 4 443 317 paquets | `doc_count` de la base de réplication du registre npm (un document par paquet ; relevé de 4 443 339 quatre minutes plus tard) : https://replicate.npmjs.com/ . Le champ est décrit dans la documentation de l'API : https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md | page lue (fiabilité moyenne : voir la remarque) |
| Scala (Scaladex) | 9 450 projets (et 2 537 903 artefacts indexés) | Scaladex (« Search within 9450 projects and 2537903 artifacts ») : https://index.scala-lang.org/ | page lue (fiabilité moyenne : voir la remarque) |

Remarques tirées de R1-e :

- **npm** : il n'existe plus de page npmjs.com affichant le total. Le seul compteur lisible directement sur l'infrastructure npm est le `doc_count` de `replicate.npmjs.com` ; il inclut des paquets minuscules, de test ou de spam. Les autres chiffres diffèrent par la méthode : libraries.io affiche « Total Packages: 6,150,109 » (son propre index, qui conserve des paquets retirés ; https://libraries.io/npm ), Wikipédia dit « over 3.1 million » sans date exploitable.
- **Scala** : Maven Central n'est pas propre à Scala et ne se filtre pas proprement par langage ; Scaladex, qui indexe les projets Scala open source (un projet est un dépôt publié en plusieurs artefacts), en est un sous-ensemble. Le chiffre n'est pas le total de l'écosystème Scala.
- **Julia** : le chiffre affiché inclut les 1 849 paquets JLL. Repère historique : 5 166 paquets au 7 janvier 2021, sans compter plus de 700 JLL (https://julialang.org/blog/2021/08/general-survey/ ).
- **PyPI** : « projet » désigne un nom de distribution publié sur PyPI, tous domaines confondus (projets expérimentaux ou abandonnés compris). La page `pypi.org/stats` ne donne pas le nombre de projets.
- Les deux anciennes séries « Qualité moyenne (0-100) » et « Activité communautaire (0-100) » ont été supprimées : aucune des sources citées ne les publie, les valeurs étaient inventées (R1-e).

## 2. PyPI et son rythme de croissance (cours de programmation)

- **Où** : `/fundamentals/programming`, bloc « Écosystème en croissance » de `ProgrammingIntro.tsx`.
- **Source du rapport** : R1-c.
- **Valeur affichée** : « plus de 900 000 projets (905 050 au 1er octobre 2026), dont plus de 130 000 créés en 2025, tous domaines confondus ».

| Valeur | Source et URL | Niveau |
|---|---|---|
| 905 050 projets (aussi 9 747 012 versions, 21 677 907 fichiers et 1 120 750 utilisateurs sur la même page) | PyPI, page d'accueil : https://pypi.org/ . Recoupé par l'index Simple (903 239 noms) : https://pypi.org/simple/ | page lue |
| Plus de 130 000 nouveaux projets créés en 2025 | « PyPI in 2025: A Year in Review », blog officiel de PyPI (« More than 130,000 new projects created ») : https://blog.pypi.org/posts/2025-12-31-pypi-2025-in-review/ | page lue |

- La ligne « Source » affichée par le site renvoie à `https://pypi.org/` ; le chiffre de 130 000 provient du billet de blog ci-dessus.
- Repère secondaire : 614 339 paquets au 13 mars 2025 (Wikipédia, https://en.wikipedia.org/wiki/Python_Package_Index ).
- Le jalon historique « 400 000 » n'est pas daté par une source primaire (l'API Wayback Machine répondait 429 lors de la recherche) : le site n'affiche aucune date de franchissement. L'ancienne phrase « avec des ajouts quotidiens dans l'IA, la blockchain, et l'IoT » a été supprimée faute de source.
- Le chiffre évolue vite : la page affiche un arrondi (« plus de 900 000 ») accompagné de la valeur exacte datée.

## 3. Usage des langages (Stack Overflow Developer Survey, 2021 à 2025)

- **Où** : `/tools/programming` (carte « Usage des langages, de 2021 à 2025 », `ProgrammingTools.tsx`, constante `languageUsageData`) et `/fundamentals/programming` (onglet de vue d'ensemble de `LanguageComparison.tsx`, constante `trendData`). Mêmes valeurs aux deux endroits.
- **Ce que mesurent les valeurs** : part de **tous** les répondants de l'enquête qui déclarent utiliser le langage (développeurs en général, pas seulement les data scientists). Le site le dit sous le graphique.
- **Source de chaque année** : 2021 https://survey.stackoverflow.co/2021/ ; 2022 https://survey.stackoverflow.co/2022/ ; 2023 https://survey.stackoverflow.co/2023/ ; 2024 https://survey.stackoverflow.co/2024/technology ; 2025 https://survey.stackoverflow.co/2025/technology .

| Année | Python | SQL | R | Julia |
|---|---|---|---|---|
| 2021 | 48,24 % | 47,08 % | 5,07 % | 1,29 % |
| 2022 | 48,07 % | 49,43 % | 4,66 % | 1,53 % |
| 2023 | 49,28 % | 48,66 % | 4,23 % | 1,15 % |
| 2024 | 51 % | 51 % | 4,3 % | 1,1 % |
| 2025 | 57,9 % | 58,6 % | 4,9 % | absent de la liste |

- **Niveau : page lue.** Ces valeurs ne figurent pas dans les rapports R1 et R2. Elles ont été recontrôlées pour ce registre sur les copies locales des pages d'enquête relevées le 1er octobre 2026 : 2021 (texte de la page), 2022 et 2023 (données embarquées de la page), 2024 (graphiques), 2025 (graphique « All Respondents » : SQL 58,6 %, Python 57,9 %, R 4,9 %). L'attribution de chaque valeur à son langage n'a pas été revérifiée une à une pour 2022 à 2024.
- Julia ne figure pas dans la liste de 2025 ; le site laisse le point vide au lieu d'inventer une valeur.
- Le texte de `ProgrammingIntro.tsx` écrit « Python est utilisé par 57,9 % des répondants de Stack Overflow en 2025, 7 points de plus qu'un an plus tôt » : la page 2025 indique elle-même « a 7 percentage point increase from 2024 to 2025 ».

## 4. Usage chez les praticiens de la data (Anaconda, State of Data Science)

- **Où** : `/fundamentals/programming`, cartes de langage et paragraphe sur Python de `ProgrammingIntro.tsx` ; badge « % d'usage » et bandeau « Comment lire les notes de cette page » de `LanguageComparison.tsx`.
- **Définition** : part des praticiens qui utilisent le langage « souvent » ou « toujours » (Always + Frequently).

| Valeur affichée | Source et URL | Niveau |
|---|---|---|
| Python 63 %, SQL 35 %, R 27 %, Julia 11 % (enquête 2021, 3 104 réponses) | Anaconda, « State of Data Science 2021 », page « Popularity of Python » : https://know.anaconda.com/rs/387-XNW-688/images/Anaconda-2021-SODS-Report-Final.pdf | page lue (rapport PDF lu en R2-a ; les quatre pourcentages recontrôlés dans l'extraction locale : Python 34 % + 29 %, SQL 15 % + 20 %, R 10 % + 17 %, Julia 3 % + 8 %) |
| Python 75 % (enquête 2020, 1 592 réponses) | Anaconda, « State of Data Science 2020 » : https://know.anaconda.com/rs/387-XNW-688/images/Anaconda-SODS-Report-2020-Final.pdf | page lue (rapport PDF lu en R2-a ; l'extraction locale confirme n = 1 592, mais le 75 % lui-même n'a pas été retrouvé dans le texte extrait, dont la police est codée ; une recherche du 2 octobre 2026 retrouve la décomposition « 47 % toujours + 28 % souvent = 75 % » dans des synthèses du rapport, dont le communiqué Anaconda de juin 2020 relayé par Benzinga) |

- Cette mesure remplace l'ancien chiffre « 72 % des data scientists utilisent Python en 2024 », qui n'avait pas de source.
- R2-a décrit l'enquête 2020 : 2 360 répondants de plus de 100 pays, enquête du 12 février au 20 avril 2020. Pour 2021 : plus de 4 200 personnes de plus de 140 pays. Ce sont des enquêtes auto-sélectionnées (réseaux sociaux, bases d'e-mails de l'éditeur), pas des échantillons représentatifs.

## 5. PyPy plus rapide que CPython

- **Où** : `/fundamentals/programming`, bloc « Performance moderne » de `ProgrammingIntro.tsx`.
- **Valeur affichée** : « PyPy [...] est en moyenne environ 4 fois plus rapide que CPython 3.11 sur les tests de performance du projet. Le gain varie beaucoup selon le programme, et toutes les bibliothèques ne sont pas compatibles. »
- **Source** : page d'accueil de PyPy, « On average, PyPy 3.12 is about 4 times faster than CPython 3.11 » : https://pypy.org/ . L'ancienne affirmation « jusqu'à 7x » n'était pas sourcée et a été retirée.
- **Niveau : page lue.** Valeur absente de R1 et R2 ; recontrôlée sur la copie locale de la page d'accueil de PyPy.

## 6. Popularité des frameworks de machine learning (Stack Overflow 2024)

- **Où** : `/tools/ml-frameworks`, carte « Popularité des frameworks ML » (`MLFrameworks.tsx`, constante `frameworkData`).
- **Ce que mesure la valeur** : part des répondants de l'enquête 2024 (45 841 réponses, tous développeurs) qui utilisent la bibliothèque, section « Other frameworks and libraries ». XGBoost et LightGBM ne figurent pas dans cette enquête, ce que la page précise.
- **Source** : https://survey.stackoverflow.co/2024/technology

| Bibliothèque | Part des répondants |
|---|---|
| scikit-learn | 10,6 % |
| PyTorch | 10,6 % |
| TensorFlow | 10,1 % |
| Hugging Face | 4,5 % |
| Keras | 4,3 % |

- **Niveau : page lue.** Valeurs absentes de R1 et R2 ; les cinq pourcentages et l'effectif de 45 841 réponses ont été retrouvés dans la copie locale de la page, sans revérifier l'attribution de chaque valeur à sa bibliothèque.
- Le camembert voisin « Domaines d'application du ML » est **illustratif** (voir la section « Éléments éditoriaux ») ; ce n'est pas une statistique. L'ancien graphique citait Kaggle 2023 avec des valeurs fausses.

## 7. Part du temps consacrée à la préparation des données

- **Où** : `/fundamentals/data-preparation`, introduction (`IntroductionSection.tsx`) ; `/fundamentals`, section de traitement des données (`DataProcessingSection.tsx`, lignes 175 et 176) ; `src/components/ui/interactive-schema.tsx` (étape « Préparation des données » du schéma `MLWorkflowSchema`, composant qu'aucune page n'importe aujourd'hui).
- **Source du rapport** : R2-a (verdict initial : « statistique zombie », le « 80 % » n'a jamais été mesuré).
- **Texte affiché** : « 45 % du temps déclaré dans l'enquête Anaconda 2020 (chargement et nettoyage), 38 % dans celle de 2022. Les « 50 à 80 % » souvent cités viennent d'estimations d'experts rapportées par la presse en 2014, pas d'une mesure. »

| Valeur | Source et URL | Niveau |
|---|---|---|
| 45 % du temps pour le chargement (19 %) et le nettoyage (26 %) des données ; visualisation 21 %, sélection de modèle 11 %, entraînement et scoring 12 %, déploiement 11 % (n = 1 099 pour cette question ; 2 360 répondants au total) | Anaconda, « State of Data Science 2020 » (PDF) : https://know.anaconda.com/rs/387-XNW-688/images/Anaconda-SODS-Report-2020-Final.pdf . Communiqué du 30 juin 2020 (« on average 45% of their time is spent getting data ready ») : https://www.globenewswire.com/news-release/2020/06/30/2055578/0/en/Anaconda-Releases-2020-State-of-Data-Science-Survey-Results.html | page lue |
| 38 % du temps pour la préparation et le nettoyage (37,75 % ; contre 26,44 % pour sélection, entraînement et déploiement ; 3 493 répondants de 133 pays, du 25 avril au 14 mai 2022) | VentureBeat, 14 septembre 2022 (lien affiché par le site) : https://venturebeat.com/ai/what-are-data-scientists-biggest-concerns-the-2022-state-of-data-science-report-has-the-answers . Relais complémentaire : https://www.predictiveanalyticsworld.com/machinelearningtimes/state-of-data-science-2022/12789/ | extrait de recherche (relais de presse lus ; rapport Anaconda 2022 original non ouvert) |
| Estimation de presse de 2014 : les data scientists passent « de 50 % à 80 % » de leur temps à ce travail, d'après des entretiens et des estimations d'experts, sans enquête chiffrée | Steve Lohr, New York Times, août 2014, citation lue sur un miroir (lien affiché par le site) : https://thelivinglib.org/for-big-data-scientists-janitor-work-is-key-hurdle-to-insights/ | extrait de recherche (miroir ; original du NYT non ouvert) |

Origine du « 80 % » (R2-a), pour mémoire :

- L'enquête CrowdFlower de 2016 (« 2016 Data Science Report », environ 80 data scientists) donne 60 % pour le nettoyage et l'organisation des données et 19 % pour la collecte de jeux de données (page lue : https://www2.cs.uh.edu/~ceick/UDM/CFDS16.pdf ). Les 60 % sont la part des **répondants** pour qui le nettoyage est la tâche la plus longue (question à choix unique), **pas** 60 % du temps de travail. Le « 80 % » vient de l'addition 60 % + 19 % = 79 %, qui n'a pas de sens comme part de temps. Le rapport lui-même renvoie au New York Times.
- L'article de Forbes (Gil Press, 23 mars 2016) qui a popularisé le chiffre n'a pas pu être ouvert (HTTP 403) : ce qu'on en sait vient d'extraits de moteur de recherche (non vérifié).
- Autres repères lus dans R2-a, non affichés sur le site : Anaconda 2021, 39 % (préparation 22 % + nettoyage 17 %, plus de 4 200 personnes de plus de 140 pays, PDF lu) ; Kaggle 2018, environ 11 % + 15 % (via un blog, non lu à la source) ; CrowdFlower 2017, 53 % pour l'ensemble des tâches ingrates (n = 179, via TDWI) ; Leigh Dodds, 31 janvier 2020, qui juge la statistique « bullshit » (https://blog.ldodds.com/2020/01/31/do-data-scientists-spend-80-of-their-time-cleaning-data-turns-out-no/ ).
- Réserve générale : ce sont des déclarations d'enquêtes auto-sélectionnées, pas des mesures de temps de travail ; la formulation de la question change fortement le résultat.
- Les formulations « 80 % du travail », « 80 % du temps », « 70 % à 80 % », « 40-60 % », « 15-30 % des jeux de données », « 70 % des problèmes de qualité », « 80 % des erreurs », « 90 % des bases » ont été remplacées par des formulations sans chiffre ou par les valeurs ci-dessus. Pour « 40-60 % » (effet du nettoyage sur la précision des modèles), R2-b n'a trouvé aucune source (verdict : non vérifiable).

## 8. Fourchettes de salaires (Apec)

- **Où** : `/introduction`, rubrique « Perspectives salariales en Data Science (France) » de `CareersSection.tsx`.
- **Ce que mesurent les valeurs** : fourchette qui contient 80 % des offres d'emploi publiées par des entreprises, rémunération annuelle brute fixe et variable comprise. Ce sont des salaires **proposés**, non des salaires versés. Les fiches ne portent pas de date de mise à jour.

| Métier | Valeur affichée | Source et URL | Niveau |
|---|---|---|---|
| Data analyst | 33-53 k€, moyenne 43 k€ | Apec, fiche métier : https://www.apec.fr/tous-nos-metiers/informatique/data-analyst.html | page lue |
| Data scientist | 35-60 k€, moyenne 46 k€ | Apec, fiche métier : https://www.apec.fr/tous-nos-metiers/informatique/data-scientist.html | page lue |
| Data engineer | 35-60 k€, moyenne 47 k€ | Apec, fiche métier : https://www.apec.fr/tous-nos-metiers/informatique/data-engineer.html | page lue |

- **Source de la vérification** : notes de recherche R3-a du 1er octobre 2026 (pages ouvertes le jour même). Ces notes ne figurent pas dans R1 et R2.
- Autres relevés de R3-a, **non affichés** sur le site : Apec, « Les rémunérations des cadres dans 111 familles de métiers, édition 2025 » (décembre 2025), famille « Big Data » : cadres en poste, médiane 54 k€, premier décile 40 k€, neuvième décile 98 k€ ; grilles Michael Page 2026 et Hays 2026 ; percentiles Robert Half 2026. Ils ont servi de contrôle de cohérence uniquement.
- Les estimations par niveau d'expérience affichées sous ces fourchettes sont celles de l'auteur : voir « Éléments éditoriaux ».

## 9. Volumes de données et impact business

- **Où** : `/fundamentals/databases`, encadré « Le saviez-vous ? » de `DatabasesIntroSection.tsx` (une seule ligne `SourceNote` regroupe les sept sources).
- **Niveaux** : « page lue » signifie que la page a été ouverte le 1er octobre 2026 et la phrase retrouvée. Ces lignes ne figurent pas dans R1 et R2 : elles ont été recontrôlées pour ce registre quand la page s'ouvrait. Pour la ligne marquée « inventaire du commit », la vérification ne vient que du message du commit `f97eff0` (« Inventaire des affirmations chiffrées, vérifiées à la source le 2026-10-01 ») ; elle n'a pas pu être rejouée.

| Valeur affichée | Source et URL | Niveau |
|---|---|---|
| 149 zettaoctets de données créées, capturées, copiées et consommées en 2024, 181 prévus en 2025 | IDC, via Statista : https://www.statista.com/statistics/871513/worldwide-data-created/ | extrait de recherche : la page Statista citée masque les valeurs (accès payant) ; elle attribue la série à l'« IDC Global Datasphere Forecast » (relayée par Seagate, Ohio State University, Ciena et Western Digital). Une recherche du 2 octobre 2026 retrouve « 149 zettaoctets en 2024 » et « 181 en 2025 » sur plusieurs sites qui citent Statista, sans que la valeur soit lisible sur la page elle-même |
| Environ 9 octets sur 10 sont des copies de données déjà existantes | IDC, communiqué du 8 mai 2020 « IDC's Global DataSphere Forecast Shows Continued Steady Growth in the Creation and Consumption of Data » : https://www.businesswire.com/news/home/20200508005025/en/IDCs-Global-DataSphere-Forecast-Shows-Continued-Steady-Growth-in-the-Creation-and-Consumption-of-Data | page lue sur une reprise intégrale du communiqué (https://workflowotg.com/idcs-global-datasphere-forecast/, 2 octobre 2026) : « The ratio of unique data (created and captured) to replicated data (copied and consumed) is roughly 1:9 » et « By 2024, IDC expects this ratio to be 1:10 ». La page BusinessWire d'origine répond HTTP 403. Le site écrit « environ 9 sur 10 », fidèle au rapport de 2020 |
| Google traite plus de 5 000 milliards de recherches par an, soit environ 158 000 par seconde (début 2025) | Search Engine Land : https://searchengineland.com/google-5-trillion-searches-per-year-452928 | extrait de recherche |
| Facebook : plus de 300 pétaoctets dans l'entrepôt de données dès 2014, 600 téraoctets ajoutés par jour | Facebook Engineering, 10 avril 2014 : https://engineering.fb.com/2014/04/10/core-infra/scaling-the-facebook-data-warehouse-to-300-pb/ | page lue (« Our warehouse stores upwards of 300 PB of Hive data, with an incoming daily rate of about 600 TB ») |
| Enquête McKinsey auprès de 400 dirigeants (2014) : les utilisateurs intensifs de l'analyse client ont 23 fois plus de chances de nettement surpasser leurs concurrents pour attirer de nouveaux clients | McKinsey, « Five facts: How customer analytics boosts corporate performance » : https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/five-facts-how-customer-analytics-boosts-corporate-performance | page lue selon l'inventaire du commit f97eff0 ; la relecture de ce registre a échoué (page injoignable, délai dépassé) |
| Netflix estime que la personnalisation et les recommandations lui font économiser plus d'un milliard de dollars par an (2015) | Gomez-Uribe et Hunt, « The Netflix Recommender System: Algorithms, Business Value, and Innovation », ACM Transactions on Management Information Systems, vol. 6, n° 4, article 13, décembre 2015 : https://dl.acm.org/doi/10.1145/2843948 | page lue (PDF de l'article ; la phrase « save us more than $1B per year » est à la page 7) |
| 35 % des achats sur Amazon proviendraient de ses recommandations (McKinsey, 2013) | McKinsey, « How retailers can keep up with consumers » : https://www.mckinsey.com/industries/retail/our-insights/how-retailers-can-keep-up-with-consumers | extrait de recherche |
| IBM estimait en 2016 le coût annuel des mauvaises données à 3 100 milliards de dollars pour l'économie américaine | Redman, Harvard Business Review, 2016 : https://hbr.org/2016/09/bad-data-costs-the-u-s-3-trillion-per-year | extrait de recherche |

Autres chiffres sourcés dans le texte de pages, **sans** composant `SourceNote` :

| Où | Valeur affichée | Source citée dans le texte | Niveau |
|---|---|---|---|
| `src/components/tools/sections/DataProcessingTools.tsx` (`/tools/data-processing`) | Spark : « des gains pouvant atteindre 20 fois par rapport à Hadoop MapReduce pour des applications itératives » (remplace « jusqu'à 100 fois ») | Article fondateur de Spark, NSDI 2012 : https://www.usenix.org/system/files/conference/nsdi12/nsdi12-final138.pdf | page lue (résumé et section 6 de l'article : « Spark is up to 20 × faster than Hadoop for iterative applications ») |
| `src/components/fundamentals/programming/PythonMasterclass.tsx` (`/fundamentals/programming`) | « Votre cerveau peut identifier une image vue pendant 13 millisecondes seulement » (remplace « 60 000 fois plus rapidement que le texte », sans source) | Mary Potter, MIT, 2014 ; relais du MIT News du 16 janvier 2014 : https://news.mit.edu/2014/in-the-blink-of-an-eye-0116 | page lue (relais du MIT News : « as little as 13 milliseconds » ; l'étude originale n'a pas été ouverte) |

## 10. Plateformes et cours externes (aucun prix affiché)

### Plateformes d'apprentissage

- **Décision de l'auteur du 4 octobre 2026** : le site n'a aucun côté commercial. Aucun montant, aucun abonnement ni aucune offre n'est affiché. `/fundamentals/programming` (onglet « Plateformes ») ne garde que des ressources gratuites ou à partie gratuite (Kaggle Learn, fast.ai, MIT OpenCourseWare, Coursera avec renvoi vers la page de chaque cours). DataCamp, Udacity, edX MicroMasters, Pluralsight et le cours Udemy ont été retirés des listes ; les tarifs relevés le 1er octobre 2026 (DataCamp 31 €/mois, Coursera Plus 51 €/mois ou 346 €/an) ne sont plus utilisés.
- Les pastilles « Gratuit » ne subsistent que pour les contenus dont la gratuité est établie (livres en ligne libres, Kaggle Learn, fast.ai, MIT OpenCourseWare).

### Cours en ligne

- **Où** : `/resources`, rubrique « Cours en ligne » (`src/components/resources/CoursesSection.tsx`). Le composant n'a pas de `SourceNote` ; un commentaire du code indique « Informations relevées sur les pages officielles le 1er octobre 2026 ».

| Cours | Valeurs affichées | URL | Niveau |
|---|---|---|---|
| Machine Learning Specialization, cours 1 (Coursera, Andrew Ng) | 3 semaines à 10 h par semaine (environ 30 h) ; inscription gratuite, exercices notés et certificat en option. Remplace le cours de 11 semaines de 2011 | https://www.coursera.org/learn/machine-learning | page lue (« 3 weeks at 10 hours a week » ; inscription gratuite ; exercices notés et certificat en option ; le détail hebdomadaire de la page est de 7 h, 10 h puis 16 h, soit 33 h : « environ 30 h » est l'arrondi du rythme annoncé) |
| Deep Learning Specialization (DeepLearning.AI, aussi sur Coursera) | Environ 127 h au total, 5 h par semaine, soit 5 semaines par cours (4 pour le cours 3) ; conditions d'accès variables (aucun montant affiché) | https://www.deeplearning.ai/courses/deep-learning-specialization/ | page lue (« 127h29m », « 5 hours a week », cours 3 d'environ 4 semaines) |


---

## Éléments éditoriaux

Ces éléments sont des appréciations ou des estimations de l'auteur, **non issues d'une étude**. Le site les signale comme telles.

### Notes et appréciations comparatives

- **Comparaison des langages** (`LanguageComparison.tsx`, `/fundamentals/programming`) : les notes de 0 à 100 (facilité d'apprentissage, marché de l'emploi, performance, écosystème), les notes de 0 à 10 par cas d'usage (« Débutant complet », « Machine Learning », « Big Data », etc.) et les notes de 0 à 10 de vitesse, lisibilité, écosystème et apprentissage sont des appréciations de l'auteur, destinées à situer les langages les uns par rapport aux autres. Le bandeau « Comment lire les notes de cette page » le dit. Les graphiques étiquettent ces séries « (appréciation) ». Le seul chiffre mesuré de cette comparaison est l'usage fréquent chez les praticiens (Anaconda 2021, section 4) et l'usage chez les développeurs (Stack Overflow, section 3). Les libellés de tendance de marché (« Croissance forte », « Stable », « Essentiel », « Émergent ») sont également éditoriaux. Les salaires moyens par langage, qui n'avaient aucune source, ont été supprimés.
- **Notes sur 5 des algorithmes** (`src/components/ui/interactive-schema.tsx`, composant `AlgorithmComparison`, affiché sur `/machine-learning/unsupervised`) : la « Performance » de chaque algorithme est une échelle d'étoiles de 1 à 5, score éditorial et non une note d'utilisateurs.
- **Difficulté des projets** (`src/components/projects/ProjectGrid.tsx`, donnée `difficulty` de `src/data/projects.ts`) : note de 1 à 5 attribuée par l'auteur aux 10 projets.
- **Domaines d'application du ML** (`MLFrameworks.tsx`, `/tools/ml-frameworks`) : le camembert (vision par ordinateur 30, NLP 25, prédiction numérique 20, séries temporelles 12, recommandation 8, autres 5) est une répartition **illustrative**. Aucune enquête ne publie une telle ventilation ; les proportions servent seulement à montrer qu'il existe plusieurs grands domaines. Ne pas les citer comme des statistiques.

### Durées de cours « indicatif »

Les durées des cours du site sont des estimations éditoriales, à suivre à votre rythme. Elles sont suivies de « (indicatif) » et d'une infobulle « Durée indicative, à votre rythme » dans :

- `src/components/courses/CourseHeroTemplate.tsx` (badge de durée en tête de cours) ;
- `src/components/ui/unified-hero-section.tsx` (durée dans l'en-tête de page) ;
- `src/pages/courses/CoursesIndex.tsx` (catalogue `/courses`) ;
- `src/components/home/FeaturedCourses.tsx` (accueil) ;
- `src/components/fundamentals/math/MathLearningPaths.tsx` (parcours de mathématiques).

Là où aucun suffixe n'est affiché, le libellé est « Durée conseillée » (`src/components/resources/InitiationCoursesSection.tsx`, `src/pages/courses/MLModelsGuide.tsx`). Les durées de cours externes de la rubrique « Cours en ligne » sont, elles, relevées sur les pages des plateformes (section 10).

### Estimations de l'auteur par niveau (salaires)

`CareersSection.tsx`, rubrique « Estimations de l'auteur par niveau d'expérience » (`/introduction`), montants annuels bruts, « à titre indicatif et non issus d'une étude » :

| Bloc affiché | Poste | Estimation |
|---|---|---|
| Premier bloc (junior) | Data Analyst | 35-45 k€ |
| Premier bloc (junior) | Data Scientist | 45-60 k€ |
| Premier bloc (junior) | Data Engineer | 45-55 k€ |
| Premier bloc (junior) | ML Engineer | 50-65 k€ |
| Deuxième bloc (postes « Senior ») | Data Analyst Senior | 50-70 k€ |
| Deuxième bloc (postes « Senior ») | Data Scientist Senior | 65-85 k€ |
| Deuxième bloc (postes « Senior ») | Data Engineer Senior | 60-80 k€ |
| Deuxième bloc (postes « Senior ») | ML Engineer Senior | 70-90 k€ |
| Troisième bloc (direction) | Lead Data Scientist | 80-110 k€ |
| Troisième bloc (direction) | Head of Data | 90-130 k€ |
| Troisième bloc (direction) | Chief Data Officer | 120 k€ et plus |

Le site précise que ces montants varient selon la localisation, la taille de l'entreprise, le secteur et l'expérience. Ils ne proviennent d'aucune des sources de la section 8 et ne doivent pas être lus comme des chiffres sourcés.

### Prix indicatifs des livres

`ResourcesSection.tsx` affiche « ~40€ » (Hands-On Machine Learning) et « ~35€ » (SQL for Data Scientists) : ce sont des ordres de grandeur de l'auteur, non vérifiés auprès des éditeurs ni des libraires. Les livres « Gratuit en ligne » renvoient vers la version en ligne officielle de l'ouvrage.

---

## Limites

- **Instantané daté.** Tous les chiffres sont relevés le 1er octobre 2026 ; les registres de paquets, les prix et les parts d'usage évoluent. Les rafraîchir demande de refaire le relevé à la source (PyPI, CRAN, Julia, npm, Scaladex, enquêtes), pas de modifier un pourcentage.
- **Actualités de la communauté.** Le flux « Le Big Data » répond par une erreur 403 (protection Cloudflare) et n'a pas pu être contourné : `npm run news:refresh` l'ignore, et l'instantané `src/data/rss-articles.json` ne contient donc aucun article de cette source.
- **Éléments non vérifiés** :
  - les extraits McKinsey sur le commerce de détail (35 % des achats Amazon), l'article de Search Engine Land (5 000 milliards de recherches Google) et l'article de Harvard Business Review (3 100 milliards de dollars) : valeurs obtenues par la recherche, non relues à la source (niveau « extrait de recherche »). Lors de la rédaction de ce registre, la page de Search Engine Land a répondu HTTP 403, celle de McKinsey sur le commerce de détail n'a pas répondu (délai dépassé), et la lecture automatique de la page de HBR n'y a pas retrouvé la phrase sur IBM ni les 3 100 milliards (contenu partiel de la page) ;
  - les chiffres IDC de Statista (149 et 181 zettaoctets) : la page citée masque les valeurs derrière un accès payant (la proportion de copies, elle, est confirmée par le communiqué IDC de 2020) ;
  - la page McKinsey « Five facts » (400 dirigeants, 23 fois), qui n'a pas répondu lors de la relecture, et l'étude de Mary Potter (13 ms), lue seulement par le communiqué du MIT News ;
  - l'article de Forbes (Gil Press, 2016) sur le « 80 % », bloqué en HTTP 403, et l'original du New York Times de 2014, cité sur un miroir.
- **Relais, non sources.** Anaconda 2022 (38 %) est lu par l'intermédiaire de VentureBeat et de Machine Learning Times ; le rapport original n'a pas été ouvert.
- **Définitions qui diffèrent.** Les nombres de paquets comparent des unités différentes (projets, paquets, projets indexés). Le compteur npm vient de la base de réplication faute de page officielle de total ; Scaladex n'est qu'un sous-ensemble de Maven Central. Les enquêtes Stack Overflow et Anaconda sont auto-sélectionnées et ne représentent pas la population des data scientists, ni les développeurs en général.
- **Sources essayées sans succès** (recherche R3-a et R1-c) : Glassdoor France (HTTP 403), Robert Walters (HTTP 403), Talent.io (certificat invalide, dernière édition publique trouvée : 2023), Urban Linker (page JavaScript non lisible), API Wayback Machine (429). Aucune de ces sources ne sert de référence au site.
- **Chiffres non affichés.** Ce registre ne couvre pas les données du site qui sont propres à celui-ci (quiz, projets, progression, jeux de données d'exemple à graine fixe de `src/lib/sample-datasets.ts`) : elles sont calculées localement et ne sont pas des chiffres externes.
- **Liens corrigés le 3 octobre 2026 (relecture des redirections).** Udacity : retiré (voir section 10). Mode (tutoriel SQL) : l'adresse redirige (301) vers ThoughtSpot, qui l'héberge. edX MITx : l'adresse mène à une page générique des partenaires ; remplacée par MIT OpenCourseWare. Hastie, Tibshirani et Friedman : le livre est désormais à hastie.su.domains. Google : la page `ai.google/education/` est devenue `ai.google/learn-ai-skills/` (parcours gratuits et payants) ; le cours interactif sur le machine learning est le Machine Learning Crash Course (developers.google.com/machine-learning/crash-course). Gitter (python/community) : adresse non vérifiable, carte retirée. Paquets Jupyter : `jupyter_contrib_nbextensions` (dernière version : novembre 2022) et `jupyterthemes` (2018) ne concernent que l'interface classique.
