import React from 'react';
import { Badge } from '@/components/ui/badge';
import { GlossaryTerm } from '@/components/ui/glossary-term';
import { dataPreparationEnhancedDefinitions } from '../../../data/data-preparation-enhanced-definitions';
import CourseHighlight from '@/components/courses/CourseHighlight';
import { BarChart3, Calculator, ClipboardList, Layers, Settings } from 'lucide-react';

/**
 * TransformationSection Component
 * 
 * This component handles the "Data Transformation" section of the data preparation page.
 * It covers the four types of data transformation: structural, format, calculated, and statistical.
 */
const TransformationSection: React.FC = () => {
  return (
    <section id="transformation" className="space-y-12">
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-bold flex items-center justify-center gap-3">
          <Settings className="h-8 w-8 text-purple-500" />
          Transformation des données
        </h2>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          Une fois nettoyées, les données doivent être transformées pour répondre aux besoins spécifiques 
          de l'analyse : normalisation, agrégation, création de variables dérivées.
        </p>
      </div>

      <CourseHighlight type="concept" title="Quatre types de transformation">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {[
            {
              type: "Structurelle",
              Icon: Layers,
              description: "Modification de la structure des données",
              examples: ["Pivot/Unpivot", "Jointures", "Groupement"]
            },
            {
              type: "Format",
              Icon: ClipboardList,
              description: "Standardisation des formats",
              examples: ["Dates", "Texte", "Nombres", "Unités"]
            },
            {
              type: "Calculée",
              Icon: Calculator,
              description: "Création de nouvelles variables",
              examples: ["Ratios", "Tendances", "Scores", "Catégories"]
            },
            {
              type: "Statistique",
              Icon: BarChart3,
              description: "Normalisation et mise à l'échelle",
              examples: ["Z-score", "Min-Max", "Quantiles", "Log"]
            }
          ].map((transfo, index) => (
            <div key={index} className="p-4 bg-muted/30 rounded-lg">
              <div className="text-center mb-3">
                <transfo.Icon className="h-8 w-8 mx-auto mb-2 text-purple-600" aria-hidden="true" />
                <h4 className="font-semibold text-purple-700">
                  <GlossaryTerm 
                    definition={dataPreparationEnhancedDefinitions[
                      transfo.type === 'Structurelle' ? 'transformation' :
                      transfo.type === 'Format' ? 'transformation' :
                      transfo.type === 'Calculée' ? 'transformation' :
                      'transformation'
                    ]}
                    variant="hover"
                    highlightStyle="glow"
                  >
                    {transfo.type}
                  </GlossaryTerm>
                </h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{transfo.description}</p>
              <div className="space-y-1">
                {transfo.examples.map((example, eIndex) => (
                  <Badge key={eIndex} variant="outline" className="text-xs mr-1">
                    {example}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CourseHighlight>
    </section>
  );
};

export default TransformationSection;