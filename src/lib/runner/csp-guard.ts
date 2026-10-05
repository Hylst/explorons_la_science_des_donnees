/// <reference lib="webworker" />

/**
 * Un en-tête Content-Security-Policy posé par le serveur s'applique aussi au script du worker. S'il n'autorise pas
 * `'wasm-unsafe-eval'`, la compilation WebAssembly (Pyodide, SQLite) échoue sans erreur exploitable et l'exécution
 * reste bloquée : on transforme cette violation en une erreur claire, immédiate.
 */
export const wasmBlocked = new Promise<never>((_, reject) => {
  self.addEventListener('securitypolicyviolation', (event) => {
    if (event.blockedURI === 'wasm-eval') {
      reject(
        new Error(
          "WebAssembly est bloqué par la politique de sécurité du serveur (CSP) : ajoutez 'wasm-unsafe-eval' à la directive script-src de ce site."
        )
      );
    }
  });
});
wasmBlocked.catch(() => undefined);
