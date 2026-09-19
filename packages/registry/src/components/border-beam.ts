import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const borderBeamComponent: UniversalComponent = {
	id: 'border-beam',
	name: 'Border Beam',
	slug: 'border-beam',
	category: 'cards',
	description: 'Zero-runtime CSS conic perimeter laser trace with hardware mask clipping and sub-pixel compositing.',
	version: '1.0.0',
	props: [
		{
			name: 'size',
			label: 'Beam Length (px)',
			type: 'number',
			defaultValue: 250,
			min: 100,
			max: 600,
			step: 25,
			description: 'Length/size of the perimeter laser trace.',
		},
		{
			name: 'duration',
			label: 'Duration (s)',
			type: 'number',
			defaultValue: 12,
			min: 2,
			max: 30,
			step: 1,
			description: 'Loop duration for one full border sweep.',
		},
		{
			name: 'borderWidth',
			label: 'Border Width (px)',
			type: 'number',
			defaultValue: 1.5,
			min: 1,
			max: 4,
			step: 0.5,
			description: 'Perimeter border stroke width.',
		},
		{
			name: 'colorFrom',
			label: 'Color From',
			type: 'string',
			defaultValue: '#ffaa40',
			description: 'Starting gradient color.',
		},
		{
			name: 'colorTo',
			label: 'Color To',
			type: 'string',
			defaultValue: '#9c40ff',
			description: 'Ending gradient color.',
		},
	],
	defaultProps: {
		size: 250,
		duration: 12,
		borderWidth: 1.5,
		colorFrom: '#ffaa40',
		colorTo: '#9c40ff',
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'border-beam',
				name: 'Border Beam',
				slug: 'border-beam',
				category: 'cards',
				pascalName: 'BorderBeam',
				snakeName: 'border_beam',
				description: 'Zero-runtime CSS conic perimeter laser trace with hardware mask clipping.',
				defaultTailwindClass: 'pointer-events-none absolute inset-0 rounded-[inherit]',
			},
			flavor,
			props,
			options
		);
	},
};
