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

describe("asyncio.run dans le moteur du site", () => {
  it("devient un await au niveau du module (worker du site et tests), le reste du code est inchangé", async () => {
    const { adaptAsyncio } = await import("./python-setup");
    expect(adaptAsyncio("import asyncio\nif __name__ == '__main__':\n    asyncio.run(main())")).toBe("import asyncio\nif __name__ == '__main__':\n    await (main())");
    expect(adaptAsyncio("my_asyncio.run(x)\nasyncio.running = 1")).toBe("my_asyncio.run(x)\nasyncio.running = 1");
  });
});
