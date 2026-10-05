import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { GlossaryTerm } from '@/components/ui/glossary-term';
import { dataPreparationEnhancedDefinitions } from '@/data/data-preparation-enhanced-definitions';
import { Eye, FileText, Workflow } from 'lucide-react';

/**
 * SummarySection Component
 * 
 * This component handles the "Summary" section of the data preparation page.
 * It provides a recap of the key success factors for data preparation.
 */
const SummarySection: React.FC = () => {
  return (
    <section className="space-y-8">
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-center text-green-700">
            🎯 Récapitulatif : Les Clés du Succès
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-green-700">Comprendre avant d'Agir</h4>
              <p className="text-sm text-green-600">
                Toujours <GlossaryTerm 
                  definition={dataPreparationEnhancedDefinitions['pandasProfiling']}
                  variant="hover"
                  highlightStyle="underline"
                >
                  auditer
                </GlossaryTerm> et explorer vos données avant de commencer le <GlossaryTerm 
                  definition={dataPreparationEnhancedDefinitions['nettoyage']}
                  variant="hover"
                  highlightStyle="underline"
                >
                  nettoyage
                </GlossaryTerm>
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-blue-700">Documenter les Décisions</h4>
              <p className="text-sm text-blue-600">
                Tracer chaque transformation pour assurer la reproductibilité
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                <Workflow className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-purple-700">Automatiser les Processus</h4>
              <p className="text-sm text-purple-600">
                Créer des <GlossaryTerm 
                  definition={dataPreparationEnhancedDefinitions['etl']}
                  variant="hover"
                  highlightStyle="underline"
                >
                  pipelines
                </GlossaryTerm> reproductibles pour industrialiser le traitement
              </p>
            </div>
          </div>

          <Separator />

          <div className="text-center space-y-4">
            <h4 className="text-lg font-semibold text-slate-700">
              Des données de qualité sont le carburant de l'intelligence artificielle
            </h4>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Le temps investi dans le traitement des données n'est jamais perdu. 
              C'est un investissement qui paie tout au long du projet et assure la fiabilité de vos résultats.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default SummarySection;