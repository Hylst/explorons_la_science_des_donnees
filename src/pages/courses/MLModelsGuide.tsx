import ContentLayout from "@/components/layout/ContentLayout";
import UnifiedHeroSection from "@/components/ui/unified-hero-section";
import MLModelsSection from "@/components/resources/MLModelsSection";
import { Button } from "@/components/ui/button";
import { ChevronLeft, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { CONTACT_EMAIL } from "@/config/contact";

/**
 * MLModelsGuide - Independent course page for Machine Learning Models
 * Provides comprehensive guide to ML algorithms with practical examples
 */
const MLModelsGuide = () => {
  return (
    <ContentLayout 
      title="Guide Complet des Modèles ML & IA" 
      backLink={{ href: "/courses", label: "Retour aux cours" }}
      sidebar={{ items: [{ title: "Présentation", href: "#presentation" }] }}
    >
      <section id="presentation" className="py-8">
        <UnifiedHeroSection
          variant="course"
          title="Guide Complet des Modèles de Machine Learning"
          description="Les algorithmes de machine learning les plus utilisés : supervisé, non supervisé, deep learning et sélection de modèles. Un guide pratique avec des exemples et des cas d'usage."
        />
        
        {/* Main ML Models Content */}
        <div className="mt-8">
          <MLModelsSection />
        </div>
        
        {/* Navigation Footer */}
        <div className="mt-12 flex flex-wrap justify-between items-center gap-4 pt-8 border-t">
          <Button variant="outline" asChild>
            <Link to="/courses" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Retour aux cours
            </Link>
          </Button>
          
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" asChild>
              <Link to="/courses/machine-learning/supervised-learning" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Machine Learning Supervisé
              </Link>
            </Button>
            <Button asChild>
              <Link to="/courses/nlp/natural-language-processing">
                Traitement du Langage Naturel
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Course Information */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold mb-3 text-blue-800">À propos de ce cours</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-700">Niveau :</span>
              <span className="ml-2 text-blue-600">Intermédiaire</span>
            </div>
            <div>
              <span className="font-medium text-blue-700">Durée conseillée :</span>
              <span className="ml-2 text-blue-600">6 semaines</span>
            </div>
            <div>
              <span className="font-medium text-blue-700">Prérequis :</span>
              <span className="ml-2 text-blue-600">Python, Statistiques de base</span>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground mt-12 text-right">
          <p>Auteur: Geoffroy Streit - {CONTACT_EMAIL}</p>
        </div>
      </section>
    </ContentLayout>
  );
};

export default MLModelsGuide;