import React, { useState, useEffect } from "react";
import {
  Database,
  BarChart,
  Layers,
  LayoutDashboard,
  Sparkles,
  Brain,
  BookOpen,
  Target,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

interface DataScienceMapProps {
  className?: string;
}

/**
 * Pedagogical Data Science Learning Path Map
 * Shows the logical progression and interconnections in data science learning
 * Features: step-by-step learning flow, prerequisite connections, and clear progression indicators
 */
const DataScienceMap: React.FC<DataScienceMapProps> = ({ className }) => {
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);
  const [learningPhase, setLearningPhase] = useState(0);

  // Learning progression animation
  useEffect(() => {
    const interval = setInterval(() => {
      setLearningPhase((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Structured learning path with clear prerequisites and progression
  const learningSteps = [
    {
      id: "foundations",
      step: 1,
      position: { x: 20, y: 25 },
      icon: <BookOpen className="w-6 h-6" />,
      title: "Fondamentaux",
      subtitle: "Mathématiques & Statistiques",
      link: "/fundamentals/math-stats",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      description: "Base mathématique essentielle",
      prerequisites: [],
      nextSteps: ["data-collection", "programming"],
      difficulty: "Débutant",
      duration: "2-3 mois",
    },
    {
      id: "data-collection",
      step: 2,
      position: { x: 20, y: 75 },
      icon: <Database className="w-6 h-6" />,
      title: "Collecte de données",
      subtitle: "Bases de données & SQL",
      link: "/fundamentals/databases",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
      description: "Acquisition et stockage des données",
      prerequisites: ["foundations"],
      nextSteps: ["data-processing"],
      difficulty: "Débutant",
      duration: "1-2 mois",
    },
    {
      id: "programming",
      step: 2,
      position: { x: 50, y: 15 },
      icon: <Target className="w-6 h-6" />,
      title: "Programmation",
      subtitle: "Python/R & Outils",
      link: "/tools",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/30",
      description: "Prise en main des outils de développement",
      prerequisites: ["foundations"],
      nextSteps: ["data-processing", "analysis"],
      difficulty: "Intermédiaire",
      duration: "2-4 mois",
    },
    {
      id: "data-processing",
      step: 3,
      position: { x: 50, y: 85 },
      icon: <Layers className="w-6 h-6" />,
      title: "Traitement",
      subtitle: "ETL & Data Engineering",
      link: "/tools",
      color: "from-rose-500 to-rose-600",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/30",
      description: "Nettoyage et préparation des données",
      prerequisites: ["data-collection", "programming"],
      nextSteps: ["analysis", "visualization"],
      difficulty: "Intermédiaire",
      duration: "2-3 mois",
    },
    {
      id: "analysis",
      step: 4,
      position: { x: 80, y: 35 },
      icon: <BarChart className="w-6 h-6" />,
      title: "Analyse",
      subtitle: "Exploration & Statistiques",
      link: "/fundamentals/math-stats",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      description: "Analyse exploratoire des données",
      prerequisites: ["programming", "data-processing"],
      nextSteps: ["machine-learning", "visualization"],
      difficulty: "Intermédiaire",
      duration: "2-3 mois",
    },
    {
      id: "visualization",
      step: 4,
      position: { x: 80, y: 65 },
      icon: <LayoutDashboard className="w-6 h-6" />,
      title: "Visualisation",
      subtitle: "Dashboards & Storytelling",
      link: "/courses/dataviz/data-visualization",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30",
      description: "Communication des insights",
      prerequisites: ["data-processing", "analysis"],
      nextSteps: ["machine-learning"],
      difficulty: "Intermédiaire",
      duration: "1-2 mois",
    },
    {
      id: "machine-learning",
      step: 5,
      position: { x: 50, y: 50 },
      icon: <Brain className="w-6 h-6" />,
      title: "Machine Learning",
      subtitle: "Modèles & Prédictions",
      link: "/machine-learning",
      color: "from-gradient-start to-gradient-end",
      bgColor: "bg-gradient-to-br from-primary/10 to-secondary/10",
      borderColor: "border-primary/30",
      description: "Intelligence artificielle et prédictions",
      prerequisites: ["analysis", "visualization"],
      nextSteps: [],
      difficulty: "Avancé",
      duration: "4-6 mois",
      isCapstone: true,
    },
  ];

  /**
   * Renders learning progression arrows showing prerequisites and next steps
   */
  const renderLearningFlow = () => {
    const arrows: JSX.Element[] = [];
    
    learningSteps.forEach((step) => {
      step.nextSteps.forEach((nextStepId) => {
        const nextStep = learningSteps.find(s => s.id === nextStepId);
        if (nextStep) {
          const isActive = hoveredTopic === step.id || hoveredTopic === nextStepId || learningPhase === step.step - 1;
          const isHighlighted = hoveredTopic === step.id;
          
          // Calculate arrow path
          const startX = step.position.x;
          const startY = step.position.y;
          const endX = nextStep.position.x;
          const endY = nextStep.position.y;
          
          // Create curved path for better visual flow
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;
          const controlOffset = 15;
          
          arrows.push(
            <g key={`${step.id}-${nextStepId}`}>
              {/* Curved arrow path */}
              <path
                d={`M ${startX} ${startY} Q ${midX + controlOffset} ${midY - controlOffset} ${endX} ${endY}`}
                fill="none"
                stroke={isActive ? "url(#learningGradient)" : "url(#prerequisiteGradient)"}
                strokeWidth={isHighlighted ? "4" : isActive ? "3" : "2"}
                strokeDasharray={isActive ? "0" : "6,3"}
                className={`transition-all duration-700 ${isActive ? 'opacity-90' : 'opacity-40'}`}
                markerEnd={isActive ? "url(#arrowActive)" : "url(#arrowDefault)"}
                style={{
                  filter: isHighlighted ? 'drop-shadow(0 0 8px hsl(var(--primary)))' : 'none'
                }}
              />
              
              {/* Step number indicator on arrow */}
              {isActive && (
                <circle
                  cx={midX}
                  cy={midY - 5}
                  r="8"
                  fill="hsl(var(--primary))"
                  className="animate-pulse"
                />
              )}
              {isActive && (
                <text
                  x={midX}
                  y={midY - 2}
                  textAnchor="middle"
                  className="text-xs font-bold fill-white"
                >
                  {step.step}
                </text>
              )}
            </g>
          );
        }
      });
    });
    
    return arrows;
  };

  /**
   * Renders difficulty level indicators
   */
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant':
        return 'text-green-500';
      case 'Intermédiaire':
        return 'text-yellow-500';
      case 'Avancé':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div
      className={`
        relative aspect-video 
        bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30
        dark:from-slate-900 dark:via-blue-950/30 dark:to-purple-950/30
        rounded-2xl shadow-2xl overflow-hidden p-6
        border-2 border-primary/20
        ${className || ""}
      `}
    >
      {/* Learning path title */}
      <div className="absolute top-4 left-6 z-30">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Parcours d'apprentissage
        </h3>
        <p className="text-sm text-muted-foreground">Suivez les étapes pour découvrir la Data Science</p>
      </div>

      {/* Learning phase indicator */}
      <div className="absolute top-4 right-6 z-30">
        <div className="flex items-center gap-2 bg-primary/10 backdrop-blur-sm rounded-full px-3 py-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-xs font-medium text-primary">
            Phase {learningPhase + 1}/5
          </span>
        </div>
      </div>

      {/* Enhanced background with learning path theme */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 animate-pulse-slow" />
        {/* Grid pattern for structure */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />
        {/* Learning path indicators */}
        <div className="absolute top-20 left-10 w-3 h-3 bg-blue-500/40 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0s' }} />
        <div className="absolute top-32 right-20 w-2 h-2 bg-purple-500/40 rounded-full animate-bounce opacity-50" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-20 left-1/3 w-2.5 h-2.5 bg-emerald-500/40 rounded-full animate-bounce opacity-40" style={{ animationDelay: '3s' }} />
      </div>

      {/* SVG for learning flow arrows */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          {/* Learning progression gradient */}
          <linearGradient id="learningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.8" />
          </linearGradient>
          {/* Prerequisite gradient */}
          <linearGradient id="prerequisiteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0.2" />
          </linearGradient>
          {/* Arrow markers */}
          <marker id="arrowActive" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="hsl(var(--primary))" />
          </marker>
          <marker id="arrowDefault" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L6,3 z" fill="hsl(var(--muted-foreground))" opacity="0.5" />
          </marker>
        </defs>
        {renderLearningFlow()}
      </svg>

      <div className="relative z-10 w-full h-full pt-16">
        {/* Learning step nodes */}
        {learningSteps.map((step, index) => {
          const isActive = learningPhase === step.step - 1;
          const isHovered = hoveredTopic === step.id;
          const isCompleted = learningPhase > step.step - 1;
          
          return (
            <Link
              key={step.id}
              to={step.link}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{ 
                left: `${step.position.x}%`, 
                top: `${step.position.y}%`,
                animationDelay: `${index * 0.3}s`
              }}
              onMouseEnter={() => setHoveredTopic(step.id)}
              onMouseLeave={() => setHoveredTopic(null)}
              onClick={() => setHoveredTopic(hoveredTopic === step.id ? null : step.id)} // Mobile touch toggle
              onTouchStart={() => setHoveredTopic(step.id)} // Touch interaction
            >
              {/* Step number badge */}
              <div className="absolute -top-3 -left-3 z-20">
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                  transition-all duration-500
                  ${
                    isCompleted 
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                      : isActive 
                      ? 'bg-primary text-white shadow-lg shadow-primary/30 animate-pulse' 
                      : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {step.step}
                </div>
              </div>

              {/* Main step node */}
              <div className={`
                w-20 h-20 flex items-center justify-center 
                bg-gradient-to-br ${step.color} 
                backdrop-blur-sm rounded-2xl shadow-xl 
                border-2 ${step.borderColor}
                transition-all duration-500 
                group-hover:scale-110 group-hover:shadow-2xl
                ${
                  isHovered 
                    ? 'animate-pulse scale-105 shadow-2xl' 
                    : isActive 
                    ? 'scale-105 animate-bounce shadow-xl' 
                    : isCompleted
                    ? 'opacity-80'
                    : ''
                }
                ${
                  step.isCapstone 
                    ? 'ring-4 ring-primary/30 ring-offset-2 ring-offset-background' 
                    : ''
                }
              `}>
                <div className="relative text-white drop-shadow-lg">
                  {step.icon}
                  {isHovered && (
                    <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-white animate-spin" />
                  )}
                  {step.isCapstone && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Target className="w-3 h-3 text-yellow-800" />
                    </div>
                  )}
                </div>
              </div>

              {/* Step information card */}
              <div className="mt-4 text-center max-w-32">
                <div className="font-bold text-sm leading-tight text-foreground">
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground font-medium mt-0.5">
                  {step.subtitle}
                </div>
                
                {/* Detailed info on hover */}
                <div className={`
                  absolute top-full left-1/2 transform -translate-x-1/2 mt-2
                  bg-background/95 backdrop-blur-sm border border-border
                  rounded-lg p-3 shadow-xl min-w-48 z-30
                  transition-all duration-300
                  ${isHovered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'}
                `}>
                  <div className="text-xs space-y-2">
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-border/50">
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getDifficultyColor(step.difficulty).replace('text-', 'bg-')}`} />
                        <span className={`font-medium ${getDifficultyColor(step.difficulty)}`}>
                          {step.difficulty}
                        </span>
                      </div>
                      <span className="text-muted-foreground font-medium">
                        {step.duration} (indicatif)
                      </span>
                    </div>
                    
                    {step.prerequisites.length > 0 && (
                      <div className="pt-2 border-t border-border/50">
                        <div className="text-muted-foreground font-medium mb-1">Prérequis:</div>
                        <div className="flex flex-wrap gap-1">
                          {step.prerequisites.map(prereq => {
                            const prereqStep = learningSteps.find(s => s.id === prereq);
                            return prereqStep ? (
                              <span key={prereq} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                {prereqStep.title}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Arrow pointing to node */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-background/95 border-l border-t border-border rotate-45" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Enhanced floating elements */}
      <div className="absolute top-4 right-4 opacity-20">
        <div className="w-8 h-8 border-2 border-primary/40 rounded-full animate-spin-slow" />
      </div>
      <div className="absolute bottom-4 left-4 opacity-15">
        <div className="w-6 h-6 bg-gradient-to-br from-accent to-secondary rounded-full animate-pulse" />
      </div>
    </div>
  );
};

export default DataScienceMap;
