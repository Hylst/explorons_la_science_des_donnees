import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'outlined' | 'subtle';
}

/**
 * Collapsible section component for organizing content into expandable sections
 * Features smooth animations and customizable styling
 */
export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultOpen = false,
  className,
  titleClassName,
  contentClassName,
  icon,
  variant = 'default'
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'outlined':
        return {
          container: 'border border-gray-200 dark:border-gray-700 rounded-lg',
          header: 'px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800',
          content: 'px-4 py-3'
        };
      case 'subtle':
        return {
          container: 'bg-gray-50 dark:bg-gray-800/50 rounded-lg',
          header: 'px-3 py-2',
          content: 'px-3 pb-3'
        };
      default:
        return {
          container: '',
          header: 'py-2',
          content: 'pt-2'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={cn(styles.container, className)}>
      {/* Header with toggle button */}
      <div className={cn(styles.header)}>
        <Button
          variant="ghost"
          onClick={toggleOpen}
          className={cn(
            "w-full justify-start p-0 h-auto font-medium text-left hover:bg-transparent",
            titleClassName
          )}
        >
          <div className="flex items-center gap-2 w-full">
            {/* Toggle icon */}
            <div className="flex-shrink-0 transition-transform duration-200">
              {isOpen ? (
                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </div>
            
            {/* Optional icon */}
            {icon && (
              <div className="flex-shrink-0 text-gray-600 dark:text-gray-400">
                {icon}
              </div>
            )}
            
            {/* Title */}
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 flex-1">
              {title}
            </span>
          </div>
        </Button>
      </div>

      {/* Collapsible content */}
      <div className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className={cn(styles.content, contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * Container component for multiple collapsible sections
 * Provides consistent spacing and optional accordion behavior
 */
interface CollapsibleSectionsProps {
  children: React.ReactNode;
  className?: string;
  accordion?: boolean; // Only one section open at a time
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

export const CollapsibleSections: React.FC<CollapsibleSectionsProps> = ({
  children,
  className,
  spacing = 'md'
}) => {
  const getSpacingClass = () => {
    switch (spacing) {
      case 'none': return 'space-y-0';
      case 'sm': return 'space-y-2';
      case 'md': return 'space-y-4';
      case 'lg': return 'space-y-6';
      default: return 'space-y-4';
    }
  };

  return (
    <div className={cn(getSpacingClass(), className)}>
      {children}
    </div>
  );
};

export default CollapsibleSection;