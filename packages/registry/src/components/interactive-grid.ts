import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const interactiveGridComponent: UniversalComponent = {
	id: 'interactive-grid',
	name: 'Interactive Grid Pattern',
	slug: 'interactive-grid',
	category: 'layouts',
	description: 'Sub-pixel SVG background grid pattern with hover activation and hardware-accelerated color transitions.',
	version: '1.0.0',
	props: [
		{
			name: 'width',
			label: 'Square Width (px)',
			type: 'number',
			defaultValue: 40,
			min: 20,
			max: 80,
			step: 5,
			description: 'Width of each individual grid square.',
		},
		{
			name: 'height',
			label: 'Square Height (px)',
			type: 'number',
			defaultValue: 40,
			min: 20,
			max: 80,
			step: 5,
			description: 'Height of each individual grid square.',
		},
	],
	defaultProps: {
		width: 40,
		height: 40,
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, _options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'interactive-grid',
				name: 'Interactive Grid Pattern',
				slug: 'interactive-grid',
				category: 'layouts',
				pascalName: 'InteractiveGridPattern',
				snakeName: 'interactive_grid_pattern',
				description: 'Sub-pixel SVG background grid pattern with interactive square activation.',
				defaultTailwindClass: 'absolute inset-0 h-full w-full stroke-gray-400/30 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]',
			},
			flavor,
			props
		);
	},
};
