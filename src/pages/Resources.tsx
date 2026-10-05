
import ContentLayout from "@/components/layout/ContentLayout";
import { Button } from "@/components/ui/button";
import { Book, GraduationCap, Globe, Video, ChevronLeft, School } from "lucide-react";
import { Link } from "react-router-dom";
import BooksSection from "@/components/resources/BooksSection";
import CoursesSection from "@/components/resources/CoursesSection";
import WebsitesSection from "@/components/resources/WebsitesSection";
import VideosSection from "@/components/resources/VideosSection";
import InitiationCoursesSection from "@/components/resources/InitiationCoursesSection";

import UnifiedHeroSection from "@/components/ui/unified-hero-section";
import { useSectionTracker } from "@/hooks/use-section-tracker";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { CONTACT_EMAIL } from "@/config/contact";


type SectionType = "initiation-courses" | "books" | "courses" | "websites" | "videos";

const ResourcesPage = () => {
  const sections: SectionType[] = ["initiation-courses", "books", "courses", "websites", "videos"];
  const { currentSection, setCurrentSection } = useSectionTracker<SectionType>(sections);
  
  // Utilise le hook de smooth scrolling
  useSmoothScroll();

  // Sidebar navigation items
  const sidebarItems = [
    { 
      title: "Cours d'initiation", 
      href: "#initiation-courses", 
      isActive: currentSection === "initiation-courses",
      icon: <School className="h-4 w-4" /> 
    },
    { 
      title: "Livres recommandés", 
      href: "#books", 
      isActive: currentSection === "books",
      icon: <Book className="h-4 w-4" /> 
    },
    { 
      title: "Cours en ligne", 
      href: "#courses", 
      isActive: currentSection === "courses",
      icon: <GraduationCap className="h-4 w-4" /> 
    },
    { 
      title: "Sites Web", 
      href: "#websites", 
      isActive: currentSection === "websites",
      icon: <Globe className="h-4 w-4" /> 
    },
    { 
      title: "Vidéos et chaînes", 
      href: "#videos", 
      isActive: currentSection === "videos",
      icon: <Video className="h-4 w-4" /> 
    },
  ];

  // Handle sidebar item click to scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Ajustement de l'offset pour tenir compte du menu supérieur
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth"
      });
      setCurrentSection(sectionId as SectionType);
    }
  };

  return (
    <ContentLayout 
      title="Ressources" 
      backLink={{ href: "/projects", label: "Retour aux projets" }}
      sidebar={{ 
        items: sidebarItems.map(item => ({
          ...item,
          onClick: () => scrollToSection(item.href.substring(1))
        })) 
      }}
    >
      <section className="py-8">
        <UnifiedHeroSection
          variant="page"
          title="Ressources d'apprentissage"
          description="Des ressources pour apprendre la data science à votre rythme : livres, cours en ligne, sites web et vidéos, choisis par l'auteur du site, en privilégiant celles qui sont gratuites."
        />
        
        <div className="space-y-12">
          <div id="initiation-courses"><InitiationCoursesSection /></div>
          <div id="books"><BooksSection /></div>
          <div id="courses"><CoursesSection /></div>
          <div id="websites"><WebsitesSection /></div>
          <div id="videos"><VideosSection /></div>
        </div>
        
        <div className="mt-12 flex justify-between items-center pt-8 border-t">
          <Button asChild variant="outline">
            <Link to="/projects" className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Retour aux projets
            </Link>
          </Button>
          <Button size="lg" asChild className="whitespace-normal h-auto min-h-11 py-2 text-center">
            <Link to="/community">Découvrir la communauté</Link>
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground mt-12 text-right">
          <p>Auteur: Geoffroy Streit - {CONTACT_EMAIL}</p>
        </div>
      </section>
    </ContentLayout>
  );
};

export default ResourcesPage;
