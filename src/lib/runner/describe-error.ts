/**
 * Texte lisible pour une erreur de n'importe quel type. Les moteurs (Pyodide, sql.js) peuvent rejeter avec un objet qui
 * n'est pas une `Error` : `String(objet)` donnait « [object Object] », constaté le 11 octobre 2026 sur le site en ligne
 * quand `python_stdlib.zip` n'était pas servi.
 */
export const describeError = (error: unknown): string => {
  if (error instanceof Error) return error.message || error.name;
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const { message, name } = error as { message?: unknown; name?: unknown };
    if (typeof message === "string" && message) return message;
    try {
      const json = JSON.stringify(error);
      if (json && json !== "{}") return json.length > 300 ? `${json.slice(0, 300)}…` : json;
    } catch {
      // Objet circulaire : on se rabat sur son nom
    }
    if (typeof name === "string" && name) return name;
    const constructorName = (error as { constructor?: { name?: unknown } }).constructor?.name;
    if (typeof constructorName === "string" && constructorName !== "Object") return constructorName;
    return "erreur sans description";
  }
  return String(error);
};
