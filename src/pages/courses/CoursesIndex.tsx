import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Code, BarChart3, Brain } from "lucide-react";
import { COURSE_CATALOG, COURSE_CATEGORIES, type CourseCategoryId } from "@/data/course-catalog";

const CATEGORY_ICONS: Record<CourseCategoryId, JSX.Element> = {
  programming: <Code className="h-8 w-8 text-blue-600" />,
  "math-stats": <BarChart3 className="h-8 w-8 text-green-600" />,
  databases: <BarChart3 className="h-8 w-8 text-indigo-600" />,
  dataviz: <BarChart3 className="h-8 w-8 text-emerald-600" />,
  "machine-learning": <Brain className="h-8 w-8 text-purple-600" />,
  ai: <Brain className="h-8 w-8 text-rose-600" />,
};

const CoursesIndex = () => {
  const courseCategories = COURSE_CATEGORIES.map((category) => ({
    ...category,
    icon: CATEGORY_ICONS[category.id],
    courses: COURSE_CATALOG.filter((course) => course.category === category.id),
  }));
  const writtenCount = COURSE_CATALOG.filter((course) => course.status === "redige").length;
  const planCount = COURSE_CATALOG.length - writtenCount;

  return (
    <Layout>
      <div className="w-full py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <BookOpen className="h-10 w-10 text-blue-600" />
              Catalogue des Cours
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {COURSE_CATALOG.length} cours : {writtenCount} avec leçons rédigées et {planCount} qui ne sont encore que des plans de modules
              (marqués « Plan du cours »). Votre progression reste dans votre navigateur.
            </p>
          </div>

          <div className="space-y-12">
            {courseCategories.map((category, index) => (
              <section key={index} className="bg-white rounded-lg shadow-sm border p-8">
                <div className="flex items-center gap-4 mb-6">
                  {category.icon}
                  <div>
                    <h2 className="text-2xl font-bold">{category.title}</h2>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.courses.map((course, courseIndex) => (
                    <Card key={courseIndex} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                          <div className="flex flex-wrap gap-2">
                            {course.level && <Badge variant="outline">{course.level}</Badge>}
                            {course.status === "plan" && (
                              <Badge variant="secondary" title="Modules annoncés, leçons pas encore rédigées">Plan du cours</Badge>
                            )}
                          </div>
                          {course.duration && (
                            <span className="text-sm text-gray-600" title="Durée indicative, à votre rythme">{course.duration} (indicatif)</span>
                          )}
                        </div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription>{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button asChild className="w-full">
                          <Link to={course.href}>
                            {course.status === "plan" ? "Voir le plan du cours" : "Commencer le cours"}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Autres points d'entrée</h3>
              <p className="text-gray-600 mb-6">
                Les cours marqués « Plan du cours » n'ont pas encore de leçons rédigées. En attendant, les pages
                Fondamentaux et Machine Learning contiennent du contenu complet, et les projets proposent des sujets à réaliser.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/fundamentals" className="text-blue-600 hover:underline">
                  Voir les Fondamentaux
                </Link>
                <Link to="/machine-learning" className="text-blue-600 hover:underline">
                  Explorer le Machine Learning
                </Link>
                <Link to="/projects" className="text-blue-600 hover:underline">
                  Découvrir les Projets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CoursesIndex;
