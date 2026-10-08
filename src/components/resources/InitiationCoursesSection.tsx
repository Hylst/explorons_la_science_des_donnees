import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, BrainCircuit, Calculator, Code, Database, LineChart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { COURSE_CATALOG, COURSE_CATEGORIES, type CourseCategoryId } from "@/data/course-catalog";

const ICONS: Record<CourseCategoryId, JSX.Element> = {
  programming: <Code className="h-5 w-5" />,
  "math-stats": <Calculator className="h-5 w-5" />,
  databases: <Database className="h-5 w-5" />,
  dataviz: <LineChart className="h-5 w-5" />,
  "machine-learning": <BrainCircuit className="h-5 w-5" />,
  ai: <Sparkles className="h-5 w-5" />,
};

// Seules les catégories qui ont au moins un cours ; niveau, durée et modules viennent du catalogue (rien d'inventé ici)
const CATEGORIES = COURSE_CATEGORIES.map((category) => ({
  ...category,
  courses: COURSE_CATALOG.filter((course) => course.category === category.id),
})).filter((category) => category.courses.length > 0);

/**
 * Les cours du site, rangés par thème. Lu dans src/data/course-catalog.ts, comme la page /courses :
 * cette section listait auparavant une vingtaine de « cours » écrits à la main, dont plusieurs n'existaient pas.
 */
const InitiationCoursesSection = () => {
  const [activeTab, setActiveTab] = useState<string>(CATEGORIES[0]?.id ?? "");

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-6">Les cours du site, par thème</h2>
      <p className="text-lg text-muted-foreground mb-8">
        {COURSE_CATALOG.length} cours rédigés, gratuits et sans inscription : les exemples s'exécutent dans votre navigateur et les exercices
        sont vérifiés. Les durées sont indicatives, à votre rythme.
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8 flex flex-wrap h-auto p-1 gap-2">
          {CATEGORIES.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex items-center gap-2 py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {ICONS[category.id]}
              <span className="hidden sm:inline">{category.title}</span>
              <span className="sm:hidden sr-only">{category.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIES.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.courses.map((course) => (
                <div key={course.id} className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-3">{course.title}</h3>
                  <p className="text-muted-foreground mb-4">{course.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.level && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">Niveau : {course.level}</span>
                    )}
                    {course.duration && (
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        Durée : {course.duration} (indicatif)
                      </span>
                    )}
                    {course.modules && (
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">{course.modules} modules</span>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <Button asChild className="whitespace-normal h-auto">
                      <Link to={course.href} className="flex items-center gap-1">
                        Ouvrir le cours <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default InitiationCoursesSection;
