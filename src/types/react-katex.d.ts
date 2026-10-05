// react-katex ne fournit pas de types et @types/react-katex n'est pas installé :
// déclaration minimale des composants de la bibliothèque.
declare module 'react-katex' {
  import type { ComponentType, ReactNode } from 'react';

  interface KatexProps {
    /** Expression LaTeX à afficher (ou fournie comme enfant) */
    math?: string;
    children?: string;
    errorColor?: string;
    renderError?: (error: Error) => ReactNode;
    settings?: Record<string, unknown>;
  }

  export const InlineMath: ComponentType<KatexProps>;
  export const BlockMath: ComponentType<KatexProps>;
}
