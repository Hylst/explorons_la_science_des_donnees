import { courseImage } from "@/lib/course-image";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { COURSE_CATALOG, FEATURED_COURSE_IDS } from "@/data/course-catalog";

const courses = FEATURED_COURSE_IDS.flatMap((id) => COURSE_CATALOG.filter((course) => course.id === id));

const FeaturedCourses = () => {
  return (
    <section className="py-16 bg-muted">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Pour commencer</h2>
            <p className="text-xl text-muted-foreground">
              {`Trois cours pour démarrer, parmi les ${COURSE_CATALOG.length} du catalogue`}
            </p>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0">
            <Link to="/courses">
              Voir tous les cours
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden card-hover flex flex-col">
              <div className="aspect-[16/9] relative">
                <img
                  src={courseImage(course.id)}
                  alt=""
                  width={800}
                  height={450}
                  loading="lazy"
                  decoding="async"
                  className="object-cover w-full h-full"
                />
                {course.level && (
                  <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full">
                    {course.level}
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2 leading-snug">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground">
                  {course.duration && <div title="Durée indicative, à votre rythme">{course.duration} (indicatif)</div>}
                  {course.modules && <div>{course.modules} modules</div>}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 mt-auto">
                <Button asChild variant="secondary" className="w-full">
                  <Link to={course.href}>
                    Voir le cours
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
