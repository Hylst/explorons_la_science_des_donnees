import React, { memo, useMemo } from 'react';

import { 
  Brain, Database, BarChart3, Zap, Users, Shield, Eye, Network, 
  Code, Activity, TrendingUp, Lightbulb, Target, Search, Hash, 
  Layers, Star, CheckCircle, AlertTriangle, RefreshCw, Settings, 
  Wrench, GitBranch, Calendar, LineChart, Gauge, Shuffle, Divide, 
  TrendingDown, BookOpen, Cpu, TreePine, MessageSquare 
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GlossaryEntry } from "@/data/glossary/types";
import TechnicalTooltip from './TechnicalTooltip';
import ConceptDiagram from './ConceptDiagram';
import TruncatedText from '@/components/ui/truncated-text';
import CollapsibleSection from '@/components/ui/collapsible-section';

interface GlossaryCardProps {
  entry: GlossaryEntry;
  index: number;
}

/**
 * Enhanced glossary card component with notebook-style design
 * Features rich typography, structured content, and visual enhancements
 * Optimized with React.memo and useMemo for better performance
 */
const GlossaryCard: React.FC<GlossaryCardProps> = memo(({ entry }) => {
  /**
   * Memoized icon mapping to prevent recreation on every render
   * Convert icon name string to JSX component
   */
  const iconMap = useMemo(() => ({
    BookOpen,
    Brain,
    Database,
    Cpu,
    BarChart3,
    Target,
    TrendingUp,
    Users,
    Search,
    Layers,
    AlertTriangle,
    TrendingDown,
    Network,
    MessageSquare,
    Eye,
    Wrench,
    CheckCircle,
    TreePine,
      Divide,
      Shuffle,
      Settings,
      Zap,
      Activity,
      RefreshCw,
      Star,
      Hash,
      GitBranch,
      Calendar,
      LineChart,
      Gauge,
      Shield,
      Lightbulb,
      Code
    } as Record<string, React.ComponentType<{ className?: string }>>), []);
    
    /**
     * Get icon component from memoized icon map
     */
    const getIconComponent = (iconName: string) => {
      const IconComponent = iconMap[iconName] || BookOpen;
      return <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
    };
  /**
   * Get technical tooltip data for specific terms
   */
  const getTechnicalTooltipData = (term: string) => {
    const tooltipData: Record<string, {
      explanation: string;
      diagram?: 'data-science-process' | 'machine-learning-types' | 'big-data-5v' | 'neural-network' | 'classification-vs-regression' | 'supervised-vs-unsupervised' | 'clustering-example' | 'overfitting-underfitting' | 'cross-validation' | 'gradient-descent';
      keyPoints: string[];
      examples: string[];
      relatedTerms: string[];
    }> = {
      "Data Science": {
        explanation: "Discipline qui combine statistiques, informatique et expertise métier pour extraire des insights des données.",
        diagram: "data-science-process",
        keyPoints: [
          "Processus itératif : collecte → nettoyage → analyse → modélisation → insights",
          "Compétences multiples : programmation, statistiques, visualisation, métier",
          "Outils principaux : Python/R, SQL, Jupyter, bibliothèques ML"
        ],
        examples: [
          "Prédiction de la demande en e-commerce",
          "Détection de fraudes bancaires",
          "Recommandations personnalisées Netflix"
        ],
        relatedTerms: ["Big Data", "Machine Learning", "Statistiques", "IA"]
      },
      "Intelligence Artificielle (IA)": {
        explanation: "Capacité des machines à simuler l'intelligence humaine pour résoudre des problèmes complexes.",
        keyPoints: [
          "IA faible : spécialisée dans une tâche (Siri, AlphaGo)",
          "IA forte : intelligence générale (encore théorique)",
          "Sous-domaines : ML, NLP, vision, robotique"
        ],
        examples: [
          "Assistants vocaux (Alexa, Google Assistant)",
          "Voitures autonomes (Tesla, Waymo)",
          "Diagnostic médical par imagerie"
        ],
        relatedTerms: ["Machine Learning", "Deep Learning", "NLP", "Computer Vision"]
      },
      "Big Data": {
        explanation: "Ensembles de données si volumineux et complexes qu'ils nécessitent des outils spécialisés.",
        diagram: "big-data-5v",
        keyPoints: [
          "Volume : téraoctets à pétaoctets de données",
          "Vélocité : génération en temps réel",
          "Variété : structurées, semi-structurées, non-structurées",
          "Véracité : qualité et fiabilité variables",
          "Valeur : insights exploitables pour l'entreprise"
        ],
        examples: [
          "Logs de serveurs web (millions de requêtes/jour)",
          "Données IoT (capteurs, objets connectés)",
          "Réseaux sociaux (posts, likes, partages)"
        ],
        relatedTerms: ["Hadoop", "Spark", "NoSQL", "Data Lake"]
      },
      "Machine Learning": {
        explanation: "Branche de l'IA permettant aux machines d'apprendre automatiquement à partir de données.",
        diagram: "machine-learning-types",
        keyPoints: [
          "Supervisé : apprend avec des exemples étiquetés",
          "Non-supervisé : découvre des patterns cachés",
          "Renforcement : apprend par essai-erreur avec récompenses"
        ],
        examples: [
          "Filtrage anti-spam (classification supervisée)",
          "Segmentation client (clustering non-supervisé)",
          "Jeux vidéo IA (apprentissage par renforcement)"
        ],
        relatedTerms: ["Algorithmes", "Modèles", "Entraînement", "Prédiction"]
      },
      "Statistiques": {
        explanation: "Science de la collecte, analyse et interprétation des données pour prendre des décisions éclairées.",
        keyPoints: [
          "Descriptives : résumer les données (moyenne, médiane, écart-type)",
          "Inférentielles : généraliser à partir d'échantillons",
          "Tests d'hypothèses : valider ou rejeter des suppositions"
        ],
        examples: [
          "Sondages d'opinion (intervalles de confiance)",
          "Tests A/B marketing (significativité statistique)",
          "Contrôle qualité industriel (cartes de contrôle)"
        ],
        relatedTerms: ["Probabilités", "Hypothèses", "P-value", "Corrélation"]
      },
      "Classification": {
        explanation: "Tâche supervisée qui prédit la catégorie d'appartenance d'une observation.",
        diagram: "classification-vs-regression",
        keyPoints: [
          "Sortie discrète : classes ou catégories prédéfinies",
          "Binaire : 2 classes (spam/non-spam)",
          "Multi-classes : 3+ classes (chien/chat/oiseau)"
        ],
        examples: [
          "Diagnostic médical (malade/sain)",
          "Reconnaissance d'images (objets, visages)",
          "Analyse de sentiments (positif/négatif/neutre)"
        ],
        relatedTerms: ["Régression", "Supervisé", "Accuracy", "Confusion Matrix"]
      },
      "Régression": {
        explanation: "Technique prédictive qui estime une valeur numérique continue à partir de variables explicatives.",
        diagram: "classification-vs-regression",
        keyPoints: [
          "Sortie continue : nombres réels (prix, température, âge)",
          "Linéaire : relation droite entre variables",
          "Non-linéaire : relations complexes (polynomiale, logistique)"
        ],
        examples: [
          "Prédiction prix immobilier (surface, localisation → prix)",
          "Prévisions météo (pression, humidité → température)",
          "Estimation consommation énergétique"
        ],
        relatedTerms: ["Classification", "MSE", "R²", "Corrélation"]
      },
      "Apprentissage Supervisé": {
        explanation: "Paradigme d'apprentissage utilisant des données étiquetées pour entraîner un modèle prédictif.",
        diagram: "supervised-vs-unsupervised",
        keyPoints: [
          "Données d'entraînement : couples (entrée, sortie attendue)",
          "Objectif : généraliser sur de nouvelles données",
          "Évaluation : comparaison prédictions vs vraies valeurs"
        ],
        examples: [
          "Reconnaissance vocale (audio → texte)",
          "Traduction automatique (français → anglais)",
          "Détection d'objets (image → localisation + classe)"
        ],
        relatedTerms: ["Non-supervisé", "Étiquettes", "Train/Test", "Validation"]
      },
      "Apprentissage Non Supervisé": {
        explanation: "Apprentissage automatique sans étiquettes, cherchant à découvrir des structures cachées dans les données.",
        diagram: "supervised-vs-unsupervised",
        keyPoints: [
          "Pas d'étiquettes : exploration libre des données",
          "Clustering : regroupement par similarité",
          "Réduction dimensionnelle : simplification des données"
        ],
        examples: [
          "Segmentation marketing (profils clients)",
          "Détection d'anomalies (fraudes, pannes)",
          "Analyse de panier d'achat (produits associés)"
        ],
        relatedTerms: ["Supervisé", "K-means", "PCA", "Clustering"]
      },
      "Cluster/Clustering": {
        explanation: "Technique de regroupement automatique d'observations similaires en groupes homogènes.",
        diagram: "clustering-example",
        keyPoints: [
          "Intra-cluster : maximiser la similarité dans chaque groupe",
          "Inter-cluster : maximiser la différence entre groupes",
          "Algorithmes : K-means, DBSCAN, clustering hiérarchique"
        ],
        examples: [
          "Segmentation clients (comportement d'achat)",
          "Analyse génomique (groupes de gènes)",
          "Compression d'images (couleurs similaires)"
        ],
        relatedTerms: ["K-means", "Centroïdes", "Distance", "Silhouette"]
      },
      "Deep Learning": {
        explanation: "Sous-domaine du machine learning utilisant des réseaux de neurones profonds (3+ couches cachées) pour apprendre automatiquement des représentations hiérarchiques complexes.",
        diagram: "neural-network",
        keyPoints: [
          "Architectures : CNN (images), RNN/LSTM (séquences), Transformers (attention)",
          "Apprentissage automatique de features sans ingénierie manuelle",
          "Nécessite grandes quantités de données et puissance GPU/TPU"
        ],
        examples: [
          "Reconnaissance d'images (ImageNet, classification médicale)",
          "Traduction automatique (Google Translate, DeepL)",
          "Génération de contenu (GPT, DALL-E, Midjourney)"
        ],
        relatedTerms: ["CNN", "RNN", "Transformers", "Backpropagation"]
      },
      "Overfitting": {
        explanation: "Phénomène où un modèle apprend trop spécifiquement les données d'entraînement, perdant sa capacité de généralisation sur de nouvelles données.",
        diagram: "overfitting-underfitting",
        keyPoints: [
          "Symptômes : performance élevée sur train, faible sur test",
          "Causes : modèle trop complexe, données insuffisantes, bruit",
          "Solutions : régularisation, dropout, validation croisée, early stopping"
        ],
        examples: [
          "Arbre de décision trop profond mémorisant le bruit",
          "Réseau de neurones avec trop de paramètres",
          "Modèle polynomial de degré trop élevé"
        ],
        relatedTerms: ["Underfitting", "Régularisation", "Validation", "Généralisation"]
      },
      "Cross-Validation": {
        explanation: "Technique d'évaluation robuste divisant les données en k plis pour entraîner et tester le modèle plusieurs fois, réduisant la variance de l'estimation.",
        diagram: "cross-validation",
        keyPoints: [
          "K-fold : division en k parties égales, rotation train/test",
          "Stratified : préserve les proportions de classes",
          "Leave-one-out : cas extrême où k = nombre d'observations"
        ],
        examples: [
          "5-fold CV pour sélection d'hyperparamètres",
          "Stratified CV pour classes déséquilibrées",
          "Time series split pour données temporelles"
        ],
        relatedTerms: ["Validation", "Hyperparamètres", "Généralisation", "Biais-Variance"]
      },
      "Gradient Descent": {
        explanation: "Algorithme d'optimisation itératif qui minimise une fonction de coût en suivant la direction opposée au gradient (pente la plus forte).",
        diagram: "gradient-descent",
        keyPoints: [
          "Learning rate : taille du pas (trop grand = oscillations, trop petit = lent)",
          "Variantes : batch, mini-batch, stochastic gradient descent",
          "Optimiseurs avancés : Adam, RMSprop, AdaGrad"
        ],
        examples: [
          "Entraînement de réseaux de neurones (backpropagation)",
          "Régression linéaire (minimisation MSE)",
          "Logistic regression (maximisation likelihood)"
        ],
        relatedTerms: ["Backpropagation", "Learning Rate", "Optimisation", "Loss Function"]
      },
      "Random Forest": {
        explanation: "Algorithme d'ensemble combinant de nombreux arbres de décision entraînés sur des échantillons aléatoires avec sélection aléatoire de features.",
        keyPoints: [
          "Bagging : échantillonnage avec remise des données d'entraînement",
          "Feature randomness : sélection aléatoire de variables à chaque split",
          "Robuste au surapprentissage, gère les valeurs manquantes"
        ],
        examples: [
          "Classification d'emails (spam/non-spam)",
          "Prédiction prix immobilier (régression)",
          "Analyse de crédit (risque de défaut)"
        ],
        relatedTerms: ["Decision Trees", "Bagging", "Ensemble", "Feature Importance"]
      },
      "Support Vector Machine": {
        explanation: "Algorithme de classification/régression trouvant l'hyperplan optimal qui sépare les classes en maximisant la marge entre les points les plus proches.",
        keyPoints: [
          "Vecteurs de support : points les plus proches de la frontière",
          "Kernel trick : projection non-linéaire (RBF, polynomial)",
          "Efficace en haute dimension, robuste aux outliers"
        ],
        examples: [
          "Classification de textes (analyse de sentiments)",
          "Reconnaissance de caractères manuscrits",
          "Détection d'anomalies (one-class SVM)"
        ],
        relatedTerms: ["Kernel", "Marge", "Classification", "Hyperplan"]
      },
      "Principal Component Analysis": {
        explanation: "Technique de réduction de dimensionnalité qui projette les données sur les directions de variance maximale, préservant l'information essentielle.",
        keyPoints: [
          "Composantes principales : vecteurs propres de la matrice de covariance",
          "Variance expliquée : proportion d'information conservée",
          "Linéaire : ne capture que les relations linéaires"
        ],
        examples: [
          "Visualisation de données haute dimension (2D/3D)",
          "Compression d'images (réduction de features)",
          "Préprocessing pour accélérer l'apprentissage"
        ],
        relatedTerms: ["Dimensionnalité", "Variance", "Eigenvalues", "t-SNE"]
      },
      "K-Means": {
        explanation: "Algorithme de clustering qui partitionne les données en k groupes en minimisant la distance intra-cluster et maximisant la distance inter-cluster.",
        diagram: "clustering-example",
        keyPoints: [
          "Centroïdes : points moyens de chaque cluster, mis à jour itérativement",
          "Distance euclidienne : métrique de similarité standard",
          "Choix de k : méthode du coude, silhouette score"
        ],
        examples: [
          "Segmentation clients (profils d'achat)",
          "Compression d'images (réduction couleurs)",
          "Analyse géographique (zones d'influence)"
        ],
        relatedTerms: ["Clustering", "Centroïdes", "DBSCAN", "Silhouette"]
      },
      "Natural Language Processing": {
        explanation: "Domaine de l'IA permettant aux machines de comprendre, interpréter et générer le langage humain en combinant linguistique et machine learning.",
        keyPoints: [
          "Preprocessing : tokenisation, stemming, lemmatisation, stop words",
          "Représentations : bag-of-words, TF-IDF, word embeddings, transformers",
          "Tâches : classification, NER, sentiment, traduction, génération"
        ],
        examples: [
          "Chatbots et assistants virtuels (Siri, Alexa)",
          "Traduction automatique (Google Translate)",
          "Analyse de sentiments sur réseaux sociaux"
        ],
        relatedTerms: ["Tokenisation", "Embeddings", "BERT", "GPT"]
      },
      "Computer Vision": {
        explanation: "Domaine de l'IA qui permet aux machines d'interpréter et comprendre le contenu visuel (images, vidéos) pour automatiser des tâches visuelles.",
        keyPoints: [
          "Preprocessing : redimensionnement, normalisation, augmentation",
          "Architectures : CNN, ResNet, YOLO, R-CNN, Vision Transformers",
          "Tâches : classification, détection, segmentation, génération"
        ],
        examples: [
          "Véhicules autonomes (détection d'obstacles)",
          "Diagnostic médical (analyse d'imagerie)",
          "Reconnaissance faciale (sécurité, photos)"
        ],
        relatedTerms: ["CNN", "Image Processing", "Object Detection", "Segmentation"]
      },
      "Feature Engineering": {
        explanation: "Processus de sélection, transformation et création de variables pertinentes pour améliorer les performances des modèles de machine learning.",
        keyPoints: [
          "Transformation : normalisation, standardisation, encodage catégoriel",
          "Création : features polynomiales, interactions, agrégations temporelles",
          "Sélection : importance, corrélation, tests statistiques"
        ],
        examples: [
          "Extraction de features temporelles (jour, mois, saison)",
          "One-hot encoding pour variables catégorielles",
          "Création de ratios métier (revenus/dépenses)"
        ],
        relatedTerms: ["Feature Selection", "Preprocessing", "Encoding", "Scaling"]
      },
      "Ensemble Methods": {
        explanation: "Techniques combinant plusieurs modèles pour obtenir de meilleures performances qu'un modèle individuel en réduisant biais et variance.",
        keyPoints: [
          "Bagging : modèles parallèles sur échantillons différents (Random Forest)",
          "Boosting : modèles séquentiels corrigeant les erreurs (XGBoost)",
          "Stacking : méta-modèle apprenant à combiner les prédictions"
        ],
        examples: [
          "Random Forest (bagging d'arbres de décision)",
          "Gradient Boosting (XGBoost, LightGBM)",
          "Voting classifier (combinaison par vote)"
        ],
        relatedTerms: ["Bagging", "Boosting", "Stacking", "Bias-Variance"]
      },
      "Hyperparameter Tuning": {
        explanation: "Processus d'optimisation des paramètres de configuration d'un algorithme pour maximiser ses performances sur des données de validation.",
        keyPoints: [
          "Grid Search : recherche exhaustive sur grille de paramètres",
          "Random Search : échantillonnage aléatoire plus efficace",
          "Bayesian Optimization : approche intelligente (Optuna, Hyperopt)"
        ],
        examples: [
          "Learning rate et nombre d'epochs pour réseaux de neurones",
          "Nombre d'arbres et profondeur pour Random Forest",
          "Paramètres de régularisation (C, alpha)"
        ],
        relatedTerms: ["Grid Search", "Validation", "Overfitting", "AutoML"]
      },
      "Data Preprocessing": {
        explanation: "Ensemble des étapes de nettoyage, transformation et préparation des données brutes pour les rendre exploitables par les algorithmes de machine learning.",
        keyPoints: [
          "Nettoyage : gestion valeurs manquantes, outliers, doublons",
          "Transformation : normalisation, encodage, discrétisation",
          "Intégration : fusion de sources, résolution d'entités"
        ],
        examples: [
          "Imputation de valeurs manquantes (moyenne, médiane, KNN)",
          "Détection et traitement d'outliers (IQR, Z-score)",
          "Normalisation min-max ou standardisation Z-score"
        ],
        relatedTerms: ["Data Cleaning", "Imputation", "Outliers", "Scaling"]
      },
      "Model Evaluation": {
        explanation: "Processus d'évaluation des performances d'un modèle de machine learning à l'aide de métriques appropriées et de techniques de validation robustes.",
        keyPoints: [
          "Métriques classification : accuracy, precision, recall, F1, AUC-ROC",
          "Métriques régression : MSE, RMSE, MAE, R², MAPE",
          "Validation : train/test split, cross-validation, holdout"
        ],
        examples: [
          "Matrice de confusion pour analyser les erreurs de classification",
          "Courbe ROC pour évaluer les seuils de décision",
          "Learning curves pour détecter over/underfitting"
        ],
        relatedTerms: ["Metrics", "Validation", "ROC Curve", "Confusion Matrix"]
      }
    };
    return tooltipData[term] || null;
  };

  /**
   * Format description text with enhanced truncation and collapsible sections
   * - Automatic truncation for descriptions over 100 words
   * - Collapsible sections for very long content (500+ words)
   * - Technical tooltips and diagrams integration
   * - Improved markdown rendering with proper formatting
   */
  const formatDescription = (text: string): JSX.Element => {
    const tooltipData = getTechnicalTooltipData(entry.term);
    
    // Ensure text is properly formatted as string
    const formattedText = typeof text === 'string' ? text : String(text || '');
    
    // Calculate word count to determine display strategy
    const wordCount = formattedText.trim().split(/\s+/).length;
    const isVeryLong = wordCount > 500;
    const isLong = wordCount > 100;
    
    // Split very long descriptions into logical sections
    const createSections = (text: string) => {
      const sections = [];
      
      // Try to split by common section indicators
      const sectionPatterns = [
        /\n\n\*\*([^*]+)\*\*:/g, // **Section Title:**
        /\n\n([A-Z][^\n]*):(?=\s)/g, // Title: (at start of line)
        /\n\n(\d+\.)\s/g, // 1. Numbered lists
        /\n\n([A-Z][a-z]+\s[a-z]+)\s*:/g // Multi-word titles
      ];
      
      interface MatchResult {
         index: number;
         title: string;
         fullMatch: string;
       }
       
       const matches: MatchResult[] = [];
      
      // Find all section breaks
      sectionPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(text)) !== null) {
          matches.push({
            index: match.index,
            title: match[1],
            fullMatch: match[0]
          });
        }
      });
      
      // Sort matches by position
      matches.sort((a, b) => a.index - b.index);
      
      if (matches.length > 1) {
         // Create sections based on matches
         matches.forEach((match, i) => {
          if (i === 0 && match.index > 100) {
            // Add introduction section
            sections.push({
              title: "Introduction",
              content: text.substring(0, match.index).trim(),
              defaultOpen: true
            });
          }
          
          const nextMatch = matches[i + 1];
          const endIndex = nextMatch ? nextMatch.index : text.length;
          const content = text.substring(match.index, endIndex)
            .replace(match.fullMatch, '')
            .trim();
          
          if (content.length > 50) {
            sections.push({
              title: match.title,
              content: content,
              defaultOpen: i === 0 // First section open by default
            });
          }
        });
      }
      
      // If no good sections found, split by paragraphs
      if (sections.length === 0) {
        const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
        if (paragraphs.length > 3) {
          const midPoint = Math.ceil(paragraphs.length / 2);
          sections.push(
            {
              title: "Définition principale",
              content: paragraphs.slice(0, midPoint).join('\n\n'),
              defaultOpen: true
            },
            {
              title: "Détails et applications",
              content: paragraphs.slice(midPoint).join('\n\n'),
              defaultOpen: false
            }
          );
        }
      }
      
      return sections;
    };
    
    return (
      <div className="space-y-4">
        {/* Technical tooltip for enhanced explanation */}
        {tooltipData && (
          <CollapsibleSection 
            title="Explication technique détaillée" 
            variant="subtle"
            defaultOpen={false}
          >
            <TechnicalTooltip data={tooltipData} />
          </CollapsibleSection>
        )}
        
        {/* SVG Diagram if available */}
        {tooltipData?.diagram && (
          <CollapsibleSection 
            title="Diagramme conceptuel" 
            variant="subtle"
            defaultOpen={!isVeryLong}
          >
            <div className="flex justify-center py-2">
              <ConceptDiagram type={tooltipData.diagram as 'data-science-process' | 'machine-learning-types' | 'big-data-5v' | 'neural-network' | 'classification-vs-regression' | 'supervised-vs-unsupervised' | 'clustering-example' | 'overfitting-underfitting' | 'cross-validation' | 'gradient-descent'} />
            </div>
          </CollapsibleSection>
        )}
        
        {/* Main description with smart truncation */}
        {isVeryLong ? (
          // Very long descriptions: use collapsible sections
          <div className="space-y-3">
            {createSections(formattedText).map((section, index) => (
              <CollapsibleSection
                key={index}
                title={section.title}
                defaultOpen={section.defaultOpen}
                variant="outlined"
              >
                <TruncatedText
                  text={section.content}
                  wordLimit={150}
                  showWordCount={false}
                  enableMarkdown={true}
                />
              </CollapsibleSection>
            ))}
          </div>
        ) : (
          // Regular descriptions: use truncated text
          <TruncatedText
            text={formattedText}
            wordLimit={isLong ? 100 : 200}
            showWordCount={isLong}
            enableMarkdown={true}
            className=""
          />
        )}
      </div>
    );
  };

  // Category display names with proper formatting
  const getCategoryDisplayName = (category?: string): string => {
    const displayNames: Record<string, string> = {
      fondamentaux: "Fondamentaux",
      "machine-learning": "Machine Learning",
      "deep-learning": "Deep Learning",
      statistiques: "Statistiques",
      nlp: "Traitement du Langage",
      "computer-vision": "Vision par Ordinateur",
      preprocessing: "Préparation des Données",
      mlops: "MLOps & Production",
      "data-engineering": "Ingénierie des Données",
      visualization: "Visualisation",
      ethics: "Éthique & IA"
    };
    return displayNames[category || ""] || category || "Général";
  };

  // Category colors for visual distinction
  const getCategoryColor = (category?: string): string => {
    const colors: Record<string, string> = {
      fondamentaux: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "machine-learning": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "deep-learning": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      statistiques: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      nlp: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      "computer-vision": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      preprocessing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      mlops: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      "data-engineering": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
      visualization: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
      ethics: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
    };
    return colors[category || ""] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 border-2 border-gray-200 dark:border-gray-600">
      {/* Notebook-style decorative elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-60" />
      <div className="absolute top-2 left-4 w-1 h-full bg-red-300 dark:bg-red-600 opacity-40" />
      
      {/* Notebook holes */}
      <div className="absolute top-8 left-2 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 opacity-50" />
        ))}
      </div>

      <CardHeader className="pb-3 pl-8">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-600">
              {getIconComponent(entry.icon)}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                {entry.term}
              </h3>
              {entry.category && (
                <Badge 
                  variant="secondary" 
                  className={`mt-2 text-xs font-medium ${getCategoryColor(entry.category)}`}
                >
                  {getCategoryDisplayName(entry.category)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pl-8 pr-6 pb-6">
        <div className="relative">
          {/* Notebook lines background */}
          <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none">
            {[...Array(Math.ceil(entry.description.length / 80))].map((_, i) => (
              <div key={i} className="h-6 border-b border-blue-200 dark:border-blue-800" style={{ top: `${i * 24}px` }} />
            ))}
          </div>
          
          {/* Content */}
          <div className="relative z-10">
            {formatDescription(entry.description)}
          </div>
        </div>

        {/* Decorative corner */}
        <div className="absolute bottom-4 right-4 w-8 h-8 opacity-20">
          <div className="w-full h-full border-2 border-dashed border-gray-400 dark:border-gray-500 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
});

export default GlossaryCard;