/** Durées des modules écrites « 1 h 30 », « 3 h » ou « 45 min » : convertit en minutes et additionne */
export const durationMinutes = (text: string): number => {
  const match = text.trim().match(/^(?:(\d+)\s*h)?\s*(?:(\d+)\s*(?:min)?)?$/);
  if (!match || (!match[1] && !match[2])) throw new Error(`Durée illisible : « ${text} »`);
  return Number(match[1] ?? 0) * 60 + Number(match[2] ?? 0);
};

/** Total lisible : « 14 h 30 », « 3 h », « 45 min » */
export const formatMinutes = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")}`;
};

export const totalDuration = (durations: string[]): string => formatMinutes(durations.reduce((sum, d) => sum + durationMinutes(d), 0));
