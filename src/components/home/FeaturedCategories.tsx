import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Code, Database, ChartPie, FileText, Users, Calculator } from "lucide-react";

const categories = [
  {
    title: "Introduction",
    description: "Fondements et concepts de base de la Data Science",
    icon: <BookOpen className="h-6 w-6 text-ds-blue-500" />,
    href: "/introduction",
    color: "from-blue-50 to-blue-100",
    gradient: "from-ds-blue-500 to-sky-400"
  },
  {
    title: "Mathématiques & Stats",
    description: "Probabilités, statistiques et algèbre linéaire",
    icon: <Calculator className="h-6 w-6 text-ds-purple-500" />,
    href: "/fundamentals/math-stats",
    color: "from-purple-50 to-purple-100",
    gradient: "from-ds-purple-500 to-violet-400"
  },
  {
    title: "Programmation",
    description: "Python, R et les autres langages de la data science",
    icon: <Code className="h-6 w-6 text-emerald-500" />,
    href: "/fundamentals/programming",
    color: "from-emerald-50 to-emerald-100",
    gradient: "from-emerald-500 to-teal-400"
  },
  {
    title: "Machine Learning",
    description: "Algorithmes, modèles, et Deep Learning",
    icon: <ChartPie className="h-6 w-6 text-amber-500" />,
    href: "/machine-learning",
    color: "from-amber-50 to-amber-100",
    gradient: "from-amber-500 to-yellow-400"
  },
  {
    title: "Bases de Données",
    description: "SQL, NoSQL, et gestion des données",
    icon: <Database className="h-6 w-6 text-rose-500" />,
    href: "/fundamentals/databases",
    color: "from-rose-50 to-rose-100",
    gradient: "from-rose-500 to-pink-400"
  },
  {
    title: "Projets Pratiques",
    description: "Sujets de projets, dont plusieurs guidés pas à pas",
    icon: <FileText className="h-6 w-6 text-cyan-500" />,
    href: "/projects",
    color: "from-cyan-50 to-cyan-100",
    gradient: "from-cyan-500 to-blue-400"
  },
  {
    title: "Communauté",
    description: "Liens vers des forums, des événements, des comptes à suivre, le blog et des actualités",
    icon: <Users className="h-6 w-6 text-indigo-500" />,
    href: "/community",
    color: "from-indigo-50 to-indigo-100",
    gradient: "from-indigo-500 to-violet-400"
  },
];

const FeaturedCategories = () => {
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Explorer par thème</h2>
          <p className="text-xl text-muted-foreground">
            Les grandes parties du site, à parcourir dans l'ordre de votre choix et à votre rythme
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link to={category.href} key={category.title}>
              <Card className={`bg-gradient-to-br ${category.color} border-none h-full card-hover`}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <CardTitle>{category.title}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-700">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-end">
                  <div className={`text-white bg-gradient-to-r ${category.gradient} p-2 rounded-full`}>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
