
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Brain, Target, Zap, Database, Globe, Cpu, BarChart3, Package, Tv } from "lucide-react";
import CourseHighlight from "@/components/courses/CourseHighlight";
import { GlossaryTerm } from "@/components/ui/glossary-term";
import { programmingDefinitions } from "@/components/fundamentals/definitions/programming-definitions";
import { useState, useEffect } from "react";
import { SourceNote } from "@/components/ui/source-note";

/**
 * Enhanced Programming Introduction Component with ES6 features
 * Provides comprehensive overview of programming languages for data science
 * Features interactive elements and modern JavaScript concepts
 */
const ProgrammingIntro = () => {
  // Modern ES6 state management with hooks
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [animationStep, setAnimationStep] = useState(0);

  // ES6 Array of objects with enhanced language data
  const programmingLanguages = [
    {
      id: 'python',
      name: 'Python',
      icon: Code,
      description: 'Un langage généraliste et lisible',
      badge: { text: 'Accessible aux débutants', color: 'bg-blue-100 text-blue-800' },
      popularity: 63,
      useCases: ['Machine learning', 'Analyse de données', 'Collecte de pages web', 'Automatisation'],
      pros: ['Syntaxe simple', 'Écosystème riche', 'Communauté active'],
      cons: ['Code Python pur plus lent que du code compilé', 'GIL pour le parallélisme par threads']
    },
    {
      id: 'r',
      name: 'R',
      icon: BarChart3,
      description: 'Un langage conçu pour les statistiques',
      badge: { text: 'Statistiques', color: 'bg-purple-100 text-purple-800' },
      popularity: 27,
      useCases: ['Analyses statistiques', 'Visualisation de données', 'Bio-informatique', 'Recherche'],
      pros: ['Très riche en méthodes statistiques', 'Visualisations soignées', 'Packages spécialisés'],
      cons: ['Courbe d\'apprentissage', 'Syntaxe parfois complexe']
    },
    {
      id: 'sql',
      name: 'SQL',
      icon: Database,
      description: 'Le langage des bases de données relationnelles',
      badge: { text: 'Très répandu', color: 'bg-amber-100 text-amber-800' },
      popularity: 35,
      useCases: ['Requêtes sur des bases de données', 'Extraction de données', 'Processus ETL', 'Rapports'],
      pros: ['Standard très répandu', 'Le moteur de la base optimise les requêtes', 'Déclaratif'],
      cons: ['Limité aux données relationnelles', 'Variations entre SGBD']
    },
    {
      id: 'julia',
      name: 'Julia',
      icon: Zap,
      description: 'Un langage pour le calcul scientifique rapide',
      badge: { text: 'Calcul intensif', color: 'bg-green-100 text-green-800' },
      popularity: 11,
      useCases: ['Calcul scientifique', 'Analyse numérique', 'Calcul haute performance', 'Finance'],
      pros: ['Performance native', 'Syntaxe mathématique', 'Parallélisme'],
      cons: ['Écosystème jeune', 'Communauté plus petite']
    }
  ];

  // ES6 useEffect hook for animations
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // ES6 Arrow function with destructuring
  const handleLanguageSelect = (languageId: string) => {
    setSelectedLanguage(selectedLanguage === languageId ? null : languageId);
  };

  // ES6 Template literals and array methods
  const getSelectedLanguageDetails = () => {
    if (!selectedLanguage) return null;
    return programmingLanguages.find(lang => lang.id === selectedLanguage);
  };
  return (
    <section id="intro" className="mb-16">
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 p-8 rounded-xl border border-blue-100 mb-8">
        <h2 className="text-3xl font-bold mb-6 text-blue-900">La programmation en data science</h2>
        
        <div className="max-w-none text-gray-700 mb-8">
          <p className="text-xl leading-relaxed mb-6">
            Programmer permet d'importer, de nettoyer, d'analyser et de visualiser des données de façon répétable :
            ce qu'on a fait une fois, on peut le refaire, le relire et le corriger. Quatre langages reviennent le plus
            souvent : Python, R, SQL et Julia.
          </p>
          
          <div className="bg-white p-6 rounded-lg border-l-4 border-blue-500 my-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">Un langage par besoin</h3>
            <p>
              Comme une langue étrangère, un langage de programmation s'apprend par la pratique. En data science, on apprend{" "}
              <GlossaryTerm definition={programmingDefinitions["python"]}>Python</GlossaryTerm>,{" "}
              <GlossaryTerm definition={programmingDefinitions["r"]}>R</GlossaryTerm> ou{" "}
              <GlossaryTerm definition={programmingDefinitions["sql"]}>SQL</GlossaryTerm>{" "}
              parce que chacun a ses spécialités et ses habitudes, et qu'il est courant d'en combiner plusieurs.
            </p>
          </div>
        </div>

        {/* Enhanced interactive language grid using ES6 map and modern features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {programmingLanguages.map((language, index) => {
            const isSelected = selectedLanguage === language.id;
            const isAnimated = animationStep === index;
            
            return (
              <div 
                key={language.id}
                className={`
                  bg-white p-6 rounded-lg shadow-sm border transition-all duration-300 cursor-pointer
                  ${isSelected ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-100 hover:border-gray-300'}
                  ${isAnimated ? 'animate-pulse' : ''}
                `}
                onClick={() => handleLanguageSelect(language.id)}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleLanguageSelect(language.id);
                  }
                }}
              >
                <div className="mb-3 transition-transform duration-200 hover:scale-110">
                  <language.icon className="h-8 w-8 text-blue-600" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{language.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{language.description}</p>
                <Badge className={`mt-2 ${language.badge.color}`}>
                  {language.badge.text}
                </Badge>
                
                {/* Popularity indicator */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Usage fréquent</span>
                    <span>{language.popularity}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${language.popularity}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <SourceNote
          className="text-center"
          consulted="1er octobre 2026"
          sources={[{ label: "Anaconda, State of Data Science 2021 : part des praticiens qui utilisent le langage « souvent » ou « toujours » (3 104 réponses)", href: "https://know.anaconda.com/rs/387-XNW-688/images/Anaconda-2021-SODS-Report-Final.pdf" }]}
        />

        {/* Enhanced language details section using ES6 conditional rendering */}
        {(() => {
          const selectedLang = getSelectedLanguageDetails();
          if (!selectedLang) return null;
          
          return (
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <selectedLang.icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                Détails sur {selectedLang.name}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-1">
                    <Zap className="h-4 w-4" /> Cas d'usage
                  </h4>
                  <ul className="space-y-1">
                    {selectedLang.useCases.map((useCase, idx) => (
                      <li key={idx} className="text-sm text-gray-600">• {useCase}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-1">
                    <Target className="h-4 w-4" /> Avantages
                  </h4>
                  <ul className="space-y-1">
                    {selectedLang.pros.map((pro, idx) => (
                      <li key={idx} className="text-sm text-gray-600">{pro}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-orange-700 mb-2 flex items-center gap-1">
                    <Brain className="h-4 w-4" /> Défis
                  </h4>
                  <ul className="space-y-1">
                    {selectedLang.cons.map((con, idx) => (
                      <li key={idx} className="text-sm text-gray-600">{con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })()}


        {/* Enhanced knowledge section with ES6 features */}
        <CourseHighlight title="Python en quelques repères" type="concept">
          <div className="space-y-4">
            <p>
              <strong>Python est le langage le plus cité dans les enquêtes auprès des praticiens de la data :</strong>{" "}
              75 % des répondants à l'enquête Anaconda 2020 (1 592 réponses, un échantillon surtout composé d'utilisateurs d'Anaconda) et 63 % de ceux de 2021 (3 104 réponses)
              disaient l'utiliser souvent ou toujours, devant SQL (35 % en 2021) et R (27 % en 2021). Chez les
              développeurs en général, Python est utilisé par 57,9 % des répondants de Stack Overflow en 2025, 7 points
              de plus qu'un an plus tôt. La popularité n'est pas la seule raison de l'apprendre : Python a été conçu pour
              rester simple et lisible, ce qui en fait un bon langage pour débuter.
            </p>
            
            {/* ES6 Array with map for fun facts */}
            {[
              {
                title: "Origine du nom Python",
                content: "Python doit son nom à la série télévisée britannique Monty Python's Flying Circus, et non au serpent. Son créateur, Guido van Rossum, cherchait un nom court et un peu mystérieux.",
                icon: Tv
              },
              {
                title: "Performance moderne",
                content: "PyPy, un interpréteur Python alternatif doté d'un compilateur JIT, est en moyenne environ 4 fois plus rapide que CPython 3.11 sur les tests de performance du projet. Le gain varie beaucoup selon le programme, et toutes les bibliothèques ne sont pas compatibles.",
                icon: Zap
              },
              {
                title: "Écosystème en croissance",
                content: "PyPI, le dépôt public de paquets Python, référence plus de 900 000 projets (905 050 au 1er octobre 2026), dont plus de 130 000 créés en 2025, tous domaines confondus : la data science n'en est qu'une partie.",
                icon: Package
              }
            ].map((fact, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-blue-400">
                <div className="flex items-start gap-3">
                  <fact.icon className="h-6 w-6 text-blue-600 shrink-0" aria-hidden="true" />
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-1">{fact.title}</h4>
                    <p className="text-sm text-gray-700">{fact.content}</p>
                  </div>
                </div>
              </div>
            ))}
            <SourceNote
              consulted="1er octobre 2026"
              sources={[
                { label: "Anaconda, State of Data Science 2020", href: "https://know.anaconda.com/rs/387-XNW-688/images/Anaconda-SODS-Report-2020-Final.pdf" },
                { label: "Anaconda, State of Data Science 2021", href: "https://know.anaconda.com/rs/387-XNW-688/images/Anaconda-2021-SODS-Report-Final.pdf" },
                { label: "Stack Overflow Developer Survey 2025", href: "https://survey.stackoverflow.co/2025/technology" },
                { label: "PyPy", href: "https://pypy.org/" },
                { label: "PyPI", href: "https://pypi.org/" },
              ]}
            />
          </div>
        </CourseHighlight>

        {/* Enhanced benefits section with ES6 destructuring and modern features */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            Pourquoi apprendre à programmer en Data Science ?
          </h3>
          
          {/* ES6 Array of benefits with destructuring */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Code,
                title: "Automatisation",
                description: "Un traitement refait à la main chaque semaine devient un script qui s'exécute en quelques secondes. La programmation vous libère des tâches répétitives pour vous concentrer sur l'analyse.",
                color: "text-green-600",
                bgColor: "bg-green-50",
                borderColor: "border-green-200",
                examples: ["Scripts ETL", "Rapports automatiques", "Monitoring"]
              },
              {
                icon: Brain,
                title: "Reproductibilité",
                description: "Un script décrit toutes les étapes d'une analyse : quelqu'un d'autre (ou vous-même, plus tard) peut les rejouer et obtenir les mêmes résultats. C'est une condition de la démarche scientifique.",
                color: "text-purple-600",
                bgColor: "bg-purple-50",
                borderColor: "border-purple-200",
                examples: ["Gestion de versions", "Documentation", "Tests unitaires"]
              },
              {
                icon: Database,
                title: "Scalabilité",
                description: "Traitez des volumes que les tableurs ne gèrent plus. Au-delà de la mémoire d'une machine, il faut des outils adaptés (bases de données, Spark, Dask), mais la démarche reste la même.",
                color: "text-blue-600",
                bgColor: "bg-blue-50",
                borderColor: "border-blue-200",
                examples: ["Données volumineuses", "Calcul dans le nuage", "Parallélisation"]
              },
              {
                icon: Globe,
                title: "Collaboration",
                description: "Partagez vos analyses avec une équipe, même à distance. Git, les notebooks et les API facilitent le travail à plusieurs.",
                color: "text-indigo-600",
                bgColor: "bg-indigo-50",
                borderColor: "border-indigo-200",
                examples: ["GitHub", "Jupyter Hub", "API REST"]
              },
              {
                icon: Zap,
                title: "Innovation",
                description: "Écrire du code permet d'implémenter une méthode récente décrite dans un article, de tester une idée ou de bâtir un prototype, sans attendre qu'un outil prêt à l'emploi existe.",
                color: "text-yellow-600",
                bgColor: "bg-yellow-50",
                borderColor: "border-yellow-200",
                examples: ["Modèles sur mesure", "Visualisations", "Prototypage"]
              },
              {
                icon: Cpu,
                title: "Efficacité",
                description: "Mesurer où un programme passe son temps permet de l'accélérer là où cela compte, et d'éviter de calculer deux fois la même chose.",
                color: "text-red-600",
                bgColor: "bg-red-50",
                borderColor: "border-red-200",
                examples: ["Optimisation", "Mise en cache", "Profilage"]
              }
            ].map(({ icon: Icon, title, description, color, bgColor, borderColor, examples }, index) => (
              <Card key={index} className={`${bgColor} ${borderColor} border-2 hover:shadow-lg transition-all duration-300`}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 text-lg ${color}`}>
                    <Icon className="h-5 w-5" />
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-4">{description}</p>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-600">Exemples :</p>
                    <div className="flex flex-wrap gap-1">
                      {examples.map((example, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Modern ES6 learning path section */}
          <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border border-indigo-200">
            <h4 className="text-lg font-bold mb-4 text-indigo-800">Parcours d'apprentissage suggéré (durées indicatives)</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { step: 1, title: "Bases de Python", duration: "2-3 semaines", topics: ["Syntaxe", "Variables", "Fonctions"] },
                { step: 2, title: "Manipulation de données", duration: "3-4 semaines", topics: ["Pandas", "NumPy", "Matplotlib"] },
                { step: 3, title: "Machine Learning", duration: "4-6 semaines", topics: ["Scikit-learn", "TensorFlow", "PyTorch"] },
                { step: 4, title: "Mise en production", duration: "2-3 semaines", topics: ["API", "Docker", "Cloud"] }
              ].map(({ step, title, duration, topics }) => (
                <div key={step} className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                    {step}
                  </div>
                  <h5 className="font-semibold text-gray-800 mb-1">{title}</h5>
                  <p className="text-xs text-gray-600 mb-2">{duration}</p>
                  <div className="space-y-1">
                    {topics.map((topic, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs mr-1">{topic}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgrammingIntro;
