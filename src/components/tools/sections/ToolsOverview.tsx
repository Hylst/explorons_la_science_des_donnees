import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code2, Database, LineChart, BrainCircuit, ArrowRight, Zap, Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const ToolsOverview = () => {
  return (
    <div className="space-y-8">
      <div className="max-w-none">
        <p className="text-lg text-muted-foreground leading-relaxed">
          La data science s'appuie sur un écosystème riche et diversifié d'outils, chacun optimisé pour des tâches spécifiques.
          De la collecte des données brutes à la communication des résultats, découvrez les technologies qui alimentent 
          l'innovation en science des données et apprenez à choisir votre boîte à outils.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
        <Card className="group hover:shadow-xl transition-all duration-300 border-t-4 border-t-blue-500 hover:border-t-blue-600 hover:-translate-y-1">
          <CardHeader className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -translate-y-10 translate-x-10 opacity-20 group-hover:scale-110 transition-transform"></div>
            <CardTitle className="flex items-center gap-3 text-blue-700 relative z-10">
              <div className="p-2 rounded-lg bg-blue-100">
                <Code2 className="h-6 w-6" />
              </div>
              Langages de programmation
            </CardTitle>
            <CardDescription className="text-base">
              Les fondations de tout projet de data science
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm leading-relaxed">
                Python, R, SQL, Julia et autres langages spécialisés pour l'analyse et le traitement des données.
                Chaque langage possède ses forces, ses écosystèmes de paquets et ses domaines d'application privilégiés.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-200">Python</Badge>
                <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-200">R</Badge>
                <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-200">SQL</Badge>
                <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-200">Julia</Badge>
                <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-200">Scala</Badge>
              </div>
              <div className="pt-2 space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Zap className="h-3 w-3" />
                  <span>Langages généralistes et spécialisés</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>Communautés actives</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-1">
            <Button variant="ghost" size="sm" asChild className="whitespace-normal h-auto py-2 text-left group-hover:bg-blue-50 transition-colors">
              <Link to="/fundamentals/programming" className="flex items-center gap-1">
                Lire le cours sur les langages de programmation
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="whitespace-normal h-auto py-2 text-left group-hover:bg-blue-50 transition-colors">
              <Link to="/tools/programming" className="flex items-center gap-1">
                Comparer les langages et leurs écosystèmes
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-t-4 border-t-amber-500 hover:border-t-amber-600 hover:-translate-y-1">
          <CardHeader className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-100 rounded-full -translate-y-10 translate-x-10 opacity-20 group-hover:scale-110 transition-transform"></div>
            <CardTitle className="flex items-center gap-3 text-amber-700 relative z-10">
              <div className="p-2 rounded-lg bg-amber-100">
                <Database className="h-6 w-6" />
              </div>
              Traitement et stockage des données
            </CardTitle>
            <CardDescription className="text-base">
              Solutions pour gérer, transformer et organiser les données
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm leading-relaxed">
                Des bases de données traditionnelles aux solutions big data, en passant par les outils ETL
                et les plateformes cloud. Ces technologies permettent de stocker, traiter et préparer les données
                pour l'analyse à grande échelle.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary" className="bg-amber-50 text-amber-800 border-amber-200">PostgreSQL</Badge>
                <Badge variant="secondary" className="bg-amber-50 text-amber-800 border-amber-200">MongoDB</Badge>
                <Badge variant="secondary" className="bg-amber-50 text-amber-800 border-amber-200">Spark</Badge>
                <Badge variant="secondary" className="bg-amber-50 text-amber-800 border-amber-200">Hadoop</Badge>
                <Badge variant="secondary" className="bg-amber-50 text-amber-800 border-amber-200">AWS</Badge>
              </div>
              <div className="pt-2 space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Zap className="h-3 w-3" />
                  <span>Pensés pour de gros volumes de données</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Database className="h-3 w-3" />
                  <span>Gestion de gros volumes</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-1">
            <Button variant="ghost" size="sm" asChild className="whitespace-normal h-auto py-2 text-left group-hover:bg-amber-50 transition-colors">
              <Link to="/fundamentals/databases" className="flex items-center gap-1">
                Lire le cours sur les bases de données
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="whitespace-normal h-auto py-2 text-left group-hover:bg-amber-50 transition-colors">
              <Link to="/tools/data-processing" className="flex items-center gap-1">
                Voir les outils de traitement
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-t-4 border-t-purple-500 hover:border-t-purple-600 hover:-translate-y-1">
          <CardHeader className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100 rounded-full -translate-y-10 translate-x-10 opacity-20 group-hover:scale-110 transition-transform"></div>
            <CardTitle className="flex items-center gap-3 text-purple-700 relative z-10">
              <div className="p-2 rounded-lg bg-purple-100">
                <BrainCircuit className="h-6 w-6" />
              </div>
              Frameworks de Machine Learning
            </CardTitle>
            <CardDescription className="text-base">
              Bibliothèques pour développer des modèles d'apprentissage automatique
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm leading-relaxed">
                Des frameworks complets pour entraîner, évaluer et déployer des modèles d'apprentissage automatique
                et de deep learning, avec des interfaces adaptées à différents niveaux d'expertise.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary" className="bg-purple-50 text-purple-800 border-purple-200">scikit-learn</Badge>
                <Badge variant="secondary" className="bg-purple-50 text-purple-800 border-purple-200">TensorFlow</Badge>
                <Badge variant="secondary" className="bg-purple-50 text-purple-800 border-purple-200">PyTorch</Badge>
                <Badge variant="secondary" className="bg-purple-50 text-purple-800 border-purple-200">Keras</Badge>
                <Badge variant="secondary" className="bg-purple-50 text-purple-800 border-purple-200">XGBoost</Badge>
              </div>
              <div className="pt-2 space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BrainCircuit className="h-3 w-3" />
                  <span>IA et Deep Learning</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Zap className="h-3 w-3" />
                  <span>Calcul sur GPU possible (TensorFlow, PyTorch)</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-1">
            <Button variant="ghost" size="sm" asChild className="whitespace-normal h-auto py-2 text-left group-hover:bg-purple-50 transition-colors">
              <Link to="/machine-learning" className="flex items-center gap-1">
                Lire le cours d'apprentissage automatique
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="whitespace-normal h-auto py-2 text-left group-hover:bg-purple-50 transition-colors">
              <Link to="/tools/ml-frameworks" className="flex items-center gap-1">
                Voir les frameworks de ML
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-t-4 border-t-green-500 hover:border-t-green-600 hover:-translate-y-1">
          <CardHeader className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -translate-y-10 translate-x-10 opacity-20 group-hover:scale-110 transition-transform"></div>
            <CardTitle className="flex items-center gap-3 text-green-700 relative z-10">
              <div className="p-2 rounded-lg bg-green-100">
                <LineChart className="h-6 w-6" />
              </div>
              Outils de visualisation
            </CardTitle>
            <CardDescription className="text-base">
              Solutions pour créer des graphiques et des tableaux de bord interactifs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm leading-relaxed">
                Bibliothèques de visualisation, outils de BI et plateformes pour communiquer efficacement
                les résultats d'analyse et faciliter la prise de décision basée sur les données.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary" className="bg-green-50 text-green-800 border-green-200">Matplotlib</Badge>
                <Badge variant="secondary" className="bg-green-50 text-green-800 border-green-200">Plotly</Badge>
                <Badge variant="secondary" className="bg-green-50 text-green-800 border-green-200">D3.js</Badge>
                <Badge variant="secondary" className="bg-green-50 text-green-800 border-green-200">Tableau</Badge>
                <Badge variant="secondary" className="bg-green-50 text-green-800 border-green-200">Power BI</Badge>
              </div>
              <div className="pt-2 space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <LineChart className="h-3 w-3" />
                  <span>Visualisations interactives</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>Communication des résultats</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-1">
            <Button variant="ghost" size="sm" asChild className="whitespace-normal h-auto py-2 text-left group-hover:bg-green-50 transition-colors">
              <Link to="/tools/visualization" className="flex items-center gap-1">
                Explorer les outils de visualisation
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      {/* Métriques et conseils */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-2xl mt-8 border border-blue-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500 rounded-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Guides et ressources recommandées</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-blue-700">Plateformes d'apprentissage</h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="https://www.kaggle.com/learn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 hover:text-blue-600 transition-colors"
                >
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Kaggle Learn - Micro-cours gratuits
                </a>
              </li>
              <li>
                <a 
                  href="https://www.coursera.org/specializations/data-science-python" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 hover:text-blue-600 transition-colors"
                >
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Coursera - Spécialisation certifiante
                </a>
              </li>
            </ul>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <h4 className="font-semibold text-purple-700">Documentations officielles</h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="https://scikit-learn.org/stable/documentation.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 hover:text-purple-600 transition-colors"
                >
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Documentation scikit-learn
                </a>
              </li>
              <li>
                <a 
                  href="https://pandas.pydata.org/docs/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 hover:text-purple-600 transition-colors"
                >
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Documentation pandas
                </a>
              </li>
              <li>
                <a 
                  href="https://www.tensorflow.org/guide" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 hover:text-purple-600 transition-colors"
                >
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Guide TensorFlow
                </a>
              </li>
            </ul>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-green-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <Code2 className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="font-semibold text-green-700">Communautés et pratique</h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="https://stackoverflow.com/questions/tagged/data-science" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 hover:text-green-600 transition-colors"
                >
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Stack Overflow - Q&A techniques
                </a>
              </li>
              <li>
                <Link to="/community" className="group flex items-center gap-2 hover:text-green-600 transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Forums, actualités et liens de la communauté
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/topics/data-science" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 hover:text-green-600 transition-colors"
                >
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  GitHub - Projets open-source
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Guide de sélection */}
      <div className="p-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 mt-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gray-500 rounded-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Comment choisir vos outils ?</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-gray-700">
              Le choix des outils dépend de plusieurs facteurs critiques : la taille et la nature des données, 
              les contraintes techniques du projet, votre expertise et celle de votre équipe, ainsi que les 
              exigences en termes de performance et de déploiement.
            </p>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">Facteurs clés :</h4>
              <ul className="space-y-1 text-sm text-gray-600 pl-4">
                <li>• Volume et complexité des données</li>
                <li>• Budget et contraintes de temps</li>
                <li>• Niveau d'expertise de l'équipe</li>
                <li>• Besoins de collaboration</li>
                <li>• Exigences de déploiement</li>
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Une suggestion pour débuter (point de vue de l'auteur) :</h4>
            <div className="bg-white/80 p-4 rounded-lg border">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">Débutant</Badge>
                  <span>Python + pandas + matplotlib</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">Intermédiaire</Badge>
                  <span>+ scikit-learn + Plotly</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Avancé</Badge>
                  <span>+ TensorFlow/PyTorch + Spark</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsOverview;
