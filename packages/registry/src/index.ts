import { UniversalComponent } from './schema';
import { stackingCardsComponent } from './components/stacking-cards';
import { horizontalScrollerComponent } from './components/horizontal-scroller';
import { cssMasonryComponent } from './components/css-masonry';
import { autoGridComponent } from './components/auto-grid';
import { tiltCardComponent } from './components/tilt-card';
import { spotlightCardComponent } from './components/spotlight-card';
import { morphingTabsComponent } from './components/morphing-tabs';
import { accordionComponent } from './components/accordion';
import { infiniteMarqueeComponent } from './components/infinite-marquee';
import { bentoGridComponent } from './components/bento-grid';
import { diamondGridComponent } from './components/diamond-grid';
import { scrollTimelineComponent } from './components/scroll-timeline';
import { stickyParallaxComponent } from './components/sticky-parallax';
import { borderBeamComponent } from './components/border-beam';
import { animatedSphereComponent } from './components/animated-sphere';
import { floatingDockComponent } from './components/floating-dock';
import { interactiveGridComponent } from './components/interactive-grid';
import { numberTickerComponent } from './components/number-ticker';
import { magneticButtonComponent } from './components/magnetic-button';
import { cardSwipeStackComponent } from './components/card-swipe-stack';
import { comparisonSliderComponent } from './components/comparison-slider';
import { expandableCardComponent } from './components/expandable-card';
import { cursorTooltipComponent } from './components/cursor-tooltip';

export * from './schema';

export const COMPONENT_REGISTRY: Record<string, UniversalComponent> = {
  'stacking-cards': stackingCardsComponent,
  'horizontal-scroller': horizontalScrollerComponent,
  'css-masonry': cssMasonryComponent,
  'auto-grid': autoGridComponent,
  'tilt-card': tiltCardComponent,
  'spotlight-card': spotlightCardComponent,
  'morphing-tabs': morphingTabsComponent,
  'accordion': accordionComponent,
  'infinite-marquee': infiniteMarqueeComponent,
  'bento-grid': bentoGridComponent,
  'diamond-grid': diamondGridComponent,
  'scroll-timeline': scrollTimelineComponent,
  'sticky-parallax': stickyParallaxComponent,
  'border-beam': borderBeamComponent,
  'animated-sphere': animatedSphereComponent,
  'floating-dock': floatingDockComponent,
  'interactive-grid': interactiveGridComponent,
  'number-ticker': numberTickerComponent,
  'magnetic-button': magneticButtonComponent,
  'card-swipe-stack': cardSwipeStackComponent,
  'comparison-slider': comparisonSliderComponent,
  'expandable-card': expandableCardComponent,
  'cursor-tooltip': cursorTooltipComponent,
};

export const ALL_COMPONENTS: UniversalComponent[] = Object.values(COMPONENT_REGISTRY);

export function getComponentBySlug(slug: string): UniversalComponent | undefined {
  return COMPONENT_REGISTRY[slug];
}

export function getComponentsByCategory(category: UniversalComponent['category']): UniversalComponent[] {
  return ALL_COMPONENTS.filter((c) => c.category === category);
}

export const CATEGORIES = [
  { id: 'cards', label: 'Tactile Cards & Interactions', count: 8 },
  { id: 'layouts', label: 'Responsive Layout Engines', count: 8 },
  { id: 'navigation', label: 'Navigation & Rails', count: 2 },
  { id: 'primitives', label: 'Kinetic Primitives & Disclosures', count: 5 },
] as const;



