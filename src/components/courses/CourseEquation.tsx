
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';

interface CourseEquationProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

const CourseEquation = ({ latex, displayMode = true, className }: CourseEquationProps) => {
  return (
    <div className={cn(
      "my-4 overflow-x-auto",
      displayMode ? "text-center" : "inline-block",
      className
    )}>
      {displayMode ? (
        <BlockMath math={latex} />
      ) : (
        <InlineMath math={latex} />
      )}
    </div>
  );
};

export default CourseEquation;
