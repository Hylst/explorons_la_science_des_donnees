import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTextTruncation } from '@/hooks/use-text-truncation';
import { cn } from '@/lib/utils';

interface TruncatedTextProps {
  text: string;
  wordLimit?: number;
  className?: string;
  showWordCount?: boolean;
  expandButtonText?: string;
  collapseButtonText?: string;
  enableMarkdown?: boolean;
}

/**
 * Component for displaying text with truncation and expand/collapse functionality
 * Features smooth transitions and customizable word limits
 */
export const TruncatedText: React.FC<TruncatedTextProps> = ({
  text,
  wordLimit = 100,
  className,
  showWordCount = false,
  expandButtonText = "Voir plus",
  collapseButtonText = "Voir moins",
  enableMarkdown = true
}) => {
  const {
    displayText,
    isExpanded,
    needsTruncation,
    wordCount,
    toggleExpansion
  } = useTextTruncation(text, wordLimit);

  // Format text for proper markdown rendering with enhanced structure detection
  const formatText = (text: string): string => {
    return text
      // Add paragraph breaks after sentences ending with periods
      .replace(/\. ([A-Z])/g, '.\n\n$1')
      // Add paragraph breaks before section headers (bold text followed by colon)
      .replace(/(\*\*[^*]+\*\*\s*:)/g, '\n\n$1')
      // Add paragraph breaks before numbered lists
      .replace(/(\d+\)\s*\*\*)/g, '\n\n$1')
      // Add paragraph breaks before bullet points with bold text
      .replace(/([.!?])\s*(\*\*[^*]+\*\*)/g, '$1\n\n$2')
      // Add line breaks after colons when followed by explanatory text
      .replace(/:\s*([A-Z][^.]*\.)/g, ':\n$1')
      // Add paragraph breaks before "Exemples", "Applications", "Avantages", etc.
      .replace(/(Exemples?|Applications?|Avantages?|Inconvénients?|Défis?|Solutions?|Types?|Méthodes?|Processus|Algorithmes?)\s*:/g, '\n\n**$1** :')
      // Ensure proper spacing around parenthetical explanations
      .replace(/\(([^)]+)\)\s*([A-Z])/g, '($1)\n\n$2')
      // Add breaks before "Analogie" sections
      .replace(/(\*\*Analogie[^*]*\*\*)/g, '\n\n$1')
      // Preserve existing bold formatting
      .replace(/\*\*([^*]+)\*\*/g, '**$1**')
      // Clean up multiple consecutive line breaks
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  const renderContent = () => {
    const formattedText = formatText(displayText);
    
    if (enableMarkdown) {
      return (
        <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 max-w-none">
          <ReactMarkdown 
            components={{
              // Un titre markdown écrit dans une description (ou un commentaire de code mal reconnu) ne doit jamais devenir un h1 de page
              h1: ({ children }) => <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">{children}</h4>,
              h2: ({ children }) => <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">{children}</h4>,
              h3: ({ children }) => <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">{children}</h4>,
              p: ({ children }) => (
                <p className="mb-3 leading-relaxed text-gray-700 dark:text-gray-300">
                  {children}
                </p>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-gray-900 dark:text-gray-100">
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="italic text-gray-800 dark:text-gray-200">
                  {children}
                </em>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-3 space-y-1 text-gray-700 dark:text-gray-300">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-700 dark:text-gray-300">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="mb-1 text-gray-700 dark:text-gray-300">
                  {children}
                </li>
              ),
            }}
          >
            {formatText(displayText)}
          </ReactMarkdown>
        </div>
      );
    }
    
    return (
      <div className="whitespace-pre-wrap">
        {formattedText}
      </div>
    );
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Main content with smooth transition */}
      <div className={cn(
        "transition-all duration-300 ease-in-out overflow-hidden",
        isExpanded ? "max-h-none" : "max-h-96"
      )}>
        <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {renderContent()}
        </div>
      </div>

      {/* Expand/Collapse controls */}
      {needsTruncation && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpansion}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-0 h-auto font-medium"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  {collapseButtonText}
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  {expandButtonText}
                </>
              )}
            </Button>
            
            {showWordCount && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {wordCount} mots
              </span>
            )}
          </div>
          
          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
                style={{ width: isExpanded ? '100%' : `${Math.min((wordLimit / wordCount) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TruncatedText;