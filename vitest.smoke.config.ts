import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vitest/config";

// Test de fumée des routes (src/routes.smoke.test.tsx) : lent, donc à part de `npm test` (voir vitest.config.ts, qui l'exclut).
// Mêmes alias et constantes que vitest.config.ts.
const packageVersion = (name: string): string =>
  JSON.parse(fs.readFileSync(path.resolve(__dirname, "node_modules", name, "package.json"), "utf8")).version;

export default defineConfig({
  define: {
    __PYODIDE_VERSION__: JSON.stringify(packageVersion("pyodide")),
    __SQLJS_VERSION__: JSON.stringify(packageVersion("sql.js")),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.smoke.test.{ts,tsx}"],
    testTimeout: 30000,
    hookTimeout: 30000,
    restoreMocks: true,
  },
});
