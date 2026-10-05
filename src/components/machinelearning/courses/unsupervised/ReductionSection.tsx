
import { EducationalCard, QuizCard, ProgressiveDisclosure } from "@/components/ui/educational-cards";
import { AlgorithmComparison } from "@/components/ui/interactive-schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Eye, Layers, BarChart3 } from "lucide-react";

const ReductionSection = () => {
  const dimensionalityReductionAlgorithms = [
    {
      name: "PCA",
      type: "Analyse en Composantes Principales",
      pros: ["Rapide et efficace", "Interprétable", "Réduit le bruit", "Préserve la variance"],
      cons: ["Linéaire uniquement", "Perte d'information", "Sensible à l'échelle", "Difficile avec données non-linéaires"],
      useCases: ["Compression d'images", "Visualisation de données", "Réduction de bruit", "Feature engineering"],
      complexity: "Faible" as const,
      interpretability: "Élevée" as const,
      performance: 4
    },
    {
      name: "t-SNE",
      type: "t-Distributed Stochastic Neighbor Embedding",
      pros: ["Excellente visualisation", "Préserve structure locale", "Révèle clusters cachés", "Flexible"],
      cons: ["Très lent", "Non déterministe", "Pas de projection inverse", "Hyperparamètres sensibles"],
      useCases: ["Visualisation haute dimension", "Exploration de données", "Détection de patterns", "Analyse de clusters"],
      complexity: "Élevée" as const,
      interpretability: "Moyenne" as const,
      performance: 3
    },
    {
      name: "UMAP",
      type: "Uniform Manifold Approximation and Projection",
      pros: ["Plus rapide que t-SNE", "Structure globale souvent mieux conservée que t-SNE", "Projection inverse possible", "Scalable"],
      cons: ["Hyperparamètres complexes", "Moins mature", "Résultats variables", "Théorie complexe"],
      useCases: ["Visualisation de données", "Preprocessing ML", "Analyse de topologie", "Données biologiques"],
      complexity: "Élevée" as const,
      interpretability: "Moyenne" as const,
      performance: 4
    },
    {
      name: "ICA",
      type: "Independent Component Analysis",
      pros: ["Sépare sources indépendantes", "Séparation aveugle (le mélange n'a pas à être connu)", "Applications spécialisées", "Théorie solide"],
      cons: ["Hypothèses strictes", "Ordre et signe des composantes indéterminés", "Interprétation difficile", "Applications limitées"],
      useCases: ["Séparation de signaux", "Preprocessing audio", "Analyse de données financières", "Neuroimagerie"],
      complexity: "Moyenne" as const,
      interpretability: "Faible" as const,
      performance: 3
    }
  ];

  const progressiveLevels = [
    {
      title: "Concepts de base",
      difficulty: "basic" as const,
      content: (
        <div className="space-y-4">
          <p>La réduction de dimensionnalité consiste à transformer des données haute dimension en représentation plus simple.</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Pourquoi réduire les dimensions ?</h4>
            <ul className="text-sm space-y-1">
              <li>• <strong>Visualisation :</strong> Impossible de visualiser plus de 3 dimensions</li>
              <li>• <strong>Calcul :</strong> Moins de variables = calculs plus rapides</li>
              <li>• <strong>Stockage :</strong> Réduction de l'espace mémoire nécessaire</li>
              <li>• <strong>Bruit :</strong> Élimination des variables non informatives</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Techniques avancées",
      difficulty: "intermediate" as const,
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold">Comparaison des approches principales :</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border">
              <h5 className="font-medium text-green-800 mb-2">Méthodes Linéaires</h5>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• PCA : Maximise la variance expliquée</li>
                <li>• ICA : Sépare les sources indépendantes</li>
                <li>• LDA : Maximise la séparabilité entre classes</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border">
              <h5 className="font-medium text-purple-800 mb-2">Méthodes Non-linéaires</h5>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• t-SNE : Préserve les structures locales</li>
                <li>• UMAP : Équilibre local et global</li>
                <li>• Autoencoders : Apprentissage de représentations</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Applications pratiques",
      difficulty: "advanced" as const,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border">
              <h5 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Computer Vision
              </h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Compression d'images (par exemple PCA sur des patchs ; JPEG utilise la DCT, pas la PCA)</li>
                <li>• Reconnaissance de visages (Eigenfaces, Turk et Pentland, 1991)</li>
                <li>• Preprocessing pour CNN</li>
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border">
              <h5 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Bioinformatique
              </h5>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Analyse de données génomiques</li>
                <li>• Visualisation de cellules uniques</li>
                <li>• Découverte de biomarqueurs</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border">
              <h5 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                <Layers className="h-4 w-4" />
                NLP
              </h5>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Visualisation de word embeddings (PCA, t-SNE sur Word2Vec)</li>
                <li>• Analyse sémantique</li>
                <li>• Clustering de documents</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center flex items-center justify-center gap-3">
        <Sparkles className="h-8 w-8 text-purple-600" />
        Réduction de Dimensionnalité
      </h2>

      {/* Introduction conceptuelle */}
      <EducationalCard title="🎯 Comprendre la réduction de dimensionnalité" type="concept">
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Imaginez que vous essayez de dessiner un cube sur une feuille de papier. 
            Vous devez projeter un objet 3D sur une surface 2D tout en préservant 
            l'information importante. C'est exactement le défi de la réduction de dimensionnalité !
          </p>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
            <h4 className="font-semibold text-purple-800 mb-3">Le dilemme dimensionnel</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-purple-700 mb-2">Trop de dimensions 📈</h5>
                <ul className="text-sm text-purple-600 space-y-1">
                  <li>• Malédiction de la dimensionnalité</li>
                  <li>• Le volume de données nécessaire croît très vite avec la dimension</li>
                  <li>• Visualisation impossible</li>
                  <li>• Overfitting des modèles</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-purple-700 mb-2">Juste ce qu'il faut ✨</h5>
                <ul className="text-sm text-purple-600 space-y-1">
                  <li>• Information essentielle préservée</li>
                  <li>• Calculs efficaces</li>
                  <li>• Visualisation possible</li>
                  <li>• Modèles généralisables</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </EducationalCard>

      {/* Schéma SVG illustrant PCA */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="text-center">Principe de l'Analyse en Composantes Principales (PCA)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <svg width="700" height="400" viewBox="0 0 700 400" className="max-w-full h-auto">
              {/* Axes originaux */}
              <line x1="100" y1="350" x2="300" y2="350" stroke="#6b7280" strokeWidth="2"/>
              <line x1="100" y1="350" x2="100" y2="150" stroke="#6b7280" strokeWidth="2"/>
              <text x="310" y="355" className="text-sm" fill="#6b7280">X1</text>
              <text x="85" y="140" className="text-sm" fill="#6b7280">X2</text>
              
              {/* Points de données */}
              <g>
                <circle cx="120" cy="320" r="4" fill="#3b82f6"/>
                <circle cx="140" cy="300" r="4" fill="#3b82f6"/>
                <circle cx="160" cy="280" r="4" fill="#3b82f6"/>
                <circle cx="180" cy="260" r="4" fill="#3b82f6"/>
                <circle cx="200" cy="240" r="4" fill="#3b82f6"/>
                <circle cx="220" cy="220" r="4" fill="#3b82f6"/>
                <circle cx="240" cy="200" r="4" fill="#3b82f6"/>
                <circle cx="260" cy="180" r="4" fill="#3b82f6"/>
              </g>
              
              {/* Première composante principale */}
              <line x1="110" y1="340" x2="270" y2="170" stroke="#dc2626" strokeWidth="3"/>
              <text x="200" y="240" className="text-sm font-semibold" fill="#dc2626">PC1 (variance max)</text>
              
              {/* Deuxième composante principale */}
              <line x1="150" y1="210" x2="230" y2="290" stroke="#059669" strokeWidth="2" strokeDasharray="5,5"/>
              <text x="238" y="300" className="text-sm" fill="#059669">PC2 (perpendiculaire à PC1)</text>
              
              {/* Projection sur PC1 */}
              <g stroke="#dc2626" strokeWidth="1" strokeDasharray="2,2" opacity="0.6">
                <line x1="120" y1="320" x2="128" y2="332"/>
                <line x1="140" y1="300" x2="148" y2="312"/>
                <line x1="160" y1="280" x2="168" y2="292"/>
                <line x1="180" y1="260" x2="188" y2="272"/>
                <line x1="200" y1="240" x2="208" y2="252"/>
                <line x1="220" y1="220" x2="228" y2="232"/>
                <line x1="240" y1="200" x2="248" y2="212"/>
                <line x1="260" y1="180" x2="268" y2="192"/>
              </g>
              
              {/* Flèche de transformation */}
              <defs>
                <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#7c3aed"/>
                </marker>
              </defs>
              <path d="M 350 250 Q 400 200 450 250" stroke="#7c3aed" strokeWidth="3" fill="none" markerEnd="url(#arrow)"/>
              <text x="380" y="220" className="text-sm font-semibold" fill="#7c3aed">Transformation PCA</text>
              
              {/* Axes transformés */}
              <line x1="500" y1="350" x2="600" y2="350" stroke="#dc2626" strokeWidth="2"/>
              <line x1="500" y1="350" x2="500" y2="250" stroke="#059669" strokeWidth="2"/>
              <text x="610" y="355" className="text-sm font-semibold" fill="#dc2626">PC1</text>
              <text x="485" y="240" className="text-sm" fill="#059669">PC2</text>
              
              {/* Points projetés */}
              <g>
                <circle cx="515" cy="350" r="4" fill="#3b82f6"/>
                <circle cx="525" cy="350" r="4" fill="#3b82f6"/>
                <circle cx="535" cy="350" r="4" fill="#3b82f6"/>
                <circle cx="545" cy="350" r="4" fill="#3b82f6"/>
                <circle cx="555" cy="350" r="4" fill="#3b82f6"/>
                <circle cx="565" cy="350" r="4" fill="#3b82f6"/>
                <circle cx="575" cy="350" r="4" fill="#3b82f6"/>
                <circle cx="585" cy="350" r="4" fill="#3b82f6"/>
              </g>
              
              {/* Légendes */}
              <rect x="50" y="50" width="300" height="80" rx="10" fill="#f9fafb" stroke="#d1d5db"/>
              <text x="60" y="70" className="text-sm font-semibold" fill="#374151">Réduction 2D → 1D :</text>
              <text x="60" y="90" className="text-xs" fill="#6b7280">1. Trouve la direction de variance maximale (PC1)</text>
              <text x="60" y="105" className="text-xs" fill="#6b7280">2. Projette tous les points sur cette ligne</text>
              <text x="60" y="120" className="text-xs" fill="#6b7280">3. Perte minimale d'information</text>
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Comparaison d'algorithmes */}
      <AlgorithmComparison algorithms={dimensionalityReductionAlgorithms} />

      {/* Contenu progressif */}
      <ProgressiveDisclosure
        title="Approfondissement : De la théorie à la pratique"
        levels={progressiveLevels}
      />

      {/* Quiz enrichi */}
      <QuizCard
        question="Vous analysez un dataset d'images 1000x1000 pixels (1M de dimensions) et voulez créer une visualisation 2D pour explorer les groupes. Quelle approche choisiriez-vous ?"
        options={[
          "Utiliser PCA directement sur toutes les dimensions",
          "Appliquer d'abord PCA pour réduire à ~50 dimensions, puis t-SNE pour la visualisation 2D",
          "Utiliser uniquement t-SNE sur toutes les dimensions",
          "Sélectionner manuellement 2 pixels représentatifs"
        ]}
        correctAnswer={1}
        explanation="La stratégie optimale est de combiner PCA et t-SNE : PCA d'abord pour éliminer le bruit et réduire drastiquement les dimensions (de 1M à ~50), puis t-SNE pour créer une visualisation 2D qui préserve la structure locale. t-SNE seul sur 1M de dimensions serait computationnellement prohibitif et PCA seul ne révélerait pas les structures non-linéaires complexes."
        difficulty="difficile"
      />

      <QuizCard
        question="Dans quel contexte la perte d'information due à la réduction de dimensionnalité est-elle généralement acceptable ?"
        options={[
          "Jamais, toute perte d'information est problématique",
          "Quand l'information perdue est principalement du bruit ou des redondances",
          "Seulement pour la visualisation, jamais pour l'analyse",
          "Uniquement avec des données synthétiques"
        ]}
        correctAnswer={1}
        explanation="La réduction de dimensionnalité est bénéfique quand l'information éliminée est principalement du bruit, des redondances ou des variations non pertinentes pour la tâche. En fait, supprimer ce 'bruit dimensionnel' améliore souvent les performances des modèles en évitant l'overfitting et en révélant les patterns vraiment importants dans les données."
        difficulty="moyen"
      />
    </div>
  );
};

export default ReductionSection;
