/**
 * Contenu HTML des articles du blog, par identifiant d'article.
 * Séparé des métadonnées (src/data/blog-posts.json) : les pages qui ne font que
 * lister les articles (accueil, communauté) n'ont pas à charger ce contenu.
 */
export const blogContents: Record<string, string> = {
  "data-science-jobs": `

        <p>Derrière l'expression « data science » se cachent plusieurs métiers, dont les intitulés varient d'une organisation à l'autre. Un même poste peut s'appeler « data analyst » chez l'un et « analytics engineer » chez l'autre. Ce guide décrit les rôles les plus courants, ce qu'ils font en pratique et les compétences qu'ils demandent. Il s'agit d'une synthèse pédagogique : les intitulés et les périmètres changent, et seules les offres d'emploi réelles disent ce qu'un employeur attend.</p>

        <h2>1. Le Data Analyst : décrire et expliquer</h2>

        <p>Le Data Analyst répond à des questions métier à partir de données existantes : combien, où, quand, par rapport à quoi. Il extrait des données (SQL), les prépare, calcule des indicateurs et les présente sous forme de tableaux de bord et de rapports (Excel, Power BI, Tableau, ou Python).</p>

        <p>Compétences clés : SQL, statistiques descriptives, visualisation, compréhension du métier, et surtout capacité à expliquer un résultat à des non-spécialistes.</p>

        <h2>2. Le Data Scientist : modéliser et prédire</h2>

        <p>Le Data Scientist formule un problème sous forme de question statistique, construit des modèles (prévision, classification, segmentation) et en mesure la fiabilité. Il passe une grande partie de son temps à comprendre le besoin, préparer les données et valider les résultats, plus qu'à choisir un algorithme.</p>

        <p>Compétences clés : Python ou R, statistiques et probabilités, apprentissage automatique, évaluation de modèles (validation croisée, métriques adaptées), communication.</p>

        <h2>3. Le Data Engineer : construire les tuyaux</h2>

        <p>Le Data Engineer conçoit et exploite les chaînes qui collectent, transforment et stockent les données (pipelines, entrepôts, lacs de données). Sans lui, les analystes et les data scientists n'ont pas de données fiables et à jour.</p>

        <p>Compétences clés : SQL avancé, Python ou Scala, orchestration (par exemple Apache Airflow), bases de données et entrepôts, systèmes distribués, qualité des données.</p>

        <h2>4. Le Machine Learning Engineer : mettre en production</h2>

        <p>Le Machine Learning Engineer fait passer un modèle de l'expérimentation à un service qui fonctionne en continu : déploiement, surveillance, mise à jour, gestion de la latence et des coûts. On parle de MLOps pour l'ensemble de ces pratiques (voir le glossaire).</p>

        <p>Compétences clés : génie logiciel, conteneurs, intégration continue, surveillance de modèles, notions de systèmes distribués.</p>

        <h2>5. Les rôles autour de l'éthique et de la conformité</h2>

        <p>L'usage de l'IA est encadré, notamment en Europe par le règlement (UE) 2024/1689, dit « AI Act », et par le RGPD pour les données personnelles. Des organisations confient donc à des juristes, des délégués à la protection des données ou des responsables de la conformité le soin de vérifier les usages à risque (biais, transparence, vie privée). Ces rôles collaborent avec les équipes techniques : comprendre le fonctionnement d'un modèle aide à en évaluer les risques.</p>

        <h2>Comment choisir sa voie</h2>

        <ul>
          <li>Vous aimez expliquer et convaincre avec des chiffres : Data Analyst.</li>
          <li>Vous aimez les statistiques et l'expérimentation : Data Scientist.</li>
          <li>Vous aimez construire des systèmes fiables : Data Engineer ou Machine Learning Engineer.</li>
        </ul>

        <p>Les frontières sont poreuses, et les compétences communes (SQL, Python, statistiques, communication) servent dans tous ces métiers. Pour avancer, appuyez-vous sur des projets concrets : la page Projets du site propose dix idées, du niveau débutant au niveau avancé.</p>
      `,
  "data-analysis-journey": `

        <blockquote><p><strong>Cas d'école.</strong> Le scénario de cet article est une situation type, construite pour l'exemple : l'entreprise, les personnes et les chiffres sont imaginaires. Les bonnes pratiques décrites, elles, sont courantes en analyse de données.</p></blockquote>

        <p>Un projet de data science échoue rarement parce que l'algorithme est mal choisi. Il échoue plus souvent parce que les données ne décrivent pas ce que l'on croit. Ce cas d'école suit un projet imaginaire, puis en tire une méthode.</p>

        <h2>Le scénario</h2>

        <p>Une enseigne de vente de produits haut de gamme veut prédire les achats de ses clients à partir de cinq ans d'historique. Le délai annoncé est court et l'objectif de précision a été fixé avant même d'avoir regardé les fichiers. L'historique arrive sous la forme de plusieurs exports de tableur dont les noms laissent deviner l'histoire : des versions successives, des corrections manuelles, des fichiers « à ne pas utiliser, mais à garder ».</p>

        <h2>Ce que l'inspection des données révèle</h2>

        <p>Dans ce genre de situation, une première passe d'audit, avant toute modélisation, met généralement au jour les mêmes familles de défauts :</p>
        <ul>
          <li><strong>Formats mélangés.</strong> Après un changement d'outil de gestion, une partie des dates est au format jour/mois/année et l'autre au format mois/jour/année. Une date comme 04/05 reste ambiguë tant qu'on ne connaît pas la source.</li>
          <li><strong>Comptes génériques.</strong> Des ventes sont rattachées à un client « de passage » ou « à créer » parce que la fiche n'a pas été saisie. Ces ventes disparaissent de l'analyse par client, alors qu'elles peuvent concerner justement les plus gros montants.</li>
          <li><strong>Événements non enregistrés.</strong> Une campagne de remises réservée à certains clients n'est marquée nulle part dans la base. Le modèle attribue alors au client un comportement qui vient de la promotion.</li>
          <li><strong>Doublons de synchronisation.</strong> Un rapprochement périodique entre deux logiciels crée des lignes en double, corrigées plus tard à la main. Résultat : des pics d'achats à intervalle régulier, qui ne reflètent aucun comportement réel.</li>
          <li><strong>Suppressions silencieuses.</strong> Un nettoyage « pour gagner de la place » a retiré les petites transactions. Les statistiques sur le panier moyen sont faussées sans que rien ne l'indique.</li>
        </ul>

        <h2>Les contrôles à lancer avant de modéliser</h2>

        <p>Quelques lignes de pandas suffisent pour mesurer ces défauts plutôt que de les deviner :</p>

        <pre><code>import pandas as pd

df = pd.read_csv("achats.csv")

# Dates illisibles avec le format attendu
dates = pd.to_datetime(df["date_achat"], format="%d/%m/%Y", errors="coerce")
print("Dates non conformes :", dates.isna().mean())

# Doublons de commande
print("Doublons :", df.duplicated(subset=["id_commande"]).sum())

# Clients les plus fréquents : un compte générique ressort tout de suite
print(df["id_client"].value_counts().head())

# Part de valeurs manquantes par colonne
print(df.isna().mean().sort_values(ascending=False))</code></pre>

        <p>Ces contrôles ne remplacent pas les questions aux personnes qui produisent la donnée : comptables, vendeurs, service informatique. Une anomalie statistique a presque toujours une explication d'organisation.</p>

        <h2>Reformuler l'objectif plutôt que forcer le modèle</h2>

        <p>Si, après nettoyage, la prédiction individuelle reste peu fiable, il est préférable de le dire et de proposer un objectif plus modeste mais défendable : par exemple regrouper les clients en segments (clustering) et décrire leurs comportements d'achat, en indiquant ce que la donnée permet de conclure et ce qu'elle ne permet pas. Une précision modérée annoncée honnêtement vaut mieux qu'un score flatteur obtenu avec des données biaisées.</p>

        <h2>À retenir</h2>
        <ol>
          <li>Ne jamais accepter l'affirmation « les données sont propres » sans les avoir examinées.</li>
          <li>Mesurer les défauts (dates, doublons, valeurs manquantes, comptes génériques) avant de modéliser.</li>
          <li>Interroger les personnes qui produisent la donnée pour comprendre les anomalies.</li>
          <li>Documenter chaque décision de nettoyage pour qu'elle soit reproductible.</li>
          <li>Quand les données ne permettent pas de répondre à la question posée, changer la question plutôt que de truquer la réponse.</li>
        </ol>
      `,
  "correlation-causation": `

        <blockquote><p><strong>Cas d'école.</strong> Les exemples de cet article sont ceux que l'on trouve dans les manuels de statistique. Les deux études citées (cigognes et naissances, admissions à Berkeley) sont publiées et référencées en fin d'article ; les autres exemples sont des raisonnements types, sans données réelles.</p></blockquote>

        <p>« Corrélation n'est pas causalité » est l'une des premières phrases que l'on apprend en statistique. C'est aussi l'une des plus faciles à oublier devant un beau graphique qui confirme ce que l'on espérait. Voici quatre mécanismes qui produisent des corrélations trompeuses.</p>

        <h2>1. La variable cachée (facteur de confusion)</h2>

        <p>L'exemple d'école le plus connu : les ventes de glaces et certains faits divers estivaux (noyades, agressions) évoluent ensemble. Personne ne pense que les glaces causent ces faits. Un troisième facteur, la température, pousse à la fois à acheter des glaces et à passer du temps dehors. Dès qu'une corrélation apparaît, il faut se demander quelle variable commune pourrait agir sur les deux.</p>

        <h2>2. Une corrélation réelle mais sans lien direct</h2>

        <p>Un article publié en 2004 dans la revue <em>Paediatric and Perinatal Epidemiology</em> (Höfer, Przyrembel et Verleger) a repris, sur un ton humoristique, la vieille « théorie de la cigogne » : les auteurs relèvent une corrélation entre la population de cigognes et le nombre d'accouchements : à Berlin, avec les naissances hors des hôpitaux ; en Basse-Saxe, avec l'ensemble des naissances entre 1970 et 1985. Cet article ironique rappelle qu'une corrélation significative ne prouve aucun mécanisme. Les cigognes ne livrent pas les bébés ; deux séries de données qui évoluent dans le temps peuvent simplement évoluer ensemble.</p>

        <p>Quand on teste beaucoup de séries au hasard, on finit aussi par trouver des corrélations élevées sans aucun lien : le site « Spurious Correlations » de Tyler Vigen en fait une collection volontairement absurde.</p>

        <h2>3. La causalité inversée</h2>

        <p>Imaginons que l'on observe que les acheteurs de produits allégés ont en moyenne une corpulence plus élevée que les autres. Conclure que ces produits font grossir serait hâtif : il est plausible que ce soit l'inverse, les personnes qui souhaitent perdre du poids achetant davantage de produits allégés. Une donnée d'observation seule ne dit pas dans quel sens va la relation ; il faut une étude prospective ou une expérience pour trancher.</p>

        <h2>4. Le paradoxe de Simpson</h2>

        <p>Une tendance observée sur l'ensemble des données peut s'inverser dans chaque sous-groupe. L'exemple de référence est celui des admissions en troisième cycle à l'université de Californie à Berkeley à l'automne 1973. Sur l'ensemble des candidatures, les femmes semblaient moins souvent admises que les hommes. Bickel, Hammel et O'Connell (1975) ont montré que, département par département, il n'y avait pas de biais important contre les femmes ; leur analyse met plutôt en évidence une légère tendance en leur faveur. L'écart global venait de la répartition des candidatures : les femmes postulaient davantage dans des départements plus sélectifs.</p>

        <p>Leçon pratique : avant de conclure, découper les données selon les variables qui structurent le problème (département, niveau, région, période) et vérifier que la tendance globale résiste.</p>

        <h2>Cinq questions à se poser devant une corrélation</h2>
        <ul>
          <li>Une troisième variable peut-elle expliquer les deux séries ?</li>
          <li>Dans quel sens irait la causalité, si elle existe ?</li>
          <li>La tendance se maintient-elle dans chaque sous-groupe ?</li>
          <li>Existe-t-il une raison théorique plausible à un lien causal ?</li>
          <li>Comment tester le lien : expérience contrôlée, essai randomisé, ou à défaut méthodes d'inférence causale ?</li>
        </ul>

        <h2>Références</h2>
        <ul>
          <li>Höfer T., Przyrembel H., Verleger S. (2004), « New evidence for the Theory of the Stork », <em>Paediatric and Perinatal Epidemiology</em>, 18(1), 88-92. <a href="https://doi.org/10.1111/j.1365-3016.2003.00534.x">doi:10.1111/j.1365-3016.2003.00534.x</a></li>
          <li>Bickel P. J., Hammel E. A., O'Connell J. W. (1975), « Sex Bias in Graduate Admissions: Data from Berkeley », <em>Science</em>, 187(4175), 398-404. <a href="https://www.science.org/doi/10.1126/science.187.4175.398">doi:10.1126/science.187.4175.398</a></li>
        </ul>
      `,
  "data-visualization-story": `

        <blockquote><p><strong>Cas d'école.</strong> Le scénario du début est une situation type imaginaire. L'exemple central, le quartet d'Anscombe, est un résultat publié (Anscombe, 1973) et reproductible.</p></blockquote>

        <p>Une analyse peut être rigoureuse et pourtant ne convaincre personne, ou pire, conduire à une mauvaise décision parce que la présentation masque l'essentiel. La visualisation n'est pas la décoration de l'analyse : c'est un outil pour la faire.</p>

        <h2>Le scénario : un tableau qui n'a convaincu personne</h2>

        <p>Une équipe présente à un comité un modèle de prévision du départ de clients. Le support est un tableau de quarante lignes de chiffres et un indicateur de performance. Le comité ne retient rien, ne voit pas où se situe le problème et reporte la décision. Le même résultat, présenté en un seul graphique dont le titre énonce la conclusion, permettrait de poser la bonne question dès la première minute. La différence ne tient pas aux données mais à ce que le lecteur peut voir.</p>

        <h2>Pourquoi calculer ne suffit pas : le quartet d'Anscombe</h2>

        <p>En 1973, le statisticien Francis Anscombe a construit quatre petits jeux de données qui ont, à très peu de chose près, les mêmes statistiques de synthèse : même moyenne des x (9) et des y (environ 7,5), mêmes variances, même corrélation (environ 0,82) et même droite de régression (y = 3 + 0,5 x). Pourtant, une fois tracés, ils n'ont rien de commun : une relation à peu près linéaire, une courbe, une droite parfaite perturbée par une valeur aberrante, et un nuage dont un seul point détermine la corrélation.</p>

        <p>Moralité : les indicateurs résument, les graphiques révèlent. Tracer les données avant de les modéliser fait partie de la méthode.</p>

        <h2>Principes pour un graphique honnête et lisible</h2>
        <ul>
          <li><strong>Un message par graphique.</strong> Un titre qui énonce la conclusion (« Le départ des clients double après le premier incident ») aide plus qu'un titre descriptif.</li>
          <li><strong>Choisir le bon type.</strong> Comparer des valeurs : barres ou points alignés. Montrer une évolution : courbe. Montrer une relation : nuage de points. Les travaux de Cleveland et McGill (1984) sur la perception montrent que l'on compare plus précisément des positions sur une échelle commune que des angles ou des aires, ce qui désavantage les camemberts.</li>
          <li><strong>Axes honnêtes.</strong> Un diagramme en barres doit partir de zéro, sinon les écarts sont exagérés. Pour une courbe, un axe tronqué est acceptable s'il est annoncé.</li>
          <li><strong>Réduire l'encombrement.</strong> Retirer ce qui n'apporte pas d'information : quadrillage dense, effets 3D, légendes redondantes (Tufte, 1983).</li>
          <li><strong>Couleur avec parcimonie.</strong> Une couleur d'accent pour ce qu'il faut regarder, des gris pour le reste, et un contraste suffisant pour les personnes daltoniennes.</li>
          <li><strong>Montrer l'incertitude.</strong> Intervalles de confiance, effectifs, période couverte : un chiffre sans contexte se lit de travers.</li>
        </ul>

        <h2>Essayer soi-même</h2>

        <p>Dans l'éditeur Python du site, on peut tracer le premier jeu d'Anscombe avec Matplotlib et le comparer à sa droite de régression :</p>

        <pre><code>import numpy as np
import matplotlib.pyplot as plt

x = np.array([10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5])
y = np.array([8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68])

pente, ordonnee = np.polyfit(x, y, 1)
print("droite :", round(ordonnee, 2), "+", round(pente, 2), "x")

plt.scatter(x, y)
plt.plot(x, ordonnee + pente * x, color="red")
plt.title("Jeu I d'Anscombe : relation à peu près linéaire")
plt.show()</code></pre>

        <h2>À retenir</h2>
        <ol>
          <li>Tracer les données avant de les résumer ou de les modéliser.</li>
          <li>Un graphique doit servir un message et une décision, pas seulement illustrer.</li>
          <li>Choisir une représentation qui permet des comparaisons précises et des axes honnêtes.</li>
        </ol>

        <h2>Références</h2>
        <ul>
          <li>Anscombe F. J. (1973), « Graphs in Statistical Analysis », <em>The American Statistician</em>, 27(1), 17-21.</li>
          <li>Cleveland W. S., McGill R. (1984), « Graphical Perception: Theory, Experimentation, and Application to the Development of Graphical Methods », <em>Journal of the American Statistical Association</em>, 79(387), 531-554.</li>
          <li>Tufte E. R. (1983), <em>The Visual Display of Quantitative Information</em>, Graphics Press.</li>
        </ul>
      `,
  "data-cleaning-nightmare": `

        <blockquote><p><strong>Cas d'école.</strong> L'exemple fil rouge est une situation type imaginaire (un jeu de données de maintenance industrielle). Les défauts décrits sont courants dans les données réelles.</p></blockquote>

        <p>« Les données sont propres, il n'y a qu'à les charger. » Cette phrase précède souvent de longues heures de préparation. Le nettoyage n'est pas une corvée préalable à l'analyse : c'est une partie de l'analyse, parce que chaque décision (supprimer, corriger, imputer) influence le résultat.</p>

        <h2>Le scénario</h2>

        <p>Une entreprise industrielle veut prédire les pannes de ses machines à partir de plusieurs années de rapports d'intervention saisis par les techniciens. Une première lecture montre des champs libres, des codes d'erreur dont la signification a changé d'une version de logiciel à l'autre, et des machines dont l'identifiant a été saisi de plusieurs façons.</p>

        <h2>Un inventaire des défauts fréquents</h2>
        <ul>
          <li><strong>Valeurs manquantes</strong> : absentes au hasard, ou absentes pour une raison (champ non applicable, capteur en panne). Le traitement n'est pas le même.</li>
          <li><strong>Doublons</strong> : lignes identiques, ou quasi identiques (même intervention saisie deux fois).</li>
          <li><strong>Incohérences de format</strong> : dates, unités (degrés Celsius ou Fahrenheit), séparateur décimal, majuscules et accents dans les libellés.</li>
          <li><strong>Valeurs aberrantes</strong> : erreurs de saisie (une température de 9999), ou événements rares mais réels qu'il ne faut surtout pas supprimer.</li>
          <li><strong>Identifiants instables</strong> : la même machine sous plusieurs noms, ou deux machines sous le même nom.</li>
          <li><strong>Signification changeante</strong> : un code ou une colonne dont la définition évolue au fil du temps.</li>
        </ul>

        <h2>Une méthode en cinq étapes</h2>
        <ol>
          <li><strong>Profiler.</strong> Compter les valeurs manquantes, les doublons, les types de colonnes, les valeurs extrêmes. Mesurer avant de corriger.</li>
          <li><strong>Définir les termes.</strong> Qu'appelle-t-on « panne » ? Quel est l'identifiant de référence d'une machine ? Écrire ces définitions avec les experts du métier.</li>
          <li><strong>Corriger par des règles explicites.</strong> Chaque transformation est écrite dans un script, jamais faite à la main dans un tableur, pour pouvoir la rejouer sur de nouvelles données.</li>
          <li><strong>Documenter.</strong> Noter ce qui a été supprimé, corrigé ou imputé et pourquoi.</li>
          <li><strong>Valider.</strong> Contrôler l'effet du nettoyage sur les résultats : les conclusions changent-elles beaucoup selon le traitement choisi ?</li>
        </ol>

        <h2>Quelques lignes pour démarrer</h2>

        <pre><code>import pandas as pd

df = pd.DataFrame({
    "machine": ["A1", "a1 ", "B2", "B2", "C3"],
    "temperature": [71.5, 70.2, None, 9999, 68.0],
})

# Harmoniser les identifiants
df["machine"] = df["machine"].str.strip().str.upper()

# Compter les valeurs manquantes et repérer les valeurs hors plage
print(df["temperature"].isna().sum(), "valeur(s) manquante(s)")
print(df[df["temperature"] > 200])

# Marquer la valeur impossible comme manquante au lieu de la garder
df.loc[df["temperature"] > 200, "temperature"] = None
print(df)</code></pre>

        <h2>Accepter les limites</h2>

        <p>On ne résout pas toujours tous les problèmes. Une démarche pragmatique consiste à identifier un sous-ensemble fiable de données (un « jeu de référence » bien documenté), à construire d'abord un modèle simple dessus, puis à étendre prudemment. Mieux vaut un modèle entraîné sur moins de données mais sûres que sur beaucoup de données douteuses, à condition de dire clairement quelle part des données a été écartée et pourquoi.</p>

        <h2>À retenir</h2>
        <ol>
          <li>Prévoir du temps pour la préparation des données dès le début d'un projet.</li>
          <li>Profiler avant de corriger, et corriger par scripts.</li>
          <li>Impliquer les personnes qui connaissent le métier pour comprendre les anomalies.</li>
          <li>Documenter toutes les décisions de nettoyage.</li>
        </ol>
      `
};
