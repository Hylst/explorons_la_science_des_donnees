
import React from 'react';
import ReactMarkdown from "react-markdown";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Info, BookOpen, ExternalLink } from "lucide-react";

export interface GlossaryTermDefinition {
  term: string;
  shortDefinition: string;
  longDefinition?: string;
  examples?: string[];
  relatedTerms?: string[];
  source?: string;
  sourceUrl?: string;
  domain?: "statistics" | "programming" | "dataviz" | "dataprocessing" | "machinelearning" | "general";
  level?: "beginner" | "intermediate" | "advanced";
  synonyms?: string[];
  englishTerm?: string;
}

/** Une source ne s'affiche que si elle est vérifiable : un lien, ou une référence datée (auteurs et année). Un titre vague n'est pas une source. */
const isCitable = (definition: GlossaryTermDefinition) =>
  Boolean(definition.source && (definition.sourceUrl || /\(\d{4}\)/.test(definition.source)));

interface GlossaryTermProps {
  definition: GlossaryTermDefinition;
  variant?: "hover" | "click" | "tooltip" | "all";
  className?: string;
  children?: React.ReactNode;
  highlightStyle?: "dotted" | "dashed" | "solid" | "underline" | "glow";
}

export const GlossaryTerm: React.FC<GlossaryTermProps> = ({ 
  definition, 
  variant = "all", 
  className,
  children,
  highlightStyle = "dotted"
}) => {
  // Vérifier si definition est undefined et afficher un message d'erreur sans bloquer le rendu
  if (!definition) {
    console.error("GlossaryTerm: definition prop is undefined");
    return <span className="text-red-500">{children || "Terme manquant"}</span>;
  }
  
  const termContent = children || definition.term;
  
  // Style de mise en évidence basé sur highlightStyle
  const getHighlightStyles = () => {
    const baseStyle = "cursor-help transition-colors duration-200";
    
    switch (highlightStyle) {
      case "dotted":
        return cn("border-b border-dotted border-ds-blue-400 text-ds-blue-600", baseStyle);
      case "dashed":
        return cn("border-b border-dashed border-ds-purple-400 text-ds-purple-600", baseStyle);
      case "solid":
        return cn("border-b border-ds-blue-400 text-ds-blue-600", baseStyle);
      case "underline":
        return cn("underline decoration-ds-blue-400 underline-offset-2 text-ds-blue-600", baseStyle);
      case "glow":
        return cn("text-ds-blue-600 hover:text-ds-blue-500 hover:shadow-sm hover:shadow-blue-200/50", baseStyle);
      default:
        return cn("border-b border-dotted border-ds-blue-400 text-ds-blue-600", baseStyle);
    }
  };
  
  // Badge de domaine
  const DomainBadge = () => {
    if (!definition.domain) return null;
    
    const domainColors: Record<string, { bg: string, text: string }> = {
      statistics: { bg: "bg-blue-100", text: "text-blue-700" },
      programming: { bg: "bg-purple-100", text: "text-purple-700" },
      dataviz: { bg: "bg-green-100", text: "text-green-700" },
      dataprocessing: { bg: "bg-amber-100", text: "text-amber-700" },
      machinelearning: { bg: "bg-rose-100", text: "text-rose-700" },
      general: { bg: "bg-gray-100", text: "text-gray-700" }
    };
    
    const { bg, text } = domainColors[definition.domain] || domainColors.general;
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
        {definition.domain}
      </span>
    );
  };
  
  // Badge de niveau
  const LevelBadge = () => {
    if (!definition.level) return null;
    
    const levelColors: Record<string, { bg: string, text: string }> = {
      beginner: { bg: "bg-green-100", text: "text-green-700" },
      intermediate: { bg: "bg-amber-100", text: "text-amber-700" },
      advanced: { bg: "bg-red-100", text: "text-red-700" }
    };
    
    const { bg, text } = levelColors[definition.level];
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
        {definition.level}
      </span>
    );
  };
  
  // Just hover card
  if (variant === "hover") {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <span className={cn(
            getHighlightStyles(),
            className
          )}>
            {termContent}
          </span>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-semibold">{definition.term}</h4>
              <div className="flex gap-1">
                <DomainBadge />
                <LevelBadge />
              </div>
            </div>
            
            {definition.englishTerm && (
              <p className="text-xs text-gray-500">
                Terme anglais: <span className="italic">{definition.englishTerm}</span>
              </p>
            )}
            
            <div className="text-sm text-gray-600 max-w-none">
              <ReactMarkdown>{definition.shortDefinition}</ReactMarkdown>
            </div>
            
            {definition.synonyms && definition.synonyms.length > 0 && (
              <div className="text-xs text-gray-500">
                Synonymes: {definition.synonyms.join(", ")}
              </div>
            )}
            
            {definition.examples && definition.examples.length > 0 && (
              <div className="pt-1">
                <span className="text-xs font-medium text-gray-500">Exemple:</span>
                <p className="text-xs italic text-gray-600">{definition.examples[0]}</p>
              </div>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }
  
  // Just tooltip
  if (variant === "tooltip") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn(
              getHighlightStyles(),
              className
            )}>
              {termContent}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm max-w-none">
              <ReactMarkdown>{definition.shortDefinition}</ReactMarkdown>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  // Just dialog on click
  if (variant === "click") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <span className={cn(
            getHighlightStyles(),
            className,
            "cursor-pointer"
          )}>
            {termContent}
          </span>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-ds-blue-500" />
              {definition.term}
            </DialogTitle>
            <DialogDescription>
              {definition.shortDefinition}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap gap-2 mb-2">
              <DomainBadge />
              <LevelBadge />
              
              {definition.englishTerm && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  EN: {definition.englishTerm}
                </span>
              )}
            </div>
            
            {definition.longDefinition && (
              <div className="text-sm text-gray-700 max-w-none">
                <ReactMarkdown>{definition.longDefinition}</ReactMarkdown>
              </div>
            )}
            
            {definition.synonyms && definition.synonyms.length > 0 && (
              <div>
                <span className="text-xs font-medium text-gray-500">Synonymes:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {definition.synonyms.map((synonym) => (
                    <span key={synonym} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-full">
                      {synonym}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {definition.examples && definition.examples.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Exemples:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {definition.examples.map((example, index) => (
                    <li key={index} className="text-sm text-gray-600">{example}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {definition.relatedTerms && definition.relatedTerms.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-medium text-gray-500">Termes associés:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {definition.relatedTerms.map((term) => (
                    <span key={term} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {isCitable(definition) && (
              <div className="text-xs text-gray-500 pt-2 flex items-center gap-1">
                Source: {definition.source}
                {definition.sourceUrl && (
                  <a 
                    href={definition.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-500 hover:text-blue-600"
                  >
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  // Default: both hover and click
  return (
    <Dialog>
      <HoverCard>
        <HoverCardTrigger asChild>
          <DialogTrigger asChild>
            <span className={cn(
              getHighlightStyles(),
              "cursor-pointer group relative",
              className
            )}>
              {termContent}
              <Info className="inline-block ml-0.5 h-3 w-3 text-ds-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
          </DialogTrigger>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-semibold">{definition.term}</h4>
              <div className="flex gap-1">
                <DomainBadge />
                <LevelBadge />
              </div>
            </div>
            
            {definition.englishTerm && (
              <p className="text-xs text-gray-500">
                Terme anglais: <span className="italic">{definition.englishTerm}</span>
              </p>
            )}
            
            <div className="text-sm text-gray-600 max-w-none">
              <ReactMarkdown>{definition.shortDefinition}</ReactMarkdown>
            </div>
            <p className="text-xs text-ds-blue-600">Cliquez pour en savoir plus</p>
          </div>
        </HoverCardContent>
      </HoverCard>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-ds-blue-500" />
            {definition.term}
          </DialogTitle>
          <DialogDescription>
            {definition.shortDefinition}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="flex flex-wrap gap-2 mb-2">
            <DomainBadge />
            <LevelBadge />
            
            {definition.englishTerm && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                EN: {definition.englishTerm}
              </span>
            )}
          </div>
          
          {definition.longDefinition && (
            <div className="text-sm text-gray-700 max-w-none">
              <ReactMarkdown>{definition.longDefinition}</ReactMarkdown>
            </div>
          )}
          
          {definition.synonyms && definition.synonyms.length > 0 && (
            <div>
              <span className="text-xs font-medium text-gray-500">Synonymes:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {definition.synonyms.map((synonym) => (
                  <span key={synonym} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-full">
                    {synonym}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {definition.examples && definition.examples.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Exemples:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {definition.examples.map((example, index) => (
                  <li key={index} className="text-sm text-gray-600">{example}</li>
                ))}
              </ul>
            </div>
          )}
          
          {definition.relatedTerms && definition.relatedTerms.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-medium text-gray-500">Termes associés:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {definition.relatedTerms.map((term) => (
                  <span key={term} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                    {term}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {isCitable(definition) && (
            <div className="text-xs text-gray-500 pt-2 flex items-center gap-1">
              Source: {definition.source}
              {definition.sourceUrl && (
                <a 
                  href={definition.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-500 hover:text-blue-600"
                >
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
