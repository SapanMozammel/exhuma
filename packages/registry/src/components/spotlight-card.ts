import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const spotlightCardComponent: UniversalComponent = {
	id: 'spotlight-card',
	name: 'Spotlight Card',
	slug: 'spotlight-card',
	category: 'cards',
	description: 'Dynamic 2D spatial coordinate tracking with sub-pixel radial border illumination mask and smooth exponential smoothing.',
	version: '1.0.0',
	props: [
		{
			name: 'radius',
			label: 'Spotlight Radius (px)',
			type: 'number',
			defaultValue: 350,
			min: 150,
			max: 600,
			step: 25,
			description: 'Radius of the radial spotlight illumination in pixels.',
		},
		{
			name: 'color',
			label: 'Spotlight Color',
			type: 'string',
			defaultValue: 'rgba(99, 102, 241, 0.25)',
			description: 'Background radial sheen color (CSS color string).',
		},
		{
			name: 'opacity',
			label: 'Glow Opacity',
			type: 'number',
			defaultValue: 0.8,
			min: 0.1,
			max: 1.0,
			step: 0.05,
			description: 'Opacity of the spotlight when active.',
		},
		{
			name: 'borderColor',
			label: 'Border Glow Color',
			type: 'string',
			defaultValue: 'rgba(99, 102, 241, 0.5)',
			description: 'Color of the illuminated border edge.',
		},
	],
	defaultProps: {
		radius: 350,
		color: 'rgba(99, 102, 241, 0.25)',
		opacity: 0.8,
		borderColor: 'rgba(99, 102, 241, 0.5)',
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'spotlight-card',
				name: 'Spotlight Card',
				slug: 'spotlight-card',
				category: 'cards',
				pascalName: 'SpotlightCard',
				snakeName: 'spotlight_card',
				description: 'Dynamic 2D spatial coordinate tracking with sub-pixel radial border illumination mask and smooth exponential smoothing.',
				defaultTailwindClass: 'relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md will-change-transform',
			},
			flavor,
			props,
			options
		);
	},
};
