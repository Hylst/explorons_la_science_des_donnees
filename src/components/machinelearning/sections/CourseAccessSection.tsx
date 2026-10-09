
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Network, GitBranch, Zap, Clock, Check, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const CourseAccessSection = () => {
  const courses = [
    {
      title: "Apprentissage Supervisé",
      description: "La classification et la régression : types de problèmes, algorithmes usuels (régression logistique, forêts aléatoires, SVM, régression linéaire), mesures d'évaluation, applications et projets, avec quiz et exercices.",
      href: "/machine-learning/supervised",
      icon: <Network className="h-8 w-8" />,
      color: "bg-blue-500",
      duration: "4-6 heures",
      level: "Intermédiaire",
      modules: "6 sections",
      highlights: [
        "Classification binaire, multi-classe et multi-label",
        "Régression linéaire, polynomiale et multiple",
        "Mesures d'évaluation (exactitude, rappel, MAE, RMSE, R²)",
        "Trois projets avec solution"
      ]
    },
    {
      title: "Apprentissage Non Supervisé",
      description: "Le clustering et la réduction de dimensionnalité (K-means, clustering hiérarchique, PCA, t-SNE, UMAP), puis la détection d'anomalies dans un projet, avec applications et quiz.",
      href: "/machine-learning/unsupervised",
      icon: <GitBranch className="h-8 w-8" />,
      color: "bg-purple-500",
      duration: "3-4 heures",
      level: "Intermédiaire",
      modules: "6 sections",
      highlights: [
        "K-means et clustering hiérarchique",
        "PCA, t-SNE, UMAP et ICA : un comparatif",
        "Détection d'anomalies (projet)",
        "Projections 2D de données de grande dimension"
      ]
    },
    {
      title: "Apprentissage par Renforcement",
      description: "Un agent qui apprend par essais et erreurs : agent, environnement, récompenses, Q-learning et SARSA, puis un aperçu des méthodes profondes (DQN, PPO), avec des projets en simulation.",
      href: "/machine-learning/reinforcement",
      icon: <Zap className="h-8 w-8" />,
      color: "bg-orange-500",
      duration: "5-7 heures",
      level: "Avancé",
      modules: "6 sections",
      highlights: [
        "Agent, environnement, récompenses, processus de décision markovien",
        "Q-learning et SARSA",
        "Aperçu du renforcement profond (DQN, PPO)",
        "Trois projets en simulation (jeu, parking, trading)"
      ]
    }
  ];

  return (
    <section id="advanced-courses" className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Cours Approfondis</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explorez en détail les trois grandes familles du Machine Learning : un cours par famille, avec
          théorie, exemples, projets et ressources.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg relative overflow-hidden">
            {/* Gradient background */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${course.color}`} />

            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${course.color} text-white`}>
                  {course.icon}
                </div>
                <Badge variant="outline" className="text-xs">
                  {course.level}
                </Badge>
              </div>

              <div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-sm mt-2 line-clamp-3">
                  {course.description}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Course stats */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span title="Estimation indicative du temps d'étude">{course.duration} (estimé)</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.modules}</span>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Au programme :</h4>
                <ul className="space-y-1">
                  {course.highlights.slice(0, 3).map((highlight, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <Button asChild className="w-full group-hover:scale-105 transition-transform">
                <Link to={course.href} className="flex items-center justify-center gap-2">
                  Commencer le cours
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to action */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl border text-center space-y-4">
        <h3 className="text-2xl font-bold">Par où commencer ?</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Chaque cours combine théorie, exemples et projets, avec des quiz.
          Tout est gratuit et sans compte.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Check className="h-4 w-4" />
            <span>Gratuit, sans compte</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>Quiz inclus</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4" />
            <span>Projets pratiques</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseAccessSection;
