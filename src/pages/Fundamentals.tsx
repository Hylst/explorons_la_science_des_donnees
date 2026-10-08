
import ContentLayout from "@/components/layout/ContentLayout";
import FundamentalsContent from "@/components/fundamentals/FundamentalsContent";
import FundamentalsSidebar, { FundamentalsSectionType } from "@/components/fundamentals/FundamentalsSidebar";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";
import { useSectionTracker } from "@/hooks/use-section-tracker";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { Link } from "react-router-dom";
import { Brain, Code, Database } from "lucide-react";
import LazyBlock from "@/components/layout/LazyBlock";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { lazy, useState } from "react";

// Le glossaire technique (127 Ko de définitions) n'est chargé que s'il est ouvert
const GlossaryTermsBank = lazy(() => import("@/components/fundamentals/GlossaryTermsBank"));

const Fundamentals = () => {
  const sections: FundamentalsSectionType[] = ["statistics", "mathvisuals", "programming", "dataviz", "dataprocessing"];
  const { currentSection, setCurrentSection } = useSectionTracker<FundamentalsSectionType>(sections);
  const [showGlossary, setShowGlossary] = useState(false);
  
  useSmoothScroll();
  
  const handleSectionChange = (section: FundamentalsSectionType) => {
    setCurrentSection(section);
    // Scroll to the section
    const element = document.getElementById(section);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth"
      });
    }
  };

  const sidebar = FundamentalsSidebar({ 
    currentSection, 
    onSectionChange: handleSectionChange 
  });

  return (
    <ContentLayout 
      title="Fondamentaux de la Data Science" 
      backLink={{ href: "/introduction", label: "Retour à l'introduction" }}
      sidebar={sidebar}
    >
      <section id="fundamentals-content" className="py-8 w-full">
        <UnifiedHeroSection
          variant="page"
          title="Fondamentaux de la Data Science"
          description="Les fondamentaux de la data science : mathématiques, statistiques, programmation et traitement des données."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 w-full">
          <Link 
            to="/fundamentals/math-stats" 
            className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100 hover:border-blue-300 transition-all"
          >
            <Brain className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="font-semibold">Maths & Stats</h3>
              <p className="text-sm text-muted-foreground">Probabilités, statistiques et algèbre</p>
            </div>
          </Link>

          <Link 
            to="/fundamentals/programming" 
            className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100 hover:border-purple-300 transition-all"
          >
            <Code className="h-6 w-6 text-purple-600" />
            <div>
              <h3 className="font-semibold">Programmation</h3>
              <p className="text-sm text-muted-foreground">Python, R et langages de Data Science</p>
            </div>
          </Link>

          <Link 
            to="/fundamentals/data-preparation" 
            className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100 hover:border-orange-300 transition-all"
          >
            <Database className="h-6 w-6 text-orange-600" />
            <div>
              <h3 className="font-semibold">Traiter les données</h3>
              <p className="text-sm text-muted-foreground">Nettoyage, transformation et préparation</p>
            </div>
          </Link>

          <Link 
            to="/fundamentals/databases" 
            className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border border-emerald-100 hover:border-emerald-300 transition-all"
          >
            <Database className="h-6 w-6 text-emerald-600" />
            <div>
              <h3 className="font-semibold">Bases de données</h3>
              <p className="text-sm text-muted-foreground">SQL, NoSQL et gestion des données</p>
            </div>
          </Link>
        </div>
        
        <Collapsible open={showGlossary} onOpenChange={setShowGlossary}>
          <div className="flex justify-center mb-6">
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                {showGlossary ? "Masquer le glossaire technique" : "Afficher le glossaire technique"}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <LazyBlock>
              <GlossaryTermsBank />
            </LazyBlock>
          </CollapsibleContent>
        </Collapsible>

        <div className="w-full">
          <FundamentalsContent />
        </div>
      </section>
    </ContentLayout>
  );
};

export default Fundamentals;
