export const SUPPORTED_ECOSYSTEMS = [
  'react',
  'nextjs',
  'vue',
  'svelte',
  'angular',
  'solid',
  'astro',
  'blade',
  'vanilla',
  'wordpress',
  'webcomponent',
  'react-native',
  'flutter',
] as const;

export type EcosystemFlavor = (typeof SUPPORTED_ECOSYSTEMS)[number];

export const ECOSYSTEM_LABELS: Record<EcosystemFlavor, string> = {
  react: 'React (.tsx)',
  nextjs: 'Next.js 15 (App Router)',
  vue: 'Vue 3 / Nuxt (.vue)',
  svelte: 'Svelte 5 / SvelteKit (.svelte)',
  angular: 'Angular 18+ Standalone (.ts)',
  solid: 'SolidJS (.tsx)',
  astro: 'Astro (.astro)',
  blade: 'Laravel Blade (.blade.php)',
  vanilla: 'Vanilla JS & Scoped CSS',
  wordpress: 'WordPress Gutenberg Block',
  webcomponent: 'Universal Web Component (<exhuma-*>)',
  'react-native': 'React Native / Expo (.tsx)',
  flutter: 'Flutter / Dart (.dart)',
};

export const DEFAULT_PATHS: Record<EcosystemFlavor, string> = {
  react: 'components/ui',
  nextjs: 'components/ui',
  vue: 'components',
  svelte: 'src/lib/components',
  angular: 'src/app/components',
  solid: 'src/components',
  astro: 'src/components',
  blade: 'resources/views/components',
  vanilla: 'src/components',
  wordpress: 'src/blocks',
  webcomponent: 'src/components',
  'react-native': 'components',
  flutter: 'lib/widgets',
};

export const CANONICAL_COMPONENTS = [
  {
    name: 'Stacking Cards',
    slug: 'stacking-cards',
    category: 'cards',
    description: 'Layered 3D sticky stack cards with progressive scroll depth scale decay.',
  },
  {
    name: 'Horizontal Scroller',
    slug: 'horizontal-scroller',
    category: 'cards',
    description: 'Smooth wheel-to-horizontal translation rail with momentum and touch swipe.',
  },
  {
    name: 'CSS Masonry',
    slug: 'css-masonry',
    category: 'layouts',
    description: 'Pure CSS responsive column-count masonry layout.',
  },
  {
    name: 'Auto Grid',
    slug: 'auto-grid',
    category: 'layouts',
    description: 'Responsive CSS Grid with dynamic repeat minmax tracks and zero media queries.',
  },
  {
    name: '3D Tilt Card',
    slug: 'tilt-card',
    category: 'cards',
    description: 'Interactive mouse/touch tracking 3D tilt card with specular reflection.',
  },
];

export const REGISTRY_BASE_URL = 'https://exhuma.dev/api/registry';
