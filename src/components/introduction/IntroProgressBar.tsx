
import { cn } from "@/lib/utils";

interface IntroProgressProps {
  currentSection: string;
  sections: { id: string; title: string }[];
  onClick: (sectionId: string) => void;
}

const IntroProgressBar = ({ currentSection, sections, onClick }: IntroProgressProps) => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 hidden md:block">
      <div className="bg-white rounded-full shadow-lg border p-2 flex gap-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onClick(section.id)}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              currentSection === section.id 
                ? "bg-gradient-to-r from-ds-blue-500 to-ds-purple-500 scale-125" 
                : "bg-gray-200 hover:bg-gray-300"
            )}
            title={section.title}
          />
        ))}
      </div>
    </div>
  );
};

export default IntroProgressBar;
