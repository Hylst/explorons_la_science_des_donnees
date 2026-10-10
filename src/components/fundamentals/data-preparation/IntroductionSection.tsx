import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Database, TrendingUp } from 'lucide-react';
import { GlossaryTerm } from '@/components/ui/glossary-term';
import { dataPreparationEnhancedDefinitions } from '../../../data/data-preparation-enhanced-definitions';
import CourseHighlight from '@/components/courses/CourseHighlight';
import { SourceNote } from "@/components/ui/source-note";

/**
 * Introduction section component for Data Preparation page
 * Provides overview and importance of data preparation in data science
 */
const IntroductionSection: React.FC = () => {
  return (
    <section id="introduction" className="space-y-8">
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-bold flex items-center justify-center gap-3">
          <Eye className="h-8 w-8 text-blue-500" />
          Introduction à la préparation des données
        </h2>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          La préparation des données occupe une très grande part du travail d'un data scientist : 45 % du temps déclaré dans l'enquête Anaconda 2020 (chargement et nettoyage), 38 % dans celle de 2022. Les « 50 à 80 % » souvent cités viennent d'estimations d'experts rapportées par la presse en 2014, pas d'une mesure. 
          Cette étape cruciale détermine la qualité et la fiabilité de vos analyses.
        </p>
        <SourceNote
          className="max-w-4xl mx-auto"
          consulted="1er octobre 2026"
          sources={[
            { label: "Anaconda, State of Data Science 2020", href: "https://know.anaconda.com/rs/387-XNW-688/images/Anaconda-SODS-Report-2020-Final.pdf" },
            { label: "Anaconda 2022 (relayé par VentureBeat)", href: "https://venturebeat.com/ai/what-are-data-scientists-biggest-concerns-the-2022-state-of-data-science-report-has-the-answers" },
            { label: "Lohr, New York Times, 2014 (miroir)", href: "https://thelivinglib.org/for-big-data-scientists-janitor-work-is-key-hurdle-to-insights/" },
          ]}
        />
      </div>

      <CourseHighlight type="concept" title="Pourquoi la préparation des données est-elle si importante ?">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="text-center p-4">
            <Database className="h-12 w-12 mx-auto mb-3 text-blue-500" />
            <h4 className="font-semibold mb-2">
              <GlossaryTerm 
                definition={dataPreparationEnhancedDefinitions['exactitude']}
                variant="hover"
                highlightStyle="glow"
              >
                Qualité des données
              </GlossaryTerm>
            </h4>
            <p className="text-sm text-muted-foreground">
              Des données de qualité sont une condition nécessaire, mais pas suffisante, de résultats fiables et de décisions éclairées.
            </p>
          </div>
          <div className="text-center p-4">
            <TrendingUp className="h-12 w-12 mx-auto mb-3 text-green-500" />
            <h4 className="font-semibold mb-2">Performance des modèles</h4>
            <p className="text-sm text-muted-foreground">
              Une <GlossaryTerm 
                definition={dataPreparationEnhancedDefinitions['nettoyage']}
                variant="hover"
                highlightStyle="underline"
              >
                préparation
              </GlossaryTerm> soignée (traitement des valeurs manquantes, mise à l'échelle, encodage) améliore souvent les performances des algorithmes.
            </p>
          </div>
          <div className="text-center p-4">
            <Eye className="h-12 w-12 mx-auto mb-3 text-purple-500" />
            <h4 className="font-semibold mb-2">Repérer ce qui se cache</h4>
            <p className="text-sm text-muted-foreground">
              L'exploration permet de repérer des motifs et des anomalies qu'un simple coup d'œil sur les données brutes ne montre pas.
            </p>
          </div>
        </div>
      </CourseHighlight>

      <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-500" />
            Les enjeux de la préparation des données
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-red-700">Problèmes courants</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Données manquantes (très fréquentes, taux variable)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Formats incohérents et erreurs de saisie</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Doublons et valeurs aberrantes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Données obsolètes ou non représentatives</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-green-700">Bénéfices d'une bonne préparation</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Des modèles plus fiables et plus performants (l'ampleur dépend des données)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Moins d'erreurs d'interprétation, et prise en compte de certains biais</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Accélération du développement des modèles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Confiance accrue dans les résultats</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default IntroductionSection;