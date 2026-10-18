import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Code, Trophy, Lightbulb, Star, Award, Zap } from "lucide-react";
import CourseHighlight from "@/components/courses/CourseHighlight";
import LessonExercise from "@/components/courses/lessons/LessonExercise";
import RunnableCode from "@/components/courses/lessons/RunnableCode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PRACTICAL_EXERCISES, type PracticalExercise } from "@/data/programming-exercises";
import { useCourseProgress } from "@/hooks/use-course-progress";

/** Progression des exercices pratiques : un élément « done » par exercice, posé après une vérification réussie */
const COURSE_ID = "programming-exercises";

type Difficulty = PracticalExercise["difficulty"];

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  'Débutant': 'bg-green-100 text-green-800 border-green-300',
  'Intermédiaire': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'Avancé': 'bg-red-100 text-red-800 border-red-300'
};

const DIFFICULTY_ICONS: Record<Difficulty, ReactNode> = {
  'Débutant': <Star className="h-4 w-4" />,
  'Intermédiaire': <Zap className="h-4 w-4" />,
  'Avancé': <Award className="h-4 w-4" />
};

interface ExerciseCardProps {
  exercise: PracticalExercise;
  number: number;
  done: boolean;
  onSolved: () => void;
}

const ExerciseCard = ({ exercise, number, done, onSolved }: ExerciseCardProps) => {
  const [showScript, setShowScript] = useState(false);
  const [showHints, setShowHints] = useState(false);

  return (
    <Card className={`border-l-4 transition-all duration-300 hover:shadow-lg ${
      done ? 'border-l-green-500 bg-gradient-to-r from-green-50 to-green-100' : 'border-l-blue-500 hover:border-l-blue-600'
    }`}>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            {done && <CheckCircle className="h-5 w-5 text-green-600" aria-label="Exercice réussi" />}
            <span className={done ? 'text-green-700' : ''}>{exercise.title}</span>
          </span>
          <span className="flex flex-wrap gap-2 items-center">
            <Badge className={`${DIFFICULTY_COLORS[exercise.difficulty]} flex items-center gap-1`}>
              {DIFFICULTY_ICONS[exercise.difficulty]}
              {exercise.difficulty}
            </Badge>
            <Badge variant="outline">{exercise.duration} (indicatif)</Badge>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{exercise.description}</p>

        <div className="mb-4">
          <h4 className="font-semibold mb-2">Compétences travaillées :</h4>
          <div className="flex flex-wrap gap-2">
            {exercise.skills.map(skill => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </div>
        </div>

        <LessonExercise exercise={exercise.exercise} number={number} title="Exercice vérifié : la fonction centrale" onSolved={onSolved} />

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setShowScript(v => !v)} variant="outline" size="sm" className="whitespace-normal h-auto min-h-9">
            <Code className="h-4 w-4 mr-1" />
            {showScript ? "Masquer le script complet" : "Voir le script complet"}
          </Button>
          <Button onClick={() => setShowHints(v => !v)} variant="outline" size="sm" className="whitespace-normal h-auto min-h-9">
            <Lightbulb className="h-4 w-4 mr-1" />
            {showHints ? "Masquer les pistes" : "Pistes pour le script complet"}
          </Button>
        </div>

        {showHints && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-semibold mb-2">Pistes pour le script complet :</h4>
            <ul className="text-sm space-y-1">
              {exercise.hints.map((hint) => (
                <li key={hint}>• {hint}</li>
              ))}
            </ul>
          </div>
        )}

        {showScript && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Le script complet</h4>
            <p className="text-sm text-muted-foreground mb-2">{exercise.scriptNote}</p>
            {exercise.scriptRunnable ? (
              <RunnableCode language="python" code={exercise.script} label={`Script complet de l'exercice « ${exercise.title} », modifiable`} />
            ) : (
              <pre className="p-4 text-sm text-gray-200 bg-gray-900 rounded-md overflow-x-auto">
                <code>{exercise.script}</code>
              </pre>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const TABS: { value: string; label: string; difficulty: Difficulty }[] = [
  { value: "beginner", label: "Débutant", difficulty: "Débutant" },
  { value: "intermediate", label: "Intermédiaire", difficulty: "Intermédiaire" },
  { value: "advanced", label: "Avancé", difficulty: "Avancé" },
];

/**
 * Six exercices pratiques (débutant, intermédiaire, avancé). Chacun a un exercice vérifié par le moteur du site sur
 * sa fonction centrale (réussite enregistrée dans ce navigateur) et le script complet, exécutable quand le moteur
 * le permet. Données : src/data/programming-exercises.ts.
 */
const PracticalExercises = () => {
  const { statusOf, setStatus } = useCourseProgress(COURSE_ID);
  const doneExercises = PRACTICAL_EXERCISES.filter((e) => statusOf(e.id) === 'done');
  const total = PRACTICAL_EXERCISES.length;
  const skillsWorked = new Set(doneExercises.flatMap((e) => e.skills));
  const completionRate = (doneExercises.length / total) * 100;

  return (
    <section id="practical-exercises" className="mb-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Exercices pratiques</h2>
        <p className="text-lg text-gray-600 mb-6">
          Six exercices, du script de quelques lignes à un petit projet de machine learning. Chacun commence par un
          exercice vérifié par le moteur du site sur sa fonction centrale, puis propose le script complet à lire ou à exécuter.
        </p>
      </div>

      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-600" />
            Votre suivi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{doneExercises.length} / {total}</div>
              <div className="text-sm text-gray-600">Exercices réussis</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{skillsWorked.size}</div>
              <div className="text-sm text-gray-600">Compétences travaillées</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">{Math.round(completionRate)}%</div>
              <div className="text-sm text-gray-600">Progression</div>
            </div>
          </div>

          <Progress value={completionRate} className="h-3" aria-label={`${doneExercises.length} exercices réussis sur ${total}`} />
          <p className="text-xs text-gray-600 mt-2">
            Un exercice compte comme réussi quand ses tests passent. Ce suivi est enregistré dans ce navigateur uniquement.
          </p>

          {doneExercises.length >= total && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                Vous avez réussi les six exercices. Pour la suite, la page{" "}
                <Link to="/machine-learning" className="underline">Machine learning</Link> et les{" "}
                <Link to="/projects" className="underline">projets guidés</Link> du site prolongent ces exercices.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <CourseHighlight title="Apprendre en faisant" type="concept">
        <p className="mb-3">
          On apprend à programmer surtout en écrivant du code et en le faisant échouer. Écrivez la fonction demandée,
          cliquez sur « Vérifier » : des tests disent si elle est juste, et leur message dit ce qui était attendu.
        </p>
        <div className="bg-blue-100 p-3 rounded">
          <strong>Conseil :</strong>{" "}
          essayez d'abord seul, puis lisez l'indice, et ne regardez le corrigé qu'à la fin : une erreur
          comprise apprend plus qu'une solution recopiée.
        </div>
      </CourseHighlight>

      <Tabs defaultValue="beginner" className="space-y-6">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full h-auto">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-6">
            {PRACTICAL_EXERCISES.filter((e) => e.difficulty === tab.difficulty).map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                number={PRACTICAL_EXERCISES.indexOf(exercise) + 1}
                done={statusOf(exercise.id) === 'done'}
                onSolved={() => setStatus(exercise.id, 'done')}
              />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default PracticalExercises;
