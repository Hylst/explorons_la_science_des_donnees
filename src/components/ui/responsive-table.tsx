import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
  showScrollIndicators?: boolean;
  stickyHeader?: boolean;
}

/**
 * ResponsiveTable component handles table overflow on mobile devices
 * Provides horizontal scrolling with visual indicators
 */
export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  children,
  className,
  showScrollIndicators = true,
  stickyHeader = false
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const checkScrollability = React.useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  React.useEffect(() => {
    checkScrollability();
    const resizeObserver = new ResizeObserver(checkScrollability);
    if (scrollRef.current) {
      resizeObserver.observe(scrollRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [checkScrollability]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      {/* Scroll indicators */}
      {showScrollIndicators && (
        <>
          {canScrollLeft && (
            <Button
              variant="outline"
              size="sm"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-md"
              onClick={scrollLeft}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          {canScrollRight && (
            <Button
              variant="outline"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-md"
              onClick={scrollRight}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className={cn(
          'overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100',
          'scroll-smooth',
          className
        )}
        onScroll={checkScrollability}
      >
        <div className={cn(
          'min-w-full',
          stickyHeader && '[&_thead]:sticky [&_thead]:top-0 [&_thead]:bg-background [&_thead]:z-10'
        )}>
          {children}
        </div>
      </div>

      {/* Mobile scroll hint */}
      <div className="md:hidden text-xs text-muted-foreground text-center mt-2">
        💡 Faites glisser horizontalement pour voir plus de colonnes
      </div>
    </div>
  );
};

interface ResponsiveCodeBlockProps {
  children: React.ReactNode;
  className?: string;
  language?: string;
  showCopyButton?: boolean;
}

/**
 * ResponsiveCodeBlock component handles code overflow on mobile devices
 */
export const ResponsiveCodeBlock: React.FC<ResponsiveCodeBlockProps> = ({
  children,
  className,
  language,
  showCopyButton = true
}) => {
  const [copied, setCopied] = React.useState(false);
  const codeRef = React.useRef<HTMLPreElement>(null);

  const copyToClipboard = async () => {
    if (codeRef.current) {
      try {
        await navigator.clipboard.writeText(codeRef.current.textContent || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    }
  };

  return (
    <div className="relative group">
      {showCopyButton && (
        <Button
          variant="outline"
          size="sm"
          className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
          onClick={copyToClipboard}
          aria-label="Copy code"
        >
          {copied ? '✓' : '📋'}
        </Button>
      )}
      
      <pre
        ref={codeRef}
        className={cn(
          'overflow-x-auto p-4 rounded-lg bg-slate-100 dark:bg-slate-800',
          'text-sm leading-relaxed',
          'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100',
          'max-w-full',
          className
        )}
      >
        <code className={language ? `language-${language}` : ''}>
          {children}
        </code>
      </pre>
      
      {/* Mobile scroll hint */}
      <div className="md:hidden text-xs text-muted-foreground text-center mt-1">
        💡 Faites glisser horizontalement pour voir le code complet
      </div>
    </div>
  );
};