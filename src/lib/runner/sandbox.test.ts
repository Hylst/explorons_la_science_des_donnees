import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isEngineFile, SandboxedEngine } from "./sandbox";

describe("page hôte du bac à sable (public/sandbox/engine-host.html)", () => {
  const html = readFileSync("public/sandbox/engine-host.html", "utf8");
  const csp = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1] ?? "";

  it("coupe le réseau et n'autorise que ses propres scripts, les blobs et WebAssembly", () => {
    expect(csp).toContain("connect-src 'none'");
    expect(csp).toContain("default-src 'none'");
    expect(csp).toMatch(/script-src 'self' blob: 'wasm-unsafe-eval'(;|$)/);
    expect(csp).not.toMatch(/script-src[^;]*'unsafe-eval'/);
  });
});

const VENDOR = "https://hylst.fr/data_science_explorer/vendor/";

describe("isEngineFile : le moteur isolé ne lit que vendor/", () => {
  it("accepte les fichiers des moteurs", () => {
    expect(isEngineFile(`${VENDOR}pyodide-314.0.7/pyodide.asm.wasm`, VENDOR)).toBe(true);
    expect(isEngineFile(`${VENDOR}sql-js-1.14.2/sql-wasm.wasm?v=1`, VENDOR)).toBe(true);
  });

  it("refuse tout le reste, y compris les remontées de dossier encodées", () => {
    for (const url of [
      "https://hylst.fr/data_science_explorer/sw.js",
      "https://hylst.fr/data_science_explorer/assets/index.js",
      `${VENDOR}../sw.js`,
      `${VENDOR}%2e%2e/sw.js`,
      `${VENDOR}%2E%2E/%2e%2e/index.html`,
      "https://exemple.org/data_science_explorer/vendor/x.js",
      "https://hylst.fr.exemple.org/data_science_explorer/vendor/x.js",
      // identifiants dans l'URL (construite ainsi pour ne pas ressembler à une adresse e-mail dans le code)
      Object.assign(new URL(`${VENDOR}x.js`), { username: "a", password: "b" }).href,
      "https://hylst.fr/data_science_explorer/vendorx/x.js",
      "javascript:alert(1)",
      "data:text/javascript,1",
      "pas une adresse",
    ]) {
      expect(isEngineFile(url, VENDOR), url).toBe(false);
    }
  });
});

/** Fausse page hôte : on lit ce que le moteur lui envoie et on lui fait répondre comme engine-host.js */
const setup = (needsBlobImport: boolean) => {
  const fallbacks: Array<{ posted: unknown[]; terminated: boolean; target: EventTarget }> = [];
  const engine = new SandboxedEngine({
    scriptUrl: "https://hylst.fr/data_science_explorer/assets/python.worker.js",
    hostUrl: "https://hylst.fr/data_science_explorer/sandbox/engine-host.html",
    vendorBase: VENDOR,
    needsBlobImport,
    bootTimeoutMs: 5000,
    fallback: () => {
      const target = new EventTarget();
      const fake = { posted: [] as unknown[], terminated: false, target };
      fallbacks.push(fake);
      return {
        postMessage: (m: unknown) => fake.posted.push(m),
        terminate: () => (fake.terminated = true),
        addEventListener: target.addEventListener.bind(target),
      } as unknown as Worker;
    },
  });
  const frame = document.querySelector("iframe") as HTMLIFrameElement;
  const toFrame = vi.spyOn(frame.contentWindow as Window, "postMessage");
  const fromFrame = (data: unknown) => window.dispatchEvent(new MessageEvent("message", { data, source: frame.contentWindow }));
  const received: unknown[] = [];
  engine.addEventListener("message", (event) => received.push((event as MessageEvent).data));
  return { engine, frame, toFrame, fromFrame, fallbacks, received };
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) =>
      url.endsWith("python.worker.js")
        ? new Response("/* worker */")
        : new Response(new Uint8Array([1, 2, 3]), { headers: { "content-type": "application/wasm" } })
    )
  );
});

afterEach(() => {
  document.querySelectorAll("iframe").forEach((frame) => frame.remove());
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("SandboxedEngine", () => {
  it("crée un iframe sandbox allow-scripts (origine opaque, sans allow-same-origin)", () => {
    const { frame, engine } = setup(true);
    expect(frame.getAttribute("sandbox")).toBe("allow-scripts");
    expect(frame.src).toContain("sandbox/engine-host.html");
    expect(engine.mode).toBe("booting");
  });

  it("garde les messages pendant le démarrage, envoie le worker à l'hôte, puis les rejoue dans le bac à sable", async () => {
    const { engine, toFrame, fromFrame } = setup(true);
    engine.postMessage({ type: "run", id: 1, code: "print(1)" });
    expect(toFrame).not.toHaveBeenCalled();
    fromFrame({ __sandbox: "host-ready" });
    await vi.advanceTimersByTimeAsync(0);
    expect(toFrame).toHaveBeenCalledWith({ type: "boot", script: "/* worker */", base: VENDOR }, "*");
    fromFrame({ __sandbox: "ready", blobImport: true });
    expect(engine.mode).toBe("sandbox");
    expect(toFrame).toHaveBeenLastCalledWith({ type: "run", id: 1, code: "print(1)" }, "*");
  });

  it("transmet les réponses du worker et ignore les messages d'une autre fenêtre", () => {
    const { engine, fromFrame, received } = setup(false);
    fromFrame({ __sandbox: "ready", blobImport: false });
    expect(engine.mode).toBe("sandbox");
    fromFrame({ type: "done", id: 1, output: "1" });
    window.dispatchEvent(new MessageEvent("message", { data: { type: "done", id: 1, output: "faux" }, source: window }));
    expect(received).toEqual([{ type: "done", id: 1, output: "1" }]);
  });

  it("sert un fichier de vendor/ et refuse une lecture hors de vendor/", async () => {
    const { toFrame, fromFrame } = setup(true);
    fromFrame({ __proxy: "fetch", id: 7, url: `${VENDOR}pyodide-314.0.7/pyodide.asm.wasm`, integrity: "sha256-x" });
    fromFrame({ __proxy: "fetch", id: 8, url: "https://hylst.fr/data_science_explorer/sw.js" });
    await vi.advanceTimersByTimeAsync(0);
    expect(fetch).toHaveBeenCalledWith(`${VENDOR}pyodide-314.0.7/pyodide.asm.wasm`, { integrity: "sha256-x" });
    expect(fetch).not.toHaveBeenCalledWith("https://hylst.fr/data_science_explorer/sw.js", expect.anything());
    const replies = toFrame.mock.calls.map(([message]) => message as Record<string, unknown>);
    expect(replies.find((m) => m.id === 7)).toMatchObject({ __proxy: "fetch-result", status: 200, contentType: "application/wasm" });
    expect(replies.find((m) => m.id === 8)).toMatchObject({ __proxy: "fetch-result", error: expect.stringContaining("vendor/") });
  });

  it("Python : sans import de module blob (CSP du serveur), repli sur le worker de même origine, messages rejoués", () => {
    const { engine, frame, fromFrame, fallbacks, received } = setup(true);
    engine.postMessage({ type: "run", id: 1, code: "print(1)" });
    fromFrame({ __sandbox: "ready", blobImport: false });
    expect(engine.mode).toBe("worker");
    expect(frame.isConnected).toBe(false);
    expect(fallbacks).toHaveLength(1);
    expect(fallbacks[0].posted).toEqual([{ type: "run", id: 1, code: "print(1)" }]);
    fallbacks[0].target.dispatchEvent(new MessageEvent("message", { data: { type: "done", id: 1, output: "1" } }));
    expect(received).toEqual([{ type: "done", id: 1, output: "1" }]);
  });

  it("repli aussi si l'hôte ne répond pas à temps, ou si le worker échoue au démarrage", async () => {
    const lent = setup(false);
    await vi.advanceTimersByTimeAsync(5000);
    expect(lent.engine.mode).toBe("worker");
    lent.engine.terminate();
    const casse = setup(false);
    casse.fromFrame({ __sandbox: "error", message: "CSP" });
    expect(casse.engine.mode).toBe("worker");
  });

  it("terminate retire l'iframe (le worker du bac à sable meurt avec lui)", () => {
    const { engine, frame, fromFrame } = setup(false);
    fromFrame({ __sandbox: "ready", blobImport: true });
    engine.terminate();
    expect(frame.isConnected).toBe(false);
  });
});
