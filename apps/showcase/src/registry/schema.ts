import { z } from 'zod';

export const EcosystemFlavorSchema = z.enum([
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
]);

export type EcosystemFlavor = z.infer<typeof EcosystemFlavorSchema>;

export const ECOSYSTEM_LABELS: Record<EcosystemFlavor, string> = {
  react: 'React (.tsx)',
  nextjs: 'Next.js 15',
  vue: 'Vue 3 / Nuxt',
  svelte: 'Svelte 5 (Runes)',
  angular: 'Angular 18+ (Signals)',
  solid: 'SolidJS (.tsx)',
  astro: 'Astro (.astro)',
  blade: 'Laravel Blade',
  vanilla: 'Vanilla JS & CSS',
  wordpress: 'WordPress Gutenberg',
  webcomponent: 'Web Component',
  'react-native': 'React Native (Expo)',
  flutter: 'Flutter (Dart)',
};

export type PropType = 'number' | 'string' | 'boolean' | 'select' | 'color';

export interface PropDescriptor {
  name: string;
  label: string;
  type: PropType;
  defaultValue: unknown;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ label: string; value: string }>;
  description?: string;
}

export interface ComponentFilePayload {
  filename: string;
  language: 'typescript' | 'javascript' | 'tsx' | 'vue' | 'svelte' | 'astro' | 'php' | 'html' | 'css' | 'json' | 'dart';
  code: string;
  description?: string;
}

export interface UniversalComponent {
  id: string;
  name: string;
  slug: string;
  category: 'cards' | 'layouts' | 'navigation';
  description: string;
  version: string;
  props: PropDescriptor[];
  defaultProps: Record<string, unknown>;
  generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>) => ComponentFilePayload[];
}
