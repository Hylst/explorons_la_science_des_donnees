
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Code, BookOpen, ExternalLink } from "lucide-react";

const PracticalApplicationsSection = () => {
  const applications = [
    {
      domain: "Recherche médicale",
      techniques: ["Essais cliniques", "Meta-analyses", "Survival analysis"],
      example: "Tester l'efficacité d'un nouveau médicament avec contrôle placebo",
      tools: ["R", "SAS", "SPSS"]
    },
    {
      domain: "Marketing digital",
      techniques: ["A/B testing", "Attribution modeling", "Customer lifetime value"],
      example: "Optimiser les campagnes publicitaires par tests multivariés",
      tools: ["Python", "Google Analytics", "Adobe Analytics"]
    },
    {
      domain: "Finance quantitative",
      techniques: ["Modèles de risque", "Backtesting", "Stress testing"],
      example: "Calculer la Value at Risk d'un portefeuille d'investissement",
      tools: ["Python", "R", "MATLAB", "Bloomberg"]
    },
    {
      domain: "Sciences sociales",
      techniques: ["Enquêtes", "Modèles multi-niveaux", "Analyse longitudinale"],
      example: "Étudier l'impact de l'éducation sur la mobilité sociale",
      tools: ["R", "Stata", "SPSS", "HLM"]
    }
  ];

  const resources = [
    {
      type: "Livres",
      items: [
        "Statistical Inference - Casella & Berger",
        "Bayesian Data Analysis - Gelman et al.",
        "The Elements of Statistical Learning - Hastie et al."
      ]
    },
    {
      type: "Logiciels",
      items: [
        "R (gratuit) - Très complet pour statistiques",
        "Python (scipy, statsmodels) - Polyvalent",
        "Stan - Spécialisé en Bayésien",
        "JASP - Interface graphique simple"
      ]
    },
    {
      type: "Formations en ligne",
      items: [
        "Coursera - Duke University Statistics",
        "edX - MIT Introduction to Probability",
        "Khan Academy - Statistics and Probability"
      ]
    }
  ];

  return (
    <section id="applications" className="scroll-mt-24">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Target className="h-8 w-8 text-green-600" />
          Applications Pratiques
        </h2>
        <p className="text-lg text-gray-600">
          Découvrez comment appliquer les statistiques avancées dans différents domaines professionnels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {applications.map((app, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl text-blue-700">{app.domain}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Techniques utilisées :</h4>
                <div className="flex flex-wrap gap-2">
                  {app.techniques.map((tech, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-semibold text-gray-700 mb-1">Exemple concret :</h4>
                <p className="text-sm text-gray-600 italic">{app.example}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Outils recommandés :</h4>
                <div className="flex flex-wrap gap-2">
                  {app.tools.map((tool, idx) => (
                    <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-6 w-6 text-purple-600" />
            Exemple pratique : Test A/B
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Problématique</h4>
              <div className="bg-blue-50 p-4 rounded space-y-2">
                <p className="text-sm">
                  <strong>Contexte :</strong> Site e-commerce teste 2 versions d'une page produit
                </p>
                <p className="text-sm">
                  <strong>Objectif :</strong> Améliorer le taux de conversion
                </p>
                <p className="text-sm">
                  <strong>Métriques :</strong> Taux de conversion A vs B
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Analyse statistique</h4>
              <div className="bg-green-50 p-4 rounded space-y-2">
                <p className="text-sm">
                  <strong>Test :</strong> Test de proportion (z-test)
                </p>
                <p className="text-sm">
                  <strong>H₀ :</strong> p_A = p_B (pas de différence)
                </p>
                <p className="text-sm">
                  <strong>Seuil :</strong> α = 0.05
                </p>
                <p className="text-sm">
                  <strong>Puissance :</strong> 80% pour détecter +2% de conversion
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-gray-50 p-4 rounded">
            <h4 className="font-semibold mb-2">Code R exemple :</h4>
            <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
{`# Test de proportion
prop.test(x = c(120, 140), n = c(1000, 1000))

# Calcul de taille d'échantillon
power.prop.test(p1 = 0.10, p2 = 0.12, power = 0.80)`}
            </pre>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
                {resource.type}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {resource.items.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <ExternalLink className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-100">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Target className="h-6 w-6 text-green-600" />
          Prochaines étapes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Pour approfondir :</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Pratiquez avec des datasets réels</li>
              <li>• Participez à des compétitions Kaggle</li>
              <li>• Rejoignez des communautés R/Python</li>
              <li>• Suivez des MOOCs spécialisés</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Exemples de certifications (vérifiez leur disponibilité actuelle) :</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• SAS Certified Statistical Business Analyst</li>
              <li>• Spécialisations en ligne (Coursera, edX) : attestations de suivi, non des diplômes</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PracticalApplicationsSection;
