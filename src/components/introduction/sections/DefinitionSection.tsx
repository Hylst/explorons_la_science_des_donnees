
import { Lightbulb } from "lucide-react";
import CustomCard from "@/components/ui/custom-card";

const DefinitionSection = () => {
  return (
    <div id="definition" className="scroll-mt-24 border-l-4 border-ds-blue-500 pl-6 py-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-ds-blue-100 p-2 rounded-full">
          <Lightbulb className="h-6 w-6 text-ds-blue-500" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-ds-blue-500 to-ds-purple-500 bg-clip-text text-transparent">Qu'est-ce que la Data Science ?</h2>
      </div>
      
      <div className="max-w-none">
        <p className="text-lg">
          La Data Science est un domaine interdisciplinaire qui utilise des méthodes scientifiques, des processus, des algorithmes et des systèmes pour extraire des connaissances et des enseignements à partir de données structurées et non structurées.
        </p>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg my-6 border border-blue-100">
          <p className="text-lg font-medium text-gray-800">
            Elle combine des compétences en mathématiques, statistiques, informatique et connaissance du domaine pour analyser et interpréter des données complexes, repérer des motifs (régularités), faire des prédictions et aider à la prise de décision.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <CustomCard
            cardTitle="Analyse de données"
            className="border-t-4 border-t-ds-blue-500 hover:shadow-md transition-all"
          >
            <p className="text-gray-700">Extraire des informations significatives à partir de masses de données brutes.</p>
          </CustomCard>
          
          <CustomCard
            cardTitle="Modélisation prédictive"
            className="border-t-4 border-t-ds-purple-500 hover:shadow-md transition-all"
          >
            <p className="text-gray-700">Créer des modèles mathématiques pour prédire des comportements ou résultats futurs.</p>
          </CustomCard>
          
          <CustomCard
            cardTitle="Aide à la décision"
            className="border-t-4 border-t-ds-blue-300 hover:shadow-md transition-all"
          >
            <p className="text-gray-700">Transformer les données en enseignements exploitables pour orienter les décisions stratégiques.</p>
          </CustomCard>
        </div>
      </div>
    </div>
  );
};

export default DefinitionSection;
