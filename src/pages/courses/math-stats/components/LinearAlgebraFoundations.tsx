
import { Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CourseEquation from "@/components/courses/CourseEquation";
import CourseHighlight from "@/components/courses/CourseHighlight";

const LinearAlgebraFoundations = () => {
  const matrixOperations = [
    {
      title: "Addition de Matrices",
      description: "Addition élément par élément",
      formula: "\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} + \\begin{bmatrix} e & f \\\\ g & h \\end{bmatrix} = \\begin{bmatrix} a+e & b+f \\\\ c+g & d+h \\end{bmatrix}",
      example: "Seulement possible si les matrices ont les mêmes dimensions"
    },
    {
      title: "Multiplication Matricielle",
      description: "Produit ligne × colonne",
      formula: "\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} \\times \\begin{bmatrix} e & f \\\\ g & h \\end{bmatrix} = \\begin{bmatrix} ae+bg & af+bh \\\\ ce+dg & cf+dh \\end{bmatrix}",
      example: "Dimension résultat : (m×n) × (n×p) = (m×p)"
    },
    {
      title: "Produit Scalaire",
      description: "Mesure de similarité entre vecteurs",
      formula: "\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos(\\theta) = a_1b_1 + a_2b_2 + ... + a_nb_n",
      example: "Résultat scalaire, mesure l'angle entre vecteurs"
    }
  ];

  const practicalApplications = [
    {
      title: "🖼️ Traitement d'Images",
      description: "Une image couleur 512×512 = matrice 512×512×3 (RGB)",
      details: [
        "Filtres de convolution = petites matrices (3×3, 5×5)",
        "Détection de contours, flou, netteté",
        "Compression d'images via SVD"
      ],
      visualization: "Image → Matrice → Transformation → Nouvelle Image"
    },
    {
      title: "🤖 Réseaux de Neurones",
      description: "Chaque couche = transformation linéaire + activation",
      details: [
        "Forward pass : y = σ(Wx + b)",
        "Backpropagation : calcul de gradients",
        "Poids W = matrices, entrées x = vecteurs"
      ],
      visualization: "Données → Matrices → Prédictions"
    },
    {
      title: "📊 Réduction de Dimension",
      description: "PCA, t-SNE pour visualiser des données complexes",
      details: [
        "PCA : décomposition en valeurs propres",
        "Garder les composantes principales",
        "1000 variables → 2-3 dimensions visualisables"
      ],
      visualization: "Haute Dimension → Transformation → Basse Dimension"
    }
  ];

  return (
    <section id="algebre-lineaire" className="mb-16">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Calculator className="h-6 w-6 text-blue-600" />
        Algèbre Linéaire : Fondamental pour la Manipulation des Données
      </h2>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-8 rounded-xl border border-blue-100 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-blue-800">
          🔢 Comprendre les Vecteurs et Matrices
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/80 p-6 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-3">🎯 Qu'est-ce qu'un Vecteur ?</h4>
            <p className="text-sm text-gray-700 mb-4">
              Un vecteur est une liste ordonnée de nombres. En data science, 
              chaque observation peut être représentée comme un vecteur.
            </p>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs font-mono mb-2">Exemple : Client e-commerce</p>
              <CourseEquation 
                latex="\vec{client} = \begin{bmatrix} 25 \\ 1500 \\ 3 \\ 0.8 \end{bmatrix} \begin{matrix} \leftarrow \text{âge} \\ \leftarrow \text{revenus} \\ \leftarrow \text{achats/mois} \\ \leftarrow \text{satisfaction} \end{matrix}"
                displayMode={false}
              />
            </div>
          </div>

          <div className="bg-white/80 p-6 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-3">📊 Qu'est-ce qu'une Matrice ?</h4>
            <p className="text-sm text-gray-700 mb-4">
              Une matrice est un tableau 2D de nombres. Elle peut représenter 
              un ensemble de données complet.
            </p>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs font-mono mb-2">Dataset de 3 clients :</p>
              <CourseEquation 
                latex="M = \begin{bmatrix} 25 & 1500 & 3 & 0.8 \\ 35 & 2000 & 5 & 0.9 \\ 45 & 1200 & 2 & 0.6 \end{bmatrix}"
                displayMode={false}
              />
              <p className="text-xs text-gray-500 mt-2">3 clients × 4 caractéristiques</p>
            </div>
          </div>
        </div>

        {/* Opérations Matricielles Détaillées */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-blue-800 mb-4">⚙️ Opérations Matricielles Essentielles</h4>
          
          {matrixOperations.map((operation, index) => (
            <Card key={index} className="bg-white/80">
              <CardHeader>
                <CardTitle className="text-lg text-blue-700">{operation.title}</CardTitle>
                <p className="text-sm text-gray-600">{operation.description}</p>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg mb-3">
                  <CourseEquation latex={operation.formula} />
                </div>
                <CourseHighlight title="💡 Point clé" type="concept">
                  {operation.example}
                </CourseHighlight>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Intuition Géométrique */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
          <h4 className="text-lg font-semibold text-purple-800 mb-4">🎨 Intuition Géométrique</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded border-l-4 border-purple-400">
              <h5 className="font-semibold text-sm mb-2">Vecteur = Flèche</h5>
              <p className="text-xs text-gray-600">
                Direction + Magnitude. En 2D : position (x,y). 
                En ML : point dans l'espace des caractéristiques.
              </p>
            </div>
            <div className="bg-white p-4 rounded border-l-4 border-blue-400">
              <h5 className="font-semibold text-sm mb-2">Matrice = Transformation</h5>
              <p className="text-xs text-gray-600">
                Rotation, mise à l'échelle, projection. 
                Chaque multiplication = transformation géométrique.
              </p>
            </div>
            <div className="bg-white p-4 rounded border-l-4 border-green-400">
              <h5 className="font-semibold text-sm mb-2">Produit Scalaire = Similarité</h5>
              <p className="text-xs text-gray-600">
                Plus proche de 1 = vecteurs similaires. 
                Proche de 0 = orthogonaux. Négatif = opposés.
              </p>
            </div>
          </div>
        </div>

        {/* Applications Pratiques Enrichies */}
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-blue-800 mb-4">🎯 Applications Concrètes en Data Science</h4>
          <div className="space-y-6">
            {practicalApplications.map((app, index) => (
              <div key={index} className="bg-white/80 p-6 rounded-lg border-l-4 border-green-400">
                <h5 className="font-semibold text-green-700 mb-2">{app.title}</h5>
                <p className="text-sm text-gray-700 mb-3">{app.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="text-xs font-semibold text-gray-500 uppercase mb-2">Détails techniques</h6>
                    <ul className="space-y-1">
                      {app.details.map((detail, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                          <span className="w-1 h-1 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <h6 className="text-xs font-semibold text-green-600 mb-1">Flux de traitement</h6>
                    <p className="text-xs text-green-700 font-mono">{app.visualization}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LinearAlgebraFoundations;
