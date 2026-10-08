import { useCallback, useSyncExternalStore } from 'react';
import { readJSON, storageKeys, writeJSON } from '@/lib/storage';

/**
 * Suivi d'avancement et notes personnelles d'un cours (modules, projets, études de cas).
 * Les données restent dans le navigateur (localStorage), par cours.
 *
 * Un store partagé évite que deux composants d'une même page (liste des modules, cartes de projets)
 * écrasent mutuellement leurs modifications.
 */

export type ItemStatus = 'todo' | 'started' | 'done';

interface CourseProgressData {
  status: Record<string, 'started' | 'done'>;
  notes: Record<string, string>;
}

const EMPTY: CourseProgressData = { status: {}, notes: {} };
const KEY_PREFIX = 'course-progress-';
const keyOf = (courseId: string) => `${KEY_PREFIX}${courseId}`;

const isProgressData = (value: unknown): value is CourseProgressData => {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  const isRecord = (r: unknown): r is Record<string, unknown> => typeof r === 'object' && r !== null && !Array.isArray(r);
  return (
    isRecord(v.status) &&
    Object.values(v.status).every((s) => s === 'started' || s === 'done') &&
    isRecord(v.notes) &&
    Object.values(v.notes).every((n) => typeof n === 'string')
  );
};

const cache = new Map<string, CourseProgressData>();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

const load = (courseId: string): CourseProgressData => {
  let data = cache.get(courseId);
  if (!data) {
    data = readJSON<CourseProgressData>(keyOf(courseId), EMPTY, isProgressData);
    cache.set(courseId, data);
  }
  return data;
};

const update = (courseId: string, change: (data: CourseProgressData) => CourseProgressData) => {
  const next = change(load(courseId));
  cache.set(courseId, next);
  writeJSON(keyOf(courseId), next);
  emit();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

if (typeof window !== 'undefined') {
  // Modification faite depuis un autre onglet
  window.addEventListener('storage', (event) => {
    if (event.key === null || event.key?.startsWith('course-progress-')) {
      cache.clear();
      emit();
    }
  });
}

/** Marque des éléments comme terminés sans hook (reprise d'une progression enregistrée sous un ancien format) */
export const markDone = (courseId: string, itemIds: string[]) =>
  update(courseId, (current) => ({
    ...current,
    status: { ...current.status, ...Object.fromEntries(itemIds.map((id) => [id, "done" as const])) },
  }));

export const useCourseProgress = (courseId: string) => {
  const data = useSyncExternalStore(subscribe, () => load(courseId));

  const statusOf = useCallback((itemId: string): ItemStatus => data.status[itemId] ?? 'todo', [data]);
  const noteOf = useCallback((itemId: string) => data.notes[itemId] ?? '', [data]);

  const setStatus = useCallback(
    (itemId: string, status: ItemStatus) =>
      update(courseId, (current) => {
        const nextStatus = { ...current.status };
        if (status === 'todo') delete nextStatus[itemId];
        else nextStatus[itemId] = status;
        return { ...current, status: nextStatus };
      }),
    [courseId]
  );

  const setNote = useCallback(
    (itemId: string, text: string) =>
      update(courseId, (current) => {
        const nextNotes = { ...current.notes };
        if (text.trim() === '') delete nextNotes[itemId];
        else nextNotes[itemId] = text;
        return { ...current, notes: nextNotes };
      }),
    [courseId]
  );

  /** Nombre d'éléments terminés parmi `itemIds` */
  const countDone = useCallback((itemIds: string[]) => itemIds.filter((id) => data.status[id] === 'done').length, [data]);

  return { statusOf, noteOf, setStatus, setNote, countDone };
};

/** Synthèse de tous les cours enregistrés dans ce navigateur (page d'accueil) */
export interface ProgressSummary {
  done: number;
  started: number;
  notes: number;
  /** Cours pour lesquels au moins un élément est commencé, terminé ou annoté */
  courses: number;
}

// Le snapshot est une chaîne : deux lectures identiques sont égales, ce qui évite les rendus inutiles
const summaryKey = (): string => {
  let done = 0;
  let started = 0;
  let notes = 0;
  let courses = 0;
  for (const key of storageKeys(KEY_PREFIX)) {
    const data = load(key.slice(KEY_PREFIX.length));
    const statuses = Object.values(data.status);
    const d = statuses.filter((s) => s === 'done').length;
    const s = statuses.length - d;
    const n = Object.keys(data.notes).length;
    done += d;
    started += s;
    notes += n;
    if (d + s + n > 0) courses++;
  }
  return `${done}|${started}|${notes}|${courses}`;
};

export const useProgressSummary = (): ProgressSummary => {
  const key = useSyncExternalStore(subscribe, summaryKey);
  const [done, started, notes, courses] = key.split('|').map(Number);
  return { done, started, notes, courses };
};
