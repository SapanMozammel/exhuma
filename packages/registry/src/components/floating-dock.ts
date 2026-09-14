import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const floatingDockComponent: UniversalComponent = {
  id: 'floating-dock',
  name: 'Floating Dock',
  slug: 'floating-dock',
  category: 'navigation',
  description: 'macOS-style kinetic floating dock with continuous Gaussian proximity distribution and zero external animation libraries.',
  version: '1.0.0',
  props: [
    {
      name: 'baseSize',
      label: 'Base Item Size (px)',
      type: 'number',
      defaultValue: 44,
      min: 32,
      max: 64,
      step: 2,
      description: 'Default width and height of dock items at rest.',
    },
    {
      name: 'maxMagnification',
      label: 'Max Boost Factor',
      type: 'number',
      defaultValue: 0.6,
      min: 0.2,
      max: 1.0,
      step: 0.05,
      description: 'Maximum scale multiplier at zero distance.',
    },
    {
      name: 'influenceRadius',
      label: 'Influence Radius (px)',
      type: 'number',
      defaultValue: 70,
      min: 40,
      max: 140,
      step: 5,
      description: 'Standard deviation spread of the Gaussian proximity curve.',
    },
  ],
  defaultProps: {
    baseSize: 44,
    maxMagnification: 0.6,
    influenceRadius: 70,
  },
  dependencies: CORE_COMPONENT_DEPENDENCIES,
  generateCode: (
    flavor: EcosystemFlavor,
    props: Record<string, unknown>,
    _options?: { eject?: boolean }
  ): ComponentFilePayload[] => {
    return generateOuterLayerFiles(
      {
        id: 'floating-dock',
        name: 'Floating Dock',
        slug: 'floating-dock',
        category: 'navigation',
        pascalName: 'FloatingDock',
        snakeName: 'floating_dock',
        description: 'macOS-style kinetic floating dock with continuous Gaussian proximity distribution.',
        defaultTailwindClass: 'mx-auto flex h-16 items-end gap-3 rounded-2xl border border-border bg-card/80 px-4 pb-3 shadow-lg backdrop-blur-md',
      },
      flavor,
      props
    );
  },
};
