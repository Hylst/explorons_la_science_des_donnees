// Règles Nginx de redirection permanente (301) des anciennes URL, tirées de src/config/routes.ts (source unique).
// Le build écrit déjà une page de redirection par ancienne URL (meta refresh, réponse 200) : ces règles, posées par la
// plateforme dans la configuration Nginx, répondent 301 avant que la page ne soit servie.
// Usage : node scripts/nginx-redirects.ts > nginx-redirects.conf (Node 22.6+ retire les types de lui-même)
import { LEGACY_REDIRECTS } from "../src/config/routes.ts";
import { SITE_BASE } from "../src/config/site.ts";

/** Échappe un chemin pour une expression régulière Nginx (PCRE) */
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const nginxRedirects = (base = SITE_BASE): string => {
  const prefix = base.replace(/\/$/, "");
  const lines = [
    `# Anciennes URL de ${base} : redirection permanente vers l'adresse canonique.`,
    "# Généré par scripts/nginx-redirects.ts depuis src/config/routes.ts ; à régénérer quand cette liste change.",
    "# Avec ou sans barre finale, avec ou sans index.html ; la chaîne de requête est conservée.",
  ];
  for (const { from, to } of LEGACY_REDIRECTS) {
    // une ancre (#events) se place après la chaîne de requête
    const [target, fragment] = to.split("#");
    const anchor = fragment ? `#${fragment}` : "";
    lines.push(`location ~ ^${escape(prefix + from)}(/|/index\\.html)?$ { return 301 ${prefix}${target}$is_args$args${anchor}; }`);
  }
  return lines.join("\n") + "\n";
};

if (process.argv[1] && /nginx-redirects\.ts$/.test(process.argv[1])) process.stdout.write(nginxRedirects());
