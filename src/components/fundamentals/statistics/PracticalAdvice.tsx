
import { Lightbulb } from "lucide-react";

const PracticalAdvice = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg my-6 border border-blue-100">
      <div className="flex gap-2 items-start">
        <Lightbulb className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
        <div>
          <p className="text-lg font-medium text-gray-800 mb-2">
            Conseil pratique pour débutants
          </p>
          <p className="text-gray-700">
            Commencez par bien comprendre les statistiques descriptives et la visualisation avant de vous plonger dans les tests d'hypothèse complexes. 
            Comprendre la distribution de vos données est souvent l'étape la plus précieuse d'une analyse.
          </p>
          
          <div className="mt-4 p-3 bg-white rounded-md border border-blue-100">
            <p className="font-medium text-blue-800 mb-2">Workflow recommandé :</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Explorer les données (statistiques descriptives, visualisations)</li>
              <li>Formuler des hypothèses basées sur cette exploration</li>
              <li>Tester ces hypothèses avec des méthodes statistiques appropriées</li>
              <li>Interpréter les résultats en tenant compte des limites</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticalAdvice;
