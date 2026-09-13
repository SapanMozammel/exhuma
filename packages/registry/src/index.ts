import { UniversalComponent } from './schema';
import { stackingCardsComponent } from './components/stacking-cards';
import { horizontalScrollerComponent } from './components/horizontal-scroller';
import { cssMasonryComponent } from './components/css-masonry';
import { autoGridComponent } from './components/auto-grid';
import { tiltCardComponent } from './components/tilt-card';

export * from './schema';

export const COMPONENT_REGISTRY: Record<string, UniversalComponent> = {
  'stacking-cards': stackingCardsComponent,
  'horizontal-scroller': horizontalScrollerComponent,
  'css-masonry': cssMasonryComponent,
  'auto-grid': autoGridComponent,
  'tilt-card': tiltCardComponent,
};

export const ALL_COMPONENTS: UniversalComponent[] = Object.values(COMPONENT_REGISTRY);

export function getComponentBySlug(slug: string): UniversalComponent | undefined {
  return COMPONENT_REGISTRY[slug];
}

export function getComponentsByCategory(category: UniversalComponent['category']): UniversalComponent[] {
  return ALL_COMPONENTS.filter((c) => c.category === category);
}

export const CATEGORIES = [
  { id: 'cards', label: 'Tactile Cards & Interactions', count: 2 },
  { id: 'layouts', label: 'Responsive Layout Engines', count: 2 },
  { id: 'navigation', label: 'Navigation & Rails', count: 1 },
] as const;
