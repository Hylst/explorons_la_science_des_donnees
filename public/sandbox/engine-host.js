// Hôte des moteurs Python et SQL (iframe sandbox, origine opaque). Reçoit du parent le texte du worker, le lance depuis un
// blob précédé d'un prélude, puis relaie les messages dans les deux sens. Le prélude remplace fetch : chaque lecture de
// fichier est demandée au parent, qui ne sert que vendor/ (src/lib/runner/sandbox.ts) ; il signale ensuite si l'import
// d'un module blob est permis (Pyodide en a besoin ; un en-tête CSP du serveur peut l'interdire).
(() => {
  const PRELUDE = `
self.__ENGINE_SANDBOX = true;
(() => {
  const pending = new Map();
  let next = 1;
  self.fetch = (input, init) =>
    new Promise((resolve, reject) => {
      const id = next++;
      pending.set(id, { resolve, reject });
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      self.postMessage({ __proxy: 'fetch', id, url: new URL(url, self.__ENGINE_BASE || undefined).href, integrity: init && init.integrity });
    });
  self.addEventListener('message', (event) => {
    const m = event.data;
    if (!m || m.__proxy !== 'fetch-result') return;
    event.stopImmediatePropagation();
    const p = pending.get(m.id);
    if (!p) return;
    pending.delete(m.id);
    if (m.error) p.reject(new TypeError(m.error));
    else p.resolve(new Response(m.body, { status: m.status, headers: { 'content-type': m.contentType || 'application/octet-stream' } }));
  });
  const probe = URL.createObjectURL(new Blob(['export default 1'], { type: 'text/javascript' }));
  import(probe).then(() => true, () => false).then((blobImport) => {
    URL.revokeObjectURL(probe);
    self.postMessage({ __sandbox: 'ready', blobImport });
  });
})();
`;
  let worker = null;
  const toParent = (message, transfer) => window.parent.postMessage(message, '*', transfer || []);

  window.addEventListener('message', (event) => {
    if (event.source !== window.parent || !event.data) return;
    const m = event.data;
    if (m.type === 'boot') {
      if (worker) return;
      const base = JSON.stringify(String(m.base || ''));
      worker = new Worker(URL.createObjectURL(new Blob([`self.__ENGINE_BASE = ${base};`, PRELUDE, m.script], { type: 'text/javascript' })));
      worker.onmessage = (e) => toParent(e.data, e.data && e.data.__proxy === 'fetch' ? [] : undefined);
      worker.onerror = (e) => {
        e.preventDefault();
        toParent({ __sandbox: 'error', message: e.message || 'erreur du worker' });
      };
    } else if (!worker) return;
    else if (m.__proxy === 'fetch-result') worker.postMessage(m, m.body ? [m.body] : []);
    else worker.postMessage(m);
  });
  toParent({ __sandbox: 'host-ready' });
})();
