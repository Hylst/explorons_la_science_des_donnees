import { GitBranch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LessonMarkdown from "@/components/courses/lessons/LessonMarkdown";
import CourseQuizBlock from "@/components/courses/CourseQuizBlock";
import { TOOLING_BLOCKS, TOOLING_QUIZ } from "@/data/tooling";

/** Outils du quotidien : Git, environnements Python, Docker (commandes à lire : rien ne s'exécute ici) */
const ToolingSection = () => (
  <section id="tooling" aria-labelledby="tooling-titre" className="mb-16 scroll-mt-24">
    <div className="mb-8 text-center">
      <div className="mb-3 inline-flex items-center justify-center rounded-full bg-slate-100 p-3">
        <GitBranch className="h-7 w-7 text-slate-700" aria-hidden="true" />
      </div>
      <h2 id="tooling-titre" className="text-3xl font-bold text-slate-900">
        Outils du quotidien : Git, environnements, Docker
      </h2>
      <p className="mx-auto mt-3 max-w-3xl text-slate-600">
        Ce qui entoure le code : garder l'historique de son travail, isoler les bibliothèques de chaque projet, faire tourner un
        programme ailleurs que sur sa machine. Ces commandes s'exécutent dans un terminal, pas dans le navigateur : elles sont ici à lire.
      </p>
    </div>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {TOOLING_BLOCKS.map((block) => (
        <Card key={block.id} id={block.id} className="min-w-0">
          <CardHeader>
            <CardTitle className="text-xl">{block.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-slate-700">
            <LessonMarkdown md={block.md} />
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="mt-8">
      <CourseQuizBlock title="Vérifiez vos repères" questions={TOOLING_QUIZ} />
    </div>
  </section>
);

export default ToolingSection;
