
import { BookOpen } from "lucide-react";

interface LifecycleStepProps {
  num: string;
  title: string;
  desc: string;
  colorClass?: string;
}

const LifecycleStep = ({ num, title, desc, colorClass = "text-ds-purple-300" }: LifecycleStepProps) => (
  <div className="flex flex-col p-4 border rounded-lg hover:bg-gray-50 transition-colors">
    <span className={`text-3xl font-bold ${colorClass}`}>{num}</span>
    <h3 className="text-lg font-semibold mt-2">{title}</h3>
    <p className="text-gray-600 text-sm mt-1">{desc}</p>
  </div>
);

const LifecycleSection = () => {
  const firstSteps: LifecycleStepProps[] = [
    { 
      num: "01", 
      title: "Définition du problème", 
      desc: "Comprendre le problème métier et formuler une question précise à résoudre avec les données" 
    },
    { 
      num: "02", 
      title: "Collecte des données", 
      desc: "Identifier et rassembler les données pertinentes à partir de diverses sources" 
    },
    { 
      num: "03", 
      title: "Préparation des données", 
      desc: "Nettoyer, transformer et préparer les données pour l'analyse (traitement des valeurs manquantes, outliers, etc.)" 
    },
    { 
      num: "04", 
      title: "Exploration des données", 
      desc: "Analyser les données pour identifier les patterns, relations et tendances à l'aide de statistiques descriptives et visualisations" 
    },
  ];

  const secondSteps: LifecycleStepProps[] = [
    { 
      num: "05", 
      title: "Modélisation", 
      desc: "Construire et entraîner des modèles statistiques ou algorithmes de Machine Learning adaptés au problème", 
      colorClass: "text-ds-blue-400" 
    },
    { 
      num: "06", 
      title: "Évaluation", 
      desc: "Tester et mesurer la performance des modèles avec des métriques pertinentes pour s'assurer de leur validité", 
      colorClass: "text-ds-blue-400" 
    },
    { 
      num: "07", 
      title: "Déploiement", 
      desc: "Mettre en production les modèles pour qu'ils puissent être utilisés dans un environnement réel", 
      colorClass: "text-ds-blue-400" 
    },
    { 
      num: "08", 
      title: "Monitoring", 
      desc: "Surveiller les performances du modèle sur le long terme et l'ajuster en fonction des évolutions des données", 
      colorClass: "text-ds-blue-400" 
    },
  ];

  return (
    <div id="lifecycle" className="scroll-mt-24 border-l-4 border-ds-purple-400 pl-6 py-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-ds-purple-100 p-2 rounded-full">
          <BookOpen className="h-6 w-6 text-ds-purple-500" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-ds-purple-400 to-ds-blue-400 bg-clip-text text-transparent">Le cycle de vie d'un projet Data Science</h2>
      </div>
      
      <div className="max-w-none">
        <p className="text-lg mb-6">
          Un projet de Data Science suit généralement un processus itératif et cyclique. Chaque étape est essentielle 
          et le processus est souvent non-linéaire, avec des allers-retours fréquents entre les différentes phases.
        </p>
        
        <div className="bg-white rounded-xl shadow-sm border p-6 my-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {firstSteps.map((step, index) => (
              <LifecycleStep key={index} {...step} />
            ))}
          </div>
          
          <div className="relative py-4 my-4">
            <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-ds-purple-200 to-ds-blue-200"></div>
            <div className="flex justify-center">
              <div className="bg-white px-6 relative -top-3 text-gray-500">Processus itératif</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {secondSteps.map((step, index) => (
              <LifecycleStep key={index} {...step} />
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
          <h3 className="text-xl font-semibold mb-4">Caractéristiques du cycle de vie en Data Science</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="bg-ds-purple-100 p-1 rounded-full flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-ds-purple-500 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-medium">Itératif</h4>
                  <p className="text-sm text-gray-600">Le processus implique des cycles répétés d'amélioration, plutôt qu'une progression linéaire.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-ds-purple-100 p-1 rounded-full flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-ds-purple-500 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-medium">Adaptable</h4>
                  <p className="text-sm text-gray-600">L'approche doit s'ajuster en fonction des découvertes faites pendant l'analyse.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-ds-purple-100 p-1 rounded-full flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-ds-purple-500 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-medium">Orienté problème</h4>
                  <p className="text-sm text-gray-600">Chaque projet commence par une question ou un problème spécifique à résoudre.</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="bg-ds-blue-100 p-1 rounded-full flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-ds-blue-500 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-medium">Collaboratif</h4>
                  <p className="text-sm text-gray-600">Implique différentes expertises (data scientists, ingénieurs, experts métier, etc.).</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-ds-blue-100 p-1 rounded-full flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-ds-blue-500 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-medium">Évolutif</h4>
                  <p className="text-sm text-gray-600">Les modèles doivent être maintenus et mis à jour pour rester pertinents avec l'évolution des données.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-ds-blue-100 p-1 rounded-full flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-ds-blue-500 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-medium">Méthodique</h4>
                  <p className="text-sm text-gray-600">Suit une approche structurée et rigoureuse, même si elle est flexible.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifecycleSection;
