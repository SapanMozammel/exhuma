import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const horizontalScrollerComponent: UniversalComponent = {
  id: 'horizontal-scroller',
  name: 'Horizontal Scroller',
  slug: 'horizontal-scroller',
  category: 'cards',
  description: 'Dynamic canvas track that smoothly maps vertical page scroll to horizontal card translation via GPU-accelerated CSS custom properties.',
  version: '1.0.0',
  props: [
    {
      name: 'speed',
      label: 'Scroll Speed Multiplier',
      type: 'number',
      defaultValue: 0.85,
      min: 0.2,
      max: 2.0,
      step: 0.05,
      description: 'Scroll speed multiplier mapping vertical page scroll to horizontal translation distance.',
    },
    {
      name: 'itemGap',
      label: 'Item Gap (px)',
      type: 'number',
      defaultValue: 20,
      min: 8,
      max: 48,
      step: 4,
      description: 'Gap in pixels between horizontal track cards.',
    },
    {
      name: 'showFadeEdges',
      label: 'Fade Edges',
      type: 'boolean',
      defaultValue: true,
      description: 'Show subtle gradient mask at horizontal boundaries.',
    },
  ],
  defaultProps: {
    speed: 0.85,
    itemGap: 20,
    showFadeEdges: true,
  },
  dependencies: CORE_COMPONENT_DEPENDENCIES,
  generateCode: (
    flavor: EcosystemFlavor,
    props: Record<string, unknown>,
    _options?: { eject?: boolean }
  ): ComponentFilePayload[] => {
    return generateOuterLayerFiles(
      {
        id: 'horizontal-scroller',
        name: 'Horizontal Scroller',
        slug: 'horizontal-scroller',
        category: 'cards',
        pascalName: 'HorizontalScroller',
        snakeName: 'horizontal_scroller',
        description: 'Dynamic canvas track that smoothly maps vertical page scroll to horizontal card translation.',
        defaultTailwindClass: 'relative overflow-hidden w-full py-8',
      },
      flavor,
      props
    );
  },
};
