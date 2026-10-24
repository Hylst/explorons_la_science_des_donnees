import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Code, Play, Lightbulb, Trophy, Target, Zap, Brain, Rocket, Star, Clock, Package, Layers } from 'lucide-react';
import CourseHighlight from '@/components/courses/CourseHighlight';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { runCode, type RunResult } from '@/lib/runner';
import FigureOutput from '@/components/ui/figure-output';
import { ADVANCED_CONCEPTS as advancedConcepts, type Concept, type ConceptCategory } from '@/data/advanced-concepts';
import { useCourseProgress } from '@/hooks/use-course-progress';

const ICONS: Record<ConceptCategory['icon'], typeof Clock> = { Clock, Package, Layers };

/**
 * Concepts avancés de programmation (asynchrone, modules, POO) : exemples Python exécutés dans le navigateur.
 * Données : src/data/advanced-concepts.ts. Un concept marqué comme lu est enregistré dans ce navigateur
 * (progression « advanced-concepts » de use-course-progress) ; on peut annuler ce marquage.
 */
const AdvancedConcepts = () => {
  // State management for interactive learning
  const { statusOf, setStatus } = useCourseProgress('advanced-concepts');
  const [activeTab, setActiveTab] = useState('async');
  const [codeExecution, setCodeExecution] = useState<{ [key: string]: boolean }>({});
  const [runResults, setRunResults] = useState<{ [key: string]: RunResult }>({});
  const [runStatus, setRunStatus] = useState<{ [key: string]: string }>({});
  const [showSolutions, setShowSolutions] = useState<{ [key: string]: boolean }>({});

  // Marquer un concept comme lu, ou annuler le marquage (enregistré dans ce navigateur)
  const toggleConceptComplete = useCallback((conceptId: string) => {
    setStatus(conceptId, statusOf(conceptId) === 'done' ? 'todo' : 'done');
  }, [setStatus, statusOf]);

  // Exécution réelle du code du concept avec Python (Pyodide) dans le navigateur
  const handleCodeExecution = useCallback(async (conceptId: string, code: string) => {
    setCodeExecution(prev => ({ ...prev, [conceptId]: true }));
    setRunStatus(prev => ({ ...prev, [conceptId]: '' }));
    const result = await runCode('python', code, (message) => setRunStatus(prev => ({ ...prev, [conceptId]: message })));
    setRunResults(prev => ({ ...prev, [conceptId]: result }));
    setCodeExecution(prev => ({ ...prev, [conceptId]: false }));
  }, []);

  const toggleSolution = useCallback((conceptId: string) => {
    setShowSolutions(prev => ({
      ...prev,
      [conceptId]: !prev[conceptId]
    }));
  }, []);

  // Calculate progress
  const totalConcepts = Object.values(advancedConcepts).reduce(
    (sum, category) => sum + category.concepts.length, 0
  );
  const allConcepts = Object.values(advancedConcepts).flatMap((category) => category.concepts);
  const completedCount = allConcepts.filter((concept) => statusOf(concept.id) === 'done').length;
  const progressPercentage = (completedCount / totalConcepts) * 100;

  // Concept Card Component
  // Simple fonction de rendu (et non un composant défini ici) : un composant créé dans le rendu du parent est
  // remplacé à chaque clic, ce qui détruit les boutons et fait perdre le focus clavier.
  const renderConceptCard = (concept: Concept) => {
    const isCompleted = statusOf(concept.id) === 'done';
    const isExecuting = codeExecution[concept.id];
    const showSolution = showSolutions[concept.id];
    const runResult = runResults[concept.id];

    return (
      <Card key={concept.id} className={`transition-all duration-300 ${
        isCompleted ? 'border-green-500 bg-green-50' : 'hover:shadow-lg'
      }`}>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-semibold">{concept.title}</h4>
              {isCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
            </div>
            <Badge variant={isCompleted ? "default" : "secondary"}>
              {isCompleted ? "Lu" : "À lire"}
            </Badge>
          </CardTitle>
          <p className="text-gray-600">{concept.description}</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Benefits */}
          <div className="space-y-2">
            <h5 className="font-semibold text-sm flex items-center gap-1">
              <Target className="h-4 w-4" /> Avantages clés
            </h5>
            <ul className="text-sm space-y-1">
              {concept.benefits.map((benefit: string, index: number) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Code Example */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h5 className="font-semibold text-sm flex items-center gap-1">
                <Code className="h-4 w-4" /> Exemple de code
              </h5>
              <div className="flex flex-wrap items-center gap-2">
                {concept.runnable === false ? (
                  <span className="text-xs text-muted-foreground">
                    Exemple de structure de projet, à répartir dans plusieurs fichiers : non exécutable en un seul script.
                  </span>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCodeExecution(concept.id, concept.code)}
                    disabled={isExecuting}
                  >
                    {isExecuting ? (
                      <>
                        <div className="animate-spin h-3 w-3 mr-1 border border-blue-500 border-t-transparent rounded-full" />
                        Exécution...
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Exécuter
                      </>
                    )}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleSolution(concept.id)}
                >
                  {showSolution ? "Masquer" : "Voir explication"}
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-gray-800 text-gray-200 text-sm font-mono flex items-center justify-between">
                <span>{concept.title}</span>
                <Badge variant="secondary" className="text-xs">
                  Python
                </Badge>
              </div>
              <pre className="p-4 text-sm text-gray-300 overflow-x-auto max-h-96">
                <code>{concept.code}</code>
              </pre>
            </div>
            {isExecuting && runStatus[concept.id] && (
              <p className="text-sm text-blue-700" role="status">{runStatus[concept.id]}</p>
            )}
            {runResult && !isExecuting && (
              <div className="rounded-lg border bg-slate-50 p-3 space-y-2" aria-live="polite">
                <p className="text-xs text-muted-foreground">Exécution réelle dans votre navigateur (Python, {Math.round(runResult.durationMs)} ms)</p>
                {runResult.output && <pre className="text-sm font-mono whitespace-pre-wrap break-words text-slate-800">{runResult.output}</pre>}
                <FigureOutput images={runResult.images} />
                {runResult.error && <pre className="text-sm font-mono whitespace-pre-wrap break-words text-red-700">{runResult.error}</pre>}
                {!runResult.output && !runResult.error && !runResult.images?.length && <p className="text-sm text-green-800">Exécuté sans erreur, le programme n'a rien affiché.</p>}
              </div>
            )}
          </div>

          {/* Explanation */}
          {showSolution && (
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Explication :</strong> {concept.explanation}
              </AlertDescription>
            </Alert>
          )}

          {/* Marquer comme lu (réversible) */}
          <Button
            onClick={() => toggleConceptComplete(concept.id)}
            aria-pressed={isCompleted}
            className={`w-full whitespace-normal h-auto min-h-10 ${
              isCompleted 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Concept lu (cliquer pour annuler)
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                Marquer comme lu
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <section id="advanced-concepts" className="mb-16">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Concepts avancés de programmation
          </h2>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explorez les concepts avancés pour aller plus loin en programmation, à votre rythme
        </p>
        <Badge className="bg-purple-100 text-purple-800 mt-2">
          Niveau avancé
        </Badge>
      </div>

      {/* Progress Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-purple-600" />
            <div>
              <div className="text-2xl font-bold text-purple-700">{completedCount}</div>
              <div className="text-sm text-purple-600">Concepts lus</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <div className="flex items-center gap-3">
            <Target className="h-8 w-8 text-indigo-600" />
            <div>
              <div className="text-2xl font-bold text-indigo-700">{Math.round(progressPercentage)}%</div>
              <div className="text-sm text-indigo-600">Progression</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-700">{totalConcepts}</div>
              <div className="text-sm text-blue-600">Concepts totaux</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-3">
            <Zap className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-700">
                {completedCount === totalConcepts ? "Tout lu" : "En cours"}
              </div>
              <div className="text-sm text-green-600">Statut</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progression générale</span>
          <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-3" aria-label="Progression générale" />
      </div>

      {/* Concepts Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full">
          {Object.entries(advancedConcepts).map(([key, category]) => (
            <TabsTrigger key={key} value={key} className="flex items-center gap-2">
              {(() => { const Icon = ICONS[category.icon]; return <Icon className="h-6 w-6" aria-hidden="true" />; })()}
              {category.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(advancedConcepts).map(([key, category]) => (
          <TabsContent key={key} value={key} className="space-y-6">
            {/* Category Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <div className="flex items-center justify-center gap-4">
                <Badge variant="outline">{category.difficulty}</Badge>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {category.estimatedTime}
                </Badge>
              </div>
            </div>

            {/* Concepts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {category.concepts.map((concept) => renderConceptCard(concept))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Completion Message */}
      {completedCount === totalConcepts && (
        <CourseHighlight title="Parcours terminé" type="success">
          <p className="mb-4">
            Vous avez marqué tous les concepts avancés comme lus. Relancer les exemples en modifiant
            quelques lignes est une bonne façon de vérifier ce que vous en avez retenu.
          </p>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-600" />
            <span className="font-semibold">Ce suivi est enregistré dans ce navigateur uniquement.</span>
          </div>
        </CourseHighlight>
      )}
    </section>
  );
};

export default AdvancedConcepts;