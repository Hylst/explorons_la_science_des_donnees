# Documentation des composants d'Explorons la Data Science

## Vue d'ensemble

Cette documentation présente les composants d'interface partagés d'« Explorons la Data Science » (anciennement « Data Science Explorer »), une plateforme éducative francophone pour l'apprentissage de la Data Science. Elle ne décrit que du code présent dans `src/` (vérifié par recherche dans le dépôt). Pour l'architecture générale (routage, données, hébergement), voir `structure.md` et `readme_dev.md`.

## Design System

Le système de design repose sur :
- **Tokens sémantiques** : couleurs définies en variables CSS HSL dans `src/index.css` (thèmes clair et sombre) et exposées par `tailwind.config.ts`
- **Animations Tailwind** : keyframes et classes `animate-*` déclarées dans `tailwind.config.ts`
- **Composants shadcn/ui** (Radix) dans `src/components/ui/`
- **Thème clair, sombre ou de l'appareil** (voir plus bas)

### Structure des couleurs

```css
/* src/index.css, thème clair */
--primary: 221 83% 53%;        /* Bleu principal */
--secondary: 250 95% 76%;      /* Violet secondaire */
--accent: 263 70% 50%;         /* Accent violet */
--muted-foreground: 215 19% 39%;  /* assombri pour tenir le contraste 4,5:1 */
--destructive: 0 74% 45%;         /* idem */
```

`tailwind.config.ts` ajoute deux palettes de marque de 10 nuances chacune (50 à 900) :

- `ds-blue` : de `#e6f1ff` (50) à `#001833` (900) ; la nuance 500 vaut `#005fcc` (comme la 600 ; elle valait `#0077ff`, trop claire pour le contraste du texte)
- `ds-purple` : de `#f2e6ff` (50) à `#1a0033` (900), `#8000ff` en 500

Utilisation : `from-ds-blue-500 to-ds-purple-500`, `border-ds-blue-500`, etc.

Pour tenir le contraste WCAG AA (4,5:1) du texte coloré sur fond clair et du texte blanc sur fond coloré, `tailwind.config.ts` redéfinit aussi quelques nuances de Tailwind : `green-600`, `emerald-600`, `yellow-600`, `orange-600`, `amber-600`, `blue-500`, `purple-500`, `red-500` et `red-600`. Un texte blanc posé sur un de ces fonds colorés doit porter `text-white` explicitement.

### Thème clair, sombre ou de l'appareil

| Élément | Fichier | Rôle |
|---|---|---|
| `ThemeProvider` | `components/theme/ThemeProvider.tsx` | Applique la classe `light` ou `dark` sur `<html>`, suit le réglage de l'appareil en direct pour le choix « system », mémorise le choix (clé `ds-explorer-theme`) |
| `ThemeToggle` | `components/theme/ThemeToggle.tsx` | Menu Clair, Sombre, Comme l'appareil, placé dans la barre de navigation |
| `useTheme` | `hooks/use-theme.ts` | `theme`, `resolvedTheme`, `setTheme` ; exporte `THEMES` et `THEME_STORAGE_KEY` |
| `theme-init.js` | `public/theme-init.js` | Applique le thème enregistré avant l'affichage, pour éviter un éclair clair (script externe : la CSP interdit les scripts en ligne) |
| `dark-palette` | `tailwind/dark-palette.ts` | Plugin Tailwind qui lit les classes de couleur fixes utilisées dans `src/` (`bg-white`, `bg-blue-50`, `text-gray-700`, `from-blue-50`...) et génère la règle sombre équivalente : les fichiers de cours n'ont pas à être modifiés |
| `dynamic-colors` | `tailwind/dynamic-colors.ts` | Teintes et nuances des classes construites à l'exécution (`bg-${couleur}-50`) : conservées dans le CSS (safelist) et adaptées au mode sombre |

`<ThemeProvider defaultTheme="light">` est posé dans `App.tsx`. `DEFAULT_THEME` de `public/theme-init.js` doit rester égal à ce `defaultTheme`, et la clé à `THEME_STORAGE_KEY` (un test automatique, `config/theme.test.ts`, le vérifie). Limite : les couleurs écrites en dur (`style={{ ... }}`, hexadécimaux dans les graphiques Recharts et les SVG) ne sont pas adaptées par le plugin. `src/index.css` impose en outre la couleur du texte des légendes Recharts (`.recharts-legend-item-text`), dont la couleur est posée en style en ligne.

## Composants principaux

### 1. UnifiedHeroSection

**Fichier :** `src/components/ui/unified-hero-section.tsx`

Section héros unifiée. Utilisée par 32 fichiers : l'accueil (`home/Hero.tsx`), la plupart des pages de rubrique (Introduction, Fondamentaux, Machine Learning, Outils et leurs sous-pages, Projets, Quiz, Ressources, Glossaire, Blog, Communauté), les pages de mathématiques et de statistiques, les trois pages d'apprentissage ML, et plusieurs cours (`math-intro`, `inferential-statistics`, `MLModelsGuide`, `TransformersGuide`, `DatabaseFundamentals`).

#### Props

```typescript
interface UnifiedHeroSectionProps {
  variant: "home" | "page" | "course";
  title: string;
  subtitle?: string;
  description: string;
  alert?: {
    message: string;
    details?: string;
    variant?: "info" | "warning" | "success";
  };
  actions?: ActionButton[];      // { label, to, variant?, icon? }
  courseInfo?: CourseInfo;       // { level?, duration?, modules?, totalHours? }
  icon?: LucideIcon;
  children?: ReactNode;
  sideContent?: ReactNode;
  layout?: "centered" | "split";
  decorative?: boolean;
  className?: string;
}
```

#### Variants

1. **home** : page d'accueil
2. **page** : pages internes
3. **course** : pages de cours, avec badges issus de `courseInfo` (la durée est suivie de « (indicatif) »)

#### Utilisation

```tsx
<UnifiedHeroSection
  variant="page"
  title="Titre"
  description="Description"
  actions={[{ label: "Commencer", to: "/introduction", variant: "default" }]}
/>
```

### 2. AnimatedEntrance

**Fichier :** `src/components/ui/animated-entrance.tsx`

Animations d'entrée déclenchées par un `IntersectionObserver`. Le fichier exporte `AnimatedEntrance`, `StaggeredAnimation`, `Parallax`, `MorphingShape` et `TextReveal`. Dans le reste du code, seul `AnimatedEntrance` est importé (par `UnifiedHeroSection`).

Valeurs de `animation` : `fade-in`, `fade-in-up` (défaut), `fade-in-down`, `fade-in-left`, `fade-in-right`, `scale-in`. Chacune correspond à une classe `animate-*` de `tailwind.config.ts`.

```tsx
<AnimatedEntrance animation="fade-in-up" delay={200}>
  <div>Contenu animé</div>
</AnimatedEntrance>

<Parallax speed={0.5}>
  <div>Contenu en parallaxe</div>
</Parallax>
```

### 3. AnimatedLogo

**Fichier :** `src/components/ui/animated-logo.tsx`

Logo de la barre de navigation (`layout/Navbar.tsx`), lien vers l'accueil avec icône `BarChart3`. Le texte est écrit sur deux lignes, « Explorons » puis « la Data Science » (nom du site, `SITE_NAME` de `config/site.ts`). Props : `className?: string` et `showText?: boolean` (défaut `true`).

```tsx
<AnimatedLogo showText={false} className="hover:scale-105" />
```

### 4. Images

Les images du site utilisent des balises `<img>` directes, avec `loading="lazy"` quand elles sont sous la ligne de flottaison (accueil, `BigDataSection.tsx`). Un composant `OptimizedImage` (chargement différé par `IntersectionObserver`, image de repli) a existé : il n'était importé nulle part et a été supprimé le 5 octobre 2026. Les chemins d'images statiques doivent passer par `asset()` de `src/lib/asset.ts`, jamais en dur. Les illustrations de l'accueil sont des SVG animés maison (`public/svg/cards/`) ; une image décorative porte `alt=""`.

### 5. Composants de cours

Les pages de cours sont composées à partir de `src/components/courses/` :

- `CourseHeroTemplate` : en-tête de cours (utilisé par 5 pages : Python et quatre cours à plan ; durée suivie de « (indicatif) »)
- `CourseModuleTemplate` : structure d'un module, avec barre d'avancement locale
- `CourseEquation` : équations KaTeX
- `CourseHighlight` : encadrés de mise en évidence (`type` : `info`, `concept`, `example`, `question`, `warning`, `tip`, `success`)
- `CourseBreadcrumb` : fil d'Ariane
- `CourseFigures` : figures SVG (sans image distante)
- `CourseQuizBlock` : quiz intégré au cours
- `CourseItemActions` : progression et notes locales (via `hooks/use-course-progress.ts`)

Le gabarit de page des cours longs est `src/components/layout/CourseLayout.tsx`. `layout/PageHeader.tsx` (en-tête simple) existe toujours et n'est utilisé que par `DatabasesRefactored.tsx`. `CourseHeroTemplate` et `UnifiedHeroSection` coexistent : aucune migration de l'un vers l'autre n'a été réalisée, suivre une page voisine lors d'un ajout.

### 6. Encadrés pédagogiques et sources

- `components/ui/educational-cards.tsx` : `EducationalCard` (8 types : `zoom`, `rappel`, `saviez-vous`, `exemple`, `exercice`, `concept`, `analogie`, `application`), `QuizCard`, `ExerciseCard`, `ProgressiveDisclosure`. `QuizCard` et `ExerciseCard` gardent leur état localement
- `components/ui/glossary-term.tsx` : `GlossaryTerm`, terme survolable (définition courte) et cliquable (définition détaillée)
- `components/ui/source-note.tsx` : `SourceNote`, ligne « Source : ... , consulté le ... » à placer sous tout chiffre qui décrit le monde réel. Props : `sources` (`{ label, href? }[]`), `consulted?`, `className?`. Le registre complet est dans `docs/SOURCES.md`

### 7. États de chargement et erreurs

- `src/components/ui/loading-states.tsx` : `LoadingSpinner`, `PageLoading`, `CardLoading`, `TableLoading`, `ErrorState`, `EmptyState`, `NetworkStatus`, `AsyncComponent` et `useAsyncState` ; `PageLoading` sert de `fallback` au `Suspense` global de `App.tsx`
- `src/components/ui/error-boundary.tsx` : `ErrorBoundary` (enveloppe toute l'app), `withErrorBoundary`, `useErrorHandler`

### 8. Routage et métadonnées

- `components/routing/CourseRouter.tsx` : routes `/courses/*`
- `components/routing/ScrollManager.tsx` : défilement en haut à chaque navigation, vers l'ancre, restauration de la position au retour arrière
- `components/routing/RouteMeta.tsx` : titre et description de la page affichée, lus dans `config/page-meta.ts` (même source que les pages HTML générées au build)

## Système d'animations

### Keyframes personnalisées

`tailwind.config.ts` déclare, dans `theme.extend.animation` :

```text
accordion-down, accordion-up              (Radix)
float, float-delayed
fade-in, fade-in-up, fade-in-down, fade-in-left, fade-in-right
scale-in, scale-bounce
gradient-x, gradient-y
shimmer, pulse-glow
stagger-1, stagger-2, stagger-3
typewriter, spin-slow, pulse-slow
```

Exemples de définitions : `'fade-in': 'fade-in 0.6s ease-out'`, `'scale-in': 'scale-in 0.6s cubic-bezier(0.16, 1, 0.3, 1)'`, `'float': 'float 4s ease-in-out infinite'`, `'gradient-x': 'gradient-x 3s ease infinite'`.

### Classes utilitaires (`src/index.css`)

Classes présentes, entre autres : `.btn-interactive` (survol avec balayage de dégradé et zoom), `.glass-effect` (flou d'arrière-plan translucide, variante sombre), `.project-card-enhanced` (carte qui se soulève au survol), `.float-element`. Voir le fichier pour la liste complète.

```css
.glass-effect {
  @apply backdrop-blur-md bg-white/10 border border-white/20 shadow-lg;
  @apply dark:bg-gray-900/10 dark:border-gray-700/20;
}
```

## Typographie

`@tailwindcss/typography` est enregistré sous la classe `rich-text` (couleurs adaptées au thème), réservée au HTML brut des articles de blog. Ne pas utiliser `prose`.

## Contenu injecté, stockage et défilement

- Tout HTML injecté via `dangerouslySetInnerHTML` passe par `sanitizeHtml` (`src/lib/sanitize.ts`, DOMPurify)
- Lecture/écriture navigateur via `src/lib/storage.ts` (`readStorage`, `readJSON`, `writeJSON`, ne lève jamais d'exception), pas de `localStorage` brut
- Le défilement est géré uniquement par `src/components/routing/ScrollManager.tsx` : les pages n'appellent pas `window.scrollTo` au montage

## Bonnes pratiques

1. **Routage** : lier les URL canoniques (les anciennes URL redirigées sont listées dans `src/config/routes.ts`)
2. **Données** : aucune statistique inventée (étudiants, notes, avis) ; afficher uniquement de l'état réel et local ; citer la source de tout chiffre externe avec `SourceNote`
3. **Animations** : éviter d'empiler de nombreuses animations simultanées. Le code ne gère pas `prefers-reduced-motion` aujourd'hui (aucune occurrence dans `src/` ni dans `tailwind.config.ts`) : amélioration possible
4. **Responsive** : tester aux largeurs 390, 768, 1024 et 1280 px avec les classes responsives de Tailwind ; grilles écrites `grid grid-cols-1 md:grid-cols-N`, boutons à libellé long en `whitespace-normal h-auto`
5. **Assets** : `asset()` de `src/lib/asset.ts` et `import.meta.env.BASE_URL`, jamais de chemin `/img/...` en dur
6. **Thème** : vérifier le rendu en clair et en sombre ; les couleurs en dur dans `style` ne suivent pas le thème
7. **Images** : un `alt` sur chaque image informative, `alt=""` sur une image décorative

## Vérification avant livraison

```bash
npm run lint
npm run typecheck     # tsc -p tsconfig.app.json --noEmit
npm run test          # Vitest (jsdom)
npm run build
```

`npm run build` ne vérifie pas les types : lancer `typecheck` séparément. Les tests utilisent Vitest (12 fichiers, 334 tests au 1er octobre 2026) ; React Testing Library n'est pas installée.

---

*Documentation d'Explorons la Data Science. Dernière révision : 1er octobre 2026 (alignée sur le code de la branche d'audit).*
