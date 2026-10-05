import fs from "node:fs";
import path from "node:path";
import { configDefaults, defineConfig } from "vitest/config";

// Mêmes alias et constantes que vite.config.ts : le code testé est celui du site, sans simulation du build.
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
    include: ["src/**/*.test.{ts,tsx}"],
    // Le test de fumée des routes est lent : `npm run test:smoke` (vitest.smoke.config.ts)
    exclude: [...configDefaults.exclude, "**/*.smoke.test.*"],
    restoreMocks: true,
  },
});
