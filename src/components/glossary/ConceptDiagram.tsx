interface ConceptDiagramProps {
  type: 'data-science-process' | 'machine-learning-types' | 'big-data-5v' | 'neural-network' | 'classification-vs-regression' | 'supervised-vs-unsupervised' | 'clustering-example' | 'overfitting-underfitting' | 'cross-validation' | 'gradient-descent';
  className?: string;
}

/**
 * SVG diagrams for complex data science concepts
 * Provides visual explanations to enhance understanding
 */
const ConceptDiagram: React.FC<ConceptDiagramProps> = ({ type, className = '' }) => {
  const diagrams = {
    'data-science-process': (
      <svg viewBox="0 0 400 200" className={`w-full h-auto ${className}`}>
        <defs>
          <linearGradient id="processGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        
        {/* Process steps */}
        <rect x="10" y="80" width="60" height="40" rx="8" fill="url(#processGrad)" />
        <text x="40" y="105" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Collecte</text>
        
        <rect x="90" y="80" width="60" height="40" rx="8" fill="url(#processGrad)" />
        <text x="120" y="105" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Nettoyage</text>
        
        <rect x="170" y="80" width="60" height="40" rx="8" fill="url(#processGrad)" />
        <text x="200" y="105" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Analyse</text>
        
        <rect x="250" y="80" width="60" height="40" rx="8" fill="url(#processGrad)" />
        <text x="280" y="105" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Modélisation</text>
        
        <rect x="330" y="80" width="60" height="40" rx="8" fill="url(#processGrad)" />
        <text x="360" y="105" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Insights</text>
        
        {/* Arrows */}
        {[70, 150, 230, 310].map((x, i) => (
          <path key={i} d={`M ${x} 100 L ${x + 15} 100`} stroke="#6B7280" strokeWidth="2" markerEnd="url(#arrowhead)" />
        ))}
        
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" />
          </marker>
        </defs>
        
        <text x="200" y="30" textAnchor="middle" fill="#1F2937" fontSize="14" fontWeight="bold">Processus Data Science</text>
      </svg>
    ),
    
    'machine-learning-types': (
      <svg viewBox="0 0 400 300" className={`w-full h-auto ${className}`}>
        <defs>
          <linearGradient id="mlGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="mlGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="mlGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
        </defs>
        
        {/* Central ML circle */}
        <circle cx="200" cy="150" r="40" fill="#3B82F6" />
        <text x="200" y="155" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Machine</text>
        <text x="200" y="170" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Learning</text>
        
        {/* Supervised Learning */}
        <rect x="50" y="50" width="100" height="60" rx="10" fill="url(#mlGrad1)" />
        <text x="100" y="75" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Supervisé</text>
        <text x="100" y="90" textAnchor="middle" fill="white" fontSize="9">Données étiquetées</text>
        <text x="100" y="102" textAnchor="middle" fill="white" fontSize="9">Classification, Régression</text>
        
        {/* Unsupervised Learning */}
        <rect x="250" y="50" width="100" height="60" rx="10" fill="url(#mlGrad2)" />
        <text x="300" y="75" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Non-supervisé</text>
        <text x="300" y="90" textAnchor="middle" fill="white" fontSize="9">Pas d'étiquettes</text>
        <text x="300" y="102" textAnchor="middle" fill="white" fontSize="9">Clustering, Réduction</text>
        
        {/* Reinforcement Learning */}
        <rect x="150" y="220" width="100" height="60" rx="10" fill="url(#mlGrad3)" />
        <text x="200" y="245" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Renforcement</text>
        <text x="200" y="260" textAnchor="middle" fill="white" fontSize="9">Récompenses/Punitions</text>
        <text x="200" y="272" textAnchor="middle" fill="white" fontSize="9">Agents, Environnement</text>
        
        {/* Connection lines */}
        <line x1="150" y1="80" x2="170" y2="130" stroke="#6B7280" strokeWidth="2" />
        <line x1="250" y1="80" x2="230" y2="130" stroke="#6B7280" strokeWidth="2" />
        <line x1="200" y1="190" x2="200" y2="220" stroke="#6B7280" strokeWidth="2" />
        
        <text x="200" y="25" textAnchor="middle" fill="#1F2937" fontSize="14" fontWeight="bold">Types d'Apprentissage Automatique</text>
      </svg>
    ),
    
    'big-data-5v': (
      <svg viewBox="0 0 400 300" className={`w-full h-auto ${className}`}>
        <defs>
          <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1E40AF" />
          </radialGradient>
        </defs>
        
        {/* Central Big Data circle */}
        <circle cx="200" cy="150" r="50" fill="url(#centerGrad)" />
        <text x="200" y="145" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Big</text>
        <text x="200" y="165" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Data</text>
        
        {/* 5 V's positioned around the circle */}
        <g>
          {/* Volume */}
          <circle cx="200" cy="70" r="30" fill="#10B981" />
          <text x="200" y="75" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Volume</text>
          <text x="200" y="40" textAnchor="middle" fill="#1F2937" fontSize="10">Quantité massive</text>
          
          {/* Velocity */}
          <circle cx="320" cy="120" r="30" fill="#F59E0B" />
          <text x="320" y="125" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Vélocité</text>
          <text x="320" y="90" textAnchor="middle" fill="#1F2937" fontSize="10">Vitesse élevée</text>
          
          {/* Variety */}
          <circle cx="320" cy="180" r="30" fill="#EF4444" />
          <text x="320" y="185" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Variété</text>
          <text x="320" y="215" textAnchor="middle" fill="#1F2937" fontSize="10">Types multiples</text>
          
          {/* Veracity */}
          <circle cx="200" cy="230" r="30" fill="#8B5CF6" />
          <text x="200" y="235" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Véracité</text>
          <text x="200" y="265" textAnchor="middle" fill="#1F2937" fontSize="10">Qualité variable</text>
          
          {/* Value */}
          <circle cx="80" cy="180" r="30" fill="#06B6D4" />
          <text x="80" y="185" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Valeur</text>
          <text x="80" y="215" textAnchor="middle" fill="#1F2937" fontSize="10">Insights utiles</text>
        </g>
        
        {/* Connection lines */}
        <line x1="200" y1="100" x2="200" y2="100" stroke="#6B7280" strokeWidth="1" opacity="0.5" />
        <line x1="270" y1="130" x2="250" y2="140" stroke="#6B7280" strokeWidth="1" opacity="0.5" />
        <line x1="270" y1="170" x2="250" y2="160" stroke="#6B7280" strokeWidth="1" opacity="0.5" />
        <line x1="200" y1="200" x2="200" y2="200" stroke="#6B7280" strokeWidth="1" opacity="0.5" />
        <line x1="130" y1="170" x2="150" y2="160" stroke="#6B7280" strokeWidth="1" opacity="0.5" />
        
        <text x="200" y="20" textAnchor="middle" fill="#1F2937" fontSize="14" fontWeight="bold">Les 5V du Big Data</text>
      </svg>
    ),
    
    'neural-network': (
      <svg viewBox="0 0 400 250" className={`w-full h-auto ${className}`}>
        <defs>
          <linearGradient id="neuronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
        </defs>
        
        {/* Input layer */}
        <g>
          <text x="50" y="30" textAnchor="middle" fill="#1F2937" fontSize="12" fontWeight="bold">Entrée</text>
          {[50, 80, 110, 140].map((y, i) => (
            <circle key={i} cx="50" cy={y} r="12" fill="url(#neuronGrad)" />
          ))}
        </g>
        
        {/* Hidden layer 1 */}
        <g>
          <text x="150" y="30" textAnchor="middle" fill="#1F2937" fontSize="12" fontWeight="bold">Cachée 1</text>
          {[60, 90, 120].map((y, i) => (
            <circle key={i} cx="150" cy={y} r="12" fill="#10B981" />
          ))}
        </g>
        
        {/* Hidden layer 2 */}
        <g>
          <text x="250" y="30" textAnchor="middle" fill="#1F2937" fontSize="12" fontWeight="bold">Cachée 2</text>
          {[60, 90, 120].map((y, i) => (
            <circle key={i} cx="250" cy={y} r="12" fill="#F59E0B" />
          ))}
        </g>
        
        {/* Output layer */}
        <g>
          <text x="350" y="30" textAnchor="middle" fill="#1F2937" fontSize="12" fontWeight="bold">Sortie</text>
          {[80, 110].map((y, i) => (
            <circle key={i} cx="350" cy={y} r="12" fill="#EF4444" />
          ))}
        </g>
        
        {/* Connections */}
        {[50, 80, 110, 140].map(y1 => 
          [60, 90, 120].map(y2 => (
            <line key={`${y1}-${y2}`} x1="62" y1={y1} x2="138" y2={y2} stroke="#6B7280" strokeWidth="1" opacity="0.3" />
          ))
        )}
        
        {[60, 90, 120].map(y1 => 
          [60, 90, 120].map(y2 => (
            <line key={`h1-${y1}-${y2}`} x1="162" y1={y1} x2="238" y2={y2} stroke="#6B7280" strokeWidth="1" opacity="0.3" />
          ))
        )}
        
        {[60, 90, 120].map(y1 => 
          [80, 110].map(y2 => (
            <line key={`h2-${y1}-${y2}`} x1="262" y1={y1} x2="338" y2={y2} stroke="#6B7280" strokeWidth="1" opacity="0.3" />
          ))
        )}
        
        <text x="200" y="200" textAnchor="middle" fill="#1F2937" fontSize="14" fontWeight="bold">Réseau de Neurones Artificiels</text>
        <text x="200" y="220" textAnchor="middle" fill="#6B7280" fontSize="10">Chaque connexion a un poids ajustable</text>
      </svg>
    ),
    
    'classification-vs-regression': (
      <svg viewBox="0 0 400 200" className={`w-full h-auto ${className}`}>
        {/* Classification side */}
        <g>
          <rect x="20" y="40" width="160" height="120" rx="8" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2" />
          <text x="100" y="30" textAnchor="middle" fill="#1F2937" fontSize="14" fontWeight="bold">Classification</text>
          
          {/* Scatter plot for classification */}
          <circle cx="60" cy="70" r="4" fill="#EF4444" />
          <circle cx="80" cy="80" r="4" fill="#EF4444" />
          <circle cx="70" cy="90" r="4" fill="#EF4444" />
          <circle cx="120" cy="70" r="4" fill="#3B82F6" />
          <circle cx="140" cy="80" r="4" fill="#3B82F6" />
          <circle cx="130" cy="90" r="4" fill="#3B82F6" />
          
          {/* Decision boundary */}
          <line x1="100" y1="50" x2="100" y2="140" stroke="#6B7280" strokeWidth="2" strokeDasharray="5,5" />
          
          <text x="100" y="175" textAnchor="middle" fill="#6B7280" fontSize="10">Sortie: Catégories discrètes</text>
        </g>
        
        {/* Regression side */}
        <g>
          <rect x="220" y="40" width="160" height="120" rx="8" fill="#F0FDF4" stroke="#10B981" strokeWidth="2" />
          <text x="300" y="30" textAnchor="middle" fill="#1F2937" fontSize="14" fontWeight="bold">Régression</text>
          
          {/* Scatter plot for regression */}
          <circle cx="240" cy="120" r="3" fill="#3B82F6" />
          <circle cx="260" cy="110" r="3" fill="#3B82F6" />
          <circle cx="280" cy="90" r="3" fill="#3B82F6" />
          <circle cx="300" cy="80" r="3" fill="#3B82F6" />
          <circle cx="320" cy="70" r="3" fill="#3B82F6" />
          <circle cx="340" cy="60" r="3" fill="#3B82F6" />
          
          {/* Regression line */}
          <line x1="230" y1="130" x2="350" y2="50" stroke="#10B981" strokeWidth="2" />
          
          <text x="300" y="175" textAnchor="middle" fill="#6B7280" fontSize="10">Sortie: Valeurs continues</text>
        </g>
        
        <text x="200" y="15" textAnchor="middle" fill="#1F2937" fontSize="14" fontWeight="bold">Classification vs Régression</text>
      </svg>
    ),
    
    'supervised-vs-unsupervised': (
      <svg viewBox="0 0 400 250" className={`w-full h-auto ${className}`}>
        {/* Supervised Learning */}
        <g>
          <rect x="20" y="50" width="160" height="150" rx="8" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2" />
          <text x="100" y="40" textAnchor="middle" fill="#1F2937" fontSize="14" fontWeight="bold">Supervisé</text>
          
          <text x="100" y="70" textAnchor="middle" fill="#1F2937" fontSize="11" fontWeight="bold">Données étiquetées</text>
          
          {/* Labeled data points */}
          <circle cx="60" cy="90" r="4" fill="#EF4444" />
          <text x="75" y="95" fill="#EF4444" fontSize="8">Chat</text>
          
          <circle cx="60" cy="110" r="4" fill="#10B981" />
          <text x="75" y="115" fill="#10B981" fontSize="8">Chien</text>
          
          <circle cx="60" cy="130" r="4" fill="#EF4444" />
          <text x="75" y="135" fill="#EF4444" fontSize="8">Chat</text>
          
          <text x="100" y="160" textAnchor="middle" fill="#6B7280" fontSize="10">Objectif: Prédire</text>
          <text x="100" y="175" textAnchor="middle" fill="#6B7280" fontSize="10">les étiquettes</text>
        </g>
        
        {/* Unsupervised Learning */}
        <g>
          <rect x="220" y="50" width="160" height="150" rx="8" fill="#F0FDF4" stroke="#10B981" strokeWidth="2" />
          <text x="300" y="40" textAnchor="middle" fill="#1F2937" fontSize="14" fontWeight="bold">Non-supervisé</text>
          
          <text x="300" y="70" textAnchor="middle" fill="#1F2937" fontSize="11" fontWeight="bold">Données non étiquetées</text>
          
          {/* Unlabeled data points with clusters */}
          <circle cx="270" cy="90" r="4" fill="#6B7280" />
          <circle cx="280" cy="95" r="4" fill="#6B7280" />
          <circle cx="275" cy="105" r="4" fill="#6B7280" />
          
          <circle cx="320" cy="120" r="4" fill="#6B7280" />
          <circle cx="330" cy="125" r="4" fill="#6B7280" />
          <circle cx="325" cy="135" r="4" fill="#6B7280" />
          
          {/* Cluster boundaries */}
          <ellipse cx="275" cy="97" rx="15" ry="12" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3,3" />
          <ellipse cx="325" cy="127" rx="15" ry="12" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="3,3" />
          
          <text x="300" y="160" textAnchor="middle" fill="#6B7280" fontSize="10">Objectif: Découvrir</text>
          <text x="300" y="175" textAnchor="middle" fill="#6B7280" fontSize="10">des patterns cachés</text>
        </g>
        
        <text x="200" y="25" textAnchor="middle" fill="#1F2937" fontSize="14" fontWeight="bold">Apprentissage Supervisé vs Non-supervisé</text>
      </svg>
    ),
    
    'clustering-example': (
      <svg viewBox="0 0 400 200" className={`w-full h-auto ${className}`}>
        <defs>
          <radialGradient id="cluster1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0.1" />
          </radialGradient>
          <radialGradient id="cluster2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
          </radialGradient>
          <radialGradient id="cluster3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
          </radialGradient>
        </defs>
        
        {/* Cluster regions */}
        <ellipse cx="100" cy="80" rx="40" ry="30" fill="url(#cluster1)" />
        <ellipse cx="200" cy="120" rx="35" ry="25" fill="url(#cluster2)" />
        <ellipse cx="300" cy="70" rx="30" ry="35" fill="url(#cluster3)" />
        
        {/* Data points */}
        {/* Cluster 1 */}
        <circle cx="85" cy="70" r="3" fill="#EF4444" />
        <circle cx="95" cy="85" r="3" fill="#EF4444" />
        <circle cx="110" cy="75" r="3" fill="#EF4444" />
        <circle cx="105" cy="90" r="3" fill="#EF4444" />
        <circle cx="90" cy="95" r="3" fill="#EF4444" />
        
        {/* Cluster 2 */}
        <circle cx="190" cy="110" r="3" fill="#3B82F6" />
        <circle cx="205" cy="125" r="3" fill="#3B82F6" />
        <circle cx="185" cy="130" r="3" fill="#3B82F6" />
        <circle cx="210" cy="115" r="3" fill="#3B82F6" />
        <circle cx="195" cy="135" r="3" fill="#3B82F6" />
        
        {/* Cluster 3 */}
        <circle cx="290" cy="60" r="3" fill="#10B981" />
        <circle cx="305" cy="75" r="3" fill="#10B981" />
        <circle cx="295" cy="85" r="3" fill="#10B981" />
        <circle cx="310" cy="65" r="3" fill="#10B981" />
        <circle cx="285" cy="80" r="3" fill="#10B981" />
        
        {/* Centroids */}
        <circle cx="100" cy="80" r="5" fill="#DC2626" stroke="white" strokeWidth="2" />
        <circle cx="200" cy="120" r="5" fill="#1E40AF" stroke="white" strokeWidth="2" />
        <circle cx="300" cy="70" r="5" fill="#059669" stroke="white" strokeWidth="2" />
        
        <text x="200" y="25" textAnchor="middle" fill="#1F2937" fontSize="14" fontWeight="bold">Exemple de Clustering (K-means)</text>
        <text x="200" y="180" textAnchor="middle" fill="#6B7280" fontSize="10">Les points sont regroupés par similarité autour des centroïdes</text>
      </svg>
    ),
    
    'overfitting-underfitting': (
      <svg viewBox="0 0 450 200" className={`w-full h-auto ${className}`}>
        {/* Underfitting */}
        <g>
          <rect x="20" y="40" width="120" height="120" rx="8" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
          <text x="80" y="30" textAnchor="middle" fill="#1F2937" fontSize="12" fontWeight="bold">Sous-apprentissage</text>
          
          {/* Data points */}
          <circle cx="40" cy="140" r="2" fill="#3B82F6" />
          <circle cx="60" cy="120" r="2" fill="#3B82F6" />
          <circle cx="80" cy="100" r="2" fill="#3B82F6" />
          <circle cx="100" cy="80" r="2" fill="#3B82F6" />
          <circle cx="120" cy="60" r="2" fill="#3B82F6" />
          
          {/* Simple line (underfitting) */}
          <line x1="30" y1="130" x2="130" y2="70" stroke="#F59E0B" strokeWidth="2" />
          
          <text x="80" y="175" textAnchor="middle" fill="#6B7280" fontSize="9">Trop simple</text>
        </g>
        
        {/* Good fit */}
        <g>
          <rect x="165" y="40" width="120" height="120" rx="8" fill="#D1FAE5" stroke="#10B981" strokeWidth="2" />
          <text x="225" y="30" textAnchor="middle" fill="#1F2937" fontSize="12" fontWeight="bold">Bon ajustement</text>
          
          {/* Data points */}
          <circle cx="185" cy="140" r="2" fill="#3B82F6" />
          <circle cx="205" cy="120" r="2" fill="#3B82F6" />
          <circle cx="225" cy="100" r="2" fill="#3B82F6" />
          <circle cx="245" cy="80" r="2" fill="#3B82F6" />
          <circle cx="265" cy="60" r="2" fill="#3B82F6" />
          
          {/* Smooth curve (good fit) */}
          <path d="M 175 135 Q 205 115 225 100 Q 245 85 275 65" stroke="#10B981" strokeWidth="2" fill="none" />
          
          <text x="225" y="175" textAnchor="middle" fill="#6B7280" fontSize="9">Équilibré</text>
        </g>
        
        {/* Overfitting */}
        <g>
          <rect x="310" y="40" width="120" height="120" rx="8" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2" />
          <text x="370" y="30" textAnchor="middle" fill="#1F2937" fontSize="12" fontWeight="bold">Sur-apprentissage</text>
          
          {/* Data points */}
          <circle cx="330" cy="140" r="2" fill="#3B82F6" />
          <circle cx="350" cy="120" r="2" fill="#3B82F6" />
          <circle cx="370" cy="100" r="2" fill="#3B82F6" />
          <circle cx="390" cy="80" r="2" fill="#3B82F6" />
          <circle cx="410" cy="60" r="2" fill="#3B82F6" />
          
          {/* Complex curve (overfitting) */}
          <path d="M 320 145 Q 335 125 330 140 Q 345 105 350 120 Q 365 85 370 100 Q 385 65 390 80 Q 405 45 410 60 Q 420 50 420 65" stroke="#EF4444" strokeWidth="2" fill="none" />
          
          <text x="370" y="175" textAnchor="middle" fill="#6B7280" fontSize="9">Trop complexe</text>
        </g>
        
        <text x="225" y="15" textAnchor="middle" fill="#1F2937" fontSize="14" fontWeight="bold">Sous-apprentissage vs Sur-apprentissage</text>
      </svg>
    ),
    
    'cross-validation': (
      <svg viewBox="0 0 400 250" className={`w-full h-auto ${className}`}>
        {/* K-Fold illustration */}
        <g>
          <text x="200" y="25" textAnchor="middle" fill="#1F2937" fontSize="14" fontWeight="bold">Validation Croisée (5-Fold)</text>
          
          {/* Fold 1 */}
          <g>
            <text x="30" y="60" fill="#1F2937" fontSize="10">Fold 1:</text>
            <rect x="60" y="45" width="40" height="20" fill="#EF4444" />
            <rect x="100" y="45" width="40" height="20" fill="#3B82F6" />
            <rect x="140" y="45" width="40" height="20" fill="#3B82F6" />
            <rect x="180" y="45" width="40" height="20" fill="#3B82F6" />
            <rect x="220" y="45" width="40" height="20" fill="#3B82F6" />
            <text x="270" y="60" fill="#6B7280" fontSize="9">Test</text>
            <text x="310" y="60" fill="#6B7280" fontSize="9">Train</text>
          </g>
          
          {/* Fold 2 */}
          <g>
            <text x="30" y="90" fill="#1F2937" fontSize="10">Fold 2:</text>
            <rect x="60" y="75" width="40" height="20" fill="#3B82F6" />
            <rect x="100" y="75" width="40" height="20" fill="#EF4444" />
            <rect x="140" y="75" width="40" height="20" fill="#3B82F6" />
            <rect x="180" y="75" width="40" height="20" fill="#3B82F6" />
            <rect x="220" y="75" width="40" height="20" fill="#3B82F6" />
          </g>
          
          {/* Fold 3 */}
          <g>
            <text x="30" y="120" fill="#1F2937" fontSize="10">Fold 3:</text>
            <rect x="60" y="105" width="40" height="20" fill="#3B82F6" />
            <rect x="100" y="105" width="40" height="20" fill="#3B82F6" />
            <rect x="140" y="105" width="40" height="20" fill="#EF4444" />
            <rect x="180" y="105" width="40" height="20" fill="#3B82F6" />
            <rect x="220" y="105" width="40" height="20" fill="#3B82F6" />
          </g>
          
          {/* Fold 4 */}
          <g>
            <text x="30" y="150" fill="#1F2937" fontSize="10">Fold 4:</text>
            <rect x="60" y="135" width="40" height="20" fill="#3B82F6" />
            <rect x="100" y="135" width="40" height="20" fill="#3B82F6" />
            <rect x="140" y="135" width="40" height="20" fill="#3B82F6" />
            <rect x="180" y="135" width="40" height="20" fill="#EF4444" />
            <rect x="220" y="135" width="40" height="20" fill="#3B82F6" />
          </g>
          
          {/* Fold 5 */}
          <g>
            <text x="30" y="180" fill="#1F2937" fontSize="10">Fold 5:</text>
            <rect x="60" y="165" width="40" height="20" fill="#3B82F6" />
            <rect x="100" y="165" width="40" height="20" fill="#3B82F6" />
            <rect x="140" y="165" width="40" height="20" fill="#3B82F6" />
            <rect x="180" y="165" width="40" height="20" fill="#3B82F6" />
            <rect x="220" y="165" width="40" height="20" fill="#EF4444" />
          </g>
          
          {/* Legend */}
          <rect x="280" y="45" width="15" height="15" fill="#EF4444" />
          <text x="300" y="57" fill="#1F2937" fontSize="10">Test (20%)</text>
          <rect x="280" y="65" width="15" height="15" fill="#3B82F6" />
          <text x="300" y="77" fill="#1F2937" fontSize="10">Train (80%)</text>
          
          <text x="200" y="210" textAnchor="middle" fill="#6B7280" fontSize="10">Chaque fold sert une fois de test, 4 fois d'entraînement</text>
          <text x="200" y="225" textAnchor="middle" fill="#6B7280" fontSize="10">Performance finale = moyenne des 5 évaluations</text>
        </g>
      </svg>
    ),
    
    'gradient-descent': (
      <svg viewBox="0 0 400 200" className={`w-full h-auto ${className}`}>
        <defs>
          <linearGradient id="costGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Cost function curve */}
        <path d="M 50 150 Q 100 50 200 40 Q 300 50 350 150" stroke="#3B82F6" strokeWidth="3" fill="url(#costGrad)" />
        
        {/* Gradient descent path */}
        <circle cx="80" cy="120" r="4" fill="#EF4444" />
        <circle cx="120" cy="80" r="4" fill="#EF4444" />
        <circle cx="160" cy="55" r="4" fill="#EF4444" />
        <circle cx="200" cy="40" r="4" fill="#10B981" stroke="white" strokeWidth="2" />
        
        {/* Arrows showing descent */}
        <path d="M 85 115 L 115 85" stroke="#EF4444" strokeWidth="2" markerEnd="url(#arrowhead2)" />
        <path d="M 125 75 L 155 60" stroke="#EF4444" strokeWidth="2" markerEnd="url(#arrowhead2)" />
        <path d="M 165 50 L 195 45" stroke="#EF4444" strokeWidth="2" markerEnd="url(#arrowhead2)" />
        
        <defs>
          <marker id="arrowhead2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#EF4444" />
          </marker>
        </defs>
        
        {/* Labels */}
        <text x="80" y="140" textAnchor="middle" fill="#EF4444" fontSize="9">Début</text>
        <text x="200" y="25" textAnchor="middle" fill="#10B981" fontSize="9">Minimum global</text>
        
        {/* Axes */}
        <line x1="30" y1="170" x2="370" y2="170" stroke="#6B7280" strokeWidth="1" />
        <line x1="30" y1="170" x2="30" y2="30" stroke="#6B7280" strokeWidth="1" />
        
        <text x="200" y="190" textAnchor="middle" fill="#6B7280" fontSize="10">Paramètres du modèle</text>
        <text x="15" y="100" textAnchor="middle" fill="#6B7280" fontSize="10" transform="rotate(-90 15 100)">Coût (Erreur)</text>
        
        <text x="200" y="15" textAnchor="middle" fill="#1F2937" fontSize="14" fontWeight="bold">Descente de Gradient</text>
      </svg>
    )
  };

  return diagrams[type] || null;
};

export default ConceptDiagram;