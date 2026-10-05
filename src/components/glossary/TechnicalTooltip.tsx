import React from 'react';
import { HelpCircle, Info, Lightbulb, BookOpen } from 'lucide-react';
import Tooltip from './Tooltip';
import ConceptDiagram from './ConceptDiagram';

interface TechnicalTooltipData {
  explanation: string;
  examples?: string[];
  diagram?: 'data-science-process' | 'machine-learning-types' | 'big-data-5v' | 'neural-network' | 'classification-vs-regression' | 'supervised-vs-unsupervised' | 'clustering-example' | 'overfitting-underfitting' | 'cross-validation' | 'gradient-descent';
  keyPoints?: string[];
  relatedTerms?: string[];
}

interface TechnicalTooltipProps {
  data: TechnicalTooltipData;
  term?: string;
  children?: React.ReactNode;
}

/**
 * Advanced technical tooltip with rich content for complex data science concepts
 * Provides detailed explanations, examples, diagrams, and related terms
 */
const TechnicalTooltip: React.FC<TechnicalTooltipProps> = ({
  data,
  term,
  children
}) => {
  const { explanation, examples, diagram, keyPoints, relatedTerms } = data;
  const tooltipContent = (
    <div className="max-w-md space-y-3">
      {/* Term title */}
      <div className="flex items-center gap-2 border-b border-gray-600 pb-2">
        <Info className="w-4 h-4 text-blue-400" />
        <h4 className="font-semibold text-white">{term}</h4>
      </div>
      
      {/* Main explanation */}
      <p className="text-sm text-gray-200 leading-relaxed">{explanation}</p>
      
      {/* Diagram if provided */}
      {diagram && (
        <div className="bg-white rounded-lg p-2">
          <ConceptDiagram type={diagram} className="max-h-32" />
        </div>
      )}
      
      {/* Key points */}
      {keyPoints && keyPoints.length > 0 && (
        <div>
          <div className="flex items-center gap-1 mb-2">
            <Lightbulb className="w-3 h-3 text-yellow-400" />
            <span className="text-xs font-medium text-yellow-400">Points clés :</span>
          </div>
          <ul className="text-xs text-gray-300 space-y-1">
            {keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-blue-400 mt-1">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Examples */}
      {examples && examples.length > 0 && (
        <div>
          <div className="flex items-center gap-1 mb-2">
            <BookOpen className="w-3 h-3 text-green-400" />
            <span className="text-xs font-medium text-green-400">Exemples :</span>
          </div>
          <ul className="text-xs text-gray-300 space-y-1">
            {examples.map((example, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-green-400 mt-1">→</span>
                <span className="italic">{example}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Related terms */}
      {relatedTerms && relatedTerms.length > 0 && (
        <div>
          <span className="text-xs font-medium text-purple-400">Termes liés : </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {relatedTerms.map((relatedTerm, index) => (
              <span key={index} className="text-xs bg-purple-900 text-purple-200 px-2 py-1 rounded">
                {relatedTerm}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Tooltip content={tooltipContent} position="top">
      <span className="inline-flex items-center gap-1 cursor-help">
        {children}
        <HelpCircle className="w-3 h-3 text-blue-500 opacity-70 hover:opacity-100 transition-opacity" />
      </span>
    </Tooltip>
  );
};

export default TechnicalTooltip;