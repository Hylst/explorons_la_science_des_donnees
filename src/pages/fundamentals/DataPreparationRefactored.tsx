import React, { useState, useEffect, useCallback, useMemo } from "react";
import ContentLayout from "@/components/layout/ContentLayout";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";

// Import extracted components with React.memo optimization
import IntroductionSection from '@/components/fundamentals/data-preparation/IntroductionSection';
import LifecycleSection from '@/components/fundamentals/data-preparation/LifecycleSection';
import CollectionSection from '@/components/fundamentals/data-preparation/CollectionSection';
import AuditSection from '@/components/fundamentals/data-preparation/AuditSection';
import CleaningSection from '@/components/fundamentals/data-preparation/CleaningSection';
import TransformationSection from '@/components/fundamentals/data-preparation/TransformationSection';
import { VisualExplorationSection } from '@/components/fundamentals/data-preparation/VisualExplorationSection';
import { ValidationSection } from '@/components/fundamentals/data-preparation/ValidationSection';
import { AutomationSection } from '@/components/fundamentals/data-preparation/AutomationSection';
import SummarySection from '@/components/fundamentals/data-preparation/SummarySection';
import ProgressBar from '@/components/fundamentals/data-preparation/ProgressBar';
import EnhancedDataQualitySection from '@/components/fundamentals/data-preparation/EnhancedDataQualitySection';

import { 
  Database, 
  Search, 
  Brush, 
  BarChart3, 
  Eye, 
  CheckCircle2, 
  Settings,
  RefreshCw,
  Workflow
} from "lucide-react";

// Memoized components for performance optimization
const MemoizedIntroductionSection = React.memo(IntroductionSection);
const MemoizedLifecycleSection = React.memo(LifecycleSection);
const MemoizedCollectionSection = React.memo(CollectionSection);
const MemoizedAuditSection = React.memo(AuditSection);
const MemoizedCleaningSection = React.memo(CleaningSection);
const MemoizedTransformationSection = React.memo(TransformationSection);
const MemoizedVisualExplorationSection = React.memo(VisualExplorationSection);
const MemoizedValidationSection = React.memo(ValidationSection);
const MemoizedAutomationSection = React.memo(AutomationSection);
const MemoizedSummarySection = React.memo(SummarySection);
const MemoizedProgressBar = React.memo(ProgressBar);
const MemoizedEnhancedDataQualitySection = React.memo(EnhancedDataQualitySection);

/**
 * DataPreparationRefactored Component
 * 
 * Refactored version of the data preparation page with:
 * - Modular component architecture
 * - Performance optimizations with React.memo
 * - Keyboard navigation support
 * - Progress tracking
 * - Responsive design
 */
const DataPreparationRefactored = () => {
  const [currentSection, setCurrentSection] = useState<string>('introduction');

  // Éléments de la barre latérale : recalculés uniquement quand la section courante change
  const sidebarItems = useMemo(() => [
    {
      title: "Introduction",
      href: "#introduction",
      icon: <Eye className="h-4 w-4" />,
      isActive: currentSection === 'introduction'
    },
    {
      title: "Cycle de vie",
      href: "#lifecycle",
      icon: <RefreshCw className="h-4 w-4" />,
      isActive: currentSection === 'lifecycle'
    },
    {
      title: "Collecte de données",
      href: "#collection",
      icon: <Database className="h-4 w-4" />,
      isActive: currentSection === 'collection'
    },
    {
      title: "Audit qualité",
      href: "#audit",
      icon: <Search className="h-4 w-4" />,
      isActive: currentSection === 'audit'
    },
    {
      title: "Qualité Avancée",
      href: "#enhanced-quality",
      icon: <Database className="h-4 w-4" />,
      isActive: currentSection === 'enhanced-quality'
    },
    {
      title: "Nettoyage",
      href: "#cleaning",
      icon: <Brush className="h-4 w-4" />,
      isActive: currentSection === 'cleaning'
    },
    {
      title: "Transformation",
      href: "#transformation",
      icon: <Settings className="h-4 w-4" />,
      isActive: currentSection === 'transformation'
    },
    {
      title: "Exploration visuelle",
      href: "#exploration",
      icon: <BarChart3 className="h-4 w-4" />,
      isActive: currentSection === 'exploration'
    },
    {
      title: "Validation",
      href: "#validation",
      icon: <CheckCircle2 className="h-4 w-4" />,
      isActive: currentSection === 'validation'
    },
    {
      title: "Automatisation",
      href: "#automation",
      icon: <Workflow className="h-4 w-4" />,
      isActive: currentSection === 'automation'
    }
  ], [currentSection]);

  // Keyboard navigation support
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.altKey) {
      const currentIndex = sidebarItems.findIndex(item => item.isActive);
      let nextIndex = currentIndex;

      switch (event.key) {
        case 'ArrowDown':
        case 'j':
          event.preventDefault();
          nextIndex = Math.min(currentIndex + 1, sidebarItems.length - 1);
          break;
        case 'ArrowUp':
        case 'k':
          event.preventDefault();
          nextIndex = Math.max(currentIndex - 1, 0);
          break;
        case 'Home':
          event.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          nextIndex = sidebarItems.length - 1;
          break;
      }

      if (nextIndex !== currentIndex) {
        const targetSection = sidebarItems[nextIndex].href.substring(1);
        const element = document.getElementById(targetSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setCurrentSection(targetSection);
        }
      }
    }
  }, [sidebarItems]);

  // Track current section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = sidebarItems.map(item => item.href.substring(1));
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setCurrentSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, sidebarItems]);

  return (
    <>
      
      <ContentLayout
        title="Préparation des Données"
        backLink={{
          href: "/fundamentals",
          label: "Retour aux Fondamentaux"
        }}
        sidebar={{
          items: sidebarItems
        }}
      >
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          {/* Hero Section */}
          <UnifiedHeroSection
            variant="course"
            title="Préparation des Données"
            subtitle="Apprenez l'art de transformer des données brutes en insights exploitables"
            description="La préparation des données est la plus grande part du travail en data science (38 à 45 % du temps déclaré dans les enquêtes Anaconda 2022 et 2020). Techniques, outils et bonnes pratiques pour nettoyer, transformer et valider ses données."
            courseInfo={{
              level: "Fondamentaux",
              duration: "3h",
              modules: 9,
              totalHours: "3h"
            }}
            actions={[
              {
                label: "Commencer l'apprentissage",
                to: "#introduction",
                variant: "default"
              }
            ]}
          />

          {/* Progress Bar - Sticky */}
          <div className="container mx-auto px-4 py-4">
            <div className="max-w-4xl mx-auto">
              <MemoizedProgressBar currentSection={currentSection} />
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto space-y-16">
              {/* Introduction Section */}
              <MemoizedIntroductionSection />

              {/* Lifecycle Section */}
              <MemoizedLifecycleSection />

              {/* Collection Section */}
              <MemoizedCollectionSection />

              {/* Audit Section */}
              <MemoizedAuditSection />

              {/* Enhanced Data Quality Section */}
              <MemoizedEnhancedDataQualitySection />

              {/* Cleaning Section */}
              <MemoizedCleaningSection />

              {/* Transformation Section */}
              <MemoizedTransformationSection />

              {/* Visual Exploration Section */}
              <MemoizedVisualExplorationSection />

              {/* Validation Section */}
              <MemoizedValidationSection />

              {/* Automation Section */}
              <MemoizedAutomationSection />

              {/* Summary Section */}
              <MemoizedSummarySection />
            </div>
          </div>

          {/* Aide au clavier : masquée sur téléphone et tablette (pas de clavier, et elle cachait le bouton d'action),
              placée au-dessus du bouton flottant de la mise en page sur ordinateur */}
          <div className="fixed bottom-16 right-4 z-50 hidden lg:block">
            <div className="bg-slate-800 text-white p-3 rounded-lg shadow-lg text-xs max-w-xs">
              <div className="font-semibold mb-2">Navigation Clavier</div>
              <div className="space-y-1">
                <div><kbd className="bg-slate-600 px-1 rounded">Alt + ↑/↓</kbd> Sections</div>
                <div><kbd className="bg-slate-600 px-1 rounded">Alt + Home/End</kbd> Début/Fin</div>
              </div>
            </div>
          </div>
        </div>
      </ContentLayout>
    </>
  );
};

export default DataPreparationRefactored;