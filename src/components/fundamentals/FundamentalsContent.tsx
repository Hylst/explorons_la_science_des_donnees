
import { lazy, useState } from "react";
import ProgressiveSections from "@/components/layout/ProgressiveSections";
// Sections (graphiques, formules) chargées à la demande : le bandeau de la page s'affiche sans les attendre
const StatisticsSection = lazy(() => import("./statistics/StatisticsSection"));
const MathVisualsSection = lazy(() => import("./MathVisualsSection"));
const ProgrammingSection = lazy(() => import("./ProgrammingSection"));
const DataVizSection = lazy(() => import("./DataVizSection"));
const DataProcessingSection = lazy(() => import("./DataProcessingSection"));
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Book } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FundamentalsSectionType } from "./FundamentalsSidebar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Type pour les sections des fondamentaux
type SectionInfo = {
  id: FundamentalsSectionType;
  title: string;
  description: string;
};

const sections: SectionInfo[] = [
  {
    id: "statistics",
    title: "Statistiques & Mathématiques",
    description: "Les bases statistiques et mathématiques essentielles en Data Science"
  },
  {
    id: "mathvisuals", 
    title: "Visualisations Mathématiques",
    description: "Comprendre les concepts mathématiques par des visualisations interactives"
  },
  {
    id: "programming", 
    title: "Programmation",
    description: "Langages et outils de programmation pour la Data Science"
  },
  {
    id: "dataviz", 
    title: "Visualisation de Données",
    description: "Techniques et outils pour représenter visuellement les données"
  },
  {
    id: "dataprocessing", 
    title: "Traitement des Données",
    description: "Méthodes de préparation et de transformation des données"
  }
];

const FundamentalsContent = () => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const goToSection = (index: number) => {
    if (index >= 0 && index < sections.length) {
      setCurrentSectionIndex(index);
      const element = document.getElementById(sections[index].id);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth"
        });
      }
    }
  };

  const goToNextSection = () => goToSection(currentSectionIndex + 1);
  const goToPrevSection = () => goToSection(currentSectionIndex - 1);

  return (
    <div className="space-y-24">
      <div className="flex justify-between items-center mb-8 sticky top-0 z-20 bg-white/80 backdrop-blur-sm p-3 -mx-3 rounded-lg shadow-sm">
        <div className="flex-1">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Book size={16} />
                <span>Guide de navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 sm:w-96">
              <SheetHeader>
                <SheetTitle>Guide des fondamentaux</SheetTitle>
                <SheetDescription>
                  Explorez les différentes sections des fondamentaux de la Data Science
                </SheetDescription>
              </SheetHeader>
              <div className="py-6">
                <div className="relative">
                  <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-blue-100"></div>
                  {sections.map((section, index) => (
                    <div 
                      key={section.id} 
                      className="relative pl-6 pb-6 cursor-pointer group"
                      onClick={() => goToSection(index)}
                    >
                      <div className={`absolute left-0 w-4 h-4 rounded-full ${
                        currentSectionIndex === index ? 'bg-ds-blue-500' : 'bg-blue-100 group-hover:bg-blue-200'
                      } top-1.5 transition-colors`}></div>
                      <h3 className={`font-medium text-lg ${
                        currentSectionIndex === index ? 'text-ds-blue-600' : 'text-gray-700'
                      }`}>{section.title}</h3>
                      <p className="text-sm text-gray-600">{section.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" disabled={currentSectionIndex <= 0}>
                <ArrowUp size={16} />
              </Button>
            </PopoverTrigger>
            {currentSectionIndex > 0 && (
              <PopoverContent side="top" className="w-64">
                <div className="space-y-1">
                  <h4 className="font-medium">Section précédente</h4>
                  <p className="text-sm text-muted-foreground">{sections[currentSectionIndex - 1].title}</p>
                </div>
              </PopoverContent>
            )}
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                disabled={currentSectionIndex >= sections.length - 1}
              >
                <ArrowDown size={16} />
              </Button>
            </PopoverTrigger>
            {currentSectionIndex < sections.length - 1 && (
              <PopoverContent side="bottom" className="w-64">
                <div className="space-y-1">
                  <h4 className="font-medium">Section suivante</h4>
                  <p className="text-sm text-muted-foreground">{sections[currentSectionIndex + 1].title}</p>
                </div>
              </PopoverContent>
            )}
          </Popover>
        </div>
      </div>

      <ProgressiveSections>
        <StatisticsSection />
        <MathVisualsSection />
        <ProgrammingSection />
        <DataVizSection />
        <DataProcessingSection />
      </ProgressiveSections>

      <div className="flex justify-between pt-6 border-t">
        <Button 
          variant="outline" 
          onClick={goToPrevSection}
          disabled={currentSectionIndex <= 0}
          className="flex items-center gap-2"
        >
          <ArrowUp size={16} />
          <span>Section précédente</span>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={goToNextSection}
          disabled={currentSectionIndex >= sections.length - 1}
          className="flex items-center gap-2"
        >
          <span>Section suivante</span>
          <ArrowDown size={16} />
        </Button>
      </div>
    </div>
  );
};

export default FundamentalsContent;
