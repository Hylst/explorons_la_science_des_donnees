#!/usr/bin/env node
/**
 * Prépare les moteurs d'exécution de code du navigateur, servis par le site lui-même (aucun CDN à l'exécution) :
 *   - Pyodide (Python) : cœur copié depuis node_modules/pyodide, paquets scientifiques téléchargés une fois
 *   - sql.js (SQLite)  : binaire WebAssembly copié depuis node_modules/sql.js
 * Sortie : public/vendor/ (ignoré par git, recréé automatiquement avant dev/build par les scripts « pre »).
 *
 *   npm run runtimes:sync
 *
 * Les paquets Python sont téléchargés depuis le CDN officiel de Pyodide, à la version installée, et leur
 * empreinte SHA-256 est vérifiée avec celle de pyodide-lock.json. Le téléchargement est mis en cache dans .cache/.
 * Pour alléger le site (environ 40 Mo), retirer des noms de PYTHON_PACKAGES : les modules retirés lèveront alors
 * ModuleNotFoundError dans l'éditeur (message clair, pas de faux résultat).
 */
import { createHash } from "node:crypto";
import { copyFile, mkdir, readdir, readFile, writeFile, access, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Paquets proposés dans l'éditeur ; leurs dépendances sont ajoutées automatiquement. */
const PYTHON_PACKAGES = ["numpy", "pandas", "scikit-learn", "matplotlib"];
const CORE_FILES = ["pyodide.asm.wasm", "python_stdlib.zip"];

/**
 * Licences des paquets Python livrés, relevées dans le fichier METADATA de chaque roue (2026-09-30 ; matplotlib et ses dépendances : 2026-10-02).
 * Le script refuse un paquet absent de cette liste : en ajouter un impose de vérifier sa licence.
 */
const PACKAGE_LICENSES = {
  numpy: ["BSD-3-Clause AND 0BSD AND MIT AND Zlib AND CC0-1.0", "https://numpy.org"],
  pandas: ["BSD-3-Clause", "https://pandas.pydata.org"],
  scipy: ["BSD-3-Clause", "https://scipy.org"],
  "scikit-learn": ["BSD-3-Clause", "https://scikit-learn.org"],
  joblib: ["BSD-3-Clause", "https://joblib.readthedocs.io"],
  threadpoolctl: ["BSD-3-Clause", "https://github.com/joblib/threadpoolctl"],
  "python-dateutil": ["BSD-3-Clause ou Apache-2.0 (double licence)", "https://github.com/dateutil/dateutil"],
  pytz: ["MIT", "http://pythonhosted.org/pytz"],
  six: ["MIT", "https://github.com/benjaminp/six"],
  matplotlib: ["Licence Matplotlib (fondée sur la PSF) ; polices DejaVu et STIX avec leurs propres licences", "https://matplotlib.org"],
  contourpy: ["BSD-3-Clause", "https://github.com/contourpy/contourpy"],
  cycler: ["BSD-3-Clause", "https://matplotlib.org/cycler/"],
  fonttools: ["MIT", "https://github.com/fonttools/fonttools"],
  kiwisolver: ["BSD-3-Clause", "https://github.com/nucleic/kiwi"],
  packaging: ["Apache-2.0 OU BSD-2-Clause (double licence)", "https://github.com/pypa/packaging"],
  pillow: ["MIT-CMU (HPND)", "https://python-pillow.github.io"],
  pyparsing: ["MIT", "https://github.com/pyparsing/pyparsing"],
};

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pyodideDir = path.join(root, "node_modules/pyodide");
const sqlDir = path.join(root, "node_modules/sql.js/dist");
const sqlVersion = JSON.parse(await readFile(path.join(root, "node_modules/sql.js/package.json"), "utf8")).version;
const pyVersion = JSON.parse(await readFile(path.join(pyodideDir, "package.json"), "utf8")).version;
// Dossiers nommés par version : le service worker peut les garder en cache sans risque de fichier périmé
const outPy = path.join(root, `public/vendor/pyodide-${pyVersion}`);
const outSql = path.join(root, `public/vendor/sql-js-${sqlVersion}`);
const cache = path.join(root, ".cache/pyodide-wheels");

const exists = (p) => access(p).then(() => true, () => false);
const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");

const version = pyVersion;
const lock = JSON.parse(await readFile(path.join(pyodideDir, "pyodide-lock.json"), "utf8"));

// Anciennes versions ou anciens noms de dossier
for (const entry of await readdir(path.join(root, "public/vendor")).catch(() => [])) {
  if (entry !== path.basename(outPy) && entry !== path.basename(outSql) && entry !== "NOTICE.txt") await rm(path.join(root, "public/vendor", entry), { recursive: true, force: true });
}

// Cœur de Pyodide
await mkdir(outPy, { recursive: true });
for (const file of CORE_FILES) await copyFile(path.join(pyodideDir, file), path.join(outPy, file));
// Les modules ES sont copiés avec l'extension .js : un Nginx qui ne connaît pas « .mjs » les servirait en application/octet-stream,
// type que les navigateurs refusent pour un import() de module.
await copyFile(path.join(pyodideDir, "pyodide.asm.mjs"), path.join(outPy, "pyodide.asm.js"));
await writeFile(path.join(outPy, "pyodide.module.js"), (await readFile(path.join(pyodideDir, "pyodide.mjs"), "utf8")).replaceAll("pyodide.asm.mjs", "pyodide.asm.js").replaceAll("//# sourceMappingURL=pyodide.mjs.map", ""));

for (const stale of ["pyodide.mjs", "pyodide.asm.mjs"]) await rm(path.join(outPy, stale), { force: true });

// Paquets et dépendances
const wanted = new Set();
const visit = (name) => {
  const key = name.toLowerCase().replace(/_/g, "-");
  const pkg = lock.packages[key];
  if (!pkg) throw new Error(`Paquet inconnu dans pyodide-lock.json : ${name}`);
  if (wanted.has(key)) return;
  wanted.add(key);
  (pkg.depends ?? []).forEach(visit);
};
PYTHON_PACKAGES.forEach(visit);

await mkdir(cache, { recursive: true });
const slim = { info: lock.info, packages: {} };
for (const key of wanted) {
  const pkg = lock.packages[key];
  slim.packages[key] = pkg;
  const target = path.join(outPy, pkg.file_name);
  const cached = path.join(cache, pkg.file_name);
  if (!(await exists(cached))) {
    const url = `https://cdn.jsdelivr.net/pyodide/v${version}/full/${pkg.file_name}`;
    process.stdout.write(`Téléchargement ${pkg.file_name} ... `);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url} : HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (sha256(buf) !== pkg.sha256) throw new Error(`Empreinte SHA-256 incorrecte pour ${pkg.file_name}`);
    await writeFile(cached, buf);
    console.log(`${(buf.length / 1e6).toFixed(1)} Mo`);
  }
  await copyFile(cached, target);
}
// Verrou allégé : un import d'un paquet non fourni échoue proprement au lieu de viser une URL absente
await writeFile(path.join(outPy, "pyodide-lock.json"), JSON.stringify(slim));

// SQLite
await mkdir(outSql, { recursive: true });
await copyFile(path.join(sqlDir, "sql-wasm-browser.wasm"), path.join(outSql, "sql-wasm.wasm"));

// Inventaire des composants tiers, publié avec le site (lien depuis les pages légales et la licence)
const unknown = [...wanted].filter((key) => !PACKAGE_LICENSES[key]);
if (unknown.length) throw new Error(`Licence à vérifier (METADATA de la roue) puis à ajouter à PACKAGE_LICENSES : ${unknown.join(", ")}`);
const notice = [
  "Composants tiers embarqués dans le dossier vendor/ (moteurs d'exécution du code de l'éditeur)",
  "==========================================================================================",
  "",
  "Ces composants ne sont pas couverts par la licence AGPL-3.0-or-later du site : chacun garde sa propre licence.",
  "Fichier généré par scripts/sync-runtimes.mjs ; ne pas le modifier à la main.",
  "",
  `Pyodide ${version} (Python ${lock.info?.python ?? "3"} compilé en WebAssembly, avec CPython) : Mozilla Public License 2.0 ; CPython : PSF-2.0`,
  "  https://pyodide.org  |  code source : https://github.com/pyodide/pyodide",
  "  Modification : pyodide.module.js est pyodide.mjs dont le nom du module « pyodide.asm.mjs » est remplacé par « pyodide.asm.js »",
  "  (pour un type MIME correct sur tout serveur). Aucun autre changement.",
  "",
  `sql.js ${sqlVersion} (SQLite compilé en WebAssembly) : MIT ; SQLite : domaine public`,
  "  https://github.com/sql-js/sql.js  |  https://sqlite.org/copyright.html",
  "",
  "Paquets Python fournis (le texte complet de chaque licence est dans le dossier .dist-info de la roue .whl correspondante) :",
  ...[...wanted].sort().map((key) => `  ${key} ${lock.packages[key].version} : ${PACKAGE_LICENSES[key][0]}  (${PACKAGE_LICENSES[key][1]})`),
  "",
].join("\n");
await writeFile(path.join(root, "public/vendor/NOTICE.txt"), notice);

const names = [...wanted].join(", ");
console.log(`Moteurs prêts dans public/vendor : Pyodide ${version} (${names}) et sql.js.`);
