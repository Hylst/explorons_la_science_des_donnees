
import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Code, Play, Lightbulb, Trophy, Target, Zap, Brain, Sprout, Rocket, Star } from "lucide-react";
import CourseHighlight from "@/components/courses/CourseHighlight";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SourceNote } from "@/components/ui/source-note";
import { Link } from "react-router-dom";
import RunnableCode from "@/components/courses/lessons/RunnableCode";
import { MASTERCLASS_EXAMPLES, type MasterclassExample, type MasterclassExampleId } from "@/data/python-masterclass-examples";
import { useCourseProgress } from "@/hooks/use-course-progress";

// Numéros des exercices suivis par le tableau de bord. Les quatre <Exercise> ont les identifiants 1 à 4 ;
// les deux exercices écrits directement dans le JSX (Pandas, exercice final) ont les leurs, sinon
// compléter l'un marquait aussi l'autre comme terminé.
const PANDAS_EXERCISE_ID = 5;
const FINAL_EXERCISE_ID = 6;
const TOTAL_EXERCISES = 6;
const EXERCISE_IDS = [1, 2, 3, 4, PANDAS_EXERCISE_ID, FINAL_EXERCISE_ID];
/** Clé de progression d'un exercice : identifiant stable, ne pas le changer */
const progressId = (exerciseId: number) => `exercice-${exerciseId}`;


interface MasterclassContextValue {
  activeExercise: number | null;
  completedExercises: Set<number>;
  toggleExercise: (exerciseId: number) => void;
  markCompleted: (exerciseId: number) => void;
}

const MasterclassContext = createContext<MasterclassContextValue | null>(null);

const useMasterclass = () => {
  const context = useContext(MasterclassContext);
  if (!context) throw new Error("Exercise doit être rendu à l'intérieur de PythonMasterclass");
  return context;
};

interface ExerciseProps {
  id: number;
  title: string;
  description: string;
  solution: string;
  difficulty?: string;
  hints?: string[];
  estimatedTime?: number;
  tags?: string[];
}

// Exercise et CodeExample sont définis ici et non dans PythonMasterclass : recréés à chaque rendu du parent,
// ils étaient démontés puis remontés par React et perdaient leur état local (solution, indices, minuteur).
const Exercise = ({
  id,
  title,
  description,
  solution,
  difficulty = "Débutant",
  hints = [],
  estimatedTime = 5,
  tags = []
}: ExerciseProps) => {
  const { activeExercise, completedExercises, toggleExercise, markCompleted } = useMasterclass();
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  
  const isCompleted = completedExercises.has(id);
  const isActive = activeExercise === id;

  // Timer effect for active exercises
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && startTime && !isCompleted) {
      interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, startTime, isCompleted]);

  const handleStart = () => {
    if (!isActive) {
      toggleExercise(id);
      setStartTime(Date.now());
    }
  };

  const handleComplete = () => {
    markCompleted(id);
  };

  const difficultyConfig = useMemo(() => ({
    "Débutant": { color: "bg-green-100 text-green-800", icon: Sprout },
    "Intermédiaire": { color: "bg-blue-100 text-blue-800", icon: Rocket },
    "Avancé": { color: "bg-purple-100 text-purple-800", icon: Star }
  }), []);
  const DifficultyIcon = difficultyConfig[difficulty as keyof typeof difficultyConfig]?.icon;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={`p-4 border-l-4 transition-all duration-300 ${
      isActive ? 'border-l-blue-500 shadow-lg' : 
      isCompleted ? 'border-l-green-500' : 'border-l-gray-300'
    }`}>
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-lg">{title}</h4>
            {isActive && (
              <div className="flex items-center gap-1 text-blue-600 text-sm">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                En cours
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`gap-1 ${difficultyConfig[difficulty as keyof typeof difficultyConfig]?.color || "bg-gray-100 text-gray-800"}`}>
              {DifficultyIcon && <DifficultyIcon className="h-3 w-3" aria-hidden="true" />}
              {difficulty}
            </Badge>
            <Badge variant="outline" className="text-xs">
              ~{estimatedTime} min
            </Badge>
            {isActive && startTime && (
              <Badge variant="outline" className="text-xs">
                {formatTime(timeSpent)}
              </Badge>
            )}
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isActive && !isCompleted && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleStart}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <Play className="h-4 w-4 mr-1" />
              Commencer
            </Button>
          )}
          <Button
            size="sm"
            variant={isCompleted ? "default" : "outline"}
            onClick={handleComplete}
            aria-pressed={isCompleted}
            className={isCompleted ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                Terminé (annuler)
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-1" />
                Marquer terminé
              </>
            )}
          </Button>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
      
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {hints.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHints(!showHints)}
              className="flex-1"
            >
              <Zap className="h-4 w-4 mr-1" />
              {showHints ? "Masquer les indices" : `Indices (${hints.length})`}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSolution(!showSolution)}
            className="flex-1"
          >
            <Brain className="h-4 w-4 mr-1" />
            {showSolution ? "Masquer la solution" : "Voir la solution"}
          </Button>
        </div>
        
        {showHints && hints.length > 0 && (
          <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800">Indice {currentHint + 1}/{hints.length}</span>
              {hints.length > 1 && (
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setCurrentHint(Math.max(0, currentHint - 1))}
                    disabled={currentHint === 0}
                    className="h-6 w-6 p-0"
                  >
                    ←
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setCurrentHint(Math.min(hints.length - 1, currentHint + 1))}
                    disabled={currentHint === hints.length - 1}
                    className="h-6 w-6 p-0"
                  >
                    →
                  </Button>
                </div>
              )}
            </div>
            <p className="text-sm text-blue-700">{hints[currentHint]}</p>
          </div>
        )}
        
        {showSolution && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md border">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-gray-800">Solution :</span>
            </div>
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">{solution}</pre>
          </div>
        )}
      </div>
    </Card>
  );
};

interface CodeExampleProps {
  title: string;
  /** Exemple de src/data/python-masterclass-examples.ts */
  example: MasterclassExampleId;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

const CodeExample = ({ title, example, difficulty = 'beginner' }: CodeExampleProps) => {
  const data: MasterclassExample = MASTERCLASS_EXAMPLES[example];
  const difficultyColors = {
    beginner: 'border-l-green-500',
    intermediate: 'border-l-blue-500',
    advanced: 'border-l-purple-500'
  };

  return (
    <div className={`my-4 border-l-4 ${difficultyColors[difficulty]} pl-4`}>
      <h4 className="font-medium mb-2 flex flex-wrap items-center gap-2">
        <Code className="h-4 w-4" />
        {title}
        {difficulty !== 'beginner' && (
          <Badge className={`text-xs ${
            difficulty === 'intermediate' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
          }`}>
            {difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
          </Badge>
        )}
      </h4>
      {data.note && <p className="text-sm text-muted-foreground mb-2">{data.note}</p>}
      {data.runnable ? (
        <RunnableCode language="python" code={data.code} setup={data.setup} label={`Exemple « ${title} », modifiable`} />
      ) : (
        <div className="bg-gray-900 rounded-md overflow-hidden shadow-lg">
          <div className="px-4 py-2 bg-gray-800 text-gray-200 text-sm font-mono">python | {data.code.split('\n').length} lignes, code à lire</div>
          <pre className="p-4 text-sm text-gray-300 overflow-x-auto font-mono leading-relaxed">
            <code>{data.code}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

// Parcours pratique en Python : exemples de code à lire, exercices avec indices et solutions
const PythonMasterclass = () => {
  const [activeExercise, setActiveExercise] = useState<number | null>(null);
  // exercices marqués terminés, enregistrés dans ce navigateur (progression « python-masterclass », un élément par exercice)
  const { statusOf, setStatus } = useCourseProgress('python-masterclass');
  const completedExercises = useMemo(
    () => new Set(EXERCISE_IDS.filter((n) => statusOf(progressId(n)) === 'done')),
    [statusOf]
  );

  // Progression réelle : part des exercices marqués terminés
  const completionRate = Math.round((completedExercises.size / TOTAL_EXERCISES) * 100);

  // Le niveau découle du nombre d'exercices terminés
  const skillLevel = completedExercises.size >= 4 ? 'advanced' : completedExercises.size >= 2 ? 'intermediate' : 'beginner';

  const toggleExercise = useCallback((exerciseId: number) => {
    setActiveExercise(prev => (prev === exerciseId ? null : exerciseId));
  }, []);

  // marquer terminé, ou annuler le marquage
  const markCompleted = useCallback((exerciseId: number) => {
    setStatus(progressId(exerciseId), statusOf(progressId(exerciseId)) === 'done' ? 'todo' : 'done');
  }, [setStatus, statusOf]);

  // Skill level badge configuration
  const skillBadgeConfig = useMemo(() => {
    const configs = {
      beginner: { color: 'bg-green-100 text-green-800', icon: Sprout, label: 'Débutant' },
      intermediate: { color: 'bg-blue-100 text-blue-800', icon: Rocket, label: 'Intermédiaire' },
      advanced: { color: 'bg-purple-100 text-purple-800', icon: Star, label: 'Avancé' }
    };
    return configs[skillLevel];
  }, [skillLevel]);

  const contextValue = useMemo(
    () => ({ activeExercise, completedExercises, toggleExercise, markCompleted }),
    [activeExercise, completedExercises, toggleExercise, markCompleted]
  );

  return (
    <MasterclassContext.Provider value={contextValue}>
    <section id="python-masterclass" className="mb-16">
      <div className="mb-8">
        {/* Enhanced Header with Progress Overview */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
              <Code className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Python : un premier outil pour la data science
            </h2>
            <Badge className="bg-blue-100 text-blue-800">Parcours pratique</Badge>
          </div>
          
          {/* Global Progress Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-700">{completedExercises.size}</div>
                  <div className="text-sm text-green-600">Exercices terminés</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-700">{completionRate}%</div>
                  <div className="text-sm text-blue-600">Progression totale</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${skillBadgeConfig.color}`}>
                  <skillBadgeConfig.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-700">{skillBadgeConfig.label}</div>
                  <div className="text-sm text-purple-600">Selon les exercices terminés</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <div className="flex items-center gap-3">
                <Zap className="h-8 w-8 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold text-orange-700">{TOTAL_EXERCISES - completedExercises.size}</div>
                  <div className="text-sm text-orange-600">Exercices restants</div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Overall Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progression générale</span>
              <span className="text-sm text-gray-500">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Débutant</span>
              <span>Intermédiaire</span>
              <span>Avancé</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Vous marquez vous-même un exercice comme terminé ; cette progression est enregistrée dans ce navigateur uniquement.
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100 mb-8">
          <h3 className="text-xl font-bold mb-4">Objectifs de ce parcours</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm">Comprendre les bases de Python</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm">Manipuler des données avec pandas</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm">Créer des visualisations</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="fundamentals" className="space-y-6">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 w-full">
          <TabsTrigger value="fundamentals">Fondamentaux</TabsTrigger>
          <TabsTrigger value="pandas">Pandas</TabsTrigger>
          <TabsTrigger value="visualization">Visualisation</TabsTrigger>
          <TabsTrigger value="ml">Machine Learning</TabsTrigger>
        </TabsList>

        <TabsContent value="fundamentals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Les bases : une première ligne de code</CardTitle>
            </CardHeader>
            <CardContent>
              <CourseHighlight title="Rappel : qu'est-ce qu'une variable ?" type="concept">
                <p className="mb-2">
                  Une variable est un nom associé à une valeur : <code>age = 28</code> associe le nom{" "}
                  <code>age</code> à l'entier 28. Python n'oblige pas à déclarer un type à l'avance : le type
                  appartient à la valeur et il est vérifié à l'exécution (typage dynamique).
                </p>
              </CourseHighlight>

              <CodeExample
                title="Variables et types de données"
                example="variables"
                difficulty="beginner"
              />

              <div className="mt-6">
                <Exercise
                  id={1}
                  title="Créer votre profil Data Scientist"
                  description="Créez un profil data scientist complet avec vos informations personnelles en utilisant différents types de variables Python."
                  solution={`# Créez votre profil data scientist
prenom = "Votre prénom"
nom_famille = "Votre nom"
langages_preferes = ["Python", "SQL", "R"]
annees_experience = 2
specialite = "Machine Learning"
salaire_souhaite = 45000
est_freelance = False
competences = {
    "programmation": ["Python", "SQL"],
    "outils": ["Jupyter", "Git", "Docker"],
    "domaines": ["ML", "Statistiques", "Visualisation"]
}

# Affichage du profil avec formatage avancé
print("=" * 40)
print("MON PROFIL DATA SCIENTIST")
print("=" * 40)
print(f"Nom complet: {prenom} {nom_famille}")
print(f"Langages maîtrisés: {', '.join(langages_preferes)}")
print(f"Années d'expérience: {annees_experience}")
print(f"Spécialité: {specialite}")
print(f"Salaire souhaité: {salaire_souhaite:,}€")
print(f"Statut: {'Freelance' if est_freelance else 'Salarié'}")
print("\\nCompétences détaillées:")
for categorie, items in competences.items():
    print(f"  • {categorie.title()}: {', '.join(items)}")`}
                  difficulty="Débutant"
                  estimatedTime={8}
                  hints={[
                    "Commencez par définir des variables pour votre prénom, nom, et âge",
                    "Utilisez une liste pour stocker vos langages de programmation préférés",
                    "Pensez à utiliser des f-strings pour un affichage formaté",
                    "Ajoutez un dictionnaire pour organiser vos compétences par catégorie"
                  ]}
                  tags={["variables", "types", "f-strings", "listes", "dictionnaires"]}
                />
              </div>

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Structures de données : listes et dictionnaires</CardTitle>
            </CardHeader>
            <CardContent>
              <CourseHighlight title="Zoom sur : choisir la bonne structure" type="info">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold">Liste (list)</h4>
                    <p className="text-sm">Pour des collections ordonnées et modifiables</p>
                    <code className="text-xs">scores = [85, 92, 78, 96]</code>
                  </div>
                  <div>
                    <h4 className="font-semibold">Dictionnaire (dict)</h4>
                    <p className="text-sm">Pour associer des clés à des valeurs</p>
                    <code className="text-xs">{"student = {'nom': 'Alice', 'note': 95}"}</code>
                  </div>
                </div>
              </CourseHighlight>

              <CodeExample 
                title="Structures de données en action"
                example="structures"
                difficulty="intermediate"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pandas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pandas : manipuler des tableaux de données</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>À retenir :</strong>{" "}
                  pandas range les données dans un tableau appelé <code>DataFrame</code>. On filtre, regroupe
                  et calcule sur des colonnes entières, sans écrire de boucle, à la manière d'un tableur mais avec du code
                  que l'on peut relire et rejouer.
                </AlertDescription>
              </Alert>

              <CodeExample
                title="Un premier DataFrame et son exploration"
                example="dataframe"
                difficulty="intermediate"
              />

              <Exercise
                id={2}
                title="Analyser les données d'une équipe"
                description="À partir du DataFrame de l'exemple ci-dessus (cinq personnes inventées), filtrez, regroupez et calculez : salaires, villes, départements, corrélations et colonnes calculées."
                difficulty="Intermédiaire"
                estimatedTime={12}
                hints={[
                  "Commencez par filtrer les données avec des conditions (ex: df[df['Salaire'] > 50000])",
                  "Utilisez groupby() pour regrouper par ville ou département",
                  "La méthode corr() calcule les corrélations linéaires entre colonnes numériques",
                  "Créez de nouvelles colonnes calculées à partir des colonnes existantes",
                  "N'oubliez pas de trier vos résultats avec sort_values()"
                ]}
                tags={["pandas", "analyse", "groupby", "corrélation"]}
                solution={`# Suite de l'exemple ci-dessus : le DataFrame df y est défini.
# Avec cinq lignes, ces moyennes et ces corrélations servent à apprendre la syntaxe :
# elles ne démontrent rien sur une équipe réelle.

# ANALYSE DES DONNÉES DE L'ÉQUIPE
print("=" * 60)
print("RAPPORT D'ANALYSE DE L'ÉQUIPE")
print("=" * 60)

# 1. ANALYSE DES SALAIRES
print("\\nANALYSE DES SALAIRES")
print("-" * 30)
hauts_salaires = df[df['Salaire'] > 50000]
print(f"Employés avec salaire > 50k€: {len(hauts_salaires)}/{len(df)}")
print(hauts_salaires[['Nom', 'Salaire', 'Departement']].to_string(index=False))

# 2. ANALYSE GÉOGRAPHIQUE
print("\\nRÉPARTITION PAR VILLE")
print("-" * 30)
salaire_par_ville = df.groupby('Ville').agg({
    'Salaire': ['mean', 'count', 'std'],
    'Performance': 'mean'
}).round(2)
print(salaire_par_ville)

# 3. ANALYSE PAR DÉPARTEMENT
print("\\nPERFORMANCE PAR DÉPARTEMENT")
print("-" * 30)
stats_dept = df.groupby('Departement').agg({
    'Salaire': 'mean',
    'Performance': 'mean',
    'Experience': 'mean',
    'Age': 'mean'
}).round(2)
print(stats_dept)

# 4. ANALYSE DES CORRÉLATIONS
print("\\nMATRICE DE CORRÉLATION")
print("-" * 30)
correlation = df[['Age', 'Salaire', 'Experience', 'Performance']].corr()
print(correlation.round(3))

# 5. MÉTRIQUES CALCULÉES
print("\\nMÉTRIQUES AVANCÉES")
print("-" * 30)
# Salaire par année d'expérience
df['Salaire_par_exp'] = (df['Salaire'] / df['Experience']).round(0)
# Score de valeur (performance vs salaire)
df['Score_valeur'] = (df['Performance'] / (df['Salaire'] / 10000)).round(2)
# Ancienneté en années
df['Anciennete'] = ((pd.Timestamp.now() - df['Date_embauche']).dt.days / 365).round(1)

# Top performers
print("TOP 3 - Salaire par année d'expérience:")
top_salaire_exp = df.nlargest(3, 'Salaire_par_exp')[['Nom', 'Salaire_par_exp', 'Experience']]
print(top_salaire_exp.to_string(index=False))

print("\\nTOP 3 - Meilleur rapport performance/salaire:")
top_valeur = df.nlargest(3, 'Score_valeur')[['Nom', 'Score_valeur', 'Performance', 'Salaire']]
print(top_valeur.to_string(index=False))

# 6. RÉSUMÉ CHIFFRÉ
print("\\nPOINTS CLÉS")
print("-" * 30)
print(f"Salaire moyen: {df['Salaire'].mean():,.0f}€")
print(f"Performance moyenne: {df['Performance'].mean():.1f}/10")
print(f"Ville la mieux payée: {df.groupby('Ville')['Salaire'].mean().idxmax()}")
print(f"Département le plus performant: {df.groupby('Departement')['Performance'].mean().idxmax()}")
print(f"Corrélation salaire-performance: {df['Salaire'].corr(df['Performance']):.2f}")`}
              />

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Exercice court : les salaires de l'équipe</h4>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="mb-3">
                    <strong>Consigne :</strong>{" "}
                    à partir du même DataFrame, repérez les salaires supérieurs à 50 000 €, le salaire moyen par
                    ville et les corrélations entre colonnes numériques.
                  </p>
                  <Button 
                    onClick={() => toggleExercise(PANDAS_EXERCISE_ID)}
                    variant="outline"
                    size="sm"
                    className="mb-3"
                  >
                    {activeExercise === PANDAS_EXERCISE_ID ? "Masquer la solution" : "Voir la solution"}
                  </Button>
                  {activeExercise === PANDAS_EXERCISE_ID && (
                    <CodeExample 
                      title="Solution : Analyse des salaires"
                      example="salaires"
                    />
                  )}
                  <Button 
                    onClick={() => markCompleted(PANDAS_EXERCISE_ID)}
                    aria-pressed={completedExercises.has(PANDAS_EXERCISE_ID)}
                    size="sm"
                    variant={completedExercises.has(PANDAS_EXERCISE_ID) ? "default" : "outline"}
                    className="mt-2"
                  >
                    {completedExercises.has(PANDAS_EXERCISE_ID) ? "Terminé (annuler)" : "Marquer comme terminé"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visualisation : représenter les données</CardTitle>
            </CardHeader>
            <CardContent>
              <CourseHighlight title="Pourquoi visualiser" type="concept">
                <p className="mb-3">
                  Une étude du MIT (Mary Potter et ses collègues, 2014) rapporte que le cerveau humain peut
                  identifier une image montrée pendant 13 millisecondes seulement. Un graphique bien choisi fait
                  souvent apparaître une tendance ou une valeur aberrante qu'un tableau de chiffres cache.
                </p>
                <div className="bg-purple-50 p-3 rounded">
                  <strong>Un repère :</strong>{" "}
                  un bon graphique se lit vite : un titre qui énonce le message, des axes nommés avec leur unité,
                  peu d'éléments à l'écran.
                </div>
                <SourceNote
                  consulted="10 octobre 2026"
                  sources={[{ label: "MIT News, « In the blink of an eye », 16 janvier 2014", href: "https://news.mit.edu/2014/in-the-blink-of-an-eye-0116" }]}
                />
              </CourseHighlight>

              <p className="text-sm text-gray-600 mb-2">
                L'exemple suivant utilise seaborn en plus de Matplotlib. Seaborn n'est pas installé dans le moteur
                Python du site (Matplotlib l'est) : le code est à lire, ou à exécuter dans votre propre environnement.
                Les données sont tirées au hasard avec une graine fixe, pour l'exemple.
              </p>

              <CodeExample
                title="Matplotlib et seaborn : un tableau de bord de graphiques"
                example="graphiques"
                difficulty="advanced"
              />

              <Exercise
                id={3}
                title="Créer un tableau de bord de graphiques"
                description="Construisez un tableau de bord statique avec plusieurs types de graphiques à partir de ventes e-commerce simulées (la solution utilise seaborn, absent du moteur Python du site)."
                difficulty="Avancé"
                estimatedTime={20}
                hints={[
                  "Commencez par simuler des données avec numpy et pandas",
                  "Utilisez plt.subplots() pour créer une grille de graphiques",
                  "Explorez différents types : line, scatter, bar, heatmap, boxplot",
                  "Ajoutez des couleurs et styles cohérents avec une palette",
                  "N'oubliez pas les titres, légendes et annotations pour la clarté"
                ]}
                tags={["matplotlib", "seaborn", "tableau de bord", "simulation"]}
                solution={`# TABLEAU DE BORD E-COMMERCE SUR DES DONNÉES SIMULÉES
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
from datetime import timedelta
from scipy import stats

# Configuration du style
plt.style.use('seaborn-v0_8-whitegrid')
sns.set_palette("husl")
plt.rcParams['figure.figsize'] = (16, 12)
plt.rcParams['font.size'] = 10

# DONNÉES E-COMMERCE SIMULÉES (tirage aléatoire avec graine fixe, rien de mesuré)
# Les colonnes Visiteurs, Conversion, Panier_moyen, Retours et Satisfaction sont tirées
# indépendamment les unes des autres : leurs corrélations sont nulles par construction.
np.random.seed(123)
dates = pd.date_range('2023-01-01', '2023-12-31', freq='D')
n_days = len(dates)

# Tendance, saisonnalité annuelle, effet du week-end et bruit, tous choisis pour l'exemple
trend = np.linspace(1000, 1500, n_days)
seasonal = 200 * np.sin(2 * np.pi * np.arange(n_days) / 365.25)
weekend_effect = np.where(pd.Series(dates).dt.dayofweek >= 5, 150, 0)
noise = np.random.normal(0, 100, n_days)

df_ecommerce = pd.DataFrame({
    'Date': dates,
    'Ventes': (trend + seasonal + weekend_effect + noise).astype(int),
    'Visiteurs': np.random.poisson(5000, n_days),
    'Conversion': np.random.uniform(0.02, 0.08, n_days),
    'Panier_moyen': np.random.normal(75, 15, n_days),
    'Retours': np.random.poisson(50, n_days),
    'Satisfaction': np.random.uniform(4.0, 5.0, n_days)
})

# Ajouter des métriques calculées
df_ecommerce['Revenus'] = df_ecommerce['Ventes'] * df_ecommerce['Panier_moyen']
df_ecommerce['Taux_conversion'] = df_ecommerce['Conversion'] * 100
df_ecommerce['Mois'] = df_ecommerce['Date'].dt.month
df_ecommerce['Jour_semaine'] = df_ecommerce['Date'].dt.day_name()

# CRÉATION DU TABLEAU DE BORD
fig = plt.figure(figsize=(20, 16))
fig.suptitle('Tableau de bord e-commerce, données simulées de 2023', 
             fontsize=20, fontweight='bold', y=0.98)

# ÉVOLUTION DES VENTES (Graphique principal)
ax1 = plt.subplot(3, 3, (1, 3))  # Occupe 3 colonnes
df_monthly = df_ecommerce.groupby(df_ecommerce['Date'].dt.to_period('M')).agg({
    'Ventes': 'sum',
    'Revenus': 'sum',
    'Visiteurs': 'sum'
}).reset_index()

ax1_twin = ax1.twinx()
line1 = ax1.plot(df_monthly['Date'].astype(str), df_monthly['Ventes'], 
                'o-', linewidth=3, markersize=8, color='#2E86C1', label='Ventes')
line2 = ax1_twin.plot(df_monthly['Date'].astype(str), df_monthly['Revenus']/1000, 
                     's-', linewidth=3, markersize=8, color='#E74C3C', label='Revenus (k€)')

ax1.set_title('Évolution mensuelle des ventes et des revenus', fontsize=14, fontweight='bold', pad=20)
ax1.set_ylabel('Nombre de Ventes', color='#2E86C1', fontweight='bold')
ax1_twin.set_ylabel('Revenus (k€)', color='#E74C3C', fontweight='bold')
ax1.tick_params(axis='x', rotation=45)
ax1.grid(True, alpha=0.3)

# Légende combinée
lines = line1 + line2
labels = [l.get_label() for l in lines]
ax1.legend(lines, labels, loc='upper left')

# DISTRIBUTION DES VENTES PAR JOUR DE LA SEMAINE
ax2 = plt.subplot(3, 3, 4)
ventes_jour = df_ecommerce.groupby('Jour_semaine')['Ventes'].mean().reindex([
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
])
bars = ax2.bar(range(len(ventes_jour)), ventes_jour.values, 
               color=sns.color_palette("viridis", len(ventes_jour)))
ax2.set_title('Ventes moyennes par jour', fontweight='bold')
ax2.set_xlabel('Jour de la semaine')
ax2.set_ylabel('Ventes moyennes')
ax2.set_xticks(range(len(ventes_jour)))
ax2.set_xticklabels(['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'])

# Ajouter les valeurs sur les barres
for bar, value in zip(bars, ventes_jour.values):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 5,
             f'{value:.0f}', ha='center', va='bottom', fontweight='bold')

# CORRÉLATION VISITEURS VS CONVERSION
ax3 = plt.subplot(3, 3, 5)
scatter = ax3.scatter(df_ecommerce['Visiteurs'], df_ecommerce['Taux_conversion'],
                     c=df_ecommerce['Satisfaction'], s=50, alpha=0.6, cmap='RdYlGn')
z = np.polyfit(df_ecommerce['Visiteurs'], df_ecommerce['Taux_conversion'], 1)
p = np.poly1d(z)
ax3.plot(df_ecommerce['Visiteurs'], p(df_ecommerce['Visiteurs']), 
         "--", color='red', alpha=0.8, linewidth=2)
corr = np.corrcoef(df_ecommerce['Visiteurs'], df_ecommerce['Taux_conversion'])[0,1]
ax3.set_title(f'Visiteurs et conversion (r={corr:.2f})', fontweight='bold')
ax3.set_xlabel('Nombre de visiteurs')
ax3.set_ylabel('Taux de conversion (%)')
plt.colorbar(scatter, ax=ax3, label='Satisfaction')

# HEATMAP DES PERFORMANCES MENSUELLES
ax4 = plt.subplot(3, 3, 6)
perf_matrix = df_ecommerce.pivot_table(
    values=['Ventes', 'Taux_conversion', 'Satisfaction'], 
    index=df_ecommerce['Date'].dt.month,
    aggfunc='mean'
)
# Ordre des lignes explicite : pivot_table trie les colonnes par ordre alphabétique
perf_matrix = perf_matrix[['Ventes', 'Taux_conversion', 'Satisfaction']]
# Normaliser pour la heatmap
perf_normalized = (perf_matrix - perf_matrix.min()) / (perf_matrix.max() - perf_matrix.min())
sns.heatmap(perf_normalized.T, annot=True, cmap='RdYlGn',
           ax=ax4, cbar_kws={'shrink': 0.8})  # étiquettes : numéros de mois et noms des colonnes
ax4.set_title('Indicateurs mensuels normalisés', fontweight='bold')

# DISTRIBUTION DU PANIER MOYEN
ax5 = plt.subplot(3, 3, 7)
ax5.hist(df_ecommerce['Panier_moyen'], bins=30, alpha=0.7, color='skyblue', edgecolor='black')
ax5.axvline(df_ecommerce['Panier_moyen'].mean(), color='red', linestyle='--', 
           linewidth=2, label=f'Moyenne: {df_ecommerce["Panier_moyen"].mean():.1f}€')
ax5.set_title('Distribution du panier moyen', fontweight='bold')
ax5.set_xlabel('Panier moyen (€)')
ax5.set_ylabel('Fréquence')
ax5.legend()

# ÉVOLUTION DE LA SATISFACTION
ax6 = plt.subplot(3, 3, 8)
satisfaction_monthly = df_ecommerce.groupby(df_ecommerce['Date'].dt.to_period('M'))['Satisfaction'].mean()
ax6.plot(satisfaction_monthly.index.astype(str), satisfaction_monthly.values, 
         'o-', linewidth=3, markersize=8, color='green')
ax6.fill_between(range(len(satisfaction_monthly)), satisfaction_monthly.values, 
                alpha=0.3, color='green')
ax6.set_title('Satisfaction client par mois', fontweight='bold')
ax6.set_ylabel('Score satisfaction')
ax6.tick_params(axis='x', rotation=45)
ax6.set_ylim(4.0, 5.0)
ax6.grid(True, alpha=0.3)

# TOP/BOTTOM PERFORMERS (Graphique en barres)
ax7 = plt.subplot(3, 3, 9)
top_days = df_ecommerce.nlargest(5, 'Revenus')[['Date', 'Revenus']]
bottom_days = df_ecommerce.nsmallest(5, 'Revenus')[['Date', 'Revenus']]

y_pos = np.arange(len(top_days))
ax7.barh(y_pos, top_days['Revenus']/1000, color='green', alpha=0.7, label='Top 5')
ax7.barh(y_pos + 6, bottom_days['Revenus']/1000, color='red', alpha=0.7, label='Bottom 5')

ax7.set_yticks(list(y_pos) + list(y_pos + 6))
ax7.set_yticklabels([d.strftime('%d/%m') for d in top_days['Date']] + 
                   [d.strftime('%d/%m') for d in bottom_days['Date']])
ax7.set_title('Meilleurs et moins bons jours', fontweight='bold')
ax7.set_xlabel('Revenus (k€)')
ax7.legend()

plt.tight_layout()
plt.subplots_adjust(top=0.95, hspace=0.3, wspace=0.3)
plt.show()

# RÉSUMÉ CHIFFRÉ
print("\\n" + "=" * 80)
print("RÉSUMÉ CHIFFRÉ DES DONNÉES SIMULÉES DE 2023")
print("=" * 80)
print(f"Chiffre d'affaires total: {df_ecommerce['Revenus'].sum():,.0f}€")
print(f"Nombre total de ventes: {df_ecommerce['Ventes'].sum():,}")
print(f"Visites totales (somme des visiteurs de chaque jour): {df_ecommerce['Visiteurs'].sum():,}")
print(f"Taux de conversion moyen: {df_ecommerce['Taux_conversion'].mean():.2f}%")
print(f"Panier moyen: {df_ecommerce['Panier_moyen'].mean():.2f}€")
print(f"Satisfaction client: {df_ecommerce['Satisfaction'].mean():.2f}/5")
print(f"Meilleur jour: {df_ecommerce.loc[df_ecommerce['Revenus'].idxmax(), 'Date'].strftime('%d/%m/%Y')}")
print(f"Évolution entre le premier et le dernier mois: {((df_monthly['Revenus'].iloc[-1] / df_monthly['Revenus'].iloc[0]) - 1) * 100:.1f}%")

# GRAPHIQUE SUPPLÉMENTAIRE : tendance linéaire et extrapolation
fig, ax = plt.subplots(figsize=(12, 6))
df_trend = df_ecommerce.set_index('Date').resample('W')['Revenus'].sum()

# Revenus hebdomadaires (simulés)
ax.plot(df_trend.index, df_trend.values/1000, 'o-', linewidth=2,
        markersize=6, color='blue', label='Revenus hebdomadaires')

# Droite de tendance (régression linéaire sur le numéro de semaine)
x_numeric = np.arange(len(df_trend))
slope, intercept, r_value, p_value, std_err = stats.linregress(x_numeric, df_trend.values)
trend_line = slope * x_numeric + intercept
ax.plot(df_trend.index, trend_line/1000, '--', color='red', 
        linewidth=2, label=f'Tendance (R²={r_value**2:.3f})')

# Extrapolation de la droite sur les 4 semaines suivantes (ce n'est pas une prévision éprouvée)
future_weeks = 4
future_x = np.arange(len(df_trend), len(df_trend) + future_weeks)
future_trend = slope * future_x + intercept
future_dates = pd.date_range(df_trend.index[-1] + timedelta(weeks=1), periods=future_weeks, freq='W')
ax.plot(future_dates, future_trend/1000, 's-', color='orange', 
        linewidth=2, markersize=8, label='Extrapolation sur 4 semaines')

ax.set_title('Tendance linéaire et extrapolation', fontsize=14, fontweight='bold')
ax.set_ylabel('Revenus hebdomadaires (k€)')
ax.set_xlabel('Période')
ax.legend()
ax.grid(True, alpha=0.3)
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

print(f"\\nExtrapolation de la tendance, revenus de la semaine suivante: {future_trend[0]/1000:.0f}k€")`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ml" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Machine learning : un premier modèle</CardTitle>
            </CardHeader>
            <CardContent>
              <CourseHighlight title="Zoom sur : qu'est-ce que le machine learning ?" type="concept">
                <p className="mb-3">
                  Le machine learning (apprentissage automatique) consiste à ajuster un modèle sur des exemples
                  pour qu'il repère des régularités, puis à l'utiliser sur des données qu'il n'a pas vues.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-blue-50 p-3 rounded">
                    <strong>1. Apprentissage</strong><br />
                    Le modèle est ajusté sur des exemples
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <strong>2. Évaluation</strong><br />
                    On mesure l'erreur sur des données mises de côté
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <strong>3. Prédiction</strong><br />
                    On l'applique à de nouvelles données
                  </div>
                </div>
              </CourseHighlight>

              <CodeExample 
                title="Votre premier modèle prédictif"
                example="modele"
              />

              <Exercise
                id={4}
                title="Comparer des modèles de prédiction de salaires"
                description="Simulez un jeu de données de salaires (à partir d'une formule que vous choisissez), puis comparez plusieurs algorithmes avec une validation croisée. Les données sont inventées : l'objectif est la méthode, pas les valeurs."
                difficulty="Avancé"
                estimatedTime={25}
                hints={[
                  "Simulez un jeu de données avec plusieurs variables (expérience, formation, ville, secteur)",
                  "Comparez plusieurs algorithmes : LinearRegression, RandomForest, GradientBoosting",
                  "Utilisez la validation croisée pour évaluer la stabilité des scores",
                  "Ajoutez des variables dérivées et encodez les catégories en colonnes 0/1 (pd.get_dummies)",
                  "Choisissez le modèle sur la validation, puis lisez le score sur le jeu de test une seule fois"
                ]}
                tags={["scikit-learn", "machine learning", "variables dérivées", "comparaison de modèles"]}
                solution={`# COMPARER PLUSIEURS MODÈLES SUR DES SALAIRES SIMULÉS
import time
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error

print("PRÉDICTION DE SALAIRES SUR DES DONNÉES SIMULÉES")
print("=" * 70)

# SIMULATION DES DONNÉES
# Tout est inventé pour l'exemple : aucun de ces salaires ni de ces coefficients ne décrit le marché réel.
np.random.seed(42)
n_samples = 1000

formations = ['Bac+2', 'Bac+3', 'Bac+5', 'PhD', 'École Commerce', 'École Ingénieur']
villes = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nantes', 'Bordeaux', 'Lille']
secteurs = ['Tech', 'Finance', 'Santé', 'Industrie', 'Commerce', 'Consulting']
tailles_entreprise = ['Startup', 'PME', 'ETI', 'Grand Groupe']

experience = np.random.randint(0, 20, n_samples)
df_salaires = pd.DataFrame({
    'Experience': experience,
    # L'âge dépend de l'expérience : on commence à travailler vers 22 ans, plus ou moins tard
    'Age': 22 + experience + np.random.randint(0, 15, n_samples),
    'Formation': np.random.choice(formations, n_samples),
    'Ville': np.random.choice(villes, n_samples),
    'Secteur': np.random.choice(secteurs, n_samples),
    'Taille_Entreprise': np.random.choice(tailles_entreprise, n_samples),
    'Heures_Semaine': np.random.normal(39, 5, n_samples),
    'Langues_Parlees': np.random.randint(1, 5, n_samples),
    'Certifications': np.random.randint(0, 8, n_samples)
})

# Primes choisies arbitrairement pour chaque catégorie
coeff_formation = {'Bac+2': 0, 'Bac+3': 3000, 'Bac+5': 8000,
                   'PhD': 12000, 'École Commerce': 10000, 'École Ingénieur': 15000}
coeff_ville = {'Paris': 12000, 'Lyon': 3000, 'Marseille': 1000,
               'Toulouse': 2000, 'Nantes': 1500, 'Bordeaux': 1500, 'Lille': 500}
coeff_secteur = {'Tech': 8000, 'Finance': 10000, 'Santé': 5000,
                 'Industrie': 3000, 'Commerce': 0, 'Consulting': 7000}
coeff_taille = {'Startup': -2000, 'PME': 0, 'ETI': 3000, 'Grand Groupe': 8000}

salaire = (
    35000
    + df_salaires['Experience'] * 2000 + (df_salaires['Experience'] ** 1.5) * 200  # effet croissant
    + (df_salaires['Age'] - 22) * 300
    + df_salaires['Formation'].map(coeff_formation)
    + df_salaires['Ville'].map(coeff_ville)
    + df_salaires['Secteur'].map(coeff_secteur)
    + df_salaires['Taille_Entreprise'].map(coeff_taille)
    + np.maximum(df_salaires['Heures_Semaine'] - 40, 0) * 500        # heures supplémentaires
    + df_salaires['Langues_Parlees'] * 1000
    + df_salaires['Certifications'] * 800
    # Deux interactions : un effet qui n'existe que pour certaines combinaisons
    + np.where(df_salaires['Formation'].isin(['École Ingénieur', 'PhD'])
               & (df_salaires['Secteur'] == 'Tech'), 5000, 0)
    + np.where((df_salaires['Ville'] == 'Paris') & (df_salaires['Secteur'] == 'Finance'), 8000, 0)
    + np.random.normal(0, 3000, n_samples)                           # bruit
)
df_salaires['Salaire'] = np.maximum(salaire, 25000)

print("DONNÉES SIMULÉES :")
print(f"   Échantillons : {len(df_salaires):,}")
print(f"   Salaire moyen : {df_salaires['Salaire'].mean():,.0f}€")
print(f"   Écart-type : {df_salaires['Salaire'].std():,.0f}€")
print(f"   Min : {df_salaires['Salaire'].min():,.0f}€")
print(f"   Max : {df_salaires['Salaire'].max():,.0f}€")

# EXPLORATION : salaire moyen par catégorie
print("\\nEXPLORATION :")
print("=" * 50)
for col in ['Formation', 'Ville', 'Secteur', 'Taille_Entreprise']:
    print(f"\\nSalaire moyen par {col} :")
    stats = df_salaires.groupby(col)['Salaire'].agg(['mean', 'count'])
    for categorie, row in stats.iterrows():
        print(f"   {categorie:<15} : {row['mean']:>7.0f}€ (n={int(row['count'])})")

# VARIABLES DÉRIVÉES ET ENCODAGE
# Une fonction unique prépare les données d'entraînement ET les nouveaux cas : même traitement des deux côtés.
CATEGORIES = ['Formation', 'Ville', 'Secteur', 'Taille_Entreprise']

def preparer(df):
    X = df.drop(columns='Salaire', errors='ignore').copy()
    X['Experience_squared'] = X['Experience'] ** 2                       # effet non linéaire
    X['Age_Experience_ratio'] = X['Age'] / (X['Experience'] + 1)
    X['Competences_totales'] = X['Langues_Parlees'] + X['Certifications']
    X['Heures_bonus'] = np.maximum(X['Heures_Semaine'] - 35, 0)
    X['Senior'] = (X['Experience'] >= 10).astype(int)
    X['Tech_ou_Finance'] = X['Secteur'].isin(['Tech', 'Finance']).astype(int)
    # Une colonne 0/1 par catégorie (one-hot). Coder les catégories par 0, 1, 2... (LabelEncoder)
    # inventerait un ordre entre villes ou formations, ce qui égare surtout la régression linéaire.
    return pd.get_dummies(X, columns=CATEGORIES, dtype=int)

X = preparer(df_salaires)
y = df_salaires['Salaire']
print(f"\\nVARIABLES : {X.shape[1]} colonnes après dérivation et encodage")

# DÉCOUPAGE : entraînement (60 %), validation (20 %), test (20 %)
X_temp, X_test, y_temp, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
X_train, X_val, y_train, y_val = train_test_split(X_temp, y_temp, test_size=0.25, random_state=42)

print("\\nRÉPARTITION DES DONNÉES :")
print(f"   Entraînement : {len(X_train)} ({len(X_train)/len(X)*100:.1f}%)")
print(f"   Validation : {len(X_val)} ({len(X_val)/len(X)*100:.1f}%)")
print(f"   Test : {len(X_test)} ({len(X_test)/len(X)*100:.1f}%)")

# ENTRAÎNEMENT ET COMPARAISON DE MODÈLES
print("\\nENTRAÎNEMENT DES MODÈLES :")
print("=" * 50)

models = {
    'Linear Regression': LinearRegression(),
    'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42),
    'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, random_state=42)
}

results = {}
for name, model in models.items():
    print(f"\\nEntraînement {name}...")

    debut = time.perf_counter()
    model.fit(X_train, y_train)
    training_time = time.perf_counter() - debut

    y_pred_train = model.predict(X_train)
    y_pred_val = model.predict(X_val)
    y_pred_test = model.predict(X_test)

    metrics = {
        'train_r2': r2_score(y_train, y_pred_train),
        'val_r2': r2_score(y_val, y_pred_val),
        'test_r2': r2_score(y_test, y_pred_test),
        'train_mae': mean_absolute_error(y_train, y_pred_train),
        'val_mae': mean_absolute_error(y_val, y_pred_val),
        'test_mae': mean_absolute_error(y_test, y_pred_test),
        'val_rmse': np.sqrt(mean_squared_error(y_val, y_pred_val)),
        'training_time': training_time
    }

    # Validation croisée à 5 plis sur l'entraînement
    cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='r2')
    metrics['cv_mean'] = cv_scores.mean()
    metrics['cv_std'] = cv_scores.std()

    results[name] = {'model': model, **metrics}

    print(f"   Terminé en {training_time:.2f}s")
    print(f"   R² : Train={metrics['train_r2']:.3f} | Val={metrics['val_r2']:.3f} | Test={metrics['test_r2']:.3f}")
    print(f"   MAE : Train={metrics['train_mae']:.0f} | Val={metrics['val_mae']:.0f} | Test={metrics['test_mae']:.0f}")
    print(f"   CV : {metrics['cv_mean']:.3f} ± {metrics['cv_std']:.3f}")

# CHOIX DU MODÈLE : sur la validation, jamais sur le test
best_model_name = max(results, key=lambda k: results[k]['val_r2'])
best_model = results[best_model_name]['model']
best_metrics = results[best_model_name]

print(f"\\nMEILLEUR MODÈLE SUR LA VALIDATION : {best_model_name}")
print(f"   R² validation : {best_metrics['val_r2']:.3f}")
print(f"   MAE validation : {best_metrics['val_mae']:.0f}€")
print(f"   Écart-type de la validation croisée : {best_metrics['cv_std']:.3f}")

# La régression linéaire gagne ici parce que les salaires ont été fabriqués par une formule presque additive :
# sur de vraies données, le classement pourrait être tout autre.

# Importance des variables du Gradient Boosting (la régression linéaire n'en a pas : on lirait ses coefficients)
gb = results['Gradient Boosting']['model']
feature_importance = pd.DataFrame({
    'Feature': X.columns,
    'Importance': gb.feature_importances_
}).sort_values('Importance', ascending=False)

print("\\nLES 10 VARIABLES LES PLUS UTILISÉES PAR LE GRADIENT BOOSTING :")
for i, (_, row) in enumerate(feature_importance.head(10).iterrows()):
    bar = "█" * int(row['Importance'] * 50)
    print(f"   {i+1:2d}. {row['Feature']:<24} : {bar} {row['Importance']:.3f}")

# PRÉDICTIONS SUR TROIS CAS INVENTÉS
print("\\nPRÉDICTIONS SUR TROIS CAS INVENTÉS :")
print("=" * 50)

scenarios = pd.DataFrame([
    {'nom': 'Junior Dev Paris', 'Experience': 2, 'Age': 25, 'Heures_Semaine': 39,
     'Langues_Parlees': 2, 'Certifications': 1, 'Formation': 'École Ingénieur',
     'Ville': 'Paris', 'Secteur': 'Tech', 'Taille_Entreprise': 'Startup'},
    {'nom': 'Senior Finance Paris', 'Experience': 12, 'Age': 38, 'Heures_Semaine': 45,
     'Langues_Parlees': 3, 'Certifications': 4, 'Formation': 'École Commerce',
     'Ville': 'Paris', 'Secteur': 'Finance', 'Taille_Entreprise': 'Grand Groupe'},
    {'nom': 'Consultant Lyon', 'Experience': 7, 'Age': 32, 'Heures_Semaine': 42,
     'Langues_Parlees': 3, 'Certifications': 3, 'Formation': 'Bac+5',
     'Ville': 'Lyon', 'Secteur': 'Consulting', 'Taille_Entreprise': 'ETI'},
])

# reindex : les colonnes absentes des trois cas (par exemple Ville_Nantes) sont ajoutées à 0
X_scenarios = preparer(scenarios.drop(columns='nom')).reindex(columns=X.columns, fill_value=0)
predictions = best_model.predict(X_scenarios)

for (_, cas), prediction in zip(scenarios.iterrows(), predictions):
    print(f"\\n{cas['nom']} :")
    print(f"   Salaire prédit : {prediction:,.0f}€")
    print(f"   Expérience : {cas['Experience']} ans")
    print(f"   Âge : {cas['Age']} ans")
    print(f"   Heures/semaine : {cas['Heures_Semaine']}h")

# BILAN
print("\\nRÉSUMÉ DES PERFORMANCES :")
print("=" * 50)
print(f"   R² sur le jeu de test : {best_metrics['test_r2']:.3f}")
print(f"   Erreur absolue moyenne sur le test : {best_metrics['test_mae']:,.0f}€")
print(f"   Temps d'entraînement : {best_metrics['training_time']:.2f}s")

print("\\nLes salaires viennent d'une formule inventée : un R² élevé montre que le modèle retrouve cette")
print("formule, pas qu'il saurait prédire de vrais salaires. À valider sur des données réelles avant tout usage.")`}
              />

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Exercice final : un modèle complet</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="mb-3">
                    <strong>Consigne :</strong>{" "}
                    simulez des salaires qui dépendent de l'expérience, de l'âge, de la formation et de la ville,
                    puis entraînez un modèle pour les prédire et mesurez-le sur des données de test.
                  </p>
                  <Button 
                    onClick={() => toggleExercise(FINAL_EXERCISE_ID)}
                    variant="outline"
                    size="sm"
                    className="mb-3"
                  >
                    {activeExercise === FINAL_EXERCISE_ID ? "Masquer la solution" : "Voir la solution complète"}
                  </Button>
                  {activeExercise === FINAL_EXERCISE_ID && (
                    <CodeExample 
                      title="Solution : Modèle de prédiction de salaires"
                      example="projet-final"
                    />
                  )}
                  <Button 
                    onClick={() => markCompleted(FINAL_EXERCISE_ID)}
                    aria-pressed={completedExercises.has(FINAL_EXERCISE_ID)}
                    size="sm"
                    variant={completedExercises.has(FINAL_EXERCISE_ID) ? "default" : "outline"}
                    className="mt-2"
                  >
                    {completedExercises.has(FINAL_EXERCISE_ID) ? "Projet terminé (annuler)" : "Marquer le projet comme terminé"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
        <h3 className="text-xl font-bold mb-4">Récapitulatif</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Ce que ce parcours aborde :</h4>
            <ul className="text-sm space-y-1">
              <li>• Variables, listes et dictionnaires Python</li>
              <li>• Manipulation de données avec pandas</li>
              <li>• Création de visualisations</li>
              <li>• Construction d'un modèle ML</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Pour continuer :</h4>
            <ul className="text-sm space-y-1">
              <li>
                • Le cours{" "}
                <Link to="/courses/programming/python-basics" className="text-blue-700 underline">
                  Python pour la data science
                </Link>
                , dont les exemples et les exercices s'exécutent dans le navigateur
              </li>
              <li>• Approfondir NumPy pour le calcul scientifique</li>
              <li>• Explorer d'autres algorithmes de machine learning</li>
              <li>• Apprendre à interroger des API et à collecter des pages web</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    </MasterclassContext.Provider>
  );
};

export default PythonMasterclass;
