/**
 * Moteur isolé : le worker Python ou SQL tourne dans un iframe sandbox="allow-scripts" (public/sandbox/engine-host.html),
 * donc dans une origine opaque. Le code exécuté n'atteint ni le stockage du site (IndexedDB, Cache Storage du service
 * worker, localStorage), ni le réseau : chaque fichier dont le moteur a besoin est lu ici, par la page, et seulement sous
 * vendor/ (Pyodide, ses paquets, SQLite). Le travail se présente comme un Worker (postMessage, événements message et
 * error, terminate) : createWorkerRunner ne voit pas la différence.
 *
 * Repli : si l'isolation ne démarre pas (en-tête CSP du serveur qui interdit les modules blob dont Pyodide a besoin,
 * iframe qui ne répond pas), le moteur est lancé comme avant, dans un Web Worker de même origine. `mode` dit lequel
 * tourne ; rien n'est perdu, les messages en attente sont rejoués.
 */

export type EngineMode = "booting" | "sandbox" | "worker";

interface SandboxOptions {
  /** URL du script du worker construit (même origine), lu ici puis passé à l'iframe */
  scriptUrl: string;
  /** Page hôte du bac à sable */
  hostUrl: string;
  /** Seul préfixe que le moteur peut lire (…/vendor/) */
  vendorBase: string;
  /** Pyodide importe ses modules depuis des blobs : sans cette permission, l'isolation n'est pas possible */
  needsBlobImport: boolean;
  /** Worker de même origine, utilisé si l'isolation ne démarre pas */
  fallback: () => Worker;
  bootTimeoutMs?: number;
}

/**
 * Un fichier demandé par le moteur n'est servi que s'il est sous vendor/. L'analyseur d'URL résout « .. » et « %2e%2e »
 * avant la comparaison ; une URL avec identifiants ou dans un autre schéma est refusée.
 */
export const isEngineFile = (url: string, vendorBase: string): boolean => {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (!/^https?:$/.test(parsed.protocol) || parsed.username || parsed.password) return false;
  return parsed.origin === new URL(vendorBase).origin && parsed.href.startsWith(vendorBase);
};

type FetchRequest = { __proxy: "fetch"; id: number; url: string; integrity?: string };

export class SandboxedEngine extends EventTarget {
  mode: EngineMode = "booting";
  private frame: HTMLIFrameElement | null = null;
  private worker: Worker | null = null;
  private queue: unknown[] = [];
  private timer: ReturnType<typeof setTimeout> | undefined;
  private closed = false;

  constructor(private readonly options: SandboxOptions) {
    super();
    const frame = document.createElement("iframe");
    frame.setAttribute("sandbox", "allow-scripts");
    frame.setAttribute("aria-hidden", "true");
    frame.tabIndex = -1;
    frame.style.cssText = "position:fixed;width:0;height:0;border:0;opacity:0;pointer-events:none";
    frame.src = options.hostUrl;
    this.frame = frame;
    window.addEventListener("message", this.onFrameMessage);
    this.timer = setTimeout(() => this.useFallback(), options.bootTimeoutMs ?? 10_000);
    document.body.appendChild(frame);
  }

  postMessage(message: unknown) {
    if (this.closed) return;
    if (this.mode === "booting") this.queue.push(message);
    else if (this.mode === "sandbox") this.frame?.contentWindow?.postMessage(message, "*");
    else this.worker?.postMessage(message);
  }

  terminate() {
    this.closed = true;
    clearTimeout(this.timer);
    this.removeFrame();
    this.worker?.terminate();
    this.worker = null;
    this.queue = [];
  }

  private emit(data: unknown) {
    this.dispatchEvent(new MessageEvent("message", { data }));
  }

  private removeFrame() {
    window.removeEventListener("message", this.onFrameMessage);
    this.frame?.remove();
    this.frame = null;
  }

  private flush(send: (message: unknown) => void) {
    const pending = this.queue;
    this.queue = [];
    pending.forEach(send);
  }

  private useFallback() {
    if (this.closed || this.mode !== "booting") return;
    clearTimeout(this.timer);
    this.removeFrame();
    const worker = this.options.fallback();
    worker.addEventListener("message", (event: MessageEvent) => this.emit(event.data));
    worker.addEventListener("error", (event: ErrorEvent) => this.dispatchEvent(new ErrorEvent("error", { message: event.message })));
    this.worker = worker;
    this.mode = "worker";
    this.flush((message) => worker.postMessage(message));
  }

  private readonly onFrameMessage = (event: MessageEvent) => {
    const frame = this.frame;
    if (!frame || event.source !== frame.contentWindow || !event.data || typeof event.data !== "object") return;
    const data = event.data as Record<string, unknown>;
    if (data.__sandbox === "host-ready") void this.boot();
    else if (data.__sandbox === "ready") {
      if (this.mode !== "booting") return;
      if (this.options.needsBlobImport && data.blobImport !== true) return this.useFallback();
      clearTimeout(this.timer);
      this.mode = "sandbox";
      this.flush((message) => frame.contentWindow?.postMessage(message, "*"));
    } else if (data.__sandbox === "error") {
      if (this.mode === "booting") this.useFallback();
      else this.dispatchEvent(new ErrorEvent("error", { message: String(data.message ?? "") }));
    } else if (data.__proxy === "fetch") void this.serveFile(data as unknown as FetchRequest);
    else if (this.mode === "sandbox") this.emit(data);
  };

  private async boot() {
    try {
      const response = await fetch(this.options.scriptUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const script = await response.text();
      this.frame?.contentWindow?.postMessage({ type: "boot", script, base: this.options.vendorBase }, "*");
    } catch {
      this.useFallback();
    }
  }

  private async serveFile(request: FetchRequest) {
    const reply = (message: Record<string, unknown>, transfer: Transferable[] = []) =>
      this.frame?.contentWindow?.postMessage({ __proxy: "fetch-result", id: request.id, ...message }, "*", transfer);
    if (!isEngineFile(request.url, this.options.vendorBase)) {
      reply({ error: "Lecture refusée : le moteur isolé ne lit que les fichiers de vendor/." });
      return;
    }
    try {
      const response = await fetch(request.url, request.integrity ? { integrity: request.integrity } : {});
      const body = await response.arrayBuffer();
      reply({ status: response.status, contentType: response.headers.get("content-type"), body }, [body]);
    } catch (error) {
      reply({ error: error instanceof Error ? error.message : String(error) });
    }
  }
}
