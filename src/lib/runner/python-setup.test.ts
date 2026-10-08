// @vitest-environment node
import { describe, expect, it } from "vitest";
import { runPythonNode } from "@/lib/lessons/python-node";

describe("réglage du moteur Python", () => {
  it("masque l'avertissement interne de Pyodide, pas les autres", async () => {
    const code = [
      "import warnings",
      "warnings.warn('JsProxy.as_object_map() is deprecated', DeprecationWarning)",
      "warnings.warn('un avertissement utile', UserWarning)",
      "print('fin')",
    ].join("\n");
    const { output, error } = await runPythonNode(code);
    expect(error).toBeUndefined();
    expect(output).not.toContain("as_object_map");
    expect(output).toContain("un avertissement utile");
    expect(output).toContain("fin");
  }, 120_000);
});
