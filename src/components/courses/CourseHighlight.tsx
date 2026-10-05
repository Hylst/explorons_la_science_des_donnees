
import React, { ReactNode } from 'react';
import { cn } from "@/lib/utils";
import { Card } from '@/components/ui/card';
import { Lightbulb, BookOpen, Info, HelpCircle, AlertTriangle, CheckCircle } from 'lucide-react';

type HighlightType = 'info' | 'concept' | 'example' | 'question' | 'warning' | 'tip' | 'success';

interface CourseHighlightProps {
  title: string;
  children: ReactNode;
  type?: HighlightType;
  className?: string;
}

const CourseHighlight: React.FC<CourseHighlightProps> = ({
  title,
  children,
  type = 'info',
  className
}) => {
  const getHighlightColor = () => {
    switch (type) {
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: <Info className="h-5 w-5 text-blue-500" />,
          title: 'text-blue-700'
        };
      case 'concept':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          icon: <Lightbulb className="h-5 w-5 text-purple-500" />,
          title: 'text-purple-700'
        };
      case 'example':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: <BookOpen className="h-5 w-5 text-green-500" />,
          title: 'text-green-700'
        };
      case 'question':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          icon: <HelpCircle className="h-5 w-5 text-amber-500" />,
          title: 'text-amber-700'
        };
      case 'warning':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
          title: 'text-red-700'
        };
      case 'tip':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: <Lightbulb className="h-5 w-5 text-yellow-500" />,
          title: 'text-yellow-700'
        };
      case 'success':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
          title: 'text-emerald-700'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: <Info className="h-5 w-5 text-gray-500" />,
          title: 'text-gray-700'
        };
    }
  };

  const highlight = getHighlightColor();

  return (
    <Card className={cn(
      highlight.bg, 
      highlight.border,
      "border-l-4 p-4 rounded-md my-4",
      className
    )}>
      <div className="flex items-center gap-2 mb-2">
        {highlight.icon}
        <h4 className={cn("font-medium", highlight.title)}>{title}</h4>
      </div>
      <div className="pl-7 text-gray-700">
        {children}
      </div>
    </Card>
  );
};

export default CourseHighlight;
