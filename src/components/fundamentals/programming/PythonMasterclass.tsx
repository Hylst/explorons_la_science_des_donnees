
import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Code, Play, Lightbulb, Trophy, Target, Zap, Brain } from "lucide-react";
import CourseHighlight from "@/components/courses/CourseHighlight";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Numéros des exercices suivis par le tableau de bord. Les quatre <Exercise> ont les identifiants 1 à 4 ;
// les deux exercices écrits directement dans le JSX (Pandas, exercice final) ont les leurs, sinon
// compléter l'un marquait aussi l'autre comme terminé.
const PANDAS_EXERCISE_ID = 5;
const FINAL_EXERCISE_ID = 6;
const TOTAL_EXERCISES = 6;

// Sorties réelles des exemples déterministes, obtenues en exécutant le code affiché avec Python 3.12.
// Les exemples qui dépendent de pandas, matplotlib ou scikit-learn n'ont pas de sortie : rien n'est inventé.
const VARIABLES_OUTPUT = `Alice a 28 ans et mesure 1.65m
Type de nom: str
Type d'age: int
Type de taille: float
Age en string: '28' (type: str)`;

const STRUCTURES_OUTPUT = `📊 Total des ventes : 97,000€
📈 Moyenne mensuelle : 19,400€
🏆 Meilleur mois : 25,000€
👥 Équipe : 4 membres

👤 Profil de Marie Dupont:
   💼 Poste: Senior Data Analyst
   💰 Salaire: 42,000€

🎯 Mois performants (>20k€): [22000, 25000, 28000]
📊 Performances (en k€): [15.0, 18.0, 22.0, 17.0, 25.0, 28.0]

📝 Longueur des noms: {'Alice': 5, 'Bob': 3, 'Charlie': 7, 'Diana': 5, 'Eve': 3, 'Frank': 5}`;

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
    "Débutant": { color: "bg-green-100 text-green-800", icon: "🌱" },
    "Intermédiaire": { color: "bg-blue-100 text-blue-800", icon: "🚀" },
    "Avancé": { color: "bg-purple-100 text-purple-800", icon: "⭐" }
  }), []);

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
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
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
            <Badge className={difficultyConfig[difficulty as keyof typeof difficultyConfig]?.color || "bg-gray-100 text-gray-800"}>
              {difficultyConfig[difficulty as keyof typeof difficultyConfig]?.icon} {difficulty}
            </Badge>
            <Badge variant="outline" className="text-xs">
              ⏱️ ~{estimatedTime} min
            </Badge>
            {isActive && startTime && (
              <Badge variant="outline" className="text-xs">
                ⏰ {formatTime(timeSpent)}
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
            onClick={isCompleted ? () => toggleExercise(id) : handleComplete}
            className={isCompleted ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                Terminé
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
        <div className="flex gap-2">
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
              <span className="text-sm font-medium text-blue-800">💡 Indice {currentHint + 1}/{hints.length}</span>
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
  code: string;
  language?: string;
  output?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

const CodeExample = ({
  title,
  code,
  language = "python",
  output,
  difficulty = 'beginner'
}: CodeExampleProps) => {
  const [showOutput, setShowOutput] = useState(false);

  const difficultyColors = {
    beginner: 'border-l-green-500',
    intermediate: 'border-l-blue-500',
    advanced: 'border-l-purple-500'
  };

  return (
    <div className={`my-4 border-l-4 ${difficultyColors[difficulty]} pl-4`}>
      <h4 className="font-medium mb-2 flex items-center gap-2">
        <Code className="h-4 w-4" />
        {title}
        {difficulty !== 'beginner' && (
          <Badge className={`text-xs ${
            difficulty === 'intermediate' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
          }`}>
            {difficulty === 'intermediate' ? '🚀 Intermédiaire' : '⭐ Avancé'}
          </Badge>
        )}
      </h4>
      <div className="bg-gray-900 rounded-md overflow-hidden shadow-lg">
        <div className="px-4 py-2 bg-gray-800 text-gray-200 text-sm font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              🐍 {language}
            </span>
            <span className="text-xs text-gray-400">|
              {code.split('\n').length} lignes
            </span>
          </div>
          {output && (
            <Button
              size="sm"
              variant="ghost"
              className="text-green-400 hover:text-green-300 transition-colors"
              onClick={() => setShowOutput(prev => !prev)}
            >
              <Play className="h-3 w-3 mr-1" />
              {showOutput ? "Masquer la sortie" : "Voir la sortie"}
            </Button>
          )}
        </div>
        <pre className="p-4 text-sm text-gray-300 overflow-x-auto font-mono leading-relaxed">
          <code>{code}</code>
        </pre>
        {output && showOutput && (
          <div className="border-t border-gray-700 bg-gray-800 p-4">
            <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
              <Target className="h-3 w-3" />
              Sortie réelle de ce code (exécuté avec Python 3.12) :
            </div>
            <pre className="text-sm text-green-400 whitespace-pre-wrap">{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Python Masterclass with modern ES6+ features and interactive learning
const PythonMasterclass = () => {
  const [activeExercise, setActiveExercise] = useState<number | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());

  // Progression réelle : part des exercices marqués terminés
  const completionRate = Math.round((completedExercises.size / TOTAL_EXERCISES) * 100);

  // Le niveau découle du nombre d'exercices terminés
  const skillLevel = completedExercises.size >= 4 ? 'advanced' : completedExercises.size >= 2 ? 'intermediate' : 'beginner';

  const toggleExercise = useCallback((exerciseId: number) => {
    setActiveExercise(prev => (prev === exerciseId ? null : exerciseId));
  }, []);

  const markCompleted = useCallback((exerciseId: number) => {
    setCompletedExercises(prev => new Set([...prev, exerciseId]));
  }, []);

  // Skill level badge configuration
  const skillBadgeConfig = useMemo(() => {
    const configs = {
      beginner: { color: 'bg-green-100 text-green-800', icon: '🌱', label: 'Débutant' },
      intermediate: { color: 'bg-blue-100 text-blue-800', icon: '🚀', label: 'Intermédiaire' },
      advanced: { color: 'bg-purple-100 text-purple-800', icon: '⭐', label: 'Avancé' }
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
              <span className="text-2xl">🐍</span>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Python : Votre Premier Allié en Data Science
            </h2>
            <Badge className="bg-blue-100 text-blue-800">Cours Complet</Badge>
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
                  <span className="text-lg">{skillBadgeConfig.icon}</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-700">{skillBadgeConfig.label}</div>
                  <div className="text-sm text-purple-600">Niveau actuel</div>
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
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100 mb-8">
          <h3 className="text-xl font-bold mb-4">🎯 Objectifs de cette masterclass</h3>
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
          <TabsTrigger value="fundamentals">🏗️ Fondamentaux</TabsTrigger>
          <TabsTrigger value="pandas">🐼 Pandas</TabsTrigger>
          <TabsTrigger value="visualization">📊 Visualisation</TabsTrigger>
          <TabsTrigger value="ml">🤖 Machine Learning</TabsTrigger>
        </TabsList>

        <TabsContent value="fundamentals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🚀 Les Bases : Votre Première Ligne de Code</CardTitle>
            </CardHeader>
            <CardContent>
              <CourseHighlight title="💡 Rappel : Qu'est-ce qu'une variable ?" type="concept">
                <p className="mb-2">
                  Une variable est comme une boîte étiquetée où vous rangez des informations. 
                  En Python, vous n'avez même pas besoin de dire quel type d'objet vous mettez dedans !
                </p>
                <div className="bg-blue-50 p-3 rounded text-sm">
                  <strong>Analogie :</strong> Si votre cerveau était un entrepôt, les variables seraient 
                  les étagères étiquetées où vous stockez vos souvenirs.
                </div>
              </CourseHighlight>

              <CodeExample 
                title="Variables et types de données"
                code={`# Python comprend automatiquement le type !
nom = "Alice"                    # Chaîne de caractères (string)
age = 28                        # Nombre entier (integer)
taille = 1.65                   # Nombre décimal (float)
est_data_scientist = True       # Booléen (True/False)

# Affichage intelligent avec f-strings
print(f"{nom} a {age} ans et mesure {taille}m")
# Résultat : Alice a 28 ans et mesure 1.65m

# Python devine le type automatiquement
print(f"Type de nom: {type(nom).__name__}")
print(f"Type d'age: {type(age).__name__}")
print(f"Type de taille: {type(taille).__name__}")

# Conversion de types
age_str = str(age)
taille_int = int(taille)
print(f"Age en string: '{age_str}' (type: {type(age_str).__name__})")`}
                output={VARIABLES_OUTPUT}
                difficulty="beginner"
              />

              <div className="mt-6">
                <Exercise
                  id={1}
                  title="🏃‍♀️ Créer votre Profil Data Scientist"
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
print("🚀 MON PROFIL DATA SCIENTIST 🚀")
print("=" * 40)
print(f"👋 Nom complet: {prenom} {nom_famille}")
print(f"💻 Langages maîtrisés: {', '.join(langages_preferes)}")
print(f"📈 Années d'expérience: {annees_experience}")
print(f"🎯 Spécialité: {specialite}")
print(f"💰 Salaire souhaité: {salaire_souhaite:,}€")
print(f"🏢 Statut: {'Freelance' if est_freelance else 'Salarié'}")
print("\\n🛠️ Compétences détaillées:")
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

              <Exercise
                id={2}
                title="🎯 Analyse Avancée des Données RH"
                description="Utilisez pandas pour analyser les données d'employés et découvrir des insights cachés sur les salaires, performances et tendances."
                difficulty="Intermédiaire"
                estimatedTime={12}
                hints={[
                  "Commencez par filtrer les données avec des conditions (ex: df[df['Salaire'] > 50000])",
                  "Utilisez groupby() pour regrouper par ville ou département",
                  "La méthode corr() révèle les relations entre variables numériques",
                  "Créez de nouvelles colonnes calculées pour des insights plus profonds",
                  "N'oubliez pas de trier vos résultats avec sort_values()"
                ]}
                tags={["pandas", "analyse", "groupby", "corrélation"]}
                solution={`# Suite du DataFrame précédent...

# 🎯 ANALYSE COMPLÈTE DES DONNÉES RH
print("=" * 60)
print("📊 RAPPORT D'ANALYSE DES RESSOURCES HUMAINES")
print("=" * 60)

# 1. 💰 ANALYSE DES SALAIRES
print("\\n1️⃣ 💰 ANALYSE DES SALAIRES")
print("-" * 30)
hauts_salaires = df[df['Salaire'] > 50000]
print(f"Employés avec salaire > 50k€: {len(hauts_salaires)}/{len(df)}")
print(hauts_salaires[['Nom', 'Salaire', 'Departement']].to_string(index=False))

# 2. 🏙️ ANALYSE GÉOGRAPHIQUE
print("\\n2️⃣ 🏙️ RÉPARTITION PAR VILLE")
print("-" * 30)
salaire_par_ville = df.groupby('Ville').agg({
    'Salaire': ['mean', 'count', 'std'],
    'Performance': 'mean'
}).round(2)
print(salaire_par_ville)

# 3. 🏢 ANALYSE PAR DÉPARTEMENT
print("\\n3️⃣ 🏢 PERFORMANCE PAR DÉPARTEMENT")
print("-" * 30)
stats_dept = df.groupby('Departement').agg({
    'Salaire': 'mean',
    'Performance': 'mean',
    'Experience': 'mean',
    'Age': 'mean'
}).round(2)
print(stats_dept)

# 4. 🔗 ANALYSE DES CORRÉLATIONS
print("\\n4️⃣ 🔗 MATRICE DE CORRÉLATION")
print("-" * 30)
correlation = df[['Age', 'Salaire', 'Experience', 'Performance']].corr()
print(correlation.round(3))

# 5. 📊 MÉTRIQUES CALCULÉES
print("\\n5️⃣ 📊 MÉTRIQUES AVANCÉES")
print("-" * 30)
# Salaire par année d'expérience
df['Salaire_par_exp'] = (df['Salaire'] / df['Experience']).round(0)
# Score de valeur (performance vs salaire)
df['Score_valeur'] = (df['Performance'] / (df['Salaire'] / 10000)).round(2)
# Ancienneté en années
df['Anciennete'] = ((pd.Timestamp.now() - df['Date_embauche']).dt.days / 365).round(1)

# Top performers
print("🏆 TOP 3 - Salaire par année d'expérience:")
top_salaire_exp = df.nlargest(3, 'Salaire_par_exp')[['Nom', 'Salaire_par_exp', 'Experience']]
print(top_salaire_exp.to_string(index=False))

print("\\n⭐ TOP 3 - Meilleur rapport performance/salaire:")
top_valeur = df.nlargest(3, 'Score_valeur')[['Nom', 'Score_valeur', 'Performance', 'Salaire']]
print(top_valeur.to_string(index=False))

# 6. 🎯 INSIGHTS AUTOMATIQUES
print("\\n6️⃣ 🎯 INSIGHTS CLÉS")
print("-" * 30)
print(f"💡 Salaire moyen: {df['Salaire'].mean():,.0f}€")
print(f"💡 Performance moyenne: {df['Performance'].mean():.1f}/10")
print(f"💡 Ville la mieux payée: {df.groupby('Ville')['Salaire'].mean().idxmax()}")
print(f"💡 Département le plus performant: {df.groupby('Departement')['Performance'].mean().idxmax()}")
print(f"💡 Corrélation salaire-performance: {df['Salaire'].corr(df['Performance']):.2f}")`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📚 Structures de Données : Vos Outils d'Organisation</CardTitle>
            </CardHeader>
            <CardContent>
              <CourseHighlight title="🎯 Zoom sur : Choisir la bonne structure" type="info">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold">📋 Liste (list)</h5>
                    <p className="text-sm">Pour des collections ordonnées et modifiables</p>
                    <code className="text-xs">scores = [85, 92, 78, 96]</code>
                  </div>
                  <div>
                    <h5 className="font-semibold">📖 Dictionnaire (dict)</h5>
                    <p className="text-sm">Pour associer des clés à des valeurs</p>
                    <code className="text-xs">{"student = {'nom': 'Alice', 'note': 95}"}</code>
                  </div>
                </div>
              </CourseHighlight>

              <CodeExample 
                title="Structures de données en action"
                code={`# 1. LISTES : Collections ordonnées et dynamiques
ventes_mensuelles = [15000, 18000, 22000, 17000, 25000]
equipe_data_science = ["Alice", "Bob", "Charlie", "Diana"]

# Opérations courantes sur les listes
print(f"📊 Total des ventes : {sum(ventes_mensuelles):,}€")
print(f"📈 Moyenne mensuelle : {sum(ventes_mensuelles) / len(ventes_mensuelles):,.0f}€")
print(f"🏆 Meilleur mois : {max(ventes_mensuelles):,}€")
print(f"👥 Équipe : {len(equipe_data_science)} membres")

# Ajout et modification
ventes_mensuelles.append(28000)  # Nouveau mois
equipe_data_science.extend(["Eve", "Frank"])  # Nouvelles recrues

# 2. DICTIONNAIRES : Données structurées et flexibles
employe = {
    "nom": "Marie Dupont",
    "poste": "Senior Data Analyst", 
    "salaire": 42000,
    "competences": ["Python", "SQL", "Tableau"],
    "projets_termines": 12,
    "certifications": {"AWS": True, "Google Cloud": False}
}

# Accès et modification avancés
print(f"\\n👤 Profil de {employe['nom']}:")
print(f"   💼 Poste: {employe['poste']}")
print(f"   💰 Salaire: {employe['salaire']:,}€")

# Promotion et mise à jour
employe["salaire"] *= 1.15  # Augmentation de 15%
employe["competences"].append("Machine Learning")
employe["poste"] = "Lead Data Scientist"

# 3. COMPRÉHENSIONS : Élégance et performance
# Filtrage traditionnel vs pythonique
bons_mois_traditionnel = []
for vente in ventes_mensuelles:
    if vente > 20000:
        bons_mois_traditionnel.append(vente)

# Version pythonique (plus rapide et lisible)
bons_mois = [vente for vente in ventes_mensuelles if vente > 20000]
performances = [vente / 1000 for vente in ventes_mensuelles]  # En milliers

print(f"\\n🎯 Mois performants (>20k€): {bons_mois}")
print(f"📊 Performances (en k€): {performances}")

# Compréhension de dictionnaire (avancé)
stats_equipe = {membre: len(membre) for membre in equipe_data_science}
print(f"\\n📝 Longueur des noms: {stats_equipe}")`}
                output={STRUCTURES_OUTPUT}
                difficulty="intermediate"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pandas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🐼 Pandas : Excel sous Stéroïdes</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Analogie :</strong> Si Excel est une calculatrice, pandas est un supercalculateur. 
                  Imaginez pouvoir traiter des millions de lignes aussi facilement qu'une feuille Excel !
                </AlertDescription>
              </Alert>

              <CodeExample 
                title="Votre premier DataFrame - Prenez les données en main"
                code={`import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Création d'un DataFrame enrichi - comme une base de données
data = {
    'Nom': ['Alice Martin', 'Bob Dupont', 'Charlie Leroy', 'Diana Chen', 'Eve Moreau'],
    'Age': [25, 30, 35, 28, 32],
    'Ville': ['Paris', 'Lyon', 'Marseille', 'Paris', 'Nice'],
    'Salaire': [45000, 52000, 48000, 51000, 49000],
    'Experience': [2, 5, 8, 3, 6],
    'Departement': ['Data Science', 'Engineering', 'Data Science', 'Product', 'Data Science'],
    'Date_embauche': pd.date_range('2020-01-01', periods=5, freq='6ME'),
    'Performance': [8.5, 9.2, 7.8, 8.9, 9.0]
}

df = pd.DataFrame(data)

# Les 7 commandements de l'exploration de données
print("=" * 50)
print("🚀 EXPLORATION COMPLÈTE DES DONNÉES 🚀")
print("=" * 50)

print("\\n1️⃣ 📊 Aperçu des premières lignes:")
print(df.head(3))

print("\\n2️⃣ 📏 Forme du dataset:")
print(f"   Lignes: {df.shape[0]}, Colonnes: {df.shape[1]}")

print("\\n3️⃣ 🔍 Informations sur les colonnes:")
df.info()  # affiche lui-même le résumé (print(df.info()) afficherait aussi « None »)

print("\\n4️⃣ 📈 Statistiques descriptives (numériques):")
print(df.describe().round(2))

print("\\n5️⃣ 🎯 Vérification des valeurs manquantes:")
valeurs_manquantes = df.isnull().sum()
print(f"   Total: {valeurs_manquantes.sum()} valeurs manquantes")
if valeurs_manquantes.sum() > 0:
    print(valeurs_manquantes[valeurs_manquantes > 0])
else:
    print("   ✅ Aucune valeur manquante détectée!")

print("\\n6️⃣ 🏷️ Types de données par colonne:")
for col, dtype in df.dtypes.items():
    print(f"   {col}: {dtype}")

print("\\n7️⃣ 🔢 Valeurs uniques par colonne catégorielle:")
categorical_cols = ['Ville', 'Departement']
for col in categorical_cols:
    print(f"   {col}: {df[col].nunique()} valeurs uniques")
    print(f"      → {list(df[col].unique())}")`}
                difficulty="intermediate"
              />

              <div className="mt-6">
                <h4 className="font-semibold mb-3">🎯 Exercice Pratique #2</h4>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="mb-3">
                    <strong>Mission :</strong> Analysez les salaires de l'équipe et trouvez des insights !
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
                      code={`# Suite du DataFrame précédent...

# 1. FILTRAGE : Qui gagne plus de 50k€ ?
hauts_salaires = df[df['Salaire'] > 50000]
print("💰 Employés avec salaire > 50k€ :")
print(hauts_salaires[['Nom', 'Salaire']])

# 2. GROUPEMENT : Salaire moyen par ville
salaire_par_ville = df.groupby('Ville')['Salaire'].mean().round(0)
print("\\n🏙️ Salaire moyen par ville :")
print(salaire_par_ville)

# 3. CORRELATION : Relation âge/salaire/expérience
correlation = df[['Age', 'Salaire', 'Experience']].corr()
print("\\n🔗 Matrice de corrélation :")
print(correlation)

# 4. NOUVELLE COLONNE : Calcul du salaire par année d'expérience
df['Salaire_par_exp'] = df['Salaire'] / df['Experience']
print("\\n📊 Salaire par année d'expérience :")
print(df[['Nom', 'Salaire_par_exp']].sort_values('Salaire_par_exp', ascending=False))`}
                    />
                  )}
                  <Button 
                    onClick={() => markCompleted(PANDAS_EXERCISE_ID)}
                    size="sm"
                    variant={completedExercises.has(PANDAS_EXERCISE_ID) ? "default" : "outline"}
                    className="mt-2"
                  >
                    {completedExercises.has(PANDAS_EXERCISE_ID) ? "✅ Terminé" : "Marquer comme terminé"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>📊 Visualisation : Faire Parler les Données</CardTitle>
            </CardHeader>
            <CardContent>
              <CourseHighlight title="🎨 Philosophie : Une image vaut mille données" type="concept">
                <p className="mb-3">
                  Votre cerveau peut identifier une image vue pendant 13 millisecondes seulement (Mary Potter, MIT, 2014) ! 
                  Une bonne visualisation peut révéler des patterns invisibles dans un tableau de chiffres.
                </p>
                <div className="bg-purple-50 p-3 rounded">
                  <strong>Règle d'or :</strong> Vos graphiques doivent raconter une histoire claire en 5 secondes maximum.
                </div>
              </CourseHighlight>

              <CodeExample 
                title="Matplotlib & Seaborn : Studio de Visualisation Avancé"
                code={`import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# 🎨 CONFIGURATION PROFESSIONNELLE
plt.style.use('seaborn-v0_8-darkgrid')
sns.set_palette("Set2")
plt.rcParams['figure.facecolor'] = 'white'
plt.rcParams['axes.spines.top'] = False
plt.rcParams['axes.spines.right'] = False

# 📊 DONNÉES ENRICHIES POUR ANALYSE COMPLÈTE
np.random.seed(42)
dates = pd.date_range('2023-01-01', periods=12, freq='ME')
df_business = pd.DataFrame({
    'Date': dates,
    'Mois': [d.strftime('%b') for d in dates],
    'Ventes': np.random.normal(20000, 3000, 12).astype(int),
    'Publicité': np.random.normal(3000, 500, 12).astype(int),
    'Satisfaction': np.random.uniform(7.5, 9.5, 12).round(1),
    'Concurrence': np.random.choice(['Faible', 'Moyenne', 'Forte'], 12),
    'Saison': ['Hiver']*3 + ['Printemps']*3 + ['Été']*3 + ['Automne']*3
})

# Ajouter corrélation réaliste
df_business['Ventes'] = (df_business['Publicité'] * 6.5 + 
                        np.random.normal(0, 1000, 12)).astype(int)

print("=" * 60)
print("📊 DASHBOARD DE VISUALISATION BUSINESS")
print("=" * 60)

# 🎯 GRAPHIQUE 1: ÉVOLUTION TEMPORELLE MULTI-MÉTRIQUES
fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(15, 10))
fig.suptitle('📈 ANALYSE BUSINESS COMPLÈTE - 2023', fontsize=16, fontweight='bold')

# Évolution des ventes avec zone de confiance
ax1.plot(df_business['Date'], df_business['Ventes'], 
         marker='o', linewidth=3, color='#2E86C1', markersize=8)
ax1.fill_between(df_business['Date'], 
                df_business['Ventes'] - df_business['Ventes'].std(),
                df_business['Ventes'] + df_business['Ventes'].std(),
                alpha=0.2, color='#2E86C1')
ax1.set_title('💰 Évolution des Ventes (avec zone de confiance)', fontweight='bold')
ax1.set_ylabel('Ventes (€)')
ax1.grid(True, alpha=0.3)
ax1.tick_params(axis='x', rotation=45)

# Corrélation Publicité vs Ventes avec régression
scatter = ax2.scatter(df_business['Publicité'], df_business['Ventes'], 
                     c=df_business['Satisfaction'], s=150, 
                     cmap='viridis', alpha=0.8, edgecolors='black')
z = np.polyfit(df_business['Publicité'], df_business['Ventes'], 1)
p = np.poly1d(z)
ax2.plot(df_business['Publicité'], p(df_business['Publicité']), 
         "--", color='red', linewidth=2, alpha=0.8)
corr_coef = np.corrcoef(df_business['Publicité'], df_business['Ventes'])[0,1]
ax2.set_title(f'🎯 Publicité vs Ventes (r={corr_coef:.2f})', fontweight='bold')
ax2.set_xlabel('Budget Publicité (€)')
ax2.set_ylabel('Ventes (€)')
plt.colorbar(scatter, ax=ax2, label='Satisfaction Client')

# Distribution des ventes par saison
sns.boxplot(data=df_business, x='Saison', y='Ventes', ax=ax3)
ax3.set_title('🌟 Distribution des Ventes par Saison', fontweight='bold')
ax3.set_ylabel('Ventes (€)')

# Heatmap de corrélation
corr_matrix = df_business[['Ventes', 'Publicité', 'Satisfaction']].corr()
sns.heatmap(corr_matrix, annot=True, cmap='RdYlBu_r', center=0, 
           square=True, ax=ax4, cbar_kws={'shrink': 0.8})
ax4.set_title('🔗 Matrice de Corrélation', fontweight='bold')

plt.tight_layout()
plt.show()

# 📊 GRAPHIQUE AVANCÉ: ANALYSE MULTI-DIMENSIONNELLE
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))

# Graphique en aires empilées
months = range(len(df_business))
ax1.fill_between(months, 0, df_business['Ventes'], alpha=0.7, color='#3498DB', label='Ventes')
ax1.fill_between(months, 0, df_business['Publicité']*5, alpha=0.5, color='#E74C3C', label='Publicité x5')
ax1.set_title('📊 Évolution Comparative (Aires)', fontweight='bold')
ax1.set_xlabel('Mois')
ax1.set_ylabel('Montant (€)')
ax1.legend()
ax1.grid(True, alpha=0.3)

# Graphique radar (simulation)
angles = np.linspace(0, 2*np.pi, 4, endpoint=False).tolist()
angles += angles[:1]  # Fermer le cercle

metrics = ['Ventes', 'Publicité', 'Satisfaction', 'Performance']
values = [
    df_business['Ventes'].mean()/1000,  # Normaliser
    df_business['Publicité'].mean()/1000,
    df_business['Satisfaction'].mean(),
    8.2  # Performance simulée
]
values += values[:1]

ax2 = plt.subplot(122, projection='polar')
ax2.plot(angles, values, 'o-', linewidth=2, color='#9B59B6')
ax2.fill(angles, values, alpha=0.25, color='#9B59B6')
ax2.set_xticks(angles[:-1])
ax2.set_xticklabels(metrics)
ax2.set_title('🎯 Performance Radar', fontweight='bold', pad=20)

plt.tight_layout()
plt.show()

# 📈 INSIGHTS AUTOMATIQUES
print("\\n" + "=" * 50)
print("🔍 INSIGHTS AUTOMATIQUES")
print("=" * 50)
print(f"💡 Ventes par € de publicité: {(df_business['Ventes'].sum() / df_business['Publicité'].sum()):.1f}€")
print(f"💡 Meilleur mois: {df_business.loc[df_business['Ventes'].idxmax(), 'Mois']} ({df_business['Ventes'].max():,}€)")
print(f"💡 Satisfaction moyenne: {df_business['Satisfaction'].mean():.1f}/10")
print(f"💡 Corrélation pub-ventes: {np.corrcoef(df_business['Publicité'], df_business['Ventes'])[0,1]:.2f}")
print(f"💡 Évolution entre le premier et le dernier mois: {((df_business['Ventes'].iloc[-1] / df_business['Ventes'].iloc[0]) - 1) * 100:.1f}%")`}
                difficulty="advanced"
              />

              <Exercise
                id={3}
                title="📊 Créer un Dashboard Interactif"
                description="Développez un tableau de bord complet avec plusieurs types de graphiques pour analyser les performances d'une entreprise e-commerce."
                difficulty="Avancé"
                estimatedTime={20}
                hints={[
                  "Commencez par créer des données réalistes avec numpy et pandas",
                  "Utilisez plt.subplots() pour créer une grille de graphiques",
                  "Explorez différents types : line, scatter, bar, heatmap, boxplot",
                  "Ajoutez des couleurs et styles cohérents avec une palette",
                  "N'oubliez pas les titres, légendes et annotations pour la clarté"
                ]}
                tags={["matplotlib", "seaborn", "dashboard", "business-intelligence"]}
                solution={`# 📊 DASHBOARD E-COMMERCE COMPLET
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# 🎨 Configuration du style professionnel
plt.style.use('seaborn-v0_8-whitegrid')
sns.set_palette("husl")
plt.rcParams['figure.figsize'] = (16, 12)
plt.rcParams['font.size'] = 10

# 📈 GÉNÉRATION DE DONNÉES E-COMMERCE RÉALISTES
np.random.seed(123)
dates = pd.date_range('2023-01-01', '2023-12-31', freq='D')
n_days = len(dates)

# Simulation de tendances saisonnières
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

# 🎯 CRÉATION DU DASHBOARD COMPLET
fig = plt.figure(figsize=(20, 16))
fig.suptitle('📊 DASHBOARD E-COMMERCE - ANALYSE ANNUELLE 2023', 
             fontsize=20, fontweight='bold', y=0.98)

# 1️⃣ ÉVOLUTION DES VENTES (Graphique principal)
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

ax1.set_title('📈 ÉVOLUTION MENSUELLE DES PERFORMANCES', fontsize=14, fontweight='bold', pad=20)
ax1.set_ylabel('Nombre de Ventes', color='#2E86C1', fontweight='bold')
ax1_twin.set_ylabel('Revenus (k€)', color='#E74C3C', fontweight='bold')
ax1.tick_params(axis='x', rotation=45)
ax1.grid(True, alpha=0.3)

# Légende combinée
lines = line1 + line2
labels = [l.get_label() for l in lines]
ax1.legend(lines, labels, loc='upper left')

# 2️⃣ DISTRIBUTION DES VENTES PAR JOUR DE LA SEMAINE
ax2 = plt.subplot(3, 3, 4)
ventes_jour = df_ecommerce.groupby('Jour_semaine')['Ventes'].mean().reindex([
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
])
bars = ax2.bar(range(len(ventes_jour)), ventes_jour.values, 
               color=sns.color_palette("viridis", len(ventes_jour)))
ax2.set_title('📅 VENTES MOYENNES PAR JOUR', fontweight='bold')
ax2.set_xlabel('Jour de la semaine')
ax2.set_ylabel('Ventes moyennes')
ax2.set_xticks(range(len(ventes_jour)))
ax2.set_xticklabels(['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'])

# Ajouter les valeurs sur les barres
for bar, value in zip(bars, ventes_jour.values):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 5,
             f'{value:.0f}', ha='center', va='bottom', fontweight='bold')

# 3️⃣ CORRÉLATION VISITEURS VS CONVERSION
ax3 = plt.subplot(3, 3, 5)
scatter = ax3.scatter(df_ecommerce['Visiteurs'], df_ecommerce['Taux_conversion'],
                     c=df_ecommerce['Satisfaction'], s=50, alpha=0.6, cmap='RdYlGn')
z = np.polyfit(df_ecommerce['Visiteurs'], df_ecommerce['Taux_conversion'], 1)
p = np.poly1d(z)
ax3.plot(df_ecommerce['Visiteurs'], p(df_ecommerce['Visiteurs']), 
         "--", color='red', alpha=0.8, linewidth=2)
corr = np.corrcoef(df_ecommerce['Visiteurs'], df_ecommerce['Taux_conversion'])[0,1]
ax3.set_title(f'🎯 VISITEURS vs CONVERSION (r={corr:.2f})', fontweight='bold')
ax3.set_xlabel('Nombre de visiteurs')
ax3.set_ylabel('Taux de conversion (%)')
plt.colorbar(scatter, ax=ax3, label='Satisfaction')

# 4️⃣ HEATMAP DES PERFORMANCES MENSUELLES
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
ax4.set_title('🔥 HEATMAP PERFORMANCES', fontweight='bold')

# 5️⃣ DISTRIBUTION DU PANIER MOYEN
ax5 = plt.subplot(3, 3, 7)
ax5.hist(df_ecommerce['Panier_moyen'], bins=30, alpha=0.7, color='skyblue', edgecolor='black')
ax5.axvline(df_ecommerce['Panier_moyen'].mean(), color='red', linestyle='--', 
           linewidth=2, label=f'Moyenne: {df_ecommerce["Panier_moyen"].mean():.1f}€')
ax5.set_title('💰 DISTRIBUTION PANIER MOYEN', fontweight='bold')
ax5.set_xlabel('Panier moyen (€)')
ax5.set_ylabel('Fréquence')
ax5.legend()

# 6️⃣ ÉVOLUTION DE LA SATISFACTION
ax6 = plt.subplot(3, 3, 8)
satisfaction_monthly = df_ecommerce.groupby(df_ecommerce['Date'].dt.to_period('M'))['Satisfaction'].mean()
ax6.plot(satisfaction_monthly.index.astype(str), satisfaction_monthly.values, 
         'o-', linewidth=3, markersize=8, color='green')
ax6.fill_between(range(len(satisfaction_monthly)), satisfaction_monthly.values, 
                alpha=0.3, color='green')
ax6.set_title('⭐ ÉVOLUTION SATISFACTION CLIENT', fontweight='bold')
ax6.set_ylabel('Score satisfaction')
ax6.tick_params(axis='x', rotation=45)
ax6.set_ylim(4.0, 5.0)
ax6.grid(True, alpha=0.3)

# 7️⃣ TOP/BOTTOM PERFORMERS (Graphique en barres)
ax7 = plt.subplot(3, 3, 9)
top_days = df_ecommerce.nlargest(5, 'Revenus')[['Date', 'Revenus']]
bottom_days = df_ecommerce.nsmallest(5, 'Revenus')[['Date', 'Revenus']]

y_pos = np.arange(len(top_days))
ax7.barh(y_pos, top_days['Revenus']/1000, color='green', alpha=0.7, label='Top 5')
ax7.barh(y_pos + 6, bottom_days['Revenus']/1000, color='red', alpha=0.7, label='Bottom 5')

ax7.set_yticks(list(y_pos) + list(y_pos + 6))
ax7.set_yticklabels([d.strftime('%d/%m') for d in top_days['Date']] + 
                   [d.strftime('%d/%m') for d in bottom_days['Date']])
ax7.set_title('🏆 TOP & BOTTOM JOURS', fontweight='bold')
ax7.set_xlabel('Revenus (k€)')
ax7.legend()

plt.tight_layout()
plt.subplots_adjust(top=0.95, hspace=0.3, wspace=0.3)
plt.show()

# 📊 MÉTRIQUES CLÉS AUTOMATIQUES
print("\\n" + "=" * 80)
print("📊 RÉSUMÉ EXÉCUTIF - MÉTRIQUES CLÉS 2023")
print("=" * 80)
print(f"💰 Chiffre d'affaires total: {df_ecommerce['Revenus'].sum():,.0f}€")
print(f"🛒 Nombre total de ventes: {df_ecommerce['Ventes'].sum():,}")
print(f"👥 Visites totales (somme des visiteurs de chaque jour): {df_ecommerce['Visiteurs'].sum():,}")
print(f"📈 Taux de conversion moyen: {df_ecommerce['Taux_conversion'].mean():.2f}%")
print(f"💳 Panier moyen: {df_ecommerce['Panier_moyen'].mean():.2f}€")
print(f"⭐ Satisfaction client: {df_ecommerce['Satisfaction'].mean():.2f}/5")
print(f"📅 Meilleur jour: {df_ecommerce.loc[df_ecommerce['Revenus'].idxmax(), 'Date'].strftime('%d/%m/%Y')}")
print(f"🎯 Évolution entre le premier et le dernier mois: {((df_monthly['Revenus'].iloc[-1] / df_monthly['Revenus'].iloc[0]) - 1) * 100:.1f}%")

# 🎨 GRAPHIQUE BONUS: Analyse de tendance avec prédiction
fig, ax = plt.subplots(figsize=(12, 6))
df_trend = df_ecommerce.set_index('Date').resample('W')['Revenus'].sum()

# Tendance réelle
ax.plot(df_trend.index, df_trend.values/1000, 'o-', linewidth=2, 
        markersize=6, color='blue', label='Revenus hebdomadaires')

# Ligne de tendance
from scipy import stats
x_numeric = np.arange(len(df_trend))
slope, intercept, r_value, p_value, std_err = stats.linregress(x_numeric, df_trend.values)
trend_line = slope * x_numeric + intercept
ax.plot(df_trend.index, trend_line/1000, '--', color='red', 
        linewidth=2, label=f'Tendance (R²={r_value**2:.3f})')

# Prédiction future (4 semaines)
future_weeks = 4
future_x = np.arange(len(df_trend), len(df_trend) + future_weeks)
future_trend = slope * future_x + intercept
future_dates = pd.date_range(df_trend.index[-1] + timedelta(weeks=1), periods=future_weeks, freq='W')
ax.plot(future_dates, future_trend/1000, 's-', color='orange', 
        linewidth=2, markersize=8, label='Prédiction 4 semaines')

ax.set_title('📈 ANALYSE DE TENDANCE ET PRÉDICTION', fontsize=14, fontweight='bold')
ax.set_ylabel('Revenus hebdomadaires (k€)')
ax.set_xlabel('Période')
ax.legend()
ax.grid(True, alpha=0.3)
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

print(f"\\n🔮 Prédiction revenus semaine prochaine: {future_trend[0]/1000:.0f}k€")`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ml" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🤖 Machine Learning : Votre Premier Modèle</CardTitle>
            </CardHeader>
            <CardContent>
              <CourseHighlight title="🧠 Zoom sur : Qu'est-ce que le Machine Learning ?" type="concept">
                <p className="mb-3">
                  Imaginez enseigner à un enfant à reconnaître des chats en lui montrant 1000 photos. 
                  Le Machine Learning fait pareil : il "apprend" des patterns à partir d'exemples.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-blue-50 p-3 rounded">
                    <strong>1. Apprentissage</strong><br />
                    Le modèle voit des exemples
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <strong>2. Généralisation</strong><br />
                    Il trouve des patterns
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <strong>3. Prédiction</strong><br />
                    Il devine sur du nouveau
                  </div>
                </div>
              </CourseHighlight>

              <CodeExample 
                title="Votre premier modèle prédictif"
                code={`from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import pandas as pd
import numpy as np

# 1. CRÉATION DES DONNÉES
# Simulons la relation entre budget pub et ventes
np.random.seed(42)
budget_pub = np.random.uniform(1000, 5000, 100)
# Les ventes dépendent du budget (avec un peu de bruit)
ventes = budget_pub * 2.5 + np.random.normal(0, 1000, 100)

df_ml = pd.DataFrame({
    'Budget_Publicite': budget_pub,
    'Ventes': ventes
})

print("📊 Aperçu des données :")
print(df_ml.head())

# 2. PRÉPARATION DES DONNÉES
X = df_ml[['Budget_Publicite']]  # Variable explicative
y = df_ml['Ventes']              # Variable à prédire

# Division train/test (70% / 30%)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

print(f"\\n📚 Données d'entraînement : {len(X_train)} exemples")
print(f"🧪 Données de test : {len(X_test)} exemples")

# 3. ENTRAÎNEMENT DU MODÈLE
model = LinearRegression()
model.fit(X_train, y_train)

print(f"\\n🎯 Modèle entraîné !")
print(f"Coefficient : {model.coef_[0]:.2f}")
print(f"Intercept : {model.intercept_:.2f}")
print(f"Équation : Ventes = {model.coef_[0]:.2f} * Budget + {model.intercept_:.2f}")

# 4. PRÉDICTIONS ET ÉVALUATION
y_pred = model.predict(X_test)

mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"\\n📈 Performance du modèle :")
print(f"R² Score : {r2:.3f} ({r2*100:.1f}% de la variance expliquée)")
print(f"MSE : {mse:.0f}")

# 5. PRÉDICTION SUR DE NOUVELLES DONNÉES
nouveaux_budgets = [[3000], [4500], [2000]]
predictions = model.predict(nouveaux_budgets)

print(f"\\n🔮 Prédictions :")
for budget, pred in zip(nouveaux_budgets, predictions):
    print(f"Budget {budget[0]}€ → Ventes prédites : {pred:.0f}€")`}
              />

              <Exercise
                id={4}
                title="🤖 Créer un Système de Prédiction Intelligent"
                description="Développez un modèle de Machine Learning complet pour prédire les salaires en fonction de multiples critères, avec comparaison d'algorithmes et optimisation."
                difficulty="Expert"
                estimatedTime={25}
                hints={[
                  "Créez un dataset réaliste avec plusieurs variables (expérience, formation, ville, secteur)",
                  "Comparez plusieurs algorithmes : LinearRegression, RandomForest, GradientBoosting",
                  "Utilisez la validation croisée pour évaluer la robustesse",
                  "Implémentez le feature engineering (nouvelles variables dérivées)",
                  "Analysez l'importance des variables et générez des insights business"
                ]}
                tags={["scikit-learn", "machine-learning", "feature-engineering", "model-comparison"]}
                solution={`# 🤖 SYSTÈME DE PRÉDICTION DE SALAIRES - SOLUTION EXPERTE
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

# 🎨 Configuration professionnelle
plt.style.use('seaborn-v0_8-whitegrid')
sns.set_palette("Set2")
plt.rcParams['figure.figsize'] = (15, 10)

print("🚀 SYSTÈME DE PRÉDICTION DE SALAIRES - VERSION EXPERTE")
print("=" * 70)

# 1️⃣ GÉNÉRATION DE DONNÉES RÉALISTES ET COMPLEXES
np.random.seed(42)
n_samples = 1000

# Variables catégorielles réalistes
formations = ['Bac+2', 'Bac+3', 'Bac+5', 'PhD', 'École Commerce', 'École Ingénieur']
villes = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nantes', 'Bordeaux', 'Lille']
secteurs = ['Tech', 'Finance', 'Santé', 'Industrie', 'Commerce', 'Consulting']
tailles_entreprise = ['Startup', 'PME', 'ETI', 'Grand Groupe']

# Génération des variables
data = {
    'Experience': np.random.randint(0, 20, n_samples),
    'Age': np.random.randint(22, 60, n_samples),
    'Formation': np.random.choice(formations, n_samples),
    'Ville': np.random.choice(villes, n_samples),
    'Secteur': np.random.choice(secteurs, n_samples),
    'Taille_Entreprise': np.random.choice(tailles_entreprise, n_samples),
    'Heures_Semaine': np.random.normal(39, 5, n_samples),
    'Langues_Parlees': np.random.randint(1, 5, n_samples),
    'Certifications': np.random.randint(0, 8, n_samples)
}

df_salaires = pd.DataFrame(data)

# 🎯 CALCUL RÉALISTE DU SALAIRE AVEC INTERACTIONS COMPLEXES
base_salaire = 35000

# Coefficients réalistes par formation
coeff_formation = {
    'Bac+2': 0, 'Bac+3': 3000, 'Bac+5': 8000, 
    'PhD': 12000, 'École Commerce': 10000, 'École Ingénieur': 15000
}

# Coefficients par ville (coût de la vie)
coeff_ville = {
    'Paris': 12000, 'Lyon': 3000, 'Marseille': 1000,
    'Toulouse': 2000, 'Nantes': 1500, 'Bordeaux': 1500, 'Lille': 500
}

# Coefficients par secteur
coeff_secteur = {
    'Tech': 8000, 'Finance': 10000, 'Santé': 5000,
    'Industrie': 3000, 'Commerce': 0, 'Consulting': 7000
}

# Coefficients par taille d'entreprise
coeff_taille = {
    'Startup': -2000, 'PME': 0, 'ETI': 3000, 'Grand Groupe': 8000
}

# 🧮 CALCUL SOPHISTIQUÉ DU SALAIRE
salaires = []
for idx, row in df_salaires.iterrows():
    salaire = base_salaire
    
    # Impact de l'expérience (non-linéaire)
    exp = row['Experience']
    salaire += exp * 2000 + (exp ** 1.5) * 200  # Rendements croissants
    
    # Impact de l'âge (maturité)
    salaire += (row['Age'] - 22) * 300
    
    # Bonus formation
    salaire += coeff_formation[row['Formation']]
    
    # Ajustement géographique
    salaire += coeff_ville[row['Ville']]
    
    # Prime secteur
    salaire += coeff_secteur[row['Secteur']]
    
    # Bonus taille entreprise
    salaire += coeff_taille[row['Taille_Entreprise']]
    
    # Bonus heures supplémentaires
    if row['Heures_Semaine'] > 40:
        salaire += (row['Heures_Semaine'] - 40) * 500
    
    # Bonus compétences
    salaire += row['Langues_Parlees'] * 1000
    salaire += row['Certifications'] * 800
    
    # Interactions complexes
    if row['Formation'] in ['École Ingénieur', 'PhD'] and row['Secteur'] == 'Tech':
        salaire += 5000  # Synergie tech + formation élite
    
    if row['Ville'] == 'Paris' and row['Secteur'] == 'Finance':
        salaire += 8000  # Prime finance parisienne
    
    # Bruit réaliste
    salaire += np.random.normal(0, 3000)
    
    salaires.append(max(salaire, 25000))  # Salaire minimum

df_salaires['Salaire'] = salaires

print(f"📊 DATASET GÉNÉRÉ :")
print(f"   📈 Échantillons : {len(df_salaires):,}")
print(f"   💰 Salaire moyen : {df_salaires['Salaire'].mean():,.0f}€")
print(f"   📊 Écart-type : {df_salaires['Salaire'].std():,.0f}€")
print(f"   🔻 Min : {df_salaires['Salaire'].min():,.0f}€")
print(f"   🔺 Max : {df_salaires['Salaire'].max():,.0f}€")

# 📊 ANALYSE EXPLORATOIRE AVANCÉE
print("\\n📈 ANALYSE EXPLORATOIRE :")
print("=" * 50)

# Statistiques par catégorie
for col in ['Formation', 'Ville', 'Secteur', 'Taille_Entreprise']:
    print(f"\\n💼 Salaire moyen par {col} :")
    stats = df_salaires.groupby(col)['Salaire'].agg(['mean', 'count']).round(0)
    for idx, row in stats.iterrows():
        print(f"   {idx:<15} : {row['mean']:>6.0f}€ (n={row['count']})")

# 2️⃣ FEATURE ENGINEERING AVANCÉ
print("\\n🔧 FEATURE ENGINEERING :")
print("=" * 50)

# Encodage des variables catégorielles
le_formation = LabelEncoder()
le_ville = LabelEncoder()
le_secteur = LabelEncoder()
le_taille = LabelEncoder()

df_encoded = df_salaires.copy()
df_encoded['Formation_encoded'] = le_formation.fit_transform(df_salaires['Formation'])
df_encoded['Ville_encoded'] = le_ville.fit_transform(df_salaires['Ville'])
df_encoded['Secteur_encoded'] = le_secteur.fit_transform(df_salaires['Secteur'])
df_encoded['Taille_encoded'] = le_taille.fit_transform(df_salaires['Taille_Entreprise'])

# Nouvelles features dérivées
df_encoded['Experience_squared'] = df_encoded['Experience'] ** 2
df_encoded['Age_Experience_ratio'] = df_encoded['Age'] / (df_encoded['Experience'] + 1)
df_encoded['Competences_totales'] = df_encoded['Langues_Parlees'] + df_encoded['Certifications']
df_encoded['Heures_bonus'] = np.maximum(df_encoded['Heures_Semaine'] - 35, 0)
df_encoded['Senior'] = (df_encoded['Experience'] >= 10).astype(int)
df_encoded['Paris'] = (df_encoded['Ville'] == 'Paris').astype(int)
df_encoded['Tech_ou_Finance'] = df_encoded['Secteur'].isin(['Tech', 'Finance']).astype(int)

print("✅ Variables créées :")
print("   🔢 Experience_squared : Effet non-linéaire de l'expérience")
print("   ⚖️ Age_Experience_ratio : Ratio maturité/expérience")
print("   🎯 Competences_totales : Langues + Certifications")
print("   ⏰ Heures_bonus : Heures supplémentaires")
print("   👨‍💼 Senior : Expérience >= 10 ans")
print("   🏙️ Paris : Localisation parisienne")
print("   💼 Tech_ou_Finance : Secteurs premium")

# 3️⃣ PRÉPARATION DES DONNÉES POUR ML
features_numeriques = [
    'Experience', 'Age', 'Heures_Semaine', 'Langues_Parlees', 'Certifications',
    'Formation_encoded', 'Ville_encoded', 'Secteur_encoded', 'Taille_encoded',
    'Experience_squared', 'Age_Experience_ratio', 'Competences_totales',
    'Heures_bonus', 'Senior', 'Paris', 'Tech_ou_Finance'
]

X = df_encoded[features_numeriques]
y = df_encoded['Salaire']

# Division train/validation/test
X_temp, X_test, y_temp, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
X_train, X_val, y_train, y_val = train_test_split(X_temp, y_temp, test_size=0.25, random_state=42)

print(f"\\n📚 RÉPARTITION DES DONNÉES :")
print(f"   🏋️ Train : {len(X_train)} ({len(X_train)/len(X)*100:.1f}%)")
print(f"   🔍 Validation : {len(X_val)} ({len(X_val)/len(X)*100:.1f}%)")
print(f"   🧪 Test : {len(X_test)} ({len(X_test)/len(X)*100:.1f}%)")

# 4️⃣ ENTRAÎNEMENT ET COMPARAISON DE MODÈLES
print("\\n🤖 ENTRAÎNEMENT DES MODÈLES :")
print("=" * 50)

models = {
    'Linear Regression': LinearRegression(),
    'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42),
    'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, random_state=42)
}

results = {}
for name, model in models.items():
    print(f"\\n🔄 Entraînement {name}...")
    
    # Entraînement
    start_time = datetime.now()
    model.fit(X_train, y_train)
    training_time = (datetime.now() - start_time).total_seconds()
    
    # Prédictions
    y_pred_train = model.predict(X_train)
    y_pred_val = model.predict(X_val)
    y_pred_test = model.predict(X_test)
    
    # Métriques complètes
    metrics = {
        'train_r2': r2_score(y_train, y_pred_train),
        'val_r2': r2_score(y_val, y_pred_val),
        'test_r2': r2_score(y_test, y_pred_test),
        'train_mae': mean_absolute_error(y_train, y_pred_train),
        'val_mae': mean_absolute_error(y_val, y_pred_val),
        'test_mae': mean_absolute_error(y_test, y_pred_test),
        'train_rmse': np.sqrt(mean_squared_error(y_train, y_pred_train)),
        'val_rmse': np.sqrt(mean_squared_error(y_val, y_pred_val)),
        'test_rmse': np.sqrt(mean_squared_error(y_test, y_pred_test)),
        'training_time': training_time
    }
    
    # Cross-validation
    cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='r2')
    metrics['cv_mean'] = cv_scores.mean()
    metrics['cv_std'] = cv_scores.std()
    
    results[name] = {'model': model, **metrics}
    
    print(f"   ✅ Terminé en {training_time:.2f}s")
    print(f"   📊 R² : Train={metrics['train_r2']:.3f} | Val={metrics['val_r2']:.3f} | Test={metrics['test_r2']:.3f}")
    print(f"   📉 MAE : Train={metrics['train_mae']:.0f} | Val={metrics['val_mae']:.0f} | Test={metrics['test_mae']:.0f}")
    print(f"   🎯 CV : {metrics['cv_mean']:.3f} ± {metrics['cv_std']:.3f}")

# 5️⃣ SÉLECTION ET ANALYSE DU MEILLEUR MODÈLE
best_model_name = max(results.keys(), key=lambda k: results[k]['val_r2'])
best_model = results[best_model_name]['model']
best_metrics = results[best_model_name]

print(f"\\n🏆 MEILLEUR MODÈLE : {best_model_name}")
print(f"   🎯 R² Validation : {best_metrics['val_r2']:.3f}")
print(f"   📉 MAE Validation : {best_metrics['val_mae']:.0f}€")
print(f"   🔄 Stabilité CV : {best_metrics['cv_std']:.3f}")

# Analyse de l'importance des features (pour les modèles tree-based)
if hasattr(best_model, 'feature_importances_'):
    feature_importance = pd.DataFrame({
        'Feature': features_numeriques,
        'Importance': best_model.feature_importances_
    }).sort_values('Importance', ascending=False)
    
    print("\\n🔍 TOP 10 VARIABLES LES PLUS IMPORTANTES :")
    for i, (_, row) in enumerate(feature_importance.head(10).iterrows()):
        bar = "█" * int(row['Importance'] * 50)
        print(f"   {i+1:2d}. {row['Feature']:<20} : {bar} {row['Importance']:.3f}")

# 6️⃣ PRÉDICTIONS ET SCÉNARIOS BUSINESS
print("\\n🔮 PRÉDICTIONS BUSINESS :")
print("=" * 50)

# Scénarios d'exemple (données simulées)
scenarios = [
    {
        'nom': 'Junior Dev Paris',
        'Experience': 2, 'Age': 25, 'Heures_Semaine': 39, 'Langues_Parlees': 2, 'Certifications': 1,
        'Formation_encoded': le_formation.transform(['École Ingénieur'])[0],
        'Ville_encoded': le_ville.transform(['Paris'])[0],
        'Secteur_encoded': le_secteur.transform(['Tech'])[0],
        'Taille_encoded': le_taille.transform(['Startup'])[0]
    },
    {
        'nom': 'Senior Finance Paris',
        'Experience': 12, 'Age': 38, 'Heures_Semaine': 45, 'Langues_Parlees': 3, 'Certifications': 4,
        'Formation_encoded': le_formation.transform(['École Commerce'])[0],
        'Ville_encoded': le_ville.transform(['Paris'])[0],
        'Secteur_encoded': le_secteur.transform(['Finance'])[0],
        'Taille_encoded': le_taille.transform(['Grand Groupe'])[0]
    },
    {
        'nom': 'Consultant Lyon',
        'Experience': 7, 'Age': 32, 'Heures_Semaine': 42, 'Langues_Parlees': 3, 'Certifications': 3,
        'Formation_encoded': le_formation.transform(['Bac+5'])[0],
        'Ville_encoded': le_ville.transform(['Lyon'])[0],
        'Secteur_encoded': le_secteur.transform(['Consulting'])[0],
        'Taille_encoded': le_taille.transform(['ETI'])[0]
    }
]

for scenario in scenarios:
    # Calcul des features dérivées
    scenario_complete = scenario.copy()
    scenario_complete['Experience_squared'] = scenario['Experience'] ** 2
    scenario_complete['Age_Experience_ratio'] = scenario['Age'] / (scenario['Experience'] + 1)
    scenario_complete['Competences_totales'] = scenario['Langues_Parlees'] + scenario['Certifications']
    scenario_complete['Heures_bonus'] = max(scenario['Heures_Semaine'] - 35, 0)
    scenario_complete['Senior'] = int(scenario['Experience'] >= 10)
    scenario_complete['Paris'] = int(scenario['Ville_encoded'] == le_ville.transform(['Paris'])[0])
    scenario_complete['Tech_ou_Finance'] = int(scenario['Secteur_encoded'] in 
                                             [le_secteur.transform(['Tech'])[0], le_secteur.transform(['Finance'])[0]])
    
    # Prédiction
    scenario_df = pd.DataFrame([scenario_complete])[features_numeriques]
    prediction = best_model.predict(scenario_df)[0]
    
    print(f"\\n👤 {scenario['nom']} :")
    print(f"   💰 Salaire prédit : {prediction:,.0f}€")
    print(f"   📊 Expérience : {scenario['Experience']} ans")
    print(f"   🎂 Âge : {scenario['Age']} ans")
    print(f"   ⏰ Heures/semaine : {scenario['Heures_Semaine']}h")

# 7️⃣ RECOMMANDATIONS INTELLIGENTES
print("\\n💡 RECOMMANDATIONS IA :")
print("=" * 50)

if best_metrics['val_r2'] > 0.85:
    print("🎉 EXCELLENT ! Modèle très fiable pour les prédictions business.")
elif best_metrics['val_r2'] > 0.75:
    print("👍 BON modèle. Utilisable pour des estimations RH.")
elif best_metrics['val_r2'] > 0.65:
    print("⚠️ Modèle correct mais perfectible. Collecter plus de données.")
else:
    print("❌ Modèle insuffisant. Revoir la stratégie de modélisation.")

if hasattr(best_model, 'feature_importances_'):
    top_feature = feature_importance.iloc[0]['Feature']
    print(f"\\n🔥 Variable la plus prédictive : {top_feature}")
    
    if 'Experience' in top_feature:
        print("💡 L'expérience est clé ! Valorisez les profils expérimentés.")
    elif 'Formation' in top_feature:
        print("💡 La formation compte ! Investissez dans le recrutement d'écoles.")
    elif 'Paris' in top_feature:
        print("💡 L'effet Paris est fort ! Ajustez les grilles selon la géographie.")

print(f"\\n📊 RÉSUMÉ PERFORMANCE FINALE :")
print(f"   🎯 R² sur le jeu de test : {best_metrics['test_r2']:.3f}")
print(f"   📉 Erreur moyenne : ±{best_metrics['test_mae']:,.0f}€")
print(f"   🔄 Robustesse CV : {best_metrics['cv_std']:.3f}")
print(f"   ⚡ Temps d'entraînement : {best_metrics['training_time']:.2f}s")

print("\\n⚠️ Modèle entraîné sur des données simulées : à valider sur de vraies données avant tout usage.")`}
              />

              <div className="mt-6">
                <h4 className="font-semibold mb-3">🏆 Exercice Final : Votre Modèle Complet</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="mb-3">
                    <strong>Défi ultime :</strong> Créez un modèle pour prédire les salaires basé sur l'expérience et l'âge !
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
                      code={`# PROJET COMPLET : Prédiction de salaires
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

# 1. DONNÉES ENRICHIES
np.random.seed(42)
data_salaires = {
    'Experience': np.random.randint(0, 15, 200),
    'Age': np.random.randint(22, 55, 200),
    'Formation': np.random.choice(['Bac+3', 'Bac+5', 'PhD'], 200),
    'Ville': np.random.choice(['Paris', 'Lyon', 'Marseille'], 200)
}

# Calcul réaliste du salaire
base_salaire = 30000
df_salaires = pd.DataFrame(data_salaires)
df_salaires['Salaire'] = (
    base_salaire + 
    df_salaires['Experience'] * 2000 +  # 2k€ par an d'expérience
    (df_salaires['Age'] - 22) * 500 +   # 500€ par an d'âge
    np.where(df_salaires['Formation'] == 'PhD', 10000, 
             np.where(df_salaires['Formation'] == 'Bac+5', 5000, 0)) +
    np.where(df_salaires['Ville'] == 'Paris', 8000, 0) +  # Prime Paris
    np.random.normal(0, 3000, 200)  # Variabilité
)

# 2. ENCODAGE DES VARIABLES CATÉGORIELLES
df_encoded = pd.get_dummies(df_salaires, columns=['Formation', 'Ville'])

# 3. MODÉLISATION AVANCÉE
X = df_encoded.drop('Salaire', axis=1)
y = df_encoded['Salaire']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Random Forest pour capturer les interactions
rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# 4. ÉVALUATION COMPLÈTE
y_pred_rf = rf_model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred_rf)
r2_rf = r2_score(y_test, y_pred_rf)

print(f"🎯 Performance Random Forest :")
print(f"R² Score : {r2_rf:.3f}")
print(f"Erreur moyenne : {mae:.0f}€")

# 5. IMPORTANCE DES VARIABLES
importances = rf_model.feature_importances_
features = X.columns

plt.figure(figsize=(10, 6))
indices = np.argsort(importances)[::-1]
plt.bar(range(len(importances)), importances[indices])
plt.title('🔍 Importance des Variables pour Prédire le Salaire')
plt.xticks(range(len(importances)), [features[i] for i in indices], rotation=45)
plt.tight_layout()
plt.show()

print("\\n🏆 Félicitations ! Vous avez créé votre premier modèle ML complet !")`}
                    />
                  )}
                  <Button 
                    onClick={() => markCompleted(FINAL_EXERCISE_ID)}
                    size="sm"
                    variant={completedExercises.has(FINAL_EXERCISE_ID) ? "default" : "outline"}
                    className="mt-2"
                  >
                    {completedExercises.has(FINAL_EXERCISE_ID) ? "✅ Projet terminé !" : "Valider le projet"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
        <h3 className="text-xl font-bold mb-4">🎉 Récapitulatif de vos accomplissements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">✅ Ce que vous avez parcouru :</h4>
            <ul className="text-sm space-y-1">
              <li>• Variables, listes et dictionnaires Python</li>
              <li>• Manipulation de données avec pandas</li>
              <li>• Création de visualisations</li>
              <li>• Construction d'un modèle ML</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">🚀 Prochaines étapes suggérées :</h4>
            <ul className="text-sm space-y-1">
              <li>• Approfondir NumPy pour le calcul scientifique</li>
              <li>• Explorer d'autres algorithmes ML</li>
              <li>• Apprendre les API et scraping web</li>
              <li>• Découvrir les frameworks deep learning</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    </MasterclassContext.Provider>
  );
};

export default PythonMasterclass;
