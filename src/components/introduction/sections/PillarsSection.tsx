
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Puzzle } from "lucide-react";

const PillarsSection = () => {
  const pillars = [
    {
      title: "Mathématiques & Statistiques",
      subtitle: "Le fondement théorique",
      description: "Probabilités, inférence statistique, algèbre linéaire et calcul différentiel sont les bases mathématiques essentielles de la Data Science.",
      color: "border-t-ds-blue-500",
      titleColor: "text-ds-blue-600",
      skills: [
        "Statistiques descriptives et inférentielles",
        "Tests d'hypothèses",
        "Analyse multivariée",
        "Probabilités et distributions"
      ]
    },
    {
      title: "Programmation",
      subtitle: "Les outils d'analyse",
      description: "Python, R, SQL et d'autres langages permettent de manipuler, analyser et visualiser les données efficacement.",
      color: "border-t-ds-purple-500",
      titleColor: "text-ds-purple-600",
      skills: [
        "Python avec pandas, numpy, scikit-learn",
        "R pour l'analyse statistique",
        "SQL pour l'accès aux données",
        "Outils de visualisation comme Matplotlib, Seaborn"
      ]
    },
    {
      title: "Connaissance du Domaine",
      subtitle: "Le contexte d'application",
      description: "Comprendre le contexte métier est indispensable pour poser les bonnes questions et interpréter correctement les résultats d'analyse.",
      color: "border-t-ds-blue-300",
      titleColor: "text-ds-blue-500",
      skills: [
        "Formulation de problématiques pertinentes",
        "Interprétation des résultats en contexte",
        "Communication efficace avec les parties prenantes",
        "Connaissance sectorielle (finance, santé, etc.)"
      ]
    },
    {
      title: "Intelligence Artificielle",
      subtitle: "Les algorithmes avancés",
      description: "Les techniques d'IA et d'apprentissage automatique permettent de construire des modèles qui apprennent à partir des données, par exemple pour prédire ou classer.",
      color: "border-t-ds-purple-300",
      titleColor: "text-ds-purple-500",
      skills: [
        "Machine Learning (supervisé, non supervisé)",
        "Deep Learning et réseaux de neurones",
        "Traitement du langage naturel (NLP)",
        "Computer Vision"
      ]
    },
    {
      title: "Ingénierie des données",
      subtitle: "L'infrastructure",
      description: "La construction et maintenance des pipelines permettant de collecter, stocker et prétraiter efficacement les données.",
      color: "border-t-ds-blue-400",
      titleColor: "text-ds-blue-500",
      skills: [
        "Bases de données relationnelles et NoSQL",
        "Big Data (Hadoop, Spark)",
        "ETL (Extract, Transform, Load)",
        "Cloud computing (AWS, GCP, Azure)"
      ]
    },
    {
      title: "Visualisation",
      subtitle: "La communication des résultats",
      description: "L'art de présenter les données de manière claire et compréhensible pour faciliter la prise de décision.",
      color: "border-t-ds-purple-400",
      titleColor: "text-ds-purple-600",
      skills: [
        "Narration à partir des données (data storytelling)",
        "Dashboards interactifs",
        "Bibliothèques de visualisation",
        "Design d'information"
      ]
    }
  ];

  return (
    <div id="pillars" className="scroll-mt-24 border-l-4 border-ds-blue-400 pl-6 py-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-ds-blue-100 p-2 rounded-full">
          <Puzzle className="h-6 w-6 text-ds-blue-500" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-ds-blue-400 to-ds-purple-400 bg-clip-text text-transparent">Les piliers de la Data Science</h2>
      </div>
      
      <div className="max-w-none">
        <p className="text-lg mb-6">
          La Data Science repose sur plusieurs disciplines complémentaires qui, ensemble, permettent de tirer parti des données. 
          Chacun de ces piliers apporte des compétences utiles au processus d'analyse.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
          {pillars.map((pillar, index) => (
            <Card key={index} className={`${pillar.color} hover:shadow-lg transition-all duration-300`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-xl ${pillar.titleColor}`}>{pillar.title}</CardTitle>
                <CardDescription>{pillar.subtitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{pillar.description}</p>
                <div className="mt-4 pt-4 border-t border-dashed">
                  <span className={`text-sm font-medium ${pillar.titleColor}`}>Compétences clés :</span>
                  <ul className="mt-2 space-y-1 text-sm">
                    {pillar.skills.map((skill, idx) => (
                      <li key={idx}>• {skill}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PillarsSection;
