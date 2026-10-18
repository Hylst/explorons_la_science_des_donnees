
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';
import { stackLatex } from '@/lib/latex-stack';

interface CourseEquationProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
  /** Version écrite pour les écrans de moins de 1024 px (formule coupée sur plusieurs lignes) */
  narrow?: string;
}

const CourseEquation = ({ latex, displayMode = true, className, narrow }: CourseEquationProps) => {
  // sous 1024 px : la version « narrow » si elle existe, sinon une partie par ligne pour une formule
  // en plusieurs parties (\qquad) ; au-delà, la formule telle qu'écrite
  const stacked = displayMode ? (narrow ?? stackLatex(latex)) : null;
  return (
    <div className={cn(
      "my-4",
      // en ligne : pas de défilement, une boîte à la taille exacte de la formule affichait deux barres de 15 px
      // pour 2 px de débord (mesuré le 17 octobre 2026 dans le calcul différentiel)
      displayMode ? "overflow-x-auto text-center" : "inline-block max-w-full",
      className
    )}>
      {stacked ? (
        <>
          <div className="hidden lg:block"><BlockMath math={latex} /></div>
          <div className="lg:hidden"><BlockMath math={stacked} /></div>
        </>
      ) : displayMode ? (
        <BlockMath math={latex} />
      ) : (
        <InlineMath math={latex} />
      )}
    </div>
  );
};

export default CourseEquation;
