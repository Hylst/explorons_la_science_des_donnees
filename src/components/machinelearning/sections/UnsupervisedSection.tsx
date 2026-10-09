
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GlossaryTerm } from "@/components/ui/glossary-term";
import { mlDefinitions } from "@/data/glossary/ml-definitions";

const UnsupervisedSection = () => {
  return (
    <section id="unsupervised" className="space-y-8">
      <h2 className="text-3xl font-bold mb-6">Apprentissage Non Supervisé</h2>

      <p className="text-lg mb-6">
        L'<GlossaryTerm definition={mlDefinitions["apprentissage-non-supervise"]}>apprentissage non supervisé</GlossaryTerm> traite des données non étiquetées pour découvrir des structures,
        des motifs et des relations sans réponse connue à imiter.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <h3 className="text-xl font-semibold mb-4">
            <GlossaryTerm definition={mlDefinitions["clustering"]}>Clustering</GlossaryTerm>
          </h3>
          <p className="mb-4">
            Le clustering regroupe des instances similaires en clusters, où les objets au sein d'un même
            groupe sont plus similaires entre eux qu'avec ceux des autres groupes.
          </p>
          <h4 className="font-medium mt-4 mb-2">Algorithmes populaires :</h4>
          <ul className="list-disc pl-6 space-y-1">
            <li><GlossaryTerm definition={mlDefinitions["k-means"]}>K-means</GlossaryTerm></li>
            <li><GlossaryTerm definition={mlDefinitions["dbscan"]}>DBSCAN</GlossaryTerm></li>
            <li>Clustering hiérarchique</li>
            <li>Mean Shift</li>
            <li>Mélanges gaussiens (GMM, algorithme EM)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-4">
            <GlossaryTerm definition={mlDefinitions["reduction-dimensionnalite"]}>Réduction de dimensionnalité</GlossaryTerm>
          </h3>
          <p className="mb-4">
            Ces techniques réduisent le nombre de variables aléatoires à considérer, en trouvant un
            ensemble de variables principales qui préservent la plupart des informations.
          </p>
          <h4 className="font-medium mt-4 mb-2">Algorithmes populaires :</h4>
          <ul className="list-disc pl-6 space-y-1">
            <li><GlossaryTerm definition={mlDefinitions["pca"]}>Analyse en Composantes Principales (PCA)</GlossaryTerm></li>
            <li><GlossaryTerm definition={mlDefinitions["t-sne"]}>t-SNE</GlossaryTerm></li>
            <li>UMAP</li>
            <li>Autoencodeurs</li>
          </ul>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Exemple de code : K-means Clustering</CardTitle>
            <CardDescription>Implémentation avec scikit-learn</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto text-sm">
              <code>
{`from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# X : tableau des variables numériques, à fournir.
# Standardisation des données
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Déterminer le nombre optimal de clusters
inertia = []
for k in range(1, 11):
    kmeans = KMeans(n_clusters=k, random_state=42)
    kmeans.fit(X_scaled)
    inertia.append(kmeans.inertia_)

# Méthode du coude pour choisir k
plt.figure(figsize=(8, 4))
plt.plot(range(1, 11), inertia, marker='o')
plt.xlabel('Nombre de clusters')
plt.ylabel('Inertie')
plt.title('Méthode du coude')
plt.show()

# Application du K-means avec k choisi d'après le coude (ici 3, à adapter à vos données)
kmeans = KMeans(n_clusters=3, random_state=42)
clusters = kmeans.fit_predict(X_scaled)

# Visualisation des clusters (dans l'espace standardisé, comme les centres)
plt.figure(figsize=(10, 6))
plt.scatter(X_scaled[:, 0], X_scaled[:, 1], c=clusters, cmap='viridis')
plt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1],
            s=300, c='red', marker='X')
plt.title('K-means Clustering')
plt.show()`}
              </code>
            </pre>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Applications de l'apprentissage non supervisé</CardTitle>
          <CardDescription>Cas d'utilisation courants en data science</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border p-4 rounded-md">
              <h4 className="font-semibold mb-2">Segmentation client</h4>
              <p className="text-sm">Regroupement des clients en fonction de leur comportement d'achat, préférences, et démographie.</p>
            </div>
            <div className="border p-4 rounded-md">
              <h4 className="font-semibold mb-2">Détection d'anomalies</h4>
              <p className="text-sm">Identification des transactions frauduleuses, pannes d'équipement, ou comportements inhabituels.</p>
            </div>
            <div className="border p-4 rounded-md">
              <h4 className="font-semibold mb-2">Systèmes de recommandation</h4>
              <p className="text-sm">Recommandation de produits, de films ou de contenus fondée sur des similarités entre utilisateurs ou entre contenus.</p>
            </div>
            <div className="border p-4 rounded-md">
              <h4 className="font-semibold mb-2">Compression d'image</h4>
              <p className="text-sm">Réduction de la dimensionnalité des images en conservant l'essentiel de l'information, au prix d'une perte.</p>
            </div>
            <div className="border p-4 rounded-md">
              <h4 className="font-semibold mb-2">Analyse de marché</h4>
              <p className="text-sm">Découverte de segments de marché et positionnement des produits.</p>
            </div>
            <div className="border p-4 rounded-md">
              <h4 className="font-semibold mb-2">Visualisation de données complexes</h4>
              <p className="text-sm">Projection de données de haute dimension en 2D ou 3D pour faciliter l'interprétation.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default UnsupervisedSection;
