// Noyau d'exécution partagé : chargé par la page du bac à sable (code utilisant le DOM) et par le Web Worker (tout le reste).
// Expose self.__runUserCode(code) -> Promise<{ output, error }>. Ce fichier n'a accès à rien d'autre que ce contexte isolé.
(() => {
  const scope = self;
  const lines = [];
  const format = (value) => {
    if (typeof value === 'string') return value;
    if (value instanceof Error) return value.stack || String(value);
    try {
      return typeof value === 'function' || value === undefined ? String(value) : JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  };
  for (const level of ['log', 'info', 'debug', 'warn', 'error']) {
    console[level] = (...args) =>
      lines.push((level === 'warn' ? 'Avertissement : ' : level === 'error' ? 'Erreur : ' : '') + args.map(format).join(' '));
  }
  let pending = 0;
  const nativeSetTimeout = scope.setTimeout.bind(scope);
  scope.setTimeout = (fn, delay, ...args) => {
    pending++;
    return nativeSetTimeout(() => {
      pending--;
      if (typeof fn === 'function') fn(...args);
    }, delay);
  };
  let failure;
  scope.addEventListener('error', (e) => {
    failure = failure ?? e.message;
  });
  scope.addEventListener('unhandledrejection', (e) => {
    failure = failure ?? format(e.reason);
  });

  scope.__runUserCode = async (code) => {
    try {
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
      await new AsyncFunction(code)();
      // Laisse se terminer les minuteries lancées par le code (setTimeout), 8 s au plus
      const limit = Date.now() + 8000;
      while (pending > 0 && Date.now() < limit) await new Promise((resolve) => nativeSetTimeout(resolve, 20));
      await new Promise((resolve) => nativeSetTimeout(resolve, 30));
    } catch (error) {
      failure = error instanceof Error ? error.name + ': ' + error.message : format(error);
    }
    return { output: lines.join('\n'), error: failure };
  };
})();
