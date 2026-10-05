
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { GlossaryTerm } from "@/components/ui/glossary-term";
import { statisticsDefinitions } from "../definitions/statistics-definitions";

const DescriptiveStatistics = () => {
  return (
    <Card className="border-t-4 border-t-ds-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GlossaryTerm definition={statisticsDefinitions["statistiques-descriptives"]}>
            Statistiques descriptives
          </GlossaryTerm>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Méthodes pour résumer et décrire les caractéristiques principales d'un ensemble de données.</p>
        <ul className="mt-4 space-y-3">
          <li className="flex items-baseline">
            <ChevronRight size={16} className="text-blue-500 flex-shrink-0 mr-2" />
            <div>
              <GlossaryTerm 
                definition={statisticsDefinitions["moyenne"]} 
                variant="tooltip" 
                highlightStyle="dotted"
              >
                <span className="font-medium">Moyenne</span>
              </GlossaryTerm>
              {", "}
              <GlossaryTerm 
                definition={statisticsDefinitions["médiane"]} 
                variant="tooltip"
                highlightStyle="dashed"
              >
                <span className="font-medium">médiane</span>
              </GlossaryTerm>
              {" et mode"}
              <p className="text-sm text-gray-600">Mesures de tendance centrale qui déterminent le "centre" d'un ensemble de données</p>
            </div>
          </li>
          <li className="flex items-baseline">
            <ChevronRight size={16} className="text-blue-500 flex-shrink-0 mr-2" />
            <div>
              <GlossaryTerm 
                definition={statisticsDefinitions["écart-type"]} 
                variant="hover"
                highlightStyle="underline"
              >
                <span className="font-medium">Variance et écart-type</span>
              </GlossaryTerm>
              <p className="text-sm text-gray-600">Mesures de dispersion indiquant la variabilité des données</p>
            </div>
          </li>
          <li className="flex items-baseline">
            <ChevronRight size={16} className="text-blue-500 flex-shrink-0 mr-2" />
            <div>
              <span className="font-medium">Percentiles et quartiles</span>
              <p className="text-sm text-gray-600">Position relative des données dans l'ensemble ordonné</p>
            </div>
          </li>
          <li className="flex items-baseline">
            <ChevronRight size={16} className="text-blue-500 flex-shrink-0 mr-2" />
            <div>
              <GlossaryTerm 
                definition={statisticsDefinitions["distribution-normale"]} 
                variant="click"
                highlightStyle="glow"
              >
                <span className="font-medium">Distributions statistiques</span>
              </GlossaryTerm>
              <p className="text-sm text-gray-600">Modèles mathématiques décrivant la répartition des données</p>
            </div>
          </li>
        </ul>
        
        <div className="mt-6 p-3 bg-blue-50 rounded-md border border-blue-100">
          <p className="text-sm">
            Les statistiques descriptives constituent le fondement de toute analyse de données, permettant de
            <GlossaryTerm 
              definition={statisticsDefinitions["statistiques-descriptives"]} 
              highlightStyle="underline"
            > synthétiser l'information </GlossaryTerm>
            contenue dans de grands ensembles de données en quelques métriques clés.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DescriptiveStatistics;
