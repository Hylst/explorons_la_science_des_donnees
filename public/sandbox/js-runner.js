// Page du bac à sable JavaScript (iframe sans accès au site). Reçoit le code par postMessage et renvoie la sortie console.
// Le code qui n'utilise pas le DOM part dans un Web Worker : une boucle infinie n'y bloque rien et le parent peut l'arrêter.
(() => {
  const NEEDS_DOM = /\b(document|window|navigator|location|alert|confirm|prompt|localStorage|sessionStorage|requestAnimationFrame|HTML\w*Element)\b/;

  const runInWorker = (code) =>
    new Promise((resolve) => {
      const core = new URL('js-core.js', location.href).href;
      const source = `importScripts(${JSON.stringify(core)});
        onmessage = async (event) => { postMessage(await self.__runUserCode(event.data)); };`;
      const worker = new Worker(URL.createObjectURL(new Blob([source], { type: 'text/javascript' })));
      worker.onmessage = (event) => resolve(event.data);
      worker.onerror = (event) => resolve({ output: '', error: event.message || 'Erreur dans le worker' });
      worker.postMessage(code);
    });

  window.addEventListener('message', async (event) => {
    if (event.source !== window.parent || !event.data || event.data.type !== 'run') return;
    const id = event.data.id;
    const code = event.data.code;
    const send = (payload) => window.parent.postMessage({ id, ...payload }, '*');
    send({ type: 'started' });
    const result = NEEDS_DOM.test(code) ? await window.__runUserCode(code) : await runInWorker(code);
    send({ type: 'done', output: result.output, error: result.error });
  });
  window.parent.postMessage({ type: 'ready' }, '*');
})();
