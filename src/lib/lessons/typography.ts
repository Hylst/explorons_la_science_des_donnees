/**
 * Typographie française à l'affichage des leçons : l'espace ordinaire avant « : ; ? ! % » et à l'intérieur des
 * guillemets « » devient insécable, pour que « 12 % » ou « Attention : » ne soient jamais coupés en fin de ligne.
 * Le code (blocs ``` et `code` en ligne) n'est jamais modifié : un espace insécable y casserait un exemple copié.
 * Les sources gardent des espaces ordinaires (le lint refuse les espaces insécables littéraux).
 */
const NBSP = " ";

const fix = (text: string) =>
  text
    .replace(/ ([:;?!%»])/g, `${NBSP}$1`)
    .replace(/« /g, `«${NBSP}`);

export const frenchSpacing = (md: string): string =>
  md
    .split(/(```[\s\S]*?```|`[^`\n]*`)/g)
    .map((part, index) => (index % 2 === 1 ? part : fix(part)))
    .join("");
