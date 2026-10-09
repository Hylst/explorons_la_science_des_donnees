import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle } from 'lucide-react';

/**
 * ProgressBar Component
 * 
 * This component provides a visual progress indicator for the data preparation sections.
 * It tracks which sections have been viewed and provides navigation functionality.
 */
interface ProgressBarProps {
  currentSection?: string;
}

// Sections suivies par la barre : constante de module, donc référence stable pour l'effet de défilement
const sections = [
  { id: 'introduction', name: 'Introduction', icon: '📚' },
  { id: 'lifecycle', name: 'Cycle de vie', icon: '🔄' },
  { id: 'collection', name: 'Collecte', icon: '📊' },
  { id: 'audit', name: 'Audit qualité', icon: '🔍' },
  { id: 'cleaning', name: 'Nettoyage', icon: '🧹' },
  { id: 'transformation', name: 'Transformation', icon: '⚙️' },
  { id: 'exploration', name: 'Exploration', icon: '📈' },
  { id: 'validation', name: 'Validation', icon: '✅' },
  { id: 'automation', name: 'Automatisation', icon: '🤖' }
];

const ProgressBar: React.FC<ProgressBarProps> = ({ currentSection }) => {
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Track section completion based on scroll position
    const handleScroll = () => {
      const newCompleted = new Set<string>();
      
      sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.5 && rect.bottom > 0;
          
          if (isVisible || rect.top < 0) {
            newCompleted.add(section.id);
          }
        }
      });
      
      setCompletedSections(prev => {
        // Only update if there's a change to prevent unnecessary re-renders
        if (prev.size !== newCompleted.size || 
            [...newCompleted].some(id => !prev.has(id))) {
          return newCompleted;
        }
        return prev;
      });
      setProgress((newCompleted.size / sections.length) * 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Remove completedSections from dependencies

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Card className="sticky top-4 z-10 bg-white/95 backdrop-blur-sm border-2 border-blue-200">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-700">Sections parcourues</h3>
            <Badge variant="outline" className="bg-blue-50">
              {completedSections.size}/{sections.length}
            </Badge>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <div className="grid grid-cols-3 gap-2">
            {sections.map((section) => {
              const isCompleted = completedSections.has(section.id);
              const isCurrent = currentSection === section.id;
              
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`
                    flex items-center gap-2 p-2 rounded-lg text-xs transition-all
                    hover:bg-blue-50 hover:scale-105
                    ${isCurrent ? 'bg-blue-100 border-2 border-blue-300' : ''}
                    ${isCompleted ? 'text-green-700' : 'text-slate-600'}
                  `}
                >
                  <span className="text-sm">{section.icon}</span>
                  {isCompleted ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <Circle className="h-3 w-3 text-slate-400" />
                  )}
                  <span className="truncate">{section.name}</span>
                </button>
              );
            })}
          </div>
          
          <div className="text-center">
            <p className="text-xs text-slate-500">
              {Math.round(progress)} % de la page parcouru • Cliquez pour naviguer
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressBar;