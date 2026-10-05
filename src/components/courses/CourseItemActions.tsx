import { useState, type ReactNode } from 'react';
import { CheckCircle, FileText, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCourseProgress } from '@/hooks/use-course-progress';
import { cn } from '@/lib/utils';

interface CourseItemActionsProps {
  courseId: string;
  /** Identifiant stable de l'élément (module, projet ou étude de cas) dans ce cours */
  itemId: string;
  /** Titre affiché dans la boîte de notes */
  itemTitle: string;
  /** Libellé du bouton tant que l'élément n'est pas commencé */
  startLabel: string;
  /** Icône du bouton de démarrage */
  startIcon?: ReactNode;
  /** Classes du bouton de démarrage (couleur du cours) */
  startClassName?: string;
  className?: string;
}

/**
 * Actions d'un élément de cours : commencer, marquer comme terminé, rouvrir, et prendre des notes.
 * L'état est enregistré dans le navigateur, par cours.
 */
const CourseItemActions = ({ courseId, itemId, itemTitle, startLabel, startIcon, startClassName, className }: CourseItemActionsProps) => {
  const { statusOf, noteOf, setStatus, setNote } = useCourseProgress(courseId);
  const [notesOpen, setNotesOpen] = useState(false);
  const status = statusOf(itemId);
  const note = noteOf(itemId);

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex gap-2">
        {status === 'todo' && (
          <Button
            type="button"
            onClick={() => setStatus(itemId, 'started')}
            className={cn('flex-1 gap-2', startClassName)}
          >
            {startIcon}
            {startLabel}
          </Button>
        )}
        {status === 'started' && (
          <Button type="button" onClick={() => setStatus(itemId, 'done')} className="flex-1 gap-2 bg-blue-600 text-white hover:bg-blue-700">
            <CheckCircle className="h-4 w-4" aria-hidden="true" />
            Marquer comme terminé
          </Button>
        )}
        {status === 'done' && (
          <Button type="button" variant="secondary" onClick={() => setStatus(itemId, 'started')} className="flex-1 gap-2">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Terminé · Rouvrir
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={() => setNotesOpen(true)}
          aria-label={`Notes : ${itemTitle}`}
          className="gap-2"
        >
          <FileText className="h-4 w-4" aria-hidden="true" />
          Notes
          {note && <span className="h-2 w-2 rounded-full bg-orange-500" aria-label="Contient une note" />}
        </Button>
      </div>
      {status === 'started' && <p className="text-xs text-blue-700">En cours</p>}
      {status === 'done' && (
        <p className="flex items-center gap-1 text-xs text-green-700">
          <CheckCircle className="h-3 w-3" aria-hidden="true" />
          Terminé
        </p>
      )}

      <Dialog open={notesOpen} onOpenChange={setNotesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notes : {itemTitle}</DialogTitle>
            <DialogDescription>Vos notes sont enregistrées automatiquement dans ce navigateur, sur cet appareil uniquement.</DialogDescription>
          </DialogHeader>
          <Textarea
            value={note}
            onChange={(e) => setNote(itemId, e.target.value)}
            placeholder="Points clés, questions, liens utiles…"
            className="min-h-48"
            aria-label={`Notes sur ${itemTitle}`}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{note.length} caractères</span>
            {note && (
              <button type="button" className="underline" onClick={() => setNote(itemId, '')}>
                Effacer les notes
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseItemActions;
