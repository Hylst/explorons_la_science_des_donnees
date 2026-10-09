
import { GraduationCap, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CoursesSection = () => {
  // Informations relevées sur les pages officielles le 1er octobre 2026 (aucun montant n'est affiché sur ce site) (voir docs/SOURCES.md). Le cours d'Andrew Ng de
  // 11 semaines (2011) a été remplacé par une spécialisation en 3 cours.
  const onlineCourses = [
    {
      title: "Machine Learning Specialization (cours 1 : Supervised Machine Learning)",
      platform: "Coursera (Stanford Online et DeepLearning.AI)",
      instructor: "Andrew Ng",
      description: "Spécialisation en 3 cours, version actualisée et étendue du cours pionnier d'Andrew Ng. Le premier cours porte sur la régression et la classification supervisées.",
      link: "https://www.coursera.org/learn/machine-learning",
      duration: "3 semaines à 10 h par semaine (environ 30 h) pour le premier cours",
      access: "Inscription gratuite ; exercices notés et certificat en option (voir la page du cours)",
      accessTone: "mixed",
      certificate: "En option"
    },
    {
      title: "Deep Learning Specialization",
      platform: "DeepLearning.AI (aussi sur Coursera)",
      instructor: "Andrew Ng",
      description: "Spécialisation en 5 cours sur les fondamentaux du deep learning et la construction de réseaux de neurones.",
      link: "https://www.deeplearning.ai/specializations/deep-learning",
      duration: "Environ 127 h au total : 5 h par semaine, soit 5 semaines par cours (4 pour le cours 3)",
      access: "Conditions variables : voir le site de DeepLearning.AI ou la page Coursera du cours",
      accessTone: "mixed",
      certificate: "Selon la formule choisie"
    },
  ];

  return (
    <div id="courses" className="scroll-mt-24 mt-16">
      <h2 className="text-3xl font-bold mb-6">Cours en ligne</h2>
      <div className="max-w-none mb-6">
        <p>
          Deux parcours d'Andrew Ng, en anglais, pour aborder le machine learning puis le deep learning.
          Ils proposent un contenu structuré et des exercices de programmation. Les conditions d'accès (gratuit, payant,
          certificat) changent : la page de chaque cours fait foi.
        </p>
      </div>

      <div className="space-y-6 mb-10">
        {onlineCourses.map((course, index) => (
          <Card key={index} className="hover:shadow-md transition-all overflow-hidden border-l-4 border-l-emerald-500">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/3">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold">{course.title}</CardTitle>
                      <CardDescription>
                        <span className="font-medium">{course.platform}</span> • {course.instructor}
                      </CardDescription>
                    </div>
                    <GraduationCap className="h-5 w-5 text-emerald-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{course.description}</p>
                </CardContent>
              </div>
              <div className="md:w-1/3 bg-gray-50 p-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center text-sm">
                    <span className="font-medium mr-2">Durée :</span> {course.duration}
                  </div>
                  <div className="flex flex-wrap items-center text-sm">
                    <span className="font-medium mr-2">Accès :</span> 
                    <span className={course.accessTone === "free" ? "text-green-700" : "text-amber-700"}>
                      {course.access}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center text-sm">
                    <span className="font-medium mr-2">Certificat :</span> 
                    <span className="text-gray-700">{course.certificate}</span>
                  </div>
                </div>
                <Button variant="default" size="sm" className="mt-4 w-full" asChild>
                  <a href={course.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    Voir le cours
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CoursesSection;
