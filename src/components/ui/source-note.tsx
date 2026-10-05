import React from 'react';

export interface SourceLink {
  label: string;
  /** Adresse de la page consultée ; sans adresse, la source est citée sans lien */
  href?: string;
}

interface SourceNoteProps {
  sources: SourceLink[];
  /** Date de consultation ou de relevé, déjà formatée (« 1er octobre 2026 ») */
  consulted?: string;
  className?: string;
}

/**
 * Ligne « Source : ... » affichée sous un chiffre du site : chaque chiffre qui décrit le monde réel (enquête, prix,
 * statistique de marché) doit citer son origine. Les détails de vérification sont dans docs/SOURCES.md.
 */
export const SourceNote: React.FC<SourceNoteProps> = ({ sources, consulted, className = '' }) => (
  <p className={`mt-2 text-xs text-muted-foreground ${className}`}>
    Source{sources.length > 1 ? 's' : ''} :{' '}
    {sources.map((source, index) => (
      <React.Fragment key={source.label}>
        {index > 0 && ' ; '}
        {source.href ? (
          <a href={source.href} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
            {source.label}
          </a>
        ) : (
          source.label
        )}
      </React.Fragment>
    ))}
    {consulted ? `, consulté le ${consulted}` : ''}.
  </p>
);

export default SourceNote;
