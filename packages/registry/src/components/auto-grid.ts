import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const autoGridComponent: UniversalComponent = {
  id: 'auto-grid',
  name: 'Auto Grid',
  slug: 'auto-grid',
  category: 'layouts',
  description: 'Responsive CSS Grid with auto-fit / auto-fill minmax repeat tracks with zero media queries.',
  version: '1.0.0',
  props: [
    {
      name: 'minItemWidth',
      label: 'Min Width (px)',
      type: 'number',
      defaultValue: 280,
      min: 150,
      max: 450,
      step: 10,
      description: 'Minimum width of each grid column before wrapping to the next line.',
    },
    {
      name: 'gap',
      label: 'Grid Gap (px)',
      type: 'number',
      defaultValue: 24,
      min: 8,
      max: 48,
      step: 4,
      description: 'Gap between grid items.',
    },
  ],
  defaultProps: {
    minItemWidth: 280,
    gap: 24,
  },
  dependencies: CORE_COMPONENT_DEPENDENCIES,
  generateCode: (
    flavor: EcosystemFlavor,
    props: Record<string, unknown>,
    _options?: { eject?: boolean }
  ): ComponentFilePayload[] => {
    return generateOuterLayerFiles(
      {
        id: 'auto-grid',
        name: 'Auto Grid',
        slug: 'auto-grid',
        category: 'layouts',
        pascalName: 'AutoGrid',
        snakeName: 'auto_grid',
        description: 'Responsive CSS Grid with auto-fit / auto-fill minmax repeat tracks.',
        defaultTailwindClass: 'grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-6 w-full',
      },
      flavor,
      props
    );
  },
};
