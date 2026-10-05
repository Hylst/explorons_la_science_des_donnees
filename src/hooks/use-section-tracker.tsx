
import { useState, useEffect } from 'react';

type SectionType = string;

export function useSectionTracker<T extends SectionType>(sections: T[]): {
  currentSection: T;
  setCurrentSection: (section: T) => void;
} {
  const [currentSection, setCurrentSection] = useState<T>(sections[0]);
  
  useEffect(() => {
    const handleScroll = () => {
      // Ajustement de l'offset pour tenir compte du menu supérieur
      const offset = 220; // Augmenté pour prendre en compte la hauteur de la navbar
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= offset && rect.bottom >= offset / 2) {
            setCurrentSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Déclencher une fois au chargement pour définir la section initiale
    setTimeout(handleScroll, 300);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  return { currentSection, setCurrentSection };
}
