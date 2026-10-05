import { useState, useMemo } from 'react';

/**
 * Custom hook for managing text truncation with expandable functionality
 * Provides word count-based truncation with smooth expand/collapse transitions
 */
export const useTextTruncation = (text: string, wordLimit: number = 100) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate word count and determine if truncation is needed
  const { wordCount, needsTruncation, truncatedText, fullText } = useMemo(() => {
    const words = text.trim().split(/\s+/);
    const wordCount = words.length;
    const needsTruncation = wordCount > wordLimit;
    
    const truncatedText = needsTruncation 
      ? words.slice(0, wordLimit).join(' ') + '...'
      : text;
    
    return {
      wordCount,
      needsTruncation,
      truncatedText,
      fullText: text
    };
  }, [text, wordLimit]);

  // Toggle expansion state
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // Get current display text based on expansion state
  const displayText = isExpanded ? fullText : truncatedText;

  return {
    displayText,
    isExpanded,
    needsTruncation,
    wordCount,
    toggleExpansion
  };
};

/**
 * Hook for managing collapsible sections within text content
 * Useful for organizing long descriptions into manageable sections
 */
export const useCollapsibleSections = (sections: Array<{ title: string; content: string; defaultOpen?: boolean }>) => {
  const [openSections, setOpenSections] = useState<Set<number>>(() => {
    const initialOpen = new Set<number>();
    sections.forEach((section, index) => {
      if (section.defaultOpen) {
        initialOpen.add(index);
      }
    });
    return initialOpen;
  });

  const toggleSection = (index: number) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(index)) {
      newOpenSections.delete(index);
    } else {
      newOpenSections.add(index);
    }
    setOpenSections(newOpenSections);
  };

  const isSectionOpen = (index: number) => openSections.has(index);

  return {
    openSections,
    toggleSection,
    isSectionOpen
  };
};