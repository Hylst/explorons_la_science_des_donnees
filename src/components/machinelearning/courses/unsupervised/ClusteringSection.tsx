
import { EducationalCard, QuizCard, ExerciseCard, ProgressiveDisclosure } from "@/components/ui/educational-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Target } from "lucide-react";
import { useState } from "react";

const ClusteringSection = () => {
  const [openSections, setOpenSections] = useState<{[key: string]: boolean}>({});

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-8">
      {/* Introduction au clustering */}
      <EducationalCard title="Clustering : repérer des groupes dans des données sans étiquette" type="concept">
        <p className="mb-4">
          Le clustering regroupe des exemples qui se ressemblent, sans connaître de catégories à l'avance.
          Imaginez-vous dans une soirée où vous ne connaissez personne : vous observez les invités et formez
          des groupes d'après ce qu'ils ont en commun.
        </p>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl space-y-4">
          <h4 className="font-semibold text-indigo-800 mb-3">Objectifs du Clustering</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border-l-4 border-blue-400">
              <h5 className="font-medium text-blue-800 mb-2">Homogénéité Intra-cluster</h5>
              <p className="text-sm">Les membres d'un même groupe doivent se ressembler</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-l-4 border-green-400">
              <h5 className="font-medium text-green-800 mb-2">Hétérogénéité Inter-cluster</h5>
              <p className="text-sm">Les groupes doivent être bien distincts les uns des autres</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-l-4 border-purple-400">
              <h5 className="font-medium text-purple-800 mb-2">Équilibre des Groupes</h5>
              <p className="text-sm">Éviter un groupe géant entouré de minuscules groupes (sauf si les données l'exigent)</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-l-4 border-orange-400">
              <h5 className="font-medium text-orange-800 mb-2">Interprétabilité</h5>
              <p className="text-sm">Les groupes doivent avoir un sens métier</p>
            </div>
          </div>
        </div>
      </EducationalCard>

      {/* K-means détaillé */}
      <Collapsible open={openSections.kmeans} onOpenChange={() => toggleSection('kmeans')}>
        <CollapsibleTrigger className="w-full">
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-blue-600" />
                  K-means : l'algorithme de référence
                </span>
                <ChevronDown className={`h-5 w-5 transition-transform ${openSections.kmeans ? 'rotate-180' : ''}`} />
              </CardTitle>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="mt-2 bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardContent className="pt-6 space-y-6">
              <EducationalCard title="K-means : Le Jeu des Centres de Gravité" type="analogie">
                <div className="space-y-4">
                  <p>
                    Imaginez que vous placez plusieurs scènes dans un festival, de façon à minimiser
                    la distance totale que les spectateurs doivent parcourir. K-means fait de même
                    avec K centres et des points de données.
                  </p>

                  <div className="bg-white p-6 rounded-xl border-2 border-dashed border-blue-400">
                    <h4 className="font-semibold mb-4 text-center">L'algorithme K-means, étape par étape</h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="bg-blue-100 p-4 rounded-lg mb-2">
                          <h5 className="font-semibold text-blue-800">1. Initialisation</h5>
                          <p className="text-sm">Placer K scènes au hasard</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-green-100 p-4 rounded-lg mb-2">
                          <h5 className="font-semibold text-green-800">2. Affectation</h5>
                          <p className="text-sm">Chaque fan va à sa scène la plus proche</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-purple-100 p-4 rounded-lg mb-2">
                          <h5 className="font-semibold text-purple-800">3. Mise à jour</h5>
                          <p className="text-sm">Déplacer chaque scène au centre de ses fans</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center mb-4">
                      <svg width="500" height="300" viewBox="0 0 500 300" className="max-w-full h-auto">
                        {/* Iteration 1 */}
                        <g>
                          <text x="100" y="20" textAnchor="middle" className="font-semibold" fontSize="14">Itération 1</text>

                          {/* Centres initiaux */}
                          <circle cx="60" cy="50" r="8" fill="#dc2626" stroke="#991b1b" strokeWidth="2"/>
                          <circle cx="140" cy="80" r="8" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2"/>
                          <circle cx="100" cy="120" r="8" fill="#16a34a" stroke="#15803d" strokeWidth="2"/>

                          {/* Points de données */}
                          <circle cx="50" cy="60" r="3" fill="#fca5a5"/>
                          <circle cx="70" cy="45" r="3" fill="#fca5a5"/>
                          <circle cx="45" cy="70" r="3" fill="#fca5a5"/>

                          <circle cx="130" cy="85" r="3" fill="#93c5fd"/>
                          <circle cx="150" cy="75" r="3" fill="#93c5fd"/>
                          <circle cx="135" cy="95" r="3" fill="#93c5fd"/>

                          <circle cx="90" cy="125" r="3" fill="#86efac"/>
                          <circle cx="110" cy="115" r="3" fill="#86efac"/>
                          <circle cx="105" cy="130" r="3" fill="#86efac"/>
                        </g>

                        {/* Flèche */}
                        <path d="M 200 100 L 240 100" stroke="#374151" strokeWidth="2" markerEnd="url(#arrow)"/>
                        <text x="220" y="95" textAnchor="middle" className="text-sm">Itérations</text>

                        {/* Iteration finale */}
                        <g>
                          <text x="350" y="20" textAnchor="middle" className="font-semibold" fontSize="14">Convergence</text>

                          {/* Centres optimisés */}
                          <circle cx="305" cy="58" r="8" fill="#dc2626" stroke="#991b1b" strokeWidth="2"/>
                          <circle cx="385" cy="78" r="8" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2"/>
                          <circle cx="345" cy="125" r="8" fill="#16a34a" stroke="#15803d" strokeWidth="2"/>

                          {/* Groupes bien formés */}
                          <circle cx="295" cy="68" r="3" fill="#fca5a5"/>
                          <circle cx="315" cy="48" r="3" fill="#fca5a5"/>
                          <circle cx="290" cy="75" r="3" fill="#fca5a5"/>

                          <circle cx="375" cy="88" r="3" fill="#93c5fd"/>
                          <circle cx="395" cy="68" r="3" fill="#93c5fd"/>
                          <circle cx="380" cy="95" r="3" fill="#93c5fd"/>

                          <circle cx="335" cy="135" r="3" fill="#86efac"/>
                          <circle cx="355" cy="115" r="3" fill="#86efac"/>
                          <circle cx="350" cy="135" r="3" fill="#86efac"/>

                          {/* Zones de clusters */}
                          <circle cx="305" cy="58" r="25" fill="none" stroke="#dc2626" strokeWidth="1" strokeDasharray="3,3"/>
                          <circle cx="385" cy="78" r="25" fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="3,3"/>
                          <circle cx="345" cy="125" r="25" fill="none" stroke="#16a34a" strokeWidth="1" strokeDasharray="3,3"/>
                        </g>

                        <defs>
                          <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
                          </marker>
                        </defs>
                      </svg>
                    </div>

                    <p className="text-sm text-gray-600 text-center">
                      On répète les étapes 2 et 3 jusqu'à ce que les centres ne bougent plus (schéma d'illustration).
                    </p>
                  </div>
                </div>
              </EducationalCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3">Forces de K-means</h4>
                  <div className="space-y-2 text-sm">
                    <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                      <strong>Rapidité :</strong> complexité en O(n·k·d·i) (n points, k clusters, d dimensions, i itérations), très efficace en pratique
                    </div>
                    <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                      <strong>Simplicité :</strong> Algorithme intuitif et facile à implémenter
                    </div>
                    <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                      <strong>Passage à l'échelle :</strong> reste utilisable sur de gros jeux de données
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-3">Limitations de K-means</h4>
                  <div className="space-y-2 text-sm">
                    <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                      <strong>Initialisation :</strong> Sensible aux centres initiaux
                    </div>
                    <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                      <strong>Formes :</strong> Préfère les clusters sphériques
                    </div>
                    <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                      <strong>K fixe :</strong> Il faut choisir le nombre de clusters
                    </div>
                    <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                      <strong>Échelle et valeurs aberrantes :</strong> Sensible à l'échelle des variables (à standardiser) et aux points extrêmes
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Clustering hiérarchique */}
      <ProgressiveDisclosure
        title="Clustering hiérarchique : un arbre de fusions"
        levels={[
          {
            title: "Concept de Base",
            difficulty: "basic",
            content: (
              <div className="space-y-4">
                <EducationalCard title="L'Analogie de l'Arbre Généalogique" type="analogie">
                  <p className="mb-4">
                    Imaginez que vous reconstituez l'arbre généalogique d'une famille d'après les ressemblances
                    physiques seulement, sans connaître les liens de parenté.
                  </p>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Deux Approches :</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded border-l-4 border-green-400">
                        <strong>Agglomerative (Bottom-up) :</strong>{" "}
                        Partir des individus et former des familles, puis des clans
                      </div>
                      <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                        <strong>Divisive (Top-down) :</strong>{" "}
                        Partir du clan entier et diviser en sous-groupes (non implémenté dans scikit-learn)
                      </div>
                    </div>
                  </div>
                </EducationalCard>
              </div>
            )
          },
          {
            title: "Critères de liaison",
            difficulty: "intermediate",
            content: (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold mb-3">Comment mesurer la distance entre deux groupes ?</h4>
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded">
                      <strong>Single Linkage :</strong> Distance entre les plus proches voisins
                      <p className="text-sm text-gray-600">"Deux familles sont proches si leurs membres les plus similaires se ressemblent"</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <strong>Complete Linkage :</strong> Distance entre les plus éloignés
                      <p className="text-sm text-gray-600">"Deux familles sont proches si même leurs membres les plus différents se ressemblent"</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded">
                      <strong>Average Linkage :</strong> Distance moyenne entre tous les membres
                      <p className="text-sm text-gray-600">"On fait la moyenne de toutes les ressemblances"</p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded">
                      <strong>Ward :</strong> Fusionne les deux groupes dont la réunion augmente le moins la variance interne
                      <p className="text-sm text-gray-600">Valeur par défaut de scikit-learn (distance euclidienne uniquement), qui donne souvent des groupes compacts</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          },
          {
            title: "Dendrogramme",
            difficulty: "advanced",
            content: (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border text-center">
                  <h4 className="font-semibold mb-4">Dendrogramme : L'Histoire du Clustering</h4>
                  <svg width="480" height="250" viewBox="0 0 480 250" className="max-w-full h-auto mx-auto">
                    {/* Feuilles (points de données) */}
                    <text x="50" y="240" textAnchor="middle" className="text-xs">A</text>
                    <text x="100" y="240" textAnchor="middle" className="text-xs">B</text>
                    <text x="200" y="240" textAnchor="middle" className="text-xs">C</text>
                    <text x="250" y="240" textAnchor="middle" className="text-xs">D</text>
                    <text x="350" y="240" textAnchor="middle" className="text-xs">E</text>

                    {/* Liens verticaux */}
                    <line x1="50" y1="230" x2="50" y2="200" stroke="#374151" strokeWidth="2"/>
                    <line x1="100" y1="230" x2="100" y2="200" stroke="#374151" strokeWidth="2"/>
                    <line x1="200" y1="230" x2="200" y2="180" stroke="#374151" strokeWidth="2"/>
                    <line x1="250" y1="230" x2="250" y2="180" stroke="#374151" strokeWidth="2"/>
                    <line x1="350" y1="230" x2="350" y2="120" stroke="#374151" strokeWidth="2"/>

                    {/* Premier niveau de fusion */}
                    <line x1="50" y1="200" x2="100" y2="200" stroke="#374151" strokeWidth="2"/>
                    <line x1="200" y1="180" x2="250" y2="180" stroke="#374151" strokeWidth="2"/>

                    {/* Liens vers niveau supérieur */}
                    <line x1="75" y1="200" x2="75" y2="150" stroke="#374151" strokeWidth="2"/>
                    <line x1="225" y1="180" x2="225" y2="150" stroke="#374151" strokeWidth="2"/>

                    {/* Deuxième niveau */}
                    <line x1="75" y1="150" x2="225" y2="150" stroke="#374151" strokeWidth="2"/>

                    {/* Vers le sommet */}
                    <line x1="150" y1="150" x2="150" y2="120" stroke="#374151" strokeWidth="2"/>
                    <line x1="150" y1="120" x2="350" y2="120" stroke="#374151" strokeWidth="2"/>

                    {/* Niveau final */}
                    <line x1="250" y1="120" x2="250" y2="80" stroke="#374151" strokeWidth="2"/>

                    {/* Étiquettes des niveaux */}
                    <text x="10" y="205" className="text-xs fill-blue-600">Distance: 0.2</text>
                    <text x="10" y="185" className="text-xs fill-green-600">Distance: 0.3</text>
                    <text x="10" y="155" className="text-xs fill-purple-600">Distance: 0.5</text>
                    <text x="10" y="125" className="text-xs fill-orange-600">Distance: 0.8</text>
                    <text x="10" y="20" className="text-xs fill-gray-600">Hauteurs d'illustration</text>

                    {/* Ligne de coupe */}
                    <line x1="20" y1="140" x2="470" y2="140" stroke="#dc2626" strokeWidth="2" strokeDasharray="5,5"/>
                    <text x="362" y="135" className="text-sm fill-red-600 font-bold">Coupe → 2 clusters</text>
                  </svg>
                  <p className="text-sm text-gray-600 mt-2">
                    En « coupant » le dendrogramme à différentes hauteurs, on obtient différents nombres de clusters (ici, la coupe isole E du reste).
                  </p>
                </div>
              </div>
            )
          }
        ]}
      />

      {/* Quiz sur le clustering */}
      <QuizCard
        question="Vous visualisez vos clients en 2D : les vrais groupes forment deux croissants entrelacés. K-means avec K = 2 les sépare par une droite, et chaque cluster mélange des clients des deux croissants. Quel est probablement le problème ?"
        options={[
          "Le nombre K de clusters est trop petit",
          "Les données ne sont pas normalisées",
          "K-means force des clusters sphériques alors que les vrais groupes ont des formes complexes",
          "L'initialisation des centres était mauvaise"
        ]}
        correctAnswer={2}
        explanation="K-means suppose que les clusters sont à peu près sphériques et de taille similaire. Si les vrais groupes ont des formes allongées, en demi-lune, ou très différentes en taille, K-means coupe l'espace en cellules convexes et crée des groupes artificiels. Dans ce cas, des méthodes comme DBSCAN ou le clustering spectral sont plus adaptées, car elles peuvent retrouver des formes arbitraires."
        difficulty="difficile"
      />

      {/* Exercice pratique */}
      <ExerciseCard
        title="Segmentation de clientèle d'une boutique en ligne"
        problem="Une boutique en ligne veut segmenter sa clientèle. Vous disposez de quatre variables : âge, revenu annuel, fréquence d'achat mensuelle, montant moyen par commande (la solution les simule, pour 300 clients). Implémentez un clustering K-means et utilisez la méthode du coude (elbow method), confirmée par la silhouette, pour choisir le nombre de segments."
        solution={`import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler

# Simulation de 300 clients issus de trois profils (données inventées pour l'exercice)
rng = np.random.default_rng(42)
profils = [
    # (nombre, âge, revenu annuel, achats par mois, montant moyen par commande) : (moyenne, écart-type)
    (100, (24, 4), (28000, 5000), (12, 3), (40, 10)),     # jeunes acheteurs fréquents
    (100, (45, 8), (75000, 10000), (5, 2), (140, 30)),    # clients aisés, achats rares et chers
    (100, (38, 10), (42000, 8000), (2, 1), (60, 15)),     # acheteurs occasionnels
]
blocs = [np.column_stack([rng.normal(*age, n), rng.normal(*revenu, n),
                          np.clip(rng.normal(*freq, n), 0, None), np.clip(rng.normal(*montant, n), 5, None)])
         for n, age, revenu, freq, montant in profils]
data = np.vstack(blocs)

# Normalisation des données (cruciale pour K-means : le revenu, en dizaines de milliers,
# écraserait sinon les autres variables dans les distances)
scaler = StandardScaler()
data_scaled = scaler.fit_transform(data)

def elbow_method(data, max_k=8):
    """Méthode du coude : inertie (somme des carrés intra-cluster) pour K = 1 à max_k,
    et silhouette pour K >= 2."""
    sse, silhouettes = [], {}
    K_range = range(1, max_k + 1)

    for k in K_range:
        kmeans = KMeans(n_clusters=k, random_state=42, n_init=10).fit(data)
        sse.append(kmeans.inertia_)
        if k >= 2:
            silhouettes[k] = silhouette_score(data, kmeans.labels_)

    plt.figure(figsize=(10, 6))
    plt.plot(K_range, sse, 'bo-')
    plt.xlabel('Nombre de clusters (K)')
    plt.ylabel('Inertie (somme des carrés des distances aux centres)')
    plt.title('Méthode du coude')
    plt.grid(True)
    plt.show()

    return sse, silhouettes

def analyze_clusters(data, labels, feature_names):
    """Moyenne de chaque variable dans chaque cluster."""
    print("\\n=== PROFIL DES SEGMENTS ===")
    for i in range(len(np.unique(labels))):
        cluster_data = data[labels == i]
        print(f"\\nSegment {i + 1} ({len(cluster_data)} clients)")
        for j, feature in enumerate(feature_names):
            print(f"  {feature} : {cluster_data[:, j].mean():.1f}")

# Choix de K
print("Recherche du nombre de clusters...")
sse_values, silhouettes = elbow_method(data_scaled, max_k=8)
for k, score in silhouettes.items():
    print(f"K = {k} : silhouette {score:.3f}")

# On repère le coude sur la courbe, puis on le confirme avec la silhouette.
# Les données ont été fabriquées avec 3 profils : un coude net apparaît à K = 3.
# Sur des données réelles, le coude est rarement aussi net, et le choix se discute.
k_optimal = 3

kmeans_final = KMeans(n_clusters=k_optimal, random_state=42, n_init=10)
labels = kmeans_final.fit_predict(data_scaled)

feature_names = ['Âge', 'Revenu (€)', 'Achats par mois', 'Montant moyen (€)']
analyze_clusters(data, labels, feature_names)

# Visualisation 2D (âge et revenu)
plt.figure(figsize=(10, 8))
scatter = plt.scatter(data[:, 0], data[:, 1], c=labels, cmap='viridis', alpha=0.7)
plt.xlabel('Âge')
plt.ylabel('Revenu annuel (€)')
plt.title('Segmentation de la clientèle (âge et revenu)')
plt.colorbar(scatter, label='Segment')

# Centres des clusters, ramenés dans l'espace d'origine
centers_original = scaler.inverse_transform(kmeans_final.cluster_centers_)
plt.scatter(centers_original[:, 0], centers_original[:, 1],
            c='red', marker='x', s=200, linewidths=3, label='Centres')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

# Dernière étape, hors code : donner un nom et une piste d'action à chaque segment,
# avec les équipes qui connaissent la clientèle.`}
        hints={[
          "N'oubliez pas de normaliser vos données avant K-means (StandardScaler)",
          "La méthode du coude cherche le point où la baisse de l'inertie devient marginale",
          "Pensez à donner du sens métier à vos clusters découverts",
          "Visualisez vos résultats pour valider la cohérence des groupes"
        ]}
        difficulty="intermédiaire"
        estimatedTime="35 min (indicatif)"
      />
    </div>
  );
};

export default ClusteringSection;
