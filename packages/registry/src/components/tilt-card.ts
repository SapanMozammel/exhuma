import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const tiltCardComponent: UniversalComponent = {
  id: 'tilt-card',
  name: 'Tilt Card',
  slug: 'tilt-card',
  category: 'cards',
  description: 'Interactive 3D mouse-tracking card tilt with dynamic glare effect and smooth spring reset.',
  version: '1.0.0',
  props: [
    {
      name: 'maxTilt',
      label: 'Max Tilt (deg)',
      type: 'number',
      defaultValue: 15,
      min: 5,
      max: 35,
      step: 1,
      description: 'Maximum tilt rotation in degrees.',
    },
    {
      name: 'perspective',
      label: 'Perspective (px)',
      type: 'number',
      defaultValue: 1000,
      min: 500,
      max: 2000,
      step: 100,
      description: '3D perspective depth in pixels.',
    },
    {
      name: 'glare',
      label: 'Enable Glare',
      type: 'boolean',
      defaultValue: true,
      description: 'Dynamic glare reflection tracking mouse position.',
    },
  ],
  defaultProps: {
    maxTilt: 15,
    perspective: 1000,
    glare: true,
  },
  dependencies: CORE_COMPONENT_DEPENDENCIES,
  generateCode: (
    flavor: EcosystemFlavor,
    props: Record<string, unknown>,
    _options?: { eject?: boolean }
  ): ComponentFilePayload[] => {
    return generateOuterLayerFiles(
      {
        id: 'tilt-card',
        name: 'Tilt Card',
        slug: 'tilt-card',
        category: 'cards',
        pascalName: 'TiltCard',
        snakeName: 'tilt_card',
        description: 'Interactive 3D mouse-tracking card tilt with dynamic glare effect and smooth spring reset.',
        defaultTailwindClass: 'relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md will-change-transform',
      },
      flavor,
      props
    );
  },
};
