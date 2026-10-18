import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Clock, CheckCircle, Brain, Code2, Zap, Award, TrendingUp, Info } from "lucide-react";
import CourseHighlight from "@/components/courses/CourseHighlight";
import LessonExercise from "@/components/courses/lessons/LessonExercise";
import { CHALLENGES, type Challenge } from "@/data/challenges";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { readJSON, removeStorage } from "@/lib/storage";

/** Progression des défis : un élément « done » par identifiant de défi, posé après une vérification réussie */
const COURSE_ID = 'challenges';

/**
 * Anciennes clés : jusqu'au 17 octobre 2026, un défi se validait à la main (« J'ai réussi ce défi »). Ces validations
 * ne sont pas reprises comme réussites (la réussite se vérifie désormais par le moteur) : on les compte pour le dire
 * une fois au visiteur, puis on efface les clés.
 */
const LEGACY_PROGRESS_KEY = 'challenge-progress-v2';
const OLDEST_PROGRESS_KEY = 'challenge-progress';
const LEGACY_KEYS = [LEGACY_PROGRESS_KEY, OLDEST_PROGRESS_KEY];

const countLegacyValidations = (): number => {
  const saved = readJSON<unknown>(LEGACY_PROGRESS_KEY, null);
  const list = saved && typeof saved === 'object' ? (saved as Record<string, unknown>).completedChallenges : undefined;
  return Array.isArray(list) ? list.filter((id) => typeof id === 'string').length : 0;
};

const DIFFICULTIES = ['all', 'facile', 'moyen', 'difficile'] as const;

const difficultyColor = (difficulty: Challenge['difficulty']) => {
  switch (difficulty) {
    case 'facile': return 'bg-green-700 text-white';
    case 'moyen': return 'bg-yellow-700 text-white';
    case 'difficile': return 'bg-red-600 text-white';
  }
};

const languageLabel = (language: Challenge['exercise']['language']) => (language === 'javascript' ? 'JavaScript' : language === 'sql' ? 'SQL' : 'Python');

/**
 * Défis de programmation : quatre exercices vérifiés par le moteur du site (Python ou JavaScript exécutés dans le
 * navigateur). Les données sont dans src/data/challenges.ts, testées par src/data/challenges.test.ts.
 */
const InteractiveChallenges: React.FC = () => {
  const { statusOf, setStatus, countDone } = useCourseProgress(COURSE_ID);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  // lu sans effet de bord (initialiseur pur) ; les anciennes clés sont effacées après le premier affichage
  const [legacyCount] = useState(countLegacyValidations);
  useEffect(() => {
    for (const key of LEGACY_KEYS) removeStorage(key);
  }, []);

  const categories = useMemo(() => ['all', ...new Set(CHALLENGES.map((c) => c.category))], []);
  const filteredChallenges = useMemo(
    () =>
      CHALLENGES.filter(
        (c) => (selectedCategory === 'all' || c.category === selectedCategory) && (selectedDifficulty === 'all' || c.difficulty === selectedDifficulty),
      ),
    [selectedCategory, selectedDifficulty],
  );

  const selected = CHALLENGES.find((c) => c.id === selectedId) ?? null;
  const done = countDone(CHALLENGES.map((c) => c.id));

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Trophy className="h-8 w-8 text-yellow-600" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Défis de programmation
          </h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Quatre défis progressifs, trois en Python et un en JavaScript. Écrivez votre solution dans l'éditeur du défi,
          puis cliquez sur « Vérifier » : votre code s'exécute dans votre navigateur et des tests disent s'il est juste.
        </p>
        <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
          Un défi compte comme réussi quand ses tests passent. La première vérification en Python charge le moteur
          (quelques secondes). Votre progression reste enregistrée dans ce navigateur uniquement.
        </p>
      </div>

      {legacyCount > 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 max-w-3xl mx-auto">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <p>
            {legacyCount === 1 ? 'Vous aviez validé un défi à la main' : `Vous aviez validé ${legacyCount} défis à la main`} dans
            l'ancienne version de cette page. Les défis sont maintenant vérifiés par le moteur : cette validation n'est pas
            reprise, il suffit de relancer la vérification de votre solution.
          </p>
        </div>
      )}

      {/* Progression */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Votre progression
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>Défis réussis</span>
            <span>{done} sur {CHALLENGES.length}</span>
          </div>
          <Progress value={(done / CHALLENGES.length) * 100} className="h-2" aria-label={`${done} défis réussis sur ${CHALLENGES.length}`} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des défis */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Défis disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div>
                  <label htmlFor="challenge-category" className="text-sm font-medium mb-1 block">Catégorie</label>
                  <select
                    id="challenge-category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'Toutes les catégories' : cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="challenge-difficulty" className="text-sm font-medium mb-1 block">Difficulté</label>
                  <select
                    id="challenge-difficulty"
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    {DIFFICULTIES.map((diff) => (
                      <option key={diff} value={diff}>
                        {diff === 'all' ? 'Toutes les difficultés' : diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredChallenges.length === 0 && <p className="text-sm text-muted-foreground">Aucun défi pour ces filtres.</p>}
                {filteredChallenges.map((challenge) => {
                  const isDone = statusOf(challenge.id) === 'done';
                  return (
                    <Card
                      key={challenge.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${selectedId === challenge.id ? 'ring-2 ring-blue-500' : ''} ${isDone ? 'bg-green-50 border-green-200' : ''}`}
                      onClick={() => setSelectedId(challenge.id)}
                      role="button"
                      tabIndex={0}
                      aria-pressed={selectedId === challenge.id}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedId(challenge.id);
                        }
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-sm">{challenge.title}</h4>
                          {isDone && <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" aria-label="Défi réussi" />}
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{challenge.description}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={`text-xs ${difficultyColor(challenge.difficulty)}`}>{challenge.difficulty}</Badge>
                          <Badge variant="outline" className="text-xs">{languageLabel(challenge.exercise.language)}</Badge>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            {challenge.duration} (indicatif)
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Espace de travail */}
        <div className="lg:col-span-2 min-w-0">
          {selected ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5" />
                  {selected.title}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <Badge className={difficultyColor(selected.difficulty)}>{selected.difficulty}</Badge>
                  <Badge variant="outline">{languageLabel(selected.exercise.language)}</Badge>
                  <Badge variant="secondary">{selected.category}</Badge>
                  <span className="text-sm text-muted-foreground">durée indicative : {selected.duration}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Brain className="h-4 w-4" aria-hidden="true" />
                    Ce que le défi fait travailler
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selected.learningObjectives.map((obj) => (
                      <Badge key={obj} variant="outline" className="text-xs">{obj}</Badge>
                    ))}
                  </div>
                </div>
                {statusOf(selected.id) === 'done' && (
                  <p className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-900">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    Défi réussi : vos tests sont passés. Vous pouvez le refaire autrement, sans indice.
                  </p>
                )}
                <LessonExercise
                  key={selected.id}
                  exercise={selected.exercise}
                  number={CHALLENGES.indexOf(selected) + 1}
                  title="À vous de jouer"
                  onSolved={() => setStatus(selected.id, 'done')}
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="min-h-64 flex items-center justify-center">
              <CardContent className="text-center pt-6">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-lg font-semibold mb-2">Choisissez un défi</h3>
                <p className="text-muted-foreground">Sélectionnez un défi dans la liste pour commencer.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Conseils */}
      <CourseHighlight title="Conseils pour aborder les défis" type="tip">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Stratégie
            </h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Lisez attentivement l'énoncé</li>
              <li>• Décomposez le problème en étapes</li>
              <li>• Affichez des résultats intermédiaires avec print ou console.log</li>
              <li>• Utilisez l'indice si vous bloquez</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Méthode
            </h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Commencez par les défis faciles</li>
              <li>• Ne regardez le corrigé qu'après avoir cherché</li>
              <li>• Lisez le message d'un test qui échoue : il dit ce qui était attendu</li>
              <li>• Analysez vos erreurs</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Progression
            </h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Un défi réussi reste coché dans ce navigateur</li>
              <li>• Explorez différentes catégories</li>
              <li>• Comparez votre solution au corrigé : il en existe souvent plusieurs</li>
              <li>• Refaites un défi plus tard, sans indice</li>
            </ul>
          </div>
        </div>
      </CourseHighlight>
    </div>
  );
};

export default InteractiveChallenges;
